import React from 'react';
import { motion } from 'motion/react';
import {
  User,
  Phone,
  MapPin,
  Mail,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileIdentityCardProps {
  isAdmin?: boolean;
}

export default function ProfileIdentityCard({ isAdmin = false }: ProfileIdentityCardProps) {
  const { profile, user } = useAuth();

  const fullName = profile?.full_name || (user?.user_metadata?.full_name as string | undefined) || "KejaFinder User";
  const photoURL = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=10b981&color=fff`;
  const roleLabel = profile?.role
    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
    : "Member";

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
            {/* Avatar */}
            <div className="shrink-0 select-none">
              <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-white dark:border-stone-800 shadow-xs bg-neutral-100 dark:bg-stone-800">
                <img
                  src={photoURL}
                  alt={`${fullName} profile photo`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Profile identity info texts */}
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black text-neutral-800 dark:text-neutral-50 tracking-tight leading-none truncate">
                  {fullName}
                </h2>
              </div>

              {/* Role badge */}
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                  <User className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    {roleLabel}
                  </span>
                </div>
                {isAdmin && (
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 text-orange-700 dark:text-orange-400">
                    <ShieldCheck className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Admin</span>
                  </div>
                )}
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
                {(user?.email || profile?.email) && (
                  <div className="flex items-center space-x-2 text-neutral-500 dark:text-stone-400">
                    <Mail className="w-3.5 h-3.5 text-neutral-400 dark:text-stone-500 shrink-0" />
                    <span className="text-[11.5px] font-semibold tracking-tight truncate">{user?.email || profile?.email}</span>
                  </div>
                )}
              </div>
            </div>
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
    </div>
  );
}
