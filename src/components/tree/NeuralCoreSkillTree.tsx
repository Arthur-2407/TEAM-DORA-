'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CATEGORY_CONFIG, PATHWAY_THEMES, type Category, type PathwayThemeId } from '@/lib/constants';
import { sound } from '@/lib/audio';
import { Sparkles, ArrowRight, Shield } from 'lucide-react';

interface NeuralCoreSkillTreeProps {
  level: number;
  totalXp: number;
  stats: Record<string, number>;
  selectedTheme: PathwayThemeId;
  onSelectTheme: (themeId: PathwayThemeId) => void;
}

export function NeuralCoreSkillTree({
  level,
  totalXp,
  stats,
  selectedTheme,
  onSelectTheme,
}: NeuralCoreSkillTreeProps) {
  const categories: Category[] = ['strength', 'intellect', 'discipline', 'vitality', 'charisma', 'creativity'];

  const handleNodeClick = (themeId: PathwayThemeId) => {
    sound.playNodeSelect();
    onSelectTheme(themeId);
  };

  return (
    <div className="relative w-full glass-card p-6 sm:p-8 border border-[var(--border-neon)] overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.07)_0%,transparent_75%)] pointer-events-none" />

      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={18} className="text-[var(--neon-cyan)]" />
            <h2
              className="text-lg font-bold text-white tracking-wider uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              NEURAL CORE SKILL TREE
            </h2>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-mono">
            Interactive constellation connecting all six Neural Pathways to your Core Resonance.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[var(--text-muted)]">ACTIVE SANCTUARY:</span>
          <span className="px-2.5 py-1 rounded-md bg-[rgba(0,240,255,0.15)] border border-[var(--border-neon)] text-[var(--neon-cyan)] font-bold uppercase">
            {PATHWAY_THEMES[selectedTheme]?.name || 'Neural Core'}
          </span>
        </div>
      </div>

      {/* Desktop / Tablet Radial Constellation Node Map */}
      <div className="hidden lg:block relative w-full h-[400px] my-2">
        {/* Central Core: NEURAL CORE */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNodeClick('nexus')}
            className={`w-28 h-28 rounded-full flex flex-col items-center justify-center p-3 border-2 transition-all cursor-pointer shadow-2xl relative ${
              selectedTheme === 'nexus'
                ? 'border-[var(--neon-cyan)] bg-[#0b1b2b] shadow-[0_0_40px_rgba(0,240,255,0.6)]'
                : 'border-[var(--neon-cyan)]/50 bg-[#091322] hover:border-[var(--neon-cyan)] shadow-[0_0_20px_rgba(0,240,255,0.25)]'
            }`}
          >
            {/* Pulsing Core Ring */}
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute inset-0 rounded-full border border-[var(--neon-cyan)] pointer-events-none"
            />
            <span className="text-2xl mb-0.5">⚡</span>
            <span
              className="text-[11px] font-black tracking-wider text-white uppercase text-center leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              NEURAL CORE
            </span>
            <span className="text-[9px] font-mono text-[var(--neon-cyan)] font-bold">
              LVL {level}
            </span>
          </motion.button>
        </div>

        {/* Constellation SVG Lines connecting Core to 6 Attribute Nodes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="coreLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ff00aa" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {/* Connecting lines rendered mathematically based on circular angles */}
          {categories.map((_, i) => {
            const angle = (i * 60 - 90) * (Math.PI / 180);
            const radius = 145;
            // Center is roughly 50% width, 200px height
            const x2 = `calc(50% + ${Math.cos(angle) * radius}px)`;
            const y2 = `calc(50% + ${Math.sin(angle) * radius}px)`;
            return (
              <line
                key={i}
                x1="50%"
                y1="50%"
                x2={x2}
                y2={y2}
                stroke="var(--neon-cyan)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-40"
              />
            );
          })}
        </svg>

        {/* 6 Peripheral Pathway Nodes */}
        {categories.map((catKey, i) => {
          const config = CATEGORY_CONFIG[catKey];
          const themeConfig = PATHWAY_THEMES[catKey as PathwayThemeId];
          const statVal = stats[catKey] || 1;
          const isSelected = selectedTheme === catKey;

          const angle = (i * 60 - 90) * (Math.PI / 180);
          const radius = 145;
          const left = `calc(50% + ${Math.cos(angle) * radius}px)`;
          const top = `calc(50% + ${Math.sin(angle) * radius}px)`;

          return (
            <div
              key={catKey}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ left, top }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNodeClick(catKey as PathwayThemeId)}
                className={`p-3 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer min-w-[155px] ${
                  isSelected
                    ? 'border-white bg-[#1a1728] shadow-[0_0_30px_rgba(255,255,255,0.25)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-tertiary)] hover:border-white/40'
                }`}
                style={{
                  boxShadow: isSelected ? `0 0 25px ${config.color}60` : undefined,
                  borderColor: isSelected ? config.color : undefined,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: `${config.color}20`, border: `1px solid ${config.color}50` }}
                >
                  {config.icon}
                </div>
                <div className="text-left font-mono">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black text-white uppercase">{config.label}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                  </div>
                  <span className="text-sm font-black" style={{ color: config.color }}>
                    {statVal} PTS
                  </span>
                </div>
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* Mobile / Tablet Vertical Interactive Skill Tree Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-3">
        {/* Neural Core Option */}
        <button
          onClick={() => handleNodeClick('nexus')}
          className={`p-4 rounded-xl border flex items-center justify-between transition-all sm:col-span-2 ${
            selectedTheme === 'nexus'
              ? 'border-[var(--neon-cyan)] bg-[rgba(0,240,255,0.15)] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
              : 'border-[var(--border-subtle)] bg-[var(--bg-tertiary)]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div className="text-left">
              <span className="text-xs font-bold text-white uppercase block">NEURAL CORE RESONANCE</span>
              <span className="text-[10px] font-mono text-[var(--neon-cyan)]">LEVEL {level} • BALANCED SPECTRUM</span>
            </div>
          </div>
          <ArrowRight size={16} className="text-[var(--neon-cyan)]" />
        </button>

        {/* 6 Pathway Cards */}
        {categories.map((catKey) => {
          const config = CATEGORY_CONFIG[catKey];
          const statVal = stats[catKey] || 1;
          const isSelected = selectedTheme === catKey;

          return (
            <button
              key={catKey}
              onClick={() => handleNodeClick(catKey as PathwayThemeId)}
              className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                isSelected
                  ? 'border-white bg-[#1a1728] shadow-lg'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-tertiary)] hover:border-white/30'
              }`}
              style={{
                borderColor: isSelected ? config.color : undefined,
                boxShadow: isSelected ? `0 0 15px ${config.color}40` : undefined,
              }}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{config.icon}</span>
                <div>
                  <span className="text-xs font-bold text-white uppercase block">{config.label}</span>
                  <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                    Tier: {Math.floor(statVal / 5) + 1}
                  </span>
                </div>
              </div>
              <span className="text-sm font-mono font-black" style={{ color: config.color }}>
                {statVal} PTS
              </span>
            </button>
          );
        })}
      </div>

      {/* Tip footer */}
      <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
        <span className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-[var(--neon-gold)]" />
          <span>Click any pathway node to transition into its immersive Sanctuary</span>
        </span>
        <span className="hidden sm:inline text-[var(--neon-cyan)]">
          Total Core Power: {totalXp.toLocaleString()} XP
        </span>
      </div>
    </div>
  );
}
