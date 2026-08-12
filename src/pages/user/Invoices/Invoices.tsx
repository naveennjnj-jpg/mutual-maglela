// pages/user/Invoices.tsx
import React, { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  CreditCard,
  CircleCheck,
  Download,
  CircleAlert,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

interface Invoice {
  _id: string;
  number: string;
  type: "Project" | "Workshop" | "Subscription" | "Consulting" | "AI Writing" | "AI Speech";
  status: "Pending" | "Paid" | "Overdue" | "Cancelled";
  description: string;
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  amount: number;
  rawData?: any;
}

interface ApiInvoice {
  _id: string;
  invoiceNumber: string;
  quoteNumber?: string;
  clientInfo: {
    clientName: string;
    organisation?: string;
    email: string;
    address?: string;
    phone?: string;
  };
  invoiceDate: string;
  dueDate: string;
  paidDate?: string;
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
  paymentStatus?: string;
  paymentMethod?: string;
  paymentDate?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 20,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F2D63',
  },
  companySub: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F2D63',
  },
  invoiceNumber: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
  clientSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  clientLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F2D63',
  },
  clientDetail: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 4,
    marginBottom: 4,
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableCell: {
    fontSize: 10,
    color: '#374151',
  },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: 'center' },
  col3: { flex: 1, textAlign: 'right' },
  col4: { flex: 1, textAlign: 'right' },
  totals: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 20,
    width: 100,
    textAlign: 'right',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F2D63',
    width: 120,
    textAlign: 'right',
  },
  grandTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C85A32',
  },
  notes: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 9,
    color: '#9ca3af',
  },
});

