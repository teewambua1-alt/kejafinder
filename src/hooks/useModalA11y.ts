import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared behavior for full-screen/sheet modals: Escape-to-close, a Tab focus
 * trap within the container, and body scroll lock while open. Callers still
 * add role="dialog" aria-modal="true" on the container themselves since
 * that's static markup, not runtime behavior.
 */
export function useModalA11y(isOpen: boolean, onClose: () => void) {
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * onClose is almost always an inline arrow at the call site, so its identity
   * changes on every parent render. With it in the dependency array the whole
   * effect tore down and re-ran: cleanup called `previouslyFocused.focus()`,
   * which yanked focus out of the open dialog and back to whatever opened it,
   * mid-interaction. Reading it through a ref makes the effect depend on
   * `isOpen` alone, which is the only thing that should drive it.
   */
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const container = containerRef.current;
    container?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !container) return;

      const nodeList: NodeListOf<HTMLElement> = container.querySelectorAll(FOCUSABLE_SELECTOR);
      const focusable: HTMLElement[] = [];
      nodeList.forEach((el) => {
        if (el.offsetParent !== null) focusable.push(el);
      });
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return containerRef;
}
