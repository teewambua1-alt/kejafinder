import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { ReportReason } from '../types/listings';

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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/60 dark:bg-black/70 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-t-[2.5rem] p-6 shadow-2xl max-h-[90vh] overflow-y-auto border-t border-neutral-150/60 dark:border-stone-800/60 pb-[env(safe-area-inset-bottom)]"
          >
            {/* Drag Handle */}
            <div className="w-12 h-1.5 bg-neutral-200 dark:bg-stone-800 rounded-full mx-auto mb-6 flex-shrink-0" />
            
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-neutral-100 dark:bg-stone-800 rounded-full text-neutral-500 dark:text-stone-400 hover:bg-neutral-200 dark:hover:bg-stone-700 transition-colors"
              aria-label="Close report listing"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-black text-neutral-850 dark:text-stone-100 pr-10">Report listing</h2>
            <p className="text-sm font-semibold text-neutral-500 dark:text-stone-400 mt-1 mb-6">
              Tell us what looks wrong. This is prototype-only for now.
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
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300'
                      : 'border-neutral-200/50 dark:border-stone-800 bg-transparent text-neutral-700 dark:text-stone-300 hover:bg-neutral-50 dark:hover:bg-stone-850'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 shrink-0 ${
                    selectedReason === reason.value
                      ? 'border-emerald-500 bg-emerald-500'
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
                 className="w-full bg-neutral-50 dark:bg-stone-850 border border-neutral-200 dark:border-stone-800 rounded-2xl p-4 text-sm font-medium text-neutral-800 dark:text-stone-200 placeholder:text-neutral-400 dark:placeholder:text-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors h-24 resize-none"
               />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              className="w-full bg-neutral-900 dark:bg-stone-100 text-white dark:text-stone-900 py-4 mb-4 rounded-2xl text-[13px] uppercase font-black tracking-wider shadow-md active:shadow-sm"
            >
              Submit report
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