// PDF Document Component
const InvoicePDF = ({ invoice }: { invoice: Invoice }) => {
  const data = invoice.rawData;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: data?.currency || "ZAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>Magalela Media</Text>
            <Text style={styles.companySub}>Consulting & Media Solutions</Text>
            <Text style={styles.companySub}>info@magalelamedia.com</Text>
            <Text style={styles.companySub}>+27 12 345 6789</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoice.number}</Text>
            <Text style={styles.invoiceNumber}>Date: {invoice.issuedDate}</Text>
          </View>
        </View>

        {/* Client Info */}
        {data?.clientInfo && (
          <View style={styles.clientSection}>
            <Text style={styles.clientLabel}>Bill To</Text>
            <Text style={styles.clientName}>{data.clientInfo.organisation || data.clientInfo.clientName}</Text>
            <Text style={styles.clientDetail}>{data.clientInfo.clientName}</Text>
            {data.clientInfo.email && <Text style={styles.clientDetail}>{data.clientInfo.email}</Text>}
            {data.clientInfo.address && <Text style={styles.clientDetail}>{data.clientInfo.address}</Text>}
          </View>
        )}

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.col1]}>Description</Text>
            <Text style={[styles.tableHeaderText, styles.col2]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.col3]}>Rate</Text>
            <Text style={[styles.tableHeaderText, styles.col4]}>Total</Text>
          </View>
          {data?.items?.map((item: any, index: number) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>
                {item.serviceType || "Service"}\n{item.description}
              </Text>
              <Text style={[styles.tableCell, styles.col2]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.col3]}>{formatCurrency(item.rate)}</Text>
              <Text style={[styles.tableCell, styles.col4]}>{formatCurrency(item.lineTotal)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatCurrency(data?.subtotal || 0)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>VAT (15%)</Text>
            <Text style={styles.totalValue}>{formatCurrency(data?.taxTotal || 0)}</Text>
          </View>
          {data?.discountTotal && data.discountTotal > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount</Text>
              <Text style={[styles.totalValue, { color: '#ef4444' }]}>
                -{formatCurrency(data.discountTotal)}
              </Text>
            </View>
          )}
          <View style={[styles.totalRow, { marginTop: 8 }]}>
            <Text style={[styles.totalLabel, { fontSize: 16, fontWeight: 'bold' }]}>Total</Text>
            <Text style={[styles.totalValue, styles.grandTotal]}>
              {formatCurrency(invoice.amount)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {data?.additionalNotes && (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{data.additionalNotes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for your business</Text>
          <Text style={styles.footerText}>Payment due by: {invoice.dueDate}</Text>
        </View>
      </Page>
    </Document>
  );
};

const Invoices = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Fetch invoices on mount
  useEffect(() => {
    if (user?.email) {
      fetchInvoices();
    }
  }, [user]);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view invoices");
        setLoading(false);
        return;
      }

      if (!user?.email) {
        setError("User email not found");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/user/invoices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        let invoicesData = [];
        if (Array.isArray(response.data.data)) {
          invoicesData = response.data.data;
        } else if (response.data.data) {
          invoicesData = [response.data.data];
        }

        const transformedInvoices = invoicesData.map((invoice: ApiInvoice) => {
          const statusMap: Record<string, string> = {
            pending: "Pending",
            paid: "Paid",
            overdue: "Overdue",
            cancelled: "Cancelled",
            sent: "Pending",
            viewed: "Pending",
          };

          const status = statusMap[invoice.status] || "Pending";

          // Determine type from items or service type
          let type: "Project" | "Workshop" | "Subscription" | "Consulting" | "AI Writing" | "AI Speech" = "Project";
          if (invoice.items && invoice.items.length > 0) {
            const serviceType = invoice.items[0]?.serviceType || "";
            if (serviceType.includes("Workshop")) type = "Workshop";
            else if (serviceType.includes("Speech")) type = "AI Speech";
            else if (serviceType.includes("Writing")) type = "AI Writing";
            else if (serviceType.includes("Consulting")) type = "Consulting";
            else if (serviceType.includes("Subscription")) type = "Subscription";
          }

          return {
            _id: invoice._id,
            number: invoice.invoiceNumber,
            type: type,
            status: status as any,
            description: invoice.items?.[0]?.description || invoice.additionalNotes || "Invoice",
            issuedDate: new Date(invoice.invoiceDate).toLocaleDateString("en-ZA", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            dueDate: new Date(invoice.dueDate).toLocaleDateString("en-ZA", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            paidDate: invoice.paidDate ? new Date(invoice.paidDate).toLocaleDateString("en-ZA", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }) : undefined,
            amount: invoice.grandTotal || 0,
            rawData: invoice,
          };
        });

        setInvoices(transformedInvoices);
      } else {
        setError(response.data.message || "Failed to fetch invoices");
        toast.error(response.data.message || "Failed to fetch invoices");
      }
    } catch (error: any) {
      console.error("Error fetching invoices:", error);
      setError(error.response?.data?.message || "Failed to fetch invoices");
      toast.error(error.response?.data?.message || "Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      setDownloadingId(invoice._id);
      
      // Generate PDF using react-pdf
      const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${invoice.number}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Invoice downloaded successfully");
    } catch (error: any) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice");
    } finally {
      setDownloadingId(null);
    }
  };

const handlePayNow = async (invoice: Invoice) => {
  if (!user) {
    setPaymentError("Please login to pay invoices");
    toast.error("Please login to pay invoices");
    return;
  }

  setProcessingId(invoice._id);
  setPaymentError(null);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setPaymentError("Authentication required. Please login again.");
      toast.error("Authentication required. Please login again.");
      setProcessingId(null);
      return;
    }

    // Prepare payment data
    const paymentData = {
      invoiceId: invoice._id,
      invoiceNumber: invoice.number,
      userEmail: user.email,
      amount: invoice.amount,
      billingInfo: {
        firstName: user.name?.split(' ')[0] || 'User',
        lastName: user.name?.split(' ').slice(1).join(' ') || 'User',
        email: user.email,
        organisation: invoice.rawData?.clientInfo?.organisation || '',
        streetAddress: invoice.rawData?.clientInfo?.address || 'N/A',
        city: 'N/A',
        postalCode: 'N/A',
        country: 'South Africa'
      },
      items: invoice.rawData?.items?.map((item: any) => ({
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        lineTotal: item.lineTotal,
        serviceType: item.serviceType || 'Service'
      })) || []
    };

    // Create order and initiate payment
    const response = await fetch(`${API_BASE_URL}/api/user/invoices/create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Payment initiation failed');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Payment initiation failed');
    }

    // ✅ Extract data from the correct location
    const paymentResult = result.data;
    
    if (!paymentResult) {
      throw new Error('No payment data received');
    }

    // Store order info in localStorage
    if (paymentResult.orderId) {
      localStorage.setItem('pendingOrderId', paymentResult.orderId);
      localStorage.setItem('pendingPayment', 'true');
      localStorage.setItem('pendingInvoiceId', invoice._id);
      localStorage.setItem('invoiceReturnUrl', window.location.href);
      console.log('✅ Order ID stored in localStorage:', paymentResult.orderId);
    }

    toast.success('Redirecting to payment...');

    // ✅ Redirect to PayFast
    if (paymentResult.paymentUrl && paymentResult.paymentData) {
      // Try form POST first (PayFast requires POST)
      try {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentResult.paymentUrl;
        form.target = '_self';
        
        Object.keys(paymentResult.paymentData).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = paymentResult.paymentData[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        
        // Submit the form
        form.submit();
        
        // Clean up after a delay
        setTimeout(() => {
          if (document.body.contains(form)) {
            document.body.removeChild(form);
          }
        }, 1000);
        
        return;
      } catch (formError) {
        console.warn('Form submission failed, trying redirect:', formError);
        
        // ✅ Fallback: Build URL with query parameters
        const queryParams = new URLSearchParams(paymentResult.paymentData);
        const redirectUrl = `${paymentResult.paymentUrl}?${queryParams.toString()}`;
        window.location.href = redirectUrl;
        return;
      }
    }

    throw new Error('Payment initiation did not return a redirect URL');

  } catch (err: any) {
    console.error('Error processing payment:', err);
    const errorMessage = err.response?.data?.message || err.message || 'Failed to process payment';
    setPaymentError(errorMessage);
    toast.error(errorMessage);
    setProcessingId(null);
  }
};

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin" />
          <p className="text-sm text-gray-500">Loading invoices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8 max-w-md text-center">
          <CircleAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[#0F2D63] mb-2">Error Loading Invoices</h3>
          <p className="text-sm text-gray-500">{error}</p>
          <button
            onClick={fetchInvoices}
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 text-right flex-shrink-0 w-full sm:w-auto">
          <p className="text-xs text-amber-600 font-semibold">
            Outstanding Balance
          </p>
          <p className="text-xl font-bold text-[#0F2D63]">
            R {getTotalOutstanding().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Payment Error */}
      {paymentError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <CircleAlert className="w-4 h-4" />
            {paymentError}
          </p>
        </div>
      )}

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
          const isPending = invoice.status === "Pending";
          const isDownloading = downloadingId === invoice._id;
          const isProcessing = processingId === invoice._id;

          return (
            <div
              key={invoice._id}
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
                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
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
                  <button
                    onClick={() => handleDownloadPDF(invoice)}
                    disabled={isDownloading}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-500 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Download className="w-3 h-3" />
                    )}
                    {isDownloading ? "Downloading..." : "Download"}
                  </button>
                ) : isPending || isOverdue ? (
                  <button
                    onClick={() => handlePayNow(invoice)}
                    disabled={isProcessing}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#C85A32] hover:bg-[#a8472a] text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <CreditCard className="w-3 h-3" />
                    )}
                    {isProcessing ? "Processing..." : "Pay Now"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleDownloadPDF(invoice)}
                    disabled={isDownloading}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-500 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Download className="w-3 h-3" />
                    )}
                    {isDownloading ? "Downloading..." : "Download"}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No invoices found</p>
            <p className="text-xs text-gray-400 mt-1">
              {activeFilter !== "All" ? `No ${activeFilter.toLowerCase()} invoices available` : "You don't have any invoices yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;