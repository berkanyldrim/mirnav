import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en.json';
import tr from '@/locales/tr.json';

const deviceLanguage = getLocales()[0]?.languageCode ?? 'tr';

const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources: {
    tr: { translation: tr },
    en: { translation: en },
  },
  lng: deviceLanguage,
  fallbackLng: 'tr',
  interpolation: { escapeValue: false },
});

export default i18n;
