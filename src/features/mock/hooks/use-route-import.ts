import * as DocumentPicker from 'expo-document-picker'
import { File } from 'expo-file-system'

import { t } from '@/src/i18n'
import { parseRouteFile } from '@/src/lib/route-file'
import { toast } from '@/src/lib/toast'
import { useSettings } from '@/src/stores/settings-store'

export function useRouteImport() {
  return async function importRoute() {
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true })
    const asset = result.canceled ? null : result.assets[0]
    if (!asset) return

    try {
      const points = parseRouteFile(asset.name, await new File(asset.uri).bytes())
      if (points.length < 2) return toast(t('routeInvalid'))
      useSettings.getState().update({ route: { name: asset.name.replace(/\.\w+$/, ''), points } })
    } catch {
      toast(t('routeInvalid'))
    }
  }
}
