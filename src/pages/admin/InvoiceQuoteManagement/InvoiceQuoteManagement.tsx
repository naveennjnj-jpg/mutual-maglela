// pages/admin/InvoiceQuoteManagement.tsx
import React, { useState } from "react";
import {
  Plus,
  FileText,
  CircleCheck,
  TrendingUp,
  CircleAlert,
  Search,
  Clock,
  X,
  Ellipsis,
} from "lucide-react";
import { Link } from "react-router-dom";

interface InvoiceQuoteItem {
  id: string;
  type: "invoice" | "quote";
  number: string;
  client: string;
  organization: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: "paid" | "sent" | "overdue" | "draft" | "cancelled";
}

const InvoiceQuoteManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data - in real app this would come from an API
  const [items] = useState<InvoiceQuoteItem[]>([
    {
      id: "1",
      type: "invoice",
      number: "INV-001",
      client: "Ronald Sithole",
      organization: "Wits University",
      issueDate: "01 Jun 2024",
      dueDate: "30 Jun 2024",
      amount: 18500,
      status: "paid",
    },
    {
      id: "2",
      type: "invoice",
      number: "INV-002",
      client: "Thabo Nkosi",
      organization: "UCT",
      issueDate: "05 Jun 2024",
      dueDate: "05 Jul 2024",
      amount: 8200,
      status: "sent",
    },
    {
      id: "3",
      type: "invoice",
      number: "INV-003",
      client: "Dr. Sipho Dlamini",
      organization: "Univ. of Pretoria",
      issueDate: "20 May 2024",
      dueDate: "20 Jun 2024",
      amount: 25000,
      status: "overdue",
    },
    {
      id: "4",
      type: "quote",
      number: "QUO-001",
      client: "Kwame Asante",
      organization: "Univ. of Ghana",
      issueDate: "10 Jun 2024",
      dueDate: "10 Jul 2024",
      amount: 12400,
      status: "sent",
    },
    {
      id: "5",
      type: "invoice",
      number: "INV-004",
      client: "Amara Nwosu",
      organization: "Individual",
      issueDate: "12 Jun 2024",
      dueDate: "12 Jul 2024",
      amount: 3500,
      status: "draft",
    },
    {
      id: "6",
      type: "quote",
      number: "QUO-002",
      client: "Bongani Zulu",
      organization: "Stellenbosch Univ.",
      issueDate: "14 Jun 2024",
      dueDate: "14 Jul 2024",
      amount: 9800,
      status: "draft",
    },
    {
      id: "7",
      type: "invoice",
      number: "INV-005",
      client: "Fatima Al-Hassan",
      organization: "Individual",
      issueDate: "15 May 2024",
      dueDate: "15 Jun 2024",
      amount: 5600,
      status: "paid",
    },
    {
      id: "8",
      type: "invoice",
      number: "INV-006",
      client: "Zanele Dube",
      organization: "Individual",
      issueDate: "01 Apr 2024",
      dueDate: "30 Apr 2024",
      amount: 2800,
      status: "cancelled",
    },
  ]);

  const getStatusBadge = (status: InvoiceQuoteItem["status"]) => {
    const config = {
      paid: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-100",
        icon: <CircleCheck className="w-2.5 h-2.5" />,
      },
      sent: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-100",
        icon: <Clock className="w-2.5 h-2.5" />,
      },
      overdue: {
        bg: "bg-red-50",
        text: "text-red-600",
        border: "border-red-100",
        icon: <CircleAlert className="w-2.5 h-2.5" />,
      },
      draft: {
        bg: "bg-gray-100",
        text: "text-gray-600",
        border: "border-gray-200",
        icon: <FileText className="w-2.5 h-2.5" />,
      },
      cancelled: {
        bg: "bg-gray-100",
        text: "text-gray-400",
        border: "border-gray-200",
        icon: <X className="w-2.5 h-2.5" />,
      },
    };
    return config[status] || config.draft;
  };

  const getTypeBadge = (type: "invoice" | "quote") => {
    const config = {
      invoice: {
        bg: "bg-[#f0f3ff]",
        text: "text-[#4f6ef7]",
        label: "INV",
      },
      quote: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        label: "QUO",
      },
    };
    return config[type];
  };

  const getStats = () => {
    const total = items.length;
    const totalPaid = items
      .filter((item) => item.status === "paid")
      .reduce((sum, item) => sum + item.amount, 0);
    const totalOutstanding = items
      .filter((item) => item.status === "sent" || item.status === "overdue")
      .reduce((sum, item) => sum + item.amount, 0);
    const overdue = items.filter((item) => item.status === "overdue").length;

    return { total, totalPaid, totalOutstanding, overdue };
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = getStats();

  const handleRowAction = (id: string) => {
    // Implement row actions (view, edit, delete, etc.)
    console.log("Action for item:", id);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C85A32] mb-1">
            Credit Management
          </p>
          <h1 className="text-2xl font-bold text-[#0F2D63]">
            Invoice & Quote Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage all client invoices and quotes from one place
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link
            to="/admin/create-quote"
            className="flex items-center gap-2 px-4 py-2.5 border border-[#0F2D63] text-[#0F2D63] text-sm font-semibold rounded-xl hover:bg-[#0F2D63] hover:text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Quote
          </Link>
          <Link
            to="/admin/create-invoice"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Invoice
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(79, 110, 247, 0.094)", color: "#4f6ef7" }}
          >
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#0F2D63]">{stats.total}</p>
            <p className="text-xs text-gray-500">Total Invoices</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(34, 201, 165, 0.094)", color: "#22c9a5" }}
          >
            <CircleCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#0F2D63]">
              R {stats.totalPaid.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Total Paid</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(245, 158, 11, 0.094)", color: "#f59e0b" }}
          >
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#0F2D63]">
              R {stats.totalOutstanding.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Outstanding</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(239, 68, 68, 0.094)", color: "#ef4444" }}
          >
            <CircleAlert className="w-4 h-4" />
          </div>
          <div>
            <p className="text-lg font-bold text-[#0F2D63]">{stats.overdue}</p>
            <p className="text-xs text-gray-500">Overdue</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client, ID or organisation…"
            className="w-full pl-8 pr-3 py-2 text-sm bg-[#f4f6fb] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0F2D63]"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="text-sm bg-[#f4f6fb] border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#0F2D63]"
        >
          <option value="all">All Types</option>
          <option value="invoice">Invoices</option>
          <option value="quote">Quotes</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm bg-[#f4f6fb] border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#0F2D63]"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#f9fafb]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.map((item) => {
                const statusBadge = getStatusBadge(item.status);
                const typeBadge = getTypeBadge(item.type);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#f9fafb] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${typeBadge.bg} ${typeBadge.text}`}
                        >
                          {typeBadge.label}
                        </span>
                        <span className="font-mono font-semibold text-[#0F2D63] text-sm">
                          {item.number}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-[#0F2D63] text-sm">
                        {item.client}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.organization}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">
                      {item.issueDate}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">
                      {item.dueDate}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-[#0F2D63]">
                      R {item.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                      >
                        {statusBadge.icon}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 relative">
                      <button
                        onClick={() => handleRowAction(item.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"
                      >
                        <Ellipsis className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    No items found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceQuoteManagement;