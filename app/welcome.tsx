import { useRouter } from 'expo-router'
import { Image, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button } from '@/src/components/ui/button'
import { ScreenFooter } from '@/src/components/ui/screen-footer'
import { LanguageField, ThemeField } from '@/src/features/preferences/components/preference-fields'
import { t } from '@/src/i18n'
import { useSettings } from '@/src/stores/settings-store'

export default function WelcomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  function finish() {
    useSettings.getState().update({ onboarded: true })
    router.replace('/')
  }

  return (
    <View className="flex-1 bg-bg-primary" style={{ paddingTop: insets.top }}>
      <View className="flex-1 justify-center gap-8 px-6">
        <View className="items-center gap-3">
          <Image source={require('@/assets/images/icon.png')} className="h-24 w-24 rounded-3xl" />
          <Text className="text-center text-2xl font-bold text-text-primary">
            {t('welcomeTitle')}
          </Text>
          <Text className="text-center text-base text-text-secondary">{t('welcomeSubtitle')}</Text>
        </View>
        <LanguageField />
        <ThemeField />
      </View>
      <ScreenFooter>
        <Button title={t('continue')} onPress={finish} />
      </ScreenFooter>
    </View>
  )
}
