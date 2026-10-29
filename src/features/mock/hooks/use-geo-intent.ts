import { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'

import { parseCoordinate, parseNumber } from '@/src/lib/number'
import { useSettings } from '@/src/stores/settings-store'

type GeoParams = {
  lat?: string
  lng?: string
  zoom?: string
}

export function useGeoIntent() {
  const { lat = '', lng = '', zoom = '' } = useLocalSearchParams<GeoParams>()

  useEffect(() => {
    const latitude = parseCoordinate(lat, 90)
    const longitude = parseCoordinate(lng, 180)
    if (latitude === null || longitude === null) return

    const { pickPosition, setZoom } = useSettings.getState()
    const zoomLevel = parseNumber(zoom)
    if (zoomLevel !== null) setZoom(zoomLevel)
    pickPosition({ latitude, longitude })
  }, [lat, lng, zoom])
}
