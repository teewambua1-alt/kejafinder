import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface SafetyDepositWarningProps {
  onShowFeedback: (msg: string) => void;
  onScrollToChecklist?: () => void;
}

export default function SafetyDepositWarning({
  onShowFeedback,
  onScrollToChecklist
}: SafetyDepositWarningProps) {

  const handleReport = () => {
    onShowFeedback("Report flow coming soon.");
  };

  const handleViewChecklist = () => {
    if (onScrollToChecklist) {
      onScrollToChecklist();
    } else {
      onShowFeedback("Safety checklist coming next.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const doItems = [
    "Visit the house physically",
    "Confirm the caretaker or landlord",
    "Check rent, deposit, and fees",
    "Ask for exact directions",
    "Keep payment records if you pay later",
  ];

  const dontItems = [
    "Do not send deposit before viewing",
    "Do not send fare to unknown people",
    "Do not pay booking fees under pressure",
    "Do not share your M-Pesa PIN",
    "Do not trust screenshots alone",
  ];

  return (
    <motion.div
      variants={containerVariants}
      className="bg-orange-50/90 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 rounded-3xl p-6 shadow-sm"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-orange-700 dark:text-orange-400" />
        </div>
        <h3 className="text-lg font-black text-neutral-850 dark:text-stone-100 tracking-tight">
          Deposit safety
        </h3>
      </div>

      <div className="bg-white/80 dark:bg-stone-900/80 rounded-2xl p-4 shadow-sm mb-5 border border-orange-100 dark:border-orange-900/20">
        <p className="text-[14px] font-black text-orange-700 dark:text-orange-400 leading-snug mb-3">
          Never send deposit before physically viewing the house and confirming the caretaker or landlord.
        </p>
        <p className="text-[12px] font-medium text-neutral-700 dark:text-stone-300 leading-relaxed">
          KejaFinder does not collect rent, deposits, viewing fees, or booking fees. Any payment request should be handled carefully after you have confirmed the house physically.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <h4 className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center">
            Do this first
          </h4>
          <ul className="space-y-2">
            {doItems.map((item, idx) => (
              <li key={idx} className="flex items-start text-[12px] font-semibold text-neutral-700 dark:text-stone-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 mr-2 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-2 border-t border-orange-200/50 dark:border-orange-900/20">
          <h4 className="text-xs font-black text-red-800 dark:text-red-400 uppercase tracking-wider mb-2 flex items-center">
            Do not do this
          </h4>
          <ul className="space-y-2">
            {dontItems.map((item, idx) => (
              <li key={idx} className="flex items-start text-[12px] font-semibold text-neutral-700 dark:text-stone-300">
                <XCircle className="w-4 h-4 text-red-500 mr-2 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleReport}
          className="w-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-2xl py-3 px-4 font-black uppercase text-[11px] tracking-wider hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
          aria-label="Report suspicious request"
        >
          Report suspicious request
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleViewChecklist}
          className="w-full text-neutral-600 dark:text-stone-400 py-2 font-black uppercase text-[11px] tracking-wider hover:text-neutral-800 dark:hover:text-stone-200 transition-colors"
          aria-label="View listing safety tips"
        >
          View listing safety tips
        </motion.button>
      </div>
    </motion.div>
  );
}
