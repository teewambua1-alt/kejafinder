import React from 'react';
import { motion } from 'motion/react';
import {
  User,
  HelpCircle,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { profileActions, ProfileAction } from '../data/profileData';
import { ProfileSettingsPanelType } from './ProfileSettingsPanel';

interface ProfileActionListProps {
  onOpenPanel: (panelType: ProfileSettingsPanelType) => void;
  onLogout?: () => void;
}

export default function ProfileActionList({ onOpenPanel, onLogout }: ProfileActionListProps) {
  // Icon mapping resolver
  const getIcon = (iconName: string, isDanger: boolean) => {
    const iconProps = {
      className: `w-4.5 h-4.5 ${isDanger ? 'text-orange-500' : 'text-emerald-555'} stroke-[2.2] shrink-0`
    };

    switch (iconName) {
      case 'User': return <User {...iconProps} />;
      case 'HelpCircle': return <HelpCircle {...iconProps} />;
      case 'LogOut': return <LogOut {...iconProps} />;
      default: return <User {...iconProps} />;
    }
  };

  // Group actions by category
  const accountCategoryActions = profileActions.filter(action => action.category === 'account');
  const supportCategoryActions = profileActions.filter(action => action.category === 'support');

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  const renderActionRow = (action: ProfileAction) => {
    const isDanger = action.type === 'danger';

    return (
      <motion.button
        key={action.id}
        variants={itemVariants}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          if (action.id === 'logout' && onLogout) {
            onLogout();
            return;
          }
          const panelType = action.id.replace(/-/g, '_') as ProfileSettingsPanelType;
          onOpenPanel(panelType);
        }}
        className="w-full p-4 flex items-center space-x-3.5 hover:bg-neutral-50/50 dark:hover:bg-stone-850/30 transition-all text-left cursor-pointer outline-none select-none"
        aria-label={`Open ${action.title}`}
      >
        {/* Rounded Icon circle */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
          isDanger 
            ? 'bg-orange-50 dark:bg-orange-950/10 border-orange-100 dark:border-orange-950/30' 
            : 'bg-emerald-50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-950/30'
        }`}>
          {getIcon(action.iconName, isDanger)}
        </div>

        {/* Text descriptions */}
        <div className="flex-1 min-w-0">
          <span className={`block text-[12.5px] font-black tracking-tight leading-snug ${
            isDanger ? 'text-orange-550 dark:text-orange-400' : 'text-neutral-800 dark:text-stone-100'
          }`}>
            {action.title}
          </span>
          <span className="block text-[10px] font-semibold text-neutral-400 dark:text-stone-500 leading-none mt-0.5 max-w-[230px] truncate">
            {action.description}
          </span>
        </div>

        {/* Action Right Indicator */}
        <ChevronRight className={`w-4.5 h-4.5 shrink-0 stroke-[2] ${
          isDanger ? 'text-orange-300 dark:text-orange-800' : 'text-neutral-400 dark:text-stone-600'
        }`} />
      </motion.button>
    );
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full space-y-5" 
      id="profile-action-preferences-lists"
    >
      {/* 1. Account & Preferences Card Container */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-black text-neutral-800 dark:text-stone-255 uppercase tracking-wider px-1">
          Account & Preferences
        </h3>
        
        <div className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-3xl overflow-hidden shadow-3xs">
          <div className="divide-y divide-neutral-100 dark:divide-stone-800/30">
            {accountCategoryActions.map(action => renderActionRow(action))}
          </div>
        </div>
      </div>

      {/* 2. Support Section */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-black text-neutral-800 dark:text-stone-255 uppercase tracking-wider px-1">
          Support & Security
        </h3>
        
        <div className="bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-3xl overflow-hidden shadow-3xs">
          <div className="divide-y divide-neutral-100 dark:divide-stone-800/30">
            {supportCategoryActions.map(action => renderActionRow(action))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
