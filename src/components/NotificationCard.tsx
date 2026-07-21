import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Bookmark, 
  MessageCircle, 
  ShieldCheck, 
  Bell, 
  CalendarCheck, 
  TrendingDown, 
  Tag, 
  Headphones, 
  Mail, 
  ChevronRight,
  X
} from 'lucide-react';
import { KejaNotification } from '../types/notifications';

interface NotificationCardProps {
  notification: KejaNotification;
  onActionClick: (id: string, actionType: string) => void;
  onDismiss: (id: string) => void;
}

export default function NotificationCard({ notification, onActionClick, onDismiss }: NotificationCardProps) {
  const { 
    id, 
    category, 
    title, 
    message, 
    timeAgo, 
    isRead, 
    actionLabel, 
    actionType, 
    imageUrl, 
    isImportant 
  } = notification;

  // Choose correct icon based on category
  const getCategoryIcon = () => {
    switch (category) {
      case 'saved':
        return <Heart className="w-5 h-5 text-rose-500" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-indigo-500" />;
      case 'safety':
        return <ShieldCheck className="w-5 h-5 text-orange-500" />;
      case 'verification':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'availability':
        return <CalendarCheck className="w-5 h-5 text-sky-500" />;
      case 'price':
        return <TrendingDown className="w-5 h-5 text-emerald-500" />;
      case 'support':
        return <Headphones className="w-5 h-5 text-amber-500" />;
      default:
        return <Bell className="w-5 h-5 text-neutral-500" />;
    }
  };

  // Get background color for the fallback icon container
  const getIconBg = () => {
    switch (category) {
      case 'saved': return 'bg-rose-500/10 dark:bg-rose-500/5 border border-rose-500/20';
      case 'message': return 'bg-indigo-500/10 dark:bg-indigo-500/5 border border-indigo-500/20';
      case 'safety': return 'bg-orange-500/10 dark:bg-orange-500/5 border border-orange-500/20';
      case 'verification': return 'bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20';
      case 'availability': return 'bg-sky-500/10 dark:bg-sky-500/5 border border-sky-500/20';
      case 'price': return 'bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20';
      case 'support': return 'bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20';
      default: return 'bg-neutral-500/10 dark:bg-neutral-500/5 border border-neutral-500/20';
    }
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => onActionClick(id, actionType || 'none')}
      className={`relative w-full rounded-2.5xl p-4 shadow-3xs border cursor-pointer transition-all select-none group/card hover:bg-neutral-50/40 dark:hover:bg-stone-850/20 ${
        !isRead 
          ? 'bg-gradient-to-br from-emerald-500/[0.02] to-white dark:from-emerald-500/[0.01] dark:to-stone-900 border-emerald-500/25 dark:border-emerald-500/15' 
          : 'bg-white/80 dark:bg-stone-900/80 border-neutral-200/40 dark:border-stone-850/40'
      } ${isImportant ? 'ring-1 ring-orange-500/20 bg-orange-500/[0.01]' : ''}`}
    >
      {/* Unread indicator badge / status marker */}
      {!isRead && (
        <span 
          className="absolute top-4.5 right-11 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" 
          aria-label="Unread notification"
          title="Unread notification"
        />
      )}

      {/* Dismiss trigger */}
      <motion.button
        whileTap={{ scale: 0.90 }}
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(id);
        }}
        aria-label={`Dismiss notification: ${title}`}
        className="absolute top-2.5 right-2 w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 dark:text-stone-500 hover:text-orange-500 hover:bg-orange-500/5 dark:hover:text-orange-400 dark:hover:bg-orange-500/[0.03] transition-colors cursor-pointer outline-none z-10"
      >
        <X className="w-3.5 h-3.5 stroke-[2.2]" />
      </motion.button>

      <div className="flex items-start space-x-3.5 pr-2">
        {/* Left Visual Asset: Round image or thematic fallback icon block */}
        <div className="shrink-0">
          {imageUrl ? (
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-stone-800 border border-neutral-250/25 dark:border-stone-800 shadow-3xs">
              <img 
                src={imageUrl} 
                alt="Notification preview" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getIconBg()}`}>
              {getCategoryIcon()}
            </div>
          )}
        </div>

        {/* Center Content text & triggers */}
        <div className="flex-1 min-w-0 pr-1">
          {/* Top row with group identifier / category tags & time */}
          <div className="flex items-center space-x-1.5 flex-wrap">
            <span className={`text-[9.5px] font-black uppercase tracking-wider ${
              category === 'safety' || isImportant
                ? 'text-orange-650 dark:text-orange-400'
                : 'text-neutral-450 dark:text-stone-400'
            }`}>
              {category === 'verification' ? 'scout verified' : category}
            </span>
            <span className="text-[9px] text-neutral-400 dark:text-stone-500 font-bold">&#8226;</span>
            <span className="text-[10px] text-neutral-400 dark:text-stone-500 font-semibold">{timeAgo}</span>
          </div>

          {/* Title - bold header styling */}
          <h3 className="text-xs.2 font-black text-neutral-850 dark:text-neutral-100 uppercase tracking-tight leading-tight mt-1 group-hover/card:text-emerald-700 dark:group-hover/card:text-emerald-400 transition-colors">
            {title}
          </h3>

          {/* Body message content text details */}
          <p className="text-[11px] text-neutral-550 dark:text-stone-400 font-medium leading-relaxed mt-1">
            {message}
          </p>

          {/* Action Row containing interactive triggers if defined */}
          {actionLabel && actionType && (
            <div className="mt-2.5 flex items-center space-x-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onActionClick(id, actionType);
                }}
                aria-label={`${actionLabel} notification: ${title}`}
                className={`py-1.5 px-4.5 rounded-xl text-[10.5px] font-extrabold uppercase tracking-wide cursor-pointer transition-all shadow-3xs outline-none ${
                  category === 'safety' || isImportant
                    ? 'bg-orange-550 text-white hover:bg-orange-600'
                    : 'bg-emerald-600 text-white hover:bg-emerald-650'
                }`}
              >
                {actionLabel}
              </motion.button>
            </div>
          )}
        </div>

        {/* Far-Right Indicator arrow */}
        <div className="self-center text-neutral-350 dark:text-stone-600 shrink-0">
          <ChevronRight className="w-4 h-4 stroke-[2.2] group-hover/card:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}
