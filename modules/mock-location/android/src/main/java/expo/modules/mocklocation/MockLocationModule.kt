package expo.modules.mocklocation

import android.content.Context
import android.location.Criteria
import android.location.Location
import android.location.LocationManager
import android.os.Build
import android.os.SystemClock
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import java.util.Timer
import kotlin.concurrent.timer

class StartOptions : Record {
  @Field val latitude: Double = 0.0
  @Field val longitude: Double = 0.0
  @Field val latitudeStep: Double = 0.0
  @Field val longitudeStep: Double = 0.0
  @Field val intervalMs: Long = 10_000
  @Field val count: Int = 0
  @Field val moveAsSpeed: Boolean = true
}

class MockNotAllowedException :
  CodedException("Select this app as the mock location app in Developer options")

private const val MAX_PROVIDER_ATTEMPTS = 3

class MockLocationModule : Module() {
  private var scheduler: Timer? = null

  private val locationManager: LocationManager
    get() = appContext.reactContext?.getSystemService(Context.LOCATION_SERVICE) as? LocationManager
      ?: throw Exceptions.ReactContextLost()

  private val providers = buildList {
    add(LocationManager.GPS_PROVIDER)
    add(LocationManager.NETWORK_PROVIDER)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) add(LocationManager.FUSED_PROVIDER)
  }

  override fun definition() = ModuleDefinition {
    Name("MockLocation")

    Events("onLocation", "onStop")

    Function("isRunning") { scheduler != null }

    AsyncFunction("start") { options: StartOptions -> start(options) }

    Function("stop") { stop() }

    OnDestroy { stop() }
  }

  private fun start(options: StartOptions) {
    stop()
    val manager = locationManager
    try {
      providers.forEach { addProvider(manager, it) }
    } catch (error: SecurityException) {
      removeProviders(manager)
      throw MockNotAllowedException()
    }

    val speed = if (options.moveAsSpeed) speedOf(options) else 0f
    var latitude = options.latitude
    var longitude = options.longitude
    var pushed = 0

    scheduler = timer(period = options.intervalMs.coerceAtLeast(1)) {
      providers.forEach { manager.setTestProviderLocation(it, buildLocation(it, latitude, longitude, speed)) }
      sendEvent("onLocation", mapOf("latitude" to latitude, "longitude" to longitude))
      pushed++
      if (options.count != 0 && pushed >= options.count) {
        stop()
        sendEvent("onStop")
      }
      latitude += options.latitudeStep
      longitude += options.longitudeStep
    }
  }

  private fun stop() {
    scheduler?.cancel()
    scheduler = null
    appContext.reactContext?.let { removeProviders(locationManager) }
  }

  @Suppress("DEPRECATION")
  private fun addProvider(manager: LocationManager, name: String, attempt: Int = 1) {
    try {
      runCatching { manager.removeTestProvider(name) }
      manager.addTestProvider(name, false, false, false, false, false, true, true, Criteria.POWER_LOW, Criteria.ACCURACY_COARSE)
      manager.setTestProviderEnabled(name, true)
    } catch (error: Throwable) {
      if (attempt >= MAX_PROVIDER_ATTEMPTS) throw SecurityException(error)
      addProvider(manager, name, attempt + 1)
    }
  }

  private fun removeProviders(manager: LocationManager) {
    providers.forEach { runCatching { manager.removeTestProvider(it) } }
  }

  private fun speedOf(options: StartOptions): Float {
    val distance = FloatArray(1)
    Location.distanceBetween(
      options.latitude,
      options.longitude,
      options.latitude + options.latitudeStep,
      options.longitude + options.longitudeStep,
      distance,
    )
    return distance[0] / (options.intervalMs / 1000f)
  }

  private fun buildLocation(provider: String, latitude: Double, longitude: Double, speed: Float) =
    Location(provider).apply {
      this.latitude = latitude
      this.longitude = longitude
      altitude = 3.0
      time = System.currentTimeMillis()
      elapsedRealtimeNanos = SystemClock.elapsedRealtimeNanos()
      this.speed = speed
      bearing = 1f
      accuracy = 3f
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        bearingAccuracyDegrees = 0.1f
        verticalAccuracyMeters = 0.1f
        speedAccuracyMetersPerSecond = 0.01f
      }
    }
}
