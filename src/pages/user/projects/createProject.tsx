// pages/user/CreateProject.tsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  Users,
  Sparkles,
  Mic,
  Upload,
  Shield,
  Calendar,
  FileText,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

// ============================================
// INTERFACES / TYPES
// ============================================

interface ProjectFormData {
  title: string;
  type: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  deadline: string;
  proceedOption: "hire-expert" | "ai-writing" | "ai-speech";
}

interface FileAttachment {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

// ============================================
// MAIN COMPONENT
// ============================================

const CreateProject = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    type: "",
    description: "",
    priority: "medium",
    deadline: "",
    proceedOption: "ai-writing",
  });

  const [attachment, setAttachment] = useState<FileAttachment | null>(null); // Changed to single file
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // ============================================
  // PROJECT TYPES
  // ============================================

  const projectTypes = [
    "Research Paper",
    "Journal Article",
    "Policy Brief",
    "Technical Report",
    "Manuscript Editing",
    "Content Writing",
    "Data Analysis",
    "Literature Review",
    "Grant Proposal",
    "Other",
  ];

  // ============================================
  // PROCEED OPTIONS
  // ============================================

  const proceedOptions = [
    {
      id: "hire-expert" as const,
      label: "Hire Expert",
      icon: Users,
      description: "Work with a Magalela expert for premium assistance",
      color: "text-[#C85A32]",
      bgColor: "bg-[#C85A32]/10",
      borderColor: "border-[#C85A32]/40",
      hoverBorder: "hover:border-[#C85A32]/60",
      bgHover: "bg-[#fff8f5]",
      recommended: true,
    },
    {
      id: "ai-writing" as const,
      label: "AI Writing",
      icon: Sparkles,
      description: "Generate AI-powered narrative from your project input",
      color: "text-[#0F2D63]",
      bgColor: "bg-[#0F2D63]",
      borderColor: "border-[#0F2D63]",
      bgHover: "bg-[#EEF2FA]",
      recommended: false,
    },
    {
      id: "ai-speech" as const,
      label: "AI Speech",
      icon: Mic,
      description: "Refine tone and communication style using AI",
      color: "text-gray-500",
      bgColor: "bg-white",
      borderColor: "border-gray-100",
      hoverBorder: "hover:border-gray-200",
      bgHover: "bg-gray-50/50",
      recommended: false,
    },
  ];

  // ============================================
  // HANDLERS
  // ============================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrioritySelect = (priority: "low" | "medium" | "high" | "critical") => {
    setFormData((prev) => ({
      ...prev,
      priority,
    }));
  };

  const handleProceedSelect = (
    option: "hire-expert" | "ai-writing" | "ai-speech"
  ) => {
    setFormData((prev) => ({
      ...prev,
      proceedOption: option,
    }));
  };

  // ============================================
  // FILE HANDLERS - SINGLE FILE ONLY
  // ============================================

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0]; // Get only the first file

    // Valid file types
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "application/zip",
      "application/x-rar-compressed",
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    // Validate file type
    if (!validTypes.includes(file.type)) {
      setError(`Invalid file type: ${file.name}. Please upload PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, or ZIP files.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setError(`File ${file.name} exceeds 10MB limit.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Set single file
    setAttachment({
      id: Date.now() + "-" + Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    });

    setError(null);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // ============================================
  // FORM SUBMISSION
  // ============================================

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setLoading(true);
  setError(null);
  setSuccess(false);

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in.");
      return;
    }

    let documentUrl = "";

    // Upload document first
    if (attachment?.file) {
      const uploadFormData = new FormData();
      uploadFormData.append("document", attachment.file);

      const uploadResponse = await axios.post(
        `${API_URL}/api/auth/upload-document`,
        uploadFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Upload Response:", uploadResponse.data);

      if (!uploadResponse.data.success) {
        setError(uploadResponse.data.message || "Document upload failed");
        return;
      }

      // Get uploaded file URL
      documentUrl = uploadResponse.data.data.fileUrl;
    }

    // Create project
    const response = await axios.post(
      `${API_URL}/api/auth/projects`,
      {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        priority: formData.priority,
        deadline: formData.deadline,
        proceedOption: formData.proceedOption,
        attachments: documentUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      setSuccess(true);

      setTimeout(() => {
        navigate("/user/projects");
      }, 2000);
    } else {
      setError(response.data.message || "Failed to create project");
    }
  } catch (err: any) {
    console.error(err);
    setError(err.response?.data?.message || "Failed to create project");
  } finally {
    setLoading(false);
  }
};

  const handleBack = () => {
    navigate("/user/projects");
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900">
      {/* ==========================================
          HEADER
          ========================================== */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#0F2D63] dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Projects
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-[#0F2D63] hover:bg-[#1a3d7a] text-white rounded-xl px-5 py-2 text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Project
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ==========================================
          MAIN CONTENT
          ========================================== */}
      <div className="max-w-[1100px] mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63] dark:text-white mb-1">
            Create New Project
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            Fill in the details below to submit your project request
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl text-sm mb-6">
            <CheckCircle className="w-4 h-4" />
            <span>Project created successfully! Redirecting...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl text-sm mb-6">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* ==========================================
            FORM
            ========================================== */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ==========================================
                LEFT COLUMN
                ========================================== */}
            <div className="lg:col-span-2 space-y-5">
              {/* Step 1: Project Details */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                  <div className="w-7 h-7 rounded-full bg-[#0F2D63] dark:bg-[#1a3d7a] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Project Details
                    </h2>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Provide the essential information
                    </p>
                  </div>
                </div>

                <div className="px-6 py-6 space-y-5">
                  {/* Project Title */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                      Project Title <span className="text-[#C85A32]">*</span>
                    </label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Q1 Impact Assessment Report"
                      className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0F2D63] dark:focus:border-[#C85A32] focus:ring-2 focus:ring-[#0F2D63]/10 dark:focus:ring-[#C85A32]/10 transition-all bg-gray-50 dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  {/* Project Type */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                      Project Type <span className="text-[#C85A32]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 pr-10 appearance-none focus:outline-none focus:border-[#0F2D63] dark:focus:border-[#C85A32] focus:ring-2 focus:ring-[#0F2D63]/10 dark:focus:ring-[#C85A32]/10 transition-all bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                        required
                      >
                        <option value="">Select project type</option>
                        {projectTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                    </div>
                  </div>

                  {/* Project Description */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                      Project Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Describe your project requirements, objectives, and deliverables..."
                      className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-[#0F2D63] dark:focus:border-[#C85A32] focus:ring-2 focus:ring-[#0F2D63]/10 dark:focus:ring-[#C85A32]/10 transition-all bg-gray-50 dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Proceed Option */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                  <div className="w-7 h-7 rounded-full bg-[#0F2D63] dark:bg-[#1a3d7a] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                      How would you like to proceed?
                    </h2>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Choose the next step
                    </p>
                  </div>
                </div>

                <div className="px-6 py-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {proceedOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = formData.proceedOption === option.id;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleProceedSelect(option.id)}
                          className={`relative flex flex-col items-start gap-3 p-5 rounded-2xl border-2 text-left transition-all ${
                            isSelected
                              ? `${option.borderColor} ${option.bgHover} shadow-sm`
                              : `${option.borderColor} ${option.bgHover}`
                          } ${option.hoverBorder || ""}`}
                        >
                          {/* Recommended Badge */}
                          {option.recommended && (
                            <span className="absolute -top-2.5 left-4 bg-[#C85A32] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                              Recommended
                            </span>
                          )}

                          {/* Selected Checkmark */}
                          {isSelected && (
                            <div className="absolute top-3 right-3 w-5 h-5 bg-[#0F2D63] dark:bg-[#1a3d7a] rounded-full flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          )}

                          {/* Icon */}
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              isSelected && option.id === "ai-writing"
                                ? "bg-[#0F2D63] dark:bg-[#1a3d7a]"
                                : isSelected && option.id === "hire-expert"
                                ? "bg-[#C85A32]/10"
                                : "bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                            }`}
                          >
                            <Icon
                              className={`w-5 h-5 ${
                                isSelected && option.id === "ai-writing"
                                  ? "text-white"
                                  : isSelected && option.id === "hire-expert"
                                  ? "text-[#C85A32]"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            />
                          </div>

                          {/* Label & Description */}
                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                isSelected && option.id === "ai-writing"
                                  ? "text-[#0F2D63] dark:text-white"
                                  : isSelected && option.id === "hire-expert"
                                  ? "text-[#C85A32]"
                                  : "text-gray-800 dark:text-gray-200"
                              }`}
                            >
                              {option.label}
                            </p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed">
                              {option.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 3: Attach File - SINGLE FILE ONLY */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                  <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-500 dark:text-gray-400 text-xs font-bold">
                      3
                    </span>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Attach File{" "}
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-normal ml-1">
                        Optional - Single file only
                      </span>
                    </h2>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Upload one supporting document
                    </p>
                  </div>
                </div>

                <div className="px-6 py-6">
                  {/* Upload Area */}
                  {!attachment ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-[#0F2D63]/40 dark:hover:border-[#C85A32]/40 rounded-2xl py-10 flex flex-col items-center gap-3 cursor-pointer transition-all hover:bg-[#EEF2FA]/30 dark:hover:bg-gray-700/30 group"
                    >
                      <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 group-hover:bg-[#EEF2FA] dark:group-hover:bg-gray-600 rounded-2xl flex items-center justify-center transition-colors">
                        <Upload className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-[#0F2D63] dark:group-hover:text-[#C85A32] transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-[#0F2D63] dark:group-hover:text-[#C85A32] transition-colors">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, ZIP — up to 10MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Show uploaded file
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-[#0F2D63] dark:border-[#C85A32]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0F2D63]/10 dark:bg-[#1a3d7a]/20 rounded-xl flex items-center justify-center">
                          <FileText className="w-5 h-5 text-[#0F2D63] dark:text-[#C85A32]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {formatFileSize(attachment.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeAttachment}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
                    className="hidden"
                    onChange={handleFileUpload}
                  />

                  {/* Show file info when uploaded */}
                  {attachment && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
                      ✓ File uploaded successfully. Click the X to remove and upload a different file.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ==========================================
                RIGHT COLUMN - Sidebar
                ========================================== */}
            <div className="space-y-5">
              {/* Project Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  Project Settings
                </h3>

                <div className="space-y-4">
                  {/* Priority */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                      Priority
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["low", "medium", "high", "critical"] as const).map(
                        (priority) => {
                          const isSelected = formData.priority === priority;
                          const getColor = () => {
                            switch (priority) {
                              case "low":
                                return isSelected
                                  ? "border-blue-400 bg-blue-50 text-blue-600 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-400"
                                  : "border-gray-100 text-gray-400 dark:border-gray-700 dark:text-gray-500";
                              case "medium":
                                return isSelected
                                  ? "border-amber-400 bg-amber-50 text-amber-600 dark:border-amber-500 dark:bg-amber-900/30 dark:text-amber-400"
                                  : "border-gray-100 text-gray-400 dark:border-gray-700 dark:text-gray-500";
                              case "high":
                                return isSelected
                                  ? "border-red-400 bg-red-50 text-red-600 dark:border-red-500 dark:bg-red-900/30 dark:text-red-400"
                                  : "border-gray-100 text-gray-400 dark:border-gray-700 dark:text-gray-500";
                              case "critical":
                                return isSelected
                                  ? "border-purple-400 bg-purple-50 text-purple-600 dark:border-purple-500 dark:bg-purple-900/30 dark:text-purple-400"
                                  : "border-gray-100 text-gray-400 dark:border-gray-700 dark:text-gray-500";
                            }
                          };
                          return (
                            <button
                              key={priority}
                              type="button"
                              onClick={() => handlePrioritySelect(priority)}
                              className={`py-2 rounded-xl border-2 text-xs font-semibold transition-all capitalize ${getColor()}`}
                            >
                              {priority}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Deadline */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                      Deadline <span className="text-[#C85A32]">*</span>
                    </label>
                    <input
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0F2D63] dark:focus:border-[#C85A32] transition-all bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-[#0F2D63] dark:bg-[#1a3d7a] rounded-2xl p-5">
                <div className="flex items-start gap-2.5 mb-3">
                  <Shield className="w-4 h-4 text-white/70 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold text-white">
                    What happens next?
                  </p>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Our team will review your project brief within 24 hours and
                  begin work. You can track progress and provide feedback
                  through the revision flow.
                </p>
              </div>

              {/* Submit Button (Mobile) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full lg:hidden flex items-center justify-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-2xl py-3.5 text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Project
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;