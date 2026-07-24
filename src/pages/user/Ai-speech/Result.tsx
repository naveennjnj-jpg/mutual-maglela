// pages/user/Ai-speech/Result.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft,
  Save,
  PenLine,
  Plus,
  Copy,
  Download,
  Play,
  Volume2,
  Check,
  Mic
} from 'lucide-react';

interface ResultData {
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

const AISpeechResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const resultData = location.state?.data as ResultData || getMockResult();

  const handleCopy = () => {
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
      a.download = `${resultData.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleBack = () => {
    navigate('/user/ai-speech');
  };

  const getParameterColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-amber-600';
    return 'text-red-600';
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

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6">
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#0F2D63] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to list
          </button>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-sm font-medium text-[#0F2D63] dark:text-white truncate">
            {resultData.name}
          </span>
        </div>

        {/* Action Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-5 py-3 mb-5 flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-1.5 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl px-4 py-2 text-xs font-semibold transition-colors">
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
          <button className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl px-4 py-2 text-xs font-medium transition-colors">
            <PenLine className="w-3.5 h-3.5" />
            Edit
          </button>
          <button className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl px-4 py-2 text-xs font-medium transition-colors">
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
              onClick={handleDownload}
              className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl px-4 py-2 text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Speech Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h2 className="font-semibold text-[#0F2D63] dark:text-white">{resultData.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Duration: {resultData.duration}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Score: {resultData.avgScore}/100</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-9 h-9 bg-[#0F2D63] dark:bg-[#0F2D63] rounded-full flex items-center justify-center text-white hover:bg-[#1a3d7a] transition-colors">
                    <Play className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                  <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C85A32] rounded-full transition-all" style={{ width: '0%' }}></div>
                  </div>
                  <Volume2 className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                {resultData.content}
              </pre>
            </div>
          </div>

          {/* Parameters */}
          <div className="flex flex-col gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-[#0F2D63] dark:text-white mb-4">Voice Tone Parameters</h2>
              <div className="space-y-4">
                {Object.entries(resultData.parameters).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{paramLabels[key]}</span>
                      <span className={`text-xs font-semibold ${getParameterColor(value)}`}>
                        {value}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#C85A32] rounded-full transition-all duration-500" 
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{paramDescriptions[key]}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Average Score</span>
                  <span className="text-sm font-bold text-[#C85A32]">{resultData.avgScore}/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data for fallback
const getMockResult = (): ResultData => {
  return {
    name: "Culpa distinctio Ex",
    content: `Distinguished guests, Vice-Chancellors, colleagues, and friends — welcome to this landmark convening.

Today, we gather not merely as individuals representing our respective institutions, but as a collective force committed to shaping the future of African excellence in research, innovation, and leadership. This is a moment of profound significance — not just for higher education on the continent, but for the communities we serve and the generations that will inherit the world we build together.

Africa's universities are at an inflection point. We have an extraordinary opportunity to lead — not follow — in defining what a world-class institution looks like in the 21st century. Our measure of excellence cannot be solely the rankings designed for a different context. It must encompass our capacity to solve African problems, to produce African solutions, and to share those solutions with the world.

Research published from this continent changes lives. Graduates educated here build companies, lead governments, and inspire movements. Our institutions are not peripheral to the global knowledge economy — we are central to it.

What we need is the courage to say so, loudly and without apology.

The communication of our impact — to policymakers, to funders, to the international community — is not a luxury. It is a strategic imperative. And today, we begin that work in earnest.

Thank you.`,
    parameters: {
      authority: 58,
      clarity: 95,
      academicRigor: 58,
      accessibility: 89,
      narrativeDepth: 93,
    },
    duration: "3:45",
    avgScore: 79,
    created: "10 Jun 2026",
    author: "AI Assistant"
  };
};

export default AISpeechResult;