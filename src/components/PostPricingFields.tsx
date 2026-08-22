import React from 'react';
import { DollarSign, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface PostPricingFieldsProps {
  rent: string;
  deposit: string;
  rentError?: string;
  depositError?: string;
  onRentChange: (val: string) => void;
  onDepositChange: (val: string) => void;
}

export default function PostPricingFields({
  rent,
  deposit,
  rentError,
  depositError,
  onRentChange,
  onDepositChange,
}: PostPricingFieldsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="bg-white/70 dark:bg-stone-900/40 backdrop-blur-md rounded-3xl border border-neutral-100 dark:border-neutral-800/80 p-5 shadow-sm space-y-4 relative z-10"
      id="post-pricing-container-card"
    >
      {/* Block Title */}
      <div className="flex items-start space-x-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
          <DollarSign className="w-4.5 h-4.5 stroke-[2.2]" />
        </div>
        <div className="flex flex-col space-y-0.5">
          <h3 className="text-sm font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight">
            Pricing
          </h3>
          <p className="text-[10px] font-semibold text-neutral-550 dark:text-stone-400">
            Set transparent rent and deposit structure for your listing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Monthly Rent */}
        <div className="flex flex-col space-y-1.5 flex-1">
          <label htmlFor="rent-input" className="text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none">
            Rent (Monthly) <span className="text-emerald-700 dark:text-emerald-450">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-xs font-black text-neutral-550 dark:text-stone-505 pointer-events-none select-none tracking-tight font-sans">
              KSh
            </span>
            <input
              type="text"
              inputMode="numeric"
              id="rent-input"
              value={rent}
              onChange={(e) => {
                // Keep only numeric characters
                const val = e.target.value.replace(/\D/g, '');
                onRentChange(val);
              }}
              placeholder="Enter monthly rent"
              aria-invalid={!!rentError}
              aria-describedby={rentError ? "rent-error-msg" : undefined}
              className={`w-full h-12 pl-12 pr-4 bg-white/50 dark:bg-stone-850/40 rounded-2xl border text-sm font-extrabold text-neutral-800 dark:text-stone-105 tracking-wide placeholder-neutral-550 dark:placeholder-stone-600 focus:outline-hidden focus:ring-2 focus:bg-white dark:focus:bg-stone-900 transition-all ${
                rentError
                  ? 'border-red-400 dark:border-red-900/80 focus:ring-red-500/20'
                  : 'border-neutral-100 dark:border-neutral-800/80 focus:border-emerald-500/80 focus:ring-emerald-500/20'
              }`}
            />
          </div>
          {rentError && (
            <span id="rent-error-msg" className="text-[10px] font-bold text-red-500 pl-1 uppercase tracking-wider">
              {rentError}
            </span>
          )}
        </div>

        {/* Deposit Needed */}
        <div className="flex flex-col space-y-1.5 flex-1">
          <label htmlFor="deposit-input" className="text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none">
            Deposit <span className="text-emerald-700 dark:text-emerald-450">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-xs font-black text-neutral-550 dark:text-stone-550 pointer-events-none select-none tracking-tight font-sans">
              KSh
            </span>
            <input
              type="text"
              inputMode="numeric"
              id="deposit-input"
              value={deposit}
              onChange={(e) => {
                // Keep only digits
                const val = e.target.value.replace(/\D/g, '');
                onDepositChange(val);
              }}
              placeholder="Enter deposit amount"
              aria-invalid={!!depositError}
              aria-describedby={depositError ? "deposit-error-msg" : undefined}
              className={`w-full h-12 pl-12 pr-4 bg-white/50 dark:bg-stone-850/40 rounded-2xl border text-sm font-extrabold text-neutral-800 dark:text-stone-105 tracking-wide placeholder-neutral-550 dark:placeholder-stone-600 focus:outline-hidden focus:ring-2 focus:bg-white dark:focus:bg-stone-900 transition-all ${
                depositError
                  ? 'border-red-400 dark:border-red-900/80 focus:ring-red-500/20'
                  : 'border-neutral-100 dark:border-neutral-800/80 focus:border-emerald-500/80 focus:ring-emerald-500/20'
              }`}
            />
          </div>
          {depositError && (
            <span id="deposit-error-msg" className="text-[10px] font-bold text-red-500 pl-1 uppercase tracking-wider">
              {depositError}
            </span>
          )}
        </div>
      </div>

      {/* Dynamic Kenyan context indicator */}
      <div className="pt-1.5">
        <div className="flex items-center space-x-2 p-3.5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-emerald-800 dark:text-emerald-400">
          <ShieldCheck className="w-4.5 h-4.5 text-emerald-700 dark:text-emerald-450 shrink-0" />
          <span className="text-[10px] font-bold tracking-tight leading-relaxed">
            Competitive and accurate pricing helps caretakers fill vacant units up to 3x faster.
          </span>
        </div>
      </div>
    </motion.div>
  );
}
