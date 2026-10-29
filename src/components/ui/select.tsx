import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react-native'
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import { useThemeColors } from '@/src/theme/colors'

export type SelectOption = {
  value: string
  label: string
}

type SelectProps = {
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
}

export function Select({ value, options, onChange }: SelectProps) {
  const [open, setOpen] = useState(false)
  const colors = useThemeColors()
  const selected = options.find((option) => option.value === value)

  function choose(next: string) {
    setOpen(false)
    onChange(next)
  }

  return (
    <>
      <Pressable
        className="h-12 flex-row items-center justify-between rounded-xl bg-bg-input px-4 active:opacity-70"
        onPress={() => setOpen(true)}
      >
        <Text className="text-base text-text-primary">{selected?.label ?? value}</Text>
        <ChevronDown color={colors.muted} size={20} />
      </Pressable>
      <Modal
        visible={open}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View className="max-h-[70%] overflow-hidden rounded-2xl bg-bg-card">
            <ScrollView>
              {options.map((option) => (
                <Pressable
                  key={option.value}
                  className="flex-row items-center justify-between border-b border-border px-5 py-4 active:opacity-70"
                  onPress={() => choose(option.value)}
                >
                  <Text className="text-base text-text-primary">{option.label}</Text>
                  {option.value === value ? <Check color={colors.accent} size={20} /> : null}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})
