// pages/user/AIWriting.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Eye, 
  MoreVertical,
  Megaphone,
  Lightbulb,
  PenTool,
  BookOpen,
  Heart,
  Calendar,
  Loader2,
  AlertCircle,
  FileText,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import CreateAIWriting from '../Ai-writing/CreateAIWriting';

interface Document {
  id: number | string;
  title: string;
  type: string;
  tone: string;
  wordCount: number;
  created: string;
  icon: React.ReactNode;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

const AIWriting = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // State
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchCalled = useRef(false);

  // Fetch documents
  useEffect(() => {
    if (!fetchCalled.current) {
      fetchCalled.current = true;
      fetchDocuments();
    }
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.get<ApiResponse>(
        `${API_URL}/api/ai-writing`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const docsData = response.data.data?.documents || response.data.data || [];
        if (Array.isArray(docsData) && docsData.length > 0) {
          // Map API data to Document interface
          const mappedDocs = docsData.map((doc: any) => ({
            id: doc.id || doc._id || Math.random().toString(),
            title: doc.title || 'Untitled',
            type: doc.type || 'General',
            tone: doc.tone || 'Professional',
            wordCount: doc.wordCount || doc.word_count || 0,
            created: doc.created ? new Date(doc.created).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
            icon: getIconForType(doc.type || 'General')
          }));
          setDocuments(mappedDocs);
        } else {
          setDocuments(getMockDocuments());
        }
      } else {
        setDocuments(getMockDocuments());
      }
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setDocuments(getMockDocuments());
    } finally {
      setLoading(false);
    }
  };

  // Get icon based on document type
  const getIconForType = (type: string): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
      'Press Release': <Megaphone className="w-4 h-4 text-[#C85A32]" />,
      'Thought Leadership': <Lightbulb className="w-4 h-4 text-[#C85A32]" />,
      'Op-Ed': <PenTool className="w-4 h-4 text-[#C85A32]" />,
      'Policy Brief': <BookOpen className="w-4 h-4 text-[#C85A32]" />,
      'Impact Story': <Heart className="w-4 h-4 text-[#C85A32]" />,
    };
    return iconMap[type] || <FileText className="w-4 h-4 text-[#C85A32]" />;
  };

  // Mock data
  const getMockDocuments = (): Document[] => {
    return [
      {
        id: 1,
        title: "Wits Partnership Press Release",
        type: "Press Release",
        tone: "Clear & Authoritative",
        wordCount: 312,
        created: "12 Jun 2026",
        icon: <Megaphone className="w-4 h-4 text-[#C85A32]" />
      },
      {
        id: 2,
        title: "Q2 Stakeholder Newsletter",
        type: "Thought Leadership",
        tone: "Inspiring",
        wordCount: 580,
        created: "08 Jun 2026",
        icon: <Lightbulb className="w-4 h-4 text-[#C85A32]" />
      },
      {
        id: 3,
        title: "VC Inaugural Address",
        type: "Op-Ed",
        tone: "Formal",
        wordCount: 920,
        created: "30 May 2026",
        icon: <PenTool className="w-4 h-4 text-[#C85A32]" />
      },
      {
        id: 4,
        title: "Research Impact Op-Ed",
        type: "Policy Brief",
        tone: "Conversational",
        wordCount: 740,
        created: "22 May 2026",
        icon: <BookOpen className="w-4 h-4 text-[#C85A32]" />
      },
      {
        id: 5,
        title: "Annual Report Executive Summary",
        type: "Impact Story",
        tone: "Inspiring",
        wordCount: 450,
        created: "14 May 2026",
        icon: <Heart className="w-4 h-4 text-[#C85A32]" />
      }
    ];
  };

  // Filter documents based on search
  const getFilteredDocuments = () => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredDocuments = getFilteredDocuments();

  // Handle view document
  const handleView = (id: number | string) => {
    console.log('View document:', id);
    // Navigate to document view or open modal
  };

  // Handle menu click
  const handleMenuClick = (id: number | string) => {
    console.log('Menu clicked for:', id);
    // Open dropdown menu
  };

  // Handle create new - navigate to create page
  const handleCreate = () => {
    navigate('/user/narrative-engine/create');
  };

  // Handle modal success (if using modal)
  const handleModalSuccess = () => {
    setSuccessMessage('Document generated successfully!');
    fetchDocuments();
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6">
      <div className="max-w-[1500px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-1">
              AI Tools
            </p>
            <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63] dark:text-white">
              AI Writing
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Generate and manage institutional communication narratives
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create AI Writing
          </button>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents by title or type…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#C85A32] bg-gray-50 dark:bg-gray-900 dark:text-white placeholder-gray-400 transition-all"
            />
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl text-sm mb-4">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Documents Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="col-span-5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Document
            </div>
            <div className="col-span-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Type
            </div>
            <div className="col-span-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Tone
            </div>
            <div className="col-span-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-right">
              Words
            </div>
            <div className="col-span-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Created
            </div>
            <div className="col-span-1"></div>
          </div>

          {/* Document Rows */}
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc, index) => (
              <div
                key={doc.id}
                className={`grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative ${
                  index < filteredDocuments.length - 1 ? 'border-b border-gray-50 dark:border-gray-700/50' : ''
                }`}
              >
                {/* Title */}
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-[#FFF8F5] dark:bg-[#C85A32]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    {doc.icon}
                  </div>
                  <button
                    onClick={() => handleView(doc.id)}
                    className="text-sm font-medium text-[#0F2D63] dark:text-white hover:text-[#C85A32] dark:hover:text-[#C85A32] truncate text-left transition-colors"
                  >
                    {doc.title}
                  </button>
                </div>

                {/* Type */}
                <div className="col-span-2">
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-lg">
                    {doc.type}
                  </span>
                </div>

                {/* Tone */}
                <div className="col-span-2 text-xs text-gray-500 dark:text-gray-400">
                  {doc.tone}
                </div>

                {/* Word Count */}
                <div className="col-span-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                  {doc.wordCount}
                </div>

                {/* Created Date */}
                <div className="col-span-1 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {doc.created}
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-end gap-1 relative">
                  <button
                    onClick={() => handleView(doc.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-[#0F2D63] dark:hover:text-[#C85A32] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMenuClick(doc.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 transition-colors"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F2D63] dark:text-white mb-2">
                No documents found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm ? `No documents match "${searchTerm}"` : 'Create your first AI Writing document'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#C85A32] text-white text-sm font-semibold rounded-xl hover:bg-[#a8472a] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create AI Writing
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 px-1">
          {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'}
        </p>
      </div>

      {/* Create AI Writing Modal - Commented out since we're using page navigation */}
      {/* <CreateAIWriting
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleModalSuccess}
      /> */}
    </div>
  );
};

export default AIWriting;