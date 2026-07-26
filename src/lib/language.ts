import {
  DefaultLanguage,
  LanguagePreference,
  SupportedLanguage,
  SupportedLanguages,
} from '@/constants/languages';

export function resolveLanguage(
  preference: LanguagePreference,
  deviceLanguage: string | null,
): SupportedLanguage {
  if (preference !== 'system') {
    return preference;
  }

  return SupportedLanguages.find((language) => language === deviceLanguage) ?? DefaultLanguage;
}
