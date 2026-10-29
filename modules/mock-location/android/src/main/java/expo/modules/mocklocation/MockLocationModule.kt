package expo.modules.mocklocation

import android.Manifest
import android.content.Context
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

    Events("onLocation", "onStop")

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

    Function("setLabels") { labels: Map<String, String> ->
      MockPrefs.setLabels(context, labels)
      MockWidgetProvider.refresh(context)
    }
  }
}
