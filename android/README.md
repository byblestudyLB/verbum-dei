# Verbum Dei Android APK

This is a minimal Android WebView app that opens the existing official
Verbum Dei GitHub Pages site over HTTPS:

https://byblestudyLB.github.io/verbum-dei/

- App ID: `lb.verbumdei.app`
- No user accounts, analytics, ads, file access, or sensitive permissions.
- Internet required for daily OLM readings to avoid stale liturgy.
- External links (e.g. YouTube) open in the browser/appropriate app.
- APK build uses JDK 17, Gradle 8.11.1, Android Gradle Plugin 8.9.2,
  and Android SDK 35.

## Build

From the repository root with Java 17, Gradle 8.11.1 and Android SDK installed:

```sh
gradle -p android :app:assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`.

The GitHub Actions workflow `.github/workflows/android-apk.yml` builds
the APK for free and publishes a downloadable copy. It is a **debug-signed
testing APK**, not a signed production Google Play release. GitHub's
ephemeral debug keys may change on future builds, so an update may require
uninstalling the old APK; use a persistent protected release signing key
for long-term native APK updates. Never commit private signing keys to
this public repository.
