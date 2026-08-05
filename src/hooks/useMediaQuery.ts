import { useState, useEffect } from 'react';

// Used sparingly -- most responsive behavior in this app is plain CSS
// breakpoint classes. This exists specifically for cases where React needs
// to know the breakpoint to decide whether to MOUNT something (e.g. the
// desktop split-view map), not just to restyle something already mounted.
// Mounting a Leaflet map into a zero-size (CSS display:none) container and
// only later making it visible is a known source of broken/blank tiles.
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = () => setMatches(mediaQueryList.matches);
    listener();
    mediaQueryList.addEventListener('change', listener);
    return () => mediaQueryList.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
