import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Upload, FileText, Trash2, Pencil, Check, X, Search, Loader2,
  AlertCircle, Database, Pin, RefreshCw, Archive, RotateCcw
} from 'lucide-react';
import axios from 'axios';

type Status = 'draft' | 'approved' | 'archived';
type Applicability = 'writing' | 'speech';

interface VaultDoc {
  id: string;
  title: string;
  fileName: string;
  size: number;
  wordCount: number;
  preview: string;
  category: string;
  applicability: Applicability;
  optionalNote?: string;
  status: Status;
  version: number;
  alwaysUse: boolean;
  createdAt: string;
}

const MAX_ALWAYS = 3;
const ALLOWED_EXT = ['.pdf'] as const;
const ALLOWED_MIME = ['application/pdf'] as const;
const ACCEPT_ATTR = '.pdf,application/pdf';
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

interface CategoryDef {
  value: string;
  label: string;
  appliesTo: Applicability;
}

const WRITING_CATEGORIES: CategoryDef[] = [
  { value: 'policy-brief', label: 'Policy Brief', appliesTo: 'writing' },
  { value: 'op-ed', label: 'Op-Ed', appliesTo: 'writing' },
  { value: 'impact-report', label: 'Impact Report', appliesTo: 'writing' },
  { value: 'speech', label: 'Speech', appliesTo: 'writing' },
  { value: 'press-release', label: 'Press Release', appliesTo: 'writing' },
  { value: 'summary', label: 'Summary', appliesTo: 'writing' },
  { value: 'news-article', label: 'News Article', appliesTo: 'writing' },
  { value: 'blog-post', label: 'Blog Post', appliesTo: 'writing' },
];

const SPEECH_CATEGORIES: CategoryDef[] = [
  { value: 'authority', label: 'Authority', appliesTo: 'speech' },
  { value: 'clarity', label: 'Clarity', appliesTo: 'speech' },
  { value: 'academic-rigor', label: 'Academic Rigor', appliesTo: 'speech' },
  { value: 'accessibility', label: 'Accessibility', appliesTo: 'speech' },
  { value: 'narrative-depth', label: 'Narrative Depth', appliesTo: 'speech' },
];

const ALL_CATEGORIES = [...WRITING_CATEGORIES, ...SPEECH_CATEGORIES];

const categoriesFor = (app: Applicability): CategoryDef[] =>
  app === 'speech' ? SPEECH_CATEGORIES : WRITING_CATEGORIES;

const defaultCategoryFor = (app: Applicability): string =>
  categoriesFor(app)[0]?.value ?? '';

const APPLICABILITY: { value: Applicability; label: string }[] = [
  { value: 'writing', label: 'AI Writing' },
  { value: 'speech', label: 'AI Speech' },
];

const STATUS_FILTERS: { value: 'all' | Status; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'approved', label: 'Approved' },
  { value: 'archived', label: 'Archived' },
];

const statusStyle: Record<Status, string> = {
  draft: 'text-amber-700 bg-amber-50 border-amber-200',
  approved: 'text-green-700 bg-green-50 border-green-200',
  archived: 'text-gray-500 bg-gray-100 border-gray-200',
};

const catLabel = (v: string) => ALL_CATEGORIES.find((c) => c.value === v)?.label || v || 'Uncategorised';
const appLabel = (v: string) => APPLICABILITY.find((a) => a.value === v)?.label || v;
const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const validateFile = (file: File): string | null => {
  const name = file.name.toLowerCase();
  const ext = name.substring(name.lastIndexOf('.'));
  const extOk = (ALLOWED_EXT as readonly string[]).includes(ext);
  const mimeOk = !file.type || (ALLOWED_MIME as readonly string[]).includes(file.type);
  if (!extOk || !mimeOk) return 'only PDF files are allowed';
  if (file.size > MAX_SIZE_BYTES) return 'file must be smaller than 10MB';
  return null;
};

const selectClass =
  'text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#C85A32]';

