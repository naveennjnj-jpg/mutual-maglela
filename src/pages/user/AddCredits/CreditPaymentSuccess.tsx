// pages/user/CreditPaymentSuccess.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  X,
  CircleCheckBig,
  Loader2,
  Check,
  ArrowRight,
  Coins,
  Star,
} from 'lucide-react';

interface CreditOrderData {
  _id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  planName: string;
  planType: 'basic' | 'pro' | 'enterprise';
  credits: number;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  createdAt: string;
  paidAt?: string;
  creditDetails: {
    creditsPurchased: number;
    creditsBefore?: number;
    creditsAfter?: number;
  };
}

const CreditPaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<CreditOrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      const response = await fetch(`${API_BASE_URL}/api/user/credit/orders/${id}`);
      const data = await response.json();

      if (data.success) {
        setOrderData(data.data);
        // Clear pending data
        localStorage.removeItem('pendingOrder');
        localStorage.removeItem('pendingCreditPayment');
      } else {
        setError(data.message || 'Order not found');
      }
    } catch (err) {
      setError('Failed to fetch order status');
    } finally {
      setLoading(false);
    }
  };

  const isPaid = orderData?.status === 'paid' || orderData?.status === 'completed';
  const returnUrl = localStorage.getItem('creditReturnUrl') || '/user/credits';

  // Get plan icon and color
  const getPlanDetails = (type: string) => {
    switch (type) {
      case 'basic':
        return { icon: '🌟', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
      case 'pro':
        return { icon: '⭐', color: 'text-[#C85A32]', bg: 'bg-[#FFF8F5]', border: 'border-[#C85A32]/30' };
      case 'enterprise':
        return { icon: '🏢', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' };
      default:
        return { icon: '📦', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#F9F7F4] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#C85A32] mx-auto mb-4" />
          <p className="text-gray-600">Verifying your credit purchase...</p>
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
            {error || 'Unable to verify your credit purchase. Please contact support.'}
          </p>
          <Link
            to="/user/credits"
            className="inline-block bg-[#C85A32] hover:bg-[#a8472a] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            Return to Credits
          </Link>
        </div>
      </div>
    );
  }

  const planDetails = getPlanDetails(orderData.planType);

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
              localStorage.removeItem('pendingOrder');
              localStorage.removeItem('pendingCreditPayment');
              localStorage.removeItem('creditReturnUrl');
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
              Credits Added Successfully! 🎉
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Your credits have been added to your account. Start using them right away!
            </p>

            {/* Credit Summary */}
            <div className={`${planDetails.bg} rounded-xl p-4 mb-6 text-left border ${planDetails.border}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#C85A32] text-xs font-bold uppercase tracking-widest">
                  Credit Purchase Summary
                </p>
                <span className={`text-xs font-semibold ${planDetails.color}`}>
                  {planDetails.icon} {orderData.planType.charAt(0).toUpperCase() + orderData.planType.slice(1)}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Plan</span>
                  <span className="text-sm font-semibold text-[#1C1C1C]">{orderData.planName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Credits Purchased</span>
                  <span className="text-sm font-bold text-[#C85A32] flex items-center gap-1">
                    <Coins className="w-4 h-4" />
                    {orderData.credits.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Billing Cycle</span>
                  <span className="text-sm font-medium capitalize text-[#1C1C1C]">{orderData.billingCycle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount Paid</span>
                  <span className="text-sm font-bold text-[#0F2D63]">R{orderData.totalAmount}</span>
                </div>
                {orderData.creditDetails.creditsBefore !== undefined && (
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Previous Balance</span>
                    <span className="text-sm text-gray-600">{orderData.creditDetails.creditsBefore} credits</span>
                  </div>
                )}
                {orderData.creditDetails.creditsAfter !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-[#1C1C1C]">New Balance</span>
                    <span className="text-sm font-bold text-[#C85A32] flex items-center gap-1">
                      <Coins className="w-4 h-4" />
                      {orderData.creditDetails.creditsAfter.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs ${isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {isPaid ? '✅ Paid' : '⏳ Pending'}
                </span>
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
                  <Coins className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                  Your credits are ready to use
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <Sparkles className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                  Start a new project or use AI tools
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                  Check your email for confirmation
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <Link
                to="/user"
                className="w-full bg-[#C85A32] hover:bg-[#a8472a] text-white py-3 rounded-xl font-semibold text-sm transition-colors text-center flex items-center justify-center gap-2"
                onClick={() => {
                  localStorage.removeItem('pendingOrder');
                  localStorage.removeItem('pendingCreditPayment');
                  localStorage.removeItem('creditReturnUrl');
                }}
              >
                <ArrowRight className="w-4 h-4" />
                Go to Dashboard
              </Link>

              <Link
                to="/user/add-credits"
                className="w-full border border-gray-200 hover:bg-gray-50 text-gray-600 py-3 rounded-xl font-medium text-sm transition-colors text-center flex items-center justify-center gap-2"
              >
                <Coins className="w-4 h-4" />
                Buy More Credits
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditPaymentSuccess;