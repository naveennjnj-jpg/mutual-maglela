// pages/user/Quotes.tsx
import React, { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  CircleCheck,
  Eye,
  CircleAlert,
  Loader2,
  X,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface Quote {
  _id: string;
  number: string;
  type: "Workshop" | "Project" | "AI Writing" | "AI Speech" | "Consulting";
  status: "Pending Review" | "Approved" | "Declined" | "Expired" | "sent" | "accepted" | "rejected";
  description: string;
  issuedDate: string;
  validUntil: string;
  approvedDate?: string;
  amount: number;
  isExpiringSoon?: boolean;
  rawData?: any;
}

interface ApiQuote {
  _id: string;
  quoteNumber: string;
  clientInfo: {
    clientName: string;
    organisation?: string;
    email: string;
  };
  quoteDate: string;
  validUntil: string;
  grandTotal: number;
  subtotal: number;
  taxTotal: number;
  status: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    lineTotal: number;
    serviceType?: string;
    taxRate?: number;
    taxAmount?: number;
    discount?: number;
  }>;
  additionalNotes?: string;
  currency?: string;
  sentAt?: string;
  acceptedAt?: string | null;
  rejectedAt?: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Quotes = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch quotes on mount
  useEffect(() => {
    if (user?.email) {
      fetchQuotes();
    }
  }, [user]);

  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view quotes");
        setLoading(false);
        return;
      }

      if (!user?.email) {
        setError("User email not found");
        setLoading(false);
        return;
      }

      // Fetch quotes by user email
      const response = await axios.get(`${API_BASE_URL}/api/user/quotes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Check if data is an array or single object
        let quotesData = [];
        if (Array.isArray(response.data.data)) {
          quotesData = response.data.data;
        } else if (response.data.data) {
          // If it's a single object, convert to array
          quotesData = [response.data.data];
        }

        const transformedQuotes = quotesData.map((quote: ApiQuote) => {
          const statusMap: Record<string, string> = {
            draft: "Pending Review",
            sent: "Pending Review",
            viewed: "Pending Review",
            accepted: "Approved",
            rejected: "Declined",
            expired: "Expired",
            invoiced: "Approved",
          };

          const status = statusMap[quote.status] || "Pending Review";

          // Check if expiring soon (within 7 days)
          const validUntil = new Date(quote.validUntil);
          const today = new Date();
          const daysDiff = Math.ceil((validUntil.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          const isExpiringSoon = daysDiff <= 7 && daysDiff >= 0 && status === "Pending Review";

          // Determine type from items or service type
          let type: "Workshop" | "Project" | "AI Writing" | "AI Speech" | "Consulting" = "Project";
          if (quote.items && quote.items.length > 0) {
            const serviceType = quote.items[0]?.serviceType || "";
            if (serviceType.includes("Workshop")) type = "Workshop";
            else if (serviceType.includes("Speech")) type = "AI Speech";
            else if (serviceType.includes("Writing")) type = "AI Writing";
            else if (serviceType.includes("Consulting")) type = "Consulting";
          }

          return {
            _id: quote._id,
            number: quote.quoteNumber,
            type: type,
            status: status as any,
            description: quote.items?.[0]?.description || quote.additionalNotes || "Quote",
            issuedDate: new Date(quote.quoteDate).toLocaleDateString("en-ZA", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            validUntil: new Date(quote.validUntil).toLocaleDateString("en-ZA", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            approvedDate: quote.status === "accepted" ? new Date().toLocaleDateString("en-ZA", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }) : undefined,
            amount: quote.grandTotal || 0,
            isExpiringSoon: isExpiringSoon,
            rawData: quote,
          };
        });

        setQuotes(transformedQuotes);
      } else {
        setError(response.data.message || "Failed to fetch quotes");
        toast.error(response.data.message || "Failed to fetch quotes");
      }
    } catch (error: any) {
      console.error("Error fetching quotes:", error);
      setError(error.response?.data?.message || "Failed to fetch quotes");
      toast.error(error.response?.data?.message || "Failed to fetch quotes");
    } finally {
      setLoading(false);
    }
  };

  const filters = ["All", "Pending", "Approved", "Declined", "Expired"];

  const getStatusCount = (status: string) => {
    if (status === "All") return quotes.length;
    if (status === "Pending") {
      return quotes.filter((q) => q.status === "Pending Review" || q.status === "sent").length;
    }
    return quotes.filter((q) => q.status === status).length;
  };

  const getFilteredQuotes = () => {
    if (activeFilter === "All") return quotes;
    if (activeFilter === "Pending") {
      return quotes.filter((q) => q.status === "Pending Review" || q.status === "sent");
    }
    return quotes.filter((q) => q.status === activeFilter);
  };

  const filteredQuotes = getFilteredQuotes();

  const getStatusBadge = (status: Quote["status"]) => {
    const config: Record<string, {
      bg: string;
      text: string;
      border: string;
      icon: React.ReactNode;
    }> = {
      "Pending Review": {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-100",
        icon: <Clock className="w-2.5 h-2.5" />,
      },
      "sent": {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-100",
        icon: <Clock className="w-2.5 h-2.5" />,
      },
      "Approved": {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-100",
        icon: <CircleCheck className="w-2.5 h-2.5" />,
      },
      "accepted": {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-100",
        icon: <CircleCheck className="w-2.5 h-2.5" />,
      },
      "Declined": {
        bg: "bg-red-50",
        text: "text-red-600",
        border: "border-red-100",
        icon: <CircleAlert className="w-2.5 h-2.5" />,
      },
      "rejected": {
        bg: "bg-red-50",
        text: "text-red-600",
        border: "border-red-100",
        icon: <CircleAlert className="w-2.5 h-2.5" />,
      },
      "Expired": {
        bg: "bg-gray-50",
        text: "text-gray-500",
        border: "border-gray-200",
        icon: <Clock className="w-2.5 h-2.5" />,
      },
    };
    return config[status] || config["Pending Review"];
  };

  const handleApprove = async (quoteId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to approve quotes");
        return;
      }

      const response = await axios.patch(
        `${API_BASE_URL}/api/admin/quotes/${quoteId}/status`,
        { status: "accepted" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Quote approved successfully");
        setIsModalOpen(false);
        setSelectedQuote(null);
        await fetchQuotes(); // Refresh the list
      } else {
        toast.error(response.data.message || "Failed to approve quote");
      }
    } catch (error: any) {
      console.error("Error approving quote:", error);
      toast.error(error.response?.data?.message || "Failed to approve quote");
    }
  };

  const handleReview = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  // Quote Detail Modal Component
  const QuoteDetailModal = () => {
    if (!selectedQuote || !selectedQuote.rawData) return null;

    const quoteData = selectedQuote.rawData;
    const statusBadge = getStatusBadge(selectedQuote.status);
    const isPending = selectedQuote.status === "Pending Review" || selectedQuote.status === "sent";

    // Format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: quoteData.currency || "ZAR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-100">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                Quote Details
              </p>
              <h3 className="font-bold text-[#0F2D63] text-lg">
                {selectedQuote.number}
              </h3>
              <p className="text-sm text-gray-400">
                {quoteData.clientInfo?.organisation || quoteData.clientInfo?.clientName || "Client"}
              </p>
            </div>
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedQuote(null);
              }}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Status and Valid Until */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
              >
                {statusBadge.icon}
                {selectedQuote.status === "sent" ? "Pending Review" : selectedQuote.status}
              </span>
              <span className="text-xs text-gray-400">
                Valid until {selectedQuote.validUntil}
              </span>
            </div>

            {/* Services */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                Services
              </p>
              <div className="space-y-2">
                {quoteData.items && quoteData.items.length > 0 ? (
                  quoteData.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start justify-between gap-3 p-3 bg-[#f9fafb] rounded-xl border border-gray-100"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0F2D63]">
                          {item.serviceType || "Service"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-[#0F2D63] flex-shrink-0">
                        {formatCurrency(item.lineTotal)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No services listed</p>
                )}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-medium text-[#0F2D63]">
                  {formatCurrency(quoteData.subtotal || 0)}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>VAT (15%)</span>
                <span className="font-medium text-[#0F2D63]">
                  {formatCurrency(quoteData.taxTotal || 0)}
                </span>
              </div>
              {quoteData.discountTotal && quoteData.discountTotal > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Discount</span>
                  <span className="font-medium text-red-500">
                    -{formatCurrency(quoteData.discountTotal)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2">
                <span className="text-[#0F2D63]">Total</span>
                <span className="text-[#C85A32]">
                  {formatCurrency(quoteData.grandTotal || 0)}
                </span>
              </div>
            </div>

            {/* Notes */}
            {quoteData.additionalNotes && (
              <div className="bg-[#f4f6fb] rounded-xl p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Notes from Magalela
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {quoteData.additionalNotes}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {isPending && (
                <button
                  onClick={() => handleApprove(selectedQuote._id)}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <CircleCheck className="w-4 h-4" />
                  Approve This Quote
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin" />
          <p className="text-sm text-gray-500">Loading quotes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8 max-w-md text-center">
          <CircleAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[#0F2D63] mb-2">Error Loading Quotes</h3>
          <p className="text-sm text-gray-500">{error}</p>
          <button
            onClick={fetchQuotes}
            className="mt-4 px-6 py-2 bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4] p-6 space-y-5">
      {/* Header */}
      <div>
        <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-1">
          Quotes
        </p>
        <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63]">
          Quote Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Review quotations from Magalela Media for your projects and workshops
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm flex-wrap">
        {filters.map((filter) => {
          const isActive = activeFilter === filter;
          const count = getStatusCount(filter);
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 min-w-[70px] flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                isActive
                  ? "bg-[#0F2D63] text-white shadow-sm"
                  : "text-gray-500 hover:text-[#0F2D63]"
              }`}
            >
              {filter}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quote List */}
      <div className="space-y-3">
        {filteredQuotes.map((quote) => {
          const statusBadge = getStatusBadge(quote.status);
          const isPending = quote.status === "Pending Review" || quote.status === "sent";
          const isExpiringSoon = quote.isExpiringSoon;

          return (
            <div
              key={quote._id}
              className={`bg-white rounded-2xl border shadow-sm p-5 ${
                isExpiringSoon && isPending ? "border-amber-100" : "border-gray-100"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Icon */}
                <div className="w-10 h-10 bg-[#f4f6fb] rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-[18px] h-[18px] text-[#0F2D63]" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-bold text-[#0F2D63] text-sm">
                      {quote.number}
                    </p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f4f6fb] text-gray-500">
                      {quote.type}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                    >
                      {statusBadge.icon}
                      {quote.status === "sent" ? "Pending Review" : quote.status}
                    </span>
                    {isExpiringSoon && isPending && (
                      <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                        Expiring soon
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    {quote.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    <span>Issued {quote.issuedDate}</span>
                    <span
                      className={
                        isExpiringSoon && isPending ? "text-red-500 font-semibold" : ""
                      }
                    >
                      Valid until {quote.validUntil}
                    </span>
                    {quote.approvedDate && (
                      <span className="text-emerald-600">
                        Approved {quote.approvedDate}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="text-lg font-bold text-[#0F2D63]">
                      R {quote.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => handleReview(quote)}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      Review
                    </button>
                    {isPending && (
                      <button
                        onClick={() => handleApprove(quote._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-colors"
                      >
                        <CircleCheck className="w-3 h-3" />
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredQuotes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No quotes found</p>
            <p className="text-xs text-gray-400 mt-1">
              {activeFilter !== "All" ? `No ${activeFilter.toLowerCase()} quotes available` : "You don't have any quotes yet"}
            </p>
          </div>
        )}
      </div>

      {/* Quote Detail Modal */}
      {isModalOpen && <QuoteDetailModal />}
    </div>
  );
};

export default Quotes;