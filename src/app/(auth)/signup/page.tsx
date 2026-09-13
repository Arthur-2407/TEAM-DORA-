'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Shield, Lock, Mail, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password.length < 6) {
      setError('Decryption passkey must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await signUp(email, password, username);
      if (res.error) {
        setError(res.error);
      } else if (res.message) {
        setSuccessMessage(res.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 border border-[var(--border-neon)] shadow-[0_0_50px_rgba(0,240,255,0.15)] relative">
      {/* Top Cyber Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--neon-magenta)] to-transparent" />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-[var(--neon-magenta)] to-[var(--neon-cyan)] flex items-center justify-center shadow-[0_0_25px_rgba(255,0,170,0.4)]">
          <Shield size={28} className="text-black" />
        </div>
        <h1
          className="text-2xl font-bold tracking-widest text-white uppercase"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ENLIST OPERATIVE
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono tracking-wide">
          CREATE NEURAL PROFILE IN THE NEXUS
        </p>
      </div>

      {successMessage && (
        <div className="p-4 mb-5 rounded-lg bg-[rgba(0,255,136,0.15)] border border-[var(--neon-green)] text-white text-xs font-mono leading-relaxed">
          <p className="font-bold text-[var(--neon-green)] mb-1">🎉 ENLISTMENT RECORDED</p>
          {successMessage}
        </div>
      )}

      {error && (
        <div className="p-3.5 mb-5 rounded-lg bg-[rgba(255,51,102,0.15)] border border-[#ff3366] text-[#ff3366] text-xs font-mono leading-relaxed">
          <p className="font-bold mb-1">⚠️ {error}</p>
          {error.toLowerCase().includes('rate limit') && (
            <p className="text-[11px] text-white/80 mt-1.5 pt-1.5 border-t border-[#ff3366]/30">
              Supabase default free email service allows only 2-3 confirmation emails per hour. To enable instant operative registration without email limits, go to <strong>Supabase Dashboard &rarr; Auth &rarr; Providers &rarr; Email</strong> and turn <strong>Confirm email OFF</strong>.
            </p>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
            Callsign / Codename
          </label>
          <div className="relative">
            <User
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., PHANTOM-9"
              className="input-neon pl-10 text-sm"
              autoFocus
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
            Uplink Address / Email
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
            Decryption Passkey (min 6 chars)
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
          variant="primary"
          size="md"
          isLoading={loading}
          className="w-full mt-2"
          rightIcon={<ArrowRight size={16} />}
        >
          ESTABLISH NEURAL LINK
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center text-xs font-mono text-[var(--text-secondary)]">
        Existing Operative?{' '}
        <Link
          href="/login"
          className="text-[var(--neon-cyan)] hover:underline font-bold tracking-wide"
        >
          RECONNECT UPLINK
        </Link>
      </div>
    </div>
  );
}
