// pages/user/Quotes.tsx
import React, { useState } from "react";
import {
  FileText,
  Clock,
  CircleCheck,
  Eye,
  CircleAlert,
} from "lucide-react";

interface Quote {
  id: string;
  number: string;
  type: "Workshop" | "Project";
  status: "Pending Review" | "Approved" | "Declined" | "Expired";
  description: string;
  issuedDate: string;
  validUntil: string;
  approvedDate?: string;
  amount: number;
  isExpiringSoon?: boolean;
}

const Quotes = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const quotes: Quote[] = [
    {
      id: "1",
      number: "QUO-001",
      type: "Workshop",
      status: "Pending Review",
      description: "Science Communication Workshop Package",
      issuedDate: "14 Jun 2026",
      validUntil: "14 Jul 2026",
      amount: 7820,
      isExpiringSoon: true,
    },
    {
      id: "2",
      number: "QUO-002",
      type: "Project",
      status: "Pending Review",
      description: "Higher Education Policy Brief Project",
      issuedDate: "10 Jun 2026",
      validUntil: "10 Jul 2026",
      amount: 9545,
      isExpiringSoon: true,
    },
    {
      id: "3",
      number: "QUO-003",
      type: "Project",
      status: "Approved",
      description: "Executive Speech — Annual Conference Keynote",
      issuedDate: "28 May 2026",
      validUntil: "28 Jun 2026",
      approvedDate: "02 Jun 2026",
      amount: 7130,
      isExpiringSoon: false,
    },
  ];

  const filters = ["All", "Pending", "Approved", "Declined", "Expired"];

  const getStatusCount = (status: string) => {
    if (status === "All") return quotes.length;
    if (status === "Pending") {
      return quotes.filter((q) => q.status === "Pending Review").length;
    }
    return quotes.filter((q) => q.status === status).length;
  };

  const getFilteredQuotes = () => {
    if (activeFilter === "All") return quotes;
    if (activeFilter === "Pending") {
      return quotes.filter((q) => q.status === "Pending Review");
    }
    return quotes.filter((q) => q.status === activeFilter);
  };

  const filteredQuotes = getFilteredQuotes();

  const getStatusBadge = (status: Quote["status"]) => {
    const config = {
      "Pending Review": {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-100",
        icon: <Clock className="w-2.5 h-2.5" />,
      },
      Approved: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-100",
        icon: <CircleCheck className="w-2.5 h-2.5" />,
      },
      Declined: {
        bg: "bg-red-50",
        text: "text-red-600",
        border: "border-red-100",
        icon: <CircleAlert className="w-2.5 h-2.5" />,
      },
      Expired: {
        bg: "bg-gray-50",
        text: "text-gray-500",
        border: "border-gray-200",
        icon: <Clock className="w-2.5 h-2.5" />,
      },
    };
    return config[status] || config["Pending Review"];
  };

  const handleApprove = (quoteId: string) => {
    // Implement approval logic
    console.log(`Approving quote: ${quoteId}`);
  };

  const handleReview = (quoteId: string) => {
    // Implement review navigation logic
    console.log(`Reviewing quote: ${quoteId}`);
  };

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
          const isPending = quote.status === "Pending Review";
          const isApproved = quote.status === "Approved";
          const isExpiringSoon = quote.isExpiringSoon;

          return (
            <div
              key={quote.id}
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
                      {quote.status}
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
                      onClick={() => handleReview(quote.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      Review
                    </button>
                    {isPending && (
                      <button
                        onClick={() => handleApprove(quote.id)}
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
            <p className="text-gray-500 text-sm">No quotes found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quotes;