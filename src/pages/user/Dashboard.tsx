// pages/user/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import {
  MapPin,
  Plus,
  FileText,
  Mic,
  Briefcase,
  ShoppingBag,
  Clock,
  ChevronRight,
  BookOpen,
  Calendar,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  User,
  Mail,
  Building,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

// ============================================
// TYPES
// ============================================

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  timezone: string;
  credits: number;
  plan: string;
  institution: string;
  position: string;
  avatar?: string;
  initials?: string;
  createdAt?: string;
}

interface Project {
  _id: string;
  identifier: string;
  userId: string;
  title: string;
  type: string;
  description: string;
  priority: string;
  deadline: string;
  proceedOption: string;
  attachments: string;
  adminnote: string | null;
  adminattachment: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Workshop {
  _id: string;
  identifier: string;
  userId: string;
  serviceType: string;
  attendanceType: string;
  duration: string;
  participants: string;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organisation: string;
  specialRequests: string;
  status: string;
  isActive: boolean;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalProjects: number;
  totalSpeeches: number;
  totalWritings: number;
  totalWorkshops: number;
  completedProjects: number;
  pendingProjects: number;
}

// ============================================
// COMPONENT
// ============================================

const UserDashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // State
  const [timezone, setTimezone] = useState("UTC");
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Good afternoon");

  // User Data
  const [userData, setUserData] = useState<UserData>({
    id: '',
    name: 'User',
    email: '',
    role: 'user',
    timezone: 'UTC',
    credits: 0,
    plan: 'Free',
    institution: '',
    position: '',
    initials: 'U'
  });

