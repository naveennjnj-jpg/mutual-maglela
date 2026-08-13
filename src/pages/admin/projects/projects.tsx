// pages/admin/Projects.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, MessageSquare, CircleCheck, Eye, Send, Calendar,
  AlertCircle, Loader2, WandSparkles, Mic, Users, Sparkles,
  XCircle, RotateCcw
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
  status: "Pending" | "In Progress" | "Under Review" | "Completed" | "On Hold" | "Cancelled" | "publish" | "Rejected";
  createdAt: string;
  updatedAt: string;
  __v: number;
  adminnote?: string | null;
  adminattachment?: string | null;
  feedbacknote?: string | null;
  feedbackadminattachment?: string | null;
}

interface ProjectStats {
  active: number;
  inRevision: number;
  completed: number;
  rejected: number;
}

const Projects: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'in_revision' | 'completed' | 'rejected'>('all');
  const [stats, setStats] = useState<ProjectStats>({ active: 0, inRevision: 0, completed: 0, rejected: 0 });
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [resubmitNote, setResubmitNote] = useState('');
  const [resubmitFile, setResubmitFile] = useState<File | null>(null);
  const [isResubmitting, setIsResubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/api/admin/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const projectsData = response.data.data || [];
        setProjects(projectsData);
        
        // Calculate stats - Include both 'Completed' and 'publish' for completed
        const statsData = {
          active: projectsData.filter((p: Project) => 
            p.status === 'Pending' || p.status === 'In Progress' || p.status === 'On Hold'
          ).length,
          inRevision: projectsData.filter((p: Project) => p.status === 'Under Review').length,
          completed: projectsData.filter((p: Project) => 
            p.status === 'Completed' || p.status === 'publish'
          ).length,
          rejected: projectsData.filter((p: Project) => p.status === 'Rejected').length,
        };
        setStats(statsData);
      }
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProjects = () => {
    let filtered = projects;

    if (activeFilter === 'active') {
      filtered = filtered.filter(p => 
        p.status === 'Pending' || p.status === 'In Progress' || p.status === 'On Hold'
      );
    } else if (activeFilter === 'in_revision') {
      filtered = filtered.filter(p => p.status === 'Under Review');
    } else if (activeFilter === 'completed') {
      filtered = filtered.filter(p => p.status === 'Completed' || p.status === 'publish');
    } else if (activeFilter === 'rejected') {
      filtered = filtered.filter(p => p.status === 'Rejected');
    }

    return filtered;
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

  const getStatusColor = (status: string) => {
    const colors = {
      'Pending': 'bg-gray-50 text-gray-600 border-gray-100',
      'In Progress': 'bg-green-50 text-green-700 border-green-100',
      'Under Review': 'bg-amber-50 text-amber-700 border-amber-100',
      'Completed': 'bg-blue-50 text-blue-700 border-blue-100',
      'On Hold': 'bg-yellow-50 text-yellow-700 border-yellow-100',
      'Cancelled': 'bg-red-50 text-red-600 border-red-100',
      'publish': 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'Rejected': 'bg-red-50 text-red-600 border-red-200'
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
      'publish': 'Published',
      'Rejected': 'Rejected'
    };
    return labels[status as keyof typeof labels] || status;
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
      'ai-writing': <WandSparkles className="w-3 h-3" />,
      'ai-speech': <Mic className="w-3 h-3" />,
      'hire-expert': <Users className="w-3 h-3" />
    };
    return icons[option as keyof typeof icons] || <Sparkles className="w-3 h-3" />;
  };

  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const uploadDocument = async (file: File): Promise<string | null> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const formData = new FormData();
      formData.append('document', file);

      const uploadResponse = await axios.post(
        `${API_URL}/api/auth/upload-document`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (!uploadResponse.data.success) {
        throw new Error(uploadResponse.data.message || 'Document upload failed');
      }

      const fileUrl = uploadResponse.data.data?.fileUrl || uploadResponse.data.data?.url || uploadResponse.data.data;

      if (!fileUrl) {
        throw new Error('File URL not returned from upload');
      }

      return fileUrl;

    } catch (err: any) {
      console.error('Upload error:', err);
      throw new Error(err.response?.data?.message || err.message || 'Failed to upload document');
    }
  };

  const handleResubmit = async (project: Project) => {
    setSelectedProject(project);
    setShowResubmitModal(true);
    setResubmitNote('');
    setResubmitFile(null);
  };

  const handleResubmitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject) return;
    if (!resubmitNote.trim()) {
      setError('Please add a note explaining the resubmission');
      return;
    }

    setIsResubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        setIsResubmitting(false);
        return;
      }

      let documentUrl = null;
      if (resubmitFile) {
        documentUrl = await uploadDocument(resubmitFile);
      }

      const updateData: any = {
        status: 'Under Review',
        adminnote: resubmitNote,
      };

      if (documentUrl) {
        updateData.adminattachment = documentUrl;
      }

      const response = await axios.put(
        `${API_URL}/api/admin/projects/${selectedProject._id}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setShowResubmitModal(false);
        setSelectedProject(null);
        setResubmitNote('');
        setResubmitFile(null);
        await fetchProjects();
      } else {
        setError(response.data.message || 'Failed to resubmit project');
      }
    } catch (err: any) {
      console.error('Error resubmitting project:', err);
      setError(err.response?.data?.message || 'Failed to resubmit project');
    } finally {
      setIsResubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading projects...</p>
        </div>
      </div>
    );
  }

  const filteredProjects = getFilteredProjects();

  return (
    <main className="flex-1">
      <div className="min-h-screen bg-[#F4F6FB] p-6 space-y-5">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C85A32] mb-1">
            Operations
          </p>
          <h1 className="text-2xl font-bold text-[#0F2D63]">Manage Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Handle project requests, submit work, and track revisions
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              activeFilter === 'all'
                ? 'bg-[#0F2D63] text-white border-[#0F2D63]'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            All
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              activeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {projects.length}
            </span>
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              activeFilter === 'active'
                ? 'bg-[#0F2D63] text-white border-[#0F2D63]'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Active
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              activeFilter === 'active' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {stats.active}
            </span>
          </button>
          <button
            onClick={() => setActiveFilter('in_revision')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              activeFilter === 'in_revision'
                ? 'bg-[#0F2D63] text-white border-[#0F2D63]'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            In Revision
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              activeFilter === 'in_revision' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {stats.inRevision}
            </span>
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              activeFilter === 'completed'
                ? 'bg-[#0F2D63] text-white border-[#0F2D63]'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <CircleCheck className="w-3.5 h-3.5" />
            Completed
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              activeFilter === 'completed' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {stats.completed}
            </span>
          </button>
          <button
            onClick={() => setActiveFilter('rejected')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              activeFilter === 'rejected'
                ? 'bg-[#0F2D63] text-white border-[#0F2D63]'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            Rejected
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              activeFilter === 'rejected' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {stats.rejected}
            </span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => {
              const isCompleted = project.status === 'Completed' || project.status === 'publish';
              const isRevision = project.status === 'Under Review';
              const isRejected = project.status === 'Rejected';
              const statusColor = isCompleted ? 'bg-blue-400' :
                                 isRevision ? 'bg-amber-400' :
                                 isRejected ? 'bg-red-400' :
                                 'bg-green-400';

              return (
                <div
                  key={project._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col"
                >
                  <div className={`h-1 ${statusColor}`}></div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium truncate flex items-center gap-1">
                        {getProceedOptionIcon(project.proceedOption)}
                        {getProceedOptionLabel(project.proceedOption)}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#0F2D63] text-sm leading-snug mb-2 line-clamp-1">
                      {project.title || 'Untitled Project'}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3 flex-1">
                      {project.description || 'No description'}
                    </p>

                    {/* Show rejection reason if rejected */}
                    {isRejected && project.feedbacknote && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3 text-xs">
                        <p className="font-semibold text-red-700 mb-1">Rejection Reason</p>
                        <p className="text-red-600 line-clamp-2">{project.feedbacknote}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getStatusColor(project.status)}`}>
                          {getStatusLabel(project.status)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        {formatDate(project.deadline)}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-gray-50 mt-auto">
                      <button
                        onClick={() => navigate(`/admin/projects/${project._id}`)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                      {isRejected ? (
                        <button
                          onClick={() => handleResubmit(project)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Resubmit
                        </button>
                      ) : !isCompleted && (
                        <button
                          onClick={() => navigate(`/admin/projects/${project._id}/submit`)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#0F2D63] hover:bg-[#0a2050] text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          Submit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F2D63] mb-2">No projects found</h3>
              <p className="text-sm text-gray-500">
                {activeFilter === 'all' ? 'No projects available' : `No ${activeFilter} projects`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Resubmit Modal */}
      {showResubmitModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-[500px] w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-[#0F2D63]">Resubmit Project</h3>
                <p className="text-sm text-gray-500">Add a note explaining the changes</p>
              </div>
              <button
                onClick={() => {
                  setShowResubmitModal(false);
                  setSelectedProject(null);
                  setResubmitNote('');
                  setResubmitFile(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleResubmitSubmit} className="p-6 space-y-4">
              {/* Project Info */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Resubmitting</p>
                <p className="text-sm font-semibold text-[#0F2D63]">{selectedProject.title}</p>
                <p className="text-xs text-gray-400">{selectedProject.type}</p>
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Note to User <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain what was revised and why the project should be reconsidered..."
                  value={resubmitNote}
                  onChange={(e) => setResubmitNote(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] resize-none"
                  disabled={isResubmitting}
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Attachment (Optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setResubmitFile(e.target.files[0]);
                    }
                  }}
                  accept=".pdf,.docx,.pptx"
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl p-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0F2D63] file:text-white hover:file:bg-[#0a2050] cursor-pointer"
                  disabled={isResubmitting}
                />
                {resubmitFile && (
                  <p className="text-xs text-green-600 mt-1">✓ {resubmitFile.name} selected</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowResubmitModal(false);
                    setSelectedProject(null);
                    setResubmitNote('');
                    setResubmitFile(null);
                    setError(null);
                  }}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-colors"
                  disabled={isResubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!resubmitNote.trim() || isResubmitting}
                  className="flex-1 py-2.5 bg-[#0F2D63] hover:bg-[#0a2050] text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Resubmitting...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Resubmit Project
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Projects;