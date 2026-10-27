import React from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  User,
  CalendarDays,
  History,
  HeartPulse,
  Ban,
  Calendar,
  Bell,
  Sparkles,
  Users,
  Clock3,
  BarChart3,
  FileSpreadsheet,
  Building2,
  Settings,
  CalendarRange,
  FileCheck,
  Download,
  Bot,
  LogOut,
  X,
  UserCheck
} from 'lucide-react';

export default function Sidebar({
  role = 'faculty',
  activeTab = 'dashboard',
  onSelectTab,
  setActiveTab,
  currentUser,
  user,
  onOpenProfile,
  onLogout,
  onNavigate,
  mobileOpen = false,
  setMobileOpen,
  pendingCount = 0,
  showToast,
}) {
  const normalizedRole = (role || 'faculty').toLowerCase();
  const effectiveUser = currentUser || user;
  const handleTabSelect = onSelectTab || setActiveTab;
  const handleLogout = onLogout || (() => onNavigate && onNavigate('login'));

  // Navigation schema configured strictly according to professional standards
  const getNavigationSections = () => {
    if (normalizedRole === 'faculty') {
      return [
        {
          title: 'Overview',
          items: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'profile', label: 'My Profile', icon: User },
          ],
        },
        {
          title: 'Leave Management',
          items: [
            { id: 'apply', label: 'Apply for Leave', icon: CalendarDays },
            { id: 'my-requests', label: 'My Leave Requests', icon: Clock3 },
            { id: 'history', label: 'Leave History', icon: History },
            { id: 'balance', label: 'Leave Balance', icon: HeartPulse },
            { id: 'cancel-leave', label: 'Cancel Leave', icon: Ban },
          ],
        },
        {
          title: 'Planning & Information',
          items: [
            { id: 'calendar', label: 'Leave Calendar', icon: Calendar },
            { id: 'holiday-calendar', label: 'Holiday Calendar', icon: CalendarRange },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'ai-assistant', label: 'Leave Policy Assistant', icon: Bot },
          ],
        },
      ];
    }

    if (normalizedRole === 'hod') {
      return [
        {
          title: 'Overview',
          items: [
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'profile', label: 'My Profile', icon: User },
          ],
        },
        {
          title: 'Team Management',
          items: [
            { id: 'pending', label: 'Pending Leave Approvals', icon: Clock3 },
            { id: 'history', label: 'Approval History', icon: History },
            { id: 'schedule', label: 'Department Leave Calendar', icon: Calendar },
            { id: 'availability', label: 'Team Availability', icon: UserCheck },
            { id: 'faculty', label: 'Faculty / Team Members', icon: Users },
          ],
        },
        {
          title: 'Reports & Information',
          items: [
            { id: 'reports', label: 'Leave Reports', icon: FileSpreadsheet },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'team-analytics', label: 'Team Analytics', icon: Sparkles },
          ],
        },
      ];
    }

    // Default to Principal / Admin
    return [
      {
        title: 'Overview',
        items: [
          { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'profile', label: 'My Profile', icon: User },
        ],
      },
      {
        title: 'User & Organization Management',
        items: [
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'approvals', label: 'Registration Approval', icon: UserCheck },
          { id: 'departments', label: 'Department Management', icon: Building2 },
          { id: 'role-access', label: 'Role & Access Management', icon: Settings },
        ],
      },
      {
        title: 'Leave Configuration',
        items: [
          { id: 'policies', label: 'Leave Types & Policies', icon: FileCheck },
          { id: 'quota-management', label: 'Leave Quota Management', icon: HeartPulse },
          { id: 'holiday-management', label: 'Holiday Management', icon: CalendarRange },
          { id: 'request-management', label: 'Leave Request Management', icon: CalendarDays },
        ],
      },
      {
        title: 'Monitoring & Intelligence',
        items: [
          { id: 'analytics', label: 'Leave Analytics', icon: BarChart3 },
          { id: 'reports-export', label: 'Reports & Export', icon: Download },
          { id: 'logs', label: 'Audit Logs', icon: FileSpreadsheet },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'workforce-ai', label: 'Workforce Analytics', icon: Sparkles },
        ],
      },
    ];
  };

  const sections = getNavigationSections();

  const handleItemClick = (item) => {
    if (item.action) {
      item.action();
    } else if (handleTabSelect) {
      handleTabSelect(item.id);
    }

    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const userName =
    effectiveUser?.name || effectiveUser?.fullName || (normalizedRole === 'admin' ? 'System Administrator' : 'Faculty Member');
  const userDept = effectiveUser?.department || 'Academic Affairs';
  const roleBadge = normalizedRole.toUpperCase();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen && setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Aside */}
      <aside
        style={{ backgroundColor: '#001C54' }}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-white/10 text-white shadow-2xl transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-5 scrollbar-thin scrollbar-thumb-white/10">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-5 px-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white border border-white/20 shadow-inner">
                <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  Smart Leave
                </h2>
                <p className="text-xs font-semibold text-blue-200/90 tracking-wide">
                  {normalizedRole === 'admin'
                    ? 'Administrator Portal'
                    : normalizedRole === 'hod'
                    ? 'HOD / Manager Portal'
                    : 'Faculty Portal'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className="rounded-lg p-1.5 text-blue-200 hover:bg-white/10 hover:text-white lg:hidden cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Grouped Navigation Sections */}
          <nav className="space-y-6">
            {sections.map((section, idx) => (
              <div key={idx}>
                <h3 className="px-3 mb-2.5 text-xs font-bold uppercase tracking-wider text-blue-200/75">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleItemClick(item)}
                        className={`group flex w-full items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-lg shadow-black/20 ring-1 ring-white/25'
                            : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 shrink-0 transition-colors ${
                            isActive
                              ? 'text-white'
                              : 'text-blue-300/80 group-hover:text-white'
                          }`}
                        />
                        <span className="truncate text-left leading-normal">{item.label}</span>

                        {/* Pending count badge if applicable */}
                        {(item.id === 'pending' || item.id === 'approvals') && pendingCount > 0 && (
                          <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs shrink-0">
                            {pendingCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom User Profile (Mobile Drawer only) */}
        <div className="border-t border-white/10 p-4 bg-[#001540] lg:hidden">
          <div className="flex items-center justify-between rounded-xl bg-white/5 hover:bg-white/10 p-3 border border-white/10 transition-all group">
            <div
              onClick={onOpenProfile}
              title="Click to view profile"
              className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 font-bold text-white text-sm shadow">
                {effectiveUser?.photoUrl ? (
                  <img
                    src={effectiveUser.photoUrl}
                    alt={userName}
                    className="h-full w-full object-cover rounded-xl"
                  />
                ) : (
                  userName
                    .split(' ')
                    .filter((p) => !p.startsWith('Dr.') && !p.startsWith('Prof.'))
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase() || 'U'
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white group-hover:text-blue-200 transition-colors">
                  {userName}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/15 text-blue-200 border border-white/20">
                    {roleBadge}
                  </span>
                  <span className="truncate text-xs font-medium text-blue-200/80">{userDept}</span>
                </div>
              </div>
            </div>

            {/* Upside right corner Sign Out button */}
            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              aria-label="Sign Out"
              className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-rose-300 hover:bg-rose-600 hover:text-white border border-white/15 transition-all shadow-xs cursor-pointer group/btn"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}
