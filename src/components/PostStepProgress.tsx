import React from 'react';
import { Check, ClipboardList, MapPin, Image, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { PostStep } from '../types/postListing';

type PostStepProgressProps = {
  currentStep: PostStep;
};

export default function PostStepProgress({ currentStep }: PostStepProgressProps) {
  const steps = [
    { number: 1, label: 'Details', icon: ClipboardList },
    { number: 2, label: 'Location', icon: MapPin },
    { number: 3, label: 'Photos', icon: Image },
    { number: 4, label: 'Review', icon: Eye },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="w-full bg-white/60 dark:bg-stone-900/40 backdrop-blur-md rounded-2xl border border-neutral-100 dark:border-neutral-800/80 p-4 shadow-sm relative z-10"
      id="post-step-progress-stepper"
    >
      <div className="flex items-center justify-between relative px-2">
        {/* Background Connecting Line */}
        <div className="absolute left-[38px] right-[38px] top-[18px] h-[3px] bg-neutral-100 dark:bg-stone-800/60 z-0">
          {/* Animated Green progress bar filling */}
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="h-full bg-emerald-500 rounded-full"
          />
        </div>

        {/* Steps loop */}
        {steps.map((stepItem, idx) => {
          const isCompleted = stepItem.number < currentStep;
          const isActive = stepItem.number === currentStep;
          const isFuture = stepItem.number > currentStep;
          const IconComponent = stepItem.icon;

          return (
            <div key={idx} className="flex flex-col items-center space-y-1.5 z-10 select-none">
              <div 
                className={`relative w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-500 dark:border-emerald-600 text-white shadow-xs'
                    : isActive
                      ? 'bg-emerald-500 border-emerald-500 dark:border-emerald-600 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-white dark:bg-stone-850 border-neutral-200 dark:border-stone-800 text-neutral-400 dark:text-stone-500'
                }`}
              >
                {/* Visual marker inside node */}
                <span className="absolute -inset-[3px] rounded-full border border-emerald-500/15 opacity-0 animate-pulse" style={{ display: isActive ? 'block' : 'none' }} />
                
                {isCompleted ? (
                  <Check className="w-4.5 h-4.5 stroke-[3]" />
                ) : (
                  <span className="text-xs font-black font-sans">{stepItem.number}</span>
                )}
              </div>

              {/* Step Title Label */}
              <span 
                className={`text-[10px] sm:text-xs font-bold tracking-tight text-center transition-colors duration-300 ${
                  isCompleted || isActive
                    ? 'text-emerald-700 dark:text-emerald-400 font-extrabold'
                    : 'text-neutral-400 dark:text-stone-500 font-semibold'
                }`}
              >
                {stepItem.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
