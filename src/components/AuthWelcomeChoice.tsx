import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Phone, 
  PlusCircle, 
  ShieldCheck, 
  UserPlus, 
  Search, 
  Users, 
  Briefcase, 
  Eye, 
  MapPin, 
  MessageCircle,
  AlertTriangle,
  Home
} from 'lucide-react';
import { AuthMode } from '../types/auth';

interface AuthWelcomeChoiceProps {
  onSetAuthMode: (mode: AuthMode) => void;
  onGoHome: () => void;
  onGoPost: () => void;
}

export default function AuthWelcomeChoice({
  onSetAuthMode,
  onGoHome,
  onGoPost
}: AuthWelcomeChoiceProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* 2. Main welcome content */}
      <motion.div variants={itemVariants} className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-neutral-200/60 dark:border-stone-800/60 rounded-3xl p-6 shadow-sm">
        <h2 className="text-2xl font-black text-neutral-850 dark:text-stone-100 tracking-tight leading-tight mb-2">
          Welcome to <span className="text-emerald-700 dark:text-emerald-400">KejaFinder</span>
        </h2>
        <p className="text-[13px] font-semibold text-neutral-600 dark:text-stone-300 mb-2">
          Find, save, and post vacant homes with trusted local details.
        </p>
        <p className="text-[11px] font-medium text-neutral-500 dark:text-stone-400">
          No more walking plot to plot. Search rooms by area, budget, and availability.
        </p>
      </motion.div>

      {/* 3. Trust/benefit highlights */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white/70 dark:bg-stone-900/70 border border-neutral-200/50 dark:border-stone-800/50 rounded-2xl p-3 flex items-center space-x-3 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
            <Heart className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          </div>
          <p className="text-xs font-bold text-neutral-700 dark:text-stone-200">Save homes</p>
        </div>
        <div className="bg-white/70 dark:bg-stone-900/70 border border-neutral-200/50 dark:border-stone-800/50 rounded-2xl p-3 flex items-center space-x-3 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          </div>
          <p className="text-xs font-bold text-neutral-700 dark:text-stone-200">Call or WhatsApp caretakers</p>
        </div>
        <div className="bg-white/70 dark:bg-stone-900/70 border border-neutral-200/50 dark:border-stone-800/50 rounded-2xl p-3 flex items-center space-x-3 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
            <PlusCircle className="w-4 h-4 text-orange-700 dark:text-orange-400" />
          </div>
          <p className="text-xs font-bold text-neutral-700 dark:text-stone-200">Post vacancies faster</p>
        </div>
        <div className="bg-white/70 dark:bg-stone-900/70 border border-neutral-200/50 dark:border-stone-800/50 rounded-2xl p-3 flex items-center space-x-3 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          </div>
          <p className="text-xs font-bold text-neutral-700 dark:text-stone-200">Safety reminders</p>
        </div>
      </motion.div>

      {/* 4. Primary auth actions */}
      <motion.div variants={itemVariants} className="space-y-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            onSetAuthMode('login');
          }}
          className="w-full flex items-center justify-center space-x-2 bg-emerald-700 dark:bg-emerald-700 text-white rounded-2xl py-3.5 px-4 shadow-md hover:shadow-lg transition-all"
          aria-label="Continue with email"
        >
          <UserPlus className="w-4 h-4" />
          <span className="text-[13px] font-black uppercase tracking-wider">Log in with Email</span>
        </motion.button>

        <div className="flex space-x-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              onSetAuthMode('signup');
            }}
            className="flex-1 flex items-center justify-center space-x-2 bg-white dark:bg-stone-900 text-neutral-700 dark:text-stone-200 border border-neutral-200 dark:border-stone-700 rounded-2xl py-3 px-3 hover:bg-neutral-50 dark:hover:bg-stone-800 transition-colors shadow-sm"
            aria-label="Create KejaFinder account"
          >
            <UserPlus className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Create account</span>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              onGoHome();
            }}
            className="flex-1 flex items-center justify-center space-x-2 bg-neutral-100 dark:bg-stone-800/50 text-neutral-600 dark:text-stone-300 border border-transparent rounded-2xl py-3 px-3 hover:bg-neutral-200 dark:hover:bg-stone-800 transition-colors"
            aria-label="Browse KejaFinder as guest"
          >
            <Search className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Browse as guest</span>
          </motion.button>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            onGoPost();
          }}
          className="w-full flex items-center justify-center space-x-2 bg-orange-50/50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border border-orange-200/50 dark:border-orange-900/30 rounded-2xl py-3 px-4 hover:bg-orange-100/50 dark:hover:bg-orange-900/40 transition-colors"
          aria-label="Post a vacancy"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Post a vacancy</span>
        </motion.button>
      </motion.div>

      {/* 5. Account roles teaser */}
      <motion.div variants={itemVariants} className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-neutral-200/60 dark:border-stone-800/60 rounded-3xl p-5 shadow-sm">
        <h3 className="text-[11px] font-black text-neutral-800 dark:text-stone-200 uppercase tracking-widest mb-3 border-b border-neutral-100 dark:border-stone-800 pb-2">
          Who can use KejaFinder?
        </h3>
        <ul className="space-y-2.5">
          <li className="flex items-center space-x-3">
            <Users className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-neutral-600 dark:text-stone-300">
              <strong className="text-neutral-800 dark:text-stone-200">Tenants</strong> searching for homes
            </span>
          </li>
          <li className="flex items-center space-x-3">
            <Home className="w-4 h-4 text-orange-700 dark:text-orange-400 shrink-0" />
            <span className="text-xs font-semibold text-neutral-600 dark:text-stone-300">
              <strong className="text-neutral-800 dark:text-stone-200">Landlords</strong> posting vacancies
            </span>
          </li>
          <li className="flex items-center space-x-3">
            <Phone className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />
            <span className="text-xs font-semibold text-neutral-600 dark:text-stone-300">
              <strong className="text-neutral-800 dark:text-stone-200">Caretakers</strong> managing rooms
            </span>
          </li>
          <li className="flex items-center space-x-3">
            <Briefcase className="w-4 h-4 text-purple-500 dark:text-purple-400 shrink-0" />
            <span className="text-xs font-semibold text-neutral-600 dark:text-stone-300">
              <strong className="text-neutral-800 dark:text-stone-200">Agents</strong> with clear fees
            </span>
          </li>
          <li className="flex items-center space-x-3">
            <Eye className="w-4 h-4 text-teal-500 dark:text-teal-400 shrink-0" />
            <span className="text-xs font-semibold text-neutral-600 dark:text-stone-300">
              <strong className="text-neutral-800 dark:text-stone-200">Area scouts</strong> checking listings
            </span>
          </li>
        </ul>
      </motion.div>

      {/* 6. Safety note */}
      <motion.div variants={itemVariants} className="bg-orange-50/80 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 rounded-2xl p-4 flex items-start space-x-3 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-orange-700 dark:text-orange-400 shrink-0 mt-0.5" />
        <p className="text-[11px] font-semibold text-orange-800 dark:text-orange-300 leading-snug">
          Never send deposit before physically viewing the house and confirming the caretaker or landlord.
        </p>
      </motion.div>
    </motion.div>
  );
}
