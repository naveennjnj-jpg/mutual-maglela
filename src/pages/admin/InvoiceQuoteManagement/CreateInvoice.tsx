// pages/admin/CreateInvoice.tsx
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Send,
  Trash2,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface InvoiceItem {
  id: string;
  serviceType: string;
  description: string;
  quantity: number;
  rate: number;
  lineTotal: number;
}

interface InvoiceFormData {
  clientId: string;
  clientName: string;
  organisation: string;
  email: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  paymentTerms: string;
  notes: string;
  items: InvoiceItem[];
}

interface User {
  _id: string;
  name: string;
  email: string;
  organisation?: string;
  company?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [formData, setFormData] = useState<InvoiceFormData>({
    clientId: "",
    clientName: "",
    organisation: "",
    email: "",
    invoiceNumber: `INV-${Math.floor(Math.random() * 900000) + 100000}`,
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    currency: "ZAR (R)",
    paymentTerms: "Net 30",
    notes: "",
    items: [
      {
        id: "1",
        serviceType: "AI Writing",
        description: "",
        quantity: 1,
        rate: 0,
        lineTotal: 0,
      },
    ],
  });

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Clear messages after 5 seconds
  React.useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = e.target.value;
    const selectedUser = users.find((u) => u._id === selectedUserId);

