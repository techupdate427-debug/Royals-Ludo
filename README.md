# Royals-Ludo

A polished Ludo game with local multiplayer, AI play, online rooms, profiles, achievements, themes, and an Android WebView wrapper.

## What is included

- Browser/PWA game at the repository root
- Android Studio project in [`RoyalLudoApp/`](RoyalLudoApp/)
- Firebase Realtime Database rules in [`database.rules.json`](database.rules.json)
- Privacy and terms pages for the web and Android builds
- Offline-friendly assets and a service worker

## Run the web version

The game is dependency-free and can be served from the repository root with any static server. For example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Build the Android app

1. Install Android Studio with JDK 17 and Android SDK 34. The command-line build also requires Gradle 8.7.
2. Open [`RoyalLudoApp/`](RoyalLudoApp/) in Android Studio.
3. Let Gradle sync, then run the `app` configuration on an emulator or device.
4. For a command-line debug build, run:

```bash
cd RoyalLudoApp
gradle assembleDebug
```

`local.properties` is intentionally local-only and must not be committed.

## Firebase setup

Online play is optional. Configure Firebase through the in-app setup flow, enable the authentication providers you need, and deploy [`database.rules.json`](database.rules.json) after reviewing it for your project. Never commit service-account credentials or private keys.

## Quality checks

Every push and pull request runs the Android debug build through GitHub Actions. Before opening a pull request, verify the web build in a static server and test local play, AI play, reconnect behavior, and the online lobby when Firebase is configured.

## Project status

Royals-Ludo is an active game project. The core gameplay and mobile wrapper are implemented; online play depends on the Firebase project configuration supplied by the deployment environment.

## Automated gameplay tests

The deterministic Ludo rules live in [`game-rules.js`](game-rules.js), which is loaded by both the web game and Android assets. Run the six core gameplay tests with:

```bash
node --test tests/game-rules.test.cjs
```

The suite covers entering from home, legal dice movement, finish boundaries, board wrapping, safe squares, shields, captures, and quick/classic win conditions.

## Crash and runtime monitoring

[`monitoring.js`](monitoring.js) captures uncaught errors, unhandled promise rejections, and security-policy violations. It stores the latest 25 diagnostic events locally for offline debugging and forwards them to the Android bridge when running in the APK. Android also logs WebView renderer termination and resource failures under the `RoyalLudo` tag.

For a production dashboard, load a Sentry browser SDK and initialize it with a deployment-provided DSN before `monitoring.js`; no DSN or private monitoring credential is committed to this repository. The monitoring adapter automatically calls `Sentry.captureException` when the SDK is present.
