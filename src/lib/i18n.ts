import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { DefaultLanguage } from '@/constants/languages';
import { resolveLanguage } from '@/lib/language';
import en from '@/locales/en.json';
import tr from '@/locales/tr.json';

export function getDeviceLanguage(): string | null {
  return getLocales()[0]?.languageCode ?? null;
}

const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources: {
    tr: { translation: tr },
    en: { translation: en },
  },
  lng: resolveLanguage('system', getDeviceLanguage()),
  fallbackLng: DefaultLanguage,
  interpolation: { escapeValue: false },
});

export default i18n;
