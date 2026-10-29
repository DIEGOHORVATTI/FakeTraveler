import { expect, it } from 'bun:test'

import { toPlace } from './photon'

it('monta título e subtítulo sem repetir partes', () => {
  const place = toPlace({
    geometry: { coordinates: [2.2945, 48.8584] },
    properties: {
      osm_type: 'W',
      osm_id: 1,
      name: 'Tour Eiffel',
      city: 'Paris',
      state: 'Île-de-France',
      country: 'France',
    },
  })

  expect(place).toMatchObject({
    latitude: 48.8584,
    longitude: 2.2945,
    title: 'Tour Eiffel',
    subtitle: 'Paris, Île-de-France, France',
  })
})

it('usa a cidade como título quando não há nome', () => {
  const place = toPlace({
    geometry: { coordinates: [-46.63, -23.55] },
    properties: { city: 'São Paulo', country: 'Brasil' },
  })

  expect(place.title).toBe('São Paulo')
  expect(place.subtitle).toBe('Brasil')
})
