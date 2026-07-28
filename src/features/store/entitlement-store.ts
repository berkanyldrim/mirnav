import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { appStorage } from '@/lib/storage';

type EntitlementState = {
  isPro: boolean;
  ownedCosmeticIds: string[];
};

export const useEntitlementStore = create<EntitlementState>()(
  persist(
    (): EntitlementState => ({
      isPro: false,
      ownedCosmeticIds: [],
    }),
    {
      name: 'entitlements',
      storage: appStorage,
    },
  ),
);

export function isCosmeticOwned(state: EntitlementState, cosmeticId: string) {
  return state.isPro || state.ownedCosmeticIds.includes(cosmeticId);
}
