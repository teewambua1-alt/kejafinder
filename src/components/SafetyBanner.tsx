import React from 'react';
import { ShieldCheck } from 'lucide-react';

/**
 * One quiet line, at the foot of the home screen.
 *
 * This used to be a dismissible card with a decorative estate illustration, a
 * floating badge ornament and a close button -- three of the twenty-two
 * controls on the first screen, spent on something the user cannot act on yet.
 *
 * The message still matters (deposit scams are the problem this product
 * exists to reduce), and it is repeated where it is actually actionable: on
 * the listing's cost breakdown, beside the caretaker's phone number, in the
 * trust panel, and during sign-up. Here it is a reminder, not a dialog -- so
 * it no longer needs dismissing.
 */
export default function SafetyBanner() {
  return (
    <aside className="flex items-start gap-2.5 px-1 pb-2">
      <ShieldCheck
        className="w-4 h-4 text-emerald-600/70 dark:text-emerald-500/70 shrink-0 mt-px stroke-[2.2]"
        aria-hidden="true"
      />
      <p className="text-[11.5px] font-medium leading-relaxed text-neutral-550 dark:text-stone-400">
        Always view a house in person before paying anything. KejaFinder never
        collects deposits or fees.
      </p>
    </aside>
  );
}
