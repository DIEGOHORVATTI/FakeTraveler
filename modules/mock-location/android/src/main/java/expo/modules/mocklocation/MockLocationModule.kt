package expo.modules.mocklocation

import android.Manifest
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MockNotAllowedException :
  CodedException("Select this app as the mock location app in Developer options")

class LocationPermissionException :
  CodedException("Location permission is required to keep the simulation running")

class MockLocationModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {
    Name("MockLocation")

    Events("onLocation", "onStop", "onSharedText")

    OnCreate {
      MockEngine.locationListener = { latitude, longitude ->
        sendEvent("onLocation", mapOf("latitude" to latitude, "longitude" to longitude))
      }
      MockEngine.stopListener = { sendEvent("onStop") }
    }

    OnDestroy {
      MockEngine.locationListener = null
      MockEngine.stopListener = null
    }

    Function("isRunning") { MockEngine.running }

    AsyncFunction("start") { plan: String ->
      val permission = ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION)
      if (permission != PackageManager.PERMISSION_GRANTED) throw LocationPermissionException()
      MockEngine.ensureAllowed(context)
      MockLocationService.start(context, plan)
    }

    Function("stop") { MockLocationService.stop(context) }

    Function("setResumeOnBoot") { enabled: Boolean -> MockPrefs.setResumeOnBoot(context, enabled) }

    Function("consumeSharedText") { appContext.currentActivity?.intent?.let(::takeSharedText) }

    OnNewIntent { intent ->
      takeSharedText(intent)?.let { sendEvent("onSharedText", mapOf("text" to it)) }
    }

    Function("openInMaps") { latitude: Double, longitude: Double, label: String, title: String ->
      val place = Uri.parse("geo:$latitude,$longitude?q=$latitude,$longitude(${Uri.encode(label)})")
      val chooser = Intent.createChooser(Intent(Intent.ACTION_VIEW, place), title)
        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      context.packageManager.getLaunchIntentForPackage(context.packageName)?.component?.let {
        chooser.putExtra(Intent.EXTRA_EXCLUDE_COMPONENTS, arrayOf(it))
      }
      context.startActivity(chooser)
    }

    Function("setLabels") { labels: Map<String, String> ->
      MockPrefs.setLabels(context, labels)
      MockWidgetProvider.refresh(context)
    }
  }

  private fun takeSharedText(intent: Intent): String? {
    if (intent.action != Intent.ACTION_SEND) return null
    val text = intent.getStringExtra(Intent.EXTRA_TEXT) ?: return null
    intent.action = Intent.ACTION_MAIN
    return text
  }
}
