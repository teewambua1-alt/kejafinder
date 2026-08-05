import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Search, 
  Building2, 
  UserRound, 
  Briefcase, 
  MapPin, 
  CheckCircle,
  Info,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { AuthMode, AuthDraftUser, AuthRole } from '../types/auth';
import { useAuth } from '../context/AuthContext';

interface AuthRoleSelectionProps {
  authDraftUser: Partial<AuthDraftUser>;
  onSetAuthMode: (mode: AuthMode) => void;
  onSetAuthDraftUser: (user: Partial<AuthDraftUser>) => void;
  onShowFeedback: (msg: string) => void;
}

export default function AuthRoleSelection({
  authDraftUser,
  onSetAuthMode,
  onSetAuthDraftUser,
  onShowFeedback
}: AuthRoleSelectionProps) {
  const { signUp, isAuthLoading, authError: contextAuthError } = useAuth();

  const [selectedRole, setSelectedRole] = useState<AuthRole | null>(authDraftUser?.role ?? null);
  const [error, setError] = useState<string | null>(null);

  const processSignUp = async (role: AuthRole) => {
    try {
      if (!authDraftUser.email || !authDraftUser.password) {
         setError("Missing email or password from previous steps.");
         return;
      }
      const result = await signUp({
        email: authDraftUser.email,
        password: authDraftUser.password,
        fullName: authDraftUser.fullName || "Unknown",
        phone: authDraftUser.phone || "",
        role,
        town: authDraftUser.mainArea
      });

      onSetAuthDraftUser({ role: role });

      if (result?.requiresEmailConfirmation) {
        onShowFeedback("Account created! Check your email to confirm it, then log in.");
        onSetAuthMode("welcome");
      } else {
        onShowFeedback("Account created successfully!");
        onSetAuthMode("trust");
      }
    } catch (e) {
      // Handled in context to authError
    }
  };

  const currentError = error || contextAuthError;

  const handleContinue = async () => {
    if (!selectedRole) {
      setError("Choose a role to continue.");
      return;
    }
    await processSignUp(selectedRole);
  };

  const handleSkip = async () => {
    // Default to tenant if skipped
    await processSignUp('tenant');
  };

  const roles: Array<{ id: AuthRole; label: string; desc: string; icon: any }> = [
    { id: 'tenant', label: 'Tenant', desc: 'I’m looking for a vacant room or house.', icon: Search },
    { id: 'landlord', label: 'Landlord', desc: 'I own vacant rooms or houses.', icon: Building2 },
    { id: 'caretaker', label: 'Caretaker', desc: 'I manage rooms and talk to tenants.', icon: UserRound },
    { id: 'agent', label: 'Agent', desc: 'I post listings with clear fees.', icon: Briefcase },
    { id: 'scout', label: 'Area Scout', desc: 'I help check and collect local vacancies.', icon: MapPin },
  ];

  const getRoleNote = () => {
    switch (selectedRole) {
      case 'tenant': return "Tenants can search, save, compare, call, and WhatsApp caretakers.";
      case 'landlord': return "Landlord posting tools will be reviewed before listings go live.";
      case 'caretaker': return "Caretakers can post and update vacancies later.";
      case 'agent': return "Agents will need clear fees and verification before wider posting.";
      case 'scout': return "Scout tools will be added later for checking local listings.";
      default: return null;
    }
  };

  const isPosterRole = ['landlord', 'caretaker', 'agent', 'scout'].includes(selectedRole || '');

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
          What brings you to KejaFinder?
        </h2>
        <p className="text-[13px] font-semibold text-neutral-600 dark:text-stone-300 mb-2">
          Choose how you plan to use KejaFinder. You can change this later.
        </p>
        <p className="text-[11px] font-medium text-neutral-500 dark:text-stone-400 mb-6">
          This is a prototype selection only. Real account roles and permissions will be added later.
        </p>

        <div className="space-y-3 mb-6">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <motion.button
                key={role.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedRole(role.id);
                  setError(null);
                }}
                className={`w-full flex items-center p-4 rounded-2xl border text-left transition-all ${
                  isSelected 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 shadow-sm' 
                    : 'bg-white/50 dark:bg-stone-950/50 border-neutral-200 dark:border-stone-800 hover:border-emerald-200 dark:hover:border-emerald-800'
                }`}
                aria-pressed={isSelected}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mr-4 ${
                  isSelected ? 'bg-emerald-100 dark:bg-emerald-800/40 text-emerald-600 dark:text-emerald-400' : 'bg-neutral-100 dark:bg-stone-900 text-neutral-500 dark:text-stone-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-[14px] font-black tracking-tight ${isSelected ? 'text-emerald-900 dark:text-emerald-300' : 'text-neutral-800 dark:text-stone-200'}`}>
                    {role.label}
                  </h3>
                  <p className={`text-[11px] font-semibold ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-500 dark:text-stone-400'}`}>
                    {role.desc}
                  </p>
                </div>
                {isSelected && (
                  <CheckCircle className="w-5 h-5 text-emerald-500 ml-2 shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>
        
        <AnimatePresence>
          {currentError && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }} 
              className="text-[11px] font-bold text-orange-600 dark:text-orange-400 pl-1 mb-4"
            >
              {currentError}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={isAuthLoading}
          onClick={handleContinue}
          className={`w-full flex items-center justify-center space-x-2 ${isAuthLoading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:shadow-lg'} dark:bg-emerald-500 text-white rounded-2xl py-3.5 px-4 shadow-md transition-all mb-4`}
          aria-label="Continue after selecting role"
        >
          <span className="text-[13px] font-black uppercase tracking-wider">{isAuthLoading ? "Creating Account..." : "Create Account"}</span>
          {!isAuthLoading && <ArrowRight className="w-4 h-4" />}
        </motion.button>

        <div className="flex justify-center mt-2">
          <button
            onClick={handleSkip}
            disabled={isAuthLoading}
            className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-stone-400 hover:text-neutral-700 dark:hover:text-stone-200 transition-colors py-2 px-4"
            aria-label="Skip role selection"
          >
            Skip for now / Default Tenant
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedRole && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-2xl p-4 flex items-start space-x-3 shadow-sm"
          >
            <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 leading-snug">
              {getRoleNote()}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPosterRole && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-indigo-50/80 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 rounded-2xl p-4 flex items-start space-x-3 shadow-sm"
          >
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[11px] font-semibold text-indigo-800 dark:text-indigo-300 leading-snug">
              Posting and verification tools are reviewed by KejaFinder to reduce fake or outdated listings.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

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
