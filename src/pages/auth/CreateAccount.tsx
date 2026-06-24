import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, User, Building2, ArrowLeft, ArrowRight } from "lucide-react";
import Logo from "@/assets/home/logo.png";

const CreateAccount = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAccountType, setSelectedAccountType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const totalSteps = 3;
  const progressPercentage = ((currentStep - 1) / totalSteps) * 100;

  const accountTypes = [
    {
      id: "individual",
      title: "Individual Professional",
      description: "For academics, researchers, and executive leaders",
      icon: User,
    },
    {
      id: "institutional",
      title: "Institutional / Enterprise",
      description: "For universities, research organisations, and corporate teams",
      icon: Building2,
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleContinue = () => {
    if (currentStep === 1 && !selectedAccountType) {
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form
      console.log("Form submitted:", { ...formData, selectedAccountType });
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <div className="mb-7">
              <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63] mb-1">
                Choose Account Type
              </h1>
              <p className="text-gray-500 text-sm">
                Select the account type that fits your needs
              </p>
            </div>

            <div className="space-y-3 mb-7">
              {accountTypes.map((type) => {
                const IconComponent = type.icon;
                const isSelected = selectedAccountType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedAccountType(type.id)}
                    className={`w-full flex items-start gap-4 p-5 rounded-xl border-2 transition-all text-left group ${
                      isSelected
                        ? "border-[#C85A32] bg-[#FFF8F5]"
                        : "border-gray-100 hover:border-[#C85A32] hover:bg-[#FFF8F5]"
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? "bg-[#C85A32]"
                          : "bg-[#F3EDE6] group-hover:bg-[#C85A32]"
                      }`}
                    >
                      <IconComponent
                        className={`w-5 h-5 transition-colors ${
                          isSelected
                            ? "text-white"
                            : "text-[#C85A32] group-hover:text-white"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0F2D63] text-sm">
                        {type.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <div className="mb-7">
              <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63] mb-1">
                Personal Information
              </h1>
              <p className="text-gray-500 text-sm">
                Tell us about yourself to personalize your experience
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Dr. Jane Smith"
                  className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C85A32] focus:ring-offset-2 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="jane.smith@institution.edu"
                  className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C85A32] focus:ring-offset-2 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Minimum 8 characters"
                  className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C85A32] focus:ring-offset-2 transition-all"
                  required
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  Must be at least 8 characters with letters and numbers
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <div className="mb-7">
              <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63] mb-1">
                Review & Complete
              </h1>
              <p className="text-gray-500 text-sm">
                Review your information before completing setup
              </p>
            </div>

            <div className="bg-[#F8F9FC] rounded-xl p-5 space-y-3 border border-gray-100 mb-6">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Account Type</span>
                <span className="text-sm font-medium text-[#0F2D63]">
                  {selectedAccountType === "individual"
                    ? "Individual Professional"
                    : "Institutional / Enterprise"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Full Name</span>
                <span className="text-sm font-medium text-[#0F2D63]">
                  {formData.name || "Not provided"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm font-medium text-[#0F2D63]">
                  {formData.email || "Not provided"}
                </span>
              </div>
            </div>

            <div className="bg-[#1F4ED8]/5 border border-[#1F4ED8]/20 rounded-xl p-4">
              <p className="text-sm text-gray-600">
                By continuing, you agree to our{" "}
                <Link to="/terms" className="text-[#C85A32] hover:underline font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-[#C85A32] hover:underline font-medium">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepLabel = () => {
    switch (currentStep) {
      case 1:
        return "Step 1 of 3";
      case 2:
        return "Step 2 of 3";
      case 3:
        return "Step 3 of 3";
      default:
        return "";
    }
  };

  const isContinueDisabled = () => {
    if (currentStep === 1 && !selectedAccountType) return true;
    if (currentStep === 2) {
      const { name, email, password } = formData;
      return !name || !email || !password || password.length < 8;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-[#F9F7F4] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
        <Link to="/" className="flex items-center">
          <img
            src={Logo}
            alt="Magalela Media"
            className="h-20 w-auto object-contain"
          />
        </Link>
        <span className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-[#C85A32] font-semibold hover:underline">
            Sign in
          </Link>
        </span>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-start justify-center px-4 py-10 overflow-y-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full max-w-[480px] p-8">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span className="font-medium">{getStepLabel()}</span>
              <span className="font-medium">
                {Math.round(progressPercentage)}% complete
              </span>
            </div>
            <div className="relative w-full overflow-hidden rounded-full h-1.5 bg-gray-100">
              <div
                className="bg-[#C85A32] h-full transition-all duration-500 ease-in-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentStep === 1
                  ? "opacity-50 cursor-not-allowed text-gray-400"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#0F2D63]"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleContinue}
              disabled={isContinueDisabled()}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isContinueDisabled()
                  ? "opacity-50 cursor-not-allowed bg-gray-300 text-white"
                  : "bg-[#C85A32] hover:bg-[#a8472a] text-white"
              }`}
            >
              {currentStep === totalSteps ? "Complete" : "Continue"}
              {currentStep !== totalSteps && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Security Footer */}
          <div className="flex items-center justify-center gap-1.5 mt-6 text-xs text-gray-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Enterprise-grade security</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;