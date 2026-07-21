import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  LifeBuoy, 
  Flag,
  MessageSquare,
  ShieldAlert,
  Headphones
} from 'lucide-react';

interface ProfileSafetySupportProps {
  onOpenSafety?: () => void;
  onOpenSupport?: () => void;
}

export default function ProfileSafetySupport({ onOpenSafety, onOpenSupport }: ProfileSafetySupportProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const supportShortcuts = [
    {
      id: "report-listing",
      title: "Report Listing",
      description: "Flag suspicious or outdated homes",
      icon: Flag,
      isDanger: true,
      feedback: "Report listing flow coming soon."
    },
    {
      id: "contact-support",
      title: "Contact Support",
      description: "Get help from KejaFinder",
      icon: Headphones,
      isDanger: false,
      feedback: "Support center coming soon.",
      action: onOpenSupport
    },
    {
      id: "safety-tips",
      title: "Safety Tips",
      description: "Learn how to avoid scams",
      icon: ShieldCheck,
      isDanger: false,
      feedback: "Safety tips page coming soon.",
      action: onOpenSafety
    },
    {
      id: "whatsapp-help",
      title: "WhatsApp Help",
      description: "Support chat coming soon",
      icon: MessageSquare,
      isDanger: false,
      feedback: "WhatsApp support will be added later."
    }
  ];

  const checklistItems = [
    "Confirm the home is still available",
    "Ask for exact directions",
    "Go with someone if possible",
    "Confirm caretaker or landlord identity",
    "Do not pay deposit before viewing"
  ];

  return (
    <div className="w-full space-y-4" id="profile-safety-support-section">
      {/* Title & Subtitle block */}
      <div className="px-1 space-y-0.5">
        <h3 className="text-xs font-black text-neutral-800 dark:text-stone-255 uppercase tracking-wider">
          Safety & Support
        </h3>
        <p className="text-[10px] font-semibold text-neutral-450 dark:text-stone-500 leading-relaxed">
          Stay safe while searching and get help when you need it.
        </p>
      </div>

      {/* 2. Main Prominent Safety Warning Card */}
      <div className="bg-orange-500/[0.03] dark:bg-orange-500/[0.04] border border-orange-500/15 dark:border-orange-500/25 rounded-3xl p-4.5 shadow-3xs flex items-start space-x-3.5">
        {/* Warm Orange Icon circle indicator container */}
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 dark:border-orange-500/30 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5.5 h-5.5 text-orange-600 dark:text-orange-400 stroke-[2.2]" />
        </div>
        
        <div className="space-y-1">
          <h4 className="text-[11px] font-black text-orange-850 dark:text-orange-400 uppercase tracking-wider">
            Crucial Deposit Warning
          </h4>
          <p className="text-[11.5px] font-extrabold text-neutral-800 dark:text-stone-200 leading-snug tracking-tight">
            Never send deposit before physically viewing the house and confirming the caretaker or landlord.
          </p>
        </div>
      </div>

      {/* 3. Before-you-visit Checklist card */}
      <div className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-3xl p-4.5 shadow-3xs space-y-3">
        <h4 className="text-[11px] font-black text-neutral-800 dark:text-stone-100 uppercase tracking-wider">
          Before you visit
        </h4>

        <ul className="space-y-2" aria-label="Before you visit checklist">
          {checklistItems.map((item, id) => (
            <li key={id} className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-450 shrink-0 mt-0.5 stroke-[2.2]" />
              <span className="text-[11px] font-bold text-neutral-650 dark:text-stone-300 leading-tight">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. Support Shortcuts 2-Column Grid of buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        {supportShortcuts.map((shortcut) => {
          const IconComponent = shortcut.icon;
          return (
            <motion.button
              key={shortcut.id}
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -2 }}
              onClick={() => {
                if (shortcut.action) {
                  shortcut.action();
                } else {
                  showToast(shortcut.feedback);
                }
              }}
              className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 p-3.5 rounded-2.5xl shadow-3xs flex flex-col justify-between items-start text-left min-h-[105px] hover:bg-neutral-50/50 dark:hover:bg-stone-850/25 transition-all cursor-pointer outline-none select-none max-w-full overflow-hidden"
              aria-label={shortcut.title}
            >
              {/* Top circle containing icon representation */}
              <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 border mb-2 ${
                shortcut.isDanger 
                  ? 'bg-orange-50 dark:bg-orange-950/15 border-orange-100 dark:border-orange-950/20' 
                  : 'bg-emerald-50 dark:bg-emerald-950/15 border-emerald-100 dark:border-emerald-950/20'
              }`}>
                <IconComponent className={`w-4 h-4 stroke-[2.2] ${
                  shortcut.isDanger ? 'text-orange-550 dark:text-orange-400' : 'text-emerald-555 dark:text-emerald-450'
                }`} />
              </div>

              {/* Text label content inside card */}
              <div className="space-y-0.5 w-full">
                <span className={`block text-[11px] font-black uppercase tracking-tight truncate ${
                  shortcut.isDanger ? 'text-orange-600 dark:text-orange-400' : 'text-neutral-800 dark:text-stone-150'
                }`}>
                  {shortcut.title}
                </span>
                <span className="block text-[9.5px] font-semibold text-neutral-450 dark:text-stone-500 leading-tight line-clamp-1 w-full">
                  {shortcut.description}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* 5. Optional Emergency Warning Subnote card */}
      <div className="bg-emerald-500/[0.02] dark:bg-emerald-950/[0.03] border border-emerald-500/15 dark:border-emerald-900/20 rounded-2xl p-3.5 flex items-start space-x-2.5 shadow-3xs">
        <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.2]" />
        <p className="text-[9.5px] font-semibold text-neutral-500 dark:text-stone-400 leading-normal">
          <strong className="text-emerald-700 dark:text-emerald-400">KejaFinder does not collect deposits.</strong> Always confirm the house physically and run identity checks in person before paying anyone.
        </p>
      </div>

      {/* Internal interactive local feedback notification toast */}
      <AnimatePresence>
        {toastMessage && (
          <div className="fixed inset-x-0 bottom-24 z-50 flex items-center justify-center pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 text-white font-extrabold text-[10.5px] uppercase tracking-wider px-4 py-2 rounded-xl shadow-lg flex items-center space-x-2 pointer-events-auto"
            >
              <AlertCircle className="w-4 h-4 text-emerald-450 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
