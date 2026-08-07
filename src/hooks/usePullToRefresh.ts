import { useCallback, useRef, useState, TouchEvent } from 'react';

interface UsePullToRefreshOptions {
  enabled?: boolean;
  threshold?: number;
  maxPull?: number;
}

/**
 * Touch-gesture pull-to-refresh, active only when the gesture starts at
 * scrollTop 0 on the element the returned containerProps are spread onto --
 * so it never fights normal scrolling further down the page.
 */
export function usePullToRefresh(
  onRefresh: () => Promise<void> | void,
  { enabled = true, threshold = 64, maxPull = 100 }: UsePullToRefreshOptions = {}
) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef<number | null>(null);

  const onTouchStart = useCallback((e: TouchEvent<HTMLElement>) => {
    if (!enabled || isRefreshing) return;
    if (e.currentTarget.scrollTop > 0) {
      startY.current = null;
      return;
    }
    startY.current = e.touches[0].clientY;
  }, [enabled, isRefreshing]);

  const onTouchMove = useCallback((e: TouchEvent<HTMLElement>) => {
    if (!enabled || isRefreshing || startY.current === null) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta <= 0) {
      setPullDistance(0);
      return;
    }
    // Rubber-band resistance so the pull feels bounded, not linear.
    setPullDistance(Math.min(maxPull, delta * 0.5));
  }, [enabled, isRefreshing, maxPull]);

  const onTouchEnd = useCallback(async () => {
    if (!enabled || startY.current === null) return;
    const shouldRefresh = pullDistance >= threshold;
    startY.current = null;

    if (!shouldRefresh) {
      setPullDistance(0);
      return;
    }

    setPullDistance(threshold);
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
    }
  }, [enabled, pullDistance, threshold, onRefresh]);

  return {
    pullDistance,
    isRefreshing,
    threshold,
    containerProps: { onTouchStart, onTouchMove, onTouchEnd },
  };
}
