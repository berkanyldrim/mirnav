import { SessionRecord } from '@/features/focus-session/session-log';
import {
  getDailyMinutes,
  getHourlyMinutes,
  getMonthlyMinutes,
  shiftDateKey,
} from '@/features/stats/detailed';

const record = (overrides: Partial<SessionRecord>): SessionRecord => ({
  id: 'id',
  endedAt: new Date(2026, 6, 28, 14, 30).getTime(),
  dateKey: '2026-07-28',
  durationMinutes: 25,
  tagId: 'study',
  outcome: 'completed',
  ...overrides,
});

describe('shiftDateKey', () => {
  it('moves across month boundaries', () => {
    expect(shiftDateKey('2026-07-01', -1)).toBe('2026-06-30');
    expect(shiftDateKey('2026-07-28', 4)).toBe('2026-08-01');
  });
});

describe('getHourlyMinutes', () => {
  it('sums completed minutes into the end hour', () => {
    const records = [
      record({ id: 'a' }),
      record({ id: 'b', endedAt: new Date(2026, 6, 28, 14, 50).getTime() }),
      record({ id: 'c', endedAt: new Date(2026, 6, 28, 9, 0).getTime(), durationMinutes: 15 }),
      record({ id: 'd', outcome: 'failed' }),
      record({ id: 'e', dateKey: '2026-07-27' }),
    ];
    const buckets = getHourlyMinutes(records, '2026-07-28');
    expect(buckets[14]).toBe(50);
    expect(buckets[9]).toBe(15);
    expect(buckets.reduce((total, value) => total + value, 0)).toBe(65);
  });
});

describe('getDailyMinutes', () => {
  it('returns oldest-to-newest buckets ending today', () => {
    const records = [
      record({ id: 'a' }),
      record({ id: 'b', dateKey: '2026-07-26', durationMinutes: 40 }),
      record({ id: 'c', dateKey: '2026-07-26', outcome: 'failed' }),
    ];
    const buckets = getDailyMinutes(records, '2026-07-28', 3);
    expect(buckets.map((bucket) => bucket.dateKey)).toEqual([
      '2026-07-26',
      '2026-07-27',
      '2026-07-28',
    ]);
    expect(buckets.map((bucket) => bucket.minutes)).toEqual([40, 0, 25]);
  });
});

describe('getMonthlyMinutes', () => {
  it('sums completed minutes per month of the given year', () => {
    const records = [
      record({ id: 'a' }),
      record({ id: 'b', dateKey: '2026-07-01', durationMinutes: 5 }),
      record({ id: 'c', dateKey: '2026-01-15', durationMinutes: 60 }),
      record({ id: 'd', dateKey: '2025-07-28', durationMinutes: 90 }),
    ];
    const buckets = getMonthlyMinutes(records, 2026);
    expect(buckets[6]).toBe(30);
    expect(buckets[0]).toBe(60);
    expect(buckets.reduce((total, value) => total + value, 0)).toBe(90);
  });
});
