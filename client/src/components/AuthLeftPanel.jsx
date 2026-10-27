import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Building2,
  Users,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Award,
  CheckSquare
} from 'lucide-react';

const PORTAL_ROLES = [
  {
    id: 'faculty',
    badge: 'ACADEMIC WORKFORCE',
    title: 'Faculty Leave Portal',
    description:
      'Manage the complete faculty leave lifecycle from lecture substitution to department quota balancing and instant administrative approvals.',
    stages: [
      {
        id: 'dept',
        label: 'Department',
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18" />
            <path d="M5 21V9l7-5 7 5v12" />
            <path d="M9 14h6" />
            <path d="M9 18h6" />
            <path d="M10 9h4" />
          </svg>
        ),
      },
      {
        id: 'pool',
        label: 'Faculty Pool',
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
      {
        id: 'request',
        label: 'Leave Request',
        isHero: true,
        heroBadge: 'LEAVE DOSSIER',
        heroSub: 'VERIFIED',
      },
      {
        id: 'coverage',
        label: 'Coverage',
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h.01" />
            <path d="M12 10h.01" />
            <path d="M16 10h.01" />
          </svg>
        ),
      },
      {
        id: 'approval',
        label: 'HOD Approval',
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ),
      },
    ],
    box1: {
      icon: GraduationCap,
      title: 'Faculty & Staff',
      desc: 'Apply for statutory leaves, view real-time balances, and assign timetable substitutes seamlessly.',
    },
    box2: {
      icon: Building2,
      title: 'Department HODs',
      desc: 'Review department roster, verify class coverage arrangements, and execute approvals instantly.',
    },
  },
  {
    id: 'hod',
    badge: 'DEPARTMENTAL GOVERNANCE',
    title: 'HOD Endorsement Portal',
    description:
      'Review pending applications, inspect teaching workload impacts, verify proxy arrangements, and endorse leaves for academic continuity.',
    stages: [
      {
        id: 'audit',
        label: 'Workload Audit',
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <line x1="9" y1="7" x2="15" y2="7" />
            <line x1="9" y1="11" x2="15" y2="11" />
          </svg>
        ),
      },
      {
        id: 'roster',
        label: 'Faculty Roster',
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <path d="M8 14h.01" />
            <path d="M12 14h.01" />
            <path d="M16 14h.01" />
          </svg>
        ),
      },
      {
        id: 'request',
        label: 'HOD Review',
        isHero: true,
        heroBadge: 'ENDORSEMENT',
        heroSub: 'SANCTIONED',
      },
      {
        id: 'proxy',
        label: 'Proxy Clearance',
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <polyline points="16 11 18 13 22 9" />
          </svg>
        ),
      },
      {
        id: 'sanction',
        label: 'Dean Forwarding',
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        ),
      },
    ],
    box1: {
      icon: Building2,
      title: 'Department Leadership',
      desc: 'Maintain academic continuity, track syllabus progress, and endorse faculty absence requests with full audit trails.',
    },
    box2: {
      icon: Users,
      title: 'Lecture Availability',
      desc: 'Verify substitute coverage before sanctioning to guarantee zero unattended classroom periods.',
    },
  },
  {
    id: 'admin',
    badge: 'CENTRAL ADMINISTRATION',
    title: 'Academic Governance Portal',
    description:
      'Centralized institutional governance for statutory leave policies, academic session calendar compliance, regulatory audits, and accreditation records.',
    stages: [
      {
        id: 'policy',
        label: 'Statutory Policy',
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
      },
      {
        id: 'quota',
        label: 'Quota Accrual',
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        ),
      },
      {
        id: 'request',
        label: 'Executive Audit',
        isHero: true,
        heroBadge: 'GOVERNANCE',
        heroSub: 'REGULATORY',
      },
      {
        id: 'service',
        label: 'Service Book',
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        ),
      },
      {
        id: 'iso',
        label: 'ISO Compliance',
        icon: (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        ),
      },
    ],
    box1: {
      icon: ShieldCheck,
      title: 'Institutional Deans',
      desc: 'Enforce university governance policies, manage annual leave quotas, and maintain statutory service books.',
    },
    box2: {
      icon: Award,
      title: 'Compliance & Audits',
      desc: 'Generate accreditation reports for NAAC, NBA, and AICTE with tamper-evident digitized audit logs.',
    },
  },
];

