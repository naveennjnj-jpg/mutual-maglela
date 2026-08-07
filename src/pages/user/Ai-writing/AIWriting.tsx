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
  CheckCircle,
  Trash2,
  Copy,
  Download,
  Clock,
  CreditCard,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

// ============================================
// ✅ TYPES - Matching Backend Response
// ============================================

interface Parameters {
  authority: number;
  clarity: number;
  academicRigor: number;
  accessibility: number;
  narrativeDepth: number;
}

interface Cost {
  usd: number;
  zar: number;
}

interface TokensUsed {
  input: number;
  output: number;
  total: number;
}

interface Metadata {
  type: string;
  tone: string;
  includeOutline: boolean;
  outline?: string;
  wordCount: number;
  tokensUsed: TokensUsed;
  fileName?: string;
  fileType?: string;
  generatedAt: string;
}

interface WritingData {
  _id: string;
  identifier: string;
  userId: string;
  contentType: string;
  title: string;
  description: string;
  content: string;
  parameters: Parameters;
  avgScore: number;
  duration: string;
  audioUrl: string | null;
  provider: string;
  aiModel: string;
  charCount: number;
  cost: Cost;
  author: string;
  adminnote: string | null;
  adminattachment: string | null;
  status: string;
  publishedAt: string | null;
  metadata: Metadata;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: WritingData[];
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  theme?: string;
  credits?: number;
  initials?: string;
}

// ============================================
// COMPONENT
// ============================================

