/* Snavigation PWA module
 * - Registers the service worker (sw.js) for offline shell + runtime caching.
 * - Captures the browser's deferred install prompt and exposes a custom
 *   "安装到桌面" UI (settings panel button + a small dismissible floating hint).
 * - Detects iOS Safari (no beforeinstallprompt) and shows share-sheet instructions.
 * - Detects standalone mode (already installed) and hides install UI.
 * - Handles PWA shortcut deep-links via ?source=pwa&goto=shortcuts|settings.
 *
 * Depends on global functions openBox() / openSet() from set.js, loaded earlier.
 */
(function () {
    'use strict';

    var SW_URL = './sw.js';
    var SCOPE = './';
    var DISMISS_KEY = 'snavigation_pwa_dismissed';
    var INSTALLED_KEY = 'snavigation_pwa_installed';

    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var isStandalone = window.matchMedia('(display-mode: standalone)').matches
                    || window.navigator.standalone === true;
    var deferredPrompt = null;
    var els = {};

    function $(id) { return document.getElementById(id); }

    function safeStorageGet(k) { try { return localStorage.getItem(k); } catch (_) { return null; } }
    function safeStorageSet(k, v) { try { localStorage.setItem(k, v); } catch (_) {} }

    function isInstalled() {
        return safeStorageGet(INSTALLED_KEY) === '1' || isStandalone;
    }
    function isHintDismissed() {
        return safeStorageGet(DISMISS_KEY) === '1';
    }

    function show(el) { if (el) el.style.display = ''; }
    function hide(el) { if (el) el.style.display = 'none'; }

    function updateOnlineStatus() {
        if (!els.status) return;
        var online = navigator.onLine;
        els.status.textContent = online
            ? '在线 · 核心页面已缓存，离线仍可访问'
            : '离线 · 正在使用本地缓存';
        var dot = els.statusDot;
        if (dot) dot.className = 'pwa-dot ' + (online ? 'pwa-dot--on' : 'pwa-dot--off');
    }

    function revealInstallUI() {
        if (isInstalled() || isHintDismissed()) return;
        if (els.fab) {
            els.fab.hidden = false;
            els.fab.classList.add('pwa-fab--show');
        }
    }
    function concealInstallUI() {
        if (els.fab) { els.fab.hidden = true; els.fab.classList.remove('pwa-fab--show'); }
    }

    function markInstalledUI() {
        if (els.installBtn) {
            els.installBtn.textContent = '已安装到桌面';
            els.installBtn.disabled = true;
            els.installBtn.classList.add('pwa-btn--installed');
        }
        if (els.iosPanel) els.iosPanel.hidden = true;
        concealInstallUI();
    }

    function showIOSPanel() {
        if (els.iosPanel) {
            els.iosPanel.hidden = false;
            // ensure the settings App tab is visible so the user sees the guidance
            try { openSet(); } catch (_) {}
            var tab = document.getElementById('set-app-menu');
            if (tab) tab.click();
            // scroll the panel into view
            els.iosPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    async function triggerInstall() {
        if (isInstalled()) return;
        if (!deferredPrompt) {
            // No deferred prompt: either iOS, or browser hasn't fired it yet.
            if (isIOS) { showIOSPanel(); }
            else if (els.installHint) {
                els.installHint.textContent = '当前浏览器暂未提供安装入口，请尝试 Chrome / Edge / Edge Canary 等基于 Chromium 的浏览器。';
                els.installHint.hidden = false;
            }
            return;
        }
        try {
            deferredPrompt.prompt();
            var choice = await deferredPrompt.userChoice;
            if (choice && choice.outcome === 'dismissed' && els.installHint) {
                els.installHint.textContent = '已取消。下次想安装时，可在此页面再次点击「安装到桌面」。';
                els.installHint.hidden = false;
            }
        } catch (_) { /* user closed without choosing */ }
        deferredPrompt = null;
    }

    function handleDeepLink() {
        try {
            var p = new URLSearchParams(window.location.search);
            if (p.get('source') !== 'pwa') return;
            var goto = p.get('goto');
            if (goto === 'shortcuts') {
                try { openBox(); } catch (_) {}
            } else if (goto === 'settings') {
                try { openSet(); } catch (_) {}
            }
        } catch (_) { /* ignore */ }
    }

    function bindEvents() {
        if (els.installBtn) {
            els.installBtn.addEventListener('click', function () { triggerInstall(); });
        }
        if (els.fab) {
            els.fab.addEventListener('click', function () { triggerInstall(); });
            var closeBtn = $('pwa-fab-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    safeStorageSet(DISMISS_KEY, '1');
                    concealInstallUI();
                });
            }
        }
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
    }

    function init() {
        els.installBtn = $('pwa-install-btn');
        els.installHint = $('pwa-install-hint');
        els.fab = $('pwa-fab');
        els.iosPanel = $('pwa-ios-panel');
        els.status = $('pwa-status');
        els.statusDot = $('pwa-status-dot');

        // If installed, lock the install button and hide the hint.
        if (isInstalled()) {
            markInstalledUI();
        } else if (isIOS) {
            // iOS: no beforeinstallprompt. Show guidance in the panel; keep the
            // install button as an entry to expand the instructions.
            if (els.installBtn) {
                els.installBtn.textContent = '查看添加到主屏幕的方法';
            }
            // Show iOS guidance immediately on first visit so the user isn't lost.
            if (els.iosPanel) els.iosPanel.hidden = false;
        } else {
            // Desktop / Android: install button is ready; FAB reveals once the
            // browser fires beforeinstallprompt.
            if (els.installBtn) {
                els.installBtn.textContent = '安装到桌面';
            }
        }

        bindEvents();
        updateOnlineStatus();
    }

    // ---- Service worker registration (deferred to window load) ----
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register(SW_URL, { scope: SCOPE })
                .then(function (reg) {
                    // Optional: check for updates on each load
                    try { reg.update(); } catch (_) {}
                })
                .catch(function (err) {
                    // Silent: service worker is a progressive enhancement.
                    if (window.console && console.debug) console.debug('SW register failed:', err);
                });
        });
    }

    // ---- beforeinstallprompt: capture + reveal UI ----
    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredPrompt = e;
        if (els.installBtn && !isInstalled()) {
            els.installBtn.textContent = '安装到桌面';
            els.installBtn.disabled = false;
            els.installBtn.classList.remove('pwa-btn--installed');
        }
        revealInstallUI();
    });

    // ---- appinstalled: mark installed + hide UI ----
    window.addEventListener('appinstalled', function () {
        safeStorageSet(INSTALLED_KEY, '1');
        deferredPrompt = null;
        markInstalledUI();
    });

    // ---- Boot ----
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { init(); handleDeepLink(); });
    } else {
        init();
        handleDeepLink();
    }
})();
