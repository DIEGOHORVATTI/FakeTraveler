import type { Coordinates, StartOptions } from '@/modules/mock-location'
import type { MockSettings, Route } from '@/src/stores/settings-store'

const MICRODEGREES = 1_000_000

const KMH_TO_MS = 1 / 3.6

export function toStartOptions(
  position: Coordinates,
  settings: MockSettings,
  route: Route | null = null,
): StartOptions {
  const start = route?.points[0]

  return {
    latitude: start?.[0] ?? position.latitude,
    longitude: start?.[1] ?? position.longitude,
    latitudeStep: settings.latitudeStep / MICRODEGREES,
    longitudeStep: settings.longitudeStep / MICRODEGREES,
    intervalMs: Math.max(1, settings.mockFrequency) * 1000,
    count: Math.max(0, settings.mockCount),
    moveAsSpeed: settings.mockSpeed,
    route: route?.points ?? [],
    routeSpeed: Math.max(0, settings.routeSpeedKmh) * KMH_TO_MS,
    loop: settings.routeLoop,
  }
}
