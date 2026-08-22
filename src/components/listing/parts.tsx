import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * Shared pieces for the listing detail page.
 *
 * The page previously spread six components across roughly twenty cards, and
 * the same facts appeared in several of them: availability three times, the
 * landmark three times, water and electricity three times, the deposit warning
 * three times. Each component had decided independently what mattered, so the
 * duplication was structural rather than accidental.
 *
 * These parts exist so each section can only render one card, in one style,
 * and so "what this page shows" is answerable by reading five files instead of
 * six components' worth of nested markup.
 */

export const CARD =
  'bg-white dark:bg-stone-900 border border-neutral-150/70 dark:border-stone-800/70 rounded-3xl shadow-2xs';

/** One card, one heading. A section that needs two cards is a section too big. */
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn(CARD, 'p-5', className)}>{children}</section>;
}

/**
 * Small all-caps heading inside a card. `h2`, not `h3`: these sit directly
 * under the listing title's h1, and h1 -> h3 skips a level, which is exactly
 * what screen-reader heading navigation relies on being correct.
 */
export function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xs font-black uppercase tracking-wider text-neutral-700 dark:text-stone-300">
      {children}
    </h2>
  );
}

/**
 * Label/value row. The old page had three visually different ways of writing
 * exactly this — a two-column grid of chips, a list of bordered rows, and an
 * icon-circle list — sometimes for the same field.
 */
export function FactRow({
  icon: Icon, label, value, emphasis = false,
}: {
  icon: LucideIcon;
  label: string;
  value?: string | null;
  /** For money totals, which should read heavier than a spec. */
  emphasis?: boolean;
}) {
  const missing = !value;
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-neutral-100 dark:border-stone-800 last:border-0">
      <span className="flex min-w-0 items-center gap-2.5 text-xs font-semibold text-neutral-600 dark:text-stone-400">
        <Icon className="h-4 w-4 shrink-0 text-neutral-550 dark:text-stone-400 stroke-[2.2]" aria-hidden="true" />
        {label}
      </span>
      <span
        className={cn(
          'shrink-0 text-right',
          missing
            ? 'text-xs font-medium italic text-neutral-550 dark:text-stone-400'
            : emphasis
              ? 'text-sm font-black text-neutral-850 dark:text-stone-100'
              : 'text-xs font-bold text-neutral-800 dark:text-stone-200'
        )}
      >
        {/* Absent means the poster did not enter it. Say that, rather than
          * inventing a default the way this page used to. */}
        {value || 'Not specified'}
      </span>
    </div>
  );
}

export type PillTone = 'neutral' | 'positive' | 'caution';

const PILL_TONES: Record<PillTone, string> = {
  neutral: 'bg-neutral-100 dark:bg-stone-800 text-neutral-700 dark:text-stone-300 border-transparent',
  positive:
    'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20',
  caution:
    'bg-orange-50 dark:bg-orange-950/25 text-orange-700 dark:text-orange-400 border-orange-200/60 dark:border-orange-900/40',
};

export function Pill({
  children, tone = 'neutral', icon: Icon,
}: {
  children: React.ReactNode;
  tone?: PillTone;
  icon?: LucideIcon;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-2xs font-bold uppercase tracking-wider',
        PILL_TONES[tone]
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 stroke-[2.4]" aria-hidden="true" />}
      {children}
    </span>
  );
}

/** KSh, grouped, never a fabricated fallback. */
export function formatKES(amount: number): string {
  return `KSh ${amount.toLocaleString()}`;
}

/**
 * The deposit warning. It appeared verbatim in three separate cards on this
 * page (pricing, contact, trust) plus a fourth near-variant in the location
 * section. It is the most important sentence on the page, and repeating it
 * four times is how a warning becomes wallpaper — so it now appears once, in
 * the contact card, where the money decision actually happens.
 */
export function SafetyNote({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-orange-200/60 dark:border-orange-900/40 bg-orange-50/80 dark:bg-orange-950/20 p-4">
      <AlertTriangle
        className="mt-0.5 h-4.5 w-4.5 shrink-0 text-orange-700 dark:text-orange-400 stroke-[2.2]"
        aria-hidden="true"
      />
      <p className="text-xs font-semibold leading-relaxed text-orange-800 dark:text-orange-300">
        {children ??
          'Never send a deposit before you have seen the house in person and confirmed the caretaker or landlord. KejaFinder never collects deposits.'}
      </p>
    </div>
  );
}
