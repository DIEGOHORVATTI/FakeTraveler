import type { LucideIcon } from 'lucide-react-native'

import { Pressable, View } from 'react-native'

import { useThemeColors } from '@/src/theme/colors'

export type ButtonGroupItem = {
  icon: LucideIcon
  label: string
  onPress: () => void
  active?: boolean
  hidden?: boolean
}

type ButtonGroupProps = {
  items: ButtonGroupItem[]
}

export function ButtonGroup({ items }: ButtonGroupProps) {
  const colors = useThemeColors()

  return (
    <View className="overflow-hidden rounded-xl border border-border bg-bg-card">
      {items
        .filter((item) => !item.hidden)
        .map(({ icon: Icon, label, onPress, active }, index) => (
          <Pressable
            key={label}
            className={`h-14 w-14 items-center justify-center active:opacity-70 ${index > 0 ? 'border-t border-border' : ''}`}
            accessibilityLabel={label}
            onPress={onPress}
          >
            <Icon color={active ? colors.accent : colors.text} size={22} />
          </Pressable>
        ))}
    </View>
  )
}
