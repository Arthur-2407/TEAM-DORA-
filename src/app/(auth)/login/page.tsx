'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Shield, Lock, Mail, ArrowRight, Play, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, loginAsDemo } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn(email, password);
      if (res.error) {
        setError(res.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Uplink authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    setLoading(true);
    await loginAsDemo();
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="glass-card p-8 border border-[var(--border-neon)] shadow-[0_0_50px_rgba(0,240,255,0.15)] relative">
      {/* Top Cyber Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--neon-cyan)] to-transparent" />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-[var(--neon-cyan)] to-[var(--neon-magenta)] flex items-center justify-center shadow-[0_0_25px_rgba(0,240,255,0.4)]">
          <Shield size={28} className="text-black" />
        </div>
        <h1
          className="text-2xl font-bold tracking-widest text-white uppercase"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          NEXUS PROTOCOL
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono tracking-wide">
          AUTHENTICATE NEURAL LINK CREDENTIALS
        </p>
      </div>

      {error && (
        <div className="p-3 mb-5 rounded-lg bg-[rgba(255,51,102,0.15)] border border-[#ff3366] text-[#ff3366] text-xs font-mono">
          {error}
        </div>
      )}

      {/* Instant Demo Access Button */}
      <div className="mb-6 p-4 rounded-xl bg-[rgba(0,240,255,0.06)] border border-[rgba(0,240,255,0.25)] flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--neon-cyan)] font-mono uppercase tracking-wider flex items-center gap-1.5">
            <Play size={14} /> Quick Evaluation Mode
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(0,255,136,0.15)] text-[var(--neon-green)] font-mono font-bold">
            READY
          </span>
        </div>
        <p className="text-[11px] text-[var(--text-secondary)]">
          Test drive the entire Life RPG engine with pre-loaded missions, streaks, and shop items immediately without credentials.
        </p>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleDemoAccess}
          isLoading={loading}
          className="w-full mt-1"
        >
          LAUNCH INSTANT DEMO
        </Button>
      </div>

      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[rgba(255,255,255,0.1)]" />
        </div>
        <span className="relative px-3 bg-[var(--bg-card)] text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">
          OR SECURE LOGIN
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
            Agent Identifier / Email
          </label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@nexus.net"
              className="input-neon pl-10 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
            Decryption Passkey
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="input-neon pl-10 pr-10 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer p-1"
              aria-label={showPassword ? 'Hide passkey' : 'Show passkey'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="neon"
          size="md"
          isLoading={loading}
          className="w-full mt-2"
          rightIcon={<ArrowRight size={16} />}
        >
          INITIALIZE UPLINK
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center text-xs font-mono text-[var(--text-secondary)]">
        New Operative?{' '}
        <Link
          href="/signup"
          className="text-[var(--neon-cyan)] hover:underline font-bold tracking-wide"
        >
          REGISTER PROFILE
        </Link>
      </div>
    </div>
  );
}
