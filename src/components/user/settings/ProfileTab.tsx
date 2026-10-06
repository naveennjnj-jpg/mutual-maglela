
import React, { useState, useRef, useEffect } from "react";
import { Camera, Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface ProfileData {
  fullName: string;
  email: string;
  jobtitle: string;
  organisation: string;
  bio: string;
  profilePic?: string | null;
  phoneNumber?: string;
  address?: string;
  country?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

const ProfileTab = () => {
  const { user, updateDetails } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProfileData>({
    fullName: "",
    email: "",
    jobtitle: "",
    organisation: "",
    bio: "",
    profilePic: null,
    phoneNumber: "",
    address: "",
    country: "South Africa",
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || "",
        email: user.email || "",
        jobtitle: (user as any).jobtitle || "",
        organisation: (user as any).organisation || "",
        bio: (user as any).bio || "",
        profilePic: (user as any).profilePic
          ? `${API_URL}/${(user as any).profilePic.replace(/^public\//, "")}`
          : null,
        phoneNumber: (user as any).phoneNumber || "",
        address: (user as any).address || "",
        country: (user as any).country || "South Africa",
      });
    }
  }, [user]);

  
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

    
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image (JPEG, PNG, or WEBP)");
      return;
    }

    
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const token = localStorage.getItem("token");
      const response = await axios.post<ApiResponse>(
        `${API_URL}/api/auth/update-profile-pic`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const imageUrl = response.data.data?.imageUrl || response.data.data?.profilePic;

        const response2 = await axios.patch<ApiResponse>(
          `${API_URL}/api/auth/update-profile`,
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
        setFormData((prev) => ({
          ...prev,
          profilePic: response.data.data?.profilePic || URL.createObjectURL(file),
        }));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.data.message || "Failed to upload image");
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

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch<ApiResponse>(
        `${API_URL}/api/auth/update-profile`,
        {
          name: formData.fullName,
          jobtitle: formData.jobtitle,
          organisation: formData.organisation,
          bio: formData.bio,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          country: formData.country,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        
        if (updateDetails) {
          
          await updateDetails({
            name: formData.fullName,
            jobtitle: formData.jobtitle,
            organisation: formData.organisation,
            bio: formData.bio,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            country: formData.country,
          } as any);
        }
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  
  const getInitials = () => {
    if (!formData.fullName) return "U";
    return formData.fullName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div>
      <h2 className="text-sm font-semibold text-[#0F2D63] mb-5">
        Profile Information
      </h2>

      
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4">
          <CheckCircle className="w-4 h-4" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      
      <div className="flex items-center gap-4 mb-6">
        <div className="relative group">
          {formData.profilePic ? (
            <img
              src={formData.profilePic}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#C85A32]"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#0F2D63] flex items-center justify-center text-white font-bold text-xl">
              {getInitials()}
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#C85A32] rounded-full flex items-center justify-center hover:bg-[#a8472a] transition-colors disabled:opacity-50"
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
          <p className="text-sm font-semibold text-[#0F2D63]">{formData.fullName || "User"}</p>
          <p className="text-xs text-gray-400">{formData.email}</p>
          {uploading && (
            <p className="text-xs text-[#C85A32] mt-1">Uploading...</p>
          )}
        </div>
      </div>

      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">
              Full Name
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/10 transition-all"
              placeholder="Your full name"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">
              Email Address
            </label>
            <input
              disabled
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 text-gray-400 cursor-not-allowed"
              value={formData.email}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">
              Job Title
            </label>
            <input
              name="jobtitle"
              value={formData.jobtitle}
              onChange={handleChange}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/10 transition-all"
              placeholder="Your job title"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">
              Organisation
            </label>
            <input
              name="organisation"
              value={formData.organisation}
              onChange={handleChange}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/10 transition-all"
              placeholder="Your organisation"
            />
          </div>
        </div>

        

        

        <div>
          <label className="text-xs font-medium text-gray-600 mb-1.5 block">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio || ""}
            onChange={handleChange}
            rows={3}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/10 transition-all"
            placeholder="Tell us about yourself"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ProfileTab;