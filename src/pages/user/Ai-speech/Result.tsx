// pages/user/Ai-speech/Result.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Zap
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

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
}

// ============================================
// COMPONENT
// ============================================

const AISpeechResult = () => {
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
  const [isSaved, setIsSaved] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ✅ Get data from location state
  const resultData = location.state?.data as SpeechData;

  // ✅ Set audio source
  useEffect(() => {
    if (resultData?.audioUrl) {
      if (resultData.audioUrl.startsWith('data:audio')) {
        // Base64 audio - use directly
        setAudioSrc(resultData.audioUrl);
      } else if (resultData.audioUrl.startsWith('/uploads/')) {
        // Server path - use API URL
        setAudioSrc(`${API_URL}${resultData.audioUrl}`);
      } else if (resultData.audioUrl.startsWith('http')) {
        // Full URL - use as is
        setAudioSrc(resultData.audioUrl);
      } else {
        // Try as server path
        setAudioSrc(`${API_URL}/uploads/audio/${resultData.audioUrl}`);
      }
    }
  }, [resultData, API_URL]);

  // ✅ Redirect if no data
  useEffect(() => {
    if (!resultData) {
      navigate('/user/ai-speech');
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
    if (resultData?.text) {
      try {
        await navigator.clipboard.writeText(resultData.text);
        setError(null);
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
    if (resultData?.text) {
      const blob = new Blob([resultData.text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resultData.metadata.title.toLowerCase().replace(/\s+/g, '-')}-speech.txt`;
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
    if (!resultData?.audioUrl) {
      setError('No audio file available to download');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}${resultData.audioUrl}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resultData.metadata.title.toLowerCase().replace(/\s+/g, '-')}-audio.mp3`;
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
  // HANDLE SAVE
  // ============================================

  const handleSave = async () => {
    if (isSaved) {
      setError('This speech is already saved');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      
      // Calculate average score
      const avgScore = Math.floor(
        (resultData.analysis.authority + 
         resultData.analysis.clarity + 
         resultData.analysis.academicRigor + 
         resultData.analysis.accessibility + 
         resultData.analysis.narrativeDepth) / 5
      );

      const saveData = {
        title: resultData.metadata.title,
        content: resultData.text,
        parameters: resultData.analysis,
        duration: formatDuration(resultData.duration),
        avgScore: avgScore,
        author: user?.name || 'AI Assistant',
        provider: resultData.provider,
        model: resultData.model,
        charCount: resultData.charCount,
        cost: resultData.cost,
        generatedAt: resultData.metadata.generatedAt
      };

      const response = await axios.post(
        `${API_URL}/api/ai-speech/save`,
        saveData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setIsSaved(true);
        setError(null);
        alert('Speech saved successfully!');
      } else {
        setError(response.data.message || 'Failed to save speech');
      }
    } catch (err: any) {
      console.error('Error saving speech:', err);
      setError(err.response?.data?.message || 'Failed to save speech');
    } finally {
      setIsLoading(false);
    }
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

  const handleEdit = () => {
    navigate('/user/voice-calibrator/create', { 
      state: { editData: resultData } 
    });
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

  // ============================================
  // RENDER - Loading State
  // ============================================

  if (!resultData) {
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
    (resultData.analysis.authority + 
     resultData.analysis.clarity + 
     resultData.analysis.academicRigor + 
     resultData.analysis.accessibility + 
     resultData.analysis.narrativeDepth) / 5
  );

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6">
      <div className="max-w-[1000px] mx-auto">
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
            {resultData.metadata.title}
          </span>
        </div>

        {/* Action Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-5 py-3 mb-5 flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSave}
            disabled={isLoading || isSaved}
            className="flex items-center gap-1.5 bg-[#C85A32] hover:bg-[#a8472a] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 text-xs font-semibold transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isSaved ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {isSaved ? 'Saved' : 'Save'}
          </button>
          {/* <button
            onClick={handleEdit}
            className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl px-4 py-2 text-xs font-medium transition-colors"
          >
            <PenLine className="w-3.5 h-3.5" />
            Edit
          </button> */}
          <button
            onClick={handleNewSpeech}
            className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl px-4 py-2 text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Speech
          </button>
          <div className="ml-auto flex items-center gap-2">
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
              Export
            </button>
            {resultData.audioUrl && (
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
                <div>
                  <h2 className="font-semibold text-[#0F2D63] dark:text-white">
                    {resultData.metadata.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Duration: {formatDuration(resultData.duration)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Score: {avgScore}/100
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      ${resultData.cost.usd.toFixed(4)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {resultData.provider}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {resultData.charCount} chars
                    </span>
                  </div>
                </div>
                {audioSrc && (
                  <div className="flex items-center gap-3">
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
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                {resultData.text}
              </pre>
            </div>
          </div>

          {/* Parameters Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-[#0F2D63] dark:text-white mb-4">
                Voice Tone Parameters
              </h2>
              <div className="space-y-4">
                {Object.entries(resultData.analysis).map(([key, value]) => (
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
              {/* Provider Info */}
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Provider</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {resultData.provider}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-gray-500 dark:text-gray-400">Model</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {resultData.model}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-gray-500 dark:text-gray-400">Generated</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {new Date(resultData.metadata.generatedAt).toLocaleString()}
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
                    {resultData.charCount.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Characters</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-[#0F2D63] dark:text-white">
                    {formatDuration(resultData.duration)}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Duration</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-[#0F2D63] dark:text-white">
                    ${resultData.cost.usd.toFixed(4)}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Cost (USD)</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-[#0F2D63] dark:text-white">
                    R{resultData.cost.zar.toFixed(2)}
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