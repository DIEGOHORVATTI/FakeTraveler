import { expect, it } from 'bun:test'

import { toStartOptions } from './start-options'

const settings = {
  mockCount: 5,
  mockFrequency: 0,
  latitudeStep: 10,
  longitudeStep: -5,
  mockSpeed: false,
  routeSpeedKmh: 36,
  routeLoop: true,
}

it('converte milionésimos de grau em graus e segundos em ms', () => {
  expect(toStartOptions({ latitude: 1, longitude: 2 }, settings)).toEqual({
    latitude: 1,
    longitude: 2,
    latitudeStep: 0.00001,
    longitudeStep: -0.000005,
    intervalMs: 1000,
    count: 5,
    moveAsSpeed: false,
    route: [],
    routeSpeed: 10,
    loop: true,
  })
})

it('com rota começa no primeiro ponto dela', () => {
  const route = {
    name: 'trilha',
    points: [
      [-23.5, -46.6],
      [-23.6, -46.7],
    ] as [number, number][],
  }
  const options = toStartOptions({ latitude: 1, longitude: 2 }, settings, route)

  expect(options).toMatchObject({ latitude: -23.5, longitude: -46.6, route: route.points })
})
