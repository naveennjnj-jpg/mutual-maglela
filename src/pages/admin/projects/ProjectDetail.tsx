// pages/admin/ProjectDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Calendar, Send, Loader2, AlertCircle,
  Eye, MessageSquare, CircleCheck, FileText, ExternalLink, Download,
  File, FileImage, FileVideo, FileAudio, FileArchive, FileCode, 
  FileSpreadsheet, WandSparkles, Mic, Users, Sparkles,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface Project {
  _id: string;
  identifier: string;
  userId: string;
  title: string;
  type: string;
  description: string;
  priority: "high" | "medium" | "low" | "critical";
  deadline: string;
  proceedOption: "hire-expert" | "ai-writing" | "ai-speech";
  attachments: string | null;
  status: "Pending" | "In Progress" | "Under Review" | "Completed" | "On Hold" | "Cancelled" | "publish";
  createdAt: string;
  updatedAt: string;
  __v: number;
  adminnote?: string | null;
  adminattachment?: string | null;
  feedbacknote?: string | null;
  feedbackadminattachment?: string | null;
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProjectDetail(id);
    }
  }, [id]);

  const fetchProjectDetail = async (projectId: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/api/admin/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setProject(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch project');
      }
    } catch (err: any) {
      console.error('Error fetching project:', err);
      setError(err.response?.data?.message || 'Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-blue-50 text-blue-600 border-blue-100',
      medium: 'bg-amber-50 text-amber-600 border-amber-100',
      high: 'bg-red-50 text-red-500 border-red-100',
      critical: 'bg-purple-50 text-purple-600 border-purple-100'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getPriorityTextColor = (priority: string) => {
    const colors = {
      low: 'text-blue-600',
      medium: 'text-amber-600',
      high: 'text-red-500',
      critical: 'text-purple-600'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Pending': 'bg-gray-50 text-gray-600 border-gray-100',
      'In Progress': 'bg-green-50 text-green-700 border-green-100',
      'Under Review': 'bg-amber-50 text-amber-700 border-amber-100',
      'Completed': 'bg-blue-50 text-blue-700 border-blue-100',
      'On Hold': 'bg-yellow-50 text-yellow-700 border-yellow-100',
      'Cancelled': 'bg-red-50 text-red-600 border-red-100',
      'publish': 'bg-emerald-50 text-emerald-700 border-emerald-100'
    };
    return colors[status as keyof typeof colors] || colors['Pending'];
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'Pending': 'Pending',
      'In Progress': 'In Progress',
      'Under Review': 'Under Review',
      'Completed': 'Completed',
      'On Hold': 'On Hold',
      'Cancelled': 'Cancelled',
      'publish': 'Published'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      'Pending': <Clock className="w-3 h-3" />,
      'In Progress': <Clock className="w-3 h-3" />,
      'Under Review': <MessageSquare className="w-3 h-3" />,
      'Completed': <CircleCheck className="w-3 h-3" />,
      'On Hold': <Clock className="w-3 h-3" />,
      'Cancelled': <AlertCircle className="w-3 h-3" />,
      'publish': <CircleCheck className="w-3 h-3" />
    };
    return icons[status as keyof typeof icons] || icons['Pending'];
  };

  const getProceedOptionLabel = (option: string) => {
    const labels = {
      'ai-writing': 'AI Writing',
      'ai-speech': 'AI Speech',
      'hire-expert': 'Hire Expert'
    };
    return labels[option as keyof typeof labels] || option;
  };

  const getProceedOptionIcon = (option: string) => {
    const icons = {
      'ai-writing': <WandSparkles className="w-3.5 h-3.5" />,
      'ai-speech': <Mic className="w-3.5 h-3.5" />,
      'hire-expert': <Users className="w-3.5 h-3.5" />
    };
    return icons[option as keyof typeof icons] || <Sparkles className="w-3.5 h-3.5" />;
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getFullAttachmentUrl = (attachmentPath: string | null) => {
    if (!attachmentPath) return null;
    if (attachmentPath.startsWith('http://') || attachmentPath.startsWith('https://')) {
      return attachmentPath;
    }
    const cleanPath = attachmentPath.startsWith('/') ? attachmentPath.slice(1) : attachmentPath;
    return `${API_URL}/${cleanPath}`;
  };

  const getFileNameFromPath = (path: string | null) => {
    if (!path) return null;
    const parts = path.split('/');
    return parts[parts.length - 1] || null;
  };

  const getFileIcon = (fileName: string | null) => {
    if (!fileName) return <File className="w-5 h-5 text-gray-400" />;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'xls':
      case 'xlsx':
      case 'csv':
        return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
      case 'ppt':
      case 'pptx':
        return <FileSpreadsheet className="w-5 h-5 text-orange-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'webp':
        return <FileImage className="w-5 h-5 text-purple-500" />;
      case 'mp4':
      case 'mov':
      case 'avi':
      case 'wmv':
        return <FileVideo className="w-5 h-5 text-pink-500" />;
      case 'mp3':
      case 'wav':
      case 'aac':
        return <FileAudio className="w-5 h-5 text-indigo-500" />;
      case 'zip':
      case 'rar':
      case '7z':
        return <FileArchive className="w-5 h-5 text-yellow-500" />;
      default:
        return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#0F2D63] mb-2">Project Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">{error || 'The project you are looking for does not exist.'}</p>
          <Link to="/admin/projects" className="inline-block bg-[#0F2D63] text-white px-6 py-3 rounded-xl text-sm font-semibold">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = project.status === 'Completed' || project.status === 'publish';
  const isRevision = project.status === 'Under Review';

  const attachmentUrl = getFullAttachmentUrl(project.attachments);
  const fileName = project.attachments ? getFileNameFromPath(project.attachments) : null;
  const fileIcon = fileName ? getFileIcon(fileName) : null;

  const adminAttachmentUrl = getFullAttachmentUrl(project.adminattachment || null);
  const adminFileName = project.adminattachment ? getFileNameFromPath(project.adminattachment) : null;
  const adminFileIcon = adminFileName ? getFileIcon(adminFileName) : null;

  const feedbackAttachmentUrl = getFullAttachmentUrl(project.feedbackadminattachment || null);
  const feedbackFileName = project.feedbackadminattachment ? getFileNameFromPath(project.feedbackadminattachment) : null;
  const feedbackFileIcon = feedbackFileName ? getFileIcon(feedbackFileName) : null;

  return (
    <main className="flex-1">
      <div className="min-h-screen bg-[#F4F6FB] p-6">
        <div className="max-w-[720px] mx-auto space-y-5">
          {/* Back Button */}
          <Link
            to="/admin/projects"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0F2D63] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Projects
          </Link>

          {/* Header */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize mb-2 ${getPriorityColor(project.priority)}`}>
                  {project.priority} priority
                </span>
                <h1 className="text-xl font-['Roboto'] font-bold text-[#0F2D63] leading-tight">
                  {project.title || 'Untitled Project'}
                </h1>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(project.status)}`}>
                {getStatusIcon(project.status)}
                {getStatusLabel(project.status)}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-400">
                  #{project.identifier}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 flex items-center gap-1">
                  {getProceedOptionIcon(project.proceedOption)}
                  {getProceedOptionLabel(project.proceedOption)}
                </span>
              </div>
            </div>
          </div>

          {/* Project Type */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Project Type</p>
            <p className="text-sm font-semibold text-[#0F2D63]">{project.type || 'N/A'}</p>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Project Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {project.description || 'No description provided.'}
            </p>
          </div>

          {/* Priority & Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Priority</p>
              <p className={`text-sm font-bold capitalize ${getPriorityTextColor(project.priority)}`}>
                {project.priority}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Deadline</p>
              <p className="text-sm font-bold text-[#0F2D63] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {formatDate(project.deadline)}
              </p>
            </div>
          </div>

          {/* User Attached Files */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Attached Files</p>
              <span className="bg-gray-100 text-gray-600 text-[8px] font-bold px-1.5 py-0.5 rounded-full">USER</span>
            </div>
            {project.attachments ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0F2D63]/10 rounded-xl flex items-center justify-center text-2xl">
                    {fileIcon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{fileName}</p>
                    <p className="text-xs text-gray-400">Click to view or download</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={attachmentUrl || '#'} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="View file">
                    <ExternalLink className="w-4 h-4 text-gray-500 hover:text-[#0F2D63]" />
                  </a>
                  <a href={attachmentUrl || '#'} download={fileName || 'download'} className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Download file">
                    <Download className="w-4 h-4 text-gray-500 hover:text-[#0F2D63]" />
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-300 italic">No files attached by user.</p>
            )}
          </div>

          {/* Admin Section */}
          {(project.adminnote || project.adminattachment) && (
            <div className={`rounded-2xl border p-5 ${
              isRevision ? 'bg-blue-50 border-blue-200' : 
              isCompleted ? 'bg-green-50 border-green-200' : 
              'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">{isRevision ? '📋' : isCompleted ? '✅' : '📝'}</span>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${
                  isRevision ? 'text-blue-600' : 
                  isCompleted ? 'text-green-600' : 
                  'text-gray-600'
                }`}>
                  {isRevision ? 'Admin Submission' : isCompleted ? 'Admin Final Submission' : 'Admin Note'}
                </p>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                  isRevision ? 'bg-blue-200 text-blue-700' : 
                  isCompleted ? 'bg-green-200 text-green-700' : 
                  'bg-gray-200 text-gray-700'
                }`}>
                  ADMIN
                </span>
              </div>

              {project.adminnote && (
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Note from Admin</p>
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-sm text-gray-700 leading-relaxed">{project.adminnote}</p>
                  </div>
                </div>
              )}

              {project.adminattachment && (
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Admin Attachment</p>
                  <div className={`flex items-center justify-between p-3 bg-white rounded-xl border ${
                    isRevision ? 'border-blue-100' : isCompleted ? 'border-green-100' : 'border-gray-100'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl ${
                        isRevision ? 'bg-blue-100' : isCompleted ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {adminFileIcon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{adminFileName}</p>
                        <p className="text-xs text-gray-400">Admin provided file — click to view or download</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a href={adminAttachmentUrl || '#'} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="View file">
                        <ExternalLink className="w-4 h-4 text-gray-500 hover:text-[#0F2D63]" />
                      </a>
                      <a href={adminAttachmentUrl || '#'} download={adminFileName || 'download'} className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Download file">
                        <Download className="w-4 h-4 text-gray-500 hover:text-[#0F2D63]" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Feedback Section */}
          {(project.feedbacknote || project.feedbackadminattachment) && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">💬</span>
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">User Feedback</p>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-700">USER</span>
              </div>

              {project.feedbacknote && (
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Feedback Note</p>
                  <div className="bg-white rounded-xl p-4 border border-amber-100">
                    <p className="text-sm text-gray-700 leading-relaxed">{project.feedbacknote}</p>
                  </div>
                </div>
              )}

              {project.feedbackadminattachment && (
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Feedback Attachment</p>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">
                        {feedbackFileIcon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{feedbackFileName}</p>
                        <p className="text-xs text-gray-400">User provided file — click to view or download</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a href={feedbackAttachmentUrl || '#'} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="View file">
                        <ExternalLink className="w-4 h-4 text-gray-500 hover:text-[#0F2D63]" />
                      </a>
                      <a href={feedbackAttachmentUrl || '#'} download={feedbackFileName || 'download'} className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Download file">
                        <Download className="w-4 h-4 text-gray-500 hover:text-[#0F2D63]" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Revision Status Message */}
          {isRevision && (
            <div className="rounded-2xl border overflow-hidden border-amber-200">
              <div className="px-5 py-3 flex items-center gap-2 bg-amber-500">
                <Clock className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-bold">⏳ Awaiting User Review</span>
              </div>
              <div className="p-5 space-y-4 bg-amber-50">
                <p className="text-sm text-gray-600">
                  The submission has been sent to the user. Waiting for their response.
                </p>
              </div>
            </div>
          )}

          {/* Completed Status Message */}
          {isCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-700">Project Completed</p>
                <p className="text-xs text-green-600">This project has been successfully completed.</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {!isCompleted && (
            <button
              onClick={() => navigate(`/admin/projects/${project._id}/submit`)}
              className="w-full py-3 bg-[#0F2D63] hover:bg-[#0a2050] text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              {isRevision ? 'Resubmit Project' : 'Submit Project'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProjectDetail;