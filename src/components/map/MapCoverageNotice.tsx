import { MapPinOff } from 'lucide-react';

interface MapCoverageNoticeProps {
  plotted: number;
  total: number;
}

/**
 * Honest disclosure of what the map is not showing.
 *
 * The map used to hash each listing id into a stable offset around Nairobi, so
 * a house with no coordinates still got a pin -- deterministic, and completely
 * wrong. Removing that is right, but it turns "convincingly wrong" into
 * "visibly incomplete", which reads as a regression to anyone who did not know
 * it was fake. So say the number out loud rather than let the user assume the
 * map is the whole result set.
 */
export default function MapCoverageNotice({ plotted, total }: MapCoverageNoticeProps) {
  const missing = total - plotted;
  if (missing <= 0) return null;

  return (
    <div
      className="pointer-events-none flex items-center gap-2 rounded-2xl border border-orange-200/70 dark:border-orange-900/50 bg-surface/95 dark:bg-stone-900/95 px-3 py-2 shadow-md"
      role="status"
    >
      <MapPinOff className="w-4 h-4 text-orange-700 dark:text-orange-400 shrink-0 stroke-[2.2]" aria-hidden="true" />
      <p className="text-2xs font-bold leading-snug text-neutral-700 dark:text-stone-300">
        {missing === total
          ? `None of these ${total} homes have a map pin yet`
          : `${missing} of ${total} homes don't have a map pin yet`}
      </p>
    </div>
  );
}
