// pages/user/Projects.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, MessageSquare, CircleCheck, Eye, Send, Calendar,
  AlertCircle, Loader2
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface Project {
  _id: string;
  title: string;
  description: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'in_revision' | 'completed' | 'pending';
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectStats {
  active: number;
  inRevision: number;
  completed: number;
}

const Projects: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'in_revision' | 'completed'>('all');
  const [stats, setStats] = useState<ProjectStats>({ active: 0, inRevision: 0, completed: 0 });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/api/admin/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const projectsData = response.data.data || [];
        setProjects(projectsData);
        
        // Calculate stats
        const statsData = {
          active: projectsData.filter((p: Project) => p.status === 'active').length,
          inRevision: projectsData.filter((p: Project) => p.status === 'in_revision').length,
          completed: projectsData.filter((p: Project) => p.status === 'completed').length,
        };
        setStats(statsData);
      }
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProjects = () => {
    if (activeFilter === 'all') return projects;
    return projects.filter(p => p.status === activeFilter);
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-blue-50 text-blue-600 border-blue-100',
      medium: 'bg-amber-50 text-amber-600 border-amber-100',
      high: 'bg-red-50 text-red-500 border-red-100'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-50 text-green-700 border-green-100',
      in_revision: 'bg-yellow-50 text-yellow-700 border-yellow-100',
      completed: 'bg-blue-50 text-blue-700 border-blue-100',
      pending: 'bg-gray-50 text-gray-600 border-gray-100'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      active: <Clock className="w-3.5 h-3.5" />,
      in_revision: <MessageSquare className="w-3.5 h-3.5" />,
      completed: <CircleCheck className="w-3.5 h-3.5" />,
      pending: <Clock className="w-3.5 h-3.5" />
    };
    return icons[status as keyof typeof icons] || icons.pending;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading projects...</p>
        </div>
      </div>
    );
  }

  const filteredProjects = getFilteredProjects();

  return (
    <main className="flex-1">
      <div className="min-h-screen bg-[#F4F6FB] p-6 space-y-5">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C85A32] mb-1">
            Operations
          </p>
          <h1 className="text-2xl font-bold text-[#0F2D63]">Manage Projects</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Handle project requests, submit work, and track revisions
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              activeFilter === 'all'
                ? 'bg-[#0F2D63] text-white border-[#0F2D63]'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            All
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              activeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {projects.length}
            </span>
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              activeFilter === 'active'
                ? 'bg-[#0F2D63] text-white border-[#0F2D63]'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Active
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              activeFilter === 'active' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {stats.active}
            </span>
          </button>
          <button
            onClick={() => setActiveFilter('in_revision')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              activeFilter === 'in_revision'
                ? 'bg-[#0F2D63] text-white border-[#0F2D63]'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            In Revision
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              activeFilter === 'in_revision' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {stats.inRevision}
            </span>
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              activeFilter === 'completed'
                ? 'bg-[#0F2D63] text-white border-[#0F2D63]'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <CircleCheck className="w-3.5 h-3.5" />
            Completed
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              activeFilter === 'completed' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {stats.completed}
            </span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col"
              >
                <div className={`h-1 ${
                  project.status === 'completed' ? 'bg-blue-400' :
                  project.status === 'in_revision' ? 'bg-yellow-400' :
                  'bg-green-400'
                }`}></div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium truncate">
                      {project.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#0F2D63] text-sm leading-snug mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3 flex-1">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#0F2D63] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                        {getInitials(project.assignedTo?.name || 'User')}
                      </div>
                      <span className="text-xs text-gray-600 font-medium truncate max-w-[100px]">
                        {project.assignedTo?.name || 'Unassigned'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {formatDate(project.deadline || project.createdAt)}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-gray-50 mt-auto">
                    <button
                      onClick={() => navigate(`/admin/projects/${project._id}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                    {project.status !== 'completed' && (
                      <button
                        onClick={() => navigate(`/admin/projects/${project._id}/submit`)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#0F2D63] hover:bg-[#0a2050] text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F2D63] mb-2">No projects found</h3>
              <p className="text-sm text-gray-500">
                {activeFilter === 'all' ? 'No projects available' : `No ${activeFilter} projects`}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Projects;