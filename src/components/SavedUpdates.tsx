import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Bell, 
  TrendingDown, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle, 
  Circle, 
  CheckCheck, 
  Settings, 
  Heart, 
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Info,
  MapPin
} from 'lucide-react';
import { SavedUpdate, SavedUpdateType } from '../data/savedUpdates';
import { useToast } from '../context/ToastContext';

interface SavedUpdatesProps {
  updates: SavedUpdate[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearRead: () => void;
  onBack: () => void;
}

export default function SavedUpdates({
  updates,
  onMarkRead,
  onMarkAllRead,
  onClearRead,
  onBack
}: SavedUpdatesProps) {
  // Alert preference toggle mockup states
  const [prefPrice, setPrefPrice] = useState(true);
  const [prefAvail, setPrefAvail] = useState(true);
  const [prefVerify, setPrefVerify] = useState(true);
  const [prefRecent, setPrefRecent] = useState(true);

  const { showToast } = useToast();

  const triggerToast = (msg: string) => {
    showToast(msg);
  };

  // Map icon dynamically based on update type
  const getUpdateIcon = (type: SavedUpdateType) => {
    switch (type) {
      case 'price_drop':
        return (
          <div className="w-8 h-8 rounded-full bg-orange-500/10 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 flex items-center justify-center shrink-0">
            <TrendingDown className="w-4 h-4 stroke-[2.5]" />
          </div>
        );
      case 'recently_updated':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <RefreshCw className="w-4 h-4 stroke-[2.5]" />
          </div>
        );
      case 'verification':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-450 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
          </div>
        );
      case 'availability':
        return (
          <div className="w-8 h-8 rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 stroke-[2.5]" />
          </div>
        );
      case 'reminder':
        return (
          <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-stone-800 text-neutral-600 dark:text-stone-300 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4 stroke-[2.2]" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-stone-800 text-neutral-700 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4" />
          </div>
        );
    }
  };

  // Action text mapping
  const getActionText = (type: SavedUpdateType) => {
    switch (type) {
      case 'price_drop': return 'View home';
      case 'recently_updated': return 'Check listing';
      case 'verification': return 'View badge';
      case 'availability': return 'Ask if available';
      case 'reminder': return 'Contact caretaker';
      default: return 'Learn more';
    }
  };

  // Interactive callback mapping
  const handleActionClick = (e: React.MouseEvent, item: SavedUpdate) => {
    e.stopPropagation();
    onMarkRead(item.id);

    if (item.type === 'availability' || item.type === 'reminder') {
      // Simulate real WhatsApp helper triggers
      window.open('https://wa.me/254700000000?text=' + encodeURIComponent(`Hello, I'm inquiring about the property listed at ${item.location}. Is it still vacant?`), '_blank');
    } else {
      triggerToast(`Fitted action: "${getActionText(item.type)}" simulating for ${item.title}`);
    }
  };

  const unreadCount = updates.filter(u => !u.isRead).length;

  return (
    <div className="w-full flex flex-col space-y-4 pb-16">
      
      {/* 1. Header Back Section */}
      <div className="flex items-center justify-between pb-1 border-b border-neutral-100 dark:border-stone-800">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onBack}
          className="flex items-center space-x-1.5 text-xs font-black uppercase text-neutral-500 dark:text-stone-400 hover:text-neutral-700 dark:hover:text-stone-200 cursor-pointer select-none border-none bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Back to saved homes</span>
        </motion.button>

        {updates.length > 0 && (
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onMarkAllRead}
                className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-450 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </motion.button>
            )}

            <button
              onClick={onClearRead}
              className="text-[10px] font-black uppercase tracking-wider text-neutral-550 dark:text-stone-400 hover:text-red-500 cursor-pointer bg-transparent border-none"
            >
              Clear read
            </button>
          </div>
        )}
      </div>

      {/* 2. Headline banner block */}
      <div className="space-y-1">
        <h2 className="text-base font-black text-neutral-800 dark:text-neutral-50 tracking-tight flex items-center space-x-1.5">
          <Bell className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Saved Updates & Alerts</span>
        </h2>
        <p className="text-[11.5px] font-semibold text-neutral-500 dark:text-stone-400 leading-normal">
          Price drops, vacancy updates, and caretaker review alerts from your shortlisted homes.
        </p>
      </div>

      {/* 3. Empty Alert updates handling */}
      {updates.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/95 dark:bg-stone-900/90 border border-neutral-100 dark:border-stone-850 rounded-2.5xl p-8 text-center space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-stone-850 flex items-center justify-center text-neutral-700 dark:text-stone-400 mx-auto">
            <Bell className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div className="space-y-1 max-w-xs mx-auto">
            <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-100 uppercase tracking-wider">No updates yet</h4>
            <p className="text-[11px] font-medium text-neutral-500 dark:text-stone-400 leading-normal">
              We’ll show price drops, changes in verification, and caretaker availability notices for your saved Kejas here.
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onBack}
            className="px-5 h-9 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[11px] rounded-xl cursor-pointer"
          >
            Back to saved homes
          </motion.button>
        </motion.div>
      ) : (
        /* Updates list card container */
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {updates.map((item) => (
              <motion.div
                key={item.id}
                layoutId={`update-card-${item.id}`}
                onClick={() => !item.isRead && onMarkRead(item.id)}
                className={`p-3.5 rounded-2.5xl border transition-all flex flex-col space-y-2.5 cursor-pointer select-none ${
                  !item.isRead
                    ? 'bg-emerald-500/[0.02] border-emerald-500/20 dark:border-emerald-500/15 shadow-3xs'
                    : 'bg-white/95 dark:bg-stone-900/95 border-neutral-100 dark:border-stone-850'
                }`}
              >
                
                {/* Horizontal main body */}
                <div className="flex items-start space-x-3">
                  {getUpdateIcon(item.type)}

                  <div className="flex-1 min-w-0 space-y-1">
                    
                    {/* Header line info time / unread indicator */}
                    <div className="flex items-center justify-between space-x-2">
                      <span className="text-[10px] font-black uppercase text-neutral-550 dark:text-stone-400 tracking-wider font-mono">
                        {item.type.replace('_', ' ')}
                      </span>
                      <div className="flex items-center space-x-1.5 font-mono text-2xs text-neutral-550 font-bold select-none">
                        <span>{item.timeAgo}</span>
                        {!item.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                        )}
                      </div>
                    </div>

                    <h4 className="text-[12.5px] font-black text-neutral-800 dark:text-stone-100 leading-tight">
                      {item.title}
                    </h4>

                    <p className="text-[11.5px] font-medium text-neutral-550 dark:text-stone-300 leading-relaxed">
                      {item.message}
                    </p>

                    <span className="flex items-center gap-1 text-[10px] text-neutral-550 dark:text-stone-400 font-semibold truncate pt-0.5">
                      <MapPin className="w-3 h-3 stroke-[2.2] shrink-0" aria-hidden="true" />
                      {item.location}
                    </span>

                  </div>
                </div>

                {/* Sub-card small button action grids */}
                <div className="flex items-center justify-end pt-2 border-t border-neutral-100/60 dark:border-stone-850/60">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={(e) => handleActionClick(e, item)}
                    className="h-7.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-stone-850 dark:hover:bg-stone-800 text-[10.5px] font-extrabold text-neutral-700 dark:text-stone-200 flex items-center space-x-1 cursor-pointer border-none"
                  >
                    <span>{getActionText(item.type)}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-550" />
                  </motion.button>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 4. Renting safety warning message banner */}
      <div className="w-full bg-orange-500/[0.03] dark:bg-orange-950/10 border border-orange-500/10 p-3 rounded-2.5xl flex items-start space-x-2.5 leading-tight select-none mt-2.5">
        <AlertTriangle className="w-4.5 h-4.5 text-orange-700 dark:text-orange-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-[11.5px] font-black text-orange-850 dark:text-orange-400">
            Tenant Protection Guidelines
          </h4>
          <p className="text-[10px] text-neutral-550 dark:text-stone-400 font-semibold leading-relaxed">
            Always confirm availability with the caretaker before visiting. **Never pay booking deposit, scouting charges, or keys fee before physically viewing the house** and confirming caretaker identity.
          </p>
        </div>
      </div>

      {/* 5. Alert settings preferences mockup */}
      <div className="bg-white/95 dark:bg-stone-900/90 border border-neutral-150/85 dark:border-stone-850 rounded-2.5xl p-4 space-y-3.5 mt-2 shadow-3xs">
        
        {/* Preference header */}
        <div className="flex items-start space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-700 shrink-0">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-neutral-850 dark:text-stone-100 uppercase tracking-wider">Alert preferences</h4>
            <span className="block text-[10px] font-semibold text-neutral-550 dark:text-stone-400 leading-none">
              Customize how we notify you on saved Kejas changes
            </span>
          </div>
        </div>

        {/* Toggles list settings */}
        <div className="space-y-2.5 pt-1">
          
          {/* Row 1: Price drops */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-700 dark:text-stone-300">Price drop notices</span>
            <button
              onClick={() => setPrefPrice(!prefPrice)}
              aria-pressed={prefPrice}
              aria-label="Toggle price drop notifications preference"
              className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer outline-none border-none ${
                prefPrice ? 'bg-emerald-700' : 'bg-neutral-200 dark:bg-stone-850'
              }`}
            >
              <div className={`w-4.5 h-4.5 bg-white rounded-full absolute top-[2px] transition-all ${
                prefPrice ? 'right-[2px] shadow-sm' : 'left-[2px]'
              }`} />
            </button>
          </div>

          {/* Row 2: Availability changes */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-700 dark:text-stone-300">Availability updates</span>
            <button
              onClick={() => setPrefAvail(!prefAvail)}
              aria-pressed={prefAvail}
              aria-label="Toggle availability changes preference"
              className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer outline-none border-none ${
                prefAvail ? 'bg-emerald-700' : 'bg-neutral-200 dark:bg-stone-850'
              }`}
            >
              <div className={`w-4.5 h-4.5 bg-white rounded-full absolute top-[2px] transition-all ${
                prefAvail ? 'right-[2px] shadow-sm' : 'left-[2px]'
              }`} />
            </button>
          </div>

          {/* Row 3: Verification updates */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-700 dark:text-stone-300">Verification badge alerts</span>
            <button
              onClick={() => setPrefVerify(!prefVerify)}
              aria-pressed={prefVerify}
              aria-label="Toggle verification updates preference"
              className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer outline-none border-none ${
                prefVerify ? 'bg-emerald-700' : 'bg-neutral-200 dark:bg-stone-850'
              }`}
            >
              <div className={`w-4.5 h-4.5 bg-white rounded-full absolute top-[2px] transition-all ${
                prefVerify ? 'right-[2px] shadow-sm' : 'left-[2px]'
              }`} />
            </button>
          </div>

          {/* Row 4: Recently updated */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-700 dark:text-stone-300">Recently updated houses</span>
            <button
              onClick={() => setPrefRecent(!prefRecent)}
              aria-pressed={prefRecent}
              aria-label="Toggle recently updated homes preference"
              className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer outline-none border-none ${
                prefRecent ? 'bg-emerald-700' : 'bg-neutral-200 dark:bg-stone-850'
              }`}
            >
              <div className={`w-4.5 h-4.5 bg-white rounded-full absolute top-[2px] transition-all ${
                prefRecent ? 'right-[2px] shadow-sm' : 'left-[2px]'
              }`} />
            </button>
          </div>

        </div>

        {/* Small mockup footnote */}
        <div className="flex items-center justify-center gap-1 pt-2 border-t border-neutral-100 dark:border-stone-800 text-2xs font-semibold text-neutral-550 dark:text-stone-400 font-mono text-center">
          <Info className="w-3 h-3 stroke-[2.2] shrink-0" aria-hidden="true" />
          Alert preferences aren't saved to your account yet.
        </div>

      </div>

    </div>
  );
}
