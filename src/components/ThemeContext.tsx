import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Standard offline-first storage retrieval
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kejafinder-theme');
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
      // Or default to light as instructed
      return 'light';
    }
    return 'light';
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      // Also style body background for external frame and main body
      root.style.backgroundColor = '#0c0a09'; // stone-950 dark charcoal background
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f7fee7'; // traditional light-lime background
    }
    localStorage.setItem('kejafinder-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
