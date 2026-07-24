// components/settings/ApiTab.tsx
import React, { useState, useEffect } from "react";
import { 
  Eye, 
  EyeOff, 
  Copy, 
  RefreshCw, 
  Check,
  Loader2,
  AlertCircle,
  CheckCircle,
  X
} from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface ConnectedService {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  connected: boolean;
  color?: string;
}

const Integrations = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("sk-adm-xk9••••••••••••••••••••••••");
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Connected services state
  const [services, setServices] = useState<ConnectedService[]>([
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get real-time platform notifications in your Slack workspace.',
      connected: false,
      icon: (
        <svg viewBox="0 0 54 54" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.712 23.148a4.188 4.188 0 0 1-4.188-4.188V8.188a4.188 4.188 0 0 1 8.376 0v10.772a4.188 4.188 0 0 1-4.188 4.188z" fill="#36C5F0"></path>
          <path d="M34.288 23.148a4.188 4.188 0 0 1-4.188-4.188V8.188a4.188 4.188 0 1 1 8.376 0v10.772a4.188 4.188 0 0 1-4.188 4.188z" fill="#2EB67D"></path>
          <path d="M30.1 19.712a4.188 4.188 0 0 1 4.188-4.188h10.772a4.188 4.188 0 1 1 0 8.376H34.288a4.188 4.188 0 0 1-4.188-4.188z" fill="#ECB22E"></path>
          <path d="M30.1 34.288a4.188 4.188 0 0 1 4.188-4.188h10.772a4.188 4.188 0 1 1 0 8.376H34.288a4.188 4.188 0 0 1-4.188-4.188z" fill="#E01E5A"></path>
          <path d="M23.148 30.1a4.188 4.188 0 0 1 4.188 4.188v10.772a4.188 4.188 0 0 1-8.376 0V34.288a4.188 4.188 0 0 1 4.188-4.188z" fill="#ECB22E"></path>
          <path d="M8.188 30.1a4.188 4.188 0 0 1 4.188 4.188v10.772a4.188 4.188 0 1 1-8.376 0V34.288A4.188 4.188 0 0 1 8.188 30.1z" fill="#E01E5A"></path>
          <path d="M23.9 30.1a4.188 4.188 0 0 0-4.188 4.188v10.772a4.188 4.188 0 0 0 8.376 0V34.288A4.188 4.188 0 0 0 23.9 30.1z" fill="#2EB67D"></path>
          <path d="M23.9 23.9a4.188 4.188 0 0 0-4.188-4.188H8.188a4.188 4.188 0 1 0 0 8.376H19.712A4.188 4.188 0 0 0 23.9 23.9z" fill="#36C5F0"></path>
        </svg>
      )
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automate workflows by connecting Magalela to 5,000+ apps.',
      connected: true,
      icon: (
        <svg viewBox="0 0 256 256" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="128" cy="128" r="128" fill="#FF4A00"></circle>
          <path d="M163.4 128a38.3 38.3 0 0 1-1.1 9.1l33.3 19.3a77 77 0 0 0 0-56.8l-33.3 19.3a38.3 38.3 0 0 1 1.1 9.1zm-108.8 0a38.3 38.3 0 0 1 1.1-9.1L22.4 99.6a77 77 0 0 0 0 56.8l33.3-19.3a38.3 38.3 0 0 1-1.1-9.1zm16-38.7 19.2-33.3a77 77 0 0 0-49.1 28.4l29.5 17a38.7 38.7 0 0 1 .4-12.1zm57.6-44.6a77 77 0 0 0-39.2 10.7l19.2 33.3a38.4 38.4 0 0 1 40 0l19.2-33.3a77 77 0 0 0-39.2-10.7zm72.2 55.3a77 77 0 0 0-49.1-28.4l19.2 33.3a38.7 38.7 0 0 1-.1 12.1l29.5-17zm-128 74.7-19.2 33.3a77 77 0 0 0 49.1 28.4l-19.2-33.3a38.7 38.7 0 0 1-10.7-28.4zm55.6 44.6a77 77 0 0 0 39.2-10.7l-19.2-33.3a38.4 38.4 0 0 1-40 0l-19.2 33.3a77 77 0 0 0 39.2 10.7zm72.2-55.3-29.5-17a38.7 38.7 0 0 1 .1 12.1l19.2-33.3a77 77 0 0 0 10.2 38.2z" fill="#fff"></path>
        </svg>
      )
    },
    {
      id: 'google',
      name: 'Google Workspace',
      description: 'Sync calendar events and manage files via Google Drive.',
      connected: false,
      icon: (
        <svg viewBox="0 0 48 48" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"></path>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
        </svg>
      )
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Send notifications and updates directly to Teams channels.',
      connected: false,
      icon: (
        <svg viewBox="0 0 2228.833 2073.333" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M1554.637 777.5h575.713c54.391 0 98.483 44.092 98.483 98.483v524.398c0 199.901-162.051 361.952-361.952 361.952h-1.711c-199.901.028-361.975-162.023-361.975-361.924V828.971a51.468 51.468 0 0 1 51.442-51.471z" fill="#5059C9"></path>
          <circle cx="1943.75" cy="440.583" r="233.25" fill="#5059C9"></circle>
          <circle cx="1218.083" cy="336.917" r="336.917" fill="#7B83EB"></circle>
          <path d="M1667.323 777.5H717.01c-53.743 1.33-96.257 45.931-94.927 99.676v598.105c-7.825 322.519 247.457 590.937 569.976 598.762 322.519-7.825 577.801-276.243 569.976-598.762V877.176c1.33-53.745-41.184-98.346-94.712-99.676z" fill="#7B83EB"></path>
          <path opacity=".1" d="M1244 777.5v838.145c-.258 38.435-23.549 72.964-59.09 87.598a91.856 91.856 0 0 1-35.765 7.257H667.613c-6.738-21.745-10.143-44.442-10.53-67.257V877.03c-1.33-53.611 41.013-98.124 94.54-99.53z"></path>
          <path opacity=".2" d="M1200.417 777.5v881.402c-.196 12.315-2.605 24.485-7.115 35.909a91.856 91.856 0 0 1-87.6 59.09H691.295c-8.787-21.721-15.543-44.442-16.212-67.257-.315-4.062-.63-8.1-.63-12.187V877.03c-1.33-53.611 41.013-98.124 94.54-99.53z"></path>
          <path opacity=".2" d="M1200.417 777.5v794.145c-.539 52.025-43.11 93.981-95.135 93.42H691.295C674.744 1042.695 652 1010 652 974.645V877.03c-1.33-53.611 41.013-98.124 94.54-99.53z"></path>
          <path opacity=".2" d="M1156.833 777.5v794.145c-.525 52.025-43.07 93.996-95.095 93.42H691.295C674.744 1042.695 652 1010 652 974.645V877.03c-1.33-53.611 41.013-98.124 94.54-99.53z"></path>
          <path d="M609.382 777.5h542.851c52.87 0 95.765 42.895 95.765 95.765v542.851c0 52.87-42.895 95.765-95.765 95.765H609.382c-52.87 0-95.765-42.895-95.765-95.765V873.265c0-52.87 42.895-95.765 95.765-95.765z" fill="#4B53BC"></path>
          <path d="M820.108 1090.056v52.882h-122.06V1269.3h-69.471v-179.244H507.008v-52.882h313.1zm-7.517-124.283h-196.27v52.882h196.27v-52.882z" fill="#fff"></path>
        </svg>
      )
    }
  ]);

  // Fetch API key on mount
  useEffect(() => {
    fetchApiKey();
  }, []);

  const fetchApiKey = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<ApiResponse>(
        `${API_URL}/api/auth/api-key`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success && response.data.data?.apiKey) {
        const key = response.data.data.apiKey;
        setApiKey(key);
      }
    } catch (err) {
      console.error("Error fetching API key:", err);
    }
  };

  const handleCopyKey = async () => {
    try {
      const displayKey = showApiKey ? apiKey : apiKey;
      await navigator.clipboard.writeText(displayKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy error:", err);
    }
  };

  const handleRegenerateKey = async () => {
    setRegenerating(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post<ApiResponse>(
        `${API_URL}/api/auth/regenerate-api-key`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setApiKey(response.data.data?.apiKey || apiKey);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.data.message || "Failed to regenerate API key");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to regenerate API key");
    } finally {
      setRegenerating(false);
    }
  };

  const handleServiceConnect = async (serviceId: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const service = services.find(s => s.id === serviceId);
      
      // Toggle connection status
      const response = await axios.post<ApiResponse>(
        `${API_URL}/api/auth/connect-service`,
        {
          serviceId,
          action: service?.connected ? 'disconnect' : 'connect'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setServices(prev =>
          prev.map(s =>
            s.id === serviceId
              ? { ...s, connected: !s.connected }
              : s
          )
        );
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.data.message || "Failed to update service connection");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update service connection");
    } finally {
      setLoading(false);
    }
  };

  // Mask API key for display
  const getDisplayKey = () => {
    if (showApiKey) {
      return apiKey;
    }
    // Show masked version
    if (apiKey.length > 20) {
      return apiKey.slice(0, 12) + '••••••••••••••••••••••••';
    }
    return apiKey;
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Operation completed successfully!</span>
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

      {/* API Key Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <p className="text-sm font-bold text-[#0F2D63] border-b border-gray-50 pb-3">
          API Key
        </p>
        <p className="text-xs text-gray-400 mb-3 leading-relaxed">
          Use this key to authenticate external integrations with the Magalela API. Keep it secret — do not share or expose it publicly.
        </p>
        <div className="flex items-center gap-2 bg-[#f4f6fb] border border-gray-200 rounded-xl px-4 py-3">
          <code className="flex-1 text-xs font-mono text-gray-700 truncate">
            {getDisplayKey()}
          </code>
          <button
            onClick={() => setShowApiKey(!showApiKey)}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            title={showApiKey ? "Hide API key" : "Show API key"}
          >
            {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleCopyKey}
            className="text-gray-400 hover:text-[#0F2D63] transition-colors flex-shrink-0"
            title="Copy API key"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleRegenerateKey}
            disabled={regenerating}
            className="text-gray-400 hover:text-amber-500 transition-colors flex-shrink-0 disabled:opacity-50"
            title="Regenerate API key"
          >
            {regenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Connected Services Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <p className="text-sm font-bold text-[#0F2D63] border-b border-gray-50 pb-3">
          Connected Services
        </p>
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                {service.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0F2D63]">
                  {service.name}
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
              <button
                onClick={() => handleServiceConnect(service.id)}
                disabled={loading}
                className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                  service.connected
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-[#0F2D63] hover:text-white hover:border-[#0F2D63]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  service.connected ? 'Connected' : 'Connect'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Integrations;