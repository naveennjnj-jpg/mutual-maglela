// components/admin/UserDetailsModal.tsx
import React from 'react';
import { Mail, Shield, Calendar, X } from 'lucide-react';

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

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleStatus: (userId: string, currentStatus: boolean) => void;
  onUserUpdated: () => void;
  getInitials: (name: string) => string;
  formatDate: (date: string) => string;
  getStatusColor: (isActive: boolean) => string;
  getStatusLabel: (isActive: boolean) => string;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  isOpen,
  onClose,
  onToggleStatus,
  getInitials,
  formatDate,
  getStatusColor,
  getStatusLabel,
}) => {
  if (!user || !isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[#0F2D63] text-lg">User Details</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0F2D63] flex items-center justify-center text-white font-bold text-lg">
            {getInitials(user.name)}
          </div>
          <div>
            <p className="font-bold text-[#0F2D63] text-lg">{user.name}</p>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.isActive)}`}>
              {getStatusLabel(user.isActive)}
            </span>
          </div>
        </div>

        <div className="space-y-2.5 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Email
            </span>
            <span className="font-medium text-[#0F2D63]">{user.email}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Account Type
            </span>
            <span className="font-medium text-[#0F2D63]">
              {user.accountType === 'individual' ? 'Individual Professional' : 'Institutional Enterprise'}
            </span>
          </div>

          {user.jobtitle && (
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Job Title</span>
              <span className="font-medium text-[#0F2D63]">{user.jobtitle}</span>
            </div>
          )}

          {user.organisation && (
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Organisation</span>
              <span className="font-medium text-[#0F2D63]">{user.organisation}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Plan</span>
            <span className="font-medium text-[#0F2D63]">{user.plan || 'Individual Scholar'}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Plan Billing</span>
            <span className="font-medium text-[#0F2D63] capitalize">{user.billing || 'monthly'}</span>
          </div>

          {user.credits !== undefined && (
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Credits</span>
              <span className="font-medium text-[#0F2D63]">{user.credits}</span>
            </div>
          )}

          {user.profileType && (
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Profile Type</span>
              <span className="font-medium text-[#0F2D63]">{user.profileType}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Joined
            </span>
            <span className="font-medium text-[#0F2D63]">{formatDate(user.createdAt)}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          {/* <button
            onClick={() => onToggleStatus(user._id, user.isActive)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
              user.isActive
                ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            {user.isActive ? 'Suspend Account' : 'Activate Account'}
          </button> */}
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm font-medium bg-[#0F2D63] text-white hover:bg-[#0a2050] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;