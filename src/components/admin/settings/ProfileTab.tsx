// components/settings/ProfileTab.tsx
import React, { useState, useRef, useEffect } from "react";
import { Camera, Save, Loader2, AlertCircle, CheckCircle, X } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface ProfileData {
  fullName: string;
  email: string;
  phoneNumber: string;
  timezone: string;
  bio: string;
  profilePic?: string | null;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

const ProfileTab = () => {
  const { user, AdminupdateDetails } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProfileData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    timezone: "Africa/Johannesburg",
    bio: "",
    profilePic: null,
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (user) {
      let profilePicUrl = null;
      if ((user as any).profilePic) {
        const pic = (user as any).profilePic;
        if (pic.startsWith('http://') || pic.startsWith('https://')) {
          profilePicUrl = pic;
        } else {
          const cleanPath = pic.replace(/^public\//, '');
          profilePicUrl = `${API_URL}/${cleanPath}`;
        }
      }

      setFormData({
        fullName: user.name || "",
        email: user.email || "",
        phoneNumber: (user as any).phoneNumber || "",
        timezone: (user as any).timezone || "Africa/Johannesburg",
        bio: (user as any).bio || "",
        profilePic: profilePicUrl,
      });
      setPreviewUrl(profilePicUrl);
    }
  }, [user, API_URL]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image (JPEG, PNG, or WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        setUploading(false);
        return;
      }

      const uploadFormData = new FormData();
      uploadFormData.append("profileImage", file);

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
        let imageUrl = uploadResponse.data.data?.imageUrl ||
          uploadResponse.data.data?.profilePic ||
          uploadResponse.data.data?.url;

        if (imageUrl && !imageUrl.startsWith('http')) {
          const cleanPath = imageUrl.replace(/^public\//, '');
          imageUrl = `${API_URL}/${cleanPath}`;
        }

        const updateResponse = await axios.patch<ApiResponse>(
          `${API_URL}/api/admin/update-profile`,
          {
            profilePic: imageUrl,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (updateResponse.data.success) {
          setFormData((prev) => ({
            ...prev,
            profilePic: imageUrl,
          }));
          setPreviewUrl(imageUrl);

          if (AdminupdateDetails) {
            await AdminupdateDetails({
              profilePic: imageUrl,
            } as any);
          }

          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        } else {
          setError(updateResponse.data.message || "Failed to update profile with image");
        }
      } else {
        setError(uploadResponse.data.message || "Failed to upload image");
      }
    } catch (err: any) {
      console.error("Image upload error:", err);
      setError(err.response?.data?.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const updateData = {
        name: formData.fullName,
        phoneNumber: formData.phoneNumber,
        timezone: formData.timezone,
        bio: formData.bio,
      };

      const response = await axios.patch<ApiResponse>(
        `${API_URL}/api/admin/update-profile`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);

        if (AdminupdateDetails) {
          await AdminupdateDetails({
            name: formData.fullName,
            phoneNumber: formData.phoneNumber,
            timezone: formData.timezone,
            bio: formData.bio,
          } as any);
        }

        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (!formData.fullName) return "AU";
    const parts = formData.fullName.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return formData.fullName.slice(0, 2).toUpperCase();
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Profile updated successfully!</span>
          <button
            onClick={() => setSuccess(false)}
            className="ml-auto text-green-700 hover:text-green-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-700 hover:text-red-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Profile Photo Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <p className="text-sm font-bold text-[#0F2D63] border-b border-gray-50 pb-3">
          Profile Photo
        </p>
        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0">
            {previewUrl || formData.profilePic ? (
              <img
                src={previewUrl || formData.profilePic || ""}
                alt="Profile"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#C85A32]"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-[#0F2D63] flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {getInitials()}
                </span>
              </div>
            )}
            <button
              onClick={handleFileInputClick}
              disabled={uploading}
              className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-[#C85A32] rounded-full flex items-center justify-center shadow-md hover:bg-[#a8472a] transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-3 h-3 text-white animate-spin" />
              ) : (
                <Camera className="w-3 h-3 text-white" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-0.5">
              Upload new photo
            </p>
            <p className="text-xs text-gray-400 mb-2">
              JPG or PNG, max 5 MB
            </p>
            <button
              onClick={handleFileInputClick}
              disabled={uploading}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {uploading ? "Uploading..." : "Choose File"}
            </button>
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <p className="text-sm font-bold text-[#0F2D63] border-b border-gray-50 pb-3">
          Personal Information
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-gray-50 text-gray-400 cursor-not-allowed"
                value={formData.email}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                name="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={handleChange}
                placeholder="+27 82 000 0000"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Timezone
              </label>
              <select
                name="timezone"
                value={formData.timezone || "Africa/Johannesburg"}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white cursor-pointer"
              >
                <option value="Africa/Johannesburg">Africa/Johannesburg</option>
                <option value="Africa/Lagos">Africa/Lagos</option>
                <option value="Africa/Nairobi">Africa/Nairobi</option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Asia/Dubai">Asia/Dubai</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              rows={3}
              placeholder="Short description about you..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileTab;