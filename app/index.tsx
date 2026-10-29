import { Redirect, useRouter } from 'expo-router'
import { Bookmark, Navigation, Route as RouteIcon, Settings, Star } from 'lucide-react-native'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'

import type { Coordinates } from '@/modules/mock-location'
import { Button } from '@/src/components/ui/button'
import { ButtonGroup } from '@/src/components/ui/button-group'
import { IconButton } from '@/src/components/ui/icon-button'
import { ScreenFooter } from '@/src/components/ui/screen-footer'
import { AddressSearch } from '@/src/features/mock/components/address-search'
import { CoordinateInputs } from '@/src/features/mock/components/coordinate-inputs'
import { MapView } from '@/src/features/mock/components/map-view'
import { RouteChip } from '@/src/features/mock/components/route-chip'
import { useGeoIntent } from '@/src/features/mock/hooks/use-geo-intent'
import { useMockLocation } from '@/src/features/mock/hooks/use-mock-location'
import { useOpenInMaps } from '@/src/features/mock/hooks/use-open-in-maps'
import { useRouteImport } from '@/src/features/mock/hooks/use-route-import'
import { useSaveFavorite } from '@/src/features/mock/hooks/use-save-favorite'
import { useSharedPlace } from '@/src/features/mock/hooks/use-shared-place'
import { t } from '@/src/i18n'
import { useSettings, useSettingsHydrated } from '@/src/stores/settings-store'

function MapScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const position = useSettings(
    useShallow((state) => ({ latitude: state.latitude, longitude: state.longitude })),
  )
  const pickRevision = useSettings((state) => state.pickRevision)
  const hasRoute = useSettings((state) => state.route !== null)
  const mock = useMockLocation()
  const importRoute = useRouteImport()
  const saveFavorite = useSaveFavorite()
  const openInMaps = useOpenInMaps()
  useGeoIntent()
  useSharedPlace()

  function pick(next: Coordinates) {
    useSettings.getState().pickPosition(next)
    if (mock.running && !hasRoute) void mock.start()
  }

  function focus(next: Coordinates) {
    useSettings.getState().focusPosition(next)
    if (mock.running && !hasRoute) void mock.start()
  }

  return (
    <View className="flex-1 bg-bg-primary">
      <View className="flex-1">
        <MapView
          marker={mock.mockedPosition ?? position}
          onPick={pick}
          onZoom={useSettings.getState().setZoom}
        />
        <View
          pointerEvents="box-none"
          className="absolute left-0 right-0 top-0 flex-row items-start gap-2 px-4"
          style={{ paddingTop: insets.top + 12 }}
        >
          <AddressSearch onFound={focus} />
          <View className="gap-2">
            <IconButton
              icon={Settings}
              label={t('settings')}
              onPress={() => router.push('/settings')}
            />
            <ButtonGroup
              items={[
                { icon: Navigation, label: t('openInMaps'), onPress: openInMaps },
                { icon: Star, label: t('saveFavorite'), onPress: saveFavorite, hidden: hasRoute },
                {
                  icon: Bookmark,
                  label: t('favorites'),
                  onPress: () => router.push('/favorites'),
                },
                {
                  icon: RouteIcon,
                  label: t('importRoute'),
                  onPress: importRoute,
                  active: hasRoute,
                },
              ]}
            />
          </View>
        </View>
      </View>
      <ScreenFooter>
        <RouteChip />
        {hasRoute ? null : <CoordinateInputs key={pickRevision} />}
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
