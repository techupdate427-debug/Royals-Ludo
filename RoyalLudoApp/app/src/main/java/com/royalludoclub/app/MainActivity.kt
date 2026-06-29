package com.royalludoclub.app

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.Vibrator
import android.view.KeyEvent
import android.view.View
import android.webkit.*
import android.widget.ProgressBar
import android.widget.RelativeLayout
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Full-screen immersive layout
        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        )

        val rootLayout = RelativeLayout(this)
        rootLayout.setBackgroundColor(0xFF0e1220.toInt())

        // Progress bar shown while loading
        progressBar = ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal)
        progressBar.id = View.generateViewId()
        progressBar.isIndeterminate = false
        progressBar.max = 100
        progressBar.progressDrawable = resources.getDrawable(android.R.drawable.progress_horizontal, theme)
        val pbParams = RelativeLayout.LayoutParams(
            RelativeLayout.LayoutParams.MATCH_PARENT, 6
        )
        pbParams.addRule(RelativeLayout.ALIGN_PARENT_TOP)
        progressBar.layoutParams = pbParams
        rootLayout.addView(progressBar)

        // WebView setup
        webView = WebView(this)
        val wvParams = RelativeLayout.LayoutParams(
            RelativeLayout.LayoutParams.MATCH_PARENT,
            RelativeLayout.LayoutParams.MATCH_PARENT
        )
        webView.layoutParams = wvParams
        rootLayout.addView(webView)

        setContentView(rootLayout)

        configureWebView()
        webView.loadUrl("file:///android_asset/index.html")
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configureWebView() {
        val settings = webView.settings

        // ── JavaScript & Storage ─────────────────────────────────────
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true        // localStorage support
        settings.databaseEnabled = true          // Web SQL (legacy)
        settings.allowFileAccess = true          // local assets
        settings.allowFileAccessFromFileURLs = true
        settings.allowUniversalAccessFromFileURLs = true  // cross-file fetch

        // ── Rendering & Layout ───────────────────────────────────────
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true
        settings.setSupportZoom(false)
        settings.builtInZoomControls = false
        settings.displayZoomControls = false
        settings.textZoom = 100

        // ── Mixed Content (Firebase SDK loads over HTTPS) ─────────────
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW

        // ── Media & Hardware acceleration ────────────────────────────
        settings.mediaPlaybackRequiresUserGesture = false
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null)

        // ── Cache for offline support ────────────────────────────────
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        // ── Bridge: expose Android vibration to JavaScript ───────────
        webView.addJavascriptInterface(AndroidBridge(this), "AndroidBridge")

        // ── Progress bar + page lifecycle ────────────────────────────
        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView, newProgress: Int) {
                progressBar.progress = newProgress
                progressBar.visibility = if (newProgress < 100) View.VISIBLE else View.GONE
            }
        }

        // ── External links (privacy, terms) open in browser ──────────
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val url = request.url.toString()
                return if (url.startsWith("file://") || url.startsWith("about:")) {
                    false // load inside WebView
                } else {
                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                    true
                }
            }

            override fun onPageFinished(view: WebView, url: String) {
                progressBar.visibility = View.GONE
                // Inject vibration bridge call so navigator.vibrate() works
                view.evaluateJavascript(
                    """
                    (function() {
                      var origVibrate = navigator.vibrate.bind(navigator);
                      navigator.vibrate = function(pattern) {
                        try { AndroidBridge.vibrate(JSON.stringify(pattern)); } catch(e) {}
                        return true;
                      };
                    })();
                    """.trimIndent(), null
                )
            }
        }
    }

    // ── Hardware Back button: go back in WebView ─────────────────────────────
    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack()
            return true
        }
        return super.onKeyDown(keyCode, event)
    }

    // ── Pause/Resume: pause WebView JS timers when minimized ─────────────────
    override fun onPause() {
        super.onPause()
        webView.onPause()
        webView.pauseTimers()
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
        webView.resumeTimers()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
