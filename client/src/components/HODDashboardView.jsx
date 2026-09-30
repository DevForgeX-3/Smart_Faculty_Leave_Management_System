import React, { useState } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  Clock3,
  CalendarDays,
  Users,
  Check,
  X,
  LogOut,
  Menu,
  Clock,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function HODDashboardView({ onNavigate, showToast }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // 3 Pending Leave Requests
  const [requests, setRequests] = useState([
    {
      id: 'REQ-101',
      faculty: 'Dr. Eleanor Vance',
      avatar: 'EV',
      designation: 'Associate Professor',
      type: 'Medical Leave',
      dates: 'Oct 02 – Oct 03, 2026',
      duration: '2 Days',
      status: 'pending',
    },
    {
      id: 'REQ-102',
      faculty: 'Dr. Rajesh Sharma',
      avatar: 'RS',
      designation: 'Assistant Professor',
      type: 'Casual Leave',
      dates: 'Oct 08 – Oct 10, 2026',
      duration: '3 Days',
      status: 'pending',
    },
    {
      id: 'REQ-103',
      faculty: 'Prof. Arvind Nambiar',
      avatar: 'AN',
      designation: 'Professor',
      type: 'Duty Leave',
      dates: 'Oct 14 – Oct 15, 2026',
      duration: '2 Days',
      status: 'pending',
    },
  ]);

  const handleApprove = (id, faculty, type) => {
    setRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );
    if (showToast) {
      showToast(`Approved ${type} request for ${faculty}.`, 'success');
    }
  };

  const handleReject = (id, faculty, type) => {
    setRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );
    if (showToast) {
      showToast(`Rejected ${type} request for ${faculty}.`, 'error');
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="flex min-h-screen w-full bg-slate-50 relative">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between bg-blue-900 p-6 text-white shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Branding */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 shadow-sm">
                <ShieldCheck className="h-6 w-6 text-white stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-sm font-bold tracking-tight text-white leading-tight">
                  Smart Faculty Leave
                </span>
                <span className="text-[9px] font-bold tracking-widest text-amber-300 uppercase">
                  HOD DEPARTMENT PORTAL
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg p-1.5 text-blue-200 hover:bg-white/10 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 space-y-1.5">
            {/* Overview (Active) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('overview');
                setMobileMenuOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-800/90 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Overview</span>
            </button>

            {/* Pending Approvals (with small red notification badge '3') */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('pending');
                setMobileMenuOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-blue-800/90 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock3 className="h-4 w-4" />
                <span>Pending Approvals</span>
              </div>
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-bold text-white shadow-sm">
                {pendingCount}
              </span>
            </button>

            {/* Department Schedule */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('schedule');
                setMobileMenuOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-blue-800/90 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <CalendarDays className="h-4 w-4" />
              <span>Department Schedule</span>
            </button>
          </nav>
        </div>

        {/* Bottom: HOD Profile & Logout Button */}
        <div className="border-t border-white/15 pt-5">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 border border-white/10">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-amber-600 font-bold text-white shadow">
              HOD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white leading-tight">
                Dr. HOD
              </p>
              <p className="truncate text-[11px] text-amber-200 mt-0.5">
                Head of Department
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3.5 py-2.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/20 hover:text-white transition-all cursor-pointer border border-white/10"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 min-h-screen">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm lg:hidden hover:bg-slate-50"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome, Dr. HOD | Department of Physics & Chemistry
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
                Academic Session 2026–2027 • Faculty Attendance & Leave Endorsement
              </p>
            </div>
          </div>

          {/* Date Indicator Badge */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm shrink-0">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Academic Year 2026–2027</span>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Card 1: Pending Approvals (Amber Accent, showing '3') */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 w-full bg-amber-500" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pending Approvals
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 shadow-xs">
                <Clock3 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
                {pendingCount}
              </span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
                Requires HOD Review
              </span>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              Department leave requests awaiting sign-off
            </p>
          </div>

          {/* Card 2: Faculty on Leave Today (Blue Accent, showing '1') */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 w-full bg-blue-600" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Faculty on Leave Today
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 shadow-xs">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
                1
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Faculty Member Active on Leave
              </span>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              Lecture substitute proxy coverage confirmed
            </p>
          </div>

          {/* Card 3: Total Department Staff (Slate Accent, showing '14') */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 w-full bg-slate-600" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Department Staff
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200/60 shadow-xs">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
                14
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Active Professors & Faculty
              </span>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              Department of Physics & Chemistry roster
            </p>
          </div>
        </div>

        {/* Main Content: Action Required Table */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-100">
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900">
                Pending Leave Requests
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Action required: Approve or reject incoming department leave applications
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200/60">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              {pendingCount} Pending Decision
            </span>
          </div>

          {/* Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3.5 pl-2">Faculty Name</th>
                  <th className="pb-3.5 px-3">Leave Type</th>
                  <th className="pb-3.5 px-3">Dates</th>
                  <th className="pb-3.5 px-3">Duration</th>
                  <th className="pb-3.5 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Faculty Name */}
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700 text-xs border border-blue-100">
                          {req.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{req.faculty}</div>
                          <div className="text-[11px] text-slate-400 font-medium">
                            {req.designation}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Leave Type */}
                    <td className="py-4 px-3">
                      <span className="inline-block font-semibold text-slate-800">
                        {req.type}
                      </span>
                    </td>

                    {/* Dates */}
                    <td className="py-4 px-3 text-slate-600 font-medium">
                      {req.dates}
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-3">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {req.duration}
                      </span>
                    </td>

                    {/* Actions: Green Approve (Check) and Red Reject (X) buttons */}
                    <td className="py-4 pr-2 text-right">
                      {req.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          {/* Approve (Check) Button */}
                          <button
                            type="button"
                            onClick={() => handleApprove(req.id, req.faculty, req.type)}
                            title="Approve Request"
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200/80 transition-all shadow-xs cursor-pointer active:scale-95"
                          >
                            <Check className="h-4 w-4 stroke-[2.5]" />
                          </button>

                          {/* Reject (X) Button */}
                          <button
                            type="button"
                            onClick={() => handleReject(req.id, req.faculty, req.type)}
                            title="Reject Request"
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200/80 transition-all shadow-xs cursor-pointer active:scale-95"
                          >
                            <X className="h-4 w-4 stroke-[2.5]" />
                          </button>
                        </div>
                      ) : req.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                          <Check className="h-3 w-3 stroke-[3]" />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                          <X className="h-3 w-3 stroke-[3]" />
                          Rejected
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
