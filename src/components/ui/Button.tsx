import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  // Narrowed from HTMLMotionProps, which also permits MotionValue children.
  // A button label is text or nodes -- never an animated value -- and the
  // wider type made the <span> wrapper below unassignable.
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm shadow-emerald-500/15 border border-transparent',
  secondary:
    'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40',
  outline:
    'bg-white/50 dark:bg-stone-850/40 hover:bg-emerald-500/5 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20',
  ghost:
    'bg-transparent hover:bg-neutral-100 dark:hover:bg-stone-850/60 text-neutral-700 dark:text-stone-300 border border-transparent',
  danger:
    'bg-orange-700 hover:bg-orange-800 text-white shadow-sm shadow-orange-500/15 border border-transparent',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-[11px] gap-1.5 rounded-xl',
  md: 'h-11 px-4 text-xs gap-2 rounded-2xl',
  lg: 'h-13 px-5 text-sm gap-2 rounded-2xl',
};

const ICON_SIZE: Record<ButtonSize, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-4.5 h-4.5',
};

/**
 * Base button primitive. Wraps motion.button with the tap/press feel already
 * used everywhere in the app, plus the five variants that cover the button
 * styles found across existing screens (primary CTA, secondary/tinted,
 * outline, ghost/text, danger). Prefer this over hand-rolled button classes
 * in new or updated screens.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.97 }}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center font-extrabold uppercase tracking-wider font-sans transition-colors cursor-pointer outline-none select-none',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className={cn(ICON_SIZE[size], 'stroke-[2.2] shrink-0')} />}
      {children && <span>{children}</span>}
      {Icon && iconPosition === 'right' && <Icon className={cn(ICON_SIZE[size], 'stroke-[2.2] shrink-0')} />}
    </motion.button>
  );
}
