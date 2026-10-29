import type { Coordinates } from '@/modules/mock-location'

export type Place = Coordinates & {
  id: string
  title: string
  subtitle: string
}

type PhotonFeature = {
  geometry: { coordinates: [number, number] }
  properties: {
    osm_type?: string
    osm_id?: number
    name?: string
    street?: string
    housenumber?: string
    city?: string
    state?: string
    country?: string
  }
}

const PHOTON_LANGUAGES = new Set(['en', 'de', 'fr'])

export function toPlace({ geometry, properties }: PhotonFeature): Place {
  const [longitude, latitude] = geometry.coordinates
  const street = [properties.street, properties.housenumber].filter(Boolean).join(', ')
  const title = properties.name || street || properties.city || ''
  const subtitle = [
    properties.name ? street : '',
    properties.city,
    properties.state,
    properties.country,
  ]
    .filter((part, index, parts) => part && part !== title && parts.indexOf(part) === index)
    .join(', ')

  return {
    id: `${properties.osm_type}${properties.osm_id}${latitude}${longitude}`,
    latitude,
    longitude,
    title: title || subtitle,
    subtitle: title ? subtitle : '',
  }
}

export async function searchPlaces(query: string, language: string, signal: AbortSignal) {
  const params = new URLSearchParams({ q: query, limit: '6' })
  const lang = language.split('-')[0]!
  if (PHOTON_LANGUAGES.has(lang)) params.set('lang', lang)

  const response = await fetch(`https://photon.komoot.io/api/?${params}`, { signal })
  if (!response.ok) return []

  const { features } = (await response.json()) as { features: PhotonFeature[] }
  return uniquePlaces(features.map(toPlace))
}

export function uniquePlaces(places: Place[]) {
  const seen = new Set<string>()
  return places.filter((place) => {
    const key = `${place.title}|${place.subtitle}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export async function reverseGeocode({ latitude, longitude }: Coordinates) {
  const params = new URLSearchParams({ lat: String(latitude), lon: String(longitude) })
  const response = await fetch(`https://photon.komoot.io/reverse?${params}`)
  if (!response.ok) return null

  const { features } = (await response.json()) as { features: PhotonFeature[] }
  return features[0] ? toPlace(features[0]) : null
}
