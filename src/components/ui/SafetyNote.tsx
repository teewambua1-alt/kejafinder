import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/cn';

interface SafetyNoteProps {
  /** Overrides the canonical wording. Use only when the context needs different advice. */
  children?: React.ReactNode;
  /** `inline` drops the card chrome for use inside an existing card. */
  variant?: 'card' | 'inline';
  className?: string;
}

/**
 * The deposit rule. One component, one wording, one place.
 *
 * This sentence was written out in **19 separate files**, and the repetition
 * was not spread thin -- measured in the browser it rendered **16 times on the
 * Safety page** and **10 times on About**. Past about the third repeat a
 * warning stops being read; by the sixteenth it is wallpaper. In a product
 * whose whole purpose is preventing rental scams, that is the most expensive
 * possible thing to make invisible.
 *
 * Two shared components already existed and neither was adopted widely:
 * `AuthSafetyNote` (auth only) and a `SafetyNote` inside
 * `components/listing/parts.tsx` (detail page only), each with slightly
 * different wording. Both now re-export this.
 *
 * The rule for using it: **once per decision point, not once per section.**
 * A page about safety should state it once at the top; a listing states it
 * where the money decision happens; a signup flow states it where the account
 * is created. A section that merely *mentions* deposits does not get its own
 * copy.
 */
export const DEPOSIT_WARNING =
  'Never send a deposit before you have seen the house in person and confirmed the caretaker or landlord. KejaFinder never collects deposits.';

export default function SafetyNote({ children, variant = 'card', className }: SafetyNoteProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3',
        variant === 'card' &&
          'rounded-2xl border border-orange-200/60 dark:border-orange-900/40 bg-orange-50/80 dark:bg-orange-950/20 p-4',
        className
      )}
    >
      <AlertTriangle
        className="mt-0.5 h-4.5 w-4.5 shrink-0 text-orange-700 dark:text-orange-400 stroke-[2.2]"
        aria-hidden="true"
      />
      <p className="text-xs font-semibold leading-relaxed text-orange-800 dark:text-orange-300">
        {children ?? DEPOSIT_WARNING}
      </p>
    </div>
  );
}
