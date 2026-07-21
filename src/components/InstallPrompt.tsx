import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We no longer need the prompt.  Clear it up.
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 left-4 right-4 z-50 lg:left-1/2 lg:right-auto lg:w-96 lg:-ml-48"
        >
          <div className="bg-emerald-600 dark:bg-emerald-700 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">Get the App</p>
                <p className="text-xs text-emerald-100">Install KejaFinder on your phone</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleInstallClick}
                className="bg-white text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                Install
              </button>
              <button 
                onClick={handleDismiss}
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-500 rounded-lg transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
