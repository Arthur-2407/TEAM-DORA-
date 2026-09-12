'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useShop } from '@/hooks/useShop';
import { useTasks } from '@/hooks/useTasks';
import { CATEGORY_CONFIG, type Category } from '@/lib/constants';
import { getLevelTitle, xpForLevel } from '@/lib/xp';
import { StatBar } from '@/components/ui/StatBar';
import { XPBar } from '@/components/ui/XPBar';
import { Badge } from '@/components/ui/Badge';
import {
  User,
  Flame,
  Coins,
  Shield,
  Trophy,
  CheckCircle2,
  Briefcase,
  Zap,
} from 'lucide-react';

export default function ProfilePage() {
  const { profile } = useAuth();
  const { inventory } = useShop();
  const { tasks } = useTasks();

  const level = profile?.level ?? 1;
  const currentXp = profile?.current_xp ?? 0;
  const xpToNextLevel = profile?.xp_to_next_level ?? 100;
  const totalXp = profile?.total_xp ?? 0;
  const credits = profile?.credits ?? 0;
  const streak = profile?.current_streak ?? 0;
  const longestStreak = profile?.longest_streak ?? 0;
  const rank = getLevelTitle(level);

  const completedCount = tasks.filter((t) => t.is_completed).length;
  const equippedItems = inventory.filter((i) => i.equipped);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* ── HEADER & IDENTITY CARD ────────────────────────────────────────── */}
      <div className="glass-card p-6 sm:p-8 border border-[var(--border-neon)] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar / Holographic Frame */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[var(--neon-cyan)] via-[#0099ff] to-[var(--neon-magenta)] p-1 shadow-[0_0_35px_rgba(0,240,255,0.4)]">
              <div className="w-full h-full rounded-3xl bg-[var(--bg-secondary)] flex flex-col items-center justify-center relative overflow-hidden">
                <User size={44} className="text-[var(--neon-cyan)]" />
                <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1 font-bold">
                  LVL {level}
                </span>
              </div>
            </div>
            {/* Online Indicator */}
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--bg-primary)] p-0.5"
              title="Neural Link Synchronized"
            >
              <div className="w-full h-full rounded-full bg-[var(--neon-green)] shadow-[0_0_10px_#00ff88]" />
            </div>
          </div>

          {/* Profile Meta */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[rgba(0,240,255,0.15)] text-[var(--neon-cyan)] text-xs font-mono font-bold uppercase tracking-wider">
                ID: {profile?.id ? profile.id.substring(0, 8) : '007'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[rgba(255,215,0,0.15)] text-[var(--neon-gold)] text-xs font-mono font-bold uppercase tracking-wider">
                RANK: {rank}
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl font-black text-white tracking-wider uppercase mb-1"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {profile?.username || 'AGENT CYAN'}
            </h1>
            <p className="text-xs text-[var(--text-secondary)] font-mono mb-4">
              Registered Operative • Class: Cybernetic Architect • Status: Fully Operational
            </p>

            <XPBar
              level={level}
              currentXp={currentXp}
              xpToNextLevel={xpToNextLevel}
              size="md"
              showDetails={true}
            />
          </div>
        </div>
      </div>

      {/* ── STATS SUMMARY METRICS ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 border border-[rgba(0,240,255,0.2)]">
          <div className="flex items-center gap-2 text-[var(--neon-cyan)] mb-1">
            <Zap size={18} />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              TOTAL XP HARVESTED
            </span>
          </div>
          <p className="text-xl font-bold font-mono text-white">{totalXp.toLocaleString()} XP</p>
        </div>

        <div className="glass-card p-4 border border-[rgba(0,255,136,0.2)]">
          <div className="flex items-center gap-2 text-[var(--neon-green)] mb-1">
            <CheckCircle2 size={18} />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              DIRECTIVES CLEARED
            </span>
          </div>
          <p className="text-xl font-bold font-mono text-white">{completedCount} MISSIONS</p>
        </div>

        <div className="glass-card p-4 border border-[rgba(255,136,0,0.2)]">
          <div className="flex items-center gap-2 text-[#ff8800] mb-1">
            <Flame size={18} className="flame-icon" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              LONGEST STREAK
            </span>
          </div>
          <p className="text-xl font-bold font-mono text-white">{longestStreak} DAYS</p>
        </div>

        <div className="glass-card p-4 border border-[rgba(179,102,255,0.2)]">
          <div className="flex items-center gap-2 text-[var(--neon-purple)] mb-1">
            <Briefcase size={18} />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              IMPLANTS INVENTORY
            </span>
          </div>
          <p className="text-xl font-bold font-mono text-white">{inventory.length} ITEMS</p>
        </div>
      </div>

      {/* ── ATTRIBUTE MATRIX BREAKDOWN ────────────────────────────────────── */}
      <div className="glass-card p-6 border border-[var(--border-subtle)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-[var(--neon-cyan)]" />
            <h2
              className="text-lg font-bold text-white tracking-wider uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              NEURAL PATHWAYS (ATTRIBUTES)
            </h2>
          </div>
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            Level caps increase every 5 levels
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(CATEGORY_CONFIG) as Category[]).map((catKey) => {
            const statValue = (profile && profile[catKey]) ? profile[catKey] : 1;
            return <StatBar key={catKey} category={catKey} value={statValue} maxValue={30} />;
          })}
        </div>
      </div>

      {/* ── EQUIPPED IMPLANTS & AUGMENTS ──────────────────────────────────── */}
      <div className="glass-card p-6 border border-[var(--border-subtle)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-[var(--neon-gold)]" />
            <h2
              className="text-lg font-bold text-white tracking-wider uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              SYNCHRONIZED IMPLANTS ({equippedItems.length})
            </h2>
          </div>
          <a
            href="/inventory"
            className="text-xs font-mono text-[var(--neon-cyan)] hover:underline"
          >
            Manage Hardware →
          </a>
        </div>

        {equippedItems.length === 0 ? (
          <p className="text-xs font-mono text-[var(--text-secondary)]">
            No implants currently active in neural slots. Equip badges in your Inventory.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {equippedItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center gap-3"
              >
                <span className="text-2xl">{item.shop_items?.icon || '🛡️'}</span>
                <div>
                  <p className="text-xs font-bold text-white uppercase">
                    {item.shop_items?.name || 'Implant'}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)] font-mono">
                    {item.shop_items?.rarity?.toUpperCase() || 'COMMON'} • SYNCHRONIZED
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
