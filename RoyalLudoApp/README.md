# Royal Ludo Club — Android App

This folder contains the complete Android Studio project for Royal Ludo Club.

## Quick Start

1. Open Android Studio
2. File → Open → Select THIS folder (RoyalLudoApp)
3. Wait for Gradle sync
4. Connect your Android phone via USB
5. Press the ▶ Run button

## Project Structure

```
RoyalLudoApp/
├── app/
│   ├── src/main/
│   │   ├── java/com/royalludoclub/app/
│   │   │   ├── MainActivity.kt       ← Main WebView activity
│   │   │   └── AndroidBridge.kt     ← JS ↔ Android native bridge
│   │   ├── assets/                  ← Complete game files
│   │   │   ├── index.html
│   │   │   ├── app.js
│   │   │   ├── styles.css
│   │   │   ├── firebase-config.js
│   │   │   ├── firebase-setup-ui.js
│   │   │   ├── privacy.html
│   │   │   └── terms.html
│   │   ├── res/
│   │   │   ├── values/
│   │   │   │   ├── strings.xml
│   │   │   │   ├── colors.xml
│   │   │   │   └── styles.xml
│   │   └── AndroidManifest.xml
│   ├── build.gradle
│   └── proguard-rules.pro
├── build.gradle
└── settings.gradle
```

## Firebase Login Setup

On first launch, a Setup Wizard appears.  
Paste your Firebase config from https://console.firebase.google.com

## App Icons

Place your icon files in:
- `res/mipmap-hdpi/ic_launcher.png` (72x72)
- `res/mipmap-mdpi/ic_launcher.png` (48x48)
- `res/mipmap-xhdpi/ic_launcher.png` (96x96)
- `res/mipmap-xxhdpi/ic_launcher.png` (144x144)
- `res/mipmap-xxxhdpi/ic_launcher.png` (192x192)

Or use Android Studio's Image Asset Studio: Right-click res → New → Image Asset
