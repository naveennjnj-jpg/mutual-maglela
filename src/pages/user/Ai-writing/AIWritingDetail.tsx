import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Calendar,
  User,
  Tag,
  Clock,
  TrendingUp,
  BookOpen,
  PenTool,
  Megaphone,
  Lightbulb,
  Heart,
  Sparkles,
  FileDown,
  FileType,
  ChevronDown
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

interface TokensUsed {
  input: number;
  output: number;
  total: number;
}

interface GlobalDocument {
  id: string;
  title: string;
  category: string;
  version: number;
}

interface Metadata {
  type: string;
  tone: string;
  includeOutline: boolean;
  outline?: string;
  wordCount: number;
  tokensUsed: TokensUsed;
  fileName?: string;
  fileType?: string;
  generatedAt: string;
  globalDocuments?: GlobalDocument[];
  vaultDocumentIds?: string[];
  voiceProfileApplied?: boolean;
  styleSamplesUsed?: number;
}

interface WritingData {
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
  audioUrl: string | null;
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
  outlineBox: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 4,
    marginTop: 6,
    fontSize: 9,
    color: '#444444',
  },
});

const AIWritingDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [documentData, setDocumentData] = useState<WritingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportLoading, setExportLoading] = useState<'pdf' | 'docx' | null>(null);

  useEffect(() => {
    const data = location.state?.data;
    if (data) {
      setDocumentData(data);
      setIsLoading(false);
    } else {
      const pathParts = location.pathname.split('/');
      const id = pathParts[pathParts.length - 1];
      if (id && id !== 'result') {
        fetchDocumentById(id);
      } else {
        setError('No document data found');
        setIsLoading(false);
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

  const fetchDocumentById = async (id: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError('Authentication required');
        setIsLoading(false);
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/ai/ai-content/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setDocumentData(response.data.data);
      } else {
        setError('Failed to fetch document');
      }
    } catch (err: any) {
      console.error('Error fetching document:', err);
      setError(err.response?.data?.message || 'Failed to fetch document');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/user/narrative-engine');
  };

  const handleCopy = () => {
    if (documentData?.content) {
      navigator.clipboard.writeText(documentData.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEdit = () => {
    navigate('/user/narrative-engine/create', { state: { editData: documentData } });
  };

  const handleDelete = async () => {
    if (!documentData?._id) return;
    if (!confirm(`Are you sure you want to delete "${documentData.title}"?`)) return;

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_URL}/api/ai/ai-content/${documentData._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        navigate('/user/narrative-engine');
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getTypeLabel = (type: string): string => {
    const labelMap: Record<string, string> = {
      'policy-brief': 'Policy Brief',
      'op-ed': 'Op-Ed',
      'press-release': 'Press Release',
      'speech': 'Speech',
      'impact-report': 'Impact Report',
      'summary': 'Summary',
      'blog-post': 'Blog Post',
      'media-story': 'News Article',
      'speech-guidance': 'Speech Guidance',
    };
    return labelMap[type] || type;
  };

  const getTypeIcon = (type: string): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
      'policy-brief': <BookOpen className="w-4 h-4" />,
      'op-ed': <PenTool className="w-4 h-4" />,
      'press-release': <Megaphone className="w-4 h-4" />,
      'speech': <Sparkles className="w-4 h-4" />,
      'impact-report': <Heart className="w-4 h-4" />,
      'summary': <FileText className="w-4 h-4" />,
      'blog-post': <Lightbulb className="w-4 h-4" />,
      'media-story': <Megaphone className="w-4 h-4" />,
    };
    return iconMap[type] || <FileText className="w-4 h-4" />;
  };

  const getToneLabel = (tone: string): string => {
    const labelMap: Record<string, string> = {
      'formal': 'Formal',
      'authoritative': 'Authoritative',
      'accessible': 'Accessible',
      'persuasive': 'Persuasive',
      'neutral': 'Neutral',
    };
    return labelMap[tone] || tone;
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

  const getParamColor = (value: number): string => {
    if (value >= 80) return 'text-green-600 dark:text-green-400';
    if (value >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getParamBgColor = (value: number): string => {
    if (value >= 80) return 'bg-green-50 dark:bg-green-900/20';
    if (value >= 60) return 'bg-amber-50 dark:bg-amber-900/20';
    return 'bg-red-50 dark:bg-red-900/20';
  };

  const getSafeFileName = (): string => {
    return (documentData?.title || 'document')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleExportPDF = async () => {
    if (!documentData) return;
    setExportLoading('pdf');
    setShowExportMenu(false);

    try {
      const doc = documentData;
      const paragraphs = doc.content.split(/\n{2,}/).filter(Boolean);

      const PdfDocument = () => (
        <Document
          title={doc.title}
          author={doc.author}
          subject={getTypeLabel(doc.metadata?.type || '')}
          creator="Magalela Media Services"
        >
          <Page size="A4" style={pdfStyles.page} wrap>
            <View style={pdfStyles.headerBar} fixed>
              <Text style={pdfStyles.headerTitle}>Magalela Media Services</Text>
              <Text style={pdfStyles.headerSubtitle}>AI-Generated Content</Text>
            </View>

            <Text style={pdfStyles.title}>{doc.title}</Text>

            <Text style={pdfStyles.metaLine}>
              Type: {getTypeLabel(doc.metadata?.type || '')}  |  Tone: {getToneLabel(doc.metadata?.tone || 'neutral')}  |  Status: {doc.status}
            </Text>
            <Text style={pdfStyles.metaLine}>
              Words: {doc.metadata?.wordCount || doc.charCount || 0}  |  Author: {doc.author}  |  ID: {doc.identifier}
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

            {doc.metadata?.outline && (
              <View style={{ marginTop: 16 }}>
                <View style={pdfStyles.divider} />
                <Text style={pdfStyles.sectionLabel}>Document Outline</Text>
                <View style={pdfStyles.outlineBox}>
                  <Text>{doc.metadata.outline}</Text>
                </View>
              </View>
            )}

            {/* Reference Documents Used */}
            {doc.metadata?.globalDocuments && doc.metadata.globalDocuments.length > 0 && (
              <View style={{ marginTop: 16 }}>
                <View style={pdfStyles.divider} />
                <Text style={pdfStyles.sectionLabel}>Reference Documents Used</Text>
                <View style={pdfStyles.outlineBox}>
                  {doc.metadata.globalDocuments.map((gd, i) => (
                    <Text key={gd.id} style={{ fontSize: 9, color: '#444444', marginBottom: 2 }}>
                      {i + 1}. {gd.title} ({getTypeLabel(gd.category)}, v{gd.version})
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
              <Text>Magalela Media Services — AI Export</Text>
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
    if (!documentData) return;
    setExportLoading('docx');
    setShowExportMenu(false);

    try {
      const doc = documentData;
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

      const outlineHtml = doc.metadata?.outline
        ? `
          <h3 style="font-size:11pt;color:#0F2D63;margin:20pt 0 8pt 0;border-top:1px solid #DDDDDD;padding-top:10pt;">Document Outline</h3>
          <div style="background:#F5F5F5;padding:10pt;border-radius:4pt;font-size:9pt;color:#444;">${doc.metadata.outline.replace(/\n/g, '<br/>')}</div>
        `
        : '';

      const globalDocsHtml =
        doc.metadata?.globalDocuments && doc.metadata.globalDocuments.length > 0
          ? `
            <h3 style="font-size:11pt;color:#0F2D63;margin:20pt 0 8pt 0;border-top:1px solid #DDDDDD;padding-top:10pt;">Reference Documents Used</h3>
            <ul style="font-size:9pt;color:#444;padding-left:18pt;margin:0;">
              ${doc.metadata.globalDocuments
                .map((gd) => `<li style="margin-bottom:3pt;">${gd.title} <span style="color:#999;">(${getTypeLabel(gd.category)}, v${gd.version})</span></li>`)
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
          <p class="meta">Type: ${getTypeLabel(doc.metadata?.type || '')} | Tone: ${getToneLabel(doc.metadata?.tone || 'neutral')} | Status: ${doc.status}</p>
          <p class="meta">Words: ${doc.metadata?.wordCount || doc.charCount || 0} | Author: ${doc.author} | ID: ${doc.identifier}</p>
          <p class="meta">Generated: ${formatDateTime(doc.metadata?.generatedAt || doc.createdAt)}</p>
          <div class="divider"></div>
          <div>${paragraphs}</div>
          ${parametersHtml}
          ${outlineHtml}
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !documentData) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6">
        <div className="max-w-[900px] mx-auto text-center py-12">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-[#0F2D63] dark:text-white mb-2">
            Document not found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {error || "The document you're looking for doesn't exist or has been deleted."}
          </p>
          <button
            onClick={handleBack}
            className="text-[#C85A32] hover:underline text-sm font-medium"
          >
            Go back to documents
          </button>
        </div>
      </div>
    );
  }

  const doc = documentData;
  const globalDocuments = doc.metadata?.globalDocuments || [];

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6">
      <div className="max-w-[900px] mx-auto">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#0F2D63] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
            {doc.title}
          </span>

          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-[#C85A32] transition-colors border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg"
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
                className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-[#C85A32] transition-colors border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg disabled:opacity-60"
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

            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition-colors border border-red-200 dark:border-red-800 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              {deleteLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              Delete
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-8">
          <div className="flex items-start gap-3 mb-6 pb-5 border-b border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-[#FFF8F5] dark:bg-[#C85A32]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              {getTypeIcon(doc.metadata?.type || '')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-semibold text-[#0F2D63] dark:text-white">
                  {doc.title}
                </h2>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(doc.status)}`}>
                  {doc.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {getTypeLabel(doc.metadata?.type || '')}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {getToneLabel(doc.metadata?.tone || 'neutral')}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {doc.metadata?.wordCount || doc.charCount || 0} words
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(doc.createdAt)}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {doc.author}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                  ID: {doc.identifier}
                </span>
              </div>
            </div>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
              {doc.content}
            </pre>
          </div>

          {doc.parameters && Object.values(doc.parameters).some(v => v > 0) && (
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-[#0F2D63] dark:text-white mb-3">
                Voice Tone Parameters
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(doc.parameters).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    authority: 'Authority',
                    clarity: 'Clarity',
                    academicRigor: 'Academic Rigor',
                    accessibility: 'Accessibility',
                    narrativeDepth: 'Narrative Depth'
                  };
                  const label = labels[key] || key;
                  const color = getParamColor(value);
                  const bgColor = getParamBgColor(value);

                  return (
                    <div key={key} className={`${bgColor} rounded-xl p-3 text-center`}>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {label}
                      </p>
                      <p className={`text-lg font-bold ${color}`}>
                        {value}%
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 text-center">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Average Score: {doc.avgScore || 0}/100
                </span>
              </div>
            </div>
          )}

          {doc.metadata?.outline && (
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-[#0F2D63] dark:text-white mb-3">
                Document Outline
              </h4>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-sans leading-relaxed">
                  {doc.metadata.outline}
                </pre>
              </div>
            </div>
          )}

          {/* Reference Documents Used */}
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
                        {getTypeLabel(gd.category)} · Version {gd.version}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-gray-400 dark:text-gray-500">Content Type</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium capitalize">
                  {doc.contentType}
                </p>
              </div>
              <div>
                <p className="text-gray-400 dark:text-gray-500">Source File</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {doc.metadata?.fileName || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 dark:text-gray-500">File Type</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {doc.metadata?.fileType || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 dark:text-gray-500">Include Outline</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {doc.metadata?.includeOutline ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex items-start gap-3">
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
  );
};

export default AIWritingDetail;