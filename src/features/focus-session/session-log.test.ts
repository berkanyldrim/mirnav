import { createSessionRecord, getElapsedMinutes } from '@/features/focus-session/session-log';

describe('getElapsedMinutes', () => {
  const minute = 60 * 1000;

  it('returns zero without an active deadline', () => {
    expect(getElapsedMinutes(null, 25, Date.now())).toBe(0);
  });

  it('returns elapsed minutes mid-session', () => {
    const now = 1_000_000_000;
    expect(getElapsedMinutes(now + 20 * minute, 25, now)).toBe(5);
  });

  it('caps at the full duration when the deadline has passed', () => {
    const now = 1_000_000_000;
    expect(getElapsedMinutes(now - minute, 25, now)).toBe(25);
  });

  it('never returns a negative value', () => {
    const now = 1_000_000_000;
    expect(getElapsedMinutes(now + 30 * minute, 25, now)).toBe(0);
  });
});

describe('createSessionRecord', () => {
  const input = {
    endedAt: new Date(2026, 6, 28, 14, 30).getTime(),
    durationMinutes: 25,
    tagId: 'study',
    outcome: 'completed' as const,
  };

  it('derives the date key from the end timestamp', () => {
    expect(createSessionRecord(input).dateKey).toBe('2026-07-28');
  });

  it('keeps duration, tag, and outcome', () => {
    const record = createSessionRecord(input);
    expect(record.durationMinutes).toBe(25);
    expect(record.tagId).toBe('study');
    expect(record.outcome).toBe('completed');
  });

  it('generates distinct ids for records with the same timestamp', () => {
    expect(createSessionRecord(input).id).not.toBe(createSessionRecord(input).id);
  });
});
