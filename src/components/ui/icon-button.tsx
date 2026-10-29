import type { LucideIcon } from 'lucide-react-native'

import { Pressable } from 'react-native'

import { useThemeColors } from '@/src/theme/colors'

type IconButtonProps = {
  icon: LucideIcon
  label: string
  onPress: () => void
  active?: boolean
}

export function IconButton({ icon: Icon, label, onPress, active }: IconButtonProps) {
  const colors = useThemeColors()

  return (
    <Pressable
      className="h-14 w-14 items-center justify-center rounded-xl border border-border bg-bg-card active:opacity-70"
      accessibilityLabel={label}
      onPress={onPress}
    >
      <Icon color={active ? colors.accent : colors.text} size={22} />
    </Pressable>
  )
}
