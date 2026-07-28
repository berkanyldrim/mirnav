import { SessionRecord } from '@/features/focus-session/session-log';

export function getCompletedMinutesForDate(records: SessionRecord[], dateKey: string) {
  return records.reduce(
    (total, record) =>
      record.dateKey === dateKey && record.outcome === 'completed'
        ? total + record.durationMinutes
        : total,
    0,
  );
}

export function getCompletedCountForDate(records: SessionRecord[], dateKey: string) {
  return records.filter(
    (record) => record.dateKey === dateKey && record.outcome === 'completed',
  ).length;
}
