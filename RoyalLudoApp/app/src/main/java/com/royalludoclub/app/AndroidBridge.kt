package com.royalludoclub.app

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.webkit.JavascriptInterface
import org.json.JSONArray
import org.json.JSONException

/**
 * AndroidBridge exposes native Android APIs to Royal Ludo JavaScript.
 * Access from JS as: AndroidBridge.vibrate(...)
 */
class AndroidBridge(private val context: Context) {

    @JavascriptInterface
    fun vibrate(pattern: String) {
        try {
            @Suppress("DEPRECATION")
            val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator ?: return

            val durations = try {
                val arr = JSONArray(pattern)
                LongArray(arr.length()) { arr.getLong(it) }
            } catch (e: JSONException) {
                longArrayOf(pattern.trim().toLongOrNull() ?: 100L)
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(VibrationEffect.createWaveform(durations, -1))
            } else {
                @Suppress("DEPRECATION")
                if (durations.size == 1) {
                    vibrator.vibrate(durations[0])
                } else {
                    vibrator.vibrate(durations, -1)
                }
            }
        } catch (e: Exception) {
            // Vibration is non-critical, fail silently
        }
    }

    @JavascriptInterface
    fun getAppVersion(): String {
        return try {
            context.packageManager.getPackageInfo(context.packageName, 0).versionName ?: "1.0"
        } catch (e: Exception) {
            "1.0"
        }
    }
}
