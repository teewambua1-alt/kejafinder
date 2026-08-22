import React from 'react';
import { motion } from 'motion/react';
import { TestItem } from '../data/testModeChecklist';

interface TestReadinessScoreProps {
  items: TestItem[];
}

export default function TestReadinessScore({ items }: TestReadinessScoreProps) {
  const workingCount = items.filter(i => i.status === 'working').length;
  const total = items.length;
  const score = total > 0 ? Math.round((workingCount / total) * 100) : 0;

  let labelText = "";
  let colorClass = "";

  if (score >= 80) {
    labelText = "Prototype is ready for deeper QA";
    colorClass = "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50";
  } else if (score >= 60) {
    labelText = "Good prototype, needs fixes";
    colorClass = "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900/50";
  } else {
    labelText = "Needs more build work before testing";
    colorClass = "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/50";
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2.5xl p-5 border shadow-sm flex flex-col items-center justify-center space-y-2 mt-4 text-center ${colorClass}`}
    >
      <div className="flex items-end space-x-1">
        <span className="text-4xl font-black tracking-tighter">{score}</span>
        <span className="text-xl font-bold mb-1">%</span>
      </div>
      <h3 className="text-[13px] font-black uppercase tracking-wider">
        {labelText}
      </h3>
      <p className="text-[10px] font-semibold opacity-80 mt-1 max-w-[250px]">
        Score is based on local checklist data, not real automated testing.
      </p>
    </motion.div>
  );
}
