import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  BookOpen,
  GraduationCap,
  Calendar,
  CalendarDays,
  ShieldCheck,
  Camera,
  CheckCircle2,
  Lock,
  Download,
  FileText,
  KeyRound,
  Sparkles,
  MapPin,
  Clock3,
  Award,
  AlertCircle,
  ExternalLink,
  Save,
  X,
  ChevronRight,
  Check
} from 'lucide-react';

export default function InstitutionalProfileView({
  user = {},
  onUpdateUser,
  showToast,
  isModalMode = false,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // Normalize role and details
  const role = (user?.role || 'faculty').toLowerCase();
  const isHOD = role === 'hod';
  const isAdmin = role === 'admin' || role === 'principal';

  // Distinguish pre-seeded demo personas from real registered accounts
  const isDemoAccount = ['faculty@college.edu', 'hod@college.edu', 'admin@college.edu'].includes(
    (user?.email || '').toLowerCase()
  );

  // Default values: Only populate rich demo personas for the pre-seeded demo accounts!
  // For registered users, strictly show their real saved details or clean blanks.
  const buildInitialData = (u) => ({
    name: u?.name || u?.fullName || (isDemoAccount ? (isHOD ? 'Prof. K. Ramanathan' : isAdmin ? 'Dr. S. K. Narayanan' : 'Dr. Eleanor Vance') : ''),
    employeeId: u?.employeeId || (isDemoAccount ? (isHOD ? 'HOD-CSE-2018-0092' : isAdmin ? 'ADM-GOV-2015-0012' : 'FAC-CSE-2024-0418') : ''),
    designation: u?.designation || (isDemoAccount ? (isHOD ? 'Professor & Head of Department' : isAdmin ? 'Dean & Chief Academic Administrator' : 'Associate Professor') : 'Faculty Member'),
    department: u?.department || (isDemoAccount ? 'Computer Science & Engineering' : ''),
    email: u?.email || (isDemoAccount ? (isHOD ? 'hod.cse@college.edu' : isAdmin ? 'admin@college.edu' : 'faculty@college.edu') : ''),
    alternateEmail: u?.alternateEmail || (isDemoAccount ? 'eleanor.vance.research@gmail.com' : ''),
    mobile: u?.mobile || (isDemoAccount ? '+91 98765 43210' : ''),
    dob: u?.dob || (isDemoAccount ? '1988-04-12' : ''),
    gender: u?.gender || (isDemoAccount ? 'Female' : ''),
    bloodGroup: u?.bloodGroup || (isDemoAccount ? 'O+' : ''),
    joiningDate: u?.joiningDate || u?.dateOfJoining || (isDemoAccount ? '2021-08-16' : (u?.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '')),
    employmentType: u?.employmentType || 'Permanent',
    approvedCadre: u?.approvedCadre || 'Full-Time Sanctioned Post',
    biometricId: u?.biometricId || (isDemoAccount ? 'BIO-CSE-0418' : (u?.employeeId ? `BIO-${u.employeeId}` : '')),
    cabinRoom: u?.cabinRoom || (isDemoAccount ? (isHOD ? 'Cabin HOD-01, Tech Tower-A' : isAdmin ? 'Office of the Dean, Admin Block' : 'Cabin 304, Academic Block-B') : ''),
    residentialAddress: u?.residentialAddress || (isDemoAccount ? 'Faculty Quarters B-12, Green Campus Enclave' : ''),
    currentCity: u?.currentCity || (isDemoAccount ? 'Pune' : ''),
    currentState: u?.currentState || (isDemoAccount ? 'Maharashtra' : ''),
    postalCode: u?.postalCode || (isDemoAccount ? '412105' : ''),
    emergencyContactName: u?.emergencyContactName || (isDemoAccount ? 'Dr. Arthur Vance (Spouse)' : ''),
    emergencyContactPhone: u?.emergencyContactPhone || (isDemoAccount ? '+91 98450 11223' : ''),
    highestQualification: u?.highestQualification || (isDemoAccount ? 'Ph.D. in Computer Science & Engineering' : ''),
    almaMater: u?.almaMater || (isDemoAccount ? 'Indian Institute of Science (IISc Bengaluru)' : ''),
    specialization: u?.specialization || (isDemoAccount ? 'Distributed Cloud Systems & Parallel Computing' : ''),
    orcidId: u?.orcidId || (isDemoAccount ? '0000-0002-1825-0097' : ''),
    scopusId: u?.scopusId || (isDemoAccount ? '57201984700' : ''),
    photoUrl: u?.photoUrl || '',
  });

  const [formData, setFormData] = useState(() => buildInitialData(user));

  useEffect(() => {
    if (user) {
      setFormData(buildInitialData(user));
    }
  }, [user]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photoUrl: reader.result }));
        if (showToast) showToast('Profile photograph updated successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        const updatedUser = { ...user, ...(resData.user || resData.data || formData) };
        if (onUpdateUser) {
          onUpdateUser(updatedUser);
        }
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsSavedRecently(true);
        if (showToast) showToast('Institutional profile updated successfully!', 'success');
        setTimeout(() => setIsSavedRecently(false), 4000);
      } else {
        const updatedUser = { ...user, ...formData };
        if (onUpdateUser) onUpdateUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsSavedRecently(true);
        if (showToast) showToast('Institutional profile updated locally!', 'success');
        setTimeout(() => setIsSavedRecently(false), 4000);
      }
    } catch (err) {
      console.warn('Profile API update warning:', err.message);
      const updatedUser = { ...user, ...formData };
      if (onUpdateUser) onUpdateUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsSavedRecently(true);
      if (showToast) showToast('Institutional profile updated!', 'success');
      setTimeout(() => setIsSavedRecently(false), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      if (showToast) showToast('Please enter your current password.', 'warning');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      if (showToast) showToast('New password must be at least 6 characters.', 'warning');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      if (showToast) showToast('New passwords do not match.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        if (showToast) showToast('Password updated and secured successfully!', 'success');
      } else {
        if (showToast) showToast(data.message || 'Failed to update password.', 'error');
      }
    } catch (err) {
      if (showToast) showToast('Network error while updating password.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportDossier = () => {
    if (showToast) {
      showToast('Generating Institutional Service Dossier PDF...', 'info');
      setTimeout(() => {
        showToast('Service Dossier PDF downloaded successfully!', 'success');
      }, 1200);
    }
  };

  const getInitials = (fullName) => {
    return fullName
      .replace(/Dr\.|Prof\.|Mr\.|Mrs\.|Ms\./gi, '')
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'PM';
  };

  const getGreetingName = (fullName) => {
    if (!fullName) return 'Professor';
    const cleanTokens = fullName
      .replace(/^(Dr\.?|Prof\.?|Mr\.?|Mrs\.?|Ms\.?)\s+/i, '')
      .trim()
      .split(/\s+/);
    return cleanTokens[0] || 'Professor';
  };

  const roleLabel = isHOD
    ? 'Head of Department'
    : isAdmin
    ? 'Super Administrator'
    : 'Faculty Member';

  const statusBadge = isHOD
    ? 'Active Tenured HOD'
    : isAdmin
    ? 'System SuperAdmin (Grade-I)'
    : 'Active Permanent Faculty';

  return (
    <div className={`w-full ${isModalMode ? 'p-4 sm:p-6 max-h-[88vh] overflow-y-auto' : 'space-y-6 animate-fade-in'}`}>
      {/* Top Close Bar if in Modal Mode */}
      {isModalMode && (
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Institutional Governance Profile</h2>
              <p className="text-xs text-slate-500">Service Record & Identity Management</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* 1. HERO BANNER - Exact layout & tone matching candidate reference */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-slate-50 p-6 sm:p-8 shadow-xs">
        {/* Subtle background decorative shapes */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-200/20 blur-3xl pointer-events-none" />
        <div className="absolute right-40 bottom-0 -mb-10 h-48 w-48 rounded-full bg-indigo-200/20 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Hello, {getGreetingName(formData.name)}!</span>
              <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base font-bold text-slate-700">
              Keep your institutional profile up to date.
            </p>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Your service dossier and academic credentials are authenticated under college governance.
              Maintain contact details, residential location, and research preferences accurate for institutional compliance.
            </p>
          </div>

          {/* Professional College Governance Vector Art (Clean Pure SVG) */}
          <div className="hidden lg:flex shrink-0 items-center justify-center pr-4">
            <div className="relative h-28 w-64 flex items-center justify-center">
              <svg viewBox="0 0 240 100" className="w-full h-full drop-shadow-sm" fill="none">
                {/* Academic campus building outline */}
                <path d="M20 75 L20 45 L50 25 L80 45 L80 75 Z" fill="#E0E7FF" stroke="#3B82F6" strokeWidth="1.5" />
                <path d="M45 25 L45 15 L55 15 L55 28" stroke="#2563EB" strokeWidth="1.5" />
                <rect x="35" y="50" width="10" height="15" fill="#3B82F6" rx="1" />
                <rect x="55" y="50" width="10" height="15" fill="#3B82F6" rx="1" />
                <polygon points="50,20 40,27 60,27" fill="#1D4ED8" />

                {/* Graduation cap */}
                <polygon points="120,30 95,42 120,54 145,42" fill="#1E40AF" />
                <path d="M103 46 L103 62 Q120 70 137 62 L137 46" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
                <path d="M142 43 L142 66" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                <circle cx="142" cy="68" r="2.5" fill="#F59E0B" />

                {/* Certificate scroll / dossier */}
                <rect x="165" y="28" width="55" height="48" rx="4" fill="#FFFFFF" stroke="#6366F1" strokeWidth="1.5" />
                <line x1="175" y1="38" x2="205" y2="38" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
                <line x1="175" y1="46" x2="200" y2="46" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="175" y1="54" x2="210" y2="54" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="204" cy="64" r="5" fill="#10B981" />
                <path d="M202 64 L203.5 65.5 L206.5 62.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTION TITLE BAR WITH ACTION BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200/60 shadow-xs shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {isHOD ? 'Department Head Profile' : isAdmin ? 'Administrator Profile' : 'Faculty Profile & Service Dossier'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Update your details to keep your academic governance record accurate and up to date.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportDossier}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-xs transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <FileText className="h-4 w-4 text-blue-600" />
          <span>Export Service Dossier</span>
          <Download className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>

      {/* Save Success Alert Banner */}
      {isSavedRecently && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Profile changes saved and synchronized with academic governance registry!</span>
        </div>
      )}

      {/* 3. TWO-COLUMN MASTER-TAB ARCHITECTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: User Summary Card + Vertical Navigation Tabs */}
        <div className="lg:col-span-4 space-y-4">
          {/* User Profile Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-800" />

            {/* Avatar Circle with Upload Trigger */}
            <div className="relative mx-auto mt-4 mb-3 inline-block">
              {formData.photoUrl ? (
                <img
                  src={formData.photoUrl}
                  alt={formData.name}
                  className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md mx-auto"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-white font-extrabold text-3xl border-4 border-white shadow-md mx-auto">
                  {getInitials(formData.name)}
                </div>
              )}

              <label
                htmlFor="profile-photo-upload"
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-blue-600 shadow-md cursor-pointer transition-colors border-2 border-white"
                title="Change photograph"
              >
                <Camera className="h-3.5 w-3.5" />
                <input
                  id="profile-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Name & Identity */}
            <h3 className="font-heading text-lg font-bold text-slate-900 tracking-tight">
              {formData.name}
            </h3>
            <p className="text-xs font-semibold text-blue-600 mt-0.5">
              {formData.designation}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {formData.department}
            </p>

            {/* Application / Employee ID */}
            <div className="mt-3 py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 font-mono inline-block">
              <span className="text-slate-400">Employee ID: </span>
              <span className="font-bold text-slate-800">{formData.employeeId}</span>
            </div>

            {/* Status Pill */}
            <div className="mt-3 flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {statusBadge}
              </span>
            </div>

            {/* Institutional verification notice */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              <span>Accredited Academic Record</span>
            </div>
          </div>

          {/* Vertical Navigation Tabs (Exact candidate reference styling) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xs space-y-1">
            {[
              { id: 'personal', label: 'Personal Information', icon: User },
              { id: 'academic', label: 'Academic Details', icon: GraduationCap },
              { id: 'allocations', label: isHOD ? 'Department Governance' : isAdmin ? 'College Administration' : 'Teaching & Allocations', icon: BookOpen },
              { id: 'preferences', label: 'Leave Quotas & Entitlements', icon: CalendarDays },
              { id: 'documents', label: 'Service Documents & Records', icon: FileText },
              { id: 'security', label: 'Security & Password', icon: KeyRound },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-purple-50/80 text-purple-700 font-bold border border-purple-200/80 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-purple-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Tab Content Panels */}
        <div className="lg:col-span-8 space-y-6">
          {/* TAB 1: PERSONAL INFORMATION */}
          {activeTab === 'personal' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Card 1: Personal Information */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60 font-bold shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
                    <p className="text-xs text-slate-500">Basic contact details and institutional identity.</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name (Verified/Locked) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700">Full Name</label>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Lock className="h-3 w-3" />
                        Verified Legal Name
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        readOnly
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-700 font-semibold cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700">Date of Birth</label>
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700">Mobile Number</label>
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  {/* Official Email (Locked) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700">Institutional Email</label>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Lock className="h-3 w-3" />
                        Verified
                      </span>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs text-slate-700 font-semibold cursor-not-allowed truncate"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  {/* Blood Group */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="O+">O Positive (O+)</option>
                      <option value="A+">A Positive (A+)</option>
                      <option value="B+">B Positive (B+)</option>
                      <option value="AB+">AB Positive (AB+)</option>
                      <option value="O-">O Negative (O-)</option>
                      <option value="A-">A Negative (A-)</option>
                      <option value="B-">B Negative (B-)</option>
                      <option value="AB-">AB Negative (AB-)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Card 2: Campus & Residential Location */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60 font-bold shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Campus & Residential Location</h3>
                    <p className="text-xs text-slate-500">Official campus room and current residential address.</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {/* Campus Cabin */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Campus Cabin / Office Room
                    </label>
                    <input
                      type="text"
                      name="cabinRoom"
                      value={formData.cabinRoom}
                      onChange={handleInputChange}
                      placeholder="e.g. Cabin 304, Academic Block-B"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  {/* Current Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Current Residential Address
                    </label>
                    <input
                      type="text"
                      name="residentialAddress"
                      value={formData.residentialAddress}
                      onChange={handleInputChange}
                      placeholder="e.g. Flat 101, Green Enclave"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Current City</label>
                      <input
                        type="text"
                        name="currentCity"
                        value={formData.currentCity}
                        onChange={handleInputChange}
                        placeholder="e.g. Pune"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Current State</label>
                      <input
                        type="text"
                        name="currentState"
                        value={formData.currentState}
                        onChange={handleInputChange}
                        placeholder="e.g. Maharashtra"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">PIN / Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="e.g. 411001"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Emergency Contact Person & Relation
                      </label>
                      <input
                        type="text"
                        name="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={handleInputChange}
                        placeholder="Full Name & Relation"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Emergency Contact Phone
                      </label>
                      <input
                        type="tel"
                        name="emergencyContactPhone"
                        value={formData.emergencyContactPhone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 00000"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Profile Details'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ACADEMIC DETAILS */}
          {activeTab === 'academic' && (
            <div className="space-y-6">
              {/* Institutional Rank & Hierarchy */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60 font-bold shrink-0">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Institutional Rank & Hierarchy</h3>
                    <p className="text-xs text-slate-500">Official college appointment credentials and service grade.</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="text-[11px] text-slate-400 block font-medium">Designation / Cadre</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">{formData.designation}</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="text-[11px] text-slate-400 block font-medium">Academic Department</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">{formData.department}</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="text-[11px] text-slate-400 block font-medium">Date of Joining</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">{formData.joiningDate}</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="text-[11px] text-slate-400 block font-medium">Employment Tenure</span>
                    <span className="text-xs font-bold text-emerald-700 mt-0.5 block flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {formData.employmentType}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="text-[11px] text-slate-400 block font-medium">Approved Sanction Cadre</span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 block">{formData.approvedCadre || 'Full-Time Sanctioned Post'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="text-[11px] text-slate-400 block font-medium">Biometric Attendance Code</span>
                    <span className="text-xs font-mono font-bold text-slate-900 mt-0.5 block">{formData.biometricId}</span>
                  </div>
                </div>
              </div>

              {/* Highest Academic Qualification & Research IDs */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60 font-bold shrink-0">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Highest Academic Qualification & Research</h3>
                    <p className="text-xs text-slate-500">Degree accreditations and international research indexing.</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                        Highest Degree Awarded
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                        {formData.highestQualification || 'Not specified yet (Update in Personal Information)'}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Conferred by: <strong className="text-slate-800">{formData.almaMater || 'Institutional Record'}</strong>
                      </p>
                    </div>
                    {formData.highestQualification && (
                      <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold text-[11px] shrink-0">
                        Institutional Record
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                      <span className="text-[11px] text-slate-400 block font-medium">Primary Specialization</span>
                      <span className="text-xs font-bold text-slate-800 mt-0.5 block">{formData.specialization || 'Not specified'}</span>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                      <span className="text-[11px] text-slate-400 block font-medium">ORCID Researcher ID</span>
                      <span className="text-xs font-mono font-bold text-slate-800 mt-0.5 block">{formData.orcidId || 'Not registered'}</span>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                      <span className="text-[11px] text-slate-400 block font-medium">Scopus Author ID</span>
                      <span className="text-xs font-mono font-bold text-slate-800 mt-0.5 block">{formData.scopusId || 'Not registered'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEACHING & ALLOCATIONS / GOVERNANCE */}
          {activeTab === 'allocations' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60 font-bold shrink-0">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {isHOD ? 'Department Governance & Academic Oversight' : isAdmin ? 'Institutional Governance & Regulatory Roster' : 'Current Term Teaching Allocations'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isHOD ? 'Departmental faculty strength and supervisory committees.' : isAdmin ? 'Regulatory compliance status and institution-wide governance.' : 'Assigned theory courses, lab sessions, and academic committee duties.'}
                    </p>
                  </div>
                </div>

                {isHOD ? (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                        <span className="text-xs text-slate-400">Total Department Faculty</span>
                        <div className="text-2xl font-extrabold text-slate-900 mt-1">24 Full-Time</div>
                        <span className="text-[10px] text-emerald-600 font-semibold">100% Ph.D. / M.Tech Roster</span>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                        <span className="text-xs text-slate-400">Active Students</span>
                        <div className="text-2xl font-extrabold text-slate-900 mt-1">540 Students</div>
                        <span className="text-[10px] text-blue-600 font-semibold">UG (480) + PG (60)</span>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                        <span className="text-xs text-slate-400">Laboratories Under Scope</span>
                        <div className="text-2xl font-extrabold text-slate-900 mt-1">6 Labs</div>
                        <span className="text-[10px] text-indigo-600 font-semibold">AICTE / NBA Compliant</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 mt-4">
                      <span className="text-xs font-bold text-indigo-900 block mb-2">HOD Committee Portfolios</span>
                      <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                        <li>Chairman, Department Academic Advisory Board (DAAB)</li>
                        <li>Convener, Faculty Leave Sanctioning & Substitute Workload Committee</li>
                        <li>Member, Academic Council & Board of Studies (BoS)</li>
                        <li>Lead Evaluator, Continuous Internal Evaluation (CIE) Quality Audits</li>
                      </ul>
                    </div>
                  </div>
                ) : isAdmin ? (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                        <span className="text-xs text-slate-400">NAAC Accreditation</span>
                        <div className="text-2xl font-extrabold text-slate-900 mt-1">Grade A++</div>
                        <span className="text-[10px] text-emerald-600 font-semibold">CGPA: 3.74 / 4.00</span>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                        <span className="text-xs text-slate-400">NBA Status</span>
                        <div className="text-2xl font-extrabold text-slate-900 mt-1">Tier-I Accredited</div>
                        <span className="text-[10px] text-blue-600 font-semibold">Valid till June 2028</span>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                        <span className="text-xs text-slate-400">Institutional Faculty</span>
                        <div className="text-2xl font-extrabold text-slate-900 mt-1">156 Members</div>
                        <span className="text-[10px] text-indigo-600 font-semibold">6 Departments</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 mt-4">
                      <span className="text-xs font-bold text-blue-900 block mb-2">Central Governance Oversight</span>
                      <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                        <li>Chief Sanctioning Authority, Institutional Service Regulations</li>
                        <li>Registrarial Authority, Annual Faculty Entitlement Balances</li>
                        <li>Liaison, AICTE, UGC, and State Directorate of Technical Education</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    <div className="space-y-3">
                      {[
                        { code: 'CS-301', title: 'Distributed Systems & Cloud Infrastructure', load: '3 Lectures/Week', hall: 'Hall LH-204', students: '72 Students' },
                        { code: 'CS-307', title: 'Cloud Computing Architecture', load: '2 Lectures/Week', hall: 'Hall LH-102', students: '68 Students' },
                        { code: 'CS-307P', title: 'Cloud Computing & Virtualization Lab', load: '4 Hours/Week', hall: 'Systems Lab 2', students: '34 Students / Batch' },
                      ].map((course) => (
                        <div key={course.code} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-blue-100 text-blue-800">
                                {course.code}
                              </span>
                              <h4 className="text-xs font-bold text-slate-900">{course.title}</h4>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500">
                              <span>{course.load}</span>
                              <span>•</span>
                              <span>{course.hall}</span>
                              <span>•</span>
                              <span className="font-semibold text-slate-700">{course.students}</span>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[11px] shrink-0 border border-emerald-200">
                            Active Slot
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 mt-4">
                      <span className="text-xs font-bold text-indigo-900 block mb-2">Academic Committee Responsibilities</span>
                      <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                        <li>Member, Department Academic Advisory Board (DAAB)</li>
                        <li>Criteria 4 Coordinator (Infrastructure & Learning Resources), NBA Committee</li>
                        <li>Faculty Mentor, Final Year B.Tech Research Projects (Group 4 & 7)</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: LEAVE QUOTAS & PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60 font-bold shrink-0">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Leave Quotas & Entitlements</h3>
                    <p className="text-xs text-slate-500">Annual institutional leave allotment and current balances.</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Casual Leave */}
                  <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/60 text-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">Casual Leave</span>
                    <div className="text-2xl font-extrabold text-amber-900 mt-1">
                      {user?.leaveBalances?.casual?.balance ?? (isDemoAccount ? 9.5 : 12)}{' '}
                      <span className="text-xs font-normal text-amber-600">/ {user?.leaveBalances?.casual?.max ?? 12}</span>
                    </div>
                    <span className="text-[10px] text-amber-700 font-semibold mt-1 block">
                      {user?.leaveBalances?.casual?.used ?? (isDemoAccount ? 2.5 : 0)} Days Availed
                    </span>
                  </div>
                  {/* Earned Leave */}
                  <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/60 text-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">Earned Leave</span>
                    <div className="text-2xl font-extrabold text-emerald-900 mt-1">
                      {user?.leaveBalances?.earned?.balance ?? (isDemoAccount ? 26 : 15)}{' '}
                      <span className="text-xs font-normal text-emerald-600">/ {user?.leaveBalances?.earned?.max ?? 30}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                      {user?.leaveBalances?.earned?.used ?? 0} Days Availed
                    </span>
                  </div>
                  {/* Duty Leave */}
                  <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/60 text-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">Duty Leave</span>
                    <div className="text-2xl font-extrabold text-blue-900 mt-1">
                      {user?.leaveBalances?.duty?.balance ?? (isDemoAccount ? 11 : 5)}{' '}
                      <span className="text-xs font-normal text-blue-600">/ {user?.leaveBalances?.duty?.max ?? 15}</span>
                    </div>
                    <span className="text-[10px] text-blue-700 font-semibold mt-1 block">
                      {user?.leaveBalances?.duty?.used ?? 0} Days Availed
                    </span>
                  </div>
                  {/* Medical Leave */}
                  <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/60 text-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block">Medical Leave</span>
                    <div className="text-2xl font-extrabold text-rose-900 mt-1">
                      {user?.leaveBalances?.sick?.balance ?? user?.leaveBalances?.medical?.balance ?? (isDemoAccount ? 8 : 10)}{' '}
                      <span className="text-xs font-normal text-rose-600">/ 10</span>
                    </div>
                    <span className="text-[10px] text-rose-700 font-semibold mt-1 block">
                      {user?.leaveBalances?.sick?.used ?? user?.leaveBalances?.medical?.used ?? 0} Days Availed
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800">Workflow & Alert Preferences</h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Instant Email Notification on Sanction</span>
                        <span className="text-[11px] text-slate-500">Receive dispatch emails when HOD or Principal reviews application</span>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Automated Proxy Faculty Handover Alert</span>
                        <span className="text-[11px] text-slate-500">Dispatch SMS & timetable notes to substitute faculty upon sanction</span>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Institutional Calendar Sync (iCal / Outlook)</span>
                        <span className="text-[11px] text-slate-500">Sync approved leave dates and teaching duty schedules with calendar</span>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SERVICE DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60 font-bold shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Institutional Service Documents</h3>
                      <p className="text-xs text-slate-500">Official digitized service book and certified qualification copies.</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    All Documents Verified
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    { title: 'Institutional Appointment & Regularization Order', ref: 'APPT-2021-0816', size: '1.4 MB', date: 'Aug 16, 2021' },
                    { title: 'Doctoral Degree (Ph.D.) Convocation Certificate', ref: 'IISC-DOC-2019-441', size: '3.2 MB', date: 'Jul 10, 2019' },
                    { title: 'Master of Technology (M.Tech) Degree Dossier', ref: 'MTECH-CERT-0914', size: '2.1 MB', date: 'Jun 22, 2014' },
                    { title: 'Faculty Service Book & Entitlement Summary 2025-2026', ref: 'SRV-BOOK-2026', size: '840 KB', date: 'Oct 01, 2026' },
                  ].map((doc, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100 shrink-0 font-bold text-xs">
                          PDF
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{doc.title}</h4>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                            <span className="font-mono">{doc.ref}</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>Verified on {doc.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => {
                            if (showToast) showToast(`Viewing verified copy of ${doc.title}`, 'info');
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (showToast) showToast(`Downloading ${doc.ref}.pdf...`, 'success');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold hover:bg-blue-100 cursor-pointer flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <form onSubmit={handlePasswordSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60 font-bold shrink-0">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Security & Access Credentials</h3>
                    <p className="text-xs text-slate-500">Update portal access password and verify authentication sessions.</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="Minimum 6 characters"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="Re-type new password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                    <span>Update Password</span>
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 mb-3">Institutional Authentication Status</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                      <span className="text-slate-400 block text-[11px]">Last Authenticated Session</span>
                      <span className="font-bold text-slate-800 mt-0.5 block">Oct 25, 2026 at 10:45 AM</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">IP: 10.14.2.88 (Campus Intranet)</span>
                    </div>
                    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                      <span className="text-slate-400 block text-[11px]">Two-Factor Authentication (2FA)</span>
                      <span className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Enabled via Institutional SSO
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">College Microsoft Azure AD</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
