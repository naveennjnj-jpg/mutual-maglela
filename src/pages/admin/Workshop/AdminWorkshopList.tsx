// pages/admin/Workshop/AdminWorkshopList.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Mic,
  FlaskConical,
  Sparkles,
  MapPin,
  Monitor,
  Clock,
  Users,
  Calendar,
  Eye,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface Workshop {
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
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Workshop[] | null;
}

const AdminWorkshopList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  useEffect(() => {
    filterWorkshops();
  }, [workshops, activeTab, searchTerm]);

  const fetchWorkshops = async () => {
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
        `${API_URL}/api/admin/workshops`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log('Workshops response:', response.data);

      if (response.data.success) {
        let workshopsData: Workshop[] = [];
        
        if (response.data.data === null) {
          workshopsData = [];
        } else if (Array.isArray(response.data.data)) {
          workshopsData = response.data.data;
        } else if (typeof response.data.data === 'object') {
          workshopsData = [response.data.data];
        }
        
        setWorkshops(workshopsData);
      } else {
        setError(response.data.message || 'Failed to load workshops');
      }
    } catch (err: any) {
      console.error('Error fetching workshops:', err);
      setError(err.response?.data?.message || 'Failed to load workshops. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterWorkshops = () => {
    let filtered = [...workshops];

    // Filter by status
    if (activeTab !== 'all') {
      filtered = filtered.filter(w => w.status === activeTab);
    }

    // Filter by search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(w =>
        (w.firstName?.toLowerCase() || '').includes(term) ||
        (w.lastName?.toLowerCase() || '').includes(term) ||
        (w.email?.toLowerCase() || '').includes(term) ||
        (w.serviceType?.toLowerCase() || '').includes(term)
      );
    }

    setFilteredWorkshops(filtered);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchWorkshops();
    setIsRefreshing(false);
  };

  const getStatusCount = (status: string) => {
    if (status === 'all') return workshops.length;
    return workshops.filter(w => w.status === status).length;
  };

  const getInitials = (firstName: string, lastName: string) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'media-training':
        return <Mic className="w-3.5 h-3.5" />;
      case 'science-communication':
        return <FlaskConical className="w-3.5 h-3.5" />;
      case 'strategic-communication':
        return <Sparkles className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
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
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
        {config.label}
      </span>
    );
  };

  const getLocationIcon = (attendanceType: string) => {
    return attendanceType === 'online' ? 
      <Monitor className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" /> : 
      <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleViewWorkshop = (id: string) => {
    navigate(`/admin/workshops/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading workshops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] p-6 space-y-5">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#C85A32] mb-1">Operations</p>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0F2D63]">Workshop Requests</h1>
            <p className="text-sm text-gray-500 mt-0.5">All workshop enquiries submitted by users and guests</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm overflow-x-auto">
        {['all', 'pending', 'upcoming', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-[#0F2D63] text-white shadow-sm'
                : 'text-gray-500 hover:text-[#0F2D63]'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {getStatusCount(tab)}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm bg-[#f4f6fb] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={handleRefresh} className="ml-auto text-red-700 font-semibold hover:underline">
            Retry
          </button>
        </div>
      )}

      {/* Workshops Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredWorkshops.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#0F2D63] mb-2">No workshops found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm ? `No workshops match "${searchTerm}"` : 'No workshop requests available'}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm table-fixed">
            <thead>
              <tr className="border-b border-gray-100 bg-[#f9fafb]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[32%]">
                  Requester
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[26%]">
                  Service
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">
                  Details
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[12%]">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[10%]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredWorkshops.map((workshop) => (
                <tr key={workshop._id} className="hover:bg-[#f9fafb] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#0F2D63] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {getInitials(workshop.firstName, workshop.lastName)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="font-semibold text-[#0F2D63] text-sm truncate">
                            {workshop.firstName || 'Unknown'} {workshop.lastName || ''}
                          </p>
                          <span className={`flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            workshop.userId ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {workshop.userId ? 'Logged In' : 'Guest'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{workshop.email || 'No email'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold border ${getServiceColor(workshop.serviceType)}`}>
                      {getServiceIcon(workshop.serviceType)}
                      <span className="truncate">{workshop.serviceType?.replace('-', ' ') || 'Workshop'}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        {getLocationIcon(workshop.attendanceType)}
                        <span className="capitalize">{workshop.attendanceType === 'online' ? 'online' : 'in-person'}</span>
                        <span className="text-gray-300">·</span>
                        <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        {workshop.duration}h
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        {workshop.participants || 0} attendees
                      </span>
                      {workshop.date && (
                        <span className="flex items-center gap-1 text-[#0F2D63] font-medium">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          {formatDate(workshop.date)}
                          {workshop.time && ` · ${formatTime(workshop.time)}`}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {getStatusBadge(workshop.status)}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => handleViewWorkshop(workshop._id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminWorkshopList;