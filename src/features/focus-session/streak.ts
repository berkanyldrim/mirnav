import { StreakProtectionCooldownDays } from '@/constants/session';

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function daysBetween(fromKey: string, toKey: string) {
  const from = new Date(`${fromKey}T12:00:00`);
  const to = new Date(`${toKey}T12:00:00`);
  return Math.round((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
}

export function isProtectionAvailable(lastProtectionDate: string | null, today: string) {
  if (lastProtectionDate === null) return true;
  return daysBetween(lastProtectionDate, today) >= StreakProtectionCooldownDays;
}

export type StreakUpdate = {
  streak: number;
  usedProtection: boolean;
};

export function getStreakUpdate(
  lastCompletedDate: string | null,
  currentStreak: number,
  completionDate: string,
  lastProtectionDate: string | null,
): StreakUpdate {
  if (lastCompletedDate === null) return { streak: 1, usedProtection: false };

  const gap = daysBetween(lastCompletedDate, completionDate);
  if (gap === 0) return { streak: currentStreak, usedProtection: false };
  if (gap === 1) return { streak: currentStreak + 1, usedProtection: false };
  if (gap === 2 && isProtectionAvailable(lastProtectionDate, completionDate)) {
    return { streak: currentStreak + 1, usedProtection: true };
  }

  return { streak: 1, usedProtection: false };
}

export function getDisplayStreak(
  lastCompletedDate: string | null,
  currentStreak: number,
  today: string,
  lastProtectionDate: string | null,
) {
  if (lastCompletedDate === null) return 0;

  const gap = daysBetween(lastCompletedDate, today);
  if (gap <= 1) return currentStreak;
  if (gap === 2 && isProtectionAvailable(lastProtectionDate, today)) return currentStreak;

  return 0;
}
