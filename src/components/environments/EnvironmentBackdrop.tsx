'use client';

import React from 'react';
import type { PathwayThemeId } from '@/lib/constants';
import { WarriorGround } from './WarriorGround';
import { ArcaneStudy } from './ArcaneStudy';
import { CommanderSanctuary } from './CommanderSanctuary';
import { HealingGarden } from './HealingGarden';
import { SocialTavern } from './SocialTavern';
import { DreamerWorkshop } from './DreamerWorkshop';

interface EnvironmentBackdropProps {
  currentTheme: PathwayThemeId;
  lastEventTrigger?: number;
  stats?: Record<string, number>;
  streak?: number;
}

export function EnvironmentBackdrop({
  currentTheme,
  lastEventTrigger = 0,
  stats = {},
  streak = 7,
}: EnvironmentBackdropProps) {
  switch (currentTheme) {
    case 'strength':
      return <WarriorGround lastEventTrigger={lastEventTrigger} powerStat={stats.strength || 12} />;
    case 'intellect':
      return <ArcaneStudy lastEventTrigger={lastEventTrigger} intellectStat={stats.intellect || 15} />;
    case 'discipline':
      return (
        <CommanderSanctuary
          lastEventTrigger={lastEventTrigger}
          disciplineStat={stats.discipline || 18}
          streakCount={streak}
        />
      );
    case 'vitality':
      return <HealingGarden lastEventTrigger={lastEventTrigger} vitalityStat={stats.vitality || 14} />;
    case 'charisma':
      return <SocialTavern lastEventTrigger={lastEventTrigger} charismaStat={stats.charisma || 11} />;
    case 'creativity':
      return <DreamerWorkshop lastEventTrigger={lastEventTrigger} creativityStat={stats.creativity || 13} />;
    case 'nexus':
    default:
      // Default to the Warrior's Ground or whichever is active, or show a unified hub
      return <WarriorGround lastEventTrigger={lastEventTrigger} powerStat={stats.strength || 12} />;
  }
}
