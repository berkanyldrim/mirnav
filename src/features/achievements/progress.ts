import { Achievement } from '@/constants/achievements';

export type AchievementStats = {
  totalFocusSeconds: number;
  bestStreak: number;
  completedSessionCount: number;
};

export function getAchievementCurrent(achievement: Achievement, stats: AchievementStats) {
  switch (achievement.kind) {
    case 'totalHours':
      return Math.floor(stats.totalFocusSeconds / 3600);
    case 'streakDays':
      return stats.bestStreak;
    case 'sessions':
      return stats.completedSessionCount;
  }
}

export function isAchieved(achievement: Achievement, stats: AchievementStats) {
  return getAchievementCurrent(achievement, stats) >= achievement.threshold;
}
