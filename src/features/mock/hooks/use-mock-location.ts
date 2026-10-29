import { useEffect, useState } from 'react'

import { MockLocation, type Coordinates } from '@/modules/mock-location'
import { t } from '@/src/i18n'
import { ensureMockPermissions } from '@/src/lib/permissions'
import { toast } from '@/src/lib/toast'
import { useSettings } from '@/src/stores/settings-store'

import { toStartOptions } from '../utils/start-options'

export function useMockLocation() {
  const [running, setRunning] = useState(() => MockLocation.isRunning())
  const [mockedPosition, setMockedPosition] = useState<Coordinates | null>(null)

  useEffect(() => {
    const location = MockLocation.addListener('onLocation', setMockedPosition)
    const finished = MockLocation.addListener('onStop', () => {
      setRunning(false)
      setMockedPosition(null)
      toast(t('mockStopped'))
    })

    return () => {
      location.remove()
      finished.remove()
    }
  }, [])

  async function start() {
    if (!(await ensureMockPermissions())) return toast(t('permissionDenied'))

    const settings = useSettings.getState()
    try {
      await MockLocation.start(toStartOptions(settings, settings, settings.route))
      setRunning(true)
      toast(t('mockApplied'))
    } catch {
      toast(t('mockNotApplied'))
    }
  }

  function stop() {
    MockLocation.stop()
    setRunning(false)
    setMockedPosition(null)
  }

  return { running, mockedPosition, start, stop }
}
