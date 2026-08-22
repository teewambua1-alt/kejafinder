import React from 'react';
import { motion } from 'motion/react';
import { MailOpen, CalendarDays, TrendingDown, CalendarCheck, ShieldCheck, Headphones, Layers } from 'lucide-react';

interface FilterChipOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  ariaLabel: string;
}

interface NotificationFilterChipsProps {
  activeFilter: string;
  onChange: (filter: string) => void;
}

export default function NotificationFilterChips({ activeFilter, onChange }: NotificationFilterChipsProps) {
  const chips: FilterChipOption[] = [
    {
      id: 'all',
      label: 'All',
      icon: Layers,
      ariaLabel: 'Filter show all notifications'
    },
    {
      id: 'unread',
      label: 'Unread',
      icon: MailOpen,
      ariaLabel: 'Filter unread notifications'
    },
    {
      id: 'this_week',
      label: 'This week',
      icon: CalendarDays,
      ariaLabel: 'Filter notifications from this week'
    },
    {
      id: 'price_drops',
      label: 'Price drops',
      icon: TrendingDown,
      ariaLabel: 'Filter notifications about price drops'
    },
    {
      id: 'availability',
      label: 'Availability',
      icon: CalendarCheck,
      ariaLabel: 'Filter notifications about availability'
    },
    {
      id: 'verified',
      label: 'Verified',
      icon: ShieldCheck,
      ariaLabel: 'Filter verified updates'
    },
    {
      id: 'support',
      label: 'Support',
      icon: Headphones,
      ariaLabel: 'Filter support and helpline chats'
    }
  ];

  return (
    <div className="w-full flex flex-col space-y-1.5 select-none">
      <div className="w-full overflow-x-auto scrollbar-none -mx-4 px-4 flex items-center space-x-2 py-1">
        {chips.map((chip) => {
          const isActive = activeFilter === chip.id || (activeFilter === 'price' && chip.id === 'price_drops');
          const Icon = chip.icon;

          return (
            <motion.button
              key={chip.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => onChange(chip.id)}
              aria-pressed={isActive}
              aria-label={chip.ariaLabel}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider border transition-all duration-150 shrink-0 cursor-pointer outline-none ${
                isActive
                  ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-extrabold shadow-3xs'
                  : 'bg-white/90 dark:bg-stone-900/95 border-neutral-200/50 dark:border-stone-850/40 text-neutral-500 dark:text-stone-400 hover:border-neutral-300 dark:hover:border-stone-750'
              }`}
            >
              {/* Optional warm orange indicator dot for Unread identifier specifically */}
              {chip.id === 'unread' && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-700 shrink-0" />
              )}
              <Icon className="w-3.5 h-3.5 stroke-[2]" />
              <span>{chip.label}</span>
            </motion.button>
          );
        })}
      </div>
      
      {/* Helper message indicating interactive logic state */}
      <div className="text-[10px] font-semibold text-neutral-550 dark:text-stone-400 italic pl-1 flex items-center justify-between">
        <span>Tap a filter chip to narrow your feed in real-time.</span>
        <span className="font-mono text-[8.5px] uppercase font-bold not-italic px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-stone-850 border border-neutral-250/30 dark:border-stone-800 text-neutral-500 select-none">
          Dynamic Filter Engaged
        </span>
      </div>
    </div>
  );
}
