import { ScrollView, Text, View } from 'react-native'

import { SettingsForm } from '@/src/features/settings/components/settings-form'
import { t } from '@/src/i18n'

export default function SettingsScreen() {
  return (
    <ScrollView className="flex-1 bg-bg-primary" contentContainerClassName="gap-6 p-4 pb-12">
      <View className="gap-2 rounded-xl bg-bg-card p-4">
        <Text className="text-base font-semibold text-text-primary">{t('howToTitle')}</Text>
        <Text className="text-sm text-text-secondary">{t('howToInstructions')}</Text>
      </View>
      <SettingsForm />
      <View className="gap-2">
        <Text className="text-base font-semibold text-text-primary">{t('about')}</Text>
        <Text className="text-xs text-text-muted">{t('credits')}</Text>
      </View>
    </ScrollView>
  )
}
