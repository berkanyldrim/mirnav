import { Cats } from '@/constants/cats';
import {
  getNewlyUnlockedCat,
  getNextLockedCat,
  getUnlockedCats,
  getUnlockProgress,
  isCatUnlocked,
} from '@/features/colony/unlock';

const hours = (value: number) => value * 3600;

describe('isCatUnlocked', () => {
  it('unlocks the starter cat with zero focus time', () => {
    expect(isCatUnlocked(Cats[0], 0)).toBe(true);
  });

  it('keeps a cat locked below its threshold', () => {
    expect(isCatUnlocked(Cats[1], hours(1) - 1)).toBe(false);
  });

  it('unlocks a cat exactly at its threshold', () => {
    expect(isCatUnlocked(Cats[1], hours(1))).toBe(true);
  });
});

describe('getUnlockedCats', () => {
  it('returns only the starter cat at the beginning', () => {
    expect(getUnlockedCats(0).map((cat) => cat.id)).toEqual(['boncuk']);
  });

  it('returns every cat past the highest threshold', () => {
    expect(getUnlockedCats(hours(40))).toHaveLength(Cats.length);
  });
});

describe('getNextLockedCat', () => {
  it('points to the second cat at the beginning', () => {
    expect(getNextLockedCat(0)?.id).toBe('tekir');
  });

  it('returns null when everything is unlocked', () => {
    expect(getNextLockedCat(hours(40))).toBeNull();
  });
});

describe('getUnlockProgress', () => {
  it('is complete for the starter cat', () => {
    expect(getUnlockProgress(Cats[0], 0)).toBe(1);
  });

  it('is halfway at half the threshold', () => {
    expect(getUnlockProgress(Cats[1], hours(0.5))).toBe(0.5);
  });

  it('caps at one past the threshold', () => {
    expect(getUnlockProgress(Cats[1], hours(2))).toBe(1);
  });
});

describe('getNewlyUnlockedCat', () => {
  it('detects a cat crossing its threshold', () => {
    expect(getNewlyUnlockedCat(hours(1) - 60, hours(1))?.id).toBe('tekir');
  });

  it('returns null when no threshold was crossed', () => {
    expect(getNewlyUnlockedCat(hours(1), hours(2))).toBeNull();
  });

  it('returns the earliest cat when several unlock at once', () => {
    expect(getNewlyUnlockedCat(0, hours(6))?.id).toBe('tekir');
  });
});
