import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, RotateCw } from 'lucide-react';
import Button from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

/**
 * Generic "something went wrong" state for failed data fetches (e.g.
 * useListings/useListing's error string, which previously had nowhere
 * consistent to render). Same layout as EmptyState but orange-toned to
 * read as a real error rather than an empty, honest result.
 */
export default function ErrorState({
  title = 'Something went wrong',
  description = "Couldn't load this right now. Check your connection and try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white/70 dark:bg-stone-900/40 backdrop-blur-md rounded-2.5xl border border-dashed border-orange-200 dark:border-orange-900/40 p-8 py-10 shadow-3xs text-center flex flex-col items-center justify-center space-y-5"
    >
      <div className="w-16 h-16 rounded-3xl bg-orange-500/10 dark:bg-orange-950/30 flex items-center justify-center text-orange-550 dark:text-orange-400 shadow-3xs">
        <AlertTriangle className="w-7.5 h-7.5 stroke-[2]" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-extrabold text-neutral-800 dark:text-stone-300">{title}</h3>
        <p className="text-xs text-neutral-550 dark:text-stone-400 max-w-[250px] mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {onRetry && (
        <Button variant="secondary" size="sm" icon={RotateCw} onClick={onRetry}>
          Try again
        </Button>
      )}
    </motion.div>
  );
}
