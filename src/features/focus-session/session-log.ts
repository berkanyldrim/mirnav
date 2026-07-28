import { toDateKey } from '@/features/focus-session/streak';

export type SessionOutcome = 'completed' | 'failed';

export type SessionRecord = {
  id: string;
  endedAt: number;
  dateKey: string;
  durationMinutes: number;
  tagId: string;
  outcome: SessionOutcome;
};

export function getElapsedMinutes(endsAt: number | null, durationMinutes: number, now: number) {
  if (endsAt === null) return 0;
  const remainingSeconds = Math.max(0, (endsAt - now) / 1000);
  const elapsedSeconds = durationMinutes * 60 - remainingSeconds;
  return Math.max(0, Math.round(elapsedSeconds / 60));
}

export function createSessionRecord(input: {
  endedAt: number;
  durationMinutes: number;
  tagId: string;
  outcome: SessionOutcome;
}): SessionRecord {
  return {
    id: `${input.endedAt.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    endedAt: input.endedAt,
    dateKey: toDateKey(new Date(input.endedAt)),
    durationMinutes: input.durationMinutes,
    tagId: input.tagId,
    outcome: input.outcome,
  };
}
