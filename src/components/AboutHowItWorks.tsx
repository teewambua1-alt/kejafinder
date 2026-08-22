import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  SlidersHorizontal, 
  Home, 
  ListChecks, 
  BadgeCheck, 
  PhoneCall, 
  MessageCircle, 
  ShieldCheck, 
  Eye, 
  PlusCircle, 
  Image, 
  ClipboardCheck, 
  RefreshCw, 
  Flag, 
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

interface AboutHowItWorksProps {
  onGoSearch?: () => void;
  onGoPost?: () => void;
  onShowFeedback: (msg: string) => void;
}

export default function AboutHowItWorks({ onGoSearch, onGoPost, onShowFeedback }: AboutHowItWorksProps) {
  
  const tenantSteps = [
    {
      step: 1,
      title: "Search by area",
      desc: "Enter a town, estate, stage, road, or landmark.",
      icon: Search,
      color: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
    },
    {
      step: 2,
      title: "Filter by budget and type",
      desc: "Choose single room, bedsitter, mabati, studio, one bedroom, or other local rental types.",
      icon: SlidersHorizontal,
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40"
    },
    {
      step: 3,
      title: "Compare listing details",
      desc: "Check rent, deposit, photos, water, electricity, toilet type, location, and trust badges.",
      icon: ListChecks,
      color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40"
    },
    {
      step: 4,
      title: "Call or WhatsApp",
      desc: "Contact the caretaker, landlord, or agent directly.",
      icon: PhoneCall,
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40"
    },
    {
      step: 5,
      title: "Visit before paying",
      desc: "Physically view the house and confirm the contact person before sending money.",
      icon: ShieldCheck,
      color: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/60 font-black ring-1 ring-emerald-500/20"
    }
  ];

  const posterSteps = [
    {
      step: 1,
      title: "Post a vacancy",
      desc: "Add house type, rent, deposit breakdown, location, available amenities, and caretaker contact details.",
      icon: PlusCircle,
      color: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
    },
    {
      step: 2,
      title: "Upload clear photos",
      desc: "Inside room, house exterior, shared / private toilet, and compound photos help tenants trust your listing.",
      icon: Image,
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40"
    },
    {
      step: 3,
      title: "Submit for review",
      desc: "All submitted listings will be reviewed in the MVP stage to keep KejaFinder active with real vacancies.",
      icon: ClipboardCheck,
      color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40"
    },
    {
      step: 4,
      title: "Respond to renters",
      desc: "Tenants find listings and call or text directly to arrange physical property visits.",
      icon: MessageCircle,
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40"
    },
    {
      step: 5,
      title: "Keep it updated",
      desc: "Mark the house as instantly taken or refresh the publication state if still open for viewings.",
      icon: RefreshCw,
      color: "text-neutral-600 dark:text-stone-300 bg-neutral-50 dark:bg-stone-850"
    }
  ];

  const trustActions = [
    "Save prospective homes within your Saved tab to compare prices later.",
    "Use the 'Is this still available?' message tag on older publications.",
    "Instantly report fake, wrong, unsafe, or already-taken listings to clean lists.",
    "Look out for Phone Verified, Location Checked, Scout Verified, and Recently Updated badges.",
    "Always confirm host identity physically before any payment transaction."
  ];

  const handleSearchAction = () => {
    if (onGoSearch) {
      onGoSearch();
    } else {
      onShowFeedback("Search page coming soon.");
    }
  };

  const handlePostAction = () => {
    if (onGoPost) {
      onGoPost();
    } else {
      onShowFeedback("Post vacancy flow coming soon.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* 1. Header Title Block */}
      <motion.div variants={itemVariants} className="space-y-1.5 border-t border-neutral-200/40 dark:border-stone-800/40 pt-6">
        <h3 className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
          How It Works
        </h3>
        <h2 className="text-lg font-black text-neutral-900 dark:text-stone-100 uppercase tracking-tight">
          How KejaFinder works
        </h2>
        <p className="text-[12px] font-bold text-neutral-650 dark:text-stone-300 leading-snug">
          Search first, compare clearly, then visit physically before paying.
        </p>
        <p className="text-[11px] font-semibold text-neutral-550 dark:text-stone-450 leading-relaxed">
          KejaFinder is designed to reduce wasted trips and help renters contact the right person faster.
        </p>
      </motion.div>

      {/* 2. Tenant Journey Column */}
      <motion.div
        variants={itemVariants}
        className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-850/40 rounded-3xl p-5.5 shadow-3xs space-y-4"
      >
        <div className="flex items-center space-x-2 pb-1 border-b border-neutral-100 dark:border-stone-850/50">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-700 animate-pulse" />
          <h4 className="text-[12px] font-black text-neutral-805 dark:text-stone-100 uppercase tracking-wider">
            For Tenants
          </h4>
        </div>

        <div className="space-y-3.5" role="list">
          {tenantSteps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div key={step.step} className="flex space-x-3.5 items-start" role="listitem">
                <div className={`w-8.5 h-8.5 rounded-xl shrink-0 flex items-center justify-center border border-neutral-200/10 font-bold text-[11px] shadow-4xs ${step.color}`}>
                  <IconComponent className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="space-y-0.5">
                  <h5 className="text-[11.5px] font-bold text-neutral-800 dark:text-stone-100 uppercase tracking-tight leading-snug">
                    {step.step}. {step.title}
                  </h5>
                  <p className="text-[10.5px] font-semibold text-neutral-550 dark:text-stone-400 leading-snug">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 3. Landlord/Caretaker Journey Column */}
      <motion.div
        variants={itemVariants}
        className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-850/40 rounded-3xl p-5.5 shadow-3xs space-y-4"
      >
        <div className="flex items-center space-x-2 pb-1 border-b border-neutral-100 dark:border-stone-850/50">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <h4 className="text-[12px] font-black text-neutral-855 dark:text-stone-100 uppercase tracking-wider">
            For Landlords &amp; Caretakers
          </h4>
        </div>

        <div className="space-y-3.5" role="list">
          {posterSteps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div key={step.step} className="flex space-x-3.5 items-start" role="listitem">
                <div className={`w-8.5 h-8.5 rounded-xl shrink-0 flex items-center justify-center border border-neutral-200/10 font-bold text-[11px] shadow-4xs ${step.color}`}>
                  <IconComponent className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="space-y-0.5">
                  <h5 className="text-[11.5px] font-bold text-neutral-800 dark:text-stone-100 uppercase tracking-tight leading-snug">
                    {step.step}. {step.title}
                  </h5>
                  <p className="text-[10.5px] font-semibold text-neutral-550 dark:text-stone-400 leading-snug">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 4. Trust Actions Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-850/40 rounded-3xl p-5 shadow-3xs space-y-3.5"
      >
        <div className="flex items-center space-x-2 text-neutral-800 dark:text-stone-100">
          <BadgeCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400 stroke-[2.2]" />
          <h4 className="text-[11.5px] font-black uppercase tracking-wider">
            Trust Actions Built Into The Flow
          </h4>
        </div>

        <ul className="space-y-2.5" role="list">
          {trustActions.map((action, index) => (
            <li key={index} className="flex items-start space-x-2" role="listitem">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0 mt-1.5" />
              <span className="text-[10.5px] font-semibold text-neutral-600 dark:text-stone-350 leading-relaxed">
                {action}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* 5. Flow summary Mini Timeline */}
      <motion.div
        variants={itemVariants}
        className="bg-neutral-100/60 dark:bg-stone-900/40 border border-neutral-250/20 dark:border-stone-800/40 rounded-2.5xl p-4.5"
      >
        <span className="text-[8.5px] font-black text-neutral-550 dark:text-stone-400 uppercase tracking-widest block text-center mb-3">
          Rental Journey Flow Timeline
        </span>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center" role="navigation" aria-label="Journey summary indicators">
          <div className="px-2.5 py-1 bg-white dark:bg-stone-900 border border-neutral-200/50 dark:border-stone-800 rounded-lg text-[10px] font-black uppercase tracking-tight text-neutral-700 dark:text-stone-300">
            1. Search
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-550 rotate-90 sm:rotate-0" />
          <div className="px-2.5 py-1 bg-white dark:bg-stone-900 border border-neutral-200/50 dark:border-stone-800 rounded-lg text-[10px] font-black uppercase tracking-tight text-neutral-700 dark:text-stone-300">
            2. Compare
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-550 rotate-90 sm:rotate-0" />
          <div className="px-2.5 py-1 bg-white dark:bg-stone-900 border border-neutral-200/50 dark:border-stone-800 rounded-lg text-[10px] font-black uppercase tracking-tight text-neutral-700 dark:text-stone-300">
            3. Contact
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-550 rotate-90 sm:rotate-0" />
          <div className="px-2.5 py-1 bg-white dark:bg-stone-900 border border-neutral-200/50 dark:border-stone-800 rounded-lg text-[10px] font-black uppercase tracking-tight text-neutral-700 dark:text-stone-300">
            4. Visit
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-550 rotate-90 sm:rotate-0" />
          <div className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[10px] font-black uppercase tracking-tight text-amber-700 dark:text-amber-400">
            5. Pay Safely
          </div>
        </div>
      </motion.div>

      {/* 6. Safety Warning Admonition */}
      <motion.div
        variants={itemVariants}
        className="bg-amber-500/[0.04] dark:bg-amber-500/[0.02] border border-amber-500/15 dark:border-amber-900/20 rounded-2.5xl p-4.5 flex items-start space-x-3.5 shadow-4xs"
      >
        <AlertTriangle className="w-5.5 h-5.5 text-amber-600 dark:text-amber-500 shrink-0 stroke-[2.2] mt-0.5 animate-pulse" />
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-500 block">
            Safe Renting Guarantee Rule
          </span>
          <p className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-500 leading-tight">
            “Never send deposit before physically viewing the house and confirming the caretaker or landlord.”
          </p>
          <p className="text-[10px] font-semibold text-neutral-500 dark:text-stone-400 leading-normal">
            KejaFinder helps you find options faster, but physical viewing remains part of safe renting.
          </p>
        </div>
      </motion.div>

      {/* 7. CTA Action triggers */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-2.5">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSearchAction}
          className="flex-1 h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-[11.5px] uppercase tracking-wider rounded-2xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          aria-label="Try search for affordable vacant rooms"
        >
          <Search className="w-4 h-4 stroke-[2.2]" />
          <span>Try search</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handlePostAction}
          className="flex-1 h-11 bg-white dark:bg-stone-900 hover:bg-neutral-50 dark:hover:bg-stone-850 text-neutral-800 dark:text-stone-105 border border-neutral-300 dark:border-stone-800 font-black text-[11.5px] uppercase tracking-wider rounded-2xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          aria-label="Post a vacancy listing"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.2] text-emerald-700 dark:text-emerald-400" />
          <span>Post a vacancy</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
