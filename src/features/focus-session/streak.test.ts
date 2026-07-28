import {
  getDisplayStreak,
  getStreakUpdate,
  isProtectionAvailable,
  toDateKey,
} from '@/features/focus-session/streak';

describe('toDateKey', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(toDateKey(new Date(2026, 6, 26))).toBe('2026-07-26');
  });

  it('pads single-digit months and days', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('isProtectionAvailable', () => {
  it('is available when never used', () => {
    expect(isProtectionAvailable(null, '2026-07-26')).toBe(true);
  });

  it('is unavailable within the cooldown window', () => {
    expect(isProtectionAvailable('2026-07-20', '2026-07-26')).toBe(false);
  });

  it('becomes available again after the cooldown', () => {
    expect(isProtectionAvailable('2026-07-19', '2026-07-26')).toBe(true);
  });
});

describe('getStreakUpdate', () => {
  it('starts a streak on the first completion', () => {
    expect(getStreakUpdate(null, 0, '2026-07-26', null)).toEqual({
      streak: 1,
      usedProtection: false,
    });
  });

  it('keeps the streak on a same-day completion', () => {
    expect(getStreakUpdate('2026-07-26', 3, '2026-07-26', null)).toEqual({
      streak: 3,
      usedProtection: false,
    });
  });

  it('increments the streak on a consecutive day', () => {
    expect(getStreakUpdate('2026-07-25', 3, '2026-07-26', null)).toEqual({
      streak: 4,
      usedProtection: false,
    });
  });

  it('increments across month and year boundaries', () => {
    expect(getStreakUpdate('2026-06-30', 2, '2026-07-01', null).streak).toBe(3);
    expect(getStreakUpdate('2025-12-31', 7, '2026-01-01', null).streak).toBe(8);
  });

  it('protects the streak after one missed day when protection is available', () => {
    expect(getStreakUpdate('2026-07-24', 9, '2026-07-26', null)).toEqual({
      streak: 10,
      usedProtection: true,
    });
  });

  it('resets after one missed day when protection is on cooldown', () => {
    expect(getStreakUpdate('2026-07-24', 9, '2026-07-26', '2026-07-22')).toEqual({
      streak: 1,
      usedProtection: false,
    });
  });

  it('resets after more than one missed day even with protection available', () => {
    expect(getStreakUpdate('2026-07-22', 9, '2026-07-26', null)).toEqual({
      streak: 1,
      usedProtection: false,
    });
  });
});

describe('getDisplayStreak', () => {
  it('returns zero when nothing was completed yet', () => {
    expect(getDisplayStreak(null, 0, '2026-07-26', null)).toBe(0);
  });

  it('returns the streak when completed today or yesterday', () => {
    expect(getDisplayStreak('2026-07-26', 4, '2026-07-26', null)).toBe(4);
    expect(getDisplayStreak('2026-07-25', 4, '2026-07-26', null)).toBe(4);
  });

  it('returns the streak after one missed day when protection can still save it', () => {
    expect(getDisplayStreak('2026-07-24', 4, '2026-07-26', null)).toBe(4);
  });

  it('returns zero after one missed day when protection is on cooldown', () => {
    expect(getDisplayStreak('2026-07-24', 4, '2026-07-26', '2026-07-22')).toBe(0);
  });

  it('returns zero when the streak is broken', () => {
    expect(getDisplayStreak('2026-07-20', 4, '2026-07-26', null)).toBe(0);
  });
});
