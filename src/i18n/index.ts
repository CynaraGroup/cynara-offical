import en from './en.json';
import zh from './zh.json';
import { cynaraConfig } from '../config/cynara';

export const translations = {
  en,
  zh,
} as const;

export type Locale = keyof typeof translations;
export const defaultLocale: Locale = 'zh';
export const locales = Object.keys(translations) as Locale[];

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'zh' || value === 'en';
}

export function getLocaleFromUrl(input: string | URL): Locale {
  const url = typeof input === 'string' ? new URL(input, cynaraConfig.site.url) : input;
  const lang = url.searchParams.get('lang');
  return isLocale(lang) ? lang : defaultLocale;
}

export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale];
  for (const k of keys) {
    value = value[k];
    if (!value) return key;
  }
  return value;
}
