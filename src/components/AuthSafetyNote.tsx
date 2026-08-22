import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * The deposit warning. This exact block was copy-pasted into five auth
 * screens with slightly drifting markup each time; it lives here once so the
 * wording can't diverge between steps.
 */
export default function AuthSafetyNote({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-orange-200/60 dark:border-orange-900/40 bg-orange-50/80 dark:bg-orange-950/20 p-4">
      <AlertTriangle
        className="w-4.5 h-4.5 text-orange-700 dark:text-orange-400 shrink-0 mt-0.5 stroke-[2.2]"
        aria-hidden="true"
      />
      <p className="text-[11.5px] font-semibold leading-relaxed text-orange-800 dark:text-orange-300">
        {children ??
          'Never send a deposit before you have seen the house in person and confirmed the caretaker or landlord.'}
      </p>
    </div>
  );
}
