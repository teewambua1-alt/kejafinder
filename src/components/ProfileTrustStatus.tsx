import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Mail, 
  BadgeCheck, 
  UserCheck, 
  AlertTriangle, 
  AlertCircle 
} from 'lucide-react';
import { profileTrustStatus, TrustCheckItem } from '../data/profileData';

export default function ProfileTrustStatus() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const getIcon = (iconName: string, isCompleted: boolean) => {
    const iconProps = {
      className: `w-4 h-4 ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400 dark:text-stone-500'} stroke-[2.2] shrink-0`
    };

    switch (iconName) {
      case 'Phone': return <Phone {...iconProps} />;
      case 'MapPin': return <MapPin {...iconProps} />;
      case 'Mail': return <Mail {...iconProps} />;
      case 'BadgeCheck': return <BadgeCheck {...iconProps} />;
      case 'UserCheck': return <UserCheck {...iconProps} />;
      default: return <ShieldCheck {...iconProps} />;
    }
  };

  const containerVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
        staggerChildren: 0.05
      }
    }
  };

  const childrenVariants: any = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full space-y-4"
      id="profile-trust-verification-section"
    >
      {/* Group Title Header */}
      <div className="px-1 space-y-0.5">
        <h3 className="text-xs font-black text-neutral-800 dark:text-stone-255 uppercase tracking-wider">
          Trust & Verification
        </h3>
        <p className="text-[10px] font-semibold text-neutral-450 dark:text-stone-500 leading-relaxed">
          Build trust when searching, saving, or posting homes.
        </p>
      </div>

      {/* 1. Main Profile Completion Card with Progress Bar */}
      <motion.div 
        variants={childrenVariants}
        className="w-full bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-3xl p-4.5 shadow-3xs"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-black text-neutral-850 dark:text-stone-100 uppercase tracking-tight">
              Profile Strength
            </span>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
              {profileTrustStatus.completion}% complete
            </span>
          </div>

          {/* Progress track */}
          <div 
            className="w-full h-2 bg-neutral-100 dark:bg-stone-800 rounded-full overflow-hidden"
            role="progressbar"
            aria-label="Profile completion strength"
            aria-valuenow={profileTrustStatus.completion}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${profileTrustStatus.completion}%` }}
              transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
              className="h-full bg-emerald-500 rounded-full"
            />
          </div>

          {/* Helper feedback hint text */}
          <p className="text-[10px] text-neutral-400 dark:text-stone-500 font-semibold leading-relaxed">
            Complete your profile to improve trust on KejaFinder and get responses faster.
          </p>
        </div>
      </motion.div>

      {/* 2. Verification Status Rows List Card */}
      <motion.div 
        variants={childrenVariants}
        className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-3xl overflow-hidden shadow-3xs"
      >
        <div className="divide-y divide-neutral-100 dark:divide-stone-800/30">
          {profileTrustStatus.checks.map((check: TrustCheckItem) => {
            const isCompleted = check.state === 'completed';
            const isPending = check.state === 'pending';
            const isOptional = check.state === 'optional';

            return (
              <div 
                key={check.id}
                className="p-4 flex items-start justify-between gap-3 text-left transition-colors"
              >
                {/* Visual left block: Icon container & text labels */}
                <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                  {/* Icon badge circle */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isCompleted 
                      ? 'bg-emerald-500/10 border-emerald-500/15 dark:bg-emerald-500/10' 
                      : 'bg-neutral-50 border-neutral-200 dark:bg-stone-800/50 dark:border-stone-800/40'
                  }`}>
                    {getIcon(check.iconName, isCompleted)}
                  </div>

                  {/* Text descriptions */}
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <span className="block text-[12px] font-black text-neutral-800 dark:text-stone-100 tracking-tight">
                      {check.title}
                    </span>
                    <span className="block text-[9.5px] font-semibold text-neutral-400 dark:text-stone-500 leading-normal">
                      {check.description}
                    </span>
                  </div>
                </div>

                {/* Right block: Status action button / status badges */}
                <div className="shrink-0 flex items-center justify-end self-center pl-1">
                  {isCompleted && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[8.5px] font-extrabold uppercase tracking-wider select-none">
                      {check.status}
                    </span>
                  )}

                  {isPending && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => showToast('Verification requests will be available in a later version.')}
                      className="px-2.5 py-1 text-[8.5px] font-extrabold uppercase tracking-wider rounded-lg bg-neutral-100 dark:bg-stone-800 text-neutral-500 dark:text-stone-400 border border-neutral-200 dark:border-stone-750 hover:bg-neutral-200 hover:text-neutral-700 dark:hover:bg-stone-700 dark:hover:text-stone-300 transition-colors cursor-pointer outline-none shrink-0"
                      aria-label="ID verification coming soon"
                    >
                      Coming soon
                    </motion.button>
                  )}

                  {isOptional && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => showToast('Verification requests will be available in a later version.')}
                      className="px-2.5 py-1 text-[8.5px] font-extrabold uppercase tracking-wider rounded-lg bg-orange-500/10 dark:bg-orange-500/15 text-orange-650 dark:text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-colors cursor-pointer outline-none shrink-0"
                      aria-label="Request scout verification later"
                    >
                      Request later
                    </motion.button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 3. Your Trust Badges Grid Segment */}
      <motion.div 
        variants={childrenVariants}
        className="w-full bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-3xl p-4.5 shadow-3xs space-y-3"
      >
        <span className="block text-[11px] font-black text-neutral-800 dark:text-stone-255 uppercase tracking-wider">
          Your active trust badges
        </span>

        {/* Small cluster group cards */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {profileTrustStatus.badges.map((badge) => (
            <div 
              key={badge} 
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 select-none shadow-3xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
              <span className="text-[9.5px] font-extrabold tracking-tight">{badge}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 4. Crucial Trust Disclaimer warning sticker banner */}
      <motion.div 
        variants={childrenVariants}
        className="bg-emerald-500/[0.03] dark:bg-emerald-950/[0.04] border border-emerald-500/20 dark:border-emerald-900/25 rounded-2.5xl p-4 flex items-start space-x-3 shadow-3xs"
      >
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-[11px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
            Official Badge Notice
          </h4>
          <p className="text-[10px] text-neutral-500 dark:text-stone-400 font-semibold leading-relaxed">
            Verification badges are actively reviewed and validated by the KejaFinder team. Do not claim a listing is verified inside description texts unless official checks are approved.
          </p>
        </div>
      </motion.div>

      {/* Internal interactive local feedback notifications */}
      <AnimatePresence>
        {toastMessage && (
          <div className="fixed inset-x-0 bottom-24 z-50 flex items-center justify-center pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 text-white font-extrabold text-[10.5px] uppercase tracking-wider px-4 py-2 rounded-xl shadow-lg flex items-center space-x-2 pointer-events-auto shadow-md"
            >
              <AlertCircle className="w-4 h-4 text-emerald-450 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
