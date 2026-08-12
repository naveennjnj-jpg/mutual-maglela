// pages/user/Schedule.tsx
import React, { useState, useEffect } from "react";
import {
  Settings2,
  Plus,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  FileText,
  Loader2,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  X,
  CheckCircle2,
  XCircle,
  Info,
  Calendar,
  Globe
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  location: string;
  description?: string;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday?: boolean;
  events?: Event[];
  isAvailable?: boolean;
  isBlocked?: boolean;
  availabilityDetails?: {
    status: string;
    mode: string;
    startTime: string;
    endTime: string;
    timezone: string;
    selectedDays?: string[];
    timeSlots: Array<{ startTime: string; endTime: string }>;
    blockInfo?: {
      startDate: string;
      endDate: string;
      startTime: string;
      endTime: string;
      timezone: string;
    };
  };
}

interface Project {
  id: string;
  name: string;
  client: string;
  status: "active" | "pending" | "completed";
  createdAt?: string;
  updatedAt?: string;
}

interface InvoiceDue {
  id: string;
  invoiceNumber: string;
  client: string;
  clientName?: string;
  amount: number;
  dueDate: string;
  status: "today" | "overdue" | "upcoming";
  daysOverdue?: number;
}

interface Availability {
  id: string;
  mode: 'recurring' | 'specific';
  selectedDays: string[];
  status: 'available' | 'blocked';
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  timeSlots: Array<{ id: string; startTime: string; endTime: string }>;
  blockStartDate: string;
  blockEndDate: string;
  blockStartTime: string;
  blockEndTime: string;
  blockTimezone: string;
  isActive: boolean;
}

