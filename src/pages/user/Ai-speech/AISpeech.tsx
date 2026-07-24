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
  CheckCircle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface Speech {
  id: number | string;
  name: string;
  parameters: string[];
  avgScore: number;
  duration: string;
  created: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

const AISpeech = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fetchCalled = useRef(false);

  useEffect(() => {
    if (!fetchCalled.current) {
      fetchCalled.current = true;
      fetchSpeeches();
    }
  }, []);

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
        `${API_URL}/api/ai-speech`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const speechesData = response.data.data?.speeches || response.data.data || [];
        if (Array.isArray(speechesData) && speechesData.length > 0) {
          setSpeeches(speechesData);
        } else {
          setSpeeches(getMockSpeeches());
        }
      } else {
        setSpeeches(getMockSpeeches());
      }
    } catch (err: any) {
      console.error('Error fetching speeches:', err);
      setSpeeches(getMockSpeeches());
    } finally {
      setLoading(false);
    }
  };

  const getMockSpeeches = (): Speech[] => {
    return [
      {
        id: 1,
        name: "VC Opening Address – RUFORUM 2026",
        parameters: ["Authority", "Narrative Depth"],
        avgScore: 76,
        duration: "4:32",
        created: "10 Jun 2026",
      },
      {
        id: 2,
        name: "Media Statement – Research Fund Announcement",
        parameters: ["Authority", "Clarity"],
        avgScore: 74,
        duration: "2:15",
        created: "05 Jun 2026",
      },
      {
        id: 3,
        name: "Stakeholder Keynote – Johannesburg Summit",
        parameters: ["Clarity", "Narrative Depth"],
        avgScore: 82,
        duration: "7:48",
        created: "28 May 2026",
      },
      {
        id: 4,
        name: "Alumni Gala Welcome Remarks",
        parameters: ["Accessibility", "Clarity"],
        avgScore: 72,
        duration: "3:05",
        created: "15 May 2026",
      }
    ];
  };

  const getFilteredSpeeches = () => {
    let filtered = speeches;
    if (searchTerm) {
      filtered = filtered.filter(speech =>
        speech.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredSpeeches = getFilteredSpeeches();

  const handleCreate = () => {
    navigate('/user/voice-calibrator/create');
  };

  const handleView = (id: number | string) => {
    navigate(`/user/voice-calibrator/result/${id}`);
  };

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
            <div className="col-span-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Speech Name</div>
            <div className="col-span-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Top Parameters</div>
            <div className="col-span-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-center">Avg Score</div>
            <div className="col-span-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-center">Duration</div>
            <div className="col-span-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-center">Created</div>
            <div className="col-span-1"></div>
          </div>

          {filteredSpeeches.length > 0 ? (
            filteredSpeeches.map((speech, index) => (
              <div
                key={speech.id}
                className={`grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative ${
                  index < filteredSpeeches.length - 1 ? 'border-b border-gray-50 dark:border-gray-700/50' : ''
                }`}
              >
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-[#FFF8F5] dark:bg-[#C85A32]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mic className="w-4 h-4 text-[#C85A32]" />
                  </div>
                  <button
                    onClick={() => handleView(speech.id)}
                    className="text-sm font-medium text-[#0F2D63] dark:text-white hover:text-[#C85A32] truncate text-left transition-colors"
                  >
                    {speech.name}
                  </button>
                </div>

                <div className="col-span-3 flex items-center gap-1.5 flex-wrap">
                  {speech.parameters.map((param, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-[#FFF8F5] dark:bg-[#C85A32]/10 text-[#C85A32] border border-[#C85A32]/20 px-2 py-0.5 rounded-full whitespace-nowrap"
                    >
                      {param}
                    </span>
                  ))}
                </div>

                <div className="col-span-2 flex items-center justify-center">
                  <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1">
                    <span className="text-sm font-bold text-[#0F2D63] dark:text-white">{speech.avgScore}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">/ 100</span>
                  </div>
                </div>

                <div className="col-span-1 text-xs font-medium text-gray-600 dark:text-gray-400 text-center">
                  {speech.duration}
                </div>

                <div className="col-span-1 text-xs text-gray-500 dark:text-gray-400 text-center">
                  {speech.created}
                </div>

                <div className="col-span-1 flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleView(speech.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-[#0F2D63] dark:hover:text-[#C85A32] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 transition-colors">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
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
          {filteredSpeeches.length} {filteredSpeeches.length === 1 ? 'speech' : 'speeches'}
        </p>
      </div>
    </div>
  );
};

export default AISpeech;