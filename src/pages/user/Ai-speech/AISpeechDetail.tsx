// pages/user/Ai-speech/AISpeechDetail.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  Download,
  Play,
  Pause,
  Volume2,
  Mic,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  DollarSign,
  Zap,
  Calendar,
  User,
  Tag,
  Share2,
  Trash2,
  Edit
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

// ============================================
// ✅ TYPES
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
  parameters: Parameters;
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

// ============================================
// COMPONENT
// ============================================

const AISpeechDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [speechData, setSpeechData] = useState<SpeechData | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ✅ Get data from location state or fetch by ID
  useEffect(() => {
    const data = location.state?.data;
    if (data) {
      setSpeechData(data);
      setAudioSrc(`${API_URL}${data.audioUrl}`);
    } else {
      // If no data, fetch by ID from URL params
      const pathParts = location.pathname.split('/');
      const id = pathParts[pathParts.length - 1];
      if (id && id !== 'result') {
        fetchSpeechById(id);
      }
    }
  }, [location]);

  // ✅ Fetch speech by ID
  const fetchSpeechById = async (id: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/ai/ai-content/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setSpeechData(response.data.data);
        if (response.data.data.audioUrl) {
          setAudioSrc(`${API_URL}${response.data.data.audioUrl}`);
        }
      }
    } catch (err: any) {
      console.error('Error fetching speech:', err);
      setError(err.response?.data?.message || 'Failed to fetch speech');
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Handle audio end
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => {
        setIsPlaying(false);
        setAudioProgress(0);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      };
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, []);

  // ============================================
  // AUDIO PLAYBACK
  // ============================================

  const togglePlayAudio = () => {
    if (audioRef.current && audioSrc) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            progressIntervalRef.current = setInterval(() => {
              if (audioRef.current) {
                const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                setAudioProgress(progress);
              }
            }, 100);
          })
          .catch((err) => {
            console.error('Error playing audio:', err);
            setError('Failed to play audio. Please try again.');
          });
      }
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ============================================
  // HANDLERS
  // ============================================

  const handleBack = () => {
    navigate('/user/voice-calibrator');
  };

  const handleCopy = () => {
    if (speechData?.content) {
      navigator.clipboard.writeText(speechData.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (speechData?.content) {
      const blob = new Blob([speechData.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${speechData.title.toLowerCase().replace(/\s+/g, '-')}-speech.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadAudio = async () => {
    if (!speechData?.audioUrl) {
      setError('No audio file available');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}${speechData.audioUrl}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${speechData.title.toLowerCase().replace(/\s+/g, '-')}-audio.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading audio:', err);
      setError('Failed to download audio');
    }
  };

  const handleEdit = () => {
    navigate('/user/narrative-engine/create', { state: { editData: speechData } });
  };

  const handleDelete = async () => {
    if (!speechData?._id) return;
    if (!confirm(`Are you sure you want to delete "${speechData.title}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_URL}/api/ai/ai-content/${speechData._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        navigate('/user/narrative-engine');
      }
    } catch (err) {
      console.error('Error deleting speech:', err);
      setError('Failed to delete speech');
    }
  };

  // ============================================
  // RENDER
  // ============================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading speech...</p>
        </div>
      </div>
    );
  }

  if (!speechData) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6">
        <div className="max-w-[900px] mx-auto text-center py-12">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F2D63] dark:text-white mb-2">
            Speech not found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            The speech you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={handleBack}
            className="text-[#C85A32] hover:underline text-sm font-medium"
          >
            Go back to speeches
          </button>
        </div>
      </div>
    );
  }

  const paramLabels: Record<string, string> = {
    authority: 'Authority',
    clarity: 'Clarity',
    academicRigor: 'Academic Rigor',
    accessibility: 'Accessibility',
    narrativeDepth: 'Narrative Depth'
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

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6">
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#0F2D63] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
            {speechData.title}
          </span>

          {/* Action Buttons */}
          <div className="ml-auto flex items-center gap-2">
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
            {speechData.audioUrl && (
              <button
                onClick={handleDownloadAudio}
                className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-[#C85A32] transition-colors border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Audio
              </button>
            )}
            {/* <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-[#C85A32] transition-colors border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </button> */}
            {/* <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition-colors border border-red-200 dark:border-red-800 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button> */}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-8">
          {/* Header Info */}
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-[#FFF8F5] dark:bg-[#C85A32]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mic className="w-6 h-6 text-[#C85A32]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-semibold text-[#0F2D63] dark:text-white">
                  {speechData.title}
                </h2>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(speechData.status)}`}>
                  {speechData.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {speechData.contentType}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {speechData.duration}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Score: {speechData.avgScore}/100
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {speechData.charCount} chars
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(speechData.createdAt)}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {speechData.author}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  ${speechData.cost.usd.toFixed(4)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 dark:text-gray-500">ID:</span>
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                {speechData.identifier}
              </span>
            </div>
          </div>

          {/* Audio Player */}
          {audioSrc && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlayAudio}
                  className="w-10 h-10 bg-[#C85A32] hover:bg-[#a8472a] rounded-full flex items-center justify-center text-white transition-colors flex-shrink-0"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-gray-400" />
                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C85A32] rounded-full transition-all duration-300"
                        style={{ width: `${audioProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formatDuration(audioRef.current?.currentTime || 0)}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formatDuration(audioDuration)}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {speechData.provider} · {speechData.aiModel}
                </span>
              </div>
              <audio
                ref={audioRef}
                src={audioSrc}
                onTimeUpdate={handleAudioTimeUpdate}
                onLoadedMetadata={handleAudioTimeUpdate}
                className="hidden"
              />
            </div>
          )}

          {/* Speech Content */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
              {speechData.content}
            </pre>
          </div>

          {/* Parameters Section */}
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-[#0F2D63] dark:text-white mb-3">
              Voice Tone Parameters
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(speechData.parameters).map(([key, value]) => {
                const label = paramLabels[key] || key;
                const isHigh = value >= 70;
                const isMid = value >= 50 && value < 70;
                const isLow = value < 50;
                const color = isHigh ? 'text-green-600 dark:text-green-400' :
                  isMid ? 'text-amber-600 dark:text-amber-400' :
                    'text-red-600 dark:text-red-400';
                const bgColor = isHigh ? 'bg-green-50 dark:bg-green-900/20' :
                  isMid ? 'bg-amber-50 dark:bg-amber-900/20' :
                    'bg-red-50 dark:bg-red-900/20';

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
          </div>

          {/* Metadata */}
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-gray-400 dark:text-gray-500">Provider</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium capitalize">
                  {speechData.provider}
                </p>
              </div>
              <div>
                <p className="text-gray-400 dark:text-gray-500">Model</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {speechData.aiModel}
                </p>
              </div>
              <div>
                <p className="text-gray-400 dark:text-gray-500">Input Method</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {speechData.metadata?.inputMethod || 'AI'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 dark:text-gray-500">Generated</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {formatDate(speechData.metadata?.generatedAt || speechData.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Disclaimer */}
        <div className="mt-6 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-amber-500 text-base flex-shrink-0 mt-0.5">⚠️</span>
          <div>
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1">
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

export default AISpeechDetail;