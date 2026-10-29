import type { ReactNode } from 'react'

import { Switch, Text, View } from 'react-native'

import { Input } from '@/src/components/ui/input'
import { t } from '@/src/i18n'
import { parseNumber } from '@/src/lib/number'
import { DEFAULT_MAP_PROVIDER, useSettings } from '@/src/stores/settings-store'

type FieldProps = {
  label: string
  hint?: string
  children: ReactNode
}

function Field({ label, hint, children }: FieldProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm text-text-primary">{label}</Text>
      {children}
      {hint ? <Text className="text-xs text-text-muted">{hint}</Text> : null}
    </View>
  )
}

type NumberFieldProps = {
  label: string
  initialValue: number
  integer?: boolean
  onValid: (value: number) => void
}

function NumberField({ label, initialValue, integer, onValid }: NumberFieldProps) {
  function handleChange(text: string) {
    const value = parseNumber(text) ?? 0
    onValid(integer ? Math.trunc(value) : value)
  }

  return (
    <Field label={label}>
      <Input
        defaultValue={String(initialValue)}
        onChangeText={handleChange}
        keyboardType="numbers-and-punctuation"
        selectTextOnFocus
      />
    </Field>
  )
}

export function SettingsForm() {
  const mockSpeed = useSettings((state) => state.mockSpeed)
  const { mockCount, mockFrequency, latitudeStep, longitudeStep, mapProvider, update } =
    useSettings.getState()

  return (
    <View className="gap-5">
      <NumberField
        label={t('mockCount')}
        initialValue={mockCount}
        integer
        onValid={(value) => update({ mockCount: value })}
      />
      <NumberField
        label={t('mockFrequency')}
        initialValue={mockFrequency}
        integer
        onValid={(value) => update({ mockFrequency: value || 10 })}
      />
      <Field label={t('mockStep')}>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <NumberField
              label={t('latitude')}
              initialValue={latitudeStep}
              onValid={(value) => update({ latitudeStep: value })}
            />
          </View>
          <View className="flex-1">
            <NumberField
              label={t('longitude')}
              initialValue={longitudeStep}
              onValid={(value) => update({ longitudeStep: value })}
            />
          </View>
        </View>
      </Field>
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 text-sm text-text-primary">{t('mockSpeed')}</Text>
        <Switch value={mockSpeed} onValueChange={(value) => update({ mockSpeed: value })} />
      </View>
      <Field label={t('mapProvider')} hint={t('mapProviderInfo')}>
        <Input
          defaultValue={mapProvider}
          onEndEditing={(event) =>
            update({ mapProvider: event.nativeEvent.text.trim() || DEFAULT_MAP_PROVIDER })
          }
          autoCapitalize="none"
          autoCorrect={false}
        />
      </Field>
    </View>
  )
}
