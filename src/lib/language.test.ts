import { resolveLanguage } from '@/lib/language';

describe('resolveLanguage', () => {
  it('returns the explicit preference regardless of device language', () => {
    expect(resolveLanguage('en', 'tr')).toBe('en');
    expect(resolveLanguage('tr', 'en')).toBe('tr');
  });

  it('resolves system to the device language when supported', () => {
    expect(resolveLanguage('system', 'tr')).toBe('tr');
    expect(resolveLanguage('system', 'en')).toBe('en');
  });

  it('falls back to Turkish when the device language is unsupported or unknown', () => {
    expect(resolveLanguage('system', 'de')).toBe('tr');
    expect(resolveLanguage('system', null)).toBe('tr');
  });
});
