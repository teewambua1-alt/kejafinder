import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import SafetyHeader from '../components/SafetyHeader';
import SafetyHero from '../components/SafetyHero';
import SafetyDepositWarning from '../components/SafetyDepositWarning';
import SafetyVisitChecklist from '../components/SafetyVisitChecklist';
import SafetyTrustBadges from '../components/SafetyTrustBadges';
import SafetyReportGuide from '../components/SafetyReportGuide';
import SafetyPaymentGuide from '../components/SafetyPaymentGuide';
import SafetyContactTips from '../components/SafetyContactTips';
import SafetyFAQ from '../components/SafetyFAQ';

interface SafetyPageProps {
  onBack: () => void;
  onGoSearch?: () => void;
  onGoPost?: () => void;
  onOpenListingDetails?: (listingId: string) => void;
  onOpenSupport?: () => void;
}

export default function SafetyPage({ onBack, onGoSearch, onGoPost, onOpenListingDetails, onOpenSupport }: SafetyPageProps) {
  const [safetyFeedback, setSafetyFeedback] = useState<string | null>(null);

  const handleShowFeedback = (msg: string) => {
    setSafetyFeedback(msg);
    setTimeout(() => {
      setSafetyFeedback((current) => (current === msg ? null : current));
    }, 4000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="flex-1 flex flex-col relative animate-fadeIn bg-neutral-50/50 dark:bg-stone-900/10 min-h-full -mx-6 -mt-6">
      {/* Visual background ambient blur spots */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      
      {/* Scroll-proof Feedback Message */}
      <AnimatePresence>
        {safetyFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed left-1/2 top-20 z-[100] whitespace-nowrap bg-neutral-800/95 dark:bg-stone-100/95 text-white dark:text-stone-900 px-4 py-2 rounded-full shadow-lg backdrop-blur-md font-bold text-[11px] uppercase tracking-wider"
          >
            {safetyFeedback}
          </motion.div>
        )}
      </AnimatePresence>

      <SafetyHeader onBack={onBack} />

      <div className="flex-1 overflow-y-auto no-scrollbar z-10 px-6 py-6 pb-24 relative">

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6 max-w-lg mx-auto"
        >
          {/* Safety Hero */}
          <SafetyHero 
            onGoSearch={onGoSearch}
            onGoPost={onGoPost}
            onShowFeedback={handleShowFeedback}
          />

          {/* Deposit Warning */}
          <SafetyDepositWarning 
            onShowFeedback={handleShowFeedback}
          />

          {/* Before You Visit Checklist */}
          <SafetyVisitChecklist
            onGoSearch={onGoSearch}
            onShowFeedback={handleShowFeedback}
          />

          {/* Trust Badges Explained */}
          <SafetyTrustBadges 
            onGoSearch={onGoSearch}
            onShowFeedback={handleShowFeedback}
          />

          {/* Placeholders */}

          {/* Report Listing Guide */}
          <SafetyReportGuide 
            onShowFeedback={handleShowFeedback}
          />

          {/* Agent Fees and Payment Safety */}
          <SafetyPaymentGuide 
            onGoSearch={onGoSearch}
            onShowFeedback={handleShowFeedback}
          />

          {/* Call and WhatsApp safety tips */}
          <SafetyContactTips 
            onShowFeedback={handleShowFeedback}
            onOpenSampleListing={() => onOpenListingDetails && onOpenListingDetails('sample-id')}
          />

          {/* Safety FAQ */}
          <SafetyFAQ 
            onGoSearch={onGoSearch}
            onShowFeedback={handleShowFeedback}
            onOpenSupport={onOpenSupport}
          />

        </motion.div>
      </div>
    </div>
  );
}
