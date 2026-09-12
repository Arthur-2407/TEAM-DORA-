'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Sparkles, Camera, Brush } from 'lucide-react';

interface DreamerWorkshopProps {
  lastEventTrigger?: number;
  creativityStat?: number;
}

export function DreamerWorkshop({ lastEventTrigger = 0, creativityStat = 13 }: DreamerWorkshopProps) {
  const [isCreated, setIsCreated] = useState(false);

  useEffect(() => {
    if (!lastEventTrigger) return;
    setIsCreated(true);
    const timer = setTimeout(() => setIsCreated(false), 2000);
    return () => clearTimeout(timer);
  }, [lastEventTrigger]);


  return (
    <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-[#f43f5e]/40 bg-[#170a14] flex flex-col justify-between p-6 shadow-[inset_0_0_80px_rgba(244,63,94,0.15)]">
      {/* Whimsical Atelier Palette: Dreamy Purple, Magenta, Cyan & Soft Orange */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#240c1d] via-[#180914] to-[#0c040b] pointer-events-none" />

      {/* Floating Paint Splatters & Musical Notes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🎵', '🎨', '✨', '🎶', '🖌️', '⭐', '🌈'].map((symbol, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${(i * 14) % 90}%`,
              y: '100%',
              opacity: 0,
            }}
            animate={{
              y: '-20%',
              opacity: [0, 0.8, 0],
              x: `calc(${((i * 14) % 90)}% + ${(i % 2 === 0 ? 1 : -1) * 28}px)`,
              rotate: [0, 20, -20, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4.5 + (i % 3),
              delay: (i * 0.5) % 4,
            }}
            className="absolute text-sm drop-shadow-[0_0_8px_#f43f5e]"
          >
            {symbol}
          </motion.div>
        ))}
      </div>

      {/* Header Info */}
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f43f5e] via-[#ec4899] to-[#d946ef] flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(244,63,94,0.5)] border border-pink-200/30">
            🎨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-pink-300 uppercase px-2 py-0.5 rounded bg-pink-500/20 border border-pink-400/40">
                THE DREAMER&apos;S WORKSHOP
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-300">
                <Palette size={12} className="text-pink-400" /> INSPIRATION FLOWING
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>
              THE ARTISAN ATELIER
            </h3>
          </div>
        </div>

        {/* Creativity Stat Display */}
        <div className="text-right font-mono">
          <span className="text-[10px] text-pink-300 uppercase tracking-wider block">Creativity Level</span>
          <span className="text-xl sm:text-2xl font-black text-pink-400 flex items-center justify-end gap-1">
            <Brush size={18} /> {creativityStat}
          </span>
        </div>
      </div>

      {/* Main Interactive Stage: Easel with Glowing Animated Canvas + Vintage Camera + Paint Jars */}
      <div className="relative z-10 flex items-center justify-around my-auto">
        {/* Vintage Camera & Polaroid Pinboard */}
        <div className="hidden sm:flex flex-col items-center gap-2">
          <div className="w-20 h-24 rounded-xl bg-[#2e1026] border border-pink-400/40 flex flex-col items-center justify-center p-2 shadow-md">
            <Camera size={26} className="text-cyan-300 mb-1" />
            <span className="text-[8px] font-mono text-pink-200 uppercase font-bold">Polaroid Lens</span>
          </div>
          <span className="text-[9px] font-mono text-pink-300 font-bold">VISION ARCHIVE</span>
        </div>

        {/* The Artist Easel with Animated Glowing Canvas */}
        <motion.div
          animate={
            isCreated
              ? { scale: [1, 1.1, 0.95, 1], rotate: [0, -3, 3, 0] }
              : { y: [0, -2, 0] }
          }
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="relative flex flex-col items-center cursor-pointer group"
        >
          {isCreated && (
            <motion.div
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 rounded-full border-2 border-pink-400 pointer-events-none"
            />
          )}

          {/* Wooden Easel Top Clamp */}
          <div className="w-4 h-3 bg-[#831843] rounded-t" />

          {/* The Canvas */}
          <div className="w-44 h-24 rounded-lg bg-gradient-to-br from-[#4a044e] via-[#3b0764] to-[#1e1b4b] border-2 border-pink-400/80 p-2 flex flex-col justify-between shadow-[0_0_30px_rgba(244,63,94,0.35)] relative overflow-hidden">
            <div className="flex items-center justify-between text-[8px] font-mono text-pink-300">
              <span>CANVAS #042</span>
              <span className="text-cyan-300">RGB 100%</span>
            </div>

            {/* Dynamic generative color splash inside canvas */}
            <div className="flex items-center justify-center gap-2 py-1">
              <div className="w-5 h-5 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899] animate-pulse" />
              <div className="w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
              <div className="w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
            </div>

            <div className="text-[7px] font-mono text-pink-200 text-center uppercase tracking-widest font-bold">
              {isCreated ? '✨ MASTERPIECE RENDERED!' : 'IMAGINATION UNBOUND'}
            </div>
          </div>

          {/* Easel Wooden Tripod Legs */}
          <div className="flex justify-between w-32 h-6 -mt-0.5">
            <div className="w-1.5 h-full bg-[#831843] origin-top rotate-12" />
            <div className="w-1.5 h-full bg-[#831843]" />
            <div className="w-1.5 h-full bg-[#831843] origin-top -rotate-12" />
          </div>

          <span className="text-[10px] font-mono text-pink-300 mt-1 font-bold group-hover:text-white transition-colors">
            {isCreated ? '🎨 ART COMPLETED!' : 'THE ATELIER EASEL'}
          </span>
        </motion.div>

        {/* Floating Paint Palette & Brushes */}
        <div className="flex flex-col items-center">
          <motion.div
            animate={{
              boxShadow: [
                '0 0 15px rgba(244,63,94,0.5)',
                '0 0 25px rgba(236,72,153,0.8)',
                '0 0 15px rgba(244,63,94,0.5)',
              ],
            }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="w-16 h-24 rounded-xl bg-[#280c21] border border-pink-400/60 flex flex-col items-center justify-between p-2 shadow-lg"
          >
            <div className="flex gap-1">
              <span className="text-sm">🖌️</span>
              <span className="text-sm">🖍️</span>
            </div>
            <div className="w-10 h-8 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 border border-white/40 flex items-center justify-center text-[7px] text-white font-mono font-bold">
              COLOR
            </div>
            <span className="text-[7px] font-mono text-pink-300 uppercase">SYNTH PALETTE</span>
          </motion.div>
          <span className="text-[10px] font-mono text-pink-300 mt-2 font-bold">PIGMENT RACK</span>
        </div>
      </div>

      {/* Bottom Footer Feedback */}
      <div className="relative z-10 pt-3 border-t border-pink-500/20 flex items-center justify-between text-xs font-mono text-pink-300">
        <span className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-pink-400" />
          <span>Creative & design quests yield <b className="text-white">CREATIVITY +5 🎨</b></span>
        </span>
        <span className="text-[11px] text-pink-400/80 hidden sm:inline">
          Music, Design, Writing & Artistic Craft
        </span>
      </div>
    </div>
  );
}
