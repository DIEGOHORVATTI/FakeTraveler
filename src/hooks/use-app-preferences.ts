import { useEffect } from 'react'
import { Appearance } from 'react-native'

import { MockLocation } from '@/modules/mock-location'
import { setLanguage, t } from '@/src/i18n'
import { useSettings } from '@/src/stores/settings-store'

export function useAppPreferences() {
  const language = useSettings((state) => state.language)
  const theme = useSettings((state) => state.theme)
  setLanguage(language)

  useEffect(() => {
    Appearance.setColorScheme(theme === 'system' ? 'unspecified' : theme)
  }, [theme])

  useEffect(() => {
    MockLocation.setLabels({
      notificationTitle: t('notificationTitle'),
      notificationStop: t('stop'),
      widgetOn: t('widgetOn'),
      widgetOff: t('widgetOff'),
    })
  }, [language])

  return language
}
