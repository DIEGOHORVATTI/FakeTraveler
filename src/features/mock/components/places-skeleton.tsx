import { View } from 'react-native'

import { Skeleton } from '@/src/components/ui/skeleton'

const ROWS = 3

export function PlacesSkeleton() {
  return (
    <View className="overflow-hidden rounded-xl border border-border bg-bg-card">
      {Array.from({ length: ROWS }, (_, index) => (
        <View key={index} className="flex-row items-center gap-3 border-b border-border px-4 py-3">
          <Skeleton width={18} height={18} borderRadius={9} />
          <View className="flex-1 gap-2">
            <Skeleton height={14} width="70%" />
            <Skeleton height={10} width="45%" />
          </View>
        </View>
      ))}
    </View>
  )
}
