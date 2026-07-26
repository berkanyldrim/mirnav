import { Cat, Cats } from '@/constants/cats';

export function isCatUnlocked(cat: Cat, totalFocusSeconds: number) {
  return totalFocusSeconds >= cat.unlockHours * 3600;
}

export function getUnlockedCats(totalFocusSeconds: number) {
  return Cats.filter((cat) => isCatUnlocked(cat, totalFocusSeconds));
}

export function getNextLockedCat(totalFocusSeconds: number) {
  return Cats.find((cat) => !isCatUnlocked(cat, totalFocusSeconds)) ?? null;
}

export function getUnlockProgress(cat: Cat, totalFocusSeconds: number) {
  if (cat.unlockHours === 0) return 1;
  return Math.min(1, totalFocusSeconds / (cat.unlockHours * 3600));
}

export function getNewlyUnlockedCat(previousTotalSeconds: number, currentTotalSeconds: number) {
  return (
    Cats.find(
      (cat) => !isCatUnlocked(cat, previousTotalSeconds) && isCatUnlocked(cat, currentTotalSeconds),
    ) ?? null
  );
}
