import { useEffect } from 'react'
import { Appearance } from 'react-native'

import { setLanguage } from '@/src/i18n'
import { useSettings } from '@/src/stores/settings-store'

export function useAppPreferences() {
  const language = useSettings((state) => state.language)
  const theme = useSettings((state) => state.theme)
  setLanguage(language)

  useEffect(() => {
    Appearance.setColorScheme(theme === 'system' ? 'unspecified' : theme)
  }, [theme])

  return language
}
