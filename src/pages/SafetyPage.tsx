import React from 'react';
import { motion } from 'motion/react';
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
import { useToast } from '../context/ToastContext';

interface SafetyPageProps {
  onBack: () => void;
  onGoSearch?: () => void;
  onGoPost?: () => void;
  onOpenListingDetails?: (listingId: string) => void;
  onOpenSupport?: () => void;
}

export default function SafetyPage({ onBack, onGoSearch, onGoPost, onOpenListingDetails, onOpenSupport }: SafetyPageProps) {
  const { showToast } = useToast();

  const handleShowFeedback = (msg: string) => {
    showToast(msg);
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
