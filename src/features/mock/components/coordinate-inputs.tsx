import { Text, View } from 'react-native'

import { Input } from '@/src/components/ui/input'
import { t } from '@/src/i18n'
import { formatCoordinate, parseCoordinate } from '@/src/lib/number'
import { useSettings } from '@/src/stores/settings-store'

type CoordinateFieldProps = {
  label: string
  initialValue: number
  limit: number
  onValid: (value: number) => void
}

function CoordinateField({ label, initialValue, limit, onValid }: CoordinateFieldProps) {
  function handleChange(text: string) {
    const value = parseCoordinate(text, limit)
    if (value !== null) onValid(value)
  }

  return (
    <View className="flex-1 gap-1">
      <Text className="text-xs text-text-secondary">{label}</Text>
      <Input
        defaultValue={formatCoordinate(initialValue)}
        onChangeText={handleChange}
        keyboardType="numbers-and-punctuation"
        selectTextOnFocus
      />
    </View>
  )
}

export function CoordinateInputs() {
  const { latitude, longitude, typePosition } = useSettings.getState()

  return (
    <View className="flex-row gap-3">
      <CoordinateField
        label={t('latitude')}
        initialValue={latitude}
        limit={90}
        onValid={(value) => typePosition({ latitude: value })}
      />
      <CoordinateField
        label={t('longitude')}
        initialValue={longitude}
        limit={180}
        onValid={(value) => typePosition({ longitude: value })}
      />
    </View>
  )
}
