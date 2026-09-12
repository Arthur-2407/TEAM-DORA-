'use client';

import React from 'react';
import { Menu, Flame, Coins, Plus, Shield, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { XPBar } from '@/components/ui/XPBar';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

import { PathwayThemeSelector } from '@/components/ui/PathwayThemeSelector';

interface TopBarProps {
  onMenuToggle: () => void;
  onOpenCreateMission?: () => void;
}

export function TopBar({ onMenuToggle, onOpenCreateMission }: TopBarProps) {
  const { profile, signOut } = useAuth();

  const level = profile?.level ?? 1;
  const currentXp = profile?.current_xp ?? 0;
  const xpToNextLevel = profile?.xp_to_next_level ?? 100;
  const credits = profile?.credits ?? 0;
  const streak = profile?.current_streak ?? 0;

  return (
    <header className="sticky top-0 z-30 w-full bg-[rgba(10,10,15,0.85)] backdrop-blur-xl border-b border-[var(--border-subtle)] px-4 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Side: Mobile Menu Button & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-tertiary)] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <Menu size={22} />
          </button>

          <Link href="/dashboard" className="hidden sm:flex md:hidden items-center gap-2">
            <Shield size={18} className="text-[var(--neon-cyan)]" />
            <span
              className="font-bold text-sm tracking-wider text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              NEXUS
            </span>
          </Link>
        </div>

        {/* Center: Dynamic XP Progress Bar */}
        <div className="flex-1 max-w-md hidden sm:block">
          <XPBar
            level={level}
            currentXp={currentXp}
            xpToNextLevel={xpToNextLevel}
            size="sm"
            showDetails={true}
          />
        </div>

        {/* Right Side: Pathway Theme Selector, Currency, Streaks & Quick Action */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Dynamic Neural Pathway Theme Switcher */}
          <PathwayThemeSelector />
          {/* Streak Counter */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(255,136,0,0.1)] border border-[rgba(255,136,0,0.3)] text-[#ff8800] text-xs font-mono font-bold"
            title={`${streak} Days Active Uplink Streak`}
          >
            <Flame size={15} className="flame-icon text-[#ff8800]" />
            <span>{streak}d</span>
          </div>

          {/* Gold Counter */}
          <Link
            href="/shop"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold hover:bg-amber-400/20 transition-colors"
            title="Gold in Adventure Purse"
          >
            <Coins size={15} />
            <span>{credits.toLocaleString()} GOLD</span>
          </Link>

          {/* New Mission Action */}
          {onOpenCreateMission && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={onOpenCreateMission}
              className="hidden lg:inline-flex"
            >
              NEW MISSION
            </Button>
          )}

          {/* Sign Out Action */}
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-[var(--text-secondary)] hover:text-[#ff3366] bg-white/[0.04] hover:bg-[#ff3366]/15 border border-[var(--border-subtle)] hover:border-[#ff3366]/40 transition-all cursor-pointer shadow-sm"
            title="Sign out of account"
            aria-label="Sign Out"
          >
            <LogOut size={14} className="transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile only XP bar */}
      <div className="mt-2.5 pt-2 border-t border-[rgba(255,255,255,0.05)] sm:hidden">
        <XPBar
          level={level}
          currentXp={currentXp}
          xpToNextLevel={xpToNextLevel}
          size="sm"
          showDetails={true}
        />
      </div>
    </header>
  );
}
