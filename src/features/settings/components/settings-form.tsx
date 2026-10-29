import type { ReactNode } from 'react'

import { Switch, Text, View } from 'react-native'

import { MockLocation } from '@/modules/mock-location'
import { Input } from '@/src/components/ui/input'
import { Select } from '@/src/components/ui/select'
import {
  LanguageField,
  Labeled,
  ThemeField,
} from '@/src/features/preferences/components/preference-fields'
import { t } from '@/src/i18n'
import { MAP_STYLES } from '@/src/lib/map-styles'

function resolveMapStyleChoice(style: string) {
  return (MAP_STYLES as readonly string[]).includes(style) ? style : 'auto'
}
import { parseNumber } from '@/src/lib/number'
import { useSettings } from '@/src/stores/settings-store'

type SectionProps = {
  title: string
  children: ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <View className="gap-4 rounded-2xl bg-bg-card p-4">
      <Text className="text-base font-semibold text-text-primary">{title}</Text>
      {children}
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
    onValid(integer ? Math.max(0, Math.trunc(value)) : value)
  }

  return (
    <Labeled label={label}>
      <Input
        defaultValue={String(initialValue)}
        onChangeText={handleChange}
        keyboardType={integer ? 'number-pad' : 'numeric'}
        selectTextOnFocus
      />
    </Labeled>
  )
}

function mapStyleLabel(style: string) {
  if (style === 'auto') return t('mapAuto')
  if (style === 'Esri.WorldImagery') return t('mapSatellite')
  return style
}

type SwitchRowProps = {
  label: string
  value: boolean
  onChange: (value: boolean) => void
}

function SwitchRow({ label, value, onChange }: SwitchRowProps) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Text className="flex-1 text-sm text-text-secondary">{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  )
}

function setResumeOnBoot(enabled: boolean) {
  useSettings.getState().update({ resumeOnBoot: enabled })
  MockLocation.setResumeOnBoot(enabled)
}

export function SettingsForm() {
  const mockSpeed = useSettings((state) => state.mockSpeed)
  const routeLoop = useSettings((state) => state.routeLoop)
  const resumeOnBoot = useSettings((state) => state.resumeOnBoot)
  const mapProvider = useSettings((state) => state.mapProvider)
  const { mockCount, mockFrequency, latitudeStep, longitudeStep, routeSpeedKmh, update } =
    useSettings.getState()

  return (
    <View className="gap-4">
      <Section title={t('appearance')}>
        <LanguageField />
        <ThemeField />
        <Labeled label={t('mapStyle')}>
          <Select
            value={resolveMapStyleChoice(mapProvider)}
            options={MAP_STYLES.map((style) => ({ value: style, label: mapStyleLabel(style) }))}
            onChange={(value) => update({ mapProvider: value })}
          />
        </Labeled>
      </Section>
      <Section title={t('simulation')}>
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
        <Labeled label={t('mockStep')}>
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
        </Labeled>
        <SwitchRow
          label={t('mockSpeed')}
          value={mockSpeed}
          onChange={(value) => update({ mockSpeed: value })}
        />
        <SwitchRow label={t('resumeOnBoot')} value={resumeOnBoot} onChange={setResumeOnBoot} />
      </Section>
      <Section title={t('route')}>
        <NumberField
          label={t('routeSpeed')}
          initialValue={routeSpeedKmh}
          onValid={(value) => update({ routeSpeedKmh: Math.max(0, value) })}
        />
        <SwitchRow
          label={t('routeLoop')}
          value={routeLoop}
          onChange={(value) => update({ routeLoop: value })}
        />
      </Section>
    </View>
  )
}
