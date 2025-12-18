'use client';

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToast, Toast } from '@/contexts/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2 w-auto max-w-[calc(100%-2rem)] sm:max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    // Garantir que a notificação desapareça após 3 segundos
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          backgroundColor: '#1d1816',
          borderColor: '#DFA026',
          color: '#DFA026',
        };
      case 'error':
        return {
          backgroundColor: '#1d1816',
          borderColor: '#ef4444',
          color: '#ef4444',
        };
      case 'info':
        return {
          backgroundColor: '#1d1816',
          borderColor: '#3b82f6',
          color: '#3b82f6',
        };
      default:
        return {
          backgroundColor: '#1d1816',
          borderColor: '#DFA026',
          color: '#DFA026',
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 shadow-lg animate-slide-in"
      style={styles}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <p 
        className="flex-1 text-sm sm:text-base font-medium"
        style={{
          fontFamily: "'Garamond', 'Palatino Linotype', 'Palatino', 'Times New Roman', serif"
        }}
      >
        {toast.message}
      </p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

