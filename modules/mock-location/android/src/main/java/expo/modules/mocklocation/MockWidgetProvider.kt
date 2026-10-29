package expo.modules.mocklocation

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews

class MockWidgetProvider : AppWidgetProvider() {
  override fun onUpdate(context: Context, manager: AppWidgetManager, ids: IntArray) {
    ids.forEach { manager.updateAppWidget(it, views(context)) }
  }

  override fun onReceive(context: Context, intent: Intent) {
    super.onReceive(context, intent)
    if (intent.action != ACTION_TOGGLE) return

    when {
      MockEngine.running -> MockLocationService.stop(context)
      MockPrefs.plan(context) != null -> runCatching { MockLocationService.start(context) }
      else -> openApp(context)
    }
  }

  private fun openApp(context: Context) {
    context.packageManager.getLaunchIntentForPackage(context.packageName)?.let {
      runCatching { context.startActivity(it.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) }
    }
  }

  companion object {
    private const val ACTION_TOGGLE = "expo.modules.mocklocation.TOGGLE"

    fun refresh(context: Context) {
      val manager = AppWidgetManager.getInstance(context)
      val ids = manager.getAppWidgetIds(ComponentName(context, MockWidgetProvider::class.java))
      ids.forEach { manager.updateAppWidget(it, views(context)) }
    }

    private fun views(context: Context): RemoteViews {
      val running = MockEngine.running
      val toggle = PendingIntent.getBroadcast(
        context,
        0,
        Intent(context, MockWidgetProvider::class.java).setAction(ACTION_TOGGLE),
        PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
      )
      val status = if (running) {
        MockPrefs.label(context, "widgetOn", "Simulating")
      } else {
        MockPrefs.label(context, "widgetOff", "Stopped")
      }

      return RemoteViews(context.packageName, R.layout.mock_widget).apply {
        setTextViewText(R.id.mock_widget_status, status)
        setInt(R.id.mock_widget_root, "setBackgroundResource", if (running) R.drawable.mock_widget_on else R.drawable.mock_widget_off)
        setOnClickPendingIntent(R.id.mock_widget_root, toggle)
      }
    }
  }
}
