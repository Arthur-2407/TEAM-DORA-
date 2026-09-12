'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Music, Flame } from 'lucide-react';

interface SocialTavernProps {
  lastEventTrigger?: number;
  charismaStat?: number;
}

export function SocialTavern({ lastEventTrigger = 0, charismaStat = 11 }: SocialTavernProps) {
  const [isCheered, setIsCheered] = useState(false);

  useEffect(() => {
    if (!lastEventTrigger) return;
    setIsCheered(true);
    const timer = setTimeout(() => setIsCheered(false), 2000);
    return () => clearTimeout(timer);
  }, [lastEventTrigger]);


  return (
    <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-[#c084fc]/40 bg-[#160b1e] flex flex-col justify-between p-6 shadow-[inset_0_0_80px_rgba(192,132,252,0.15)]">
      {/* Deep Burgundy & Velvet Purple Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#210f2c] via-[#160a20] to-[#0d0513] pointer-events-none" />

      {/* Warm Ambient Hearth Fire Glow */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.7, 0.95], scale: [0.95, 1.05, 0.95] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="absolute -bottom-10 left-1/3 w-80 h-40 rounded-full bg-[radial-gradient(ellipse,#e11d48_0%,transparent_70%)] blur-2xl pointer-events-none"
      />

      {/* Floating Sparkle & Chat Bubble Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${(i * 10) % 90}%`,
              y: '100%',
              opacity: 0,
            }}
            animate={{
              y: '-20%',
              opacity: [0, 0.8, 0],
              x: `calc(${((i * 10) % 90)}% + ${(i % 2 === 0 ? 1 : -1) * 20}px)`,
            }}
            transition={{
              repeat: Infinity,
              duration: 4 + (i % 3),
              delay: (i * 0.4) % 3,
            }}
            className="absolute text-purple-300 drop-shadow-[0_0_8px_#c084fc]"
          >
            {i % 2 === 0 ? '✨' : '💬'}
          </motion.div>
        ))}
      </div>

      {/* Header Info */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c084fc] via-[#9333ea] to-[#7e22ce] flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(192,132,252,0.5)] border border-purple-200/30">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-purple-300 uppercase px-2 py-0.5 rounded bg-purple-500/20 border border-purple-400/40">
                THE SOCIAL TAVERN
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-amber-300">
                <Flame size={12} className="text-amber-400" /> HEARTH FIRES LIT
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>
              TAVERN OF ECHOES
            </h3>
          </div>
        </div>

        {/* Charisma Stat Display */}
        <div className="text-right font-mono">
          <span className="text-[10px] text-purple-300 uppercase tracking-wider block">Charisma Level</span>
          <span className="text-xl sm:text-2xl font-black text-purple-400 flex items-center justify-end gap-1">
            <Sparkles size={18} /> {charismaStat}
          </span>
        </div>
      </div>

      {/* Main Interactive Stage: Clinking Tankards Toast + Tavern Lantern + Lute */}
      <div className="relative z-10 flex items-center justify-around my-auto">
        {/* Bard&apos;s Mandolin/Lute on Tavern Wall */}
        <div className="hidden sm:flex flex-col items-center gap-2">
          <div className="w-20 h-24 rounded-xl bg-[#281136] border border-purple-400/40 flex flex-col items-center justify-center p-2 shadow-md">
            <Music size={26} className="text-purple-300 mb-1" />
            <span className="text-[8px] font-mono text-purple-300 uppercase font-bold">Bard&apos;s Lute</span>
          </div>
          <span className="text-[9px] font-mono text-purple-300 font-bold">REVELRY CHORDS</span>
        </div>

        {/* Clinking Golden Tankards Toast Animation */}
        <motion.div
          animate={
            isCheered
              ? { scale: [1, 1.1, 0.95, 1], y: [0, -6, 0] }
              : { y: [0, -2, 0] }
          }
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="relative flex flex-col items-center cursor-pointer group"
        >
          {isCheered && (
            <motion.div
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 rounded-full border-2 border-amber-400 pointer-events-none"
            />
          )}

          {/* Chat / Speech Bubble above the toast */}
          <div className="w-40 h-8 rounded-full bg-purple-950/80 border border-purple-400/60 flex items-center justify-center gap-1.5 px-3 mb-2 shadow-md">
            <MessageCircle size={13} className="text-amber-300" />
            <span className="text-[9px] font-mono text-amber-200 font-bold">
              {isCheered ? '🍻 TO EXCELLENCE!' : '“HAIL, TRAVELER!”'}
            </span>
          </div>

          {/* Wooden Tavern Table & Golden Tankards */}
          <div className="w-48 h-20 rounded-2xl bg-[#341846] border-2 border-purple-400/80 flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(192,132,252,0.35)] relative">
            <div className="w-10 h-12 rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 border border-amber-200 flex flex-col items-center justify-center font-bold text-white shadow-md">
              🍺
            </div>
            <div className="text-amber-300 font-black text-xl animate-bounce">⚡</div>
            <div className="w-10 h-12 rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 border border-amber-200 flex flex-col items-center justify-center font-bold text-white shadow-md">
              🍺
            </div>
          </div>

          {/* Oak Table Plank Base */}
          <div className="w-56 h-4 bg-[#1f0d2b] rounded-full border border-purple-500/50 mt-1" />
          <span className="text-[10px] font-mono text-purple-300 mt-2 font-bold group-hover:text-white transition-colors">
            {isCheered ? '🎉 CHEERS RAISED!' : 'THE TAVERN ROUND'}
          </span>
        </motion.div>

        {/* Warm Amber Lantern */}
        <div className="flex flex-col items-center">
          <motion.div
            animate={{
              boxShadow: [
                '0 0 15px rgba(251,191,36,0.6)',
                '0 0 30px rgba(251,191,36,0.9)',
                '0 0 15px rgba(251,191,36,0.6)',
              ],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-16 h-24 rounded-xl bg-[#230f30] border border-amber-400/70 flex flex-col items-center justify-center p-2 shadow-lg"
          >
            <div className="w-6 h-8 rounded-md bg-amber-300 shadow-[0_0_15px_#fbbf24] flex items-center justify-center text-xs">
              🕯️
            </div>
            <div className="w-8 h-2 bg-amber-900 rounded mt-2" />
            <div className="w-10 h-2 bg-amber-950 rounded mt-0.5" />
          </motion.div>
          <span className="text-[10px] font-mono text-amber-300 mt-2 font-bold">AMBER LANTERN</span>
        </div>
      </div>

      {/* Bottom Footer Feedback */}
      <div className="relative z-10 pt-3 border-t border-purple-500/20 flex items-center justify-between text-xs font-mono text-purple-300">
        <span className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-purple-400" />
          <span>Social & networking quests yield <b className="text-white">CHARISMA +5 ✨</b></span>
        </span>
        <span className="text-[11px] text-purple-400/80 hidden sm:inline">
          Public Speaking, Networking & Camaraderie
        </span>
      </div>
    </div>
  );
}
