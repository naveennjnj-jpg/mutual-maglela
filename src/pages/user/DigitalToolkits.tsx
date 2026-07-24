// pages/user/DigitalToolkits.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Funnel,
  BookOpen,
  FileText,
  Image,
  Video,
  Layers,
  Star,
  Download,
  ShoppingCart,
  Loader2,
  AlertCircle,
  CheckCircle,
  User
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Toolkit {
  id: number | string;
  title: string;
  type: 'Guide' | 'Template' | 'Visual Kit' | 'Video Course' | 'Toolkit';
  description: string;
  tags: string[];
  rating: number;
  downloads: number;
  price: number;
  icon: React.ReactNode;
  isFree: boolean;
  fileUrl?: string;
  fileName?: string;
}

const DigitalToolkits = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // State
  const [toolkits, setToolkits] = useState<Toolkit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [processingId, setProcessingId] = useState<string | number | null>(null);

  const fetchCalled = useRef(false);

  // Filter options
  const filterOptions = ['All', 'Template', 'Visual Kit', 'Guide', 'Video Course', 'Toolkit', 'Free Only'];

  // Fetch toolkits
  useEffect(() => {
    if (!fetchCalled.current) {
      fetchCalled.current = true;
      fetchToolkits();
    }
  }, []);

  const fetchToolkits = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/toolkits`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const toolkitsData = response.data.data?.toolkits || response.data.data || [];
        if (Array.isArray(toolkitsData) && toolkitsData.length > 0) {
          setToolkits(toolkitsData);
        } else {
          setToolkits(getMockToolkits());
        }
      } else {
        setToolkits(getMockToolkits());
      }
    } catch (err: any) {
      console.error('Error fetching toolkits:', err);
      setToolkits(getMockToolkits());
    } finally {
      setLoading(false);
    }
  };

  // Get icon based on type
  const getIconForType = (type: string): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
      'Guide': <BookOpen className="w-5 h-5 text-[#C85A32]" />,
      'Template': <FileText className="w-5 h-5 text-[#C85A32]" />,
      'Visual Kit': <Image className="w-5 h-5 text-[#C85A32]" />,
      'Video Course': <Video className="w-5 h-5 text-[#C85A32]" />,
      'Toolkit': <Layers className="w-5 h-5 text-[#C85A32]" />,
    };
    return iconMap[type] || <FileText className="w-5 h-5 text-[#C85A32]" />;
  };

  // Mock data with file info
  const getMockToolkits = (): Toolkit[] => {
    return [
      {
        id: 1,
        title: "Institutional Communications Playbook",
        type: "Guide",
        description: "A comprehensive guide to building a world-class communications function within an African institution.",
        tags: ["Strategy", "Beginner"],
        rating: 4.9,
        downloads: 3240,
        price: 0,
        icon: <BookOpen className="w-5 h-5 text-[#C85A32]" />,
        isFree: true,
        fileUrl: "/uploads/pdfs/1-media-strategy-playbook.pdf",
        fileName: "Communications-Playbook.pdf"
      },
      {
        id: 2,
        title: "Press Release Template Pack (10 formats)",
        type: "Template",
        description: "10 professionally designed press release templates tailored for African universities and research bodies.",
        tags: ["PR", "Writing"],
        rating: 4.8,
        downloads: 2100,
        price: 299,
        icon: <FileText className="w-5 h-5 text-[#C85A32]" />,
        isFree: false,
        fileUrl: "/uploads/pdfs/2-crisis-communication-pack.pdf",
        fileName: "Press-Release-Templates.pdf"
      },
      {
        id: 3,
        title: "Annual Report Visual Toolkit",
        type: "Visual Kit",
        description: "High-quality infographic templates, icon sets, and layout guides for annual impact reports.",
        tags: ["Design", "Reports"],
        rating: 4.7,
        downloads: 890,
        price: 599,
        icon: <Image className="w-5 h-5 text-[#C85A32]" />,
        isFree: false,
        fileUrl: "/uploads/pdfs/3-brand-voice-guide.pdf",
        fileName: "Annual-Report-Kit.pdf"
      },
      {
        id: 4,
        title: "Crisis Communications Framework",
        type: "Guide",
        description: "A step-by-step framework for managing reputational crises in higher education contexts.",
        tags: ["Crisis", "Strategy"],
        rating: 4.9,
        downloads: 5600,
        price: 0,
        icon: <BookOpen className="w-5 h-5 text-[#C85A32]" />,
        isFree: true,
        fileUrl: "/uploads/pdfs/4-pr-pitch-deck-template.pdf",
        fileName: "Crisis-Communications.pdf"
      },
      {
        id: 5,
        title: "Social Media Content Calendar",
        type: "Template",
        description: "A ready-to-use 12-month content calendar with post templates for institutional social media channels.",
        tags: ["Digital", "Planning"],
        rating: 4.6,
        downloads: 1750,
        price: 199,
        icon: <FileText className="w-5 h-5 text-[#C85A32]" />,
        isFree: false,
        fileUrl: "/uploads/pdfs/5-content-calendar.pdf",
        fileName: "Social-Media-Calendar.pdf"
      },
      {
        id: 6,
        title: "Stakeholder Engagement Masterclass",
        type: "Video Course",
        description: "A 6-hour video course covering best practices for engaging government, donors, media, and alumni.",
        tags: ["Video", "Advanced"],
        rating: 4.8,
        downloads: 430,
        price: 1200,
        icon: <Video className="w-5 h-5 text-[#C85A32]" />,
        isFree: false,
        fileUrl: "/uploads/pdfs/6-stakeholder-mapping-toolkit.pdf",
        fileName: "Stakeholder-Engagement.pdf"
      },
      {
        id: 7,
        title: "Research Communication Starter Kit",
        type: "Toolkit",
        description: "Everything you need to start communicating research findings to non-specialist audiences.",
        tags: ["Research", "Beginner"],
        rating: 4.7,
        downloads: 2890,
        price: 0,
        icon: <Layers className="w-5 h-5 text-[#C85A32]" />,
        isFree: true,
        fileUrl: "/uploads/pdfs/7-executive-messaging-framework.pdf",
        fileName: "Research-Communications.pdf"
      },
      {
        id: 8,
        title: "Brand Voice Style Guide Template",
        type: "Template",
        description: "Build a consistent institutional voice with this comprehensive style guide template.",
        tags: ["Brand", "Writing"],
        rating: 4.9,
        downloads: 1240,
        price: 349,
        icon: <FileText className="w-5 h-5 text-[#C85A32]" />,
        isFree: false,
        fileUrl: "/uploads/pdfs/8-digital-pr-starter-kit.pdf",
        fileName: "Brand-Voice-Guide.pdf"
      },
    ];
  };

  // ✅ Create order and redirect to checkout
  const handleAddToCart = async (toolkit: Toolkit) => {
    if (!user) {
      setError('Please login to purchase toolkits');
      return;
    }

    setProcessingId(toolkit.id);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError('Authentication required. Please login again.');
        setProcessingId(null);
        return;
      }

      // ✅ Prepare order data with user info - make all fields optional
      const orderData = {
        userEmail: user.email,
        billingInfo: {
          firstName: user.name?.split(' ')[0] || 'User',
          lastName: user.name?.split(' ').slice(1).join(' ') || 'User',
          email: user.email,
          organisation: '',
          streetAddress: 'N/A',
          city: 'N/A',
          postalCode: 'N/A',
          country: 'South Africa'
        },
        items: [{
          productId: toolkit.id.toString(),
          title: toolkit.title,
          price: toolkit.price,
          quantity: 1,
          subtotal: toolkit.price,
          fileUrl: toolkit.fileUrl || '',
          fileName: toolkit.fileName || `${toolkit.title}.pdf`
        }]
      };

      // ✅ Create order and initiate PayFast payment
      const response = await fetch(`${API_URL}/api/toolkit/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Order creation failed');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Payment initiation failed');
      }

      // ✅ Store orderId in localStorage BEFORE redirect
      if (result.success && result.orderId) {
        localStorage.setItem('pendingOrderId', result.orderId);
        localStorage.setItem('pendingPayment', 'true');
        localStorage.setItem('orderItems', JSON.stringify([toolkit]));
        console.log('✅ Order ID stored in localStorage:', result.orderId);
          // Store the current page URL
  localStorage.setItem('toolkitReturnUrl', window.location.href);
      }

      setSuccessMessage('Redirecting to payment...');

      // ✅ Redirect to PayFast
      if (result.paymentUrl && result.paymentData) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = result.paymentUrl;

        Object.keys(result.paymentData).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = result.paymentData[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        return;
      }

      throw new Error('Payment initiation did not return a redirect URL');

    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create order');
      setProcessingId(null);
    } finally {
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  // Handle free download
  const handleFreeDownload = (toolkit: Toolkit) => {
    console.log('Downloading free toolkit:', toolkit.id);
    setSuccessMessage(`Downloading ${toolkit.title}...`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Filter toolkits
  const getFilteredToolkits = () => {
    let filtered = toolkits;

    if (activeFilter === 'Free Only') {
      filtered = filtered.filter(t => t.isFree);
    } else if (activeFilter !== 'All') {
      filtered = filtered.filter(t => t.type === activeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const filteredToolkits = getFilteredToolkits();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading toolkits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6">
      <div className="max-w-[1500px] mx-auto">
        {/* Header with User Info */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-1">
              Workspace
            </p>
            <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63] dark:text-white">
              Digital Toolkits
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Browse and download professional communication resources
            </p>
          </div>

          {/* User Info Card */}
          {user && (
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#C85A32]/10 flex items-center justify-center">
                <User className="w-4 h-4 text-[#C85A32]" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-[#0F2D63] dark:text-white">
                  {user.name || 'User'}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                  {user.email}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl text-sm mb-4">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search toolkits and templates…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#C85A32] bg-gray-50 dark:bg-gray-900 dark:text-white placeholder-gray-400 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Funnel className="w-4 h-4 text-gray-400" />
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeFilter === filter
                  ? 'bg-[#C85A32] text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Toolkits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {filteredToolkits.length > 0 ? (
            filteredToolkits.map((toolkit) => (
              <div
                key={toolkit.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex flex-col hover:shadow-md transition-shadow"
              >
                {/* Icon */}
                <div className="w-10 h-10 bg-[#FFF8F5] dark:bg-[#C85A32]/10 rounded-xl flex items-center justify-center mb-3">
                  {getIconForType(toolkit.type)}
                </div>

                {/* Title */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-[#0F2D63] dark:text-white leading-snug flex-1">
                    {toolkit.title}
                  </h3>
                </div>

                {/* Type */}
                <span className="text-[10px] text-gray-400 dark:text-gray-500 mb-2">
                  {toolkit.type}
                </span>

                {/* Description */}
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3 flex-1">
                  {toolkit.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {toolkit.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Rating and Downloads */}
                <div className="flex items-center gap-2 mb-3 text-xs text-gray-400 dark:text-gray-500">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium text-[#0F2D63] dark:text-white">{toolkit.rating}</span>
                  <span>·</span>
                  <Download className="w-3 h-3" />
                  <span>{toolkit.downloads.toLocaleString()}</span>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${toolkit.isFree ? 'text-green-600 dark:text-green-400' : 'text-[#0F2D63] dark:text-white'}`}>
                    {toolkit.isFree ? 'Free' : `R${toolkit.price}`}
                  </span>
                  {toolkit.isFree ? (
                    <button
                      onClick={() => handleFreeDownload(toolkit)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors bg-[#C85A32] hover:bg-[#a8472a] text-white"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(toolkit)}
                      disabled={processingId === toolkit.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors bg-[#C85A32] hover:bg-[#a8472a] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === toolkit.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <ShoppingCart className="w-3 h-3" />
                      )}
                      {processingId === toolkit.id ? 'Processing...' : 'Buy Now'}
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F2D63] dark:text-white mb-2">
                No toolkits found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm ? `No toolkits match "${searchTerm}"` : 'No toolkits available'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 px-1">
          {filteredToolkits.length} {filteredToolkits.length === 1 ? 'toolkit' : 'toolkits'} available
        </p>
      </div>
    </div>
  );
};

export default DigitalToolkits;