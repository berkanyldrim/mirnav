import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { DefaultDurationMinutes } from '@/constants/session';
import { getNewlyUnlockedCat } from '@/features/colony/unlock';
import { getNextStreak, toDateKey } from '@/features/focus-session/streak';
import { appStorage } from '@/lib/storage';

export type SessionStatus = 'idle' | 'running' | 'completed' | 'failed';

type SessionState = {
  status: SessionStatus;
  durationMinutes: number;
  endsAt: number | null;
  totalFocusSeconds: number;
  completedSessionCount: number;
  currentStreak: number;
  lastCompletedDate: string | null;
  unlockedCatId: string | null;
  selectDuration: (minutes: number) => void;
  startSession: () => void;
  completeSession: () => void;
  failSession: () => void;
  resetSession: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      status: 'idle',
      durationMinutes: DefaultDurationMinutes,
      endsAt: null,
      totalFocusSeconds: 0,
      completedSessionCount: 0,
      currentStreak: 0,
      lastCompletedDate: null,
      unlockedCatId: null,
      selectDuration: (minutes) => set({ durationMinutes: minutes }),
      startSession: () =>
        set((state) => ({
          status: 'running',
          endsAt: Date.now() + state.durationMinutes * 60 * 1000,
        })),
      completeSession: () => {
        const state = get();
        if (state.status !== 'running') return;
        const completionDate = toDateKey(new Date());
        const nextTotalFocusSeconds = state.totalFocusSeconds + state.durationMinutes * 60;
        set({
          status: 'completed',
          endsAt: null,
          totalFocusSeconds: nextTotalFocusSeconds,
          completedSessionCount: state.completedSessionCount + 1,
          currentStreak: getNextStreak(
            state.lastCompletedDate,
            state.currentStreak,
            completionDate,
          ),
          lastCompletedDate: completionDate,
          unlockedCatId:
            getNewlyUnlockedCat(state.totalFocusSeconds, nextTotalFocusSeconds)?.id ?? null,
        });
      },
      failSession: () => set({ status: 'failed', endsAt: null, unlockedCatId: null }),
      resetSession: () => set({ status: 'idle', endsAt: null, unlockedCatId: null }),
    }),
    {
      name: 'session',
      storage: appStorage,
      partialize: (state) => ({
        durationMinutes: state.durationMinutes,
        totalFocusSeconds: state.totalFocusSeconds,
        completedSessionCount: state.completedSessionCount,
        currentStreak: state.currentStreak,
        lastCompletedDate: state.lastCompletedDate,
      }),
    },
  ),
);
