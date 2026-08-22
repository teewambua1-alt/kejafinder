import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ReportReason } from '../types/listings';
import Sheet from './ui/Sheet';

interface ReportListingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: ReportReason, message: string) => void;
}

export default function ReportListingPanel({ isOpen, onClose, onSubmit }: ReportListingPanelProps) {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedReason(null);
      setMessage("");
      setError(null);
    }
  }, [isOpen]);

  const reasons: { value: ReportReason; label: string }[] = [
    { value: 'already_taken', label: 'House already taken' },
    { value: 'fake_listing', label: 'Fake listing' },
    { value: 'wrong_price', label: 'Wrong price' },
    { value: 'wrong_location', label: 'Wrong location' },
    { value: 'scam_request', label: 'Scam request' },
    { value: 'hidden_agent_fee', label: 'Hidden agent fee' },
    { value: 'wrong_photos', label: 'Wrong photos' },
    { value: 'unsafe_property', label: 'Unsafe property' },
    { value: 'duplicate_listing', label: 'Duplicate listing' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = () => {
    if (!selectedReason) {
      setError("Choose a reason before submitting.");
      return;
    }
    onSubmit(selectedReason, message);
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Report listing"
      maxHeight="90%"
      footer={
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className="w-full bg-neutral-900 dark:bg-stone-100 text-white dark:text-stone-900 py-4 rounded-2xl text-[13px] uppercase font-black tracking-wider shadow-md active:shadow-sm cursor-pointer outline-none border-none"
        >
          Submit report
        </motion.button>
      }
    >
      <p className="text-sm font-semibold text-neutral-500 dark:text-stone-400 -mt-1 mb-6">
        Tell us what looks wrong. Our team will review your report.
      </p>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl text-xs font-bold mb-4 border border-red-100 dark:border-red-900/30">
          {error}
        </div>
      )}

      <div className="space-y-2 mb-6" role="radiogroup" aria-label="Report reasons">
        {reasons.map((reason) => (
          <button
            key={reason.value}
            role="radio"
            aria-checked={selectedReason === reason.value}
            onClick={() => {
              setSelectedReason(reason.value);
              setError(null);
            }}
            className={`w-full flex items-center p-3.5 rounded-2xl border text-left transition-colors ${
              selectedReason === reason.value 
                ? 'border-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300'
                : 'border-neutral-200/50 dark:border-stone-800 bg-transparent text-neutral-700 dark:text-stone-300 hover:bg-neutral-50 dark:hover:bg-stone-850'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 shrink-0 ${
              selectedReason === reason.value
                ? 'border-emerald-700 bg-emerald-700'
                : 'border-neutral-300 dark:border-stone-600'
            }`}>
              {selectedReason === reason.value && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            <span className="text-[13px] font-bold">{reason.label}</span>
          </button>
        ))}
      </div>

      <div className="mb-6">
         <textarea
           value={message}
           onChange={(e) => setMessage(e.target.value)}
           placeholder="Add more details optional"
           className="w-full bg-neutral-50 dark:bg-stone-850 border border-neutral-200 dark:border-stone-800 rounded-2xl p-4 text-sm font-medium text-neutral-800 dark:text-stone-200 placeholder:text-neutral-550 dark:placeholder:text-stone-500 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-500 transition-colors h-24 resize-none"
         />
      </div>

    </Sheet>
  );
}
