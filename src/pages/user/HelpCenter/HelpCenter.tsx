// pages/user/HelpCenter.tsx
import React, { useState } from "react";
import {
  Search,
  Book,
  ExternalLink,
  Video,
  MessageCircle,
  Mail,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import axios from "axios";

// ============================================
// INTERFACES / TYPES
// ============================================

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface GuideItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

const HelpCenter = () => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaqs, setExpandedFaqs] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ============================================
  // DATA
  // ============================================

  const popularGuides: GuideItem[] = [
    {
      id: "quick-start",
      title: "Quick Start Guide",
      description: "Get up and running in 5 minutes",
      icon: <Book className="w-4 h-4 text-[#C85A32]" />,
      link: "/user/help/quick-start",
    },
    {
      id: "ai-writing",
      title: "AI Writing Best Practices",
      description: "Tips for getting the best results",
      icon: <Book className="w-4 h-4 text-[#C85A32]" />,
      link: "/user/help/ai-writing",
    },
    {
      id: "workshop-walkthrough",
      title: "Workshop Registration Walkthrough",
      description: "How to find and register for workshops",
      icon: <Video className="w-4 h-4 text-[#C85A32]" />,
      link: "/user/help/workshop-walkthrough",
    },
    {
      id: "managing-projects",
      title: "Managing Your Projects",
      description: "Complete project lifecycle guide",
      icon: <Book className="w-4 h-4 text-[#C85A32]" />,
      link: "/user/help/managing-projects",
    },
  ];

  const faqs: FaqItem[] = [
    // Getting Started
    {
      id: "faq-1",
      category: "Getting Started",
      question: "How do I create my first project?",
      answer:
        "To create your first project, click the 'Create Project' button on your dashboard. Fill in the project details including title, type, description, and deadline. You can also attach supporting documents and choose how you'd like to proceed (Hire Expert, AI Writing, or AI Speech). Once submitted, our team will review and begin work within 24 hours.",
    },
    {
      id: "faq-2",
      category: "Getting Started",
      question: "What is included in the free plan?",
      answer:
        "The free plan includes access to basic AI Writing tools, project creation, community support, and up to 3 active projects. You'll also have access to our knowledge base and can participate in free workshops.",
    },
    {
      id: "faq-3",
      category: "Getting Started",
      question: "Can I invite team members to my workspace?",
      answer:
        "Yes! Workspace collaboration is available on our Pro and Enterprise plans. You can invite team members by going to Settings > Team Members and entering their email addresses. Each team member will receive an invitation to join your workspace.",
    },
    // AI Writing
    {
      id: "faq-4",
      category: "AI Writing",
      question: "How does the AI Writing tool work?",
      answer:
        "The AI Writing tool uses advanced language models to generate content based on your input. Simply provide a topic, outline, or brief, and the AI will generate coherent, well-structured content. You can refine the output by providing additional context or specific requirements.",
    },
    {
      id: "faq-5",
      category: "AI Writing",
      question: "Can I use AI Writing for multilingual content?",
      answer:
        "Yes! Our AI Writing tool supports multiple languages. You can specify the language preference in the project settings or when generating content. The AI will produce content in your chosen language with proper grammar and style.",
    },
    {
      id: "faq-6",
      category: "AI Writing",
      question: "How do I save and export generated content?",
      answer:
        "Generated content can be saved directly to your project dashboard. You can also export content in various formats including DOCX, PDF, and TXT using the export button in the content editor.",
    },
    // Billing & Plans
    {
      id: "faq-7",
      category: "Billing & Plans",
      question: "How do I upgrade my plan?",
      answer:
        "To upgrade your plan, navigate to Settings > Billing & Plans. Choose the plan that best suits your needs and follow the checkout process. Your subscription will be upgraded immediately, and you'll have access to all premium features.",
    },
    {
      id: "faq-8",
      category: "Billing & Plans",
      question: "What payment methods are accepted?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for enterprise plans. All payments are processed securely through our payment gateway.",
    },
    {
      id: "faq-9",
      category: "Billing & Plans",
      question: "Can I cancel my subscription at any time?",
      answer:
        "Yes, you can cancel your subscription at any time from your billing settings. There are no cancellation fees. If you cancel, you'll continue to have access to your plan features until the end of your current billing period.",
    },
    // Expert Consultations
    {
      id: "faq-10",
      category: "Expert Consultations",
      question: "How do I book an expert consultation?",
      answer:
        "To book an expert consultation, go to the 'Hire Expert' section and browse available experts. Select your preferred expert, choose a time slot, and complete the booking process. You'll receive a confirmation email with meeting details.",
    },
    {
      id: "faq-11",
      category: "Expert Consultations",
      question: "What is the cancellation policy for consultations?",
      answer:
        "You can cancel or reschedule a consultation up to 24 hours before the scheduled time without any penalty. Cancellations within 24 hours may be subject to a fee. Please review the expert's specific cancellation policy when booking.",
    },
  ];

  // Group FAQs by category
  const groupedFaqs = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FaqItem[]>);

  // ============================================
  // HANDLERS
  // ============================================

  const toggleFaq = (id: string) => {
    setExpandedFaqs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
    console.log("Searching for:", searchQuery);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user starts typing again
    if (successMessage) setSuccessMessage(null);
    if (errorMessage) setErrorMessage(null);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setSuccessMessage(null);
    setErrorMessage(null);
    
    // Set sending state
    setIsSending(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/contact/send-message`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        // Show success message
        setSuccessMessage("Your message has been sent successfully! We'll get back to you within 24 hours.");
        
        // Reset form
        setFormData({
          subject: "",
          message: "",
        });
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || 
        "Failed to send message. Please try again later."
      );
    } finally {
      setIsSending(false);
    }
  };

  // Filter FAQs based on search
  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const filteredGroupedFaqs = searchQuery
    ? filteredFaqs.reduce((acc, faq) => {
        if (!acc[faq.category]) {
          acc[faq.category] = [];
        }
        acc[faq.category].push(faq);
        return acc;
      }, {} as Record<string, FaqItem[]>)
    : groupedFaqs;

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-[#F9F7F4] p-6">
      <div className="max-w-[1000px] mx-auto">
        {/* ==========================================
            HEADER
            ========================================== */}
        <div className="mb-6">
          <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-1">
            Support
          </p>
          <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63]">
            Help Center
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Find answers, guides, and get in touch with our team
          </p>
        </div>

        {/* ==========================================
            HERO / SEARCH SECTION
            ========================================== */}
        <div className="relative bg-[#0F2D63] rounded-2xl overflow-hidden mb-8">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(at 20% 50%, rgb(200, 90, 50) 0%, transparent 60%)",
            }}
          ></div>
          <div className="relative px-8 py-12 flex flex-col items-center text-center">
            <p className="text-[#C85A32] text-xs font-bold uppercase tracking-widest mb-3">
              Support Centre
            </p>
            <h2 className="text-white text-3xl md:text-4xl font-['Roboto'] font-bold mb-3 leading-tight">
              How can we Help?
            </h2>
            <p className="text-white/60 text-sm md:text-base max-w-md mb-8 leading-relaxed">
              Search our knowledge base, browse guides, or reach out to our team
              — we're here to help you succeed.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-xl">
              <div className="flex items-center bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="flex items-center pl-4 pr-2 flex-shrink-0">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search FAQs, guides, and topics…"
                  className="flex-1 px-2 py-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="m-1.5 px-5 py-2.5 bg-[#C85A32] hover:bg-[#a8472a] text-white text-sm font-semibold rounded-lg transition-colors flex-shrink-0"
                >
                  Search
                </button>
              </div>
              <p className="text-white/40 text-xs mt-3">
                Popular: AI Writing · Billing · Expert consultations · Projects
              </p>
            </form>
          </div>
        </div>

        {/* ==========================================
            POPULAR GUIDES
            ========================================== */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[#0F2D63] mb-4">
            Popular Guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularGuides.map((guide) => (
              <button
                key={guide.id}
                onClick={() => console.log("Navigate to:", guide.link)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left hover:shadow-md hover:border-[#C85A32]/30 transition-all group"
              >
                <div className="w-8 h-8 bg-[#FFF8F5] rounded-xl flex items-center justify-center mb-3">
                  {guide.icon}
                </div>
                <p className="text-xs font-semibold text-[#0F2D63] mb-1">
                  {guide.title}
                </p>
                <p className="text-[10px] text-gray-400">{guide.description}</p>
                <div className="flex items-center gap-1 mt-2 text-[#C85A32] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-medium">Read</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ==========================================
            FAQ SECTION
            ========================================== */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[#0F2D63] mb-4">
            Frequently Asked Questions
          </h2>

          {/* Show message if search has no results */}
          {searchQuery && Object.keys(filteredGroupedFaqs).length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <p className="text-gray-500 text-sm">
                No results found for "{searchQuery}"
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Try adjusting your search terms or browse the categories below
              </p>
            </div>
          )}

          <div className="space-y-4">
            {Object.entries(filteredGroupedFaqs).map(([category, categoryFaqs]) => (
              <div key={category}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">
                  {category}
                </p>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {categoryFaqs.map((faq, index) => (
                    <div
                      key={faq.id}
                      className={`border-b border-gray-50 last:border-0 ${
                        expandedFaqs.has(faq.id) ? "bg-gray-50/50" : ""
                      }`}
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors group"
                      >
                        <span className="text-sm font-medium text-[#0F2D63] pr-4">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${
                            expandedFaqs.has(faq.id) ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {expandedFaqs.has(faq.id) && (
                        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            CONTACT SECTION
            ========================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-4 h-4 text-[#C85A32]" />
              <h2 className="text-sm font-semibold text-[#0F2D63]">
                Send a Message
              </h2>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Subject
                </label>
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  placeholder="What do you need help with?"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C85A32] transition-colors"
                  required
                  disabled={isSending}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  rows={4}
                  placeholder="Describe your issue in detail…"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-[#C85A32] transition-colors"
                  required
                  disabled={isSending}
                />
              </div>
              <button
                type="submit"
                disabled={isSending}
                className={`w-full bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                  isSending ? "opacity-80 cursor-not-allowed" : ""
                }`}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>

          {/* Contact Options */}
          <div className="flex flex-col gap-4">
            {/* Email Support */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-3">
              <div className="w-10 h-10 bg-[#FFF8F5] rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#C85A32]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F2D63]">
                  Email Support
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  support@magalela.com
                </p>
                <p className="text-xs text-gray-400">
                  Response within 24 hours
                </p>
              </div>
            </div>

            {/* Live Chat */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-3">
              <div className="w-10 h-10 bg-[#FFF8F5] rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-[#C85A32]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F2D63]">Live Chat</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Available Mon–Fri, 08:00–18:00 SAST
                </p>
                <button className="text-xs text-[#C85A32] font-medium mt-1 hover:underline">
                  Start Chat
                </button>
              </div>
            </div>

            {/* Enterprise Support */}
            <div className="bg-[#0F2D63] rounded-2xl p-5">
              <p className="text-white font-semibold text-sm mb-1">
                Need urgent help?
              </p>
              <p className="text-white/60 text-xs mb-3">
                Enterprise clients have access to 24/7 priority support.
              </p>
              <button className="text-xs bg-[#C85A32] hover:bg-[#a8472a] text-white px-4 py-2 rounded-xl font-medium transition-colors">
                View Enterprise Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;