import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Search,
  Mic,
  FlaskConical,
  Calendar,
  Clock,
  Monitor,
  MapPin,
  Users,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles,
  FileText,
  User,
  Mail,
  Phone,
  Building,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import CreateWorkshopModal from '@/components/modals/CreateWorkshopModal';

interface Workshop {
  id: number | string;
  _id?: string;
  title: string;
  type: string;
  serviceType?: string;
  category: 'media-training' | 'science-communication' | 'strategic-communication' | 'other';
  status: 'pending' | 'upcoming' | 'completed' | 'cancelled';
  date: string;
  time: string;
  duration: string;
  location: string;
  attendees: number;
  participants?: number;
  description?: string;
  color: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  organisation?: string;
  specialRequests?: string;
  attendanceType?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

const Workshops = () => {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchCalled = useRef(false);

  useEffect(() => {
    if (!fetchCalled.current) {
      fetchCalled.current = true;
      fetchWorkshops();
    }
  }, []);

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

      const response = await axios.get<ApiResponse>(`${API_URL}/api/auth/workshops`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const data = response.data.data;
        let workshopsData: Workshop[] = [];

        if (Array.isArray(data)) {
          workshopsData = data.map((item: any) => mapWorkshopData(item));
        } else if (data && typeof data === 'object') {
          workshopsData = [mapWorkshopData(data)];
        } else {
          workshopsData = getMockWorkshops();
        }

        setWorkshops(workshopsData);
      } else {
        setWorkshops(getMockWorkshops());
      }
    } catch (err: any) {
      console.error('Error fetching workshops:', err);
      setWorkshops(getMockWorkshops());
    } finally {
      setLoading(false);
    }
  };

  const mapWorkshopData = (item: any): Workshop => {
    let status: 'pending' | 'upcoming' | 'completed' | 'cancelled' = 'pending';
    if (item.status === 'upcoming' || item.status === 'pending') {
      status = 'pending';
    } else if (item.status === 'completed') {
      status = 'completed';
    } else if (item.status === 'cancelled') {
      status = 'cancelled';
    }

    let category: 'media-training' | 'science-communication' | 'strategic-communication' | 'other' = 'other';
    if (item.serviceType === 'media-training') category = 'media-training';
    else if (item.serviceType === 'science-communication') category = 'science-communication';
    else if (item.serviceType === 'strategic-communication') category = 'strategic-communication';

    const getColor = (status: string) => {
      switch (status) {
        case 'pending':
        case 'upcoming':
          return 'bg-blue-500';
        case 'completed':
          return 'bg-emerald-500';
        case 'cancelled':
          return 'bg-red-400';
        default:
          return 'bg-gray-500';
      }
    };

    const location = item.attendanceType === 'online' ? 'Online' : (item.location || 'In-Person');

    return {
      id: item._id || item.id || Date.now(),
      _id: item._id,
      title: `${item.serviceType?.replace('-', ' ') || 'Workshop'} Workshop`,
      type: item.serviceType || 'Workshop',
      serviceType: item.serviceType,
      category: category,
      status: status,
      date: item.date || item.createdAt || new Date().toISOString(),
      time: item.time || '09:00',
      duration: item.duration ? `${item.duration} hours` : '2 hours',
      location: location,
      attendees: item.participants || item.attendees || 0,
      participants: item.participants,
      description: item.specialRequests || '',
      color: getColor(status),
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      phone: item.phone,
      organisation: item.organisation,
      specialRequests: item.specialRequests,
      attendanceType: item.attendanceType,
      isActive: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  };

  const getMockWorkshops = (): Workshop[] => {
    return [
      {
        id: 1,
        title: "Media Training Workshop",
        type: "Media Training",
        serviceType: "media-training",
        category: "media-training",
        status: "pending",
        date: "2026-07-04",
        time: "09:00",
        duration: "4 hours",
        location: "Online",
        attendees: 12,
        participants: 12,
        color: "bg-blue-500",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+1234567890",
        organisation: "ABC Corp",
      },
      {
        id: 2,
        title: "Science Communication Workshop",
        type: "Science Communication",
        serviceType: "science-communication",
        category: "science-communication",
        status: "pending",
        date: "2026-07-18",
        time: "10:00",
        duration: "2 hours",
        location: "Johannesburg, SA",
        attendees: 8,
        participants: 8,
        color: "bg-blue-500",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        phone: "+9876543210",
        organisation: "XYZ Ltd",
      },
      {
        id: 3,
        title: "Media Training Workshop",
        type: "Media Training",
        serviceType: "media-training",
        category: "media-training",
        status: "completed",
        date: "2026-06-10",
        time: "14:00",
        duration: "2 hours",
        location: "Online",
        attendees: 20,
        participants: 20,
        color: "bg-emerald-500",
        firstName: "Bob",
        lastName: "Johnson",
        email: "bob@example.com",
      },
      {
        id: 4,
        title: "Science Communication Workshop",
        type: "Science Communication",
        serviceType: "science-communication",
        category: "science-communication",
        status: "completed",
        date: "2026-05-22",
        time: "09:30",
        duration: "4 hours",
        location: "Cape Town, SA",
        attendees: 5,
        participants: 5,
        color: "bg-emerald-500",
        firstName: "Alice",
        lastName: "Brown",
        email: "alice@example.com",
      },
      {
        id: 5,
        title: "Media Training Workshop",
        type: "Media Training",
        serviceType: "media-training",
        category: "media-training",
        status: "cancelled",
        date: "2026-04-15",
        time: "11:00",
        duration: "2 hours",
        location: "Online",
        attendees: 15,
        participants: 15,
        color: "bg-red-400",
        firstName: "Charlie",
        lastName: "Davis",
        email: "charlie@example.com",
      },
    ];
  };

  const getFilteredWorkshops = () => {
    let filtered = workshops;

    if (activeTab !== 'all') {
      filtered = filtered.filter(w => w.status === activeTab);
    }

    if (searchTerm) {
      filtered = filtered.filter(w =>
        w.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (w.firstName && w.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (w.lastName && w.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (w.email && w.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const filteredWorkshops = getFilteredWorkshops();

  const getStatusCount = (status: string) => {
    if (status === 'all') return workshops.length;
    return workshops.filter(w => w.status === status).length;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return 'N/A';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', icon: Clock, label: 'Pending' },
      upcoming: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', icon: Clock, label: 'Upcoming' },
      completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', icon: CheckCircle, label: 'Completed' },
      cancelled: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', icon: X, label: 'Cancelled' },
    };
    const config = configs[status as keyof typeof configs];
    if (!config) return null;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'media-training':
        return <Mic className="w-3.5 h-3.5" />;
      case 'science-communication':
        return <FlaskConical className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'media-training':
        return 'bg-[#C85A32]/10 text-[#C85A32]';
      case 'science-communication':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleModalSuccess = () => {
    setSuccessMessage('Workshop scheduled successfully!');
    fetchWorkshops();
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleViewDetails = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading workshops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-3 sm:p-6">
      <div className="max-w-[1000px] mx-auto space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-['Roboto'] font-bold text-[#0F2D63] dark:text-white">
              My Workshops
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1 leading-relaxed max-w-2xl">
              Magalela Media Services partners with a diverse network of organizations and institutions to drive meaningful influence. We invite you to schedule a tailored training workshop designed to empower your team, elevate your strategic communications, and equip your business with the tools necessary for sustained growth.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors w-full sm:w-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="sm:hidden">Schedule Workshop</span>
            <span className="hidden sm:inline">Schedule a Training Workshop</span>
          </button>
        </div>

        <div className="flex gap-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-1.5 shadow-sm overflow-x-auto [scrollbar-width:none]">
          {['all', 'pending', 'upcoming', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeTab === tab
                  ? 'bg-[#0F2D63] text-white shadow-sm'
                  : 'text-gray-500 hover:text-[#0F2D63] dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span
                className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {getStatusCount(tab)}
              </span>
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by service type, name, or email…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#C85A32] bg-gray-50 dark:bg-gray-900 dark:text-white placeholder-gray-400 transition-all"
            />
          </div>
        </div>

        {successMessage && (
          <div className="flex items-start gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm">
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="flex-1 min-w-0 break-words">{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="flex-1 min-w-0 break-words">{error}</span>
          </div>
        )}

        <div className="space-y-3 sm:space-y-4">
          {filteredWorkshops.length > 0 ? (
            filteredWorkshops.map((workshop) => (
              <div
                key={workshop.id}
                onClick={() => handleViewDetails(workshop)}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className={`h-1 ${workshop.color}`}></div>
                <div className="p-3 sm:p-5">
                  <div className="flex items-start gap-2 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0F2D63] rounded-2xl flex flex-col items-center justify-center text-white flex-shrink-0">
                      <span className="text-[9px] sm:text-[10px] font-semibold uppercase opacity-60">
                        {new Date(workshop.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-lg sm:text-xl font-bold leading-none">
                        {new Date(workshop.date).getDate()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getCategoryColor(workshop.category)}`}>
                          {getCategoryIcon(workshop.category)}
                          <span className="truncate max-w-[120px] sm:max-w-none">{workshop.type}</span>
                        </span>
                        {getStatusBadge(workshop.status)}
                      </div>

                      {(workshop.firstName || workshop.lastName) && (
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 flex-wrap">
                          <User className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
                            {workshop.firstName} {workshop.lastName}
                          </span>
                          {workshop.email && (
                            <>
                              <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">|</span>
                              <Mail className="w-3 h-3 text-gray-400 shrink-0 hidden sm:inline" />
                              <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[140px] sm:max-w-[150px] hidden sm:inline">
                                {workshop.email}
                              </span>
                            </>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-1.5 sm:gap-4 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{formatDate(workshop.date)}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{formatTime(workshop.time)} · {workshop.duration}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          {workshop.location.includes('Online') ? (
                            <Monitor className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          ) : (
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          )}
                          <span className="capitalize truncate">{workshop.location}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{workshop.attendees} participants</span>
                        </span>
                      </div>

                      {workshop.specialRequests && (
                        <p className="mt-2 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg px-2 sm:px-3 py-1.5 truncate">
                          <MessageSquare className="w-3 h-3 inline mr-1" />
                          {workshop.specialRequests}
                        </p>
                      )}

                      {workshop.status === 'cancelled' && (
                        <p className="mt-2 text-[11px] sm:text-xs text-red-500 bg-red-50 dark:bg-red-900/30 rounded-lg px-2 sm:px-3 py-1.5">
                          Rescheduled due to speaker unavailability.
                        </p>
                      )}
                    </div>

                    <div className="hidden sm:block flex-shrink-0 self-center">
                      <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 sm:py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-[#0F2D63] dark:text-white mb-2">
                No workshops found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm ? `No workshops match "${searchTerm}"` : 'Schedule your first training workshop'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#C85A32] text-white text-sm font-semibold rounded-xl hover:bg-[#a8472a] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Schedule Workshop
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <CreateWorkshopModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleModalSuccess}
      />

      {showDetailsModal && selectedWorkshop && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl max-w-md w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-xl">
            <div className={`h-1.5 ${selectedWorkshop.color} rounded-t-2xl`}></div>
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4 gap-2">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-xl font-bold text-[#0F2D63] dark:text-white break-words">
                    {selectedWorkshop.title}
                  </h3>
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getCategoryColor(selectedWorkshop.category)}`}>
                      {getCategoryIcon(selectedWorkshop.category)}
                      {selectedWorkshop.type}
                    </span>
                    {getStatusBadge(selectedWorkshop.status)}
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors shrink-0"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Calendar className="w-5 h-5 text-[#C85A32] mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0F2D63] dark:text-white break-words">
                      {formatDate(selectedWorkshop.date)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(selectedWorkshop.time)} · {selectedWorkshop.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  {selectedWorkshop.location.includes('Online') ? (
                    <Monitor className="w-5 h-5 text-[#C85A32] mt-0.5 shrink-0" />
                  ) : (
                    <MapPin className="w-5 h-5 text-[#C85A32] mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0F2D63] dark:text-white break-words">
                      {selectedWorkshop.location}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedWorkshop.attendanceType === 'online' ? 'Virtual Session' : 'In-Person Session'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <Users className="w-5 h-5 text-[#C85A32] mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0F2D63] dark:text-white">
                      {selectedWorkshop.attendees} Participants
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Expected attendees
                    </p>
                  </div>
                </div>

                {(selectedWorkshop.firstName || selectedWorkshop.lastName) && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <User className="w-5 h-5 text-[#C85A32] mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#0F2D63] dark:text-white break-words">
                        {selectedWorkshop.firstName} {selectedWorkshop.lastName}
                      </p>
                      {selectedWorkshop.email && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
                          {selectedWorkshop.email}
                        </p>
                      )}
                      {selectedWorkshop.phone && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedWorkshop.phone}
                        </p>
                      )}
                      {selectedWorkshop.organisation && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 break-words">
                          {selectedWorkshop.organisation}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {selectedWorkshop.specialRequests && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <MessageSquare className="w-5 h-5 text-[#C85A32] mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#0F2D63] dark:text-white">
                        Special Requests
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 break-words">
                        {selectedWorkshop.specialRequests}
                      </p>
                    </div>
                  </div>
                )}

                {selectedWorkshop.createdAt && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Clock className="w-5 h-5 text-[#C85A32] mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#0F2D63] dark:text-white">
                        Created
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 break-words">
                        {new Date(selectedWorkshop.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
                {selectedWorkshop.status === 'pending' && (
                  <button className="flex-1 px-4 py-2.5 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl text-sm font-semibold transition-colors">
                    Edit Workshop
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workshops;