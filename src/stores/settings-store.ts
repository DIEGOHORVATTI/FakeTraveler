import { useSyncExternalStore } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { Coordinates } from '@/modules/mock-location'

import { systemLanguage } from '@/src/i18n'

export type ThemePreference = 'system' | 'light' | 'dark'

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
    language: string
    theme: ThemePreference
    onboarded: boolean
    pickRevision: number
    pickPosition: (position: Coordinates) => void
    typePosition: (position: Partial<Coordinates>) => void
    setZoom: (zoom: number) => void
    update: (
      patch: Partial<
        MockSettings & Pick<SettingsState, 'mapProvider' | 'language' | 'theme' | 'onboarded'>
      >,
    ) => void
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
      mapProvider: 'auto',
      language: systemLanguage,
      theme: 'system',
      onboarded: false,
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
