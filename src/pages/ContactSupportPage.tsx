import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ContactSupportHeader from '../components/ContactSupportHeader';
import SupportHeroQuickActions from '../components/SupportHeroQuickActions';
import SupportCategories from '../components/SupportCategories';
import SupportIssueFormMockup from '../components/SupportIssueFormMockup';
import SupportContactChannels from '../components/SupportContactChannels';
import SupportSafetyScamBlock from '../components/SupportSafetyScamBlock';
import SupportFAQ from '../components/SupportFAQ';

interface ContactSupportPageProps {
  onBack: () => void;
  onGoSearch?: () => void;
  onGoSafety?: () => void;
}

export default function ContactSupportPage({ onBack, onGoSearch, onGoSafety }: ContactSupportPageProps) {
  const [supportFeedback, setSupportFeedback] = useState<string | null>(null);

  const handleShowFeedback = (msg: string) => {
    setSupportFeedback(msg);
    setTimeout(() => setSupportFeedback(null), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.3 } }
  };

  return (
    <div className="absolute inset-0 bg-neutral-50 dark:bg-stone-950 flex flex-col xl:items-center xl:bg-neutral-100 dark:xl:bg-stone-900 pb-20">
      <div className="w-full h-full flex flex-col bg-white dark:bg-stone-950 shadow-2xl xl:max-w-[440px] xl:h-[850px] xl:my-auto xl:rounded-[40px] xl:overflow-hidden relative xl:border xl:border-neutral-200/50 dark:xl:border-stone-800">
        
        {/* Animated Background Blur Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[40%] bg-emerald-100/40 dark:bg-emerald-900/10 blur-3xl rounded-full" />
          <div className="absolute top-[20%] -right-[10%] w-[50%] h-[40%] bg-blue-100/30 dark:bg-stone-800/30 blur-3xl rounded-full" />
        </div>

        <ContactSupportHeader onBack={onBack} />

        <div className="flex-1 overflow-y-auto scrollbar-hide z-10 px-4 pt-6 pb-28">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-12"
          >
            <SupportHeroQuickActions 
              onGoSearch={onGoSearch}
              onGoSafety={onGoSafety}
              onShowFeedback={handleShowFeedback}
            />
            
            <SupportCategories 
              onShowFeedback={handleShowFeedback}
            />

            <SupportIssueFormMockup 
              onShowFeedback={handleShowFeedback}
            />

            <SupportContactChannels 
              onShowFeedback={handleShowFeedback}
            />

            <SupportSafetyScamBlock 
              onGoSafety={onGoSafety}
              onShowFeedback={handleShowFeedback}
            />

            <SupportFAQ />
          </motion.div>
        </div>

        {/* Global Feedback Toast within the page */}
        <AnimatePresence>
          {supportFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="absolute left-1/2 top-20 z-[100] whitespace-nowrap bg-neutral-800/95 dark:bg-stone-200/95 text-white dark:text-stone-900 px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md font-bold text-[11px] uppercase tracking-wider flex items-center space-x-2 border border-neutral-700 dark:border-stone-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-ping" />
              <span>{supportFeedback}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
