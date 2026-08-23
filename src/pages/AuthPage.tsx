import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import AuthHeader from '../components/AuthHeader';
import AuthWelcomeChoice from '../components/AuthWelcomeChoice';
import AuthPitch from '../components/AuthPitch';
import AuthConfirmEmail from '../components/AuthConfirmEmail';
import { useMediaQuery } from '../hooks/useMediaQuery';
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
  // Back from "confirm your email" goes to login, not back into the signup
  // wizard: the account already exists, so re-running signup would only earn a
  // "user already exists" error.
  confirm: 'login',
};

export default function AuthPage({ onBack, onTabChange }: AuthPageProps) {
  const { showToast } = useToast();
  const { signUp } = useAuth();
  const m = useMotion();

  const [authMode, setAuthMode] = useState<AuthMode>('welcome');
  // At lg+ the pitch owns the left column and carries no heading, so the
  // welcome step supplies the page's h1 on its side of the split.
  const isDesktop = useMediaQuery('(min-width: 1024px)');
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
    if (!node) return;
    // preventScroll matters here: the header is `sticky top-0` inside the
    // scroller, and a plain focus() scrolls the focused element flush to the
    // scroller's top -- i.e. underneath the sticky header, clipping the first
    // 15px of every step's heading. Focus for assistive tech, then put the
    // scroll position where a new step belongs: at the start.
    node.focus({ preventScroll: true });
    node.closest('[data-auth-scroll]')?.scrollTo({ top: 0 });
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
        // A screen, not a toast. This is the most common successful outcome on
        // a project with email confirmation on, and it used to look identical
        // to a failure: a message that vanished, back on the welcome screen.
        setAuthMode('confirm');
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

      {/* One scroll container, with the header inside it.
        *
        * AuthHeader is `sticky top-0`, but it used to sit OUTSIDE this
        * scroller -- so it stuck to AppShell's scroll box while the form
        * scrolled in a second, nested box beneath it. Every auth screen's
        * heading was clipped by 11px behind the header, and nested scroll
        * regions fight the main scroll gesture. Inside the scroller the header
        * occupies flow space, so nothing can start underneath it. */}
      <div data-auth-scroll className="flex-1 overflow-y-auto no-scrollbar z-10 pb-12">
        <AuthHeader onBack={handleBack} />

        {/* Two columns at lg+, one below. The desktop flow used to centre a
          * max-w-md form in 1440px of empty page under two stacked headers;
          * the pitch now fills the left column and stays visible while the
          * form is filled in. On mobile the pitch appears only on the welcome
          * step -- repeating it above every form would bury the fields. */}
        <div className="mx-auto grid w-full max-w-md gap-10 px-6 pt-6 lg:max-w-5xl lg:grid-cols-2 lg:gap-16 lg:pt-14">
          {/* Rendered, not just CSS-hidden. `hidden lg:block` left a mounted
            * (and therefore queryable) heading on every mobile sub-step. */}
          {(isDesktop || authMode === 'welcome') && (
          <div className={authMode === 'welcome' ? 'contents lg:block' : 'hidden lg:block'}>
            {/* At lg+ the pitch is always visible, so the step on the right
              * owns the page's h1 and this drops out of the outline. On mobile
              * the pitch only renders on the welcome step, where it *is* the
              * heading. Getting this wrong gave desktop welcome two h1s. */}
            <AuthPitch headingLevel={isDesktop ? 'p' : 'h1'} />
          </div>
          )}

          <div className="flex flex-col gap-6 lg:min-w-0">
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
                  showHeading={isDesktop}
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

              {authMode === 'confirm' && (
                <AuthConfirmEmail
                  email={authDraftUser.email || ''}
                  onGoToLogin={() => setAuthMode('login')}
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
    </div>
  );
}
