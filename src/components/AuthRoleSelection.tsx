import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight, Search, Building2, UserRound, Briefcase, MapPin, CheckCircle, Info,
} from 'lucide-react';
import { AuthMode, AuthDraftUser, AuthRole } from '../types/auth';
import { Button } from './ui';
import { useMotion } from '../lib/motion';

interface AuthRoleSelectionProps {
  authDraftUser: Partial<AuthDraftUser>;
  onSetAuthMode: (mode: AuthMode) => void;
  onSetAuthDraftUser: (user: Partial<AuthDraftUser>) => void;
}

const ROLES: Array<{ id: AuthRole; label: string; desc: string; icon: typeof Search }> = [
  { id: 'tenant', label: 'Tenant', desc: 'I am looking for a vacant room or house.', icon: Search },
  { id: 'landlord', label: 'Landlord', desc: 'I own vacant rooms or houses.', icon: Building2 },
  { id: 'caretaker', label: 'Caretaker', desc: 'I manage rooms and talk to tenants.', icon: UserRound },
  { id: 'agent', label: 'Agent', desc: 'I post listings with clear fees.', icon: Briefcase },
  { id: 'scout', label: 'Area Scout', desc: 'I help check and collect local vacancies.', icon: MapPin },
];

const ROLE_NOTES: Record<AuthRole, string> = {
  tenant: 'Tenants can search, save, compare, and contact caretakers directly.',
  landlord: 'Landlord listings are reviewed by our team before they go live.',
  caretaker: 'Caretakers can post and keep vacancies up to date.',
  agent: 'Agents must show fees clearly and get verified before wider posting.',
  scout: 'Scouts help check and collect vacancies in their area.',
};

/**
 * Role selection. This step no longer creates the account -- it only records
 * the choice and moves on. Two reasons that matters:
 *
 *  - The account used to be created here, before the user had seen the safety
 *    terms on the next screen.
 *  - "Skip for now" silently created a real account as a tenant. Since the
 *    role is written once by a database trigger and the client is granted no
 *    UPDATE on it, that was an unchangeable decision made by a button that
 *    sounded like deferring one.
 */
export default function AuthRoleSelection({
  authDraftUser,
  onSetAuthMode,
  onSetAuthDraftUser,
}: AuthRoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<AuthRole | null>(authDraftUser.role ?? null);
  const [error, setError] = useState<string | null>(null);
  const m = useMotion();

  const handleContinue = () => {
    if (!selectedRole) {
      setError('Choose how you plan to use KejaFinder.');
      return;
    }
    setError(null);
    onSetAuthDraftUser({ role: selectedRole });
    onSetAuthMode('trust');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-neutral-200/60 dark:border-stone-800/60 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md p-6 shadow-sm">
        <h2 className="text-2xl font-black tracking-tight leading-tight text-neutral-850 dark:text-stone-100">
          How will you use KejaFinder?
        </h2>
        {/* Was "You can change this later", which is not true: profiles.role is
            set once by the auth trigger and the client has no UPDATE grant. */}
        <p className="mt-1.5 mb-6 text-[13px] font-semibold text-neutral-600 dark:text-stone-300">
          This sets what you can do in the app. Choose carefully &mdash; it cannot be
          changed later without contacting support.
        </p>

        <div
          role="radiogroup"
          aria-label="How will you use KejaFinder?"
          className="flex flex-col gap-3 mb-5"
        >
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <motion.button
                key={role.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                whileTap={m.tap}
                onClick={() => { setSelectedRole(role.id); setError(null); }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left cursor-pointer outline-none transition-[background-color,border-color] duration-200 ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-700 shadow-sm'
                    : 'bg-white/50 dark:bg-stone-950/50 border-neutral-200 dark:border-stone-800 hover:border-emerald-200 dark:hover:border-emerald-800'
                }`}
              >
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-emerald-100 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-400'
                      : 'bg-neutral-100 dark:bg-stone-900 text-neutral-500 dark:text-stone-400'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-[14px] font-black tracking-tight ${
                    isSelected ? 'text-emerald-900 dark:text-emerald-300' : 'text-neutral-800 dark:text-stone-200'
                  }`}>
                    {role.label}
                  </span>
                  <span className={`block text-[11px] font-semibold ${
                    isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-550 dark:text-stone-400'
                  }`}>
                    {role.desc}
                  </span>
                </span>
                {isSelected && (
                  <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
                )}
              </motion.button>
            );
          })}
        </div>

        {selectedRole && (
          <div className="mb-5 flex items-start gap-2.5 rounded-2xl bg-neutral-50 dark:bg-stone-850 border border-neutral-150/60 dark:border-stone-800 p-3.5">
            <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5 stroke-[2.2]" aria-hidden="true" />
            <p className="text-[11.5px] font-semibold text-neutral-600 dark:text-stone-300 leading-relaxed">
              {ROLE_NOTES[selectedRole]}
            </p>
          </div>
        )}

        {error && (
          <p role="alert" className="mb-4 text-[11px] font-bold text-red-500 dark:text-red-400 pl-1">
            {error}
          </p>
        )}

        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          icon={ArrowRight}
          iconPosition="right"
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
