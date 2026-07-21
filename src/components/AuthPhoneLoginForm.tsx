import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, UserPlus, Search, ShieldCheck, AlertTriangle, KeyRound, Mail } from 'lucide-react';
import { AuthMode, AuthDraftUser } from '../types/auth';
import { useAuth } from '../context/AuthContext';

interface AuthPhoneLoginFormProps {
  onSetAuthMode: (mode: AuthMode) => void;
  onSetAuthDraftUser: (user: Partial<AuthDraftUser>) => void;
  onShowFeedback: (msg: string) => void;
  onGoHome?: () => void;
  onGoSearch?: () => void;
}

export default function AuthPhoneLoginForm({
  onSetAuthMode,
  onSetAuthDraftUser,
  onShowFeedback,
  onGoHome,
  onGoSearch
}: AuthPhoneLoginFormProps) {
  const { signInWithEmailPassword, isAuthLoading, isFirebaseReady, authError: contextAuthError } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      await signInWithEmailPassword(email, password);
      onShowFeedback(`Welcome back!`);
      if (onGoHome) onGoHome();
    } catch (e: any) {
      // Error is handled in context and surfaced via contextAuthError, or we can catch it here if needed.
    }
  };

  const currentError = error || contextAuthError;

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-neutral-200/60 dark:border-stone-800/60 rounded-3xl p-6 shadow-sm">
        <h2 className="text-2xl font-black text-neutral-850 dark:text-stone-100 tracking-tight leading-tight mb-2">
          Log in with Email
        </h2>
        <p className="text-[13px] font-semibold text-neutral-600 dark:text-stone-300 mb-6">
          Log in with your email address to save homes and manage your listings.
        </p>

        {!isFirebaseReady && (
          <div className="mb-4 bg-orange-50/80 dark:bg-amber-950/20 border border-orange-200/60 dark:border-amber-900/40 rounded-xl p-3 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
            <p className="text-[11px] font-semibold text-orange-800 dark:text-orange-300 leading-snug">
              Firebase is not configured. Add Firebase variables to .env.local to test real login.
            </p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className={`flex items-center bg-white dark:bg-stone-950 border ${currentError && !password ? 'border-orange-500' : 'border-neutral-300 dark:border-stone-700'} rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all shadow-sm`}>
            <div className="flex-1 flex items-center px-4 py-3.5">
              <Mail className="w-4 h-4 text-neutral-400 mr-3 shrink-0" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Email Address"
                className="w-full bg-transparent text-[14px] font-bold text-neutral-800 dark:text-stone-100 placeholder-neutral-400 dark:placeholder-stone-600 focus:outline-none"
                aria-label="Email Address"
              />
            </div>
          </div>

          <div className={`flex items-center bg-white dark:bg-stone-950 border ${currentError && password ? 'border-orange-500' : 'border-neutral-300 dark:border-stone-700'} rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all shadow-sm`}>
            <div className="flex-1 flex items-center px-4 py-3.5">
              <KeyRound className="w-4 h-4 text-neutral-400 mr-3 shrink-0" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Password"
                className="w-full bg-transparent text-[14px] font-bold text-neutral-800 dark:text-stone-100 placeholder-neutral-400 dark:placeholder-stone-600 focus:outline-none"
                aria-label="Password"
              />
            </div>
          </div>
          
          <AnimatePresence>
            {currentError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-[11px] font-bold text-orange-600 dark:text-orange-400 pl-1"
              >
                {currentError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileTap={isFirebaseReady ? { scale: 0.97 } : {}}
          disabled={!isFirebaseReady || isAuthLoading}
          onClick={handleLogin}
          className={`w-full flex items-center justify-center space-x-2 ${!isFirebaseReady || isAuthLoading ? 'bg-emerald-400 dark:bg-emerald-600/50 cursor-not-allowed' : 'bg-emerald-600 dark:bg-emerald-500 hover:shadow-lg'} text-white rounded-2xl py-3.5 px-4 shadow-md transition-all`}
          aria-label="Log in"
        >
          <span className="text-[13px] font-black uppercase tracking-wider">{isAuthLoading ? "Logging in..." : "Log in"}</span>
          {!isAuthLoading && <ArrowRight className="w-4 h-4" />}
        </motion.button>

        <div className="mt-6 flex flex-col space-y-3">
          <button
            onClick={() => {
              onSetAuthMode('signup');
              onShowFeedback('Signup view.');
            }}
            className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors py-1"
            aria-label="Create KejaFinder account instead"
          >
            Create account instead
          </button>
          
          <button
            onClick={() => {
              if (onGoSearch) onGoSearch();
              else if (onGoHome) onGoHome();
              else onShowFeedback('Guest browsing enabled in this prototype.');
            }}
            className="flex items-center justify-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-stone-400 hover:text-neutral-700 dark:hover:text-stone-200 transition-colors py-1"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Browse as guest</span>
          </button>
        </div>
      </motion.div>

      {/* Verification note */}
       <motion.div variants={itemVariants} className="bg-neutral-100 dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 rounded-2xl p-4 flex items-start space-x-3 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-neutral-500 dark:text-stone-400 shrink-0 mt-0.5" />
        <p className="text-[11px] font-medium text-neutral-600 dark:text-stone-300 leading-snug">
          Phone verification is not active yet. Firebase email login is active for test mode.
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
