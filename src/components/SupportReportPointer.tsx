import { motion } from 'motion/react';
import { Flag, ArrowRight } from 'lucide-react';
import { useMotion } from '../lib/motion';

interface SupportReportPointerProps {
  onBrowseHomes?: () => void;
}

/**
 * Points at the report flow that actually works.
 *
 * This replaces `SupportIssueFormMockup`, which was the most harmful piece of
 * dead UI in the app. It was a pixel-accurate imitation of the real report
 * form -- the same ten reasons that map to the `listing_reports.reason` CHECK
 * constraint, a description field, a contact field -- and its submit button
 * said "Submit locally", then toasted "Support issue submitted locally. Real
 * support tools will be added later."
 *
 * Nothing was sent. A user reporting a scam request through it would believe
 * they had reported it. In a product whose purpose is preventing rental scams,
 * a form that silently absorbs a safety report is worse than no form: it
 * converts someone who was about to act into someone who thinks they already
 * did.
 *
 * The real path has existed the whole time. `submitListingReport` inserts into
 * `listing_reports` under RLS (`reporter_id = auth.uid() and status = 'new'`),
 * admins read those rows, and `ReportListingPanel` on the listing page is the
 * form. It needs the listing's id, which is exactly why it lives there and not
 * here.
 */
export default function SupportReportPointer({ onBrowseHomes }: SupportReportPointerProps) {
  const m = useMotion();

  return (
    <section className="rounded-3xl border border-neutral-150/70 dark:border-stone-800/70 bg-white dark:bg-stone-900 p-5 shadow-2xs">
      <h2 className="text-2xs font-black uppercase tracking-wider text-neutral-700 dark:text-stone-300">
        Reporting a listing
      </h2>

      <p className="mt-2.5 text-xs font-medium leading-relaxed text-neutral-600 dark:text-stone-300">
        Open the listing you want to report and use{' '}
        <span className="inline-flex items-center gap-1 font-bold text-neutral-850 dark:text-stone-100">
          <Flag className="h-3 w-3 stroke-[2.4]" aria-hidden="true" />
          Report listing
        </span>
        . It reaches the KejaFinder team, who review it and can take the listing
        down — reporting from the listing itself is what tells us which house you
        mean.
      </p>

      {onBrowseHomes && (
        <motion.button
          type="button"
          whileTap={m.tap}
          onClick={onBrowseHomes}
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 text-2xs font-black uppercase tracking-wider text-white transition-colors hover:bg-emerald-800 outline-none cursor-pointer"
        >
          Find the listing
          <ArrowRight className="h-3.5 w-3.5 stroke-[2.4]" aria-hidden="true" />
        </motion.button>
      )}
    </section>
  );
}
