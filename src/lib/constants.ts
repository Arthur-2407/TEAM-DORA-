// ── Nexus Protocol Constants ────────────────────────────────────────────

export type Difficulty = 'trivial' | 'easy' | 'medium' | 'hard' | 'legendary';
export type Category = 'strength' | 'intellect' | 'discipline' | 'vitality' | 'charisma' | 'creativity';
export type ItemType = 'badge' | 'theme' | 'avatar' | 'title' | 'consumable';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type PathwayThemeId = 'nexus' | 'strength' | 'intellect' | 'discipline' | 'vitality' | 'charisma' | 'creativity';

// ── Difficulty Configuration ────────────────────────────────────────────

export const DIFFICULTY_CONFIG: Record<Difficulty, { xp: number; credits: number; label: string; color: string }> = {
  trivial:   { xp: 10,  credits: 2,  label: 'Trivial',   color: '#6b7280' },
  easy:      { xp: 25,  credits: 5,  label: 'Easy',      color: '#22c55e' },
  medium:    { xp: 50,  credits: 10, label: 'Medium',     color: '#3b82f6' },
  hard:      { xp: 100, credits: 25, label: 'Hard',       color: '#f59e0b' },
  legendary: { xp: 250, credits: 50, label: 'Legendary',  color: '#ef4444' },
};

// ── Category Configuration ──────────────────────────────────────────────

export const CATEGORY_CONFIG: Record<Category, { label: string; icon: string; color: string; description: string }> = {
  strength:   { label: 'Strength',   icon: '⚔️', color: '#ff3366', description: 'Physical power & endurance' },
  intellect:  { label: 'Intellect',  icon: '🧠', color: '#00f0ff', description: 'Knowledge & mental acuity' },
  discipline: { label: 'Discipline', icon: '🎯', color: '#ffd700', description: 'Focus & consistency' },
  vitality:   { label: 'Vitality',   icon: '💚', color: '#00ff88', description: 'Health & wellness' },
  charisma:   { label: 'Charisma',   icon: '✨', color: '#b366ff', description: 'Social skills & leadership' },
  creativity: { label: 'Creativity', icon: '🎨', color: '#ff00aa', description: 'Innovation & artistry' },
};

// ── Neural Pathway Themes Configuration ─────────────────────────────────

export interface PathwayThemeConfig {
  id: PathwayThemeId;
  name: string;
  codename: string;
  environmentTitle: string;
  environmentSubtitle: string;
  icon: string;
  statName: string;
  statBonusText: string;
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  description: string;
}

export const PATHWAY_THEMES: Record<PathwayThemeId, PathwayThemeConfig> = {
  nexus: {
    id: 'nexus',
    name: 'Neural Core',
    codename: 'THE NEXUS HEART',
    environmentTitle: 'Central Neural Core',
    environmentSubtitle: 'The radiant heart where all six pathways intersect and converge',
    icon: '⚡',
    statName: 'Core Resonance',
    statBonusText: 'ALL STATS',
    primary: '#00f0ff',
    secondary: '#ff00aa',
    accent: '#ffd700',
    glow: 'rgba(0, 240, 255, 0.4)',
    description: 'Harmonious core connecting and balancing all six life pathways.',
  },
  strength: {
    id: 'strength',
    name: "Warrior's Ground",
    codename: 'WARRIOR OVERDRIVE',
    environmentTitle: "Warrior's Training Ground",
    environmentSubtitle: 'Warm torches, wooden racks & heavy iron. Every workout fortifies your physical avatar.',
    icon: '⚔️',
    statName: 'Strength',
    statBonusText: 'POWER +5',
    primary: '#ff5533',
    secondary: '#d94411',
    accent: '#ff8833',
    glow: 'rgba(255, 85, 51, 0.45)',
    description: 'Physical fitness, gym, sports & endurance in an ancient cozy training hall.',
  },
  intellect: {
    id: 'intellect',
    name: 'Arcane Chamber',
    codename: 'SCHOLAR SANCTUM',
    environmentTitle: 'Arcane Study Chamber',
    environmentSubtitle: 'Candles, floating runes & glowing grimoires. Where deep study transmutes into power.',
    icon: '🧠',
    statName: 'Intellect',
    statBonusText: 'KNOWLEDGE +5 🧠',
    primary: '#38bdf8',
    secondary: '#6366f1',
    accent: '#a855f7',
    glow: 'rgba(56, 189, 248, 0.45)',
    description: 'Coding, studying, reading & mental acuity bathed in celestial starlight.',
  },
  discipline: {
    id: 'discipline',
    name: "Commander's Keep",
    codename: 'TACTICAL CHRONOS',
    environmentTitle: "The Commander's Sanctuary",
    environmentSubtitle: 'Precision chronometers, wax-stamped quest boards & unbreakable daily routines.',
    icon: '🎯',
    statName: 'Discipline',
    statBonusText: 'DISCIPLINE +5 🎯',
    primary: '#fbbf24',
    secondary: '#d97706',
    accent: '#f59e0b',
    glow: 'rgba(251, 191, 36, 0.45)',
    description: 'Consistency, habit trackers, deep focus blocks & organized willpower.',
  },
  vitality: {
    id: 'vitality',
    name: 'Healing Garden',
    codename: 'EMERALD REFUGE',
    environmentTitle: 'The Healing Garden',
    environmentSubtitle: 'Tranquil stone water fountain, bonsai plants, fireflies & soothing moonlight.',
    icon: '💚',
    statName: 'Vitality',
    statBonusText: 'VITALITY +5 💚',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#34d399',
    glow: 'rgba(16, 185, 129, 0.45)',
    description: 'Sleep hygiene, mindful meditation, nutrition & rejuvenating recovery.',
  },
  charisma: {
    id: 'charisma',
    name: 'Social Tavern',
    codename: 'TAVERN OF ECHOES',
    environmentTitle: 'The Social Tavern',
    environmentSubtitle: 'Warm hearth fire, joyful laughter, amber lanterns & clinking golden tankards.',
    icon: '✨',
    statName: 'Charisma',
    statBonusText: 'CHARISMA +5 ✨',
    primary: '#c084fc',
    secondary: '#9333ea',
    accent: '#f43f5e',
    glow: 'rgba(192, 132, 252, 0.45)',
    description: 'Networking, public speaking, friendship & magnetic communication.',
  },
  creativity: {
    id: 'creativity',
    name: "Dreamer's Studio",
    codename: 'DREAMER ATELIER',
    environmentTitle: "The Dreamer's Workshop",
    environmentSubtitle: 'Spattered canvas easels, floating musical notes, cameras & boundless imagination.',
    icon: '🎨',
    statName: 'Creativity',
    statBonusText: 'CREATIVITY +5 🎨',
    primary: '#f43f5e',
    secondary: '#ec4899',
    accent: '#38bdf8',
    glow: 'rgba(244, 63, 94, 0.45)',
    description: 'Design, music, creative writing, artistic illustration & photography.',
  },
};

// ── Rarity Configuration ────────────────────────────────────────────────

export const RARITY_CONFIG: Record<Rarity, { label: string; color: string; glow: string }> = {
  common:    { label: 'Common',    color: '#9ca3af', glow: '0 0 10px #9ca3af' },
  uncommon:  { label: 'Uncommon',  color: '#22c55e', glow: '0 0 10px #22c55e' },
  rare:      { label: 'Rare',      color: '#3b82f6', glow: '0 0 15px #3b82f6' },
  epic:      { label: 'Epic',      color: '#a855f7', glow: '0 0 20px #a855f7' },
  legendary: { label: 'Legendary', color: '#f59e0b', glow: '0 0 25px #f59e0b' },
};

// ── Theme Colors ────────────────────────────────────────────────────────

export const THEME = {
  bg: {
    primary: '#0a0a0f',
    secondary: '#12121a',
    tertiary: '#1a1a2e',
    card: 'rgba(18, 18, 26, 0.8)',
  },
  neon: {
    cyan: '#00f0ff',
    magenta: '#ff00aa',
    gold: '#ffd700',
    green: '#00ff88',
    purple: '#b366ff',
    red: '#ff3366',
  },
  text: {
    primary: '#e0e0e0',
    secondary: '#8888aa',
    muted: '#555577',
  },
} as const;

// ── Streak Multiplier ───────────────────────────────────────────────────

export const STREAK_MULTIPLIER_CAP = 2.0;
export const STREAK_MULTIPLIER_INCREMENT = 0.1;

export function getStreakMultiplier(streakDays: number): number {
  return Math.min(1 + streakDays * STREAK_MULTIPLIER_INCREMENT, STREAK_MULTIPLIER_CAP);
}
