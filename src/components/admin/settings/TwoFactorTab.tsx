// components/settings/TwoFactorTab.tsx
import React, { useState, useEffect, useRef } from "react";
import { Loader2, AlertCircle, CheckCircle, Shield, Smartphone, X, Copy, Check } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import QRCode from 'qrcode';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

const TwoFactorTab = () => {
  const { user, updateDetails } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  
  // Setup states
  const [showSetup, setShowSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Load 2FA status from user data
  useEffect(() => {
    if (user) {
      setTwoFactorAuth((user as any).twoFactorAuth || false);
    }
  }, [user]);

  // Generate QR code when setup is triggered
  const generateQRCode = async (secret: string) => {
    try {
      // Generate QR code data URL
      const appName = "Magalela";
      const email = user?.email || "user@example.com";
      const otpauthUrl = `otpauth://totp/${appName}:${email}?secret=${secret}&issuer=${appName}`;
      
      // Generate QR code as data URL
      const qrDataUrl = await QRCode.toDataURL(otpauthUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#0F2D63',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(qrDataUrl);
    } catch (err) {
      console.error("Error generating QR code:", err);
      // Fallback: generate a simple placeholder
      setQrCodeUrl("");
    }
  };

  // Generate 2FA setup
  const handleSetup2FA = async () => {
    setTwoFactorLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      
      // Generate secret key
      const response = await axios.post<ApiResponse>(
        `${API_URL}/api/auth/2fa/setup`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const data = response.data.data;
        const secret = data.secret || generateRandomSecret();
        setSecretKey(formatSecretKey(secret));
        await generateQRCode(secret);
        setShowSetup(true);
      } else {
        // Fallback: generate locally
        const secret = generateRandomSecret();
        setSecretKey(formatSecretKey(secret));
        await generateQRCode(secret);
        setShowSetup(true);
      }
    } catch (err: any) {
      console.error("2FA setup error:", err);
      // Fallback: generate locally
      const secret = generateRandomSecret();
      setSecretKey(formatSecretKey(secret));
      await generateQRCode(secret);
      setShowSetup(true);
    } finally {
      setTwoFactorLoading(false);
    }
  };

  // Generate random secret for fallback
  const generateRandomSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  };

  // Format secret key with spaces
  const formatSecretKey = (secret: string) => {
    const formatted = secret.match(/.{1,4}/g)?.join(' ') || secret;
    return formatted;
  };

  // Verify 2FA code
  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post<ApiResponse>(
        `${API_URL}/api/auth/2fa/verify`,
        {
          code: verificationCode,
          secret: secretKey.replace(/\s/g, ''),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setTwoFactorAuth(true);
        setShowSetup(false);
        setVerificationCode("");
        setSuccess(true);
        
        // Update user context
        if (updateDetails) {
          await updateDetails({ twoFactorAuth: true } as any);
        }
        
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.data.message || "Invalid verification code. Please try again.");
      }
    } catch (err: any) {
      console.error("2FA verification error:", err);
      setError(err.response?.data?.message || "Invalid verification code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Disable 2FA
  const handleDisable2FA = async () => {
    setTwoFactorLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post<ApiResponse>(
        `${API_URL}/api/auth/2fa/disable`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setTwoFactorAuth(false);
        setSuccess(true);
        
        if (updateDetails) {
          await updateDetails({ twoFactorAuth: false } as any);
        }
        
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.data.message || "Failed to disable 2FA");
      }
    } catch (err: any) {
      console.error("2FA disable error:", err);
      setError(err.response?.data?.message || "Failed to disable 2FA");
    } finally {
      setTwoFactorLoading(false);
    }
  };

  // Copy secret key
  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(secretKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy error:", err);
    }
  };

  // Cancel setup
  const handleCancelSetup = () => {
    setShowSetup(false);
    setVerificationCode("");
    setError(null);
  };

  return (
    <div className="flex-1 min-w-0 space-y-0">
      <div className="space-y-6">
        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              {twoFactorAuth 
                ? "Two-factor authentication enabled successfully!" 
                : "Two-factor authentication disabled successfully!"}
            </span>
            <button
              onClick={() => setSuccess(false)}
              className="ml-auto text-green-700 hover:text-green-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-700 hover:text-red-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <p className="text-sm font-bold text-[#0F2D63] border-b border-gray-50 pb-3">
            Two-Factor Authentication
          </p>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Authenticator App
              </p>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
                Use an authenticator app like Google Authenticator or Authy to generate time-based one-time codes for extra security.
              </p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
              twoFactorAuth 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-gray-100 text-gray-500 border-gray-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                twoFactorAuth ? 'bg-green-500' : 'bg-gray-400'
              }`}></span>
              {twoFactorAuth ? 'Enabled' : 'Disabled'}
            </div>
          </div>

          {/* Setup Form - Opens when "Set Up 2FA" is clicked */}
          {showSetup ? (
            <div className="mt-5 space-y-4 max-w-sm">
              <div className="bg-[#f9fafb] rounded-2xl p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-600">
                  1. Open your authenticator app and scan the QR code, or enter the key manually:
                </p>

                {/* QR Code */}
                <div className="w-32 h-32 bg-white border border-gray-200 rounded-xl flex items-center justify-center mx-auto overflow-hidden">
                  {qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="grid grid-cols-7 gap-0.5 p-2">
                      {Array.from({ length: 49 }).map((_, i) => {
                        const isBlack = Math.random() > 0.6;
                        return (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-[1px] ${
                              isBlack ? 'bg-[#0F2D63]' : 'bg-white'
                            }`}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Secret Key */}
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
                  <code className="flex-1 text-xs font-mono text-gray-700 tracking-widest">
                    {secretKey}
                  </code>
                  <button
                    onClick={handleCopyKey}
                    className="text-gray-400 hover:text-[#0F2D63] transition-colors"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Verification Code Input */}
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1.5">
                  2. Enter the 6-digit code shown in your app:
                </p>
                <input
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 6) {
                      setVerificationCode(value);
                    }
                  }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] focus:ring-2 focus:ring-[#0F2D63]/10 transition-all bg-white tracking-[0.5em] text-center font-mono text-lg"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleCancelSetup}
                  className="flex-1 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerify2FA}
                  disabled={isVerifying || verificationCode.length !== 6}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold bg-[#0F2D63] text-white hover:bg-[#0a2050] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Enable'
                  )}
                </button>
              </div>
            </div>
          ) : (
            // Show button based on 2FA status
            <button
              onClick={twoFactorAuth ? handleDisable2FA : handleSetup2FA}
              disabled={twoFactorLoading}
              className={`mt-4 px-5 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors ${
                twoFactorAuth
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-[#0F2D63] hover:bg-[#0a2050]'
              } disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
            >
              {twoFactorLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {twoFactorAuth ? 'Disabling...' : 'Setting up...'}
                </>
              ) : (
                <>
                  {twoFactorAuth ? (
                    <>
                      <Shield className="w-4 h-4" />
                      Disable 2FA
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4" />
                      Set Up 2FA
                    </>
                  )}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoFactorTab;