import { useSyncExternalStore } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { Coordinates } from '@/modules/mock-location'

import { systemLanguage } from '@/src/i18n'

const FOCUS_ZOOM = 16

export type ThemePreference = 'system' | 'light' | 'dark'

export type MockSettings = {
  mockCount: number
  mockFrequency: number
  latitudeStep: number
  longitudeStep: number
  mockSpeed: boolean
  routeSpeedKmh: number
  routeLoop: boolean
}

export type Favorite = Coordinates & {
  id: string
  name: string
}

export type Route = {
  name: string
  points: [number, number][]
}

type SettingsState = MockSettings &
  Coordinates & {
    zoom: number
    mapProvider: string
    language: string
    theme: ThemePreference
    onboarded: boolean
    resumeOnBoot: boolean
    favorites: Favorite[]
    route: Route | null
    pickRevision: number
    pickPosition: (position: Coordinates) => void
    focusPosition: (position: Coordinates) => void
    typePosition: (position: Partial<Coordinates>) => void
    setZoom: (zoom: number) => void
    addFavorite: (favorite: Favorite) => void
    removeFavorite: (id: string) => void
    update: (
      patch: Partial<
        MockSettings &
          Pick<
            SettingsState,
            'mapProvider' | 'language' | 'theme' | 'onboarded' | 'resumeOnBoot' | 'route'
          >
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
      routeSpeedKmh: 30,
      routeLoop: false,
      mapProvider: 'auto',
      language: systemLanguage,
      theme: 'system',
      onboarded: false,
      resumeOnBoot: false,
      favorites: [],
      route: null,
      pickRevision: 0,
      pickPosition: (position) =>
        set((state) => ({ ...position, pickRevision: state.pickRevision + 1 })),
      focusPosition: (position) =>
        set((state) => ({
          latitude: position.latitude,
          longitude: position.longitude,
          zoom: Math.max(state.zoom, FOCUS_ZOOM),
          pickRevision: state.pickRevision + 1,
        })),
      typePosition: (position) => set(position),
      setZoom: (zoom) => set({ zoom }),
      addFavorite: (favorite) => set((state) => ({ favorites: [favorite, ...state.favorites] })),
      removeFavorite: (id) =>
        set((state) => ({ favorites: state.favorites.filter((favorite) => favorite.id !== id) })),
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
