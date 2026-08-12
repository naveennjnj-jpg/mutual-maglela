// pages/admin/InvoiceQuoteManagement.tsx
import React, { useState, useEffect } from "react";
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
  Loader2,
  Eye,
  Download,
  Maximize2,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  pdf,
} from "@react-pdf/renderer";

// ============================================
// INTERFACES
// ============================================

interface InvoiceQuoteItem {
  _id: string;
  id: string;
  type: "invoice" | "quote";
  number: string;
  client: string;
  organization: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  status: "paid" | "sent" | "overdue" | "draft" | "cancelled";
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    lineTotal: number;
  }>;
  rawData: any;
}

interface ApiInvoice {
  _id: string;
  invoiceNumber: string;
  clientInfo: {
    clientName: string;
    organisation?: string;
    email: string;
  };
  issueDate: string;
  dueDate: string;
  grandTotal: number;
  subtotal: number;
  taxTotal: number;
  status: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    lineTotal: number;
  }>;
  additionalNotes?: string;
  currency?: string;
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
  }>;
  additionalNotes?: string;
  currency?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ============================================
// PDF STYLES
// ============================================

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    backgroundColor: "#0F2D63",
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "white",
    fontSize: 10,
  },
  headerRight: {
    color: "white",
    fontSize: 8,
    textAlign: "right",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#0F2D63",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 10,
    color: "#666",
  },
  value: {
    fontSize: 10,
    color: "#333",
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0F2D63",
    padding: 8,
  },
  tableHeaderText: {
    color: "white",
    fontSize: 9,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    padding: 6,
  },
  tableRowEven: {
    backgroundColor: "#f9f9f9",
  },
  tableCell: {
    fontSize: 9,
    color: "#333",
  },
  col1: { width: "45%" },
  col2: { width: "15%", textAlign: "center" },
  col3: { width: "20%", textAlign: "right" },
  col4: { width: "20%", textAlign: "right" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 5,
    marginBottom: 3,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
    width: 80,
    textAlign: "right",
  },
  totalValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#C85A32",
    width: 80,
    textAlign: "right",
  },
  grandTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#C85A32",
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    textAlign: "center",
  },
  footerText: {
    fontSize: 8,
    color: "#999",
  },
  notes: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  notesText: {
    fontSize: 9,
    color: "#666",
  },
  badge: {
    backgroundColor: "#fff3e0",
    padding: 4,
    marginBottom: 10,
  },
  badgeText: {
    color: "#e65100",
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
});

// ============================================
// INVOICE PDF COMPONENT
// ============================================

const InvoicePDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>INVOICE</Text>
          <Text style={styles.headerSubtitle}>{data.invoiceNumber}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text>Magalela</Text>
          <Text>Science Communication</Text>
          <Text>info@magalela.com</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text style={styles.value}>{data.clientInfo?.clientName || "N/A"}</Text>
          {data.clientInfo?.organisation && (
            <Text style={styles.value}>{data.clientInfo.organisation}</Text>
          )}
          <Text style={styles.value}>{data.clientInfo?.email || "N/A"}</Text>
        </View>
        <View>
          <Text style={styles.sectionTitle}>Invoice Details:</Text>
          <Text style={styles.value}>Number: {data.invoiceNumber}</Text>
          <Text style={styles.value}>Issue: {new Date(data.issueDate).toLocaleDateString()}</Text>
          <Text style={styles.value}>Due: {new Date(data.dueDate).toLocaleDateString()}</Text>
          <Text style={styles.value}>Currency: {data.currency || "ZAR"}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.col1]}>Description</Text>
          <Text style={[styles.tableHeaderText, styles.col2]}>Qty</Text>
          <Text style={[styles.tableHeaderText, styles.col3]}>Rate</Text>
          <Text style={[styles.tableHeaderText, styles.col4]}>Total</Text>
        </View>
        {data.items.map((item: any, index: number) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
            <Text style={[styles.tableCell, styles.col1]}>{item.description || "N/A"}</Text>
            <Text style={[styles.tableCell, styles.col2]}>{item.quantity || 0}</Text>
            <Text style={[styles.tableCell, styles.col3]}>R {(item.rate || 0).toFixed(2)}</Text>
            <Text style={[styles.tableCell, styles.col4]}>R {(item.lineTotal || 0).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>R {(data.subtotal || 0).toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>VAT (15%):</Text>
          <Text style={styles.totalValue}>R {(data.taxTotal || 0).toFixed(2)}</Text>
        </View>
        <View style={[styles.totalRow, { marginTop: 8, borderTopWidth: 1, borderTopColor: "#0F2D63", paddingTop: 8 }]}>
          <Text style={[styles.totalLabel, { fontSize: 14, color: "#0F2D63" }]}>Total Due:</Text>
          <Text style={[styles.totalValue, styles.grandTotal]}>R {(data.grandTotal || 0).toFixed(2)}</Text>
        </View>
      </View>

      {data.additionalNotes && (
        <View style={styles.notes}>
          <Text style={styles.sectionTitle}>Notes:</Text>
          <Text style={styles.notesText}>{data.additionalNotes}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Thank you for your business!</Text>
        <Text style={styles.footerText}>Generated on {new Date().toLocaleString()}</Text>
        <Text style={[styles.footerText, { marginTop: 4 }]}>
          © {new Date().getFullYear()} Magalela · Science Communication
        </Text>
      </View>
    </Page>
  </Document>
);

// ============================================
// QUOTE PDF COMPONENT
// ============================================

const QuotePDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>QUOTE</Text>
          <Text style={styles.headerSubtitle}>{data.quoteNumber}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text>Magalela</Text>
          <Text>Science Communication</Text>
          <Text>info@magalela.com</Text>
        </View>
      </View>

      <View style={[styles.badge, { marginBottom: 15 }]}>
        <Text style={styles.badgeText}>⏳ Valid until {new Date(data.validUntil).toLocaleDateString()}</Text>
      </View>

      <View style={styles.row}>
        <View>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text style={styles.value}>{data.clientInfo?.clientName || "N/A"}</Text>
          {data.clientInfo?.organisation && (
            <Text style={styles.value}>{data.clientInfo.organisation}</Text>
          )}
          <Text style={styles.value}>{data.clientInfo?.email || "N/A"}</Text>
        </View>
        <View>
          <Text style={styles.sectionTitle}>Quote Details:</Text>
          <Text style={styles.value}>Number: {data.quoteNumber}</Text>
          <Text style={styles.value}>Date: {new Date(data.quoteDate).toLocaleDateString()}</Text>
          <Text style={styles.value}>Valid: {new Date(data.validUntil).toLocaleDateString()}</Text>
          <Text style={styles.value}>Currency: {data.currency || "ZAR"}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.col1]}>Description</Text>
          <Text style={[styles.tableHeaderText, styles.col2]}>Qty</Text>
          <Text style={[styles.tableHeaderText, styles.col3]}>Rate</Text>
          <Text style={[styles.tableHeaderText, styles.col4]}>Total</Text>
        </View>
        {data.items.map((item: any, index: number) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
            <Text style={[styles.tableCell, styles.col1]}>{item.description || "N/A"}</Text>
            <Text style={[styles.tableCell, styles.col2]}>{item.quantity || 0}</Text>
            <Text style={[styles.tableCell, styles.col3]}>R {(item.rate || 0).toFixed(2)}</Text>
            <Text style={[styles.tableCell, styles.col4]}>R {(item.lineTotal || 0).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>R {(data.subtotal || 0).toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>VAT (15%):</Text>
          <Text style={styles.totalValue}>R {(data.taxTotal || 0).toFixed(2)}</Text>
        </View>
        <View style={[styles.totalRow, { marginTop: 8, borderTopWidth: 1, borderTopColor: "#0F2D63", paddingTop: 8 }]}>
          <Text style={[styles.totalLabel, { fontSize: 14, color: "#0F2D63" }]}>Total:</Text>
          <Text style={[styles.totalValue, styles.grandTotal]}>R {(data.grandTotal || 0).toFixed(2)}</Text>
        </View>
      </View>

      {data.additionalNotes && (
        <View style={styles.notes}>
          <Text style={styles.sectionTitle}>Notes:</Text>
          <Text style={styles.notesText}>{data.additionalNotes}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>This quote is valid for 30 days from the date of issue.</Text>
        <Text style={styles.footerText}>Thank you for considering Magalela!</Text>
        <Text style={[styles.footerText, { marginTop: 4 }]}>
          © {new Date().getFullYear()} Magalela · Science Communication
        </Text>
      </View>
    </Page>
  </Document>
);

// ============================================
// PDF MODAL COMPONENT
// ============================================

const PDFModal = ({ 
  data, 
  type, 
  onClose 
}: { 
  data: any; 
  type: string; 
  onClose: () => void;
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const generatePDF = async () => {
      const PDFComponent = type === "invoice" ? InvoicePDF : QuotePDF;
      try {
        const blob = await pdf(<PDFComponent data={data} />).toBlob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error("Error generating PDF:", error);
        toast.error("Failed to generate PDF");
      }
    };
    generatePDF();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [data, type]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = async () => {
    try {
      const PDFComponent = type === "invoice" ? InvoicePDF : QuotePDF;
      const blob = await pdf(<PDFComponent data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${data.number || data.invoiceNumber || data.quoteNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success(`${type === "invoice" ? "Invoice" : "Quote"} downloaded successfully`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF");
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 transition-all ${
        isFullscreen ? "p-0" : ""
      }`}
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl flex flex-col transition-all ${
          isFullscreen ? "w-full h-full rounded-none" : "w-full max-w-6xl max-h-[90vh]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="font-bold text-[#0F2D63] text-lg">
              {type === "invoice" ? "Invoice" : "Quote"} - {data.number || data.invoiceNumber || data.quoteNumber}
            </h3>
            <p className="text-xs text-gray-500">
              Client: {data.clientInfo?.clientName || "N/A"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className={`flex-1 p-4 bg-gray-100 overflow-auto ${isFullscreen ? "p-0" : ""}`}>
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className={`w-full border-0 bg-white rounded-lg ${
                isFullscreen ? "h-full rounded-none" : "h-[70vh]"
              }`}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-[#0F2D63] animate-spin mx-auto" />
                <p className="text-sm text-gray-500 mt-3">Generating PDF...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const InvoiceQuoteManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [items, setItems] = useState<InvoiceQuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [pdfModalData, setPdfModalData] = useState<{
    data: any;
    type: string;
  } | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view invoices and quotes");
        setLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [invoicesRes, quotesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/invoices`, { headers }),
        axios.get(`${API_BASE_URL}/api/admin/quotes`, { headers }),
      ]);

      let transformedItems: InvoiceQuoteItem[] = [];

      if (invoicesRes.data.success) {
        const invoices = invoicesRes.data.data.map((inv: ApiInvoice) => ({
          _id: inv._id,
          id: inv._id,
          type: "invoice" as const,
          number: inv.invoiceNumber,
          client: inv.clientInfo?.clientName || "Unknown Client",
          organization: inv.clientInfo?.organisation || "",
          issueDate: new Date(inv.issueDate).toLocaleDateString("en-ZA", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          dueDate: new Date(inv.dueDate).toLocaleDateString("en-ZA", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          amount: inv.grandTotal || 0,
          subtotal: inv.subtotal || 0,
          taxTotal: inv.taxTotal || 0,
          grandTotal: inv.grandTotal || 0,
          status: mapStatus(inv.status),
          items: inv.items || [],
          rawData: inv,
        }));
        transformedItems = [...transformedItems, ...invoices];
      }

      if (quotesRes.data.success) {
        const quotes = quotesRes.data.data.map((quo: ApiQuote) => ({
          _id: quo._id,
          id: quo._id,
          type: "quote" as const,
          number: quo.quoteNumber,
          client: quo.clientInfo?.clientName || "Unknown Client",
          organization: quo.clientInfo?.organisation || "",
          issueDate: new Date(quo.quoteDate).toLocaleDateString("en-ZA", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          dueDate: new Date(quo.validUntil).toLocaleDateString("en-ZA", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          amount: quo.grandTotal || 0,
          subtotal: quo.subtotal || 0,
          taxTotal: quo.taxTotal || 0,
          grandTotal: quo.grandTotal || 0,
          status: mapStatus(quo.status),
          items: quo.items || [],
          rawData: quo,
        }));
        transformedItems = [...transformedItems, ...quotes];
      }

      transformedItems.sort((a, b) => {
        const dateA = new Date(a.issueDate);
        const dateB = new Date(b.issueDate);
        return dateB.getTime() - dateA.getTime();
      });

      setItems(transformedItems);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setError(error.response?.data?.message || "Failed to fetch data");
      toast.error(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const mapStatus = (status: string): InvoiceQuoteItem["status"] => {
    const statusMap: Record<string, InvoiceQuoteItem["status"]> = {
      draft: "draft",
      sent: "sent",
      viewed: "sent",
      accepted: "sent",
      paid: "paid",
      overdue: "overdue",
      cancelled: "cancelled",
      rejected: "cancelled",
      expired: "cancelled",
      invoiced: "paid",
    };
    return statusMap[status] || "draft";
  };

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

  // ============================================
  // PDF HANDLERS
  // ============================================

  const handleViewPDF = (item: InvoiceQuoteItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(null);
    setPdfModalData({
      data: item.rawData,
      type: item.type,
    });
  };

  const handleDownloadPDF = async (item: InvoiceQuoteItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(null);

    try {
      const PDFComponent = item.type === "invoice" ? InvoicePDF : QuotePDF;
      const blob = await pdf(<PDFComponent data={item.rawData} />).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${item.number}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      toast.success(`${item.type === "invoice" ? "Invoice" : "Quote"} downloaded successfully`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF");
    }
  };

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(showDropdown === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#0F2D63] animate-spin" />
          <p className="text-sm text-gray-500">Loading invoices and quotes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8 max-w-md text-center">
          <CircleAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[#0F2D63] mb-2">Error Loading Data</h3>
          <p className="text-sm text-gray-500">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-6 py-2 bg-[#0F2D63] text-white text-sm font-semibold rounded-xl hover:bg-[#0a2050] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
            <p className="text-xs text-gray-500">Total Invoices & Quotes</p>
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
        <button
          onClick={fetchData}
          className="text-sm bg-[#f4f6fb] border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-200 transition-colors"
        >
          Refresh
        </button>
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.map((item) => {
                const statusBadge = getStatusBadge(item.status);
                const typeBadge = getTypeBadge(item.type);
                const isDropdownOpen = showDropdown === item._id;

                return (
                  <tr
                    key={item._id || item.id}
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
                        onClick={(e) => toggleDropdown(item._id, e)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#0F2D63] transition-colors"
                      >
                        <Ellipsis className="w-3.5 h-3.5" />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-gray-100 shadow-lg z-10 py-1.5 overflow-hidden">
                          <button
                            onClick={(e) => handleViewPDF(item, e)}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-[#f4f6fb] transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View PDF
                          </button>
                          <button
                            onClick={(e) => handleDownloadPDF(item, e)}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-[#f4f6fb] transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download PDF
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                    {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                      ? "No items found matching your filters"
                      : "No invoices or quotes found. Create your first one!"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Modal */}
      {pdfModalData && (
        <PDFModal
          data={pdfModalData.data}
          type={pdfModalData.type}
          onClose={() => setPdfModalData(null)}
        />
      )}
    </div>
  );
};

export default InvoiceQuoteManagement;