import { getLocales } from 'expo-localization'

import { bundles } from './bundles'
import en from './locales/en.json'
import { resolveBundle, type TranslationKey } from './resolve-bundle'

const [locale] = getLocales()
const bundle = resolveBundle(bundles, locale?.languageTag, locale?.languageCode)

export function t(key: TranslationKey) {
  return bundle[key] ?? en[key]
}
