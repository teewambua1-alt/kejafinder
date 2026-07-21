import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Home, LocateFixed, Train, Building2, Trees } from 'lucide-react';
import MapListToggle from './MapListToggle';

export default function SearchMapPreview() {
  const [activeView, setActiveView] = useState<'map' | 'list'>('map');

  // Staggered marker configuration for beautiful entrance effects
  const markerVariants: any = {
    hidden: { scale: 0, opacity: 0 },
    show: (customDelay: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 180,
        damping: 12,
        delay: customDelay,
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: 0.2 }}
      className="w-full"
    >
      {/* Outer Card Shell with soft shadow & glassy border */}
      <div className="w-full h-76 rounded-3xl bg-[#f2f7f2] dark:bg-[#151c14] border border-[#e5ebe4]/90 dark:border-[#20291e] shadow-xs relative overflow-hidden flex flex-col">
        
        {/* Floating Top Center segmented Toggle */}
        <div className="absolute top-3.5 left-1/2 transform -translate-x-1/2 z-20 pointer-events-auto">
          <MapListToggle activeView={activeView} onViewChange={setActiveView} />
        </div>

        {/* ----------------- MOCK MAP SECTION ----------------- */}
        <div className="absolute inset-0 w-full h-full select-none">
          {/* Subtle faint grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(200,225,200,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(200,225,200,0.1)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(50,80,50,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(50,80,50,0.08)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-60" />

          {/* Green parks (blurred soft spots) */}
          <div className="absolute w-40 h-40 bg-emerald-250/25 dark:bg-emerald-950/15 blur-[28px] rounded-full top-[4%] right-[10%] opacity-80" />
          <div className="absolute w-28 h-28 bg-emerald-200/20 dark:bg-emerald-950/10 blur-[24px] rounded-full bottom-[10%] left-[5%] opacity-70" />

          {/* Major Highway: Nairobi Expressway (Orange Slanting Line) */}
          <div className="absolute h-3.5 bg-[#fad8b6] dark:bg-[#4a3424] top-[68%] left-[-15%] w-[130%] rotate-[-21deg] shadow-3xs" />
          {/* Subtle Inner lane dashed line for highway */}
          <div className="absolute h-[1px] border-t border-dashed border-[#f1a45c]/50 dark:border-orange-500/20 top-[68%] left-[-15%] w-[130%] rotate-[-21deg]" />

          {/* Major Road: Katani Road (Light Grey/Teal slanted Line) */}
          <div className="absolute h-2 bg-[#e4e5e0] dark:bg-[#2c302a] top-[32%] left-[-10%] w-[125%] rotate-[18deg]" />

          {/* Secondary Crossing Roads */}
          <div className="absolute w-1.5 bg-[#e4e5e0] dark:bg-[#2c302a] left-[55%] top-[-10%] h-[120%] rotate-[-12deg]" />
          <div className="absolute w-1.5 bg-[#e4e5e0] dark:bg-[#2c302a] left-[22%] top-[-10%] h-[120%] rotate-[22deg]" />

          {/* ----------------- MAP LABELS ----------------- */}
          
          {/* "Nairobi Expy" label along highway */}
          <span className="absolute top-[51%] left-[24%] text-[8px] font-black text-orange-850/50 dark:text-orange-400/20 rotate-[-21deg] uppercase tracking-wider font-mono">
            Nairobi Expy
          </span>

          {/* "Katani Rd" label */}
          <span className="absolute top-[31%] left-[73%] text-[8px] font-black text-neutral-500/50 dark:text-stone-500/30 rotate-[18deg] uppercase tracking-wider font-mono">
            Katani Rd
          </span>

          {/* big "SYOKIMAU" town signature centered under background layers */}
          <div className="absolute top-[38%] left-1/2 transform -translate-x-1/2 text-[12px] font-black tracking-[0.25em] text-[#345344]/15 dark:text-[#a0bfaa]/10 uppercase font-sans">
            SYOKIMAU
          </div>

          {/* Landmark: Gateway Mall */}
          <div className="absolute top-[21%] left-[16%] flex items-center space-x-1 text-[8px] font-extrabold text-[#3a584c] dark:text-[#8eb1a3] tracking-wide bg-white/40 dark:bg-black/10 px-1.5 py-0.5 rounded-md backdrop-blur-3xs">
            <Building2 className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
            <span>Gateway Mall</span>
          </div>

          {/* Landmark: Syokimau Railway Station */}
          <div className="absolute top-[41%] right-[22%] flex items-center space-x-1 text-[8.5px] font-extrabold text-[#444] dark:text-[#bbb] tracking-wide bg-white/45 dark:bg-black/15 px-1.5 py-0.5 rounded-md backdrop-blur-3xs">
            <Train className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
            <span>Syokimau Railway Station</span>
          </div>

          {/* Landmark: Independence Gardens */}
          <div className="absolute top-[12%] right-[20%] flex flex-col items-end text-right">
            <div className="flex items-center space-x-0.5 text-[8.5px] font-black text-[#4f7051] dark:text-[#7ba17d] uppercase tracking-wider">
              <span>Independence</span>
              <Trees className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-[8px] text-[#4f7051]/85 dark:text-[#7ba17d]/80 font-bold -mt-0.5">Gardens</span>
          </div>

          {/* Landmark: TAJ CITY */}
          <span className="absolute top-[78%] left-[15%] text-[8px] font-black text-neutral-500/60 dark:text-stone-500/35 uppercase tracking-widest font-sans">
            TAJ CITY
          </span>

          {/* ----------------- CURRENT LOCATION INDICATOR ----------------- */}
          <div className="absolute top-[55%] left-[51%] transform -translate-x-1/2 -translate-y-1/2 flex h-4 w-4 z-10 pointer-events-none">
            {/* Pulsing ring */}
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500/40 opacity-75"></span>
            {/* Blue dot core with white stroke and glow */}
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white shadow-[0_0_8px_rgba(59,130,246,0.9)]"></span>
          </div>

          {/* ----------------- EMERALD LISTING PINS (Price Tags) ----------------- */}
          {/* Pin 1 - near Gateway Mall */}
          <motion.div
            custom={0.25}
            variants={markerVariants}
            initial="hidden"
            animate="show"
            className="absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-15"
          >
            <motion.div
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              title="Modern 2 Bedroom Apartment"
              className="px-2.5 py-1 rounded-xl bg-emerald-600 border-2 border-white dark:border-stone-900 shadow-md flex items-center space-x-1 cursor-pointer text-white hover:bg-emerald-500 transition-colors pointer-events-auto"
            >
              <Home className="w-3 h-3 text-white/90" />
              <span className="text-[9.5px] font-extrabold tracking-tight font-sans">KSh 35K</span>
            </motion.div>
          </motion.div>

          {/* Pin 2 - top-right sector */}
          <motion.div
            custom={0.35}
            variants={markerVariants}
            initial="hidden"
            animate="show"
            className="absolute top-[23%] left-[70%] -translate-x-1/2 -translate-y-1/2 z-15"
          >
            <motion.div
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              title="1 Bedroom near Gardens"
              className="px-2.5 py-1 rounded-xl bg-emerald-600 border-2 border-white dark:border-stone-900 shadow-md flex items-center space-x-1 cursor-pointer text-white hover:bg-emerald-500 transition-colors pointer-events-auto"
            >
              <Home className="w-3 h-3 text-white/90" />
              <span className="text-[9.5px] font-extrabold tracking-tight font-sans">KSh 22K</span>
            </motion.div>
          </motion.div>

          {/* Pin 3 - center focus */}
          <motion.div
            custom={0.45}
            variants={markerVariants}
            initial="hidden"
            animate="show"
            className="absolute top-[48%] left-[49%] -translate-x-1/2 -translate-y-1/2 z-15"
          >
            <motion.div
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              title="Syokimau Station Bedsitter"
              className="px-2.5 py-1 rounded-xl bg-emerald-600 border-2 border-white dark:border-stone-900 shadow-md flex items-center space-x-1 cursor-pointer text-white hover:bg-emerald-500 transition-colors pointer-events-auto"
            >
              <Home className="w-3 h-3 text-white/90" />
              <span className="text-[9.5px] font-extrabold tracking-tight font-sans">KSh 9.5K</span>
            </motion.div>
          </motion.div>

          {/* Pin 4 - bottom-left expressway limit */}
          <motion.div
            custom={0.55}
            variants={markerVariants}
            initial="hidden"
            animate="show"
            className="absolute top-[64%] left-[28%] -translate-x-1/2 -translate-y-1/2 z-15"
          >
            <motion.div
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              title="Expressway Studio"
              className="px-2.5 py-1 rounded-xl bg-emerald-600 border-2 border-white dark:border-stone-900 shadow-md flex items-center space-x-1 cursor-pointer text-white hover:bg-emerald-500 transition-colors pointer-events-auto"
            >
              <Home className="w-3 h-3 text-white/90" />
              <span className="text-[9.5px] font-extrabold tracking-tight font-sans">KSh 16K</span>
            </motion.div>
          </motion.div>

          {/* Pin 5 - lower sector */}
          <motion.div
            custom={0.65}
            variants={markerVariants}
            initial="hidden"
            animate="show"
            className="absolute top-[71%] left-[73%] -translate-x-1/2 -translate-y-1/2 z-15"
          >
            <motion.div
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              title="Taj City Mabati House"
              className="px-2.5 py-1 rounded-xl bg-emerald-600 border-2 border-white dark:border-stone-900 shadow-md flex items-center space-x-1 cursor-pointer text-white hover:bg-emerald-500 transition-colors pointer-events-auto"
            >
              <Home className="w-3 h-3 text-white/90" />
              <span className="text-[9.5px] font-extrabold tracking-tight font-sans">KSh 4K</span>
            </motion.div>
          </motion.div>

        </div>

        {/* ----------------- FLOATING LOCATE CONTROLLER ----------------- */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          aria-label="Use current location"
          className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full bg-white/95 dark:bg-stone-850/95 backdrop-blur-sm border border-neutral-150 dark:border-neutral-700/80 text-neutral-850 dark:text-neutral-200 flex items-center justify-center shadow-md cursor-pointer hover:bg-neutral-50 dark:hover:bg-stone-750 transition-colors pointer-events-auto z-20"
        >
          <LocateFixed className="w-4.5 h-4.5 stroke-[2.2] text-neutral-750 dark:text-stone-200" />
        </motion.button>

      </div>
    </motion.div>
  );
}
