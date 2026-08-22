import React, { useState } from 'react';
import { ArrowRight, Mail, KeyRound, Eye, EyeOff } from 'lucide-react';
import { AuthMode } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from './ui';
import AuthSafetyNote from './AuthSafetyNote';

interface AuthPhoneLoginFormProps {
  onSetAuthMode: (mode: AuthMode) => void;
  onShowFeedback: (msg: string) => void;
  onGoHome?: () => void;
}

export default function AuthPhoneLoginForm({
  onSetAuthMode,
  onShowFeedback,
  onGoHome,
}: AuthPhoneLoginFormProps) {
  const { signIn, isAuthLoading, authError: contextAuthError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // Per-field errors. Previously a single error string drove both borders with
  // inverted conditions, so a wrong-password response reddened whichever field
  // happened to be filled rather than the one at fault.
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!email.trim()) next.email = 'Enter your email address.';
    if (!password) next.password = 'Enter your password.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    try {
      await signIn(email.trim(), password);
      onShowFeedback('Welcome back.');
      onGoHome?.();
    } catch {
      // Surfaced below via contextAuthError.
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-neutral-200/60 dark:border-stone-800/60 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md p-6 shadow-sm">
        <h2 className="text-2xl font-black tracking-tight leading-tight text-neutral-850 dark:text-stone-100">
          Welcome back
        </h2>
        <p className="mt-1.5 mb-6 text-[13px] font-semibold text-neutral-600 dark:text-stone-300">
          Log in to reach your saved homes and searches.
        </p>

        {/* A real <form>: there was no form element anywhere in the auth flow,
            so Enter never submitted on any screen. */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            inputMode="email"
            name="email"
            /* autoComplete lets password managers fill and save credentials.
               The whole app had one autoComplete attribute before this. */
            autoComplete="email"
            spellCheck={false}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
            }}
            error={errors.email}
            icon={Mail}
            required
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
            }}
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
                {showPassword ? (
                  <EyeOff className="w-4 h-4 stroke-[2.2]" />
                ) : (
                  <Eye className="w-4 h-4 stroke-[2.2]" />
                )}
              </button>
            }
          />

          {contextAuthError && (
            <p
              role="alert"
              className="text-[11px] font-bold text-red-500 dark:text-red-400 pl-1"
            >
              {contextAuthError}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            icon={ArrowRight}
            iconPosition="right"
            disabled={isAuthLoading}
          >
            {isAuthLoading ? 'Logging in…' : 'Log in'}
          </Button>
        </form>

        <div className="mt-5 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => onSetAuthMode('signup')}
            className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors cursor-pointer outline-none bg-transparent border-none"
          >
            No account yet? Create one
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

      <AuthSafetyNote />
    </div>
  );
}
