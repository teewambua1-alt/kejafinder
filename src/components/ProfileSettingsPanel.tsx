import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  MapPin, 
  Bell, 
  Check, 
  HelpCircle, 
  ShieldCheck, 
  Phone, 
  Mail, 
  BadgeCheck, 
  UserCheck, 
  Globe, 
  LogOut, 
  AlertCircle, 
  Info,
  ChevronRight,
  Sparkles,
  MessageSquare,
  ArrowLeft,
  SlidersHorizontal,
  Lock,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase/client';

export type ProfileSettingsPanelType =
  | "settings_home"
  | "personal_details"
  | "notifications"
  | "preferred_locations"
  | "budget_range"
  | "house_types"
  | "verification"
  | "help_center"
  | "language"
  | "logout"
  | "about_page";

interface ProfileSettingsPanelProps {
  type: ProfileSettingsPanelType;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (message: string) => void;
  onTypeChange?: (type: ProfileSettingsPanelType) => void;
  onOpenAbout?: () => void;
  onOpenSupport?: () => void;
  onLogout?: () => void;
}

export default function ProfileSettingsPanel({ type, isOpen, onClose, onSave, onTypeChange, onOpenAbout, onOpenSupport, onLogout }: ProfileSettingsPanelProps) {
  const { user, profile, refreshProfile } = useAuth();

  // Direct redirect when about_page selected: closes bottom-sheet and opens the custom view
  React.useEffect(() => {
    if (isOpen && type === 'about_page') {
      onClose();
      if (onOpenAbout) {
        onOpenAbout();
      }
    }
    if (isOpen && type === 'help_center') {
      onClose();
      if (onOpenSupport) {
        onOpenSupport();
      }
    }
  }, [isOpen, type, onOpenAbout, onOpenSupport, onClose]);

  // 1. Local states for various settings forms

  // Personal Details -- real data from useAuth(), re-synced whenever the
  // panel opens so a profile that finishes loading after mount isn't missed.
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [town, setTown] = useState(profile?.town || '');
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [editingToast, setEditingToast] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && type === 'personal_details') {
      setFullName(profile?.full_name || '');
      setPhone(profile?.phone || '');
      setTown(profile?.town || '');
    }
  }, [isOpen, type, profile]);

  // Notifications
  const [notifs, setNotifs] = useState({
    savedHomes: true,
    priceDrops: true,
    availability: true,
    newHomes: false,
    safetyAlerts: true,
  });

  // Preferred Locations
  const [preferredLocs, setPreferredLocs] = useState<string[]>([
    "Athi River",
    "Syokimau",
    "Rongai"
  ]);
  const allLocationsAvailable = ["Athi River", "Syokimau", "Rongai", "Kitengela", "Mlolongo"];

  // Budget Range
  const [minRent, setMinRent] = useState("4,000");
  const [maxRent, setMaxRent] = useState("15,000");

  // House Types
  const [houseTypesSelected, setHouseTypesSelected] = useState<string[]>([
    "Bedsitter",
    "1 Bedroom"
  ]);
  const allHouseTypes = ["Single Room", "Bedsitter", "Studio", "1 Bedroom", "2 Bedroom", "Mabati"];

  // Language settings
  const [activeLanguage, setActiveLanguage] = useState("English");

  const displayName = profile?.full_name || (user?.user_metadata?.full_name as string | undefined) || 'KejaFinder User';
  const photoURL = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=10b981&color=fff`;
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  const showEditingToast = (message: string) => {
    setEditingToast(message);
    setTimeout(() => setEditingToast(null), 2500);
  };

  // Toggle preferred location chip
  const toggleLocation = (loc: string) => {
    setPreferredLocs(prev => 
      prev.includes(loc) ? prev.filter(item => item !== loc) : [...prev, loc]
    );
  };

  // Toggle house type chip
  const toggleHouseType = (typeVal: string) => {
    setHouseTypesSelected(prev => 
      prev.includes(typeVal) ? prev.filter(item => item !== typeVal) : [...prev, typeVal]
    );
  };

  // Handle standard Done/Save button
  const handleDone = async () => {
    if (type === 'personal_details') {
      if (!user) {
        onSave?.('Log in to save profile changes.');
        onClose();
        return;
      }
      setIsSavingDetails(true);
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim(), phone: phone.trim(), town: town.trim() || null })
        .eq('id', user.id);
      setIsSavingDetails(false);

      if (error) {
        console.error('Error saving personal details:', error);
        onSave?.('Could not save your changes. Please try again.');
        return;
      }
      await refreshProfile();
      onSave?.('Personal details updated.');
      onClose();
      return;
    }

    let successMsg = "Preferences updated successfully!";
    if (type === 'settings_home') successMsg = "Settings preference panel updated.";
    if (type === 'notifications') successMsg = "Notification settings saved locally.";
    if (type === 'preferred_locations') successMsg = `Preferred areas saved: ${preferredLocs.join(', ')}`;
    if (type === 'budget_range') successMsg = `Budget set locally to KSh ${minRent} - KSh ${maxRent}`;
    if (type === 'house_types') successMsg = `House type filters set to: ${houseTypesSelected.join(', ')}`;
    if (type === 'language') successMsg = `Platform language set to ${activeLanguage}`;
    if (type === 'logout') successMsg = "Log out event cancelled.";

    if (onSave) {
      onSave(successMsg);
    }
    onClose();
  };

  // Render contents according to panel type
  const renderPanelContents = () => {
    switch (type) {
      case 'settings_home':
        return (
          <div className="space-y-4">
            {/* Quick Profile Summary Card in Settings Hub */}
            <div className="p-4 rounded-2.5xl bg-neutral-50/70 dark:bg-stone-920 border border-neutral-150/70 dark:border-stone-850 flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-white dark:border-stone-800 shadow-3xs shrink-0 bg-neutral-200 dark:bg-stone-750">
                <img
                  src={photoURL}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-[13px] font-black text-neutral-805 dark:text-stone-100 uppercase tracking-tight leading-none">
                  {displayName}
                </h4>
                <p className="text-[9.5px] font-semibold text-neutral-450 dark:text-stone-450 leading-none mt-1 uppercase tracking-wider">
                  {profile?.role || 'Member'}{memberSince ? ` · Member since ${memberSince}` : ''}
                </p>
              </div>
              <span className="text-[8px] font-black px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/35 text-emerald-600 dark:text-emerald-400 border border-emerald-100/40 dark:border-emerald-900/30 uppercase tracking-widest font-sans">
                Active
              </span>
            </div>

            {/* List of categories */}
            <div className="space-y-3 pt-1">
              {[
                {
                  id: 'account',
                  title: 'Account',
                  desc: 'Personal details and verification',
                  icon: User,
                  action: () => onTypeChange?.('personal_details')
                },
                {
                  id: 'notifications',
                  title: 'Notifications',
                  desc: 'Alerts and saved-home updates',
                  icon: Bell,
                  action: () => onTypeChange?.('notifications')
                },
                {
                  id: 'search_preferences',
                  title: 'Search Preferences',
                  desc: 'Locations, budget, and house types',
                  icon: SlidersHorizontal,
                  action: () => onTypeChange?.('preferred_locations')
                },
                {
                  id: 'privacy',
                  title: 'Privacy & Security',
                  desc: 'Visibility and safety controls',
                  icon: Lock,
                  action: () => showEditingToast('Privacy settings coming soon.')
                },
                {
                  id: 'language',
                  title: 'Language',
                  desc: 'English for interface',
                  icon: Globe,
                  action: () => onTypeChange?.('language')
                },
                {
                  id: 'support',
                  title: 'Support',
                  desc: 'Help center and safety messages',
                  icon: HelpCircle,
                  action: () => onTypeChange?.('help_center')
                },
                {
                  id: 'about_page',
                  title: 'About KejaFinder',
                  desc: 'Our mission and local roadmap',
                  icon: Info,
                  action: () => onTypeChange?.('about_page')
                },
                {
                  id: 'app_experience',
                  title: 'App Experience',
                  desc: 'Theme, data saver, and performance',
                  icon: Smartphone,
                  action: () => showEditingToast('App experience settings coming soon.')
                },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <button
                    type="button"
                    key={row.id}
                    onClick={row.action}
                    className="w-full p-3.5 flex items-center space-x-3 bg-white/95 dark:bg-stone-900/95 border border-neutral-200/50 dark:border-stone-800/40 rounded-2xl hover:bg-neutral-50/50 dark:hover:bg-stone-850/20 hover:border-emerald-555/15 transition-all text-left cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500/10"
                  >
                    <div className="w-8.5 h-8.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/25 border border-emerald-100/50 dark:border-emerald-900/40 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-[12px] font-black text-neutral-805 dark:text-stone-100 uppercase tracking-tight leading-tight">
                        {row.title}
                      </span>
                      <span className="block text-[9px] font-semibold text-neutral-400 dark:text-stone-500 leading-none mt-0.5">
                        {row.desc}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-stone-600" />
                  </button>
                );
              })}
            </div>
            
            {/* Quick logout trigger row at the bottom */}
            <button
              type="button"
              onClick={() => onTypeChange?.('logout')}
              className="w-full mt-2 p-3.5 flex items-center justify-center space-x-2 text-center border border-dashed border-orange-200 dark:border-orange-950/30 hover:border-orange-550/35 bg-white dark:bg-stone-900 rounded-2.5xl transition-all cursor-pointer text-orange-550 dark:text-orange-400 outline-none"
            >
              <LogOut className="w-4 h-4 stroke-[2]" />
              <span className="text-[11px] font-black uppercase tracking-wider">Log Out Options</span>
            </button>
          </div>
        );

      case 'personal_details':
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-black text-neutral-850 dark:text-stone-100 uppercase tracking-tight">Personal Details</h2>
              <p className="text-[10px] font-bold text-neutral-400 dark:text-stone-500 uppercase tracking-wider">Configure your contact card</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-[9.5px] font-extrabold text-neutral-450 dark:text-stone-500 uppercase tracking-widest block pl-1">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-stone-920 border border-neutral-100 dark:border-stone-850 rounded-xl px-3.5 py-2.5 text-xs font-black text-neutral-800 dark:text-stone-200 outline-none focus:border-emerald-500/50" 
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] font-extrabold text-neutral-450 dark:text-stone-500 uppercase tracking-widest block pl-1">Phone Number</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-stone-920 border border-neutral-100 dark:border-stone-850 rounded-xl px-3.5 py-2.5 text-xs font-black text-neutral-800 dark:text-stone-200 outline-none focus:border-emerald-500/50" 
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] font-extrabold text-neutral-450 dark:text-stone-500 uppercase tracking-widest block pl-1">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-neutral-100 dark:bg-stone-850 border border-neutral-100 dark:border-stone-850 rounded-xl px-3.5 py-2.5 text-xs font-black text-neutral-500 dark:text-stone-400 outline-none cursor-not-allowed"
                  placeholder="No email on this account"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] font-extrabold text-neutral-450 dark:text-stone-500 uppercase tracking-widest block pl-1">Town / Area</label>
                <input
                  type="text"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-stone-920 border border-neutral-100 dark:border-stone-850 rounded-xl px-3.5 py-2.5 text-xs font-black text-neutral-800 dark:text-stone-200 outline-none focus:border-emerald-500/50"
                  placeholder="e.g. Syokimau"
                />
              </div>
            </div>

            <div className="p-3 bg-neutral-50 dark:bg-stone-850 rounded-2xl border border-neutral-150/70 dark:border-stone-800 mt-2 flex items-start space-x-2.5">
              <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[10px] font-semibold text-neutral-500 dark:text-stone-400 leading-normal">
                Email can't be changed here. Name, phone, and town are saved to your account when you tap Done.
              </p>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-black text-neutral-850 dark:text-stone-100 uppercase tracking-tight">Notifications</h2>
              <p className="text-[10px] font-bold text-neutral-400 dark:text-stone-500 uppercase tracking-wider">Configure alert channels & updates</p>
            </div>

            <div className="bg-white/95 dark:bg-stone-900/95 border border-neutral-150/95 dark:border-stone-850 rounded-2.5xl overflow-hidden divide-y divide-neutral-100 dark:divide-stone-850 mt-3 shadow-3xs">
              {[
                { key: 'savedHomes', label: 'Saved home updates', desc: 'Alerts when your bookmarked homes have updates' },
                { key: 'priceDrops', label: 'Price drops', desc: 'Instantly notify me if rent price falls' },
                { key: 'availability', label: 'Availability reminders', desc: 'Reminders if listing vacancies are booked' },
                { key: 'newHomes', label: 'New homes near me', desc: 'Notifications of active listings in Athi River' },
                { key: 'safetyAlerts', label: 'Safety alerts', desc: 'Updates on fraudulent reports and security advice' },
              ].map((row) => (
                <div key={row.key} className="p-4 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 max-w-[210px] min-w-0">
                    <span className="block text-[12px] font-black text-neutral-805 dark:text-stone-100 tracking-tight leading-snug">
                      {row.label}
                    </span>
                    <span className="block text-[9.5px] font-semibold text-neutral-450 dark:text-stone-500 leading-normal">
                      {row.desc}
                    </span>
                  </div>

                  {/* Toggle Button switch */}
                  <button
                    type="button"
                    aria-pressed={notifs[row.key as keyof typeof notifs]}
                    onClick={() => setNotifs(prev => ({ ...prev, [row.key]: !prev[row.key as keyof typeof notifs] }))}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 outline-none cursor-pointer flex items-center ${
                      notifs[row.key as keyof typeof notifs] ? 'bg-emerald-500' : 'bg-neutral-200 dark:bg-stone-800'
                    }`}
                  >
                    <motion.div 
                      layout
                      className="w-5 h-5 bg-white rounded-full shadow-xs" 
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      style={{
                        marginRight: notifs[row.key as keyof typeof notifs] ? '0' : 'auto',
                        marginLeft: notifs[row.key as keyof typeof notifs] ? 'auto' : '0'
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'preferred_locations':
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-black text-neutral-850 dark:text-stone-100 uppercase tracking-tight">Preferred Locations</h2>
              <p className="text-[10px] font-bold text-neutral-400 dark:text-stone-500 uppercase tracking-wider">Select regions you search often</p>
            </div>

            <p className="text-[10px] text-neutral-500 dark:text-stone-400 font-semibold leading-relaxed pt-1.5 pl-1">
              Tap a geographic tag below to highlight or remove it from your regular alert priorities:
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {allLocationsAvailable.map((loc) => {
                const isSelected = preferredLocs.includes(loc);
                return (
                  <motion.button
                    key={loc}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleLocation(loc)}
                    aria-pressed={isSelected}
                    className={`px-3.5 py-2.5 rounded-xl text-[10.5px] font-black uppercase tracking-tight border flex items-center space-x-1.5 transition-all outline-none cursor-pointer ${
                      isSelected 
                        ? 'bg-emerald-550/10 border-emerald-500 text-emerald-700 dark:text-emerald-400' 
                        : 'bg-neutral-50 dark:bg-stone-850 border-neutral-150 dark:border-stone-800 text-neutral-450 dark:text-stone-450'
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400'}`} />
                    <span>{loc}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 animate-scaleIn shrink-0 ml-0.5 stroke-[2.5]" />}
                  </motion.button>
                );
              })}
            </div>

            <div className="p-3 bg-neutral-50 dark:bg-stone-850 rounded-2xl border border-neutral-150/70 dark:border-stone-800 mt-2 flex items-start space-x-2.5">
              <Sparkles className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[10px] font-semibold text-neutral-500 dark:text-stone-400 leading-normal">
                We’ll use these areas later to improve automated email alerts, search feed sorting, and new matching rent suggestions tailored to Athi River / Machakos county regions.
              </p>
            </div>
          </div>
        );

      case 'budget_range':
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-black text-neutral-850 dark:text-stone-100 uppercase tracking-tight">Preferred Budget Range</h2>
              <p className="text-[10px] font-bold text-neutral-400 dark:text-stone-500 uppercase tracking-wider">Configure rent filters in KSh</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[9.5px] font-extrabold text-neutral-450 dark:text-stone-500 uppercase tracking-widest block pl-1">Min Rent</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-450">KSh</span>
                  <input 
                    type="text" 
                    value={minRent}
                    onChange={(e) => setMinRent(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-neutral-50 dark:bg-stone-920 border border-neutral-100 dark:border-stone-850 rounded-xl pl-11 pr-3.5 py-3 text-xs font-black text-neutral-800 dark:text-stone-200 outline-none focus:border-emerald-500/50" 
                    placeholder="4,000"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] font-extrabold text-neutral-450 dark:text-stone-500 uppercase tracking-widest block pl-1">Max Rent</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-450">KSh</span>
                  <input 
                    type="text" 
                    value={maxRent}
                    onChange={(e) => setMaxRent(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-neutral-50 dark:bg-stone-920 border border-neutral-100 dark:border-stone-850 rounded-xl pl-11 pr-3.5 py-3 text-xs font-black text-neutral-800 dark:text-stone-200 outline-none focus:border-emerald-500/50" 
                    placeholder="15,000"
                  />
                </div>
              </div>
            </div>

            <p className="text-[9px] text-neutral-400 dark:text-stone-500 font-semibold text-center mt-1 text-xs">
              Expected default range: <strong className="text-neutral-700 dark:text-stone-300">KSh 4,000</strong> to <strong className="text-neutral-700 dark:text-stone-300">KSh 15,000</strong> per month
            </p>
          </div>
        );

      case 'house_types':
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-black text-neutral-850 dark:text-stone-100 uppercase tracking-tight">House Type Preferences</h2>
              <p className="text-[10px] font-bold text-neutral-400 dark:text-stone-500 uppercase tracking-wider">Select home categories interested in</p>
            </div>

            <p className="text-[10px] text-neutral-500 dark:text-stone-400 font-semibold leading-relaxed pt-1.5 pl-1">
              Filter search matches and saved recommendations by selecting your favorite structures:
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {allHouseTypes.map((typeVal) => {
                const isSelected = houseTypesSelected.includes(typeVal);
                return (
                  <motion.button
                    key={typeVal}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleHouseType(typeVal)}
                    aria-pressed={isSelected}
                    className={`px-3.5 py-2.5 rounded-xl text-[10.5px] font-black uppercase tracking-tight border flex items-center space-x-1 transition-all outline-none cursor-pointer ${
                      isSelected 
                        ? 'bg-emerald-550/10 border-emerald-500 text-emerald-700 dark:text-emerald-400' 
                        : 'bg-neutral-50 dark:bg-stone-850 border-neutral-150 dark:border-stone-800 text-neutral-450 dark:text-stone-450'
                    }`}
                  >
                    <span>{typeVal}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 animate-scaleIn shrink-0 ml-0.5 stroke-[2.5]" />}
                  </motion.button>
                );
              })}
            </div>
          </div>
        );

      case 'verification':
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-black text-neutral-850 dark:text-stone-100 uppercase tracking-tight">Verification</h2>
              <p className="text-[10px] font-bold text-neutral-400 dark:text-stone-500 uppercase tracking-wider">Official trust and badge status log</p>
            </div>

            <div className="bg-white/95 dark:bg-stone-900/95 border border-neutral-150/95 dark:border-stone-850 rounded-2.5xl overflow-hidden divide-y divide-neutral-100 dark:divide-stone-850 mt-3 shadow-3xs">
              {[
                { label: 'Phone Checked', status: 'Verified', isDone: true },
                { label: 'Primary Location Reviewed', status: 'Checked', isDone: true },
                { label: 'Primary Email Address Linked', status: 'Added', isDone: true },
                { label: 'ID Document Verification', status: 'Coming soon', isDone: false },
                { label: 'Field Scout Verification (Posters)', status: 'Available for posters', isDone: false }
              ].map((vRow, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <span className="text-[11.5px] font-black text-neutral-800 dark:text-stone-200">
                    {vRow.label}
                  </span>

                  <span className={`px-2 py-0.5 text-[8px] font-black rounded-md uppercase tracking-wider ${
                    vRow.isDone 
                      ? 'bg-emerald-500/10 border border-emerald-150/10 text-emerald-700 dark:text-emerald-400' 
                      : 'bg-neutral-100 dark:bg-stone-800 text-neutral-450 dark:text-stone-450'
                  }`}>
                    {vRow.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-emerald-500/[0.03] dark:bg-emerald-500/[0.04] border border-emerald-500/20 dark:border-emerald-900/30 rounded-2xl p-4 flex items-start space-x-3 shadow-3xs mt-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="block text-[11px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wider leading-none">
                  Self-verify check disclaimer
                </span>
                <p className="text-[10px] text-neutral-500 dark:text-stone-400 font-semibold leading-relaxed">
                  Verification badges are reviewed and accredited manually by the KejaFinder validation team. Renter/Poster users cannot manually self-verify listings or trust attributes inside description notes.
                </p>
              </div>
            </div>
          </div>
        );

      case 'help_center':
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-black text-neutral-850 dark:text-stone-100 uppercase tracking-tight">Help & Support</h2>
              <p className="text-[10px] font-bold text-neutral-400 dark:text-stone-500 uppercase tracking-wider">FAQs and customer helpline center</p>
            </div>

            {/* Quick Actions helpline buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {[
                { title: 'Contact Support', color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-100 text-emerald-800', msg: 'Support email request initialized.' },
                { title: 'Safety Guide Tips', color: 'bg-blue-50 hover:bg-blue-100 border-blue-100 text-blue-800', msg: 'Safety guidelines document opened.' },
                { title: 'Report Fraud Listing', color: 'bg-red-50 hover:bg-red-100 border-red-100 text-red-800', msg: 'Listing report ticket page initialized.' },
                { title: 'WhatsApp Helpline', color: 'bg-green-50 hover:bg-green-100 border-green-100 text-green-805', msg: 'Launching official KejaFinder WhatsApp helpline...' }
              ].map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => showEditingToast(btn.msg)}
                  className={`p-3 rounded-xl border text-[10.5px] font-black text-center transition-all cursor-pointer outline-none ${btn.color}`}
                >
                  {btn.title}
                </button>
              ))}
            </div>

            {/* Top FAQs list accordion visual wireframe */}
            <div className="space-y-2 pt-3">
              <span className="block text-[10px] font-black text-neutral-450 dark:text-stone-500 uppercase tracking-wider pl-1">
                Frequently Asked Questions
              </span>

              <div className="bg-white/95 dark:bg-stone-900/95 border border-neutral-150/95 dark:border-stone-850 rounded-2.5xl overflow-hidden divide-y divide-neutral-100 dark:divide-stone-850 shadow-3xs">
                {[
                  "How do I verify caretaker phone details before paying?",
                  "Is KejaFinder fully free to find single rooms in Rongai?",
                  "What should I do if a rental agent demands viewing deposit?"
                ].map((faq, idx) => (
                  <button
                    key={idx}
                    onClick={() => showEditingToast(`Answer opened: "${faq}"`)}
                    className="w-full p-3.5 text-left flex items-center justify-between text-[11px] font-bold text-neutral-750 dark:text-stone-200 hover:bg-neutral-50 dark:hover:bg-stone-850 cursor-pointer"
                  >
                    <span className="truncate pr-4">{faq}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-450 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-black text-neutral-850 dark:text-stone-100 uppercase tracking-tight">Interface Language</h2>
              <p className="text-[10px] font-bold text-neutral-400 dark:text-stone-500 uppercase tracking-wider">Configure your language preference</p>
            </div>

            <div className="space-y-2 pt-2">
              {[
                { code: 'en', name: 'English (United Kingdom / Kenya)', isSelected: true, note: 'Primary translations' },
                { code: 'sw', name: 'Sheng / Swahili Coming Soon', isSelected: false, note: 'Localization matches in dev' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  disabled={!lang.isSelected}
                  onClick={() => setActiveLanguage(lang.isSelected ? 'English' : 'Swahili')}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-3 outline-none ${
                    lang.isSelected 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-400 cursor-pointer' 
                      : 'bg-neutral-100/50 dark:bg-stone-850/40 border-neutral-200 dark:border-stone-800 text-neutral-400 dark:text-stone-500 cursor-not-allowed opacity-70'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="block text-[11.5px] font-black">{lang.name}</span>
                    <span className="block text-[9.5px] font-semibold">{lang.note}</span>
                  </div>

                  {lang.isSelected && (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-3xs shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <p className="text-[10px] text-neutral-450 dark:text-stone-500 font-semibold leading-relaxed pt-2 text-center">
              Kiswahili (Sheng local phrases mapping) is under development and will be released in an automated patch update.
            </p>
          </div>
        );

      case 'logout':
        return (
          <div className="space-y-4 text-center py-4">
            {/* Visual Red Warning graphic illustration */}
            <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-950/20 flex items-center justify-center mx-auto mb-3 text-orange-550 border border-orange-200">
              <LogOut className="w-6 h-6 stroke-[2]" />
            </div>

            <div className="space-y-1.5 max-w-xs mx-auto">
              <h2 className="text-base font-black text-neutral-850 dark:text-stone-100 uppercase tracking-tight">Sign Out</h2>
              <p className="text-[11.5px] font-semibold text-neutral-500 dark:text-stone-400 leading-normal">
                You'll need to log in again to access your account.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto">
              <button
                onClick={onClose}
                className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl border border-neutral-200 dark:border-stone-850 text-neutral-800 dark:text-stone-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all cursor-pointer outline-none"
              >
                Cancel Action
              </button>
              <button
                onClick={() => {
                  onClose();
                  onLogout?.();
                }}
                className="flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl bg-orange-550 text-white hover:bg-orange-600 transition-all cursor-pointer outline-none"
              >
                Log Out
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* A. Dark Translucent glass Backdrop layout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 flex items-end justify-center px-0 py-0"
            role="dialog"
            aria-modal="true"
          >
            {/* B. Slide-up visual panel sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-stone-900 border-t border-neutral-150/90 dark:border-stone-850 rounded-t-3xl p-5 shadow-xl flex flex-col max-h-[85vh] overflow-y-auto z-51 select-none pointer-events-auto"
            >
              {/* Drag Handle block decoration slider */}
              <div className="w-10 h-1 bg-neutral-200 dark:bg-stone-800 rounded-full mx-auto mb-4 shrink-0" />

              {/* Header rows with close icon button */}
              <div className="flex items-center justify-between pb-3 shrink-0">
                <div className="flex items-center space-x-1.5 min-w-0">
                  {type !== "settings_home" && onTypeChange && (
                    <button
                      type="button"
                      onClick={() => onTypeChange("settings_home")}
                      className="w-7 h-7 rounded-xl bg-neutral-50 dark:bg-stone-850 border border-neutral-150/50 dark:border-stone-805 flex items-center justify-center text-neutral-550 hover:text-neutral-800 dark:text-stone-400 dark:hover:text-stone-200 active:scale-95 transition-all outline-none cursor-pointer"
                      aria-label="Back to Settings Hub"
                    >
                      <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
                    </button>
                  )}
                  <span className="text-[9px] font-extrabold text-neutral-450 dark:text-stone-550 uppercase tracking-widest font-mono select-none truncate">
                    {type === "settings_home" ? "KejaFinder Settings" : "KejaFinder Panel"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-7 h-7 rounded-xl bg-neutral-50 dark:bg-stone-850 border border-neutral-150 dark:border-stone-800 flex items-center justify-center text-neutral-500 hover:text-neutral-800 dark:text-stone-400 dark:hover:text-stone-200 active:scale-95 transition-all outline-none cursor-pointer"
                  aria-label="Close settings"
                >
                  <X className="w-4 h-4 stroke-[2]" />
                </button>
              </div>

              {/* Dynamic Body content based on type */}
              <div className="flex-1 overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-neutral-200">
                {renderPanelContents()}
              </div>

              {/* C. Bottom save/cancel confirmations container standard buttons */}
              {type !== 'logout' && (
                <div className="pt-4 border-t border-neutral-100 dark:divide-stone-850 flex items-center space-x-2 shrink-0">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl border border-neutral-200 dark:border-stone-850 text-neutral-450 dark:text-stone-450 hover:bg-neutral-50 cursor-pointer outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDone}
                    className="flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-500/20 active:scale-97 transition-all cursor-pointer outline-none"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* D. Local toast notices inside specific panels details */}
          <AnimatePresence>
            {editingToast && (
              <div className="fixed inset-x-0 bottom-28 z-[60] flex items-center justify-center pointer-events-none px-4">
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  className="bg-neutral-900 border border-neutral-800 text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-lg flex items-center space-x-2 pointer-events-auto"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-emerald-450 shrink-0" />
                  <span>{editingToast}</span>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
