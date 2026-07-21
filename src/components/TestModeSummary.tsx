import React from 'react';
import { motion } from 'motion/react';
import { TestItem } from '../data/testModeChecklist';

interface TestModeSummaryProps {
  items: TestItem[];
}

export default function TestModeSummary({ items }: TestModeSummaryProps) {
  const working = items.filter(i => i.status === 'working').length;
  const needsFix = items.filter(i => i.status === 'needs_fix').length;
  const missing = items.filter(i => i.status === 'missing').length;
  const prototypeOnly = items.filter(i => i.status === 'prototype_only').length;

  const cards = [
    { label: "Pages to test", count: items.length, color: "bg-neutral-100 text-neutral-800 dark:bg-stone-800 dark:text-stone-200" },
    { label: "Working", count: working, color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" },
    { label: "Needs fix", count: needsFix, color: "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400" },
    { label: "Missing", count: missing, color: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400" },
    { label: "Prototype-only", count: prototypeOnly, color: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
      {cards.map((card, i) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          key={card.label}
          className={`p-3 rounded-xl flex flex-col justify-center items-start shadow-sm border border-neutral-200/50 dark:border-stone-700/50 ${card.color}`}
        >
          <span className="text-2xl font-black">{card.count}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{card.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
