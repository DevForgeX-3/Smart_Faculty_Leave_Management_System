import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, Sparkles, ArrowLeft } from 'lucide-react';

export default function LoginView({ onNavigate, registeredData, onLoginSuccess }) {
  const [email, setEmail] = useState(registeredData?.email || '');
  const [password, setPassword] = useState(registeredData?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Standard Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      let role = 'faculty';
      let name = registeredData?.fullName || 'Prof. Eleanor Vance';
      let dept = registeredData?.department || 'Department of Information Technology';

      if (email.toLowerCase().includes('hod')) {
        role = 'hod';
        name = 'Dr. HOD';
        dept = 'Department of Physics & Chemistry';
      } else if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('dean')) {
        role = 'admin';
        name = 'System Administrator';
        dept = 'Master Access';
      }

      if (onLoginSuccess) {
        onLoginSuccess({ role, name, email, department: dept });
      }

      setIsLoading(false);
      onNavigate(role);
    }, 350);
  };

  // Instant Demo Login (bypasses form)
  const handleDemoLogin = (role) => {
    let userData = {
      role: 'faculty',
      name: 'Prof. Eleanor Vance',
      email: 'e.vance@university.edu',
      department: 'Department of Information Technology',
    };

    if (role === 'hod') {
      userData = {
        role: 'hod',
        name: 'Dr. HOD',
        email: 'hod.physics@university.edu',
        department: 'Department of Physics & Chemistry',
      };
    } else if (role === 'admin') {
      userData = {
        role: 'admin',
        name: 'System Administrator',
        email: 'admin.governance@university.edu',
        department: 'Master Access',
      };
    }

    if (onLoginSuccess) {
      onLoginSuccess(userData);
    }

    onNavigate(role);
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-slate-50">
      {/* 1. Left Panel (The Brand Side - w-1/2) */}
      <div className="hidden lg:flex lg:w-1/2 h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 p-12 xl:p-16 flex-col justify-center relative overflow-hidden text-white shrink-0 select-none">
        {/* Ambient subtle glow effects */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 right-1/4 h-80 w-80 rounded-full bg-blue-600/10 blur-2xl" />

        {/* Branding: A glowing shield icon next to "Smart Faculty Leave Management" */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-400/30 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <ShieldCheck className="h-5 w-5 text-blue-300 stroke-[2.2] drop-shadow-[0_0_8px_rgba(147,197,253,0.8)]" />
          </div>
          <span className="text-blue-200 font-semibold tracking-wider text-sm">
            Smart Faculty Leave Management
          </span>
        </div>

        {/* Main Headline */}
        <div className="relative z-10">
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mt-6 tracking-tight">
            Streamline your academic workflow.
          </h1>
          <p className="text-blue-100 text-lg mt-4 max-w-md opacity-90 leading-relaxed font-normal">
            Secure, real-time leave tracking and automated HOD approvals.
          </p>

          {/* Elegant Glassmorphic Feature Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mt-10 xl:mt-12 max-w-md shadow-xl shadow-black/10">
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-400/20 text-blue-200 border border-blue-300/30 mt-0.5">
                <Sparkles className="h-4 w-4" />
              </span>
              <p className="text-white/95 text-sm sm:text-[15px] font-medium leading-relaxed">
                "The unified portal for Faculty, HODs, and Administrators to manage academic schedules seamlessly."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Right Panel (The Login Side - w-1/2) */}
      <div className="w-full lg:w-1/2 h-full bg-slate-50 flex items-center justify-center p-6 sm:p-8 overflow-y-auto lg:overflow-hidden">
        {/* The Login Card */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 p-8 sm:p-10 lg:p-11 max-w-md w-full animate-fade-in my-auto">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-3 group cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Registration</span>
          </button>

          {/* Header */}
          <div className="text-left">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-500 text-sm mt-1.5 mb-6">
              Enter your credentials to continue.
            </p>
          </div>

          {/* Form Fields: space-y-5 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Institution Mail / Personal Mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. e.vance@university.edu or name@gmail.com"
                  className="bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none w-full transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset instructions dispatched to your college email.');
                  }}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="e.g. ••••••••"
                  className="bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-11 py-3 text-slate-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none w-full transition-all text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Primary Action Button: Sign In */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3.5 transition-colors shadow-md hover:shadow-lg mt-2 cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Divider: A subtle "OR" divider */}
          <div className="flex items-center gap-3 text-slate-400 text-xs font-medium my-6">
            <div className="flex-1 border-t border-slate-200" />
            <span>OR</span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          {/* 3. Demo Access Section (Clean & Polished) */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide text-center mb-4">
              Quick Demo Access
            </div>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => handleDemoLogin('faculty')}
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('hod')}
                className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                HOD
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Footer: Register link */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs sm:text-sm text-slate-500">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
