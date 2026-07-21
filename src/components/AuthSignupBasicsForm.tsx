import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, User, Phone, Mail, MapPin, Search, ShieldCheck, AlertTriangle, Info, KeyRound } from 'lucide-react';
import { AuthMode, AuthDraftUser } from '../types/auth';
import { normalizeKenyanPhone } from '../utils/phone';

interface AuthSignupBasicsFormProps {
  onSetAuthMode: (mode: AuthMode) => void;
  onSetAuthDraftUser: (user: Partial<AuthDraftUser>) => void;
  onShowFeedback: (msg: string) => void;
  onGoHome?: () => void;
  onGoSearch?: () => void;
}

export default function AuthSignupBasicsForm({
  onSetAuthMode,
  onSetAuthDraftUser,
  onShowFeedback,
  onGoHome,
  onGoSearch
}: AuthSignupBasicsFormProps) {
  const [signupForm, setSignupForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    mainArea: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!signupForm.fullName || signupForm.fullName.trim().length < 3) {
      newErrors.fullName = "Enter your full name.";
    }
    
    if (!signupForm.phone) {
      newErrors.phone = "Enter your phone number.";
    } else {
      const normalized = normalizeKenyanPhone(signupForm.phone);
      if (!normalized) {
        newErrors.phone = "Enter a valid Kenyan phone number.";
      }
    }
    
    if (!signupForm.email || !signupForm.email.includes("@") || !signupForm.email.includes(".")) {
      newErrors.email = "Valid email is required for login.";
    }

    if (!signupForm.password || signupForm.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    
    // Make area optional for now or keep required
    if (signupForm.mainArea && signupForm.mainArea.trim().length < 2) {
      newErrors.mainArea = "Enter a valid main area.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      const normalizedPhone = normalizeKenyanPhone(signupForm.phone);
      onSetAuthDraftUser({
        fullName: signupForm.fullName.trim(),
        phone: normalizedPhone || signupForm.phone,
        email: signupForm.email.trim(),
        // We temporarily store password in auth draft here, then clear it later
        password: signupForm.password,
        mainArea: signupForm.mainArea.trim()
      });
      onShowFeedback("Profile basics saved locally.");
      onSetAuthMode('role');
    }
  };

  const updateField = (field: keyof typeof signupForm, value: string) => {
    setSignupForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-neutral-200/60 dark:border-stone-800/60 rounded-3xl p-6 shadow-sm">
        <h2 className="text-2xl font-black text-neutral-850 dark:text-stone-100 tracking-tight leading-tight mb-2">
          Create your account
        </h2>
        <p className="text-[13px] font-semibold text-neutral-600 dark:text-stone-300 mb-2">
          Add basic details so KejaFinder can personalize your search and posting experience.
        </p>
        <p className="text-[11px] font-medium text-neutral-500 dark:text-stone-400 mb-6">
          You can browse homes without an account, but saving, alerts, and posting will work better with one.
        </p>

        <div className="space-y-4 mb-6">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-700 dark:text-stone-300 pl-1">
              Full name
            </label>
            <div className={`flex items-center bg-white dark:bg-stone-950 border ${errors.fullName ? 'border-orange-500' : 'border-neutral-300 dark:border-stone-700'} rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all shadow-sm px-3 py-3`}>
              <User className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
              <input 
                type="text" 
                value={signupForm.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                placeholder="Amina Njeri"
                className="w-full bg-transparent text-[14px] font-bold text-neutral-800 dark:text-stone-100 placeholder-neutral-400 dark:placeholder-stone-600 focus:outline-none"
                aria-label="Full name"
              />
            </div>
            <AnimatePresence>
              {errors.fullName && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[11px] font-bold text-orange-600 dark:text-orange-400 pl-1">
                  {errors.fullName}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase tracking-wider flex items-center gap-2 text-neutral-700 dark:text-stone-300 pl-1">
              <span>Email</span>
            </label>
            <div className={`flex items-center bg-white dark:bg-stone-950 border ${errors.email ? 'border-orange-500' : 'border-neutral-300 dark:border-stone-700'} rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all shadow-sm px-3 py-3`}>
              <Mail className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
              <input 
                type="email" 
                value={signupForm.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="amina@example.com"
                className="w-full bg-transparent text-[14px] font-bold text-neutral-800 dark:text-stone-100 placeholder-neutral-400 dark:placeholder-stone-600 focus:outline-none"
                aria-label="Email Address"
              />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[11px] font-bold text-orange-600 dark:text-orange-400 pl-1">
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          
          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase tracking-wider flex items-center gap-2 text-neutral-700 dark:text-stone-300 pl-1">
              <span>Password</span>
            </label>
            <div className={`flex items-center bg-white dark:bg-stone-950 border ${errors.password ? 'border-orange-500' : 'border-neutral-300 dark:border-stone-700'} rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all shadow-sm px-3 py-3`}>
              <KeyRound className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
              <input 
                type="password" 
                value={signupForm.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-[14px] font-bold text-neutral-800 dark:text-stone-100 placeholder-neutral-400 dark:placeholder-stone-600 focus:outline-none"
                aria-label="Password"
              />
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[11px] font-bold text-orange-600 dark:text-orange-400 pl-1">
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
             <label className="block text-[11px] font-black uppercase tracking-wider flex items-center gap-2 text-neutral-700 dark:text-stone-300 pl-1">
              <span>Confirm Password</span>
            </label>
            <div className={`flex items-center bg-white dark:bg-stone-950 border ${errors.confirmPassword ? 'border-orange-500' : 'border-neutral-300 dark:border-stone-700'} rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all shadow-sm px-3 py-3`}>
              <KeyRound className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
              <input 
                type="password" 
                value={signupForm.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-[14px] font-bold text-neutral-800 dark:text-stone-100 placeholder-neutral-400 dark:placeholder-stone-600 focus:outline-none"
                aria-label="Confirm Password"
              />
            </div>
            <AnimatePresence>
              {errors.confirmPassword && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[11px] font-bold text-orange-600 dark:text-orange-400 pl-1">
                  {errors.confirmPassword}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-700 dark:text-stone-300 pl-1">
              Phone number
            </label>
            <div className={`flex items-center bg-white dark:bg-stone-950 border ${errors.phone ? 'border-orange-500' : 'border-neutral-300 dark:border-stone-700'} rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all shadow-sm`}>
              <div className="pl-4 pr-3 py-3 bg-neutral-50 dark:bg-stone-900 border-r border-neutral-200 dark:border-stone-800 flex items-center justify-center">
                <span className="text-[13px] font-bold text-neutral-700 dark:text-stone-300">+254</span>
              </div>
              <div className="flex-1 flex items-center px-3 py-3">
                <Phone className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
                <input 
                  type="tel" 
                  value={signupForm.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="0712 345 678"
                  className="w-full bg-transparent text-[14px] font-bold text-neutral-800 dark:text-stone-100 placeholder-neutral-400 dark:placeholder-stone-600 focus:outline-none"
                  aria-label="Phone number"
                />
              </div>
            </div>
            <AnimatePresence>
              {errors.phone && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[11px] font-bold text-orange-600 dark:text-orange-400 pl-1">
                  {errors.phone}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Main Area (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black uppercase tracking-wider flex items-center gap-2 text-neutral-700 dark:text-stone-300 pl-1">
              <span>Main area</span>
              <span className="text-[9px] font-semibold bg-neutral-100 dark:bg-stone-800 px-1.5 py-0.5 rounded text-neutral-500 dark:text-stone-400 normal-case">Optional</span>
            </label>
            <div className={`flex items-center bg-white dark:bg-stone-950 border ${errors.mainArea ? 'border-orange-500' : 'border-neutral-300 dark:border-stone-700'} rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all shadow-sm px-3 py-3`}>
              <MapPin className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
              <input 
                type="text" 
                value={signupForm.mainArea}
                onChange={(e) => updateField('mainArea', e.target.value)}
                placeholder="Athi River, Syokimau, Rongai..."
                className="w-full bg-transparent text-[14px] font-bold text-neutral-800 dark:text-stone-100 placeholder-neutral-400 dark:placeholder-stone-600 focus:outline-none"
                aria-label="Main area"
              />
            </div>
            <AnimatePresence>
              {errors.mainArea && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[11px] font-bold text-orange-600 dark:text-orange-400 pl-1">
                  {errors.mainArea}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleContinue}
          className="w-full flex items-center justify-center space-x-2 bg-emerald-600 dark:bg-emerald-500 text-white rounded-2xl py-3.5 px-4 shadow-md hover:shadow-lg transition-all"
          aria-label="Continue signup"
        >
          <span className="text-[13px] font-black uppercase tracking-wider">Continue</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <div className="mt-6 flex flex-col space-y-3">
          <button
            onClick={() => {
              onSetAuthMode('login');
              onShowFeedback('Email login is available.');
            }}
            className="flex items-center justify-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors py-1"
            aria-label="Continue with email login"
          >
            <span>Already have an account? Login</span>
          </button>
          
          <button
            onClick={() => {
              if (onGoSearch) onGoSearch();
              else if (onGoHome) onGoHome();
              else onShowFeedback('Guest browsing enabled in this prototype.');
            }}
            className="flex items-center justify-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-stone-400 hover:text-neutral-700 dark:hover:text-stone-200 transition-colors py-1"
            aria-label="Browse KejaFinder as guest"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Browse as guest</span>
          </button>
        </div>
      </motion.div>

      {/* Why we ask note */}
      <motion.div variants={itemVariants} className="bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-2xl p-4 flex items-start space-x-3 shadow-sm">
        <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[11px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-0.5">Why we ask</h4>
          <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400/90 leading-snug">
            Your phone helps with contact. Your area helps us suggest nearby homes and alerts.
          </p>
        </div>
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
