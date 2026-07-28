import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { MaxSessionRecords } from '@/constants/session';
import { SessionRecord } from '@/features/focus-session/session-log';
import { appStorage } from '@/lib/storage';

type SessionLogState = {
  records: SessionRecord[];
  addRecord: (record: SessionRecord) => void;
};

export const useSessionLogStore = create<SessionLogState>()(
  persist(
    (set) => ({
      records: [],
      addRecord: (record) =>
        set((state) => ({ records: [record, ...state.records].slice(0, MaxSessionRecords) })),
    }),
    {
      name: 'session-log',
      storage: appStorage,
    },
  ),
);
