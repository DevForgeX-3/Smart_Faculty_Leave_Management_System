import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Clock,
  HeartPulse,
  Briefcase,
  CheckCircle2,
  Clock3,
  Send,
  FileText,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Check,
  LogOut,
  CalendarRange,
  Bell,
  Bot,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  Building,
  AlertCircle,
  ShieldCheck,
  Info,
  CalendarDays,
  Ban,
  History,
  Download,
  ArrowRight,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';

import ProfileModal from './ProfileModal';
import Sidebar from './Sidebar';
import UserProfileMenu from './UserProfileMenu';
import FacultyCalendarView from './FacultyCalendarView';
import InstitutionalProfileView from './InstitutionalProfileView';

export default function DashboardView({ user, onNavigate, showToast }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [requestFilter, setRequestFilter] = useState('all');
  const [requestSearch, setRequestSearch] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [cancelModalApp, setCancelModalApp] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState('October 2026');

  const isDemoUser = (user?.email || '').toLowerCase() === 'faculty@college.edu';

  // Authenticated User State with Editable Fields
  const [currentUser, setCurrentUser] = useState({
    ...user,
    phone: user?.phone || user?.mobile || (isDemoUser ? '+91 98201 45892' : ''),
    alternateEmail: user?.alternateEmail || (isDemoUser ? 'eleanor.vance.research@gmail.com' : ''),
    emergencyContact: user?.emergencyContact || (user?.emergencyContactPhone ? `${user?.emergencyContactName || ''} (${user.emergencyContactPhone})`.trim() : (isDemoUser ? 'Dr. Arthur Vance (+91 98450 11223)' : '')),
    officeRoom: user?.officeRoom || user?.cabinRoom || (isDemoUser ? 'Cabin 304, Academic Block-B' : ''),
    officeHours: user?.officeHours || (isDemoUser ? 'Mon, Wed, Fri: 3:00 PM – 5:00 PM' : 'Mon – Fri: 09:00 AM – 05:00 PM'),
    bio: user?.bio || (isDemoUser ? 'Associate Professor in Computer Science & Engineering. Research interests include Distributed Systems, Cloud Governance, and Machine Learning.' : ''),
    employeeId: user?.employeeId || (isDemoUser ? 'FAC-CSE-2024-0418' : ''),
    joiningDate: user?.joiningDate || user?.dateOfJoining || (isDemoUser ? '16 August 2021' : (user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '')),
  });

  // Profile Form Edit State
  const [profileForm, setProfileForm] = useState({
    phone: currentUser.phone,
    alternateEmail: currentUser.alternateEmail,
    emergencyContact: currentUser.emergencyContact,
    officeRoom: currentUser.officeRoom,
    officeHours: currentUser.officeHours,
    bio: currentUser.bio,
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // Dynamic Quota State (Persisted & User-Aware)
  const userKey = currentUser?.email || user?.email || 'default';

  const defaultDemoBalances = {
    casual: { used: 3, total: 15 },
    medical: { used: 2, total: 10 },
    duty: { used: 1, total: 6 },
  };

  const defaultNewUserBalances = {
    casual: { used: 0, total: user?.leaveBalances?.casual ?? 15 },
    medical: { used: 0, total: user?.leaveBalances?.sick ?? 10 },
    duty: { used: 0, total: user?.leaveBalances?.duty ?? 6 },
  };

  const [leaveBalances, setLeaveBalances] = useState(() => {
    try {
      const saved = localStorage.getItem(`faculty_balances_${userKey}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return isDemoUser ? defaultDemoBalances : defaultNewUserBalances;
  });

  // Default Demo Applications
  const defaultDemoApplications = [
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
      hodRemarks: 'Application received and routed to HOD desk for class substitution verification.',
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
      hodRemarks: 'Approved. Official invitation and academic duty substitution accepted.',
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
      hodRemarks: 'Approved upon receipt of medical fitness certificate.',
    },
  ];

  // Applications List (Persisted & User-Aware)
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem(`faculty_apps_${userKey}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return isDemoUser ? defaultDemoApplications : [];
  });

  // Keep state synced to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`faculty_apps_${userKey}`, JSON.stringify(applications));
    } catch {}
  }, [applications, userKey]);

  useEffect(() => {
    try {
      localStorage.setItem(`faculty_balances_${userKey}`, JSON.stringify(leaveBalances));
    } catch {}
  }, [leaveBalances, userKey]);

  // Leave Form State
  const [formData, setFormData] = useState({
    leaveType: 'Casual Leave',
    customLeaveType: '',
    startDate: '2026-10-20',
    endDate: '2026-10-21',
    proxyFaculty: 'Dr. Sunita Rao (Software Systems Lab)',
    reason: '',
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const facultyName = currentUser?.name || currentUser?.fullName || user?.name || user?.fullName || 'Dr. Eleanor Vance';
  const facultyDept = currentUser?.department || user?.department || 'Computer Science & Engineering';
  const facultyEmail = currentUser?.email || user?.email || 'faculty@college.edu';

  // Live Leaves Fetch from Backend API
  const fetchMyLeaves = useCallback(async () => {
    try {
      const email = facultyEmail;
      const res = await fetch(`/api/leaves/my-leaves?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          if (json.data.length > 0) {
            const mapped = json.data.map((l, i) => ({
              id: l._id || `APP-2026-${915 - i * 20}`,
              type: l.type,
              typeCode: l.typeCode || 'casual',
              startDate: l.startDate,
              endDate: l.endDate,
              days: l.days,
              proxy: l.proxy || 'Assigned Proxy',
              proxyDept: l.proxyDept || 'Department Colleague',
              reason: l.reason || 'Leave Request',
              status: l.status || 'Pending HOD',
              appliedAt: l.appliedAt || 'Recent',
              hodName: l.hodName || 'Prof. K. Ramanathan',
              hodRemarks: l.hodRemarks || 'Application processed by department desk.',
            }));
            setApplications(mapped);
          } else if (!isDemoUser) {
            setApplications([]);
          }
          return;
        }
      }
    } catch (e) {
      console.warn('Backend leaves fetch error, using stored applications', e);
    }
  }, [facultyEmail]);

  useEffect(() => {
    fetchMyLeaves();
  }, [fetchMyLeaves]);

  const getDeptAcronym = (deptName = '') => {
    if (!deptName) return 'CSE';
    if (deptName.toLowerCase().includes('computer') || deptName.toLowerCase().includes('cse')) return 'CSE';
    if (deptName.toLowerCase().includes('information') || deptName.toLowerCase().includes('it')) return 'IT';
    if (deptName.toLowerCase().includes('electronic') || deptName.toLowerCase().includes('ece')) return 'ECE';
    if (deptName.toLowerCase().includes('mechanical') || deptName.toLowerCase().includes('me')) return 'ME';
    if (deptName.toLowerCase().includes('civil') || deptName.toLowerCase().includes('ce')) return 'CE';
    if (deptName.toLowerCase().includes('basic') || deptName.toLowerCase().includes('bsh')) return 'BSH';
    return deptName.replace(/Department of /i, '').slice(0, 8);
  };

  // Calculate duration in days
  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diff = Math.abs(d2 - d1);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  };

  const currentDuration = calculateDays(formData.startDate, formData.endDate);

  // Submit Leave Application (Live Backend Sync)
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!formData.reason.trim()) {
      alert('Please provide a brief reason for the leave application.');
      return;
    }

    if (formData.leaveType === 'Other' && !formData.customLeaveType?.trim()) {
      alert('Please specify the custom leave category or purpose.');
      return;
    }

    setFormSubmitting(true);

    const typeKey =
      formData.leaveType.toLowerCase().includes('casual')
        ? 'casual'
        : formData.leaveType.toLowerCase().includes('medical')
        ? 'medical'
        : formData.leaveType.toLowerCase().includes('duty')
        ? 'duty'
        : 'other';

    const effectiveType =
      formData.leaveType === 'Other' && formData.customLeaveType?.trim()
        ? `Other (${formData.customLeaveType.trim()})`
        : formData.leaveType;

    const proxyName = formData.proxyFaculty.split(' (')[0];

    let newApp = {
      id: `APP-2026-${Math.floor(920 + Math.random() * 70)}`,
      type: effectiveType,
      typeCode: typeKey,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: currentDuration,
      proxy: proxyName,
      proxyDept: 'Department Colleague',
      reason: formData.reason,
      status: 'Pending HOD',
      appliedAt: 'Just now',
      hodName: 'Prof. K. Ramanathan',
      hodRemarks: 'Application submitted. Awaiting HOD review and proxy substitution signoff.',
    };

    try {
      const res = await fetch('/api/leaves/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facultyName: facultyName,
          facultyEmail: facultyEmail,
          department: facultyDept,
          employeeId: currentUser?.employeeId || 'EMP-1001',
          designation: currentUser?.designation || 'Faculty Member',
          type: effectiveType,
          typeCode: typeKey,
          startDate: formData.startDate,
          endDate: formData.endDate,
          days: currentDuration,
          proxy: proxyName,
          proxyDept: 'Department Colleague',
          reason: formData.reason,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data._id) {
          newApp.id = json.data._id;
          newApp.appliedAt = json.data.appliedAt;
        }
      }
    } catch (err) {
      console.warn('Backend live application failed, queuing locally', err);
    }

    setApplications((prev) => [newApp, ...prev]);

    // Deduct from quota count if standard category
    if (leaveBalances[typeKey]) {
      setLeaveBalances((prev) => ({
        ...prev,
        [typeKey]: {
          ...prev[typeKey],
          used: Math.min(prev[typeKey].total, prev[typeKey].used + currentDuration),
        },
      }));
    }

    setFormSubmitting(false);
    setFormSuccess(true);
    setFormData((prev) => ({ ...prev, reason: '', customLeaveType: '' }));

    if (showToast) {
      showToast(`Leave application #${newApp.id} submitted successfully to HOD desk!`, 'success');
    }
  };

  // Cancel Application Handler (Live Backend Sync)
  const handleCancelApplication = async (appId) => {
    const appToCancel = applications.find((a) => a.id === appId);
    if (!appToCancel) return;

    try {
      await fetch(`/api/leaves/${appId}/cancel`, { method: 'PATCH' });
    } catch {}

    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: 'Cancelled' } : app))
    );

    if (leaveBalances[appToCancel.typeCode]) {
      setLeaveBalances((prev) => ({
        ...prev,
        [appToCancel.typeCode]: {
          ...prev[appToCancel.typeCode],
          used: Math.max(0, prev[appToCancel.typeCode].used - appToCancel.days),
        },
      }));
    }

    setCancelModalApp(null);
    setSelectedApplication(null);

    if (showToast) {
      showToast(`Leave application #${appId} cancelled. Quota balance restored.`, 'info');
    }
  };

  // Save Profile Handler
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCurrentUser((prev) => ({
      ...prev,
      ...profileForm,
    }));
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
    if (showToast) {
      showToast('Profile information updated successfully.', 'success');
    }
  };

  // Filtered requests for "My Leave Requests" Page
  const filteredRequests = applications.filter((app) => {
    const matchesSearch =
      app.id.toLowerCase().includes(requestSearch.toLowerCase()) ||
      app.type.toLowerCase().includes(requestSearch.toLowerCase()) ||
      app.reason.toLowerCase().includes(requestSearch.toLowerCase()) ||
      app.proxy.toLowerCase().includes(requestSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (requestFilter === 'all') return true;
    if (requestFilter === 'pending') return app.status.includes('Pending');
    if (requestFilter === 'approved') return app.status === 'Approved';
    if (requestFilter === 'rejected') return app.status === 'Rejected';
    if (requestFilter === 'cancelled') return app.status === 'Cancelled';
    return true;
  });

  // Requests eligible for cancellation (Pending or Future Approved)
  const cancellableRequests = applications.filter(
    (app) => app.status === 'Pending HOD' || (app.status === 'Approved' && new Date(app.startDate) >= new Date('2026-09-20'))
  );

  // Live Leave Calculations
  const totalEntitled = (leaveBalances.casual?.total || 0) + (leaveBalances.medical?.total || 0) + (leaveBalances.duty?.total || 0);
  const totalUsed = (leaveBalances.casual?.used || 0) + (leaveBalances.medical?.used || 0) + (leaveBalances.duty?.used || 0);
  const totalAvailable = Math.max(0, totalEntitled - totalUsed);
  const pendingApps = applications.filter((a) => a.status && a.status.includes('Pending'));
  const approvedApps = applications.filter((a) => a.status === 'Approved');
  const pendingCount = pendingApps.length;
  const approvedCount = approvedApps.length;
  const latestPending = pendingApps[0];
  const latestApproved = approvedApps[0];

  return (
    <div className="flex min-h-screen w-full bg-slate-50 relative">
      {/* Unified Professional Sidebar */}
      <Sidebar
        role="faculty"
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setFormSuccess(false);
        }}
        currentUser={currentUser}
        onOpenProfile={() => setActiveTab('profile')}
        onLogout={() => onNavigate('login')}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        showToast={showToast}
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
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 tracking-wide uppercase">
                  Faculty Portal
                </span>
                <span className="text-xs font-semibold text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Academic Session 2026–2027
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-0.5">
                {activeTab === 'dashboard' && `Welcome back, ${facultyName}`}
                {activeTab === 'profile' && 'My Academic Profile'}
                {activeTab === 'apply' && 'Apply for Leave'}
                {activeTab === 'my-requests' && 'My Leave Requests'}
                {activeTab === 'history' && 'Leave Approval History'}
                {activeTab === 'balance' && 'Leave Balance & Entitlement'}
                {activeTab === 'cancel-leave' && 'Cancel Leave Request'}
                {activeTab === 'calendar' && 'Faculty Leave Calendar'}
                {activeTab === 'holiday-calendar' && 'Academic Holiday Calendar'}
                {activeTab === 'notifications' && 'Notification Center'}
                {activeTab === 'ai-assistant' && 'Leave Policy Assistant (AI)'}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
                {activeTab === 'dashboard' && `${facultyDept} • Employee ID: ${currentUser.employeeId}`}
                {activeTab === 'profile' && 'Review your institutional governance credentials and update permitted personal contact details.'}
                {activeTab === 'apply' && 'Submit statutory leave requests with departmental proxy allocation and automated balance verification.'}
                {activeTab === 'my-requests' && 'Monitor real-time approval status, HOD review remarks, and proxy substitution trails.'}
                {activeTab === 'history' && 'Complete archived audit logs of previous leaves, decisions, and attendance adjustments.'}
                {activeTab === 'balance' && 'Statutory leave categories, annual allotments, and institutional carry-over regulations.'}
                {activeTab === 'cancel-leave' && 'Withdraw eligible pending or scheduled leave applications with instant quota restoration.'}
                {activeTab === 'calendar' && 'Visual monthly view of active, approved, and pending faculty leave schedules.'}
                {activeTab === 'holiday-calendar' && 'Official semester breaks, gazetted holidays, and declared institutional vacations.'}
                {activeTab === 'notifications' && 'Direct circulars, leave endorsement alerts, and academic governance notifications.'}
                {activeTab === 'ai-assistant' && 'Interactive reference for college leave rules, statutory entitlements, and faculty handbook.'}
              </p>
            </div>
          </div>

          {/* Quick Header Actions: Upside Right Corner */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="hidden xl:inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Term II
            </span>

            {/* Executive User Profile Section (Matching Bajaj Reference) */}
            <UserProfileMenu
              user={currentUser}
              onOpenProfile={() => setActiveTab('profile')}
              onLogout={() => onNavigate('login')}
              onNavigate={onNavigate}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>

        {/* =========================================================================
            PAGE 1: FACULTY DASHBOARD (OVERVIEW)
           ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="mt-8 space-y-8 animate-fade-in">
            {/* 4 Executive KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Total Leave Entitlement */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Total Entitlement
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 shadow-2xs">
                      <Calendar className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-heading text-3xl font-extrabold text-slate-900">
                      {totalEntitled}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Days / Year</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/70">
                      Annual Allotment
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>3 Categories: CL, ML & DL</span>
                  <span className="font-semibold text-blue-600">Active</span>
                </div>
              </div>

              {/* Card 2: Available Leave Balance */}
              <div
                onClick={() => setActiveTab('balance')}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Available Balance
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 shadow-2xs">
                      <HeartPulse className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-heading text-3xl font-extrabold text-slate-900">
                      {totalAvailable}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {Math.round((totalAvailable / totalEntitled) * 100)}% Left
                    </span>
                  </div>
                  {/* Clean Mini Progress Bar */}
                  <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      style={{ width: `${Math.round((totalAvailable / totalEntitled) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{totalUsed} days consumed across terms</span>
                  <ChevronRight className="h-3.5 w-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Card 3: Pending Requests */}
              <div
                onClick={() => setActiveTab('my-requests')}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-amber-300 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Pending Requests
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 shadow-2xs">
                      <Clock3 className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-heading text-3xl font-extrabold text-slate-900">
                      {pendingCount}
                    </span>
                    {pendingCount > 0 ? (
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Awaiting HOD
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        All Clear
                      </span>
                    )}
                  </div>
                  <p
                    className="mt-2 text-xs text-slate-500 truncate"
                    title={
                      latestPending
                        ? `${latestPending.type} • ${latestPending.proxy ? `${latestPending.proxy} (Proxy)` : 'Proxy Assigned'}`
                        : 'No active pending applications'
                    }
                  >
                    {latestPending
                      ? `${latestPending.type} • ${latestPending.proxy ? `${latestPending.proxy} (Proxy)` : 'Proxy Assigned'}`
                      : 'No active pending applications'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{pendingCount > 0 ? `${pendingCount} under departmental review` : 'All requests processed'}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Card 4: Approved Leaves */}
              <div
                onClick={() => setActiveTab('history')}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Approved Leaves
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/60 shadow-2xs">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-heading text-3xl font-extrabold text-slate-900">
                      {approvedCount}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        approvedCount > 0
                          ? 'text-indigo-700 bg-indigo-50 border-indigo-200'
                          : 'text-slate-600 bg-slate-100 border-slate-200'
                      }`}
                    >
                      {approvedCount > 0 ? 'Endorsed' : 'None'}
                    </span>
                  </div>
                  <p
                    className="mt-2 text-xs text-slate-500 truncate"
                    title={
                      latestApproved
                        ? `Latest: ${latestApproved.type} (${latestApproved.days}d) synced`
                        : 'Attendance rosters verified & synced'
                    }
                  >
                    {latestApproved
                      ? `Latest: ${latestApproved.type} (${latestApproved.days}d) synced`
                      : 'Attendance rosters verified & synced'}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{approvedCount > 0 ? 'View approval records' : 'Zero approved records'}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* Quick Governance Actions Row */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-3.5">
                Quick Actions
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('apply')}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <Send className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  <span>Apply for Leave</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('my-requests')}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 text-slate-700 hover:text-blue-700 px-4 py-3 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  <Clock3 className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  <span>My Requests</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('balance')}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 text-slate-700 hover:text-blue-700 px-4 py-3 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  <HeartPulse className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  <span>Leave Balance</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 text-slate-700 hover:text-blue-700 px-4 py-3 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  <History className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  <span>Leave History</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('calendar')}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 text-slate-700 hover:text-blue-700 px-4 py-3 text-xs font-semibold transition-all cursor-pointer col-span-2 sm:col-span-1 shadow-2xs"
                >
                  <Calendar className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  <span>Leave Calendar</span>
                </button>
              </div>
            </div>

            {/* Split Grid: Leave Balance Overview & Recent Applications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 1 Col: Balance Overview Widget */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">Leave Balance Overview</h3>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                      2026–2027
                    </span>
                  </div>

                  <div className="mt-5 space-y-4">
                    {/* Casual */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-slate-700 font-medium">Casual Leave (CL)</span>
                        <span className="text-slate-900 font-bold">
                          {leaveBalances.casual.total - leaveBalances.casual.used} / {leaveBalances.casual.total} Days Left
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-[#001C54] rounded-full"
                          style={{
                            width: `${((leaveBalances.casual.total - leaveBalances.casual.used) / leaveBalances.casual.total) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        {leaveBalances.casual.used} days utilized • Max 3 consecutive
                      </span>
                    </div>

                    {/* Medical */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-slate-700 font-medium">Medical Leave (ML)</span>
                        <span className="text-slate-900 font-bold">
                          {leaveBalances.medical.total - leaveBalances.medical.used} / {leaveBalances.medical.total} Days Left
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-teal-700 rounded-full"
                          style={{
                            width: `${((leaveBalances.medical.total - leaveBalances.medical.used) / leaveBalances.medical.total) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        {leaveBalances.medical.used} days utilized • Prescription required for {'>'}2 days
                      </span>
                    </div>

                    {/* Duty */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="text-slate-700 font-medium">Duty Leave (DL)</span>
                        <span className="text-slate-900 font-bold">
                          {leaveBalances.duty.total - leaveBalances.duty.used} / {leaveBalances.duty.total} Days Left
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-slate-500 rounded-full"
                          style={{
                            width: `${((leaveBalances.duty.total - leaveBalances.duty.used) / leaveBalances.duty.total) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        {leaveBalances.duty.used} days utilized • Deputation, Conferences & Seminars
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('balance')}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200/90 text-slate-700 hover:text-slate-900 font-semibold text-xs bg-white hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                >
                  <span>View Full Balance & Policies</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </div>

              {/* Right 2 Cols: Recent Applications & Upcoming Leave */}
              <div className="lg:col-span-2 space-y-6">
                {/* Recent Applications Card */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Recent Applications</h3>
                      <p className="text-xs text-slate-500">Latest leave requests and authorization status</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('my-requests')}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>View All ({applications.length})</span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 mt-2">
                    {applications.slice(0, 3).map((app) => (
                      <div key={app.id} className="py-3.5 flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-slate-900 truncate">
                              {app.type}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              #{app.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {app.startDate} to {app.endDate} • {app.days} {app.days > 1 ? 'days' : 'day'} • Proxy: {app.proxy}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              app.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200/70'
                                : app.status.includes('Pending')
                                ? 'bg-amber-50 text-amber-800 border-amber-200/70'
                                : 'bg-rose-50 text-rose-800 border-rose-200/70'
                            }`}
                          >
                            {app.status}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedApplication(app)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                            title="View Details"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Approved Leave Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">Upcoming Approved Leaves</h3>
                    <span className="text-xs text-slate-400">Next 30 Days</span>
                  </div>

                  {applications.filter((a) => a.status === 'Approved').length > 0 ? (
                    <div className="mt-3 space-y-3">
                      {applications
                        .filter((a) => a.status === 'Approved')
                        .map((app) => (
                          <div
                            key={app.id}
                            className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50/50 border border-blue-100"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold text-xs">
                                <CalendarDays className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900">{app.type}</h4>
                                <p className="text-xs text-slate-600">
                                  {app.startDate} to {app.endDate} ({app.days} {app.days > 1 ? 'days' : 'day'})
                                </p>
                              </div>
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              <Check className="h-3.5 w-3.5" />
                              Confirmed
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-xs text-slate-500">
                        No upcoming approved leaves. You are fully rostered for all department classes.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PAGE 2: MY PROFILE
           ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="mt-8 animate-fade-in w-full">
            <InstitutionalProfileView
              user={currentUser}
              onUpdateUser={(updated) => setCurrentUser(updated)}
              showToast={showToast}
            />
          </div>
        )}

        {/* =========================================================================
            PAGE 3: APPLY FOR LEAVE
           ========================================================================= */}
        {activeTab === 'apply' && (
          <div className="mt-8 space-y-6 animate-fade-in w-full">
            {formSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Leave application submitted successfully for HOD review!</span>
                </div>
                <button
                  onClick={() => setActiveTab('my-requests')}
                  className="underline text-emerald-900 cursor-pointer"
                >
                  View in My Requests →
                </button>
              </div>
            )}

            {/* Quota Balance Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Casual Leave</span>
                  <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      {leaveBalances.casual.total - leaveBalances.casual.used}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Days Available</span>
                  </div>
                  <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(0, Math.min(100, ((leaveBalances.casual.total - leaveBalances.casual.used) / leaveBalances.casual.total) * 100))}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium mt-1.5">
                    <span>Used: {leaveBalances.casual.used}d</span>
                    <span>Total: {leaveBalances.casual.total}d</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Medical Leave</span>
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      {leaveBalances.medical.total - leaveBalances.medical.used}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Days Available</span>
                  </div>
                  <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(0, Math.min(100, ((leaveBalances.medical.total - leaveBalances.medical.used) / leaveBalances.medical.total) * 100))}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium mt-1.5">
                    <span>Used: {leaveBalances.medical.used}d</span>
                    <span>Total: {leaveBalances.medical.total}d</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Duty Leave</span>
                  <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Briefcase className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      {leaveBalances.duty.total - leaveBalances.duty.used}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Days Available</span>
                  </div>
                  <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(0, Math.min(100, ((leaveBalances.duty.total - leaveBalances.duty.used) / leaveBalances.duty.total) * 100))}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium mt-1.5">
                    <span>Used: {leaveBalances.duty.used}d</span>
                    <span>Total: {leaveBalances.duty.total}d</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Leave Application Form */}
            <form onSubmit={handleApplyLeave} className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100 flex items-center justify-between">
                <span>Statutory Leave Application Form</span>
                <span className="text-xs font-normal text-slate-500">Academic Year 2026–2027</span>
              </h3>

              <div className="mt-6 space-y-5">
                {/* Leave Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Leave Category *
                  </label>
                  <select
                    name="leaveType"
                    value={formData.leaveType}
                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-hidden bg-white transition-all"
                  >
                    <option value="Casual Leave">Casual Leave (CL) — Statutory Personal Allowance</option>
                    <option value="Medical Leave">Medical Leave (ML) — Sick & Outpatient Leave</option>
                    <option value="Duty Leave">Duty Leave (DL) — Academic Deputation & Conferences</option>
                    <option value="Special Casual Leave">Special Casual Leave (SCL) — Institutional Duties</option>
                    <option value="Other">Other — Extraordinary / Discretionary Leave</option>
                  </select>

                  {formData.leaveType === 'Other' && (
                    <div className="mt-3 animate-fade-in">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Specify Other Leave Category / Purpose *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sabbatical, Maternity/Paternity, Bereavement, Extraordinary Leave"
                        value={formData.customLeaveType || ''}
                        onChange={(e) => setFormData({ ...formData, customLeaveType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-hidden transition-all"
                      />
                    </div>
                  )}
                </div>

                {/* Date Ranges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-hidden transition-all bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-hidden transition-all bg-white"
                    />
                  </div>
                </div>

                {/* Duration Preview Banner */}
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-slate-700">Calculated Working Days:</span>
                  </div>
                  <span className="px-3.5 py-1 rounded-full font-bold bg-blue-600 text-white shadow-xs">
                    {currentDuration} {currentDuration > 1 ? 'Days Requested' : 'Day Requested'}
                  </span>
                </div>

                {/* Department Proxy Faculty */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Department Proxy / Class Substitution Colleague *
                  </label>
                  <select
                    name="proxyFaculty"
                    value={formData.proxyFaculty}
                    onChange={(e) => setFormData({ ...formData, proxyFaculty: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-hidden bg-white transition-all"
                  >
                    <option value="Dr. Sunita Rao (Software Systems Lab)">Dr. Sunita Rao (Software Systems Lab)</option>
                    <option value="Dr. Rajesh Sharma (Information Systems)">Dr. Rajesh Sharma (Information Systems)</option>
                    <option value="Dr. Ananya Gupta (Data Structures)">Dr. Ananya Gupta (Data Structures)</option>
                    <option value="Prof. K. Ramanathan (Department Chair)">Prof. K. Ramanathan (Department Chair)</option>
                  </select>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Substitute faculty will automatically receive a handover notification to cover your scheduled lecture hours.
                  </p>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Reason for Leave *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide specific details for the leave application for HOD consideration..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-hidden transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-7 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>{formSubmitting ? 'Submitting Application...' : 'Submit Application for HOD Review'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
            PAGE 4: MY LEAVE REQUESTS
           ========================================================================= */}
        {activeTab === 'my-requests' && (
          <div className="mt-8 space-y-6 animate-fade-in">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['all', 'pending', 'approved', 'cancelled'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setRequestFilter(tab)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      requestFilter === tab
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {tab === 'all' ? `All Requests (${applications.length})` : tab}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by ID, type, proxy..."
                  value={requestSearch}
                  onChange={(e) => setRequestSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Requests Table */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Application ID</th>
                      <th className="py-3.5 px-4">Leave Category</th>
                      <th className="py-3.5 px-4">Date Duration</th>
                      <th className="py-3.5 px-4">Proxy Colleague</th>
                      <th className="py-3.5 px-4">Applied Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            {app.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-800">{app.type}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-slate-800 font-semibold">{app.startDate} to {app.endDate}</div>
                            <div className="text-[11px] text-slate-400">{app.days} {app.days > 1 ? 'days' : 'day'}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700">
                            <div>{app.proxy}</div>
                            <div className="text-[11px] text-slate-400">{app.proxyDept}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">{app.appliedAt}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                app.status === 'Approved'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : app.status.includes('Pending')
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedApplication(app)}
                              className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition cursor-pointer text-xs"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          No leave applications found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PAGE 5: LEAVE HISTORY
           ========================================================================= */}
        {activeTab === 'history' && (
          <div className="mt-8 space-y-6 animate-fade-in">
            {/* Historical Statistics Header */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Completed Leaves
                </span>
                <div className="text-3xl font-extrabold text-slate-900 mt-2">
                  {approvedCount}
                </div>
                <p className="text-xs text-slate-400 mt-1">Confirmed academic absences in 2026–2027</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Days Utilized
                </span>
                <div className="text-3xl font-extrabold text-blue-600 mt-2">
                  {totalUsed} Days
                </div>
                <p className="text-xs text-slate-400 mt-1">Deducted from statutory annual quota</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Attendance Compliance
                </span>
                <div className="text-3xl font-extrabold text-emerald-600 mt-2">
                  96.8%
                </div>
                <p className="text-xs text-slate-400 mt-1">Exceeds university minimum threshold of 85%</p>
              </div>
            </div>

            {/* Historical Audit Trail Table */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Archived Decision Logs</h3>
                  <p className="text-xs text-slate-500">Full audit chain with HOD remarks and substitution confirmations</p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast && showToast('Exporting official attendance summary PDF...', 'info')}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Statement</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Period</th>
                      <th className="py-3.5 px-4">Type</th>
                      <th className="py-3.5 px-4">Days</th>
                      <th className="py-3.5 px-4">Decision Remarks</th>
                      <th className="py-3.5 px-4">HOD Signoff</th>
                      <th className="py-3.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {app.startDate} to {app.endDate}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">{app.type}</td>
                        <td className="py-3.5 px-4 text-slate-600">{app.days} days</td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                          {app.hodRemarks}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {app.hodName}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                              app.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : app.status.includes('Pending')
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {app.status}
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
            PAGE 6: LEAVE BALANCE & ENTITLEMENTS
           ========================================================================= */}
        {activeTab === 'balance' && (
          <div className="mt-8 space-y-8 animate-fade-in">
            {/* 3 Detailed Quota Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Casual */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 left-0 h-1 w-full bg-blue-600" />
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold text-slate-900">Casual Leave (CL)</h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Statutory
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {leaveBalances.casual.total - leaveBalances.casual.used}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">/ {leaveBalances.casual.total} Days Left</span>
                </div>
                <div className="mt-4 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${((leaveBalances.casual.total - leaveBalances.casual.used) / leaveBalances.casual.total) * 100}%`,
                    }}
                  />
                </div>
                <div className="mt-3 flex justify-between text-xs text-slate-500">
                  <span>{leaveBalances.casual.used} Days Used</span>
                  <span>{Math.round(((leaveBalances.casual.total - leaveBalances.casual.used) / leaveBalances.casual.total) * 100)}% Remaining</span>
                </div>
              </div>

              {/* Medical */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 left-0 h-1 w-full bg-emerald-500" />
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold text-slate-900">Medical Leave (ML)</h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Health
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {leaveBalances.medical.total - leaveBalances.medical.used}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">/ {leaveBalances.medical.total} Days Left</span>
                </div>
                <div className="mt-4 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${((leaveBalances.medical.total - leaveBalances.medical.used) / leaveBalances.medical.total) * 100}%`,
                    }}
                  />
                </div>
                <div className="mt-3 flex justify-between text-xs text-slate-500">
                  <span>{leaveBalances.medical.used} Days Used</span>
                  <span>{Math.round(((leaveBalances.medical.total - leaveBalances.medical.used) / leaveBalances.medical.total) * 100)}% Remaining</span>
                </div>
              </div>

              {/* Duty */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 left-0 h-1 w-full bg-indigo-600" />
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-bold text-slate-900">Duty Leave (DL)</h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Academic
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {leaveBalances.duty.total - leaveBalances.duty.used}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">/ {leaveBalances.duty.total} Days Left</span>
                </div>
                <div className="mt-4 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{
                      width: `${((leaveBalances.duty.total - leaveBalances.duty.used) / leaveBalances.duty.total) * 100}%`,
                    }}
                  />
                </div>
                <div className="mt-3 flex justify-between text-xs text-slate-500">
                  <span>{leaveBalances.duty.used} Days Used</span>
                  <span>{Math.round(((leaveBalances.duty.total - leaveBalances.duty.used) / leaveBalances.duty.total) * 100)}% Remaining</span>
                </div>
              </div>
            </div>

            {/* Complete Balance Ledger Table */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Leave Balance Ledger (2026–2027)</h3>
                <p className="text-xs text-slate-500">Detailed accounting of entitled, utilized, and carryover days</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Leave Category</th>
                      <th className="py-3.5 px-4">Entitled</th>
                      <th className="py-3.5 px-4">Utilized</th>
                      <th className="py-3.5 px-4">Pending</th>
                      <th className="py-3.5 px-4">Net Available</th>
                      <th className="py-3.5 px-4">Consecutive Limit</th>
                      <th className="py-3.5 px-4 text-right">Rollover Rule</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-bold text-slate-900">Casual Leave (CL)</td>
                      <td className="py-3.5 px-4 text-slate-700">15 Days</td>
                      <td className="py-3.5 px-4 text-rose-600 font-bold">{leaveBalances.casual.used} Days</td>
                      <td className="py-3.5 px-4 text-amber-600 font-bold">2 Days</td>
                      <td className="py-3.5 px-4 text-emerald-700 font-extrabold">{leaveBalances.casual.total - leaveBalances.casual.used} Days</td>
                      <td className="py-3.5 px-4 text-slate-600">3 Days at a time</td>
                      <td className="py-3.5 px-4 text-right text-slate-500">Lapses annually (No carryover)</td>
                    </tr>
                    <tr className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-bold text-slate-900">Medical Leave (ML)</td>
                      <td className="py-3.5 px-4 text-slate-700">10 Days</td>
                      <td className="py-3.5 px-4 text-rose-600 font-bold">{leaveBalances.medical.used} Days</td>
                      <td className="py-3.5 px-4 text-slate-400">0 Days</td>
                      <td className="py-3.5 px-4 text-emerald-700 font-extrabold">{leaveBalances.medical.total - leaveBalances.medical.used} Days</td>
                      <td className="py-3.5 px-4 text-slate-600">No limit (with prescription)</td>
                      <td className="py-3.5 px-4 text-right text-slate-500">Accumulates up to 60 days</td>
                    </tr>
                    <tr className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-bold text-slate-900">Duty Leave (DL)</td>
                      <td className="py-3.5 px-4 text-slate-700">6 Days</td>
                      <td className="py-3.5 px-4 text-rose-600 font-bold">{leaveBalances.duty.used} Days</td>
                      <td className="py-3.5 px-4 text-slate-400">0 Days</td>
                      <td className="py-3.5 px-4 text-emerald-700 font-extrabold">{leaveBalances.duty.total - leaveBalances.duty.used} Days</td>
                      <td className="py-3.5 px-4 text-slate-600">Event duration only</td>
                      <td className="py-3.5 px-4 text-right text-slate-500">Lapses annually</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Institutional Leave Policies & Handbook */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                <span>Institutional Leave Regulations & Compliance Rules</span>
              </h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <h4 className="font-bold text-slate-800 mb-1">1. Class Handover & Proxy Allocation</h4>
                  <p>All faculty members applying for any leave type during instructional days must nominate a consenting departmental colleague to substitute lectures and laboratory sessions.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <h4 className="font-bold text-slate-800 mb-1">2. Medical Documentation</h4>
                  <p>Absence on medical grounds exceeding 2 consecutive days mandates the submission of a medical fitness certificate signed by a registered medical practitioner upon resumption of duty.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <h4 className="font-bold text-slate-800 mb-1">3. Examination & Invigilation Period</h4>
                  <p>Leaves during mid-term and end-semester university examinations require explicit prior written sanction from the Principal in addition to HOD recommendation.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <h4 className="font-bold text-slate-800 mb-1">4. Station Leave Sanction</h4>
                  <p>Any absence requiring leaving the college city jurisdiction over a weekend or vacation period must be declared in advance through the institutional portal.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PAGE 7: CANCEL LEAVE
           ========================================================================= */}
        {activeTab === 'cancel-leave' && (
          <div className="mt-8 space-y-6 animate-fade-in w-full">
            {/* Notice Banner */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-3">
              <AlertCircle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Cancellation Governance Policy:</strong>
                Only leave requests currently pending HOD review or approved for a future date can be cancelled. Once cancelled, your leave balance quota is instantly restored. Historical or rejected requests cannot be cancelled.
              </div>
            </div>

            {/* Cancellable Requests Cards */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100">
                Eligible Applications for Cancellation ({cancellableRequests.length})
              </h3>

              {cancellableRequests.length > 0 ? (
                <div className="divide-y divide-slate-100 mt-2">
                  {cancellableRequests.map((app) => (
                    <div key={app.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{app.type}</span>
                          <span className="font-mono text-xs text-slate-400">#{app.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                              app.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Period: <strong>{app.startDate} to {app.endDate}</strong> ({app.days} {app.days > 1 ? 'days' : 'day'})
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Reason: {app.reason}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setCancelModalApp(app)}
                        className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition cursor-pointer shrink-0"
                      >
                        Cancel Request & Restore Quota
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-3">
                    <Ban className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">No Cancellable Applications</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    You have no active pending or upcoming approved leaves eligible for cancellation at this time.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            PAGE 8: LEAVE CALENDAR WITH COLLEGE ACADEMIC TIMETABLE & MILESTONES
           ========================================================================= */}
        {activeTab === 'calendar' && (
          <div className="mt-8 animate-fade-in">
            <FacultyCalendarView
              applications={applications}
              onSelectApplication={(app) => setSelectedApplication(app)}
              onApplyLeave={(dateStr) => {
                setApplyForm((prev) => ({
                  ...prev,
                  startDate: dateStr,
                  endDate: dateStr,
                }));
                setActiveTab('apply');
              }}
            />
          </div>
        )}

        {/* =========================================================================
            REMAINING 30% MODULES: DISPLAYED IN SIDEBAR BUT BLANK INSIDE
           ========================================================================= */}
        {['holiday-calendar', 'notifications', 'ai-assistant'].includes(activeTab) && (
          <div className="mt-8 min-h-[500px]" />
        )}

        {/* =========================================================================
            MODAL: REQUEST DETAILS WITH AUDIT WORKFLOW TRAIL
           ========================================================================= */}
        {selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 sm:p-7 relative">
              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 font-bold">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    Application #{selectedApplication.id}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedApplication.type}</p>
                </div>
              </div>

              <div className="mt-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Date Range</span>
                    <span className="font-bold text-slate-800">
                      {selectedApplication.startDate} to {selectedApplication.endDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Working Days</span>
                    <span className="font-bold text-slate-800">
                      {selectedApplication.days} {selectedApplication.days > 1 ? 'Days' : 'Day'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Proxy Faculty</span>
                    <span className="font-bold text-slate-800">{selectedApplication.proxy}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Applied At</span>
                    <span className="font-bold text-slate-800">{selectedApplication.appliedAt}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">
                    Faculty Reason for Absence
                  </span>
                  <p className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 italic">
                    "{selectedApplication.reason}"
                  </p>
                </div>

                {/* Audit Workflow Trail */}
                <div className="border-t border-slate-100 pt-4">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
                    Academic Governance Approval Chain
                  </span>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-[10px]">
                        ✓
                      </span>
                      <span>Department Proxy Substitution Handover Accepted ({selectedApplication.proxy})</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-700">
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
                        HOD Review ({selectedApplication.hodName}):{' '}
                        <strong>{selectedApplication.status}</strong>
                      </span>
                    </div>
                    {selectedApplication.hodRemarks && (
                      <p className="ml-7 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {selectedApplication.hodRemarks}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                {selectedApplication.status === 'Pending HOD' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setCancelModalApp(selectedApplication);
                    }}
                    className="rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-2 text-xs font-bold text-rose-700 transition cursor-pointer"
                  >
                    Withdraw Application
                  </button>
                ) : <div />}

                <button
                  type="button"
                  onClick={() => setSelectedApplication(null)}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            CONFIRMATION MODAL: WITHDRAW / CANCEL APPLICATION
           ========================================================================= */}
        {cancelModalApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4 border border-rose-100">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900">
                Confirm Application Withdrawal
              </h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Are you sure you want to withdraw leave application <strong>#{cancelModalApp.id}</strong> for {cancelModalApp.type} ({cancelModalApp.startDate} to {cancelModalApp.endDate})?
              </p>
              <p className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                ✓ Your {cancelModalApp.days} days leave balance will be automatically restored to your annual quota.
              </p>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCancelModalApp(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Keep Application
                </button>
                <button
                  type="button"
                  onClick={() => handleCancelApplication(cancelModalApp.id)}
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-xs transition cursor-pointer"
                >
                  Yes, Cancel Leave
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Interactive Profile Modal */}
      <ProfileModal
        user={currentUser}
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onUpdateProfile={(updated) => setCurrentUser(updated)}
        showToast={showToast}
      />
    </div>
  );
}
