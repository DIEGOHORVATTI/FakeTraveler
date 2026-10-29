import { ActivityIndicator, Pressable, TextInput, View, type TextInputProps } from 'react-native'
import { Search, X } from 'lucide-react-native'

import { useThemeColors } from '@/src/theme/colors'

type SearchInputProps = TextInputProps & {
  loading?: boolean
  onClear?: () => void
  containerClassName?: string
}

export function SearchInput({
  value,
  loading,
  onClear,
  containerClassName,
  ...props
}: SearchInputProps) {
  const colors = useThemeColors()

  return (
    <View
      className={`h-12 flex-row items-center gap-3 rounded-xl border border-border bg-bg-input px-4 ${containerClassName ?? ''}`}
    >
      <Search size={18} color={colors.muted} />
      <TextInput
        className="flex-1 text-base text-text-primary"
        placeholderTextColor={colors.muted}
        underlineColorAndroid="transparent"
        value={value}
        {...props}
      />
      {loading ? <ActivityIndicator size="small" color={colors.muted} /> : null}
      {onClear && value ? (
        <Pressable onPress={onClear} hitSlop={8}>
          <X size={18} color={colors.muted} />
        </Pressable>
      ) : null}
    </View>
  )
}
