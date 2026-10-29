import { useState } from 'react'
import { MapPin } from 'lucide-react-native'
import { Keyboard, Pressable, Text, View } from 'react-native'

import type { Coordinates } from '@/modules/mock-location'
import { SearchInput } from '@/src/components/ui/search-input'
import { t } from '@/src/i18n'
import type { Place } from '@/src/lib/photon'
import { useThemeColors } from '@/src/theme/colors'

import { usePlaceSearch } from '../hooks/use-place-search'
import { PlacesSkeleton } from './places-skeleton'

type AddressSearchProps = {
  onFound: (position: Coordinates) => void
}

export function AddressSearch({ onFound }: AddressSearchProps) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const { places, loading } = usePlaceSearch(query)
  const colors = useThemeColors()
  const showResults = focused && places.length > 0

  function choose(place: Place) {
    setQuery(place.title)
    setFocused(false)
    Keyboard.dismiss()
    onFound(place)
  }

  return (
    <View className="flex-1 gap-2">
      <SearchInput
        value={query}
        onChangeText={setQuery}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onClear={() => setQuery('')}
        loading={loading}
        placeholder={t('searchPlaceholder')}
        returnKeyType="search"
        onSubmitEditing={() => places[0] && choose(places[0])}
        containerClassName="h-14 bg-bg-card"
      />
      {focused && loading && places.length === 0 ? <PlacesSkeleton /> : null}
      {showResults ? (
        <View className="overflow-hidden rounded-xl border border-border bg-bg-card">
          {places.map((place) => (
            <Pressable
              key={place.id}
              className="flex-row items-center gap-3 border-b border-border px-4 py-3 active:opacity-70"
              onPress={() => choose(place)}
            >
              <MapPin size={18} color={colors.accent} />
              <View className="flex-1">
                <Text className="text-base text-text-primary" numberOfLines={1}>
                  {place.title}
                </Text>
                {place.subtitle ? (
                  <Text className="text-xs text-text-secondary" numberOfLines={1}>
                    {place.subtitle}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  )
}
