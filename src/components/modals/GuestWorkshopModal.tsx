// components/modals/GuestWorkshopModal.tsx
import React, { useState } from 'react';
import {
    X,
    Sparkles,
    Mic,
    FlaskConical,
    Monitor,
    MapPin,
    Clock,
    Users,
    User,
    Mail,
    ChevronRight,
    CircleCheck,
    Loader2,
    AlertCircle,
    Calendar,
    CheckCircle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface GuestWorkshopModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface FormData {
    serviceType: string;
    attendanceType: string;
    duration: string;
    participants: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    organisation: string;
    specialRequests: string;
    date: string;
    time: string;
}

const GuestWorkshopModal: React.FC<GuestWorkshopModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const { user } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    // ✅ Generate time slots for the dropdown
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 6; hour <= 22; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const h = hour.toString().padStart(2, '0');
                const m = minute.toString().padStart(2, '0');
                const timeString = `${h}:${m}`;
                const displayHour = hour > 12 ? hour - 12 : hour;
                const ampm = hour >= 12 ? 'PM' : 'AM';
                slots.push({
                    value: timeString,
                    label: `${displayHour}:${m} ${ampm}`
                });
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const [formData, setFormData] = useState<FormData>({
        serviceType: 'media-training',
        attendanceType: 'online',
        duration: '2',
        participants: '',
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
        email: user?.email || '',
        phone: '',
        organisation: '',
        specialRequests: '',
        date: '',
        time: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceSelect = (service: string) => {
        setFormData(prev => ({ ...prev, serviceType: service }));
    };

    const nextStep = () => {
        if (currentStep < 2) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.date) {
            setError('Please select a date for the workshop');
            return;
        }
        if (!formData.time) {
            setError('Please select a time for the workshop');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const isLoggedIn = !!token && !!user;

            const submitData = {
                serviceType: formData.serviceType,
                attendanceType: formData.attendanceType,
                duration: formData.duration,
                participants: parseInt(formData.participants) || 0,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                organisation: formData.organisation,
                specialRequests: formData.specialRequests,
                date: formData.date,
                time: formData.time,
                status: "pending",
            };

            console.log("Submitting workshop data:", submitData);
            console.log("Is logged in:", isLoggedIn);

            let response;

            if (isLoggedIn) {
                response = await axios.post(
                    `${API_URL}/api/auth/workshops`,
                    submitData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else {
                response = await axios.post(
                    `${API_URL}/api/auth/workshops-guest`,
                    submitData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }

            if (response.data.success) {
                setShowSuccess(true);
                setCurrentStep(1);
                setIsSubmitting(false);
                
                setFormData({
                    serviceType: 'media-training',
                    attendanceType: 'online',
                    duration: '2',
                    participants: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    organisation: '',
                    specialRequests: '',
                    date: '',
                    time: ''
                });
            } else {
                setError(response.data.message || 'Failed to create workshop');
                setIsSubmitting(false);
            }
        } catch (err: any) {
            console.error('Error creating workshop:', err);
            setError(err.response?.data?.message || 'Failed to create workshop');
            setIsSubmitting(false);
        }
    };

    // ✅ Render Success Message
    const renderSuccess = () => {
        return (
            <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-500 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-[#1C1C1C] dark:text-white mb-2">
                    Thank You!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    Your workshop request has been submitted successfully.
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                    Our team will review your request and get back to you shortly.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 text-left">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                        <span className="font-semibold">📧 Confirmation Email:</span>
                        <br />
                        A confirmation email has been sent to <strong>{formData.email}</strong> 
                        with the details of your request.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setShowSuccess(false);
                        onSuccess();
                        onClose();
                    }}
                    className="w-full bg-[#C85A32] hover:bg-[#a8472a] text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-md shadow-[#C85A32]/20"
                >
                    Done
                </button>
            </div>
        );
    };

    // Step 2: Select Service
    const renderServiceSelection = () => {
        const services = [
            {
                id: 'media-training',
                icon: Mic,
                title: 'Media Training',
                description: 'Handle interviews, press conferences, and media scrutiny with confidence.'
            },
            {
                id: 'science-communication',
                icon: FlaskConical,
                title: 'Science Communication',
                description: 'Translate complex research findings for public and policy audiences.'
            }
        ];

        return (
            <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                        <span className="font-semibold">Guest Mode:</span> You're creating a workshop as a guest. Your information will be saved with a guest ID.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-[#1C1C1C] dark:text-white">Select a Service</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Choose the workshop type that fits your organisation's needs.
                    </p>
                </div>

                <div className="space-y-3">
                    {services.map((service) => {
                        const Icon = service.icon;
                        const isSelected = formData.serviceType === service.id;

                        return (
                            <button
                                key={service.id}
                                onClick={() => handleServiceSelect(service.id)}
                                className={`relative flex items-start gap-4 w-full rounded-2xl p-4 text-left transition-all border-2 ${isSelected
                                    ? 'border-[#0F2D63] shadow-md shadow-[#0F2D63]/10 bg-[#fff4f0]'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-[#C85A32]/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isSelected
                                    ? 'bg-[#C85A32]/10'
                                    : 'bg-gray-100 dark:bg-gray-700'
                                    }`}>
                                    <Icon className={`w-5 h-5 ${isSelected
                                        ? 'text-[#C85A32]'
                                        : 'text-gray-500 dark:text-gray-400'
                                        }`} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className={`font-semibold text-sm ${isSelected
                                        ? 'text-[#1C1C1C] dark:text-white'
                                        : 'text-[#1C1C1C] dark:text-white'
                                        }`}>
                                        {service.title}
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>

                                <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${isSelected
                                    ? 'border-[#0F2D63] bg-[#0F2D63]'
                                    : 'border-gray-300 dark:border-gray-600'
                                    }`}>
                                    {isSelected && (
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        onClick={nextStep}
                        disabled={!formData.serviceType}
                        className="w-full bg-[#C85A32] hover:bg-[#a8472a] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-[#C85A32]/20 disabled:shadow-none"
                    >
                        Continue
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    // Step 3: Configure Workshop
    const renderConfigureWorkshop = () => {
        const serviceLabels: Record<string, string> = {
            'media-training': 'Media Training',
            'science-communication': 'Science Communication'
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center gap-2 bg-[#0F2D63]/10 border border-[#0F2D63]/20 rounded-xl px-3.5 py-2 w-fit">
                    <FlaskConical className="w-3.5 h-3.5 text-[#0F2D63]" />
                    <span className="text-xs font-semibold text-[#0F2D63]">
                        {serviceLabels[formData.serviceType] || 'Service'}
                    </span>
                    <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-[#0F2D63]/40 hover:text-[#0F2D63] text-xs ml-1 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <h2 className="text-xl font-bold text-[#1C1C1C] dark:text-white">
                    Configure Your Workshop
                </h2>

                {/* ✅ Date & Time Picker */}
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Schedule Date & Time
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Date Picker */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                                Date *
                            </label>
                            <div className="relative">
                                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type="date"
                                    name="date"
                                    min={today}
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all pl-9 cursor-pointer"
                                    required
                                />
                            </div>
                        </div>

                        {/* ✅ Time Dropdown Selector */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                                Time *
                            </label>
                            <div className="relative">
                                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <select
                                    name="time"
                                    value={formData.time}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all pl-9 appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="">Select time</option>
                                    {timeSlots.map((slot) => (
                                        <option key={slot.value} value={slot.value}>
                                            {slot.label}
                                        </option>
                                    ))}
                                </select>
                                {/* Custom dropdown arrow */}
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance Type */}
                <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                        How would you like to attend?
                    </p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, attendanceType: "online" }))}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all flex-1 ${formData.attendanceType === "online"
                                    ? "border-[#0F2D63] bg-[#0F2D63] text-white shadow-md shadow-[#0F2D63]/20"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            <Monitor className="w-4 h-4" />
                            Online
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, attendanceType: "in-person" }))}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all flex-1 ${formData.attendanceType === "in-person"
                                    ? "border-[#0F2D63] bg-[#0F2D63] text-white shadow-md shadow-[#0F2D63]/20"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            <MapPin className="w-4 h-4" />
                            In Person
                        </button>
                    </div>
                </div>

                {/* Session Duration */}
                <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                        Session duration
                    </p>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, duration: "2" }))}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all flex-1 ${formData.duration === "2"
                                    ? "border-[#0F2D63] bg-[#0F2D63] text-white shadow-md shadow-[#0F2D63]/20"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            <Clock className="w-4 h-4" />
                            2 Hours
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, duration: "4" }))}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all flex-1 ${formData.duration === "4"
                                    ? "border-[#0F2D63] bg-[#0F2D63] text-white shadow-md shadow-[#0F2D63]/20"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            <Clock className="w-4 h-4" />
                            4 Hours
                        </button>
                    </div>
                </div>

                {/* Personal Details */}
                <div className="space-y-3.5 pt-1">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                            Number of participants
                        </label>
                        <div className="flex items-center gap-3 border rounded-xl px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-[#C85A32]/20 focus-within:border-[#C85A32] border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-gray-300">
                            <Users className="w-4 h-4 text-gray-400 shrink-0" />
                            <input
                                type="number"
                                name="participants"
                                min="1"
                                placeholder="e.g. 20"
                                value={formData.participants}
                                onChange={handleInputChange}
                                className="flex-1 text-sm bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                                First name
                            </label>
                            <div className="flex items-center gap-3 border rounded-xl px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-[#C85A32]/20 focus-within:border-[#C85A32] border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-gray-300">
                                <User className="w-4 h-4 text-gray-400 shrink-0" />
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Jane"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="flex-1 text-sm bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                                Last name
                            </label>
                            <div className="flex items-center gap-3 border rounded-xl px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-[#C85A32]/20 focus-within:border-[#C85A32] border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-gray-300">
                                <User className="w-4 h-4 text-gray-400 shrink-0" />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="flex-1 text-sm bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                            Email address
                        </label>
                        <div className="flex items-center gap-3 border rounded-xl px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-[#C85A32]/20 focus-within:border-[#C85A32] border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-gray-300">
                            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                            <input
                                type="email"
                                name="email"
                                placeholder="you@organisation.org"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="flex-1 text-sm bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400"
                                required
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-3 py-2 rounded-xl text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="flex gap-3 pt-3">
                    <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-2.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-medium text-sm transition-colors"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-[#C85A32] hover:bg-[#a8472a] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-[#C85A32]/20 disabled:shadow-none flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Request Now'
                        )}
                    </button>
                </div>
            </form>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-[480px] overflow-hidden flex flex-col">
                <div className="bg-[#0F2D63] dark:bg-[#0F2D63] px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-[#C85A32] rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-white text-sm tracking-wide uppercase">
                            Magalela
                        </span>
                        <span className="ml-2 text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full">
                            Guest
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="px-6 py-6 overflow-y-auto max-h-[80vh]">
                    {showSuccess ? (
                        renderSuccess()
                    ) : (
                        <>
                            <div className="flex items-center gap-0 mb-6">
                                <div className="flex items-center flex-1">
                                    <div className="flex items-center gap-2 shrink-0">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep === 1 ? 'bg-[#C85A32] text-white' :
                                            currentStep > 1 ? 'bg-[#C85A32] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                                            }`}>
                                            {currentStep > 1 ? (
                                                <CircleCheck className="w-4 h-4" />
                                            ) : (
                                                1
                                            )}
                                        </div>
                                        <span className={`text-xs font-medium hidden sm:block ${currentStep === 1 ? 'text-[#0F2D63] dark:text-white' : 'text-gray-400'
                                            }`}>
                                            Select Service
                                        </span>
                                    </div>
                                    <div className="flex-1 mx-3 h-px bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                                        <div className={`absolute inset-y-0 left-0 bg-[#C85A32] transition-all duration-500 ${currentStep > 1 ? 'w-full' : 'w-0'
                                            }`}></div>
                                    </div>
                                </div>

                                <div className="flex items-center flex-1">
                                    <div className="flex items-center gap-2 shrink-0">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep === 2 ? 'bg-[#C85A32] text-white' : 'bg-[#0F2D63] text-white'
                                            }`}>
                                            2
                                        </div>
                                        <span className={`text-xs font-medium hidden sm:block ${currentStep === 2 ? 'text-[#0F2D63] dark:text-white' : 'text-gray-400'
                                            }`}>
                                            Configure
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {currentStep === 1 && renderServiceSelection()}
                            {currentStep === 2 && renderConfigureWorkshop()}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuestWorkshopModal;