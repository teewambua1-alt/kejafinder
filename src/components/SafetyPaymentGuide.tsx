import React from 'react';
import { motion } from 'motion/react';
import { 
  Receipt, 
  Wallet, 
  Droplets, 
  Zap, 
  BriefcaseBusiness, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Lock,
  Search,
  Flag,
  ShieldCheck
} from 'lucide-react';

interface SafetyPaymentGuideProps {
  onGoSearch?: () => void;
  onShowFeedback: (msg: string) => void;
}

export default function SafetyPaymentGuide({
  onGoSearch,
  onShowFeedback
}: SafetyPaymentGuideProps) {
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
      onShowFeedback('Clear-fee search coming soon.');
    }
  };

  const handleReport = () => {
    onShowFeedback('Report flow coming soon.');
  };

  const costsToConfirm = [
    {
      title: 'Monthly rent',
      description: 'Confirm the exact rent shown on the listing.',
      icon: Receipt,
      color: 'emerald'
    },
    {
      title: 'Deposit',
      description: 'Confirm whether deposit equals one month rent or a different amount.',
      icon: Wallet,
      color: 'emerald'
    },
    {
      title: 'Water charges',
      description: 'Ask whether water is included, fixed monthly, or paid separately.',
      icon: Droplets,
      color: 'blue'
    },
    {
      title: 'Electricity',
      description: 'Ask whether electricity is token meter, shared meter, or included.',
      icon: Zap,
      color: 'amber'
    },
    {
      title: 'Agent fee',
      description: 'Ask if there is an agent fee and how much it is.',
      icon: BriefcaseBusiness,
      color: 'orange'
    },
    {
      title: 'Viewing fee',
      description: 'Be careful with viewing fees before you physically see the house.',
      icon: Eye,
      color: 'rose'
    }
  ];

  const saferItems = [
    'Confirm all costs before visiting.',
    'View the house physically first.',
    'Confirm the caretaker or landlord.',
    'Keep M-Pesa messages and receipts.',
    'Ask for written confirmation after paying.'
  ];

  const riskyItems = [
    'Paying deposit before viewing.',
    'Sending fare to unknown people.',
    'Paying booking fee under pressure.',
    'Sharing your M-Pesa PIN.',
    'Trusting screenshots alone.'
  ];

  const agentChecks = [
    'Is the agent fee shown?',
    'Is the fee amount clear?',
    'Is the agent role clear?',
    'Does the listing show rent and deposit separately?',
    'Are there extra water or electricity charges?'
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Section Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center space-x-2 mb-1">
          <ShieldAlert className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <h3 className="text-xl font-black text-neutral-850 dark:text-stone-100 tracking-tight">
            Agent fees and payment safety
          </h3>
        </div>
        <p className="text-[13px] font-semibold text-neutral-600 dark:text-stone-300 mb-1">
          Know the costs before you visit, and never pay under pressure.
        </p>
        <p className="text-[12px] font-medium text-neutral-500 dark:text-stone-400">
          Rent, deposit, water, electricity, and agent fees should be clear before you travel.
        </p>
      </motion.div>

      {/* Cost Clarity Card */}
      <motion.div variants={itemVariants} className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-neutral-200/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm">
        <h4 className="text-[14px] font-black text-neutral-800 dark:text-stone-200 tracking-tight mb-4">
          Costs to confirm first
        </h4>
        <div className="space-y-3">
          {costsToConfirm.map((cost, idx) => {
            const Icon = cost.icon;
            return (
              <div key={idx} className="flex items-start space-x-3 pb-3 border-b border-neutral-100 dark:border-stone-800/60 last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-stone-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-neutral-500 dark:text-stone-400" />
                </div>
                <div className="flex-1">
                  <h5 className="text-[13px] font-bold text-neutral-800 dark:text-stone-200 mb-0.5 leading-tight">
                    {cost.title}
                  </h5>
                  <p className="text-[12px] font-medium text-neutral-500 dark:text-stone-400 leading-snug">
                    {cost.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Safe vs Risky Behavior */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Safer block */}
        <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/60 dark:border-emerald-900/20 rounded-2xl p-4 shadow-sm">
          <h4 className="text-[13px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-3 flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Safer behavior
          </h4>
          <ul className="space-y-2.5">
            {saferItems.map((item, idx) => (
              <li key={idx} className="flex items-start text-[12px] font-semibold text-emerald-900/80 dark:text-emerald-100/80 leading-snug">
                <span className="text-emerald-700 mr-2 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risky block */}
        <div className="bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100/60 dark:border-orange-900/30 rounded-2xl p-4 shadow-sm">
          <h4 className="text-[13px] font-black text-orange-800 dark:text-orange-300 uppercase tracking-wider mb-3 flex items-center">
            <XCircle className="w-4 h-4 mr-2" />
            Risky behavior
          </h4>
          <ul className="space-y-2.5">
            {riskyItems.map((item, idx) => (
              <li key={idx} className="flex items-start text-[12px] font-semibold text-orange-900/80 dark:text-orange-200/80 leading-snug">
                <span className="text-orange-700 dark:text-orange-400 mr-2 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Main Payment Warning Card */}
      <motion.div variants={itemVariants} className="bg-orange-50/90 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/50 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start space-x-3 mb-2">
          <AlertTriangle className="w-6 h-6 text-orange-700 dark:text-orange-400 shrink-0 mt-0.5" />
          <h4 className="text-[14px] font-black text-orange-800 dark:text-orange-300 leading-snug tracking-tight">
            Never send deposit before physically viewing the house and confirming the caretaker or landlord.
          </h4>
        </div>
        <div className="pl-9">
          <p className="text-[12px] font-semibold text-neutral-700 dark:text-stone-300 leading-relaxed">
            KejaFinder does not collect rent, deposits, booking fees, viewing fees, or agent fees in this prototype.
          </p>
        </div>
      </motion.div>

      {/* Agent Fee Transparency Card */}
      <motion.div variants={itemVariants} className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-neutral-200/60 dark:border-stone-800/60 rounded-2xl p-5 shadow-sm">
        <h4 className="text-[14px] font-black text-neutral-800 dark:text-stone-200 tracking-tight mb-2 flex items-center">
          <BriefcaseBusiness className="w-4 h-4 mr-2 text-neutral-500" />
          Agent fees should be clear
        </h4>
        <p className="text-[12px] font-medium text-neutral-600 dark:text-stone-400 leading-relaxed mb-4">
          If an agent is involved, the listing should clearly show the fee before you visit. Avoid agents who hide fees, change prices, or pressure you to pay quickly.
        </p>
        <ul className="grid grid-cols-1 gap-2">
          {agentChecks.map((check, idx) => (
            <li key={idx} className="flex items-start text-[11px] font-semibold text-neutral-600 dark:text-stone-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 mr-2 shrink-0 mt-0.5" />
              <span>{check}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* M-Pesa Safety Note */}
      <motion.div variants={itemVariants} className="bg-neutral-50 dark:bg-stone-950 border border-neutral-200/50 dark:border-stone-800/50 rounded-2xl p-4 shadow-sm flex items-start space-x-3">
        <Lock className="w-5 h-5 text-neutral-500 dark:text-stone-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[13px] font-black text-neutral-800 dark:text-stone-200 tracking-tight mb-1">
            M-Pesa safety
          </h4>
          <p className="text-[11px] font-medium text-neutral-600 dark:text-stone-400 leading-snug mb-2">
            Never share your M-Pesa PIN. Keep transaction messages, receipts, and contact details if you pay after viewing.
          </p>
          <p className="text-[11px] font-bold text-orange-700 dark:text-orange-400 leading-snug bg-orange-50/50 dark:bg-orange-900/10 inline-block px-2 py-1 rounded-md">
            KejaFinder will never ask for your M-Pesa PIN.
          </p>
        </div>
      </motion.div>

      {/* Quick Action Buttons */}
      <motion.div variants={itemVariants} className="flex flex-col space-y-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSearch}
          className="w-full bg-emerald-700 dark:bg-emerald-700 text-white rounded-2xl py-3.5 px-4 font-black uppercase text-[12px] tracking-wider shadow-md hover:shadow-lg transition-all flex justify-center items-center"
          aria-label="View homes with clear fees"
        >
          <Search className="w-4 h-4 mr-2" />
          View homes with clear fees
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleReport}
          className="w-full bg-neutral-100 dark:bg-stone-800 text-neutral-700 dark:text-stone-300 border border-neutral-200 dark:border-stone-700 rounded-2xl py-3.5 px-4 font-black uppercase text-[12px] tracking-wider hover:bg-neutral-200 dark:hover:bg-stone-700 transition-colors shadow-sm flex justify-center items-center"
          aria-label="Report hidden fees"
        >
          <Flag className="w-4 h-4 mr-2" />
          Report hidden fees
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
