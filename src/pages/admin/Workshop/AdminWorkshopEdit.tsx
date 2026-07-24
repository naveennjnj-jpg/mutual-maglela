// pages/admin/Workshop/AdminWorkshopEdit.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Calendar,
  MapPin,
  Clock,
  Users,
  Mic,
  FlaskConical,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  Save,
  User,
  Phone,
  Building,
  MessageSquare,
  Edit2,
  RefreshCw,
  X
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface WorkshopDetail {
  _id: string;
  identifier: string;
  userId: string;
  serviceType: string;
  attendanceType: string;
  duration: string;
  participants: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organisation: string;
  specialRequests: string;
  status: 'pending' | 'upcoming' | 'completed' | 'cancelled';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  date?: string;
  time?: string;
  location?: string;
  adminNotes?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: WorkshopDetail | null;
}

const AdminWorkshopEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [workshop, setWorkshop] = useState<WorkshopDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    status: 'pending' as 'pending' | 'upcoming' | 'completed' | 'cancelled',
    adminNotes: '',
    location: ''
  });

  useEffect(() => {
    if (id) {
      fetchWorkshopDetail();
    } else {
      setError('No workshop ID provided');
      setLoading(false);
    }
  }, [id]);

  const fetchWorkshopDetail = async () => {
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
        `${API_URL}/api/admin/workshops/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log('Workshop detail response:', response.data);

      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setWorkshop(data);
        setFormData({
          date: data.date || '',
          time: data.time || '',
          status: data.status || 'pending',
          adminNotes: data.adminNotes || '',
          location: data.location || (data.attendanceType === 'online' ? 'Online' : 'In-Person')
        });
      } else {
        setError(response.data.message || 'Failed to load workshop details');
      }
    } catch (err: any) {
      console.error('Error fetching workshop:', err);
      setError(err.response?.data?.message || 'Failed to load workshop details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchWorkshopDetail();
    setIsRefreshing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (status: 'pending' | 'upcoming' | 'completed' | 'cancelled') => {
    setFormData(prev => ({
      ...prev,
      status
    }));
  };

  const handleSubmit = async () => {
    if (!workshop) {
      setError('No workshop data to update');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError('Authentication required');
        setSaving(false);
        return;
      }

      const payload = {
        // date: formData.date,
        // time: formData.time,
        status: formData.status,
        adminNotes: formData.adminNotes,
        // location: formData.location
      };

      const response = await axios.put(
        `${API_URL}/api/admin/workshops/${workshop._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage('Workshop updated successfully!');
        setIsEditing(false);
        await fetchWorkshopDetail();
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError(response.data.message || 'Failed to update workshop');
      }
    } catch (err: any) {
      console.error('Error updating workshop:', err);
      setError(err.response?.data?.message || 'Failed to update workshop. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (workshop) {
      setFormData({
        date: workshop.date || '',
        time: workshop.time || '',
        status: workshop.status || 'pending',
        adminNotes: workshop.specialRequests || '',
        location: workshop.location || (workshop.attendanceType === 'online' ? 'Online' : 'In-Person')
      });
    }
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'media-training':
        return <Mic className="w-4 h-4" />;
      case 'science-communication':
        return <FlaskConical className="w-4 h-4" />;
      case 'strategic-communication':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getServiceColor = (serviceType: string) => {
    switch (serviceType) {
      case 'media-training':
        return 'bg-[#C85A32]/10 text-[#C85A32] border-[#C85A32]/20';
      case 'science-communication':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'strategic-communication':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-100', dot: 'bg-yellow-500', label: 'Pending' },
      upcoming: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', dot: 'bg-blue-500', label: 'Upcoming' },
      completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', dot: 'bg-emerald-500', label: 'Completed' },
      cancelled: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', dot: 'bg-red-500', label: 'Cancelled' },
    };
    const config = configs[status as keyof typeof configs] || configs.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
        {config.label}
      </span>
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading workshop details...</p>
        </div>
      </div>
    );
  }

  if (error && !workshop) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center border border-red-100">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#0F2D63] mb-2">Error Loading Workshop</h3>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-[#C85A32] text-white rounded-xl text-sm font-semibold hover:bg-[#a8472a] transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Retry
            </button>
            <button
              onClick={() => navigate('/admin/workshops')}
              className="px-4 py-2 bg-[#0F2D63] text-white rounded-xl text-sm font-semibold hover:bg-[#0a2050] transition-colors"
            >
              Back to Workshops
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#0F2D63] mb-2">Workshop Not Found</h3>
          <p className="text-sm text-gray-500 mb-4">The workshop you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/admin/workshops')}
            className="px-4 py-2 bg-[#0F2D63] text-white rounded-xl text-sm font-semibold hover:bg-[#0a2050] transition-colors"
          >
            Back to Workshops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
        <button
          onClick={() => navigate('/admin/workshop-requests')}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#C85A32]">
            Workshop Requests
          </p>
          <h1 className="text-base font-bold text-[#0F2D63] leading-tight truncate">
            Request Detail
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )}
          {isEditing && (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors disabled:opacity-60"
            >
              {saving ? (
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
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[680px] mx-auto px-4 py-7 space-y-5">
        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Requester Information */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
            Requester Information
          </p>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0F2D63] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {getInitials(workshop.firstName, workshop.lastName)}
            </div>
            <div>
              <p className="font-bold text-[#0F2D63] text-base">
                {workshop.firstName || 'Unknown'} {workshop.lastName || ''}
              </p>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                workshop.userId ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {workshop.userId ? 'Logged In User' : 'Guest'}
              </span>
            </div>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700">{workshop.email || 'No email'}</span>
            </div>
            {workshop.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700">{workshop.phone}</span>
              </div>
            )}
            {workshop.organisation && (
              <div className="flex items-center gap-3">
                <Building className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700">{workshop.organisation}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-gray-500 text-xs">
                Submitted {workshop.createdAt ? new Date(workshop.createdAt).toLocaleString() : 'Unknown'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(workshop.status)}
            </div>
          </div>
        </div>

        {/* Workshop Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
            Workshop Details
          </p>
          <div className="space-y-3">
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold ${getServiceColor(workshop.serviceType)}`}>
              {getServiceIcon(workshop.serviceType)}
              {workshop.serviceType?.replace('-', ' ') || 'Workshop'}
            </div>

            {workshop.specialRequests && (
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">Special Requests</p>
                  <p className="text-sm text-gray-700 mt-0.5">{workshop.specialRequests}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#f9fafb] rounded-xl p-3 border border-gray-100 text-center">
                <div className="flex justify-center mb-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <p className="text-[10px] text-gray-400 mb-0.5">Format</p>
                <p className="text-xs font-bold text-[#0F2D63] capitalize">
                  {workshop.attendanceType === 'online' ? 'Online' : 'In-Person'}
                </p>
              </div>
              <div className="bg-[#f9fafb] rounded-xl p-3 border border-gray-100 text-center">
                <div className="flex justify-center mb-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <p className="text-[10px] text-gray-400 mb-0.5">Duration</p>
                <p className="text-xs font-bold text-[#0F2D63]">
                  {workshop.duration || '0'} Hours
                </p>
              </div>
              <div className="bg-[#f9fafb] rounded-xl p-3 border border-gray-100 text-center">
                <div className="flex justify-center mb-1">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <p className="text-[10px] text-gray-400 mb-0.5">Attendees</p>
                <p className="text-xs font-bold text-[#0F2D63]">
                  {workshop.participants || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Date & Time */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#C85A32]" />
            Schedule Date &amp; Time
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  disabled
                //   ={!isEditing}
                  className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white pl-9 ${
                    !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Time
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  disabled
                //   ={!isEditing}
                  className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white pl-9 ${
                    !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Status
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(['pending', 'upcoming', 'completed', 'cancelled'] as const).map((status) => {
              const isSelected = formData.status === status;
              const statusColors = {
                pending: {
                  selected: 'bg-yellow-500 text-white border-yellow-500',
                  unselected: 'bg-white border-yellow-200 text-yellow-700 hover:bg-gray-50'
                },
                upcoming: {
                  selected: 'bg-blue-500 text-white border-blue-500',
                  unselected: 'bg-white border-blue-200 text-blue-700 hover:bg-gray-50'
                },
                completed: {
                  selected: 'bg-emerald-500 text-white border-emerald-500',
                  unselected: 'bg-white border-emerald-200 text-emerald-700 hover:bg-gray-50'
                },
                cancelled: {
                  selected: 'bg-red-500 text-white border-red-500',
                  unselected: 'bg-white border-red-200 text-red-600 hover:bg-gray-50'
                }
              };
              
              const colors = statusColors[status];
              
              return (
                <button
                  key={status}
                  onClick={() => isEditing && handleStatusChange(status)}
                  disabled={!isEditing}
                  className={`py-2.5 rounded-xl text-sm font-semibold border transition-all capitalize ${
                    isSelected ? colors.selected : colors.unselected
                  } ${!isEditing ? 'cursor-not-allowed' : ''}`}
                >
                  {status === 'pending' ? 'Pending' : status}
                </button>
              );
            })}
          </div>
        </div>

        {/* Admin Notes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Admin Notes
          </label>
          <textarea
            name="adminNotes"
            rows={4}
            value={formData.adminNotes}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Add any internal notes, special instructions or context for this workshop…"
            className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white resize-none leading-relaxed ${
              !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
            }`}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-6">
          <button
            onClick={() => {
              if (isEditing) {
                handleCancelEdit();
              } else {
                navigate('/admin/workshops');
              }
            }}
            className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {isEditing ? 'Cancel' : 'Back to List'}
          </button>
          {isEditing && (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-[#0F2D63] text-white hover:bg-[#0a2050] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
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
          )}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-[#0F2D63] text-white hover:bg-[#0a2050] transition-colors"
            >
              <Edit2 className="w-4 h-4 inline mr-2" />
              Edit Workshop
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminWorkshopEdit;