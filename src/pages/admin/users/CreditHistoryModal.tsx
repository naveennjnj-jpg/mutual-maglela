import React, { useState, useEffect } from "react";
import { X, Loader2, Coins, AlertCircle, TrendingUp, Calendar } from "lucide-react";
import axios from "axios";

interface Transaction {
  id: string;
  amount: number;
  action: string;
  description: string;
  balanceAfter: number;
  createdAt: string;
}

interface DayGroup {
  date: string;
  totalCredits: number;
  transactionCount: number;
  transactions: Transaction[];
}

interface HistoryData {
  summary: {
    totalCredits: number;
    totalTransactions: number;
    avgPerDay: number;
    busiestDay: { date: string; totalCredits: number } | null;
  };
  history: DayGroup[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  API_URL: string;
}

const actionLabels: Record<string, string> = {
  ai_writing: "AI Writing",
  ai_speech: "AI Speech",
  voice_calibrator: "Voice Calibrator",
  narrative_engine: "Narrative Engine",
  manual_adjustment: "Manual Adjustment",
  refund: "Refund",
  other: "Other",
};

const CreditHistoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userId,
  userName,
  API_URL,
}) => {
  const [data, setData] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);
  const [groupBy, setGroupBy] = useState<"day" | "week" | "month">("day");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !userId) return;
    fetchHistory();
  
  }, [isOpen, userId, days, groupBy]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_URL}/api/admin/users/${userId}/credit-history`,
        {
          params: { days, groupBy },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        setData(res.data.data);
      } else {
        setError(res.data.message || "Failed to load history");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const maxDaily = Math.max(
    1,
    ...(data?.history.map((d) => d.totalCredits) || [1])
  );

  const formatDay = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#C85A32]">
              Credits Usage
            </p>
            <h2 className="text-lg font-bold text-[#0F2D63] truncate">
              {userName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="px-5 py-3 border-b border-gray-50 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                  days === d
                    ? "bg-white text-[#0F2D63] shadow-sm"
                    : "text-gray-500"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            {(["day", "week", "month"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGroupBy(g)}
                className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition ${
                  groupBy === g
                    ? "bg-white text-[#0F2D63] shadow-sm"
                    : "text-gray-500"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 text-[#C85A32] animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          ) : data && data.summary.totalTransactions === 0 ? (
            <div className="text-center py-12">
              <Coins className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-600">
                No credit usage in the last {days} days
              </p>
            </div>
          ) : data ? (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                <div className="bg-[#FFF8F5] border border-[#C85A32]/20 rounded-xl p-3">
                  <p className="text-[10px] font-semibold uppercase text-[#C85A32]">
                    Total Used
                  </p>
                  <p className="text-lg font-bold text-[#0F2D63]">
                    {data.summary.totalCredits.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <p className="text-[10px] font-semibold uppercase text-gray-500">
                    Transactions
                  </p>
                  <p className="text-lg font-bold text-[#0F2D63]">
                    {data.summary.totalTransactions.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <p className="text-[10px] font-semibold uppercase text-gray-500">
                    Avg / Day
                  </p>
                  <p className="text-lg font-bold text-[#0F2D63]">
                    {data.summary.avgPerDay.toLocaleString()}
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-[10px] font-semibold uppercase text-amber-700">
                    Busiest
                  </p>
                  <p className="text-lg font-bold text-[#0F2D63] truncate">
                    {data.summary.busiestDay
                      ? data.summary.busiestDay.totalCredits.toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Daily list */}
              <div className="space-y-2">
                {data.history.map((group) => (
                  <div
                    key={group.date}
                    className="border border-gray-100 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpanded(expanded === group.date ? null : group.date)
                      }
                      disabled={group.transactionCount === 0}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
                        group.transactionCount > 0
                          ? "hover:bg-gray-50 cursor-pointer"
                          : "opacity-60 cursor-default"
                      }`}
                    >
                      <div className="w-20 shrink-0">
                        <p className="text-xs font-semibold text-[#0F2D63]">
                          {formatDay(group.date)}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {group.transactionCount} txn
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#C85A32] rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                100,
                                (group.totalCredits / maxDaily) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-[#0F2D63]">
                          {group.totalCredits.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-gray-400">credits</p>
                      </div>
                    </button>

                    {expanded === group.date && group.transactions.length > 0 && (
                      <div className="border-t border-gray-100 bg-gray-50/50">
                        {group.transactions.map((tx) => (
                          <div
                            key={tx.id}
                            className="flex items-start gap-3 px-4 py-2.5 border-b border-gray-100 last:border-0"
                          >
                            <div className="w-14 text-[10px] text-gray-400 shrink-0">
                              {formatTime(tx.createdAt)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-[#0F2D63] truncate">
                                {actionLabels[tx.action] || tx.action}
                              </p>
                              {tx.description && (
                                <p className="text-[11px] text-gray-500 truncate">
                                  {tx.description}
                                </p>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs font-semibold text-[#C85A32]">
                                -{Math.abs(tx.amount)}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                Bal: {tx.balanceAfter}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CreditHistoryModal;