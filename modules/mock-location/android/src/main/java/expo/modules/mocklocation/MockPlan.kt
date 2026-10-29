package expo.modules.mocklocation

import org.json.JSONObject

data class MockPlan(
  val latitude: Double,
  val longitude: Double,
  val latitudeStep: Double,
  val longitudeStep: Double,
  val intervalMs: Long,
  val count: Int,
  val moveAsSpeed: Boolean,
  val route: List<DoubleArray>,
  val routeSpeed: Double,
  val loop: Boolean,
) {
  companion object {
    fun parse(json: String): MockPlan {
      val source = JSONObject(json)
      val points = source.optJSONArray("route")
      val route = (0 until (points?.length() ?: 0)).map { index ->
        val point = points!!.getJSONArray(index)
        doubleArrayOf(point.getDouble(0), point.getDouble(1))
      }

      return MockPlan(
        latitude = source.getDouble("latitude"),
        longitude = source.getDouble("longitude"),
        latitudeStep = source.optDouble("latitudeStep", 0.0),
        longitudeStep = source.optDouble("longitudeStep", 0.0),
        intervalMs = source.optLong("intervalMs", 10_000).coerceAtLeast(1),
        count = source.optInt("count", 0),
        moveAsSpeed = source.optBoolean("moveAsSpeed", true),
        route = route,
        routeSpeed = source.optDouble("routeSpeed", 0.0),
        loop = source.optBoolean("loop", false),
      )
    }
  }
}
