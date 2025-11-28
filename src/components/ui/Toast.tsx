'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: (id: string) => void;
}

export function Toast({ id, message, type, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.(id);
      }, 300); // Animation duration
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconStyles = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return createPortal(
    <div
      className={`fixed top-4 right-4 z-50 min-w-80 max-w-md transform rounded-lg border p-4 shadow-lg transition-all duration-300 ${
        typeStyles[type]
      } ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg font-medium">{iconStyles[type]}</span>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => {
              setIsVisible(false);
              onClose?.(id);
            }, 300);
          }}
          className="text-current opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
}

export interface ToastContextType {
  showToast: (message: string, type: ToastProps['type']) => void;
}

// Simple toast manager hook
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = (message: string, type: ToastProps['type']) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      id,
      message,
      type,
      onClose: (toastId) => {
        setToasts((prev) => prev.filter((t) => t.id !== toastId));
      },
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const ToastContainer = () => (
    <>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </>
  );

  return { showToast, ToastContainer };
}