import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  Copy,
  Check,
  GraduationCap,
  UserCheck,
  Lock,
  Clock,
  MapPin,
  FileText,
  LifeBuoy
} from 'lucide-react';

export default function SupportModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('accounts'); // 'accounts' | 'helpdesk'
  const [copiedKey, setCopiedKey] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const testAccounts = [
    {
      role: 'FACULTY',
      title: 'Faculty Member',
      name: 'Dr. Eleanor Vance',
      designation: 'Associate Professor, Computer Science',
      email: 'faculty@college.edu',
      pass: 'Faculty@123',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: GraduationCap,
      description: 'Apply for statutory leaves, arrange timetable proxy coverage, track personal balances.'
    },
    {
      role: 'HOD',
      title: 'Department Head',
      name: 'Prof. K. Ramanathan',
      designation: 'Head of Department, Computer Science',
      email: 'hod@college.edu',
      pass: 'Hod@123',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: UserCheck,
      description: 'Review departmental leave applications, verify lecture substitutes, and execute approvals.'
    },
    {
      role: 'ADMIN',
      title: 'System Administrator',
      name: 'Central Admin Console',
      designation: 'Academic Affairs & IT Governance',
      email: 'admin@college.edu',
      pass: 'Admin@123',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
      icon: ShieldCheck,
      description: 'Manage departmental quota rules, provision accounts, and access institutional audit logs.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0b1f44] text-white px-6 py-5 flex items-center justify-between border-b border-blue-900/50">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-sm">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white tracking-tight">
                  Institutional Support & Access Directory
                </h3>
              </div>
              <p className="text-xs text-blue-200/80 mt-0.5">
                Smart Faculty Leave & Academic Governance Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Close dialog"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-3 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'accounts'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Authorized Test Accounts</span>
          </button>
          <button
            onClick={() => setActiveTab('helpdesk')}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'helpdesk'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Campus IT & Governance Desk</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'accounts' && (
            <div className="space-y-3.5">
              <p className="text-xs text-slate-500 leading-relaxed">
                Use these pre-configured institutional profiles to evaluate portal features across different academic permission tiers:
              </p>

              <div className="space-y-3">
                {testAccounts.map((acc, idx) => {
                  const Icon = acc.icon;
                  const isCopied = copiedKey === `acc-${idx}`;

                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200/90 bg-[#F8FAFC] p-3.5 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
                            <Icon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">
                                {acc.title}
                              </span>
                              <span
                                className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider ${acc.badgeColor}`}
                              >
                                {acc.role}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {acc.name} • {acc.designation}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopy(`${acc.email} / ${acc.pass}`, `acc-${idx}`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-700 text-[11px] font-semibold text-slate-600 shadow-2xs transition-colors cursor-pointer shrink-0"
                          title="Copy credentials"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>Copy Login</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{acc.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">
                          <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{acc.pass}</span>
                        </div>
                      </div>

                      <p className="mt-2 text-[11px] text-slate-500 leading-snug">
                        {acc.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'helpdesk' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Central Campus IT & Systems Administration
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Technical support, account access, and password resets
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1 text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium">helpdesk-facultyportal@college.edu</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>+91 (020) 2590-4000 (Internal Ext: 402 / 405)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-500">Operating Hours: Mon – Fri, 08:30 AM – 05:30 PM IST</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-500">Location: Central Computing Center, Tech Annex Building</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Academic Leave Regulations & Handbook
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Governed by Academic Council Statutes & UGC Faculty Regulations (2026–2027)
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  Casual Leave (CL) is limited to a maximum of 3 consecutive days. Medical Leave exceeding 2 days requires a valid registered medical practitioner certificate. Duty Leave must be accompanied by event deputation orders.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>256-bit SSL Protected • ISO 27001 Certified System</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
