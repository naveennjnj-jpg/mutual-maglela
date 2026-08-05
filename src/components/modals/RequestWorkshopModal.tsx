// components/modals/RequestWorkshopModal.tsx
import React from 'react';
import { X, Sparkles, Mic, ArrowRight, UserPlus, CircleUserRound } from 'lucide-react';

interface RequestWorkshopModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGuestContinue?: () => void;    // ✅ Opens GuestWorkshopModal
    onCreateAccount?: () => void;    // ✅ Redirects to login
}

const RequestWorkshopModal: React.FC<RequestWorkshopModalProps> = ({
    isOpen,
    onClose,
    onGuestContinue,
    onCreateAccount
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-[480px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="bg-[#0F2D63] px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-[#C85A32] rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-['Roboto'] font-bold text-white text-sm tracking-wide uppercase">
                            Magalela
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="px-6 py-6 overflow-y-auto max-h-[80vh]">
                    <div>
                        {/* Icon & Title */}
                        <div className="text-center mb-7">
                            <div className="w-12 h-12 bg-[#F5F0EA] dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Mic className="w-6 h-6 text-[#C85A32]" />
                            </div>
                            <h2 className="text-xl font-['Roboto'] font-bold text-[#1C1C1C] dark:text-white mb-1">
                                Request a Workshop
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                How would you like to continue?
                            </p>
                        </div>

                        {/* Options */}
                        <div className="flex flex-col gap-3">
                            {/* ✅ Option 1: Continue as Guest */}
                            <button
                                onClick={onGuestContinue}
                                className="group flex items-center gap-4 w-full border-2 border-gray-200 dark:border-gray-700 hover:border-[#0F2D63] hover:bg-[#0F2D63]/2 dark:hover:bg-[#0F2D63]/10 rounded-2xl p-4 text-left transition-all"
                            >
                                <div className="w-10 h-10 bg-[#F5F0EA] dark:bg-gray-700 group-hover:bg-[#0F2D63]/10 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                                    <CircleUserRound className="w-5 h-5 text-[#C85A32]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-[#1C1C1C] dark:text-white text-sm">
                                        Continue as Guest
                                    </p>
                                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
                                        No account needed
                                    </p>
                                </div>
                                <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-[#0F2D63] flex items-center justify-center transition-all shrink-0">
                                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
                                </div>
                            </button>

                            {/* ✅ Option 2: Create Account */}
                            <button
                                onClick={onCreateAccount}
                                className="group flex items-center gap-4 w-full border-2 border-gray-200 dark:border-gray-700 hover:border-[#C85A32] hover:bg-[#C85A32]/2 dark:hover:bg-[#C85A32]/10 rounded-2xl p-4 text-left transition-all"
                            >
                                <div className="w-10 h-10 bg-[#F5F0EA] dark:bg-gray-700 group-hover:bg-[#C85A32]/10 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                                    <UserPlus className="w-5 h-5 text-[#C85A32]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-[#1C1C1C] dark:text-white text-sm">
                                        Create an Account
                                    </p>
                                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
                                        Track requests & access history
                                    </p>
                                </div>
                                <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-[#C85A32] flex items-center justify-center transition-all shrink-0">
                                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
                                </div>
                            </button>
                        </div>

                        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-5">
                            Your information will only be used to process your request.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestWorkshopModal;