import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  User,
  ShieldCheck,
  Calendar,
  LogOut,
  Building2,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function UserProfileMenu({
  user,
  onOpenProfile,
  onLogout,
  onNavigate,
  setActiveTab
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const rawName = user?.name || user?.fullName || 'Academic User';
  const role = (user?.role || 'faculty').toLowerCase();

  // Role display label matching screenshot style
  const roleLabel =
    user?.designation ||
    (role === 'admin'
      ? 'Central Administrator'
      : role === 'hod'
      ? 'Head of Department'
      : 'Faculty Member');

  // Compute clean 2-letter initials (e.g. "Dr. Rajesh Sharma" -> "RS", "Bajaj Admin" -> "BA")
  const getInitials = (name) => {
    if (!name) return 'AU';
    const cleanTokens = name
      .trim()
      .split(/\s+/)
      .filter((tok) => !/^(dr\.?|prof\.?|mr\.?|mrs\.?|ms\.?)$/i.test(tok));

    if (cleanTokens.length === 0) return name.slice(0, 2).toUpperCase();
    if (cleanTokens.length === 1) return cleanTokens[0].slice(0, 2).toUpperCase();
    return (cleanTokens[0][0] + cleanTokens[cleanTokens.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(rawName);

  const handleProfileClick = () => {
    setIsOpen(false);
    if (onOpenProfile) {
      onOpenProfile();
    } else if (setActiveTab) {
      setActiveTab('profile');
    }
  };

  const handleLeaveSummaryClick = () => {
    setIsOpen(false);
    if (setActiveTab) {
      setActiveTab('balance');
    }
  };

  const handleSignOut = () => {
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    } else if (onNavigate) {
      onNavigate('login');
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Profile Trigger Button (Exact layout matching user's reference image) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-3 py-1.5 px-2.5 rounded-2xl hover:bg-slate-100/90 active:bg-slate-200/60 transition-all cursor-pointer group text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        {/* Circle Avatar (Vibrant Blue with White Initials matching image) */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#1a62e8] flex items-center justify-center text-white font-bold text-sm tracking-wide shadow-sm ring-2 ring-blue-100/80 group-hover:ring-blue-200 transition-all">
            {user?.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={rawName}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          {/* Subtle online activity indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>

        {/* Text Stack: Name on top, Role/Designation below */}
        <div className="hidden sm:flex flex-col min-w-0 pr-1">
          <span className="text-sm font-semibold text-slate-800 leading-tight truncate max-w-[170px] group-hover:text-blue-700 transition-colors">
            {rawName}
          </span>
          <span className="text-xs text-slate-500 font-normal leading-tight mt-0.5 truncate max-w-[170px]">
            {roleLabel}
          </span>
        </div>

        {/* Subtle Chevron Down Arrow */}
        <ChevronDown
          className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl bg-white shadow-xl shadow-slate-900/10 border border-slate-200/80 z-50 overflow-hidden animate-fade-in focus:outline-none">
          {/* Menu Header Card */}
          <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50/40 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#1a62e8] flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={rawName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 truncate">{rawName}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || 'user@college.edu'}</p>
                <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-blue-100 text-blue-700 border border-blue-200">
                    {role.toUpperCase()}
                  </span>
                  {user?.employeeId && (
                    <span className="text-[10px] font-mono font-medium text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      ID: {user.employeeId}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {user?.department && (
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center gap-1.5 text-xs text-slate-600">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate font-medium">{user.department}</span>
              </div>
            )}
          </div>

          {/* Action Links */}
          <div className="p-2 space-y-1">
            <button
              type="button"
              onClick={handleProfileClick}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50/70 rounded-xl transition-colors cursor-pointer text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">My Profile</p>
                <p className="text-[11px] font-normal text-slate-400">View and update academic credentials</p>
              </div>
            </button>

            {role === 'faculty' && (
              <button
                type="button"
                onClick={handleLeaveSummaryClick}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50/70 rounded-xl transition-colors cursor-pointer text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Leave Balance</p>
                  <p className="text-[11px] font-normal text-slate-400">Casual, Medical & Duty leaves quota</p>
                </div>
              </button>
            )}

            <div className="my-1 border-t border-slate-100" />

            {/* Sign Out */}
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50/80 rounded-xl transition-colors cursor-pointer text-left group"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-100 transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-rose-700">Sign Out</p>
                <p className="text-[11px] font-normal text-rose-400">End your active portal session</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
