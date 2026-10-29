import { useEffect } from 'react'

import { MockLocation } from '@/modules/mock-location'
import { t } from '@/src/i18n'
import { searchPlaces } from '@/src/lib/photon'
import { resolveSharedPlace } from '@/src/lib/shared-place'
import { toast } from '@/src/lib/toast'
import { useSettings } from '@/src/stores/settings-store'

async function searchByName(name: string) {
  const [place] = await searchPlaces(
    name,
    useSettings.getState().language,
    new AbortController().signal,
  )
  return place ?? null
}

async function focusSharedText(text: string) {
  const place = await resolveSharedPlace(text, searchByName).catch(() => null)
  if (!place) return toast(t('sharedPlaceNotFound'))
  useSettings.getState().focusPosition(place)
}

export function useSharedPlace() {
  useEffect(() => {
    const initial = MockLocation.consumeSharedText()
    if (initial) void focusSharedText(initial)

    const subscription = MockLocation.addListener('onSharedText', ({ text }) => {
      void focusSharedText(text)
    })
    return () => subscription.remove()
  }, [])
}
