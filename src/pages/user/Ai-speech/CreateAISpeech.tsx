// pages/user/Ai-speech/CreateAISpeech.tsx
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
  Clock,
  Volume2
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface SpeechData {
  name: string;
  content: string;
  parameters: {
    authority: number;
    clarity: number;
    academicRigor: number;
    accessibility: number;
    narrativeDepth: number;
  };
  duration: string;
  avgScore: number;
  created: string;
  author: string;
}

const CreateAISpeech = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
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

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingName, setRecordingName] = useState('');
  const [recordingSize, setRecordingSize] = useState('');
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Voice Tone Parameters
  const [parameters, setParameters] = useState({
    authority: 58,
    clarity: 95,
    academicRigor: 58,
    accessibility: 89,
    narrativeDepth: 93,
  });

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const processingSteps = [
    { label: 'Analysing your content…' },
    { label: 'Calibrating voice tone parameters…' },
    { label: 'Generating speech output…' },
    { label: 'Finalising your speech…' },
  ];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const handleParameterChange = (param: string, value: number) => {
    setParameters(prev => ({ ...prev, [param]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['.pdf', '.docx', '.doc', '.txt', '.mp3', '.wav'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validTypes.includes(fileExtension)) {
        setError('Please upload a valid file (PDF, DOCX, DOC, TXT, MP3, or WAV)');
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        setError('File size must be less than 20MB');
        return;
      }

      setFile(file);
      setFileName(file.name);
      setFileSize((file.size / 1024).toFixed(1) + ' KB');
      setError(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileName('');
    setFileSize('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ============================================
  // RECORDING FUNCTIONS
  // ============================================

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setAudioBlob(audioBlob);
        setRecordingSize((audioBlob.size / 1024).toFixed(1) + ' KB');
        setRecordingName(`Recording-${new Date().toLocaleDateString()}`);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setPermissionDenied(false);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

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
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
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
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ============================================
  // GENERATE FUNCTION WITH BACKEND INTEGRATION
  // ============================================

  const handleGenerate = async () => {
    // Validation
    if (!name.trim()) {
      setError('Please enter a speech name');
      return;
    }

    if (!content.trim() && !file && !audioBlob) {
      setError('Please add content, upload a file, or record your voice');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    setCurrentStep('processing');
    setProcessingStep(0);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError('Authentication required');
        setIsSubmitting(false);
        setCurrentStep('create');
        return;
      }

      // Step 1: Analysing your content
      setProcessingStep(0);
      await new Promise(resolve => setTimeout(resolve, 600));

      // Prepare form data for backend
      const formData = new FormData();
      formData.append('name', name);
      formData.append('content', content || '');
      formData.append('authority', String(parameters.authority));
      formData.append('clarity', String(parameters.clarity));
      formData.append('academicRigor', String(parameters.academicRigor));
      formData.append('accessibility', String(parameters.accessibility));
      formData.append('narrativeDepth', String(parameters.narrativeDepth));
      formData.append('inputMethod', inputMethod);

      // Append file if uploaded
      if (file) {
        formData.append('file', file);
      }

      // Append audio recording if recorded
      if (audioBlob) {
        const audioFile = new File([audioBlob], `${recordingName || 'recording'}.wav`, { type: 'audio/wav' });
        formData.append('audio', audioFile);
        formData.append('recordingDuration', formatTime(recordingTime));
      }

      // Step 2: Calibrating voice tone parameters
      setProcessingStep(1);
      await new Promise(resolve => setTimeout(resolve, 600));

      // Send to backend
      const response = await axios.post<ApiResponse>(
        `${API_URL}/api/ai-speech/generate`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Step 3: Generating speech output
      setProcessingStep(2);
      await new Promise(resolve => setTimeout(resolve, 600));

      if (response.data.success) {
        // Prepare data for result page
        const resultData: SpeechData = {
          name: name,
          content: response.data.data?.content || content || 'Generated speech content',
          parameters: parameters,
          duration: response.data.data?.duration || formatTime(recordingTime || 0),
          avgScore: response.data.data?.avgScore || Math.floor(
            (parameters.authority + parameters.clarity + parameters.academicRigor + 
             parameters.accessibility + parameters.narrativeDepth) / 5
          ),
          created: new Date().toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          }),
          author: user?.name || 'AI Assistant'
        };

        // Step 4: Finalising your speech
        setProcessingStep(3);
        await new Promise(resolve => setTimeout(resolve, 400));

        // Navigate to result page
        navigate('/user/ai-speech/result', { state: { data: resultData } });
      } else {
        setError(response.data.message || 'Failed to generate speech');
        setCurrentStep('create');
      }
    } catch (err: any) {
      console.error('Error generating speech:', err);
      setError(err.response?.data?.message || 'Failed to generate speech. Please try again.');
      setCurrentStep('create');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/user/ai-speech');
  };

  // Processing Screen
  const renderProcessing = () => (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl p-10 w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-[#FFF8F5] dark:bg-[#C85A32]/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <div className="w-8 h-8 border-2 border-[#C85A32]/30 border-t-[#C85A32] rounded-full animate-spin"></div>
        </div>
        <h3 className="font-semibold text-[#0F2D63] dark:text-white mb-1">Generating Your Speech</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">This will only take a moment…</p>
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

  // Create Screen
  const renderCreate = () => (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6">
      <div className="max-w-[680px] mx-auto">
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
          <div>
            <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest">AI Tools</p>
            <h1 className="text-xl font-['Roboto'] font-bold text-[#0F2D63] dark:text-white">Create AI Speech</h1>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Step 1: Speech Name */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
              <span className="inline-flex w-5 h-5 bg-[#0F2D63] dark:bg-[#0F2D63] text-white text-[10px] font-bold rounded-full items-center justify-center mr-2">1</span>
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

          {/* Step 2: Voice Tone Parameters */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
              <span className="inline-flex w-5 h-5 bg-[#0F2D63] dark:bg-[#0F2D63] text-white text-[10px] font-bold rounded-full items-center justify-center mr-2">2</span>
              Voice Tone Parameters
            </p>
            <div className="space-y-5">
              {[
                { key: 'authority', label: 'Authority', desc: 'Commanding presence and decisiveness' },
                { key: 'clarity', label: 'Clarity', desc: 'Clear articulation and message precision' },
                { key: 'academicRigor', label: 'Academic Rigor', desc: 'Scholarly depth and evidence-based framing' },
                { key: 'accessibility', label: 'Accessibility', desc: 'Inclusive language for diverse audiences' },
                { key: 'narrativeDepth', label: 'Narrative Depth', desc: 'Storytelling richness and emotional resonance' },
              ].map((param) => (
                <div key={param.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="text-xs font-semibold text-[#0F2D63] dark:text-white">{param.label}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">{param.desc}</p>
                    </div>
                    <span className="text-sm font-bold text-[#C85A32] min-w-[36px] text-right">
                      {parameters[param.key as keyof typeof parameters]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={parameters[param.key as keyof typeof parameters]}
                    onChange={(e) => handleParameterChange(param.key, parseInt(e.target.value))}
                    className="w-full cursor-pointer accent-[#C85A32]"
                  />
                  <div className="flex justify-between mt-0.5">
                    <span className="text-[10px] text-gray-300 dark:text-gray-600">Low</span>
                    <span className="text-[10px] text-gray-300 dark:text-gray-600">High</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Add Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-0">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                <span className="inline-flex w-5 h-5 bg-[#0F2D63] dark:bg-[#0F2D63] text-white text-[10px] font-bold rounded-full items-center justify-center mr-2">3</span>
                Add Your Content
              </p>
              <div className="flex gap-1 bg-[#f4f6fb] dark:bg-gray-700 rounded-xl p-1">
                <button
                  onClick={() => {
                    setInputMethod('upload');
                    if (isRecording) cancelRecording();
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                    inputMethod === 'upload' ? 'bg-white dark:bg-gray-600 text-[#0F2D63] dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Upload File
                </button>
                <button
                  onClick={() => {
                    setInputMethod('paste');
                    if (isRecording) cancelRecording();
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                    inputMethod === 'paste' ? 'bg-white dark:bg-gray-600 text-[#0F2D63] dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Paste Content
                </button>
                <button
                  onClick={() => {
                    setInputMethod('record');
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                    inputMethod === 'record' ? 'bg-white dark:bg-gray-600 text-[#0F2D63] dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Record Your Voice
                </button>
              </div>
            </div>
            <div className="p-5">
              {inputMethod === 'upload' ? (
                <>
                  {file ? (
                    <div className="flex items-center gap-3 p-4 bg-[#FFF8F5] dark:bg-[#C85A32]/10 border border-[#C85A32]/20 rounded-xl">
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
                      className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#C85A32] hover:bg-[#FFF8F5] dark:hover:bg-[#C85A32]/5 transition-all group"
                    >
                      <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#C85A32] transition-colors" />
                      <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-[#C85A32] transition-colors">
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
                // Record Your Voice
                <div className="space-y-4">
                  {/* Permission Denied */}
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

                  {/* Recording Controls */}
                  {!permissionDenied && (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                      {/* Timer Display */}
                      <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${isRecording ? 'animate-pulse bg-red-500' : 'bg-gray-400'}`}></div>
                          <span className="text-2xl font-mono font-bold text-[#0F2D63] dark:text-white">
                            {formatTime(recordingTime)}
                          </span>
                          {isPaused && (
                            <span className="text-xs text-amber-500 font-medium">Paused</span>
                          )}
                        </div>
                      </div>

                      {/* Recording Controls */}
                      <div className="flex items-center justify-center gap-3">
                        {!isRecording && !audioURL && (
                          <button
                            onClick={startRecording}
                            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-colors"
                          >
                            <Mic className="w-5 h-5" />
                            Start Recording
                          </button>
                        )}

                        {isRecording && !isPaused && (
                          <>
                            <button
                              onClick={pauseRecording}
                              className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-medium transition-colors"
                            >
                              <Pause className="w-5 h-5" />
                              Pause
                            </button>
                            <button
                              onClick={stopRecording}
                              className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-colors"
                            >
                              <Square className="w-5 h-5" />
                              Stop
                            </button>
                          </>
                        )}

                        {isRecording && isPaused && (
                          <>
                            <button
                              onClick={resumeRecording}
                              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition-colors"
                            >
                              <Mic className="w-5 h-5" />
                              Resume
                            </button>
                            <button
                              onClick={stopRecording}
                              className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-colors"
                            >
                              <Square className="w-5 h-5" />
                              Stop
                            </button>
                          </>
                        )}
                      </div>

                      {/* Audio Preview */}
                      {audioURL && (
                        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={togglePlayAudio}
                              className="w-10 h-10 bg-[#C85A32] hover:bg-[#a8472a] rounded-full flex items-center justify-center text-white transition-colors"
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
                                <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                                  <div className="h-full bg-[#C85A32] rounded-full" style={{ width: '100%' }}></div>
                                </div>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-gray-400">{recordingName || 'Recording'}</span>
                                <span className="text-xs text-gray-400">{recordingSize || '0 KB'}</span>
                              </div>
                            </div>
                            <button
                              onClick={cancelRecording}
                              className="text-gray-400 hover:text-red-500 transition-colors"
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

          {/* Generate Button */}
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

          {/* Disclaimer */}
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3">
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

  if (currentStep === 'processing') {
    return renderProcessing();
  }

  return renderCreate();
};

export default CreateAISpeech;