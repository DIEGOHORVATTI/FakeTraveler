import type { ReactNode } from 'react'

import { Text, View } from 'react-native'

import { Segmented } from '@/src/components/ui/segmented'
import { Select } from '@/src/components/ui/select'
import { t } from '@/src/i18n'
import { LANGUAGES } from '@/src/i18n/languages'
import { useSettings, type ThemePreference } from '@/src/stores/settings-store'

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

export function ThemeField() {
  const theme = useSettings((state) => state.theme)

  return (
    <Labeled label={t('theme')}>
      <Segmented
        value={theme}
        options={[
          { value: 'system', label: t('themeSystem') },
          { value: 'light', label: t('themeLight') },
          { value: 'dark', label: t('themeDark') },
        ]}
        onChange={(value) => useSettings.getState().update({ theme: value as ThemePreference })}
      />
    </Labeled>
  )
}
