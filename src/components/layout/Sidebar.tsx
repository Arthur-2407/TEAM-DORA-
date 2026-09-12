'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Crosshair,
  User,
  ShoppingBag,
  Briefcase,
  Award,
  LogOut,
  Flame,
  Coins,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getLevelTitle } from '@/lib/xp';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
  { href: '/missions', label: 'Active Missions', icon: Crosshair },
  { href: '/profile', label: 'Neural Profile', icon: User },
  { href: '/shop', label: 'Black Market', icon: ShoppingBag },
  { href: '/inventory', label: 'Inventory', icon: Briefcase },
  { href: '/achievements', label: 'Milestones', icon: Award },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { profile, signOut, isDemo } = useAuth();

  const level = profile?.level ?? 1;
  const credits = profile?.credits ?? 0;
  const streak = profile?.current_streak ?? 0;
  const username = profile?.username ?? 'Agent';
  const rank = getLevelTitle(level);

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`mobile-overlay ${isOpen ? 'active' : ''} md:hidden`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`sidebar ${isOpen ? 'open' : ''} flex flex-col justify-between`}
        aria-label="Sidebar Navigation"
      >
        {/* Top Branding */}
        <div>
          <div className="flex items-center justify-between pb-6 mb-4 border-b border-[var(--border-subtle)]">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 text-decoration-none group"
              onClick={onClose}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--neon-cyan)] to-[var(--neon-magenta)] flex items-center justify-center shadow-[0_0_18px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-transform">
                <span className="text-xl">⚔️</span>
              </div>
              <div>
                <span
                  className="font-black text-base tracking-wider text-white flex items-center gap-1.5"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  LIFE <span className="text-[var(--neon-cyan)]">RPG</span>
                </span>
                <span className="text-[9px] text-[var(--text-muted)] font-mono tracking-widest block uppercase">
                  Nexus Realm v2.5
                </span>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="md:hidden p-1 text-[var(--text-secondary)] hover:text-white"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Hero Badge */}
          <div className="p-3 mb-5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white tracking-wide truncate max-w-[130px]">
                {username}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(0,240,255,0.15)] text-[var(--neon-cyan)] font-mono font-bold">
                LVL {level}
              </span>
            </div>
            <div className="text-[10px] text-[var(--text-secondary)] font-mono mb-2">
              RANK: {rank}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.06)] text-[11px] font-mono">
              <div className="flex items-center gap-1 text-amber-300 font-bold">
                <Coins size={13} />
                <span>{credits.toLocaleString()} GOLD</span>
              </div>
              <div className="flex items-center gap-1 text-[#ff8800] font-bold">
                <Flame size={13} className="flame-icon" />
                <span>{streak}d</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname === `${item.href}/`;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <Icon
                    size={18}
                    className={isActive ? 'text-[var(--neon-cyan)]' : 'text-[var(--text-secondary)]'}
                  />
                  <span className="font-medium tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status & Logout */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col gap-3">
          {isDemo && (
            <div className="p-2.5 rounded-lg bg-[rgba(0,240,255,0.08)] border border-[rgba(0,240,255,0.2)] text-[10px] font-mono text-[var(--neon-cyan)] flex items-center justify-between">
              <span>DEMO AGENT MODE</span>
              <span className="w-2 h-2 rounded-full bg-[var(--neon-green)] animate-ping" />
            </div>
          )}

          <button
            onClick={() => signOut()}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono text-[var(--text-secondary)] hover:text-[#ff3366] hover:bg-[rgba(255,51,102,0.1)] transition-all cursor-pointer w-full text-left"
            title="Sign out of account"
            aria-label="Sign Out"
          >
            <LogOut size={16} />
            <span>SIGN OUT</span>
          </button>
        </div>
      </aside>
    </>
  );
}
