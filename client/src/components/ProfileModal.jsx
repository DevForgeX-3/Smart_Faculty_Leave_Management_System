import React from 'react';
import InstitutionalProfileView from './InstitutionalProfileView';

export default function ProfileModal({ user, isOpen, onClose, onUpdateProfile, showToast }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        <InstitutionalProfileView
          user={user}
          onUpdateUser={onUpdateProfile}
          showToast={showToast}
          isModalMode={true}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
