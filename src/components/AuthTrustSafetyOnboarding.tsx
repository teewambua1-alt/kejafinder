import React, { useState } from 'react';
import { ShieldCheck, Check, UserPlus } from 'lucide-react';
import { AuthDraftUser } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui';
import AuthSafetyNote from './AuthSafetyNote';

interface AuthTrustSafetyOnboardingProps {
  authDraftUser: Partial<AuthDraftUser>;
  /** Resolves true once the account exists. Errors surface via authError. */
  onCreateAccount: () => Promise<boolean>;
}

const REMINDERS = [
  'View the house in person before you pay anything.',
  'Confirm you are speaking to the real caretaker or landlord.',
  'Never send a deposit, viewing fee, or "booking" fee by phone.',
  'Report anything that looks like a scam so we can review it.',
];

const ROLE_NOTES: Record<string, string> = {
  tenant: 'As a tenant, always verify the property in person before paying any fees.',
  landlord: 'As someone posting listings, accurate info and photos build trust.',
  caretaker: 'As someone posting listings, accurate info and photos build trust.',
  agent: 'As an agent, show all fees up front — hidden fees are the top complaint we receive.',
  scout: 'As a scout, only confirm details you have checked yourself.',
};

/**
 * Final sign-up step. The account is created here, on confirm -- previously it
 * was created on the role screen before this text had been shown, so consent
 * was collected after the fact and never recorded at all.
 */
export default function AuthTrustSafetyOnboarding({
  authDraftUser,
  onCreateAccount,
}: AuthTrustSafetyOnboardingProps) {
  const { isAuthLoading, authError } = useAuth();
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleNote = authDraftUser.role
    ? ROLE_NOTES[authDraftUser.role]
    : 'Always verify details before making a decision or sending money.';

  const handleFinish = async () => {
    if (!agreed) {
      setError('Please confirm you have read the safety reminders.');
      return;
    }
    setError(null);
    await onCreateAccount();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="pt-1">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-700 dark:text-emerald-400 stroke-[2.2]" aria-hidden="true" />
          </span>
          <h1 className="text-[26px] font-black tracking-tight leading-[1.15] text-neutral-850 dark:text-stone-100">
            Before you start
          </h1>
        </div>
        <p className="mb-5 text-[13px] font-semibold text-neutral-600 dark:text-stone-300">
          {roleNote}
        </p>

        <ul className="flex flex-col gap-2.5 mb-5 list-none p-0 m-0">
          {REMINDERS.map((line) => (
            <li key={line} className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[3]" aria-hidden="true" />
              <span className="text-[12px] font-semibold text-neutral-700 dark:text-stone-300 leading-relaxed">
                {line}
              </span>
            </li>
          ))}
        </ul>

        <label className="flex items-start gap-3 mb-5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => { setAgreed(e.target.checked); if (e.target.checked) setError(null); }}
            className="sr-only peer"
          />
          <span
            aria-hidden="true"
            className="w-5 h-5 mt-0.5 shrink-0 rounded-md border-2 border-neutral-300 dark:border-stone-600 flex items-center justify-center transition-colors peer-checked:bg-emerald-700 peer-checked:border-emerald-700 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500/40"
          >
            {agreed && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
          </span>
          <span className="text-[12px] font-semibold text-neutral-700 dark:text-stone-300 leading-relaxed">
            I have read these reminders and understand KejaFinder never collects
            deposits or fees on behalf of a landlord.
          </span>
        </label>

        {(error || authError) && (
          <p role="alert" className="mb-4 text-[11px] font-bold text-red-500 dark:text-red-400 pl-1">
            {error || authError}
          </p>
        )}

        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          icon={UserPlus}
          onClick={handleFinish}
          disabled={isAuthLoading}
        >
          {isAuthLoading ? 'Creating account…' : 'Create my account'}
        </Button>

        <p className="mt-3 text-center text-[10.5px] font-semibold text-neutral-500 dark:text-stone-400">
          Your account is created when you tap this button.
        </p>
      </div>

      <AuthSafetyNote />
    </div>
  );
}
