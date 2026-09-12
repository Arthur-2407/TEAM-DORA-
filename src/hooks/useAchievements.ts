'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Achievement } from '@/lib/types';

export interface AchievementProgress extends Achievement {
  unlocked: boolean;
  progress: number;
  currentValue: number;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-1', name: 'First Steps', description: 'Complete your first mission.', icon: '🚀', condition_type: 'tasks_completed', condition_value: 1, xp_bonus: 50, credit_bonus: 10 },
  { id: 'ach-2', name: 'Getting Started', description: 'Complete 5 missions.', icon: '📋', condition_type: 'tasks_completed', condition_value: 5, xp_bonus: 100, credit_bonus: 25 },
  { id: 'ach-3', name: 'Mission Runner', description: 'Complete 15 missions.', icon: '🏃', condition_type: 'tasks_completed', condition_value: 15, xp_bonus: 250, credit_bonus: 50 },
  { id: 'ach-4', name: 'Streak Starter', description: 'Maintain a 3-day streak.', icon: '🔥', condition_type: 'streak_reached', condition_value: 3, xp_bonus: 75, credit_bonus: 15 },
  { id: 'ach-5', name: 'On Fire', description: 'Maintain a 7-day streak.', icon: '💥', condition_type: 'streak_reached', condition_value: 7, xp_bonus: 200, credit_bonus: 40 },
  { id: 'ach-6', name: 'Level 5 Operative', description: 'Reach Level 5.', icon: '⭐', condition_type: 'level_reached', condition_value: 5, xp_bonus: 150, credit_bonus: 30 },
  { id: 'ach-7', name: 'Level 10 Master', description: 'Reach Level 10.', icon: '🌟', condition_type: 'level_reached', condition_value: 10, xp_bonus: 350, credit_bonus: 75 },
  { id: 'ach-8', name: 'High Roller', description: 'Amass 200 credits in reserves.', icon: '💰', condition_type: 'credits_held', condition_value: 200, xp_bonus: 100, credit_bonus: 50 },
];

export function useAchievements(completedTasksCount: number = 4) {
  const { profile } = useAuth();
  const [achievements, setAchievements] = useState<AchievementProgress[]>([]);

  const calculateProgress = useCallback(() => {
    const level = profile?.level ?? 1;
    const streak = profile?.current_streak ?? 1;
    const credits = profile?.credits ?? 50;

    const list: AchievementProgress[] = DEFAULT_ACHIEVEMENTS.map((ach) => {
      let currentValue = 0;

      switch (ach.condition_type) {
        case 'tasks_completed':
          currentValue = completedTasksCount;
          break;
        case 'streak_reached':
          currentValue = streak;
          break;
        case 'level_reached':
          currentValue = level;
          break;
        case 'credits_held':
          currentValue = credits;
          break;
        default:
          currentValue = 0;
      }

      const unlocked = currentValue >= ach.condition_value;
      const progress = Math.min(Math.round((currentValue / ach.condition_value) * 100), 100);

      return {
        ...ach,
        unlocked,
        progress,
        currentValue,
      };
    });

    setAchievements(list);
  }, [profile, completedTasksCount]);

  useEffect(() => {
    calculateProgress();
  }, [calculateProgress]);

  return {
    achievements,
    unlockedCount: achievements.filter((a) => a.unlocked).length,
    totalCount: achievements.length,
  };
}
