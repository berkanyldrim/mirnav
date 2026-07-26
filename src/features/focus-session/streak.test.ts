import { getDisplayStreak, getNextStreak, toDateKey } from '@/features/focus-session/streak';

describe('toDateKey', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(toDateKey(new Date(2026, 6, 26))).toBe('2026-07-26');
  });

  it('pads single-digit months and days', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('getNextStreak', () => {
  it('starts a streak on the first completion', () => {
    expect(getNextStreak(null, 0, '2026-07-26')).toBe(1);
  });

  it('keeps the streak on a same-day completion', () => {
    expect(getNextStreak('2026-07-26', 3, '2026-07-26')).toBe(3);
  });

  it('increments the streak on a consecutive day', () => {
    expect(getNextStreak('2026-07-25', 3, '2026-07-26')).toBe(4);
  });

  it('increments across a month boundary', () => {
    expect(getNextStreak('2026-06-30', 2, '2026-07-01')).toBe(3);
  });

  it('increments across a year boundary', () => {
    expect(getNextStreak('2025-12-31', 7, '2026-01-01')).toBe(8);
  });

  it('resets to one after a missed day', () => {
    expect(getNextStreak('2026-07-24', 9, '2026-07-26')).toBe(1);
  });
});

describe('getDisplayStreak', () => {
  it('returns zero when nothing was completed yet', () => {
    expect(getDisplayStreak(null, 0, '2026-07-26')).toBe(0);
  });

  it('returns the streak when completed today', () => {
    expect(getDisplayStreak('2026-07-26', 4, '2026-07-26')).toBe(4);
  });

  it('returns the streak when completed yesterday', () => {
    expect(getDisplayStreak('2026-07-25', 4, '2026-07-26')).toBe(4);
  });

  it('returns zero when the streak is broken', () => {
    expect(getDisplayStreak('2026-07-20', 4, '2026-07-26')).toBe(0);
  });
});
