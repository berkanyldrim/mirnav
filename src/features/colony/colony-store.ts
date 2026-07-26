import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { StarterCat } from '@/constants/cats';
import { appStorage } from '@/lib/storage';

type ColonyState = {
  activeCatId: string;
  setActiveCat: (catId: string) => void;
};

export const useColonyStore = create<ColonyState>()(
  persist(
    (set) => ({
      activeCatId: StarterCat.id,
      setActiveCat: (catId) => set({ activeCatId: catId }),
    }),
    {
      name: 'colony',
      storage: appStorage,
    },
  ),
);
