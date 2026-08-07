// pages/user/Ai-writing/Result.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
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
  Clock,
  Save,
  X,
  Plus,
  Coins
} from 'lucide-react';

interface ResultData {
  title: string;
  type: string;
  tone: string;
  content: string;
  outline: string[] | string;
  wordCount: number;
  createdAt: string;
  author: string;
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

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resultData, setResultData] = useState<ResultData>(
    location.state?.data as ResultData || getMockResult()
  );
  
  // ✅ User credits state
  const [userData, setUserData] = useState<UserData>({
    id: '',
    name: 'User',
    email: '',
    role: 'user',
    credits: 0,
    initials: 'U'
  });
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(resultData.title);
  const [editContent, setEditContent] = useState(resultData.content);
  const [isSaving, setIsSaving] = useState(false);

  // ✅ Fetch updated user data (to get latest credits)
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

        // ✅ Update localStorage for header
        localStorage.setItem('userCredits', credits.toString());
        localStorage.setItem('userName', data.name || 'User');
        localStorage.setItem('userEmail', data.email || '');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch user data on mount
  useEffect(() => {
    fetchUpdatedUserData();
  }, []);

  // ✅ Also check if result has credits info from API response
  useEffect(() => {
    if (location.state?.data?.creditsRemaining !== undefined) {
      // Update local state with credits from API response
      const credits = location.state.data.creditsRemaining;
      setUserData(prev => ({ ...prev, credits }));
      localStorage.setItem('userCredits', credits.toString());
    }
  }, [location.state]);

  const handleCopyContent = () => {
    if (resultData?.content) {
      navigator.clipboard.writeText(resultData.content);
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

  const handleEditToggle = () => {
    if (isEditing) {
      setEditTitle(resultData.title);
      setEditContent(resultData.content);
      setIsEditing(false);
    } else {
      setEditTitle(resultData.title);
      setEditContent(resultData.content);
      setIsEditing(true);
    }
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      setResultData({
        ...resultData,
        title: editTitle.trim() || resultData.title,
        content: editContent.trim() || resultData.content,
        wordCount: editContent.trim().split(/\s+/).length || 0,
      });
      setIsEditing(false);
      setIsSaving(false);
      alert('Changes saved successfully!');
    }, 500);
  };

  const handleBack = () => {
    navigate('/user/narrative-engine');
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // ✅ Convert outline to markdown string
  const getOutlineMarkdown = () => {
    const outline = resultData.outline;
    if (!outline) return null;

    let items: string[] = [];

    if (typeof outline === 'string') {
      if (outline.includes('**') || outline.includes('#')) {
        return outline;
      }
      items = outline.split(/\n(?=\d+\.)/).map((item: string) => {
        return item.replace(/^\d+\.\s*/, '').trim();
      }).filter(Boolean);
    } else if (Array.isArray(outline)) {
      items = outline;
    }

    if (items.length === 0) return null;

    return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
  };

  // ✅ Combined content with outline + main content
  const getFullMarkdownContent = () => {
    let fullContent = '';
    
    if (getOutlineMarkdown()) {
      fullContent += `## Outline\n\n${getOutlineMarkdown()}\n\n---\n\n`;
    }

    if (resultData.content) {
      fullContent += resultData.content;
    }

    return fullContent;
  };

  if (!resultData) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">No content found</p>
          <button onClick={handleBack} className="mt-4 text-[#C85A32] hover:underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const fullMarkdownContent = getFullMarkdownContent();

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6">
      <div className="max-w-[1000px] mx-auto">
        {/* ✅ Credits Display Banner */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F9F7F4] dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Coins className="w-5 h-5 text-[#C85A32]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Available Credits</p>
              <p className="text-xl font-bold text-[#0F2D63] dark:text-white">
                {loading ? '...' : userData.credits}
              </p>
            </div>
          </div>
          {resultData.creditsUsed !== undefined && (
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Credits Used</p>
              <p className="text-sm font-semibold text-[#C85A32]">
                -{resultData.creditsUsed} credits
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
        </div>

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
            {!isEditing ? (
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 px-4 py-2 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl text-sm font-medium transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors text-gray-600 dark:text-gray-300"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Document Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-2xl font-bold text-[#0F2D63] dark:text-white bg-transparent border-b-2 border-[#C85A32] focus:outline-none w-full pb-1"
                  placeholder="Enter title..."
                  autoFocus
                />
              ) : (
                <h1 className="text-2xl font-bold text-[#0F2D63] dark:text-white">
                  {resultData.title}
                </h1>
              )}
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
                  {isEditing ? getWordCount(editContent) : resultData.wordCount} words
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

        {/* Full Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {isEditing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full min-h-[400px] p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 leading-relaxed text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A32] focus:border-transparent resize-y font-mono"
                  placeholder="Enter your content here..."
                />
              ) : (
                <>
                  {fullMarkdownContent ? (
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
                      {fullMarkdownContent}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-gray-400 dark:text-gray-500 text-center py-8">
                      No content available
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex items-start gap-3">
          <span className="text-amber-500 text-lg flex-shrink-0 mt-0.5">⚠️</span>
          <div>
            <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1.5">Disclaimer</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              AI-generated content from Magalela Media Services may contain inaccuracies and is not intended for immediate publication. All outputs must be submitted to an editor for final review and approval.
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleBack}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl py-3 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to AI Writing
          </button>
          {!isEditing ? (
            <button
              onClick={handleEditToggle}
              className="flex-1 flex items-center justify-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl py-3 text-sm font-semibold transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Document
            </button>
          ) : (
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
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
    creditsUsed: 0.5,
    creditsRemaining: 99.5,
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