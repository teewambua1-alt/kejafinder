import React from 'react';
import { motion } from 'motion/react';
import ContactSupportHeader from '../components/ContactSupportHeader';
import SupportHeroQuickActions from '../components/SupportHeroQuickActions';
import SupportCategories from '../components/SupportCategories';
import SupportIssueFormMockup from '../components/SupportIssueFormMockup';
import SupportContactChannels from '../components/SupportContactChannels';
import SupportSafetyScamBlock from '../components/SupportSafetyScamBlock';
import SupportFAQ from '../components/SupportFAQ';
import { useToast } from '../context/ToastContext';

interface ContactSupportPageProps {
  onBack: () => void;
  onGoSearch?: () => void;
  onGoSafety?: () => void;
}

export default function ContactSupportPage({ onBack, onGoSearch, onGoSafety }: ContactSupportPageProps) {
  const { showToast } = useToast();

  const handleShowFeedback = (msg: string) => {
    showToast(msg);
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
      </div>
    </div>
  );
}
