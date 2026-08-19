import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Home, 
  Building2, 
  ClipboardList, 
  Briefcase, 
  MapPin, 
  ShieldCheck, 
  Users, 
  PlusCircle, 
  CheckCircle2 
} from 'lucide-react';

interface AboutWhoWeServeProps {
  onGoSearch?: () => void;
  onGoPost?: () => void;
  onShowFeedback: (msg: string) => void;
}

export default function AboutWhoWeServe({ onGoSearch, onGoPost, onShowFeedback }: AboutWhoWeServeProps) {
  
  const userGroups = [
    {
      title: "Tenants",
      desc: "People searching for vacant rooms and houses near work, school, road, stage, or town.",
      icon: Search,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
      needs: [
        "Find homes fast",
        "Compare rent & deposit",
        "See photos & local details",
        "Call or WhatsApp directly",
        "Avoid fake or outdated posts"
      ],
      isHighlight: true
    },
    {
      title: "Landlords",
      desc: "Property owners who want to fill vacant rooms without relying only on paper signs.",
      icon: Building2,
      iconBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
      needs: [
        "Post vacancies easily",
        "Reach more tenants",
        "Update availability",
        "Mark houses as taken"
      ],
      isHighlight: false
    },
    {
      title: "Caretakers",
      desc: "Local managers who know which rooms are vacant and speak directly with tenants.",
      icon: ClipboardList,
      iconBg: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
      needs: [
        "Post quickly",
        "Receive direct messages",
        "Manage several rooms",
        "Update availability fast"
      ],
      isHighlight: false
    },
    {
      title: "Agents",
      desc: "Rental agents who can post listings with clear fees and transparent contact details.",
      icon: Briefcase,
      iconBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
      needs: [
        "Show clear fees upfront",
        "Build reliable client trust",
        "Avoid misleading posts",
        "Respond to client reports"
      ],
      isHighlight: false
    },
    {
      title: "Area scouts",
      desc: "Trusted local people who can help collect and check vacancy details later.",
      icon: MapPin,
      iconBg: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400",
      needs: [
        "Confirm availability",
        "Check actual photos",
        "Add key local landmarks",
        "Reduce fake listings"
      ],
      isHighlight: false
    },
    {
      title: "Admins",
      desc: "Platform reviewers who will protect listing quality in the real MVP.",
      icon: ShieldCheck,
      iconBg: "bg-stone-150 dark:bg-stone-800 text-neutral-700 dark:text-stone-300",
      needs: [
        "Review pending listings",
        "Handle user reports",
        "Manage verification tags",
        "Remove outdated posts"
      ],
      isHighlight: false,
      isSubtle: true
    }
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
      transition: {
        staggerChildren: 0.05
      }
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
      {/* 1. Section Header Title Area */}
      <motion.div variants={itemVariants} className="space-y-1.5 border-t border-neutral-200/40 dark:border-stone-800/40 pt-6">
        <h3 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
          Who We Serve
        </h3>
        <h2 className="text-lg font-black text-neutral-900 dark:text-stone-100 uppercase tracking-tight">
          Who KejaFinder serves
        </h2>
        <p className="text-[12px] font-bold text-neutral-650 dark:text-stone-300 leading-snug">
          KejaFinder is built for the people who make local rentals work every day.
        </p>
        <p className="text-[11px] font-semibold text-neutral-550 dark:text-stone-450 leading-relaxed">
          From tenants searching for rooms to caretakers updating vacancies, every user needs simple, trusted tools.
        </p>
      </motion.div>

      {/* 2. User Group Matrix List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5" role="region" aria-label="Target user list">
        {userGroups.map((group, index) => {
          const IconComponent = group.icon;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -1 }}
              className={`bg-white/95 dark:bg-stone-900/95 border rounded-3xl p-4.5 shadow-3xs flex flex-col justify-between space-y-3.5 relative overflow-hidden transition-all ${
                group.isHighlight 
                  ? "border-emerald-500/20 dark:border-emerald-900/25 ring-1 ring-emerald-500/5 dark:ring-emerald-900/10" 
                  : group.isSubtle 
                    ? "border-neutral-200/40 dark:border-stone-850/30 opacity-80" 
                    : "border-neutral-200/50 dark:border-stone-850/40"
              }`}
            >
              <div className="space-y-2.5">
                {/* User Group Info (Header) */}
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-neutral-200/20 shadow-3xs ${group.iconBg}`}>
                    <IconComponent className="w-4.5 h-4.5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-black text-neutral-850 dark:text-stone-100 uppercase tracking-tight flex items-center space-x-1.5">
                      <span>{group.title}</span>
                      {group.isSubtle && (
                        <span className="text-[8px] font-black uppercase bg-neutral-100 dark:bg-stone-850 text-neutral-550 dark:text-stone-500 px-1.5 py-0.5 rounded-md border border-neutral-200/40 dark:border-stone-800/30 font-mono tracking-widest scale-90">
                          MVP Roles
                        </span>
                      )}
                    </h4>
                    <p className="text-[10.5px] font-semibold text-neutral-400 dark:text-stone-500 leading-none mt-0.5">
                      {group.needs.length} Core Needs
                    </p>
                  </div>
                </div>

                <p className="text-[11px] font-semibold text-neutral-600 dark:text-stone-400 leading-relaxed">
                  {group.desc}
                </p>
              </div>

              {/* Needs List */}
              <div className="space-y-2 border-t border-neutral-100 dark:border-stone-850/50 pt-3">
                <span className="text-[8px] font-black text-neutral-400 dark:text-stone-550 uppercase tracking-widest block">
                  Key Requirements:
                </span>
                <div className="flex flex-wrap gap-1" role="list">
                  {group.needs.map((need, idx) => (
                    <span
                      key={idx}
                      role="listitem"
                      className="text-[9.5px] font-bold px-2 py-0.5 bg-neutral-50 dark:bg-stone-850 text-neutral-650 dark:text-stone-300 border border-neutral-150/50 dark:border-stone-800/50 rounded-md truncate max-w-full"
                    >
                      {need}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. "Built for ordinary renters" emphasis card */}
      <motion.div 
        variants={itemVariants}
        className="bg-emerald-500/[0.03] dark:bg-emerald-500/[0.01s] border border-emerald-500/15 dark:border-emerald-950/15 rounded-3xl p-5 flex items-start space-x-4 shadow-4xs"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/15 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
        </div>
        <div className="space-y-1">
          <h4 className="text-[11.5px] font-black text-neutral-850 dark:text-stone-105 uppercase tracking-wide">
            Built for ordinary renters
          </h4>
          <p className="text-[11px] font-semibold text-neutral-510 dark:text-stone-400 leading-relaxed">
            KejaFinder is not only for high-end apartments. It is designed for single rooms, bedsitters, mabati houses, studios, student rooms, low-cost homes, and small estate rentals.
          </p>
        </div>
      </motion.div>

      {/* 4. Trust Balance Note */}
      <motion.div
        variants={itemVariants}
        className="bg-amber-500/[0.03] dark:bg-amber-500/[0.02] border border-amber-500/12 dark:border-amber-900/15 rounded-2.5xl p-4.5 flex items-start space-x-3 shadow-5xs"
      >
        <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 stroke-[2.2] mt-0.5" />
        <p className="text-[10.5px] font-bold text-neutral-700 dark:text-stone-305 leading-relaxed">
          Posting should stay simple, but trust checks, community reports, and listing freshness must protect renters first. <strong className="text-amber-700 dark:text-amber-500 uppercase tracking-tight">Trust before growth.</strong>
        </p>
      </motion.div>

      {/* 5. Target Actions */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-2.5">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSearchAction}
          className="flex-1 h-11 bg-emerald-650 hover:bg-emerald-600 text-white font-black text-[11.5px] uppercase tracking-wider rounded-xl.5 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          aria-label="Find a room"
        >
          <Search className="w-4 h-4 stroke-[2.2]" />
          <span>Find a room</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handlePostAction}
          className="flex-1 h-11 bg-white dark:bg-stone-900 hover:bg-neutral-50 dark:hover:bg-stone-850 text-neutral-800 dark:text-stone-105 border border-neutral-300 dark:border-stone-800 font-black text-[11.5px] uppercase tracking-wider rounded-xl.5 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          aria-label="Post a vacancy"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.2] text-emerald-600 dark:text-emerald-400" />
          <span>Post a vacancy</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
