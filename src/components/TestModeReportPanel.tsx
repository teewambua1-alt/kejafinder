import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TestItem } from '../data/testModeChecklist';
import { RefreshCw, Copy, FileText } from 'lucide-react';

interface TestModeReportPanelProps {
  items: TestItem[];
  onShowFeedback: (msg: string) => void;
}

export default function TestModeReportPanel({ items, onShowFeedback }: TestModeReportPanelProps) {
  const [reportText, setReportText] = useState("Click 'Generate local report' to build prompt.");

  const generateReport = () => {
    const working = items.filter(i => i.status === 'working').map(i => `- [X] ${i.title}`);
    const needsFix = items.filter(i => i.status === 'needs_fix').map(i => `- [ ] ${i.title}`);
    const missing = items.filter(i => i.status === 'missing').map(i => `- [ ] ${i.title}`);
    const prototypeOnly = items.filter(i => i.status === 'prototype_only').map(i => `- [-] ${i.title} (Prototype only)`);

    const text = `AI Review Prompt
================

Context:
This app is KejaFinder, a mobile-first rental vacancy platform for Kenya.
It is currently in a high-fidelity prototype stage.

Summary:
- Working flow steps: ${working.length}
- Needs fixing: ${needsFix.length}
- Missing: ${missing.length}
- Prototype-only: ${prototypeOnly.length}

What is working:
${working.join('\n')}

Needs fixing:
${needsFix.join('\n')}

Missing:
${missing.join('\n')}

Prototype-only:
${prototypeOnly.join('\n')}

Instructions for AI Agent:
Please review this checklist and the current prototype state. Page-level code splitting has been added for large prototype pages. Bundle size should continue to be monitored. Firebase Auth is connected for login flows. Firestore listings are connected in read-only mode for Home, Search, and Listing Details. Saved listings persistence added for signed-in Firebase users. Saved page can load user saved listings from users/{userId}/savedListings. Post Vacancy can save Firestore drafts for signed-in poster roles and submitted listings become pending_review. Submitted listings are not public until admin approval is built. Signed-out users see login prompt. Reports, Contact Events, Dashboard, and image uploads remain prototype-only/local. Suggest structural improvements for the mobile layout, identify any UX gaps in the tenant or poster journeys, and recommend the best technical approach for the next backend phase.
`;
    setReportText(text);
    onShowFeedback("Report generated locally.");
  };

  const copyReport = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(reportText).then(() => {
        onShowFeedback("Report copied to clipboard.");
      }).catch(() => {
        onShowFeedback("Failed to copy.");
      });
    } else {
      onShowFeedback("Copying report will be added later.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-neutral-800 dark:bg-stone-900 rounded-2.5xl p-5 shadow-lg space-y-4"
    >
      <div className="flex items-center space-x-2.5">
        <div className="p-2 bg-neutral-700 dark:bg-stone-800 rounded-xl flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-white stroke-[2.2]" />
        </div>
        <h3 className="text-[13px] font-black uppercase tracking-wider text-white">
          AI Review Report
        </h3>
      </div>
      
      <textarea
        readOnly
        value={reportText}
        rows={8}
        className="w-full bg-neutral-900 dark:bg-stone-950 text-neutral-300 dark:text-stone-400 text-[10px] sm:text-[11px] font-mono p-3 rounded-xl border border-neutral-700 dark:border-stone-800 focus:outline-none resize-none leading-relaxed"
      />

      <div className="flex flex-col sm:flex-row gap-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={generateReport}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-wider py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Generate local report</span>
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={copyReport}
          className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-bold text-[11px] uppercase tracking-wider py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy report</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
