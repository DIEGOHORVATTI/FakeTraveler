import { t } from '@/src/i18n'
import { formatCoordinate } from '@/src/lib/number'
import { reverseGeocode } from '@/src/lib/photon'
import { toast } from '@/src/lib/toast'
import { useSettings } from '@/src/stores/settings-store'

export function useSaveFavorite() {
  return async function saveFavorite() {
    const { latitude, longitude, addFavorite } = useSettings.getState()
    const fallback = `${formatCoordinate(latitude)}, ${formatCoordinate(longitude)}`
    const place = await reverseGeocode({ latitude, longitude }).catch(() => null)

    addFavorite({
      id: `${Date.now()}`,
      name: place ? [place.title, place.subtitle].filter(Boolean).join(' · ') : fallback,
      latitude,
      longitude,
    })
    toast(t('favoriteSaved'))
  }
}
