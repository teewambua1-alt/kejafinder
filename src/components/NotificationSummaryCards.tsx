import React from 'react';
import { motion } from 'motion/react';
import { 
  BellRing, 
  Heart, 
  TrendingDown, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

interface NotificationSummaryCardsProps {
  unreadCount: number;
  savedUpdatesCount: number;
  priceDropCount: number;
  messageCount: number;
  safetyCount: number;
  instantAlertsEnabled: boolean;
  onToggleInstantAlerts: (enabled: boolean) => void;
  onSelectSummary: (type: 'unread' | 'saved' | 'price' | 'messages' | 'safety') => void;
}

interface SummaryCardConfig {
  id: 'unread' | 'saved' | 'price' | 'messages' | 'safety';
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  helperText: string;
  ariaLabel: string;
  colorClass: string;
  bgColorClass: string;
  isHighlight: boolean;
}

export default function NotificationSummaryCards({
  unreadCount,
  savedUpdatesCount,
  priceDropCount,
  messageCount,
  safetyCount,
  instantAlertsEnabled,
  onToggleInstantAlerts,
  onSelectSummary
}: NotificationSummaryCardsProps) {
  const cards: SummaryCardConfig[] = [
    {
      id: 'unread',
      label: 'Unread',
      count: unreadCount,
      icon: BellRing,
      helperText: 'Needs attention',
      ariaLabel: 'Show unread notifications',
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      bgColorClass: 'bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 dark:border-emerald-500/10',
      isHighlight: false
    },
    {
      id: 'saved',
      label: 'Saved updates',
      count: savedUpdatesCount,
      icon: Heart,
      helperText: 'From saved homes',
      ariaLabel: 'Show saved home updates',
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      bgColorClass: 'bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 dark:border-emerald-500/10',
      isHighlight: false
    },
    {
      id: 'price',
      label: 'Price drops',
      count: priceDropCount,
      icon: TrendingDown,
      helperText: 'Rent changed',
      ariaLabel: 'Show price drop alerts',
      colorClass: 'text-orange-600 dark:text-orange-400',
      bgColorClass: 'bg-orange-500/10 dark:bg-orange-500/5 border border-orange-500/20 dark:border-orange-500/10',
      isHighlight: true
    },
    {
      id: 'messages',
      label: 'Messages',
      count: messageCount,
      icon: MessageCircle,
      helperText: 'Replies & support',
      ariaLabel: 'Show messages and support notifications',
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      bgColorClass: 'bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 dark:border-emerald-500/10',
      isHighlight: false
    },
    {
      id: 'safety',
      label: 'Safety',
      count: safetyCount,
      icon: ShieldCheck,
      helperText: 'Trust reminders',
      ariaLabel: 'Show safety and verification alerts',
      colorClass: 'text-orange-600 dark:text-orange-400',
      bgColorClass: 'bg-orange-500/10 dark:bg-orange-500/5 border border-orange-500/20 dark:border-orange-500/10',
      isHighlight: true
    }
  ];

  return (
    <div className="w-full flex flex-col space-y-3.5 select-none">
      {/* 1. Header label section */}
      <div className="pl-1">
        <h2 className="text-xs font-black text-neutral-805 dark:text-stone-100 uppercase tracking-wider">
          Activity alerts
        </h2>
        <p className="text-[10px] text-neutral-450 dark:text-stone-500 font-semibold tracking-wide mt-0.5">
          Quick view of updates that need your attention.
        </p>
      </div>

      {/* 2. Edge-to-edge Horizontal scroll wrapper container */}
      <div 
        className="w-full flex overflow-x-auto gap-3 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.button
              key={card.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectSummary(card.id)}
              aria-label={`${card.ariaLabel} (${card.count} items)`}
              className="min-w-[125px] flex-shrink-0 snap-start bg-white/90 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-850/45 rounded-2.5xl p-3.5 shadow-3xs hover:bg-neutral-50/40 dark:hover:bg-stone-850/20 transition-all text-left flex flex-col justify-between items-start cursor-pointer outline-none relative overflow-hidden"
            >
              {/* Top Row: Icon Container and Count */}
              <div className="w-full flex items-center justify-between">
                <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 ${card.bgColorClass}`}>
                  <Icon className={`w-4 h-4 ${card.colorClass} stroke-[2.2]`} />
                </div>
                <span className="text-lg font-black font-sans text-neutral-800 dark:text-neutral-100 leading-none">
                  {card.count}
                </span>
              </div>

              {/* Bottom Metadata */}
              <div className="mt-4.5">
                <h3 className="text-[10.5px] font-black text-neutral-805 dark:text-stone-200 uppercase tracking-tight leading-none">
                  {card.label}
                </h3>
                <p className="text-[9.5px] text-neutral-450 dark:text-stone-500 font-bold leading-none mt-1.5 whitespace-nowrap">
                  {card.helperText}
                </p>
              </div>

              {/* Subtle visual hover border decoration for interactive touch feedback */}
              <div className="absolute inset-0 border border-transparent rounded-2.5xl hover:border-emerald-500/20 pointer-events-none" />
            </motion.button>
          );
        })}
      </div>

      {/* 3. Instant alerts mini banner built inline in summary module */}
      <div className="w-full bg-emerald-550/[0.03] dark:bg-emerald-555/[0.015] border border-emerald-500/15 dark:border-emerald-500/10 rounded-2.5xl p-4 flex items-center justify-between space-x-3.5 shadow-3xs">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-550/10 dark:bg-emerald-550/5 border border-emerald-550/20 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>
          <div className="flex-1 min-w-0 py-0.5">
            <h4 className="text-[11.5px] font-black text-neutral-805 dark:text-stone-200 uppercase tracking-tight">
              Instant alerts
            </h4>
            <p className="text-[10px] text-neutral-500 dark:text-stone-450 font-semibold leading-snug mt-0.5">
              Get important rental updates as soon as they happen.
            </p>
          </div>
        </div>

        {/* Dynamic toggle switch handler with highly visible interactive design */}
        <div className="shrink-0 pl-1.5 flex items-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleInstantAlerts(!instantAlertsEnabled)}
            role="switch"
            aria-checked={instantAlertsEnabled}
            aria-label="Toggle instant alerts"
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer outline-none ${
              instantAlertsEnabled 
                ? 'bg-emerald-600 border border-emerald-700/10' 
                : 'bg-neutral-200 dark:bg-stone-800 border border-neutral-300/10 dark:border-stone-750/30'
            }`}
          >
            <motion.span
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`block w-4.5 h-4.5 rounded-full bg-white shadow-xs absolute top-0.5 ${
                instantAlertsEnabled ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
