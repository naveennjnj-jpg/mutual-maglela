import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Shield } from "lucide-react";
import Logo from "@/assets/home/logo.png";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login attempted with:", { email, password });
  };

  const handleDemoLogin = (email: string) => {
    setEmail(email);
    console.log("Demo login with:", { email });
  };

  const demoAccounts = [
    {
      id: 1,
      name: "User",
      email: "ronald@gmail.com",
    },
    {
      id: 2,
      name: "Admin",
      email: "admin@demo.com",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F4] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src={Logo}
            alt="Magalela Media"
            className="h-20 w-auto object-contain"
          />
        </Link>
        <span className="text-sm text-gray-500">
          New here?{" "}
          <Link
            to="/onboarding"
            className="text-[#C85A32] font-semibold hover:underline"
          >
            Create account
          </Link>
        </span>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63] mb-1">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm">
              Sign in to your communication workspace
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
            {/* Social Login Buttons */}
            <div className="space-y-2.5 mb-6">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 21 21">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                </svg>
                Continue with Microsoft
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-100"></div>
              <span className="text-xs text-gray-400">or sign in with email</span>
              <div className="flex-1 h-px bg-gray-100"></div>
            </div>

            {/* Login Form */}
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
                    className="flex w-full border bg-white px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A32] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9 h-11 rounded-xl border-gray-200 text-sm"
                    placeholder="you@institution.edu"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-[#C85A32] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex w-full border bg-white px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A32] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9 h-11 rounded-xl border-gray-200 text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#C85A32] hover:bg-[#a8472a] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 mt-1"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest text-center mb-3">
                Demo Accounts
              </p>
              <div className="space-y-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => handleDemoLogin(account.email)}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-100 hover:border-[#C85A32]/40 hover:bg-[#FFF8F5] transition-colors text-left"
                  >
                    <span className="font-medium text-[#0F2D63] text-xs">
                      {account.name}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {account.email}
                    </span>
                  </button>
                ))}
              </div>
            </div>
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

export default Login;