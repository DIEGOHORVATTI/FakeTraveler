import { strFromU8, unzipSync } from 'fflate'

export type RoutePoint = [number, number]

const GPX_POINT = /<(trkpt|rtept|wpt)\b([^>]*)>/g
const LAT_ATTRIBUTE = /\blat\s*=\s*["']([^"']+)["']/
const LON_ATTRIBUTE = /\blon\s*=\s*["']([^"']+)["']/
const KML_COORDINATES = /<coordinates>([\s\S]*?)<\/coordinates>/g

function isValidPoint([latitude, longitude]: RoutePoint) {
  return Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180
}

export function parseGpx(xml: string): RoutePoint[] {
  const byTag: Record<string, RoutePoint[]> = { trkpt: [], rtept: [], wpt: [] }
  for (const [, tag, attributes] of xml.matchAll(GPX_POINT)) {
    const latitude = Number(LAT_ATTRIBUTE.exec(attributes!)?.[1])
    const longitude = Number(LON_ATTRIBUTE.exec(attributes!)?.[1])
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      byTag[tag!]!.push([latitude, longitude])
    }
  }
  return [byTag.trkpt!, byTag.rtept!, byTag.wpt!].find((points) => points.length > 0) ?? []
}

export function parseKml(xml: string): RoutePoint[] {
  return [...xml.matchAll(KML_COORDINATES)].flatMap(([, block]) =>
    block!
      .trim()
      .split(/\s+/)
      .map((tuple) => tuple.split(',').map(Number))
      .filter(([longitude, latitude]) => Number.isFinite(latitude) && Number.isFinite(longitude))
      .map(([longitude, latitude]): RoutePoint => [latitude!, longitude!]),
  )
}

export function parseRouteFile(fileName: string, bytes: Uint8Array): RoutePoint[] {
  const extension = fileName.toLowerCase().split('.').pop()

  if (extension === 'kmz') {
    const files = unzipSync(bytes)
    const kml = Object.keys(files).find((name) => name.toLowerCase().endsWith('.kml'))
    return kml ? parseKml(strFromU8(files[kml]!)).filter(isValidPoint) : []
  }

  const text = strFromU8(bytes)
  const points = extension === 'kml' || text.includes('<kml') ? parseKml(text) : parseGpx(text)
  return points.filter(isValidPoint)
}

export function routeDistanceKm(points: RoutePoint[]) {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180
  let meters = 0
  for (let index = 1; index < points.length; index++) {
    const [lat1, lon1] = points[index - 1]!
    const [lat2, lon2] = points[index]!
    const a =
      Math.sin(toRadians(lat2 - lat1) / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(toRadians(lon2 - lon1) / 2) ** 2
    meters += 2 * 6_371_000 * Math.asin(Math.sqrt(a))
  }
  return meters / 1000
}
