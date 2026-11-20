# Verbum Dei — Word of God

A free Christian Catholic/Maronite faith companion in English and Arabic, offering daily Maronite Gospel and Epistle readings, easy-to-understand Gospel explanations, prayers, saints' stories and spiritual hymns.

**Live website:** https://byblestudyLB.github.io/verbum-dei/

**Android APK:** https://github.com/byblestudyLB/verbum-dei/releases/latest

**Source code:** https://github.com/byblestudyLB/verbum-dei

## Install

On iPhone, open the website in Safari, tap Share, select **Add to Home Screen**, enable **Open as Web App** if offered, and tap **Add**.

On Android, install from Chrome using **Install app**, or download the **Android APK** from the project's GitHub Releases page. The APK is a simple Android WebView wrapper displaying the live website. It uses internet access for up-to-date readings and other content. A new Android APK is required when native code or the launcher icon changes; regular website updates appear after the app refreshes.

The current Android APK is a testing build signed using a debug key. If installing a newer preview over an older one fails due to different signatures, uninstall the earlier preview before installing the newer one.

## Publishing

The website deploys to GitHub Pages through `.github/workflows/pages.yml`. The Android APK is built and published through `.github/workflows/android-apk.yml`. The icon artwork is stored at `icons/word-of-god.webp` and reused for the native app and installable website.

Keep OLM as the liturgical reference source for the Maronite daily readings. Do not replace this source with an unrelated calendar.

## Safety and privacy

The Android wrapper declares only the **INTERNET** permission. It does not request camera, microphone, SMS, contacts or location permissions and contains no custom JavaScript bridge. Its code can be independently reviewed here. This is not a guarantee that any app or external site can be 100% risk-free.

## Source code license

Code original to this repository is made available under the [MIT License](LICENSE). External Bible texts, OLM readings, prayers, photographs, media, embedded videos and other third-party content are subject to their original authors' and providers' rights and are **not relicensed** by this notice.
