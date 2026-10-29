import { useState } from 'react'
import { ToastAndroid } from 'react-native'

import type { Coordinates } from '@/modules/mock-location'
import { Input } from '@/src/components/ui/input'
import { t } from '@/src/i18n'
import { searchAddress } from '@/src/lib/nominatim'

type AddressSearchProps = {
  onFound: (position: Coordinates) => void
}

export function AddressSearch({ onFound }: AddressSearchProps) {
  const [query, setQuery] = useState('')

  async function search() {
    if (!query.trim()) return
    const position = await searchAddress(query).catch(() => null)
    if (position) return onFound(position)
    ToastAndroid.show(t('searchNotFound'), ToastAndroid.SHORT)
  }

  return (
    <Input
      className="flex-1"
      value={query}
      onChangeText={setQuery}
      onSubmitEditing={search}
      placeholder={t('searchPlaceholder')}
      returnKeyType="search"
    />
  )
}
