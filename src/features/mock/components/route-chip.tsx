import { Route as RouteIcon, X } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import { t } from '@/src/i18n'
import { routeDistanceKm } from '@/src/lib/route-file'
import { useSettings } from '@/src/stores/settings-store'
import { useThemeColors } from '@/src/theme/colors'

export function RouteChip() {
  const route = useSettings((state) => state.route)
  const colors = useThemeColors()
  if (!route) return null

  return (
    <View className="flex-row items-center gap-3 rounded-xl border border-border bg-bg-card px-4 py-3">
      <RouteIcon color={colors.accent} size={20} />
      <View className="flex-1">
        <Text className="text-sm font-semibold text-text-primary" numberOfLines={1}>
          {route.name}
        </Text>
        <Text className="text-xs text-text-secondary">
          {`${routeDistanceKm(route.points).toFixed(1)} km · ${route.points.length} pts`}
        </Text>
      </View>
      <Pressable
        hitSlop={8}
        accessibilityLabel={t('removeRoute')}
        onPress={() => useSettings.getState().update({ route: null })}
      >
        <X color={colors.muted} size={20} />
      </Pressable>
    </View>
  )
}
