import type en from './locales/en.json'

export type TranslationKey = keyof typeof en
export type TranslationBundle = Partial<Record<TranslationKey, string>>

export function resolveBundle(
  bundles: Record<string, TranslationBundle>,
  languageTag?: string | null,
  languageCode?: string | null,
): TranslationBundle {
  return bundles[languageTag ?? ''] ?? bundles[languageCode ?? ''] ?? {}
}
