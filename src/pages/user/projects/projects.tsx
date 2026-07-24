// pages/user/Projects.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  WandSparkles,
  Mic,
  Users,
  Calendar,
  Eye,
  Sparkles,
  Loader2,
  AlertCircle,
  ChevronRight,
  FileText,
  Clock,
  CircleCheck,
  AlertTriangle,
  Download,
  ExternalLink
} from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

// ============================================
// INTERFACES / TYPES
// ============================================

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
  status: "Pending" | "In Progress" | "Under Review" | "Completed" | "On Hold" | "Cancelled";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: Project | Project[] | { projects: Project[]; total: number };
}

// ============================================
// MAIN COMPONENT
// ============================================

const Projects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProjects, setTotalProjects] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // ============================================
  // TABS CONFIGURATION
  // ============================================

  const tabs = [
    { id: "all", label: "All Projects", icon: Sparkles },
    { id: "ai-writing", label: "AI Writing", icon: WandSparkles },
    { id: "ai-speech", label: "AI Speech", icon: Mic },
    { id: "hire-expert", label: "Hire Expert", icon: Users },
  ];

  // ============================================
  // FETCH PROJECTS
  // ============================================

  useEffect(() => {
    fetchProjects();
  }, [activeTab]);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view projects");
        setLoading(false);
        return;
      }

      // Build URL with filters
      let url = `${API_URL}/api/auth/projects`;
      if (activeTab !== "all") {
        url += `?proceedOption=${activeTab}`;
      }

      const response = await axios.get<ApiResponse>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        let projectData: Project[] = [];
        let total = 0;

        // Handle different response structures
        if (response.data.data) {
          if (Array.isArray(response.data.data)) {
            projectData = response.data.data;
            total = projectData.length;
          } else if ("projects" in response.data.data) {
            projectData = response.data.data.projects;
            total = response.data.data.total;
          } else {
            projectData = [response.data.data];
            total = 1;
          }
        }

        setProjects(projectData);
        setTotalProjects(total);
      } else {
        setError("Failed to load projects");
        setProjects([]);
        setTotalProjects(0);
      }
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      setError(err.response?.data?.message || "Could not load projects");
      setProjects([]);
      setTotalProjects(0);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // HANDLERS
  // ============================================

  const handleCreateProject = () => {
    navigate("/user/projects/create");
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedProject(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getProceedOptionLabel = (option: string) => {
    switch (option) {
      case "ai-writing": return "AI Writing";
      case "ai-speech": return "AI Speech";
      case "hire-expert": return "Hire Expert";
      default: return option;
    }
  };

  const getProceedOptionIcon = (option: string) => {
    switch (option) {
      case "ai-writing": return <WandSparkles className="w-3 h-3" />;
      case "ai-speech": return <Mic className="w-3 h-3" />;
      case "hire-expert": return <Users className="w-3 h-3" />;
      default: return <Sparkles className="w-3 h-3" />;
    }
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

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

  const getFileNameFromPath = (path: string) => {
    return path.split('/').pop() || path;
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const getFileIcon = (filename: string) => {
    const ext = getFileExtension(filename);
    const iconMap: Record<string, string> = {
      'pdf': '📄',
      'doc': '📝',
      'docx': '📝',
      'xls': '📊',
      'xlsx': '📊',
      'ppt': '📽️',
      'pptx': '📽️',
      'txt': '📃',
      'zip': '📦',
      'rar': '📦',
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'png': '🖼️',
      'gif': '🖼️',
    };
    return iconMap[ext] || '📎';
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
      case "low":
        return "bg-green-50 text-green-500 dark:bg-green-900/30 dark:text-green-400";
      case "critical":
        return "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      "Pending": {
        bg: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800",
        text: "text-yellow-700 dark:text-yellow-300",
        icon: <Clock className="w-3 h-3" />
      },
      "In Progress": {
        bg: "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800",
        text: "text-blue-700 dark:text-blue-300",
        icon: <Loader2 className="w-3 h-3 animate-spin" />
      },
      "Under Review": {
        bg: "bg-purple-50 border-purple-200 dark:bg-purple-900/30 dark:border-purple-800",
        text: "text-purple-700 dark:text-purple-300",
        icon: <AlertTriangle className="w-3 h-3" />
      },
      "Completed": {
        bg: "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800",
        text: "text-green-700 dark:text-green-300",
        icon: <CircleCheck className="w-3 h-3" />
      },
      "On Hold": {
        bg: "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700",
        text: "text-gray-700 dark:text-gray-300",
        icon: <AlertTriangle className="w-3 h-3" />
      },
      "Cancelled": {
        bg: "bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800",
        text: "text-red-700 dark:text-red-300",
        icon: <AlertTriangle className="w-3 h-3" />
      },
    };
    return statusMap[status] || statusMap["Pending"];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getColorBar = (type: string) => {
    const colors: Record<string, string> = {
      "Research Paper": "bg-purple-400",
      "Journal Article": "bg-blue-400",
      "Policy Brief": "bg-green-400",
      "Technical Report": "bg-orange-400",
      "Manuscript Editing": "bg-red-400",
      "Content Writing": "bg-pink-400",
      "Data Analysis": "bg-indigo-400",
      "Literature Review": "bg-teal-400",
      "Grant Proposal": "bg-amber-400",
    };
    return colors[type] || "bg-gray-400";
  };

  // Filter projects based on search term
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get tab count
  const getTabCount = (tabId: string) => {
    if (tabId === "all") return projects.length;
    return projects.filter(p => p.proceedOption === tabId).length;
  };

  // ============================================
  // VIEW PROJECT MODAL
  // ============================================

  const ViewProjectModal = () => {
    if (!selectedProject) return null;

    const statusInfo = getStatusBadge(selectedProject.status);
    const priorityClass = getPriorityStyles(selectedProject.priority);
    const attachmentUrl = getFullAttachmentUrl(selectedProject.attachments);
    const fileName = selectedProject.attachments ? getFileNameFromPath(selectedProject.attachments) : null;
    const fileIcon = fileName ? getFileIcon(fileName) : null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl max-w-[700px] w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
              </button>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Project Details</span>
            </div>
            <button
              onClick={handleCloseModal}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Title & Status */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Project Title
                </p>
                <h1 className="text-xl font-['Roboto'] font-bold text-[#0F2D63] dark:text-white leading-tight">
                  {selectedProject.title}
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  {selectedProject.type}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.bg} ${statusInfo.text}`}>
                  {statusInfo.icon}
                  {selectedProject.status}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${priorityClass}`}>
                  {selectedProject.priority}
                </span>
              </div>
            </div>

            {/* Project ID */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-2">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Project ID: <span className="font-mono text-gray-600 dark:text-gray-300">{selectedProject.identifier}</span>
              </p>
            </div>

            {/* Description */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Project Description
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedProject.description || "No description provided"}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Proceed Option
                </p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  {getProceedOptionIcon(selectedProject.proceedOption)}
                  {getProceedOptionLabel(selectedProject.proceedOption)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Deadline
                </p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {selectedProject.deadline ? formatDate(selectedProject.deadline) : "No deadline"}
                </p>
              </div>
            </div>

            {/* Attachments */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Attached Files
              </p>
              {selectedProject.attachments ? (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0F2D63]/10 dark:bg-[#1a3d7a]/20 rounded-xl flex items-center justify-center text-2xl">
                      {fileIcon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {fileName}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Click to view or download
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={attachmentUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="View file"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-500 hover:text-[#0F2D63] dark:hover:text-[#C85A32]" />
                    </a>
                    <a
                      href={attachmentUrl || '#'}
                      download={fileName || 'download'}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Download file"
                    >
                      <Download className="w-4 h-4 text-gray-500 hover:text-[#0F2D63] dark:hover:text-[#C85A32]" />
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-300 dark:text-gray-600 italic">
                  No files attached
                </p>
              )}
            </div>

            {/* Created At */}
            <div className="text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-4">
              Created: {formatDate(selectedProject.createdAt)}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              {selectedProject.proceedOption === "ai-writing" && (
                <button
                  onClick={() => {
                    handleCloseModal();
                    navigate(`/user/narrative-engine`);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Open in AI Writing
                </button>
              )}
              {selectedProject.proceedOption === "ai-speech" && (
                <button
                  onClick={() => {
                    handleCloseModal();
                    navigate(`/user/voice-calibrator`);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
                >
                  <Mic className="w-4 h-4" />
                  Open AI Speech
                </button>
              )}
              {selectedProject.proceedOption === "hire-expert" && (
                <button
                  onClick={() => {
                    handleCloseModal();
                    navigate(`/user/expert`);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
                >
                  <Users className="w-4 h-4" />
                  View Expert Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6">
      <div className="max-w-[1500px] mx-auto">
        {/* ==========================================
            HEADER
            ========================================== */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-1">
              Workspace
            </p>
            <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63] dark:text-white">
              My Projects
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {totalProjects} project{totalProjects !== 1 ? 's' : ''} total
            </p>
          </div>

          <button
            onClick={handleCreateProject}
            className="flex items-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors dark:bg-[#C85A32] dark:hover:bg-[#a8472a]"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {/* ==========================================
            ERROR MESSAGE
            ========================================== */}
        {error && (
          <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-xl text-sm mb-4">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* ==========================================
            TABS
            ========================================== */}
        <div className="flex gap-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-1.5 shadow-sm mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = getTabCount(tab.id);

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${isActive
                    ? "bg-[#0F2D63] text-white shadow-sm dark:bg-[#0F2D63]"
                    : "text-gray-500 hover:text-[#0F2D63] dark:text-gray-400 dark:hover:text-white"
                  }`}
              >
                <span className={isActive ? "text-white" : "text-current"}>
                  <Icon className="w-4 h-4" />
                </span>
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ==========================================
            SEARCH BAR
            ========================================== */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder={`Search projects...`}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/10 bg-gray-50 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 transition-all"
            />
          </div>
        </div>

        {/* ==========================================
            LOADING STATE
            ========================================== */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin" />
          </div>
        ) : (
          /* ==========================================
             PROJECTS GRID
             ========================================== */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => {
                const statusInfo = getStatusBadge(project.status);
                const priorityClass = getPriorityStyles(project.priority);
                const colorBar = getColorBar(project.type);
                const hasAttachment = !!project.attachments;

                return (
                  <div
                    key={project._id}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-all dark:hover:shadow-gray-900/50 group"
                  >
                    {/* Color Bar */}
                    <div className={`h-1 ${colorBar}`}></div>

                    <div className="p-5">
                      {/* Title & Priority */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-[#0F2D63] dark:text-white text-sm leading-tight">
                          {project.title}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${priorityClass}`}
                        >
                          {project.priority}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                        {project.description || "No description"}
                      </p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {project.deadline ? formatDate(project.deadline) : "No deadline"}
                        </span>
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                          {project.type}
                        </span>
                        <span className="flex items-center gap-0.5 text-gray-400 dark:text-gray-500">
                          {getProceedOptionIcon(project.proceedOption)}
                          <span className="text-[10px]">
                            {getProceedOptionLabel(project.proceedOption)}
                          </span>
                        </span>
                      </div>

                      {/* Status & Attachment Indicator */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusInfo.bg} ${statusInfo.text}`}
                        >
                          {statusInfo.icon}
                          {project.status}
                        </span>
                        {hasAttachment && (
                          <span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
                            <FileText className="w-3 h-3" />
                            Has attachment
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-gray-50 dark:border-gray-700">
                        <button
                          onClick={() => handleViewProject(project)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-xs font-semibold transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                        <button
                          onClick={() => {
                            if (project.proceedOption === "ai-writing") {
                              navigate(`/user/narrative-engine`);
                            } else if (project.proceedOption === "ai-speech") {
                              navigate(`/user/voice-calibrator`);
                            } else {
                              navigate(`/user/expert`);
                            }
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#0F2D63] hover:bg-[#1a3d7a] text-white rounded-xl text-xs font-semibold transition-colors"
                        >
                          <Sparkles className="w-3 h-3" />
                          Open
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              /* ==========================================
                 EMPTY STATE
                 ========================================== */
              <div className="col-span-full text-center py-12">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-[#0F2D63] dark:text-white mb-2">
                  No projects found
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {searchTerm
                    ? `No projects match "${searchTerm}"`
                    : "Get started by creating your first project"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={handleCreateProject}
                    className="inline-flex items-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Project
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==========================================
          VIEW PROJECT MODAL
          ========================================== */}
      {showViewModal && <ViewProjectModal />}
    </div>
  );
};

export default Projects;