import { MockLocation } from '@/modules/mock-location'
import { t } from '@/src/i18n'
import { formatCoordinate } from '@/src/lib/number'
import { useSettings } from '@/src/stores/settings-store'

export function useOpenInMaps() {
  return function openInMaps() {
    const { latitude, longitude } = useSettings.getState()
    const label = `${formatCoordinate(latitude)}, ${formatCoordinate(longitude)}`
    MockLocation.openInMaps({ latitude, longitude }, label, t('openInMaps'))
  }
}
