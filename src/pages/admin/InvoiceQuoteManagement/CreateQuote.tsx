// pages/admin/CreateQuote.tsx
import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  Send,
  Trash2,
  Plus,
  Lightbulb,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuoteItem {
  id: string;
  serviceType: string;
  description: string;
  quantity: number;
  rate: number;
  lineTotal: number;
}

interface QuoteFormData {
  clientName: string;
  organisation: string;
  email: string;
  validUntil: string;
  notes: string;
  items: QuoteItem[];
}

const CreateQuote = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<QuoteFormData>({
    clientName: "",
    organisation: "",
    email: "",
    validUntil: "",
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (
    id: string,
    field: keyof QuoteItem,
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

  const handleSend = () => {
    console.log("Sending quote:", formData);
    navigate("/admin/invoices");
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", formData);
    navigate("/admin/invoices");
  };

  const handleBack = () => {
    navigate("/admin/invoices");
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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
            Create Quote
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save as Draft
          </button>
          <button
            onClick={handleSend}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            Send Quote
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Form - 2 columns */}
        <div className="lg:col-span-2 space-y-5">
          {/* Client Information */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <p className="text-sm font-bold text-[#0F2D63] border-b border-gray-50 pb-3">
              Client Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Client Name *
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  placeholder="e.g. Ronald Sithole"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Organisation
                </label>
                <input
                  type="text"
                  name="organisation"
                  value={formData.organisation}
                  onChange={handleInputChange}
                  placeholder="e.g. Wits University"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="client@domain.com"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Valid Until
                </label>
                <input
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white"
                />
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
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#f4f6fb] border-b border-gray-200">
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
                          placeholder="Describe the service in detail — scope of work, deliverables, timeline, and any relevant context that will appear on the quote…"
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
                          className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm text-center bg-white focus:outline-none focus:border-[#0F2D63]"
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
                            className="w-full border border-gray-200 rounded-sm pl-7 pr-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#0F2D63]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                          Line Total
                        </label>
                        <div className="border border-[#c7d2f5] bg-[#eef1fd] rounded-sm px-3 py-2.5 text-sm font-bold text-[#0F2D63] text-right tabular-nums h-[42px] flex items-center justify-end">
                          R {formatCurrency(item.lineTotal)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addItem}
                className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-sm text-sm font-semibold text-gray-400 hover:border-[#0F2D63] hover:text-[#0F2D63] hover:bg-[#f0f3ff]/50 transition-all"
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
                placeholder="Any additional terms, conditions, or context for this quote…"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-4">
          {/* Quote Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <p className="text-sm font-bold text-[#0F2D63] border-b border-gray-50 pb-3">
              Quote Summary
            </p>
            <div className="space-y-2.5 text-sm">
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
                <span className="font-bold text-[#0F2D63]">Total</span>
                <span className="font-bold text-lg text-[#C85A32]">
                  R {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>
            <div className="space-y-2 pt-1">
              <button
                onClick={handleSend}
                className="w-full py-3 bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Send Quote
              </button>
              <button
                onClick={handleSaveDraft}
                className="w-full py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                Save as Draft
              </button>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-[#C85A32]" />
              <p className="text-sm font-bold text-[#0F2D63]">Quick Tips</p>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C85A32] flex-shrink-0 mt-1.5" />
                <div>
                  <p className="text-xs font-semibold text-[#0F2D63]">
                    Set a clear validity date
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed mt-0.5">
                    Quotes typically expire in 14–30 days. A clear deadline
                    encourages faster decisions.
                  </p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C85A32] flex-shrink-0 mt-1.5" />
                <div>
                  <p className="text-xs font-semibold text-[#0F2D63]">
                    Itemise every service
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed mt-0.5">
                    Detailed line items build trust and reduce back-and-forth
                    negotiation.
                  </p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C85A32] flex-shrink-0 mt-1.5" />
                <div>
                  <p className="text-xs font-semibold text-[#0F2D63]">
                    Include VAT separately
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed mt-0.5">
                    Always show VAT as a separate line so clients understand the
                    gross vs. net split.
                  </p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C85A32] flex-shrink-0 mt-1.5" />
                <div>
                  <p className="text-xs font-semibold text-[#0F2D63]">
                    Follow up after sending
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed mt-0.5">
                    A short follow-up call 2–3 days after sending a quote can
                    double conversion rates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuote;