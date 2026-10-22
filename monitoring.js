/* Privacy-first runtime monitoring. Configure Sentry with a runtime-only DSN when deploying. */
(function (root) {
  "use strict";
  const STORAGE_KEY = "royal-ludo-error-log";
  const MAX_ENTRIES = 25;
  const startedAt = Date.now();

  function readLog() {
    try { return JSON.parse(root.localStorage.getItem(STORAGE_KEY) || "[]"); } catch (_) { return []; }
  }
  function writeLog(entries) {
    try { root.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES))); } catch (_) { /* storage may be unavailable */ }
  }
  function normalize(error, context) {
    const value = error instanceof Error ? error : new Error(String(error || "Unknown error"));
    return {
      message: value.message,
      name: value.name,
      stack: value.stack,
      context: context || "runtime",
      url: root.location && root.location.href,
      userAgent: root.navigator && root.navigator.userAgent,
      elapsedMs: Date.now() - startedAt,
      timestamp: new Date().toISOString()
    };
  }
  function report(error, context) {
    const event = normalize(error, context);
    const entries = readLog();
    entries.push(event);
    writeLog(entries);
    try { root.console.error("[RoyalLudo]", event); } catch (_) { /* console unavailable */ }
    if (root.Sentry && typeof root.Sentry.captureException === "function") {
      root.Sentry.withScope((scope) => {
        scope.setTag("app", "royals-ludo");
        scope.setTag("context", event.context);
        root.Sentry.captureException(error instanceof Error ? error : new Error(event.message));
      });
    }
    try {
      if (root.AndroidBridge && typeof root.AndroidBridge.reportError === "function") {
        root.AndroidBridge.reportError(JSON.stringify(event));
      }
    } catch (_) { /* bridge is optional */ }
  }
  root.RoyalLudoMonitoring = Object.freeze({ report, recent: readLog, clear: () => writeLog([]) });
  root.addEventListener("error", (event) => report(event.error || event.message, "window.error"));
  root.addEventListener("unhandledrejection", (event) => report(event.reason, "unhandledrejection"));
  root.addEventListener("securitypolicyviolation", (event) => report(new Error(`CSP violation: ${event.blockedURI}`), "securitypolicyviolation"));
})(typeof globalThis !== "undefined" ? globalThis : window);
