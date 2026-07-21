import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, AlertTriangle, BookOpen, Flag, StopCircle } from 'lucide-react';

interface SupportSafetyScamBlockProps {
  onGoSafety?: () => void;
  onShowFeedback: (msg: string) => void;
}

export default function SupportSafetyScamBlock({ onGoSafety, onShowFeedback }: SupportSafetyScamBlockProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const handleSafety = () => {
    if (onGoSafety) onGoSafety();
    else onShowFeedback('Safety page available from Profile.');
  };

  const redFlags = [
    "Asked to pay deposit before viewing",
    "Asked to send fare or booking fee urgently",
    "Asked for your M-Pesa PIN",
    "Price changed after contacting",
    "Refuses physical viewing",
    "Wrong location or landmark",
    "Photos do not match the house",
    "Contact person does not match the listing"
  ];

  const whatToDo = [
    "Stop the conversation",
    "Do not pay",
    "Save screenshots if needed",
    "Report the listing",
    "Use Safety Page before visiting"
  ];

  return (
    <motion.div variants={itemVariants} className="w-full space-y-4">
      <div className="px-1 text-center sm:text-left mb-2">
        <h3 className="text-[16px] font-black text-neutral-800 dark:text-stone-100 tracking-tight">
          Safety and scam support
        </h3>
        <p className="text-[12px] font-semibold text-neutral-500 dark:text-stone-400 mt-1">
          Pause before paying if anything feels suspicious.
        </p>
      </div>

      <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 rounded-2.5xl p-5 shadow-sm space-y-4">
        
        {/* Main Warning */}
        <div className="flex items-start space-x-3.5 mb-2">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center shrink-0 border border-orange-200 dark:border-orange-800/50">
            <AlertTriangle className="w-5.5 h-5.5 text-orange-600 dark:text-orange-400 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="text-[12px] font-black tracking-tight text-orange-900 dark:text-orange-200 mb-1">
              Never send deposit before physically viewing the house and confirming the caretaker or landlord.
            </h4>
            <p className="text-[11px] font-bold text-orange-800/80 dark:text-orange-300/80 leading-snug">
              KejaFinder does not collect rent, deposits, booking fees, viewing fees, or agent fees in this prototype.
            </p>
          </div>
        </div>

        {/* 2-Col Warning Lists */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-orange-200/50 dark:border-orange-900/50">
          
          <div className="space-y-3">
            <h5 className="text-[11px] font-black uppercase tracking-wider text-orange-800 dark:text-orange-300">
              Scam red flags
            </h5>
            <ul className="space-y-2">
              {redFlags.map((flag, i) => (
                <li key={i} className="flex items-start space-x-2 text-[10.5px] font-semibold text-neutral-700 dark:text-stone-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 dark:bg-orange-500 mt-1.5 shrink-0" />
                  <span className="leading-tight">{flag}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="text-[11px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              What to do
            </h5>
            <ul className="space-y-2">
              {whatToDo.map((action, i) => (
                <li key={i} className="flex items-start space-x-2 text-[10.5px] font-bold text-neutral-700 dark:text-stone-300">
                  <StopCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-tight">{action}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-4 mt-2 border-t border-orange-200/50 dark:border-orange-900/50">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={handleSafety}
            className="flex-1 h-11 bg-white dark:bg-stone-800 text-neutral-800 dark:text-stone-200 border border-neutral-300 dark:border-stone-700 font-black text-[11px] uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 shadow-sm hover:bg-neutral-50 dark:hover:bg-stone-700 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-amber-550" />
            <span>Read Safety Page</span>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => onShowFeedback('Use the report issue form above.')}
            className="flex-1 h-11 bg-orange-600 dark:bg-orange-600 hover:bg-orange-700 text-white font-black text-[11px] uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-colors"
          >
            <Flag className="w-4 h-4" />
            <span>Report scam request</span>
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
}
