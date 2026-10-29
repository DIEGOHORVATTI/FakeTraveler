import type { Coordinates, StartOptions } from '@/modules/mock-location'
import type { MockSettings } from '@/src/stores/settings-store'

const MICRODEGREES = 1_000_000

export function toStartOptions(position: Coordinates, settings: MockSettings): StartOptions {
  return {
    ...position,
    latitudeStep: settings.latitudeStep / MICRODEGREES,
    longitudeStep: settings.longitudeStep / MICRODEGREES,
    intervalMs: Math.max(1, settings.mockFrequency) * 1000,
    count: Math.max(0, settings.mockCount),
    moveAsSpeed: settings.mockSpeed,
  }
}
