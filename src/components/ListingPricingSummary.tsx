import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Banknote, Receipt, UserRound, Eye, Droplets, Zap, Clock, ShieldCheck } from 'lucide-react';
import { KejaListing } from '../types/listings';

interface ListingPricingSummaryProps {
  listing: KejaListing;
  onFeedback?: (message: string) => void;
}

export default function ListingPricingSummary({ listing, onFeedback }: ListingPricingSummaryProps) {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const formatKES = (amount: number) => {
    return `${listing.currency || 'KSh'} ${amount.toLocaleString()}`;
  };

  const handleAskCosts = () => {
    if (onFeedback) {
      onFeedback("Cost confirmation message coming soon.");
    } else {
      setFeedbackMessage("Cost confirmation message coming soon.");
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const rent = listing.rent || 8000;
  const deposit = listing.deposit || 8000;
  const agentFee = listing.agentFee || 0;
  const viewingFee = listing.viewingFee || 0;
  
  const waterText = listing.waterCostText || "Included";
  const electricityText = listing.electricityText || "Token meter";
  
  const estimatedTotal = rent + deposit + agentFee + viewingFee;
  const availabilityText = listing.availabilityText || 'Available now';
  const moveInDateText = listing.moveInDateText || 'Move in today';
  const updatedAtText = listing.updatedAtText || 'Updated today';

  const rowVariants = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.1 }}
      className="space-y-4"
    >
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-20 left-1/2 z-50 bg-neutral-900/90 dark:bg-stone-100/90 text-white dark:text-stone-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-md whitespace-nowrap"
          >
            {feedbackMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Main price card */}
      <motion.div variants={rowVariants} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-150/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {formatKES(rent)}
              </span>
              <span className="text-xs font-bold text-neutral-500 dark:text-stone-400 uppercase tracking-tight">
                per month
              </span>
            </div>
            <p className="text-sm font-semibold text-neutral-600 dark:text-stone-400 mt-1">
              Deposit: {formatKES(deposit)}
            </p>
          </div>
          <span className="bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border border-orange-200/50 dark:border-orange-900/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shrink-0">
            {availabilityText}
          </span>
        </div>
      </motion.div>

      {/* 2. Cost breakdown card */}
      <motion.div variants={rowVariants} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-150/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm">
        <h3 className="text-[11px] font-black text-neutral-805 dark:text-stone-200 uppercase tracking-wider mb-4 flex items-center space-x-2">
          <span>Cost Breakdown</span>
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-stone-800 flex items-center justify-center shrink-0">
                <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm font-bold text-neutral-700 dark:text-stone-300">Monthly rent</span>
            </div>
            <span className="text-sm font-black text-neutral-850 dark:text-stone-100">{formatKES(rent)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-stone-800 flex items-center justify-center shrink-0">
                <Receipt className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm font-bold text-neutral-700 dark:text-stone-300">Deposit</span>
            </div>
            <span className="text-sm font-black text-neutral-850 dark:text-stone-100">{formatKES(deposit)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-stone-800 flex items-center justify-center shrink-0">
                <UserRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm font-bold text-neutral-700 dark:text-stone-300">Agent fee</span>
            </div>
            <span className="text-sm font-medium text-neutral-600 dark:text-stone-400">{agentFee === 0 ? 'No agent fee' : formatKES(agentFee)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-stone-800 flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm font-bold text-neutral-700 dark:text-stone-300">Viewing fee</span>
            </div>
            <span className="text-sm font-medium text-neutral-600 dark:text-stone-400">{viewingFee === 0 ? 'No viewing fee' : formatKES(viewingFee)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-stone-800 flex items-center justify-center shrink-0">
                <Droplets className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm font-bold text-neutral-700 dark:text-stone-300">Water</span>
            </div>
            <span className="text-sm font-medium text-neutral-600 dark:text-stone-400">{waterText}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-stone-800 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm font-bold text-neutral-700 dark:text-stone-300">Electricity</span>
            </div>
            <span className="text-sm font-medium text-neutral-600 dark:text-stone-400">{electricityText}</span>
          </div>
        </div>

        <button 
          onClick={handleAskCosts}
          className="w-full mt-5 py-3 rounded-xl border border-neutral-200 dark:border-stone-800 text-[11px] uppercase tracking-wider font-bold text-neutral-700 dark:text-stone-300 active:scale-95 transition-transform"
          aria-label="Ask about listing costs"
        >
          Ask about costs
        </button>
      </motion.div>

      {/* 3. Total upfront estimate */}
      <motion.div variants={rowVariants} className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-3xl p-5 shadow-sm">
        <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-tight mb-1">
          Estimated upfront cost
        </h3>
        <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mb-2">
          {formatKES(estimatedTotal)}
        </p>
        <p className="text-[11px] font-semibold text-emerald-700/80 dark:text-emerald-400/80 leading-snug">
          Rent + deposit{agentFee > 0 ? ' + agent fee' : ''}{viewingFee > 0 ? ' + viewing fee' : ''}. Confirm final amount with the caretaker before paying.
        </p>
      </motion.div>

      {/* 4. Availability card */}
      <motion.div variants={rowVariants} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-150/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm flex items-start space-x-4">
        <div className="w-10 h-10 rounded-full bg-neutral-50 dark:bg-stone-850 flex items-center justify-center shrink-0 border border-neutral-100 dark:border-stone-800">
          <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {availabilityText}
          </h3>
          <p className="text-xs font-semibold text-neutral-600 dark:text-stone-400 mt-0.5">
            {moveInDateText} &bull; {updatedAtText}
          </p>
          <div className="mt-2 inline-block bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-orange-200/50 dark:border-orange-900/30">
            Confirm before visiting
          </div>
        </div>
      </motion.div>

      {/* 5. Safety/pricing note */}
      <motion.div variants={rowVariants} className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-2xl p-4 shadow-sm flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
        <p className="text-[11.5px] font-semibold text-orange-800 dark:text-orange-300 leading-snug">
          Never send deposit before physically viewing the house and confirming the caretaker or landlord.
        </p>
      </motion.div>
    </motion.div>
  );
}
