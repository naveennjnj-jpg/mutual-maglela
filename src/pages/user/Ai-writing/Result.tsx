// pages/user/Ai-writing/Result.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft,
  Copy,
  Download,
  Edit,
  Eye,
  Check,
  FileText,
  Calendar,
  User,
  Sparkles,
  Clock
} from 'lucide-react';

interface ResultData {
  title: string;
  type: string;
  tone: string;
  content: string;
  outline: string[];
  wordCount: number;
  createdAt: string;
  author: string;
}

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const resultData = location.state?.data as ResultData || getMockResult();

  const handleCopyContent = () => {
    if (resultData?.content) {
      navigator.clipboard.writeText(resultData.content);
      // You can add toast notification here
      alert('Content copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (resultData?.content) {
      const blob = new Blob([resultData.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resultData.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleEdit = () => {
    // Navigate to edit page or open editor
    navigate('/user/ai-writing/edit', { state: { data: resultData } });
  };

  const handleBack = () => {
    navigate('/user/ai-writing');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!resultData) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">No content found</p>
          <button
            onClick={handleBack}
            className="mt-4 text-[#C85A32] hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6">
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#0F2D63] dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to AI Writing
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyContent}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors text-gray-600 dark:text-gray-300"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors text-gray-600 dark:text-gray-300"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl text-sm font-medium transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>

        {/* Document Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#0F2D63] dark:text-white">
                {resultData.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full">
                  {resultData.type}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Tone: {resultData.tone}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {resultData.wordCount} words
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {resultData.createdAt || 'Just now'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" />
                Generated
              </div>
            </div>
          </div>
        </div>

        {/* Content Display */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Outline */}
          {resultData.outline && resultData.outline.length > 0 && (
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-[#0F2D63] dark:text-white mb-3">Outline</h3>
              <div className="flex flex-wrap gap-2">
                {resultData.outline.map((item: string, index: number) => (
                  <span 
                    key={index} 
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full"
                  >
                    {index + 1}. {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {resultData.content ? (
                <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                  {resultData.content}
                </div>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 text-center py-8">
                  No content available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate('/user/ai-writing')}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl py-3 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to AI Writing
          </button>
          <button
            onClick={handleEdit}
            className="flex-1 flex items-center justify-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl py-3 text-sm font-semibold transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Document
          </button>
        </div>
      </div>
    </div>
  );
};

// Mock data for fallback
const getMockResult = (): ResultData => {
  return {
    title: 'Annual Report Executive Summary',
    type: 'Impact Story',
    tone: 'Inspiring',
    wordCount: 450,
    createdAt: 'Just now',
    author: 'AI Assistant',
    content: `# Annual Report Executive Summary

## Introduction

This annual report highlights our organization's key achievements and strategic initiatives over the past year. Through collaborative partnerships and innovative approaches, we have made significant progress in advancing our mission.

## Key Achievements

### 1. Strategic Partnerships
- Established 5 new institutional partnerships
- Expanded our network across 3 African countries
- Launched collaborative research initiatives

### 2. Impact Metrics
- Reached over 10,000 stakeholders
- Published 15 research papers
- Conducted 20 training workshops

### 3. Innovation Highlights
- Launched AI-powered communication tools
- Developed new training methodologies
- Implemented digital transformation initiatives

## Looking Forward

Our commitment to excellence and innovation continues to drive our work. We look forward to building on these achievements and creating even greater impact in the coming year.

## Conclusion

The past year has been one of growth and meaningful impact. We thank all our partners and stakeholders for their continued support and collaboration.`,
    outline: [
      'Introduction',
      'Key Achievements',
      'Strategic Partnerships',
      'Impact Metrics',
      'Innovation Highlights',
      'Looking Forward',
      'Conclusion'
    ]
  };
};

export default Result;