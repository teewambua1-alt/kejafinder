import React, { useId } from 'react';
import { cn } from '../../lib/cn';

interface InputProps {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: string;
  required?: boolean;
  id?: string;
  name?: string;
  type?: string;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'search' | 'url' | 'none';
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * Base text input primitive, codifying the label/field/error pattern
 * already used across the Post Vacancy wizard and auth forms (rounded-2xl
 * field, red border+ring on error, uppercase micro-label above).
 */
export default function Input({
  label,
  error,
  hint,
  prefix,
  required,
  id,
  className,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[11px] font-extrabold text-neutral-700 dark:text-stone-300 tracking-tight pl-0.5 select-none"
        >
          {label} {required && <span className="text-emerald-500 dark:text-emerald-450">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-4 text-xs font-black text-neutral-400 dark:text-stone-500 pointer-events-none select-none tracking-tight font-sans">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={cn(
            'w-full h-12 px-4 bg-white/50 dark:bg-stone-850/40 rounded-2xl border text-sm font-extrabold text-neutral-800 dark:text-stone-100 tracking-wide placeholder-neutral-400 dark:placeholder-stone-600 focus:outline-hidden focus:ring-2 focus:bg-white dark:focus:bg-stone-900 transition-all',
            prefix && 'pl-12',
            error
              ? 'border-red-400 dark:border-red-900/80 focus:ring-red-500/20'
              : 'border-neutral-100 dark:border-neutral-800/80 focus:border-emerald-500/80 focus:ring-emerald-500/20',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <span id={errorId} className="text-[10px] font-bold text-red-500 pl-1 uppercase tracking-wider">
          {error}
        </span>
      )}
      {!error && hint && (
        <span className="text-[10px] font-semibold text-neutral-550 dark:text-stone-500 pl-1">{hint}</span>
      )}
    </div>
  );
}
