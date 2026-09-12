import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'neon' | 'subtle' | 'gradient';
  glowColor?: 'cyan' | 'magenta' | 'gold' | 'green';
  hoverEffect?: boolean;
}

export function Card({
  children,
  variant = 'glass',
  glowColor,
  hoverEffect = true,
  className = '',
  ...props
}: CardProps) {
  const variantStyles = {
    glass: 'glass-card',
    neon: 'neon-border glass-card',
    subtle: 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl',
    gradient: 'gradient-border',
  }[variant];

  const glowStyles = glowColor
    ? {
        cyan: 'hover:border-[var(--neon-cyan)] hover:shadow-[0_0_25px_rgba(0,240,255,0.15)]',
        magenta: 'hover:border-[var(--neon-magenta)] hover:shadow-[0_0_25px_rgba(255,0,170,0.15)]',
        gold: 'hover:border-[var(--neon-gold)] hover:shadow-[0_0_25px_rgba(255,215,0,0.15)]',
        green: 'hover:border-[var(--neon-green)] hover:shadow-[0_0_25px_rgba(0,255,136,0.15)]',
      }[glowColor]
    : '';

  return (
    <div
      className={`${variantStyles} p-6 ${hoverEffect ? 'transition-all duration-300' : ''} ${glowStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
