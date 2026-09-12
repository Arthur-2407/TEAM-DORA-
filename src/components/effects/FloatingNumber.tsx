'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FloatingItem {
  id: string;
  text: string;
  color: string;
  icon?: string;
}

interface FloatingNumbersProps {
  items: FloatingItem[];
  onComplete?: (id: string) => void;
}

export function FloatingNumbers({ items, onComplete }: FloatingNumbersProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-50 flex items-center justify-center">
      <AnimatePresence>
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: -50 - idx * 24,
              scale: [0.6, 1.25, 1, 0.9],
            }}
            transition={{
              duration: 1.2,
              times: [0, 0.15, 0.7, 1],
              ease: 'easeOut',
            }}
            onAnimationComplete={() => onComplete?.(item.id)}
            className="absolute font-mono font-black text-sm sm:text-base px-2.5 py-1 rounded-full whitespace-nowrap shadow-lg flex items-center gap-1.5 border border-white/20"
            style={{
              backgroundColor: 'rgba(10, 10, 15, 0.85)',
              color: item.color,
              boxShadow: `0 0 16px ${item.color}80`,
              left: `calc(50% + ${(idx % 2 === 0 ? 1 : -1) * (idx * 16)}px)`,
            }}
          >
            {item.icon && <span>{item.icon}</span>}
            <span>{item.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