  // Stats
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalSpeeches: 0,
    totalWritings: 0,
    totalWorkshops: 0,
    completedProjects: 0,
    pendingProjects: 0
  });

  // Projects & Workshops
  const [projects, setProjects] = useState<Project[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [upcomingWorkshops, setUpcomingWorkshops] = useState<Workshop[]>([]);

  // ============================================
  // FETCH ALL DATA
  // ============================================

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch User Data
        const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userResponse.data.success) {
          const data = userResponse.data.data;
          const name = data.name || 'User';
          const nameParts = name.split(' ') || ['U'];
          const initials = nameParts
            .map((part: string) => part.charAt(0).toUpperCase())
            .join('')
            .slice(0, 2);

          setUserData({
            id: data.id || data._id,
            name: name,
            email: data.email || '',
            role: data.role || 'user',
            timezone: data.timezone || 'UTC',
            credits: data.credits || data.creditsBalance || 0,
            plan: data.plan || 'Free',
            institution: data.institution || 'Your Institution',
            position: data.position || 'Your Position',
            initials: initials || 'U'
          });

          setTimezone(data.timezone || 'UTC');
          updateGreeting(data.timezone || 'UTC');
        }

        // Fetch Projects
        const projectsResponse = await axios.get(`${API_URL}/api/auth/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (projectsResponse.data.success) {
          const allProjects = projectsResponse.data.data || [];
          setProjects(allProjects);

          // Filter: Only show projects with title and status not 'Deleted'
          const activeProjects = allProjects.filter(
            (p: Project) => p.title && p.status !== 'Deleted'
          );

          // Recent projects (last 3)
          const sorted = [...activeProjects].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setRecentProjects(sorted.slice(0, 3));

          // Update stats
          const completed = activeProjects.filter((p: Project) =>
            p.status === 'Completed' || p.status === 'Published' || p.status === 'Approved'
          ).length;

          const pending = activeProjects.filter((p: Project) =>
            p.status === 'Pending' || p.status === 'Drafting' || p.status === 'In Progress'
          ).length;

          setStats(prev => ({
            ...prev,
            totalProjects: activeProjects.length,
            completedProjects: completed,
            pendingProjects: pending
          }));
        }

        // Fetch Workshops
        const workshopsResponse = await axios.get(`${API_URL}/api/auth/workshops`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (workshopsResponse.data.success) {
          const allWorkshops = workshopsResponse.data.data || [];
          setWorkshops(allWorkshops);

          // Upcoming workshops (status: upcoming or pending)
          const upcoming = allWorkshops.filter(
            (w: Workshop) => w.status === 'upcoming' || w.status === 'pending'
          );
          setUpcomingWorkshops(upcoming.slice(0, 4));

          // Update stats
          setStats(prev => ({
            ...prev,
            totalWorkshops: allWorkshops.length
          }));
        }

        // Fetch Writing Stats (if you have this endpoint)
        try {
          const writingResponse = await axios.get(`${API_URL}/api/auth/ai-writing`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (writingResponse.data.success) {
            const writings = writingResponse.data.data || [];
            setStats(prev => ({
              ...prev,
              totalWritings: writings.length
            }));
          }
        } catch (e) {
          console.log('Writing stats not available');
        }

        // Fetch Speech Stats (if you have this endpoint)
        try {
          const speechResponse = await axios.get(`${API_URL}/api/auth/ai-speech`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (speechResponse.data.success) {
            const speeches = speechResponse.data.data || [];
            setStats(prev => ({
              ...prev,
              totalSpeeches: speeches.length
            }));
          }
        } catch (e) {
          console.log('Speech stats not available');
        }

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // ============================================
  // UPDATE TIME
  // ============================================

  const updateGreeting = (tz: string) => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: '2-digit',
      hour12: false
    });
    const hour = parseInt(formatter.format(now));

    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  };

  useEffect(() => {
    if (!timezone) return;

    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short",
      });
      setCurrentTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  // ============================================
  // HELPERS
  // ============================================

  const handleTopUp = () => {
    window.location.href = '/user/credits/topup';
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'Pending': 'bg-amber-50 text-amber-600 border-amber-200',
      'Drafting': 'bg-[#F3EDE6] text-[#C85A32] border-[#F3EDE6]',
      'In Progress': 'bg-blue-50 text-blue-600 border-blue-200',
      'Completed': 'bg-green-50 text-green-600 border-green-200',
      'Published': 'bg-green-50 text-green-600 border-green-200',
      'Approved': 'bg-green-50 text-green-600 border-green-200',
      'Rejected': 'bg-red-50 text-red-600 border-red-200',
      'publish': 'bg-green-50 text-green-600 border-green-200',
      'upcoming': 'bg-blue-50 text-blue-600 border-blue-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Completed': <CheckCircle className="w-3 h-3" />,
      'Published': <CheckCircle className="w-3 h-3" />,
      'Approved': <CheckCircle className="w-3 h-3" />,
      'Pending': <Clock className="w-3 h-3" />,
      'Drafting': <Clock className="w-3 h-3" />,
      'Rejected': <XCircle className="w-3 h-3" />,
      'upcoming': <Calendar className="w-3 h-3" />,
    };
    return icons[status] || <AlertCircle className="w-3 h-3" />;
  };

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      'high': 'text-red-600 bg-red-50',
      'medium': 'text-amber-600 bg-amber-50',
      'low': 'text-green-600 bg-green-50',
    };
    return colors[priority] || 'text-gray-600 bg-gray-50';
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getServiceTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'media-training': 'Media Training',
      'science-communication': 'Science Communication',
      'crisis-communication': 'Crisis Communication',
      'storytelling': 'Storytelling',
      'public-relations': 'Public Relations',
    };
    return labels[type] || type;
  };

  // ============================================
  // RENDER
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#C85A32] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4]">
      <div className="max-w-[1500px] mx-auto px-6 py-6 space-y-5">
        {/* Top Bar */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-5 py-3.5 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <div>
              <p className="font-semibold text-sm text-[#0F2D63]">Institutional Dashboard</p>
              <p className="text-xs text-gray-400">{userData.institution || 'Your Institution'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Credits Display */}
            <div className="flex items-center gap-2 bg-[#F9F7F4] border border-gray-100 rounded-xl px-3 py-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#C85A32]" />
              <span className="text-xs text-gray-500">Credits:</span>
              <span className={`text-sm font-bold ${userData.credits === 0 ? 'text-red-500' : 'text-[#0F2D63]'}`}>
                {userData.credits}
              </span>
              {userData.credits === 0 && (
                <button
                  onClick={handleTopUp}
                  className="text-xs text-[#C85A32] hover:underline font-medium ml-1"
                >
                  Top Up
                </button>
              )}
            </div>
            {/* Time Display */}
            <div className="flex items-center gap-2.5 bg-[#F9F7F4] border border-gray-100 rounded-xl px-4 py-2">
              <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none mb-0.5">
                  {timezone === "UTC" ? "UTC" : timezone.split("/")[1]?.replace(/_/g, " ")}
                </p>
                <p className="text-sm font-bold text-[#0F2D63] tabular-nums leading-none">
                  {currentTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-[#0F2D63] rounded-2xl overflow-hidden relative">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(at 80% 50%, rgb(200, 90, 50) 0%, transparent 60%)",
            }}
          ></div>
          <div className="relative p-8 lg:p-10 flex flex-col lg:flex-row items-start gap-8">
            <div className="flex-1">
              <span className="inline-block bg-[#C85A32] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                {(userData.plan || 'Free').toUpperCase()} PLAN
              </span>
              <h1 className="text-2xl lg:text-3xl font-['Roboto'] font-bold text-white mb-1.5">
                {greeting}, {userData.name}
              </h1>
              {/* <p className="text-white/60 text-sm mb-2 leading-relaxed">
                {userData.institution || 'Your Institution'} · {userData.position || 'Your Position'}
              </p> */}
              <div className="flex flex-wrap gap-4 mb-4 text-white/50 text-xs">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {userData.email}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Role: {userData.role}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/user/projects/create"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#0F2D63] px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Project
                </Link>
                {userData.credits === 0 && (
                  <button
                    onClick={handleTopUp}
                    className="inline-flex items-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    Top Up Credits
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full lg:w-[340px] shrink-0">
              <Link to="/user/narrative-engine" className="block">
                <div className="bg-white/8 hover:bg-white/14 border border-white/15 rounded-2xl p-4 transition-all cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center">
                      <FileText className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-white/65 text-xs">AI Writing</p>
                  </div>
                  <p className="text-white font-bold text-2xl leading-none mb-1">{stats.totalWritings}</p>
                  <p className="text-white/45 text-xs">Generated</p>
                </div>
              </Link>
              <Link to="/user/voice-calibrator" className="block">
                <div className="bg-white/8 hover:bg-white/14 border border-white/15 rounded-2xl p-4 transition-all cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center">
                      <Mic className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-white/65 text-xs">AI Speech</p>
                  </div>
                  <p className="text-white font-bold text-2xl leading-none mb-1">{stats.totalSpeeches}</p>
                  <p className="text-white/45 text-xs">Recordings</p>
                </div>
              </Link>
              <Link to="/user/projects" className="block">
                <div className="bg-white/8 hover:bg-white/14 border border-white/15 rounded-2xl p-4 transition-all cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-white/65 text-xs">Projects</p>
                  </div>
                  <p className="text-white font-bold text-2xl leading-none mb-1">{stats.totalProjects}</p>
                  <p className="text-white/45 text-xs">
                    {stats.completedProjects} completed
                  </p>
                </div>
              </Link>
              <Link to="/user/workshops" className="block">
                <div className="bg-white/8 hover:bg-white/14 border border-white/15 rounded-2xl p-4 transition-all cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-white/65 text-xs">Workshops</p>
                  </div>
                  <p className="text-white font-bold text-2xl leading-none mb-1">{stats.totalWorkshops}</p>
                  <p className="text-white/45 text-xs">Available</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Active Projects & Workshops */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Active Projects */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#F3EDE6] rounded-xl flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-[#C85A32]" />
                </div>
                <h2 className="font-semibold text-[#0F2D63] text-[15px]">Recent Projects</h2>
              </div>
              <Link
                to="/user/projects"
                className="flex items-center gap-1 text-[#C85A32] text-xs font-semibold"
              >
                View All ({stats.totalProjects})
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-5 space-y-3 max-h-[400px] overflow-y-auto">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <Link
                    key={project._id}
                    to={`/user/projects/${project._id}`}
                    className="block w-full text-left border border-gray-100 rounded-xl p-4 hover:border-[#C85A32]/30 hover:bg-[#FFF8F5] hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#1C1C1C] truncate group-hover:text-[#C85A32] transition-colors">
                          {project.title || 'Untitled Project'}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">{project.type || 'General'}</span>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getPriorityColor(project.priority)}`}>
                            {project.priority || 'medium'}
                          </span>
                        </div>
                      </div>
                      <span className={`ml-3 shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(project.status)} flex items-center gap-1`}>
                        {getStatusIcon(project.status)}
                        {project.status || 'Pending'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400 pt-2.5 border-t border-gray-50">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(project.deadline) || 'No deadline'}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <span>ID: {project.identifier}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No projects yet</p>
                  <Link
                    to="/user/projects/create"
                    className="text-xs text-[#C85A32] font-semibold hover:underline mt-1 inline-block"
                  >
                    Create your first project
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Workshops */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-gray-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-[#F3EDE6] rounded-xl flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-[#C85A32]" />
                </div>
                <h2 className="font-semibold text-[#0F2D63] text-[15px]">Workshops</h2>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="font-bold text-xl text-[#0F2D63]">{upcomingWorkshops.length}</span>
                <span className="text-sm text-gray-400">upcoming sessions</span>
              </div>
              <p className="text-xs text-[#C85A32] font-medium mt-1">
                Professional development programmes
              </p>
            </div>

            <div className="px-5 pt-4 pb-5 max-h-[400px] overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0F2D63]" />
                  <h3 className="font-semibold text-sm text-[#0F2D63]">Upcoming Workshops</h3>
                </div>
                <Link
                  to="/user/workshops"
                  className="text-xs text-[#C85A32] font-semibold"
                >
                  View All ({stats.totalWorkshops})
                </Link>
              </div>

              {upcomingWorkshops.length > 0 ? (
                upcomingWorkshops.map((workshop) => (
                  <div
                    key={workshop._id}
                    className="border border-gray-100 rounded-xl p-3 mb-2 hover:bg-[#F9F7F4] transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="font-semibold text-xs text-[#1C1C1C]">
                          {getServiceTypeLabel(workshop.serviceType)}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {workshop.firstName} {workshop.lastName}
                        </p>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(workshop.status)} flex items-center gap-1`}>
                        {getStatusIcon(workshop.status)}
                        {workshop.status || 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(workshop.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {workshop.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {workshop.participants} participants
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No upcoming workshops</p>
                  <Link
                    to="/user/workshops/create"
                    className="text-xs text-[#C85A32] font-semibold hover:underline mt-1 inline-block"
                  >
                    Book a workshop
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;