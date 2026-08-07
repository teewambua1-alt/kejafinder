import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';

interface ToastOptions {
  icon?: LucideIcon;
  duration?: number;
}

interface ToastState {
  id: number;
  message: string;
  icon?: LucideIcon;
}

interface ToastContextType {
  showToast: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const DEFAULT_DURATION_MS = 3000;

/**
 * Single shared toast, standardized on the convention the majority of this
 * app's ~20 independently hand-rolled toasts already converged on: bottom,
 * pill-shaped, dark, 3s. Replacing every local useState+setTimeout+JSX copy
 * with this fixes the real inconsistencies found across them (some missing
 * a dark-mode variant, some missing an exit animation, durations ranging
 * 2000-4000ms) rather than adding a 21st variant.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(0);

  const showToast = useCallback((message: string, options?: ToastOptions) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    idRef.current += 1;
    setToast({ id: idRef.current, message, icon: options?.icon });
    timeoutRef.current = setTimeout(() => setToast(null), options?.duration ?? DEFAULT_DURATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed inset-x-0 bottom-24 z-[100] flex items-center justify-center pointer-events-none px-4">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-neutral-900/95 dark:bg-stone-900/95 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-lg flex items-center space-x-2 pointer-events-auto max-w-[90vw]"
            >
              {toast.icon ? (
                <toast.icon className="w-4 h-4 text-emerald-450 shrink-0" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              )}
              <span className="truncate">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
