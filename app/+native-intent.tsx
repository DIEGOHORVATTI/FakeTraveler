import { parseGeoUri } from '@/src/lib/geo-uri'

type NativeIntent = {
  path: string
  initial: boolean
}

export function redirectSystemPath({ path }: NativeIntent) {
  const point = parseGeoUri(path)
  if (!point) return path

  const params = new URLSearchParams({ lat: String(point.latitude), lng: String(point.longitude) })
  if (point.zoom !== null) params.set('zoom', String(point.zoom))
  return `/?${params}`
}
