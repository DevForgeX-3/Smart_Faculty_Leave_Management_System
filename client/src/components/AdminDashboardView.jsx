import React, { useState } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Building,
  FileSpreadsheet,
  LogOut,
  Menu,
  X,
  Clock,
  UserPlus,
  Download,
  Settings,
  Activity,
  CheckCircle2,
  Server,
  UserCheck,
  FileText
} from 'lucide-react';

export default function AdminDashboardView({ onNavigate, showToast }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Recent System Activity Mock Logs
  const activityLogs = [
    {
      id: 1,
      event: 'New Faculty Account Registered: Dr. Vance',
      description: 'Department of Information Technology • Account verification completed',
      timestamp: '10 mins ago',
      type: 'user',
      icon: UserCheck,
      badge: 'User Management',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/60',
    },
    {
      id: 2,
      event: 'HOD Approved Leave: Prof. Smith',
      description: 'Medical Leave (2 days) • Lecture proxy confirmed with Dr. Sunita Rao',
      timestamp: '32 mins ago',
      type: 'leave',
      icon: CheckCircle2,
      badge: 'Leave Governance',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    },
    {
      id: 3,
      event: 'System Backup Completed',
      description: 'Encrypted academic database snapshot archived to ISO 27001 vault',
      timestamp: '2 hours ago',
      type: 'system',
      icon: ShieldCheck,
      badge: 'Automated System',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200/60',
    },
    {
      id: 4,
      event: 'Leave Quota Initialization: Academic Session 2026–2027',
      description: 'Statutory casual and medical allowances applied to 156 active faculty members',
      timestamp: 'Yesterday, 04:30 PM',
      type: 'policy',
      icon: FileText,
      badge: 'Policy Audit',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200/60',
    },
  ];

  const handleAction = (actionName) => {
    if (showToast) {
      if (actionName === 'Add New HOD Account') {
        showToast('HOD Onboarding modal initialized. Enter credentials to invite.', 'info');
      } else if (actionName === 'Export Monthly Leave Report') {
        showToast('Monthly Leave Report (CSV/Excel) generated and downloaded.', 'success');
      } else {
        showToast('System Governance Settings loaded.', 'info');
      }
    }
  };

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
                <span className="text-[9px] font-bold tracking-widest text-indigo-300 uppercase">
                  MASTER ADMINISTRATOR
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
            {/* System Overview (Active) */}
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
              <span>System Overview</span>
            </button>

            {/* User Directory */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('users');
                setMobileMenuOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-blue-800/90 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>User Directory</span>
            </button>

            {/* Manage Departments */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('departments');
                setMobileMenuOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'departments'
                  ? 'bg-blue-800/90 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Building className="h-4 w-4" />
              <span>Manage Departments</span>
            </button>

            {/* Audit Logs */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('logs');
                setMobileMenuOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'logs'
                  ? 'bg-blue-800/90 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Audit Logs</span>
            </button>
          </nav>
        </div>

        {/* Bottom: Admin Profile & Logout Button */}
        <div className="border-t border-white/15 pt-5">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 border border-white/10">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 font-bold text-white shadow">
              SA
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white leading-tight">
                System Administrator
              </p>
              <p className="truncate text-[11px] text-indigo-300 mt-0.5">
                Master System Access
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
                System Administrator Portal | Master Access
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
                Academic Session 2026–2027 • Institution-Wide Governance, User Roles & Policies
              </p>
            </div>
          </div>

          {/* Master Access Badge */}
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 rounded-xl px-3 py-2 shadow-xs shrink-0">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            <span>Master Console Online</span>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Card 1: Total Active Users (Purple Accent, showing '156') */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 w-full bg-purple-600" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Active Users
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60 shadow-xs">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
                156
              </span>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
                +12 this semester
              </span>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              Faculty, HODs, and Administrative staff
            </p>
          </div>

          {/* Card 2: Departments Managed (Indigo Accent, showing '8') */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 w-full bg-indigo-600" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Departments Managed
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/60 shadow-xs">
                <Building className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
                8
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Active Academic Departments
              </span>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              All departmental proxy workflows configured
            </p>
          </div>

          {/* Card 3: System Health (Emerald Accent, showing '100% Uptime') */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 w-full bg-emerald-600" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                System Health
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 shadow-xs">
                <Server className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
                100%
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                Uptime Active
              </span>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              All microservices operational • 256-Bit Encrypted
            </p>
          </div>
        </div>

        {/* Main Content: Split Layout (Left: 60%, Right: 40%) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side (60% width): Recent System Activity */}
          <section className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm h-full">
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div>
                  <h2 className="font-heading text-lg font-bold text-slate-900">
                    Recent System Activity
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time operational audit log and governance feed
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                  <Activity className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Live Feed</span>
                </div>
              </div>

              {/* Vertical Timeline List */}
              <div className="mt-6 space-y-6 relative before:absolute before:inset-0 before:left-4 before:h-full before:w-0.5 before:bg-slate-100">
                {activityLogs.map((log) => {
                  const Icon = log.icon;
                  return (
                    <div key={log.id} className="relative flex items-start gap-4 pl-1">
                      {/* Node Icon */}
                      <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 shadow-xs text-slate-600">
                        <Icon className="h-3.5 w-3.5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 -mt-0.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-bold text-slate-900 leading-tight">
                            {log.event}
                          </p>
                          <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                            {log.timestamp}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                          {log.description}
                        </p>
                        <span
                          className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-md border ${log.badgeColor}`}
                        >
                          {log.badge}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Right Side (40% width): Quick Actions */}
          <section className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="pb-5 border-b border-slate-100">
                  <h2 className="font-heading text-lg font-bold text-slate-900">
                    Quick Actions
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Centralized administrative shortcuts and reports
                  </p>
                </div>

                {/* Full-Width Outline Buttons */}
                <div className="mt-6 space-y-3.5">
                  <button
                    type="button"
                    onClick={() => handleAction('Add New HOD Account')}
                    className="w-full flex items-center justify-between rounded-xl border border-slate-200 hover:border-blue-600 bg-white hover:bg-blue-50/50 p-4 text-left transition-all group shadow-2xs cursor-pointer active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <UserPlus className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                          Add New HOD Account
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Provision department head credentials
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction('Export Monthly Leave Report')}
                    className="w-full flex items-center justify-between rounded-xl border border-slate-200 hover:border-emerald-600 bg-white hover:bg-emerald-50/50 p-4 text-left transition-all group shadow-2xs cursor-pointer active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Download className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                          Export Monthly Leave Report
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Compile comprehensive CSV & audit log
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction('System Settings')}
                    className="w-full flex items-center justify-between rounded-xl border border-slate-200 hover:border-purple-600 bg-white hover:bg-purple-50/50 p-4 text-left transition-all group shadow-2xs cursor-pointer active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600 border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <Settings className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                          System Settings
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Configure statutory leave limits & terms
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Status footer inside quick actions card */}
              <div className="mt-8 pt-4 border-t border-slate-100 text-center">
                <span className="text-[11px] font-medium text-slate-400">
                  Academic Governance Server • ISO 27001 Certified
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
