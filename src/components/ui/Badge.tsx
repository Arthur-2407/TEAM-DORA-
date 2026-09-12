import React from 'react';
import { DIFFICULTY_CONFIG, RARITY_CONFIG, type Difficulty, type Rarity } from '@/lib/constants';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'difficulty' | 'rarity' | 'custom';
  difficulty?: Difficulty;
  rarity?: Rarity;
  color?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'custom',
  difficulty,
  rarity,
  color,
  size = 'sm',
  className = '',
}: BadgeProps) {
  let badgeColor = color || 'var(--neon-cyan)';
  let label = children;

  if (variant === 'difficulty' && difficulty) {
    const config = DIFFICULTY_CONFIG[difficulty];
    badgeColor = config.color;
    label = config.label;
  } else if (variant === 'rarity' && rarity) {
    const config = RARITY_CONFIG[rarity];
    badgeColor = config.color;
    label = config.label;
  }

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`chip border uppercase font-mono tracking-wider inline-flex items-center gap-1 ${sizeStyles} ${className}`}
      style={{
        borderColor: `${badgeColor}60`,
        backgroundColor: `${badgeColor}15`,
        color: badgeColor,
        boxShadow: `0 0 8px ${badgeColor}30`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: badgeColor }}
      />
      {label}
    </span>
  );
}
