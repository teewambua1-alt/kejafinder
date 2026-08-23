import { useState } from 'react';
import { motion } from 'motion/react';
import { MailCheck, Loader2, RefreshCw, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMotion } from '../lib/motion';

interface AuthConfirmEmailProps {
  email: string;
  onGoToLogin: () => void;
}

/**
 * The state between "account created" and "account usable".
 *
 * With email confirmation enabled -- which it is on this project --
 * `signUp()` succeeds but returns no session. The account exists and cannot be
 * used until the link is clicked. Previously that was announced by a toast and
 * the user was dropped back on the welcome screen, so the most common outcome
 * of a successful signup looked identical to a failed one.
 *
 * Two things make this recoverable rather than a dead end: the address is shown
 * back (so a typo is visible), and the email can be re-sent.
 *
 * Resending is subject to the same project-wide email quota as signup, so a
 * failure is surfaced rather than swallowed -- claiming "sent" when the quota
 * is full is exactly how the original breakage stayed invisible.
 */
export default function AuthConfirmEmail({ email, onGoToLogin }: AuthConfirmEmailProps) {
  const { resendConfirmation } = useAuth();
  const m = useMotion();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  const resend = async () => {
    if (status === 'sending') return;
    setStatus('sending');
    setError(null);
    try {
      await resendConfirmation(email);
      setStatus('sent');
    } catch (e) {
      setStatus('idle');
      setError(e instanceof Error ? e.message : 'Could not send the email. Try again later.');
    }
  };

  return (
    <motion.div variants={m.stagger(0.06)} initial="hidden" animate="show" className="flex flex-col gap-5 pt-1">
      <motion.div variants={m.fadeUp}>
        <span
          className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
          aria-hidden="true"
        >
          <MailCheck className="h-6 w-6 stroke-[2.2]" />
        </span>
        <h1 className="mt-4 text-[26px] font-black leading-[1.15] tracking-tight text-neutral-850 dark:text-stone-50">
          Confirm your email
        </h1>
        <p className="mt-2.5 text-sm font-medium leading-relaxed text-neutral-600 dark:text-stone-300">
          Your account is created. We sent a confirmation link to{' '}
          <span className="font-black text-neutral-850 dark:text-stone-100">{email}</span>. Open
          it, then come back and log in.
        </p>
        <p className="mt-2 text-2xs font-semibold leading-relaxed text-neutral-550 dark:text-stone-400">
          Check your spam folder too. If the address above is wrong, go back and sign up again with
          the right one.
        </p>
      </motion.div>

      {error && (
        <motion.p
          variants={m.fadeUp}
          role="alert"
          className="rounded-2xl border border-orange-200/60 dark:border-orange-900/40 bg-orange-50/80 dark:bg-orange-950/20 p-4 text-xs font-semibold leading-relaxed text-orange-800 dark:text-orange-300"
        >
          {error}
        </motion.p>
      )}

      {status === 'sent' && !error && (
        <motion.p
          variants={m.fadeUp}
          role="status"
          className="rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/80 dark:bg-emerald-950/20 p-4 text-xs font-semibold text-emerald-800 dark:text-emerald-300"
        >
          Sent again. It can take a minute to arrive.
        </motion.p>
      )}

      <motion.div variants={m.fadeUp} className="flex flex-col gap-3">
        <motion.button
          type="button"
          whileTap={m.tap}
          onClick={onGoToLogin}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 text-sm font-black uppercase tracking-wider text-white shadow-md shadow-emerald-700/20 transition-colors hover:bg-emerald-800 outline-none cursor-pointer"
        >
          <LogIn className="h-4 w-4 stroke-[2.4]" aria-hidden="true" />
          I have confirmed — log in
        </motion.button>

        <motion.button
          type="button"
          whileTap={m.tap}
          onClick={resend}
          disabled={status === 'sending'}
          className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-stone-100 transition-colors hover:bg-neutral-50 dark:hover:bg-stone-850 disabled:opacity-50 outline-none cursor-pointer"
        >
          {status === 'sending' ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="h-4 w-4 stroke-[2.4]" aria-hidden="true" />
          )}
          Send the email again
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
