import { expect, it } from 'bun:test'

import { parseGeoUri } from './geo-uri'

it('lê lat, lng e zoom de um geo URI', () => {
  expect(parseGeoUri('geo:-23.55,-46.63?z=14')).toEqual({
    latitude: -23.55,
    longitude: -46.63,
    zoom: 14,
  })
  expect(parseGeoUri('geo:12,15')).toEqual({ latitude: 12, longitude: 15, zoom: null })
})

it('rejeita o que não é geo URI', () => {
  expect(parseGeoUri('/settings')).toBeNull()
  expect(parseGeoUri('geo:abc,15')).toBeNull()
})
