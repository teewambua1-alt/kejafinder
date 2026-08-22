import React from 'react';
import { cn } from '../../lib/cn';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100/60 dark:border-emerald-900/40',
  warning: 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-100/60 dark:border-orange-900/30',
  danger: 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100/60 dark:border-red-900/30',
  info: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-100/60 dark:border-blue-900/30',
  neutral: 'bg-neutral-100 dark:bg-stone-800 text-neutral-700 dark:text-stone-400 border-transparent',
};

/**
 * Small pill label for status/trust indicators (e.g. "Verified",
 * "Scout Verified", moderation status) -- codifies the badge pattern
 * already used across trust/verification UI.
 */
export default function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-2xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0',
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
