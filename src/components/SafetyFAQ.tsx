import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle,
  Search,
  Headset
} from 'lucide-react';

interface SafetyFAQProps {
  onGoSearch?: () => void;
  onShowFeedback: (msg: string) => void;
  onOpenSupport?: () => void;
}

export default function SafetyFAQ({ 
  onGoSearch,
  onShowFeedback,
  onOpenSupport
}: SafetyFAQProps) {
  const [openQuestionId, setOpenQuestionId] = useState<string | null>("deposit");

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
      onShowFeedback('Safer listing search coming soon.');
    }
  };

  const handleContactSupport = () => {
    if (onOpenSupport) {
      onOpenSupport();
    } else {
      onShowFeedback('Support page coming soon.');
    }
  };

  const faqs = [
    {
      id: 'deposit',
      question: 'Does KejaFinder collect deposits?',
      answer: 'No. KejaFinder does not collect rent, deposits, booking fees, viewing fees, or agent fees in this prototype. Always view the house physically and confirm the caretaker or landlord before paying anyone.'
    },
    {
      id: 'pay_before',
      question: 'What should I do if someone asks me to pay before viewing?',
      answer: 'Treat it as suspicious. Do not send deposit, fare, booking fee, or your M-Pesa PIN. Stop the conversation and report the listing.'
    },
    {
      id: 'badges',
      question: 'What do verification badges mean?',
      answer: 'Badges such as Phone Verified, Location Checked, Scout Verified, Trusted Landlord, and Recently Updated are trust signals. They help, but they do not guarantee payment safety. You should still confirm details physically.'
    },
    {
      id: 'whatsapp',
      question: 'Can I trust WhatsApp messages or screenshots?',
      answer: 'Use WhatsApp to confirm availability, rent, deposit, directions, and contact role. Do not trust screenshots alone, and do not pay before viewing.'
    },
    {
      id: 'agents',
      question: 'Are agent fees allowed?',
      answer: 'Agent fees must be clear before you visit. Avoid agents who hide fees, change prices, or pressure you to pay quickly.'
    },
    {
      id: 'visit',
      question: 'What should I check when I visit?',
      answer: 'Check the room, toilet, bathroom, water, electricity, security, distance from the road or stage, rent, deposit, and any extra fees.'
    },
    {
      id: 'report',
      question: 'How do I report a listing?',
      answer: 'Use Report Listing when a house is already taken, fake, wrongly priced, in the wrong location, using wrong photos, unsafe, duplicated, or asking for suspicious payments. Report submission is prototype-only for now.'
    },
    {
      id: 'recent',
      question: 'What does ‘Recently Updated’ mean?',
      answer: 'It means the listing was confirmed recently. This helps reduce outdated listings, but you should still ask if the house is available today.'
    },
    {
      id: 'alone',
      question: 'Should I go alone to view a house?',
      answer: 'When possible, visit during the day and go with someone. Tell someone where you are going and confirm the location before travelling.'
    },
    {
      id: 'guarantee',
      question: 'Does KejaFinder guarantee that every house is safe?',
      answer: 'No. KejaFinder provides listing details, trust signals, and safety guidance, but users must still confirm the house physically and use caution before paying.'
    }
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Section Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center space-x-2 mb-1">
          <HelpCircle className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <h3 className="text-xl font-black text-neutral-850 dark:text-stone-100 tracking-tight">
            Safety FAQ
          </h3>
        </div>
        <p className="text-[13px] font-semibold text-neutral-600 dark:text-stone-300 mb-1">
          Quick answers to common safety questions before you contact or visit a house.
        </p>
        <p className="text-[12px] font-medium text-neutral-500 dark:text-stone-400">
          KejaFinder helps you find vacancies, but you should always confirm details physically.
        </p>
      </motion.div>

      {/* FAQ Accordion */}
      <motion.div variants={itemVariants} className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-neutral-200/60 dark:border-stone-800/60 rounded-3xl overflow-hidden shadow-sm">
        <div className="divide-y divide-neutral-100 dark:divide-stone-800/60">
          {faqs.map((faq) => {
            const isOpen = openQuestionId === faq.id;
            
            return (
              <div key={faq.id} className="bg-transparent">
                <button
                  onClick={() => setOpenQuestionId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full text-left p-4 flex items-center justify-between hover:bg-neutral-50/50 dark:hover:bg-stone-800/30 transition-colors"
                >
                  <span className={`text-[13px] font-bold pr-4 ${isOpen ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-800 dark:text-stone-200'}`}>
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-700 dark:text-emerald-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-550 dark:text-stone-400 shrink-0" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 text-[12px] font-medium text-neutral-600 dark:text-stone-400 leading-relaxed border-t border-neutral-100/50 dark:border-stone-800/30">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Main Safety Reminder */}
      <motion.div variants={itemVariants} className="bg-orange-50/90 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/50 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start space-x-3 mb-2">
          <AlertTriangle className="w-6 h-6 text-orange-700 dark:text-orange-400 shrink-0 mt-0.5" />
          <h4 className="text-[14px] font-black text-orange-800 dark:text-orange-300 leading-snug tracking-tight">
            Never send deposit before physically viewing the house and confirming the caretaker or landlord.
          </h4>
        </div>
        <div className="pl-9">
          <p className="text-[11px] font-semibold text-neutral-700 dark:text-stone-300 leading-relaxed">
            Use the Safety Page as a checklist before contacting, visiting, or paying anyone.
          </p>
        </div>
      </motion.div>

      {/* Support CTA Card */}
      <motion.div variants={itemVariants} className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/60 dark:border-emerald-900/20 rounded-2xl p-5 shadow-sm text-center">
        <h4 className="text-[14px] font-black text-emerald-900 dark:text-emerald-100 tracking-tight mb-2">
          Still unsure?
        </h4>
        <p className="text-[12px] font-semibold text-emerald-800/80 dark:text-emerald-300/80 mb-4 px-2">
          If something feels wrong, pause before paying and report the listing.
        </p>
        
        <div className="flex justify-center space-x-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSearch}
            className="flex-1 bg-emerald-700 dark:bg-emerald-700 text-white rounded-2xl py-3 px-3 font-black uppercase text-[11px] tracking-wider shadow-sm hover:shadow-md transition-all flex items-center justify-center"
            aria-label="Browse safer listings"
          >
            <Search className="w-4 h-4 mr-1.5" />
            Safer listings
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleContactSupport}
            className="flex-1 bg-white dark:bg-stone-800 text-neutral-700 dark:text-stone-300 border border-neutral-200 dark:border-stone-700 rounded-2xl py-3 px-3 font-black uppercase text-[11px] tracking-wider shadow-sm hover:shadow-md hover:bg-neutral-50 dark:hover:bg-stone-700 transition-all flex items-center justify-center"
            aria-label="Contact support"
          >
            <Headset className="w-4 h-4 mr-1.5" />
            Support
          </motion.button>
        </div>
      </motion.div>
      
    </motion.div>
  );
}
