export const SupportedLanguages = ['tr', 'en'] as const;

export type SupportedLanguage = (typeof SupportedLanguages)[number];

export type LanguagePreference = SupportedLanguage | 'system';

export const LanguagePreferences: readonly LanguagePreference[] = [
  'system',
  ...SupportedLanguages,
];

export const DefaultLanguage: SupportedLanguage = 'tr';
