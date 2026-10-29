package expo.modules.mocklocation

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class BootReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action != Intent.ACTION_BOOT_COMPLETED) return
    val shouldResume = MockPrefs.resumeOnBoot(context) && MockPrefs.isActive(context) && MockPrefs.plan(context) != null
    if (shouldResume) runCatching { MockLocationService.start(context) }
  }
}
