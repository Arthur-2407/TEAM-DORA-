'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, CheckSquare, Flame } from 'lucide-react';

interface CommanderSanctuaryProps {
  lastEventTrigger?: number;
  disciplineStat?: number;
  streakCount?: number;
}

export function CommanderSanctuary({
  lastEventTrigger = 0,
  disciplineStat = 18,
  streakCount = 7,
}: CommanderSanctuaryProps) {
  const [isStamped, setIsStamped] = useState(false);

  useEffect(() => {
    if (!lastEventTrigger) return;
    setIsStamped(true);
    const timer = setTimeout(() => setIsStamped(false), 2000);
    return () => clearTimeout(timer);
  }, [lastEventTrigger]);


  return (
    <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-[#fbbf24]/40 bg-[#121118] flex flex-col justify-between p-6 shadow-[inset_0_0_80px_rgba(251,191,36,0.12)]">
      {/* Dark Navy, Slate Charcoal & Burnished Gold */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#181724] via-[#100f1c] to-[#0a0a10] pointer-events-none" />

      {/* Subtle Geometric Tactical Grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fbbf24] via-[#d97706] to-[#b45309] flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(251,191,36,0.5)] border border-amber-200/30">
            🎯
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-300 uppercase px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/40">
                THE COMMANDER&apos;S SANCTUARY
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400">
                <Clock size={12} /> ROUTINES SYNCED
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>
              ZENITH HEADQUARTERS
            </h3>
          </div>
        </div>

        {/* Discipline Stat & Streak */}
        <div className="text-right font-mono">
          <span className="text-[10px] text-amber-300 uppercase tracking-wider block">Discipline Level</span>
          <span className="text-xl sm:text-2xl font-black text-amber-400 flex items-center justify-end gap-1">
            <CheckSquare size={18} /> {disciplineStat}
          </span>
        </div>
      </div>

      {/* Centerpiece: Tactical Quest Board + Mechanical Chronometer Clock + Streak Brazier */}
      <div className="relative z-10 flex items-center justify-around my-auto">
        {/* Mechanical Ticking Chronometer */}
        <div className="hidden sm:flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-[#1c192c] border-2 border-amber-400/70 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.3)] relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
              className="w-0.5 h-7 bg-amber-300 origin-bottom -translate-y-3.5 rounded"
            />
            <div className="w-2 h-2 rounded-full bg-amber-400 absolute" />
            <span className="text-[8px] font-mono text-amber-300 mt-5 font-bold">24H CYCLE</span>
          </div>
          <span className="text-[9px] font-mono text-amber-300 font-bold">CHRONOMETER</span>
        </div>

        {/* Tactical Quest Board with Wax Stamp */}
        <motion.div
          animate={
            isStamped
              ? { scale: [1, 1.06, 0.98, 1] }
              : { y: [0, -2, 0] }
          }
          transition={{ repeat: Infinity, duration: 4 }}
          className="relative flex flex-col items-center cursor-pointer group"
        >
          {/* Parchment Bulletin Board */}
          <div className="w-56 sm:w-64 h-28 rounded-xl bg-[#232038] border-2 border-amber-400/80 p-3 shadow-[0_0_30px_rgba(251,191,36,0.3)] flex flex-col justify-between relative overflow-hidden">
            {/* Header pin */}
            <div className="w-3 h-3 rounded-full bg-amber-400 mx-auto -mt-1 shadow-[0_0_8px_#fbbf24]" />

            <div className="flex items-center justify-between text-[10px] font-mono text-amber-300 font-bold border-b border-amber-500/30 pb-1">
              <span>ACTIVE DIRECTIVES</span>
              <span>100% FOCUS</span>
            </div>

            {/* Checklist items */}
            <div className="flex flex-col gap-1 text-[9px] font-mono text-amber-100/80">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 flex items-center justify-center text-[7px] text-black font-bold">✓</span>
                <span>Deep Work Block (09:00 - 12:00)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 flex items-center justify-center text-[7px] text-black font-bold">✓</span>
                <span>Zero Distraction Protocol</span>
              </div>
            </div>

            {/* Wax Seal Stamp that slams down when complete */}
            <motion.div
              animate={
                isStamped
                  ? { scale: [0, 1.4, 1], rotate: [0, -15, 0] }
                  : { scale: 1 }
              }
              className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-[#991b1b] border border-amber-400 text-white font-mono text-[9px] font-black uppercase tracking-wider shadow-md flex items-center gap-1"
            >
              <span>★ CLEARED</span>
            </motion.div>
          </div>

          <span className="text-[10px] font-mono text-amber-300 mt-2 font-bold group-hover:text-white transition-colors">
            {isStamped ? '🎖️ WAX SEAL APPLIED!' : 'TACTICAL QUEST BOARD'}
          </span>
        </motion.div>

        {/* Streak Flame Brazier */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-24 rounded-xl bg-[#1a172a] border border-amber-400/50 flex flex-col items-center justify-between p-2 shadow-lg relative">
            <motion.div
              animate={{ scale: [1, 1.15, 0.95, 1], filter: ['drop-shadow(0 0 10px #f59e0b)', 'drop-shadow(0 0 20px #ea580c)'] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-[#ff8800] mt-1"
            >
              <Flame size={30} className="flame-icon" />
            </motion.div>
            <div className="text-center">
              <span className="text-[11px] font-mono font-black text-amber-300 block">{streakCount} DAYS</span>
              <span className="text-[7px] font-mono text-amber-400/80 uppercase">CHAIN ACTIVE</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-amber-300 mt-2 font-bold">STREAK BRAZIER</span>
        </div>
      </div>

      {/* Bottom Footer Feedback */}
      <div className="relative z-10 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs font-mono text-amber-300">
        <span className="flex items-center gap-1.5">
          <CheckSquare size={14} className="text-amber-400" />
          <span>Routine quests yield <b className="text-white">DISCIPLINE +5 🎯</b></span>
        </span>
        <span className="text-[11px] text-amber-400/80 hidden sm:inline">
          Consistency Builds Legendary Character
        </span>
      </div>
    </div>
  );
}
