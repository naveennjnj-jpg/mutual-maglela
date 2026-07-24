// pages/user/ProjectDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Calendar, Send, Loader2, AlertCircle,
  Eye, MessageSquare, CircleCheck, FileText, ExternalLink, Download,
  File, FileImage, FileVideo, FileAudio, FileArchive, FileCode, 
  FileSpreadsheet, FileText as FileTextIcon
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface Project {
  _id: string;
  title: string;
  description: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'in_revision' | 'completed' | 'pending';
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  deadline: string;
  attachments: string[] | string | null;
  createdAt: string;
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
      high: 'bg-red-50 text-red-500 border-red-100'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-50 text-green-700 border-green-100',
      in_revision: 'bg-yellow-50 text-yellow-700 border-yellow-100',
      completed: 'bg-blue-50 text-blue-700 border-blue-100',
      pending: 'bg-gray-50 text-gray-600 border-gray-100'
    };
    return colors[status as keyof typeof colors] || colors.pending;
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

  // ✅ Get full attachment URL
  const getFullAttachmentUrl = (attachmentPath: string | null) => {
    if (!attachmentPath) return null;
    // If it already starts with http, return as is
    if (attachmentPath.startsWith('http://') || attachmentPath.startsWith('https://')) {
      return attachmentPath;
    }
    // Remove leading slash if present to avoid double slashes
    const cleanPath = attachmentPath.startsWith('/') ? attachmentPath.slice(1) : attachmentPath;
    return `${API_URL}/${cleanPath}`;
  };

  // ✅ Get file name from path
  const getFileNameFromPath = (path: string | null) => {
    if (!path) return null;
    // If it's a URL, extract the last part
    const parts = path.split('/');
    return parts[parts.length - 1] || null;
  };

  // ✅ Get file icon based on extension
  const getFileIcon = (fileName: string | null) => {
    if (!fileName) return <File className="w-5 h-5 text-gray-400" />;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileTextIcon className="w-5 h-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileTextIcon className="w-5 h-5 text-blue-500" />;
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
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
      case 'html':
      case 'css':
      case 'json':
      case 'py':
        return <FileCode className="w-5 h-5 text-cyan-500" />;
      default:
        return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  // ✅ Get file size display
  const getFileSize = (path: string | null) => {
    if (!path) return null;
    // In a real app, you might get this from the API response
    // For now, we'll just return a placeholder
    return 'Unknown size';
  };

  // ✅ Helper to safely get attachments
  const getAttachments = (): string[] => {
    if (!project?.attachments) return [];
    if (Array.isArray(project.attachments)) return project.attachments;
    if (typeof project.attachments === 'string') {
      // If it's a comma-separated string
      return project.attachments.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
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

  const attachments = getAttachments();

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
                  {project.title}
                </h1>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(project.status)}`}>
                {project.status === 'active' && <Clock className="w-3 h-3" />}
                {project.status === 'in_revision' && <MessageSquare className="w-3 h-3" />}
                {project.status === 'completed' && <CircleCheck className="w-3 h-3" />}
                {project.status}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-7 h-7 rounded-full bg-[#0F2D63] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                {getInitials(project.assignedTo?.name || 'User')}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F2D63]">{project.assignedTo?.name || 'Unassigned'}</p>
                <p className="text-xs text-gray-400">{project.assignedTo?.email || 'No email'}</p>
              </div>
              <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                B2C
              </span>
            </div>
          </div>

          {/* Project Type */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Project Type</p>
            <p className="text-sm font-semibold text-[#0F2D63]">{project.type}</p>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Project Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">{project.description}</p>
          </div>

          {/* Priority & Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Priority</p>
              <p className={`text-sm font-bold capitalize ${project.priority === 'high' ? 'text-red-500' : project.priority === 'medium' ? 'text-amber-600' : 'text-blue-600'}`}>
                {project.priority}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Deadline</p>
              <p className="text-sm font-bold text-[#0F2D63] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {formatDate(project.deadline || project.createdAt)}
              </p>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              Attached Files
            </p>
            {attachments.length > 0 ? (
              <div className="space-y-3">
                {attachments.map((attachment, index) => {
                  const attachmentUrl = getFullAttachmentUrl(attachment);
                  const fileName = getFileNameFromPath(attachment);
                  const fileIcon = getFileIcon(fileName);
                  
                  return (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#0F2D63]/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          {fileIcon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                            {fileName || 'Unknown file'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {getFileSize(attachment)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {attachmentUrl && (
                          <>
                            <a
                              href={attachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                              title="View file"
                            >
                              <ExternalLink className="w-4 h-4 text-gray-500 hover:text-[#0F2D63]" />
                            </a>
                            <a
                              href={attachmentUrl}
                              download={fileName || 'download'}
                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                              title="Download file"
                            >
                              <Download className="w-4 h-4 text-gray-500 hover:text-[#0F2D63]" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-300 italic">No files attached by user.</p>
            )}
          </div>

          {/* Submit Button */}
          {project.status !== 'completed' && (
            <button
              onClick={() => navigate(`/admin/projects/${project._id}/submit`)}
              className="w-full py-3 bg-[#0F2D63] hover:bg-[#0a2050] text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Project
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProjectDetail;