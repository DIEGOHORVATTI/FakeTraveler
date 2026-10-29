import { useRouter } from 'expo-router'
import { FlatList, Text, View } from 'react-native'

import { FavoriteRow } from '@/src/features/favorites/components/favorite-row'
import { t } from '@/src/i18n'
import { useSettings, type Favorite } from '@/src/stores/settings-store'

export default function FavoritesScreen() {
  const router = useRouter()
  const favorites = useSettings((state) => state.favorites)

  function open(favorite: Favorite) {
    useSettings.getState().pickPosition(favorite)
    router.back()
  }

  return (
    <FlatList
      className="flex-1 bg-bg-primary"
      contentContainerClassName="gap-2 p-4 pb-12"
      data={favorites}
      keyExtractor={(favorite) => favorite.id}
      renderItem={({ item }) => <FavoriteRow favorite={item} onOpen={open} />}
      ListEmptyComponent={
        <View className="items-center p-8">
          <Text className="text-center text-sm text-text-secondary">{t('noFavorites')}</Text>
        </View>
      }
    />
  )
}
