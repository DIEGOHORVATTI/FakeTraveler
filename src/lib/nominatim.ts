import type { Coordinates } from '@/modules/mock-location'

type NominatimResult = { lat: string; lon: string }

export async function searchAddress(query: string): Promise<Coordinates | null> {
  const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({ q: query, format: 'json', limit: '1' })}`
  const response = await fetch(url, { headers: { 'User-Agent': 'FakeTraveler' } })
  if (!response.ok) return null

  const [first] = (await response.json()) as NominatimResult[]
  return first ? { latitude: Number(first.lat), longitude: Number(first.lon) } : null
}
