import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Monitor, UserCheck, Funnel, Ellipsis,
  Calendar, AlertCircle, Loader2, Eye, UserX, Trash2, Plus,
  CheckCircle, XCircle, Coins, Ban, TrendingUp
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import UserDetailsModal from '@/components/admin/users/UserDetailsModal';
import AddClientModal from '@/components/admin/users/AddClientModal';
import CreditHistoryModal from '../users/CreditHistoryModal';

const Toast: React.FC<{
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 left-4 sm:left-auto z-50 max-w-sm w-full sm:w-auto animate-slide-in-right`}>
      <div className={`rounded-xl shadow-lg border p-4 ${
        type === 'success'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-red-50 border-red-200 text-red-800'
      }`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 -mt-1 -mr-1 p-1 hover:bg-gray-200/50 rounded-lg transition-colors"
          >
            <XCircle className="w-4 h-4 opacity-50 hover:opacity-100" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface User {
  _id: string;
  name: string;
  email: string;
  accountType: 'individual' | 'institutional';
  userType?: 'professional' | 'enterprise' | 'admin';
  plan: string;
  planType?: string;
  billing: 'monthly' | 'yearly';
  isActive: boolean;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  jobtitle?: string;
  organisation?: string;
  bio?: string;
  phoneNumber?: string;
  address?: string;
  credits?: number;
  creditsUsed?: number;
  creditsBlocked?: boolean;
  profileType?: string;
  primaryGoal?: string;
}

interface Client {
  _id: string;
  name: string;
  email: string;
  accountType: 'institutional';
  userType: 'enterprise';
  isActive: boolean;
  projects: number;
  lifetimeValue: number;
  retainerType: string | null;
  notes: string | null;
  createdBy: { _id: string; name: string; email: string; };
  managedBy: { _id: string; name: string; email: string; } | null;
  createdAt: string;
  updatedAt: string;
}

interface UserStats {
  total: number;
  platformMembers: number;
  managedClients: number;
}

const Users: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'platform' | 'clients'>('platform');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    platformMembers: 0,
    managedClients: 0
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  
  const [showCreditHistory, setShowCreditHistory] = useState(false);
  const [creditHistoryUser, setCreditHistoryUser] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        showToast('Authentication required. Please login again.', 'error');
        setLoading(false);
        return;
      }

      const [usersResponse, clientsResponse] = await Promise.all([
        axios.get(`${API_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/api/admin/clients`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const usersData = usersResponse.data.data || [];
      const clientsData = clientsResponse.data.data || [];

      setUsers(usersData);
      setClients(clientsData);

      const statsData = {
        total: usersData.length + clientsData.length,
        platformMembers: usersData.filter((u: User) => u.accountType === 'individual').length,
        managedClients: clientsData.length,
      };
      setStats(statsData);

      showToast(`Loaded ${usersData.length} users and ${clientsData.length} clients successfully`, 'success');
    } catch (err: any) {
      console.error('Error fetching data:', err);
      const errorMsg = err.response?.data?.message || 'Failed to fetch data';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    let filteredData: any[] = [];

    if (activeTab === 'platform') {
      filteredData = users.filter(u => u.accountType === 'individual');
    } else if (activeTab === 'clients') {
      filteredData = clients;
    }

    if (searchTerm) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeTab === 'platform' && filterType !== 'all') {
      if (filterType === 'b2c') {
        filteredData = filteredData.filter((u: User) => u.userType === 'professional');
      } else if (filterType === 'b2b') {
        filteredData = filteredData.filter((u: User) => u.userType === 'enterprise');
      } else if (filterType === 'admin') {
        filteredData = filteredData.filter((u: User) => u.userType === 'admin');
      }
    }

    if (filterStatus !== 'all') {
      const isActive = filterStatus === 'active';
      filteredData = filteredData.filter((item) => item.isActive === isActive);
    }

    return filteredData;
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getAccountTypeDisplay = (item: any) => {
    if (item.accountType === 'individual') {
      return (
        <div className="inline-flex flex-col px-2.5 py-1 rounded-xl text-[10px] font-bold border leading-tight bg-blue-50 text-blue-700 border-blue-100">
          <span>Individual</span>
          <span>Professional</span>
        </div>
      );
    } else {
      return (
        <div className="inline-flex flex-col px-2.5 py-1 rounded-xl text-[10px] font-bold border leading-tight bg-purple-50 text-purple-700 border-purple-100">
          <span>Institutional</span>
          <span>Enterprise</span>
        </div>
      );
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
      : 'bg-red-50 text-red-600 border-red-100';
  };

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? 'Active' : 'Suspended';
  };

  const getBillingColor = (billing: string) => {
    const colors = {
      monthly: 'bg-blue-50 text-blue-700 border-blue-100',
      yearly: 'bg-purple-50 text-purple-700 border-purple-100'
    };
    return colors[billing as keyof typeof colors] || colors.monthly;
  };

 
  const getCreditsInfo = (userItem: User) => {
    const remaining = userItem.credits ?? 0;
    const used = userItem.creditsUsed ?? 0;
    const hasUsageData =
      userItem.creditsUsed !== undefined && userItem.creditsUsed !== null;
    const total = hasUsageData ? remaining + used : remaining;
    const percentage =
      total > 0 && hasUsageData ? Math.min(100, Math.round((used / total) * 100)) : 0;

    return {
      remaining,
      used,
      total,
      percentage,
      hasUsageData,
      isHigh: percentage >= 80,
      isBlocked: userItem.creditsBlocked === true,
    };
  };

  const handleViewDetails = (item: any) => {
    setSelectedUser(item);
    setShowModal(true);
    setOpenDropdown(null);
  };


  const handleViewCreditHistory = (item: any) => {
    setCreditHistoryUser({ id: item._id, name: item.name });
    setShowCreditHistory(true);
    setOpenDropdown(null);
  };

  const handleToggleStatus = async (itemId: string, currentStatus: boolean, isClient: boolean = false) => {
    const action = currentStatus ? 'suspend' : 'activate';
    if (!confirm(`Are you sure you want to ${action} this ${isClient ? 'client' : 'user'}?`)) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Authentication required', 'error');
        return;
      }

      const endpoint = isClient ? 'clients' : 'users';
      await axios.patch(
        `${API_URL}/api/admin/${endpoint}/${itemId}`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchData();
      setOpenDropdown(null);
      setShowModal(false);
      showToast(`${isClient ? 'Client' : 'User'} ${!currentStatus ? 'activated' : 'suspended'} successfully`, 'success');
    } catch (err: any) {
      console.error('Error updating status:', err);
      const errorMsg = err.response?.data?.message || 'Failed to update status';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  const handleToggleCreditsBlock = async (
    itemId: string,
    currentBlocked: boolean,
    isClient: boolean = false
  ) => {
    const action = currentBlocked ? 'unblock' : 'block';
    if (
      !confirm(
        `Are you sure you want to ${action} credits usage for this ${
          isClient ? 'client' : 'user'
        }?${
          !currentBlocked
            ? ' They will not be able to generate content or use credits.'
            : ''
        }`
      )
    )
      return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Authentication required', 'error');
        return;
      }

      const endpoint = isClient ? 'clients' : 'users';
      await axios.patch(
        `${API_URL}/api/admin/${endpoint}/${itemId}`,
        { creditsBlocked: !currentBlocked },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchData();
      setOpenDropdown(null);
      setShowModal(false);
      showToast(
        `Credits usage ${!currentBlocked ? 'blocked' : 'unblocked'} successfully`,
        'success'
      );
    } catch (err: any) {
      console.error('Error updating credits block:', err);
      const errorMsg =
        err.response?.data?.message || 'Failed to update credits block';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  const handleDelete = async (itemId: string, isClient: boolean = false) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Authentication required', 'error');
        return;
      }

      const endpoint = isClient ? 'clients' : 'users';
      await axios.delete(
        `${API_URL}/api/admin/${endpoint}/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchData();
      setOpenDropdown(null);
      showToast(`${isClient ? 'Client' : 'User'} deleted successfully`, 'success');
    } catch (err: any) {
      console.error('Error deleting:', err);
      const errorMsg = err.response?.data?.message || 'Failed to delete';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  const handleUserUpdated = () => {
    fetchData();
    showToast('User updated successfully', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  const filteredData = getFilteredData();
  const isClientsTab = activeTab === 'clients';

  return (
    <>
      <main className="flex-1 min-w-0">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <div className="min-h-screen bg-[#F4F6FB] p-3 sm:p-6 space-y-4 sm:space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#C85A32] mb-1">
                Users
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0F2D63]">All Users</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {stats.platformMembers} platform members · {stats.managedClients} managed clients
              </p>
            </div>
            {isClientsTab && (
              <button
                onClick={() => setShowAddClient(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors w-full sm:w-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Client
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm">
            <button
              onClick={() => setActiveTab('platform')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'platform'
                  ? 'bg-[#0F2D63] text-white shadow-sm'
                  : 'text-gray-500 hover:text-[#C85A32]'
              }`}
            >
              <Monitor className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'platform' ? 'text-white' : 'text-gray-400'}`} />
              <span className="whitespace-nowrap">Platform Members</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                activeTab === 'platform' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {stats.platformMembers}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'clients'
                  ? 'bg-[#0F2D63] text-white shadow-sm'
                  : 'text-gray-500 hover:text-[#C85A32]'
              }`}
            >
              <UserCheck className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'clients' ? 'text-white' : 'text-[#C85A32]'}`} />
              <span className="whitespace-nowrap">Managed Clients</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                activeTab === 'clients' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {stats.managedClients}
              </span>
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1 min-w-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm bg-[#f4f6fb] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F2D63]"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <Funnel className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="flex-1 text-sm bg-[#f4f6fb] border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#0F2D63] min-w-0"
                >
                  <option value="all">All Types</option>
                  <option value="b2c">Individual Professional</option>
                  <option value="b2b">Institutional / Enterprise</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm bg-[#f4f6fb] border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#0F2D63] w-full sm:w-auto"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="min-w-0 break-words">{error}</span>
            </div>
          )}

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-visible">
            <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full text-sm table-fixed">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#f9fafb]">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[22%]">
                      {isClientsTab ? 'Client' : 'User'}
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">
                      Account Type
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[11%]">
                      {isClientsTab ? 'Projects' : 'Plan'}
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[10%]">
                      {isClientsTab ? 'Lifetime Value' : 'Billing'}
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[17%]">
                      Credits Usage
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[9%]">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[8%]">
                      Joined
                    </th>
                    <th className="px-4 py-3 w-[8%] relative">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => {
                      const creditsInfo = getCreditsInfo(item as User);
                      return (
                        <tr key={item._id} className="hover:bg-[#f9fafb] transition-colors relative">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-[#0F2D63] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {getInitials(item.name)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-[#0F2D63] text-sm truncate">{item.name}</p>
                                <p className="text-xs text-gray-400 truncate">{item.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            {getAccountTypeDisplay(item)}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-sm font-semibold text-[#0F2D63]">
                              {isClientsTab ? item.projects || 0 : item.plan || 'Individual Scholar'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            {isClientsTab ? (
                              <span className="text-sm font-semibold text-[#0F2D63]">
                                R {item.lifetimeValue || 0}
                              </span>
                            ) : (
                              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${getBillingColor(item.billing)}`}>
                                {item.billing || 'monthly'}
                              </span>
                            )}
                          </td>
                          {/* Credits Usage */}
                          <td className="px-4 py-3.5">
                            {!isClientsTab ? (
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <Coins className="w-3 h-3 text-[#C85A32] shrink-0" />
                                  <span className="text-xs font-semibold text-[#0F2D63] truncate">
                                    {creditsInfo.hasUsageData
                                      ? `${creditsInfo.used.toLocaleString()} / ${creditsInfo.total.toLocaleString()}`
                                      : `${creditsInfo.remaining.toLocaleString()} left`}
                                  </span>
                                  {creditsInfo.isBlocked && (
                                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded shrink-0">
                                      <Ban className="w-2.5 h-2.5" />
                                      BLOCKED
                                    </span>
                                  )}
                                  {creditsInfo.isHigh && !creditsInfo.isBlocked && (
                                    <AlertCircle
                                      className="w-3 h-3 text-amber-500 shrink-0"
                                      title="High usage"
                                    />
                                  )}
                                </div>
                                {creditsInfo.hasUsageData && (
                                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all ${
                                        creditsInfo.isBlocked
                                          ? 'bg-red-500'
                                          : creditsInfo.isHigh
                                          ? 'bg-amber-500'
                                          : 'bg-emerald-500'
                                      }`}
                                      style={{ width: `${creditsInfo.percentage}%` }}
                                    />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusColor(item.isActive)}`}>
                              {getStatusLabel(item.isActive)}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-gray-500">
                            {formatDate(item.createdAt)}
                          </td>
                          <td className="px-4 py-3.5 relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(openDropdown === item._id ? null : item._id);
                              }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
                            >
                              <Ellipsis className="w-3.5 h-3.5" />
                            </button>

                            {openDropdown === item._id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-4 top-11 z-30 bg-white border border-gray-100 shadow-lg rounded-xl py-1 w-48"
                              >
                                <button
                                  onClick={() => handleViewDetails(item)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  View Details
                                </button>

                                {/* 🔥 Credit History */}
                                {!isClientsTab && (
                                  <button
                                    onClick={() => handleViewCreditHistory(item)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#0F2D63] hover:bg-gray-50"
                                  >
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    Credit History
                                  </button>
                                )}

                                <button
                                  onClick={() => handleToggleStatus(item._id, item.isActive, isClientsTab)}
                                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 ${
                                    item.isActive ? 'text-amber-600' : 'text-emerald-600'
                                  }`}
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                  {item.isActive ? 'Suspend' : 'Activate'}
                                </button>

                                {/* Block Credits */}
                                {!isClientsTab && (
                                  <button
                                    onClick={() =>
                                      handleToggleCreditsBlock(
                                        item._id,
                                        creditsInfo.isBlocked,
                                        isClientsTab
                                      )
                                    }
                                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 ${
                                      creditsInfo.isBlocked
                                        ? 'text-emerald-600'
                                        : 'text-orange-600'
                                    }`}
                                  >
                                    <Ban className="w-3.5 h-3.5" />
                                    {creditsInfo.isBlocked
                                      ? 'Unblock Credits'
                                      : 'Block Credits'}
                                  </button>
                                )}

                                <div className="border-t border-gray-100 my-1"></div>

                                <button
                                  onClick={() => handleDelete(item._id, isClientsTab)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete {isClientsTab ? 'Client' : 'User'}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-12">
                        <EmptyState
                          isClientsTab={isClientsTab}
                          searchTerm={searchTerm}
                          onAddClient={() => setShowAddClient(true)}
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-3">
            {filteredData.length > 0 ? (
              filteredData.map((item) => {
                const creditsInfo = getCreditsInfo(item as User);
                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 relative"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0F2D63] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {getInitials(item.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#0F2D63] text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-400 truncate">{item.email}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(openDropdown === item._id ? null : item._id);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 flex-shrink-0"
                      >
                        <Ellipsis className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {getAccountTypeDisplay(item)}
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${getStatusColor(item.isActive)}`}>
                        {getStatusLabel(item.isActive)}
                      </span>
                      {!isClientsTab && (
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${getBillingColor(item.billing)}`}>
                          {item.billing || 'monthly'}
                        </span>
                      )}
                      {!isClientsTab && creditsInfo.isBlocked && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
                          <Ban className="w-2.5 h-2.5" />
                          BLOCKED
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                          {isClientsTab ? 'Projects' : 'Plan'}
                        </p>
                        <p className="text-sm font-semibold text-[#0F2D63] truncate">
                          {isClientsTab ? item.projects || 0 : item.plan || 'Individual Scholar'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                          {isClientsTab ? 'Lifetime Value' : 'Joined'}
                        </p>
                        <p className="text-sm font-semibold text-[#0F2D63] truncate">
                          {isClientsTab ? `R ${item.lifetimeValue || 0}` : formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Credits usage on mobile */}
                    {!isClientsTab && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                            Credits Usage
                          </p>
                          {creditsInfo.isHigh && !creditsInfo.isBlocked && (
                            <span className="text-[10px] font-semibold text-amber-600">
                              High usage
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Coins className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                          <span className="text-sm font-bold text-[#0F2D63]">
                            {creditsInfo.hasUsageData
                              ? `${creditsInfo.used.toLocaleString()} / ${creditsInfo.total.toLocaleString()}`
                              : `${creditsInfo.remaining.toLocaleString()} left`}
                          </span>
                          <span className="text-[11px] text-gray-400 ml-auto">
                            {creditsInfo.hasUsageData ? `${creditsInfo.percentage}%` : '—'}
                          </span>
                        </div>
                        {creditsInfo.hasUsageData && (
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-1.5">
                            <div
                              className={`h-full rounded-full transition-all ${
                                creditsInfo.isBlocked
                                  ? 'bg-red-500'
                                  : creditsInfo.isHigh
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${creditsInfo.percentage}%` }}
                            />
                          </div>
                        )}

                  
                        <button
                          onClick={() => handleViewCreditHistory(item)}
                          className="mt-2.5 w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0F2D63] bg-[#F4F6FB] rounded-lg hover:bg-[#e9edf7] transition-colors"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          View Daily History
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0F2D63] bg-[#F4F6FB] rounded-lg hover:bg-[#e9edf7] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                      <button
                        onClick={() => handleToggleStatus(item._id, item.isActive, isClientsTab)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                          item.isActive
                            ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                            : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      >
                        <UserX className="w-3.5 h-3.5" />
                        {item.isActive ? 'Suspend' : 'Activate'}
                      </button>
                      {!isClientsTab && (
                        <button
                          onClick={() =>
                            handleToggleCreditsBlock(
                              item._id,
                              creditsInfo.isBlocked,
                              isClientsTab
                            )
                          }
                          className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                            creditsInfo.isBlocked
                              ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                              : 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                          }`}
                          aria-label={
                            creditsInfo.isBlocked ? 'Unblock credits' : 'Block credits'
                          }
                          title={
                            creditsInfo.isBlocked ? 'Unblock credits' : 'Block credits'
                          }
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item._id, isClientsTab)}
                        className="flex items-center justify-center w-9 h-9 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                <EmptyState
                  isClientsTab={isClientsTab}
                  searchTerm={searchTerm}
                  onAddClient={() => setShowAddClient(true)}
                />
              </div>
            )}
          </div>
        </div>


        <UserDetailsModal
          user={selectedUser}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onToggleStatus={handleToggleStatus}
          onUserUpdated={handleUserUpdated}
          getInitials={getInitials}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
          getStatusLabel={getStatusLabel}
        />

        <AddClientModal
          isOpen={showAddClient}
          onClose={() => setShowAddClient(false)}
          onClientAdded={handleUserUpdated}
          API_URL={API_URL}
        />

   
        {creditHistoryUser && (
          <CreditHistoryModal
            isOpen={showCreditHistory}
            onClose={() => {
              setShowCreditHistory(false);
              setCreditHistoryUser(null);
            }}
            userId={creditHistoryUser.id}
            userName={creditHistoryUser.name}
            API_URL={API_URL}
          />
        )}
      </main>
    </>
  );
};

const EmptyState: React.FC<{
  isClientsTab: boolean;
  searchTerm: string;
  onAddClient: () => void;
}> = ({ isClientsTab, searchTerm, onAddClient }) => (
  <>
    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
    </div>
    <h3 className="text-base sm:text-lg font-semibold text-[#0F2D63] mb-2">
      No {isClientsTab ? 'clients' : 'users'} found
    </h3>
    <p className="text-sm text-gray-500">
      {searchTerm
        ? `No ${isClientsTab ? 'clients' : 'users'} match "${searchTerm}"`
        : `No ${isClientsTab ? 'clients' : 'users'} available`}
    </p>
    {isClientsTab && (
      <button
        onClick={onAddClient}
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Your First Client
      </button>
    )}
  </>
);

export default Users;