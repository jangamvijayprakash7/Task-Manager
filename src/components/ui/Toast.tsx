import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Toast as ToastType } from '../../contexts/ToastContext';

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles = {
  success: 'bg-green-100 border-green-300 text-green-900',
  error: 'bg-red-100 border-red-300 text-red-900',
  warning: 'bg-yellow-100 border-yellow-300 text-yellow-900',
  info: 'bg-blue-100 border-blue-300 text-blue-900',
};

const iconStyles = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
};

export const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const Icon = toastIcons[toast.type];

  return (
    <div
      className={`w-full bg-white shadow-xl rounded-lg pointer-events-auto ring-2 ring-black ring-opacity-10 overflow-hidden border-2 ${toastStyles[toast.type]}`}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${iconStyles[toast.type]}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-5">{toast.title}</p>
            {toast.message && (
              <p className="mt-1 text-sm leading-5 opacity-90 break-words">{toast.message}</p>
            )}
            {toast.action && (
              <div className="mt-3">
                <button
                  onClick={toast.action.onClick}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    toast.action.variant === 'primary'
                      ? 'bg-green-700 text-white hover:bg-green-800'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <button
              className="bg-white rounded-md inline-flex text-gray-500 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 p-1"
              onClick={() => onRemove(toast.id)}
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastType[]; onRemove: (id: string) => void }> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 space-y-3 w-80 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};
