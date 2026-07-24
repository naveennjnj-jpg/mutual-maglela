// pages/user/CreateAIWriting.tsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  X,
  WandSparkles,
  PenTool,
  BookOpen,
  Lightbulb,
  Megaphone,
  Heart,
  FileText,
  Check,
  Loader2,
  AlertCircle,
  Upload
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

// ✅ Define document types with value and label
const DOCUMENT_TYPES = [
  { value: 'policy-brief', label: 'Policy Brief', icon: BookOpen },
  { value: 'op-ed', label: 'Op-Ed', icon: PenTool },
  { value: 'impact-report', label: 'Impact Report', icon: Lightbulb },
  { value: 'speech', label: 'Speech', icon: Megaphone },
  { value: 'press-release', label: 'Press Release', icon: Megaphone },
  { value: 'summary', label: 'Summary', icon: FileText },
  { value: 'media-story', label: 'Media Story', icon: Heart },
  { value: 'blog-post', label: 'Blog Post', icon: PenTool },
];

// ✅ Define tones with value and label
const TONE_OPTIONS = [
  { value: 'formal', label: 'Formal' },
  { value: 'authoritative', label: 'Clear & Authoritative' },
  { value: 'accessible', label: 'Accessible' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'neutral', label: 'Neutral' },
];

