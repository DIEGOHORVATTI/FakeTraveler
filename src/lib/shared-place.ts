import type { Coordinates } from '@/modules/mock-location'

const URL_PATTERN = /https?:\/\/\S+/
const COORDINATE = '(-?\\d{1,3}(?:\\.\\d+)?)'
const URL_COORDINATE_PATTERNS = [
  new RegExp(`!3d${COORDINATE}!4d${COORDINATE}`),
  new RegExp(`[?&](?:q|ll|query|center|daddr|destination)=${COORDINATE},\\s*${COORDINATE}`),
  new RegExp(`@${COORDINATE},${COORDINATE}`),
  new RegExp(`^geo:${COORDINATE},${COORDINATE}`),
]
const WAZE_GEOHASH = /waze\.com\/ul\/h([0-9b-hjkmnp-z]+)/
const GEOHASH_ALPHABET = '0123456789bcdefghjkmnpqrstuvwxyz'

function isValid({ latitude, longitude }: Coordinates) {
  return Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180
}

export function decodeGeohash(hash: string): Coordinates {
  const latitude = [-90, 90]
  const longitude = [-180, 180]
  let evenBit = true

  for (const char of hash) {
    const value = GEOHASH_ALPHABET.indexOf(char)
    for (let bit = 4; bit >= 0; bit--) {
      const range = evenBit ? longitude : latitude
      const middle = (range[0]! + range[1]!) / 2
      if ((value >> bit) & 1) range[0] = middle
      else range[1] = middle
      evenBit = !evenBit
    }
  }

  return {
    latitude: (latitude[0]! + latitude[1]!) / 2,
    longitude: (longitude[0]! + longitude[1]!) / 2,
  }
}

export function coordinatesFromUrl(rawUrl: string): Coordinates | null {
  const url = decodeURIComponent(rawUrl)

  const geohash = WAZE_GEOHASH.exec(url)?.[1]
  if (geohash) return decodeGeohash(geohash)

  for (const pattern of URL_COORDINATE_PATTERNS) {
    const match = pattern.exec(url)
    if (!match) continue
    const point = { latitude: Number(match[1]), longitude: Number(match[2]) }
    if (isValid(point)) return point
  }
  return null
}

export function splitSharedText(text: string) {
  const url = URL_PATTERN.exec(text)?.[0] ?? null
  const name = text
    .replace(URL_PATTERN, '')
    .split('\n')
    .map((line) => line.trim())
    .find(Boolean)
  return { url, name: name ?? null }
}

export async function resolveSharedPlace(
  text: string,
  searchByName: (name: string) => Promise<Coordinates | null>,
): Promise<Coordinates | null> {
  const { url, name } = splitSharedText(text)
  const direct = coordinatesFromUrl(url ?? text.trim())
  if (direct) return direct

  if (url) {
    const response = await fetch(url).catch(() => null)
    const resolved = response?.url ? coordinatesFromUrl(response.url) : null
    if (resolved) return resolved
  }

  return name ? searchByName(name) : null
}
