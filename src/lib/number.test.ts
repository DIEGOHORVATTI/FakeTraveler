import { expect, it } from 'bun:test'

import { formatCoordinate, parseCoordinate, parseNumber } from './number'

it('aceita vírgula decimal e rejeita lixo', () => {
  expect(parseNumber('1,5')).toBe(1.5)
  expect(parseNumber(' ')).toBeNull()
  expect(parseNumber('-')).toBeNull()
})

it('respeita o limite da coordenada', () => {
  expect(parseCoordinate('90', 90)).toBe(90)
  expect(parseCoordinate('-91', 90)).toBeNull()
})

it('formata com no máximo 6 casas', () => {
  expect(formatCoordinate(-23.5505199)).toBe('-23.55052')
  expect(formatCoordinate(12)).toBe('12')
})
