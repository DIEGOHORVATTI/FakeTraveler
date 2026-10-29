import type { ReactNode } from 'react'

import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type ScreenFooterProps = {
  children: ReactNode
}

export function ScreenFooter({ children }: ScreenFooterProps) {
  const insets = useSafeAreaInsets()

  return (
    <View
      className="gap-3 border-t border-border bg-bg-primary px-4 pt-3"
      style={{ paddingBottom: insets.bottom + 12 }}
    >
      {children}
    </View>
  )
}
