import type { ReactNode } from 'react'

import { Monitor, Moon, Sun } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import { Select } from '@/src/components/ui/select'
import { t } from '@/src/i18n'
import { LANGUAGES } from '@/src/i18n/languages'
import { useSettings, type ThemePreference } from '@/src/stores/settings-store'
import { useThemeColors } from '@/src/theme/colors'

type LabeledProps = {
  label: string
  children: ReactNode
}

export function Labeled({ label, children }: LabeledProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm text-text-secondary">{label}</Text>
      {children}
    </View>
  )
}

const LANGUAGE_OPTIONS = LANGUAGES.map(({ code, label }) => ({ value: code, label }))

export function LanguageField() {
  const language = useSettings((state) => state.language)

  return (
    <Labeled label={t('language')}>
      <Select
        value={language}
        options={LANGUAGE_OPTIONS}
        onChange={(value) => useSettings.getState().update({ language: value })}
      />
    </Labeled>
  )
}

const THEMES = [
  { value: 'system', labelKey: 'themeSystem', Icon: Monitor },
  { value: 'light', labelKey: 'themeLight', Icon: Sun },
  { value: 'dark', labelKey: 'themeDark', Icon: Moon },
] as const

function selectTheme(theme: ThemePreference) {
  useSettings.getState().update({ theme })
}

export function ThemeField() {
  const theme = useSettings((state) => state.theme)
  const colors = useThemeColors()

  return (
    <Labeled label={t('theme')}>
      <View className="flex-row gap-3">
        {THEMES.map(({ value, labelKey, Icon }) => {
          const selected = theme === value
          return (
            <Pressable
              key={value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => selectTheme(value)}
              className={`flex-1 items-center gap-2 rounded-2xl border-2 px-2 py-4 ${
                selected ? 'border-primary bg-primary/10' : 'border-border bg-bg-card'
              }`}
            >
              <Icon size={22} color={colors.accent} />
              <Text className="text-sm font-semibold text-text-primary">{t(labelKey)}</Text>
            </Pressable>
          )
        })}
      </View>
    </Labeled>
  )
}
