'use client';

import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  tx: number;
  ty: number;
}

interface ParticleBurstProps {
  trigger: boolean;
  x?: number;
  y?: number;
  color?: string;
  onComplete?: () => void;
}

export function ParticleBurst({
  trigger,
  x = 0,
  y = 0,
  color = '#00f0ff',
  onComplete,
}: ParticleBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const colors = [color, '#ff00aa', '#ffd700', '#00ff88', '#ffffff'];
    const newParticles: Particle[] = Array.from({ length: 24 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.5;
      const distance = 50 + Math.random() * 80;
      return {
        id: i,
        x: 0,
        y: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 4,
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
      };
    });

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      if (onComplete) onComplete();
    }, 850);

    return () => clearTimeout(timer);
  }, [trigger, x, y, color, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-visible z-50 flex items-center justify-center"
      style={{ left: x, top: y }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={
            {
              backgroundColor: p.color,
              width: `${p.size}px`,
              height: `${p.size}px`,
              boxShadow: `0 0 10px ${p.color}`,
              '--tx': `${p.tx}px`,
              '--ty': `${p.ty}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
