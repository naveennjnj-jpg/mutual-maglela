// pages/PaymentSuccess.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles, X, CircleCheckBig, Download, Loader2, FileText, Check, ArrowRight
} from 'lucide-react';

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
  fileUrl?: string;
  fileName?: string;
}

interface OrderData {
  _id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const orderId = searchParams.get('orderId');
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
      const response = await fetch(`${API_BASE_URL}/api/toolkit/orders/${id}`);
      const data = await response.json();

      if (data.success) {
        setOrderData(data.data);
        // Clear cart and pending data
        localStorage.removeItem('cart');
        localStorage.removeItem('pendingOrderId');
        localStorage.removeItem('pendingPayment');
        localStorage.removeItem('orderItems');
      } else {
        setError(data.message || 'Order not found');
      }
    } catch (err) {
      setError('Failed to fetch order status');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (productId: string, fileName: string) => {
    if (!orderData) return;

    setDownloading(productId);
    setDownloadSuccess(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/toolkit/download/${orderData.orderNumber}/${productId}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Download failed');
      }

      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.downloadUrl) {
          window.open(data.downloadUrl, '_blank');
          setDownloadSuccess(productId);
          setTimeout(() => setDownloadSuccess(null), 3000);
          return;
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      setDownloadSuccess(productId);
      setTimeout(() => setDownloadSuccess(null), 3000);

    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const isPaid = orderData?.status === 'paid' || orderData?.status === 'completed';
  const returnUrl = localStorage.getItem("toolkitReturnUrl") || "/digital-toolkit";


  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#F5F0EA] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#C85A32] mx-auto mb-4" />
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="fixed inset-0 bg-[#F5F0EA] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-2xl font-['Roboto'] font-bold text-[#1C1C1C] mb-2">
            Payment Verification Failed
          </h2>
          <p className="text-gray-500 mb-6">
            {error || 'Unable to verify your payment status. Please contact support.'}
          </p>
          <Link
            to="/digital-toolkit"
            className="inline-block bg-[#C85A32] hover:bg-[#a8472a] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

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
              Magalela
            </span>
          </div>
          <Link
            to={returnUrl}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
            onClick={() => {
              localStorage.removeItem("pendingOrderId");
              localStorage.removeItem("pendingPayment");
              localStorage.removeItem("orderItems");
              localStorage.removeItem("toolkitReturnUrl");
            }}
          >
            <X className="w-4 h-4" />
          </Link>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30"></div>
              <div className="relative w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border-2 border-green-100">
                <CircleCheckBig className="w-9 h-9 text-green-500" />
              </div>
            </div>

            <h2 className="text-2xl font-['Roboto'] font-bold text-[#1C1C1C] mb-2">
              {isPaid ? 'Payment Successful! 🎉' : 'Order Placed! 📦'}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {isPaid
                ? 'Your purchase is confirmed. Your digital toolkit items are ready to download.'
                : 'Your order has been placed. You will receive download links once payment is confirmed.'
              }
            </p>

            {/* Order Summary */}
            <div className="bg-[#F5F0EA] rounded-xl p-4 mb-6 text-left">
              <p className="text-[#C85A32] text-xs font-bold uppercase tracking-widest mb-2">
                Order #{orderData.orderNumber}
              </p>
              <div className="space-y-1 mb-3">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.title} × {item.quantity}</span>
                    <span className="font-semibold">R{item.subtotal}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-300 pt-2 flex justify-between">
                <span className="font-bold text-[#1C1C1C]">Total</span>
                <span className="font-bold text-[#0F2D63]">R{orderData.totalAmount}</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full ${isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                  {isPaid ? '✅ Paid' : '⏳ Pending Payment'}
                </span>
              </div>
            </div>

            {/* Download Section - Only show if paid */}
            {isPaid && (
              <div className="bg-[#F5F0EA] rounded-xl p-4 mb-6 text-left">
                <p className="text-[#C85A32] text-xs font-bold uppercase tracking-widest mb-3">
                  Your Downloads
                </p>
                <div className="space-y-2">
                  {orderData.items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#C85A32]/10 rounded-lg flex items-center justify-center">
                          {downloadSuccess === item.productId ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <FileText className="w-4 h-4 text-[#C85A32]" />
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-[#1C1C1C]">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {item.fileName || `${item.title}.pdf`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(item.productId, item.fileName || `${item.title}.pdf`)}
                        disabled={downloading === item.productId}
                        className="px-3 py-1.5 bg-[#C85A32] hover:bg-[#a8472a] disabled:bg-[#C85A32]/50 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 flex-shrink-0"
                      >
                        {downloading === item.productId ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Downloading...
                          </>
                        ) : downloadSuccess === item.productId ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Downloaded
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's Next */}
            <div className="bg-[#F5F0EA] rounded-xl p-4 mb-6 text-left">
              <p className="text-[#C85A32] text-xs font-bold uppercase tracking-widest mb-2">
                What's next?
              </p>
              <ul className="space-y-2">
                {isPaid ? (
                  <>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Download className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                      Click download buttons above to get your files
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                      Check your email for download links
                    </li>
                  </>
                ) : (
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Loader2 className="w-3.5 h-3.5 text-[#C85A32] shrink-0 animate-spin" />
                    Waiting for payment confirmation from PayFast
                  </li>
                )}
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <Sparkles className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                  Start using your toolkit today
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  const returnUrl = localStorage.getItem("toolkitReturnUrl");

                  if (returnUrl) {
                    localStorage.removeItem("toolkitReturnUrl");
                    window.location.href = returnUrl;
                  } else {
                    window.location.href = "/digital-toolkit";
                  }
                }}
                className="w-full bg-[#C85A32] hover:bg-[#a8472a] text-white py-3 rounded-xl font-semibold text-sm transition-colors text-center flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;