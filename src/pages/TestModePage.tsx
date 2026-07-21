import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import TestModeHeader from '../components/TestModeHeader';
import TestModeSummary from '../components/TestModeSummary';
import TestReadinessScore from '../components/TestReadinessScore';
import TestFlowChecklist from '../components/TestFlowChecklist';
import TestIssueBoard from '../components/TestIssueBoard';
import TestModeReportPanel from '../components/TestModeReportPanel';
import { initialTestItems, TestItem, TestStatus } from '../data/testModeChecklist';
import { CheckCircle2 } from 'lucide-react';

interface TestModePageProps {
  onBack: () => void;
  onGoHome: () => void;
  onGoSearch: () => void;
  onGoPost: () => void;
  onGoSaved: () => void;
  onGoProfile: () => void;
  onGoAuth: () => void;
  onGoSafety: () => void;
  onGoAbout: () => void;
  onGoSupport: () => void;
  onGoLandlordDashboard: () => void;
}

export default function TestModePage({ 
  onBack, onGoHome, onGoSearch, onGoPost, onGoSaved, onGoProfile, onGoAuth, onGoSafety, onGoAbout, onGoSupport, onGoLandlordDashboard 
}: TestModePageProps) {
  const [testItems, setTestItems] = useState<TestItem[]>(initialTestItems);
  const [testFeedback, setTestFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setTestFeedback(msg);
    setTimeout(() => setTestFeedback(null), 3000);
  };

  const handleToggleStatus = (id: string) => {
    setTestItems(prev => prev.map(item => {
      if (item.id === id) {
        const statuses: TestStatus[] = ["working", "needs_fix", "missing", "prototype_only", "review"];
        const currentIndex = statuses.indexOf(item.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        return { ...item, status: statuses[nextIndex] };
      }
      return item;
    }));
  };

  const handleActionClick = (actionKey: string) => {
    const handlers: Record<string, () => void> = {
      'home': onGoHome,
      'search': onGoSearch,
      'post': onGoPost,
      'saved': onGoSaved,
      'profile': onGoProfile,
      'auth': onGoAuth,
      'safety': onGoSafety,
      'about': onGoAbout,
      'support': onGoSupport,
      'landlord-dashboard': onGoLandlordDashboard
    };
    
    if (handlers[actionKey]) {
      handlers[actionKey]();
    } else {
      showFeedback('This check is manual in the prototype.');
    }
  };

  const quickNav = [
    { label: 'Home', action: onGoHome },
    { label: 'Search', action: onGoSearch },
    { label: 'Post', action: onGoPost },
    { label: 'Saved', action: onGoSaved },
    { label: 'Profile', action: onGoProfile },
    { label: 'Auth', action: onGoAuth },
    { label: 'Safety', action: onGoSafety },
    { label: 'About', action: onGoAbout },
    { label: 'Support', action: onGoSupport },
    { label: 'Dashboard', action: onGoLandlordDashboard }
  ];

  return (
    <div className="absolute inset-0 bg-neutral-50 dark:bg-stone-950 flex flex-col xl:items-center xl:bg-neutral-100 dark:xl:bg-stone-900 pb-20">
      <div className="w-full h-full flex flex-col bg-white dark:bg-stone-950 shadow-2xl xl:max-w-[440px] xl:h-[850px] xl:my-auto xl:rounded-[40px] xl:overflow-hidden relative xl:border xl:border-neutral-200/50 dark:xl:border-stone-800">
        
        <TestModeHeader onBack={onBack} />

        <div className="flex-1 overflow-y-auto scrollbar-hide z-10 px-4 pt-6 pb-28">
          
          {/* Quick Nav Buttons */}
          <div className="flex overflow-x-auto scrollbar-hide space-x-2 mb-6 pb-2 -mx-4 px-4 snap-x">
            {quickNav.map(nav => (
              <motion.button
                key={nav.label}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={nav.action}
                className="shrink-0 snap-start bg-neutral-100/80 dark:bg-stone-800 flex items-center justify-center px-4 py-2.5 rounded-full border border-neutral-200/50 dark:border-stone-700/50 shadow-sm"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600 dark:text-stone-300 whitespace-nowrap">
                  {nav.label}
                </span>
              </motion.button>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2 mb-6"
          >
            <h2 className="text-2xl font-black text-neutral-800 dark:text-stone-100 tracking-tight leading-tight">
              Test Mode
            </h2>
            <p className="text-[13px] font-semibold text-neutral-500 dark:text-stone-400 leading-relaxed max-w-[280px] mx-auto">
              Check what works, what needs fixing, and what should be improved before the next build stage.
            </p>
            <p className="inline-block mt-2 text-[9px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/20 py-1.5 px-3 rounded-full border border-indigo-100 dark:border-indigo-900/30">
              This is an internal prototype audit page. It does not submit data anywhere.
            </p>
          </motion.div>

          <div className="space-y-8">
            <TestModeSummary items={testItems} />
            <TestReadinessScore items={testItems} />
            
            <div className="pt-2 border-t border-neutral-100 dark:border-stone-800/50">
              <TestFlowChecklist 
                items={testItems} 
                onToggleStatus={handleToggleStatus} 
                onActionClick={handleActionClick} 
              />
            </div>
            
            <div className="pt-6 border-t border-neutral-100 dark:border-stone-800/50">
              <h3 className="text-[16px] font-black tracking-tight text-neutral-800 dark:text-stone-100 mb-2">
                Issue board
              </h3>
              <TestIssueBoard />
            </div>
            
            <div className="pt-6 border-t border-neutral-100 dark:border-stone-800/50">
              <TestModeReportPanel items={testItems} onShowFeedback={showFeedback} />
            </div>
          </div>
        </div>

        {/* Global Feedback Toast */}
        <AnimatePresence>
          {testFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="absolute left-1/2 top-20 z-[100] whitespace-nowrap bg-neutral-800/95 dark:bg-stone-200/95 text-white dark:text-stone-900 px-4 py-2.5 rounded-full shadow-lg backdrop-blur-md font-bold text-[11px] uppercase tracking-wider flex items-center space-x-2 border border-neutral-700 dark:border-stone-300"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-450 dark:text-emerald-600" />
              <span>{testFeedback}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
