'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import { CATEGORY_CONFIG, type Category, getStreakMultiplier, PATHWAY_THEMES, type PathwayThemeId } from '@/lib/constants';
import { getLevelTitle } from '@/lib/xp';
import { XPBar } from '@/components/ui/XPBar';
import { Button } from '@/components/ui/Button';
import { MissionCard } from '@/components/missions/MissionCard';
import { CreateMissionModal } from '@/components/missions/CreateMissionModal';
import { LevelUpOverlay } from '@/components/effects/LevelUpOverlay';
import { EnvironmentBackdrop } from '@/components/environments/EnvironmentBackdrop';
import { NeuralCoreSkillTree } from '@/components/tree/NeuralCoreSkillTree';
import { usePathwayTheme } from '@/context/ThemeContext';
import { sound } from '@/lib/audio';
import {
  Flame,
  Coins,
  Shield,
  Plus,
  Sparkles,
  Swords,
  ChevronRight,
  Volume2,
  VolumeX,
  LogOut,
} from 'lucide-react';

export default function LifeRPGWorldPage() {
  const { profile, signOut } = useAuth();
  const { tasks, completeTask, deleteTask, createTask, levelUpData, closeLevelUp } = useTasks();
  const { currentTheme, themeConfig, setTheme } = usePathwayTheme();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [lastEventTrigger, setLastEventTrigger] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(sound.isMuted());

  const level = profile?.level ?? 1;
  const currentXp = profile?.current_xp ?? 0;
  const xpToNextLevel = profile?.xp_to_next_level ?? 100;
  const credits = profile?.credits ?? 0;
  const streak = profile?.current_streak ?? 0;
  const rank = getLevelTitle(level);
  const streakMultiplier = getStreakMultiplier(streak);

  const pendingTasks = tasks.filter((t) => !t.is_completed);
  const completedTasks = tasks.filter((t) => t.is_completed);

  // Filter tasks if an attribute environment is chosen
  const environmentFilteredTasks = pendingTasks.filter((t) => {
    if (currentTheme === 'nexus') return true;
    return t.category === currentTheme;
  });

  const handleQuestComplete = async (id: string) => {
    setLastEventTrigger(Date.now());
    await completeTask(id);
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Level Up Celebration Overlay */}
      <LevelUpOverlay
        isOpen={levelUpData.isOpen}
        newLevel={levelUpData.newLevel}
        onClose={closeLevelUp}
      />

      {/* Create Quest Modal */}
      <CreateMissionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={createTask}
      />

      {/* ── 1. TOP RPG STATUS HUD ─────────────────────────────────────────── */}
      <div className="glass-card p-5 sm:p-7 border border-[var(--border-neon)] relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Hero Identity & Level */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[var(--neon-cyan)] via-indigo-600 to-[var(--neon-magenta)] p-1 shadow-[0_0_30px_rgba(0,240,255,0.4)] shrink-0 flex items-center justify-center">
              <div className="w-full h-full rounded-xl bg-[#0d0d15] flex flex-col items-center justify-center">
                <span className="text-xl sm:text-2xl">👑</span>
                <span className="text-[10px] font-mono text-[var(--neon-cyan)] font-black">
                  LVL {level}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-[rgba(0,240,255,0.15)] text-[var(--neon-cyan)] text-[10px] font-mono font-bold uppercase tracking-wider">
                  REAL LIFE RPG
                </span>
                <span className="px-2 py-0.5 rounded bg-[rgba(255,215,0,0.15)] text-[var(--neon-gold)] text-[10px] font-mono font-bold uppercase tracking-wider">
                  RANK: {rank}
                </span>
                <button
                  onClick={toggleSound}
                  className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute 8-bit Audio' : 'Mute Sound Effects'}
                >
                  {isMuted ? <VolumeX size={12} className="text-rose-400" /> : <Volume2 size={12} className="text-emerald-400" />}
                  <span>{isMuted ? 'MUTED' : 'AUDIO ON'}</span>
                </button>
                <button
                  onClick={() => signOut()}
                  className="px-2 py-0.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer border border-rose-500/30"
                  title="Sign out of account"
                >
                  <LogOut size={12} />
                  <span>SIGN OUT</span>
                </button>
              </div>

              <h1
                className="text-2xl sm:text-3xl font-black text-white tracking-wide uppercase"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {profile?.username || 'WARRIOR OF LIGHT'}
              </h1>
              <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                Every real-world habit transmutes directly into character stats & gold.
              </p>
            </div>
          </div>

          {/* HUD Counters: Streak Multiplier, Gold Balance & New Quest */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            {/* Streak Counter */}
            <div className="p-3 sm:p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[#ff8800]/40 flex items-center gap-3 min-w-[125px]">
              <div className="w-10 h-10 rounded-lg bg-[#ff8800]/20 flex items-center justify-center text-[#ff8800]">
                <Flame size={22} className="flame-icon" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase text-[var(--text-muted)]">STREAK</p>
                <p className="text-lg font-black font-mono text-white">{streak} DAYS</p>
                <span className="text-[9px] font-mono text-[#ff8800]">{streakMultiplier}x XP Yield</span>
              </div>
            </div>

            {/* Gold Counter */}
            <Link
              href="/shop"
              className="p-3 sm:p-4 rounded-xl bg-[var(--bg-tertiary)] border border-amber-400/40 flex items-center gap-3 min-w-[125px] hover:border-amber-400 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                <Coins size={22} />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase text-[var(--text-muted)]">GOLD</p>
                <p className="text-lg font-black font-mono text-amber-300">{credits.toLocaleString()} 💰</p>
                <span className="text-[9px] font-mono text-amber-400/80">Item Shop Ready</span>
              </div>
            </Link>

            {/* Deploy New Quest */}
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus size={16} />}
              onClick={() => setIsCreateOpen(true)}
              className="h-[60px] px-5"
            >
              DEPLOY QUEST
            </Button>
          </div>
        </div>

        {/* Level XP Bar */}
        <div className="mt-6 pt-5 border-t border-[rgba(255,255,255,0.06)]">
          <XPBar
            level={level}
            currentXp={currentXp}
            xpToNextLevel={xpToNextLevel}
            size="lg"
            showDetails={true}
          />
        </div>
      </div>

      {/* ── 2. INTERACTIVE NEURAL CORE SKILL TREE ───────────────────────────── */}
      <NeuralCoreSkillTree
        level={level}
        totalXp={profile?.total_xp ?? 0}
        stats={{
          strength: profile?.strength || 12,
          intellect: profile?.intellect || 15,
          discipline: profile?.discipline || 18,
          vitality: profile?.vitality || 14,
          charisma: profile?.charisma || 11,
          creativity: profile?.creativity || 13,
        }}
        selectedTheme={currentTheme}
        onSelectTheme={setTheme}
      />

      {/* ── 3. DYNAMIC IMMERSIVE ENVIRONMENT SHOWCASE ──────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{themeConfig.icon}</span>
            <div>
              <h2
                className="text-lg font-bold text-white tracking-wider uppercase"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {themeConfig.environmentTitle}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] font-mono">
                {themeConfig.environmentSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Live Visual Environment Stage */}
        <EnvironmentBackdrop
          currentTheme={currentTheme}
          lastEventTrigger={lastEventTrigger}
          stats={{
            strength: profile?.strength || 12,
            intellect: profile?.intellect || 15,
            discipline: profile?.discipline || 18,
            vitality: profile?.vitality || 14,
            charisma: profile?.charisma || 11,
            creativity: profile?.creativity || 13,
          }}
          streak={streak}
        />
      </div>

      {/* ── 4. QUEST LOG & ACTIVE OBJECTIVES ───────────────────────────────── */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Swords size={20} className="text-[var(--neon-cyan)]" />
            <h2
              className="text-lg font-bold text-white tracking-wider uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ACTIVE QUEST DIRECTIVES ({environmentFilteredTasks.length})
            </h2>
            {currentTheme !== 'nexus' && (
              <button
                onClick={() => setTheme('nexus')}
                className="text-[11px] font-mono text-[var(--neon-cyan)] hover:underline ml-2"
              >
                Show All Pathways →
              </button>
            )}
          </div>

          <Link
            href="/missions"
            className="text-xs font-mono text-[var(--neon-cyan)] hover:underline flex items-center gap-1"
          >
            Quest Terminal ({tasks.length} Total) <ChevronRight size={14} />
          </Link>
        </div>

        {environmentFilteredTasks.length === 0 ? (
          <div className="glass-card p-8 text-center border border-dashed border-[var(--border-subtle)] flex flex-col items-center gap-3">
            <span className="text-4xl">🏆</span>
            <h3
              className="text-base font-bold text-white uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ALL {currentTheme.toUpperCase()} QUESTS COMPLETED
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-mono max-w-md leading-relaxed">
              You have fulfilled all objectives in this environment. Deploy another quest to continue fortifying your attributes!
            </p>
            <Button
              variant="neon"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => setIsCreateOpen(true)}
              className="mt-2"
            >
              DEPLOY NEW QUEST
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {environmentFilteredTasks.slice(0, 6).map((task) => (
              <MissionCard
                key={task.id}
                mission={task}
                onComplete={handleQuestComplete}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── 5. RPG ITEM SHOP & INVENTORY TEASERS ───────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Item Shop Card */}
        <Link href="/shop" className="group text-decoration-none">
          <div className="glass-card p-6 border border-amber-400/30 hover:border-amber-400 transition-all shadow-lg flex flex-col justify-between h-full">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                  <Coins size={24} />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-300 text-[11px] font-mono font-bold">
                  BALANCE: {credits} GOLD
                </span>
              </div>
              <h3
                className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors uppercase mb-1"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                RPG ITEM SHOP
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed">
                Spend gold earned from real-life quests on Wizard Hats, Warrior Helms, Potions, and Sanctum Themes.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-amber-300">
              <span>Browse Equipment</span>
              <ChevronRight size={16} />
            </div>
          </div>
        </Link>

        {/* Character Attributes & Milestone Summary */}
        <Link href="/profile" className="group text-decoration-none">
          <div className="glass-card p-6 border border-[var(--border-neon)] hover:border-white transition-all shadow-lg flex flex-col justify-between h-full">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--neon-cyan)]/20 flex items-center justify-center text-[var(--neon-cyan)] group-hover:scale-110 transition-transform">
                  <Shield size={24} />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-400/15 text-emerald-300 text-[11px] font-mono font-bold">
                  {completedTasks.length} QUESTS WON
                </span>
              </div>
              <h3
                className="text-lg font-bold text-white group-hover:text-[var(--neon-cyan)] transition-colors uppercase mb-1"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                CHARACTER DOSSIER
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed">
                Review your holistic real-life progression matrix, equipped gear, and long-term achievement badges.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[var(--neon-cyan)]">
              <span>View Character Sheet</span>
              <ChevronRight size={16} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
