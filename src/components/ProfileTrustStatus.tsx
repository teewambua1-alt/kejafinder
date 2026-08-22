import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Phone, BadgeCheck, Check, Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useMotion } from '../lib/motion';
import {
  getMyVerificationRequests,
  requestVerification,
  type VerificationRequest,
} from '../services/verificationService';

interface ProfileTrustStatusProps {
  isPhoneVerified: boolean;
  isIdVerified: boolean;
}

/**
 * Trust and verification. One card.
 *
 * Was four cards for three checks, and the third and fourth were both
 * duplicates: an "Active trust badges" card re-listed exactly the checks
 * already marked Verified in the card above it, and an "Official Badge Notice"
 * card carried a paragraph of policy prose.
 *
 * Two other changes worth naming:
 *
 * - **"Email Added" is gone.** Signup requires an email, so `hasEmail` was
 *   effectively always true — a check that cannot fail is not a check, it is
 *   decoration that made the strength bar read higher than it should.
 * - **Phone is now a real request.** The "Not yet" pill looked like a control
 *   and did nothing; it now inserts into `verification_requests`, which has had
 *   working RLS since the first migration and had never been written to.
 *
 * ID verification stays informational on purpose: the table's `request_type`
 * CHECK has no identity option, so there is nothing honest to submit. Saying
 * "reviewed by our team" beats a button that would fail a constraint.
 */
export default function ProfileTrustStatus({ isPhoneVerified, isIdVerified }: ProfileTrustStatusProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const m = useMotion();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [isSending, setIsSending] = useState(false);

  const load = useCallback(async () => {
    const rows = await getMyVerificationRequests();
    if (rows) setRequests(rows);
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const phonePending = requests.some((r) => r.request_type === 'phone' && r.status === 'pending');

  const handleRequestPhone = async () => {
    if (!user || isSending) return;
    setIsSending(true);
    const error = await requestVerification(user.id, 'phone');
    setIsSending(false);
    if (error) {
      showToast(error);
      return;
    }
    showToast('Phone verification requested. Our team will review it.');
    load();
  };

  // Two real checks, so the bar is out of two.
  const done = Number(isPhoneVerified) + Number(isIdVerified);
  const completion = Math.round((done / 2) * 100);

  return (
    <motion.div
      variants={m.fadeUp}
      className="w-full bg-white dark:bg-stone-900 border border-neutral-150/70 dark:border-stone-800/70 rounded-3xl p-5 shadow-2xs space-y-4"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-2xs font-black uppercase tracking-wider text-neutral-700 dark:text-stone-300">
          Trust &amp; verification
        </h2>
        <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
          {completion}%
        </span>
      </div>

      <div
        className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-stone-800"
        role="progressbar"
        aria-label="Verification progress"
        aria-valuenow={completion}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${completion}%` }}
          transition={{ duration: m.duration.base }}
          className="h-full rounded-full bg-emerald-700"
        />
      </div>

      <div className="divide-y divide-neutral-100 dark:divide-stone-800">
        <TrustRow
          icon={Phone}
          title="Phone verified"
          verified={isPhoneVerified}
          hint={phonePending ? 'Requested — our team is reviewing it.' : 'Confirm your number so posters trust your enquiries.'}
        >
          {!isPhoneVerified && !phonePending && (
            <button
              type="button"
              onClick={handleRequestPhone}
              disabled={isSending}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/25 px-3 py-1.5 text-3xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-950/40 disabled:opacity-50"
            >
              {isSending && <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />}
              Request
            </button>
          )}
          {!isPhoneVerified && phonePending && <PendingPill />}
        </TrustRow>

        <TrustRow
          icon={BadgeCheck}
          title="ID verified"
          verified={isIdVerified}
          hint="Reviewed by the KejaFinder team — you don't need to request it."
        />
      </div>
    </motion.div>
  );
}

function VerifiedPill() {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200/60 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 text-3xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
      <Check className="h-3 w-3 stroke-[3]" aria-hidden="true" />
      Verified
    </span>
  );
}

function PendingPill() {
  return (
    <span className="rounded-lg border border-orange-200/60 dark:border-orange-900/40 bg-orange-50 dark:bg-orange-950/25 px-2 py-1 text-3xs font-black uppercase tracking-wider text-orange-700 dark:text-orange-400">
      Pending
    </span>
  );
}

function TrustRow({
  icon: Icon, title, hint, verified, children,
}: {
  icon: LucideIcon;
  title: string;
  hint: string;
  verified: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <div className="flex min-w-0 items-start gap-3">
        <Icon
          className={`mt-0.5 h-4 w-4 shrink-0 stroke-[2.2] ${verified ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-550 dark:text-stone-400'}`}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="text-xs font-bold text-neutral-800 dark:text-stone-100">{title}</p>
          <p className="mt-0.5 text-2xs font-semibold leading-snug text-neutral-550 dark:text-stone-400">
            {hint}
          </p>
        </div>
      </div>
      <div className="shrink-0">{verified ? <VerifiedPill /> : children}</div>
    </div>
  );
}
