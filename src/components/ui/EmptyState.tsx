import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import Button from './Button';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
}

/**
 * Generic "nothing here yet" state -- generalized from SavedEmptyState's
 * layout (dashed card, tinted icon badge, title + description, up to two
 * CTAs) so every list/feed in the app can share one honest, on-brand empty
 * state instead of a blank screen or a one-off per page.
 */
export default function EmptyState({ icon: Icon, title, description, primaryAction, secondaryAction }: EmptyStateProps) {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white/70 dark:bg-stone-900/40 backdrop-blur-md rounded-2.5xl border border-dashed border-neutral-250 dark:border-neutral-800/80 p-8 py-10 shadow-3xs text-center flex flex-col items-center justify-center space-y-5"
    >
      <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-3xs">
        <Icon className="w-7.5 h-7.5 stroke-[2]" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-extrabold text-neutral-800 dark:text-stone-300">{title}</h3>
        {description && (
          <p className="text-xs text-neutral-550 dark:text-stone-400 max-w-[250px] mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 w-full max-w-[260px] pt-1">
          {primaryAction && (
            <Button variant="primary" size="sm" icon={primaryAction.icon} onClick={primaryAction.onClick} fullWidth>
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" size="sm" icon={secondaryAction.icon} onClick={secondaryAction.onClick} fullWidth>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
