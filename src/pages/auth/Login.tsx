import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import Logo from '@/assets/home/logo.png';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, setError } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  const result = await login(email, password);

  if (result.success) {
    const userRole = result.data?.data?.role;

    if (userRole === "admin") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  } else {
    setError(result.error || "Login failed");
  }

  setLoading(false);
};

  return (
    <div className="min-h-screen bg-[#F9F7F4] flex flex-col">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Magalela Media" className="h-20 w-auto object-contain logo-image" />
        </Link>
        <span className="text-sm text-gray-500">
          New here?{' '}
          <Link to="/onboarding" className="text-[#C85A32] font-semibold hover:underline">
            Create account
          </Link>
        </span>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#0F2D63] mb-1">Welcome back</h1>
            <p className="text-gray-500 text-sm">Sign in to your communication workspace</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 h-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A32] focus:ring-offset-2"
                    placeholder="you@institution.edu"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-700">Password</label>
                  <Link to="/forgot-password" className="text-xs text-[#C85A32] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 h-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A32] focus:ring-offset-2"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest text-center mb-3">
                Demo Accounts
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setEmail('harish.backend.dev@gmail.com');
                    setPassword('V7#mQ9@Lp2!Xr8$Nz');
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-100 hover:border-[#C85A32]/40 hover:bg-[#FFF8F5] transition-colors text-left"
                >
                  <span className="font-medium text-[#0F2D63] text-xs">User</span>
                  <span className="text-gray-400 text-xs">harish.backend.dev@gmail.com</span>
                </button>
                {/* <button
                  onClick={() => {
                    setEmail('admin@gmail.com');
                     setPassword('V7#mQ9@Lp2!Xr8$Nz');
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-100 hover:border-[#C85A32]/40 hover:bg-[#FFF8F5] transition-colors text-left"
                >
                  <span className="font-medium text-[#0F2D63] text-xs">Admin</span>
                  <span className="text-gray-400 text-xs">admin@demo.com</span>
                </button> */}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-6 text-xs text-gray-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Enterprise-grade security</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
