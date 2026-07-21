import React from 'react';
import BottomNav from './BottomNav';
import { useTheme } from './ThemeContext';
import AIChatbot from './AIChatbot';
import InstallPrompt from './InstallPrompt';

interface AppShellProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function AppShell({ children, activeTab, onTabChange }: AppShellProps) {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans transition-colors duration-300 ${
      isDark ? 'bg-stone-950 text-neutral-100 dark' : 'bg-slate-50 text-neutral-800'
    }`}>
      {/* Premium Background Blurs to mimic the plant blur in the prototype */}
      <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse transition-colors ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-300'}`} />
      <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse transition-colors ${isDark ? 'bg-lime-900/30' : 'bg-lime-300'}`} />
      <div className={`absolute top-1/3 left-1/4 w-80 h-80 rounded-full mix-blend-multiply filter blur-[100px] opacity-15 transition-colors ${isDark ? 'bg-emerald-800/10' : 'bg-emerald-200'}`} />

      {/* Main Responsive Mobile-First App Container */}
      <div className={`w-full lg:max-w-[400px] h-[100dvh] relative flex flex-col overflow-hidden border-none lg:border-l lg:border-r backdrop-blur-md transition-all duration-300 shadow-none lg:shadow-2xl ${
        isDark 
          ? 'bg-stone-900/95 lg:border-neutral-800/60 shadow-[0_20px_50px_rgba(0,0,0,0.45)]' 
          : 'bg-white/95 lg:border-neutral-100/50 shadow-xl'
      }`}>
        
        {/* Subtle internal decor background gradient */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-emerald-200/10 rounded-full filter blur-xl pointer-events-none" />

        {/* Content Viewport with solid spacing at bottom to prevent nav overlay clipping */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col p-6 pb-28">
          {children}
        </div>

        {/* Sticky Mobile Bottom Navigation Bar (v0.1.8) */}
        <BottomNav activeTab={activeTab} onTabChange={onTabChange} />

        {/* AI Assistant Chatbot */}
        <AIChatbot />

        {/* PWA Install Prompt */}
        <InstallPrompt />
      </div>
    </div>
  );
}

