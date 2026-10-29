import '../global.css'

import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { useAppPreferences } from '@/src/hooks/use-app-preferences'
import { t } from '@/src/i18n'
import { useThemeColors } from '@/src/theme/colors'

export default function RootLayout() {
  const colors = useThemeColors()
  const language = useAppPreferences()

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        key={language}
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ title: t('settings') }} />
        <Stack.Screen name="favorites" options={{ title: t('favorites') }} />
      </Stack>
    </>
  )
}
