// pages/user/Invoices.tsx
import React, { useState } from "react";
import {
  FileText,
  Clock,
  CreditCard,
  CircleCheck,
  Download,
  CircleAlert,
} from "lucide-react";

interface Invoice {
  id: string;
  number: string;
  type: "Project" | "Workshop" | "Subscription";
  status: "Pending" | "Paid" | "Overdue" | "Cancelled";
  description: string;
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  amount: number;
}

const Invoices = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const invoices: Invoice[] = [
    {
      id: "1",
      number: "INV-001",
      type: "Project",
      status: "Pending",
      description: "Renewable Energy Policy Study — Research Paper",
      issuedDate: "01 Jun 2026",
      dueDate: "30 Jun 2026",
      amount: 18500,
    },
    {
      id: "2",
      number: "INV-002",
      type: "Workshop",
      status: "Pending",
      description: "Media Training Workshop — 4 Hours (Online)",
      issuedDate: "05 Jun 2026",
      dueDate: "05 Jul 2026",
      amount: 8200,
    },
    {
      id: "3",
      number: "INV-003",
      type: "Subscription",
      status: "Paid",
      description: "Premium Subscription — Monthly",
      issuedDate: "01 May 2026",
      dueDate: "31 May 2026",
      paidDate: "10 May 2026",
      amount: 1499,
    },
    {
      id: "4",
      number: "INV-004",
      type: "Project",
      status: "Overdue",
      description: "Grant Proposal — AU Commission Partnership",
      issuedDate: "10 May 2026",
      dueDate: "10 Jun 2026",
      amount: 12400,
    },
  ];

  const filters = ["All", "Pending", "Overdue", "Paid", "Cancelled"];

  const getStatusCount = (status: string) => {
    if (status === "All") return invoices.length;
    return invoices.filter((inv) => inv.status === status).length;
  };

  const filteredInvoices =
    activeFilter === "All"
      ? invoices
      : invoices.filter((inv) => inv.status === activeFilter);

  const getStatusBadge = (status: Invoice["status"]) => {
    const config = {
      Pending: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-100",
        icon: <Clock className="w-2.5 h-2.5" />,
      },
      Paid: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-100",
        icon: <CircleCheck className="w-2.5 h-2.5" />,
      },
      Overdue: {
        bg: "bg-red-50",
        text: "text-red-600",
        border: "border-red-100",
        icon: <CircleAlert className="w-2.5 h-2.5" />,
      },
      Cancelled: {
        bg: "bg-gray-50",
        text: "text-gray-500",
        border: "border-gray-200",
        icon: null,
      },
    };
    return config[status] || config.Pending;
  };

  const getTotalOutstanding = () => {
    return invoices
      .filter((inv) => inv.status === "Pending" || inv.status === "Overdue")
      .reduce((sum, inv) => sum + inv.amount, 0);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F4] p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-1">
            Invoices
          </p>
          <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63]">
            Invoice Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Review and pay invoices issued by Magalela Media
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 text-right flex-shrink-0">
          <p className="text-xs text-amber-600 font-semibold">
            Outstanding Balance
          </p>
          <p className="text-xl font-bold text-[#0F2D63]">
            R {getTotalOutstanding().toLocaleString()}
          </p>
        </div>
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
              className={`flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
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

      {/* Invoice List */}
      <div className="space-y-3">
        {filteredInvoices.map((invoice) => {
          const statusBadge = getStatusBadge(invoice.status);
          const isOverdue = invoice.status === "Overdue";
          const isPaid = invoice.status === "Paid";

          return (
            <div
              key={invoice.id}
              className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${
                isOverdue ? "border-red-100" : "border-gray-100"
              }`}
            >
              {/* Icon */}
              <div className="w-10 h-10 bg-[#f4f6fb] rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-[18px] h-[18px] text-[#0F2D63]" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="font-bold text-[#0F2D63] text-sm">
                    {invoice.number}
                  </p>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f4f6fb] text-gray-500">
                    {invoice.type}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                  >
                    {statusBadge.icon}
                    {invoice.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1 truncate">
                  {invoice.description}
                </p>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>Issued {invoice.issuedDate}</span>
                  <span className={isOverdue ? "text-red-500 font-semibold" : ""}>
                    {isOverdue ? "Due " : "Due "}
                    {invoice.dueDate}
                  </span>
                  {invoice.paidDate && (
                    <span className="text-emerald-600">
                      Paid {invoice.paidDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <p className="text-lg font-bold text-[#0F2D63]">
                  R {invoice.amount.toLocaleString()}
                </p>
                {isPaid ? (
                  <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-500 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                ) : (
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-[#C85A32] hover:bg-[#a8472a] text-white text-xs font-semibold rounded-xl transition-colors">
                    <CreditCard className="w-3 h-3" />
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-sm">No invoices found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;