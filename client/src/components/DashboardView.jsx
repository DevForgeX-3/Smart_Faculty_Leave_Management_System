import React, { useState } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  CalendarDays,
  History,
  LogOut,
  User,
  Calendar,
  Clock,
  HeartPulse,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Send,
  Users,
  FileText,
  ChevronRight,
  Filter,
  Bell,
  Menu,
  X,
  Building,
  Check,
  ExternalLink
} from 'lucide-react';

export default function DashboardView({ user, onNavigate, showToast }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Dynamic Quota State
  const [leaveBalances, setLeaveBalances] = useState({
    casual: { used: 3, total: 15 },
    medical: { used: 2, total: 10 },
    duty: { used: 1, total: 6 },
  });

  // Mock Applications List
  const [applications, setApplications] = useState([
    {
      id: 'APP-2026-915',
      type: 'Casual Leave',
      typeCode: 'casual',
      startDate: '2026-10-02',
      endDate: '2026-10-03',
      days: 2,
      proxy: 'Dr. Sunita Rao',
      proxyDept: 'Information Technology Lab',
      reason: 'Personal family commitment requiring institutional station leave.',
      status: 'Pending HOD',
      appliedAt: '24 Sep 2026, 09:30 AM',
      hodName: 'Prof. K. Ramanathan',
    },
    {
      id: 'APP-2026-892',
      type: 'Duty Leave',
      typeCode: 'duty',
      startDate: '2026-09-14',
      endDate: '2026-09-15',
      days: 2,
      proxy: 'Dr. Rajesh Sharma',
      proxyDept: 'Information Systems',
      reason: 'Keynote Speaker at National Computing Consortium, IISc Bengaluru.',
      status: 'Approved',
      appliedAt: '10 Sep 2026, 11:15 AM',
      hodName: 'Prof. K. Ramanathan',
    },
    {
      id: 'APP-2026-870',
      type: 'Medical Leave',
      typeCode: 'medical',
      startDate: '2026-08-18',
      endDate: '2026-08-19',
      days: 2,
      proxy: 'Dr. Ananya Gupta',
      proxyDept: 'Software Engineering',
      reason: 'Seasonal viral illness; outpatient medical prescription uploaded.',
      status: 'Approved',
      appliedAt: '17 Aug 2026, 08:45 AM',
      hodName: 'Prof. K. Ramanathan',
    },
  ]);

  // Leave Form State
  const [formData, setFormData] = useState({
    leaveType: 'Casual Leave',
    startDate: '2026-10-14',
    endDate: '2026-10-15',
    proxyFaculty: 'Dr. Sunita Rao',
    reason: '',
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const facultyName = user?.name || 'Prof. Eleanor Vance';
  const facultyDept = user?.department || 'Department of Information Technology';
  const facultyEmail = user?.email || 'e.vance@university.edu';

  // Handle Form Change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Leave Application
  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!formData.reason.trim()) {
      alert('Please provide a brief reason for the leave application.');
      return;
    }

    setFormSubmitting(true);

    setTimeout(() => {
      // Calculate days roughly
      const d1 = new Date(formData.startDate);
      const d2 = new Date(formData.endDate);
      const diffTime = Math.abs(d2 - d1);
      const calculatedDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

      const typeKey =
        formData.leaveType.toLowerCase().includes('casual')
          ? 'casual'
          : formData.leaveType.toLowerCase().includes('medical')
          ? 'medical'
          : 'duty';

      const newApp = {
        id: `APP-2026-${Math.floor(920 + Math.random() * 70)}`,
        type: formData.leaveType,
        typeCode: typeKey,
        startDate: formData.startDate,
        endDate: formData.endDate,
        days: calculatedDays,
        proxy: formData.proxyFaculty,
        proxyDept: 'Department Colleague',
        reason: formData.reason,
        status: 'Pending HOD',
        appliedAt: 'Just now',
        hodName: 'Prof. K. Ramanathan',
      };

      setApplications((prev) => [newApp, ...prev]);

      // Update quota count
      setLeaveBalances((prev) => ({
        ...prev,
        [typeKey]: {
          ...prev[typeKey],
          used: Math.min(prev[typeKey].total, prev[typeKey].used + calculatedDays),
        },
      }));

      setFormSubmitting(false);
      setFormSuccess(true);
      setFormData((prev) => ({ ...prev, reason: '' }));

      if (showToast) {
        showToast(`Leave application #${newApp.id} submitted for HOD approval!`, 'success');
      }

      setTimeout(() => setFormSuccess(false), 4000);
    }, 500);
  };

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return app.status.includes('Pending');
    if (filterStatus === 'approved') return app.status === 'Approved';
    return true;
  });

  return (
    <div className="flex min-h-screen w-full bg-slate-50 relative">
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar: w-64, bg-blue-900 text-white flex flex-col p-6 */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between bg-blue-900 p-6 text-white shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Title */}
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 shadow-sm">
                <ShieldCheck className="h-6 w-6 text-white stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-sm font-bold tracking-tight text-white leading-tight">
                  Smart Faculty Leave
                </span>
                <span className="text-[9px] font-bold tracking-widest text-blue-200 uppercase">
                  ACADEMIC GOVERNANCE
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg p-1.5 text-blue-200 hover:bg-white/10 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 space-y-1.5">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-blue-800/90 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('apply');
                setMobileMenuOpen(false);
                document.getElementById('apply-form-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'apply'
                  ? 'bg-blue-800/90 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <CalendarDays className="h-4 w-4" />
              <span>Apply Leave</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('history');
                setMobileMenuOpen(false);
                document.getElementById('applications-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-blue-800/90 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <History className="h-4 w-4" />
              <span>History</span>
            </button>
          </nav>
        </div>

        {/* Bottom: Faculty Profile & Logout button */}
        <div className="border-t border-white/15 pt-5">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 border border-white/10">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 font-bold text-white shadow">
              {facultyName
                .split(' ')
                .filter((p) => !p.startsWith('Dr.') && !p.startsWith('Prof.'))
                .map((n) => n[0])
                .join('')
                .slice(0, 2) || 'EV'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white leading-tight">
                {facultyName}
              </p>
              <p className="truncate text-[11px] text-blue-200 mt-0.5">
                {facultyDept}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => onNavigate('login')}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3.5 py-2.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/20 hover:text-white transition-all cursor-pointer border border-white/10"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area: flex-1 p-10 overflow-auto */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 min-h-screen">
        {/* Top Header / Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm lg:hidden hover:bg-slate-50"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  Welcome back, {facultyName.startsWith('Prof.') ? facultyName : `Prof. ${facultyName}`}
                </h1>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
                Academic Session 2026–2027 • {facultyDept}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-medium text-blue-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Term II
            </span>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Sep 24, 2026</span>
            </div>
          </div>
        </div>

        {/* 3 Bento Metric Cards (Casual Leaves, Medical Leaves, Duty Leaves) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Card 1: Casual Leaves (12/15) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 h-1 w-full bg-blue-600" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Casual Leaves
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
                {leaveBalances.casual.total - leaveBalances.casual.used}
              </span>
              <span className="text-base font-semibold text-slate-400">
                / {leaveBalances.casual.total} Days Left
              </span>
            </div>
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1.5">
                <span>{leaveBalances.casual.used} days utilized</span>
                <span>
                  {Math.round(
                    ((leaveBalances.casual.total - leaveBalances.casual.used) /
                      leaveBalances.casual.total) *
                      100
                  )}
                  % remaining
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                  style={{
                    width: `${
                      ((leaveBalances.casual.total - leaveBalances.casual.used) /
                        leaveBalances.casual.total) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              Statutory casual allowance • Resets annually
            </p>
          </div>

          {/* Card 2: Medical Leaves (8/10) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 h-1 w-full bg-emerald-600" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Medical Leaves
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <HeartPulse className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
                {leaveBalances.medical.total - leaveBalances.medical.used}
              </span>
              <span className="text-base font-semibold text-slate-400">
                / {leaveBalances.medical.total} Days Left
              </span>
            </div>
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1.5">
                <span>{leaveBalances.medical.used} days utilized</span>
                <span>
                  {Math.round(
                    ((leaveBalances.medical.total - leaveBalances.medical.used) /
                      leaveBalances.medical.total) *
                      100
                  )}
                  % remaining
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
                  style={{
                    width: `${
                      ((leaveBalances.medical.total - leaveBalances.medical.used) /
                        leaveBalances.medical.total) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              Requires certified prescription if &gt; 2 days
            </p>
          </div>

          {/* Card 3: Duty Leaves (5/6) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 h-1 w-full bg-indigo-600" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Duty Leaves
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
                {leaveBalances.duty.total - leaveBalances.duty.used}
              </span>
              <span className="text-base font-semibold text-slate-400">
                / {leaveBalances.duty.total} Days Left
              </span>
            </div>
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1.5">
                <span>{leaveBalances.duty.used} days utilized</span>
                <span>
                  {Math.round(
                    ((leaveBalances.duty.total - leaveBalances.duty.used) /
                      leaveBalances.duty.total) *
                      100
                  )}
                  % remaining
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                  style={{
                    width: `${
                      ((leaveBalances.duty.total - leaveBalances.duty.used) /
                        leaveBalances.duty.total) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              Conferences, symposia & official external duty
            </p>
          </div>
        </div>

        {/* Main Body: Apply Leave Form next to Recent Applications Table */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Apply for Leave Form (lg:col-span-5) */}
          <section id="apply-form-section" className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-slate-900">
                    Apply for Leave
                  </h2>
                  <p className="text-xs text-slate-500">
                    Submit request with departmental proxy allocation
                  </p>
                </div>
              </div>

              {/* Success Notification */}
              {formSuccess && (
                <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 animate-fade-in">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>Leave application registered and submitted to HOD!</span>
                </div>
              )}

              <form onSubmit={handleApplyLeave} className="mt-5 space-y-4">
                {/* Leave Type */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Leave Type
                  </label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm font-medium text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all"
                  >
                    <option value="Casual Leave">Casual Leave (CL)</option>
                    <option value="Medical Leave">Medical Leave (ML)</option>
                    <option value="Duty Leave">Duty Leave (DL)</option>
                    <option value="Special Academic Leave">Special Academic Leave (SAL)</option>
                  </select>
                </div>

                {/* Dates: Start & End Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleFormChange}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm font-medium text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleFormChange}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 text-sm font-medium text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all"
                    />
                  </div>
                </div>

                {/* Department Proxy / Substitute Faculty */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Department Proxy Faculty
                  </label>
                  <div className="relative">
                    <select
                      name="proxyFaculty"
                      value={formData.proxyFaculty}
                      onChange={handleFormChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-sm font-medium text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all"
                    >
                      <option value="Dr. Sunita Rao">Dr. Sunita Rao (Quantum Physics Lab)</option>
                      <option value="Dr. Rajesh Sharma">Dr. Rajesh Sharma (Computational Dept)</option>
                      <option value="Dr. Ananya Gupta">Dr. Ananya Gupta (Solid State)</option>
                      <option value="Prof. Arvind Nambiar">Prof. Arvind Nambiar (Optics Group)</option>
                    </select>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Substitute faculty will automatically receive lecture handover notifications.
                  </p>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Reason for Leave
                  </label>
                  <textarea
                    name="reason"
                    rows="3"
                    value={formData.reason}
                    onChange={handleFormChange}
                    required
                    placeholder="Specify the academic or personal reason for this leave request..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full rounded-xl bg-gradient-to-r from-[#1D4ED8] to-[#4338CA] hover:from-blue-700 hover:to-indigo-700 py-3 px-5 font-semibold text-white shadow-md shadow-blue-600/20 transition-all active:scale-[0.99] disabled:opacity-75 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    {formSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Leave Application</span>
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Right Column: Recent Applications Data Table (lg:col-span-7) */}
          <section id="applications-section" className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
              {/* Header & Filter Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-100">
                <div>
                  <h2 className="font-heading text-lg font-bold text-slate-900">
                    Recent Applications
                  </h2>
                  <p className="text-xs text-slate-500">
                    Track authorization audit trail and substitution status
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-600">
                  <button
                    type="button"
                    onClick={() => setFilterStatus('all')}
                    className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                      filterStatus === 'all'
                        ? 'bg-white text-blue-700 shadow-sm font-bold'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    All ({applications.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterStatus('pending')}
                    className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                      filterStatus === 'pending'
                        ? 'bg-white text-blue-700 shadow-sm font-bold'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterStatus('approved')}
                    className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                      filterStatus === 'approved'
                        ? 'bg-white text-blue-700 shadow-sm font-bold'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Approved
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="pb-3 pl-1">Leave Type</th>
                      <th className="pb-3 px-3">Duration</th>
                      <th className="pb-3 px-3">Proxy Faculty</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 pr-1 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApps.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-sm text-slate-400">
                          No applications found matching the selected filter.
                        </td>
                      </tr>
                    ) : (
                      filteredApps.map((app) => (
                        <tr
                          key={app.id}
                          className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                          onClick={() => setSelectedApplication(app)}
                        >
                          {/* Leave Type */}
                          <td className="py-3.5 pl-1">
                            <div className="font-semibold text-slate-900">{app.type}</div>
                            <div className="text-[11px] text-slate-400">{app.id}</div>
                          </td>

                          {/* Duration */}
                          <td className="py-3.5 px-3">
                            <div className="font-medium text-slate-800">
                              {app.startDate} to {app.endDate}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {app.days} {app.days === 1 ? 'day' : 'days'}
                            </div>
                          </td>

                          {/* Proxy */}
                          <td className="py-3.5 px-3">
                            <div className="font-medium text-slate-800">{app.proxy}</div>
                            <div className="text-[11px] text-slate-400">{app.proxyDept}</div>
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-3">
                            {app.status === 'Approved' ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                <Check className="h-3 w-3 stroke-[2.5]" />
                                Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                <Clock3 className="h-3 w-3" />
                                Pending HOD
                              </span>
                            )}
                          </td>

                          {/* Action Button */}
                          <td className="py-3.5 pr-1 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedApplication(app);
                              }}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                              title="View Application Details"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        {/* Application Details Modal */}
        {selectedApplication && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedApplication(null)}
          >
            <div
              className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-slate-900">
                      Application Details
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {selectedApplication.id}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedApplication(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Details Content */}
              <div className="mt-5 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Leave Type
                    </span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                      {selectedApplication.type}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Status
                    </span>
                    <span
                      className={`inline-block mt-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                        selectedApplication.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {selectedApplication.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Duration
                    </span>
                    <span className="font-medium text-slate-800 text-xs mt-0.5 block">
                      {selectedApplication.startDate} to {selectedApplication.endDate} ({selectedApplication.days} days)
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Substitute / Proxy
                    </span>
                    <span className="font-medium text-slate-800 text-xs mt-0.5 block">
                      {selectedApplication.proxy}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Reason Provided
                  </span>
                  <p className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs text-slate-700 leading-relaxed">
                    {selectedApplication.reason}
                  </p>
                </div>

                {/* Audit Workflow Trail */}
                <div className="border-t border-slate-100 pt-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Academic Governance Approval Chain
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-[10px]">
                        ✓
                      </span>
                      <span>Proxy Substitute Accepted: {selectedApplication.proxy}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full font-bold text-[10px] ${
                          selectedApplication.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-amber-100 text-amber-600'
                        }`}
                      >
                        {selectedApplication.status === 'Approved' ? '✓' : '•'}
                      </span>
                      <span>
                        HOD Approval ({selectedApplication.hodName}):{' '}
                        {selectedApplication.status === 'Approved' ? 'Authorized' : 'In Review'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedApplication(null)}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
