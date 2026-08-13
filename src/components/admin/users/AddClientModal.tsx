// components/admin/AddClientModal.tsx
import React, { useState } from 'react';
import {
  ArrowLeft, Loader2, AlertCircle, User, Mail,
  FolderKanban, TrendingUp, FileText, X
} from 'lucide-react';
import axios from 'axios';

interface ClientFormData {
  name: string;
  email: string;
  projects: number;
  lifetimeValue: number;
  retainerType: string;
  notes: string;
}

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded: () => void;
  API_URL: string;
}

const AddClientModal: React.FC<AddClientModalProps> = ({
  isOpen,
  onClose,
  onClientAdded,
  API_URL,
}) => {
  const [clientForm, setClientForm] = useState<ClientFormData>({
    name: '',
    email: '',
    projects: 0,
    lifetimeValue: 0,
    retainerType: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const retainerTypes = [
    { id: 'monthly-overflow', label: 'Monthly Overflow', description: 'Flexible capacity billed monthly as needed' },
    { id: 'quarterly-overflow', label: 'Quarterly Overflow', description: 'Overflow capacity reviewed every quarter' },
    { id: 'annual-overflow', label: 'Annual Overflow', description: 'Annually committed overflow arrangement' },
    { id: 'project-based', label: 'Project-Based', description: 'Scoped per individual project deliverable' },
    { id: 'fixed-monthly', label: 'Fixed Monthly', description: 'Fixed-scope retainer billed each month' }
  ];

  if (!isOpen) return null;

  const handleAddClient = async () => {
    if (!clientForm.name || !clientForm.email) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/admin/clients`,
        {
          name: clientForm.name,
          email: clientForm.email,
          accountType: 'institutional',
          userType: 'enterprise',
          isActive: true,
          projects: clientForm.projects,
          lifetimeValue: clientForm.lifetimeValue,
          retainerType: clientForm.retainerType,
          notes: clientForm.notes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        onClientAdded();
        onClose();
        setClientForm({
          name: '',
          email: '',
          projects: 0,
          lifetimeValue: 0,
          retainerType: '',
          notes: ''
        });
        setError(null);
      }
    } catch (err: any) {
      console.error('Error adding client:', err);
      setError(err.response?.data?.message || 'Failed to add client');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#C85A32]">Users</p>
            <h1 className="text-base font-bold text-[#0F2D63] leading-tight">Add Managed Client</h1>
          </div>
          <button
            onClick={handleAddClient}
            disabled={isSubmitting || !clientForm.name || !clientForm.email}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Client'}
          </button>
        </div>

        <div className="px-6 py-7 space-y-5">
          {/* Client Information */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#C85A32]" />
              Client Information
            </p>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Client Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Amara Nwosu"
                value={clientForm.name}
                onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="client@organisation.co.za"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white pl-9"
                />
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#C85A32]" />
              Engagement Metrics
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Number of Projects
                </label>
                <div className="relative">
                  <FolderKanban className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={clientForm.projects}
                    onChange={(e) => setClientForm({ ...clientForm, projects: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white pl-9"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Lifetime Value (R)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none">R</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={clientForm.lifetimeValue}
                    onChange={(e) => setClientForm({ ...clientForm, lifetimeValue: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white pl-7"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Retainer Type */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#C85A32]" />
              Retainer Type
            </p>
            <div className="space-y-2">
              {retainerTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setClientForm({ ...clientForm, retainerType: type.id })}
                  className={`w-full flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                    clientForm.retainerType === type.id
                      ? 'border-[#0F2D63] bg-[#0F2D63]/5'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                    clientForm.retainerType === type.id
                      ? 'border-[#0F2D63] bg-[#0F2D63]'
                      : 'border-gray-300'
                  }`}>
                    {clientForm.retainerType === type.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{type.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{type.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#C85A32]" />
              Internal Notes
            </label>
            <textarea
              rows={4}
              placeholder="Any internal context, communication preferences, escalation contacts, or account background…"
              value={clientForm.notes}
              onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white resize-none leading-relaxed"
            />
            <p className="text-[11px] text-gray-400 mt-1.5">Visible to admins only — not shared with the client.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pb-6">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddClient}
              disabled={isSubmitting || !clientForm.name || !clientForm.email}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-[#0F2D63] text-white hover:bg-[#0a2050] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Client'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClientModal;