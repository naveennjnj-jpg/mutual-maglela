// pages/user/Ai-writing/AIWritingDetail.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Calendar,
  User,
  Tag,
  Clock,
  TrendingUp,
  BookOpen,
  PenTool,
  Megaphone,
  Lightbulb,
  Heart,
  Sparkles
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

// ============================================
// COMPONENT
// ============================================

const AIWritingDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // State
  const [documentData, setDocumentData] = useState<WritingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ✅ Get data from location state or fetch by ID
  useEffect(() => {
    const data = location.state?.data;
    if (data) {
      setDocumentData(data);
      setIsLoading(false);
    } else {
      // If no data, fetch by ID from URL params
      const pathParts = location.pathname.split('/');
      const id = pathParts[pathParts.length - 1];
      if (id && id !== 'result') {
        fetchDocumentById(id);
      } else {
        setError('No document data found');
        setIsLoading(false);
      }
    }
  }, [location]);

  // ✅ Fetch document by ID
  const fetchDocumentById = async (id: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError('Authentication required');
        setIsLoading(false);
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/ai/ai-content/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setDocumentData(response.data.data);
      } else {
        setError('Failed to fetch document');
      }
    } catch (err: any) {
      console.error('Error fetching document:', err);
      setError(err.response?.data?.message || 'Failed to fetch document');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // ✅ HANDLERS
  // ============================================

  const handleBack = () => {
    navigate('/user/narrative-engine');
  };

  const handleCopy = () => {
    if (documentData?.content) {
      navigator.clipboard.writeText(documentData.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (documentData?.content) {
      const blob = new Blob([documentData.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${documentData.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleEdit = () => {
    navigate('/user/narrative-engine/create', { state: { editData: documentData } });
  };

  const handleDelete = async () => {
    if (!documentData?._id) return;
    if (!confirm(`Are you sure you want to delete "${documentData.title}"?`)) return;

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_URL}/api/ai/ai-content/${documentData._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        navigate('/user/narrative-engine');
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ============================================
  // ✅ HELPERS
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

  const getTypeIcon = (type: string): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
      'policy-brief': <BookOpen className="w-4 h-4" />,
      'op-ed': <PenTool className="w-4 h-4" />,
      'press-release': <Megaphone className="w-4 h-4" />,
      'speech': <Sparkles className="w-4 h-4" />,
      'impact-report': <Heart className="w-4 h-4" />,
      'summary': <FileText className="w-4 h-4" />,
      'blog-post': <Lightbulb className="w-4 h-4" />,
      'media-story': <Megaphone className="w-4 h-4" />,
    };
    return iconMap[type] || <FileText className="w-4 h-4" />;
  };

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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getParamColor = (value: number): string => {
    if (value >= 80) return 'text-green-600 dark:text-green-400';
    if (value >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getParamBgColor = (value: number): string => {
    if (value >= 80) return 'bg-green-50 dark:bg-green-900/20';
    if (value >= 60) return 'bg-amber-50 dark:bg-amber-900/20';
    return 'bg-red-50 dark:bg-red-900/20';
  };

  // ============================================
  // ✅ RENDER
  // ============================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !documentData) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6">
        <div className="max-w-[900px] mx-auto text-center py-12">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F2D63] dark:text-white mb-2">
            Document not found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {error || "The document you're looking for doesn't exist or has been deleted."}
          </p>
          <button
            onClick={handleBack}
            className="text-[#C85A32] hover:underline text-sm font-medium"
          >
            Go back to documents
          </button>
        </div>
      </div>
    );
  }

  const doc = documentData;

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6">
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#0F2D63] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
            {doc.title}
          </span>

          {/* Action Buttons */}
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-[#C85A32] transition-colors border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg"
            >
              {copied ? (
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-[#C85A32] transition-colors border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-[#C85A32] transition-colors border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition-colors border border-red-200 dark:border-red-800 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              {deleteLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              Delete
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-8">
          {/* Header Info */}
          <div className="flex items-start gap-3 mb-6 pb-5 border-b border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-[#FFF8F5] dark:bg-[#C85A32]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              {getTypeIcon(doc.metadata?.type || '')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-semibold text-[#0F2D63] dark:text-white">
                  {doc.title}
                </h2>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(doc.status)}`}>
                  {doc.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {getTypeLabel(doc.metadata?.type || '')}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {getToneLabel(doc.metadata?.tone || 'neutral')}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {doc.metadata?.wordCount || doc.charCount || 0} words
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(doc.createdAt)}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {doc.author}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                  ID: {doc.identifier}
                </span>
              </div>
            </div>
          </div>

          {/* Provider & Cost Info */}
          <div className="flex items-center gap-6 mb-4 pb-4 border-b border-gray-100 dark:border-gray-700 text-xs flex-wrap">
            <div>
              <span className="text-gray-400 dark:text-gray-500">Provider</span>
              <p className="text-gray-700 dark:text-gray-300 font-medium capitalize">{doc.provider}</p>
            </div>
            <div>
              <span className="text-gray-400 dark:text-gray-500">Model</span>
              <p className="text-gray-700 dark:text-gray-300 font-medium">{doc.aiModel}</p>
            </div>
            <div>
              <span className="text-gray-400 dark:text-gray-500">Cost</span>
              <p className="text-gray-700 dark:text-gray-300 font-medium">${doc.cost.usd.toFixed(4)} (R{doc.cost.zar.toFixed(2)})</p>
            </div>
            <div>
              <span className="text-gray-400 dark:text-gray-500">Tokens</span>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {doc.metadata?.tokensUsed?.total || 0}
              </p>
            </div>
            <div>
              <span className="text-gray-400 dark:text-gray-500">Generated</span>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {formatDateTime(doc.metadata?.generatedAt || doc.createdAt)}
              </p>
            </div>
          </div>

          {/* Document Content */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
              {doc.content}
            </pre>
          </div>

          {/* Parameters Section */}
          {doc.parameters && Object.values(doc.parameters).some(v => v > 0) && (
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-[#0F2D63] dark:text-white mb-3">
                Voice Tone Parameters
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(doc.parameters).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    authority: 'Authority',
                    clarity: 'Clarity',
                    academicRigor: 'Academic Rigor',
                    accessibility: 'Accessibility',
                    narrativeDepth: 'Narrative Depth'
                  };
                  const label = labels[key] || key;
                  const color = getParamColor(value);
                  const bgColor = getParamBgColor(value);

                  return (
                    <div key={key} className={`${bgColor} rounded-xl p-3 text-center`}>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {label}
                      </p>
                      <p className={`text-lg font-bold ${color}`}>
                        {value}%
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 text-center">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Average Score: {doc.avgScore || 0}/100
                </span>
              </div>
            </div>
          )}

          {/* Outline Section (if available) */}
          {doc.metadata?.outline && (
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-[#0F2D63] dark:text-white mb-3">
                Document Outline
              </h4>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-sans leading-relaxed">
                  {doc.metadata.outline}
                </pre>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-gray-400 dark:text-gray-500">Content Type</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium capitalize">
                  {doc.contentType}
                </p>
              </div>
              <div>
                <p className="text-gray-400 dark:text-gray-500">Source File</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {doc.metadata?.fileName || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 dark:text-gray-500">File Type</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {doc.metadata?.fileType || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 dark:text-gray-500">Include Outline</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {doc.metadata?.includeOutline ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Disclaimer */}
        <div className="mt-6 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex items-start gap-3">
          <span className="text-amber-500 text-lg flex-shrink-0 mt-0.5">⚠️</span>
          <div>
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1.5">
              Disclaimer
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              AI-generated content from Magalela Media Services may contain inaccuracies and is not intended for immediate publication. All outputs must be submitted to an editor for final review and approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIWritingDetail;