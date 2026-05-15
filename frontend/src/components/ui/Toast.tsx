'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
}

const TYPE_META: Record<
  ToastType,
  { color: string; bg: string; icon: React.ReactNode; glow: string }
> = {
  success: {
    color: '#00D97E',
    bg:    'rgba(0,217,126,0.10)',
    glow:  '0 0 24px rgba(0,217,126,0.25)',
    icon:  <CheckCircle size={18} strokeWidth={2.4} />,
  },
  error: {
    color: '#F85149',
    bg:    'rgba(248,81,73,0.10)',
    glow:  '0 0 24px rgba(248,81,73,0.25)',
    icon:  <AlertCircle size={18} strokeWidth={2.4} />,
  },
  info: {
    color: '#58A6FF',
    bg:    'rgba(88,166,255,0.10)',
    glow:  '0 0 24px rgba(88,166,255,0.20)',
    icon:  <Info size={18} strokeWidth={2.4} />,
  },
  warning: {
    color: '#F0A500',
    bg:    'rgba(240,165,0,0.10)',
    glow:  '0 0 24px rgba(240,165,0,0.25)',
    icon:  <AlertTriangle size={18} strokeWidth={2.4} />,
  },
};

const DURATION_MS = 4000;

export const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  const meta = TYPE_META[type];
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startedAt = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startedAt;
      const next = Math.max(0, 100 - (elapsed / DURATION_MS) * 100);
      setProgress(next);
      if (elapsed >= DURATION_MS) {
        onClose(id);
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    let raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [id, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{    opacity: 0, x: 24, scale: 0.96, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className="relative overflow-hidden flex items-start gap-3 px-4 py-3 rounded-lg min-w-[280px] max-w-[380px]"
      style={{
        background: '#0D1117',
        border: `1px solid #21262D`,
        borderLeft: `3px solid ${meta.color}`,
        boxShadow: `0 12px 32px -12px rgba(0,0,0,0.6), ${meta.glow}`,
      }}
    >
      <span
        className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-md flex items-center justify-center"
        style={{ background: meta.bg, color: meta.color }}
      >
        {meta.icon}
      </span>
      <p className="flex-1 text-[13.5px] text-ts-text-pri font-medium leading-snug font-ts">
        {message}
      </p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-0.5 text-ts-text-mut hover:text-ts-text-pri transition-colors"
        aria-label="Dismiss"
      >
        <X size={15} />
      </button>

      {/* Progress bar */}
      <span
        className="absolute bottom-0 left-0 h-[2px]"
        style={{
          width: `${progress}%`,
          background: meta.color,
          transition: 'width 60ms linear',
          opacity: 0.6,
        }}
      />
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>;
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-5 right-5 space-y-2 z-[300] flex flex-col items-end pointer-events-none">
      <div className="space-y-2 pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} onClose={onClose} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
