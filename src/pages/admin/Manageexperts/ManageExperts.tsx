// pages/admin/ManageExperts.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Pencil, Trash2, Mail, X, Loader2, AlertCircle, CheckCircle, Users, User } from 'lucide-react';
import { WhatsappChat, LinkedInChat } from "@/utils/svgicons";
import { useNavigate, useLocation } from 'react-router-dom';
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

// Default avatar as inline SVG or data URL to avoid network requests
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.35em' font-size='40' fill='%239ca3af' font-family='sans-serif'%3E%3C/text%3E%3C/svg%3E";

const ManageExperts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // State
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isReadMore, setIsReadMore] = useState<{ [key: string]: boolean }>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expertToDelete, setExpertToDelete] = useState<Expert | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  // Use ref to prevent multiple API calls
  const fetchCalled = useRef(false);

  // Check for success message from navigation state
  useEffect(() => {
    const state = location.state as { success?: boolean; message?: string } | null;
    if (state?.success && state?.message) {
      setSuccessMessage(state.message);
      setTimeout(() => setSuccessMessage(null), 5000);
      // Clear navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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

    // If it's already a full URL or data URL, return as is
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
      return imagePath;
    }

    // If it's a relative path, prepend API_URL
    if (imagePath.startsWith('/')) {
      return `${API_URL}${imagePath}`;
    }

    // If it's a relative path without leading slash
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
            email: expert.email || expert.email || 'Unnamed Expert',
            title: expert.title || expert.jobTitle || '',
            image: getImageUrl(expert.profileImage || expert.image || expert.profilePic),
            bio: expert.bio || expert.description || '',
            isVerified: expert.isVerified || expert.verified || false,
            hourlyRate: expert.hourlyRate || expert.hourly_rate || 0,
            expertise: expert.expertise || [],
            availability: expert.availability || 'available',
            whatsapp: expert.whatsapp || expert.whatsapp_number || expert.socialLinks?.whatsapp || '',
            linkedin: expert.linkedin || expert.socialLinks?.linkedin || '',
            profileImage: getImageUrl(expert.profileImage || expert.image || expert.profilePic),
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
        setError('Experts endpoint not found. Please check API configuration.');
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

  // Mock data for fallback with proper image handling
  const getMockExperts = (): Expert[] => {
    return [
      {
        id: 1,
        name: "Dr. Nontobeko Mtshali",
        title: "Communications Specialist",
        image: DEFAULT_AVATAR,
        email: "test@gmail.com",
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
        email: "test@gmail.com",
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

  // Handle edit
  const handleEdit = (expert: Expert) => {
    console.log('Navigating to edit expert:', expert);
    navigate('/admin/experts/edit', {
      state: {
        expertData: expert,
        expertId: expert.id,
        isEdit: true
      }
    });
  };

  // Handle add
  const handleAdd = () => {
    navigate('/admin/experts/create');
  };

  // Handle delete click
  const handleDeleteClick = (expert: Expert) => {
    setExpertToDelete(expert);
    setShowDeleteModal(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!expertToDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError('Authentication required. Please login again.');
        setIsDeleting(false);
        return;
      }

      const response = await axios.delete<ApiResponse>(
        `${API_URL}/api/admin/experts/${expertToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setExperts(prev => prev.filter(e => e.id !== expertToDelete.id));
        setSuccessMessage(`${expertToDelete.name} has been deleted successfully.`);
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError(response.data.message || 'Failed to delete expert');
      }
    } catch (err: any) {
      console.error('Error deleting expert:', err);
      setError(err.response?.data?.message || 'Failed to delete expert. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setExpertToDelete(null);
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setExpertToDelete(null);
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
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700" > Available </span>;
      case 'busy':
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700" > Busy </span>;
      case 'unavailable':
        return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700" > Unavailable </span>;
      default:
        return null;
    }
  };

  // Image component with error handling
  const ExpertImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
    const [imgError, setImgError] = useState(false);

    if (imgError || !src || src === 'null' || src === 'undefined') {
      return (
        <div className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`
        }>
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

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" >
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200" >
          <div className="flex items-center justify-between mb-4" >
            <div className="flex items-center gap-3" >
              <div className="w-10 h-10 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center" >
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              < h3 className="text-lg font-bold text-[#0F2D63] dark:text-white" > Delete Expert </h3>
            </div>
            < button
              onClick={handleCancelDelete}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          < div className="mb-6" >
            <p className="text-sm text-gray-600 dark:text-gray-300" >
              Are you sure you want to delete <span className="font-semibold text-[#0F2D63] dark:text-white" > {expertToDelete?.name} </span>?
            </p>
            < p className="text-xs text-gray-400 dark:text-gray-500 mt-1" >
              This action cannot be undone.All associated data will be permanently removed.
            </p>
          </div>

          {
            expertToDelete && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 mb-6 flex items-center gap-3" >
                <ExpertImage
                  src={expertToDelete.image}
                  alt={expertToDelete.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-[#0F2D63] dark:text-white" > {expertToDelete.name} </p>
                  < p className="text-xs text-gray-400 dark:text-gray-400" > {expertToDelete.title} </p>
                </div>
              </div>
            )}

          <div className="flex gap-3" >
            <button
              onClick={handleCancelDelete}
              className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={isDeleting}
            >
              Cancel
            </button>
            < button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {
                isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Expert'
                )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6 flex items-center justify-center" >
        <div className="text-center" >
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400" > Loading experts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6" >
      <div className="max-w-[1500px] mx-auto space-y-6" >
        {/* Header */}
        < div className="flex items-start justify-between" >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C85A32] mb-1" >
              Operations
            </p>
            < h1 className="text-2xl font-bold text-[#0F2D63] dark:text-white" > Manage Experts </h1>
            < p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5" >
              {experts.length} {experts.length === 1 ? 'expert' : 'experts'} available
            </p>
          </div>
          < button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F2D63] dark:bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors"
          >
            <Plus className="w-[14px] h-[14px]" />
            Add Expert
          </button>
        </div>

        {/* Success Message */}
        {
          successMessage && (
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl text-sm" >
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage} </span>
            </div>
          )
        }

        {/* Error Message */}
        {
          error && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm" >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error} </span>
            </div>
          )
        }

        {/* Experts Grid */}
        {
          experts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-2" >
              {
                experts.map((expert) => (
                  <div
                    key={expert.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 w-full max-w-[480px]"
                  >
                    {/* Action Buttons */}
                    < div className="flex items-center justify-end gap-1 mb-3" >
                      <button
                        onClick={() => handleEdit(expert)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0F2D63] dark:text-blue-400 bg-[#f4f6fb] dark:bg-gray-700 hover:bg-[#e8edf8] dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit
                      </button>
                      < button
                        onClick={() => handleDeleteClick(expert)
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>

                    {/* Expert Profile */}
                    <div className="flex items-center gap-3 mb-4" >
                      <div className="relative flex-shrink-0" >
                        <ExpertImage
                          src={expert.image}
                          alt={expert.name}
                          className="w-16 h-16 rounded-full object-cover object-top"
                        />
                        {
                          expert.isVerified && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20" >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )
                        }
                      </div>
                      < div >
                        <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight" >
                          {expert.name}
                        </h2>
                        {
                          expert.title && (
                            <p className="text-xs text-gray-500 dark:text-gray-400" > {expert.title} </p>
                          )
                        }
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="mb-1" >
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed" >
                        {
                          isReadMore[expert.id.toString()]
                            ? expert.bio
                            : expert.bio.length > 80
                              ? expert.bio.substring(0, 80) + '...'
                              : expert.bio
                        }
                      </p>
                    </div>
                    {
                      expert.bio.length > 80 && (
                        <button
                          onClick={() => toggleReadMore(expert.id)}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium mb-4 transition-colors"
                        >
                          {isReadMore[expert.id.toString()] ? '- Read Less' : '+ Read More'}
                        </button>
                      )
                    }

                    <div className="border-t border-gray-200 dark:border-gray-700 mb-4" > </div>

                    {/* Social Action Buttons */}
                    <div className="flex items-center gap-2" >
                      <button
                        onClick={() => openLink(expert.socialLinks.linkedin)}
                        disabled={!expert.socialLinks.linkedin}
                        className={`flex-1 flex items-center justify-center gap-1.5 bg-[#0F2D63] hover:bg-[#1a3d7a] text-white rounded-xl py-2.5 text-sm font-semibold transition-colors ${!expert.socialLinks.linkedin ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                      >
                        <LinkedInChat />
                        LinkedIn
                      </button>
                      < button
                        onClick={() => openLink(`mailto:${expert.socialLinks.email}`)}
                        disabled={!expert.socialLinks.email}
                        className={`flex-1 flex items-center justify-center gap-1.5 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl py-2.5 text-sm font-semibold transition-colors ${!expert.socialLinks.email ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                      >
                        <Mail />
                        Email
                      </button>
                      < button
                        onClick={() => openLink(expert.socialLinks.whatsapp)}
                        disabled={!expert.socialLinks.whatsapp}
                        className={`flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl py-2.5 text-sm font-semibold transition-colors ${!expert.socialLinks.whatsapp ? 'opacity-50 cursor-not-allowed' : ''
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
            <div className="text-center py-12" >
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4" >
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              < h3 className="text-lg font-semibold text-[#0F2D63] dark:text-white mb-2" >
                No Experts Found
              </h3>
              < p className="text-sm text-gray-500 dark:text-gray-400 mb-4" >
                Get started by adding your first expert
              </p>
              < button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors"
              >
                <Plus className="w-[14px] h-[14px]" />
                Add Expert
              </button>
            </div>
          )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal />
    </div>
  );
};

export default ManageExperts;