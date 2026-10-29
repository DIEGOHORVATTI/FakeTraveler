import { getLocales } from 'expo-localization'

import { bundles } from './bundles'
import en from './locales/en.json'
import { resolveBundle, type TranslationKey } from './resolve-bundle'

const [systemLocale] = getLocales()

export const systemLanguage =
  [systemLocale?.languageTag, systemLocale?.languageCode].find(
    (code): code is string => !!code && code in bundles,
  ) ?? 'en'

let bundle = resolveBundle(bundles, systemLanguage)

export function setLanguage(code: string) {
  bundle = resolveBundle(bundles, code)
}

export function t(key: TranslationKey) {
  return bundle[key] ?? en[key]
}
