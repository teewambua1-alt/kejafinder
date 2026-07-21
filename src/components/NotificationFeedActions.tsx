import React from 'react';
import { CheckCheck, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface NotificationFeedActionsProps {
  unreadCount: number;
  onMarkAllRead: () => void;
  onClearRead?: () => void;
  totalCount: number;
}

export default function NotificationFeedActions({
  unreadCount,
  onMarkAllRead,
  onClearRead,
  totalCount
}: NotificationFeedActionsProps) {
  return (
    <div className="w-full bg-white/90 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-850/40 rounded-2.5xl p-4 shadow-3xs flex items-center justify-between gap-4 select-none">
      {/* Left: Unread status label */}
      <div className="flex flex-col">
        <span className="text-[11px] font-black text-neutral-450 dark:text-stone-400 uppercase tracking-wider leading-none">
          Status Overview
        </span>
        <span className="text-xs font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight mt-1">
          {unreadCount > 0 
            ? `${unreadCount} unread update${unreadCount === 1 ? '' : 's'}` 
            : 'All caught up'}
        </span>
      </div>

      {/* Right: Functional triggers */}
      <div className="flex items-center space-x-1.5 shrink-0">
        {/* Mark All Read button */}
        <motion.button
          whileTap={unreadCount > 0 ? { scale: 0.96 } : {}}
          disabled={unreadCount === 0}
          onClick={onMarkAllRead}
          aria-label="Mark all notifications as read"
          className={`flex items-center space-x-1.5 py-2 px-3.5 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all cursor-pointer outline-none ${
            unreadCount > 0
              ? 'bg-emerald-600/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600/20'
              : 'bg-neutral-50 dark:bg-stone-850/40 border border-neutral-200/30 dark:border-stone-800/20 text-neutral-400 pointer-events-none opacity-50'
          }`}
        >
          <CheckCheck className="w-3.5 h-3.5 stroke-[2.2]" />
          <span className="hidden xs:inline">Mark read</span>
        </motion.button>

        {/* Clear Read button */}
        {onClearRead && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onClearRead}
            aria-label="Clear read notifications"
            className="flex items-center justify-center p-2 rounded-xl text-neutral-400 hover:text-red-500 dark:text-stone-500 dark:hover:text-red-400 bg-neutral-50 dark:bg-stone-850/40 border border-neutral-200/30 dark:border-stone-800/20 transition-all cursor-pointer outline-none"
          >
            <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
