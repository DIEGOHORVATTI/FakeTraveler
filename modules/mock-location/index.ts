import { type NativeModule, requireNativeModule } from 'expo'

export type Coordinates = {
  latitude: number
  longitude: number
}

export type StartOptions = Coordinates & {
  latitudeStep: number
  longitudeStep: number
  intervalMs: number
  count: number
  moveAsSpeed: boolean
}

type MockLocationEvents = {
  onLocation: (position: Coordinates) => void
  onStop: () => void
}

declare class MockLocationModule extends NativeModule<MockLocationEvents> {
  isRunning(): boolean
  start(options: StartOptions): Promise<void>
  stop(): void
}

export const MockLocation = requireNativeModule<MockLocationModule>('MockLocation')
