import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { appStorage } from '@/lib/storage';

type OnboardingState = {
  completed: boolean;
  completeOnboarding: () => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      completed: false,
      completeOnboarding: () => set({ completed: true }),
    }),
    {
      name: 'onboarding',
      storage: appStorage,
    },
  ),
);
