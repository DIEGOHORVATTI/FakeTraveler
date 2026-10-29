import { MapPin, Trash2 } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import { t } from '@/src/i18n'
import { formatCoordinate } from '@/src/lib/number'
import { useSettings, type Favorite } from '@/src/stores/settings-store'
import { useThemeColors } from '@/src/theme/colors'

type FavoriteRowProps = {
  favorite: Favorite
  onOpen: (favorite: Favorite) => void
}

export function FavoriteRow({ favorite, onOpen }: FavoriteRowProps) {
  const colors = useThemeColors()

  return (
    <Pressable
      className="flex-row items-center gap-3 rounded-xl border border-border bg-bg-card px-4 py-3 active:opacity-70"
      onPress={() => onOpen(favorite)}
    >
      <MapPin color={colors.accent} size={20} />
      <View className="flex-1">
        <Text className="text-base text-text-primary" numberOfLines={2}>
          {favorite.name}
        </Text>
        <Text className="text-xs text-text-secondary">
          {`${formatCoordinate(favorite.latitude)}, ${formatCoordinate(favorite.longitude)}`}
        </Text>
      </View>
      <Pressable
        hitSlop={8}
        accessibilityLabel={t('delete')}
        onPress={() => useSettings.getState().removeFavorite(favorite.id)}
      >
        <Trash2 color={colors.muted} size={20} />
      </Pressable>
    </Pressable>
  )
}
