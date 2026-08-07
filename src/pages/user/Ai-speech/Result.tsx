// pages/user/Ai-speech/Result.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { 
  ArrowLeft,
  Save,
  PenLine,
  Plus,
  Copy,
  Download,
  Play,
  Pause,
  Volume2,
  Check,
  Mic,
  Loader2,
  AlertCircle,
  Clock,
  DollarSign,
  Zap,
  Edit,
  X,
  Coins
} from 'lucide-react';
import axios from 'axios';

// ============================================
// TYPES - Matching Backend API Response
// ============================================

interface AnalysisData {
  authority: number;
  clarity: number;
  academicRigor: number;
  accessibility: number;
  narrativeDepth: number;
}

interface CostData {
  usd: number;
  zar: number;
}

interface MetadataData {
  title: string;
  generatedAt: string;
}

interface SpeechData {
  audioUrl: string;
  duration: number;
  format: string;
  size: number;
  provider: string;
  model: string;
  charCount: number;
  text: string;
  cost: CostData;
  analysis: AnalysisData;
  metadata: MetadataData;
  file?: {
    name: string;
    size: number;
    mimetype: string;
  };
  audio?: string;
  recordingDuration?: number;
  creditsUsed?: number;
  creditsRemaining?: number;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  credits: number;
  initials?: string;
}

// ============================================
// COMPONENT
// ============================================

const AISpeechResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  
  // Edit mode states - Frontend only
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  
  // Local copy of result data (for frontend edits)
  const [localResultData, setLocalResultData] = useState<SpeechData | null>(null);
  
  // User credits state
  const [userData, setUserData] = useState<UserData>({
    id: '',
    name: 'User',
    email: '',
    role: 'user',
    credits: 0,
    initials: 'U'
  });
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ✅ Get data from location state
  const resultData = location.state?.data as SpeechData;

  // ✅ Set local data when result loads
  useEffect(() => {
    if (resultData) {
      setLocalResultData({ ...resultData });
      setEditTitle(resultData.metadata.title);
      setEditContent(resultData.text);
    }
  }, [resultData]);

  // ✅ Fetch updated user data
  const fetchUpdatedUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
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
          email: data.email || '',
          role: data.role || 'user',
          credits: credits,
          initials: initials || 'U'
        });

        localStorage.setItem('userCredits', credits.toString());
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      const savedCredits = parseInt(localStorage.getItem('userCredits') || '0');
      setUserData(prev => ({ ...prev, credits: savedCredits }));
    }
  };

  // ✅ Fetch user data on mount
  useEffect(() => {
    fetchUpdatedUserData();
  }, []);

  // ✅ Update credits from location state if available
  useEffect(() => {
    if (location.state?.data?.creditsRemaining !== undefined) {
      const credits = location.state.data.creditsRemaining;
      setUserData(prev => ({ ...prev, credits }));
      localStorage.setItem('userCredits', credits.toString());
    }
  }, [location.state]);

  // ✅ Set audio source
  useEffect(() => {
    if (localResultData?.audioUrl) {
      if (localResultData.audioUrl.startsWith('data:audio')) {
        setAudioSrc(localResultData.audioUrl);
      } else if (localResultData.audioUrl.startsWith('/uploads/')) {
        setAudioSrc(`${API_URL}${localResultData.audioUrl}`);
      } else if (localResultData.audioUrl.startsWith('http')) {
        setAudioSrc(localResultData.audioUrl);
      } else {
        setAudioSrc(`${API_URL}/uploads/audio/${localResultData.audioUrl}`);
      }
    }
  }, [localResultData, API_URL]);

  // ✅ Redirect if no data
  useEffect(() => {
    if (!resultData) {
      navigate('/user/voice-calibrator');
    }
  }, [resultData, navigate]);

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
  // HANDLE COPY
  // ============================================

  const handleCopy = async () => {
    const textToCopy = isEditing ? editContent : localResultData?.text;
    if (textToCopy) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        alert('Content copied to clipboard!');
      } catch (err) {
        setError('Failed to copy content');
      }
    }
  };

  // ============================================
  // HANDLE DOWNLOAD TEXT
  // ============================================

  const handleDownloadText = () => {
    const textToDownload = isEditing ? editContent : localResultData?.text;
    const titleToUse = isEditing ? editTitle : localResultData?.metadata?.title;
    if (textToDownload) {
      const blob = new Blob([textToDownload], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${titleToUse?.toLowerCase().replace(/\s+/g, '-') || 'speech'}-speech.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // ============================================
  // HANDLE DOWNLOAD AUDIO
  // ============================================

  const handleDownloadAudio = async () => {
    if (!localResultData?.audioUrl) {
      setError('No audio file available to download');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}${localResultData.audioUrl}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${localResultData.metadata.title.toLowerCase().replace(/\s+/g, '-')}-audio.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error downloading audio:', err);
      setError(err.response?.data?.message || 'Failed to download audio file');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // EDIT HANDLERS - FRONTEND ONLY
  // ============================================

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit - revert to original
      setEditTitle(localResultData?.metadata?.title || '');
      setEditContent(localResultData?.text || '');
      setIsEditing(false);
    } else {
      // Start edit
      setEditTitle(localResultData?.metadata?.title || '');
      setEditContent(localResultData?.text || '');
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    setIsSavingEdit(true);
    setTimeout(() => {
      // ✅ Update local state only - NO DB SAVE
      if (localResultData) {
        const updatedData = {
          ...localResultData,
          metadata: {
            ...localResultData.metadata,
            title: editTitle.trim() || localResultData.metadata.title
          },
          text: editContent.trim() || localResultData.text,
          charCount: editContent.trim().length || 0
        };
        setLocalResultData(updatedData);
      }
      
      // ✅ Exit edit mode after save
      setIsEditing(false);
      setIsSavingEdit(false);
      
      // ✅ Show success message
      // alert('Changes saved locally! Click "Copy" or "Export Text" to save it permanently.');
    }, 500);
  };

  // ============================================
  // NAVIGATION
  // ============================================

  const handleBack = () => {
    navigate('/user/voice-calibrator');
  };

  const handleNewSpeech = () => {
    navigate('/user/voice-calibrator/create');
  };

  // ============================================
  // HELPERS
  // ============================================

  const getParameterColor = (value: number) => {
    if (value >= 80) return 'text-green-600 dark:text-green-400';
    if (value >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getParameterBgColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // ============================================
  // RENDER - Loading State
  // ============================================

  if (!resultData || !localResultData) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading speech data...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER - Main
  // ============================================

  const paramLabels: Record<string, string> = {
    authority: 'Authority',
    clarity: 'Clarity',
    academicRigor: 'Academic Rigor',
    accessibility: 'Accessibility',
    narrativeDepth: 'Narrative Depth'
  };

  const paramDescriptions: Record<string, string> = {
    authority: 'Commanding presence and decisiveness',
    clarity: 'Clear articulation and message precision',
    academicRigor: 'Scholarly depth and evidence-based framing',
    accessibility: 'Inclusive language for diverse audiences',
    narrativeDepth: 'Storytelling richness and emotional resonance'
  };

  const avgScore = Math.floor(
    (localResultData.analysis.authority + 
     localResultData.analysis.clarity + 
     localResultData.analysis.academicRigor + 
     localResultData.analysis.accessibility + 
     localResultData.analysis.narrativeDepth) / 5
  );

  const displayTitle = isEditing ? editTitle : localResultData.metadata.title;
  const displayContent = isEditing ? editContent : localResultData.text;

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6">
      <div className="max-w-[1000px] mx-auto">
        {/* ✅ Credits Display Banner */}
        {/* <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F9F7F4] dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Coins className="w-5 h-5 text-[#C85A32]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Available Credits</p>
              <p className="text-xl font-bold text-[#0F2D63] dark:text-white">
                {userData.credits}
              </p>
            </div>
          </div>
          {localResultData.creditsUsed !== undefined && (
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Credits Used</p>
              <p className="text-sm font-semibold text-[#C85A32]">
                -{localResultData.creditsUsed} credits
              </p>
            </div>
          )}
          <button
            onClick={() => navigate('/user/add-credits')}
            className="flex items-center gap-2 px-4 py-2 bg-[#C85A32] hover:bg-[#a8472a] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Credits
          </button>
        </div> */}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

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
          <span className="text-sm font-medium text-[#0F2D63] dark:text-white truncate">
            {displayTitle}
          </span>
        </div>

        {/* Action Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-5 py-3 mb-5 flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSaveEdit}
            disabled={isSavingEdit}
            className={`flex items-center gap-1.5 text-white rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
              isEditing 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-[#C85A32] hover:bg-[#a8472a]'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSavingEdit ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {isEditing ? 'Save Changes' : 'Save'}
          </button>
          <button
            onClick={handleEditToggle}
            className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl px-4 py-2 text-xs font-medium transition-colors"
          >
            {isEditing ? (
              <>
                <X className="w-3.5 h-3.5" />
                Cancel Edit
              </>
            ) : (
              <>
                <PenLine className="w-3.5 h-3.5" />
                Edit
              </>
            )}
          </button>
          <button
            onClick={handleNewSpeech}
            className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl px-4 py-2 text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Speech
          </button>
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl px-4 py-2 text-xs font-medium transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy
            </button>
            <button
              onClick={handleDownloadText}
              className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl px-4 py-2 text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export Text
            </button>
            {localResultData.audioUrl && (
              <button
                onClick={handleDownloadAudio}
                disabled={isLoading}
                className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl px-4 py-2 text-xs font-medium transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Mic className="w-3.5 h-3.5" />
                )}
                Audio
              </button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Speech Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-lg font-semibold text-[#0F2D63] dark:text-white bg-transparent border-b-2 border-[#C85A32] focus:outline-none w-full pb-1"
                      placeholder="Enter title..."
                      autoFocus
                    />
                  ) : (
                    <h2 className="font-semibold text-[#0F2D63] dark:text-white">
                      {localResultData.metadata.title}
                    </h2>
                  )}
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Duration: {formatDuration(localResultData.duration)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Score: {avgScore}/100
                    </span>
                    {/* <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      ${localResultData.cost.usd.toFixed(4)}
                    </span> */}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {localResultData.provider}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {localResultData.charCount} chars
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getWordCount(displayContent)} words
                    </span>
                  </div>
                </div>
                {audioSrc && (
                  <div className="flex items-center gap-3 ml-4">
                    <button
                      onClick={togglePlayAudio}
                      className="w-9 h-9 bg-[#0F2D63] dark:bg-[#0F2D63] rounded-full flex items-center justify-center text-white hover:bg-[#1a3d7a] transition-colors flex-shrink-0"
                    >
                      {isPlaying ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 ml-0.5" />
                      )}
                    </button>
                    <div className="flex-1 min-w-[80px]">
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#C85A32] rounded-full transition-all duration-300" 
                          style={{ width: `${audioProgress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-0.5">
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                          {formatDuration(audioRef.current?.currentTime || 0)}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                          {formatDuration(audioDuration)}
                        </span>
                      </div>
                    </div>
                    <Volume2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <audio
                      ref={audioRef}
                      src={audioSrc}
                      onTimeUpdate={handleAudioTimeUpdate}
                      onLoadedMetadata={handleAudioTimeUpdate}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
              
              {/* ✅ Content with Markdown Rendering */}
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {isEditing ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full min-h-[300px] p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 leading-relaxed text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A32] focus:border-transparent resize-y font-mono"
                    placeholder="Enter your speech content here..."
                  />
                ) : (
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-2xl font-bold text-[#0F2D63] dark:text-white mt-6 mb-4">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-semibold text-[#0F2D63] dark:text-white mt-5 mb-3">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-semibold text-[#0F2D63] dark:text-white mt-4 mb-2">{children}</h3>,
                      h4: ({ children }) => <h4 className="text-base font-semibold text-[#0F2D63] dark:text-white mt-3 mb-2">{children}</h4>,
                      p: ({ children }) => <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold text-[#0F2D63] dark:text-white">{children}</strong>,
                      ul: ({ children }) => <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-gray-700 dark:text-gray-300">{children}</li>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-[#C85A32] pl-4 py-1 my-3 text-gray-600 dark:text-gray-400 italic">{children}</blockquote>,
                      code: ({ children }) => <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-[#C85A32]">{children}</code>,
                      pre: ({ children }) => <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl overflow-x-auto my-3 text-sm">{children}</pre>,
                      hr: () => <hr className="my-6 border-gray-200 dark:border-gray-700" />,
                    }}
                  >
                    {localResultData.text}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          </div>

          {/* Parameters Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-[#0F2D63] dark:text-white mb-4">
                Voice Tone Parameters
              </h2>
              <div className="space-y-4">
                {Object.entries(localResultData.analysis).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {paramLabels[key]}
                      </span>
                      <span className={`text-xs font-semibold ${getParameterColor(value)}`}>
                        {value}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getParameterBgColor(value)} rounded-full transition-all duration-500`} 
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                      {paramDescriptions[key]}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Average Score
                  </span>
                  <span className="text-sm font-bold text-[#C85A32]">
                    {avgScore}/100
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Provider</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {localResultData.provider}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-gray-500 dark:text-gray-400">Model</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {localResultData.model}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-gray-500 dark:text-gray-400">Generated</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {new Date(localResultData.metadata.generatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-[#0F2D63] dark:text-white">
                    {localResultData.charCount.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Characters</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-[#0F2D63] dark:text-white">
                    {formatDuration(localResultData.duration)}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Duration</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-[#0F2D63] dark:text-white">
                    ${localResultData.cost.usd.toFixed(4)}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Cost (USD)</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-[#0F2D63] dark:text-white">
                    R{localResultData.cost.zar.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Cost (ZAR)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISpeechResult;