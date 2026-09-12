// ── XP & Leveling System ────────────────────────────────────────────────
// Non-linear progression: each level requires floor(100 * 1.5^(level-1)) XP

/**
 * Calculate XP needed to reach a specific level from the previous level.
 * Level 1→2: 100 XP, Level 2→3: 150 XP, Level 3→4: 225 XP, etc.
 */
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

/**
 * Calculate total cumulative XP needed to reach a given level from level 1.
 */
export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpForLevel(i);
  }
  return total;
}

/**
 * Calculate XP progress as a percentage (0-100) towards the next level.
 */
export function xpProgressPercent(currentXp: number, xpToNextLevel: number): number {
  if (xpToNextLevel <= 0) return 100;
  return Math.min(Math.round((currentXp / xpToNextLevel) * 100), 100);
}

/**
 * Given current level, XP, and earned XP, calculate new level state.
 * Returns { level, currentXp, xpToNextLevel, leveledUp, levelsGained }
 */
export function calculateLevelUp(
  currentLevel: number,
  currentXp: number,
  xpToNextLevel: number,
  earnedXp: number
) {
  let newXp = currentXp + earnedXp;
  let newLevel = currentLevel;
  let newXpToNext = xpToNextLevel;
  let levelsGained = 0;

  while (newXp >= newXpToNext) {
    newXp -= newXpToNext;
    newLevel += 1;
    newXpToNext = xpForLevel(newLevel);
    levelsGained += 1;
  }

  return {
    level: newLevel,
    currentXp: newXp,
    xpToNextLevel: newXpToNext,
    leveledUp: levelsGained > 0,
    levelsGained,
  };
}

/**
 * Generate a display-friendly level title based on level ranges.
 */
export function getLevelTitle(level: number): string {
  if (level <= 5) return 'Initiate';
  if (level <= 10) return 'Runner';
  if (level <= 15) return 'Operative';
  if (level <= 20) return 'Agent';
  if (level <= 30) return 'Specialist';
  if (level <= 40) return 'Commander';
  if (level <= 50) return 'Elite';
  if (level <= 75) return 'Nexus Master';
  return 'Transcendent';
}
