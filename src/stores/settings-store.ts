import { useSyncExternalStore } from 'react'
import { getLocales } from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { Coordinates } from '@/modules/mock-location'

const MAP_PROVIDER_BY_LANGUAGE: Record<string, string> = {
  de: 'OpenStreetMap.DE',
  fr: 'OpenStreetMap.France',
}

export const DEFAULT_MAP_PROVIDER =
  MAP_PROVIDER_BY_LANGUAGE[getLocales()[0]?.languageCode ?? ''] ?? 'OpenStreetMap'

export type MockSettings = {
  mockCount: number
  mockFrequency: number
  latitudeStep: number
  longitudeStep: number
  mockSpeed: boolean
}

type SettingsState = MockSettings &
  Coordinates & {
    zoom: number
    mapProvider: string
    pickRevision: number
    pickPosition: (position: Coordinates) => void
    typePosition: (position: Partial<Coordinates>) => void
    setZoom: (zoom: number) => void
    update: (patch: Partial<MockSettings & { mapProvider: string }>) => void
  }

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      latitude: 12,
      longitude: 15,
      zoom: 12,
      mockCount: 0,
      mockFrequency: 10,
      latitudeStep: 0,
      longitudeStep: 0,
      mockSpeed: true,
      mapProvider: DEFAULT_MAP_PROVIDER,
      pickRevision: 0,
      pickPosition: (position) =>
        set((state) => ({ ...position, pickRevision: state.pickRevision + 1 })),
      typePosition: (position) => set(position),
      setZoom: (zoom) => set({ zoom }),
      update: (patch) => set(patch),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ pickRevision: _, ...state }) => state,
    },
  ),
)

export function useSettingsHydrated() {
  return useSyncExternalStore(
    useSettings.persist.onFinishHydration,
    useSettings.persist.hasHydrated,
  )
}
