export type AppLanguage = 'th' | 'en' | 'zh';

export interface LanguageOption {
  code: AppLanguage;
  nativeName: string;
  locale: string;
  flagClass: string;
}

export const DEFAULT_LANGUAGE: AppLanguage = 'th';

export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { code: 'th', nativeName: 'ไทย', locale: 'th-TH', flagClass: 'app-flag app-flag-th' },
  { code: 'en', nativeName: 'English', locale: 'en-US', flagClass: 'app-flag app-flag-en' },
  { code: 'zh', nativeName: '简体中文', locale: 'zh-Hans', flagClass: 'app-flag app-flag-zh' },
];

export function flagClassOf(language: AppLanguage): string {
  return LANGUAGE_OPTIONS.find((option) => option.code === language)?.flagClass ?? '';
}

export function isAppLanguage(value: unknown): value is AppLanguage {
  return LANGUAGE_OPTIONS.some((option) => option.code === value);
}

export function localeOf(language: AppLanguage): string {
  return LANGUAGE_OPTIONS.find((option) => option.code === language)?.locale ?? 'th-TH';
}
