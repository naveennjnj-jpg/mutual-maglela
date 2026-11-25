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
  Calendar,
  User,
  Tag,
  FileDown,
  FileType,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

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

interface GlobalDocument {
  id: string;
  title: string;
  category: string;
  version: number;
}

interface Metadata {
  inputMethod: string;
  fileName?: string;
  generatedAt: string;
  globalDocuments?: GlobalDocument[];
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

const pdfStyles = StyleSheet.create({
  page: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#222222',
    lineHeight: 1.5,
  },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#0F2D63',
    paddingHorizontal: 40,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#C7D2E5',
    fontSize: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F2D63',
    marginBottom: 6,
  },
  metaLine: {
    fontSize: 8,
    color: '#666666',
    marginBottom: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
    marginVertical: 10,
  },
  sectionLabel: {
    fontSize: 8,
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  body: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.6,
    marginTop: 8,
  },
  paragraph: {
    marginBottom: 8,
  },
  disclaimerBox: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  disclaimerTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#92400E',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 8,
    color: '#92400E',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7,
    color: '#999999',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 6,
  },
  paramRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  paramBox: {
    width: '19%',
    padding: 5,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    alignItems: 'center',
  },
  paramLabel: {
    fontSize: 6,
    color: '#666666',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  paramValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0F2D63',
  },
  docsBox: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 4,
    marginTop: 6,
    fontSize: 9,
    color: '#444444',
  },
});

const AISpeechDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [speechData, setSpeechData] = useState<SpeechData | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportLoading, setExportLoading] = useState<'pdf' | 'docx' | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const data = location.state?.data;
    if (data) {
      setSpeechData(data);
      setAudioSrc(`${API_URL}${data.audioUrl}`);
    } else {
      const pathParts = location.pathname.split('/');
      const id = pathParts[pathParts.length - 1];
      if (id && id !== 'result') {
        fetchSpeechById(id);
      }
    }
  }, [location]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-export-menu]')) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCategory = (category: string): string => {
    return (category || '')
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const getSafeFileName = (): string => {
    return (speechData?.title || 'speech')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

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


  const handleExportPDF = async () => {
    if (!speechData) return;
    setExportLoading('pdf');
    setShowExportMenu(false);

    try {
      const doc = speechData;
      const paragraphs = doc.content.split(/\n{2,}/).filter(Boolean);
      const globalDocs = doc.metadata?.globalDocuments || [];

      const PdfDocument = () => (
        <Document
          title={doc.title}
          author={doc.author}
          subject="AI-Generated Speech"
          creator="Magalela Media Services"
        >
          <Page size="A4" style={pdfStyles.page} wrap>
            <View style={pdfStyles.headerBar} fixed>
              <Text style={pdfStyles.headerTitle}>Magalela Media Services</Text>
              <Text style={pdfStyles.headerSubtitle}>AI-Generated Speech</Text>
            </View>

            <Text style={pdfStyles.title}>{doc.title}</Text>

            <Text style={pdfStyles.metaLine}>
              Type: {doc.contentType}  |  Duration: {doc.duration}  |  Status: {doc.status}
            </Text>
            <Text style={pdfStyles.metaLine}>
              Characters: {doc.charCount || 0}  |  Author: {doc.author}  |  ID: {doc.identifier}
            </Text>
            <Text style={pdfStyles.metaLine}>
              Generated: {formatDateTime(doc.metadata?.generatedAt || doc.createdAt)}
            </Text>

            <View style={pdfStyles.divider} />

            <View style={pdfStyles.body}>
              {paragraphs.map((para, idx) => (
                <Text key={idx} style={pdfStyles.paragraph}>
                  {para}
                </Text>
              ))}
            </View>

            {doc.parameters && Object.values(doc.parameters).some(v => v > 0) && (
              <View style={{ marginTop: 16 }}>
                <View style={pdfStyles.divider} />
                <Text style={pdfStyles.sectionLabel}>Voice Tone Parameters</Text>
                <View style={pdfStyles.paramRow}>
                  {Object.entries(doc.parameters).map(([key, value]) => {
                    const labels: Record<string, string> = {
                      authority: 'Authority',
                      clarity: 'Clarity',
                      academicRigor: 'Academic Rigor',
                      accessibility: 'Accessibility',
                      narrativeDepth: 'Narrative Depth'
                    };
                    return (
                      <View key={key} style={pdfStyles.paramBox}>
                        <Text style={pdfStyles.paramLabel}>{labels[key] || key}</Text>
                        <Text style={pdfStyles.paramValue}>{value}%</Text>
                      </View>
                    );
                  })}
                </View>
                <Text style={{ fontSize: 8, color: '#666666', marginTop: 4, textAlign: 'center' }}>
                  Average Score: {doc.avgScore || 0}/100
                </Text>
              </View>
            )}

            {globalDocs.length > 0 && (
              <View style={{ marginTop: 16 }}>
                <View style={pdfStyles.divider} />
                <Text style={pdfStyles.sectionLabel}>Reference Documents Used</Text>
                <View style={pdfStyles.docsBox}>
                  {globalDocs.map((gd, i) => (
                    <Text key={gd.id} style={{ fontSize: 9, color: '#444444', marginBottom: 2 }}>
                      {i + 1}. {gd.title} ({formatCategory(gd.category)}, v{gd.version})
                    </Text>
                  ))}
                </View>
              </View>
            )}

            <View style={pdfStyles.disclaimerBox} wrap={false}>
              <Text style={pdfStyles.disclaimerTitle}>Disclaimer</Text>
              <Text style={pdfStyles.disclaimerText}>
                AI-generated content from Magalela Media Services may contain inaccuracies and is not intended for immediate publication. All outputs must be submitted to an editor for final review and approval.
              </Text>
            </View>

            <View style={pdfStyles.footer} fixed>
              <Text>Magalela Media Services — AI Speech Export</Text>
              <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
            </View>
          </Page>
        </Document>
      );

      const blob = await pdf(<PdfDocument />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${getSafeFileName()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF export failed:', err);
      setError('Failed to export PDF. Please try again.');
    } finally {
      setExportLoading(null);
    }
  };


  const handleExportDOCX = async () => {
    if (!speechData) return;
    setExportLoading('docx');
    setShowExportMenu(false);

    try {
      const doc = speechData;
      const globalDocs = doc.metadata?.globalDocuments || [];

      const paragraphs = doc.content
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((p) => `<p style="margin:0 0 10pt 0;line-height:1.6;">${p.replace(/\n/g, '<br/>')}</p>`)
        .join('');

      const parametersHtml = doc.parameters && Object.values(doc.parameters).some(v => v > 0)
        ? `
          <h3 style="font-size:11pt;color:#0F2D63;margin:20pt 0 8pt 0;border-top:1px solid #DDDDDD;padding-top:10pt;">Voice Tone Parameters</h3>
          <table style="width:100%;border-collapse:collapse;font-size:9pt;">
            <tr>
              ${Object.entries(doc.parameters).map(([key]) => {
                const labels: Record<string, string> = {
                  authority: 'Authority',
                  clarity: 'Clarity',
                  academicRigor: 'Academic Rigor',
                  accessibility: 'Accessibility',
                  narrativeDepth: 'Narrative Depth'
                };
                return `<td style="padding:6pt;background:#F5F5F5;text-align:center;border:1px solid #EEEEEE;"><div style="font-size:7pt;color:#666;text-transform:uppercase;">${labels[key] || key}</div></td>`;
              }).join('')}
            </tr>
            <tr>
              ${Object.entries(doc.parameters).map(([, value]) =>
                `<td style="padding:6pt;background:#F5F5F5;text-align:center;border:1px solid #EEEEEE;"><strong style="color:#0F2D63;">${value}%</strong></td>`
              ).join('')}
            </tr>
          </table>
          <p style="font-size:8pt;color:#666;text-align:center;margin:4pt 0 0 0;">Average Score: ${doc.avgScore || 0}/100</p>
        `
        : '';

      const globalDocsHtml = globalDocs.length > 0
        ? `
          <h3 style="font-size:11pt;color:#0F2D63;margin:20pt 0 8pt 0;border-top:1px solid #DDDDDD;padding-top:10pt;">Reference Documents Used</h3>
          <ul style="font-size:9pt;color:#444;padding-left:18pt;margin:0;">
            ${globalDocs
              .map((gd) => `<li style="margin-bottom:3pt;">${gd.title} <span style="color:#999;">(${formatCategory(gd.category)}, v${gd.version})</span></li>`)
              .join('')}
          </ul>
        `
        : '';

      const htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <title>${doc.title}</title>
          <style>
            body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #222; line-height: 1.6; }
            h1 { font-size: 20pt; color: #0F2D63; margin: 0 0 8pt 0; }
            .meta { font-size: 9pt; color: #666; margin: 2pt 0; }
            .divider { border-bottom: 1px solid #DDDDDD; margin: 12pt 0; }
            .disclaimer { background: #FEF3C7; border-left: 3px solid #F59E0B; padding: 10pt; margin-top: 20pt; }
            .disclaimer-title { font-size: 9pt; font-weight: bold; color: #92400E; text-transform: uppercase; margin-bottom: 4pt; }
            .disclaimer-text { font-size: 9pt; color: #92400E; }
          </style>
        </head>
        <body>
          <h1>${doc.title}</h1>
          <p class="meta">Type: ${doc.contentType} | Duration: ${doc.duration} | Status: ${doc.status}</p>
          <p class="meta">Characters: ${doc.charCount || 0} | Author: ${doc.author} | ID: ${doc.identifier}</p>
          <p class="meta">Generated: ${formatDateTime(doc.metadata?.generatedAt || doc.createdAt)}</p>
          <div class="divider"></div>
          <div>${paragraphs}</div>
          ${parametersHtml}
          ${globalDocsHtml}
          <div class="disclaimer">
            <div class="disclaimer-title">Disclaimer</div>
            <div class="disclaimer-text">AI-generated content from Magalela Media Services may contain inaccuracies and is not intended for immediate publication. All outputs must be submitted to an editor for final review and approval.</div>
          </div>
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff', htmlContent], {
        type: 'application/msword;charset=utf-8'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${getSafeFileName()}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Word export failed:', err);
      setError('Failed to export Word document. Please try again.');
    } finally {
      setExportLoading(null);
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
      a.download = `${getSafeFileName()}-audio.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading audio:', err);
      setError('Failed to download audio');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading speech...</p>
        </div>
      </div>
    );
  }

  if (!speechData) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-4 sm:p-6">
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

  const globalDocuments = speechData.metadata?.globalDocuments || [];

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-3 sm:p-6">
      <div className="max-w-[900px] mx-auto">
        
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#0F2D63] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[140px] sm:max-w-[200px]">
            {speechData.title}
          </span>

          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-[#C85A32] transition-colors border border-gray-200 dark:border-gray-700 px-2.5 sm:px-3 py-1.5 rounded-lg"
            >
              {copied ? (
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </button>

            <div className="relative" data-export-menu>
              <button
                onClick={() => setShowExportMenu((v) => !v)}
                disabled={!!exportLoading}
                className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-[#C85A32] transition-colors border border-gray-200 dark:border-gray-700 px-2.5 sm:px-3 py-1.5 rounded-lg disabled:opacity-60"
              >
                {exportLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                {exportLoading === 'pdf' ? 'PDF...' : exportLoading === 'docx' ? 'Word...' : 'Export'}
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-1.5 w-40 sm:w-44 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden">
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <FileDown className="w-4 h-4 text-red-500" />
                    Export as PDF
                  </button>
                  <button
                    onClick={handleExportDOCX}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-t border-gray-100 dark:border-gray-700"
                  >
                    <FileType className="w-4 h-4 text-blue-500" />
                    Export as Word
                  </button>
                </div>
              )}
            </div>

            {speechData.audioUrl && (
              <button
                onClick={handleDownloadAudio}
                className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-[#C85A32] transition-colors border border-gray-200 dark:border-gray-700 px-2.5 sm:px-3 py-1.5 rounded-lg"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Audio
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 sm:p-6 md:p-8">
          <div className="flex flex-wrap items-start gap-3 mb-6 pb-5 border-b border-gray-100 dark:border-gray-700">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFF8F5] dark:bg-[#C85A32]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-[#C85A32]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-semibold text-[#0F2D63] dark:text-white break-words">
                  {speechData.title}
                </h2>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(speechData.status)}`}>
                  {speechData.status}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {speechData.contentType}
                </span>
                <span className="hidden sm:inline">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {speechData.duration}
                </span>
                <span className="hidden sm:inline">·</span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Score: {speechData.avgScore}/100
                </span>
                <span className="hidden sm:inline">·</span>
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {speechData.charCount} chars
                </span>
                <span className="hidden sm:inline">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(speechData.createdAt)}
                </span>
                <span className="hidden sm:inline">·</span>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {speechData.author}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs w-full sm:w-auto sm:ml-auto">
              <span className="text-gray-400 dark:text-gray-500">ID:</span>
              <span className="font-mono text-gray-500 dark:text-gray-400 truncate">
                {speechData.identifier}
              </span>
            </div>
          </div>

          {audioSrc && (
            <div className="mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700">
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

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words font-sans leading-relaxed">
              {speechData.content}
            </pre>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-[#0F2D63] dark:text-white mb-3">
              Voice Tone Parameters
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
              {Object.entries(speechData.parameters).map(([key, value]) => {
                const label = paramLabels[key] || key;
                const isHigh = value >= 70;
                const isMid = value >= 50 && value < 70;
                const color = isHigh ? 'text-green-600 dark:text-green-400' :
                  isMid ? 'text-amber-600 dark:text-amber-400' :
                    'text-red-600 dark:text-red-400';
                const bgColor = isHigh ? 'bg-green-50 dark:bg-green-900/20' :
                  isMid ? 'bg-amber-50 dark:bg-amber-900/20' :
                    'bg-red-50 dark:bg-red-900/20';

                return (
                  <div key={key} className={`${bgColor} rounded-xl p-2.5 sm:p-3 text-center`}>
                    <p className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {label}
                    </p>
                    <p className={`text-base sm:text-lg font-bold ${color}`}>
                      {value}%
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {globalDocuments.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-[#C85A32]" />
                <h4 className="text-sm font-semibold text-[#0F2D63] dark:text-white">
                  Reference Documents Used ({globalDocuments.length})
                </h4>
              </div>
              <div className="space-y-2">
                {globalDocuments.map((gd) => (
                  <div
                    key={gd.id}
                    className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700"
                  >
                    <div className="w-8 h-8 bg-[#FFF8F5] dark:bg-[#C85A32]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-[#C85A32]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#0F2D63] dark:text-white truncate">
                        {gd.title}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                        {formatCategory(gd.category)} · Version {gd.version}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
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
          </div> */}
        </div>
        
        <div className="mt-4 sm:mt-6 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-3 sm:p-4 flex items-start gap-2.5 sm:gap-3">
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