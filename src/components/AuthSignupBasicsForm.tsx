import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Mail, KeyRound, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import { AuthMode, AuthDraftUser } from '../types/auth';
import { normalizeKenyanPhone } from '../utils/phone';
import { Button, Input } from './ui';
import AuthSafetyNote from './AuthSafetyNote';

interface AuthSignupBasicsFormProps {
  authDraftUser: Partial<AuthDraftUser>;
  onSetAuthMode: (mode: AuthMode) => void;
  onSetAuthDraftUser: (user: Partial<AuthDraftUser>) => void;
  /** Handed the password separately -- it is never put in the draft object. */
  onSetPassword: (value: string) => void;
  onGoHome?: () => void;
}

type FieldErrors = Partial<Record<'fullName' | 'email' | 'password' | 'confirm' | 'phone' | 'mainArea', string>>;

export default function AuthSignupBasicsForm({
  authDraftUser,
  onSetAuthMode,
  onSetAuthDraftUser,
  onSetPassword,
  onGoHome,
}: AuthSignupBasicsFormProps) {
  // Prefilled from the draft so stepping back to fix a typo doesn't wipe the
  // rest of the form.
  const [fullName, setFullName] = useState(authDraftUser.fullName ?? '');
  const [email, setEmail] = useState(authDraftUser.email ?? '');
  const [phone, setPhone] = useState(authDraftUser.phone ?? '');
  const [mainArea, setMainArea] = useState(authDraftUser.mainArea ?? '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const summaryRef = useRef<HTMLDivElement>(null);
  const [focusSummary, setFocusSummary] = useState(false);

  // The summary is rendered from `errors`, so it does not exist yet on the
  // tick that sets them -- focusing it inline silently did nothing. Defer to
  // an effect that runs once the node is actually mounted.
  useEffect(() => {
    if (focusSummary && summaryRef.current) {
      summaryRef.current.focus();
      setFocusSummary(false);
    }
  }, [focusSummary]);

  const clear = (key: keyof FieldErrors) => {
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: FieldErrors = {};

    if (fullName.trim().length < 3) next.fullName = 'Enter your full name.';
    if (!email.includes('@') || !email.includes('.')) next.email = 'Enter a valid email address.';
    if (password.length < 6) next.password = 'Use at least 6 characters.';
    if (confirm !== password) next.confirm = 'Passwords do not match.';
    if (!normalizeKenyanPhone(phone)) next.phone = 'Enter a valid Kenyan phone number.';
    if (mainArea.trim() && mainArea.trim().length < 2) next.mainArea = 'Enter a valid area.';

    setErrors(next);

    const failures = Object.values(next).filter(Boolean);
    if (failures.length > 0) {
      // With more than one problem, focus the summary rather than a single
      // field, so the count is announced before the user starts fixing.
      if (failures.length > 1) setFocusSummary(true);
      return;
    }

    onSetAuthDraftUser({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: normalizeKenyanPhone(phone) ?? phone.trim(),
      mainArea: mainArea.trim() || undefined,
    });
    onSetPassword(password);
    onSetAuthMode('role');
  };

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-neutral-200/60 dark:border-stone-800/60 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md p-6 shadow-sm">
        <h2 className="text-2xl font-black tracking-tight leading-tight text-neutral-850 dark:text-stone-100">
          Create your account
        </h2>
        <p className="mt-1.5 mb-6 text-[13px] font-semibold text-neutral-600 dark:text-stone-300">
          Your name and phone help caretakers know who is calling.
        </p>

        {errorCount > 1 && (
          <div
            ref={summaryRef}
            tabIndex={-1}
            role="alert"
            className="mb-5 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-4 outline-none"
          >
            <p className="text-xs font-black text-red-600 dark:text-red-400">
              {errorCount} details need fixing
            </p>
            <p className="mt-1 text-[11px] font-semibold text-red-500 dark:text-red-400/80">
              Check the highlighted fields below.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            label="Full name"
            name="name"
            autoComplete="name"
            placeholder="e.g. Amina Wanjiru"
            value={fullName}
            onChange={(e) => { setFullName(e.target.value); clear('fullName'); }}
            error={errors.fullName}
            icon={User}
            required
          />

          <Input
            label="Email"
            type="email"
            inputMode="email"
            name="email"
            autoComplete="email"
            spellCheck={false}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clear('email'); }}
            error={errors.email}
            icon={Mail}
            required
          />

          <Input
            label="Phone number"
            type="tel"
            inputMode="tel"
            name="tel"
            autoComplete="tel"
            spellCheck={false}
            placeholder="07XX XXX XXX"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); clear('phone'); }}
            error={errors.phone}
            hint="Kenyan number. Used so caretakers can reach you."
            icon={Phone}
            required
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="new-password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => { setPassword(e.target.value); clear('password'); clear('confirm'); }}
            error={errors.password}
            icon={KeyRound}
            required
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-550 hover:text-neutral-700 dark:text-stone-400 dark:hover:text-stone-300 transition-colors cursor-pointer outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4 stroke-[2.2]" /> : <Eye className="w-4 h-4 stroke-[2.2]" />}
              </button>
            }
          />

          <Input
            label="Confirm password"
            type={showPassword ? 'text' : 'password'}
            name="confirm-password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); clear('confirm'); }}
            error={errors.confirm}
            icon={KeyRound}
            required
          />

          <Input
            label="Main area"
            name="address-level2"
            autoComplete="address-level2"
            placeholder="e.g. Kilimani"
            value={mainArea}
            onChange={(e) => { setMainArea(e.target.value); clear('mainArea'); }}
            error={errors.mainArea}
            hint="Optional. Helps us show homes near you first."
            icon={MapPin}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            icon={ArrowRight}
            iconPosition="right"
          >
            Continue
          </Button>
        </form>

        <div className="mt-5 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => onSetAuthMode('login')}
            className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors cursor-pointer outline-none bg-transparent border-none"
          >
            Already have an account? Log in
          </button>
          <button
            type="button"
            onClick={onGoHome}
            className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-stone-400 hover:text-neutral-700 dark:hover:text-stone-200 transition-colors cursor-pointer outline-none bg-transparent border-none"
          >
            Browse without an account
          </button>
        </div>
      </div>

      <AuthSafetyNote>
        Nothing is created yet. You will confirm your role and read the safety
        reminders before your account is made.
      </AuthSafetyNote>
    </div>
  );
}
