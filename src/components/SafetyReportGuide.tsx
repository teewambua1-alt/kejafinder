import React from 'react';
import { motion } from 'motion/react';
import { 
  Flag, 
  Home, 
  AlertTriangle, 
  Receipt, 
  MapPinOff, 
  ShieldAlert, 
  ImageOff, 
  Copy,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';

interface SafetyReportGuideProps {
  onShowFeedback: (msg: string) => void;
}

export default function SafetyReportGuide({ onShowFeedback }: SafetyReportGuideProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const handleReport = () => {
    onShowFeedback('Open a listing and use Report listing to send it to our team.');
  };

  const reportReasons = [
    {
      id: 'already_taken',
      title: 'House already taken',
      description: 'The room has already been rented but still appears available.',
      icon: Home,
      color: 'emerald'
    },
    {
      id: 'fake_listing',
      title: 'Fake listing',
      description: 'The house may not exist or the poster is misleading renters.',
      icon: AlertTriangle,
      color: 'orange'
    },
    {
      id: 'wrong_price',
      title: 'Wrong price',
      description: 'The rent, deposit, water, electricity, or fee is different from the listing.',
      icon: Receipt,
      color: 'emerald'
    },
    {
      id: 'wrong_location',
      title: 'Wrong location',
      description: 'The estate, landmark, stage, or road distance is incorrect.',
      icon: MapPinOff,
      color: 'emerald'
    },
    {
      id: 'scam_request',
      title: 'Scam request',
      description: 'Someone asks for deposit, fare, booking fee, or M-Pesa PIN before viewing.',
      icon: ShieldAlert,
      color: 'orange'
    },
    {
      id: 'wrong_photos',
      title: 'Wrong photos',
      description: 'The photos do not match the actual house.',
      icon: ImageOff,
      color: 'emerald'
    },
    {
      id: 'unsafe_property',
      title: 'Unsafe property',
      description: 'The property feels unsafe or the viewing request feels suspicious.',
      icon: ShieldAlert,
      color: 'orange'
    },
    {
      id: 'duplicate_listing',
      title: 'Duplicate listing',
      description: 'The same house appears more than once with confusing details.',
      icon: Copy,
      color: 'emerald'
    }
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Section Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center space-x-2 mb-1">
          <Flag className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <h3 className="text-xl font-black text-neutral-850 dark:text-stone-100 tracking-tight">
            Report suspicious listings
          </h3>
        </div>
        <p className="text-[13px] font-semibold text-neutral-600 dark:text-stone-300 mb-1">
          Help keep KejaFinder fresh, accurate, and safe for other renters.
        </p>
        <p className="text-[12px] font-medium text-neutral-500 dark:text-stone-400">
          If something looks wrong, report it before another renter wastes fare, time, or money.
        </p>
      </motion.div>

      {/* Report Reasons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {reportReasons.map((reason) => {
          const Icon = reason.icon;
          const isOrange = reason.color === 'orange';
          return (
            <motion.div 
              key={reason.id}
              variants={itemVariants} 
              className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-neutral-200/60 dark:border-stone-800/60 rounded-2xl p-4 shadow-sm flex items-start space-x-3"
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                isOrange 
                  ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' 
                  : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-[13px] font-black text-neutral-800 dark:text-stone-200 tracking-tight mb-0.5">
                  {reason.title}
                </h4>
                <p className="text-[11px] font-medium text-neutral-600 dark:text-stone-400 leading-snug">
                  {reason.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* What happens after reporting */}
      <motion.div variants={itemVariants} className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/60 dark:border-emerald-900/20 rounded-2xl p-4 shadow-sm">
        <h4 className="text-[13px] font-black text-emerald-800 dark:text-emerald-300 tracking-tight leading-tight mb-3 flex items-center">
          <Info className="w-4 h-4 mr-2" />
          What happens after you report?
        </h4>
        <ol className="space-y-2">
          {['KejaFinder records the report.', 'Repeated reports can flag a listing for review.', 'Outdated or suspicious listings can be hidden later.', 'Admins will review reports in the real MVP.'].map((step, idx) => (
            <li key={idx} className="flex items-start text-[12px] font-medium text-emerald-900 dark:text-emerald-100">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 mr-2 shrink-0">{idx + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </motion.div>

      {/* Good report details */}
      <motion.div variants={itemVariants} className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-neutral-200/60 dark:border-stone-800/60 rounded-2xl p-4 shadow-sm">
        <h4 className="text-[13px] font-black text-neutral-800 dark:text-stone-200 tracking-tight leading-tight mb-3">
          Good report details
        </h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          {['What was wrong?', 'Who contacted you?', 'Was the price different?', 'Was the house already taken?', 'Did they ask for money before viewing?', 'Did the location or photos look wrong?'].map((tip, idx) => (
            <li key={idx} className="flex items-start text-[11px] font-semibold text-neutral-600 dark:text-stone-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-neutral-550 dark:text-stone-400 mr-2 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        <p className="text-[11px] font-bold text-neutral-500 dark:text-stone-400 border-t border-neutral-100 dark:border-stone-800 pt-2">
          Helper: Clear reports help KejaFinder review listings faster later.
        </p>
      </motion.div>


      {/* Quick Action Button */}
      <motion.div variants={itemVariants}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleReport}
          className="w-full bg-neutral-100 dark:bg-stone-800 text-neutral-700 dark:text-stone-300 border border-neutral-200 dark:border-stone-700 rounded-2xl py-3.5 px-4 font-black uppercase text-[12px] tracking-wider hover:bg-neutral-200 dark:hover:bg-stone-700 transition-colors shadow-sm flex justify-center items-center"
          aria-label="Report a listing"
        >
          <Flag className="w-4 h-4 mr-2" />
          Report a listing
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
