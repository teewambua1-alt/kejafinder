import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SupportIssueFormMockupProps {
  onShowFeedback: (msg: string) => void;
}

export default function SupportIssueFormMockup({ onShowFeedback }: SupportIssueFormMockupProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const [issueType, setIssueType] = useState<string>('');
  const [userType, setUserType] = useState<string>('');
  const [reference, setReference] = useState('');
  const [message, setMessage] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const issueOptions = [
    "House already taken", "Fake listing", "Wrong price", "Wrong location", 
    "Wrong photos", "Scam request", "Unsafe property", "Hidden agent fees", 
    "App bug", "Other"
  ];

  const userOptions = ["Tenant", "Landlord", "Caretaker", "Agent", "Area scout", "Other"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueType) {
      setErrorMsg("Choose an issue type and add a short detail.");
      return;
    }
    if (!message.trim() && !reference.trim()) {
      setErrorMsg("Choose an issue type and add a short detail.");
      return;
    }

    setErrorMsg(null);
    onShowFeedback("Support issue submitted locally. Real support tools will be added later.");
    
    // Optional reset
    setIssueType('');
    setUserType('');
    setReference('');
    setMessage('');
    setContactInfo('');
  };

  return (
    <motion.div variants={itemVariants} className="w-full space-y-4">
      <div className="px-1 text-center sm:text-left mb-2">
        <h3 className="text-[16px] font-black text-neutral-800 dark:text-stone-100 tracking-tight">
          Report an issue
        </h3>
        <p className="text-[12px] font-semibold text-neutral-500 dark:text-stone-400 mt-1">
          Tell us what looks wrong. This is prototype-only for now.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/60 dark:border-stone-800/60 rounded-2.5xl p-5 shadow-sm space-y-5">
        
        {/* Issue Type */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-neutral-700 dark:text-stone-300">
            Issue type <span className="text-orange-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {issueOptions.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setIssueType(opt)}
                className={`py-1.5 px-3 rounded-full text-[11px] font-bold transition-colors border ${
                  issueType === opt 
                    ? 'bg-emerald-600 text-white border-emerald-600' 
                    : 'bg-neutral-50 dark:bg-stone-800/50 text-neutral-600 dark:text-stone-400 border-neutral-200 dark:border-stone-700 hover:bg-neutral-100 dark:hover:bg-stone-700'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* User Type */}
        <div className="space-y-2.5 pt-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-neutral-700 dark:text-stone-300">
            I am a...
          </label>
          <div className="flex flex-wrap gap-2">
            {userOptions.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setUserType(opt)}
                className={`py-1.5 px-3 rounded-full text-[11px] font-bold transition-colors border ${
                  userType === opt 
                    ? 'bg-neutral-800 dark:bg-stone-200 text-white dark:text-stone-900 border-neutral-800 dark:border-stone-200' 
                    : 'bg-neutral-50 dark:bg-stone-800/50 text-neutral-600 dark:text-stone-400 border-neutral-200 dark:border-stone-700 hover:bg-neutral-100 dark:hover:bg-stone-700'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Reference */}
        <div className="space-y-2 pt-2">
          <label htmlFor="reference" className="text-[11px] font-black uppercase tracking-wider text-neutral-700 dark:text-stone-300">
            Listing reference
          </label>
          <input
            id="reference"
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Listing title, area, or contact number"
            className="w-full bg-neutral-50 dark:bg-stone-800/50 border border-neutral-200 dark:border-stone-700 rounded-xl px-4 py-3 text-[13px] font-medium text-neutral-800 dark:text-stone-200 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label htmlFor="message" className="text-[11px] font-black uppercase tracking-wider text-neutral-700 dark:text-stone-300">
            More details
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe what happened..."
            rows={3}
            className="w-full bg-neutral-50 dark:bg-stone-800/50 border border-neutral-200 dark:border-stone-700 rounded-xl px-4 py-3 text-[13px] font-medium text-neutral-800 dark:text-stone-200 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all resize-none"
          />
        </div>

        {/* Contact */}
        <div className="space-y-2">
          <label htmlFor="contact" className="text-[11px] font-black uppercase tracking-wider text-neutral-700 dark:text-stone-300">
            Contact info <span className="font-semibold text-neutral-400 normal-case">(Optional)</span>
          </label>
          <input
            id="contact"
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            placeholder="Phone or email optional"
            className="w-full bg-neutral-50 dark:bg-stone-800/50 border border-neutral-200 dark:border-stone-700 rounded-xl px-4 py-3 text-[13px] font-medium text-neutral-800 dark:text-stone-200 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
          />
        </div>

        {errorMsg && (
          <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 p-3 rounded-xl border border-orange-100 dark:border-orange-900/30">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-[11px] font-bold">{errorMsg}</span>
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full h-12 bg-emerald-650 hover:bg-emerald-600 text-white font-black text-[12px] uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-colors cursor-pointer mt-2"
        >
          <Send className="w-4 h-4" />
          <span>Submit locally</span>
        </motion.button>
      </form>
    </motion.div>
  );
}
