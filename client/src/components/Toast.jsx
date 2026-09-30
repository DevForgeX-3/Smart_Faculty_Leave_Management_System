import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 rounded-lg border bg-white p-3.5 shadow-xl transition-all ${
              isError
                ? 'border-l-4 border-l-red-500 border-slate-200 text-slate-800'
                : isSuccess
                ? 'border-l-4 border-l-emerald-500 border-slate-200 text-slate-800'
                : 'border-l-4 border-l-indigo-600 border-slate-200 text-slate-800'
            }`}
          >
            {isError ? (
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            ) : isSuccess ? (
              <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
            ) : (
              <Info className="h-5 w-5 text-indigo-600 shrink-0" />
            )}
            <p className="text-xs font-medium leading-tight">{toast.message}</p>
          </div>
        );
      })}
    </div>
  );
}
