export type GeoPoint = {
  latitude: number
  longitude: number
  zoom: number | null
}

const GEO_URI = /^geo:(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)(?:[;?](.*))?$/i

export function parseGeoUri(uri: string): GeoPoint | null {
  const match = GEO_URI.exec(uri.trim())
  if (!match) return null

  const zoom = new URLSearchParams(match[3] ?? '').get('z')

  return {
    latitude: Number(match[1]),
    longitude: Number(match[2]),
    zoom: zoom && Number.isFinite(Number(zoom)) ? Number(zoom) : null,
  }
}