const CreateAIWriting = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState('policy-brief');
  const [selectedTone, setSelectedTone] = useState('authoritative');
  const [includeOutline, setIncludeOutline] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'create' | 'processing'>('create');
  const [processingStep, setProcessingStep] = useState(0);

  const processingSteps = [
    { label: 'Analysing your document…' },
    { label: 'Applying target tone and style…' },
    { label: 'Structuring your document…' },
    { label: 'Finalising output…' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['.pdf', '.docx', '.doc', '.txt'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validTypes.includes(fileExtension)) {
        setError('Please upload a valid file (PDF, DOCX, DOC, or TXT)');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
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

  // Mock content for demo
  const generateMockContent = () => {
    return `# ${title}

## Executive Summary

This document outlines the key strategic initiatives and partnerships that will drive our organization forward in the coming quarter. The following sections detail our approach, expected outcomes, and implementation timeline.

## Introduction

The rapidly evolving landscape of [industry/sector] demands innovative approaches to [core activity]. Our organization is committed to leading this transformation through strategic partnerships and targeted initiatives.

## Key Objectives

1. **Strategic Alignment**: Ensure all initiatives align with organizational goals
2. **Stakeholder Engagement**: Build and maintain strong relationships with key partners
3. **Impact Measurement**: Track and report on outcomes effectively
4. **Sustainable Growth**: Create long-term value through responsible practices

## Implementation Strategy

### Phase 1: Foundation
- Establish core partnerships
- Define clear metrics for success
- Build internal capacity

### Phase 2: Execution
- Launch key initiatives
- Monitor progress against targets
- Adapt and refine approach

### Phase 3: Scale
- Expand successful initiatives
- Share learnings and best practices
- Drive systemic change

## Expected Outcomes

By implementing this strategy, we anticipate:
- Increased stakeholder engagement
- Measurable impact on key metrics
- Strengthened organizational reputation
- Sustainable growth and innovation

## Conclusion

This strategic approach positions our organization to achieve meaningful impact while building lasting partnerships that will support our mission for years to come.`;
  };

  const generateMockOutline = () => {
    return [
      'Executive Summary',
      'Introduction',
      'Key Objectives',
      'Implementation Strategy',
      'Expected Outcomes',
      'Conclusion'
    ];
  };

  const handleGenerate = async () => {
    if (!title.trim()) {
      setError('Please enter a document title');
      return;
    }

    if (!selectedType) {
      setError('Please select a document type');
      return;
    }

    if (!file) {
      setError('Please upload a source document');
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

      // ✅ Prepare form data with correct enum values
      const formData = new FormData();
      formData.append('title', title);
      formData.append('type', selectedType); // ✅ Now sends 'policy-brief' not 'Policy Brief'
      formData.append('tone', selectedTone); // ✅ Now sends 'authoritative' not 'Clear & Authoritative'
      formData.append('includeOutline', String(includeOutline));
      formData.append('file', file);

      // Simulate processing steps
      for (let i = 0; i < processingSteps.length; i++) {
        setProcessingStep(i);
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));
      }

      // Make API call
      const response = await axios.post<ApiResponse>(
        `${API_URL}/api/ai-writing/generate`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const resultData = {
          title: title,
          type: selectedType,
          tone: selectedTone,
          content: response.data.data?.content || generateMockContent(),
          outline: response.data.data?.outline || generateMockOutline(),
          wordCount: response.data.data?.wordCount || Math.floor(Math.random() * 500) + 200,
          createdAt: new Date().toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          }),
          author: user?.name || 'AI Assistant'
        };

        navigate('/user/ai-writing/result', { state: { data: resultData } });
      } else {
        setError(response.data.message || 'Failed to generate document');
        setCurrentStep('create');
      }
    } catch (err: any) {
      console.error('Error generating document:', err);
      setError(err.response?.data?.message || 'Failed to generate document');
      setCurrentStep('create');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/user/ai-writing');
  };

  // Processing Screen
  const renderProcessing = () => (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl p-10 w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-[#FFF8F5] dark:bg-[#C85A32]/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <div className="w-8 h-8 border-2 border-[#C85A32]/30 border-t-[#C85A32] rounded-full animate-spin"></div>
        </div>
        <h3 className="font-semibold text-[#0F2D63] dark:text-white mb-1">Generating Your Content</h3>
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
            <h1 className="text-xl font-['Roboto'] font-bold text-[#0F2D63] dark:text-white">Create AI Writing</h1>
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
          {/* Step 1: Document Title */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
              <span className="inline-flex w-5 h-5 bg-[#0F2D63] dark:bg-[#0F2D63] text-white text-[10px] font-bold rounded-full items-center justify-center mr-2">
                1
              </span>
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q3 Partnership Announcement"
              className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C85A32] mt-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-400 transition-all"
            />
          </div>

          {/* Step 2: Desired Output */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
              <span className="inline-flex w-5 h-5 bg-[#0F2D63] dark:bg-[#0F2D63] text-white text-[10px] font-bold rounded-full items-center justify-center mr-2">
                2
              </span>
              Desired Output
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DOCUMENT_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#C85A32] bg-[#FFF8F5] dark:bg-[#C85A32]/10'
                        : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected 
                        ? 'bg-[#C85A32]' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <Icon className={`w-3.5 h-3.5 ${
                        isSelected ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                      }`} />
                    </div>
                    <span className={`text-xs font-semibold ${
                      isSelected ? 'text-[#C85A32]' : 'text-[#0F2D63] dark:text-white'
                    }`}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Target Tone */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
              <span className="inline-flex w-5 h-5 bg-[#0F2D63] dark:bg-[#0F2D63] text-white text-[10px] font-bold rounded-full items-center justify-center mr-2">
                3
              </span>
              Target Tone
            </p>
            <div className="flex flex-wrap gap-2">
              {TONE_OPTIONS.map((tone) => (
                <button
                  key={tone.value}
                  onClick={() => setSelectedTone(tone.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedTone === tone.value
                      ? 'bg-[#0F2D63] text-white border-[#0F2D63] dark:bg-[#0F2D63]'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Upload Document */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
              <span className="inline-flex w-5 h-5 bg-[#0F2D63] dark:bg-[#0F2D63] text-white text-[10px] font-bold rounded-full items-center justify-center mr-2">
                4
              </span>
              Upload Document
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 ml-7">
              Upload the source document to transform into your desired output
            </p>
            
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
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Step 5: Include AI Outline */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                  <span className="inline-flex w-5 h-5 bg-[#0F2D63] dark:bg-[#0F2D63] text-white text-[10px] font-bold rounded-full items-center justify-center mr-2">
                    5
                  </span>
                  Include AI Outline
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 ml-7">
                  Auto-generate a structured outline before writing
                </p>
              </div>
              <button
                onClick={() => setIncludeOutline(!includeOutline)}
                className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                  includeOutline ? 'bg-[#C85A32]' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${
                  includeOutline ? 'left-6' : 'left-1'
                }`}></div>
              </button>
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
                Generate
              </>
            )}
          </button>

          {/* Disclaimer */}
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex items-start gap-3">
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
    </div>
  );

  // Render based on current step
  if (currentStep === 'processing') {
    return renderProcessing();
  }

  return renderCreate();
};

export default CreateAIWriting;