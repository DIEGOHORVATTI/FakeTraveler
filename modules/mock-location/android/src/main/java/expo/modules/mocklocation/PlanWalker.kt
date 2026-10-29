package expo.modules.mocklocation

import android.location.Location

class MockStep(
  val latitude: Double,
  val longitude: Double,
  val speed: Float,
  val bearing: Float,
  val last: Boolean,
)

class PlanWalker(private val plan: MockPlan) {
  private val cumulative = buildCumulativeDistances()
  private val stepSpeed = if (plan.moveAsSpeed) stepSpeed() else 0f
  private val followsRoute = plan.route.size >= 2

  fun at(elapsedMs: Long): MockStep? {
    val stepIndex = elapsedMs / plan.intervalMs
    if (plan.count != 0 && stepIndex >= plan.count) return null
    return if (followsRoute) routeAt(elapsedMs) else fixedAt(stepIndex)
  }

  private fun fixedAt(stepIndex: Long) = MockStep(
    latitude = plan.latitude + stepIndex * plan.latitudeStep,
    longitude = plan.longitude + stepIndex * plan.longitudeStep,
    speed = stepSpeed,
    bearing = 0f,
    last = false,
  )

  private fun routeAt(elapsedMs: Long): MockStep {
    val total = cumulative.last()
    val travelled = plan.routeSpeed * elapsedMs / 1000.0
    val distance = if (plan.loop && total > 0) travelled % total else travelled.coerceAtMost(total)
    val segment = cumulative.indexOfFirst { it >= distance }.coerceIn(1, plan.route.size - 1)
    val from = plan.route[segment - 1]
    val to = plan.route[segment]
    val length = cumulative[segment] - cumulative[segment - 1]
    val fraction = if (length > 0) (distance - cumulative[segment - 1]) / length else 1.0

    return MockStep(
      latitude = from[0] + (to[0] - from[0]) * fraction,
      longitude = from[1] + (to[1] - from[1]) * fraction,
      speed = plan.routeSpeed.toFloat(),
      bearing = bearingBetween(from, to),
      last = !plan.loop && travelled >= total,
    )
  }

  private fun buildCumulativeDistances(): DoubleArray {
    val distances = DoubleArray(plan.route.size)
    for (index in 1 until plan.route.size) {
      distances[index] = distances[index - 1] + distanceBetween(plan.route[index - 1], plan.route[index])
    }
    return distances
  }

  private fun stepSpeed(): Float {
    val meters = distanceBetween(
      doubleArrayOf(plan.latitude, plan.longitude),
      doubleArrayOf(plan.latitude + plan.latitudeStep, plan.longitude + plan.longitudeStep),
    )
    return (meters / (plan.intervalMs / 1000.0)).toFloat()
  }

  private fun distanceBetween(from: DoubleArray, to: DoubleArray): Double {
    val result = FloatArray(1)
    Location.distanceBetween(from[0], from[1], to[0], to[1], result)
    return result[0].toDouble()
  }

  private fun bearingBetween(from: DoubleArray, to: DoubleArray): Float {
    val result = FloatArray(2)
    Location.distanceBetween(from[0], from[1], to[0], to[1], result)
    return (result[1] + 360f) % 360f
  }
}
