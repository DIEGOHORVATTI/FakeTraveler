import { TextInput, type TextInputProps } from 'react-native'

import { useThemeColors } from '@/src/theme/colors'

type InputProps = TextInputProps & {
  className?: string
}

export function Input({ className, ...props }: InputProps) {
  const colors = useThemeColors()

  return (
    <TextInput
      className={`h-12 rounded-xl bg-bg-input px-4 text-base text-text-primary ${className ?? ''}`}
      placeholderTextColor={colors.muted}
      {...props}
    />
  )
}
