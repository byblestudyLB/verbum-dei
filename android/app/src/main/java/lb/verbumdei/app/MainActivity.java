package lb.verbumdei.app;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import java.util.Locale;

/**
 * Simple native Android window for the existing, publicly hosted Verbum Dei website.
 * No unnecessary permissions, no JS bridges, no advertising, and no cached daily readings.
 */
public final class MainActivity extends Activity {
    private static final String START_URL = "https://byblestudylb.github.io/verbum-dei/";
    private static final String TRUSTED_HOST = "byblestudylb.github.io";

    private WebView webView;
    private FrameLayout root;
    private View fullscreenVideo;
    private WebChromeClient.CustomViewCallback fullscreenCallback;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(Color.rgb(17, 28, 37));
        getWindow().setNavigationBarColor(Color.rgb(17, 28, 37));

        root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(17, 28, 37));
        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(17, 28, 37));
        root.addView(webView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
        setContentView(root);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSupportMultipleWindows(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (!request.isForMainFrame()) return false;
                Uri url = request.getUrl();
                if (isTrustedWebsite(url)) return false;
                openExternal(url);
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                // Native Android users should not see the site's separate PWA install prompt.
                if (isTrustedWebsite(Uri.parse(url))) {
                    view.evaluateJavascript(
                            "document.querySelectorAll('#installAppButton,#installAppHomeButton').forEach(function(e){e.hidden=true;})",
                            null);
                }
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) showOfflinePage();
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onShowCustomView(View view, CustomViewCallback callback) {
                if (fullscreenVideo != null) {
                    callback.onCustomViewHidden();
                    return;
                }
                fullscreenVideo = view;
                fullscreenCallback = callback;
                webView.setVisibility(View.GONE);
                root.addView(fullscreenVideo, new FrameLayout.LayoutParams(
                        FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
                getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
            }

            @Override
            public void onHideCustomView() {
                hideVideo();
            }

            @Override
            public boolean onCreateWindow(WebView view, boolean isDialog,
                    boolean isUserGesture, android.os.Message resultMsg) {
                if (!isUserGesture) return false;
                WebView popup = new WebView(MainActivity.this);
                popup.setWebViewClient(new WebViewClient() {
                    @Override
                    public boolean shouldOverrideUrlLoading(WebView ignored, WebResourceRequest request) {
                        openExternal(request.getUrl());
                        ignored.post(ignored::destroy);
                        return true;
                    }
                });
                WebView.WebViewTransport transport =
                        (WebView.WebViewTransport) resultMsg.obj;
                transport.setWebView(popup);
                resultMsg.sendToTarget();
                return true;
            }
        });

        if (state != null && webView.restoreState(state) != null) return;
        webView.loadUrl(START_URL);
    }

    private boolean isTrustedWebsite(Uri uri) {
        if (!"https".equalsIgnoreCase(uri.getScheme())) return false;
        if (!TRUSTED_HOST.equalsIgnoreCase(uri.getHost())) return false;
        String path = uri.getPath() == null ? "" : uri.getPath();
        return path.equals("/verbum-dei") || path.startsWith("/verbum-dei/");
    }

    private void openExternal(Uri uri) {
        if (uri == null) return;
        String scheme = uri.getScheme() == null ? "" : uri.getScheme().toLowerCase(Locale.ROOT);
        if (!scheme.equals("https") && !scheme.equals("http")
                && !scheme.equals("mailto") && !scheme.equals("tel")) return;
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (Exception ignored) {
            // No compatible app is installed; keep the original page open.
        }
    }

    private void showOfflinePage() {
        if (webView == null) return;
        String html = "<!doctype html><html lang='en'><head>"
                + "<meta name='viewport' content='width=device-width,initial-scale=1'>"
                + "<style>body{background:#111c25;color:#f3eee5;font:18px/1.7 sans-serif;"
                + "padding:24px;max-width:520px;margin:64px auto;text-align:center}"
                + "a{display:inline-block;color:#111c25;background:#d9ac82;padding:12px 22px;"
                + "border-radius:6px;text-decoration:none;margin-top:18px}</style></head><body>"
                + "<h1>No connection · لا يوجد اتصال</h1>"
                + "<p>Verbum Dei needs internet to show the correct daily Gospel and readings.</p>"
                + "<p dir='rtl'>يحتاج التطبيق إلى الإنترنت لعرض قراءات اليوم الصحيحة.</p>"
                + "<a href='" + START_URL + "'>Try again · إعادة المحاولة</a>"
                + "</body></html>";
        webView.loadDataWithBaseURL(START_URL, html, "text/html", "UTF-8", null);
    }

    private void hideVideo() {
        if (fullscreenVideo == null) return;
        root.removeView(fullscreenVideo);
        fullscreenVideo = null;
        webView.setVisibility(View.VISIBLE);
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        if (fullscreenCallback != null) {
            fullscreenCallback.onCustomViewHidden();
            fullscreenCallback = null;
        }
    }

    @Override
    public void onBackPressed() {
        if (fullscreenVideo != null) {
            hideVideo();
        } else if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle state) {
        if (webView != null) webView.saveState(state);
        super.onSaveInstanceState(state);
    }

    @Override
    protected void onDestroy() {
        if (fullscreenVideo != null) hideVideo();
        if (webView != null) {
            root.removeView(webView);
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
