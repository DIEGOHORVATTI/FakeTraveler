import { expect, it } from 'bun:test'

import { toStartOptions } from './start-options'

it('converte milionésimos de grau em graus e segundos em ms', () => {
  const options = toStartOptions(
    { latitude: 1, longitude: 2 },
    { mockCount: 5, mockFrequency: 0, latitudeStep: 10, longitudeStep: -5, mockSpeed: false },
  )

  expect(options).toEqual({
    latitude: 1,
    longitude: 2,
    latitudeStep: 0.00001,
    longitudeStep: -0.000005,
    intervalMs: 1000,
    count: 5,
    moveAsSpeed: false,
  })
})
