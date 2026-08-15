/* ============================================================
 * 主题管理（暗色 / 液态玻璃 + 按时段自动切换）
 * ------------------------------------------------------------
 * 存储：
 *   cookie `theme`         当前主题 dark / glass（手动选择的结果）
 *   cookie `theme_auto`    自动切换开关 '1' / '0'
 *   cookie `theme_auto_from` 进入暗色的时间（HH:MM，默认 18:30）
 *   cookie `theme_auto_to`   退出暗色回到玻璃的时间（HH:MM，默认 07:00）
 * 应用：body[data-theme="glass"] 开启液态玻璃；dark 不写属性
 * 自动逻辑：开启后按当前时间判断，夜间(dark) / 白天(glass)自动切换；
 *           手动点击主题卡片则关闭自动模式。
 * ============================================================ */
(function (global) {
    'use strict';

    var THEME_KEY = 'theme';
    var AUTO_KEY = 'theme_auto';
    var AUTO_FROM_KEY = 'theme_auto_from';
    var AUTO_TO_KEY = 'theme_auto_to';
    var DEFAULT_FROM = '18:30'; // 默认：18:30 进入暗色
    var DEFAULT_TO = '07:00';   // 默认：07:00 回到玻璃（亮）

    var autoTimer = null;

    // 读取当前主题（仅接受 dark / glass，其余回退 dark）
    function getTheme() {
        try {
            var t = Cookies.get(THEME_KEY);
            return t === 'glass' ? 'glass' : 'dark';
        } catch (e) {
            return 'dark';
        }
    }

    // 自动切换开关
    function isAuto() {
        try {
            return Cookies.get(AUTO_KEY) === '1';
        } catch (e) {
            return false;
        }
    }

    // 时段（HH:MM 字符串 → 分钟数）
    function parseTime(s) {
        if (!s) return null;
        var m = String(s).match(/^(\d{1,2}):(\d{2})$/);
        if (!m) return null;
        var h = parseInt(m[1], 10);
        var min = parseInt(m[2], 10);
        if (h > 23 || min > 59) return null;
        return h * 60 + min;
    }

    // 自动时段配置（读取 cookie，非法回退默认）
    function getAutoRange() {
        var from = parseTime(Cookies.get(AUTO_FROM_KEY)) ?? parseTime(DEFAULT_FROM);
        var to = parseTime(Cookies.get(AUTO_TO_KEY)) ?? parseTime(DEFAULT_TO);
        return { from: from, to: to };
    }

    // 判断当前时间是否处于「暗色时段」（跨午夜：from > to 时从 from 到次日 to）
    function isDarkTime(now, range) {
        var m = now.getHours() * 60 + now.getMinutes();
        var f = range.from;
        var t = range.to;
        if (f > t) {
            // 跨午夜：如 18:30 → 次日 07:00
            return m >= f || m < t;
        }
        return m >= f && m < t;
    }

    // 应用主题到页面 + 同步设置页卡片高亮
    function applyTheme(t) {
        t = t === 'glass' ? 'glass' : 'dark';
        if (t === 'glass') {
            document.body.setAttribute('data-theme', 'glass');
        } else {
            document.body.removeAttribute('data-theme');
        }
        var cards = document.querySelectorAll('[data-theme-option]');
        for (var i = 0; i < cards.length; i++) {
            cards[i].classList.toggle('active', cards[i].getAttribute('data-theme-option') === t);
        }
    }

    // 根据当前时间计算自动主题
    function autoTheme() {
        var range = getAutoRange();
        return isDarkTime(new Date(), range) ? 'dark' : 'glass';
    }

    // 切换并持久化（手动选择：关闭自动模式）
    function setTheme(t) {
        t = t === 'glass' ? 'glass' : 'dark';
        try {
            Cookies.set(THEME_KEY, t, { expires: 36500 });
            Cookies.set(AUTO_KEY, '0', { expires: 36500 });
        } catch (e) {
            /* 存储失败不阻断切换 */
        }
        stopAutoTimer();
        applyTheme(t);
        syncAutoUI(false);
    }

    // 同步自动切换的 UI 状态（开关 + 时间输入 + 卡片）
    function syncAutoUI(on) {
        var toggle = document.getElementById('theme-auto-toggle');
        if (toggle) toggle.setAttribute('aria-checked', on ? 'true' : 'false');
        var range = document.querySelectorAll('.theme-auto-time');
        for (var i = 0; i < range.length; i++) {
            range[i].disabled = !on;
        }
    }

    // 自动检查（定时器回调）
    function autoCheck() {
        if (!isAuto()) return;
        applyTheme(autoTheme());
    }

    function startAutoTimer() {
        stopAutoTimer();
        autoTimer = setInterval(autoCheck, 30 * 1000); // 每 30 秒检查一次
    }

    function stopAutoTimer() {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    }

    // 开启自动切换
    function enableAuto(from, to) {
        try {
            Cookies.set(AUTO_KEY, '1', { expires: 36500 });
            Cookies.set(AUTO_FROM_KEY, from || DEFAULT_FROM, { expires: 36500 });
            Cookies.set(AUTO_TO_KEY, to || DEFAULT_TO, { expires: 36500 });
            Cookies.set(THEME_KEY, autoTheme(), { expires: 36500 });
        } catch (e) {
            /* ignore */
        }
        applyTheme(autoTheme());
        syncAutoUI(true);
        startAutoTimer();
    }

    // 关闭自动切换（保持当前主题）
    function disableAuto() {
        try {
            Cookies.set(AUTO_KEY, '0', { expires: 36500 });
        } catch (e) {
            /* ignore */
        }
        stopAutoTimer();
        syncAutoUI(false);
    }

    // 初始化设置页自动切换控件
    function initAutoUI() {
        var toggle = document.getElementById('theme-auto-toggle');
        if (!toggle) return;
        var fromInput = document.getElementById('theme-auto-from');
        var toInput = document.getElementById('theme-auto-to');
        var auto = isAuto();
        var range = getAutoRange();

        function fmt(mins) {
            var h = Math.floor(mins / 60);
            var mm = mins % 60;
            return (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm;
        }
        if (fromInput) fromInput.value = fmt(range.from);
        if (toInput) toInput.value = fmt(range.to);
        syncAutoUI(auto);

        toggle.addEventListener('click', function () {
            if (isAuto()) {
                disableAuto();
            } else {
                enableAuto(fromInput ? fromInput.value : DEFAULT_FROM, toInput ? toInput.value : DEFAULT_TO);
            }
        });
        if (fromInput) {
            fromInput.addEventListener('change', function () {
                if (isAuto()) enableAuto(fromInput.value, toInput ? toInput.value : DEFAULT_TO);
            });
        }
        if (toInput) {
            toInput.addEventListener('change', function () {
                if (isAuto()) enableAuto(fromInput ? fromInput.value : DEFAULT_FROM, toInput.value);
            });
        }
    }

    // 初始化
    function init() {
        if (isAuto()) {
            applyTheme(autoTheme());
            syncAutoUI(true);
            startAutoTimer();
        } else {
            applyTheme(getTheme());
            syncAutoUI(false);
        }
        initAutoUI();

        // 主题卡片点击/键盘切换（手动选择 → 关闭自动）
        document.addEventListener('click', function (e) {
            var card = e.target.closest ? e.target.closest('[data-theme-option]') : null;
            if (card) {
                setTheme(card.getAttribute('data-theme-option'));
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            var card = e.target.closest ? e.target.closest('[data-theme-option]') : null;
            if (card) {
                e.preventDefault();
                setTheme(card.getAttribute('data-theme-option'));
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    global.ThemeManager = {
        get: getTheme,
        set: setTheme,
        apply: applyTheme,
        isAuto: isAuto,
        enableAuto: enableAuto,
        disableAuto: disableAuto
    };
})(window);
