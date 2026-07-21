import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import AuthHeader from '../components/AuthHeader';
import AuthWelcomeChoice from '../components/AuthWelcomeChoice';
import AuthPhoneLoginForm from '../components/AuthPhoneLoginForm';
import AuthSignupBasicsForm from '../components/AuthSignupBasicsForm';
import AuthRoleSelection from '../components/AuthRoleSelection';
import AuthOtpVerification from '../components/AuthOtpVerification';
import AuthTrustSafetyOnboarding from '../components/AuthTrustSafetyOnboarding';
import { AuthMode, AuthDraftUser } from '../types/auth';

interface AuthPageProps {
  onBack: () => void;
  onTabChange?: (tab: string) => void;
}

export default function AuthPage({ onBack, onTabChange }: AuthPageProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("welcome");
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);
  const [authDraftUser, setAuthDraftUser] = useState<Partial<AuthDraftUser>>({});

  const handleShowFeedback = (msg: string) => {
    setAuthFeedback(msg);
    setTimeout(() => setAuthFeedback(null), 3000);
  };
  
  const handleSetAuthDraftUser = (userUpdate: Partial<AuthDraftUser>) => {
    setAuthDraftUser(prev => ({ ...prev, ...userUpdate }));
  };
  // Stagger scale animation for placeholders
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.4, 
        ease: 'easeOut' 
      } 
    }
  };

  return (
    <div className="flex-1 flex flex-col relative animate-fadeIn bg-neutral-50/50 dark:bg-stone-900/10 min-h-full -mx-6 -mt-6">
      {/* Visual background ambient blur spots */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-40 left-1/4 w-72 h-72 bg-emerald-300/10 dark:bg-emerald-300/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Header */}
      <AuthHeader onBack={onBack} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar z-10 px-6 py-6 pb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-md mx-auto space-y-6"
        >
          {/* Welcome Screen */}
          {authMode === 'welcome' && (
            <AuthWelcomeChoice 
              onSetAuthMode={setAuthMode}
              onShowFeedback={handleShowFeedback}
              onGoHome={() => {
                if (onTabChange) onTabChange('home');
              }}
              onGoPost={() => {
                if (onTabChange) onTabChange('post');
              }}
            />
          )}
          
          {/* B. Phone login form */}
          {authMode === 'login' && (
            <AuthPhoneLoginForm 
              onSetAuthMode={setAuthMode}
              onSetAuthDraftUser={handleSetAuthDraftUser}
              onShowFeedback={handleShowFeedback}
              onGoHome={() => {
                if (onTabChange) onTabChange('home');
              }}
              onGoSearch={() => {
                if (onTabChange) onTabChange('search');
              }}
            />
          )}

          {/* C. Signup profile basics */}
          {authMode === 'signup' && (
            <AuthSignupBasicsForm 
              onSetAuthMode={setAuthMode}
              onSetAuthDraftUser={handleSetAuthDraftUser}
              onShowFeedback={handleShowFeedback}
              onGoHome={() => {
                if (onTabChange) onTabChange('home');
              }}
              onGoSearch={() => {
                if (onTabChange) onTabChange('search');
              }}
            />
          )}

          {/* D. User role selection */}
          {authMode === 'role' && (
            <AuthRoleSelection 
              authDraftUser={authDraftUser}
              onSetAuthMode={setAuthMode}
              onSetAuthDraftUser={handleSetAuthDraftUser}
              onShowFeedback={handleShowFeedback}
            />
          )}

          {/* E. OTP verification mockup */}
          {authMode === 'otp' && (
            <AuthOtpVerification 
              authDraftUser={authDraftUser}
              onSetAuthMode={setAuthMode}
              onShowFeedback={handleShowFeedback}
            />
          )}

          {/* F. Trust and safety onboarding */}
          {authMode === 'trust' && (
            <AuthTrustSafetyOnboarding 
              authDraftUser={authDraftUser}
              onSetAuthMode={setAuthMode}
              onShowFeedback={handleShowFeedback}
              onGoHome={() => {
                if (onTabChange) onTabChange('home');
              }}
              onGoSearch={() => {
                if (onTabChange) onTabChange('search');
              }}
            />
          )}

        </motion.div>
      </div>

      {/* Local Feedback Toast */}
      <AnimatePresence>
        {authFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-20 left-1/2 z-50 bg-neutral-900 dark:bg-stone-100 text-white dark:text-stone-900 px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 w-[85%] max-w-xs"
          >
            <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0 stroke-[3]" />
            <span className="text-[11px] font-bold uppercase tracking-wider">{authFeedback}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
