import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ClipboardCheck, CheckCircle2, Circle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface SafetyVisitChecklistProps {
  onGoSearch?: () => void;
  onShowFeedback: (msg: string) => void;
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  isCritical?: boolean;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'availability',
    title: 'Confirm availability',
    description: 'Ask if the house is still vacant today.',
  },
  {
    id: 'rent_deposit',
    title: 'Confirm rent and deposit',
    description: 'Check monthly rent, deposit, water, electricity, and agent fees.',
  },
  {
    id: 'directions',
    title: 'Ask for exact directions',
    description: 'Confirm estate, landmark, stage, road distance, and plot directions.',
  },
  {
    id: 'identity',
    title: 'Confirm contact identity',
    description: 'Ask whether you are speaking to the caretaker, landlord, or agent.',
  },
  {
    id: 'visit',
    title: 'Visit physically',
    description: 'View the room, toilet, bathroom, water, electricity, and security.',
  },
  {
    id: 'safe',
    title: 'Go safely',
    description: 'Go during the day and consider going with someone.',
  },
  {
    id: 'no_pay',
    title: 'Do not pay before viewing',
    description: 'Never send deposit before physically viewing the house and confirming the caretaker or landlord.',
    isCritical: true,
  },
];

export default function SafetyVisitChecklist({
  onGoSearch,
  onShowFeedback
}: SafetyVisitChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setCheckedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const completedCount = checkedItems.length;
  const totalCount = CHECKLIST_ITEMS.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  const handleSearch = () => {
    if (onGoSearch) {
      onGoSearch();
    } else {
      onShowFeedback('Verified home search coming soon.');
    }
  };

  const handleReport = () => {
    onShowFeedback('Report flow coming soon.');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div variants={containerVariants} className="space-y-6">
      {/* Section Header */}
      <div>
        <div className="flex items-center space-x-2 mb-1">
          <ClipboardCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <h3 className="text-xl font-black text-neutral-850 dark:text-stone-100 tracking-tight">
            Before you visit
          </h3>
        </div>
        <p className="text-[13px] font-semibold text-neutral-600 dark:text-stone-300 mb-1">
          Use this quick checklist before going to view a house.
        </p>
        <p className="text-[12px] font-medium text-neutral-500 dark:text-stone-400">
          A few checks can save you fare, time, and money.
        </p>
      </div>

      {/* Checklist Card */}
      <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-neutral-200/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm">
        
        {/* Progress Summary */}
        <div className="mb-5 pb-5 border-b border-neutral-100 dark:border-stone-800">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-black text-neutral-800 dark:text-stone-200" aria-label={`${completedCount} of ${totalCount} safety checks completed`}>
              {completedCount} of {totalCount} checks done
            </span>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              {completedCount === totalCount ? 'Ready to visit carefully.' : 'Keep checking'}
            </span>
          </div>
          <div 
            className="h-2 w-full bg-neutral-100 dark:bg-stone-800 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={completedCount}
            aria-valuemin={0}
            aria-valuemax={totalCount}
            aria-label="Safety checklist completion progress"
          >
            <motion.div 
              className="h-full bg-emerald-700 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Checklist Items */}
        <div className="space-y-1">
          {CHECKLIST_ITEMS.map((item) => {
            const isChecked = checkedItems.includes(item.id);
            const isCritical = item.isCritical;

            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleItem(item.id)}
                className={`w-full text-left flex items-start space-x-3 p-3 rounded-2xl transition-colors border ${
                  isChecked 
                    ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20' 
                    : 'bg-transparent border-transparent hover:bg-neutral-50 dark:hover:bg-stone-800/50'
                }`}
                aria-pressed={isChecked}
              >
                <div className="shrink-0 mt-0.5">
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  ) : (
                    <Circle className={`w-5 h-5 ${isCritical ? 'text-orange-400 dark:text-orange-500' : 'text-neutral-550 dark:text-stone-400'}`} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`text-[13px] font-bold leading-tight mb-0.5 ${
                    isCritical && !isChecked ? 'text-orange-700 dark:text-orange-400' : 
                    isChecked ? 'text-emerald-900 dark:text-emerald-100' : 'text-neutral-800 dark:text-stone-200'
                  }`}>
                    {item.title}
                  </h4>
                  <p className={`text-[12px] leading-snug ${
                    isChecked ? 'text-emerald-700/80 dark:text-emerald-300/80' : 'text-neutral-500 dark:text-stone-400'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

      </div>

      {/* Screenshot note */}
      <p className="text-center text-[11px] font-bold text-neutral-550 dark:text-stone-400 uppercase tracking-wider">
        Tip: Screenshot this checklist before going to view a house.
      </p>

      {/* Critical reminder card */}
      <div className="bg-orange-50/90 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 rounded-2xl p-4 flex items-start space-x-3 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-orange-700 dark:text-orange-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-black text-orange-800 dark:text-orange-300 leading-snug mb-1">
            Never send deposit before physically viewing the house and confirming the caretaker or landlord.
          </p>
          <p className="text-[11px] font-semibold text-orange-700/80 dark:text-orange-400/80 leading-snug">
            If anyone pressures you to pay before viewing, treat it as suspicious and report the listing.
          </p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-col space-y-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSearch}
          className="w-full bg-neutral-800 dark:bg-stone-200 text-white dark:text-stone-900 rounded-2xl py-3.5 px-4 font-black uppercase text-[12px] tracking-wider shadow-md hover:shadow-lg transition-all"
          aria-label="Search verified homes"
        >
          Search verified homes
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleReport}
          className="w-full text-neutral-600 dark:text-stone-400 py-2 font-black uppercase text-[11px] tracking-wider hover:text-neutral-800 dark:hover:text-stone-200 transition-colors"
          aria-label="Report suspicious listing"
        >
          Report suspicious listing
        </motion.button>
      </div>
    </motion.div>
  );
}