const AdminDataVault = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const BASE = `${API_URL}/api/admin/vault/documents`;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replaceTargetRef = useRef<string | null>(null);

  const [docs, setDocs] = useState<VaultDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Status>('all');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [uploadCategory, setUploadCategory] = useState(defaultCategoryFor('writing'));
  const [uploadApplicability, setUploadApplicability] = useState<Applicability>('writing');
  const [uploadNote, setUploadNote] = useState('');
  const [approveOnUpload, setApproveOnUpload] = useState(true);
  const [alwaysOnUpload, setAlwaysOnUpload] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editApplicability, setEditApplicability] = useState<Applicability>('writing');
  const [editNote, setEditNote] = useState('');

  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });
  const alwaysCount = docs.filter((d) => d.alwaysUse && d.status === 'approved').length;

  useEffect(() => {
    const valid = categoriesFor(uploadApplicability).map((c) => c.value);
    if (!valid.includes(uploadCategory)) {
      setUploadCategory(defaultCategoryFor(uploadApplicability));
    }
  }, [uploadApplicability]);

  const loadDocs = useCallback(async (term: string) => {
    try {
      const res = await axios.get(BASE, { headers: authHeaders(), params: { search: term || undefined } });
      setDocs(res.data?.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, [BASE]);

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
    let alwaysLeft = MAX_ALWAYS - alwaysCount;
    const errors: string[] = [];
    const note = uploadNote.trim();

    for (const file of list) {
      const bad = validateFile(file);
      if (bad) {
        errors.push(`${file.name}: ${bad}`);
        continue;
      }
      try {
        const markAlways = approveOnUpload && alwaysOnUpload && alwaysLeft > 0;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', uploadCategory);
        formData.append('applicability', uploadApplicability);
        formData.append('approve', String(approveOnUpload));
        formData.append('alwaysUse', String(markAlways));
        if (note) formData.append('optionalNote', note);
        await axios.post(BASE, formData, { headers: authHeaders(), timeout: 120000 });
        if (markAlways) alwaysLeft--;
        added++;
      } catch (err: any) {
        errors.push(`${file.name}: ${err.response?.data?.message || 'upload failed'}`);
      }
    }

    if (added > 0) {
      setSuccess(
        approveOnUpload
          ? `${added} document${added > 1 ? 's' : ''} added and approved.`
          : `${added} document${added > 1 ? 's' : ''} added as draft. Approve ${added > 1 ? 'them' : 'it'} to make ${added > 1 ? 'them' : 'it'} active.`
      );
      setUploadNote('');
    }
    if (errors.length > 0) setError(errors.join(' • '));
    if (fileInputRef.current) fileInputRef.current.value = '';

    setUploading(false);
    loadDocs(search);
  };

  const patchDoc = async (id: string, body: Record<string, any>, okMsg?: string) => {
    setBusyId(id);
    setError(null);
    setSuccess(null);
    try {
      await axios.patch(`${BASE}/${id}`, body, { headers: authHeaders() });
      if (okMsg) setSuccess(okMsg);
      await loadDocs(search);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update document');
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const startEdit = (doc: VaultDoc) => {
    setEditingId(doc.id);
    setEditTitle(doc.title);
    const app: Applicability = doc.applicability === 'speech' ? 'speech' : 'writing';
    setEditApplicability(app);
    const valid = categoriesFor(app).map((c) => c.value);
    setEditCategory(valid.includes(doc.category) ? doc.category : defaultCategoryFor(app));
    setEditNote(doc.optionalNote || '');
  };

  const saveEdit = async (id: string) => {
    const title = editTitle.trim();
    if (!title) {
      setEditingId(null);
      return;
    }
    const ok = await patchDoc(
      id,
      { title, category: editCategory, applicability: editApplicability, optionalNote: editNote.trim() },
      'Document updated.'
    );
    if (ok) setEditingId(null);
  };

  const handleReplaceFile = async (file?: File | null) => {
    const id = replaceTargetRef.current;
    if (replaceInputRef.current) replaceInputRef.current.value = '';
    if (!file || !id) return;
    const bad = validateFile(file);
    if (bad) {
      setError(`${file.name}: ${bad}`);
      replaceTargetRef.current = null;
      return;
    }
    setBusyId(id);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post(`${BASE}/${id}/replace`, formData, { headers: authHeaders(), timeout: 120000 });
      setSuccess(res.data?.message || 'New version uploaded as draft.');
      await loadDocs(search);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload new version');
    } finally {
      setBusyId(null);
      replaceTargetRef.current = null;
    }
  };

  const deleteDoc = async (id: string) => {
    setBusyId(id);
    setError(null);
    try {
      await axios.delete(`${BASE}/${id}`, { headers: authHeaders() });
      setDocs((prev) => prev.filter((d) => d.id !== id));
      setConfirmDeleteId(null);
      setSuccess('Document deleted.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete document');
    } finally {
      setBusyId(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  };

  const visible = docs.filter((d) => statusFilter === 'all' || d.status === statusFilter);
  const iconBtn =
    'w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#C85A32] hover:bg-[#C85A32]/10 transition-colors disabled:opacity-50';

  const renderCategoryOptions = (app: Applicability) =>
    categoriesFor(app).map((c) => <option key={c.value} value={c.value}>{c.label}</option>);

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-3 sm:p-6">
      <div className="max-w-[900px] mx-auto">

        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-[#0F2D63] dark:hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <div className="min-w-0">
            <p className="text-[#C85A32] text-[10px] sm:text-xs font-semibold uppercase tracking-widest">Admin · AI Tools</p>
            <h1 className="text-lg sm:text-xl font-['Roboto'] font-bold text-[#0F2D63] dark:text-white truncate">Magalela Data Vault</h1>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-5">
          This is Magalela&rsquo;s central knowledge base for AI Writing and AI Speech. Clients cannot see or change these files.
          Only <strong>approved</strong> documents are used, and only for the feature they apply to. They guide style, structure and
          approach, never the facts of a client&rsquo;s document. Up to {MAX_ALWAYS} approved documents can be marked
          <strong> Always apply</strong>. Uploading a new version archives the old one once the new one is approved.
        </p>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="flex-1 min-w-0 break-words">{error}</span>
            <button onClick={() => setError(null)} className="shrink-0"><X className="w-4 h-4 opacity-60 hover:opacity-100" /></button>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm mb-4">
            <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="flex-1 min-w-0 break-words">{success}</span>
            <button onClick={() => setSuccess(null)} className="shrink-0"><X className="w-4 h-4 opacity-60 hover:opacity-100" /></button>
          </div>
        )}

        {/* ─── Upload Card ─── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 sm:p-5 mb-4">
          {/* 🔥 Step 1: Used in — big segmented buttons */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Where should this document be used?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {APPLICABILITY.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => setUploadApplicability(a.value as Applicability)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                    uploadApplicability === a.value
                      ? "bg-[#0F2D63] text-white border-[#0F2D63] shadow-sm"
                      : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#0F2D63]/40"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* 🔥 Step 2: Category — full width dropdown */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Category
            </label>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#C85A32]"
            >
              {renderCategoryOptions(uploadApplicability)}
            </select>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
              Showing{" "}
              <span className="font-semibold text-[#C85A32]">
                {uploadApplicability === "speech" ? "AI Speech" : "AI Writing"}
              </span>{" "}
              categories
            </p>
          </div>

          {/* Step 3: Optional note */}
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Optional note / instruction
            <span className="text-gray-400 font-normal ml-1">(optional)</span>
          </label>
          <textarea
            value={uploadNote}
            onChange={(e) => setUploadNote(e.target.value)}
            rows={2}
            maxLength={500}
            placeholder="e.g. Apply only to formal policy briefs. Prefer third-person, evidence-led tone."
            className="w-full text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-[#C85A32] resize-y mb-4"
          />

          {/* Upload area */}
          <button
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 p-4 sm:p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#C85A32] hover:bg-[#FFF8F5] dark:hover:bg-[#C85A32]/5 transition-all group disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 text-[#C85A32] animate-spin shrink-0" />
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">Uploading and reading your documents…</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#C85A32] transition-colors shrink-0" />
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 group-hover:text-[#C85A32] transition-colors text-center">
                  <span className="sm:hidden">Tap to upload PDF (max 10MB each)</span>
                  <span className="hidden sm:inline">Click to upload or drag and drop (PDF only – max 10MB each)</span>
                </span>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPT_ATTR}
            className="hidden"
            onChange={(e) => e.target.files && uploadFiles(e.target.files)}
          />
          <input
            ref={replaceInputRef}
            type="file"
            accept={ACCEPT_ATTR}
            className="hidden"
            onChange={(e) => handleReplaceFile(e.target.files?.[0])}
          />

          {/* Checkboxes */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2 mt-3">
            <label className="flex items-start sm:items-center gap-2 text-xs text-gray-600 dark:text-gray-300 cursor-pointer">
              <input type="checkbox" checked={approveOnUpload} onChange={(e) => setApproveOnUpload(e.target.checked)} className="accent-[#C85A32] mt-0.5 sm:mt-0 shrink-0" />
              <span>Approve immediately (otherwise saved as draft)</span>
            </label>
            <label className="flex items-start sm:items-center gap-2 text-xs text-gray-600 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={alwaysOnUpload}
                onChange={(e) => setAlwaysOnUpload(e.target.checked)}
                disabled={!approveOnUpload || alwaysCount >= MAX_ALWAYS}
                className="accent-[#C85A32] mt-0.5 sm:mt-0 shrink-0"
              />
              <span>Set to &ldquo;Always apply&rdquo; ({alwaysCount}/{MAX_ALWAYS} used)</span>
            </label>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents…"
              className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:border-[#C85A32] bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 transition-all"
            />
          </div>
          <div className="flex gap-1 bg-[#f4f6fb] dark:bg-gray-700 rounded-xl p-1 overflow-x-auto [scrollbar-width:none]">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap flex-1 sm:flex-none ${
                  statusFilter === f.value ? 'bg-white dark:bg-gray-600 text-[#0F2D63] dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Doc list — same as before */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-[#C85A32] animate-spin" />
          </div>
        ) : visible.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-10 text-center">
            <Database className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-[#0F2D63] dark:text-white">
              {search || statusFilter !== 'all' ? 'No documents match your filters' : 'The Data Vault is empty'}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {search || statusFilter !== 'all' ? 'Try a different search or status.' : 'Upload Magalela documents above.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {visible.map((doc) => {
              const busy = busyId === doc.id;
              return (
                <div
                  key={doc.id}
                  className={`bg-white dark:bg-gray-800 rounded-2xl border shadow-sm p-3 sm:p-4 ${
                    doc.alwaysUse && doc.status === 'approved' ? 'border-[#C85A32]/40' : 'border-gray-100 dark:border-gray-700'
                  } ${doc.status === 'archived' ? 'opacity-70' : ''}`}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#C85A32]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#C85A32]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {editingId === doc.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(doc.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            autoFocus
                            className="w-full text-sm border-b-2 border-[#C85A32] bg-transparent text-[#0F2D63] dark:text-white focus:outline-none pb-0.5"
                          />
                          <div className="flex flex-wrap gap-2 items-center">
                            <select
                              value={editApplicability}
                              onChange={(e) => {
                                const next = e.target.value as Applicability;
                                setEditApplicability(next);
                                const valid = categoriesFor(next).map((c) => c.value);
                                if (!valid.includes(editCategory)) {
                                  setEditCategory(defaultCategoryFor(next));
                                }
                              }}
                              className={`${selectClass} flex-1 sm:flex-none min-w-0`}
                            >
                              {APPLICABILITY.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                            </select>
                            <select
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value)}
                              className={`${selectClass} flex-1 sm:flex-none min-w-0`}
                            >
                              {renderCategoryOptions(editApplicability)}
                            </select>
                            <button onClick={() => saveEdit(doc.id)} className="text-green-600 hover:text-green-700 shrink-0"><Check className="w-4 h-4" /></button>
                            <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 shrink-0"><X className="w-4 h-4" /></button>
                          </div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400">
                            <span className="mb-1 block">Optional note / instruction <span className="text-gray-400 font-normal">(optional)</span></span>
                            <textarea
                              value={editNote}
                              onChange={(e) => setEditNote(e.target.value)}
                              rows={2}
                              maxLength={500}
                              placeholder="e.g. Apply only to formal policy briefs."
                              className="w-full text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-[#C85A32] resize-y"
                            />
                          </label>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <p className="text-sm font-semibold text-[#0F2D63] dark:text-white truncate max-w-full">{doc.title}</p>
                            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">v{doc.version}</span>
                           <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full ${
  statusStyle[doc.status]
}`}>
  {doc.status === 'approved' ? 'Uploaded' : doc.status === 'draft' ? 'Uploaded' : 'Archived'}
</span>
                            {doc.alwaysUse && doc.status === 'approved' && (
                              <span className="flex items-center gap-1 text-[10px] font-semibold text-[#C85A32] bg-[#FFF8F5] dark:bg-[#C85A32]/10 border border-[#C85A32]/30 px-2 py-0.5 rounded-full">
                                <Pin className="w-3 h-3" />
                                Always applied
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#0F2D63]/70 dark:text-gray-300 mt-1">
                            {catLabel(doc.category)} · {appLabel(doc.applicability)}
                          </p>
                        </>
                      )}
                      <p className="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 mt-0.5 break-words">
                        {doc.fileName} · {formatSize(doc.size)} · {doc.wordCount.toLocaleString()} words ·{' '}
                        {new Date(doc.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      {doc.optionalNote && (
                        <p className="text-xs text-[#0F2D63]/80 dark:text-gray-300 mt-1 italic break-words">
                          <span className="font-semibold not-italic">Note:</span> {doc.optionalNote}
                        </p>
                      )}
                      {doc.preview && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">{doc.preview}</p>
                      )}
                    </div>

                    <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
                      {confirmDeleteId === doc.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Delete?</span>
                          <button
                            onClick={() => deleteDoc(doc.id)}
                            disabled={busy}
                            className="text-xs px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50"
                          >
                            {busy ? '...' : 'Yes'}
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
                          {busy && <Loader2 className="w-4 h-4 text-[#C85A32] animate-spin mr-1" />}

                          {doc.status === 'draft' && (
                            <button
                              onClick={() => patchDoc(doc.id, { status: 'approved' }, 'Document approved. It is now active.')}
                              disabled={busy}
                              title="Approve"
                              className="text-xs px-2.5 py-1 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-lg disabled:opacity-50"
                            >
                              Approve
                            </button>
                          )}
                          {doc.status === 'approved' && (
                            <>
                              <button
                                onClick={() => patchDoc(doc.id, { alwaysUse: !doc.alwaysUse })}
                                disabled={busy}
                                title={doc.alwaysUse ? 'Stop applying to every generation' : 'Always apply'}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-50 ${
                                  doc.alwaysUse ? 'text-[#C85A32] bg-[#C85A32]/10' : 'text-gray-400 hover:text-[#C85A32] hover:bg-[#C85A32]/10'
                                }`}
                              >
                                <Pin className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => patchDoc(doc.id, { status: 'archived' }, 'Document archived. It is no longer used.')}
                                disabled={busy}
                                title="Archive"
                                className={iconBtn}
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {doc.status === 'archived' && (
                            <button
                              onClick={() => patchDoc(doc.id, { status: 'draft' }, 'Document restored as draft.')}
                              disabled={busy}
                              title="Restore as draft"
                              className={iconBtn}
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}
                          {doc.status !== 'archived' && (
                            <button
                              onClick={() => {
                                replaceTargetRef.current = doc.id;
                                replaceInputRef.current?.click();
                              }}
                              disabled={busy}
                              title="Upload a new version"
                              className={iconBtn}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => startEdit(doc)} title="Edit details" className={iconBtn}>
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

                  <div className="sm:hidden flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    {confirmDeleteId === doc.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-1">Delete this document?</span>
                        <button
                          onClick={() => deleteDoc(doc.id)}
                          disabled={busy}
                          className="text-xs px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50"
                        >
                          {busy ? '...' : 'Yes'}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs px-3 py-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <>
                        {busy && <Loader2 className="w-4 h-4 text-[#C85A32] animate-spin" />}

                        {doc.status === 'draft' && (
                          <button
                            onClick={() => patchDoc(doc.id, { status: 'approved' }, 'Document approved. It is now active.')}
                            disabled={busy}
                            className="text-xs px-3 py-1.5 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-lg disabled:opacity-50"
                          >
                            Approve
                          </button>
                        )}
                        {doc.status === 'approved' && (
                          <>
                            <button
                              onClick={() => patchDoc(doc.id, { alwaysUse: !doc.alwaysUse })}
                              disabled={busy}
                              className={`h-8 px-2.5 flex items-center gap-1 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                                doc.alwaysUse ? 'text-[#C85A32] bg-[#C85A32]/10' : 'text-gray-500 bg-gray-100'
                              }`}
                            >
                              <Pin className="w-3.5 h-3.5" />
                              {doc.alwaysUse ? 'Pinned' : 'Pin'}
                            </button>
                            <button
                              onClick={() => patchDoc(doc.id, { status: 'archived' }, 'Document archived. It is no longer used.')}
                              disabled={busy}
                              className="h-8 px-2.5 flex items-center gap-1 rounded-lg text-xs font-semibold text-gray-500 bg-gray-100 disabled:opacity-50"
                            >
                              <Archive className="w-3.5 h-3.5" />
                              Archive
                            </button>
                          </>
                        )}
                        {doc.status === 'archived' && (
                          <button
                            onClick={() => patchDoc(doc.id, { status: 'draft' }, 'Document restored as draft.')}
                            disabled={busy}
                            className="h-8 px-2.5 flex items-center gap-1 rounded-lg text-xs font-semibold text-gray-500 bg-gray-100 disabled:opacity-50"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Restore
                          </button>
                        )}
                        {doc.status !== 'archived' && (
                          <button
                            onClick={() => {
                              replaceTargetRef.current = doc.id;
                              replaceInputRef.current?.click();
                            }}
                            disabled={busy}
                            className={iconBtn}
                            title="Upload a new version"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => startEdit(doc)} className={iconBtn} title="Edit details">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(doc.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-auto"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDataVault;