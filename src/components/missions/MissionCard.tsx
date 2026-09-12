'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Edit3, Calendar, Sparkles, Zap, Coins, ArrowUp } from 'lucide-react';
import { CATEGORY_CONFIG, DIFFICULTY_CONFIG, PATHWAY_THEMES, type PathwayThemeId } from '@/lib/constants';
import type { Task } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { ParticleBurst } from '@/components/effects/ParticleBurst';
import { FloatingNumbers, type FloatingItem } from '@/components/effects/FloatingNumber';
import { sound } from '@/lib/audio';

interface MissionCardProps {
  mission: Task;
  onComplete: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit?: (mission: Task) => void;
}

export function MissionCard({ mission, onComplete, onDelete, onEdit }: MissionCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);

  const categoryConfig = CATEGORY_CONFIG[mission.category] || CATEGORY_CONFIG.discipline;
  const themeConfig = PATHWAY_THEMES[mission.category as PathwayThemeId] || PATHWAY_THEMES.nexus;

  const handleCompleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mission.is_completed || isCompleting) return;

    setIsCompleting(true);
    setShowParticles(true);

    // 🎵 Play Retro RPG Sound Chimes & Coins
    sound.playQuestComplete();
    setTimeout(() => sound.playCoinClink(), 160);
    setTimeout(() => sound.playAttributePower(), 300);

    // 💥 Trigger floating combat numbers (+XP, +GOLD, +STAT)
    setFloatingItems([
      { id: 'xp', text: `+${mission.xp_reward} XP`, color: '#00f0ff', icon: '⚡' },
      { id: 'gold', text: `+${mission.credit_reward} GOLD`, color: '#ffd700', icon: '💰' },
      { id: 'stat', text: `+5 ${categoryConfig.label.toUpperCase()}`, color: categoryConfig.color, icon: categoryConfig.icon },
    ]);

    try {
      await onComplete(mission.id);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(mission.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`glass-card p-5 relative overflow-hidden group flex flex-col justify-between transition-all border ${
        mission.is_completed
          ? 'opacity-60 border-[var(--border-subtle)] bg-[rgba(10,10,15,0.6)]'
          : 'border-[var(--border-subtle)] hover:border-[var(--border-neon)] shadow-md'
      }`}
    >
      {/* Particle effect on completion */}
      <ParticleBurst
        trigger={showParticles}
        color={categoryConfig.color}
        onComplete={() => setShowParticles(false)}
      />

      {/* Floating RPG Numbers (+XP, +GOLD, +STAT) */}
      <FloatingNumbers
        items={floatingItems}
        onComplete={(id) => setFloatingItems((prev) => prev.filter((item) => item.id !== id))}
      />

      {/* Category color top border accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-opacity"
        style={{
          backgroundColor: categoryConfig.color,
          boxShadow: `0 0 10px ${categoryConfig.color}`,
          opacity: mission.is_completed ? 0.3 : 0.8,
        }}
      />

      {/* Top Meta: Category & Difficulty */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-base" role="img" aria-label={categoryConfig.label}>
              {categoryConfig.icon}
            </span>
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider"
              style={{ color: categoryConfig.color }}
            >
              {categoryConfig.label}
            </span>
          </div>

          <Badge variant="difficulty" difficulty={mission.difficulty} />
        </div>

        {/* Quest Title */}
        <h3
          className={`text-base font-bold tracking-wide mb-1.5 transition-all ${
            mission.is_completed
              ? 'line-through text-[var(--text-muted)]'
              : 'text-white group-hover:text-[var(--neon-cyan)]'
          }`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {mission.title}
        </h3>

        {/* Description */}
        {mission.description && (
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3 font-mono leading-relaxed">
            {mission.description}
          </p>
        )}

        {/* Target Due date if available */}
        {mission.due_date && (
          <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] font-mono mb-3">
            <Calendar size={12} />
            <span>Target: {new Date(mission.due_date).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Bottom Row: Rewards and Actions */}
      <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between gap-2">
        {/* Rewards pill (+XP, +GOLD, +STAT) */}
        <div className="flex items-center gap-2.5 font-mono text-[11px] flex-wrap">
          <div className="flex items-center gap-1 text-[var(--neon-cyan)] font-bold">
            <Zap size={13} />
            <span>+{mission.xp_reward} XP</span>
          </div>
          <div className="flex items-center gap-1 text-[var(--neon-gold)] font-bold">
            <Coins size={13} />
            <span>+{mission.credit_reward} GOLD</span>
          </div>
          <div
            className="flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded text-[10px]"
            style={{ color: categoryConfig.color, backgroundColor: `${categoryConfig.color}15` }}
          >
            <ArrowUp size={11} />
            <span>+5 {categoryConfig.label.slice(0, 3).toUpperCase()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {onEdit && !mission.is_completed && (
            <button
              onClick={() => onEdit(mission)}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-tertiary)] transition-colors"
              title="Edit Quest"
              aria-label="Edit Quest"
            >
              <Edit3 size={15} />
            </button>
          )}

          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[#ff3366] hover:bg-[rgba(255,51,102,0.1)] transition-colors"
            title="Abort Quest"
            aria-label="Delete Quest"
          >
            <Trash2 size={15} />
          </button>

          {/* Complete Button */}
          <button
            onClick={handleCompleteClick}
            disabled={mission.is_completed || isCompleting}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
              mission.is_completed
                ? 'bg-[rgba(0,255,136,0.1)] text-[var(--neon-green)] border border-[rgba(0,255,136,0.2)] cursor-default'
                : 'bg-[var(--bg-tertiary)] border border-[var(--neon-cyan)] text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)] hover:text-black hover:shadow-[0_0_18px_rgba(0,240,255,0.5)] active:scale-95'
            }`}
            aria-label={mission.is_completed ? 'Quest Cleared' : 'Complete Quest'}
          >
            {mission.is_completed ? (
              <>
                <Check size={14} />
                <span>CLEARED</span>
              </>
            ) : isCompleting ? (
              <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles size={14} />
                <span>COMPLETE</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

