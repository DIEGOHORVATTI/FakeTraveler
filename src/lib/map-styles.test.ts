import { expect, it } from 'bun:test'

import { resolveMapProvider, shouldInvertTiles } from './map-styles'

it('automático e estilos antigos (Carto) caem no OpenStreetMap', () => {
  expect(resolveMapProvider('auto')).toBe('OpenStreetMap')
  expect(resolveMapProvider('CartoDB.Voyager')).toBe('OpenStreetMap')
  expect(resolveMapProvider('Esri.WorldImagery')).toBe('Esri.WorldImagery')
})

it('inverte os tiles no escuro, menos foto de satélite', () => {
  expect(shouldInvertTiles('OpenStreetMap', true)).toBe(true)
  expect(shouldInvertTiles('Esri.WorldImagery', true)).toBe(false)
  expect(shouldInvertTiles('OpenStreetMap', false)).toBe(false)
})
