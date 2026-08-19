import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp
} from 'lucide-react';
import AboutHeader from '../components/AboutHeader';
import AboutHeroMission from '../components/AboutHeroMission';
import AboutProblemSolution from '../components/AboutProblemSolution';
import AboutWhoWeServe from '../components/AboutWhoWeServe';
import AboutHowItWorks from '../components/AboutHowItWorks';
import AboutTrustPromise from '../components/AboutTrustPromise';
import AboutLaunchStrategy from '../components/AboutLaunchStrategy';
import { useToast } from '../context/ToastContext';

interface AboutPageProps {
  onBack: () => void;
  onGoSearch?: () => void;
  onGoPost?: () => void;
  onGoSafety?: () => void;
}

export default function AboutPage({ onBack, onGoSearch, onGoPost, onGoSafety }: AboutPageProps) {
  const { showToast } = useToast();

  const showFeedback = (msg: string) => {
    showToast(msg);
  };

  const containerVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
  };

  // Structured list of placeholder cards
  const placeholders = [
    {
      id: 'future_roadmap',
      title: 'Future roadmap',
      desc: 'Interactive map routes, scout incentives, verified caretaker badging, and automated alerts.',
      icon: TrendingUp,
      version: 'v2.0.7'
    }
  ];

  return (
    <div className="flex-1 flex flex-col relative animate-fadeIn bg-neutral-50/50 dark:bg-stone-900/10 min-h-full -mx-6 -mt-6">
      {/* Background soft blurs */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-amber-500/5 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none z-0" />

      <AboutHeader onBack={onBack} />

      {/* Main content viewport */}
      <div className="flex-1 overflow-y-auto no-scrollbar z-10 px-6 py-6 pb-28 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6 max-w-lg mx-auto"
        >
          {/* Page Title & Subtitle block */}
          <motion.div variants={itemVariants} className="space-y-2 text-center sm:text-left mt-2">
            <h1 className="text-2xl font-black text-neutral-900 dark:text-stone-100 uppercase tracking-tight">
              About KejaFinder
            </h1>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              Helping Kenyans find vacant, affordable homes faster.
            </p>
            <p className="text-xs font-semibold text-neutral-500 dark:text-stone-405 leading-relaxed">
              No more walking plot to plot. Search rooms by area, budget, and availability.
            </p>
          </motion.div>

          {/* About Hero & Mission Content */}
          <AboutHeroMission 
            onGoSearch={onGoSearch} 
            onGoPost={onGoPost} 
            onShowFeedback={showFeedback} 
          />

          {/* Problem & Solution Content */}
          <AboutProblemSolution
            onGoSearch={onGoSearch}
            onGoSafety={onGoSafety}
            onShowFeedback={showFeedback}
          />

          {/* Who We Serve Content */}
          <AboutWhoWeServe
            onGoSearch={onGoSearch}
            onGoPost={onGoPost}
            onShowFeedback={showFeedback}
          />

          {/* How It Works Content */}
          <AboutHowItWorks
            onGoSearch={onGoSearch}
            onGoPost={onGoPost}
            onShowFeedback={showFeedback}
          />

          {/* Trust & Safety Promise Content */}
          <AboutTrustPromise
            onGoSafety={onGoSafety}
            onGoSearch={onGoSearch}
            onShowFeedback={showFeedback}
          />

          {/* Local Launch Strategy Content */}
          <AboutLaunchStrategy
            onGoSearch={onGoSearch}
            onGoPost={onGoPost}
            onShowFeedback={showFeedback}
          />

          {/* Placeholder sections of Roadmap tracker */}
          <div className="space-y-3">
            <div className="px-1 flex items-center justify-between">
              <h3 className="text-xs font-black text-neutral-800 dark:text-stone-250 uppercase tracking-wider">
                Platform Roadmap
              </h3>
              <span className="text-[9px] font-black text-neutral-550 dark:text-stone-500 uppercase tracking-widest bg-neutral-100 dark:bg-stone-850 px-2 py-0.5 rounded-lg border border-neutral-200/40 dark:border-stone-800/30">
                Foundations Live
              </span>
            </div>

            <div className="space-y-3" role="region" aria-label="Roadmap section placeholders">
              {placeholders.map((pt) => {
                const IconComponent = pt.icon;
                return (
                  <motion.div
                    key={pt.id}
                    variants={itemVariants}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => showFeedback(`Full section coming in ${pt.version}`)}
                    className="group bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-850/40 rounded-2.5xl p-4.5 shadow-3xs hover:shadow-2xs hover:border-emerald-500/15 transition-all text-left flex items-start space-x-4 cursor-pointer outline-none select-none"
                  >
                    {/* Circle wrapper for the customized placeholder icon */}
                    <div className="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-stone-850 border border-neutral-150/75 dark:border-stone-800/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-250">
                      <IconComponent className="w-5 h-5 text-neutral-500 dark:text-stone-400 stroke-[2]" />
                    </div>

                    {/* Text description explaining the section scope */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[12px] font-black text-neutral-805 dark:text-stone-100 uppercase tracking-tight">
                          {pt.title}
                        </h4>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-neutral-550 dark:text-stone-400 font-mono tracking-widest">
                          {pt.version}
                        </span>
                      </div>
                      <p className="text-[10.5px] font-semibold text-neutral-550 dark:text-stone-500 leading-relaxed truncate group-hover:text-neutral-600 dark:group-hover:text-stone-300 transition-colors">
                        {pt.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
