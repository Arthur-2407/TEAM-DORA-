'use client';

import React from 'react';
import { CATEGORY_CONFIG, type Category } from '@/lib/constants';

interface StatBarProps {
  category: Category;
  value: number;
  maxValue?: number;
}

export function StatBar({ category, value, maxValue = 20 }: StatBarProps) {
  const config = CATEGORY_CONFIG[category];
  const percent = Math.min(Math.round((value / maxValue) * 100), 100);

  return (
    <div className="w-full flex flex-col gap-1.5 p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] hover:border-[var(--border-neon)] transition-all">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-base" role="img" aria-label={config.label}>
            {config.icon}
          </span>
          <span
            className="font-semibold text-[var(--text-primary)] uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {config.label}
          </span>
        </div>
        <div className="font-mono text-xs font-bold" style={{ color: config.color }}>
          PTS: {value}
        </div>
      </div>

      <div className="w-full h-2 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percent}%`,
            backgroundColor: config.color,
            boxShadow: `0 0 10px ${config.color}80`,
          }}
        />
      </div>
      <p className="text-[10px] text-[var(--text-muted)] font-mono truncate">
        {config.description}
      </p>
    </div>
  );
}
