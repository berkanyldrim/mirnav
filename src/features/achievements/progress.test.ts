import { Achievement } from '@/constants/achievements';
import { getAchievementCurrent, isAchieved } from '@/features/achievements/progress';

const hoursAchievement: Achievement = {
  id: 'hours4',
  icon: 'paw-outline',
  kind: 'totalHours',
  threshold: 4,
};

const streakAchievement: Achievement = {
  id: 'streak3',
  icon: 'calendar-outline',
  kind: 'streakDays',
  threshold: 3,
};

const sessionsAchievement: Achievement = {
  id: 'sessions10',
  icon: 'checkmark-done-outline',
  kind: 'sessions',
  threshold: 10,
};

const stats = {
  totalFocusSeconds: 5 * 3600 + 30 * 60,
  bestStreak: 2,
  completedSessionCount: 10,
};

describe('getAchievementCurrent', () => {
  it('converts total focus seconds to whole hours', () => {
    expect(getAchievementCurrent(hoursAchievement, stats)).toBe(5);
  });

  it('uses the best streak for streak achievements', () => {
    expect(getAchievementCurrent(streakAchievement, stats)).toBe(2);
  });

  it('uses the completed session count for session achievements', () => {
    expect(getAchievementCurrent(sessionsAchievement, stats)).toBe(10);
  });
});

describe('isAchieved', () => {
  it('unlocks when the threshold is reached', () => {
    expect(isAchieved(hoursAchievement, stats)).toBe(true);
    expect(isAchieved(sessionsAchievement, stats)).toBe(true);
  });

  it('stays locked below the threshold', () => {
    expect(isAchieved(streakAchievement, stats)).toBe(false);
  });
});
