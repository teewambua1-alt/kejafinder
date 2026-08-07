import React from 'react';
import BottomNav from './BottomNav';
import DesktopNavbar from './DesktopNavbar';
import { useTheme } from './ThemeContext';
import AIChatbot from './AIChatbot';
import InstallPrompt from './InstallPrompt';

interface AppShellProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onNotificationsClick?: () => void;
  onOpenAuth?: () => void;
  onOpenTestMode?: () => void;
  onOpenDesignSystem?: () => void;
  onSearchSubmit?: (query: string) => void;
  pullToRefreshHandlers?: {
    onTouchStart?: (e: React.TouchEvent<HTMLDivElement>) => void;
    onTouchMove?: (e: React.TouchEvent<HTMLDivElement>) => void;
    onTouchEnd?: (e: React.TouchEvent<HTMLDivElement>) => void;
  };
  pullToRefreshIndicator?: React.ReactNode;
}

/**
 * Three-tier responsive shell:
 *  - Mobile (< md, 768px): unchanged phone-frame-filling-viewport behavior --
 *    fixed height, its own internal scroll, BottomNav, decorative blurs.
 *  - Tablet (md-xl, 768-1279px) and Desktop (xl+, 1280px): a normal
 *    full-width scrolling page with a sticky DesktopNavbar and no bottom
 *    nav. Tablet/desktop share this one branch -- they differ only in the
 *    max-width/grid-column Tailwind breakpoints used by the navbar and by
 *    individual pages, not in structure.
 *
 * `{children}` is rendered exactly once regardless of breakpoint -- only
 * BottomNav/DesktopNavbar (small, cheap) are duplicated in the DOM and
 * toggled with responsive visibility classes, so pages never get mounted
 * twice (which would double-fire data fetches, mount two Leaflet maps, etc).
 */
export default function AppShell({
  children,
  activeTab,
  onTabChange,
  onNotificationsClick,
  onOpenAuth,
  onOpenTestMode,
  onOpenDesignSystem,
  onSearchSubmit,
  pullToRefreshHandlers,
  pullToRefreshIndicator,
}: AppShellProps) {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen w-full flex items-center justify-center md:block relative overflow-hidden md:overflow-visible font-sans transition-colors duration-300 ${
      isDark ? 'bg-stone-950 text-neutral-100 dark' : 'bg-slate-50 text-neutral-800'
    }`}>
      {/* Premium Background Blurs -- mobile phone-frame ambience only */}
      <div className={`md:hidden absolute -top-40 -right-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse transition-colors ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-300'}`} />
      <div className={`md:hidden absolute -bottom-40 -left-40 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse transition-colors ${isDark ? 'bg-lime-900/30' : 'bg-lime-300'}`} />
      <div className={`md:hidden absolute top-1/3 left-1/4 w-80 h-80 rounded-full mix-blend-multiply filter blur-[100px] opacity-15 transition-colors ${isDark ? 'bg-emerald-800/10' : 'bg-emerald-200'}`} />

      {/* Main App Container: phone-card below md, full-bleed page at md+ */}
      <div className={`w-full h-[100dvh] md:h-auto md:min-h-screen relative flex flex-col overflow-hidden md:overflow-visible border-none backdrop-blur-md md:backdrop-blur-none transition-all duration-300 shadow-none ${
        isDark ? 'bg-stone-900/95 md:bg-stone-950' : 'bg-white/95 md:bg-slate-50'
      }`}>

        {/* Subtle internal decor background gradient -- mobile only */}
        <div className="md:hidden absolute top-20 left-10 w-40 h-40 bg-emerald-200/10 rounded-full filter blur-xl pointer-events-none" />

        {/* Sticky tablet/desktop navbar -- hidden on mobile (renders its own md:block internally) */}
        <DesktopNavbar
          activeTab={activeTab}
          onTabChange={onTabChange}
          onNotificationsClick={onNotificationsClick}
          onOpenAuth={onOpenAuth}
          onOpenTestMode={onOpenTestMode}
          onOpenDesignSystem={onOpenDesignSystem}
          onSearchSubmit={onSearchSubmit}
        />

        {/* Content Viewport: independently scrolling fixed-height box on mobile
            (pb-28 clears the bottom nav); on md+ it's part of the normal page
            flow instead, width-capped and centered like DesktopNavbar's row. */}
        <div
          className="flex-1 overflow-y-auto md:overflow-visible no-scrollbar relative flex flex-col p-6 pb-28 md:p-8 md:pb-10 md:max-w-3xl xl:max-w-7xl md:mx-auto md:w-full xl:px-12"
          {...pullToRefreshHandlers}
        >
          {pullToRefreshIndicator}
          {children}
        </div>

        {/* Mobile-only bottom navigation (unchanged component, just hidden at md+) */}
        <div className="md:hidden">
          <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
        </div>

        {/* AI Assistant Chatbot */}
        <AIChatbot />

        {/* PWA Install Prompt */}
        <InstallPrompt />
      </div>
    </div>
  );
}

