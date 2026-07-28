import { SessionRecord } from '@/features/focus-session/session-log';
import { groupRecordsByDate } from '@/features/timeline/group-records';

const record = (id: string, dateKey: string): SessionRecord => ({
  id,
  endedAt: 0,
  dateKey,
  durationMinutes: 25,
  tagId: 'study',
  outcome: 'completed',
});

describe('groupRecordsByDate', () => {
  it('returns no sections for an empty log', () => {
    expect(groupRecordsByDate([])).toEqual([]);
  });

  it('groups consecutive records of the same day into one section', () => {
    const sections = groupRecordsByDate([
      record('a', '2026-07-28'),
      record('b', '2026-07-28'),
      record('c', '2026-07-27'),
    ]);
    expect(sections.map((section) => section.dateKey)).toEqual(['2026-07-28', '2026-07-27']);
    expect(sections[0].data.map((item) => item.id)).toEqual(['a', 'b']);
    expect(sections[1].data.map((item) => item.id)).toEqual(['c']);
  });
});
