import { expect, it } from 'bun:test'

import {
  coordinatesFromUrl,
  decodeGeohash,
  resolveSharedPlace,
  splitSharedText,
} from './shared-place'

it('prefere o ponto exato do lugar (!3d!4d) ao centro da tela (@)', () => {
  const url =
    'https://www.google.com/maps/place/MASP/@-23.5613,-46.6563,17z/data=!3m1!4b1!4m6!3m5!8m2!3d-23.5614!4d-46.6559'
  expect(coordinatesFromUrl(url)).toEqual({ latitude: -23.5614, longitude: -46.6559 })
})

it('lê q=, ll= codificado e @', () => {
  expect(coordinatesFromUrl('https://maps.google.com/?q=-27.58,-48.67')).toEqual({
    latitude: -27.58,
    longitude: -48.67,
  })
  expect(coordinatesFromUrl('https://www.waze.com/ul?ll=-23.55%2C-46.63&navigate=yes')).toEqual({
    latitude: -23.55,
    longitude: -46.63,
  })
  expect(coordinatesFromUrl('https://www.google.com/maps/@48.8584,2.2945,15z')).toEqual({
    latitude: 48.8584,
    longitude: 2.2945,
  })
})

it('decodifica o geohash do link curto do Waze', () => {
  const point = decodeGeohash('6gyf4bf')
  expect(point.latitude).toBeCloseTo(-23.55, 1)
  expect(point.longitude).toBeCloseTo(-46.63, 1)
  expect(coordinatesFromUrl('https://waze.com/ul/h6gyf4bf')).toEqual(point)
})

it('devolve null quando o link não traz coordenadas', () => {
  expect(coordinatesFromUrl('https://maps.app.goo.gl/AbCdEf123')).toBeNull()
})

it('separa nome do lugar e link do texto compartilhado', () => {
  expect(splitSharedText('MASP\nAv. Paulista, 1578\nhttps://maps.app.goo.gl/AbCdEf123')).toEqual({
    url: 'https://maps.app.goo.gl/AbCdEf123',
    name: 'MASP',
  })
})

it('cai na busca por nome quando não há coordenadas nem link', async () => {
  const found = { latitude: 1, longitude: 2 }
  const place = await resolveSharedPlace('Padaria do Zé', async (name) =>
    name === 'Padaria do Zé' ? found : null,
  )
  expect(place).toBe(found)
})
