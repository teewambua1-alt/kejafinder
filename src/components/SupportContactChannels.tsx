import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Mail, AlertTriangle, Smartphone, Copy, ExternalLink, CheckCircle2 } from 'lucide-react';

interface SupportContactChannelsProps {
  onShowFeedback: (msg: string) => void;
}

export default function SupportContactChannels({ onShowFeedback }: SupportContactChannelsProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const channels = [
    {
      id: 'in-app',
      title: 'In-app support',
      desc: 'Submit listing issues, account questions, and bug reports.',
      status: 'Coming later',
      icon: Smartphone,
      statusColor: 'bg-neutral-100 text-neutral-600 dark:bg-stone-800 dark:text-stone-300'
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp support',
      desc: 'Replies are handled by a person, so allow some time.',
      status: 'Planned',
      icon: MessageSquare,
      statusColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
    },
    {
      id: 'email',
      title: 'Email support',
      desc: 'Best for longer issues, verification requests, or documentation later.',
      status: 'Planned',
      icon: Mail,
      statusColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
    },
    {
      id: 'safety',
      title: 'Safety reports',
      desc: 'Use report actions to flag fake, wrong, unsafe, or outdated listings.',
      status: 'Prototype-only',
      icon: AlertTriangle,
      statusColor: 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400'
    }
  ];

  const expectations = [
    "Urgent scam reports should be prioritized.",
    "Listing corrections should be reviewed.",
    "Fake or outdated listings should be flagged.",
    "Support should not ask for your M-Pesa PIN.",
    "KejaFinder has no payment system and never handles rent or deposits."
  ];

  return (
    <motion.div variants={itemVariants} className="w-full space-y-6">
      <div className="px-1 text-center sm:text-left mb-2">
        <h3 className="text-[16px] font-black text-neutral-800 dark:text-stone-100 tracking-tight">
          Contact channels
        </h3>
        <p className="text-[12px] font-semibold text-neutral-500 dark:text-stone-400 mt-1 max-w-[280px] mx-auto sm:mx-0">
          Real contact channels will be added later. For now, this page shows the planned support structure.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {channels.map((channel) => {
          const Icon = channel.icon;
          return (
            <div key={channel.id} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/60 dark:border-stone-800/60 rounded-2xl p-4 shadow-sm flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-neutral-50 dark:bg-stone-800/50 flex items-center justify-center border border-neutral-100 dark:border-stone-700/50">
                    <Icon className="w-4 h-4 text-neutral-700 dark:text-stone-300 stroke-[2.2]" />
                  </div>
                  <h4 className="text-[12.5px] font-black text-neutral-800 dark:text-stone-200">
                    {channel.title}
                  </h4>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider ${channel.statusColor}`}>
                  {channel.status}
                </span>
              </div>
              <p className="text-[11px] font-medium text-neutral-500 dark:text-stone-400 leading-snug">
                {channel.desc}
              </p>
            </div>
          )
        })}
      </div>

      {/* Response Expectation Card */}
      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/30 rounded-2.5xl p-5 shadow-sm space-y-4">
        <h4 className="text-[13px] font-black text-emerald-900 dark:text-emerald-100 uppercase tracking-tight">
          What to expect later
        </h4>
        <ul className="space-y-2.5">
          {expectations.map((text, i) => (
            <li key={i} className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-500 shrink-0 mt-0.5 stroke-[2.5]" />
              <span className="text-[11.5px] font-bold text-emerald-800 dark:text-emerald-200 leading-snug">
                {text}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-2 pt-2 mt-4 border-t border-emerald-200/50 dark:border-emerald-800/50 pt-4">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onShowFeedback("Support email copying will be added later.")}
            className="flex-1 flex items-center justify-center space-x-2 bg-white dark:bg-stone-800 text-neutral-700 dark:text-stone-300 border border-neutral-300 dark:border-stone-700 py-2.5 rounded-xl text-[11px] font-bold uppercase shadow-sm transition-colors hover:bg-neutral-50 dark:hover:bg-stone-700"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy support email</span>
          </motion.button>
          
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onShowFeedback("WhatsApp support isn't open yet — use the email address above.")}
            className="flex-1 flex items-center justify-center space-x-2 bg-[#25D366]/10 text-[#128C7E] dark:text-[#25D366] border border-[#25D366]/30 py-2.5 rounded-xl text-[11px] font-bold uppercase shadow-sm transition-colors hover:bg-[#25D366]/20"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open WhatsApp support</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
