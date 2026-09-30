import React, { useState } from 'react';
import { ShieldCheck, User, Mail, Building2, Lock, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RegisterView({ onNavigate, onRegisterSuccess, registeredData }) {
  const [formData, setFormData] = useState({
    fullName: registeredData?.fullName || '',
    email: registeredData?.email || '',
    department: registeredData?.department || '',
    role: registeredData?.role || 'faculty',
    password: registeredData?.password || '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const departments = [
    'Department of Information Technology',
    'Department of Computer Science & Engineering',
    'Department of Mechanical Engineering',
    'Department of Electrical & Electronics',
    'Department of Civil & Environmental',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('Account registered successfully! Redirecting to login...');

    setTimeout(() => {
      if (onRegisterSuccess) {
        onRegisterSuccess(formData);
      }
      onNavigate('login');
      setIsSubmitting(false);
      setSuccessMessage('');
    }, 600);
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

      {/* 2. Right Panel (The Registration Side - w-1/2) */}
      <div className="w-full lg:w-1/2 h-full bg-slate-50 flex items-center justify-center p-6 sm:p-8 overflow-y-auto lg:overflow-hidden">
        {/* The Registration Card */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 p-8 sm:p-10 max-w-md w-full animate-fade-in my-auto">
          {/* Header */}
          <div className="text-left mb-5">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              Create Account
            </h2>
            <p className="text-slate-500 text-sm mt-1.5">
              Set up your institutional profile to start managing leaves.
            </p>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 animate-fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Dr. Eleanor Vance"
                  className="bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none w-full transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Institutional or Personal Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Institution Mail / Personal Mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g. e.vance@university.edu or name@gmail.com"
                  className="bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none w-full transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Department
              </label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 text-slate-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none w-full transition-all text-sm font-medium appearance-none cursor-pointer"
                >
                  <option value="" disabled>e.g. Select your department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="e.g. ••••••••"
                  className="bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-slate-700 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none w-full transition-all text-sm font-medium"
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

            {/* Primary Action Button: Create Account */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 transition-colors shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Registering Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer: Sign in link */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
