// pages/user/InvoicePaymentSuccess.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  X,
  CircleCheckBig,
  Loader2,
  Check,
  ArrowRight,
  FileText,
} from 'lucide-react';

interface InvoiceOrderData {
  _id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  invoiceNumber: string;
  invoiceId: string;
  amount: number;
  createdAt: string;
  paidAt?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const InvoicePaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<InvoiceOrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (orderId) {
      fetchOrderStatus(orderId);
    } else {
      setError('No order ID found');
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderStatus = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/user/invoices/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setOrderData(data.data);
        // Clear pending data
        localStorage.removeItem('pendingInvoiceId');
        localStorage.removeItem('pendingPayment');
        localStorage.removeItem('invoiceReturnUrl');
        localStorage.removeItem('pendingOrderId');
      } else {
        setError(data.message || 'Order not found');
      }
    } catch (err) {
      setError('Failed to fetch order status');
    } finally {
      setLoading(false);
    }
  };

  const returnUrl = localStorage.getItem('invoiceReturnUrl') || '/user/invoices';

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#F9F7F4] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#C85A32] mx-auto mb-4" />
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="fixed inset-0 bg-[#F9F7F4] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-2xl font-['Roboto'] font-bold text-[#1C1C1C] mb-2">
            Verification Failed
          </h2>
          <p className="text-gray-500 mb-6">
            {error || 'Unable to verify your payment. Please contact support.'}
          </p>
          <Link
            to="/user/invoices"
            className="inline-block bg-[#C85A32] hover:bg-[#a8472a] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            Return to Invoices
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = orderData?.status === 'paid' || orderData?.status === 'completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2D63]">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0F2D63] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#C85A32] rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-['Roboto'] font-bold text-white text-sm tracking-wide uppercase">
              Magalela Media
            </span>
          </div>
          <Link
            to={returnUrl}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
            onClick={() => {
              localStorage.removeItem('pendingInvoiceId');
              localStorage.removeItem('pendingPayment');
              localStorage.removeItem('invoiceReturnUrl');
              localStorage.removeItem('pendingOrderId');
            }}
          >
            <X className="w-4 h-4" />
          </Link>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <div className="text-center">
            {/* Icon */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30"></div>
              <div className="relative w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border-2 border-green-100">
                <CircleCheckBig className="w-9 h-9 text-green-500" />
              </div>
            </div>

            <h2 className="text-2xl font-['Roboto'] font-bold text-[#1C1C1C] mb-2">
              Payment Successful! 🎉
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Your invoice has been paid successfully. Thank you for your business!
            </p>

            {/* Invoice Summary */}
            <div className="bg-[#F5F0EA] rounded-xl p-4 mb-6 text-left">
              <p className="text-[#C85A32] text-xs font-bold uppercase tracking-widest mb-3">
                Payment Summary
              </p>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Invoice Number</span>
                  <span className="text-sm font-semibold text-[#1C1C1C]">
                    {orderData.invoiceNumber || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount Paid</span>
                  <span className="text-sm font-bold text-[#0F2D63]">
                    R{orderData.totalAmount?.toLocaleString() || orderData.amount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`text-sm font-semibold ${isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                    {isPaid ? '✅ Paid' : '⏳ Pending'}
                  </span>
                </div>
                {orderData.paidAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Paid Date</span>
                    <span className="text-sm text-gray-600">
                      {new Date(orderData.paidAt).toLocaleDateString('en-ZA', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-400">
                  Order #{orderData.orderNumber}
                </span>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-[#F5F0EA] rounded-xl p-4 mb-6 text-left">
              <p className="text-[#C85A32] text-xs font-bold uppercase tracking-widest mb-2">
                What's next?
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                  Your invoice is now marked as paid
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                  Check your email for payment confirmation
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                  Your service will continue without interruption
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <Link
                to="/user/invoices"
                className="w-full bg-[#C85A32] hover:bg-[#a8472a] text-white py-3 rounded-xl font-semibold text-sm transition-colors text-center flex items-center justify-center gap-2"
                onClick={() => {
                  localStorage.removeItem('pendingInvoiceId');
                  localStorage.removeItem('pendingPayment');
                  localStorage.removeItem('invoiceReturnUrl');
                  localStorage.removeItem('pendingOrderId');
                }}
              >
                <ArrowRight className="w-4 h-4" />
                View All Invoices
              </Link>

              <Link
                to="/user"
                className="w-full border border-gray-200 hover:bg-gray-50 text-gray-600 py-3 rounded-xl font-medium text-sm transition-colors text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePaymentSuccess;