// pages/user/AISpeech.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Eye, 
  MoreVertical,
  Mic,
  Calendar,
  Loader2,
  AlertCircle,
  FileText,
  CheckCircle,
  Clock,
  Trash2,
  Copy,
  Download
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

// ============================================
// ✅ UPDATED TYPES - Matching Backend Response
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

interface Metadata {
  inputMethod: string;
  fileName?: string;
  generatedAt: string;
}

interface SpeechData {
  _id: string;
  identifier: string;
  userId: string;
  contentType: string;
  title: string;
  description: string;
  content: string;
  parameters: Parameters;  // ✅ This is an object, not array
  avgScore: number;
  duration: string;
  audioUrl: string;
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
  data: SpeechData[];
}

// ============================================
// COMPONENT
// ============================================

const AISpeech = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [speeches, setSpeeches] = useState<SpeechData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const fetchCalled = useRef(false);

  useEffect(() => {
    if (!fetchCalled.current) {
      fetchCalled.current = true;
      fetchSpeeches();
    }
  }, []);

  // ============================================
  // ✅ FETCH SPEECHES FROM BACKEND
  // ============================================

  const fetchSpeeches = async () => {
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
        `${API_URL}/api/auth/ai-speech`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const speechesData = response.data.data || [];
        if (Array.isArray(speechesData) && speechesData.length > 0) {
          setSpeeches(speechesData);
        } else {
          setSpeeches([]);
        }
      } else {
        setSpeeches([]);
      }
    } catch (err: any) {
      console.error('Error fetching speeches:', err);
      setError(err.response?.data?.message || 'Failed to fetch speeches');
      setSpeeches([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // ✅ DELETE SPEECH
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
        `${API_URL}/api/auth/ai-speech/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setSpeeches(speeches.filter(speech => speech._id !== id));
        setSuccessMessage('Speech deleted successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      console.error('Error deleting speech:', err);
      setError(err.response?.data?.message || 'Failed to delete speech');
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeleteLoading(null);
      setShowDeleteModal(null);
    }
  };

  // ============================================
  // ✅ GET TOP PARAMETERS FROM OBJECT
  // ============================================

  const getTopParameters = (parameters: Parameters): { key: string; label: string; value: number }[] => {
    const entries = Object.entries(parameters);
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 2);
    const labels: Record<string, string> = {
      authority: 'Authority',
      clarity: 'Clarity',
      academicRigor: 'Academic Rigor',
      accessibility: 'Accessibility',
      narrativeDepth: 'Narrative Depth'
    };
    return top.map(([key, value]) => ({
      key,
      label: labels[key] || key,
      value
    }));
  };

  // ============================================
  // ✅ GET PARAMETER COLOR
  // ============================================

  const getParameterColor = (score: number): string => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
    if (score >= 60) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
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
  // ✅ FILTER SPEECHES
  // ============================================

  const getFilteredSpeeches = () => {
    let filtered = speeches;
    if (searchTerm) {
      filtered = filtered.filter(speech =>
        speech.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        speech.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        speech.identifier?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredSpeeches = getFilteredSpeeches();

  // ============================================
  // ✅ HANDLERS
  // ============================================

  const handleCreate = () => {
    navigate('/user/voice-calibrator/create');
  };

  const handleView = (speech: SpeechData) => {
    navigate('/user/voice-calibrator/view', { state: { data: speech } });
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    setSuccessMessage('Content copied to clipboard!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

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
            Delete Speech
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
          <p className="text-gray-500 dark:text-gray-400">Loading speeches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6">
      <div className="max-w-[1500px] mx-auto">
        {/* Delete Modal */}
        {showDeleteModal && (
          <DeleteModal 
            id={showDeleteModal} 
            title={speeches.find(s => s._id === showDeleteModal)?.title || ''} 
          />
        )}

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-6 py-5 mb-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-11 h-11 bg-[#0F2D63] rounded-xl flex items-center justify-center flex-shrink-0">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-['Roboto'] font-bold text-[#0F2D63] dark:text-white leading-tight">
                AI Speech
              </h1>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
                Calibrate and manage your institutional speech recordings
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search speeches…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#C85A32] bg-gray-50 dark:bg-gray-900 dark:text-white w-52"
              />
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Create AI Speech
            </button>
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

        {/* Speeches Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="col-span-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Speech Name</div>
            <div className="col-span-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Top Parameters</div>
            <div className="col-span-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-center">Avg Score</div>
            <div className="col-span-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-center">Duration</div>
            <div className="col-span-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-center">Status</div>
            <div className="col-span-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-center">Created</div>
            <div className="col-span-1"></div>
          </div>

          {filteredSpeeches.length > 0 ? (
            filteredSpeeches.map((speech, index) => {
              // ✅ Get top parameters from object
              const topParams = getTopParameters(speech.parameters);
              
              return (
                <div
                  key={speech._id}
                  className={`grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                    index < filteredSpeeches.length - 1 ? 'border-b border-gray-50 dark:border-gray-700/50' : ''
                  }`}
                  onClick={() => handleView(speech)}
                >
                  <div className="col-span-3 flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-[#FFF8F5] dark:bg-[#C85A32]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mic className="w-4 h-4 text-[#C85A32]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#0F2D63] dark:text-white truncate">
                        {speech.title}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                        {speech.identifier}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center gap-1.5 flex-wrap">
                    {topParams.map((param, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ${getParameterColor(param.value)}`}
                      >
                        {param.label}: {param.value}%
                      </span>
                    ))}
                  </div>

                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1">
                      <span className={`text-sm font-bold ${
                        speech.avgScore >= 70 ? 'text-green-600 dark:text-green-400' :
                        speech.avgScore >= 50 ? 'text-amber-600 dark:text-amber-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {speech.avgScore}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">/ 100</span>
                    </div>
                  </div>

                  <div className="col-span-1 text-xs font-medium text-gray-600 dark:text-gray-400 text-center">
                    {speech.duration}
                  </div>

                  <div className="col-span-1 flex items-center justify-center">
                    <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${getStatusColor(speech.status)} flex items-center gap-1`}>
                      {getStatusIcon(speech.status)}
                      {speech.status}
                    </span>
                  </div>

                  <div className="col-span-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                    {formatDate(speech.createdAt)}
                  </div>

                  <div className="col-span-1 flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(speech);
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-[#0F2D63] dark:hover:text-[#C85A32] transition-colors"
                      title="View"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyContent(speech.content);
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-[#0F2D63] dark:hover:text-[#C85A32] transition-colors"
                      title="Copy Content"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteModal(speech._id);
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F2D63] dark:text-white mb-2">
                No speeches found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm ? `No speeches match "${searchTerm}"` : 'Create your first AI Speech'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#C85A32] text-white text-sm font-semibold rounded-xl hover:bg-[#a8472a] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create AI Speech
                </button>
              )}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 px-1">
          {filteredSpeeches.length} {filteredSpeeches.length === 1 ? 'speech' : 'speeches'} found
        </p>
      </div>
    </div>
  );
};

export default AISpeech;