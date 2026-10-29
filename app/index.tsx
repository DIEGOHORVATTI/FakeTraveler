import { Link, Redirect } from 'expo-router'
import { Settings } from 'lucide-react-native'
import { Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

import type { Coordinates } from '@/modules/mock-location'
import { Button } from '@/src/components/ui/button'
import { ScreenFooter } from '@/src/components/ui/screen-footer'
import { AddressSearch } from '@/src/features/mock/components/address-search'
import { CoordinateInputs } from '@/src/features/mock/components/coordinate-inputs'
import { MapView } from '@/src/features/mock/components/map-view'
import { useGeoIntent } from '@/src/features/mock/hooks/use-geo-intent'
import { useMockLocation } from '@/src/features/mock/hooks/use-mock-location'
import { t } from '@/src/i18n'
import { useSettings, useSettingsHydrated } from '@/src/stores/settings-store'
import { useThemeColors } from '@/src/theme/colors'

function MapScreen() {
  const insets = useSafeAreaInsets()
  const colors = useThemeColors()
  const position = useSettings(
    useShallow((state) => ({ latitude: state.latitude, longitude: state.longitude })),
  )
  const pickRevision = useSettings((state) => state.pickRevision)
  const mock = useMockLocation()
  useGeoIntent()

  function pick(next: Coordinates) {
    useSettings.getState().pickPosition(next)
    if (mock.running) void mock.start()
  }

  return (
    <View className="flex-1 bg-bg-primary" style={{ paddingTop: insets.top }}>
      <View className="z-10 flex-row items-start gap-2 px-4 py-3">
        <AddressSearch onFound={pick} />
        <Link href="/settings" asChild>
          <Pressable
            className="h-12 w-12 items-center justify-center rounded-xl bg-bg-input"
            accessibilityLabel={t('settings')}
          >
            <Settings color={colors.text} size={22} />
          </Pressable>
        </Link>
      </View>
      <MapView
        marker={mock.mockedPosition ?? position}
        onPick={pick}
        onZoom={useSettings.getState().setZoom}
      />
      <ScreenFooter>
        <CoordinateInputs key={pickRevision} />
        {mock.running ? (
          <Button variant="danger" title={t('stop')} onPress={mock.stop} />
        ) : (
          <Button title={t('apply')} onPress={mock.start} />
        )}
      </ScreenFooter>
    </View>
  )
}

export default function MapRoute() {
  const hydrated = useSettingsHydrated()
  const onboarded = useSettings((state) => state.onboarded)

  if (!hydrated) return null
  return onboarded ? <MapScreen /> : <Redirect href="/welcome" />
}
