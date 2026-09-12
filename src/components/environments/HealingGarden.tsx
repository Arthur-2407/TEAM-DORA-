'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Wind, Moon, Droplets } from 'lucide-react';

interface HealingGardenProps {
  lastEventTrigger?: number;
  vitalityStat?: number;
}

export function HealingGarden({ lastEventTrigger = 0, vitalityStat = 14 }: HealingGardenProps) {
  const [isHealed, setIsHealed] = useState(false);

  useEffect(() => {
    if (!lastEventTrigger) return;
    setIsHealed(true);
    const timer = setTimeout(() => setIsHealed(false), 2000);
    return () => clearTimeout(timer);
  }, [lastEventTrigger]);


  return (
    <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-[#10b981]/40 bg-[#06140e] flex flex-col justify-between p-6 shadow-[inset_0_0_80px_rgba(16,185,129,0.15)]">
      {/* Dark Forest Green & Emerald Mist Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#091f16] via-[#06160f] to-[#030d09] pointer-events-none" />

      {/* Floating Emerald Fireflies & Leaves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${(i * 7.5) % 95}%`,
              y: '100%',
              opacity: 0,
            }}
            animate={{
              y: ['100%', '30%', '-10%'],
              opacity: [0, 0.9, 0],
              x: `calc(${((i * 7.5) % 95)}% + ${(i % 2 === 0 ? 1 : -1) * 35}px)`,
            }}
            transition={{
              repeat: Infinity,
              duration: 5 + (i % 4),
              delay: (i * 0.6) % 4,
              ease: 'easeInOut',
            }}
            className="absolute w-2 h-2 rounded-full bg-[#34d399] shadow-[0_0_10px_#10b981]"
          />
        ))}
      </div>

      {/* Header Info */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-emerald-200/30">
            💚
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-300 uppercase px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40">
                THE HEALING GARDEN
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                <Wind size={12} className="animate-pulse" /> BIO-RHYTHM CALM
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>
              TRANQUIL SANCTUARY
            </h3>
          </div>
        </div>

        {/* Vitality Stat Display */}
        <div className="text-right font-mono">
          <span className="text-[10px] text-emerald-300 uppercase tracking-wider block">Vitality Level</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 flex items-center justify-end gap-1">
            <Heart size={18} /> {vitalityStat}
          </span>
        </div>
      </div>

      {/* Main Interactive Stage: Stone Water Fountain + Meditation Cushion + Bonsai Plants */}
      <div className="relative z-10 flex items-center justify-around my-auto">
        {/* Bonsai / Indoor Ferns */}
        <div className="hidden sm:flex flex-col items-center gap-2">
          <div className="w-20 h-24 rounded-xl bg-[#0c251b] border border-emerald-400/40 flex flex-col items-center justify-center p-2 shadow-md">
            <span className="text-3xl">🌿</span>
            <span className="text-[8px] font-mono text-emerald-300 mt-1 uppercase font-bold">Zen Bonsai</span>
          </div>
          <span className="text-[9px] font-mono text-emerald-300 font-bold">EMERALD FLORA</span>
        </div>

        {/* Tranquil Stone Fountain with Rippling Water */}
        <motion.div
          animate={
            isHealed
              ? { scale: [1, 1.08, 1], filter: ['drop-shadow(0 0 25px #10b981)', 'drop-shadow(0 0 10px #059669)'] }
              : { scale: [1, 1.02, 1] }
          }
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="relative flex flex-col items-center cursor-pointer group"
        >
          {isHealed && (
            <motion.div
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 rounded-full border-2 border-emerald-400 pointer-events-none"
            />
          )}

          {/* Bamboo water spout */}
          <div className="w-1.5 h-6 bg-[#854d0e] rounded-t-sm" />

          {/* Stone Basin */}
          <div className="w-36 h-20 rounded-full bg-gradient-to-b from-[#133e2c] to-[#0a2318] border-2 border-emerald-400/80 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.35)] relative overflow-hidden">
            {/* Water Ripple Ring */}
            <motion.div
              animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="w-24 h-10 rounded-full border border-teal-300/60 bg-teal-400/10 flex items-center justify-center"
            >
              <Droplets size={16} className="text-teal-300" />
            </motion.div>
          </div>

          {/* Fountain Stone Base */}
          <div className="w-44 h-4 bg-[#071911] rounded-full border border-emerald-500/50 mt-1" />
          <span className="text-[10px] font-mono text-emerald-300 mt-2 font-bold group-hover:text-white transition-colors">
            {isHealed ? '💧 REGENERATIVE SURGE!' : 'THE HEALING FOUNTAIN'}
          </span>
        </motion.div>

        {/* Meditation Cushion (Zafu) */}
        <div className="flex flex-col items-center">
          <motion.div
            animate={{
              y: [0, -3, 0],
            }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="w-16 h-24 rounded-xl bg-[#0c261b] border border-emerald-400/50 flex flex-col items-center justify-center p-2 shadow-lg"
          >
            <div className="w-12 h-6 rounded-full bg-emerald-600/80 border border-emerald-300/80 shadow-md flex items-center justify-center text-[9px] text-white font-mono font-bold">
              🧘
            </div>
            <div className="w-10 h-3 bg-teal-900 rounded-full mt-1" />
            <div className="flex items-center gap-1 text-[8px] font-mono text-emerald-300 mt-2">
              <Moon size={10} /> 8H REST
            </div>
          </motion.div>
          <span className="text-[10px] font-mono text-emerald-300 mt-2 font-bold">ZAFU CUSHION</span>
        </div>
      </div>

      {/* Bottom Footer Feedback */}
      <div className="relative z-10 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs font-mono text-emerald-300">
        <span className="flex items-center gap-1.5">
          <Heart size={14} className="text-emerald-400" />
          <span>Sleep & recovery quests yield <b className="text-white">VITALITY +5 💚</b></span>
        </span>
        <span className="text-[11px] text-emerald-400/80 hidden sm:inline">
          Hydration, Sleep Hygiene & Mindful Calm
        </span>
      </div>
    </div>
  );
}
