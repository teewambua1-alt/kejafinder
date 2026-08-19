import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Phone, Mail, BadgeCheck } from 'lucide-react';

interface ProfileTrustStatusProps {
  isPhoneVerified: boolean;
  isIdVerified: boolean;
  hasEmail: boolean;
}

type CheckState = 'completed' | 'pending';

interface TrustCheck {
  id: string;
  title: string;
  description: string;
  status: string;
  icon: React.ComponentType<{ className?: string }>;
  state: CheckState;
}

// Real signals only, all from the actual profiles row (is_phone_verified,
// is_id_verified) and the auth user's email -- "Location Checked" and
// "Scout Verification" were dropped from here because those are
// listings.verification_level concepts (per-listing), not profile-level;
// showing them as personal trust checks was itself a small honesty bug.
export default function ProfileTrustStatus({ isPhoneVerified, isIdVerified, hasEmail }: ProfileTrustStatusProps) {
  const checks: TrustCheck[] = [
    {
      id: 'phone',
      title: 'Phone Verified',
      description: 'Your phone number has been confirmed.',
      status: 'Verified',
      icon: Phone,
      state: isPhoneVerified ? 'completed' : 'pending',
    },
    {
      id: 'email',
      title: 'Email Added',
      description: 'Your email is linked to this profile.',
      status: 'Added',
      icon: Mail,
      state: hasEmail ? 'completed' : 'pending',
    },
    {
      id: 'id-check',
      title: 'ID Verification',
      description: 'A KejaFinder admin has confirmed your identity.',
      status: 'Verified',
      icon: BadgeCheck,
      state: isIdVerified ? 'completed' : 'pending',
    },
  ];

  const completedCount = checks.filter((c) => c.state === 'completed').length;
  const completion = Math.round((completedCount / checks.length) * 100);
  const badges = checks.filter((c) => c.state === 'completed').map((c) => c.title);

  const containerVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.05 }
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
      <div className="px-1 space-y-0.5">
        <h3 className="text-xs font-black text-neutral-800 dark:text-stone-255 uppercase tracking-wider">
          Trust & Verification
        </h3>
        <p className="text-[10px] font-semibold text-neutral-550 dark:text-stone-500 leading-relaxed">
          Build trust when searching, saving, or posting homes.
        </p>
      </div>

      {/* Profile Completion Card */}
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
              {completion}% complete
            </span>
          </div>

          <div
            className="w-full h-2 bg-neutral-100 dark:bg-stone-800 rounded-full overflow-hidden"
            role="progressbar"
            aria-label="Profile completion strength"
            aria-valuenow={completion}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completion}%` }}
              transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
              className="h-full bg-emerald-500 rounded-full"
            />
          </div>

          <p className="text-[10px] text-neutral-400 dark:text-stone-500 font-semibold leading-relaxed">
            Complete your profile to improve trust on KejaFinder and get responses faster.
          </p>
        </div>
      </motion.div>

      {/* Verification Status Rows */}
      <motion.div
        variants={childrenVariants}
        className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-3xl overflow-hidden shadow-3xs"
      >
        <div className="divide-y divide-neutral-100 dark:divide-stone-800/30">
          {checks.map((check) => {
            const isCompleted = check.state === 'completed';
            const Icon = check.icon;

            return (
              <div key={check.id} className="p-4 flex items-start justify-between gap-3 text-left transition-colors">
                <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/15 dark:bg-emerald-500/10'
                      : 'bg-neutral-50 border-neutral-200 dark:bg-stone-800/50 dark:border-stone-800/40'
                  }`}>
                    <Icon className={`w-4 h-4 ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400 dark:text-stone-500'} stroke-[2.2] shrink-0`} />
                  </div>

                  <div className="space-y-0.5 min-w-0 flex-1">
                    <span className="block text-[12px] font-black text-neutral-800 dark:text-stone-100 tracking-tight">
                      {check.title}
                    </span>
                    <span className="block text-[9.5px] font-semibold text-neutral-400 dark:text-stone-500 leading-normal">
                      {check.description}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-end self-center pl-1">
                  {isCompleted ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[8.5px] font-extrabold uppercase tracking-wider select-none">
                      {check.status}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-[8.5px] font-extrabold uppercase tracking-wider rounded-lg bg-neutral-100 dark:bg-stone-800 text-neutral-500 dark:text-stone-400 border border-neutral-200 dark:border-stone-750 shrink-0">
                      Not yet
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Active Trust Badges */}
      {badges.length > 0 && (
        <motion.div
          variants={childrenVariants}
          className="w-full bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-3xl p-4.5 shadow-3xs space-y-3"
        >
          <span className="block text-[11px] font-black text-neutral-800 dark:text-stone-255 uppercase tracking-wider">
            Your active trust badges
          </span>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {badges.map((badge) => (
              <div key={badge} className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 select-none shadow-3xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
                <span className="text-[9.5px] font-extrabold tracking-tight">{badge}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

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
    </motion.div>
  );
}
