import React, { useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { X } from 'lucide-react';
import { useModalA11y } from '../../hooks/useModalA11y';
import { useMotion } from '../../lib/motion';
import { cn } from '../../lib/cn';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  /** Accessible name for the dialog. Also rendered as the visible title unless `hideTitle`. */
  title: string;
  hideTitle?: boolean;
  children: React.ReactNode;
  /** Pinned to the bottom, outside the scroll area (e.g. an Apply button). */
  footer?: React.ReactNode;
  /** Header slot left of the title, for a back button in multi-step sheets. */
  leading?: React.ReactNode;
  /** Sheet height cap. Defaults to 82% of the viewport. */
  maxHeight?: string;
  className?: string;
}

/**
 * Bottom sheet, extracted from SearchFilterSheet which was the only one of the
 * app's three sheets that got the details right. ProfileSettingsPanel had no
 * focus trap, no Escape handling and no scroll lock at all; ReportListingPanel
 * had its own partial copy. One implementation now carries:
 *
 *  - focus trap + Escape + body scroll lock + focus restore (useModalA11y)
 *  - drag-to-dismiss from the grab handle only, so dragging inside the body
 *    scrolls instead of closing
 *  - overscroll containment, so scrolling past the end doesn't chain to the
 *    page behind
 *  - safe-area padding on the footer, for the iOS home indicator
 *  - reduced-motion support: the sheet appears without travelling
 */
export default function Sheet({
  isOpen,
  onClose,
  title,
  hideTitle = false,
  children,
  footer,
  leading,
  maxHeight = '82%',
  className,
}: SheetProps) {
  const containerRef = useModalA11y(isOpen, onClose);
  const dragControls = useDragControls();
  const m = useMotion();
  const titleId = useRef(`sheet-${Math.random().toString(36).slice(2, 9)}`).current;

  const handleDragEnd = (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
    if (info.offset.y > 120 || info.velocity.y > 600) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: m.duration.fast }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[var(--z-overlay)]"
            aria-hidden="true"
          />

          <motion.div
            ref={containerRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={m.reduce ? { opacity: 0 } : { y: '100%' }}
            animate={m.reduce ? { opacity: 1 } : { y: 0 }}
            exit={m.reduce ? { opacity: 0 } : { y: '100%' }}
            transition={m.spring.sheet}
            drag={m.reduce ? false : 'y'}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 500 }}
            dragSnapToOrigin
            onDragEnd={handleDragEnd}
            style={{ maxHeight }}
            className={cn(
              'fixed inset-x-0 bottom-0 z-[var(--z-overlay)] flex flex-col outline-none',
              'bg-white dark:bg-stone-900 rounded-t-3xl border-t border-neutral-100 dark:border-neutral-800',
              'shadow-[0_-8px_32px_rgba(0,0,0,0.15)] overflow-hidden font-sans',
              className
            )}
          >
            <div className="shrink-0 pt-3 pb-2">
              <div
                onPointerDown={(e) => dragControls.start(e)}
                className="w-12 h-1.5 bg-neutral-200 dark:bg-neutral-700/80 rounded-full mx-auto cursor-grab active:cursor-grabbing touch-none"
                aria-hidden="true"
              />
              <div className="flex items-center justify-between px-6 mt-3 gap-2">
                {leading}
                <h2
                  id={titleId}
                  className={cn(
                    'text-[17px] font-extrabold text-neutral-850 dark:text-neutral-50 tracking-tight min-w-0',
                    hideTitle && 'sr-only'
                  )}
                >
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={`Close ${title.toLowerCase()}`}
                  className="w-10 h-10 shrink-0 ml-auto rounded-full bg-neutral-50 dark:bg-stone-850 hover:bg-neutral-100 dark:hover:bg-stone-800 flex items-center justify-center transition-colors border-none cursor-pointer outline-none"
                >
                  <X className="w-4 h-4 text-neutral-500 dark:text-neutral-400 stroke-[2.2]" />
                </button>
              </div>
            </div>

            <div data-sheet-scroll className="flex-1 overflow-y-auto no-scrollbar px-6 py-4">
              {children}
            </div>

            {footer && (
              <div className="shrink-0 border-t border-neutral-100 dark:border-stone-800 px-6 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-white dark:bg-stone-900">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
