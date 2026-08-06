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
  status: "Pending" | "In Progress" | "Under Review" | "Completed" | "On Hold" | "Cancelled" | "publish";
  createdAt: string;
  updatedAt: string;
  __v: number;
  adminnote?: string | null;
  adminattachment?: string | null;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: Project[];
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
  }, []);

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

      const response = await axios.get<ApiResponse>(`${API_URL}/api/auth/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const projectData = response.data.data || [];
        setProjects(projectData);
        setTotalProjects(projectData.length);
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
  // FILTER PROJECTS BASED ON TAB
  // ============================================

  const getFilteredProjects = () => {
    let filtered = projects;

    // ✅ Filter by proceedOption based on active tab
    if (activeTab !== "all") {
      filtered = filtered.filter(p => p.proceedOption === activeTab);
    }

    // ✅ Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredProjects = getFilteredProjects();

  // ============================================
  // GET TAB COUNT
  // ============================================

  const getTabCount = (tabId: string) => {
    if (tabId === "all") return projects.length;
    return projects.filter(p => p.proceedOption === tabId).length;
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
    if (attachmentPath.startsWith('http://') || attachmentPath.startsWith('https://')) {
      return attachmentPath;
    }
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
        return "bg-red-50 text-red-500";
      case "medium":
        return "bg-amber-50 text-amber-600";
      case "low":
        return "bg-green-50 text-green-500";
      case "critical":
        return "bg-purple-50 text-purple-600";
      default:
        return "bg-gray-50 text-gray-500";
    }
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

  const getSearchPlaceholder = () => {
    if (activeTab === "ai-writing") return "Search AI Writing projects…";
    if (activeTab === "ai-speech") return "Search AI Speech projects…";
    if (activeTab === "hire-expert") return "Search Hire Expert projects…";
    return "Search projects…";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // ============================================
  // VIEW PROJECT MODAL
  // ============================================

  const ViewProjectModal = () => {
    if (!selectedProject) return null;

    const attachmentUrl = getFullAttachmentUrl(selectedProject.attachments);
    const fileName = selectedProject.attachments ? getFileNameFromPath(selectedProject.attachments) : null;
    const fileIcon = fileName ? getFileIcon(fileName) : null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-[700px] w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
              </button>
              <span className="text-sm font-semibold text-gray-900">Project Details</span>
            </div>
            <button
              onClick={handleCloseModal}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Project Title</p>
                <h1 className="text-xl font-['Roboto'] font-bold text-[#0F2D63] leading-tight">{selectedProject.title || "Untitled"}</h1>
                <p className="text-sm text-gray-400 mt-1">{selectedProject.type || "No type"}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${getPriorityStyles(selectedProject.priority)}`}>
                  {selectedProject.priority}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl px-4 py-2">
              <p className="text-xs text-gray-400">Project ID: <span className="font-mono text-gray-600">{selectedProject.identifier}</span></p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Project Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{selectedProject.description || "No description provided"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Proceed Option</p>
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  {getProceedOptionIcon(selectedProject.proceedOption)}
                  {getProceedOptionLabel(selectedProject.proceedOption)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Deadline</p>
                <p className="text-sm font-semibold text-gray-700">{formatDate(selectedProject.deadline)}</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Attached Files</p>
              {selectedProject.attachments ? (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0F2D63]/10 rounded-xl flex items-center justify-center text-2xl">{fileIcon}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{fileName}</p>
                      <p className="text-xs text-gray-400">Click to view or download</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={attachmentUrl || '#'} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      <ExternalLink className="w-4 h-4 text-gray-500 hover:text-[#0F2D63]" />
                    </a>
                    <a href={attachmentUrl || '#'} download={fileName || 'download'} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-gray-500 hover:text-[#0F2D63]" />
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-300 italic">No files attached</p>
              )}
            </div>

            <div className="text-xs text-gray-400 border-t border-gray-100 pt-4">Created: {formatDate(selectedProject.createdAt)}</div>

            <div className="flex gap-3 pt-2">
              {selectedProject.proceedOption === "ai-writing" && (
                <button
                  onClick={() => { handleCloseModal(); navigate(`/user/narrative-engine`); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#0F2D63] hover:bg-[#1a3d7a] text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  <Sparkles className="w-4 h-4" /> Open in AI Writing
                </button>
              )}
              {selectedProject.proceedOption === "ai-speech" && (
                <button
                  onClick={() => { handleCloseModal(); navigate(`/user/voice-calibrator`); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#0F2D63] hover:bg-[#1a3d7a] text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  <Mic className="w-4 h-4" /> Open AI Speech
                </button>
              )}
              {selectedProject.proceedOption === "hire-expert" && (
                <button
                  onClick={() => { handleCloseModal(); navigate(`/user/hire-expert`); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#0F2D63] hover:bg-[#1a3d7a] text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  <Users className="w-4 h-4" /> View Expert Details
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
    <div className="min-h-screen bg-[#F9F7F4] p-6">
      <div className="max-w-[1200px] mx-auto">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-1">Workspace</p>
            <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63]">My Projects</h1>
            <p className="text-gray-500 text-sm mt-1">{totalProjects} project{totalProjects !== 1 ? 's' : ''} total</p>
          </div>
          <button
            onClick={handleCreateProject}
            className="flex items-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl text-sm mb-4">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* TABS */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = getTabCount(tab.id);

            let iconColor = "text-gray-500";
            if (isActive) iconColor = "text-white";
            else if (tab.id === "ai-writing") iconColor = "text-purple-500";
            else if (tab.id === "ai-speech") iconColor = "text-blue-600";
            else if (tab.id === "hire-expert") iconColor = "text-[#C85A32]";

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${isActive
                    ? "bg-[#0F2D63] text-white shadow-sm"
                    : "text-gray-500 hover:text-[#0F2D63]"
                  }`}
              >
                <span className={isActive ? "text-white" : iconColor}>
                  <Icon className="w-4 h-4" />
                </span>
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                    }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#C85A32] bg-gray-50"
            />
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin" />
          </div>
        ) : (
          /* PROJECTS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => {
                const priorityClass = getPriorityStyles(project.priority);
                const colorBar = getColorBar(project.type);

                return (
                  <div
                    key={project._id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group"
                  >
                    <div className={`h-1 ${colorBar}`}></div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-[#0F2D63] text-sm leading-tight">{project.title || "Untitled Project"}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${priorityClass}`}>
                          {project.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{project.description || "No description"}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(project.deadline)}
                        </span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full">{project.type || "No type"}</span>
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-gray-50">
                        <button
                          onClick={() => handleViewProject(project)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-semibold transition-colors"
                        >
                          <Eye className="w-3 h-3" /> View
                        </button>
                        <button
                          onClick={() => {
                            if (project.proceedOption === "ai-writing") {
                              navigate("/user/narrative-engine");
                            } else if (project.proceedOption === "ai-speech") {
                              navigate("/user/voice-calibrator");
                            } else if (project.proceedOption === "hire-expert") {
                              navigate("/user/hire-expert");
                            } else {
                              navigate("/user/projects");
                            }
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#0F2D63] hover:bg-[#1a3d7a] text-white rounded-xl text-xs font-semibold transition-colors"
                        >
                          <Sparkles className="w-3 h-3" />
                          {project.proceedOption === "ai-writing"
                            ? "Open in AI Writing"
                            : project.proceedOption === "ai-speech"
                              ? "Open in AI Speech"
                              : project.proceedOption === "hire-expert"
                                ? "View"
                                : "Open"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-[#0F2D63] mb-2">No projects found</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {searchTerm ? `No projects match "${searchTerm}"` : "Get started by creating your first project"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={handleCreateProject}
                    className="inline-flex items-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Create New Project
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      {showViewModal && <ViewProjectModal />}
    </div>
  );
};

export default Projects;