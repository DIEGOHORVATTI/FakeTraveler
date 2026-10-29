package expo.modules.mocklocation

import android.content.Context
import android.location.Criteria
import android.location.Location
import android.location.LocationManager
import android.os.Build
import android.os.SystemClock
import java.util.Timer
import kotlin.concurrent.timer

private const val MAX_PROVIDER_ATTEMPTS = 3

object MockEngine {
  var locationListener: ((Double, Double) -> Unit)? = null
  var stopListener: (() -> Unit)? = null

  private var scheduler: Timer? = null

  val running: Boolean
    get() = scheduler != null

  private val providers = buildList {
    add(LocationManager.GPS_PROVIDER)
    add(LocationManager.NETWORK_PROVIDER)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) add(LocationManager.FUSED_PROVIDER)
  }

  private fun locationManager(context: Context) =
    context.getSystemService(Context.LOCATION_SERVICE) as LocationManager

  fun ensureAllowed(context: Context) {
    if (running) return
    val manager = locationManager(context)
    try {
      addProvider(manager, LocationManager.GPS_PROVIDER)
    } finally {
      runCatching { manager.removeTestProvider(LocationManager.GPS_PROVIDER) }
    }
  }

  fun start(context: Context, plan: MockPlan, onFinished: () -> Unit) {
    cancel(context)
    val manager = locationManager(context)
    providers.forEach { addProvider(manager, it) }
    val walker = PlanWalker(plan)

    scheduler = timer(period = plan.intervalMs) {
      val step = walker.next()
      providers.forEach { manager.setTestProviderLocation(it, buildLocation(it, step)) }
      locationListener?.invoke(step.latitude, step.longitude)
      if (step.last) onFinished()
    }
  }

  fun stop(context: Context) {
    val wasRunning = running
    cancel(context)
    if (wasRunning) stopListener?.invoke()
  }

  private fun cancel(context: Context) {
    scheduler?.cancel()
    scheduler = null
    val manager = locationManager(context)
    providers.forEach { runCatching { manager.removeTestProvider(it) } }
  }

  @Suppress("DEPRECATION")
  private fun addProvider(manager: LocationManager, name: String, attempt: Int = 1) {
    try {
      runCatching { manager.removeTestProvider(name) }
      manager.addTestProvider(name, false, false, false, false, true, true, true, Criteria.POWER_LOW, Criteria.ACCURACY_FINE)
      manager.setTestProviderEnabled(name, true)
    } catch (error: Throwable) {
      if (attempt >= MAX_PROVIDER_ATTEMPTS) throw MockNotAllowedException()
      addProvider(manager, name, attempt + 1)
    }
  }

  private fun buildLocation(provider: String, step: MockStep) = Location(provider).apply {
    latitude = step.latitude
    longitude = step.longitude
    altitude = 3.0
    time = System.currentTimeMillis()
    elapsedRealtimeNanos = SystemClock.elapsedRealtimeNanos()
    speed = step.speed
    bearing = step.bearing
    accuracy = 3f
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      bearingAccuracyDegrees = 0.1f
      verticalAccuracyMeters = 0.1f
      speedAccuracyMetersPerSecond = 0.01f
    }
  }
}
