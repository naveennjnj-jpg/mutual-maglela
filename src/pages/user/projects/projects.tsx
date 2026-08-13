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
  Download,
  ExternalLink,
  Clock,
  CircleAlert,
  CircleCheck,
  Trash2,
  ArrowLeft,
  FileText,
  Paperclip,
  ThumbsUp,
  MessageSquare,
  ThumbsDown,
  X,
  Upload
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
  const [activeTab, setActiveTab] = useState("ai-writing");
  const [statusFilter, setStatusFilter] = useState("active");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProjects, setTotalProjects] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [feedbackAttachment, setFeedbackAttachment] = useState<File | null>(null);
  const [feedbackAction, setFeedbackAction] = useState<"approve" | "feedback" | "reject" | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // ============================================
  // TABS CONFIGURATION
  // ============================================

  const mainTabs = [
    { id: "ai-writing", label: "AI Writing", icon: WandSparkles, iconColor: "text-purple-600" },
    { id: "ai-speech", label: "AI Speech", icon: Mic, iconColor: "text-blue-600" },
    { id: "hire-expert", label: "Hire Expert", icon: Users, iconColor: "text-[#C85A32]" },
  ];

  const statusTabs = [
    { id: "active", label: "Active", icon: Clock },
    { id: "revision", label: "In Revision", icon: CircleAlert },
    { id: "completed", label: "Completed", icon: CircleCheck },
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
  // UPLOAD DOCUMENT
  // ============================================

  const uploadDocument = async (file: File): Promise<string> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to upload files.");
      }

      const formData = new FormData();
      formData.append("document", file);

      const response = await axios.post(
        `${API_URL}/api/auth/upload-document`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          },
        }
      );

      console.log("Upload Response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Document upload failed");
      }

      return response.data.data.fileUrl;
    } catch (error: any) {
      console.error("Upload error:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to upload document");
    }
  };

  // ============================================
  // UPDATE PROJECT STATUS API
  // ============================================

  const updateProjectStatus = async (
    projectId: string, 
    newStatus: string, 
    note?: string, 
    attachment?: File | null
  ) => {
    setIsUpdating(true);
    setError(null);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to continue");
        setIsUpdating(false);
        return;
      }

      let attachmentUrl = "";

      // Upload attachment first if provided
      if (attachment) {
        try {
          attachmentUrl = await uploadDocument(attachment);
        } catch (uploadError: any) {
          setError(uploadError.message);
          setIsUpdating(false);
          return;
        }
      }

      // Prepare the update payload
      const payload: any = {
        status: newStatus,
      };

      if (note) {
        payload.feedbacknote = note;
      }

      if (attachmentUrl) {
        payload.feedbackadminattachment = attachmentUrl;
      }

      const response = await axios.put(
        `${API_URL}/api/admin/projects/${projectId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Refresh projects after update
        await fetchProjects();
        // Close modals
        setShowFeedbackModal(false);
        setShowDetailView(false);
        setSelectedProject(null);
        // Reset form
        setFeedbackNote("");
        setFeedbackAttachment(null);
        setFeedbackAction(null);
        setUploadProgress(0);
        return true;
      } else {
        setError(response.data.message || "Failed to update project status");
        return false;
      }
    } catch (err: any) {
      console.error("Error updating project status:", err);
      setError(err.response?.data?.message || "Could not update project status");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // ============================================
  // HANDLERS
  // ============================================

  const handleCreateProject = () => {
    navigate("/user/projects/create");
  };

  const handleViewDetail = (project: Project) => {
    setSelectedProject(project);
    setShowDetailView(true);
  };

  const handleCloseDetail = () => {
    setShowDetailView(false);
    setSelectedProject(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleBack = () => {
    setShowDetailView(false);
    setSelectedProject(null);
  };

  // Status action handlers
  const handleApprove = () => {
    if (selectedProject) {
      updateProjectStatus(selectedProject._id, "Completed");
    }
  };

  const handleRequestFeedback = () => {
    setFeedbackAction("feedback");
    setShowFeedbackModal(true);
  };

  const handleReject = () => {
    setFeedbackAction("reject");
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedProject || !feedbackAction) return;

    // Validate note
    if (!feedbackNote.trim()) {
      setError("Please enter a note");
      return;
    }

    let newStatus = "";
    if (feedbackAction === "feedback") {
      newStatus = "In Progress";
    } else if (feedbackAction === "reject") {
      newStatus = "On Hold";
    }

    await updateProjectStatus(
      selectedProject._id,
      newStatus,
      feedbackNote,
      feedbackAttachment
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a valid file (JPG, PNG, GIF, WebP, PDF, DOC, DOCX)");
        return;
      }
      setFeedbackAttachment(file);
      setError(null);
    }
  };

  const removeAttachment = () => {
    setFeedbackAttachment(null);
    setUploadProgress(0);
  };

  // ============================================
  // FILTER PROJECTS
  // ============================================

  const getFilteredProjects = () => {
    let filtered = projects;

    // Filter by proceedOption (main tab)
    filtered = filtered.filter(p => p.proceedOption === activeTab);

    // Filter by status (status sub-tab)
    if (statusFilter === "active") {
      filtered = filtered.filter(p => 
        p.status === "Pending" || 
        p.status === "In Progress" || 
        p.status === "On Hold"
      );
    } else if (statusFilter === "revision") {
      filtered = filtered.filter(p => p.status === "Under Review");
    } else if (statusFilter === "completed") {
      filtered = filtered.filter(p => p.status === "Completed" || p.status === "publish");
    }

    // Filter by search term
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
  // GET COUNTS
  // ============================================

  const getMainTabCount = (tabId: string) => {
    return projects.filter(p => p.proceedOption === tabId).length;
  };

  const getStatusTabCount = (statusId: string) => {
    const filtered = projects.filter(p => p.proceedOption === activeTab);
    
    if (statusId === "active") {
      return filtered.filter(p => 
        p.status === "Pending" || 
        p.status === "In Progress" || 
        p.status === "On Hold"
      ).length;
    } else if (statusId === "revision") {
      return filtered.filter(p => p.status === "Under Review").length;
    } else if (statusId === "completed") {
      return filtered.filter(p => p.status === "Completed" || p.status === "publish").length;
    }
    return 0;
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
      'webp': '🖼️',
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-amber-600";
      case "low":
        return "text-green-500";
      case "critical":
        return "text-purple-600";
      default:
        return "text-gray-500";
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
    const tabLabel = mainTabs.find(t => t.id === activeTab)?.label || "projects";
    return `Search ${tabLabel} projects…`;
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

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string; icon: JSX.Element }> = {
      "Pending": { 
        label: "Pending", 
        className: "bg-gray-100 text-gray-600",
        icon: <Clock className="w-3 h-3" />
      },
      "In Progress": { 
        label: "In Progress", 
        className: "bg-blue-100 text-blue-600",
        icon: <Clock className="w-3 h-3" />
      },
      "Under Review": { 
        label: "In Revision", 
        className: "bg-amber-50 border-amber-100 text-amber-700",
        icon: <CircleAlert className="w-3 h-3" />
      },
      "Completed": { 
        label: "Completed", 
        className: "bg-green-100 text-green-600",
        icon: <CircleCheck className="w-3 h-3" />
      },
      "On Hold": { 
        label: "On Hold", 
        className: "bg-yellow-100 text-yellow-600",
        icon: <Clock className="w-3 h-3" />
      },
      "Cancelled": { 
        label: "Cancelled", 
        className: "bg-red-100 text-red-600",
        icon: <CircleAlert className="w-3 h-3" />
      },
      "publish": { 
        label: "Published", 
        className: "bg-emerald-100 text-emerald-600",
        icon: <CircleCheck className="w-3 h-3" />
      },
    };
    return statusMap[status] || { 
      label: status, 
      className: "bg-gray-100 text-gray-600",
      icon: <Clock className="w-3 h-3" />
    };
  };

  // ============================================
  // FEEDBACK MODAL
  // ============================================

  const FeedbackModal = () => {
    if (!showFeedbackModal) return null;

    const isFeedback = feedbackAction === "feedback";
    const title = isFeedback ? "Request Feedback" : "Reject Project";
    const description = isFeedback 
      ? "Add a note and optional attachment for the admin" 
      : "Provide a reason — admin will redo the project";

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-[500px] w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div>
              <h3 className="text-lg font-bold text-[#0F2D63]">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
            <button
              onClick={() => {
                setShowFeedbackModal(false);
                setFeedbackNote("");
                setFeedbackAttachment(null);
                setFeedbackAction(null);
                setError(null);
                setUploadProgress(0);
              }}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Your Note <span className="text-red-500">*</span>
              </label>
              <textarea
                value={feedbackNote}
                onChange={(e) => {
                  setFeedbackNote(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter your feedback or reason..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C85A32] bg-gray-50 text-sm min-h-[100px] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Attachment (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="feedbackAttachment"
                  accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx"
                />
                <label 
                  htmlFor="feedbackAttachment" 
                  className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#C85A32] transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {feedbackAttachment ? feedbackAttachment.name : "Click to attach a file (max 10MB)"}
                  </span>
                </label>
                
                {feedbackAttachment && (
                  <div className="mt-2 flex items-center justify-between bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getFileIcon(feedbackAttachment.name)}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                          {feedbackAttachment.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {(feedbackAttachment.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeAttachment}
                      className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                )}

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#C85A32] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Uploading: {uploadProgress}%</p>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setFeedbackNote("");
                  setFeedbackAttachment(null);
                  setFeedbackAction(null);
                  setError(null);
                  setUploadProgress(0);
                }}
                disabled={isUpdating}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                disabled={!feedbackNote.trim() || isUpdating}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isFeedback
                    ? "bg-amber-500 hover:bg-amber-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                } ${(!feedbackNote.trim() || isUpdating) ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isUpdating ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  isFeedback ? "Send Feedback" : "Reject Project"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // DETAIL VIEW COMPONENT
  // ============================================

// ============================================
// DETAIL VIEW COMPONENT
// ============================================

const ProjectDetailView = () => {
  if (!selectedProject) return null;

  const attachmentUrl = getFullAttachmentUrl(selectedProject.attachments);
  const fileName = selectedProject.attachments ? getFileNameFromPath(selectedProject.attachments) : null;
  const fileIcon = fileName ? getFileIcon(fileName) : null;

  const adminAttachmentUrl = getFullAttachmentUrl(selectedProject.adminattachment || null);
  const adminFileName = selectedProject.adminattachment ? getFileNameFromPath(selectedProject.adminattachment) : null;
  const adminFileIcon = adminFileName ? getFileIcon(adminFileName) : null;

  const statusInfo = getStatusBadge(selectedProject.status);
  const isRevision = selectedProject.status === "Under Review";
  const isCompleted = selectedProject.status === "Completed" || selectedProject.status === "publish";

  return (
    <>
      <div className="min-h-screen bg-[#F9F7F4] p-6">
        <div className="max-w-[700px] mx-auto space-y-5">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0F2D63] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Projects
          </button>

          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.className} mb-3`}>
              {statusInfo.icon}
              {statusInfo.label}
            </span>
            <h1 className="text-xl font-['Roboto'] font-bold text-[#0F2D63] leading-tight mb-1">
              {selectedProject.title || "Untitled"}
            </h1>
            <p className="text-sm text-gray-400">{selectedProject.type || "No type"}</p>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Project Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {selectedProject.description || "No description provided"}
            </p>
          </div>

          {/* Priority & Deadline */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Priority</p>
              <p className={`text-sm font-bold capitalize ${getPriorityColor(selectedProject.priority)}`}>
                {selectedProject.priority}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Deadline</p>
              <p className="text-sm font-bold text-[#0F2D63] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {formatDate(selectedProject.deadline)}
              </p>
            </div>
          </div>

          {/* User Attached Files */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Attached Files</p>
              <span className="bg-gray-100 text-gray-600 text-[8px] font-bold px-1.5 py-0.5 rounded-full">USER</span>
            </div>
            {selectedProject.attachments ? (
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
                  <a 
                    href={attachmentUrl || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="View file"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-500 hover:text-[#0F2D63]" />
                  </a>
                  <a 
                    href={attachmentUrl || '#'} 
                    download={fileName || 'download'} 
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Download file"
                  >
                    <Download className="w-4 h-4 text-gray-500 hover:text-[#0F2D63]" />
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-300 italic">No files attached by user.</p>
            )}
          </div>

          {/* Admin Section - For Revision or Completed */}
          {(isRevision || isCompleted) && (selectedProject.adminnote || selectedProject.adminattachment) && (
            <div className={`rounded-2xl border p-5 ${
              isRevision 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              {/* Admin Section Header */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">
                  {isRevision ? '📋' : '✅'}
                </span>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${
                  isRevision ? 'text-blue-600' : 'text-green-600'
                }`}>
                  {isRevision ? 'Admin Submission' : 'Admin Final Submission'}
                </p>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                  isRevision ? 'bg-blue-200 text-blue-700' : 'bg-green-200 text-green-700'
                }`}>
                  ADMIN
                </span>
              </div>

              {/* Admin Note */}
              {selectedProject.adminnote && (
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Note from Admin</p>
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedProject.adminnote}
                    </p>
                  </div>
                </div>
              )}

              {/* Admin Attachment */}
              {selectedProject.adminattachment && (
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Admin Attachment</p>
                  <div className={`flex items-center justify-between p-3 bg-white rounded-xl border ${
                    isRevision ? 'border-blue-100' : 'border-green-100'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl ${
                        isRevision ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {adminFileIcon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{adminFileName}</p>
                        <p className="text-xs text-gray-400">Admin provided file — click to view or download</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={adminAttachmentUrl || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`p-2 rounded-lg transition-colors ${
                          isRevision ? 'hover:bg-blue-200' : 'hover:bg-green-200'
                        }`}
                        title="View admin file"
                      >
                        <ExternalLink className={`w-4 h-4 ${
                          isRevision ? 'text-blue-600 hover:text-blue-800' : 'text-green-600 hover:text-green-800'
                        }`} />
                      </a>
                      <a 
                        href={adminAttachmentUrl || '#'} 
                        download={adminFileName || 'download'} 
                        className={`p-2 rounded-lg transition-colors ${
                          isRevision ? 'hover:bg-blue-200' : 'hover:bg-green-200'
                        }`}
                        title="Download admin file"
                      >
                        <Download className={`w-4 h-4 ${
                          isRevision ? 'text-blue-600 hover:text-blue-800' : 'text-green-600 hover:text-green-800'
                        }`} />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons - For Revision */}
          {isRevision && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">What would you like to do?</p>
              
              <button
                onClick={handleApprove}
                disabled={isUpdating}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                  {isUpdating ? (
                    <Loader2 className="w-[18px] h-[18px] text-green-600 animate-spin" />
                  ) : (
                    <ThumbsUp className="w-[18px] h-[18px] text-green-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Approve</p>
                  <p className="text-xs text-gray-400 mt-0.5">Accept the work — moves to Completed</p>
                </div>
              </button>
              
              <button
                onClick={handleRequestFeedback}
                disabled={isUpdating}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-amber-300 hover:bg-amber-50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                  <MessageSquare className="w-[18px] h-[18px] text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Request Feedback</p>
                  <p className="text-xs text-gray-400 mt-0.5">Add a note and optional attachment for the admin</p>
                </div>
              </button>
              
              <button
                onClick={handleReject}
                disabled={isUpdating}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-red-300 hover:bg-red-50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 transition-colors">
                  <ThumbsDown className="w-[18px] h-[18px] text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Reject</p>
                  <p className="text-xs text-gray-400 mt-0.5">Provide a reason — admin will redo the project</p>
                </div>
              </button>
            </div>
          )}

          {/* Action Buttons - For Completed */}
          {isCompleted && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Project Completed</p>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-200">
                <CircleCheck className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-700">This project has been completed</p>
                  <p className="text-xs text-green-600 mt-0.5">You can view the final submission below</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <FeedbackModal />
    </>
  );
};

  // ============================================
  // RENDER
  // ============================================

  if (showDetailView && selectedProject) {
    return <ProjectDetailView />;
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4] p-6">
      <div className="max-w-[1200px] mx-auto">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-1">Workspace</p>
            <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63]">My Projects</h1>
            <p className="text-gray-500 text-sm mt-1">{totalProjects} projects total</p>
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

        {/* MAIN TABS - AI Writing, AI Speech, Hire Expert */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm mb-6">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = getMainTabCount(tab.id);

            let iconColor = "text-gray-500";
            if (isActive) iconColor = "text-white";
            else if (tab.id === "ai-writing") iconColor = "text-purple-600";
            else if (tab.id === "ai-speech") iconColor = "text-blue-600";
            else if (tab.id === "hire-expert") iconColor = "text-[#C85A32]";

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setStatusFilter("active");
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#0F2D63] text-white shadow-sm"
                    : "text-gray-500 hover:text-[#0F2D63]"
                }`}
              >
                <span className={isActive ? "text-white" : iconColor}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
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

        {/* STATUS TABS - Active, In Revision, Completed */}
        <div className="flex gap-1.5 mb-5">
          {statusTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = statusFilter === tab.id;
            const count = getStatusTabCount(tab.id);

            let iconColor = "text-gray-500";
            if (isActive) iconColor = "text-white";
            else if (tab.id === "active") iconColor = "text-blue-600";
            else if (tab.id === "revision") iconColor = "text-amber-700";
            else if (tab.id === "completed") iconColor = "text-green-600";

            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isActive
                    ? "bg-[#0F2D63] text-white border-[#0F2D63]"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span className={isActive ? "text-white" : iconColor}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
                {tab.label}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
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
                const statusInfo = getStatusBadge(project.status);
                const isRevision = project.status === "Under Review";
                const isCompleted = project.status === "Completed" || project.status === "publish";

                return (
                  <div
                    key={project._id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group"
                  >
                    <div className={`h-1 ${colorBar}`}></div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-[#0F2D63] text-sm leading-tight flex-1">
                          {project.title || "Untitled Project"}
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${priorityClass}`}>
                          {project.priority}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                        {project.description || "No description"}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(project.deadline)}
                        </span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                          {project.type || "No type"}
                        </span>
                      </div>

                      {/* Admin Note Preview - For Revision */}
                      {isRevision && project.adminnote && (
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-3 text-xs">
                          <p className="font-semibold text-amber-700 mb-1">Admin submitted a revision</p>
                          <p className="text-amber-600 line-clamp-2">{project.adminnote}</p>
                        </div>
                      )}

                      {/* Admin Note Preview - For Completed */}
                      {isCompleted && project.adminnote && (
                        <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-3 text-xs">
                          <p className="font-semibold text-green-700 mb-1">✅ Admin final submission</p>
                          <p className="text-green-600 line-clamp-2">{project.adminnote}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                        <button
                          onClick={() => handleViewDetail(project)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                            isRevision
                              ? "bg-amber-500 hover:bg-amber-600 text-white"
                              : isCompleted
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : "bg-[#0F2D63] hover:bg-[#1a3d7a] text-white"
                          }`}
                        >
                          <Eye className="w-3 h-3" /> View Detail
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors flex-shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
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
                  {searchTerm ? `No projects match "${searchTerm}"` : `No ${statusFilter} ${mainTabs.find(t => t.id === activeTab)?.label || ''} projects found`}
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
    </div>
  );
};

export default Projects;