    if (selectedUser) {
      setFormData((prev) => ({
        ...prev,
        clientId: selectedUser._id,
        clientName: selectedUser.name,
        email: selectedUser.email,
        organisation: selectedUser.organisation || selectedUser.company || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        clientId: "",
        clientName: "",
        email: "",
        organisation: "",
      }));
    }
  };

  const handleItemChange = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "rate") {
            updatedItem.lineTotal = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  const addItem = () => {
    const newId = String(Date.now());
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: newId,
          serviceType: "AI Writing",
          description: "",
          quantity: 1,
          rate: 0,
          lineTotal: 0,
        },
      ],
    }));
  };

  const removeItem = (id: string) => {
    if (formData.items.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.lineTotal, 0);
  };

  const calculateVAT = () => {
    return calculateSubtotal() * 0.15;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT();
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const validateForm = (): boolean => {
    if (!formData.clientName.trim()) {
      setError("Client name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email address is required");
      return false;
    }
    if (!formData.dueDate) {
      setError("Due date is required");
      return false;
    }
    if (formData.items.length === 0) {
      setError("At least one line item is required");
      return false;
    }
    const hasEmptyItem = formData.items.some(item => !item.description.trim());
    if (hasEmptyItem) {
      setError("All items must have a description");
      return false;
    }
    return true;
  };

  const handleSend = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in");
        return;
      }

      const payload = {
        clientInfo: {
          clientName: formData.clientName.trim(),
          organisation: formData.organisation.trim() || "",
          email: formData.email.trim(),
        },
        issueDate: new Date(formData.issueDate).toISOString(),
        dueDate: new Date(formData.dueDate).toISOString(),
        currency: formData.currency,
        paymentTerms: formData.paymentTerms,
        items: formData.items.map((item) => ({
          serviceType: item.serviceType,
          description: item.description.trim(),
          quantity: item.quantity,
          rate: item.rate,
        })),
        additionalNotes: formData.notes.trim() || "",
        createdBy: (user as any)?.id || "system",
        createdByEmail: (user as any)?.email || "system@magalela.com",
        status: "sent",
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/admin/invoices`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message || "Invoice sent successfully");
        setTimeout(() => {
          navigate("/admin/invoices");
        }, 2000);
      } else {
        setError(response.data.message || "Failed to send invoice");
      }
    } catch (error: any) {
      console.error("Error sending invoice:", error);
      setError(error.response?.data?.message || "Failed to send invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.clientName.trim()) {
      setError("Client name is required");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email address is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in");
        return;
      }

      const payload = {
        clientInfo: {
          clientName: formData.clientName.trim(),
          organisation: formData.organisation.trim() || "",
          email: formData.email.trim(),
        },
        issueDate: new Date(formData.issueDate).toISOString(),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        currency: formData.currency,
        paymentTerms: formData.paymentTerms,
        items: formData.items.map((item) => ({
          serviceType: item.serviceType,
          description: item.description.trim(),
          quantity: item.quantity,
          rate: item.rate,
        })),
        additionalNotes: formData.notes.trim() || "",
        createdBy: (user as any)?.id || "system",
        createdByEmail: (user as any)?.email || "system@magalela.com",
        status: "draft",
      };

      const response = await axios.post(
        `${API_BASE_URL}/admin/invoices/draft`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message || "Invoice saved as draft");
        setTimeout(() => {
          navigate("/admin/invoices");
        }, 1500);
      } else {
        setError(response.data.message || "Failed to save draft");
      }
    } catch (error: any) {
      console.error("Error saving draft:", error);
      setError(error.response?.data?.message || "Failed to save draft");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/admin/invoices");
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
        <button
          onClick={handleBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#C85A32]">
            Invoicing
          </p>
          <h1 className="text-base font-bold text-[#0F2D63] leading-tight">
            Create Invoice
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            Save as Draft
          </button>
          <button
            onClick={handleSend}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-[#C85A32] text-white text-sm font-semibold rounded-xl hover:bg-[#a8472a] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            {isSubmitting ? "Processing..." : "Send Invoice"}
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="max-w-[1200px] mx-auto px-6 pt-4">
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
            <button onClick={() => setSuccess(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-[1200px] mx-auto px-6 pt-4">
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Form - 2 columns */}
        <div className="lg:col-span-2 space-y-5">
          {/* Invoice Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <p className="text-sm font-bold text-[#0F2D63] border-b border-gray-50 pb-3">
              Invoice Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Client *
                </label>
                <select
                  value={formData.clientId}
                  onChange={handleClientSelect}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white appearance-none"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    paddingRight: "40px",
                  }}
                >
                  <option value="">Select a client…</option>
                  {loadingUsers ? (
                    <option value="" disabled>Loading users...</option>
                  ) : (
                    users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} - {user.email}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Invoice Number
                </label>
                <input
                  type="text"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Issue Date
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white cursor-pointer"
                >
                  <option value="ZAR (R)">ZAR (R)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="GBP (£)">GBP (£)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="NGN (₦)">NGN (₦)</option>
                  <option value="GHS (₵)">GHS (₵)</option>
                  <option value="KES (KSh)">KES (KSh)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Payment Terms
                </label>
                <select
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white cursor-pointer"
                >
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Net 7">Net 7</option>
                  <option value="Net 14">Net 14</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>
          </div>

          {/* Service & Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <p className="text-sm font-bold text-[#0F2D63] border-b border-gray-50 pb-3">
              Service & Items
            </p>
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-sm border border-gray-200 overflow-hidden shadow-sm"
                >
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#fff8f5] border-b border-gray-200">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Item {index + 1}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={formData.items.length <= 1}
                      className="flex items-center gap-1 text-[11px] font-medium text-gray-300 hover:text-red-500 transition-colors disabled:opacity-20"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                  <div className="p-4 space-y-4 bg-white">
                    <div className="border border-gray-200 rounded-sm overflow-hidden">
                      <div className="border-b border-gray-200">
                        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 pt-2.5 pb-1">
                          Service Type
                        </label>
                        <select
                          value={item.serviceType}
                          onChange={(e) =>
                            handleItemChange(item.id, "serviceType", e.target.value)
                          }
                          className="w-full border-0 px-3 pb-2.5 text-sm font-semibold text-[#0F2D63] bg-white focus:outline-none cursor-pointer appearance-none"
                          style={{
                            backgroundImage:
                              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 12px center",
                          }}
                        >
                          <option value="AI Writing">AI Writing</option>
                          <option value="AI Speech">AI Speech</option>
                          <option value="Content Strategy">Content Strategy</option>
                          <option value="Workshop Facilitation">
                            Workshop Facilitation
                          </option>
                          <option value="Coaching Session">Coaching Session</option>
                          <option value="Custom Development">
                            Custom Development
                          </option>
                          <option value="Consulting Services">
                            Consulting Services
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 pt-2.5 pb-1">
                          Description
                        </label>
                        <textarea
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(item.id, "description", e.target.value)
                          }
                          placeholder="Describe the service in detail — scope of work, deliverables, timeline, and any relevant context that will appear on the invoice…"
                          rows={6}
                          className="w-full border-0 px-3 pb-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "quantity",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm text-center bg-white focus:outline-none focus:border-[#C85A32]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                          Rate (R)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none">
                            R
                          </span>
                          <input
                            type="number"
                            min="0"
                            placeholder="0.00"
                            value={item.rate || ""}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "rate",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full border border-gray-200 rounded-sm pl-7 pr-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#C85A32]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                          Line Total
                        </label>
                        <div className="border border-[#f5c9b8] bg-[#fff4f0] rounded-sm px-3 py-2.5 text-sm font-bold text-[#C85A32] text-right tabular-nums h-[42px] flex items-center justify-end">
                          R {formatCurrency(item.lineTotal)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addItem}
                className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-sm text-sm font-semibold text-gray-400 hover:border-[#C85A32] hover:text-[#C85A32] hover:bg-[#fff4f0]/50 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Another Item
              </button>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <p className="text-sm font-bold text-[#0F2D63] border-b border-gray-50 pb-3">
              Additional Notes
            </p>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                placeholder="Payment instructions, bank details, or any other notes for this invoice…"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-4">
          {/* Invoice Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <p className="text-sm font-bold text-[#0F2D63] border-b border-gray-50 pb-3">
              Invoice Summary
            </p>
            <div className="space-y-1.5 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Invoice No.</span>
                <span className="font-mono font-semibold text-[#0F2D63]">
                  {formData.invoiceNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Terms</span>
                <span className="font-semibold text-[#0F2D63]">
                  {formData.paymentTerms}
                </span>
              </div>
            </div>
            <div className="space-y-2.5 text-sm border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-[#0F2D63]">
                  R {formatCurrency(calculateSubtotal())}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">VAT (15%)</span>
                <span className="font-semibold text-[#0F2D63]">
                  R {formatCurrency(calculateVAT())}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-2.5 flex justify-between">
                <span className="font-bold text-[#0F2D63]">Total Due</span>
                <span className="font-bold text-lg text-[#C85A32]">
                  R {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>
            <div className="space-y-2 pt-1">
              <button
                onClick={handleSend}
                disabled={isSubmitting}
                className="w-full py-3 bg-[#C85A32] text-white text-sm font-semibold rounded-xl hover:bg-[#a8472a] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Send Invoice
              </button>
              <button
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="w-full py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                Save as Draft
              </button>
            </div>
          </div>

          {/* Line Items Count */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">Line Items</span>
            <span className="font-bold text-[#0F2D63]">{formData.items.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;