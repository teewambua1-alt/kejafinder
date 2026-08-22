import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import AuthHeader from '../components/AuthHeader';
import AuthWelcomeChoice from '../components/AuthWelcomeChoice';
import AuthPhoneLoginForm from '../components/AuthPhoneLoginForm';
import AuthSignupBasicsForm from '../components/AuthSignupBasicsForm';
import AuthRoleSelection from '../components/AuthRoleSelection';
import AuthTrustSafetyOnboarding from '../components/AuthTrustSafetyOnboarding';
import AuthStepProgress from '../components/AuthStepProgress';
import { AuthMode, AuthDraftUser, AuthRole } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useMotion } from '../lib/motion';

interface AuthPageProps {
  onBack: () => void;
  onTabChange?: (tab: string) => void;
}

const SIGNUP_FLOW: AuthMode[] = ['signup', 'role', 'trust'];
const SIGNUP_STEP_LABELS = ['Your details', 'Your role', 'Staying safe'];

/** Where the in-flow back button goes, so a typo doesn't mean starting over. */
const PREVIOUS_STEP: Partial<Record<AuthMode, AuthMode>> = {
  login: 'welcome',
  signup: 'welcome',
  role: 'signup',
  trust: 'role',
};

export default function AuthPage({ onBack, onTabChange }: AuthPageProps) {
  const { showToast } = useToast();
  const { signUp } = useAuth();
  const m = useMotion();

  const [authMode, setAuthMode] = useState<AuthMode>('welcome');
  const [authDraftUser, setAuthDraftUser] = useState<Partial<AuthDraftUser>>({});

  /**
   * The password never enters authDraftUser. Keeping it in a ref means it
   * isn't spread between steps with the rest of the profile, and it can be
   * wiped the moment it has been used.
   */
  const passwordRef = useRef('');
  useEffect(() => () => { passwordRef.current = ''; }, []);

  /**
   * Moves focus to each step as it appears. Swapping steps used to leave focus
   * on the button that had just unmounted, so assistive tech got no
   * announcement that the screen had changed.
   *
   * This is a ref callback rather than an effect on `authMode`: AnimatePresence
   * runs in "wait" mode, so the incoming node is not mounted until the outgoing
   * one has finished animating out. An effect keyed on the mode fires too early
   * and focus lands on <body> instead.
   */
  const focusStep = useCallback((node: HTMLDivElement | null) => {
    node?.focus();
  }, []);

  const handleShowFeedback = useCallback((msg: string) => {
    showToast(msg, { icon: Check });
  }, [showToast]);

  const handleSetAuthDraftUser = useCallback((update: Partial<AuthDraftUser>) => {
    setAuthDraftUser((prev) => ({ ...prev, ...update }));
  }, []);

  const handleSetPassword = useCallback((value: string) => {
    passwordRef.current = value;
  }, []);

  const goHome = useCallback(() => onTabChange?.('home'), [onTabChange]);

  /**
   * Creates the account. This runs at the END of the flow, from the safety
   * screen -- it used to fire on the role step, i.e. the one irreversible
   * action happened before the user had seen or accepted the safety terms.
   * The role is written once by a database trigger and cannot be changed by
   * the client afterwards, which is all the more reason not to commit it
   * before the user has finished reading.
   */
  const handleCreateAccount = useCallback(async (): Promise<boolean> => {
    const { email, fullName, phone, role, mainArea } = authDraftUser;
    if (!email || !passwordRef.current) {
      handleShowFeedback('Your details are missing. Please start again.');
      setAuthMode('signup');
      return false;
    }

    try {
      const result = await signUp({
        email,
        password: passwordRef.current,
        fullName: fullName || '',
        phone: phone || '',
        role: (role ?? 'tenant') as AuthRole,
        town: mainArea,
      });

      passwordRef.current = '';

      if (result?.requiresEmailConfirmation) {
        handleShowFeedback('Account created. Check your email to confirm it, then log in.');
        setAuthMode('welcome');
        return true;
      }

      handleShowFeedback('Account created. Welcome to KejaFinder.');
      goHome();
      return true;
    } catch {
      // signUp surfaces the reason through authError, which the safety screen
      // renders inline. Keep the password so a retry doesn't lose it.
      return false;
    }
  }, [authDraftUser, signUp, handleShowFeedback, goHome]);

  const handleBack = () => {
    const previous = PREVIOUS_STEP[authMode];
    if (previous) {
      setAuthMode(previous);
    } else {
      onBack();
    }
  };

  const signupStepIndex = SIGNUP_FLOW.indexOf(authMode);

  return (
    <div className="flex-1 flex flex-col relative animate-fadeIn bg-neutral-50/50 dark:bg-stone-900/10 min-h-full -mx-6 -mt-6">
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-40 left-1/4 w-72 h-72 bg-emerald-300/10 dark:bg-emerald-300/5 rounded-full blur-3xl pointer-events-none z-0" />

      <AuthHeader onBack={handleBack} />

      <div className="flex-1 overflow-y-auto no-scrollbar z-10 px-6 py-6 pb-12">
        <div className="max-w-md mx-auto flex flex-col gap-6">
          {signupStepIndex >= 0 && (
            <AuthStepProgress steps={SIGNUP_STEP_LABELS} current={signupStepIndex} />
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={authMode}
              ref={focusStep}
              tabIndex={-1}
              initial={m.reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={m.reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={m.reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: m.duration.fast }}
              className="outline-none"
            >
              {authMode === 'welcome' && (
                <AuthWelcomeChoice
                  onSetAuthMode={setAuthMode}
                  onGoHome={goHome}
                  onGoPost={() => onTabChange?.('post')}
                />
              )}

              {authMode === 'login' && (
                <AuthPhoneLoginForm
                  onSetAuthMode={setAuthMode}
                  onShowFeedback={handleShowFeedback}
                  onGoHome={goHome}
                />
              )}

              {authMode === 'signup' && (
                <AuthSignupBasicsForm
                  authDraftUser={authDraftUser}
                  onSetAuthMode={setAuthMode}
                  onSetAuthDraftUser={handleSetAuthDraftUser}
                  onSetPassword={handleSetPassword}
                  onGoHome={goHome}
                />
              )}

              {authMode === 'role' && (
                <AuthRoleSelection
                  authDraftUser={authDraftUser}
                  onSetAuthMode={setAuthMode}
                  onSetAuthDraftUser={handleSetAuthDraftUser}
                />
              )}

              {authMode === 'trust' && (
                <AuthTrustSafetyOnboarding
                  authDraftUser={authDraftUser}
                  onCreateAccount={handleCreateAccount}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
