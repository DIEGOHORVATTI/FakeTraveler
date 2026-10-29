import { TextInput, type TextInputProps } from 'react-native'

import { useThemeColors } from '@/src/theme/colors'

type InputProps = TextInputProps & {
  className?: string
}

export function Input({ className, ...props }: InputProps) {
  const colors = useThemeColors()

  return (
    <TextInput
      className={`h-14 rounded-xl border border-border bg-bg-input pl-6 pr-5 text-base text-text-primary ${className ?? ''}`}
      placeholderTextColor={colors.muted}
      underlineColorAndroid="transparent"
      {...props}
    />
  )
}
