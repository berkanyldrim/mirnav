import { SessionRecord } from '@/features/focus-session/session-log';
import { getCompletedCountForDate, getCompletedMinutesForDate } from '@/features/stats/summary';

const records: SessionRecord[] = [
  {
    id: 'a',
    endedAt: 1,
    dateKey: '2026-07-28',
    durationMinutes: 25,
    tagId: 'study',
    outcome: 'completed',
  },
  {
    id: 'b',
    endedAt: 2,
    dateKey: '2026-07-28',
    durationMinutes: 50,
    tagId: 'work',
    outcome: 'completed',
  },
  {
    id: 'c',
    endedAt: 3,
    dateKey: '2026-07-28',
    durationMinutes: 10,
    tagId: 'study',
    outcome: 'failed',
  },
  {
    id: 'd',
    endedAt: 4,
    dateKey: '2026-07-27',
    durationMinutes: 15,
    tagId: 'study',
    outcome: 'completed',
  },
];

describe('getCompletedMinutesForDate', () => {
  it('sums only completed sessions on the given day', () => {
    expect(getCompletedMinutesForDate(records, '2026-07-28')).toBe(75);
  });

  it('returns zero for a day without sessions', () => {
    expect(getCompletedMinutesForDate(records, '2026-07-20')).toBe(0);
  });
});

describe('getCompletedCountForDate', () => {
  it('counts only completed sessions on the given day', () => {
    expect(getCompletedCountForDate(records, '2026-07-28')).toBe(2);
  });

  it('returns zero for a day without sessions', () => {
    expect(getCompletedCountForDate(records, '2026-07-20')).toBe(0);
  });
});
