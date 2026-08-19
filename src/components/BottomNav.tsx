import React, { useState } from 'react';
import { Home, Search, Plus, Heart, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function BottomNav({ activeTab: propActiveTab, onTabChange }: BottomNavProps = {}) {
  const [localActiveTab, setLocalActiveTab] = useState<string>('home');
  const { profile } = useAuth();

  const activeTab = propActiveTab !== undefined ? propActiveTab : localActiveTab;

  const handleTabClick = (id: string) => {
    if (onTabChange) {
      onTabChange(id);
    } else {
      setLocalActiveTab(id);
    }
  };

  // Only signed-in landlords/caretakers/agents/scouts can submit vacancies
  // (see usePostListingDraft) -- signed-out visitors and tenant accounts
  // don't get the tab at all.
  const canPost = !!profile && profile.role !== 'tenant';
  const navItems = [
    { id: 'home', label: 'Explore', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    ...(canPost ? [{ id: 'post', label: 'Post', icon: Plus }] : []),
    { id: 'saved', label: 'Saved', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const activeIndex = navItems.findIndex(i => i.id === activeTab) >= 0 ? navItems.findIndex(i => i.id === activeTab) : 0;
  const tabWidth = 100 / navItems.length;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none pb-[env(safe-area-inset-bottom,0px)]">
      {/* Background with animated curve */}
      <div className="absolute inset-x-0 bottom-0 h-[64px] drop-shadow-[0_-4px_16px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_-4px_16px_rgba(0,0,0,0.25)]">
        <motion.div 
          initial={false}
          animate={{ left: `${activeIndex * tabWidth}%` }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute top-0 bottom-0 w-[20%] text-white dark:text-stone-900 flex items-start justify-center"
        >
          {/* Left Wing overlay to extend background leftwards infinitely */}
          <div className="absolute right-[50%] mr-[50px] w-[1000px] h-[64px] bg-current" />
          
          {/* Exact Center Cutout SVG */}
          <svg width="100" height="64" viewBox="0 0 100 64" fill="currentColor" className="absolute top-0 left-1/2 -ml-[50px] w-[100px]">
             {/* Smooth U-shape curve matching the 48px floating circle with some padding */}
             <path d="M 0,0 C 15,0 20,5 26,16 C 36,40 64,40 74,16 C 80,5 85,0 100,0 V 64 H 0 Z" />
          </svg>
          
          {/* Right Wing overlay to extend background rightwards infinitely */}
          <div className="absolute left-[50%] ml-[50px] w-[1000px] h-[64px] bg-current" />
          
          {/* Sliding Active Circle */}
          <div className="absolute top-[-16px] left-1/2 -ml-[23px] w-[46px] h-[46px] rounded-full bg-emerald-600 dark:bg-emerald-500 shadow-lg shadow-emerald-500/30 flex items-center justify-center pointer-events-none z-20">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {React.createElement(navItems[activeIndex].icon, { className: "w-5 h-5 text-white stroke-[2.7]" })}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
        {/* Fill underneath the curve area all the way left/right */}
        <div className="absolute bottom-0 inset-x-0 h-[10px] bg-white dark:bg-stone-900" />
      </div>

      {/* Foreground Icons overlay */}
      <div className="flex items-center justify-between mx-auto relative h-[64px] rounded-t-3xl overflow-visible pointer-events-auto">
        {navItems.map((item) => {
          const IconComp = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className="relative flex flex-col items-center flex-grow h-full cursor-pointer outline-none border-none select-none bg-transparent"
              aria-label={item.label}
            >
              {/* Inactive Bottom Icon */}
              <motion.div
                initial={false}
                animate={isActive ? { y: 25, opacity: 0, scale: 0.5 } : { y: 22, opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute top-0 text-neutral-400 dark:text-stone-500"
              >
                <IconComp className="w-[22px] h-[22px] stroke-[2.2]" />
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
