import { readdirSync } from 'node:fs'
import { expect, it } from 'bun:test'

import { bundles } from './bundles'
import en from './locales/en.json'

const localeFiles = readdirSync(new URL('./locales', import.meta.url)).map((file) =>
  file.replace('.json', ''),
)

it('registra todo arquivo de locale', () => {
  expect(Object.keys(bundles).sort()).toEqual(localeFiles.sort())
})

it.each(localeFiles)('%s traduz todas as chaves do en', (code) => {
  const bundle = bundles[code]!
  expect(Object.keys(bundle).sort()).toEqual(Object.keys(en).sort())
  expect(Object.values(bundle).every((text) => text?.trim())).toBe(true)
})
