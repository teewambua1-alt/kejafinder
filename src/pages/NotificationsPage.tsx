import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Settings,
  AlertCircle,
  X
} from 'lucide-react';
import NotificationsHeader from '../components/NotificationsHeader';
import NotificationsSearchBar from '../components/NotificationsSearchBar';
import NotificationTabs, { NotificationTabType } from '../components/NotificationTabs';
import NotificationFilterChips from '../components/NotificationFilterChips';
import { sampleNotifications } from '../data/notificationsData';
import NotificationFeed from '../components/NotificationFeed';
import NotificationFeedActions from '../components/NotificationFeedActions';
import NotificationSafetyCard from '../components/NotificationSafetyCard';
import NotificationsEmptyState from '../components/NotificationsEmptyState';
import RecommendedAlerts, { AlertSettings } from '../components/RecommendedAlerts';
import NotificationSummaryCards from '../components/NotificationSummaryCards';
import NotificationSettingsPanel from '../components/NotificationSettingsPanel';

interface NotificationsPageProps {
  onBackToHome?: () => void;
  onOpenSafety?: () => void;
}

export default function NotificationsPage({ onBackToHome, onOpenSafety }: NotificationsPageProps) {
  // Local reactive notifications list state
  const [notifications, setNotifications] = useState(sampleNotifications);
  
  // Local safety card visibility state
  const [showSafetyCard, setShowSafetyCard] = useState(true);

  // Search, Tab, and Sub-filter states
  const [notificationSearchQuery, setNotificationSearchQuery] = useState("");
  const [activeNotificationTab, setActiveNotificationTab] = useState<NotificationTabType>("all");
  const [activeNotificationFilter, setActiveNotificationFilter] = useState<string>("all");

  // Recommended alert settings state
  const [recommendedAlertSettings, setRecommendedAlertSettings] = useState<AlertSettings>({
    priceDrops: true,
    availabilityReminders: true,
    newVerifiedHomes: false,
    caretakerReplies: true,
    safetyAlerts: true,
  });

  // Local state for Instant alerts toggle 
  const [instantAlertsEnabled, setInstantAlertsEnabled] = useState(true);

  // Settings drawer visibility toggle state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Ref to scroll to recommended alerts
  const recommendedAlertsRef = useRef<HTMLDivElement>(null);
  
  // Interactive prototype feedback state
  const [notificationFeedback, setNotificationFeedback] = useState<string | null>(null);

  // Dynamic status counts
  const unreadCount = notifications.filter(item => !item.isRead).length;
  const totalCount = notifications.length;
  const savedUpdatesCount = notifications.filter(item => item.category === 'saved' || item.category === 'availability').length;
  const priceDropCount = notifications.filter(item => item.category === 'price').length;
  const messageCount = notifications.filter(item => item.category === 'message' || item.category === 'support').length;
  const safetyCount = notifications.filter(item => item.category === 'safety' || item.category === 'verification').length;

  // Feedback display utility with clear timeout resets
  const triggerFeedback = (msg: string) => {
    setNotificationFeedback(msg);
    // Timeout to clear feedback automatically
    const timer = setTimeout(() => {
      setNotificationFeedback(prev => prev === msg ? null : prev);
    }, 3500);
    return () => clearTimeout(timer);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isRead: true } : item
      )
    );
  };

  const handleNotificationAction = (id: string, actionType: string) => {
    // Standard requirements: entire card or action click sets isRead = true
    markNotificationRead(id);

    let msg = "";
    switch (actionType) {
      case "view_listing":
        msg = "Listing details coming soon.";
        break;
      case "open_message":
        msg = "Messages will open in a later version.";
        break;
      case "view_match":
        msg = "Matched homes coming soon.";
        break;
      case "read_more":
        msg = "KejaFinder updates coming soon.";
        break;
      case "learn_safety":
        if (onOpenSafety) {
          onOpenSafety();
          return; // Skip default message since we're navigating
        } else {
          msg = "Safety tips page coming soon.";
        }
        break;
      default:
        msg = "Notification marked as read.";
    }
    triggerFeedback(msg);
  };

  const handleNotificationDismiss = (id: string) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
    triggerFeedback("Notification dismissed.");
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, isRead: true })));
    triggerFeedback("All notifications marked as read.");
  };

  const handleClearRead = () => {
    setNotifications(prev => prev.filter(item => !item.isRead));
    triggerFeedback("Read notifications cleared.");
  };

  const handleViewSafetyTips = () => {
    if (onOpenSafety) {
      onOpenSafety();
    } else {
      triggerFeedback("Safety tips page coming soon.");
    }
  };

  const handleDismissSafetyCard = () => {
    setShowSafetyCard(false);
    triggerFeedback("Safety reminder dismissed.");
  };

  const handleToggleAlert = (key: keyof AlertSettings, label: string) => {
    const nextVal = !recommendedAlertSettings[key];
    setRecommendedAlertSettings(prev => ({
      ...prev,
      [key]: nextVal
    }));

    // Match exact requested feedback titles e.g. "Price drop alerts enabled.", "New verified homes alerts disabled."
    let feedbackLabel = label;
    if (key === 'priceDrops') feedbackLabel = "Price drop";

    triggerFeedback(`${feedbackLabel} alerts ${nextVal ? 'enabled' : 'disabled'}.`);
  };

  const handleClearFilters = () => {
    setActiveNotificationTab("all");
    setActiveNotificationFilter("all");
    setNotificationSearchQuery("");
    triggerFeedback("Filters cleared.");
  };

  const handleBrowseHomes = () => {
    triggerFeedback("Search page coming soon.");
  };

  const handleSetAlerts = () => {
    if (recommendedAlertsRef.current) {
      recommendedAlertsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      triggerFeedback("Scrolled to recommended alerts below.");
    } else {
      triggerFeedback("Alert settings coming soon.");
    }
  };

  const handleToggleInstantAlerts = (enabled: boolean) => {
    setInstantAlertsEnabled(enabled);
    triggerFeedback(enabled ? "Instant alerts enabled locally." : "Instant alerts paused locally.");
  };

  const handleSelectSummary = (type: 'unread' | 'saved' | 'price' | 'messages' | 'safety') => {
    setNotificationSearchQuery("");
    switch (type) {
      case 'unread':
        setActiveNotificationTab("all");
        setActiveNotificationFilter("unread");
        triggerFeedback("Showing unread notifications.");
        break;
      case 'saved':
        setActiveNotificationTab("saved");
        setActiveNotificationFilter("all");
        triggerFeedback("Showing saved-home updates.");
        break;
      case 'price':
        setActiveNotificationTab("all");
        setActiveNotificationFilter("price");
        triggerFeedback("Showing price drop alerts.");
        break;
      case 'messages':
        setActiveNotificationTab("messages");
        setActiveNotificationFilter("all");
        triggerFeedback("Showing messages and support.");
        break;
      case 'safety':
        setActiveNotificationTab("safety");
        setActiveNotificationFilter("all");
        triggerFeedback("Showing safety and verification alerts.");
        break;
    }
  };

  // Simple toast trigger for placeholders
  const handlePlaceholderClick = (sectionName: string) => {
    console.log(`Placeholder clicked: ${sectionName}. Real interactive rendering is reserved for v1.1.6+`);
  };

  // 1. Filter by Active Category Tab
  const filterByTab = (notif: typeof sampleNotifications[0]): boolean => {
    switch (activeNotificationTab) {
      case 'all':
        return true;
      case 'saved':
        return notif.category === 'saved' || notif.category === 'price' || notif.category === 'availability';
      case 'safety':
        return notif.category === 'safety' || notif.category === 'verification';
      case 'messages':
        return notif.category === 'message' || notif.category === 'support';
      default:
        return true;
    }
  };

  // 2. Filter by Active Sub-filter Chip
  const filterByChip = (notif: typeof sampleNotifications[0]): boolean => {
    switch (activeNotificationFilter) {
      case 'unread':
        return !notif.isRead;
      case 'price_drops':
      case 'price drops':
      case 'price':
        return notif.category === 'price';
      case 'availability':
        return notif.category === 'availability';
      case 'verified':
        return notif.category === 'verification';
      case 'support':
        return notif.category === 'support';
      case 'all':
      case 'this_week':
      case 'this week':
      default:
        return true;
    }
  };

  // 3. Match search query space-insensitively
  const filterBySearch = (notif: typeof sampleNotifications[0]): boolean => {
    if (!notificationSearchQuery.trim()) return true;
    const query = notificationSearchQuery.toLowerCase().trim();
    
    const titleMatch = notif.title?.toLowerCase().includes(query) || false;
    const msgMatch = notif.message?.toLowerCase().includes(query) || false;
    const locationMatch = notif.location?.toLowerCase().includes(query) || false;
    const listingTitleMatch = notif.listingTitle?.toLowerCase().includes(query) || false;

    return titleMatch || msgMatch || locationMatch || listingTitleMatch;
  };

  // Run full filter pipe inside page
  const filteredNotifications = notifications
    .filter(filterByTab)
    .filter(filterByChip)
    .filter(filterBySearch);

  // Stagger entry animation variants
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
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.35, 
        ease: 'easeOut' 
      } 
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex-grow flex flex-col space-y-4 pt-1 pb-32 px-4 max-w-md mx-auto w-full overflow-x-hidden"
    >
      {/* 1. Real Dynamic Notifications Header with active unread tracker count */}
      <NotificationsHeader unreadCount={unreadCount} />

      {/* 2. Page Title Section below the header */}
      <motion.div variants={itemVariants} className="w-full px-1 flex flex-col space-y-1">
        <div className="flex items-center space-x-2.5">
          {onBackToHome && (
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={onBackToHome}
              className="w-9 h-9 rounded-full bg-white dark:bg-stone-900 border border-neutral-200/50 dark:border-stone-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-stone-850 shadow-3xs transition-all cursor-pointer outline-none shrink-0"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-4.5 h-4.5 stroke-[2.2]" />
            </motion.button>
          )}
          <h1 className="text-xl font-black text-neutral-800 dark:text-neutral-100 uppercase tracking-tight">
            Notifications
          </h1>
        </div>
        <p className="text-xs text-neutral-500 dark:text-stone-400 font-semibold tracking-wide">
          Stay updated on saved homes and new activity.
        </p>
      </motion.div>

      {/* 3. Real Notifications Search Bar */}
      <motion.div variants={itemVariants} className="w-full">
        <NotificationsSearchBar 
          value={notificationSearchQuery}
          onChange={setNotificationSearchQuery}
          onSettingsClick={() => setIsSettingsOpen(true)}
        />
      </motion.div>

      {/* 3b. Interactive Mobile-First Activity Alert Summary Cards (Rendered conditionally when notifications > 0) */}
      {notifications.length > 0 && (
        <motion.div variants={itemVariants} className="w-full">
          <NotificationSummaryCards 
            unreadCount={unreadCount}
            savedUpdatesCount={savedUpdatesCount}
            priceDropCount={priceDropCount}
            messageCount={messageCount}
            safetyCount={safetyCount}
            instantAlertsEnabled={instantAlertsEnabled}
            onToggleInstantAlerts={handleToggleInstantAlerts}
            onSelectSummary={handleSelectSummary}
          />
        </motion.div>
      )}

      {/* 4. Real Notification Category Tabs */}
      <motion.div variants={itemVariants} className="w-full">
        <NotificationTabs 
          activeTab={activeNotificationTab}
          onChange={setActiveNotificationTab}
        />
      </motion.div>

      {/* 5. Real Notification Filter Chips */}
      <motion.div variants={itemVariants} className="w-full">
        <NotificationFilterChips 
          activeFilter={activeNotificationFilter}
          onChange={setActiveNotificationFilter}
        />
      </motion.div>

      {/* 6. Brand new interactive safety reminder card (AnimatePresence supported) */}
      <AnimatePresence mode="popLayout">
        {showSafetyCard && (
          <motion.div
            key="safety-alert-wrapper"
            variants={itemVariants}
            className="w-full"
            exit={{ opacity: 0, height: 0, scale: 0.95, marginBottom: -16 }}
            transition={{ duration: 0.25 }}
          >
            <NotificationSafetyCard 
              onViewSafetyTips={handleViewSafetyTips}
              onDismiss={handleDismissSafetyCard}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating inline alert/feedback banner if any action is pressed */}
      <AnimatePresence>
        {notificationFeedback && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            className="w-full overflow-hidden"
          >
            <div className="bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/30 dark:border-emerald-500/15 rounded-2.5xl p-3 flex items-center justify-between text-neutral-800 dark:text-stone-200 shadow-2xs">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-wider">{notificationFeedback}</span>
              </div>
              <button 
                onClick={() => setNotificationFeedback(null)}
                className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-stone-800 text-neutral-400 select-none outline-none cursor-pointer"
                aria-label="Dismiss message"
              >
                <X className="w-3.5 h-3.5 stroke-[2.2]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive layout dispatcher based on notification availability and filtering constraints */}
      {notifications.length === 0 ? (
        <motion.div key="empty-slate-outer" variants={itemVariants} className="w-full">
          <NotificationsEmptyState 
            mode="empty"
            onBrowseHomes={handleBrowseHomes}
            onSetAlerts={handleSetAlerts}
          />
        </motion.div>
      ) : filteredNotifications.length === 0 ? (
        <motion.div key="no-results-slate-outer" variants={itemVariants} className="w-full">
          <NotificationsEmptyState 
            mode="no-results"
            onClearFilters={handleClearFilters}
          />
        </motion.div>
      ) : (
        <>
          {/* 7a. Dynamic notification list feed action controls */}
          <motion.div key="feed-actions-active" variants={itemVariants} className="w-full">
            <NotificationFeedActions 
              unreadCount={unreadCount}
              onMarkAllRead={handleMarkAllRead}
              onClearRead={handleClearRead}
              totalCount={totalCount}
            />
          </motion.div>

          {/* 7b. Real Interactive Notification Feed */}
          <motion.div key="feed-items-active" variants={itemVariants} className="w-full">
            <NotificationFeed 
              notifications={filteredNotifications}
              onNotificationAction={handleNotificationAction}
              onNotificationDismiss={handleNotificationDismiss}
            />
          </motion.div>
        </>
      )}

      {/* 9. Recommended alerts dynamic subscription area with targeting ref */}
      <motion.div ref={recommendedAlertsRef} variants={itemVariants} className="w-full">
        <RecommendedAlerts 
          settings={recommendedAlertSettings}
          onToggle={handleToggleAlert}
        />
      </motion.div>

      {/* 10. Interactive Advanced Notification Settings Trigger Card */}
      <motion.div variants={itemVariants} className="w-full">
        <button 
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Open detailed notification subscriptions and channels manager"
          className="w-full bg-white/95 dark:bg-stone-900/95 border border-neutral-200/65 dark:border-stone-850/65 rounded-3xl p-4.5 shadow-2xs space-y-3.5 transition-all hover:bg-neutral-50/50 dark:hover:bg-stone-850/15 hover:border-emerald-500/20 text-left cursor-pointer outline-none block"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
              <span className="block text-[10px] font-black text-neutral-805 dark:text-stone-200 uppercase tracking-wider">
                My Alert Subscriptions
              </span>
            </div>
            
            <span className="text-[8px] font-black py-1 px-2.5 rounded-lg bg-emerald-50 dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 border border-emerald-100/40 dark:border-stone-750 uppercase tracking-widest font-sans">
              Manage Panel
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-[10px] font-bold text-neutral-550 dark:text-stone-400">
            <div className="flex items-center space-x-2 p-2 rounded-xl bg-neutral-50/50 dark:bg-stone-850/50 border border-neutral-150/40 dark:border-stone-800/40">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>WhatsApp Alerts Preview</span>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-xl bg-neutral-50/50 dark:bg-stone-850/50 border border-neutral-150/40 dark:border-stone-800/40">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-stone-600" />
              <span>SMS/Email Options Preview</span>
            </div>
          </div>
        </button>
      </motion.div>

      {/* Render smooth settings bottom sheet with full transition lifecycle support */}
      <AnimatePresence>
        {isSettingsOpen && (
          <NotificationSettingsPanel 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
            onSave={triggerFeedback} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
