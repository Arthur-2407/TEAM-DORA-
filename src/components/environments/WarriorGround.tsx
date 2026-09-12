'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Flame, Dumbbell, Zap } from 'lucide-react';

interface WarriorGroundProps {
  lastEventTrigger?: number; // timestamp to trigger strike animation
  powerStat?: number;
}

export function WarriorGround({ lastEventTrigger = 0, powerStat = 12 }: WarriorGroundProps) {
  const [isStruck, setIsStruck] = useState(false);

  useEffect(() => {
    if (!lastEventTrigger) return;
    setIsStruck(true);
    const timer = setTimeout(() => setIsStruck(false), 2000);
    return () => clearTimeout(timer);
  }, [lastEventTrigger]);


  return (
    <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-[#ff5533]/40 bg-[#160d09] flex flex-col justify-between p-6 shadow-[inset_0_0_80px_rgba(255,85,51,0.15)]">
      {/* Wooden Beam & Stone Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#221008]/90 via-[#180d09]/80 to-[#0e0705] pointer-events-none" />

      {/* Medieval Wooden Planks Grid */}
      <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(90deg,#ff5533_0,#ff5533_2px,transparent_2px,transparent_60px)] pointer-events-none" />

      {/* Ambient Fire Torch Glow Left & Right */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.7, 0.95], scale: [0.98, 1.05, 0.96, 1] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="absolute -top-10 -left-10 w-60 h-60 rounded-full bg-[radial-gradient(circle,#ff6600_0%,transparent_70%)] blur-2xl pointer-events-none"
      />
      <motion.div
        animate={{ opacity: [0.7, 0.95, 0.6, 1], scale: [1, 0.96, 1.05, 0.98] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-[radial-gradient(circle,#ff3300_0%,transparent_70%)] blur-2xl pointer-events-none"
      />

      {/* Floating Ember Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${(i * 9) % 100}%`,
              y: '100%',
              opacity: 0.2,
              scale: 0.5,
            }}
            animate={{
              y: '-20%',
              opacity: [0, 0.9, 0],
              scale: [0.5, 1.2, 0.4],
              x: `calc(${((i * 9) % 100)}% + ${(i % 2 === 0 ? 1 : -1) * 30}px)`,
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + (i % 4),
              delay: (i * 0.4) % 3,
              ease: 'easeOut',
            }}
            className="absolute w-2 h-2 rounded-full bg-[#ff7722] shadow-[0_0_8px_#ff5500]"
          />
        ))}
      </div>

      {/* Room Header Info */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff5533] to-[#992200] flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(255,85,51,0.5)] border border-[#ffaa88]/30">
            ⚔️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#ffaa77] uppercase px-2 py-0.5 rounded bg-[#ff5533]/20 border border-[#ff5533]/40">
                WARRIOR&apos;S TRAINING GROUND
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-[#ff8844]">
                <Flame size={12} className="animate-pulse" /> FORGE LIT
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>
              THE IRON HALL
            </h3>
          </div>
        </div>

        {/* Strength Badge */}
        <div className="text-right font-mono">
          <span className="text-[10px] text-[#ffaa77] uppercase tracking-wider block">Strength Level</span>
          <span className="text-xl sm:text-2xl font-black text-[#ff8833] flex items-center justify-end gap-1">
            <Shield size={18} /> {powerStat}
          </span>
        </div>
      </div>

      {/* Main Interactive Stage: Wooden Training Dummy + Legendary Sword */}
      <div className="relative z-10 flex items-center justify-around my-auto">
        {/* Weapon Rack / Shield */}
        <div className="hidden sm:flex flex-col items-center gap-2 text-[#ff8844]/80">
          <div className="w-16 h-20 rounded-xl bg-[#2b160e] border border-[#ff5533]/40 flex flex-col items-center justify-center p-2 shadow-md">
            <Shield size={28} className="text-[#ff7733]" />
            <span className="text-[9px] font-mono text-[#ffaa77] mt-1 uppercase font-bold">Aegis Guard</span>
          </div>
          <div className="flex gap-1 text-[#ff8844]">
            <Dumbbell size={16} />
            <span className="text-[10px] font-mono font-bold">HEAVY IRON</span>
          </div>
        </div>

        {/* Wooden Training Dummy (Shakes when strength quest is completed!) */}
        <motion.div
          animate={
            isStruck
              ? {
                  rotate: [0, -12, 10, -8, 5, -2, 0],
                  scale: [1, 1.08, 0.96, 1.04, 1],
                }
              : { rotate: [0, 1, -1, 0] }
          }
          transition={
            isStruck
              ? { duration: 0.8, ease: 'easeOut' }
              : { repeat: Infinity, duration: 4, ease: 'easeInOut' }
          }
          className="relative flex flex-col items-center cursor-pointer group"
        >
          {/* Target strike burst ring */}
          {isStruck && (
            <motion.div
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-full border-4 border-[#ff3300] pointer-events-none"
            />
          )}

          {/* Dummy Head */}
          <div className="w-14 h-14 rounded-2xl bg-[#542d18] border-2 border-[#ff8844] flex items-center justify-center shadow-[0_0_20px_rgba(255,85,51,0.3)] relative">
            <span className="text-xl">🎯</span>
            <div className="absolute -top-1 w-6 h-1.5 bg-[#8b4513] rounded-full" />
          </div>

          {/* Dummy Crossbar (Arms) */}
          <div className="w-36 h-5 rounded-lg bg-[#3b1c0d] border border-[#ff7733]/60 -mt-1 flex items-center justify-between px-2 shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5533]/80" />
            <span className="text-[9px] font-mono text-[#ffaa77] font-bold">LVL {powerStat} DUMMY</span>
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5533]/80" />
          </div>

          {/* Dummy Post (Body & Base) */}
          <div className="w-8 h-20 bg-[#2f160b] border-x border-[#ff5533]/40 flex items-center justify-center">
            <div className="w-1.5 h-full bg-[#ff5533]/20" />
          </div>
          <div className="w-24 h-4 bg-[#1f0e07] rounded-full border border-[#ff5533]/50 shadow-inner" />

          {/* Label */}
          <span className="text-[10px] font-mono text-[#ffaa88] mt-2 font-bold group-hover:text-white transition-colors">
            {isStruck ? '💥 DIRECT IMPACT!' : 'TRAINING DUMMY'}
          </span>
        </motion.div>

        {/* The Radiant Claymore / Sword */}
        <div className="flex flex-col items-center">
          <motion.div
            animate={{
              filter: isStruck
                ? ['drop-shadow(0 0 30px #ff3300)', 'drop-shadow(0 0 10px #ff7700)']
                : ['drop-shadow(0 0 10px #ff5533)', 'drop-shadow(0 0 20px #ff9900)', 'drop-shadow(0 0 10px #ff5533)'],
            }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="w-14 h-36 rounded-xl bg-[#23120a] border border-[#ff5533]/60 flex flex-col items-center justify-center p-2 shadow-lg relative"
          >
            {/* Sword representation */}
            <div className="w-1.5 h-20 bg-gradient-to-t from-[#ff8833] via-white to-[#ff3300] rounded-t-sm shadow-[0_0_12px_#ff5500]" />
            <div className="w-8 h-2 bg-[#d97706] rounded-sm -mt-0.5" />
            <div className="w-2 h-4 bg-[#451a03] rounded-b-sm" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#ff5533] -mt-0.5 flex items-center justify-center text-[8px] text-white">★</div>
          </motion.div>
          <span className="text-[10px] font-mono text-[#ffaa77] mt-2 font-bold">ANCIENT BLADE</span>
        </div>
      </div>

      {/* Bottom Footer Feedback */}
      <div className="relative z-10 pt-3 border-t border-[#ff5533]/20 flex items-center justify-between text-xs font-mono text-[#ffaa77]">
        <span className="flex items-center gap-1.5">
          <Zap size={14} className="text-[#ff5533]" />
          <span>Quests yield <b className="text-white">POWER +5</b> & Physical Resilience</span>
        </span>
        <span className="text-[11px] text-[#ff8844]/80 hidden sm:inline">
          Strike dummy via Workout Quests
        </span>
      </div>
    </div>
  );
}
