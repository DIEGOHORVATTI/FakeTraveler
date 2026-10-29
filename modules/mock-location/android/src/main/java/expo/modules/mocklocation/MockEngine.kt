package expo.modules.mocklocation

import android.annotation.SuppressLint
import android.content.Context
import android.location.Criteria
import android.location.Location
import android.location.LocationManager
import android.os.Build
import android.os.SystemClock
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import java.util.Timer
import kotlin.concurrent.timer

private const val MAX_PROVIDER_ATTEMPTS = 3
private const val PUSH_PERIOD_MS = 1000L
private const val FUSED_PROVIDER_NAME = "fused"

object MockEngine {
  var locationListener: ((Double, Double) -> Unit)? = null
  var stopListener: (() -> Unit)? = null

  private var scheduler: Timer? = null
  private var playServices: FusedLocationProviderClient? = null

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
    playServices = enablePlayServicesMock(context)
    val walker = PlanWalker(plan)
    val startedAt = SystemClock.elapsedRealtime()

    scheduler = timer(period = PUSH_PERIOD_MS) {
      val step = walker.at(SystemClock.elapsedRealtime() - startedAt)
      if (step == null) {
        onFinished()
        return@timer
      }
      push(manager, step)
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
    playServices?.let { runCatching { it.setMockMode(false) } }
    playServices = null
    val manager = locationManager(context)
    providers.forEach { runCatching { manager.removeTestProvider(it) } }
  }

  @SuppressLint("MissingPermission")
  private fun enablePlayServicesMock(context: Context): FusedLocationProviderClient? = runCatching {
    LocationServices.getFusedLocationProviderClient(context).also { it.setMockMode(true) }
  }.getOrNull()

  @SuppressLint("MissingPermission")
  private fun push(manager: LocationManager, step: MockStep) {
    providers.forEach { manager.setTestProviderLocation(it, buildLocation(it, step)) }
    playServices?.let { client -> runCatching { client.setMockLocation(buildLocation(FUSED_PROVIDER_NAME, step)) } }
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
