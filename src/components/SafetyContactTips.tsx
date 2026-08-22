import React from 'react';
import { motion } from 'motion/react';
import { 
  MessageCircle, 
  Receipt, 
  MapPin, 
  UserRound, 
  Eye, 
  Image, 
  Copy, 
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  FileText
} from 'lucide-react';

interface SafetyContactTipsProps {
  onShowFeedback: (msg: string) => void;
  onOpenSampleListing?: () => void;
}

export default function SafetyContactTips({ 
  onShowFeedback,
  onOpenSampleListing
}: SafetyContactTipsProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const handleCopy = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        onShowFeedback('Message copied.');
      }).catch(() => {
        onShowFeedback('Could not copy on this browser.');
      });
    } else {
      onShowFeedback('Could not copy on this browser.');
    }
  };

  const handleReport = () => {
    onShowFeedback('Report flow coming soon.');
  };

  const handleSampleListing = () => {
    if (onOpenSampleListing) {
      onOpenSampleListing();
    } else {
      onShowFeedback('Sample listing coming soon.');
    }
  };

  const questions = [
    {
      title: 'Is the house still available?',
      description: 'Confirm the home is vacant today.',
      icon: MessageCircle
    },
    {
      title: 'What is the total cost?',
      description: 'Ask about rent, deposit, water, electricity, agent fee, and viewing fee.',
      icon: Receipt
    },
    {
      title: 'Where exactly is it?',
      description: 'Ask for estate, landmark, stage, road distance, and plot direction.',
      icon: MapPin
    },
    {
      title: 'Who will show me the house?',
      description: 'Confirm whether it is the caretaker, landlord, or agent.',
      icon: UserRound
    },
    {
      title: 'Can I view it physically first?',
      description: 'Do not continue if they refuse physical viewing.',
      icon: Eye
    },
    {
      title: 'Are the photos current?',
      description: 'Ask if the photos match the actual room.',
      icon: Image
    }
  ];

  const templates = [
    {
      id: 'availability',
      title: 'Availability message',
      text: 'Hi, I saw this listing on KejaFinder. Is it still available?'
    },
    {
      id: 'cost_confirmation',
      title: 'Cost confirmation',
      text: 'Please confirm rent, deposit, water, electricity, and any agent fee before I visit.'
    },
    {
      id: 'direction_request',
      title: 'Direction request',
      text: 'Please send the exact estate, landmark, stage, and directions. I will view the house physically first.'
    }
  ];

  const warnings = [
    'Send deposit now so I reserve it.',
    'Send fare first.',
    'Pay booking fee before viewing.',
    'I cannot show the house physically.',
    'Do not call, just send money.',
    'Share your M-Pesa PIN.',
    'The price is different from the listing.'
  ];

  const callTips = [
    'Write down the contact name and role.',
    'Confirm the listing title and area.',
    'Ask the same cost questions again.',
    'Avoid rushed payment decisions.',
    'Share your visit plan with someone you trust.'
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Section Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center space-x-2 mb-1">
          <MessageCircle className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <h3 className="text-xl font-black text-neutral-850 dark:text-stone-100 tracking-tight">
            Call and WhatsApp safety
          </h3>
        </div>
        <p className="text-[13px] font-semibold text-neutral-600 dark:text-stone-300 mb-1">
          Contact caretakers clearly, confirm details, and avoid suspicious requests.
        </p>
        <p className="text-[12px] font-medium text-neutral-500 dark:text-stone-400">
          Use Call or WhatsApp to confirm availability, costs, and directions before visiting.
        </p>
      </motion.div>

      {/* Safe Contact Checklist */}
      <motion.div variants={itemVariants} className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-neutral-200/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm">
        <h4 className="text-[14px] font-black text-neutral-800 dark:text-stone-200 tracking-tight mb-4 flex items-center">
          <ShieldCheck className="w-4 h-4 mr-2 text-emerald-700 dark:text-emerald-400" />
          Ask these before visiting
        </h4>
        <div className="space-y-3">
          {questions.map((q, idx) => {
            const Icon = q.icon;
            return (
              <div key={idx} className="flex items-start space-x-3 pb-3 border-b border-neutral-100 dark:border-stone-800/60 last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h5 className="text-[13px] font-bold text-neutral-800 dark:text-stone-200 mb-0.5 leading-tight">
                    {q.title}
                  </h5>
                  <p className="text-[12px] font-medium text-neutral-500 dark:text-stone-400 leading-snug">
                    {q.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* WhatsApp Message Templates */}
      <motion.div variants={itemVariants} className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/60 dark:border-emerald-900/20 rounded-3xl p-5 shadow-sm">
        <h4 className="text-[14px] font-black text-emerald-900 dark:text-emerald-100 tracking-tight mb-3 flex items-center">
          <MessageCircle className="w-4 h-4 mr-2 text-emerald-700 dark:text-emerald-400" />
          Safe WhatsApp message examples
        </h4>
        <div className="space-y-3">
          {templates.map((template) => (
            <div key={template.id} className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900/20 shadow-sm relative pr-12">
              <h5 className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
                {template.title}
              </h5>
              <p className="text-[13px] font-medium text-neutral-700 dark:text-stone-300 leading-snug">
                "{template.text}"
              </p>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleCopy(template.text)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-100 dark:bg-stone-800 flex items-center justify-center text-neutral-700 dark:text-stone-400 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                aria-label={`Copy ${template.title.toLowerCase()}`}
              >
                <Copy className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Call Safety Tips */}
      <motion.div variants={itemVariants} className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-neutral-200/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm">
        <h4 className="text-[14px] font-black text-neutral-800 dark:text-stone-200 tracking-tight mb-3 flex items-center">
          <PhoneCall className="w-4 h-4 mr-2 text-emerald-700 dark:text-emerald-400" />
          During a phone call
        </h4>
        <ul className="space-y-2">
          {callTips.map((tip, idx) => (
            <li key={idx} className="flex items-start text-[12px] font-semibold text-neutral-600 dark:text-stone-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 mr-2 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Main Payment Warning Card */}
      <motion.div variants={itemVariants} className="bg-orange-50/90 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/50 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start space-x-3 mb-2">
          <ShieldAlert className="w-6 h-6 text-orange-700 dark:text-orange-400 shrink-0 mt-0.5" />
        </div>
        <div className="pl-9">
          <p className="text-[11px] font-semibold text-neutral-700 dark:text-stone-300 leading-relaxed">
            Call and WhatsApp are for confirming details. Payment should only happen after physical viewing and clear confirmation.
          </p>
        </div>
      </motion.div>

      {/* Quick Action Buttons */}
      <motion.div variants={itemVariants} className="flex flex-col space-y-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSampleListing}
          className="w-full bg-neutral-100 dark:bg-stone-800 text-neutral-700 dark:text-stone-300 border border-neutral-200 dark:border-stone-700 rounded-2xl py-3.5 px-4 font-black uppercase text-[12px] tracking-wider hover:bg-neutral-200 dark:hover:bg-stone-700 transition-colors shadow-sm flex items-center justify-center"
          aria-label="Open sample listing"
        >
          <FileText className="w-4 h-4 mr-2" />
          Open sample listing
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleReport}
          className="w-full text-neutral-600 dark:text-stone-400 py-2 font-black uppercase text-[11px] tracking-wider hover:text-neutral-800 dark:hover:text-stone-200 transition-colors flex items-center justify-center"
          aria-label="Report suspicious contact"
        >
          Report suspicious contact
        </motion.button>
      </motion.div>

    </motion.div>
  );
}
