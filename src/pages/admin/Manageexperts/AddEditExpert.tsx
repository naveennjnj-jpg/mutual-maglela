// pages/admin/AddEditExpert.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WhatsappChat, LinkedInChat } from "@/utils/svgicons";
import {
  ArrowLeft,
  Camera,
  User,
  Upload,
  Mail,
  MessageCircle,
  Globe,
  Phone,
  FileText,
  Award,
  Briefcase,
  GraduationCap,
  CheckCircle,
  X,
  Plus,
  Trash2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface ExpertFormData {
  name: string;
  title: string;
  hourlyRate: number;
  email: string;
  phone: string;
  linkedin: string;
  website: string;
  whatsapp: string;
  expertise: string[];
  specialization: string;
  yearsOfExperience: number;
  bio: string;
  education: string;
  certifications: string[];
  availability: 'available' | 'busy' | 'unavailable';
  profileImage: string | null;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

const AddEditExpert = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get data from navigation state
  const locationState = location.state as {
    expertData?: ExpertFormData;
    expertId?: string;
    isEdit?: boolean;
  } | null;

  const isEdit = locationState?.isEdit || false;
  const expertId = locationState?.expertId || null;
  const initialData = locationState?.expertData || null;

  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.profileImage || null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Form state
  const [formData, setFormData] = useState<ExpertFormData>({
    name: initialData?.name || '',
    title: initialData?.title || '',
    hourlyRate: initialData?.hourlyRate || 0,
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    linkedin: initialData?.linkedin || '',
    website: initialData?.website || '',
    whatsapp: initialData?.whatsapp || '',
    expertise: initialData?.expertise || [],
    specialization: initialData?.specialization || '',
    yearsOfExperience: initialData?.yearsOfExperience || 0,
    bio: initialData?.bio || '',
    education: initialData?.education || '',
    certifications: initialData?.certifications || [],
    availability: initialData?.availability || 'available',
    profileImage: initialData?.profileImage || null
  });

  const [newExpertise, setNewExpertise] = useState('');
  const [newCertification, setNewCertification] = useState('');

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hourlyRate' || name === 'yearsOfExperience' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle image upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image (JPEG, PNG, or WEBP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const uploadFormData = new FormData();
      uploadFormData.append("profileImage", file);

      // First, upload the image
      const uploadResponse = await axios.post<ApiResponse>(
        `${API_URL}/api/auth/update-profile-pic`,
        uploadFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (uploadResponse.data.success) {
        // Get the image URL from response
        let imageUrl = uploadResponse.data.data?.imageUrl ||
          uploadResponse.data.data?.profilePic ||
          uploadResponse.data.data?.url;

        // If imageUrl is relative, prepend API_URL
        if (imageUrl && !imageUrl.startsWith("http")) {
          imageUrl = `${API_URL}/${imageUrl.replace(/^public\//, "")}`;
        }

        // Update form data with new image URL
        setFormData(prev => ({
          ...prev,
          profileImage: imageUrl
        }));
        setPreviewImage(imageUrl);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(uploadResponse.data.message || "Failed to upload image");
      }
    } catch (err: any) {
      console.error("Image upload error:", err);
      setError(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Add/Remove Expertise
  const addExpertise = () => {
    if (newExpertise.trim() && !formData.expertise.includes(newExpertise.trim())) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };

  const removeExpertise = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(e => e !== expertise)
    }));
  };

  // Add/Remove Certification
  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== cert)
    }));
  };

  // Navigation
  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    setError(null);

    if (step === 1) {
      if (!formData.name.trim()) {
        setError('Full Name is required');
        return false;
      }
    }

    if (step === 2) {
      if (!formData.email.trim()) {
        setError('Email is required');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
    }

    if (step === 3) {
      if (!formData.bio.trim()) {
        setError('Professional Bio is required');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      nextStep();
    }
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");

      // Prepare data
      const submitData = {
        name: formData.name,
        title: formData.title,
        hourly_rate: Number(formData.hourlyRate),
        email: formData.email,
        phone: formData.phone || '',
        linkedin: formData.linkedin || '',
        website: formData.website || '',
        whatsapp_number: formData.whatsapp || '',
        expertise: formData.expertise,
        specialization: formData.specialization || '',
        yearsOfExperience: Number(formData.yearsOfExperience) || 0,
        bio: formData.bio,
        education: formData.education || '',
        certifications: formData.certifications,
        availability: formData.availability,
        profilePic: formData.profileImage
          ? formData.profileImage.replace(`${API_URL}/`, '')
          : '',
      };
      let response: any;

      if (isEdit && expertId) {
        // Update existing expert
        response = await axios.patch<ApiResponse>(
          `${API_URL}/api/admin/experts/${expertId}`,
          submitData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Create new expert
        response = await axios.post<ApiResponse>(
          `${API_URL}/api/admin/experts`,
          submitData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin/experts', {
            state: {
              success: true,
              message: `Expert ${isEdit ? 'updated' : 'added'} successfully!`
            }
          });
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to save expert');
      }
    } catch (err: any) {
      console.error('Error saving expert:', err);
      setError(err.response?.data?.message || 'Failed to save expert. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, label: 'Identity' },
    { number: 2, label: 'Contact & Links' },
    { number: 3, label: 'Expertise & Bio' }
  ];

  // Render step 1: Identity
  const renderIdentityStep = () => (
    <div className="space-y-4">
      {/* Profile Photo */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-5 flex items-center gap-1.5">
          <Camera className="w-[13px] h-[13px] text-[#C85A32]" />
          Profile Photo
        </p>
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-2xl overflow-hidden bg-[#f4f6fb] dark:bg-gray-700 border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-[#0F2D63] dark:hover:border-[#C85A32] transition-colors group"
            >
              {previewImage ? (
                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-[28px] h-[28px] text-gray-300 dark:text-gray-500 group-hover:text-[#0F2D63] dark:group-hover:text-[#C85A32] transition-colors" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#C85A32] rounded-full flex items-center justify-center shadow-lg hover:bg-[#a8472a] transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-[13px] h-[13px] text-white animate-spin" />
              ) : (
                <Camera className="w-[13px] h-[13px] text-white" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Upload a professional photo</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed mb-3">
              A clear headshot works best. JPG or PNG, under 5 MB.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-[13px] h-[13px] animate-spin" />
              ) : (
                <Upload className="w-[13px] h-[13px]" />
              )}
              {uploading ? 'Uploading...' : 'Choose Photo'}
            </button>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 space-y-4">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-[13px] h-[13px] text-[#C85A32]" />
          Basic Information
        </p>

        <div>
          <label className="block text-sm font-semibold text-[#0F2D63] dark:text-white mb-1.5">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Dr. Nontobeko Mtshali"
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:border-[#0F2D63] dark:focus:border-[#C85A32] focus:ring-2 focus:ring-[#0F2D63]/10 dark:focus:ring-[#C85A32]/10 transition-all bg-white dark:bg-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0F2D63] dark:text-white mb-1.5">
            Hourly Rate (R)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 dark:text-gray-500 pointer-events-none">
              R
            </span>
            <input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleInputChange}
              placeholder="850"
              min={0}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl pl-8 pr-4 py-3 text-sm text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:border-[#0F2D63] dark:focus:border-[#C85A32] focus:ring-2 focus:ring-[#0F2D63]/10 dark:focus:ring-[#C85A32]/10 transition-all bg-white dark:bg-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="px-6 py-2.5 bg-[#0F2D63] dark:bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors"
        >
          Next: Contact & Links →
        </button>
      </div>
    </div>
  );

  // Render step 2: Contact & Links
  const renderContactStep = () => (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 space-y-4">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          <Mail className="w-[13px] h-[13px] text-[#C85A32]" />
          Contact & Social Links
        </p>

        <div>
          <label className="block text-sm font-semibold text-[#0F2D63] dark:text-white mb-1.5">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="expert@example.com"
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:border-[#0F2D63] dark:focus:border-[#C85A32] focus:ring-2 focus:ring-[#0F2D63]/10 dark:focus:ring-[#C85A32]/10 transition-all bg-white dark:bg-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0F2D63] dark:text-white mb-1.5 flex items-center gap-2">
            <WhatsappChat />
            WhatsApp Number
          </label>
          <input
            type="tel"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleInputChange}
            placeholder="+27 82 123 4567"
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:border-[#0F2D63] dark:focus:border-[#C85A32] focus:ring-2 focus:ring-[#0F2D63]/10 dark:focus:ring-[#C85A32]/10 transition-all bg-white dark:bg-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0F2D63] dark:text-white mb-1.5 flex items-center gap-2">
            <LinkedInChat />
            LinkedIn Profile
          </label>
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/username"
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:border-[#0F2D63] dark:focus:border-[#C85A32] focus:ring-2 focus:ring-[#0F2D63]/10 dark:focus:ring-[#C85A32]/10 transition-all bg-white dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2.5 bg-[#0F2D63] dark:bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors"
        >
          Next: Expertise & Bio →
        </button>
      </div>
    </div>
  );

  // Render step 3: Expertise & Bio
  const renderExpertiseStep = () => (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 space-y-4">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-[13px] h-[13px] text-[#C85A32]" />
          Expertise
        </p>

        <div>
          <label className="block text-sm font-semibold text-[#0F2D63] dark:text-white mb-1.5">
            Areas of Expertise
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newExpertise}
              onChange={(e) => setNewExpertise(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addExpertise()}
              placeholder="e.g. Journalism, Science Communication"
              className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:border-[#0F2D63] dark:focus:border-[#C85A32] focus:ring-2 focus:ring-[#0F2D63]/10 dark:focus:ring-[#C85A32]/10 transition-all bg-white dark:bg-gray-900"
            />
            <button
              onClick={addExpertise}
              className="px-4 py-2 bg-[#0F2D63] dark:bg-[#0F2D63] text-white rounded-xl hover:bg-[#0a2050] transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.expertise.map((exp) => (
              <span
                key={exp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f4f6fb] dark:bg-gray-700 text-[#0F2D63] dark:text-white text-xs font-medium rounded-lg"
              >
                {exp}
                <button
                  onClick={() => removeExpertise(exp)}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 space-y-4">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-[13px] h-[13px] text-[#C85A32]" />
          Bio
        </p>

        <div>
          <label className="block text-sm font-semibold text-[#0F2D63] dark:text-white mb-1.5">
            Bio <span className="text-red-400">*</span>
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            placeholder="Write a compelling professional summary..."
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:border-[#0F2D63] dark:focus:border-[#C85A32] focus:ring-2 focus:ring-[#0F2D63]/10 dark:focus:ring-[#C85A32]/10 transition-all bg-white dark:bg-gray-900 resize-none"
          />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
            {formData.bio.length} characters
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#C85A32] text-white text-sm font-semibold rounded-xl hover:bg-[#a8472a] transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>{isEdit ? 'Update Expert' : 'Add Expert'}</>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F6FB] dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
        <button
          onClick={() => navigate('/admin/experts')}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#C85A32]">
            Operations
          </p>
          <h1 className="text-base font-bold text-[#0F2D63] dark:text-white leading-tight truncate">
            {isEdit ? 'Edit Expert' : 'Add New Expert'}
          </h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0F2D63] dark:bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors disabled:opacity-60 flex-shrink-0"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>{isEdit ? 'Update Expert' : 'Add Expert'}</>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Image uploaded successfully!
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-7 space-y-5">
        {/* Steps */}
        <div className="flex items-center gap-0">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex items-center flex-1">
                <button
                  onClick={() => setCurrentStep(step.number)}
                  className="flex items-center gap-2 group"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${currentStep === step.number
                    ? 'bg-[#0F2D63] text-white shadow-md'
                    : currentStep > step.number
                      ? 'bg-green-500 text-white'
                      : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500'
                    }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block transition-colors ${currentStep === step.number
                    ? 'text-[#0F2D63] dark:text-white'
                    : 'text-gray-400 dark:text-gray-500'
                    }`}>
                    {step.label}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div>
          {currentStep === 1 && renderIdentityStep()}
          {currentStep === 2 && renderContactStep()}
          {currentStep === 3 && renderExpertiseStep()}
        </div>
      </div>
    </div>
  );
};

export default AddEditExpert;