'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathwayTheme } from '@/context/ThemeContext';
import { PATHWAY_THEMES, type PathwayThemeId } from '@/lib/constants';
import { Sparkles, Palette, Check } from 'lucide-react';

export function PathwayThemeSelector() {
  const { currentTheme, themeConfig, setTheme } = usePathwayTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themesList = Object.values(PATHWAY_THEMES);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer select-none"
        style={{
          borderColor: `${themeConfig.primary}50`,
          backgroundColor: `${themeConfig.primary}15`,
          color: themeConfig.primary,
          boxShadow: `0 0 12px ${themeConfig.primary}30`,
        }}
        aria-label="Select Neural Pathway Theme"
        title="Switch Neural Pathway Interface Theme"
      >
        <span className="text-base leading-none">{themeConfig.icon}</span>
        <span className="hidden lg:inline uppercase tracking-wider">{themeConfig.name}</span>
        <Palette size={13} className="opacity-80" />
      </button>

      {/* Theme Selection Dropdown / Drawer */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-72 sm:w-80 glass-card p-3 border shadow-[0_0_40px_rgba(0,0,0,0.8)] z-50 flex flex-col gap-1.5 animate-in fade-in zoom-in-95 duration-150"
          style={{
            borderColor: `${themeConfig.primary}50`,
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-2 py-1.5 border-b border-[rgba(255,255,255,0.06)] mb-1">
            <span
              className="text-[11px] font-bold tracking-widest text-white uppercase flex items-center gap-1.5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <Sparkles size={12} style={{ color: themeConfig.primary }} />
              NEURAL PATHWAY THEME
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">
              {themesList.length} MODES
            </span>
          </div>

          {/* List of Pathway Themes */}
          <div className="flex flex-col gap-1 max-h-80 overflow-y-auto pr-1">
            {themesList.map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-lg flex items-center justify-between text-left transition-all border cursor-pointer ${
                    isSelected
                      ? 'border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.08)]'
                      : 'border-transparent hover:bg-[rgba(255,255,255,0.04)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Glowing color swatch */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 border"
                      style={{
                        backgroundColor: `${theme.primary}20`,
                        borderColor: `${theme.primary}60`,
                        boxShadow: isSelected ? `0 0 10px ${theme.primary}` : 'none',
                      }}
                    >
                      {theme.icon}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white uppercase tracking-wider truncate">
                          {theme.name}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-[var(--text-secondary)] truncate">
                        {theme.codename}
                      </p>
                    </div>
                  </div>

                  {/* Right indicator */}
                  {isSelected ? (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: theme.primary }}
                    >
                      <Check size={12} className="text-black stroke-[3]" />
                    </div>
                  ) : (
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0 border"
                      style={{ backgroundColor: theme.primary, borderColor: theme.primary }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
