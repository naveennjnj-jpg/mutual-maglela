// pages/admin/Users.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Monitor, UserCheck, Funnel, Ellipsis,
  Calendar, AlertCircle, Loader2, Eye, UserX, Trash2, Plus,
  CheckCircle, XCircle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import UserDetailsModal from '@/components/admin/users/UserDetailsModal';
import AddClientModal from '@/components/admin/users/AddClientModal';

// Toast notification component
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
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full animate-slide-in-right`}>
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
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  managedBy: {
    _id: string;
    name: string;
    email: string;
  } | null;
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

  useEffect(() => {
    fetchData();
  }, []);

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

      // Fetch users and clients in parallel
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

    // Search filter
    if (searchTerm) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter (only for users)
    if (activeTab === 'platform' && filterType !== 'all') {
      if (filterType === 'b2c') {
        filteredData = filteredData.filter((u: User) => u.userType === 'professional');
      } else if (filterType === 'b2b') {
        filteredData = filteredData.filter((u: User) => u.userType === 'enterprise');
      } else if (filterType === 'admin') {
        filteredData = filteredData.filter((u: User) => u.userType === 'admin');
      }
    }

    // Status filter
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
    if (item.accountType === 'individual' || item.accountType === 'individual') {
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

  const handleViewDetails = (item: any) => {
    setSelectedUser(item);
    setShowModal(true);
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
      <main className="flex-1">
        {/* Toast Notifications */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <div className="min-h-screen bg-[#F4F6FB] p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#C85A32] mb-1">
                Users
              </p>
              <h1 className="text-2xl font-bold text-[#0F2D63]">All Users</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {stats.platformMembers} platform members · {stats.managedClients} managed clients
              </p>
            </div>
            {isClientsTab && (
              <button
                onClick={() => setShowAddClient(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Client
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm">
            <button
              onClick={() => setActiveTab('platform')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'platform'
                  ? 'bg-[#0F2D63] text-white shadow-sm'
                  : 'text-gray-500 hover:text-[#C85A32]'
              }`}
            >
              <Monitor className={`w-3.5 h-3.5 ${activeTab === 'platform' ? 'text-white' : 'text-gray-400'}`} />
              Platform Members
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === 'platform' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {stats.platformMembers}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'clients'
                  ? 'bg-[#0F2D63] text-white shadow-sm'
                  : 'text-gray-500 hover:text-[#C85A32]'
              }`}
            >
              <UserCheck className={`w-3.5 h-3.5 ${activeTab === 'clients' ? 'text-white' : 'text-[#C85A32]'}`} />
              Managed Clients
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === 'clients' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {stats.managedClients}
              </span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm bg-[#f4f6fb] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F2D63]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Funnel className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-sm bg-[#f4f6fb] border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#0F2D63]"
              >
                <option value="all">All Types</option>
                <option value="b2c">Individual Professional</option>
                <option value="b2b">Institutional / Enterprise</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm bg-[#f4f6fb] border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#0F2D63]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Data Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-fixed">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#f9fafb]">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[28%]">
                      {isClientsTab ? 'Client' : 'User'}
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[22%]">
                      Account Type
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[16%]">
                      {isClientsTab ? 'Projects' : 'Plan'}
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[11%]">
                      {isClientsTab ? 'Lifetime Value' : 'Billing'}
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[10%]">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[9%]">
                      Joined
                    </th>
                    <th className="px-4 py-3 w-[4%] relative">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr key={item._id} className="hover:bg-[#f9fafb] transition-colors relative">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#0F2D63] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {getInitials(item.name)}
                            </div>
                            <div>
                              <p className="font-semibold text-[#0F2D63] text-sm">{item.name}</p>
                              <p className="text-xs text-gray-400">{item.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          {getAccountTypeDisplay(item)}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-semibold text-[#0F2D63]">
                            {isClientsTab 
                              ? item.projects || 0
                              : item.plan || 'Individual Scholar'
                            }
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
                            onClick={() => setOpenDropdown(openDropdown === item._id ? null : item._id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
                          >
                            <Ellipsis className="w-3.5 h-3.5" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {openDropdown === item._id && (
                            <div className="absolute right-8 top-2 z-20 bg-white border border-gray-100 shadow-lg rounded-xl py-1 w-44">
                              <button
                                onClick={() => handleViewDetails(item)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View Details
                              </button>
                              
                              <button
                                onClick={() => handleToggleStatus(item._id, item.isActive, isClientsTab)}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 ${
                                  item.isActive ? 'text-amber-600' : 'text-emerald-600'
                                }`}
                              >
                                <UserX className="w-3.5 h-3.5" />
                                {item.isActive ? 'Suspend' : 'Activate'}
                              </button>
                              
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#0F2D63] mb-2">No {isClientsTab ? 'clients' : 'users'} found</h3>
                        <p className="text-sm text-gray-500">
                          {searchTerm ? `No ${isClientsTab ? 'clients' : 'users'} match "${searchTerm}"` : `No ${isClientsTab ? 'clients' : 'users'} available`}
                        </p>
                        {isClientsTab && (
                          <button
                            onClick={() => setShowAddClient(true)}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Your First Client
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* User Details Modal */}
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
        
        {/* Add Client Modal */}
        <AddClientModal
          isOpen={showAddClient}
          onClose={() => setShowAddClient(false)}
          onClientAdded={handleUserUpdated}
          API_URL={API_URL}
        />
      </main>
    </>
  );
};

export default Users;