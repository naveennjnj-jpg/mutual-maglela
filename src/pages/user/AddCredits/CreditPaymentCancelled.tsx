// pages/user/CreditPaymentCancelled.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  XCircle,
  Home,
  Loader2,
  ArrowLeft,
  X,
  Sparkles,
  Coins,
} from 'lucide-react';

const CreditPaymentCancelled: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const cancelOrder = async () => {
      // ✅ Check localStorage for pending order
      const pendingOrder = localStorage.getItem('pendingOrder');
      const hasPendingPayment = localStorage.getItem('pendingCreditPayment');

      console.log('🔍 Checking localStorage:', { pendingOrder, hasPendingPayment });

      if (!pendingOrder || !hasPendingPayment) {
        console.log('No pending order found in localStorage');
        setError('No pending order found');
        setIsLoading(false);
        return;
      }

      try {
        const orderData = JSON.parse(pendingOrder);
        setOrderId(orderData.orderNumber);

        setIsLoading(true);
        setError(null);

        // ✅ Simple API call to cancel order
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/credit/orders/${orderData.orderNumber}/cancel`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
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
        localStorage.removeItem('pendingOrder');
        localStorage.removeItem('pendingCreditPayment');
        localStorage.removeItem('creditReturnUrl');
      } catch (err) {
        console.error('❌ Error cancelling order:', err);
        setError(err instanceof Error ? err.message : 'Failed to cancel order');
      } finally {
        setIsLoading(false);
      }
    };

    cancelOrder();
  }, []);

  const returnUrl = localStorage.getItem('creditReturnUrl') || '/user/credits';

  return (
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
              localStorage.removeItem('pendingOrder');
              localStorage.removeItem('pendingCreditPayment');
              localStorage.removeItem('creditReturnUrl');
            }}
          >
            <X className="w-4 h-4" />
          </Link>
        </div>

        {/* Content */}
        <div className="px-8 py-8 text-center">
          {/* Icon */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div
              className={`absolute inset-0 rounded-full animate-ping opacity-30 ${
                isLoading
                  ? 'bg-yellow-100'
                  : success
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }`}
            ></div>
            <div
              className={`relative w-20 h-20 rounded-full flex items-center justify-center border-2 ${
                isLoading
                  ? 'bg-yellow-50 border-yellow-100'
                  : success
                  ? 'bg-green-50 border-green-100'
                  : 'bg-red-50 border-red-100'
              }`}
            >
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
            {isLoading ? 'Processing...' : success ? 'Order Cancelled' : 'Credit Purchase Cancelled'}
          </h2>

          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            {isLoading
              ? 'Please wait while we cancel your credit purchase...'
              : error
              ? error
              : success
              ? 'Your credit purchase has been cancelled successfully. No charges were made.'
              : 'Your credit purchase was cancelled and no order has been generated.'}
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
                  You cancelled the credit purchase process
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
                ✅ Your credit purchase has been cancelled. No charges were made to your account.
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 rounded-xl p-4 mb-6 text-left border border-red-100">
              <p className="text-red-700 text-sm font-medium">❌ {error}</p>
              <p className="text-red-500 text-xs mt-1">
                Please contact support if you need assistance.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Link
              to="/user/credits"
              className="w-full bg-[#C85A32] hover:bg-[#a8472a] text-white py-3 rounded-xl font-semibold text-sm transition-colors text-center flex items-center justify-center gap-2"
              onClick={() => {
                localStorage.removeItem('pendingOrder');
                localStorage.removeItem('pendingCreditPayment');
                localStorage.removeItem('creditReturnUrl');
              }}
            >
              <Home className="w-4 h-4" />
              Back to Credits
            </Link>

            {success && (
              <button
                onClick={() => {
                  const returnUrl =
                    localStorage.getItem('creditReturnUrl') || '/user/credits';
                  localStorage.removeItem('creditReturnUrl');
                  window.location.href = returnUrl;
                }}
                className="w-full border border-gray-200 hover:bg-gray-50 text-gray-600 py-3 rounded-xl font-medium text-sm transition-colors text-center flex items-center justify-center gap-2"
              >
                <Coins className="w-4 h-4" />
                Buy Credits Again
              </button>
            )}

            {!success && !isLoading && (
              <Link
                to="/user/add-credits"
                className="w-full border border-gray-200 hover:bg-gray-50 text-gray-600 py-3 rounded-xl font-medium text-sm transition-colors text-center flex items-center justify-center gap-2"
                onClick={() => {
                  localStorage.removeItem('pendingOrder');
                  localStorage.removeItem('pendingCreditPayment');
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Try Again
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditPaymentCancelled;