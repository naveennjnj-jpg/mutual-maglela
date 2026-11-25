import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  X,
  WandSparkles,
  Mic,
  Upload,
  FileText,
  Check,
  Loader2,
  AlertCircle,
  MicOff,
  Square,
  Play,
  Pause,
  Volume2
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface CostData {
  usd: number;
  zar: number;
}

interface AnalysisData {
  authority: number;
  clarity: number;
  academicRigor: number;
  accessibility: number;
  narrativeDepth: number;
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
  file?: { name: string; size: number; mimetype: string };
  audio?: string;
  recordingDuration?: number;
}

type Level = 'low' | 'medium' | 'high';
type ParamKey = 'authority' | 'clarity' | 'academicRigor' | 'accessibility' | 'narrativeDepth';

const LEVEL_TO_SCORE: Record<Level, number> = { low: 30, medium: 65, high: 90 };

const PARAMS: {
  key: ParamKey;
  label: string;
  desc: string;
  lowLabel: string;
  highLabel: string;
}[] = [
  { key: 'authority',      label: 'Authority',       desc: 'Commanding presence and decisiveness',       lowLabel: 'Warm',      highLabel: 'Commanding' },
  { key: 'clarity',        label: 'Clarity',         desc: 'Clear articulation and message precision',   lowLabel: 'Nuanced',   highLabel: 'Crystal-clear' },
  { key: 'academicRigor',  label: 'Academic Rigor',  desc: 'Scholarly depth and evidence-based framing', lowLabel: 'Conversational', highLabel: 'Scholarly' },
  { key: 'accessibility',  label: 'Accessibility',   desc: 'Inclusive language for diverse audiences',   lowLabel: 'Expert-level', highLabel: 'Universal' },
  { key: 'narrativeDepth', label: 'Narrative Depth', desc: 'Storytelling richness and emotional resonance', lowLabel: 'Direct',  highLabel: 'Story-rich' },
];

const PRESETS: {
  id: string;
  label: string;
  desc: string;
  values: Record<ParamKey, Level>;
}[] = [
  {
    id: 'balanced',
    label: 'Balanced',
    desc: 'Even across the board — safe for most speeches.',
    values: { authority: 'medium', clarity: 'high', academicRigor: 'medium', accessibility: 'high', narrativeDepth: 'medium' },
  },
  {
    id: 'executive',
    label: 'Executive',
    desc: 'Commanding, decisive, board-room ready.',
    values: { authority: 'high', clarity: 'high', academicRigor: 'medium', accessibility: 'medium', narrativeDepth: 'medium' },
  },
  {
    id: 'academic',
    label: 'Academic',
    desc: 'Scholarly and evidence-led, for research audiences.',
    values: { authority: 'medium', clarity: 'high', academicRigor: 'high', accessibility: 'low', narrativeDepth: 'medium' },
  },
  {
    id: 'inspirational',
    label: 'Inspirational',
    desc: 'Story-rich and warm, for keynotes and graduations.',
    values: { authority: 'medium', clarity: 'medium', academicRigor: 'low', accessibility: 'high', narrativeDepth: 'high' },
  },
];

const CreateAISpeech = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [inputMethod, setInputMethod] = useState<'paste' | 'upload' | 'record'>('paste');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'create' | 'processing'>('create');
  const [processingStep, setProcessingStep] = useState(0);

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingName, setRecordingName] = useState('');
  const [recordingSize, setRecordingSize] = useState('');
  const [permissionDenied, setPermissionDenied] = useState(false);

  const [preset, setPreset] = useState<string>('balanced');
  const [levels, setLevels] = useState<Record<ParamKey, Level>>(PRESETS[0].values);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cancelledRef = useRef(false);

  const processingSteps = [
    { label: 'Analysing your content…' },
    { label: 'Calibrating voice tone parameters…' },
    { label: 'Generating speech output…' },
    { label: 'Finalising your speech…' },
  ];

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, [audioURL]);

  const applyPreset = (id: string) => {
    const p = PRESETS.find(x => x.id === id);
    if (!p) return;
    setPreset(id);
    setLevels(p.values);
  };

  const setLevel = (key: ParamKey, level: Level) => {
    setLevels(prev => ({ ...prev, [key]: level }));
    setPreset('custom');
  };

  const validateAndSetFile = (selected: File) => {
    const validTypes = ['.pdf', '.docx', '.doc', '.txt', '.mp3', '.wav'];
    const ext = selected.name.substring(selected.name.lastIndexOf('.')).toLowerCase();

    if (!validTypes.includes(ext)) {
      setError('Please upload a valid file (PDF, DOCX, DOC, TXT, MP3, or WAV)');
      return;
    }
    if (selected.size > 20 * 1024 * 1024) {
      setError('File size must be less than 20MB');
      return;
    }

    setFile(selected);
    setFileName(selected.name);
    setFileSize((selected.size / 1024).toFixed(1) + ' KB');
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) validateAndSetFile(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) validateAndSetFile(dropped);
  };

  const removeFile = () => {
    setFile(null);
    setFileName('');
    setFileSize('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      cancelledRef.current = false;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        if (cancelledRef.current) {
          audioChunksRef.current = [];
          return;
        }
        const recordedType = mediaRecorder.mimeType || 'audio/webm';
        const recordedBlob = new Blob(audioChunksRef.current, { type: recordedType });
        setAudioURL(URL.createObjectURL(recordedBlob));
        setAudioBlob(recordedBlob);
        setRecordingSize((recordedBlob.size / 1024).toFixed(1) + ' KB');
        setRecordingName(`Recording-${new Date().toLocaleDateString()}`);
      };

      mediaRecorder.start();
      setRecordingTime(0);
      setIsRecording(true);
      setIsPaused(false);
      setPermissionDenied(false);
      setError(null);

      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setPermissionDenied(true);
      setError('Unable to access microphone. Please check your permissions and try again.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const cancelRecording = () => {
    cancelledRef.current = true;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
    setIsPlaying(false);
    setRecordingTime(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
    }
    setAudioBlob(null);
    setRecordingName('');
    setRecordingSize('');
  };

  const togglePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const switchInputMethod = (method: 'paste' | 'upload' | 'record') => {
    if (method !== 'upload') {
      setFile(null);
      setFileName('');
      setFileSize('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
    if (method !== 'paste') setContent('');
    if (method !== 'record') {
      if (isRecording || audioBlob) cancelRecording();
      setAudioBlob(null);
      setAudioURL(null);
      setRecordingTime(0);
      setRecordingName('');
      setRecordingSize('');
    }
    setInputMethod(method);
    setError(null);
  };

  const handleGenerate = async () => {
    if (isSubmitting) return;

    if (!name.trim()) {
      setError('Please enter a speech name');
      return;
    }
    if (inputMethod === 'paste' && !content.trim()) {
      setError('Please paste your content');
      return;
    }
    if (inputMethod === 'upload' && !file) {
      setError('Please upload a file');
      return;
    }
    if (inputMethod === 'record' && !audioBlob) {
      setError('Please record your voice');
      return;
    }
    if (inputMethod === 'record' && isRecording) {
      setError('Please stop the recording first');
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError('Authentication required. Please log in again.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    setCurrentStep('processing');
    setProcessingStep(0);

    const stepTimer = setInterval(() => {
      setProcessingStep(p => Math.min(p + 1, processingSteps.length - 1));
    }, 6000);

    try {
      const formData = new FormData();
      formData.append('title', name.trim());

      formData.append('authority', String(LEVEL_TO_SCORE[levels.authority]));
      formData.append('clarity', String(LEVEL_TO_SCORE[levels.clarity]));
      formData.append('academicRigor', String(LEVEL_TO_SCORE[levels.academicRigor]));
      formData.append('accessibility', String(LEVEL_TO_SCORE[levels.accessibility]));
      formData.append('narrativeDepth', String(LEVEL_TO_SCORE[levels.narrativeDepth]));

      formData.append('inputMethod', inputMethod);

      if (inputMethod === 'paste') {
        formData.append('content', content);
      } else if (inputMethod === 'upload') {
        if (file) formData.append('file', file);
      } else if (inputMethod === 'record') {
        if (audioBlob) {
          const type = audioBlob.type || 'audio/webm';
          const ext = type.includes('mp4') ? 'm4a' : type.includes('ogg') ? 'ogg' : 'webm';
          const audioFile = new File(
            [audioBlob],
            `${recordingName || 'recording'}.${ext}`.replace(/[^\w.\-]+/g, '_'),
            { type }
          );
          formData.append('file', audioFile);
          formData.append('recordingDuration', String(recordingTime));
        }
      }

      const response = await axios.post<ApiResponse>(
        `${API_URL}/api/ai-speech/generate`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 300000,
        }
      );

      const backendData = response.data?.data;

      if (!response.data?.success || !backendData?.audioUrl) {
        let errorMessage: string =
          response.data?.message || 'The speech could not be generated. Please try again.';

        if (typeof errorMessage === 'string') {
          try {
            const parsed = JSON.parse(errorMessage);
            if (parsed?.message) {
              errorMessage = parsed.message;
              try {
                const inner = JSON.parse(errorMessage);
                if (inner?.message) errorMessage = inner.message;
              } catch {}
            }
          } catch {}
        }

        setError(errorMessage);
        setCurrentStep('create');
        return;
      }

      const resultData: SpeechData = {
        audioUrl: backendData.audioUrl,
        duration: backendData.duration || 0,
        format: backendData.format || 'mp3',
        size: backendData.size || 0,
        provider: backendData.provider || 'openai',
        model: backendData.model || 'tts-1',
        charCount: backendData.charCount || 0,
        text: backendData.text || '',
        cost: backendData.cost || { usd: 0, zar: 0 },
        analysis: backendData.analysis || {
          authority: LEVEL_TO_SCORE[levels.authority],
          clarity: LEVEL_TO_SCORE[levels.clarity],
          academicRigor: LEVEL_TO_SCORE[levels.academicRigor],
          accessibility: LEVEL_TO_SCORE[levels.accessibility],
          narrativeDepth: LEVEL_TO_SCORE[levels.narrativeDepth],
        },
        metadata: {
          title: backendData.metadata?.title || name,
          generatedAt: backendData.metadata?.generatedAt || new Date().toISOString(),
        },
        ...(backendData.file && { file: backendData.file }),
        ...(backendData.audio && { audio: backendData.audio }),
        ...(backendData.recordingDuration && { recordingDuration: backendData.recordingDuration }),
      };

      setProcessingStep(processingSteps.length - 1);
      navigate('/user/ai-speech/result', { state: { data: resultData } });

    } catch (err: any) {
      console.error('Error generating speech:', err);
      const status = err.response?.status;

      let errorMessage: string | null = null;
      const rawMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data;

      if (typeof rawMessage === 'string') {
        errorMessage = rawMessage;
        try {
          const parsed = JSON.parse(rawMessage);
          if (parsed?.message) {
            errorMessage = parsed.message;
            try {
              const inner = JSON.parse(errorMessage);
              if (inner?.message) errorMessage = inner.message;
            } catch {}
          }
        } catch {}
      }

      setError(
        errorMessage ||
          (err.code === 'ECONNABORTED'
            ? 'The request timed out. Please try again with shorter content.'
            : status === 402
            ? 'Insufficient credits. Please top up your credits.'
            : 'Failed to generate speech. Please try again.')
      );

      setCurrentStep('create');
    } finally {
      clearInterval(stepTimer);
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/user/voice-calibrator');
  };

  const renderProcessing = () => (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl p-6 sm:p-10 w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-[#FFF8F5] dark:bg-[#C85A32]/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <div className="w-8 h-8 border-2 border-[#C85A32]/30 border-t-[#C85A32] rounded-full animate-spin"></div>
        </div>
        <h3 className="font-semibold text-[#0F2D63] dark:text-white mb-1">Generating Your Speech</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">This can take up to a minute…</p>
        <div className="space-y-2.5">
          {processingSteps.map((step, index) => {
            const isCompleted = index < processingStep;
            const isActive = index === processingStep;
            return (
              <div
                key={index}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isCompleted ? 'opacity-40' :
                  isActive ? 'bg-[#FFF8F5] dark:bg-[#C85A32]/10' : 'opacity-40'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {isCompleted ? (
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-500" />
                    </div>
                  ) : isActive ? (
                    <div className="w-3 h-3 border-2 border-[#C85A32]/40 border-t-[#C85A32] rounded-full animate-spin"></div>
                  ) : null}
                </div>
                <span className={`text-xs ${
                  isActive ? 'text-[#0F2D63] dark:text-white font-medium' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderCreate = () => (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-3 sm:p-6">
      <div className="max-w-[680px] mx-auto">

        <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#0F2D63] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <div className="min-w-0">
            <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest">AI Tools</p>
            <h1 className="text-lg sm:text-xl font-bold text-[#0F2D63] dark:text-white">Create AI Speech</h1>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="min-w-0 break-words">{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:gap-4">

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 sm:p-5">
            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
              <span className="inline-flex w-5 h-5 bg-[#0F2D63] text-white text-[10px] font-bold rounded-full items-center justify-center mr-2">1</span>
              Speech Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. VC Opening Address – RUFORUM 2026"
              className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C85A32] mt-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-400 transition-all"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 sm:p-5">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
              <span className="inline-flex w-5 h-5 bg-[#0F2D63] text-white text-[10px] font-bold rounded-full items-center justify-center mr-2">2</span>
              Voice Tone
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Pick a preset — or fine-tune each one below.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-5">
              {PRESETS.map((p) => {
                const active = preset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPreset(p.id)}
                    className={`text-left rounded-xl border p-3 transition-all ${
                      active
                        ? 'border-[#C85A32] bg-[#FFF8F5] dark:bg-[#C85A32]/10 ring-1 ring-[#C85A32]/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-[#C85A32]/60 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-xs font-bold ${active ? 'text-[#C85A32]' : 'text-[#0F2D63] dark:text-white'}`}>
                        {p.label}
                      </p>
                      {active && (
                        <span className="w-4 h-4 rounded-full bg-[#C85A32] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-snug">
                      {p.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Fine-tune
              </span>
              <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
            </div>

            <div className="space-y-3">
              {PARAMS.map((param) => {
                const current = levels[param.key];
                return (
                  <div
                    key={param.key}
                    className="rounded-xl border border-gray-100 dark:border-gray-700 p-3"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#0F2D63] dark:text-white">
                          {param.label}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">
                          {param.desc}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 bg-[#f4f6fb] dark:bg-gray-900 rounded-lg p-1">
                      {(['low', 'medium', 'high'] as Level[]).map((lvl) => {
                        const isActive = current === lvl;
                        const label =
                          lvl === 'low' ? param.lowLabel :
                          lvl === 'high' ? param.highLabel :
                          'Balanced';
                        return (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setLevel(param.key, lvl)}
                            className={`text-[11px] font-semibold py-1.5 px-1 rounded-md transition-all truncate ${
                              isActive
                                ? 'bg-white dark:bg-gray-700 text-[#C85A32] shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-[#0F2D63] dark:hover:text-white'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-0">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                <span className="inline-flex w-5 h-5 bg-[#0F2D63] text-white text-[10px] font-bold rounded-full items-center justify-center mr-2">3</span>
                Add Your Content
              </p>
              <div className="flex gap-1 bg-[#f4f6fb] dark:bg-gray-700 rounded-xl p-1">
                <button
                  onClick={() => switchInputMethod('upload')}
                  className={`flex-1 py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                    inputMethod === 'upload' ? 'bg-white dark:bg-gray-600 text-[#0F2D63] dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Upload
                </button>
                <button
                  onClick={() => switchInputMethod('paste')}
                  className={`flex-1 py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                    inputMethod === 'paste' ? 'bg-white dark:bg-gray-600 text-[#0F2D63] dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Paste
                </button>
                <button
                  onClick={() => switchInputMethod('record')}
                  className={`flex-1 py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                    inputMethod === 'record' ? 'bg-white dark:bg-gray-600 text-[#0F2D63] dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Record
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              {inputMethod === 'upload' ? (
                <>
                  {file ? (
                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-[#FFF8F5] dark:bg-[#C85A32]/10 border border-[#C85A32]/20 rounded-xl">
                      <div className="w-10 h-10 bg-[#C85A32]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-[#C85A32]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0F2D63] dark:text-white truncate">{fileName}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{fileSize}</p>
                      </div>
                      <button
                        onClick={removeFile}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#C85A32]/10 text-gray-400 hover:text-[#C85A32] transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#C85A32] hover:bg-[#FFF8F5] dark:hover:bg-[#C85A32]/5 transition-all group"
                    >
                      <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#C85A32] transition-colors flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 group-hover:text-[#C85A32] transition-colors text-center">
                        Click to upload or drag and drop
                      </span>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt,.mp3,.wav"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </>
              ) : inputMethod === 'paste' ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={7}
                  placeholder="Paste your speech content, notes, or key talking points here…"
                  className="w-full text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3.5 resize-none focus:outline-none focus:border-[#C85A32] transition-colors leading-relaxed"
                />
              ) : (
                <div className="space-y-4">
                  {permissionDenied && (
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
                      <MicOff className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <p className="text-sm text-red-600 dark:text-red-300">Microphone access denied</p>
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                        Please allow microphone access in your browser settings and try again.
                      </p>
                      <button
                        onClick={startRecording}
                        className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                  {!permissionDenied && (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 sm:p-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${isRecording ? 'animate-pulse bg-red-500' : 'bg-gray-400'}`}></div>
                          <span className="text-xl sm:text-2xl font-mono font-bold text-[#0F2D63] dark:text-white">
                            {formatTime(recordingTime)}
                          </span>
                          {isPaused && (
                            <span className="text-xs text-amber-500 font-medium">Paused</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                        {!isRecording && !audioURL && (
                          <button
                            onClick={startRecording}
                            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium text-sm transition-colors"
                          >
                            <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                            Start Recording
                          </button>
                        )}

                        {isRecording && !isPaused && (
                          <>
                            <button
                              onClick={pauseRecording}
                              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-medium text-sm transition-colors"
                            >
                              <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                              Pause
                            </button>
                            <button
                              onClick={stopRecording}
                              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium text-sm transition-colors"
                            >
                              <Square className="w-4 h-4 sm:w-5 sm:h-5" />
                              Stop
                            </button>
                          </>
                        )}

                        {isRecording && isPaused && (
                          <>
                            <button
                              onClick={resumeRecording}
                              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium text-sm transition-colors"
                            >
                              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                              Resume
                            </button>
                            <button
                              onClick={stopRecording}
                              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium text-sm transition-colors"
                            >
                              <Square className="w-4 h-4 sm:w-5 sm:h-5" />
                              Stop
                            </button>
                          </>
                        )}
                      </div>

                      {audioURL && (
                        <div className="mt-4 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-3 sm:gap-4">
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
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Volume2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                                  <div className="h-full bg-[#C85A32] rounded-full" style={{ width: '100%' }}></div>
                                </div>
                              </div>
                              <div className="flex justify-between mt-1 gap-2">
                                <span className="text-xs text-gray-400 truncate">{recordingName || 'Recording'}</span>
                                <span className="text-xs text-gray-400 flex-shrink-0">{recordingSize || '0 KB'}</span>
                              </div>
                            </div>
                            <button
                              onClick={cancelRecording}
                              className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <audio
                            ref={audioRef}
                            src={audioURL}
                            onEnded={() => setIsPlaying(false)}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-3.5 text-sm font-semibold transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <WandSparkles className="w-4 h-4" />
                Create AI Speech
              </>
            )}
          </button>

          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-3 sm:p-4 flex items-start gap-3">
            <span className="text-amber-500 text-base flex-shrink-0 mt-0.5">⚠️</span>
            <div>
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1">Disclaimer</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                AI-generated content from Magalela Media Services may contain inaccuracies and is not intended for immediate publication. All outputs must be submitted to an editor for final review and approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (currentStep === 'processing') return renderProcessing();
  return renderCreate();
};

export default CreateAISpeech;