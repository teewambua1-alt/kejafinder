import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Loader2 } from 'lucide-react';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  threshold?: number;
}

export default function PullToRefreshIndicator({ pullDistance, isRefreshing, threshold = 64 }: PullToRefreshIndicatorProps) {
  const height = isRefreshing ? 44 : pullDistance;
  if (height <= 0) return null;

  const progress = Math.min(1, pullDistance / threshold);
  const isReady = isRefreshing || progress >= 1;

  return (
    <div className="w-full flex items-center justify-center overflow-hidden shrink-0" style={{ height }}>
      <motion.div
        animate={isRefreshing ? { rotate: 360 } : { rotate: progress * 180 }}
        transition={isRefreshing ? { repeat: Infinity, duration: 0.8, ease: 'linear' } : { duration: 0 }}
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
          isReady
            ? 'bg-emerald-700 text-white'
            : 'bg-neutral-100 dark:bg-stone-800 text-neutral-550 dark:text-stone-400'
        }`}
      >
        {isRefreshing ? <Loader2 className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
      </motion.div>
    </div>
  );
}
