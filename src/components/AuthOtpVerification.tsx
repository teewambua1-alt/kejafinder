import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AuthMode, AuthDraftUser } from '../types/auth';

interface AuthOtpVerificationProps {
  authDraftUser: Partial<AuthDraftUser>;
  onSetAuthMode: (mode: AuthMode) => void;
  onShowFeedback: (msg: string) => void;
}

export default function AuthOtpVerification({
  authDraftUser,
  onSetAuthMode,
  onShowFeedback
}: AuthOtpVerificationProps) {
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    // If typing a single digit
    if (value.length <= 1) {
      const newOtp = [...otpDigits];
      newOtp[index] = value;
      setOtpDigits(newOtp);
      setError(null);

      // Auto-focus next input
      if (value !== "" && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    } 
    // If pasting a full 6-digit code
    else if (value.length === 6 && /^\d+$/.test(value)) {
      setOtpDigits(value.split(''));
      setError(null);
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && otpDigits[index] === '' && index > 0) {
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(pastedData)) {
      setOtpDigits(pastedData.split(''));
      setError(null);
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  const handleVerify = () => {
    const code = otpDigits.join('');
    
    if (code.length < 6) {
      setError("Enter the 6-digit code.");
      return;
    }

    if (code !== "123456") {
      setError("Incorrect mock code. Use 123456 for this prototype.");
      return;
    }

    onShowFeedback("Phone verified locally for this prototype.");
    onSetAuthMode("trust");
  };

  const handleResend = () => {
    setOtpDigits(["", "", "", "", "", ""]);
    setError(null);
    onShowFeedback("Mock code resent. Use 123456.");
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
  };

  const phoneNumberDisplay = authDraftUser?.phone || "+254 712 345 678";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-neutral-200/60 dark:border-stone-800/60 rounded-3xl p-6 shadow-sm">
        <h2 className="text-2xl font-black text-neutral-850 dark:text-stone-100 tracking-tight leading-tight mb-2">
          Verify your phone
        </h2>
        <p className="text-[13px] font-semibold text-neutral-600 dark:text-stone-300 mb-1">
          Enter the 6-digit code we would send to <span className="text-neutral-800 dark:text-stone-100">{phoneNumberDisplay}</span>.
        </p>
        <p className="text-[11px] font-medium text-neutral-500 dark:text-stone-400 mb-6">
          This is a prototype. No real SMS is sent.
        </p>

        <div className="flex justify-between items-center mb-4 space-x-2">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                if (el) inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`w-11 h-12 text-center text-xl font-black rounded-xl border focus:outline-none transition-all shadow-sm ${
                error
                  ? 'border-orange-500 text-orange-900 dark:text-orange-100 bg-orange-50 dark:bg-orange-900/20 focus:ring-2 focus:ring-orange-500/20'
                  : digit !== ''
                    ? 'border-emerald-500 text-emerald-900 dark:text-emerald-100 bg-emerald-50 dark:bg-emerald-900/20 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-neutral-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-neutral-800 dark:text-stone-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
              }`}
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        <div className="mb-6 flex flex-col items-center justify-center space-y-2">
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-[11px] font-bold text-orange-600 dark:text-orange-400 text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
          <p className="text-[11px] font-bold text-neutral-500 dark:text-stone-400 bg-neutral-100 dark:bg-stone-800 px-3 py-1 rounded-full">
            Use <span className="tracking-widest text-neutral-700 dark:text-stone-200">123456</span> for this prototype.
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleVerify}
          className="w-full flex items-center justify-center space-x-2 bg-emerald-600 dark:bg-emerald-500 text-white rounded-2xl py-3.5 px-4 shadow-md hover:shadow-lg transition-all mb-4"
          aria-label="Verify phone number"
        >
          <span className="text-[13px] font-black uppercase tracking-wider">Verify phone</span>
          <CheckCircle2 className="w-5 h-5" />
        </motion.button>

        <div className="flex flex-col items-center space-y-3 mt-2">
          <button
            onClick={handleResend}
            className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors py-1"
            aria-label="Resend mock verification code"
          >
            Resend code
          </button>
          
          <button
            onClick={() => {
              onSetAuthMode('login');
              onShowFeedback('Phone form is available above.');
            }}
            className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-stone-400 hover:text-neutral-700 dark:hover:text-stone-200 transition-colors py-1"
            aria-label="Change phone number"
          >
            Change phone number
          </button>
        </div>
      </motion.div>

      {/* Trust note */}
      <motion.div variants={itemVariants} className="bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-2xl p-4 flex items-start space-x-3 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 leading-snug">
          We use phone verification later to reduce fake accounts and protect renters.
        </p>
      </motion.div>

      {/* Safety Note */}
      <motion.div variants={itemVariants} className="bg-orange-50/80 dark:bg-amber-950/20 border border-orange-200/60 dark:border-amber-900/40 rounded-2xl p-4 flex items-start space-x-3 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
        <p className="text-[11px] font-semibold text-orange-800 dark:text-orange-300 leading-snug">
          Never send deposit before physically viewing the house and confirming the caretaker or landlord.
        </p>
      </motion.div>
    </motion.div>
  );
}
