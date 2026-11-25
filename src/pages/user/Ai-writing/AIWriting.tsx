import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Eye,
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
  Clock,
  CreditCard,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

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
  creditsBlocked?: boolean;
  creditsBlockedReason?: string | null;
}

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

  const [userData, setUserData] = useState<UserData>({
    id: '',
    name: 'User',
    email: 'user@email.com',
    role: 'user',
    credits: 0,
    initials: 'U',
    creditsBlocked: false,
    creditsBlockedReason: null
  });

  useEffect(() => {
    if (!fetchCalled.current) {
      fetchCalled.current = true;
      fetchDocuments();
    }
  }, []);

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
            initials: initials || 'U',
            creditsBlocked: data.creditsBlocked === true,
            creditsBlockedReason: data.creditsBlockedReason || null,
          });

          if (credits === 0 && !data.creditsBlocked) {
            setShowNoCreditsModal(true);
          }

          if (data.theme) {
            localStorage.setItem('theme', data.theme);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);

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

        if (savedCredits === 0) {
          setShowNoCreditsModal(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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

  const getTypeLabel = (type: string): string => {
    const labelMap: Record<string, string> = {
      'policy-brief': 'Policy Brief',
      'op-ed': 'Op-Ed',
      'press-release': 'Press Release',
      'speech': 'Speech',
      'impact-report': 'Impact Report',
      'summary': 'Summary',
      'blog-post': 'Blog Post',
      'media-story': 'News Article',
    };
    return labelMap[type] || type || 'Document';
  };

  const getToneLabel = (tone: string): string => {
    const labelMap: Record<string, string> = {
      'formal': 'Formal',
      'authoritative': 'Authoritative',
      'accessible': 'Accessible',
      'persuasive': 'Persuasive',
      'neutral': 'Neutral',
    };
    return labelMap[tone] || tone || 'Neutral';
  };

  const getStatusMeta = (status: string) => {
    const normalized = (status || 'Pending').trim().toLowerCase();

    switch (normalized) {
      case 'approved':
        return {
          label: 'Approved',
          className:
            'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-700',
          icon: <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-700 dark:text-emerald-300" />,
        };
      case 'pending':
        return {
          label: 'Pending',
          className:
            'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-700',
          icon: <Clock className="w-3.5 h-3.5 shrink-0 text-amber-800 dark:text-amber-300" />,
        };
      case 'rejected':
        return {
          label: 'Rejected',
          className:
            'bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-700',
          icon: <XCircle className="w-3.5 h-3.5 shrink-0 text-rose-700 dark:text-rose-300" />,
        };
      case 'published':
        return {
          label: 'Published',
          className:
            'bg-blue-100 text-blue-950 border-blue-300 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-700',
          icon: <CheckCircle className="w-3.5 h-3.5 shrink-0 text-blue-700 dark:text-blue-300" />,
        };
      default:
        return {
          label: status || 'Draft',
          className:
            'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600',
          icon: <Clock className="w-3.5 h-3.5 shrink-0 text-slate-700 dark:text-slate-300" />,
        };
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

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

  const handleCreate = () => {
    if (userData.creditsBlocked) {
      setError(
        userData.creditsBlockedReason
          ? `Credits blocked by admin: ${userData.creditsBlockedReason}`
          : 'Your credits are blocked by the admin. Please contact support.'
      );
      setTimeout(() => setError(null), 4000);
      return;
    }
    if ((userData.credits ?? 0) <= 0) {
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

  const NoCreditsModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-700 dark:text-amber-400" />
          </div>
          <h3 className="text-xl font-semibold text-[#0F2D63] dark:text-white mb-2">
            No Credits Available
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            You have <span className="font-bold text-red-600 dark:text-red-400">0 credits</span>. Please top up your credits to create AI Writing documents.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-800 rounded-xl p-3 mb-6">
            <p className="text-xs text-amber-900 dark:text-amber-200 flex items-center justify-center gap-2 font-medium">
              <CreditCard className="w-4 h-4 shrink-0" />
              Each AI Writing generation costs 1 credit
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowNoCreditsModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
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
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Are you sure you want to delete <strong className="text-[#0F2D63] dark:text-white">{title}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowDeleteModal(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-[1500px] mx-auto">
        {showNoCreditsModal && <NoCreditsModal />}

        {showDeleteModal && (
          <DeleteModal
            id={showDeleteModal}
            title={documents.find(d => d._id === showDeleteModal)?.title || ''}
          />
        )}

  
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div className="min-w-0">
            <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-1">
              AI Tools
            </p>
            <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63] dark:text-white">
              AI Writing
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              Generate and manage institutional communication narratives
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-600 dark:text-gray-300">
                Credits:
              </span>
              <span className={`text-sm font-semibold ${userData.credits === 0 ? 'text-red-600 dark:text-red-400' : 'text-[#0F2D63] dark:text-white'}`}>
                {userData.credits}
              </span>
              {userData.credits === 0 && (
                <button
                  onClick={handleTopUp}
                  className="text-xs text-[#C85A32] hover:underline font-semibold"
                >
                  Top Up
                </button>
              )}
            </div>

            {userData.creditsBlocked && (
              <div className="flex items-center gap-1.5 mt-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span className="text-xs text-red-700 dark:text-red-300 font-medium">
                  Credits blocked by admin
                </span>
              </div>
            )}

            {!userData.creditsBlocked && (userData.credits ?? 0) < 10 && (userData.credits ?? 0) > 0 && (
              <div className="flex items-center gap-1.5 mt-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
                <span className="text-xs text-amber-900 dark:text-amber-200 font-medium">
                  Low credits ({userData.credits}/10). Please top up to continue.
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleCreate}
            disabled={userData.creditsBlocked === true || (userData.credits ?? 0) <= 0}
            title={
              userData.creditsBlocked
                ? `Credits blocked by admin${userData.creditsBlockedReason ? `: ${userData.creditsBlockedReason}` : ''}`
                : undefined
            }
            className={`self-start sm:self-auto shrink-0 flex items-center gap-2 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-all whitespace-nowrap ${
              userData.creditsBlocked
                ? 'bg-gray-400 cursor-not-allowed opacity-40 blur-[1px]'
                : (userData.credits ?? 0) <= 0
                ? 'bg-gray-400 cursor-not-allowed opacity-50'
                : 'bg-[#C85A32] hover:bg-[#a8472a]'
            }`}
          >
            <Plus className="w-4 h-4 shrink-0" />
            Create AI Writing
          </button>
        </div>

    
        {userData.creditsBlocked && (
          <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-xl px-4 py-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-red-800 dark:text-red-200 font-semibold">
                Your credits are blocked by the administrator.
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">
                {userData.creditsBlockedReason
                  ? `Reason: ${userData.creditsBlockedReason}`
                  : 'You cannot create new AI Writing documents until the block is lifted.'}
              </p>
            </div>
          </div>
        )}

     
        {!userData.creditsBlocked && (userData.credits ?? 0) === 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-800 rounded-xl px-4 py-3 mb-4">
            <div className="flex items-start sm:items-center gap-3 flex-1">
              <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0" />
              <p className="text-sm text-amber-950 dark:text-amber-200">
                <strong>No credits available.</strong> Please top up your credits to create new AI Writing documents.
              </p>
            </div>
            <button
              onClick={handleTopUp}
              className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 bg-[#C85A32] hover:bg-[#a8472a] text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Top Up Now
            </button>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-sm p-3.5 sm:p-4 mb-5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents by title, type or content…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#C85A32] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
            />
          </div>
        </div>

  
        {successMessage && (
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 px-4 py-3 rounded-xl text-sm font-medium mb-4">
            <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-700 dark:text-emerald-300" />
            <span>{successMessage}</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-xl text-sm font-medium mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-700 dark:text-red-300" />
            <span>{error}</span>
          </div>
        )}

     
        {filteredDocuments.length > 0 ? (
          <>
         
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 xl:hidden">
              {filteredDocuments.map((doc) => {
                const wordCount = doc.metadata?.wordCount || doc.charCount || 0;
                const statusMeta = getStatusMeta(doc.status);

                return (
                  <article
                    key={doc._id}
                    onClick={() => handleView(doc)}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-sm p-4 hover:border-[#C85A32]/50 transition-all cursor-pointer flex flex-col justify-between gap-3.5"
                  >
            
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 bg-[#FFF8F5] dark:bg-[#C85A32]/15 border border-[#C85A32]/15 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                          {getIconForType(doc.metadata?.type || '')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-[#0F2D63] dark:text-white line-clamp-2 leading-snug break-words">
                            {doc.title}
                          </h3>
                          {doc.identifier && (
                            <p className="text-[11px] font-mono text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                              {doc.identifier}
                            </p>
                          )}
                        </div>
                      </div>

                      <span
                        className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap inline-flex items-center gap-1.5 ${statusMeta.className}`}
                      >
                        {statusMeta.icon}
                        <span>{statusMeta.label}</span>
                      </span>
                    </div>

               
                    <div className="grid grid-cols-3 gap-2 bg-gray-50/90 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700/80 rounded-xl px-3 py-2.5">
                      <div className="min-w-0">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Type
                        </span>
                        <span className="block text-xs font-medium text-gray-800 dark:text-gray-200 truncate mt-0.5">
                          {getTypeLabel(doc.metadata?.type || '')}
                        </span>
                      </div>

                      <div className="min-w-0 border-l border-gray-200/80 dark:border-gray-700 pl-2.5">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Tone
                        </span>
                        <span className="block text-xs font-medium text-gray-800 dark:text-gray-200 truncate mt-0.5">
                          {getToneLabel(doc.metadata?.tone || 'neutral')}
                        </span>
                      </div>

                      <div className="min-w-0 border-l border-gray-200/80 dark:border-gray-700 pl-2.5">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Words
                        </span>
                        <span className="block text-xs font-semibold text-gray-900 dark:text-gray-100 tabular-nums mt-0.5">
                          {wordCount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                
                    <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 dark:border-gray-700/80 gap-2">
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5 whitespace-nowrap">
                        <Calendar className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                        <span>{formatDate(doc.createdAt)}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(doc);
                          }}
                          className="h-9 inline-flex items-center gap-1.5 px-3 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200/80 dark:hover:bg-gray-600 text-[#0F2D63] dark:text-white transition-colors"
                          title="View Document"
                        >
                          <Eye className="w-3.5 h-3.5 shrink-0" />
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyContent(doc.content);
                          }}
                          aria-label="Copy document content"
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200/80 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 hover:text-[#0F2D63] dark:hover:text-[#C85A32] transition-colors"
                          title="Copy Content"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteModal(doc._id);
                          }}
                          aria-label="Delete document"
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/40 text-gray-700 dark:text-gray-200 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="hidden xl:block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-sm overflow-hidden">
        
              <div className="grid grid-cols-[minmax(240px,3fr)_135px_115px_90px_135px_130px_124px] gap-4 px-5 py-3.5 border-b border-gray-200/80 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 items-center">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Document
                </div>
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Type
                </div>
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Tone
                </div>
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-right whitespace-nowrap">
                  Words
                </div>
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-center whitespace-nowrap">
                  Status
                </div>
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Created
                </div>
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-right whitespace-nowrap">
                  Actions
                </div>
              </div>

           
              {filteredDocuments.map((doc, index) => {
                const wordCount = doc.metadata?.wordCount || doc.charCount || 0;
                const statusMeta = getStatusMeta(doc.status);

                return (
                  <div
                    key={doc._id}
                    className={`grid grid-cols-[minmax(240px,3fr)_135px_115px_90px_135px_130px_124px] gap-4 px-5 py-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                      index < filteredDocuments.length - 1 ? 'border-b border-gray-100 dark:border-gray-700/60' : ''
                    }`}
                    onClick={() => handleView(doc)}
                  >
                  
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 bg-[#FFF8F5] dark:bg-[#C85A32]/15 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getIconForType(doc.metadata?.type || '')}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#0F2D63] dark:text-white truncate">
                          {doc.title}
                        </p>
                        <p className="text-[11px] font-mono text-gray-500 dark:text-gray-400 truncate">
                          {doc.identifier}
                        </p>
                      </div>
                    </div>

              
                    <div className="whitespace-nowrap">
                      <span className="inline-block text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2.5 py-1 rounded-lg">
                        {getTypeLabel(doc.metadata?.type || '')}
                      </span>
                    </div>

                    <div className="text-xs font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {getToneLabel(doc.metadata?.tone || 'neutral')}
                    </div>

                  
                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-200 text-right tabular-nums whitespace-nowrap">
                      {wordCount.toLocaleString()}
                    </div>

                  
                    <div className="flex items-center justify-center whitespace-nowrap">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border inline-flex items-center gap-1.5 ${statusMeta.className}`}
                      >
                        {statusMeta.icon}
                        <span>{statusMeta.label}</span>
                      </span>
                    </div>

              
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5 whitespace-nowrap">
                      <Calendar className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                      <span>{formatDate(doc.createdAt)}</span>
                    </div>

                   
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(doc);
                        }}
                        aria-label="View document"
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-[#0F2D63] dark:hover:text-[#C85A32] transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyContent(doc.content);
                        }}
                        aria-label="Copy document content"
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-[#0F2D63] dark:hover:text-[#C85A32] transition-colors"
                        title="Copy Content"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteModal(doc._id);
                        }}
                        aria-label="Delete document"
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-sm text-center py-12 px-4">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#0F2D63] dark:text-white mb-2">
              No documents found
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
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

        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-3 px-1">
          {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'} found
        </p>
      </div>
    </div>
  );
};

export default AIWriting;