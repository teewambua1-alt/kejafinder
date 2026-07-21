import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingDown, 
  CalendarCheck, 
  ShieldCheck, 
  MessageCircle, 
  AlertTriangle 
} from 'lucide-react';

export interface AlertSettings {
  priceDrops: boolean;
  availabilityReminders: boolean;
  newVerifiedHomes: boolean;
  caretakerReplies: boolean;
  safetyAlerts: boolean;
}

interface RecommendedAlertsProps {
  settings: AlertSettings;
  onToggle: (key: keyof AlertSettings, label: string) => void;
}

interface AlertRowConfig {
  key: keyof AlertSettings;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgColorClass: string;
}

export default function RecommendedAlerts({ settings, onToggle }: RecommendedAlertsProps) {
  const alertConfigs: AlertRowConfig[] = [
    {
      key: 'priceDrops',
      label: 'Price drops',
      description: 'Know when saved homes become cheaper.',
      icon: TrendingDown,
      colorClass: 'text-emerald-605 dark:text-emerald-400',
      bgColorClass: 'bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20'
    },
    {
      key: 'availabilityReminders',
      label: 'Availability reminders',
      description: 'Remind me to confirm if saved homes are still vacant.',
      icon: CalendarCheck,
      colorClass: 'text-sky-600 dark:text-sky-400',
      bgColorClass: 'bg-sky-500/10 dark:bg-sky-500/5 border border-sky-500/20'
    },
    {
      key: 'newVerifiedHomes',
      label: 'New verified homes',
      description: 'Notify me when verified homes match my budget.',
      icon: ShieldCheck,
      colorClass: 'text-purple-600 dark:text-purple-400',
      bgColorClass: 'bg-purple-500/10 dark:bg-purple-500/5 border border-purple-500/20'
    },
    {
      key: 'caretakerReplies',
      label: 'Caretaker replies',
      description: 'Show messages and replies from caretakers.',
      icon: MessageCircle,
      colorClass: 'text-indigo-600 dark:text-indigo-400',
      bgColorClass: 'bg-indigo-500/10 dark:bg-indigo-500/5 border border-indigo-500/20'
    },
    {
      key: 'safetyAlerts',
      label: 'Safety alerts',
      description: 'Get reminders about viewing and deposit safety.',
      icon: AlertTriangle,
      colorClass: 'text-orange-600 dark:text-orange-400',
      bgColorClass: 'bg-orange-500/10 dark:bg-orange-500/5 border border-orange-500/20'
    }
  ];

  return (
    <div className="w-full flex flex-col space-y-3.5 select-none">
      {/* Description header text section */}
      <div className="pl-1">
        <h2 className="text-xs font-black text-neutral-805 dark:text-stone-100 uppercase tracking-wider">
          Recommended alerts
        </h2>
        <p className="text-[10px] text-neutral-450 dark:text-stone-500 font-semibold tracking-wide mt-0.5">
          Get useful updates for homes you care about.
        </p>
      </div>

      {/* Main card housing the vertical rows layout */}
      <div className="w-full bg-white/90 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-850/45 rounded-3xl p-4.5 shadow-3xs flex flex-col space-y-3.5">
        {alertConfigs.map((config, index) => {
          const isEnabled = settings[config.key];
          const Icon = config.icon;

          return (
            <div key={config.key} className="flex flex-col">
              {/* Optional divider line from index 1+ */}
              {index > 0 && (
                <div className="h-px bg-neutral-200/50 dark:bg-stone-850/40 w-full mb-3.5" />
              )}

              <div className="flex items-center justify-between space-x-3.5">
                {/* Left side content blocks */}
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  {/* Rounded icon box with beautiful tint border gradients */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${config.bgColorClass}`}>
                    <Icon className={`w-4.5 h-4.5 ${config.colorClass} stroke-[2.2]`} />
                  </div>

                  {/* Context and sub-texts description */}
                  <div className="flex-1 min-w-0 py-0.5">
                    <h3 className="text-xs.2 font-black text-neutral-805 dark:text-stone-200 uppercase tracking-tight leading-snug">
                      {config.label}
                    </h3>
                    <p className="text-[10px] text-neutral-500 dark:text-stone-400 font-semibold leading-relaxed mt-0.5">
                      {config.description}
                    </p>
                  </div>
                </div>

                {/* Right side Toggle Switch with accessible tap structures */}
                <div className="shrink-0 pl-1.5 flex items-center">
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={() => onToggle(config.key, config.label)}
                    role="switch"
                    aria-checked={isEnabled}
                    aria-label={`Toggle alert style for ${config.label}`}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer outline-none ${
                      isEnabled 
                        ? 'bg-emerald-600 border border-emerald-700/10' 
                        : 'bg-neutral-200 dark:bg-stone-800 border border-neutral-300/10 dark:border-stone-750/30'
                    }`}
                  >
                    {/* Sliding knob toggle dot marker indicator */}
                    <motion.span
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`block w-4.5 h-4.5 rounded-full bg-white shadow-xs absolute top-0.5 ${
                        isEnabled ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </motion.button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
