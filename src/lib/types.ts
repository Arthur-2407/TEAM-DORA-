// ── Database Types ──────────────────────────────────────────────────────

import type { Category, Difficulty, ItemType, Rarity } from './constants';

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  level: number;
  current_xp: number;
  xp_to_next_level: number;
  total_xp: number;
  credits: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  strength: number;
  intellect: number;
  discipline: number;
  vitality: number;
  charisma: number;
  creativity: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  difficulty: Difficulty;
  category: Category;
  xp_reward: number;
  credit_reward: number;
  is_completed: boolean;
  is_recurring: boolean;
  recurrence_pattern: string | null;
  completed_at: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskLog {
  id: string;
  user_id: string;
  task_id: string | null;
  title: string;
  category: Category;
  difficulty: Difficulty;
  xp_earned: number;
  credits_earned: number;
  completed_at: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string | null;
  item_type: ItemType;
  price: number;
  icon: string | null;
  rarity: Rarity;
  metadata: Record<string, unknown>;
}

export interface InventoryItem {
  id: string;
  user_id: string;
  item_id: string;
  equipped: boolean;
  purchased_at: string;
  shop_items?: ShopItem;
}

export interface Achievement {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  condition_type: string;
  condition_value: number;
  xp_bonus: number;
  credit_bonus: number;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievements?: Achievement;
}

// ── API Response Types ──────────────────────────────────────────────────

export interface CompleteTaskResponse {
  leveled_up: boolean;
  new_level: number;
  xp_earned: number;
  credits_earned: number;
  current_xp: number;
  xp_to_next_level: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'xp' | 'levelup' | 'purchase' | 'achievement';
  title: string;
  description?: string;
  duration?: number;
}
