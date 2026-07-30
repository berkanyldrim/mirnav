import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { LanguagePreference } from '@/constants/languages';
import i18n, { getDeviceLanguage } from '@/lib/i18n';
import { resolveLanguage } from '@/lib/language';
import { appStorage } from '@/lib/storage';

type SettingsState = {
  language: LanguagePreference;
  reminderEnabled: boolean;
  setLanguage: (language: LanguagePreference) => void;
  setReminderEnabled: (enabled: boolean) => void;
};

function applyLanguage(preference: LanguagePreference) {
  i18n.changeLanguage(resolveLanguage(preference, getDeviceLanguage()));
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'system',
      reminderEnabled: false,
      setLanguage: (language) => {
        set({ language });
        applyLanguage(language);
      },
      setReminderEnabled: (enabled) => set({ reminderEnabled: enabled }),
    }),
    {
      name: 'settings',
      storage: appStorage,
      onRehydrateStorage: () => (state) => {
        if (state && state.language !== 'system') {
          applyLanguage(state.language);
        }
      },
    },
  ),
);
