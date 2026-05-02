import en from './en.json';
import zh from './zh.json';

export const translations = {
  en,
  zh,
} as const;

export type Locale = keyof typeof translations;
export const defaultLocale: Locale = 'zh';
export const locales = Object.keys(translations) as Locale[];

export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale];
  for (const k of keys) {
    value = value[k];
    if (!value) return key;
  }
  return value;
}
