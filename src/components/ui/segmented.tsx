import { Pressable, Text, View } from 'react-native'

import type { SelectOption } from './select'

type SegmentedProps = {
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
}

export function Segmented({ value, options, onChange }: SegmentedProps) {
  return (
    <View className="h-12 flex-row gap-1 rounded-xl bg-bg-input p-1">
      {options.map((option) => {
        const active = option.value === value
        return (
          <Pressable
            key={option.value}
            className={`flex-1 items-center justify-center rounded-lg ${active ? 'bg-button' : ''}`}
            onPress={() => onChange(option.value)}
          >
            <Text
              className={`text-sm font-semibold ${active ? 'text-on-accent' : 'text-text-secondary'}`}
            >
              {option.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
