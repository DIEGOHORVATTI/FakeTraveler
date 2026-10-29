package expo.modules.mocklocation

import android.content.Context

object MockPrefs {
  private const val PLAN = "plan"
  private const val ACTIVE = "active"
  private const val RESUME_ON_BOOT = "resumeOnBoot"
  private const val LABEL_PREFIX = "label."

  private fun prefs(context: Context) =
    context.getSharedPreferences("mock_location", Context.MODE_PRIVATE)

  fun plan(context: Context): String? = prefs(context).getString(PLAN, null)

  fun savePlan(context: Context, json: String) = prefs(context).edit().putString(PLAN, json).apply()

  fun isActive(context: Context) = prefs(context).getBoolean(ACTIVE, false)

  fun setActive(context: Context, active: Boolean) =
    prefs(context).edit().putBoolean(ACTIVE, active).apply()

  fun resumeOnBoot(context: Context) = prefs(context).getBoolean(RESUME_ON_BOOT, false)

  fun setResumeOnBoot(context: Context, enabled: Boolean) =
    prefs(context).edit().putBoolean(RESUME_ON_BOOT, enabled).apply()

  fun setLabels(context: Context, labels: Map<String, String>) {
    val editor = prefs(context).edit()
    labels.forEach { (key, value) -> editor.putString(LABEL_PREFIX + key, value) }
    editor.apply()
  }

  fun label(context: Context, key: String, fallback: String): String =
    prefs(context).getString(LABEL_PREFIX + key, null) ?: fallback
}
