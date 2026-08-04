import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  Pencil, 
  ShieldCheck, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileIdentityCardProps {
  profileMode?: "renter" | "poster";
}

export default function ProfileIdentityCard({ profileMode = "renter" }: ProfileIdentityCardProps) {
  const { profile, firebaseUser } = useAuth();
  const [showToast, setShowToast] = useState(false);

  const handleEditClick = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const fullName = profile?.fullName || firebaseUser?.displayName || "KejaFinder User";
  const photoURL = firebaseUser?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=10b981&color=fff`;
  // Show the account's real role when we have one; only fall back to the
  // generic Poster/Renter Mode label when there's no signed-in profile to
  // read a role from (e.g. local prototype mode).
  const roleLabel = profile?.role
    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
    : profileMode === "poster" ? "Poster Mode" : "Renter Mode";

  return (
    <div className="w-full relative">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        className="w-full bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-3xl p-5 shadow-3xs hover:shadow-2xs transition-shadow relative overflow-hidden"
      >
        {/* Subtle decorative background accent grid pattern or abstract blobs */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-500/5 rounded-bl-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            {/* Avatar block with circular overlap action pen */}
            <div className="relative shrink-0 select-none">
              <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-white dark:border-stone-800 shadow-xs bg-neutral-100 dark:bg-stone-800">
                <img 
                  src={photoURL} 
                  alt={`${fullName} profile photo`} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button 
                onClick={handleEditClick}
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-xs border border-white dark:border-stone-900 hover:bg-emerald-700 dark:hover:bg-emerald-400 active:scale-90 transition-transform cursor-pointer outline-none"
                aria-label="Change profile photo"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>

            {/* Profile identity info texts */}
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black text-neutral-800 dark:text-neutral-50 tracking-tight leading-none truncate">
                  {fullName}
                </h2>
              </div>

              {/* Role badge */}
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                <User className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {roleLabel}
                </span>
              </div>

              {/* Informational rows (Phone, Location, Email) */}
              <div className="space-y-1 pt-1">
                {profile?.phone && (
                  <div className="flex items-center space-x-2 text-neutral-500 dark:text-stone-400">
                    <Phone className="w-3.5 h-3.5 text-neutral-400 dark:text-stone-500 shrink-0" />
                    <span className="text-[11.5px] font-semibold tracking-tight">{profile.phone}</span>
                  </div>
                )}
                {profile?.town && (
                  <div className="flex items-center space-x-2 text-neutral-500 dark:text-stone-400">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 dark:text-stone-500 shrink-0" />
                    <span className="text-[11.5px] font-semibold tracking-tight truncate">{profile.town}</span>
                  </div>
                )}
                {(firebaseUser?.email || profile?.email) && (
                  <div className="flex items-center space-x-2 text-neutral-500 dark:text-stone-400">
                    <Mail className="w-3.5 h-3.5 text-neutral-400 dark:text-stone-500 shrink-0" />
                    <span className="text-[11.5px] font-semibold tracking-tight truncate">{firebaseUser?.email || profile?.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Edit Profile Button on Right/Widescreen */}
          <div className="flex items-center md:self-center">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleEditClick}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-stone-800 hover:bg-neutral-50 dark:hover:bg-stone-750 border border-neutral-200/50 dark:border-stone-800/40 flex items-center space-x-2 shadow-3xs cursor-pointer select-none outline-none font-bold text-xs text-neutral-700 dark:text-stone-200 transition-colors w-full md:w-auto justify-center"
              aria-label="Edit profile settings"
            >
              <Pencil className="w-3.5 h-3.5 text-neutral-400 dark:text-stone-500" />
              <span>Edit Profile</span>
            </motion.button>
          </div>
        </div>

        {/* Verification badges along the bottom */}
        <div className="flex flex-wrap gap-1.5 border-t border-neutral-100 dark:border-stone-800/30 mt-4.5 pt-3.5">
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-550/20 text-emerald-700 dark:text-emerald-400 select-none">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
            <span className="text-[9.5px] font-extrabold tracking-tight">Email Login</span>
          </div>
        </div>
      </motion.div>

      {/* Pop up float message */}
      <AnimatePresence>
        {showToast && (
          <div className="fixed inset-x-0 bottom-24 z-50 flex items-center justify-center pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 text-white font-extrabold text-[10.5px] uppercase tracking-wider px-4 py-2 rounded-xl shadow-lg flex items-center space-x-2 pointer-events-auto"
            >
              <AlertCircle className="w-4 h-4 text-emerald-450 shrink-0" />
              <span>Edit profile form is coming soon!</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