export default function AuthLeftPanel() {
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-rotate roles every 4.8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveRoleIndex((prev) => (prev + 1) % PORTAL_ROLES.length);
        setIsTransitioning(false);
      }, 300);
    }, 4800);

    return () => clearInterval(timer);
  }, []);

  const handleManualRoleSelect = (index) => {
    if (index === activeRoleIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveRoleIndex(index);
      setIsTransitioning(false);
    }, 250);
  };

  const currentRole = PORTAL_ROLES[activeRoleIndex];
  const Box1Icon = currentRole.box1.icon;
  const Box2Icon = currentRole.box2.icon;

  return (
    <div className="hidden lg:flex lg:w-1/2 xl:w-[50%] h-full relative overflow-hidden flex-col justify-between p-10 xl:p-12 text-white shrink-0 select-none bg-gradient-to-br from-[#062963] via-[#041d48] to-[#02112d]">
      {/* 1. Subtle Radial Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-blue-500/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* 2. Top-Right Corner Dot Matrix Pattern */}
      <div className="absolute top-8 right-10 w-28 h-28 opacity-30 pointer-events-none">
        <svg width="112" height="112" viewBox="0 0 112 112" fill="none">
          <defs>
            <pattern id="dot-matrix-v2" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#93c5fd" />
            </pattern>
          </defs>
          <rect width="112" height="112" fill="url(#dot-matrix-v2)" />
        </svg>
      </div>

      {/* 3. Bottom Wave Lines */}
      <div className="absolute bottom-0 left-0 right-0 h-28 opacity-25 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1200 200" fill="none" className="w-full h-full preserve-3d">
          <path
            d="M 0 140 C 300 80 500 180 850 110 C 1000 80 1120 140 1200 120"
            stroke="#60a5fa"
            strokeWidth="1.5"
            strokeDasharray="5 5"
          />
          <path
            d="M 0 170 C 350 110 600 220 950 150 C 1080 120 1150 180 1200 160"
            stroke="#93c5fd"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* TOP BRAND HEADER */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/20 border border-blue-400/40 backdrop-blur-md shadow-sm">
            <Layers className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base tracking-wide leading-tight">
              Smart Faculty Portal
            </h2>
            <p className="text-xs text-blue-200/90 font-medium">
              Academic Governance & Leave Management
            </p>
          </div>
        </div>

        {/* Role Rotation Indicators (Clickable Pills) with Active Progress Loader */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
            {PORTAL_ROLES.map((role, idx) => {
              const isActive = activeRoleIndex === idx;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleManualRoleSelect(idx)}
                  className={`relative px-3.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer overflow-hidden ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-blue-200/70 hover:text-white'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
                    )}
                    {role.id === 'faculty' ? 'Faculty' : role.id === 'hod' ? 'HOD' : 'Admin'}
                  </span>
                  {isActive && (
                    <span
                      key={`pill-loader-${activeRoleIndex}`}
                      className="absolute bottom-0 left-0 h-[2px] bg-cyan-300 rounded-full animate-rotate-progress pointer-events-none"
                    />
                  )}
                </button>
              );
            })}
          </div>
          {/* Cycle Countdown Loader Bar */}
          <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden mt-1.5 px-0.5">
            <div
              key={`cycle-loader-${activeRoleIndex}`}
              className="h-full bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-200 rounded-full animate-rotate-progress"
            />
          </div>
        </div>
      </div>

      {/* 1. HEADLINE & DESCRIPTION (Refined, Decreased Text Size as requested) */}
      <div className="relative z-10 mt-5 xl:mt-6 max-w-xl">
        <div
          className={`transition-all duration-300 ${
            isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-[10px] font-bold tracking-wider uppercase text-blue-200 mb-2">
            <Sparkles className="w-3 h-3 text-blue-300" />
            <span>{currentRole.badge}</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-[27px] font-bold text-white tracking-tight leading-snug">
            {currentRole.title}
          </h1>
          <p className="text-blue-100/85 text-xs sm:text-[13.5px] mt-2 leading-relaxed font-normal max-w-lg">
            {currentRole.description}
          </p>
        </div>
      </div>

      {/* 2. CENTER FLOWCHART (Increased Size & Clear Spacing as requested) */}
      <div className="relative z-10 my-auto py-6 w-full max-w-2xl mx-auto">
        <div
          className={`relative transition-all duration-300 ${
            isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {/* Architectural Campus Silhouette Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 -translate-y-3">
            <svg width="600" height="190" viewBox="0 0 600 190" fill="none" stroke="#93c5fd" strokeWidth="1.2">
              {/* Central Clock Tower & Academic Pediment */}
              <polygon points="300,15 250,50 350,50" />
              <rect x="265" y="50" width="70" height="105" />
              {/* Cupola & Arched Window */}
              <path d="M 290 75 A 10 10 0 0 1 310 75 L 310 95 L 290 95 Z" />
              <line x1="300" y1="8" x2="300" y2="15" strokeWidth="1.5" />
              <polygon points="300,8 312,11 300,14" fill="#93c5fd" stroke="none" />

              {/* Main Portico Pillars */}
              <line x1="280" y1="110" x2="280" y2="155" />
              <line x1="320" y1="110" x2="320" y2="155" />
              <path d="M 285 155 L 285 130 A 15 15 0 0 1 315 130 L 315 155" />

              {/* Left Wing & Windows */}
              <rect x="145" y="70" width="120" height="85" />
              <rect x="160" y="85" width="22" height="26" rx="2" />
              <rect x="195" y="85" width="22" height="26" rx="2" />
              <rect x="230" y="85" width="22" height="26" rx="2" />
              <rect x="160" y="120" width="22" height="24" rx="2" />
              <rect x="195" y="120" width="22" height="24" rx="2" />
              <rect x="230" y="120" width="22" height="24" rx="2" />

              {/* Right Wing & Windows */}
              <rect x="335" y="70" width="120" height="85" />
              <rect x="350" y="85" width="22" height="26" rx="2" />
              <rect x="385" y="85" width="22" height="26" rx="2" />
              <rect x="420" y="85" width="22" height="26" rx="2" />
              <rect x="350" y="120" width="22" height="24" rx="2" />
              <rect x="385" y="120" width="22" height="24" rx="2" />
              <rect x="420" y="120" width="22" height="24" rx="2" />

              {/* Left Outer Pavilion */}
              <polygon points="115,52 85,74 145,74" />
              <rect x="85" y="74" width="60" height="81" />
              <rect x="98" y="90" width="34" height="50" rx="2" />

              {/* Right Outer Pavilion */}
              <polygon points="485,52 455,74 515,74" />
              <rect x="455" y="74" width="60" height="81" />
              <rect x="468" y="90" width="34" height="50" rx="2" />

              {/* Stylized Campus Trees on Left & Right */}
              <path d="M 40 155 C 28 130 45 105 65 118 C 82 100 100 130 88 155 Z" />
              <line x1="64" y1="155" x2="64" y2="168" strokeWidth="1.5" />
              <path d="M 510 155 C 498 130 515 105 535 118 C 552 100 570 130 558 155 Z" />
              <line x1="534" y1="155" x2="534" y2="168" strokeWidth="1.5" />

              {/* Ground Horizon Line */}
              <line x1="10" y1="160" x2="590" y2="160" strokeDasharray="3 3" />
            </svg>
          </div>

          {/* 5 Connected Flow Nodes in Foreground (Enlarged Size) */}
          <div className="relative z-10 flex items-center justify-between px-3">
            {/* Connecting Dashed Line */}
            <div className="absolute top-[42px] left-12 right-12 -translate-y-1/2 border-t-2 border-dashed border-blue-300/35 z-0 pointer-events-none" />

            {currentRole.stages.map((stage) => {
              if (stage.isHero) {
                return (
                  <div key={stage.id} className="relative z-10 flex flex-col items-center scale-110">
                    <div className="w-20 h-24 xl:w-22 xl:h-26 rounded-2xl bg-gradient-to-b from-[#2563eb] to-[#0f3980] border-2 border-blue-300 backdrop-blur-md flex flex-col items-center justify-between p-2.5 shadow-[0_0_35px_rgba(59,130,246,0.65)]">
                      {/* Top Clip */}
                      <div className="w-8 h-2.5 rounded-t-sm bg-blue-200/90 -mt-2.5 border-t border-x border-white/60 shadow-xs" />

                      {/* Avatar Circle */}
                      <div className="w-7 h-7 rounded-full bg-white/20 border border-white/50 flex items-center justify-center mt-0.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>

                      {/* Content Form Lines */}
                      <div className="w-full space-y-1 px-1">
                        <div className="h-1.5 w-full bg-white/70 rounded-full" />
                        <div className="h-1.5 w-3/4 bg-white/45 rounded-full" />
                      </div>

                      {/* Small Bottom Status Seal */}
                      <div className="flex items-center gap-1 self-end bg-emerald-400 text-slate-900 rounded-full px-2 py-0.5 text-[9px] font-extrabold shadow-xs">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{stage.heroSub}</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-white mt-2.5 px-2.5 py-0.5 rounded-full bg-blue-600/70 border border-blue-400/50 shadow-xs whitespace-nowrap">
                      {stage.label}
                    </span>
                  </div>
                );
              }

              return (
                <div key={stage.id} className="relative z-10 flex flex-col items-center group">
                  <div className="w-16 h-16 xl:w-[68px] xl:h-[68px] rounded-2xl bg-[#083375]/95 border border-blue-400/50 backdrop-blur-md flex items-center justify-center shadow-lg shadow-blue-950/50 transition-all duration-300 group-hover:scale-105 group-hover:border-blue-300">
                    {stage.icon}
                  </div>
                  <span className="text-xs font-semibold text-blue-200 mt-2.5 whitespace-nowrap">
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. TWO BOXES (Distinct Space Between Them as requested) */}
      <div className="relative z-10 mt-auto mb-4 w-full max-w-xl lg:max-w-2xl">
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-8 xl:gap-10 transition-all duration-300 ${
            isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          {/* Card 1 */}
          <div className="rounded-2xl bg-white/[0.07] hover:bg-white/[0.11] transition-all border border-white/15 p-5 xl:p-5.5 backdrop-blur-md shadow-md">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/25 text-blue-200 border border-blue-400/30 shadow-xs">
                <Box1Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">
                  {currentRole.box1.title}
                </h4>
                <p className="text-xs text-blue-100/80 mt-1.5 leading-relaxed">
                  {currentRole.box1.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl bg-white/[0.07] hover:bg-white/[0.11] transition-all border border-white/15 p-5 xl:p-5.5 backdrop-blur-md shadow-md">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/25 text-blue-200 border border-blue-400/30 shadow-xs">
                <Box2Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">
                  {currentRole.box2.title}
                </h4>
                <p className="text-xs text-blue-100/80 mt-1.5 leading-relaxed">
                  {currentRole.box2.desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER: System Tagline */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-200/80">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">Campus Leave Management Platform</span>
          <span>•</span>
          <span>Secure</span>
          <span>•</span>
          <span>Centralized</span>
          <span>•</span>
          <span>Role-based</span>
        </div>
        <span className="text-blue-300/80 font-mono text-[10px]">v2.4 LTS</span>
      </div>
    </div>
  );
}
