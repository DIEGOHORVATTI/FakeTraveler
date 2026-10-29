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
  route: [number, number][]
  routeSpeed: number
  loop: boolean
}

export type MockLabels = {
  notificationTitle: string
  notificationStop: string
  widgetOn: string
  widgetOff: string
}

type MockLocationEvents = {
  onLocation: (position: Coordinates) => void
  onStop: () => void
  onSharedText: (payload: { text: string }) => void
}

declare class MockLocationNativeModule extends NativeModule<MockLocationEvents> {
  isRunning(): boolean
  start(plan: string): Promise<void>
  stop(): void
  setResumeOnBoot(enabled: boolean): void
  setLabels(labels: MockLabels): void
  consumeSharedText(): string | null
  openInMaps(latitude: number, longitude: number, label: string, title: string): void
}

const native = requireNativeModule<MockLocationNativeModule>('MockLocation')

export const MockLocation = {
  isRunning: () => native.isRunning(),
  start: (options: StartOptions) => native.start(JSON.stringify(options)),
  stop: () => native.stop(),
  setResumeOnBoot: (enabled: boolean) => native.setResumeOnBoot(enabled),
  setLabels: (labels: MockLabels) => native.setLabels(labels),
  consumeSharedText: () => native.consumeSharedText(),
  openInMaps: (position: Coordinates, label: string, title: string) =>
    native.openInMaps(position.latitude, position.longitude, label, title),
  addListener: native.addListener.bind(native) as MockLocationNativeModule['addListener'],
}
