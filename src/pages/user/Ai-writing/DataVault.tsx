
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  FileText,
  Trash2,
  Pencil,
  Check,
  X,
  Search,
  Loader2,
  AlertCircle,
  Database
} from 'lucide-react';
import axios from 'axios';

interface VaultDoc {
  id: string;
  title: string;
  fileName: string;
  size: number;
  wordCount: number;
  preview: string;
  tags: string[];
  createdAt: string;
}

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const DataVault = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [docs, setDocs] = useState<VaultDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

  const loadDocs = useCallback(async (term: string) => {
    try {
      const res = await axios.get(`${API_URL}/api/vault/documents`, {
        headers: authHeaders(),
        params: { kind: 'source', search: term || undefined },
      });
      setDocs(res.data?.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load your documents');
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // load on mount + search with a short delay while typing
  useEffect(() => {
    const t = setTimeout(() => loadDocs(search), 300);
    return () => clearTimeout(t);
  }, [search, loadDocs]);

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;

    setError(null);
    setSuccess(null);
    setUploading(true);

    let added = 0;
    const errors: string[] = [];

    for (const file of list) {
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!['.pdf', '.docx', '.doc', '.txt'].includes(ext)) {
        errors.push(`${file.name}: only PDF, DOCX, DOC or TXT files are allowed`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name}: file must be smaller than 10MB`);
        continue;
      }
      try {
        const formData = new FormData();
        formData.append('file', file);
        await axios.post(`${API_URL}/api/vault/documents`, formData, { headers: authHeaders(), timeout: 120000 });
        added++;
      } catch (err: any) {
        errors.push(`${file.name}: ${err.response?.data?.message || 'upload failed'}`);
      }
    }

    if (added > 0) setSuccess(`${added} document${added > 1 ? 's' : ''} saved to your Data Vault.`);
    if (errors.length > 0) setError(errors.join(' • '));
    if (fileInputRef.current) fileInputRef.current.value = '';

    setUploading(false);
    loadDocs(search);
  };

  const startRename = (doc: VaultDoc) => {
    setEditingId(doc.id);
    setEditTitle(doc.title);
  };

  const saveRename = async (id: string) => {
    const title = editTitle.trim();
    if (!title) {
      setEditingId(null);
      return;
    }
    try {
      await axios.patch(`${API_URL}/api/vault/documents/${id}`, { title }, { headers: authHeaders() });
      setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, title } : d)));
      setEditingId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to rename document');
    }
  };

  const deleteDoc = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await axios.delete(`${API_URL}/api/vault/documents/${id}`, { headers: authHeaders() });
      setDocs((prev) => prev.filter((d) => d.id !== id));
      setConfirmDeleteId(null);
      setSuccess('Document deleted.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete document');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6">
      <div className="max-w-[820px] mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/user/narrative-engine')}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#0F2D63] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <div>
            <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest">AI Tools</p>
            <h1 className="text-xl font-['Roboto'] font-bold text-[#0F2D63] dark:text-white">Data Vault</h1>
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Upload your documents once and reuse them as source material in any AI generation, without uploading them again.
        </p>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)}><X className="w-4 h-4 opacity-60 hover:opacity-100" /></button>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl text-sm mb-4">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{success}</span>
            <button onClick={() => setSuccess(null)}><X className="w-4 h-4 opacity-60 hover:opacity-100" /></button>
          </div>
        )}

        {/* Upload */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 mb-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#C85A32] hover:bg-[#FFF8F5] dark:hover:bg-[#C85A32]/5 transition-all group disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 text-[#C85A32] animate-spin" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Uploading and reading your documents…</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#C85A32] transition-colors" />
                <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-[#C85A32] transition-colors">
                  Click to upload or drag and drop (PDF, DOCX, DOC, TXT – max 10MB each)
                </span>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.doc,.txt"
            className="hidden"
            onChange={(e) => e.target.files && uploadFiles(e.target.files)}
          />
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your documents…"
            className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:border-[#C85A32] bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 transition-all"
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-[#C85A32] animate-spin" />
          </div>
        ) : docs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-10 text-center">
            <Database className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-[#0F2D63] dark:text-white">
              {search ? 'No documents match your search' : 'Your Data Vault is empty'}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {search ? 'Try a different name.' : 'Upload a document above to start building your library.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#C85A32]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-[#C85A32]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {editingId === doc.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveRename(doc.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          autoFocus
                          className="flex-1 text-sm border-b-2 border-[#C85A32] bg-transparent text-[#0F2D63] dark:text-white focus:outline-none pb-0.5"
                        />
                        <button onClick={() => saveRename(doc.id)} className="text-green-600 hover:text-green-700">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-[#0F2D63] dark:text-white truncate">{doc.title}</p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {doc.fileName} · {formatSize(doc.size)} · {doc.wordCount.toLocaleString()} words ·{' '}
                      {new Date(doc.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    {doc.preview && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">{doc.preview}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {confirmDeleteId === doc.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Delete?</span>
                        <button
                          onClick={() => deleteDoc(doc.id)}
                          disabled={deletingId === doc.id}
                          className="text-xs px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50"
                        >
                          {deletingId === doc.id ? '...' : 'Yes'}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs px-2.5 py-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => startRename(doc)}
                          title="Rename"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#C85A32] hover:bg-[#C85A32]/10 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(doc.id)}
                          title="Delete"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-amber-500 text-base flex-shrink-0 mt-0.5">⚠️</span>
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            Documents are private to your account. Select them as source material when you create AI Writing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataVault;
