export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function previousDateKey(dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() - 1);
  return toDateKey(date);
}

export function getNextStreak(
  lastCompletedDate: string | null,
  currentStreak: number,
  completionDate: string,
) {
  if (lastCompletedDate === completionDate) return currentStreak;
  if (lastCompletedDate === previousDateKey(completionDate)) return currentStreak + 1;
  return 1;
}

export function getDisplayStreak(
  lastCompletedDate: string | null,
  currentStreak: number,
  today: string,
) {
  if (lastCompletedDate === null) return 0;
  if (lastCompletedDate === today || lastCompletedDate === previousDateKey(today)) {
    return currentStreak;
  }
  return 0;
}
