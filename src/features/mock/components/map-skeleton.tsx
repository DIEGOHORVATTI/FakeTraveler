import { View } from 'react-native'

import { Skeleton } from '@/src/components/ui/skeleton'

export function MapSkeleton() {
  return (
    <View className="absolute inset-0 bg-bg-primary" pointerEvents="none">
      <Skeleton height={9999} borderRadius={0} />
    </View>
  )
}
