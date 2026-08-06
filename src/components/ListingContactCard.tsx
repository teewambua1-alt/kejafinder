import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MessageCircle, ShieldCheck, AlertTriangle, Eye, CheckCircle2, UserRound, Copy, Info } from 'lucide-react';
import { KejaListing } from '../types/listings';

interface ListingContactCardProps {
  listing: KejaListing;
  onFeedback?: (message: string) => void;
  onCallClick?: () => void;
  onWhatsAppClick?: () => void;
}

export default function ListingContactCard({ listing, onFeedback, onCallClick, onWhatsAppClick }: ListingContactCardProps) {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const rowVariants = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 }
  };

  const showFeedback = (message: string) => {
    if (onFeedback) {
      onFeedback(message);
    } else {
      setFeedbackMessage(message);
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const name = listing.contactName || listing.caretakerName || 'Caretaker';
  const role = listing.contactRole || 'caretaker';
  const phone = listing.contactPhone || listing.caretakerPhone || '+254000000000';
  const whatsapp = listing.whatsappPhone || '254000000000';
  const title = listing.title || 'the listing';

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phone)
        .then(() => showFeedback("Phone number copied."))
        .catch(() => showFeedback("Copy not available in this prototype."));
    } else {
      showFeedback("Copy not available in this prototype.");
    }
  };

  const getWhatsAppMessage = (type: 'available' | 'view' | 'directions') => {
    const text = type === 'available' 
      ? `Hi ${name.split(' ')[0]}, I saw ${title} on KejaFinder. Is it still available?`
      : type === 'view'
      ? `Hi ${name.split(' ')[0]}, I saw ${title} on KejaFinder. Can I view it today?`
      : `Hi ${name.split(' ')[0]}, I saw ${title} on KejaFinder. Please send me exact directions.`;
    
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
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

      {/* 1. Header */}
      <motion.div variants={rowVariants} className="px-1 flex items-center space-x-2">
        <div>
          <h3 className="text-lg font-black text-neutral-850 dark:text-stone-50">
            Contact caretaker
          </h3>
          <p className="text-xs font-semibold text-neutral-500 dark:text-stone-400 mt-0.5">
            Call or WhatsApp to confirm availability before visiting.
          </p>
        </div>
      </motion.div>

      {/* 2. Contact profile card */}
      <motion.div variants={rowVariants} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-150/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center shrink-0 border-2 border-white dark:border-stone-800 shadow-sm relative text-emerald-700 dark:text-emerald-400 font-black text-lg">
            {initials}
            {listing.isPhoneVerified && (
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-stone-900 rounded-full p-0.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-900" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-base font-black text-neutral-850 dark:text-stone-100 truncate">
                {name}
              </h4>
              <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-neutral-100 dark:bg-stone-800 rounded-md text-neutral-600 dark:text-stone-400 capitalize">
                {role}
              </span>
            </div>
            
            <div className="text-sm font-bold text-neutral-600 dark:text-stone-300 mb-1 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" />
              {phone}
              <button 
                onClick={handleCopy}
                className="p-1 hover:bg-neutral-100 dark:hover:bg-stone-800 rounded-md text-neutral-400 transition-colors ml-1"
                aria-label="Copy phone number"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <p className="text-[10px] sm:text-xs font-semibold text-neutral-500 dark:text-stone-500 flex items-center gap-1.5 leading-snug">
              <Info className="w-3.5 h-3.5 shrink-0" />
              {listing.responseTimeText || 'Usually responds within a few hours'}
            </p>
          </div>
        </div>

        {/* Verification Row */}
        <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-stone-800 flex flex-wrap gap-2">
          {listing.isPhoneVerified && (
             <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-lg border border-emerald-200/50 dark:border-emerald-500/20">
               <ShieldCheck className="w-3.5 h-3.5" />
               <span className="text-[10px] font-bold uppercase tracking-wider">Phone Verified</span>
             </div>
          )}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-neutral-50 dark:bg-stone-850 text-neutral-600 dark:text-stone-400 rounded-lg border border-neutral-200/50 dark:border-stone-700/50">
             <UserRound className="w-3.5 h-3.5" />
             <span className="text-[10px] font-bold uppercase tracking-wider">Contact shown by poster</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 rounded-lg border border-orange-200/50 dark:border-orange-900/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Confirm before paying</span>
          </div>
        </div>
      </motion.div>

      {/* 3. Action Buttons */}
      <motion.div variants={rowVariants} className="flex gap-3">
        <motion.a
          whileTap={{ scale: 0.97 }}
          href={`tel:${phone.replace(/\s+/g, '')}`}
          onClick={onCallClick}
          className="flex-1 bg-neutral-850 dark:bg-stone-100 text-white dark:text-stone-900 py-3.5 rounded-2xl text-[12px] uppercase font-black tracking-wider flex items-center justify-center gap-2 shadow-sm"
          aria-label={`Call ${role} ${name}`}
        >
          <Phone className="w-4.5 h-4.5" />
          <span>Call caretaker</span>
        </motion.a>

        <motion.a
          whileTap={{ scale: 0.97 }}
          href={getWhatsAppMessage('available')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onWhatsAppClick}
          className="flex-1 bg-emerald-600 dark:bg-emerald-500 text-white py-3.5 rounded-2xl text-[12px] uppercase font-black tracking-wider flex items-center justify-center gap-2 shadow-sm hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
          aria-label={`WhatsApp ${role} ${name}`}
        >
          <MessageCircle className="w-4.5 h-4.5" />
          <span>WhatsApp</span>
        </motion.a>
      </motion.div>

      {/* 4. Quick Prompts */}
      <motion.div variants={rowVariants} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-150/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm space-y-3">
        <h4 className="text-[11px] font-black tracking-wider uppercase text-neutral-805 dark:text-stone-200">
          Ask quickly via WhatsApp
        </h4>
        <div className="flex flex-col gap-2">
          <a
            href={getWhatsAppMessage('available')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsAppClick}
            className="px-4 py-2.5 bg-neutral-50 dark:bg-stone-850 hover:bg-neutral-100 dark:hover:bg-stone-800 rounded-xl text-xs font-bold text-neutral-700 dark:text-stone-300 text-left transition-colors border border-neutral-200/50 dark:border-stone-700/50"
          >
            "Is it still available?"
          </a>
          <a
            href={getWhatsAppMessage('view')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsAppClick}
            className="px-4 py-2.5 bg-neutral-50 dark:bg-stone-850 hover:bg-neutral-100 dark:hover:bg-stone-800 rounded-xl text-xs font-bold text-neutral-700 dark:text-stone-300 text-left transition-colors border border-neutral-200/50 dark:border-stone-700/50"
          >
            "Can I view today?"
          </a>
          <a
            href={getWhatsAppMessage('directions')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsAppClick}
            className="px-4 py-2.5 bg-neutral-50 dark:bg-stone-850 hover:bg-neutral-100 dark:hover:bg-stone-800 rounded-xl text-xs font-bold text-neutral-700 dark:text-stone-300 text-left transition-colors border border-neutral-200/50 dark:border-stone-700/50"
          >
            "Send exact directions"
          </a>
        </div>
      </motion.div>

      {/* 5. Contact safety note */}
      <motion.div variants={rowVariants} className="bg-orange-50/80 dark:bg-orange-950/20 border border-orange-100/80 dark:border-orange-900/30 rounded-2xl p-4 shadow-sm flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-[11.5px] font-semibold text-orange-800 dark:text-orange-300 leading-snug">
            Never send deposit before physically viewing the house and confirming the caretaker or landlord.
          </p>
          <p className="text-[9.5px] font-semibold text-orange-700/80 dark:text-orange-400/80 leading-snug mt-1.5">
            KejaFinder does not collect deposits. Pay only after viewing and confirming the house.
          </p>
        </div>
      </motion.div>

    </motion.div>
  );
}
