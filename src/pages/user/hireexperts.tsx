// pages/user/HireExperts.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Mail, Loader2, AlertCircle, Users, User, Calendar, Clock } from 'lucide-react';
import { WhatsappChat, LinkedInChat } from "@/utils/svgicons";
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface Expert {
  id: number | string;
  name: string;
  title: string;
  image: string;
  bio: string;
  email: string;
  isVerified: boolean;
  socialLinks: {
    linkedin?: string;
    email?: string;
    whatsapp?: string;
  };
  hourlyRate?: number;
  expertise?: string[];
  availability?: 'available' | 'busy' | 'unavailable';
  profileImage?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Default avatar as inline SVG to avoid network requests
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.35em' font-size='40' fill='%239ca3af' font-family='sans-serif'%3E%3C/text%3E%3C/svg%3E";

const HireExperts = () => {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // State
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReadMore, setIsReadMore] = useState<{ [key: string]: boolean }>({});
  const [fetchAttempted, setFetchAttempted] = useState(false);

  // Use ref to prevent multiple API calls
  const fetchCalled = useRef(false);

  // Fetch experts from API - only once
  useEffect(() => {
    if (!fetchCalled.current) {
      fetchCalled.current = true;
      fetchExperts();
    }
  }, []);

  // Get image URL with fallback
  const getImageUrl = (imagePath: string | null | undefined): string => {
    if (!imagePath) return DEFAULT_AVATAR;

    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
      return imagePath;
    }

    if (imagePath.startsWith('/')) {
      return `${API_URL}${imagePath}`;
    }

    return `${API_URL}/${imagePath}`;
  };

  const fetchExperts = async () => {
    if (fetchAttempted) return;
    setFetchAttempted(true);

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.get<ApiResponse>(
        `${API_URL}/api/admin/experts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const expertsData = response.data.data?.experts || response.data.data || [];

        if (Array.isArray(expertsData) && expertsData.length > 0) {
          const mappedExperts = expertsData.map((expert: any) => ({
            id: expert.id || expert._id || Math.random().toString(),
            name: expert.name || expert.fullName || 'Unnamed Expert',
            email: expert.email || '',
            title: expert.title || expert.jobTitle || '',
            image: getImageUrl(expert.profileImage || expert.image || expert.profilePic),
            bio: expert.bio || expert.description || '',
            isVerified: expert.isVerified || expert.verified || false,
            hourlyRate: expert.hourlyRate || expert.hourly_rate || 0,
            expertise: expert.expertise || [],
            availability: expert.availability || 'available',
            socialLinks: {
              linkedin: expert.linkedin || expert.socialLinks?.linkedin || '',
              email: expert.email || '',
              whatsapp: expert.whatsapp || expert.whatsapp_number || expert.socialLinks?.whatsapp || '',
            }
          }));
          setExperts(mappedExperts);
        } else {
          setExperts([]);
        }
      } else {
        setError(response.data.message || 'Failed to load experts');
        setExperts(getMockExperts());
      }
    } catch (err: any) {
      console.error('Error fetching experts:', err);

      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else if (err.response?.status === 404) {
        setError('Experts not found.');
        setExperts(getMockExperts());
      } else {
        setError(err.response?.data?.message || 'Failed to load experts. Please try again.');
        if (!err.response || err.code === 'ERR_NETWORK') {
          setExperts(getMockExperts());
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Mock data for fallback
  const getMockExperts = (): Expert[] => {
    return [
      {
        id: 1,
        name: "Dr. Nontobeko Mtshali",
        title: "Communications Specialist",
        image: DEFAULT_AVATAR,
        email: "nontobeko@example.com",
        bio: "I'm a seasoned communications specialist and published author with over 19 years of experience in journalism, science communication and media...",
        isVerified: true,
        hourlyRate: 850,
        expertise: ["Journalism", "Science Communication", "Media Training"],
        availability: 'available',
        socialLinks: {
          linkedin: "https://linkedin.com/in/dr-nontobeko-mtshali",
          email: "nontobeko@example.com",
          whatsapp: "https://wa.me/27761234567"
        }
      },
      {
        id: 2,
        name: "Prof. Thabo Mbeki",
        title: "Research Consultant",
        image: DEFAULT_AVATAR,
        email: "thabo@example.com",
        bio: "Expert in research methodology and academic writing with 15+ years of experience...",
        isVerified: true,
        hourlyRate: 750,
        expertise: ["Research", "Academic Writing", "Data Analysis"],
        availability: 'busy',
        socialLinks: {
          linkedin: "https://linkedin.com/in/prof-thabo-mbeki",
          email: "thabo@example.com",
          whatsapp: "https://wa.me/27761234568"
        }
      },
      {
        id: 3,
        name: "Dr. Sarah Johnson",
        title: "Science Communication Expert",
        image: DEFAULT_AVATAR,
        email: "sarah@example.com",
        bio: "Passionate about bridging the gap between science and society through effective communication...",
        isVerified: true,
        hourlyRate: 900,
        expertise: ["Science Communication", "Public Speaking", "Media Training"],
        availability: 'available',
        socialLinks: {
          linkedin: "https://linkedin.com/in/sarah-johnson",
          email: "sarah@example.com",
          whatsapp: "https://wa.me/27761234569"
        }
      }
    ];
  };

  // Toggle read more
  const toggleReadMore = (id: string | number) => {
    setIsReadMore(prev => ({
      ...prev,
      [id.toString()]: !prev[id.toString()]
    }));
  };

  // Open social link
  const openLink = (url?: string) => {
    if (url) {
      if (url.startsWith('mailto:')) {
        window.location.href = url;
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // Get availability badge
  const getAvailabilityBadge = (status?: string) => {
    switch (status) {
      case 'available':
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Available</span>;
      case 'busy':
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Busy</span>;
      case 'unavailable':
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Unavailable</span>;
      default:
        return null;
    }
  };

  // Image component with error handling
  const ExpertImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
    const [imgError, setImgError] = useState(false);

    if (imgError || !src || src === 'null' || src === 'undefined') {
      return (
        <div className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
          <User className="w-8 h-8 text-gray-400" />
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => setImgError(true)}
      />
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading experts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6">
      <div className="max-w-[1500px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Schedule a call with an expert
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-md">
            Speak to a trusted expert who specialise in research translation, strategic storytelling, speechwriting and institutional communication.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Experts Grid */}
        {experts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {experts.map((expert) => (
              <div
                key={expert.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 w-full max-w-[480px]"
              >
                {/* Expert Profile */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative flex-shrink-0">
                    <ExpertImage
                      src={expert.image}
                      alt={expert.name}
                      className="w-16 h-16 rounded-full object-cover object-top"
                    />
                    {expert.isVerified && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                      {expert.name}
                    </h2>
                    {expert.title && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{expert.title}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {expert.hourlyRate && expert.hourlyRate > 0 && (
                        <span className="text-xs font-semibold text-[#C85A32]">
                          R{expert.hourlyRate}/hr
                        </span>
                      )}
                      {getAvailabilityBadge(expert.availability)}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-1">
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {isReadMore[expert.id.toString()]
                      ? expert.bio
                      : expert.bio.length > 80
                        ? expert.bio.substring(0, 80) + '...'
                        : expert.bio
                    }
                  </p>
                </div>
                {expert.bio.length > 80 && (
                  <button
                    onClick={() => toggleReadMore(expert.id)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium mb-4 transition-colors"
                  >
                    {isReadMore[expert.id.toString()] ? '- Read Less' : '+ Read More'}
                  </button>
                )}

                {/* Expertise Tags */}
                {expert.expertise && expert.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {expert.expertise.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {expert.expertise.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 text-gray-400 dark:text-gray-500">
                        +{expert.expertise.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700 mb-4"></div>

                {/* Social Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openLink(expert.socialLinks.linkedin)}
                    disabled={!expert.socialLinks.linkedin}
                    className={`flex-1 flex items-center justify-center gap-1.5 bg-[#0F2D63] hover:bg-[#1a3d7a] text-white rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                      !expert.socialLinks.linkedin ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <LinkedInChat />
                    LinkedIn
                  </button>
                  <button
                    onClick={() => openLink(`mailto:${expert.socialLinks.email}`)}
                    disabled={!expert.socialLinks.email}
                    className={`flex-1 flex items-center justify-center gap-1.5 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                      !expert.socialLinks.email ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Mail  />
                    Email
                  </button>
                  <button
                    onClick={() => openLink(expert.socialLinks.whatsapp)}
                    disabled={!expert.socialLinks.whatsapp}
                    className={`flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                      !expert.socialLinks.whatsapp ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <WhatsappChat />
                    WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#0F2D63] dark:text-white mb-2">
              No Experts Available
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Check back later for expert consultations
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HireExperts;