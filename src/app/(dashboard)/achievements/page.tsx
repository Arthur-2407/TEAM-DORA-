'use client';

import React from 'react';
import { useAchievements } from '@/hooks/useAchievements';
import { useTasks } from '@/hooks/useTasks';
import { Award, Trophy, Lock, Check, Zap, Coins } from 'lucide-react';

export default function AchievementsPage() {
  const { tasks } = useTasks();
  const completedCount = tasks.filter((t) => t.is_completed).length;
  const { achievements, unlockedCount, totalCount } = useAchievements(completedCount);

  const percentComplete = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* ── HEADER & PROGRESS ─────────────────────────────────────────────── */}
      <div className="glass-card p-6 sm:p-8 border border-[var(--border-subtle)] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award size={24} className="text-[var(--neon-gold)]" />
              <h1
                className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider uppercase"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                OPERATIONAL MILESTONES
              </h1>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-mono">
              Complete missions, sustain uplink streaks, and level up to unlock permanent commendations.
            </p>
          </div>

          {/* Progress Pill */}
          <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[rgba(255,215,0,0.3)] flex items-center gap-4 min-w-[200px]">
            <div className="w-12 h-12 rounded-xl bg-[rgba(255,215,0,0.15)] flex items-center justify-center text-[var(--neon-gold)] font-bold font-mono text-lg">
              {percentComplete}%
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase text-[var(--text-muted)]">UNLOCKED</p>
              <p className="text-base font-bold font-mono text-white">
                {unlockedCount} / {totalCount} Commendations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── ACHIEVEMENTS GRID ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {achievements.map((ach) => {
          return (
            <div
              key={ach.id}
              className={`glass-card p-5 relative overflow-hidden flex flex-col justify-between border transition-all ${
                ach.unlocked
                  ? 'border-[rgba(255,215,0,0.4)] bg-[rgba(20,20,30,0.85)] shadow-[0_0_20px_rgba(255,215,0,0.15)]'
                  : 'border-[var(--border-subtle)] opacity-70 bg-[rgba(10,10,15,0.7)]'
              }`}
            >
              {/* Gold Stripe on Unlocked */}
              {ach.unlocked && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--neon-gold)] to-[var(--neon-cyan)] shadow-[0_0_10px_#ffd700]" />
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${
                      ach.unlocked
                        ? 'border-[var(--neon-gold)] bg-[rgba(255,215,0,0.15)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-tertiary)] grayscale'
                    }`}
                  >
                    {ach.icon || '🏆'}
                  </div>

                  {ach.unlocked ? (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[rgba(0,255,136,0.15)] text-[var(--neon-green)] text-[10px] font-mono font-bold uppercase">
                      <Check size={12} /> UNLOCKED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[rgba(255,255,255,0.06)] text-[var(--text-muted)] text-[10px] font-mono font-bold uppercase">
                      <Lock size={12} /> LOCKED
                    </span>
                  )}
                </div>

                <h3
                  className={`text-base font-bold uppercase tracking-wider mb-1 ${
                    ach.unlocked ? 'text-white' : 'text-[var(--text-secondary)]'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {ach.name}
                </h3>

                <p className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed mb-4">
                  {ach.description}
                </p>
              </div>

              {/* Progress & Reward Footer */}
              <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] flex flex-col gap-2">
                {/* Progress bar */}
                <div className="w-full">
                  <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)] mb-1">
                    <span>PROGRESS</span>
                    <span>{ach.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${ach.progress}%`,
                        backgroundColor: ach.unlocked ? 'var(--neon-gold)' : 'var(--neon-cyan)',
                      }}
                    />
                  </div>
                </div>

                {/* Bonus tags */}
                <div className="flex items-center gap-3 font-mono text-[11px] pt-1">
                  <span className="text-[var(--neon-cyan)] flex items-center gap-0.5 font-bold">
                    <Zap size={12} /> +{ach.xp_bonus} XP
                  </span>
                  <span className="text-[var(--neon-gold)] flex items-center gap-0.5 font-bold">
                    <Coins size={12} /> +{ach.credit_bonus} ₡
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
