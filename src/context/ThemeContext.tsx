'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { PATHWAY_THEMES, type PathwayThemeId, type PathwayThemeConfig } from '@/lib/constants';

interface ThemeContextType {
  currentTheme: PathwayThemeId;
  themeConfig: PathwayThemeConfig;
  setTheme: (theme: PathwayThemeId) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'nexus_active_theme_v1';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentThemeState] = useState<PathwayThemeId>('nexus');

  // Apply CSS variables and data attribute to document element
  const applyTheme = useCallback((themeId: PathwayThemeId) => {
    const config = PATHWAY_THEMES[themeId] || PATHWAY_THEMES.nexus;

    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-theme', themeId);

      // Dynamically update primary/secondary colors
      root.style.setProperty('--neon-primary', config.primary);
      root.style.setProperty('--neon-secondary', config.secondary);
      root.style.setProperty('--neon-accent', config.accent);
      root.style.setProperty('--glow-primary', config.glow);
      root.style.setProperty('--border-neon', `${config.primary}60`);
    }
  }, []);

  const setTheme = useCallback((themeId: PathwayThemeId) => {
    setCurrentThemeState(themeId);
    applyTheme(themeId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    }
  }, [applyTheme]);

  const cycleTheme = useCallback(() => {
    const order: PathwayThemeId[] = ['nexus', 'strength', 'intellect', 'discipline', 'vitality', 'charisma', 'creativity'];
    const idx = order.indexOf(currentTheme);
    const next = order[(idx + 1) % order.length];
    setTheme(next);
  }, [currentTheme, setTheme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as PathwayThemeId | null;
      if (stored && PATHWAY_THEMES[stored]) {
        setCurrentThemeState(stored);
        applyTheme(stored);
      } else {
        applyTheme('nexus');
      }
    }
  }, [applyTheme]);

  const themeConfig = PATHWAY_THEMES[currentTheme] || PATHWAY_THEMES.nexus;

  return (
    <ThemeContext.Provider value={{ currentTheme, themeConfig, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function usePathwayTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('usePathwayTheme must be used within a ThemeProvider');
  }
  return context;
}
