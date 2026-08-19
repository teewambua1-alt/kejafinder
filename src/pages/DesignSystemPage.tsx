import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Heart, Bookmark, Home as HomeIcon, MapPin, Wallet, CalendarDays, Search } from 'lucide-react';
import { Button, Input, Card, Chip, Badge, Skeleton, EmptyState, ErrorState } from '../components/ui';

interface DesignSystemPageProps {
  onBack: () => void;
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-xs font-black text-neutral-800 dark:text-stone-100 uppercase tracking-widest">{title}</h2>
        {description && <p className="text-[10.5px] font-semibold text-neutral-550 dark:text-stone-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function Swatch({ name, className, hex }: { name: string; className: string; hex?: string }) {
  return (
    <div className="flex flex-col space-y-1.5">
      <div className={`w-full h-14 rounded-xl border border-neutral-200/50 dark:border-stone-800/50 ${className}`} />
      <div>
        <p className="text-[10px] font-black text-neutral-800 dark:text-stone-200">{name}</p>
        {hex && <p className="text-[9px] font-semibold text-neutral-550 dark:text-stone-500 font-mono">{hex}</p>}
      </div>
    </div>
  );
}

export default function DesignSystemPage({ onBack }: DesignSystemPageProps) {
  const [selectedChip, setSelectedChip] = useState('location');
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex-1 flex flex-col pb-32 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-stone-850 flex items-center justify-center text-neutral-600 dark:text-stone-300 cursor-pointer outline-none"
        >
          <ChevronLeft className="w-4.5 h-4.5 stroke-[2.2]" />
        </button>
        <div>
          <h1 className="text-sm font-black text-neutral-850 dark:text-stone-100 uppercase tracking-wider leading-none">
            Design System
          </h1>
          <p className="text-[10px] font-semibold text-neutral-550 dark:text-stone-500 mt-1">
            Phase 1 -- tokens and reusable primitives. Dev-only reference, not a public route.
          </p>
        </div>
      </div>

      <div className="space-y-9">
        {/* Colors */}
        <Section title="Color Palette" description="Emerald primary, warm orange accent, off-white/charcoal surfaces.">
          <div className="grid grid-cols-3 gap-3">
            <Swatch name="Primary" className="bg-emerald-600" hex="emerald-600" />
            <Swatch name="Primary Hover" className="bg-emerald-700" hex="emerald-700" />
            <Swatch name="Primary Light" className="bg-emerald-50" hex="emerald-50" />
            <Swatch name="Accent" className="bg-orange-500" hex="orange-500" />
            <Swatch name="Accent Hover" className="bg-orange-600" hex="orange-600" />
            <Swatch name="Accent Light" className="bg-orange-50" hex="orange-50" />
            <Swatch name="Surface" className="bg-white" hex="#ffffff" />
            <Swatch name="Surface Muted" className="bg-[#f7fee7]" hex="#f7fee7" />
            <Swatch name="Charcoal Text" className="bg-neutral-850" hex="neutral-850" />
          </div>
          <div className="grid grid-cols-4 gap-3 pt-1">
            <Swatch name="Success" className="bg-emerald-600" />
            <Swatch name="Warning" className="bg-orange-500" />
            <Swatch name="Danger" className="bg-red-500" hex="red-500" />
            <Swatch name="Info" className="bg-blue-500" hex="blue-500" />
          </div>
        </Section>

        {/* Typography */}
        <Section title="Typography" description="Inter (body), Space Grotesk (display). New text-3xs/text-2xs fill the gap below Tailwind's default text-xs.">
          <Card className="space-y-3">
            <p className="text-3xs font-black uppercase tracking-widest text-neutral-500 dark:text-stone-400">text-3xs -- 8px micro labels</p>
            <p className="text-2xs font-black uppercase tracking-widest text-neutral-600 dark:text-stone-300">text-2xs -- 10px badges &amp; meta</p>
            <p className="text-xs font-bold text-neutral-700 dark:text-stone-200">text-xs -- 12px (Tailwind default) body captions</p>
            <p className="text-sm font-bold text-neutral-800 dark:text-stone-100">text-sm -- 14px (Tailwind default) body text</p>
            <p className="text-lg font-extrabold text-neutral-850 dark:text-stone-50">text-lg -- section titles</p>
            <p className="text-2xl font-black font-display text-neutral-850 dark:text-stone-50">text-2xl -- display headings</p>
          </Card>
        </Section>

        {/* Spacing */}
        <Section title="Spacing (8px system)" description="Prefer Tailwind's default even steps -- new work should not add more fractional tokens.">
          <div className="flex items-end space-x-3">
            {[2, 3, 4, 6, 8, 10, 12].map((n) => (
              <div key={n} className="flex flex-col items-center space-y-1">
                <div className={`w-4 bg-emerald-500/70 rounded-sm`} style={{ height: `${n * 4}px` }} />
                <span className="text-[9px] font-bold text-neutral-550 dark:text-stone-500">{n * 4}px</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Buttons */}
        <Section title="Buttons" description="Five variants, three sizes. Wraps motion.button with the existing tap feel.">
          <Card className="space-y-3">
            <div className="flex flex-wrap gap-2.5">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Button icon={Heart} variant="secondary">With icon</Button>
              <Button icon={Search} iconPosition="right" variant="outline">Icon right</Button>
            </div>
          </Card>
        </Section>

        {/* Inputs */}
        <Section title="Inputs">
          <Card className="space-y-4">
            <Input
              label="Rent (Monthly)"
              required
              prefix="KSh"
              placeholder="Enter monthly rent"
              inputMode="numeric"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input label="Contact phone" placeholder="07XX XXX XXX" error="Enter a valid phone number." />
            <Input label="Estate" placeholder="e.g. Parklands" hint="Helps renters find the exact place." />
          </Card>
        </Section>

        {/* Cards */}
        <Section title="Cards">
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <p className="text-xs font-black text-neutral-800 dark:text-stone-100">Default card</p>
              <p className="text-[10px] font-semibold text-neutral-550 dark:text-stone-500 mt-1">Static surface</p>
            </Card>
            <Card interactive onClick={() => {}}>
              <p className="text-xs font-black text-neutral-800 dark:text-stone-100">Interactive card</p>
              <p className="text-[10px] font-semibold text-neutral-550 dark:text-stone-500 mt-1">Hover / tap me</p>
            </Card>
          </div>
        </Section>

        {/* Chips */}
        <Section title="Chips">
          <div className="flex items-center space-x-2.5 overflow-x-auto no-scrollbar py-1">
            <Chip label="Location" icon={MapPin} selected={selectedChip === 'location'} onClick={() => setSelectedChip('location')} />
            <Chip label="House Type" icon={HomeIcon} selected={selectedChip === 'house-type'} onClick={() => setSelectedChip('house-type')} />
            <Chip label="Budget" icon={Wallet} selected={selectedChip === 'budget'} onClick={() => setSelectedChip('budget')} />
            <Chip label="Available Now" icon={CalendarDays} selected={selectedChip === 'available'} onClick={() => setSelectedChip('available')} />
          </div>
        </Section>

        {/* Badges */}
        <Section title="Badges">
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">Verified</Badge>
            <Badge variant="warning">Pending Review</Badge>
            <Badge variant="danger">Rejected</Badge>
            <Badge variant="info">New</Badge>
            <Badge variant="neutral">Draft</Badge>
          </div>
        </Section>

        {/* Shadows & Radius */}
        <Section title="Shadows &amp; Radius">
          <div className="grid grid-cols-3 gap-3">
            {(['shadow-5xs', 'shadow-4xs', 'shadow-3xs', 'shadow-2xs', 'shadow-xs', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-2xl'] as const).map((s) => (
              <div key={s} className={`h-14 rounded-xl bg-white dark:bg-stone-900 flex items-center justify-center text-[9px] font-bold text-neutral-500 dark:text-stone-400 ${s}`}>
                {s}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3 pt-1">
            {(['rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-2.5xl', 'rounded-3xl', 'rounded-full'] as const).map((r) => (
              <div key={r} className={`h-14 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-[8px] font-bold text-emerald-700 dark:text-emerald-400 ${r}`}>
                {r}
              </div>
            ))}
          </div>
        </Section>

        {/* Loading skeletons */}
        <Section title="Loading Skeletons">
          <Card className="space-y-2.5">
            <div className="flex items-center space-x-3">
              <Skeleton variant="circle" className="w-10 h-10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-1/2 h-3.5" />
                <Skeleton className="w-1/3 h-3" />
              </div>
            </div>
            <Skeleton className="w-full h-24" />
          </Card>
        </Section>

        {/* Empty state */}
        <Section title="Empty State">
          <EmptyState
            icon={Bookmark}
            title="No saved homes yet"
            description="Tap the heart on homes you like and they'll appear here."
            primaryAction={{ label: 'Browse homes', onClick: () => {}, icon: Search }}
          />
        </Section>

        {/* Error state */}
        <Section title="Error State">
          <ErrorState onRetry={() => {}} />
        </Section>
      </div>
    </div>
  );
}
