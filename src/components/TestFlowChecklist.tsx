import React from 'react';
import { motion } from 'motion/react';
import { TestItem, TestStatus } from '../data/testModeChecklist';
import { ChevronRight } from 'lucide-react';

interface TestFlowChecklistProps {
  items: TestItem[];
  onToggleStatus: (id: string) => void;
  onActionClick: (key: string) => void;
}

export default function TestFlowChecklist({ items, onToggleStatus, onActionClick }: TestFlowChecklistProps) {
  const groups: { [key: string]: TestItem[] } = {};
  
  items.forEach(item => {
    if (!groups[item.area]) {
      groups[item.area] = [];
    }
    groups[item.area].push(item);
  });

  const areaLabels: Record<string, string> = {
    core: "Core pages",
    tenant: "Tenant journey",
    poster: "Poster journey",
    trust: "Trust and safety",
    support: "Prototype-only systems",
    ux: "UX and performance",
    performance: "UX and performance", // grouped together visually if needed
  };

  const statusColors: Record<TestStatus, string> = {
    working: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
    needs_fix: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
    missing: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    prototype_only: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    review: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300"
  };

  const statusLabels: Record<TestStatus, string> = {
    working: "Working",
    needs_fix: "Needs fix",
    missing: "Missing",
    prototype_only: "Prototype-only",
    review: "Review"
  };

  return (
    <div className="space-y-6 pt-4">
      {Object.keys(groups).map((areaKey, areaIndex) => (
        <motion.div
          key={areaKey}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: areaIndex * 0.1 }}
          className="space-y-3"
        >
          <h3 className="text-[14px] font-black tracking-tight text-neutral-800 dark:text-stone-100 uppercase">
            {areaLabels[areaKey] || areaKey}
          </h3>
          
          <div className="space-y-2">
            {groups[areaKey].map(item => (
              <div 
                key={item.id}
                className="bg-white dark:bg-stone-900 border border-neutral-200/50 dark:border-stone-800/50 rounded-2xl p-4 shadow-sm flex flex-col space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="pr-2">
                    <h4 className="text-[12.5px] font-bold text-neutral-800 dark:text-stone-200 leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[11px] font-medium text-neutral-500 dark:text-stone-400 leading-snug mt-1">
                      {item.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleStatus(item.id)}
                    className={`shrink-0 px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider transition-colors ${statusColors[item.status]}`}
                    aria-label={`Status: ${statusLabels[item.status]}. Click to change.`}
                  >
                    {statusLabels[item.status]}
                  </button>
                </div>
                
                {item.actionLabel && (
                  <button 
                    type="button"
                    onClick={() => onActionClick(item.actionKey || '')}
                    className="flex items-center text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors w-fit pt-1"
                  >
                    <span>{item.actionLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
