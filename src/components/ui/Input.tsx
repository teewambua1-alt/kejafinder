import React, { useId, forwardRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

interface InputProps {
  label?: string;
  /**
   * Keep the label as the accessible name but hide it visually. For fields
   * whose purpose is obvious from context (a search bar), where a visible
   * label is noise -- but where a placeholder alone is not a label.
   */
  hideLabel?: boolean;
  error?: string;
  hint?: string;
  /** Short text sigil inside the field, e.g. "KSh" or "+254". */
  prefix?: string;
  /** Leading icon inside the field. Decorative -- the label carries meaning. */
  icon?: LucideIcon;
  /** Trailing control, e.g. a password reveal or clear button. */
  trailing?: React.ReactNode;
  required?: boolean;
  id?: string;
  name?: string;
  type?: string;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'search' | 'url' | 'none';
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  spellCheck?: boolean;
  /** Labels the mobile keyboard's action key: "search", "go", "done"... */
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
  maxLength?: number;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * Base text input. Already carried label/error/hint wiring with proper
 * htmlFor + aria-invalid + aria-describedby; this adds what the auth and
 * search screens needed before they could adopt it instead of hand-rolling
 * their own fields:
 *
 *  - an icon slot and a trailing slot (search fields, password reveal)
 *  - role="alert" on the error, so a validation failure is actually announced
 *    rather than only appearing visually
 *  - forwarded ref and onKeyDown, for focus management and Enter handling
 *  - autoComplete / spellCheck passthrough (the whole app had exactly one
 *    autoComplete attribute before this)
 */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hideLabel, error, hint, prefix, icon: Icon, trailing, required, id, className, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = !error && hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none',
            hideLabel && 'sr-only'
          )}
        >
          {label}{' '}
          {required && (
            <span className="text-emerald-700 dark:text-emerald-450" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <Icon
            className="absolute left-4 w-4.5 h-4.5 text-neutral-550 dark:text-stone-400 pointer-events-none stroke-[2.2]"
            aria-hidden="true"
          />
        )}
        {prefix && !Icon && (
          <span className="absolute left-4 text-xs font-black text-neutral-550 dark:text-stone-400 pointer-events-none select-none tracking-tight font-sans">
            {prefix}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={errorId || hintId}
          className={cn(
            'w-full h-12 px-4 bg-white/50 dark:bg-stone-850/40 rounded-2xl border text-sm font-extrabold text-neutral-800 dark:text-stone-100 tracking-wide placeholder-neutral-550 dark:placeholder-stone-600 focus:outline-hidden focus:ring-2 focus:bg-white dark:focus:bg-stone-900 transition-[border-color,box-shadow,background-color] duration-200',
            (prefix || Icon) && 'pl-12',
            trailing && 'pr-12',
            error
              ? 'border-red-400 dark:border-red-900/80 focus:ring-red-500/20'
              : 'border-neutral-100 dark:border-neutral-800/80 focus:border-emerald-500/80 focus:ring-emerald-500/20',
            className
          )}
          {...props}
        />

        {trailing && <div className="absolute right-2 flex items-center">{trailing}</div>}
      </div>

      {error && (
        <span
          id={errorId}
          role="alert"
          className="text-[10px] font-bold text-red-500 pl-1 uppercase tracking-wider"
        >
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={hintId} className="text-[10px] font-semibold text-neutral-550 dark:text-stone-400 pl-1">
          {hint}
        </span>
      )}
    </div>
  );
});

export default Input;
