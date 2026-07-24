import React, { useState } from "react";
import {
  CheckCircle,
  User,
  Building2,
  Mail,
  Users,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

interface PartnershipFormProps {
  badge?: string;
  title?: string;
  description?: string;
  features?: Array<{
    id: number;
    text: string;
  }>;
  onSubmit?: (data: FormData) => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  organisation: string;
  email: string;
  partnershipType: string;
  message: string;
}

const PartnershipForm = ({
  badge = "Get Started",
  title = "Start Your Partnership Journey",
  description = "Tell us about your organisation and what you're looking to achieve. We'll be in touch within two business days to schedule a discovery call.",
  features: propFeatures,
  onSubmit,
}: PartnershipFormProps) => {
  const defaultFeatures = [
    {
      id: 1,
      text: "No obligation — just a conversation",
    },
    {
      id: 2,
      text: "Response within two business days",
    },
    {
      id: 3,
      text: "Tailored partnership proposal at no cost",
    },
  ];

  const features = propFeatures || defaultFeatures;

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    organisation: "",
    email: "",
    partnershipType: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      if (onSubmit) {
        onSubmit(formData);
      }
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        organisation: "",
        email: "",
        partnershipType: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <section id="partner-form" className="py-20 bg-white">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left Column - Content */}
          <div className="lg:w-2/5 shrink-0">
            <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest mb-4">
              {badge}
            </p>
            <h2 className="text-3xl md:text-[38px] font-['Roboto'] text-[#1C1C1C] leading-[1.15] mb-5">
              {title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {description}
            </p>

            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-[#C85A32] shrink-0" />
                  <span className="text-sm text-gray-600">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:w-3/5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    First name
                  </label>
                  <div className="flex items-center gap-2.5 border border-gray-200 bg-gray-50 hover:border-gray-300 rounded-xl px-3.5 py-2.5 focus-within:border-[#0F2D63] focus-within:ring-2 focus-within:ring-[#0F2D63]/10 transition-all">
                    <User className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Jane"
                      className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Last name
                  </label>
                  <div className="flex items-center gap-2.5 border border-gray-200 bg-gray-50 hover:border-gray-300 rounded-xl px-3.5 py-2.5 focus-within:border-[#0F2D63] focus-within:ring-2 focus-within:ring-[#0F2D63]/10 transition-all">
                    <User className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Organisation */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Organisation
                </label>
                <div className="flex items-center gap-2.5 border border-gray-200 bg-gray-50 hover:border-gray-300 rounded-xl px-3.5 py-2.5 focus-within:border-[#0F2D63] focus-within:ring-2 focus-within:ring-[#0F2D63]/10 transition-all">
                  <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    name="organisation"
                    value={formData.organisation}
                    onChange={handleChange}
                    placeholder="Your institution or organisation"
                    className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Email address
                </label>
                <div className="flex items-center gap-2.5 border border-gray-200 bg-gray-50 hover:border-gray-300 rounded-xl px-3.5 py-2.5 focus-within:border-[#0F2D63] focus-within:ring-2 focus-within:ring-[#0F2D63]/10 transition-all">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@organisation.org"
                    className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Partnership Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Partnership type
                </label>
                <div className="flex items-center gap-2.5 border border-gray-200 bg-gray-50 hover:border-gray-300 rounded-xl px-3.5 py-2.5 focus-within:border-[#0F2D63] focus-within:ring-2 focus-within:ring-[#0F2D63]/10 transition-all">
                  <Users className="w-4 h-4 text-gray-400 shrink-0" />
                  <select
                    name="partnershipType"
                    value={formData.partnershipType}
                    onChange={handleChange}
                    className="flex-1 text-sm bg-transparent outline-none text-gray-800 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select your organisation type</option>
                    <option value="university">University or Higher Education Institution</option>
                    <option value="research">Research Network or Consortium</option>
                    <option value="ngo">Global Development or NGO</option>
                    <option value="corporate">Corporate / CSI Team</option>
                    <option value="executive">Executive Leader or Founder</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Tell us about your communication needs
                </label>
                <div className="flex items-start gap-2.5 border border-gray-200 bg-gray-50 hover:border-gray-300 rounded-xl px-3.5 py-2.5 focus-within:border-[#0F2D63] focus-within:ring-2 focus-within:ring-[#0F2D63]/10 transition-all">
                  <MessageSquare className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Briefly describe your organisation's communications challenges and what you hope a partnership could achieve..."
                    className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400 resize-none"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C85A32] hover:bg-[#a8472a] text-white py-3.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#C85A32]/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    Submit Partnership Enquiry
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipForm;