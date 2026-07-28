import { SessionRecord } from '@/features/focus-session/session-log';

export type DaySection = {
  dateKey: string;
  data: SessionRecord[];
};

export function groupRecordsByDate(records: SessionRecord[]): DaySection[] {
  const sections: DaySection[] = [];
  for (const record of records) {
    const lastSection = sections[sections.length - 1];
    if (lastSection && lastSection.dateKey === record.dateKey) {
      lastSection.data.push(record);
    } else {
      sections.push({ dateKey: record.dateKey, data: [record] });
    }
  }
  return sections;
}
