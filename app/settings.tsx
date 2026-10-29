import { ScrollView, Text } from 'react-native'

import { SettingsForm } from '@/src/features/settings/components/settings-form'
import { t } from '@/src/i18n'

export default function SettingsScreen() {
  return (
    <ScrollView className="flex-1 bg-bg-primary" contentContainerClassName="gap-6 p-4 pb-12">
      <SettingsForm />
      <Text className="text-center text-xs text-text-muted">{t('license')}</Text>
    </ScrollView>
  )
}
