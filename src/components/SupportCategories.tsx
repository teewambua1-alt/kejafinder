import React from 'react';
import { motion } from 'motion/react';
import { Home, UserCheck, Settings2, ShieldAlert, BadgeCheck, Lightbulb, ChevronRight } from 'lucide-react';

interface SupportCategoriesProps {
  onShowFeedback: (msg: string) => void;
}

export default function SupportCategories({ onShowFeedback }: SupportCategoriesProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const categories = [
    {
      id: 'tenants',
      title: 'Tenant support',
      icon: Home,
      items: ["Finding homes", "Saved listings", "Contacting caretakers", "Reporting suspicious listings", "Understanding rent and deposit"]
    },
    {
      id: 'landlords',
      title: 'Posting support',
      icon: BadgeCheck,
      items: ["Posting a vacancy", "Updating availability", "Adding photos", "Changing rent or deposit", "Marking a house as taken"]
    },
    {
      id: 'agents',
      title: 'Agent support',
      icon: UserCheck,
      items: ["Showing clear fees", "Avoiding misleading listings", "Responding to reports", "Building trust"]
    },
    {
      id: 'scouts',
      title: 'Scout support',
      icon: Settings2,
      items: ["Checking listings", "Adding landmarks", "Confirming availability", "Reducing fake listings"]
    },
    {
      id: 'safety',
      title: 'Safety support',
      icon: ShieldAlert,
      items: ["Deposit-before-viewing warnings", "Scam requests", "Wrong location", "Unsafe viewing request", "M-Pesa PIN safety"]
    },
    {
      id: 'feedback',
      title: 'Product feedback',
      icon: Lightbulb,
      items: ["Suggest areas", "Report bugs", "Request features", "Improve search filters"]
    }
  ];

  return (
    <motion.div variants={itemVariants} className="w-full space-y-4">
      <div className="px-1 text-center sm:text-left mb-2">
        <h3 className="text-[16px] font-black text-neutral-800 dark:text-stone-100 tracking-tight">
          What you can get help with
        </h3>
        <p className="text-[12px] font-semibold text-neutral-500 dark:text-stone-400 mt-1">
          Choose the issue that matches your situation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/60 dark:border-stone-800/60 rounded-2.5xl p-4.5 shadow-sm space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8.5 h-8.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/30">
                  <Icon className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
                </div>
                <h4 className="text-[13px] font-black text-neutral-800 dark:text-stone-200 tracking-tight">
                  {cat.title}
                </h4>
              </div>

              <ul className="space-y-2.5">
                {cat.items.map((item, id) => (
                  <li key={id} className="flex items-start space-x-2">
                    <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-stone-600 mt-1.5 shrink-0" />
                    <span className="text-[11.5px] font-medium text-neutral-600 dark:text-stone-400 leading-tight">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onShowFeedback(`${cat.title} selected locally.`)}
                className="w-full flex items-center justify-center space-x-1.5 h-10 mt-2 bg-neutral-50 dark:bg-stone-800/50 hover:bg-neutral-100 dark:hover:bg-stone-800 text-neutral-700 dark:text-stone-300 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>Select</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  );
}
