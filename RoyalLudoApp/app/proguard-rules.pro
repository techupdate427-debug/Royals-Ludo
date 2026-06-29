# Default ProGuard rules for Royal Ludo
# Keep WebView JavaScript interfaces
-keepclassmembers class com.royalludoclub.app.AndroidBridge {
    @android.webkit.JavascriptInterface <methods>;
}
# Keep main activity
-keep class com.royalludoclub.app.MainActivity { *; }
# General rules
-dontwarn okhttp3.**
-dontwarn okio.**
