import { SessionRecord } from '@/features/focus-session/session-log';
import { toDateKey } from '@/features/focus-session/streak';

export function shiftDateKey(dateKey: string, days: number) {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function getHourlyMinutes(records: SessionRecord[], dateKey: string) {
  const buckets = Array.from({ length: 24 }, () => 0);
  for (const record of records) {
    if (record.dateKey !== dateKey || record.outcome !== 'completed') continue;
    buckets[new Date(record.endedAt).getHours()] += record.durationMinutes;
  }
  return buckets;
}

export type DayBucket = {
  dateKey: string;
  minutes: number;
};

export function getDailyMinutes(
  records: SessionRecord[],
  todayKey: string,
  days: number,
): DayBucket[] {
  const totals = new Map<string, number>();
  for (const record of records) {
    if (record.outcome !== 'completed') continue;
    totals.set(record.dateKey, (totals.get(record.dateKey) ?? 0) + record.durationMinutes);
  }
  return Array.from({ length: days }, (_, index) => {
    const dateKey = shiftDateKey(todayKey, index - (days - 1));
    return { dateKey, minutes: totals.get(dateKey) ?? 0 };
  });
}

export function getMonthlyMinutes(records: SessionRecord[], year: number) {
  const buckets = Array.from({ length: 12 }, () => 0);
  for (const record of records) {
    if (record.outcome !== 'completed') continue;
    if (!record.dateKey.startsWith(`${year}-`)) continue;
    buckets[Number(record.dateKey.slice(5, 7)) - 1] += record.durationMinutes;
  }
  return buckets;
}
