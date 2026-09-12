'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import {
  Shield,
  Zap,
  Flame,
  Coins,
  TrendingUp,
  Award,
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function LandingPage() {
  const { user, loginAsDemo } = useAuth();
  const router = useRouter();
  const redirectedRef = React.useRef(false);

  useEffect(() => {
    if (user && !redirectedRef.current) {
      redirectedRef.current = true;
      router.replace('/dashboard');
    }
  }, [user, router]);

  const handleQuickDemo = async () => {
    await loginAsDemo();
    router.replace('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] bg-grid-animated relative overflow-hidden flex flex-col justify-between">
      {/* Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.12)_0%,transparent_70%)] pointer-events-none blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,0,170,0.12)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      {/* ── NAVBAR ────────────────────────────────────────────────────────── */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--neon-cyan)] to-[var(--neon-magenta)] flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <Shield size={22} className="text-black" />
          </div>
          <div>
            <span
              className="text-lg font-black tracking-widest text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              NEXUS <span className="text-[var(--neon-cyan)]">RPG</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              LOGIN
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="neon" size="sm">
              ENLIST
            </Button>
          </Link>
        </div>
      </nav>

      {/* ── HERO SECTION ──────────────────────────────────────────────────── */}
      <main className="w-full max-w-5xl mx-auto px-6 py-16 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
          <Sparkles size={14} /> COZY LIFE RPG PROGRESSION ENGINE
        </div>

        <h1
          className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase leading-none max-w-4xl mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          REAL LIFE IS THE GAME.{' '}
          <span className="bg-gradient-to-r from-amber-300 via-[var(--neon-cyan)] to-[var(--neon-magenta)] bg-clip-text text-transparent">
            TRANSMUTE HABITS TO RPG POWER
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-mono max-w-2xl mb-10 leading-relaxed">
          Break the delay barrier with instant fantasy feedback. Turn workouts into the Warrior&apos;s Training Ground, coding into the Arcane Study Chamber, sleep into the Healing Garden, and habits into the Commander&apos;s Sanctuary.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            onClick={handleQuickDemo}
            leftIcon={<Play size={18} />}
            className="w-full sm:w-auto text-sm px-8"
          >
            TEST DRIVE DEMO AGENT
          </Button>

          <Link href="/signup" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              rightIcon={<ArrowRight size={18} />}
              className="w-full sm:w-auto text-sm px-8"
            >
              CREATE NEW PROFILE
            </Button>
          </Link>
        </div>

        {/* ── CORE PILLARS PREVIEW ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-20 w-full text-left">
          <div className="glass-card p-6 border border-[rgba(0,240,255,0.2)]">
            <div className="w-12 h-12 rounded-xl bg-[rgba(0,240,255,0.15)] flex items-center justify-center text-[var(--neon-cyan)] mb-4">
              <TrendingUp size={24} />
            </div>
            <h3
              className="text-base font-bold text-white uppercase tracking-wider mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Non-Linear XP Curve
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed">
              Every level demands greater dedication. Mathematical exponential formulas prevent trivial level grinding and ensure true prestige.
            </p>
          </div>

          <div className="glass-card p-6 border border-[rgba(255,136,0,0.2)]">
            <div className="w-12 h-12 rounded-xl bg-[rgba(255,136,0,0.15)] flex items-center justify-center text-[#ff8800] mb-4">
              <Flame size={24} className="flame-icon" />
            </div>
            <h3
              className="text-base font-bold text-white uppercase tracking-wider mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Uplink Streak Multipliers
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed">
              Maintain daily chains to trigger up to 2.0x XP multipliers. Daily consistency delivers compound rewards.
            </p>
          </div>

          <div className="glass-card p-6 border border-[rgba(255,215,0,0.2)]">
            <div className="w-12 h-12 rounded-xl bg-[rgba(255,215,0,0.15)] flex items-center justify-center text-[var(--neon-gold)] mb-4">
              <Coins size={24} />
            </div>
            <h3
              className="text-base font-bold text-white uppercase tracking-wider mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Black Market Economy
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed">
              Earn tangible credits per mission to buy virtual implants, titles, custom avatars, and cosmetic interfaces.
            </p>
          </div>
        </div>
      </main>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="w-full border-t border-[var(--border-subtle)] py-6 px-6 text-center text-xs font-mono text-[var(--text-muted)]">
        NEXUS PROTOCOL — LIFE RPG ENGINE • SYSTEM ONLINE
      </footer>
    </div>
  );
}
