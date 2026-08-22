import React from 'react';
import { motion } from 'motion/react';
import { 
  BadgeCheck, 
  MapPin, 
  UserCheck, 
  KeyRound, 
  Clock, 
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';

interface SafetyTrustBadgesProps {
  onGoSearch?: () => void;
  onShowFeedback: (msg: string) => void;
}

export default function SafetyTrustBadges({
  onGoSearch,
  onShowFeedback
}: SafetyTrustBadgesProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const handleSearch = () => {
    if (onGoSearch) {
      onGoSearch();
    } else {
      onShowFeedback('Verified listing search coming soon.');
    }
  };

  const badgeDetails = [
    {
      id: 'phone_verified',
      title: 'Phone Verified',
      description: 'The contact number has been confirmed.',
      helpsWith: 'Reduces fake or unreachable phone numbers.',
      icon: BadgeCheck,
      color: 'emerald'
    },
    {
      id: 'location_checked',
      title: 'Location Checked',
      description: 'The area, estate, landmark, or location details were reviewed.',
      helpsWith: 'Helps reduce wrong-location listings.',
      icon: MapPin,
      color: 'emerald'
    },
    {
      id: 'scout_verified',
      title: 'Scout Verified',
      description: 'An area scout physically checked the listing.',
      helpsWith: 'Adds stronger confidence that the house exists and details were checked.',
      icon: UserCheck,
      color: 'emerald'
    },
    {
      id: 'trusted_landlord',
      title: 'Trusted Landlord',
      description: 'The landlord has a history of accurate listings and low reports.',
      helpsWith: 'Helps identify posters with better listing behavior.',
      icon: KeyRound,
      color: 'emerald'
    },
    {
      id: 'recently_updated',
      title: 'Recently Updated',
      description: 'The listing was confirmed recently.',
      helpsWith: 'Helps reduce outdated or already-taken listings.',
      icon: Clock,
      color: 'amber'
    }
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Section Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center space-x-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <h3 className="text-xl font-black text-neutral-850 dark:text-stone-100 tracking-tight">
            Trust badges explained
          </h3>
        </div>
        <p className="text-[13px] font-semibold text-neutral-600 dark:text-stone-300 mb-1">
          Badges help you understand what has been checked before you contact someone.
        </p>
        <p className="text-[12px] font-medium text-neutral-500 dark:text-stone-400">
          Badges are helpful signals, but they do not replace physically viewing the house.
        </p>
      </motion.div>

      {/* Badge List */}
      <div className="space-y-3">
        {badgeDetails.map((badge) => {
          const Icon = badge.icon;
          const isAmber = badge.color === 'amber';
          
          return (
            <motion.div 
              key={badge.id}
              variants={itemVariants}
              className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-neutral-200/60 dark:border-stone-800/60 rounded-2xl p-4 shadow-sm flex flex-col space-y-3"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isAmber 
                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' 
                    : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-[14px] font-black text-neutral-800 dark:text-stone-200 uppercase tracking-tight">
                      {badge.title}
                    </h4>
                    <span className="text-[9px] font-black uppercase tracking-widest bg-neutral-100 dark:bg-stone-800 text-neutral-500 dark:text-stone-400 px-2 py-0.5 rounded-full shrink-0">
                      Trust signal
                    </span>
                  </div>
                  <p className="text-[12px] font-semibold text-neutral-700 dark:text-stone-300 leading-snug mb-1">
                    {badge.description}
                  </p>
                  <p className="text-[11px] font-medium text-neutral-500 dark:text-stone-400 leading-snug">
                    <span className="font-bold text-neutral-550 dark:text-stone-400">Helps with:</span> {badge.helpsWith}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Badge comparison mini summary */}
      <motion.div variants={itemVariants} className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/60 dark:border-emerald-900/20 rounded-2xl p-4">
        <h4 className="text-[13px] font-black text-emerald-800 dark:text-emerald-300 tracking-tight leading-tight mb-2">
          Best signal combination
        </h4>
        <p className="text-[12px] font-medium text-emerald-900/80 dark:text-emerald-100/80 leading-snug mb-2">
          A listing with Phone Verified, Location Checked, Scout Verified, and Recently Updated is stronger than a listing with no badges.
        </p>
        <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400/80 uppercase tracking-wider">
          Still confirm availability before visiting.
        </p>
      </motion.div>

      {/* Important caution card */}
      <motion.div variants={itemVariants} className="bg-orange-50/90 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-orange-700 dark:text-orange-400 shrink-0" />
          <h4 className="text-[14px] font-black text-orange-800 dark:text-orange-300 tracking-tight">
            Badges are not a payment guarantee
          </h4>
        </div>
        
        <p className="text-[12px] font-semibold text-neutral-700 dark:text-stone-300 leading-relaxed mb-3">
          Even with badges, you should still confirm the house physically, verify the caretaker or landlord, and check rent, deposit, water, electricity, and agent fees before paying.
        </p>

        <div className="bg-white/80 dark:bg-stone-900/80 rounded-xl p-3 border border-orange-100 dark:border-orange-900/20">
          <p className="text-[12px] font-black text-orange-700 dark:text-orange-400 leading-snug">
            Never send deposit before physically viewing the house and confirming the caretaker or landlord.
          </p>
        </div>
      </motion.div>

      {/* Action */}
      <motion.div variants={itemVariants}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSearch}
          className="w-full bg-neutral-100 dark:bg-stone-800 text-neutral-700 dark:text-stone-300 border border-neutral-200 dark:border-stone-700 rounded-2xl py-3.5 px-4 font-black uppercase text-[12px] tracking-wider hover:bg-neutral-200 dark:hover:bg-stone-700 transition-colors shadow-sm"
          aria-label="Search verified listings"
        >
          Search verified listings
        </motion.button>
      </motion.div>

    </motion.div>
  );
}
