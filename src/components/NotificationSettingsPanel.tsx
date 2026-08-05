import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Bell, Moon, MessageSquare, ShieldCheck, Mail, Save } from 'lucide-react';

interface NotificationSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (message: string) => void;
}

export default function NotificationSettingsPanel({
  isOpen,
  onClose,
  onSave
}: NotificationSettingsPanelProps) {
  // Local settings states. All channels here are prototype toggles (local
  // state only, not wired to a real delivery mechanism) until WhatsApp/SMS
  // providers and browser push are implemented for real.
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [smsBroadcasts, setSmsBroadcasts] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(false);

  // Frequency state
  const [emailDigest, setEmailDigest] = useState<'instant' | 'daily' | 'weekly'>('daily');
  
  // Quiz hours prototype states
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('07:00');

  if (!isOpen) return null;

  const handleSaveAndClose = () => {
    onSave("Alert preferences saved successfully.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs select-none">
      {/* Backdrop tap-away */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Sheet Content Panel */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 240 }}
        className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-t-3xl border-t border-neutral-200/60 dark:border-stone-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Rounded grab handle for sheet feel */}
        <div className="w-12 h-1 bg-neutral-300 dark:bg-stone-800 rounded-full mx-auto my-3 shrink-0" />

        {/* Modal Header */}
        <div className="px-5 pb-3 pt-1 flex items-center justify-between border-b border-neutral-150/40 dark:border-stone-850/40 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-555/10 dark:bg-emerald-550/5 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Bell className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-sm font-black text-neutral-850 dark:text-stone-100 uppercase tracking-wider leading-none">
                Alert Subscriptions
              </h2>
              <p className="text-[10px] text-neutral-450 dark:text-stone-500 font-semibold mt-1">
                Configure your real-time notification platforms.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close notification settings panel"
            className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-stone-850 hover:bg-neutral-200/60 dark:hover:bg-stone-800 flex items-center justify-center text-neutral-500 hover:text-neutral-700 dark:text-stone-400 dark:hover:text-stone-200 cursor-pointer outline-none transition-all"
          >
            <X className="w-4.5 h-4.5 stroke-[2.2]" />
          </button>
        </div>

        {/* Scrollable controls list */}
        <div className="flex-grow overflow-y-auto px-5 py-4.5 space-y-5 scrollbar-thin">
          {/* Main Toggles Section */}
          <div className="space-y-3.5">
            <span className="block text-[10px] font-black text-neutral-400 dark:text-stone-500 uppercase tracking-widest leading-none">
              Notification Channels
            </span>

            {/* WhatsApp */}
            <div className="flex items-center justify-between p-3.5 bg-neutral-50/50 dark:bg-stone-850/30 rounded-2xl border border-neutral-205/10 dark:border-stone-800/10">
              <div className="flex items-start space-x-3 pr-2">
                <div className="w-8.5 h-8.5 rounded-xl bg-green-500/10 dark:bg-green-500/5 flex items-center justify-center shrink-0 text-green-600 dark:text-green-400">
                  <MessageSquare className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-xs.2 font-black text-neutral-805 dark:text-stone-200 uppercase tracking-tight">
                    WhatsApp Updates
                  </h3>
                  <p className="text-[10px] text-neutral-500 dark:text-stone-400 font-semibold leading-relaxed mt-0.5">
                    Receive instant vacancy & direct match alerts in Kenya.
                  </p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => setWhatsappAlerts(!whatsappAlerts)}
                role="switch"
                aria-checked={whatsappAlerts}
                aria-label="Toggle WhatsApp Alerts"
                className={`relative w-10 h-5.5 rounded-full shrink-0 transition-colors cursor-pointer outline-none ${
                  whatsappAlerts ? 'bg-emerald-600' : 'bg-neutral-200 dark:bg-stone-800'
                }`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white absolute top-0.5 shadow-xs transition-transform ${
                  whatsappAlerts ? 'translate-x-5.5' : 'translate-x-0.5'
                }`} />
              </motion.button>
            </div>

            {/* SMS Direct Broadcast */}
            <div className="flex items-center justify-between p-3.5 bg-neutral-50/50 dark:bg-stone-850/30 rounded-2xl border border-neutral-205/10 dark:border-stone-800/10">
              <div className="flex items-start space-x-3 pr-2">
                <div className="w-8.5 h-8.5 rounded-xl bg-blue-500/10 dark:bg-blue-500/5 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-xs.2 font-black text-neutral-805 dark:text-stone-200 uppercase tracking-tight">
                    SMS Broadcasts
                  </h3>
                  <p className="text-[10px] text-neutral-500 dark:text-stone-400 font-semibold leading-relaxed mt-0.5">
                    Critical deposit warnings and availability updates via SMS.
                  </p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => setSmsBroadcasts(!smsBroadcasts)}
                role="switch"
                aria-checked={smsBroadcasts}
                aria-label="Toggle SMS Broadcasts"
                className={`relative w-10 h-5.5 rounded-full shrink-0 transition-colors cursor-pointer outline-none ${
                  smsBroadcasts ? 'bg-emerald-600' : 'bg-neutral-200 dark:bg-stone-800'
                }`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white absolute top-0.5 shadow-xs transition-transform ${
                  smsBroadcasts ? 'translate-x-5.5' : 'translate-x-0.5'
                }`} />
              </motion.button>
            </div>

            {/* In-app push notifications */}
            <div className="flex items-center justify-between p-3.5 bg-neutral-50/50 dark:bg-stone-850/30 rounded-2xl border border-neutral-205/10 dark:border-stone-800/10">
              <div className="flex items-start space-x-3 pr-2">
                <div className="w-8.5 h-8.5 rounded-xl bg-orange-500/10 dark:bg-orange-500/5 flex items-center justify-center shrink-0 text-orange-600 dark:text-orange-400">
                  <Bell className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-xs.2 font-black text-neutral-805 dark:text-stone-200 uppercase tracking-tight">
                    Push Notifications
                  </h3>
                  <p className="text-[10px] text-neutral-500 dark:text-stone-400 font-semibold leading-relaxed mt-0.5">
                    Real-time sound and banner alerts inside the KejaFinder app. Coming soon.
                  </p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => setPushNotifs(!pushNotifs)}
                role="switch"
                aria-checked={pushNotifs}
                aria-label="Toggle Push Alerts"
                className={`relative w-10 h-5.5 rounded-full shrink-0 transition-colors cursor-pointer outline-none ${
                  pushNotifs ? 'bg-emerald-600' : 'bg-neutral-200 dark:bg-stone-800'
                }`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white absolute top-0.5 shadow-xs transition-transform ${
                  pushNotifs ? 'translate-x-5.5' : 'translate-x-0.5'
                }`} />
              </motion.button>
            </div>
          </div>

          {/* digest frequency selection */}
          <div className="space-y-3.5 pt-1">
            <div className="flex items-center space-x-1.5 leading-none">
              <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="block text-[10px] font-black text-neutral-400 dark:text-stone-500 uppercase tracking-widest leading-none">
                Email Digest Frequency
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {(['instant', 'daily', 'weekly'] as const).map((freq) => (
                <button
                  key={freq}
                  onClick={() => setEmailDigest(freq)}
                  aria-pressed={emailDigest === freq}
                  className={`py-2 px-3.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-center cursor-pointer transition-all border ${
                    emailDigest === freq 
                      ? 'bg-emerald-600 text-white border-emerald-650 shadow-3xs' 
                      : 'bg-neutral-50/50 hover:bg-neutral-100/50 text-neutral-600 dark:bg-stone-850/40 dark:hover:bg-stone-800/40 dark:text-stone-400 border-neutral-200/50 dark:border-stone-800'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Quiet Hours Selection Panel */}
          <div className="space-y-3.5 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 leading-none">
                <Moon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="block text-[10px] font-black text-neutral-400 dark:text-stone-500 uppercase tracking-widest leading-none">
                  Quiet Hours (Prototype)
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => setQuietHoursEnabled(!quietHoursEnabled)}
                role="switch"
                aria-checked={quietHoursEnabled}
                aria-label="Toggle Quiet Hours"
                className={`relative w-9 h-5 rounded-full shrink-0 transition-colors cursor-pointer outline-none ${
                  quietHoursEnabled ? 'bg-emerald-600' : 'bg-neutral-200 dark:bg-stone-800'
                }`}
              >
                <span className={`block w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 shadow-xs transition-transform ${
                  quietHoursEnabled ? 'translate-x-4.5' : 'translate-x-0.5'
                }`} />
              </motion.button>
            </div>

            {quietHoursEnabled && (
              <motion.div 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-3.5 p-3.5 bg-neutral-50/50 dark:bg-stone-850/30 rounded-2xl border border-neutral-200/50 dark:border-stone-800"
              >
                <div>
                  <label className="block text-[9px] font-black text-neutral-450 dark:text-stone-550 uppercase tracking-wider mb-1">
                    Start time
                  </label>
                  <input
                    type="time"
                    value={quietStart}
                    onChange={(e) => setQuietStart(e.target.value)}
                    className="w-full text-xs font-bold font-mono bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 rounded-lg p-1.5 text-neutral-700 dark:text-stone-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-neutral-450 dark:text-stone-550 uppercase tracking-wider mb-1">
                    End time
                  </label>
                  <input
                    type="time"
                    value={quietEnd}
                    onChange={(e) => setQuietEnd(e.target.value)}
                    className="w-full text-xs font-bold font-mono bg-white dark:bg-stone-900 border border-neutral-200 dark:border-stone-800 rounded-lg p-1.5 text-neutral-700 dark:text-stone-300 outline-none"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Action button row footer */}
        <div className="p-4.5 bg-neutral-50/80 dark:bg-stone-850/80 border-t border-neutral-150/50 dark:border-stone-800/50 flex space-x-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4.5 rounded-xl text-center text-xs font-black uppercase tracking-wider bg-neutral-150 dark:bg-stone-805 hover:bg-neutral-200 dark:hover:bg-stone-750 text-neutral-600 dark:text-stone-300 cursor-pointer outline-none transition-all"
          >
            Cancel
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSaveAndClose}
            className="flex-1 py-3 px-4.5 rounded-xl text-center text-xs font-black uppercase tracking-wider bg-emerald-600 hover:bg-emerald-650 text-white shadow-3xs flex items-center justify-center space-x-1.5 cursor-pointer outline-none transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Done</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
