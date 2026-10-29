import { useEffect, useState } from 'react'

import { searchPlaces, type Place } from '@/src/lib/photon'
import { useSettings } from '@/src/stores/settings-store'

const DEBOUNCE_MS = 350
const MIN_QUERY_LENGTH = 3

export function usePlaceSearch(query: string) {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(false)
  const trimmed = query.trim()
  const searchable = trimmed.length >= MIN_QUERY_LENGTH

  useEffect(() => {
    if (!searchable) return

    const controller = new AbortController()
    const timer = setTimeout(() => {
      setLoading(true)
      searchPlaces(trimmed, useSettings.getState().language, controller.signal)
        .then(setPlaces)
        .catch(() => null)
        .finally(() => setLoading(false))
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [trimmed, searchable])

  return { places: searchable ? places : [], loading: searchable && loading }
}
