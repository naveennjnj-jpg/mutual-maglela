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
  Zap,
  X,
  FileDown,
  FileType,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import axios from 'axios';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

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

interface GlobalDocument {
  id: string;
  title: string;
  category: string;
  version: number;
}

interface MetadataData {
  title: string;
  generatedAt: string;
  globalDocuments?: GlobalDocument[];
}

interface SpeechData {
  id?: string;
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

const AISpeechResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);


  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportLoading, setExportLoading] = useState<'pdf' | 'docx' | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [textEdited, setTextEdited] = useState(false);

  const [localResultData, setLocalResultData] = useState<SpeechData | null>(null);

  const [userData, setUserData] = useState<UserData>({
    id: '',
    name: 'User',
    email: '',
    role: 'user',
    credits: 0,
    initials: 'U'
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resultData = location.state?.data as SpeechData;

  useEffect(() => {
    if (resultData) {
      setLocalResultData({ ...resultData });
      setEditTitle(resultData.metadata.title);
      setEditContent(resultData.text);
    }
  }, [resultData]);


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

  useEffect(() => {
    fetchUpdatedUserData();
  }, []);

  useEffect(() => {
    if (location.state?.data?.creditsRemaining !== undefined) {
      const credits = location.state.data.creditsRemaining;
      setUserData(prev => ({ ...prev, credits }));
      localStorage.setItem('userCredits', credits.toString());
    }
  }, [location.state]);

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

  useEffect(() => {
    if (!resultData) {
      navigate('/user/voice-calibrator');
    }
  }, [resultData, navigate]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const togglePlayAudio = () => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.error('Error playing audio:', err);
        setError('Failed to play audio. Please try again.');
      });
    }
  };

  const handleAudioTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.duration && isFinite(audio.duration)) {
      setAudioDuration(audio.duration);
      setAudioProgress((audio.currentTime / audio.duration) * 100);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setAudioProgress(0);
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getSafeFileName = (title: string): string => {
    return (title || 'speech')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const formatCategory = (category: string): string => {
    return (category || '')
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const handleCopy = async () => {
    const textToCopy = isEditing ? editContent : localResultData?.text;
    if (textToCopy) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        setSuccess('Content copied to clipboard!');
      } catch (err) {
        setError('Failed to copy content');
      }
    }
  };


  const handleExportPDF = async () => {
    if (!localResultData) return;
    setExportLoading('pdf');
    setShowExportMenu(false);

    try {
      const titleToUse = isEditing ? editTitle : localResultData.metadata.title;
      const contentToUse = isEditing ? editContent : localResultData.text;
      const paragraphs = contentToUse.split(/\n{2,}/).filter(Boolean);
      const globalDocs = localResultData.metadata?.globalDocuments || [];

      const currentAvgScore = Math.floor(
        (Number(localResultData.analysis.authority) +
          Number(localResultData.analysis.clarity) +
          Number(localResultData.analysis.academicRigor) +
          Number(localResultData.analysis.accessibility) +
          Number(localResultData.analysis.narrativeDepth)) / 5
      );

      const PdfDocument = () => (
        <Document
          title={titleToUse}
          author={userData.name || 'User'}
          subject="AI-Generated Speech"
          creator="Magalela Media Services"
        >
          <Page size="A4" style={pdfStyles.page} wrap>
            <View style={pdfStyles.headerBar} fixed>
              <Text style={pdfStyles.headerTitle}>Magalela Media Services</Text>
              <Text style={pdfStyles.headerSubtitle}>AI-Generated Speech</Text>
            </View>

            <Text style={pdfStyles.title}>{titleToUse}</Text>

            <Text style={pdfStyles.metaLine}>
              Duration: {formatDuration(localResultData.duration)}  |  Words: {getWordCount(contentToUse)}  |  Characters: {contentToUse.length}
            </Text>
            <Text style={pdfStyles.metaLine}>
              Provider: {localResultData.provider}  |  Generated: {formatDateTime(localResultData.metadata.generatedAt)}
            </Text>

            <View style={pdfStyles.divider} />

            <View style={pdfStyles.body}>
              {paragraphs.map((para, idx) => (
                <Text key={idx} style={pdfStyles.paragraph}>
                  {para}
                </Text>
              ))}
            </View>

            {localResultData.analysis && Object.values(localResultData.analysis).some(v => Number(v) > 0) && (
              <View style={{ marginTop: 16 }}>
                <View style={pdfStyles.divider} />
                <Text style={pdfStyles.sectionLabel}>Voice Tone Parameters</Text>
                <View style={pdfStyles.paramRow}>
                  {Object.entries(localResultData.analysis).map(([key, value]) => {
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
                        <Text style={pdfStyles.paramValue}>{Number(value)}%</Text>
                      </View>
                    );
                  })}
                </View>
                <Text style={{ fontSize: 8, color: '#666666', marginTop: 4, textAlign: 'center' }}>
                  Average Score: {currentAvgScore}/100
                </Text>
              </View>
            )}

            {/* Reference Documents Used */}
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
      a.download = `${getSafeFileName(titleToUse)}.pdf`;
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
    if (!localResultData) return;
    setExportLoading('docx');
    setShowExportMenu(false);

    try {
      const titleToUse = isEditing ? editTitle : localResultData.metadata.title;
      const contentToUse = isEditing ? editContent : localResultData.text;
      const globalDocs = localResultData.metadata?.globalDocuments || [];

      const currentAvgScore = Math.floor(
        (Number(localResultData.analysis.authority) +
          Number(localResultData.analysis.clarity) +
          Number(localResultData.analysis.academicRigor) +
          Number(localResultData.analysis.accessibility) +
          Number(localResultData.analysis.narrativeDepth)) / 5
      );

      const paragraphs = contentToUse
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((p) => `<p style="margin:0 0 10pt 0;line-height:1.6;">${p.replace(/\n/g, '<br/>')}</p>`)
        .join('');

      const parametersHtml = localResultData.analysis && Object.values(localResultData.analysis).some(v => Number(v) > 0)
        ? `
          <h3 style="font-size:11pt;color:#0F2D63;margin:20pt 0 8pt 0;border-top:1px solid #DDDDDD;padding-top:10pt;">Voice Tone Parameters</h3>
          <table style="width:100%;border-collapse:collapse;font-size:9pt;">
            <tr>
              ${Object.entries(localResultData.analysis).map(([key]) => {
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
              ${Object.entries(localResultData.analysis).map(([, value]) =>
                `<td style="padding:6pt;background:#F5F5F5;text-align:center;border:1px solid #EEEEEE;"><strong style="color:#0F2D63;">${Number(value)}%</strong></td>`
              ).join('')}
            </tr>
          </table>
          <p style="font-size:8pt;color:#666;text-align:center;margin:4pt 0 0 0;">Average Score: ${currentAvgScore}/100</p>
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
          <title>${titleToUse}</title>
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
          <h1>${titleToUse}</h1>
          <p class="meta">Duration: ${formatDuration(localResultData.duration)} | Words: ${getWordCount(contentToUse)} | Characters: ${contentToUse.length}</p>
          <p class="meta">Provider: ${localResultData.provider} | Generated: ${formatDateTime(localResultData.metadata.generatedAt)}</p>
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
      a.download = `${getSafeFileName(titleToUse)}.doc`;
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
    if (!audioSrc || !localResultData) {
      setError('No audio file available to download');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let blob: Blob;

      if (audioSrc.startsWith('data:')) {
        const res = await fetch(audioSrc);
        blob = await res.blob();
      } else {
        const token = localStorage.getItem("token");
        const response = await axios.get(audioSrc, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        });
        blob = new Blob([response.data], { type: 'audio/mpeg' });
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${getSafeFileName(localResultData.metadata.title)}-audio.mp3`;
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

  const handleEditToggle = () => {
    setError(null);
    setSuccess(null);
    setEditTitle(localResultData?.metadata?.title || '');
    setEditContent(localResultData?.text || '');
    setIsEditing(!isEditing);
  };

  const handleSaveEdit = async () => {
    if (!localResultData) return;

    if (!isEditing) {
      setSuccess('Your speech is already saved.');
      return;
    }

    const newTitle = editTitle.trim() || localResultData.metadata.title;
    const newText = editContent.trim() || localResultData.text;

    setIsSavingEdit(true);
    setError(null);
    setSuccess(null);

    try {
      if (localResultData.id) {
        const token = localStorage.getItem('token');
        await axios.patch(
          `${API_URL}/api/ai-content/${localResultData.id}`,
          { title: newTitle, content: newText },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (newText !== localResultData.text) {
        setTextEdited(true);
      }

      setLocalResultData({
        ...localResultData,
        metadata: {
          ...localResultData.metadata,
          title: newTitle
        },
        text: newText,
        charCount: newText.length
      });

      setIsEditing(false);
      setSuccess(
        localResultData.id
          ? 'Changes saved successfully!'
          : 'Changes applied on this page only. Copy or export the document to keep it.'
      );
    } catch (err: any) {
      console.error('Error saving changes:', err);
      setError(err.response?.data?.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleBack = () => {
    navigate('/user/voice-calibrator');
  };

  const handleNewSpeech = () => {
    navigate('/user/voice-calibrator/create');
  };

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
    (Number(localResultData.analysis.authority) + 
     Number(localResultData.analysis.clarity) + 
     Number(localResultData.analysis.academicRigor) + 
     Number(localResultData.analysis.accessibility) + 
     Number(localResultData.analysis.narrativeDepth)) / 5
  );

  const displayTitle = isEditing ? editTitle : localResultData.metadata.title;
  const displayContent = isEditing ? editContent : localResultData.text;
  const globalDocuments = localResultData.metadata?.globalDocuments || [];

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6">
      <div className="max-w-[1000px] mx-auto">

        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="opacity-60 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl text-sm mb-4">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{success}</span>
            <button onClick={() => setSuccess(null)} className="opacity-60 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

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

            {/* Export PDF / Word Dropdown */}
            <div className="relative" data-export-menu>
              <button
                onClick={() => setShowExportMenu((v) => !v)}
                disabled={!!exportLoading}
                className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl px-4 py-2 text-xs font-medium transition-colors disabled:opacity-60"
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
                <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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
                          {formatDuration(audioDuration || localResultData.duration)}
                        </span>
                      </div>
                    </div>
                    <Volume2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <audio
                      ref={audioRef}
                      src={audioSrc}
                      onTimeUpdate={handleAudioTimeUpdate}
                      onLoadedMetadata={handleAudioTimeUpdate}
                      onEnded={handleAudioEnded}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {textEdited && (
                <div className="mb-4 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2">
                  The text was edited after the audio was generated. The audio still reflects the original text.
                </div>
              )}

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

            {/* Reference Documents Used */}
            {globalDocuments.length > 0 && (
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-[#C85A32]" />
                  <h4 className="text-sm font-semibold text-[#0F2D63] dark:text-white">
                    Reference Documents Used ({globalDocuments.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {globalDocuments.map((gd) => (
                    <div
                      key={gd.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700"
                    >
                      <div className="w-8 h-8 bg-[#FFF8F5] dark:bg-[#C85A32]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-[#C85A32]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#0F2D63] dark:text-white truncate">
                          {gd.title}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">
                          {formatCategory(gd.category)} · Version {gd.version}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex items-start gap-3">
              <span className="text-amber-500 text-lg flex-shrink-0 mt-0.5">⚠️</span>
              <div>
                <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1.5">Disclaimer</p>
                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                  AI-generated content from Magalela Media Services may contain inaccuracies and is not intended for immediate publication. All outputs must be submitted to an editor for final review and approval.
                </p>
              </div>
            </div>  
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-[#0F2D63] dark:text-white mb-4">
                Voice Tone Parameters
              </h2>
              <div className="space-y-4">
                {Object.entries(localResultData.analysis).map(([key, rawValue]) => {
                  const value = Number(rawValue);
                  return (
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
                  );
                })}
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
            </div>

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISpeechResult;