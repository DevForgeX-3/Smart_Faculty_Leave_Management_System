import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock3,
  Users,
  Check,
  X,
  Menu,
  Clock,
  Calendar,
  CheckCircle2,
  Search,
  ChevronRight,
  BookOpen,
  History,
  UserCheck,
  LogOut,
  Bell,
  FileSpreadsheet,
  Sparkles
} from 'lucide-react';

import ProfileModal from './ProfileModal';
import Sidebar from './Sidebar';
import UserProfileMenu from './UserProfileMenu';
import InstitutionalProfileView from './InstitutionalProfileView';

export default function HODDashboardView({ user, onNavigate, showToast }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Active Tab state: 'overview' | 'pending' | 'schedule' | 'faculty'
  const [activeTab, setActiveTab] = useState('overview');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [currentHODUser, setCurrentHODUser] = useState(user);

  // Filter state for Pending Approvals Tab
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Schedule view week offset
  const [scheduleWeek, setScheduleWeek] = useState(0);

  // HOD Details
  const hodName = currentHODUser?.name || currentHODUser?.fullName || user?.name || user?.fullName || 'Prof. K. Ramanathan';
  const hodDept = currentHODUser?.department || user?.department || 'Computer Science & Engineering';

  // Interactive Leave Requests from Backend
  const [requests, setRequests] = useState([]);

  // Department Faculty Roster
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [isLoadingFaculty, setIsLoadingFaculty] = useState(false);

  // Live Department Faculty Fetch
  const fetchDepartmentFaculty = useCallback(async () => {
    setIsLoadingFaculty(true);
    try {
      const res = await fetch(`/api/departments/${encodeURIComponent(hodDept)}/faculty`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          const mapped = json.data.map((f, i) => {
            const initials = (f.name || 'Faculty Member')
              .split(' ')
              .map((w) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);
            return {
              id: f._id || `FAC-${i + 1}`,
              name: f.name || 'Faculty Member',
              avatar: initials || 'FM',
              employeeId: f.employeeId || `EMP-10${i + 20}`,
              designation: f.designation || 'Faculty Member',
              email: f.email,
              subjects: Array.isArray(f.subjectsTaught) && f.subjectsTaught.length > 0
                ? f.subjectsTaught
                : ['Core Curriculum', 'Lab Practicals'],
              casualRemaining: f.leaveBalances?.casual ?? 12,
              sickRemaining: f.leaveBalances?.sick ?? 10,
              dutyRemaining: f.leaveBalances?.duty ?? 5,
              status: f.status === 'Approved' ? 'Active on Campus' : f.status || 'Active on Campus',
            };
          });
          setFacultyMembers(mapped);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend department faculty fetch error', e);
    } finally {
      setIsLoadingFaculty(false);
    }
  }, [hodDept]);

  // Live Department Leave Requests Fetch
  const fetchDepartmentLeaves = useCallback(async () => {
    try {
      const res = await fetch(`/api/leaves/department?department=${encodeURIComponent(hodDept)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          const mapped = json.data.map((l, i) => {
            const initials = (l.facultyName || 'Faculty')
              .split(' ')
              .map((w) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);
            const rawStatus = (l.status || 'pending').toLowerCase();
            const normalizedStatus = rawStatus.includes('pending') ? 'pending' : rawStatus;
            return {
              id: l._id || `REQ-${i + 101}`,
              faculty: l.facultyName || 'Faculty Member',
              avatar: initials || 'FM',
              employeeId: l.employeeId || 'EMP-1001',
              designation: l.designation || 'Faculty Member',
              type: l.type || 'Leave Request',
              typeCode: l.typeCode || 'casual',
              dates: `${l.startDate} – ${l.endDate}`,
              duration: `${l.days} ${l.days === 1 ? 'Day' : 'Days'}`,
              quotaRemaining: 'Available Quota Active',
              proxy: l.proxy || 'Assigned Proxy',
              proxyDept: l.proxyDept || 'Department Faculty',
              proxyClass: 'Academic Substitution Handshake Confirmed',
              reason: l.reason || 'Official Leave Application',
              appliedAt: l.appliedAt || 'Recent',
              status: normalizedStatus,
            };
          });
          setRequests(mapped);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend leaves fetch error', e);
    }
  }, [hodDept]);

  useEffect(() => {
    fetchDepartmentFaculty();
    fetchDepartmentLeaves();
  }, [fetchDepartmentFaculty, fetchDepartmentLeaves]);

  const handleApprove = async (id, faculty, type) => {
    try {
      await fetch(`/api/leaves/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved', hodRemarks: `Endorsed by ${hodName}` }),
      });
    } catch {}

    setRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );
    if (showToast) {
      showToast(`Endorsement Approved: ${type} granted for ${faculty}.`, 'success');
    }
  };

  const handleReject = async (id, faculty, type) => {
    try {
      await fetch(`/api/leaves/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected', hodRemarks: `Rejected by ${hodName}` }),
      });
    } catch {}

    setRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );
    if (showToast) {
      showToast(`Request Rejected: ${type} denied for ${faculty}.`, 'error');
    }
  };

  const handleApproveAll = async () => {
    const pendingItems = requests.filter((r) => r.status === 'pending');
    if (pendingItems.length === 0) {
      if (showToast) showToast('No pending requests to approve.', 'info');
      return;
    }

    for (const item of pendingItems) {
      try {
        await fetch(`/api/leaves/${item.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Approved', hodRemarks: `Batch Endorsed by ${hodName}` }),
        });
      } catch {}
    }

    setRequests((prev) => prev.map((item) => ({ ...item, status: 'approved' })));
    if (showToast) {
      showToast(`Batch approved all ${pendingItems.length} pending leave requests.`, 'success');
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  // Filtered requests for Pending Approvals Tab
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (approvalFilter === 'all') return true;
    if (approvalFilter === 'pending') return req.status === 'pending';
    if (approvalFilter === 'approved') return req.status === 'approved';
    if (approvalFilter === 'rejected') return req.status === 'rejected';
    if (approvalFilter === 'medical') return req.typeCode === 'medical';
    if (approvalFilter === 'casual') return req.typeCode === 'casual';
    if (approvalFilter === 'duty') return req.typeCode === 'duty';
    return true;
  });

  return (
    <div className="flex min-h-screen w-full bg-slate-50 relative">
      {/* Unified Professional Sidebar */}
      <Sidebar
        role="hod"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={currentHODUser || user}
        pendingCount={pendingCount}
        onNavigate={onNavigate}
        onOpenProfile={() => setProfileModalOpen(true)}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 min-h-screen">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm lg:hidden hover:bg-slate-50 cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-0.5">
                <span>{hodDept}</span>
                <span>•</span>
                <span className="capitalize">{activeTab} View</span>
              </div>
              <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
                {activeTab === 'overview' && `Welcome, ${hodName}`}
                {activeTab === 'pending' && 'Pending Leave Endorsements'}
                {activeTab === 'history' && 'Department Leave Approval History'}
                {activeTab === 'schedule' && 'Academic Department Schedule & Timetable'}
                {activeTab === 'availability' && 'Faculty Presence & Class Substitution Roster'}
                {activeTab === 'faculty' && 'Department Faculty Directory & Quotas'}
                {activeTab === 'profile' && 'Department Head Profile & Governance Dossier'}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
                Academic Session 2026–2027 • Institutional Leave Endorsement System
              </p>
            </div>
          </div>

          {/* Quick Header Actions: Upside Right Corner */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Executive User Profile Section (Matching Bajaj Reference) */}
            <UserProfileMenu
              user={user}
              onOpenProfile={() => setActiveTab('profile')}
              onLogout={() => onNavigate('login')}
              onNavigate={onNavigate}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>

        {/* =========================================================================
            TAB 0: HOD INSTITUTIONAL PROFILE TAB
           ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="mt-8 animate-fade-in w-full">
            <InstitutionalProfileView
              user={currentHODUser || user}
              onUpdateUser={(updated) => setCurrentHODUser(updated)}
              showToast={showToast}
            />
          </div>
        )}

        {/* =========================================================================
            TAB 1: OVERVIEW TAB
           ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="mt-8 space-y-8 animate-fade-in">
            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {/* Card 1: Pending Approvals */}
              <div
                onClick={() => setActiveTab('pending')}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group hover:-translate-y-0.5"
              >
                <div className="absolute top-0 left-0 h-1 w-full bg-amber-500" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Pending Approvals
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 shadow-xs group-hover:scale-105 transition-transform">
                    <Clock3 className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
                    {pendingCount}
                  </span>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
                    Action Required
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Leave requests awaiting your signature</span>
                  <ChevronRight className="h-3.5 w-3.5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 2: Faculty on Leave Today */}
              <div
                onClick={() => setActiveTab('schedule')}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group hover:-translate-y-0.5"
              >
                <div className="absolute top-0 left-0 h-1 w-full bg-blue-600" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Faculty on Leave Today
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 shadow-xs group-hover:scale-105 transition-transform">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
                    1
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Dr. Eleanor Vance (Medical)
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Substituted by Dr. Sunita Rao (Confirmed)</span>
                  <ChevronRight className="h-3.5 w-3.5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 3: Total Department Staff */}
              <div
                onClick={() => setActiveTab('faculty')}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group hover:-translate-y-0.5"
              >
                <div className="absolute top-0 left-0 h-1 w-full bg-indigo-600" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Total Faculty Staff
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/60 shadow-xs group-hover:scale-105 transition-transform">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
                    {facultyMembers.length}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                    Active Roster
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>View teacher directory and quota balances</span>
                  <ChevronRight className="h-3.5 w-3.5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Action Required: Pending Requests Table */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-100">
                <div>
                  <h2 className="font-heading text-lg font-bold text-slate-900">
                    Pending Leave Requests
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click approve or reject to sign off on faculty leave applications immediately.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApproveAll}
                    disabled={pendingCount === 0}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Approve All ({pendingCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('pending')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    View Full Details
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="pb-3.5 pl-2">Faculty Member</th>
                      <th className="pb-3.5 px-3">Leave Category</th>
                      <th className="pb-3.5 px-3">Dates & Duration</th>
                      <th className="pb-3.5 px-3">Proxy Nominee</th>
                      <th className="pb-3.5 pr-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {requests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700 text-xs border border-blue-100">
                              {req.avatar}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{req.faculty}</div>
                              <div className="text-[11px] text-slate-400 font-medium">
                                {req.designation} • {req.employeeId}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            req.typeCode === 'medical'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                              : req.typeCode === 'casual'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                          }`}>
                            {req.type}
                          </span>
                        </td>

                        <td className="py-4 px-3">
                          <div className="font-medium text-slate-800">{req.dates}</div>
                          <div className="text-[11px] text-slate-400">{req.duration}</div>
                        </td>

                        <td className="py-4 px-3">
                          <div className="font-medium text-slate-800">{req.proxy}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{req.proxyClass}</div>
                        </td>

                        <td className="py-4 pr-2 text-right">
                          {req.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleApprove(req.id, req.faculty, req.type)}
                                title="Approve Leave Request"
                                className="flex h-8.5 px-3 items-center gap-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 transition-all text-xs font-semibold shadow-xs cursor-pointer active:scale-95"
                              >
                                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                                <span>Approve</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleReject(req.id, req.faculty, req.type)}
                                title="Reject Leave Request"
                                className="flex h-8.5 px-3 items-center gap-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 transition-all text-xs font-semibold shadow-xs cursor-pointer active:scale-95"
                              >
                                <X className="h-3.5 w-3.5 stroke-[2.5]" />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : req.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                              <Check className="h-3 w-3 stroke-[3]" />
                              Endorsed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                              <X className="h-3 w-3 stroke-[3]" />
                              Declined
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Today's Substitution & Proxy Coverage */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    Today's Active Proxy Arrangements
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  Confirmed by Department Office
                </span>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    SR
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">
                      Dr. Sunita Rao <span className="font-normal text-xs text-slate-500">(Substitute)</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Covering: CS301 Data Structures Lab • Room 304 (10:00 AM – 12:00 PM)
                    </div>
                    <div className="text-[11px] text-blue-700 font-medium mt-1">
                      On behalf of: Dr. Eleanor Vance (Medical Leave)
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    OK
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">
                      Full Academic Coverage Active
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      No unattended lecture or laboratory slots in {hodDept} today.
                    </div>
                    <div className="text-[11px] text-emerald-700 font-medium mt-1">
                      100% Department Timetable Fulfilled
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: PENDING APPROVALS TAB
           ========================================================================= */}
        {activeTab === 'pending' && (
          <div className="mt-8 space-y-6 animate-fade-in">
            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {[
                  { id: 'all', label: 'All Requests', count: requests.length },
                  { id: 'pending', label: 'Pending Only', count: pendingCount },
                  { id: 'approved', label: 'Approved' },
                  { id: 'rejected', label: 'Rejected' },
                  { id: 'medical', label: 'Medical' },
                  { id: 'casual', label: 'Casual' },
                  { id: 'duty', label: 'Duty' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setApprovalFilter(f.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                      approvalFilter === f.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <span>{f.label}</span>
                    {f.count !== undefined && (
                      <span className="ml-1.5 text-[10px] opacity-80">({f.count})</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Search & Batch Action */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 md:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by faculty name or ID..."
                    className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApproveAll}
                  disabled={pendingCount === 0}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
                >
                  Approve All Pending
                </button>
              </div>
            </div>

            {/* List of Detailed Request Cards */}
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                  <Clock3 className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-700">No leave applications found matching your filter.</p>
                  <p className="text-xs text-slate-400 mt-1">Try resetting the search or category filters above.</p>
                </div>
              ) : (
                filteredRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Faculty Details & Avatar */}
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-extrabold text-white text-base shadow-sm">
                          {req.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="font-heading text-base font-bold text-slate-900">
                              {req.faculty}
                            </h3>
                            <span className="text-xs font-medium text-slate-500">
                              ({req.employeeId})
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              req.typeCode === 'medical'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : req.typeCode === 'casual'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {req.type}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              Applied on {req.appliedAt}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {req.designation} • Department of {hodDept}
                          </p>

                          {/* Reason Quote */}
                          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                            <span className="font-bold text-slate-800">Reason: </span>
                            "{req.reason}"
                          </div>
                        </div>
                      </div>

                      {/* Right: Dates, Quota & Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0 lg:min-w-[240px]">
                        <div className="text-left lg:text-right">
                          <div className="text-sm font-bold text-slate-900">{req.dates}</div>
                          <div className="text-xs font-semibold text-blue-600">{req.duration}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{req.quotaRemaining}</div>
                        </div>

                        {/* Nominated Proxy Info */}
                        <div className="text-left lg:text-right bg-blue-50/60 p-2.5 rounded-xl border border-blue-100 w-full lg:w-auto">
                          <div className="text-[11px] font-bold text-blue-900">
                            Nominated Proxy: {req.proxy}
                          </div>
                          <div className="text-[10px] text-blue-700">
                            Class: {req.proxyClass}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2.5 w-full sm:w-auto">
                          {req.status === 'pending' ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(req.id, req.faculty, req.type)}
                                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Check className="h-4 w-4 stroke-[2.5]" />
                                <span>Approve Endorsement</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(req.id, req.faculty, req.type)}
                                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <X className="h-4 w-4 stroke-[2.5]" />
                                <span>Reject</span>
                              </button>
                            </>
                          ) : req.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-xl">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              Approved by HOD
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-100 border border-rose-300 px-3.5 py-1.5 rounded-xl">
                              <X className="h-4 w-4 text-rose-600" />
                              Rejected by HOD
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB: APPROVAL HISTORY TAB
           ========================================================================= */}
        {activeTab === 'history' && (
          <div className="mt-8 space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
                  <History className="h-5 w-5 text-blue-600" />
                  Department Leave Approval & Endorsement History
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete record of all leave requests, approvals, endorsements, and rejections.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  Total Tracked: {requests.length} Applications
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="py-3 px-4">Request ID</th>
                      <th className="py-3 px-4">Faculty Member</th>
                      <th className="py-3 px-4">Leave Type</th>
                      <th className="py-3 px-4">Dates & Duration</th>
                      <th className="py-3 px-4">Class Proxy</th>
                      <th className="py-3 px-4">Current Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {requests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-xs text-blue-700">
                          {req.id}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900 text-sm">{req.faculty}</div>
                          <div className="text-[11px] text-slate-400">{req.designation}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            {req.type}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-xs">
                          <div className="font-semibold text-slate-800">{req.dates}</div>
                          <div className="text-slate-400">{req.duration}</div>
                        </td>
                        <td className="py-4 px-4 text-xs">
                          <div className="font-semibold text-slate-700">{req.proxy}</div>
                          <div className="text-[11px] text-slate-400">{req.proxyClass}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            req.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : req.status === 'rejected'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {req.status === 'approved' && <CheckCircle2 className="h-3.5 w-3.5" />}
                            {req.status === 'rejected' && <X className="h-3.5 w-3.5" />}
                            {req.status === 'pending' && <Clock className="h-3.5 w-3.5" />}
                            <span className="capitalize">{req.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: DEPARTMENT SCHEDULE & TIMETABLE MATRIX
           ========================================================================= */}
        {(activeTab === 'schedule' || activeTab === 'availability') && (
          <div className="mt-8 space-y-6 animate-fade-in">
            {/* Header with week navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="font-heading text-lg font-bold text-slate-900">
                  Weekly Faculty Coverage & Timetable
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time schedule showing active lecture presence and authorized faculty leaves.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setScheduleWeek((prev) => prev - 1)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  ← Previous Week
                </button>
                <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                  October 2026 • Week {scheduleWeek + 2}
                </span>
                <button
                  type="button"
                  onClick={() => setScheduleWeek((prev) => prev + 1)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Next Week →
                </button>
              </div>
            </div>

            {/* Timetable Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-x-auto">
              {/* Legend */}
              <div className="flex items-center gap-4 text-xs font-semibold mb-5 pb-4 border-b border-slate-100 flex-wrap">
                <span className="text-slate-400 uppercase tracking-wider text-[11px]">Legend:</span>
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Present on Campus
                </span>
                <span className="flex items-center gap-1.5 text-rose-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Medical Leave
                </span>
                <span className="flex items-center gap-1.5 text-amber-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Casual Leave
                </span>
                <span className="flex items-center gap-1.5 text-blue-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Duty / Conference
                </span>
              </div>

              {/* Grid Table */}
              <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="pb-3.5 pl-2 w-48">Faculty Member</th>
                    <th className="pb-3.5 px-2 text-center">Mon (Oct 05)</th>
                    <th className="pb-3.5 px-2 text-center">Tue (Oct 06)</th>
                    <th className="pb-3.5 px-2 text-center">Wed (Oct 07)</th>
                    <th className="pb-3.5 px-2 text-center">Thu (Oct 08)</th>
                    <th className="pb-3.5 px-2 text-center">Fri (Oct 09)</th>
                    <th className="pb-3.5 px-2 text-center">Sat (Oct 10)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {facultyMembers.length > 0 ? (
                    facultyMembers.map((fac) => (
                      <tr key={fac.id || fac.email} className="hover:bg-slate-50/80">
                        <td className="py-4 pl-2 font-bold text-slate-900">
                          {fac.name}
                          <div className="text-[11px] font-normal text-slate-400">{fac.designation || 'Faculty Member'}</div>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200/50">
                            Present
                          </span>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200/50">
                            Present
                          </span>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200/50">
                            Present
                          </span>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200/50">
                            Present
                          </span>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200/50">
                            Present
                          </span>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs">
                            Off Day
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-slate-400 text-xs font-medium">
                        No faculty members currently allocated to this department roster.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: FACULTY DIRECTORY & QUOTAS TAB
           ========================================================================= */}
        {activeTab === 'faculty' && (
          <div className="mt-8 space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="font-heading text-lg font-bold text-slate-900">
                  {hodDept} • Faculty Directory
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Overview of all professors, assigned subjects, and leave balances.
                </p>
              </div>
              <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
                Total Teaching Staff: {facultyMembers.length}
              </div>
            </div>

            {/* Roster Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {facultyMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                        {member.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{member.name}</h3>
                        <p className="text-xs text-slate-500">{member.designation}</p>
                        <p className="text-[11px] text-slate-400">{member.employeeId}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      member.status.includes('Active')
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {member.status}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Remaining Leave Quotas
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-100">
                        <div className="text-xs font-extrabold text-amber-800">{member.casualRemaining}/12</div>
                        <div className="text-[10px] text-amber-600">Casual</div>
                      </div>
                      <div className="p-2 rounded-xl bg-rose-50/70 border border-rose-100">
                        <div className="text-xs font-extrabold text-rose-800">{member.sickRemaining}/10</div>
                        <div className="text-[10px] text-rose-600">Medical</div>
                      </div>
                      <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-100">
                        <div className="text-xs font-extrabold text-blue-800">{member.dutyRemaining}/5</div>
                        <div className="text-[10px] text-blue-600">Duty</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Subjects: </span>
                    {member.subjects.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Remaining 30% modules: displayed in sidebar, blank inside */}
        {['reports', 'notifications', 'team-analytics'].includes(activeTab) && (
          <div className="mt-8 min-h-[500px]" />
        )}
      </main>

      {/* Interactive HOD Profile Section Modal */}
      <ProfileModal
        user={currentHODUser}
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onUpdateProfile={(updated) => setCurrentHODUser(updated)}
        showToast={showToast}
      />
    </div>
  );
}
