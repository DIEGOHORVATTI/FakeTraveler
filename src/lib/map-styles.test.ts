import { expect, it } from 'bun:test'

import { resolveMapProvider } from './map-styles'

it('o automático segue o tema e os outros passam direto', () => {
  expect(resolveMapProvider('auto', true)).toBe('CartoDB.DarkMatter')
  expect(resolveMapProvider('auto', false)).toBe('CartoDB.Voyager')
  expect(resolveMapProvider('OpenStreetMap', true)).toBe('OpenStreetMap')
})
