package expo.modules.mocklocation

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat
import androidx.core.content.ContextCompat

class MockLocationService : Service() {
  override fun onBind(intent: Intent?): IBinder? = null

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    if (intent?.action == ACTION_STOP) {
      stopSelf()
      return START_NOT_STICKY
    }

    val json = intent?.getStringExtra(EXTRA_PLAN) ?: MockPrefs.plan(this)
    val started = json != null && runCatching {
      startInForeground()
      MockEngine.start(this, MockPlan.parse(json)) { stopSelf() }
      MockPrefs.savePlan(this, json)
      MockPrefs.setActive(this, true)
    }.isSuccess

    if (!started) stopSelf()
    MockWidgetProvider.refresh(this)
    return START_REDELIVER_INTENT
  }

  override fun onDestroy() {
    MockEngine.stop(this)
    MockPrefs.setActive(this, false)
    MockWidgetProvider.refresh(this)
    super.onDestroy()
  }

  private fun startInForeground() {
    val title = label("notificationTitle", "Simulating location")
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      getSystemService(NotificationManager::class.java).createNotificationChannel(
        NotificationChannel(CHANNEL_ID, title, NotificationManager.IMPORTANCE_LOW),
      )
    }

    val stopIntent = PendingIntent.getService(
      this,
      1,
      Intent(this, MockLocationService::class.java).setAction(ACTION_STOP),
      PendingIntent.FLAG_IMMUTABLE,
    )
    val openIntent = packageManager.getLaunchIntentForPackage(packageName)?.let {
      PendingIntent.getActivity(this, 0, it, PendingIntent.FLAG_IMMUTABLE)
    }

    val notification = NotificationCompat.Builder(this, CHANNEL_ID)
      .setSmallIcon(R.drawable.ic_mock_pin)
      .setContentTitle(title)
      .setOngoing(true)
      .setContentIntent(openIntent)
      .addAction(0, label("notificationStop", "Stop"), stopIntent)
      .build()

    ServiceCompat.startForeground(
      this,
      NOTIFICATION_ID,
      notification,
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION else 0,
    )
  }

  private fun label(key: String, fallback: String) = MockPrefs.label(this, key, fallback)

  companion object {
    const val EXTRA_PLAN = "plan"
    const val ACTION_STOP = "expo.modules.mocklocation.STOP"
    private const val CHANNEL_ID = "mock_location"
    private const val NOTIFICATION_ID = 4242

    fun start(context: Context, plan: String? = null) {
      val intent = Intent(context, MockLocationService::class.java)
      plan?.let { intent.putExtra(EXTRA_PLAN, it) }
      ContextCompat.startForegroundService(context, intent)
    }

    fun stop(context: Context) {
      context.stopService(Intent(context, MockLocationService::class.java))
    }
  }
}
