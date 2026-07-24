// components/auth/PaymentCancelled.tsx
import React, { useEffect, useState } from "react";
import { XCircle, Home, Loader2, ShoppingBag, ArrowLeft, X } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentCancelled: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const cancelOrder = async () => {
      // ✅ Check localStorage for pending order ID
      const orderId = localStorage.getItem('pendingOrderId');
      const hasPendingPayment = localStorage.getItem('pendingPayment');

      console.log('🔍 Checking localStorage:', { orderId, hasPendingPayment });

      if (!orderId || !hasPendingPayment) {
        console.log('No pending order found in localStorage');
        setError('No pending order found');
        setIsLoading(false);
        return;
      }

      setOrderId(orderId);

      try {
        setIsLoading(true);
        setError(null);

        // ✅ Simple API call - only order ID in URL
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/toolkit/orders/${orderId}/cancel`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to cancel order');
        }

        const data = await response.json();
        console.log('✅ Order cancelled:', data);

        setSuccess(true);

        // ✅ Clear localStorage
        localStorage.removeItem('pendingOrderId');
        localStorage.removeItem('pendingPayment');

      } catch (err) {
        console.error('❌ Error cancelling order:', err);
        setError(err instanceof Error ? err.message : 'Failed to cancel order');
      } finally {
        setIsLoading(false);
      }
    };

    cancelOrder();
  }, []);
  const returnUrl = localStorage.getItem("toolkitReturnUrl") || "/digital-toolkit";


  return (
    <main className="flex-1 pt-0">
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2D63]">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="bg-[#0F2D63] px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#C85A32] rounded-lg flex items-center justify-center">
                {success ? (
                  <XCircle className="w-4 h-4 text-white" />
                ) : (
                  <X className="w-4 h-4 text-white" />
                )}
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
          <div className="px-8 py-8 text-center">
            {/* Icon */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${isLoading ? 'bg-yellow-100' :
                success ? 'bg-green-100' :
                  'bg-red-100'
                }`}></div>
              <div className={`relative w-20 h-20 rounded-full flex items-center justify-center border-2 ${isLoading ? 'bg-yellow-50 border-yellow-100' :
                success ? 'bg-green-50 border-green-100' :
                  'bg-red-50 border-red-100'
                }`}>
                {isLoading ? (
                  <Loader2 className="w-9 h-9 text-yellow-500 animate-spin" />
                ) : success ? (
                  <XCircle className="w-9 h-9 text-green-500" />
                ) : (
                  <XCircle className="w-9 h-9 text-red-500" />
                )}
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-['Roboto'] font-bold text-[#1C1C1C] mb-2">
              {isLoading ? 'Processing...' : success ? 'Order Cancelled' : 'Payment Cancelled'}
            </h2>

            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {isLoading
                ? 'Please wait while we cancel your order...'
                : error
                  ? error
                  : success
                    ? 'Your order has been cancelled successfully. No charges were made.'
                    : 'Your payment was cancelled and no order has been generated.'}
            </p>

            {orderId && !success && !isLoading && !error && (
              <div className="bg-[#F5F0EA] rounded-xl p-4 mb-6 text-left">
                <p className="text-[#C85A32] text-xs font-bold uppercase tracking-widest mb-2">
                  Order Reference
                </p>
                <p className="text-sm font-mono text-[#1C1C1C]">{orderId}</p>
              </div>
            )}

            {/* What happened? */}
            {!isLoading && !success && !error && (
              <div className="bg-[#F5F0EA] rounded-xl p-4 mb-6 text-left">
                <p className="text-[#C85A32] text-xs font-bold uppercase tracking-widest mb-2">
                  What happened?
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-[#C85A32] rounded-full shrink-0"></span>
                    You cancelled the payment process
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-[#C85A32] rounded-full shrink-0"></span>
                    No money was deducted from your account
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-[#C85A32] rounded-full shrink-0"></span>
                    You can try again anytime
                  </li>
                </ul>
              </div>
            )}

            {/* Success message */}
            {success && (
              <div className="bg-green-50 rounded-xl p-4 mb-6 text-left border border-green-100">
                <p className="text-green-700 text-sm font-medium">
                  ✅ Your order has been cancelled. No charges were made to your account.
                </p>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-red-50 rounded-xl p-4 mb-6 text-left border border-red-100">
                <p className="text-red-700 text-sm font-medium">
                  ❌ {error}
                </p>
                <p className="text-red-500 text-xs mt-1">
                  Please contact support if you need assistance.
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <Link
                to="/digital-toolkit"
                className="w-full bg-[#C85A32] hover:bg-[#a8472a] text-white py-3 rounded-xl font-semibold text-sm transition-colors text-center flex items-center justify-center gap-2"
                onClick={() => {
                  localStorage.removeItem('pendingOrderId');
                  localStorage.removeItem('pendingPayment');
                }}
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Link>

              {success && (
                <button
                  onClick={() => {
                    const returnUrl =
                      localStorage.getItem("toolkitReturnUrl") || "/digital-toolkit";

                    localStorage.removeItem("toolkitReturnUrl");

                    window.location.href = returnUrl;
                  }}
                  className="w-full border border-gray-200 hover:bg-gray-50 text-gray-600 py-3 rounded-xl font-medium text-sm transition-colors text-center flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Browse More Tools
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentCancelled;