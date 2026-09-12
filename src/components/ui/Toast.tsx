'use client';

import { useToast } from '@/context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, TrendingUp, ShoppingBag, AlertCircle, Trophy, CheckCircle } from 'lucide-react';

const TOAST_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  xp: Zap,
  levelup: TrendingUp,
  purchase: ShoppingBag,
  achievement: Trophy,
};

const TOAST_COLORS = {
  success: { border: '#00ff88', bg: 'rgba(0, 255, 136, 0.1)', text: '#00ff88' },
  error: { border: '#ff3366', bg: 'rgba(255, 51, 102, 0.1)', text: '#ff3366' },
  xp: { border: '#00f0ff', bg: 'rgba(0, 240, 255, 0.1)', text: '#00f0ff' },
  levelup: { border: '#ffd700', bg: 'rgba(255, 215, 0, 0.1)', text: '#ffd700' },
  purchase: { border: '#b366ff', bg: 'rgba(179, 102, 255, 0.1)', text: '#b366ff' },
  achievement: { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-3"
      style={{ maxWidth: '380px', width: '100%' }}
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = TOAST_ICONS[toast.type];
          const colors = TOAST_COLORS[toast.type];

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              role="alert"
              style={{
                background: colors.bg,
                borderLeft: `3px solid ${colors.border}`,
                backdropFilter: 'blur(12px)',
              }}
              className="glass-card p-4 flex items-start gap-3 cursor-pointer"
              onClick={() => removeToast(toast.id)}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && removeToast(toast.id)}
            >
              <Icon size={20} style={{ color: colors.text, flexShrink: 0, marginTop: 2 }} />
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold"
                  style={{ color: colors.text, fontFamily: 'var(--font-display)' }}
                >
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeToast(toast.id); }}
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