const AIWriting = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [documents, setDocuments] = useState<WritingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showNoCreditsModal, setShowNoCreditsModal] = useState(false);
  const fetchCalled = useRef(false);

  // User state
  const [userData, setUserData] = useState<UserData>({
    id: '',
    name: 'User',
    email: 'user@email.com',
    role: 'user',
    credits: 0,
    initials: 'U'
  });

  useEffect(() => {
    if (!fetchCalled.current) {
      fetchCalled.current = true;
      fetchDocuments();
    }
  }, []);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success && response.data.data) {
          const data = response.data.data;

          // Generate initials from name
          const nameParts = data.name?.split(' ') || ['U'];
          const initials = nameParts
            .map((part: string) => part.charAt(0).toUpperCase())
            .join('')
            .slice(0, 2);

          const credits = data.credits || data.creditsBalance || 0;

          setUserData({
            id: data.id || data._id,
            name: data.name || 'User',
            email: data.email || 'user@email.com',
            role: data.role || 'user',
            avatar: data.avatar || data.profileImage,
            theme: data.theme || 'light',
            credits: credits,
            initials: initials || 'U'
          });

          // ✅ CHECK CREDITS - If 0, show modal
          if (credits === 0) {
            setShowNoCreditsModal(true);
          }

          // Apply theme if needed
          if (data.theme) {
            localStorage.setItem('theme', data.theme);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback to localStorage or default values
        const savedName = localStorage.getItem('userName') || 'User';
        const savedEmail = localStorage.getItem('userEmail') || 'user@email.com';
        const savedCredits = parseInt(localStorage.getItem('userCredits') || '0');
        const savedInitials = savedName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

        setUserData(prev => ({
          ...prev,
          name: savedName,
          email: savedEmail,
          credits: savedCredits,
          initials: savedInitials
        }));

        // ✅ CHECK CREDITS from localStorage
        if (savedCredits === 0) {
          setShowNoCreditsModal(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // ============================================
  // ✅ FETCH DOCUMENTS FROM BACKEND
  // ============================================

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
        `${API_URL}/api/auth/ai-writing`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const docsData = response.data.data || [];
        if (Array.isArray(docsData) && docsData.length > 0) {
          setDocuments(docsData);
        } else {
          setDocuments([]);
        }
      } else {
        setDocuments([]);
      }
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError(err.response?.data?.message || 'Failed to fetch documents');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // ✅ DELETE DOCUMENT
  // ============================================

  const handleDelete = async (id: string) => {
    setDeleteLoading(id);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await axios.delete(
        `${API_URL}/api/user/ai-writing/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setDocuments(documents.filter(doc => doc._id !== id));
        setSuccessMessage('Document deleted successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      console.error('Error deleting document:', err);
      setError(err.response?.data?.message || 'Failed to delete document');
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeleteLoading(null);
      setShowDeleteModal(null);
    }
  };

  // ============================================
  // ✅ GET ICON FOR DOCUMENT TYPE
  // ============================================

  const getIconForType = (type: string): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
      'policy-brief': <BookOpen className="w-4 h-4 text-[#C85A32]" />,
      'op-ed': <PenTool className="w-4 h-4 text-[#C85A32]" />,
      'press-release': <Megaphone className="w-4 h-4 text-[#C85A32]" />,
      'speech': <Sparkles className="w-4 h-4 text-[#C85A32]" />,
      'impact-report': <Heart className="w-4 h-4 text-[#C85A32]" />,
      'summary': <FileText className="w-4 h-4 text-[#C85A32]" />,
      'blog-post': <Lightbulb className="w-4 h-4 text-[#C85A32]" />,
      'media-story': <Megaphone className="w-4 h-4 text-[#C85A32]" />,
    };
    return iconMap[type] || <FileText className="w-4 h-4 text-[#C85A32]" />;
  };

  // ============================================
  // ✅ GET TYPE LABEL
  // ============================================

  const getTypeLabel = (type: string): string => {
    const labelMap: Record<string, string> = {
      'policy-brief': 'Policy Brief',
      'op-ed': 'Op-Ed',
      'press-release': 'Press Release',
      'speech': 'Speech',
      'impact-report': 'Impact Report',
      'summary': 'Summary',
      'blog-post': 'Blog Post',
      'media-story': 'Media Story',
    };
    return labelMap[type] || type;
  };

  // ============================================
  // ✅ GET TONE LABEL
  // ============================================

  const getToneLabel = (tone: string): string => {
    const labelMap: Record<string, string> = {
      'formal': 'Formal',
      'authoritative': 'Authoritative',
      'accessible': 'Accessible',
      'persuasive': 'Persuasive',
      'neutral': 'Neutral',
    };
    return labelMap[tone] || tone;
  };

  // ============================================
  // ✅ GET STATUS COLOR
  // ============================================

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'Pending':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'Published':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600';
    }
  };

  // ============================================
  // ✅ GET STATUS ICON
  // ============================================

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-3.5 h-3.5" />;
      case 'Published':
        return <CheckCircle className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  // ============================================
  // ✅ FORMAT DATE
  // ============================================

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // ============================================
  // ✅ FILTER DOCUMENTS
  // ============================================

  const getFilteredDocuments = () => {
    let filtered = documents;
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.metadata?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.identifier?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredDocuments = getFilteredDocuments();

  // ============================================
  // ✅ HANDLERS
  // ============================================

  const handleCreate = () => {
    // ✅ CHECK CREDITS BEFORE CREATING
    if (userData.credits === 0) {
      setShowNoCreditsModal(true);
      return;
    }
    navigate('/user/narrative-engine/create');
  };

  const handleView = (doc: WritingData) => {
    navigate('/user/narrative-engine/view', { state: { data: doc } });
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    setSuccessMessage('Content copied to clipboard!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleTopUp = () => {
    navigate('/user/add-credits');
  };

  // ============================================
  // ✅ NO CREDITS MODAL
  // ============================================

  const NoCreditsModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-xl font-semibold text-[#0F2D63] dark:text-white mb-2">
            No Credits Available
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            You have <span className="font-bold text-red-500">0 credits</span>. Please top up your credits to create AI Writing documents.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-6">
            <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Each AI Writing generation costs 1 credit
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowNoCreditsModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleTopUp}
              className="px-4 py-2 bg-[#C85A32] hover:bg-[#a8472a] text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Top Up Credits
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================
  // ✅ DELETE MODAL
  // ============================================

  const DeleteModal = ({ id, title }: { id: string; title: string }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="text-center">
          <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-7 h-7 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F2D63] dark:text-white mb-2">
            Delete Document
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Are you sure you want to delete <strong className="text-[#0F2D63] dark:text-white">{title}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowDeleteModal(null)}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(id)}
              disabled={deleteLoading === id}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              {deleteLoading === id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================
  // ✅ RENDER
  // ============================================

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
        {/* No Credits Modal */}
        {showNoCreditsModal && <NoCreditsModal />}

        {/* Delete Modal */}
        {showDeleteModal && (
          <DeleteModal
            id={showDeleteModal}
            title={documents.find(d => d._id === showDeleteModal)?.title || ''}
          />
        )}

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
            {/* ✅ CREDIT DISPLAY - Show credits */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Credits:
              </span>
              <span className={`text-sm font-semibold ${userData.credits === 0 ? 'text-red-500' : 'text-[#0F2D63] dark:text-white'}`}>
                {userData.credits}
              </span>
              {userData.credits === 0 && (
                <button
                  onClick={handleTopUp}
                  className="text-xs text-[#C85A32] hover:underline font-medium"
                >
                  Top Up
                </button>
              )}
            </div>
                  {/* ✅ WARNING TEXT - Show when credits less than 10 */}
      {(userData.credits ?? 0) < 10 && (
        <div className="flex items-center gap-1.5 mt-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            {userData.credits === 0 
              ? 'No credits available. Please top up to create AI Speech.' 
              : `Low credits (${userData.credits}/10). Please top up to continue.`}
          </span>
        </div>
      )}
          </div>
          <button
            onClick={handleCreate}
            disabled={(userData.credits ?? 10) <= 10}
            className={`flex items-center gap-2 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${(userData.credits ?? 10) <= 10
                ? 'bg-gray-400 cursor-not-allowed opacity-50'
                : 'bg-[#C85A32] hover:bg-[#a8472a]'
              }`}
          >
            <Plus className="w-4 h-4" />
            Create AI Writing
          </button>
        </div>

        {/* ✅ CREDIT WARNING BANNER - Show if credits are 0 */}
        {userData.credits === 0 && (
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-300 flex-1">
              <strong>No credits available.</strong> Please top up your credits to create new AI Writing documents.
            </p>
            <button
              onClick={handleTopUp}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#C85A32] hover:bg-[#a8472a] text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Top Up Now
            </button>
          </div>
        )}

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents by title, type or content…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#C85A32] bg-gray-50 dark:bg-gray-900 dark:text-white placeholder-gray-400 transition-all"
            />
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl text-sm mb-4">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ============================================ */}
        {/* ✅ RESPONSIVE SCROLLABLE DOCUMENTS TABLE */}
        {/* ============================================ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Add overflow-x-auto and a min-width container */}
          <div className="overflow-x-auto w-full">
            <div className="min-w-[900px]">
              {/* Header Row */}
              <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="col-span-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
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
                <div className="col-span-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-center">
                  Status
                </div>
                <div className="col-span-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  Created
                </div>
                <div className="col-span-1"></div>
              </div>

              {/* Data Rows */}
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc, index) => (
                  <div
                    key={doc._id}
                    className={`grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${index < filteredDocuments.length - 1 ? 'border-b border-gray-50 dark:border-gray-700/50' : ''
                      }`}
                    onClick={() => handleView(doc)}
                  >
                    {/* Title */}
                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 bg-[#FFF8F5] dark:bg-[#C85A32]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getIconForType(doc.metadata?.type || '')}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#0F2D63] dark:text-white truncate">
                          {doc.title}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                          {doc.identifier}
                        </p>
                      </div>
                    </div>

                    {/* Type */}
                    <div className="col-span-2">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-lg">
                        {getTypeLabel(doc.metadata?.type || '')}
                      </span>
                    </div>

                    {/* Tone */}
                    <div className="col-span-2 text-xs text-gray-500 dark:text-gray-400">
                      {getToneLabel(doc.metadata?.tone || 'neutral')}
                    </div>

                    {/* Word Count */}
                    <div className="col-span-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                      {doc.metadata?.wordCount || doc.charCount || 0}
                    </div>

                    {/* Status */}
                    <div className="col-span-1 flex items-center justify-center">
                      <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${getStatusColor(doc.status)} flex items-center gap-1`}>
                        {getStatusIcon(doc.status)}
                        {doc.status}
                      </span>
                    </div>

                    {/* Created Date */}
                    <div className="col-span-1 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(doc.createdAt)}
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(doc);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-[#0F2D63] dark:hover:text-[#C85A32] transition-colors"
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyContent(doc.content);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-[#0F2D63] dark:hover:text-[#C85A32] transition-colors"
                        title="Copy Content"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteModal(doc._id);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
          </div>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 px-1">
          {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'} found
        </p>
      </div>
    </div>
  );
};

export default AIWriting;