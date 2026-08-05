import React from 'react';
import { cn } from '../../lib/cn';

interface CardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  id?: string;
}

const PADDING_CLASSES = {
  none: '',
  sm: 'p-3.5',
  md: 'p-4',
  lg: 'p-4.5',
};

/**
 * Base surface container -- rounded-2xl white/dark card with the subtle
 * border+shadow combination used for almost every card-like block in the
 * app (listing cards, shortcut tiles, settings rows).
 */
export default function Card({ padding = 'md', interactive = false, className, children, onClick, id }: CardProps) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={cn(
        'bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-2xl shadow-3xs',
        PADDING_CLASSES[padding],
        interactive && 'transition-all hover:shadow-2xs hover:border-emerald-500/20 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
