'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, ArrowUpRight, Zap } from 'lucide-react';
import { getLevelTitle } from '@/lib/xp';
import { Button } from '@/components/ui/Button';

interface LevelUpOverlayProps {
  isOpen: boolean;
  newLevel: number;
  onClose: () => void;
}

export function LevelUpOverlay({ isOpen, newLevel, onClose }: LevelUpOverlayProps) {
  const title = getLevelTitle(newLevel);

  // Play satisfying 8-bit synth chime using Web Audio API
  useEffect(() => {
    if (!isOpen) return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      // Cyber fanfare chords (C5, E5, G5, C6)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.6);
      });
    } catch {
      // Audio might be blocked by browser policy until interaction; fail silently
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="levelup-title"
        >
          {/* Neon Radial Background Pulse */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.25)_0%,transparent_70%)] animate-pulse pointer-events-none" />

          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ type: 'spring', duration: 0.6, bounce: 0.3 }}
            className="w-full max-w-md glass-card p-8 border-2 border-[var(--neon-cyan)] shadow-[0_0_80px_rgba(0,240,255,0.4)] text-center relative overflow-hidden"
          >
            {/* Corner cyber decorations */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[var(--neon-cyan)]" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[var(--neon-cyan)]" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[var(--neon-cyan)]" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[var(--neon-cyan)]" />

            {/* Glowing Icon */}
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', bounce: 0.4 }}
              className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-[var(--neon-cyan)] to-[var(--neon-magenta)] flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.6)]"
            >
              <Trophy size={40} className="text-black" />
            </motion.div>

            {/* Subtitle */}
            <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-widest text-[var(--neon-cyan)] uppercase mb-2">
              <Zap size={14} />
              <span>SYSTEM UPGRADE COMPLETE</span>
              <Sparkles size={14} />
            </div>

            {/* Title */}
            <h2
              id="levelup-title"
              className="text-4xl font-black tracking-widest uppercase mb-1 bg-gradient-to-r from-[var(--neon-cyan)] via-white to-[var(--neon-magenta)] bg-clip-text text-transparent"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              LEVEL {newLevel}
            </h2>

            {/* Rank Designation */}
            <div className="inline-block my-3 px-4 py-1 rounded-full border border-[var(--neon-gold)] bg-[rgba(255,215,0,0.1)] text-[var(--neon-gold)] text-sm font-bold uppercase font-mono tracking-widest shadow-[0_0_15px_rgba(255,215,0,0.3)]">
              RANK: {title}
            </div>

            {/* Reward Summary */}
            <div className="my-6 p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-left flex flex-col gap-2 font-mono text-xs">
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>Neural Bandwidth:</span>
                <span className="text-[var(--neon-cyan)] font-bold">+100% Boost</span>
              </div>
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>Credit Bonus:</span>
                <span className="text-[var(--neon-gold)] font-bold">+50 ₡ Claimed</span>
              </div>
              <div className="flex items-center justify-between text-[var(--text-secondary)]">
                <span>Black Market Access:</span>
                <span className="text-[var(--neon-green)] font-bold">Unlocked Tier {Math.min(newLevel, 5)}</span>
              </div>
            </div>

            {/* Action */}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              rightIcon={<ArrowUpRight size={18} />}
              onClick={onClose}
              autoFocus
            >
              INITIALIZE UPGRADE
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
