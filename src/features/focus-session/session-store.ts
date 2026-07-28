import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { DefaultDurationMinutes } from '@/constants/session';
import { DefaultTag } from '@/constants/tags';
import { getNewlyUnlockedCat } from '@/features/colony/unlock';
import { createSessionRecord, getElapsedMinutes } from '@/features/focus-session/session-log';
import { useSessionLogStore } from '@/features/focus-session/session-log-store';
import { getStreakUpdate, toDateKey } from '@/features/focus-session/streak';
import { appStorage } from '@/lib/storage';

export type SessionStatus = 'idle' | 'running' | 'completed' | 'failed';

type SessionState = {
  status: SessionStatus;
  durationMinutes: number;
  tagId: string;
  endsAt: number | null;
  totalFocusSeconds: number;
  completedSessionCount: number;
  currentStreak: number;
  lastCompletedDate: string | null;
  lastProtectionDate: string | null;
  unlockedCatId: string | null;
  selectDuration: (minutes: number) => void;
  selectTag: (tagId: string) => void;
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
      tagId: DefaultTag.id,
      endsAt: null,
      totalFocusSeconds: 0,
      completedSessionCount: 0,
      currentStreak: 0,
      lastCompletedDate: null,
      lastProtectionDate: null,
      unlockedCatId: null,
      selectDuration: (minutes) => set({ durationMinutes: minutes }),
      selectTag: (tagId) => set({ tagId }),
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
        const streakUpdate = getStreakUpdate(
          state.lastCompletedDate,
          state.currentStreak,
          completionDate,
          state.lastProtectionDate,
        );
        set({
          status: 'completed',
          endsAt: null,
          totalFocusSeconds: nextTotalFocusSeconds,
          completedSessionCount: state.completedSessionCount + 1,
          currentStreak: streakUpdate.streak,
          lastCompletedDate: completionDate,
          lastProtectionDate: streakUpdate.usedProtection
            ? completionDate
            : state.lastProtectionDate,
          unlockedCatId:
            getNewlyUnlockedCat(state.totalFocusSeconds, nextTotalFocusSeconds)?.id ?? null,
        });
        useSessionLogStore.getState().addRecord(
          createSessionRecord({
            endedAt: Date.now(),
            durationMinutes: state.durationMinutes,
            tagId: state.tagId,
            outcome: 'completed',
          }),
        );
      },
      failSession: () => {
        const state = get();
        if (state.status !== 'running') return;
        set({ status: 'failed', endsAt: null, unlockedCatId: null });
        useSessionLogStore.getState().addRecord(
          createSessionRecord({
            endedAt: Date.now(),
            durationMinutes: getElapsedMinutes(state.endsAt, state.durationMinutes, Date.now()),
            tagId: state.tagId,
            outcome: 'failed',
          }),
        );
      },
      resetSession: () => set({ status: 'idle', endsAt: null, unlockedCatId: null }),
    }),
    {
      name: 'session',
      storage: appStorage,
      partialize: (state) => ({
        durationMinutes: state.durationMinutes,
        tagId: state.tagId,
        totalFocusSeconds: state.totalFocusSeconds,
        completedSessionCount: state.completedSessionCount,
        currentStreak: state.currentStreak,
        lastCompletedDate: state.lastCompletedDate,
        lastProtectionDate: state.lastProtectionDate,
      }),
    },
  ),
);
