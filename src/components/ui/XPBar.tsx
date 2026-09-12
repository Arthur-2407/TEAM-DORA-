'use client';

import React from 'react';
import { xpProgressPercent, getLevelTitle } from '@/lib/xp';

interface XPBarProps {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function XPBar({
  level,
  currentXp,
  xpToNextLevel,
  showDetails = true,
  size = 'md',
}: XPBarProps) {
  const percent = xpProgressPercent(currentXp, xpToNextLevel);
  const title = getLevelTitle(level);

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-5',
  }[size];

  return (
    <div className="w-full flex flex-col gap-1.5">
      {showDetails && (
        <div className="flex items-center justify-between text-xs tracking-wider font-mono">
          <div className="flex items-center gap-2">
            <span
              className="font-bold text-[var(--neon-cyan)] uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              LVL {level}
            </span>
            <span className="text-[var(--text-muted)]">/</span>
            <span className="text-[var(--text-secondary)] font-semibold tracking-wide">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <span className="text-white font-bold">{currentXp.toLocaleString()}</span>
            <span>/</span>
            <span>{xpToNextLevel.toLocaleString()} XP</span>
            <span className="text-[var(--neon-cyan)] font-bold ml-1">({percent}%)</span>
          </div>
        </div>
      )}

      {/* Progress Bar Container */}
      <div
        className={`w-full ${heightClasses} xp-bar-container border border-[rgba(0,240,255,0.2)]`}
        role="progressbar"
        aria-valuenow={currentXp}
        aria-valuemin={0}
        aria-valuemax={xpToNextLevel}
        aria-label={`XP Progress: ${percent}%`}
      >
        <div
          className="xp-bar-fill shadow-[0_0_12px_rgba(0,240,255,0.6)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
