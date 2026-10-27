import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Building2,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  FileText
} from 'lucide-react';
import AuthLeftPanel from './AuthLeftPanel';
import SupportModal from './SupportModal';

const DEFAULT_DEPARTMENTS = [
  { name: 'Department of Information Technology', hasHOD: false, currentHODName: null },
  { name: 'Department of Computer Science & Engineering', hasHOD: false, currentHODName: null },
  { name: 'Department of Mechanical Engineering', hasHOD: false, currentHODName: null },
  { name: 'Department of Electrical & Electronics', hasHOD: false, currentHODName: null },
  { name: 'Department of Civil & Environmental', hasHOD: false, currentHODName: null },
  { name: 'Department of Basic Sciences & Humanities', hasHOD: false, currentHODName: null },
];

export default function RegisterView({ onNavigate, onRegisterSuccess, registeredData, setRegisteredData }) {
  const [formData, setFormData] = useState({
    fullName: registeredData?.fullName || '',
    email: registeredData?.email || '',
    department: registeredData?.department || 'Department of Computer Science & Engineering',
    role: registeredData?.role || 'faculty',
    password: registeredData?.password || '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [departments, setDepartments] = useState(DEFAULT_DEPARTMENTS);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/departments/public')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const list = data.data.map((d) => {
            if (typeof d === 'string') return { name: d, hasHOD: false, currentHODName: null };
            return {
              name: d.name,
              hasHOD: !!d.hasHOD,
              currentHODName: d.currentHODName || null,
            };
          });
          setDepartments(list);
          setFormData((prev) => ({
            ...prev,
            department: prev.department || list[0].name,
          }));
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const selectedDeptObj = departments.find((d) => d.name === formData.department);
  const isHODSlotTaken = formData.role === 'hod' && selectedDeptObj?.hasHOD;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password || !formData.department) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (isHODSlotTaken) {
      setErrorMessage(
        `The ${formData.department} already has an assigned Head of Department. Only 1 HOD is allowed per department.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName.trim(),
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          department: formData.department,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.status === 201 && data.success) {
        setSuccessMessage('Account registered successfully! Redirecting to login...');
        setTimeout(() => {
          if (onRegisterSuccess) {
            onRegisterSuccess(formData);
          }
          if (setRegisteredData) {
            setRegisteredData(formData);
          }
          onNavigate('login');
          setIsSubmitting(false);
          setSuccessMessage('');
        }, 1000);
      } else {
        setErrorMessage(data.message || 'Registration failed. Please check your information.');
        setIsSubmitting(false);
      }
    } catch {
      setErrorMessage('Unable to connect to the server. Please verify backend is running on port 5000.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row overflow-x-hidden bg-[#F4F7FB]">
      {/* 1. Left Panel (The Brand Side with Clean Vector Schematic & Deep Blue Gradient) */}
      <AuthLeftPanel />

      {/* 2. Right Panel (The Registration Form Side) */}
      <div className="w-full lg:w-1/2 xl:w-[50%] h-full flex flex-col justify-between overflow-y-auto px-5 py-6 sm:px-10 sm:py-8 lg:px-14 bg-[#F4F7FB]">
        {/* Top Header Row with Help & Support Link */}
        <div className="w-full flex items-center justify-between sm:justify-end mb-3 sm:mb-1">
          {/* Mobile view branding fallback */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="font-bold text-slate-800 text-sm">Smart Faculty Leave</span>
          </div>

          <button
            type="button"
            onClick={() => setIsSupportOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer group"
          >
            <HelpCircle className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span>Help & Support</span>
          </button>
        </div>

        {/* Center: Clean Elevated Card */}
        <div className="my-auto py-2 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.05)] border border-slate-100 p-7 sm:p-9 animate-fade-in">
            {/* Top Security Icon Badge */}
            <div className="flex justify-center mb-3">
              <div className="w-13 h-13 rounded-2xl bg-[#EEF4FF] border border-blue-100 flex items-center justify-center text-[#2563EB] shadow-xs">
                <UserPlus className="w-6 h-6 stroke-[2.2]" />
              </div>
            </div>

            {/* Header Titles */}
            <div className="text-center mb-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                Create Account
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Set up your institutional faculty profile to request leaves and manage class schedules.
              </p>
            </div>

            {/* Success Banner */}
            {successMessage && (
              <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 animate-fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-4 flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 animate-fade-in">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
                {errorMessage.toLowerCase().includes('already exists') && (
                  <div className="pl-6 pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (setRegisteredData) {
                          setRegisteredData(formData);
                        }
                        onNavigate('login');
                      }}
                      className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 underline underline-offset-4 cursor-pointer transition-colors"
                    >
                      <span>Click here to Sign In</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Role Selection Tabs */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Registering As <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-[#EDF2F7] p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, role: 'faculty' }));
                      if (errorMessage) setErrorMessage('');
                    }}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      formData.role === 'faculty'
                        ? 'bg-[#3B82F6] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    Faculty
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, role: 'hod' }));
                      if (errorMessage) setErrorMessage('');
                    }}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      formData.role === 'hod'
                        ? 'bg-[#3B82F6] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    HOD
                  </button>
                  <div
                    className="py-1.5 text-xs font-medium rounded-lg text-slate-400 bg-slate-200/50 flex items-center justify-center gap-1 cursor-not-allowed select-none"
                    title="Administrator accounts are strictly provisioned by IT administration"
                  >
                    <Lock className="h-3 w-3 text-slate-400" />
                    <span>Admin</span>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="w-full bg-[#EDF2F7] hover:bg-[#e4ebf3] focus:bg-white border border-transparent focus:border-[#2563EB] rounded-xl pl-10 pr-4 py-2.5 text-slate-800 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Institutional Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="e.g. r.sharma@college.edu"
                    className="w-full bg-[#EDF2F7] hover:bg-[#e4ebf3] focus:bg-white border border-transparent focus:border-[#2563EB] rounded-xl pl-10 pr-4 py-2.5 text-slate-800 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className={`w-full bg-[#EDF2F7] hover:bg-[#e4ebf3] focus:bg-white border rounded-xl pl-10 pr-9 py-2.5 text-slate-800 text-sm font-medium focus:ring-4 outline-none transition-all appearance-none cursor-pointer ${
                      isHODSlotTaken
                        ? 'border-amber-300 focus:ring-amber-500/20'
                        : 'border-transparent focus:border-[#2563EB] focus:ring-blue-500/10'
                    }`}
                  >
                    <option value="" disabled>Select your academic department</option>
                    {departments.map((dept, idx) => (
                      <option key={idx} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
                {isHODSlotTaken && (
                  <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="h-3 w-3 shrink-0 text-amber-600" />
                    <span>The selected department already has an assigned Head of Department.</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Min. 6 characters"
                    className="w-full bg-[#EDF2F7] hover:bg-[#e4ebf3] focus:bg-white border border-transparent focus:border-[#2563EB] rounded-xl pl-10 pr-11 py-2.5 text-slate-800 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400"
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

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#3B82F6] hover:bg-[#2563EB] active:scale-[0.99] text-white font-semibold rounded-xl py-3 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Register {formData.role === 'hod' ? 'HOD' : 'Faculty'} Profile</span>
                  )}
                </button>
              </div>
            </form>

            {/* Switch to Login */}
            <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs sm:text-sm text-slate-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  if (setRegisteredData) {
                    setRegisteredData(formData);
                  }
                  onNavigate('login');
                }}
                className="font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer underline-offset-4 hover:underline"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Support & Copyright */}
        <div className="w-full text-center py-2 space-y-2 text-xs text-slate-500">
          <div className="flex items-center justify-center gap-2">
            <span className="text-slate-400">Need help?</span>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setIsSupportOpen(true)}
              className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5 text-blue-600" />
              <span>Contact Support</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            © 2026 Smart Faculty Leave Management System. All rights reserved.
          </p>
        </div>
      </div>

      {/* Institutional Support Modal */}
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </div>
  );
}
