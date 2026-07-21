import React from 'react';
import { motion } from 'motion/react';
import { ListFilter, Heart, ShieldCheck, MessageCircle } from 'lucide-react';

export type NotificationTabType = "all" | "saved" | "safety" | "messages";

interface NotificationTabsProps {
  activeTab: NotificationTabType;
  onChange: (tab: NotificationTabType) => void;
}

interface TabOption {
  id: NotificationTabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  ariaLabel: string;
}

export default function NotificationTabs({ activeTab, onChange }: NotificationTabsProps) {
  const tabs: TabOption[] = [
    {
      id: 'all',
      label: 'All',
      icon: ListFilter,
      ariaLabel: 'Show all notifications'
    },
    {
      id: 'saved',
      label: 'Saved',
      icon: Heart,
      ariaLabel: 'Show saved home notifications'
    },
    {
      id: 'safety',
      label: 'Safety',
      icon: ShieldCheck,
      ariaLabel: 'Show safety notifications'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageCircle,
      ariaLabel: 'Show message notifications'
    }
  ];

  return (
    <div className="w-full bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-850/40 rounded-2.5xl p-1.5 shadow-3xs flex items-center justify-between gap-1 select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(tab.id)}
            aria-pressed={isActive}
            aria-label={tab.ariaLabel}
            className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-1 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer outline-none ${
              isActive
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-neutral-550 dark:text-stone-300 hover:bg-neutral-50 dark:hover:bg-stone-850/60'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
            <span className="hidden xs:inline">{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
