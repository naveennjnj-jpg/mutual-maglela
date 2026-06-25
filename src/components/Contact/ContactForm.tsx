import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone, MapPin, Clock, Users } from "lucide-react";

interface ContactFormProps {
  badge?: string;
  title?: string;
  submitButtonText?: string;
  formFields?: {
    firstName: { label: string; placeholder: string; required: boolean };
    lastName: { label: string; placeholder: string; required: boolean };
    organisation: { label: string; placeholder: string; required: boolean };
    jobTitle: { label: string; placeholder: string; required: boolean };
    email: { label: string; placeholder: string; required: boolean };
    message: { label: string; placeholder: string; required: boolean };
  };
  contactInfo?: {
    email: string;
    phone: string;
    location: string;
  };
  responseTime?: {
    title: string;
    description: string;
    highlight: string;
  };
  existingClients?: {
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
  };
  bgColor?: string;
  textColor?: string;
  badgeColor?: string;
  cardBgColor?: string;
  cardBorderColor?: string;
  inputBgColor?: string;
  inputBorderColor?: string;
  buttonColor?: string;
  buttonHoverColor?: string;
  maxWidth?: string;
  padding?: string;
  titleSize?: string;
  onSubmit?: (data: any) => void;
}

const ContactForm = ({
  badge = "Send a Message",
  title = "Get In Touch",
  submitButtonText = "Get In Touch",
  formFields = {
    firstName: { label: "First Name", placeholder: "Jane", required: true },
    lastName: { label: "Last Name", placeholder: "Doe", required: true },
    organisation: { label: "Organisation", placeholder: "Your institution", required: false },
    jobTitle: { label: "Job Title", placeholder: "e.g. Communications Director", required: false },
    email: { label: "Email Address", placeholder: "you@organisation.org", required: true },
    message: { label: "Message", placeholder: "Tell us about your communication needs...", required: true },
  },
  contactInfo = {
    email: "hello@magalelamed.co.za",
    phone: "+27 11 000 0000",
    location: "169 Oxford Road, Rosebank, Johannesburg",
  },
  responseTime = {
    title: "Response Time",
    description: "We respond to every enquiry within ",
    highlight: "24 business hours",
  },
  existingClients = {
    title: "Existing Clients",
    description: "Already working with us? Reach your dedicated account manager directly via your project inbox or email below.",
    placeholder: "your@email.com",
    buttonText: "Send",
  },
  bgColor = "bg-[#F5F0EA]",
  textColor = "text-[#1C1C1C]",
  badgeColor = "text-[#C85A32]",
  cardBgColor = "bg-white",
  cardBorderColor = "border-gray-100",
  inputBgColor = "bg-gray-50",
  inputBorderColor = "border-gray-200",
  buttonColor = "bg-[#C85A32]",
  buttonHoverColor = "hover:bg-[#a8472a]",
  maxWidth = "max-w-[1500px]",
  padding = "py-20",
  titleSize = "text-2xl",
  onSubmit,
}: ContactFormProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    organisation: "",
    jobTitle: "",
    email: "",
    message: "",
  });
  const [clientEmail, setClientEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        jobTitle: "",
        email: "",
        message: "",
      });
    }, 1500);
  };

  const handleClientEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Client email:", clientEmail);
    setClientEmail("");
  };

  return (
    <section id="form" className={`${padding} ${bgColor}`}>
      <div className={`${maxWidth} mx-auto px-6 lg:px-8`}>
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Form Column */}
          <div className={`lg:w-[58%] ${cardBgColor} rounded-2xl border ${cardBorderColor} shadow-sm p-8`}>
            {badge && (
              <p className={`${badgeColor} text-xs font-semibold uppercase tracking-widest mb-3`}>
                {badge}
              </p>
            )}
            {title && (
              <h2 className={`${titleSize} font-['Roboto'] font-bold ${textColor} mb-6`}>
                {title}
              </h2>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    {formFields.firstName.label}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder={formFields.firstName.placeholder}
                    required={formFields.firstName.required}
                    className={`w-full border ${inputBorderColor} ${inputBgColor} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    {formFields.lastName.label}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder={formFields.lastName.placeholder}
                    required={formFields.lastName.required}
                    className={`w-full border ${inputBorderColor} ${inputBgColor} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    {formFields.organisation.label}
                  </label>
                  <input
                    type="text"
                    name="organisation"
                    value={formData.organisation}
                    onChange={handleChange}
                    placeholder={formFields.organisation.placeholder}
                    required={formFields.organisation.required}
                    className={`w-full border ${inputBorderColor} ${inputBgColor} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    {formFields.jobTitle.label}
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder={formFields.jobTitle.placeholder}
                    required={formFields.jobTitle.required}
                    className={`w-full border ${inputBorderColor} ${inputBgColor} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  {formFields.email.label}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={formFields.email.placeholder}
                  required={formFields.email.required}
                  className={`w-full border ${inputBorderColor} ${inputBgColor} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  {formFields.message.label}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder={formFields.message.placeholder}
                  required={formFields.message.required}
                  className={`w-full border ${inputBorderColor} ${inputBgColor} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${buttonColor} ${buttonHoverColor} text-white py-3.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? "Sending..." : submitButtonText}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Sidebar Column */}
          <div className="lg:w-[42%] flex flex-col gap-5">
            {/* Contact Information */}
            <div className={`${cardBgColor} rounded-2xl border ${cardBorderColor} shadow-sm p-6`}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                Contact Information
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#F5F0EA] rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#C85A32]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Email</p>
                    <p className="text-sm text-gray-700 mt-0.5">{contactInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#F5F0EA] rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#C85A32]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Phone</p>
                    <p className="text-sm text-gray-700 mt-0.5">{contactInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#F5F0EA] rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#C85A32]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Location</p>
                    <p className="text-sm text-gray-700 mt-0.5">{contactInfo.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className={`${cardBgColor} rounded-2xl border ${cardBorderColor} shadow-sm p-6`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-[#F5F0EA] rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#C85A32]" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {responseTime.title}
                </p>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {responseTime.description}
                <span className="font-semibold text-[#0F2D63]">{responseTime.highlight}</span>.
              </p>
            </div>

            {/* Existing Clients */}
            <div className="bg-[#0F2D63] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                  {existingClients.title}
                </p>
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                {existingClients.description}
              </p>
              <form onSubmit={handleClientEmailSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder={existingClients.placeholder}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-white/40 transition-all"
                  required
                />
                <button
                  type="submit"
                  className={`${buttonColor} ${buttonHoverColor} text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shrink-0`}
                >
                  {existingClients.buttonText}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;