'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Terminal, Moon } from 'lucide-react';

interface ArcaneStudyProps {
  lastEventTrigger?: number;
  intellectStat?: number;
}

export function ArcaneStudy({ lastEventTrigger = 0, intellectStat = 15 }: ArcaneStudyProps) {
  const [isEnchanted, setIsEnchanted] = useState(false);

  useEffect(() => {
    if (!lastEventTrigger) return;
    setIsEnchanted(true);
    const timer = setTimeout(() => setIsEnchanted(false), 2000);
    return () => clearTimeout(timer);
  }, [lastEventTrigger]);


  return (
    <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-[#38bdf8]/40 bg-[#080d1a] flex flex-col justify-between p-6 shadow-[inset_0_0_80px_rgba(56,189,248,0.15)]">
      {/* Deep Midnight Blue/Indigo Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1329] via-[#091024] to-[#040711] pointer-events-none" />

      {/* Gothic Window with Starry Night Sky */}
      <div className="absolute top-4 right-10 w-32 h-44 rounded-t-full border border-[#38bdf8]/30 bg-[#02050f]/80 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1e3a8a_0%,transparent_80%)]" />
        <Moon size={18} className="absolute top-3 right-4 text-cyan-200" />
        {/* Little twinkle stars */}
        <div className="absolute top-8 left-4 w-1 h-1 rounded-full bg-white animate-ping" />
        <div className="absolute top-16 left-12 w-1.5 h-1.5 rounded-full bg-cyan-300" />
        <div className="absolute top-24 right-8 w-1 h-1 rounded-full bg-violet-300" />
      </div>

      {/* Floating Arcane Knowledge Runes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['λ', 'Σ', '∫', 'ψ', 'π', '01', '&&', '∇', '✦'].map((rune, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${(i * 12) % 90}%`,
              y: '100%',
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              y: '-20%',
              opacity: [0, 0.8, 0],
              scale: [0.8, 1.3, 0.7],
              x: `calc(${((i * 12) % 90)}% + ${(i % 2 === 0 ? 1 : -1) * 25}px)`,
            }}
            transition={{
              repeat: Infinity,
              duration: 4 + (i % 3),
              delay: (i * 0.5) % 4,
              ease: 'linear',
            }}
            className="absolute font-mono text-sm font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]"
          >
            {rune}
          </motion.div>
        ))}
      </div>

      {/* Header Info */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#38bdf8] via-[#6366f1] to-[#3b82f6] flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(56,189,248,0.5)] border border-cyan-200/30">
            🧠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-300 uppercase px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40">
                ARCANE STUDY CHAMBER
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400">
                <Sparkles size={12} className="animate-spin" /> RUNIC LINK ACTIVE
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>
              SCHOLAR&apos;S SANCTUM
            </h3>
          </div>
        </div>

        {/* Intellect Stat Display */}
        <div className="text-right font-mono">
          <span className="text-[10px] text-cyan-300 uppercase tracking-wider block">Intellect Stat</span>
          <span className="text-xl sm:text-2xl font-black text-cyan-400 flex items-center justify-end gap-1">
            <BookOpen size={18} /> {intellectStat}
          </span>
        </div>
      </div>

      {/* Main Interactive Stage: Open Grimoire + Cyber Laptop + Bookshelves */}
      <div className="relative z-10 flex items-center justify-around my-auto">
        {/* Floating Arcane Bookshelf */}
        <div className="hidden sm:flex flex-col gap-2">
          <div className="w-24 h-28 rounded-xl bg-[#0e172e] border border-cyan-500/30 p-2 flex flex-col justify-between shadow-lg">
            <div className="h-3 w-full bg-cyan-700/40 rounded-sm" />
            <div className="flex gap-1.5 justify-center items-end h-16">
              <div className="w-3 h-14 bg-indigo-500/60 rounded-t-sm" />
              <div className="w-3.5 h-16 bg-cyan-500/70 rounded-t-sm shadow-[0_0_8px_#38bdf8]" />
              <div className="w-3 h-12 bg-violet-500/60 rounded-t-sm" />
              <div className="w-3 h-15 bg-blue-500/60 rounded-t-sm" />
            </div>
            <div className="h-1.5 w-full bg-cyan-900 rounded" />
          </div>
          <span className="text-[9px] font-mono text-cyan-300 text-center font-bold">ANCIENT CODICES</span>
        </div>

        {/* Scholar Desk with Glowing Laptop & Floating Rune Pages */}
        <motion.div
          animate={
            isEnchanted
              ? { scale: [1, 1.08, 0.98, 1], y: [0, -8, 0] }
              : { y: [0, -3, 0] }
          }
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="relative flex flex-col items-center cursor-pointer group"
        >
          {isEnchanted && (
            <motion.div
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 rounded-full border-2 border-cyan-400 pointer-events-none"
            />
          )}

          {/* Glowing Neural Network lines above the desk */}
          <div className="w-32 h-10 flex items-center justify-center relative">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-cyan-300 font-mono text-xs font-bold tracking-widest flex items-center gap-1 drop-shadow-[0_0_10px_#38bdf8]"
            >
              <span>⟨</span>
              <span>SYNAPSE: 100%</span>
              <span>⟩</span>
            </motion.div>
          </div>

          {/* Grimoire / Open Book */}
          <div className="w-36 h-20 rounded-lg bg-gradient-to-r from-[#172554] via-[#1e1b4b] to-[#172554] border-2 border-cyan-400/80 p-2.5 flex items-center justify-between shadow-[0_0_25px_rgba(56,189,248,0.4)] relative">
            <div className="w-[48%] h-full border-r border-cyan-500/40 font-mono text-[8px] text-cyan-200 leading-tight">
              <div>{'// KNOWLEDGE'}</div>
              <div className="text-[7px] text-indigo-300">fn compile() &#123;</div>
              <div className="text-[7px] text-cyan-300"> &nbsp;ascend();</div>
              <div className="text-[7px] text-indigo-300">&#125;</div>
            </div>
            <div className="w-[48%] h-full font-mono text-[8px] text-cyan-200 pl-1">
              <Terminal size={12} className="text-cyan-400 mb-1" />
              <div className="text-[7px] text-cyan-300 animate-pulse">ALGORITHMS</div>
              <div className="text-[6px] text-cyan-400/80">O(1) INSIGHT</div>
            </div>
          </div>

          {/* Desk Base */}
          <div className="w-48 h-4 bg-[#0a1224] rounded-full border border-cyan-500/50 mt-1 shadow-md" />
          <span className="text-[10px] font-mono text-cyan-300 mt-2 font-bold group-hover:text-white transition-colors">
            {isEnchanted ? '✨ SYNAPTIC SURGE!' : 'THE RUNIC DESK'}
          </span>
        </motion.div>

        {/* Desk Crystal Lamp */}
        <div className="flex flex-col items-center">
          <motion.div
            animate={{
              boxShadow: isEnchanted
                ? ['0 0 35px #38bdf8', '0 0 15px #6366f1']
                : ['0 0 15px #38bdf8', '0 0 25px #818cf8', '0 0 15px #38bdf8'],
            }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-14 h-24 rounded-xl bg-[#0c162f] border border-cyan-400/60 flex flex-col items-center justify-center p-2 shadow-lg"
          >
            <div className="w-4 h-8 rounded-full bg-cyan-300 shadow-[0_0_15px_#38bdf8] animate-pulse" />
            <div className="w-8 h-2 bg-indigo-900 rounded mt-2" />
            <div className="w-10 h-3 bg-cyan-950 rounded mt-0.5 border-t border-cyan-400/40" />
          </motion.div>
          <span className="text-[10px] font-mono text-cyan-300 mt-2 font-bold">CRYSTAL LAMP</span>
        </div>
      </div>

      {/* Bottom Footer Feedback */}
      <div className="relative z-10 pt-3 border-t border-cyan-500/20 flex items-center justify-between text-xs font-mono text-cyan-300">
        <span className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-cyan-400" />
          <span>Study quests yield <b className="text-white">KNOWLEDGE +5 🧠</b></span>
        </span>
        <span className="text-[11px] text-cyan-400/80 hidden sm:inline">
          Read, Code & Master Technical Grimoires
        </span>
      </div>
    </div>
  );
}
