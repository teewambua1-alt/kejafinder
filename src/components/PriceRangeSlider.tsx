import React from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  formatValue?: (value: number) => string;
  /**
   * What is being ranged, lowercase and singular -- "rent", "deposit".
   * The thumb labels were hardcoded to "Minimum rent"/"Maximum rent", so a
   * second instance of this slider announced itself as a rent control.
   */
  ariaLabel?: string;
}

/**
 * Dual-thumb range slider built from two overlapping native range inputs
 * (no slider dependency) -- each input only ever moves its own thumb, and
 * the highlighted track between them is a separate absolutely-positioned
 * div driven by the same values.
 */
export default function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  step = 500,
  formatValue = (v) => `KSh ${v.toLocaleString()}`,
  ariaLabel = 'rent',
}: PriceRangeSliderProps) {
  const [lowValue, highValue] = value;
  const range = Math.max(max - min, 1);
  const lowPct = ((lowValue - min) / range) * 100;
  const highPct = ((highValue - min) / range) * 100;

  const handleLowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Math.min(Number(e.target.value), highValue - step);
    onChange([next, highValue]);
  };

  const handleHighChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Math.max(Number(e.target.value), lowValue + step);
    onChange([lowValue, next]);
  };

  const thumbClass =
    'absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:dark:border-stone-900 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md';

  return (
    <div className="w-full pt-1 pb-2">
      <div className="relative h-5 flex items-center">
        {/* Base track */}
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-neutral-150 dark:bg-stone-800" />
        {/* Highlighted range between the two thumbs */}
        <div
          className="absolute h-1.5 rounded-full bg-emerald-700"
          style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
        />
        <input
          type="range"
          aria-label={`Minimum ${ariaLabel}`}
          aria-valuetext={formatValue(lowValue)}
          min={min}
          max={max}
          step={step}
          value={lowValue}
          onChange={handleLowChange}
          className={thumbClass}
          style={{ zIndex: lowValue > max - step ? 5 : 3 }}
        />
        <input
          type="range"
          aria-label={`Maximum ${ariaLabel}`}
          aria-valuetext={formatValue(highValue)}
          min={min}
          max={max}
          step={step}
          value={highValue}
          onChange={handleHighChange}
          className={thumbClass}
          style={{ zIndex: 4 }}
        />
      </div>
      <div className="flex items-center justify-between mt-2.5">
        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-150">{formatValue(lowValue)}</span>
        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-150">{formatValue(highValue)}</span>
      </div>
    </div>
  );
}