const Schedule = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [eventsByDate, setEventsByDate] = useState<Record<string, Event[]>>({});
  const [todayEvents, setTodayEvents] = useState<Event[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoicesDue, setInvoicesDue] = useState<InvoiceDue[]>([]);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [availabilityDays, setAvailabilityDays] = useState<Record<string, {
    isAvailable: boolean;
    isBlocked: boolean;
    details: {
      status: string;
      mode: string;
      startTime: string;
      endTime: string;
      timezone: string;
      selectedDays?: string[];
      timeSlots: Array<{ startTime: string; endTime: string }>;
      blockInfo?: {
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
        timezone: string;
      };
    } | null;
  }>>({});
  const [hoveredDay, setHoveredDay] = useState<{ date: number; element: HTMLElement } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [invoicesLoading, setInvoicesLoading] = useState(true);

  // Fetch data on mount and month change
  useEffect(() => {
    fetchScheduleData();
  }, [currentMonth, currentYear]);

  // Process availability data when it changes
  useEffect(() => {
    if (availability) {
      processAvailability(availability);
    }
  }, [availability, currentMonth, currentYear]);

  const processAvailability = (avail: Availability) => {
    const availMap: Record<string, {
      isAvailable: boolean;
      isBlocked: boolean;
      details: {
        status: string;
        mode: string;
        startTime: string;
        endTime: string;
        timezone: string;
        selectedDays?: string[];
        timeSlots: Array<{ startTime: string; endTime: string }>;
        blockInfo?: {
          startDate: string;
          endDate: string;
          startTime: string;
          endTime: string;
          timezone: string;
        };
      } | null;
    }> = {};

    const dayMap: Record<string, number> = {
      'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 0
    };

    const year = currentYear;
    const month = currentMonth;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Initialize all days with default info
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split('T')[0];
      availMap[dateKey] = {
        isAvailable: false,
        isBlocked: false,
        details: {
          status: 'not_set',
          mode: avail.mode,
          startTime: avail.startTime,
          endTime: avail.endTime,
          timezone: avail.timezone,
          selectedDays: avail.selectedDays,
          timeSlots: avail.timeSlots.map(slot => ({
            startTime: slot.startTime,
            endTime: slot.endTime
          }))
        }
      };
    }

    if (avail.mode === 'recurring') {
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        const dateKey = date.toISOString().split('T')[0];
        
        let dayName = '';
        for (const [name, num] of Object.entries(dayMap)) {
          if (num === dayOfWeek) {
            dayName = name;
            break;
          }
        }
        
        if (avail.selectedDays.includes(dayName)) {
          const isAvailable = avail.status === 'available';
          availMap[dateKey] = {
            isAvailable: isAvailable,
            isBlocked: !isAvailable,
            details: {
              status: avail.status,
              mode: avail.mode,
              startTime: avail.startTime,
              endTime: avail.endTime,
              timezone: avail.timezone,
              selectedDays: avail.selectedDays,
              timeSlots: avail.timeSlots.map(slot => ({
                startTime: slot.startTime,
                endTime: slot.endTime
              }))
            }
          };
        }
      }
    } else {
      if (avail.startDate && avail.endDate) {
        const start = new Date(avail.startDate);
        const end = new Date(avail.endDate);
        
        let current = new Date(start);
        while (current <= end) {
          const dateKey = current.toISOString().split('T')[0];
          if (availMap[dateKey]) {
            const isAvailable = avail.status === 'available';
            availMap[dateKey] = {
              isAvailable: isAvailable,
              isBlocked: !isAvailable,
              details: {
                status: avail.status,
                mode: avail.mode,
                startTime: avail.startTime,
                endTime: avail.endTime,
                timezone: avail.timezone,
                selectedDays: avail.selectedDays,
                timeSlots: avail.timeSlots.map(slot => ({
                  startTime: slot.startTime,
                  endTime: slot.endTime
                }))
              }
            };
          }
          current.setDate(current.getDate() + 1);
        }
      }
    }

    // Process block dates
    if (avail.blockStartDate && avail.blockEndDate) {
      const start = new Date(avail.blockStartDate);
      const end = new Date(avail.blockEndDate);
      
      let current = new Date(start);
      while (current <= end) {
        const dateKey = current.toISOString().split('T')[0];
        if (availMap[dateKey]) {
          availMap[dateKey] = {
            isAvailable: false,
            isBlocked: true,
            details: {
              status: 'blocked',
              mode: 'specific',
              startTime: avail.blockStartTime || '00:00',
              endTime: avail.blockEndTime || '23:59',
              timezone: avail.blockTimezone || avail.timezone,
              selectedDays: [],
              timeSlots: [{ startTime: '00:00', endTime: '23:59' }],
              blockInfo: {
                startDate: avail.blockStartDate,
                endDate: avail.blockEndDate,
                startTime: avail.blockStartTime || '00:00',
                endTime: avail.blockEndTime || '23:59',
                timezone: avail.blockTimezone || avail.timezone
              }
            }
          };
        }
        current.setDate(current.getDate() + 1);
      }
    }

    setAvailabilityDays(availMap);
  };

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setProjectsLoading(false);
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/admin/projects?status=active`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const projectsData = response.data.data.map((project: any) => ({
          id: project._id,
          name: project.title || project.name || 'Untitled Project',
          client: project.clientName || project.client?.name || 'Unknown Client',
          status: project.status || 'active',
          createdAt: project.createdAt,
          updatedAt: project.updatedAt
        }));
        setProjects(projectsData.slice(0, 5)); // Limit to 5 projects
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setProjectsLoading(false);
    }
  };

  // Fetch invoices
  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setInvoicesLoading(false);
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/admin/invoices?status=pending,overdue`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const invoicesData = response.data.data
          .map((invoice: any) => {
            const dueDate = new Date(invoice.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            
            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let status: "today" | "overdue" | "upcoming" = "upcoming";
            if (diffDays < 0) {
              status = "overdue";
            } else if (diffDays === 0) {
              status = "today";
            }

            return {
              id: invoice._id,
              invoiceNumber: invoice.invoiceNumber || `INV-${invoice._id}`,
              client: invoice.clientInfo?.clientName || invoice.clientName || 'Unknown Client',
              clientName: invoice.clientInfo?.clientName || invoice.clientName,
              amount: invoice.grandTotal || invoice.totalAmount || 0,
              dueDate: invoice.dueDate,
              status: status,
              daysOverdue: status === 'overdue' ? Math.abs(diffDays) : undefined
            };
          })
          .filter((inv: InvoiceDue) => inv.status === 'today' || inv.status === 'overdue')
          .sort((a: InvoiceDue, b: InvoiceDue) => {
            if (a.status === 'overdue' && b.status !== 'overdue') return -1;
            if (a.status !== 'overdue' && b.status === 'overdue') return 1;
            return 0;
          });

        setInvoicesDue(invoicesData.slice(0, 5)); // Limit to 5 invoices
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setInvoicesLoading(false);
    }
  };

  const fetchScheduleData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view schedule");
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch events for the month
      const eventsResponse = await axios.get(
        `${API_URL}/api/admin/events/month?month=${currentMonth}&year=${currentYear}`,
        { headers }
      );

      if (eventsResponse.data.success) {
        setEventsByDate(eventsResponse.data.data);
      }

      // Fetch today's events
      const todayResponse = await axios.get(
        `${API_URL}/api/admin/events/today`,
        { headers }
      );

      if (todayResponse.data.success) {
        setTodayEvents(todayResponse.data.data);
      }

      // Fetch availability
      const availabilityResponse = await axios.get(
        `${API_URL}/api/admin/availability`,
        { headers }
      );

      if (availabilityResponse.data.success && availabilityResponse.data.data) {
        setAvailability(availabilityResponse.data.data);
      }

      // Fetch projects and invoices
      await Promise.all([
        fetchProjects(),
        fetchInvoices()
      ]);

    } catch (error: any) {
      console.error("Error fetching schedule data:", error);
      toast.error(error.response?.data?.message || "Failed to fetch schedule data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Project["status"]) => {
    const config = {
      active: "bg-green-500",
      pending: "bg-amber-500",
      completed: "bg-blue-500",
    };
    return config[status] || config.active;
  };

  const getInvoiceStatusColor = (status: InvoiceDue["status"]) => {
    const config = {
      today: "text-amber-500",
      overdue: "text-red-500",
      upcoming: "text-gray-400",
    };
    return config[status] || config.today;
  };

  const getInvoiceStatusLabel = (status: InvoiceDue["status"]) => {
    const config = {
      today: "Due Today",
      overdue: "Overdue",
      upcoming: "Upcoming",
    };
    return config[status] || config.today;
  };

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: CalendarDay[] = [];

    for (let i = 0; i < startingDay; i++) {
      days.push({ date: 0, isCurrentMonth: false });
    }

    const today = new Date();
    const isTodayMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(currentYear, currentMonth, i);
      const dateKey = dateObj.toISOString().split('T')[0];
      
      const dayData = availabilityDays[dateKey] || {
        isAvailable: false,
        isBlocked: false,
        details: null
      };
      
      days.push({
        date: i,
        isCurrentMonth: true,
        isToday: isTodayMonth && i === today.getDate(),
        events: eventsByDate[dateKey] || [],
        isAvailable: dayData.isAvailable,
        isBlocked: dayData.isBlocked,
        availabilityDetails: dayData.details || undefined,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const changeMonth = (direction: number) => {
    const newMonth = currentMonth + direction;
    if (newMonth < 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else if (newMonth > 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(newMonth);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login");
        return;
      }

      const response = await axios.delete(
        `${API_URL}/api/user/events/${eventId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Event deleted successfully");
        setShowEventModal(false);
        fetchScheduleData();
      } else {
        toast.error(response.data.message || "Failed to delete event");
      }
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast.error(error.response?.data?.message || "Failed to delete event");
    }
  };

  const handleMouseEnter = (e: React.MouseEvent, day: CalendarDay) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setHoveredDay({ date: day.date, element: e.currentTarget as HTMLElement });
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#C85A32] mx-auto mb-4" />
          <p className="text-gray-500">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C85A32] mb-1">
            Operations
          </p>
          <h1 className="text-2xl font-bold text-[#0F2D63]">My Schedule</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your calendar, events and availability
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/manage-availability"
            className="flex items-center gap-2 px-4 py-2.5 border border-[#0F2D63] text-[#0F2D63] text-sm font-semibold rounded-xl hover:bg-[#0F2D63] hover:text-white transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            Manage Availability
          </Link>
          <Link
            to="/admin/add-event"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#C85A32] text-white text-sm font-semibold rounded-xl hover:bg-[#a8472a] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Event
          </Link>
        </div>
      </div>

      {/* Availability Status Bar */}
      {availability && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${availability.status === 'available' ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-[#0F2D63] capitalize">
              Status: {availability.status}
            </span>
            <span className="text-xs text-gray-400">
              {availability.mode === 'recurring' ? 'Recurring' : 'Specific Dates'}
            </span>
            {availability.mode === 'recurring' && (
              <span className="text-xs text-gray-400">
                Days: {availability.selectedDays.join(', ')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{availability.startTime} - {availability.endTime}</span>
            <span className="mx-1">•</span>
            <span>{availability.timezone}</span>
          </div>
        </div>
      )}

      {/* Calendar and Sidebar */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Calendar */}
        <div className="w-full lg:w-[70%]">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[#0F2D63]">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => changeMonth(-1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={goToToday}
                  className="px-3 py-1 text-xs font-semibold rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => changeMonth(1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="py-2.5 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
              {calendarDays.map((day, index) => {
                const isEmpty = !day.isCurrentMonth;

                if (isEmpty) {
                  return (
                    <div key={`empty-${index}`} className="h-24 bg-[#fafafa]" />
                  );
                }

                const isToday = day.isToday;
                const hasEvents = day.events && day.events.length > 0;
                const isAvailable = day.isAvailable;
                const isBlocked = day.isBlocked;
                const hasAvailabilityDetails = day.availabilityDetails !== undefined && day.availabilityDetails !== null;

                let bgColor = '';
                let borderColor = '';
                if (isBlocked) {
                  bgColor = 'bg-red-50';
                  borderColor = 'border-l-2 border-r-2 border-red-200';
                } else if (isAvailable) {
                  bgColor = 'bg-green-50';
                  borderColor = 'border-l-2 border-r-2 border-green-200';
                }

                return (
                  <div
                    key={`day-${day.date}`}
                    className={`h-24 p-2 flex flex-col items-start text-left transition-all relative cursor-default ${borderColor} ${
                      isToday ? "bg-[#0F2D63]" : bgColor || "hover:bg-[#f4f6fb]"
                    }`}
                    onMouseEnter={(e) => handleMouseEnter(e, day)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span
                      className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold mb-1 flex-shrink-0 ${
                        isToday
                          ? "bg-white text-[#0F2D63]"
                          : "text-gray-700"
                      }`}
                    >
                      {day.date}
                    </span>
                    
                    {isAvailable && !isBlocked && !isToday && (
                      <div className="absolute top-1 right-1">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                      </div>
                    )}
                    {isBlocked && !isToday && (
                      <div className="absolute top-1 right-1">
                        <XCircle className="w-3 h-3 text-red-500" />
                      </div>
                    )}
                    {hasAvailabilityDetails && !isToday && (
                      <div className="absolute top-1 left-1">
                        <Info className="w-3 h-3 text-gray-400" />
                      </div>
                    )}

                    <div className="w-full space-y-0.5 overflow-hidden">
                      {hasEvents && day.events!.slice(0, 2).map((event) => (
                        <button
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className="w-full h-1.5 rounded-full bg-[#C85A32] opacity-80 hover:opacity-100 transition-opacity"
                          title={event.title}
                        />
                      ))}
                      {day.events && day.events.length > 2 && (
                        <span className="text-[8px] text-gray-400">
                          +{day.events.length - 2} more
                        </span>
                      )}
                    </div>

                    {hoveredDay && hoveredDay.date === day.date && day.availabilityDetails && (
                      <div 
                        className="fixed z-50 bg-gray-900 text-white rounded-xl shadow-2xl p-5 max-w-sm pointer-events-none"
                        style={{
                          top: tooltipPosition.y - 220,
                          left: tooltipPosition.x - 180,
                          transform: 'translateY(-100%)',
                        }}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wider">
                              <span className={day.availabilityDetails.status === 'available' ? 'text-green-400' : 'text-red-400'}>
                                {day.availabilityDetails.status === 'available' ? '✅ Available' : 
                                 day.availabilityDetails.status === 'blocked' ? '🚫 Blocked' : '📅 No Availability'}
                              </span>
                            </p>
                            <span className="text-xs text-gray-500">
                              {day.availabilityDetails.mode === 'recurring' ? 'Recurring' : 'Specific'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-300">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>
                              {new Date(currentYear, currentMonth, day.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>

                          {day.availabilityDetails.status !== 'not_set' && (
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <span>
                                {day.availabilityDetails.startTime} - {day.availabilityDetails.endTime}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-xs text-gray-300">
                            <Globe className="w-3.5 h-3.5 text-gray-400" />
                            <span>{day.availabilityDetails.timezone}</span>
                          </div>

                          {day.availabilityDetails.timeSlots && day.availabilityDetails.timeSlots.length > 0 && (
                            <div className="mt-1">
                              <p className="text-xs text-gray-400 mb-1.5">Time Slots:</p>
                              <div className="space-y-1">
                                {day.availabilityDetails.timeSlots.map((slot, idx) => (
                                  <div key={idx} className="text-xs text-gray-300 flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32]"></span>
                                    {slot.startTime} → {slot.endTime}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {day.availabilityDetails.blockInfo && (
                            <div className="mt-1 bg-red-900/20 border border-red-500/20 rounded-lg p-2">
                              <p className="text-xs text-red-400 font-semibold mb-1">🚫 Blocked Period</p>
                              <div className="space-y-1 text-xs text-gray-300">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-3 h-3 text-gray-400" />
                                  <span>{formatDate(day.availabilityDetails.blockInfo.startDate)} - {formatDate(day.availabilityDetails.blockInfo.endDate)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span>{day.availabilityDetails.blockInfo.startTime} - {day.availabilityDetails.blockInfo.endTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Globe className="w-3 h-3 text-gray-400" />
                                  <span>{day.availabilityDetails.blockInfo.timezone}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {day.availabilityDetails.mode === 'recurring' && day.availabilityDetails.selectedDays && (
                            <div className="mt-1">
                              <p className="text-xs text-gray-400">Recurring on: <span className="text-white font-medium">{day.availabilityDetails.selectedDays.join(', ')}</span></p>
                            </div>
                          )}
                        </div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                          <div className="w-3 h-3 bg-gray-900 rotate-45"></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="border-t border-gray-100 px-5 py-3 flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-500">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-500">Blocked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#C85A32]"></div>
                <span className="text-xs text-gray-500">Event</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#0F2D63]"></div>
                <span className="text-xs text-gray-500">Today</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Info className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">Hover for details</span>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-6 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                {todayEvents.length > 0 
                  ? `${todayEvents.length} event${todayEvents.length > 1 ? 's' : ''} today` 
                  : "No events today"}
              </p>
              <Link
                to="/admin/add-event"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#C85A32] hover:underline"
              >
                <Plus className="w-3 h-3" />
                Add event
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[30%] space-y-4">
          {/* Today Card */}
          <div className="bg-[#0F2D63] rounded-2xl p-5">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
              Today
            </p>
            <p className="text-xl font-bold text-white mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </p>
            <p className="text-sm text-white/60">
              {new Date().toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C85A32]"></span>
              <span className="text-xs text-white/60">
                {todayEvents.length} meeting{todayEvents.length !== 1 ? 's' : ''} today
              </span>
            </div>
          </div>

          {/* Today's Events List */}
          {todayEvents.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CalendarIcon className="w-3 h-3 text-[#C85A32]" />
                Today's Events
              </p>
              <div className="space-y-2">
                {todayEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="w-full text-left p-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <p className="text-xs font-semibold text-[#0F2D63]">{event.title}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {event.startTime} {event.endTime ? `- ${event.endTime}` : ''}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Projects - Dynamic */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FolderKanban className="w-3 h-3 text-[#C85A32]" />
              Active Projects
            </p>
            {projectsLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : projects.length > 0 ? (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-start gap-2.5">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${getStatusColor(
                        project.status
                      )}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#0F2D63] leading-tight line-clamp-2">
                        {project.name}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                        {project.client}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-2">No active projects</p>
            )}
            {projects.length > 3 && (
              <Link 
                to="/admin/projects" 
                className="block text-center text-xs text-[#C85A32] font-semibold mt-3 hover:underline"
              >
                View all projects →
              </Link>
            )}
          </div>

          {/* Invoices Due - Dynamic */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-[#C85A32]" />
              Invoices Due
            </p>
            {invoicesLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : invoicesDue.length > 0 ? (
              <div className="space-y-3">
                {invoicesDue.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#0F2D63] truncate">
                        {invoice.client}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p
                          className={`text-[10px] font-medium ${getInvoiceStatusColor(
                            invoice.status
                          )}`}
                        >
                          {getInvoiceStatusLabel(invoice.status)}
                        </p>
                        {invoice.status === 'overdue' && invoice.daysOverdue && (
                          <span className="text-[10px] text-red-400 bg-red-50 px-1.5 py-0.5 rounded-full">
                            {invoice.daysOverdue} days
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#0F2D63] flex-shrink-0">
                      R {invoice.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-2">No invoices due</p>
            )}
            {invoicesDue.length > 3 && (
              <Link 
                to="/admin/invoices" 
                className="block text-center text-xs text-[#C85A32] font-semibold mt-3 hover:underline"
              >
                View all invoices →
              </Link>
            )}
          </div>

          {/* Add Event Button */}
          <Link
            to="/admin/add-event"
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#C85A32] hover:bg-[#a8472a] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Event
          </Link>
        </div>
      </div>

      {/* Event Detail Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                  Event Details
                </p>
                <h3 className="font-bold text-[#0F2D63] text-lg">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setShowEventModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-[#f4f6fb] text-gray-600 border-gray-200">
                  {selectedEvent.type || 'Meeting'}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <span>{new Date().toLocaleDateString('en-US', { 
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{selectedEvent.startTime} {selectedEvent.endTime ? `- ${selectedEvent.endTime}` : ''}</span>
                </div>
                {selectedEvent.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}
              </div>

              {selectedEvent.description && (
                <div className="bg-[#f9fafb] rounded-xl p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Description
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    navigate(`/admin/edit-event/${selectedEvent.id}`);
                  }}
                  className="flex-1 py-2.5 border border-[#0F2D63] text-[#0F2D63] text-sm font-semibold rounded-xl hover:bg-[#0F2D63] hover:text-white transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;