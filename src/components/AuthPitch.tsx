import { motion } from 'motion/react';
import { Receipt, ShieldCheck, MapPin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMotion } from '../lib/motion';

/**
 * Why anyone should sign up. Extracted from the welcome step so it can be a
 * persistent left column at lg+ while the right column carries whichever step
 * the user is on.
 *
 * On desktop the auth flow previously centred a `max-w-md` form in 1440px of
 * empty page, under two stacked headers. Splitting the reason from the form is
 * how every serious signup screen fills that space: the argument stays visible
 * while you fill in the fields.
 *
 * The three reasons are the app's real differentiators, each backed by
 * something it actually does — the named move-in cost, the verification ladder,
 * and a map that admits when it has no pin. Generic feature names ("Save
 * homes", "Safety reminders") were what this replaced.
 */
export default function AuthPitch({ headingLevel = 'h1' }: { headingLevel?: 'h1' | 'p' }) {
  const m = useMotion();
  // On desktop this is decorative alongside the step's own h1, so the caller
  // can drop it out of the heading outline rather than create a second h1.
  const Heading = headingLevel;

  return (
    <motion.div variants={m.stagger(0.07)} initial="hidden" animate="show" className="flex flex-col gap-7">
      <motion.div variants={m.fadeUp}>
        <p className="text-2xs font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
          KejaFinder
        </p>
        <Heading className="mt-2.5 text-[30px] font-black leading-[1.08] tracking-tight text-neutral-850 dark:text-stone-50 lg:text-[38px]">
          Find a vacant house
          <br />
          without walking
          <br />
          plot to plot.
        </Heading>
        <p className="mt-3.5 max-w-sm text-sm font-medium leading-relaxed text-neutral-600 dark:text-stone-300">
          Real rooms, real caretakers, real prices — searchable by estate, budget
          and what is actually available today.
        </p>
      </motion.div>

      <motion.ul variants={m.fadeUp} className="flex max-w-sm flex-col gap-3.5">
        <Reason
          icon={Receipt}
          title="The full move-in cost"
          body="Rent, deposit, agent fee and viewing fee — named separately, before you travel."
        />
        <Reason
          icon={ShieldCheck}
          title="Caretakers you can check"
          body="Verification is a ladder, not a badge. You see which rung a listing has reached."
        />
        <Reason
          icon={MapPin}
          title="Map pins that mean something"
          body="A house with no pin says so, instead of guessing a location for you."
        />
      </motion.ul>

      <motion.p
        variants={m.fadeUp}
        className="max-w-sm border-t border-neutral-100 dark:border-stone-800 pt-5 text-2xs font-semibold leading-relaxed text-neutral-550 dark:text-stone-400"
      >
        <span className="text-neutral-800 dark:text-stone-200">KejaFinder never collects deposits.</span>{' '}
        Pay only after you have seen the house and confirmed the caretaker or landlord in person.
      </motion.p>
    </motion.div>
  );
}

function Reason({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <li className="flex items-start gap-3.5">
      <span
        className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
        aria-hidden="true"
      >
        <Icon className="h-4.5 w-4.5 stroke-[2.2]" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-black text-neutral-850 dark:text-stone-100">{title}</span>
        <span className="mt-0.5 block text-2xs font-medium leading-relaxed text-neutral-600 dark:text-stone-400">
          {body}
        </span>
      </span>
    </li>
  );
}
