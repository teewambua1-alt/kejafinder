import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, AlertTriangle, Check, ArrowRight } from 'lucide-react';
import { AuthMode, AuthDraftUser } from '../types/auth';

interface AuthTrustSafetyOnboardingProps {
  authDraftUser: Partial<AuthDraftUser>;
  onSetAuthMode: (mode: AuthMode) => void;
  onShowFeedback: (msg: string) => void;
  onGoHome?: () => void;
  onGoSearch?: () => void;
}

export default function AuthTrustSafetyOnboarding({
  authDraftUser,
  onSetAuthMode,
  onShowFeedback,
  onGoHome,
  onGoSearch
}: AuthTrustSafetyOnboardingProps) {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRoleAwareNote = () => {
    switch (authDraftUser?.role) {
      case 'tenant':
        return "As a tenant, always verify the property in person before paying any fees.";
      case 'landlord':
      case 'caretaker':
      case 'agent':
      case 'scout':
        return "As someone posting listings, accurate info and photos help build trust.";
      default:
        return "Always verify details before making a decision or sending money.";
    }
  };

  const handleFinish = () => {
    if (!agreed) {
      setError("Please confirm you understand the safety reminders.");
      return;
    }
    setError(null);
    onShowFeedback("Prototype signup finished locally.");
    if (onGoHome) {
      onGoHome();
    } else if (onGoSearch) {
      onGoSearch();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-neutral-200/60 dark:border-stone-800/60 rounded-3xl p-6 shadow-sm">
        <h2 className="text-2xl font-black text-neutral-850 dark:text-stone-100 tracking-tight leading-tight mb-2">
          Keep KejaFinder safe
        </h2>
        <p className="text-[13px] font-semibold text-neutral-600 dark:text-stone-300 mb-6">
          {getRoleAwareNote()}
        </p>

        {/* Safety Warning */}
        <div className="bg-orange-50/80 dark:bg-amber-950/20 border border-orange-200/60 dark:border-amber-900/40 rounded-2xl p-4 flex items-start space-x-3 shadow-sm mb-6">
          <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
          <p className="text-[13px] font-bold text-orange-800 dark:text-orange-300 leading-snug">
            Never send deposit before physically viewing the house and confirming the caretaker or landlord.
          </p>
        </div>

        {/* Security Checklist */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start space-x-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-[12px] font-semibold text-neutral-700 dark:text-stone-300">
              Look for the Trust Badge on verified listings.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-[12px] font-semibold text-neutral-700 dark:text-stone-300">
              Report suspicious behavior immediately.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-[12px] font-semibold text-neutral-700 dark:text-stone-300">
              Communicate through the platform when possible.
            </p>
          </div>
        </div>

        {/* Checkbox */}
        <div className="mb-6">
          <label className="flex items-start space-x-3 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  if (error) setError(null);
                }}
                aria-label="I understand the safety reminders"
              />
              <div className="w-5 h-5 rounded border-2 border-neutral-300 dark:border-stone-600 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-colors group-hover:border-emerald-400"></div>
              <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <span className="text-[12px] font-bold text-neutral-800 dark:text-stone-200 select-none">
              I understand the safety reminders.
            </span>
          </label>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-[11px] font-bold text-orange-600 dark:text-orange-400 pl-1 mb-4"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleFinish}
          className={`w-full flex items-center justify-center space-x-2 rounded-2xl py-3.5 px-4 shadow-md transition-all ${
            agreed
              ? 'bg-emerald-600 dark:bg-emerald-500 text-white hover:shadow-lg hover:bg-emerald-700'
              : 'bg-neutral-200 dark:bg-stone-800 text-neutral-400 dark:text-stone-500 cursor-not-allowed'
          }`}
          aria-label="Finish prototype signup"
        >
          <span className="text-[13px] font-black uppercase tracking-wider">Finish prototype signup</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
