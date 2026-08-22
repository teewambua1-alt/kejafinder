import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function SupportFAQ() {
  const [openQuestionId, setOpenQuestionId] = useState<string | null>("reports");

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const faqs = [
    {
      id: 'reports',
      question: 'How do I report a fake listing?',
      answer: 'Open the listing and use Report listing. Your report is sent to the KejaFinder team, who review it and can take the listing down.'
    },
    {
      id: 'deposits',
      question: 'Does KejaFinder collect deposits?',
      answer: 'No. KejaFinder has no payment system and never handles rent, deposits, booking fees, viewing fees or agent fees. Anyone asking you to pay through KejaFinder is a scam.'
    },
    {
      id: 'pay_before',
      question: 'What should I do if someone asks for deposit before viewing?',
      answer: 'Do not pay. Treat it as suspicious, stop the conversation, and report the listing.'
    },
    {
      id: 'whatsapp',
      question: 'Can I contact support on WhatsApp?',
      answer: 'Not yet. Email is the way to reach us for now, and a person reads every message.'
    },
    {
      id: 'posting_help',
      question: 'How do landlords get help posting?',
      answer: 'Landlords and caretakers can use the Post Vacancy flow. Full posting support tools will be added later.'
    },
    {
      id: 'already_taken',
      question: 'What if a listing is already taken?',
      answer: 'Report it as already taken so KejaFinder can flag outdated listings later.'
    },
    {
      id: 'wrong_price',
      question: 'What if rent or deposit is different?',
      answer: 'Report it as wrong price and confirm all costs before visiting.'
    },
    {
      id: 'hours',
      question: 'Is support available 24/7?',
      answer: "We do not publish response times yet, so please do not wait on a reply before acting on a safety concern — report the listing."
    }
  ];

  return (
    <motion.div variants={itemVariants} className="w-full space-y-4">
      <div className="px-1 text-center sm:text-left mb-2 flex items-center justify-center sm:justify-start space-x-2">
        <HelpCircle className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
        <div>
          <h3 className="text-[16px] font-black text-neutral-800 dark:text-stone-100 tracking-tight">
            Support FAQ
          </h3>
          <p className="text-[12px] font-semibold text-neutral-500 dark:text-stone-400 mt-0.5">
            Quick answers for common support questions.
          </p>
        </div>
      </div>

      <div className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/60 dark:border-stone-800/60 rounded-2.5xl overflow-hidden shadow-sm divide-y divide-neutral-100 dark:divide-stone-800/50">
        {faqs.map((faq) => {
          const isOpen = openQuestionId === faq.id;
          return (
            <div key={faq.id} className="bg-transparent">
              <button
                type="button"
                onClick={() => setOpenQuestionId(isOpen ? null : faq.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${faq.id}`}
                className="w-full text-left p-4 flex items-center justify-between hover:bg-neutral-50/50 dark:hover:bg-stone-800/30 transition-colors"
              >
                <span className={`text-[12.5px] font-bold pr-4 ${isOpen ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-800 dark:text-stone-200'}`}>
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
                    <div className="p-4 pt-0 text-[11.5px] font-medium text-neutral-600 dark:text-stone-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        
        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 text-center">
          <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">
            Reporting a listing works today. For anything else, email us — and never pay before you have seen the house.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
