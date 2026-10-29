import { useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'

import { useSettingsHydrated } from '@/src/stores/settings-store'

void SplashScreen.preventAutoHideAsync()

export function useSplashGate() {
  const hydrated = useSettingsHydrated()

  useEffect(() => {
    if (hydrated) void SplashScreen.hideAsync()
  }, [hydrated])
}
