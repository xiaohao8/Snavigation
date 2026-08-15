/* ============================================================
 * 主题管理（暗色 / 液态玻璃）
 * ------------------------------------------------------------
 * 存储：cookie `theme`（默认 dark）
 * 应用：body[data-theme="glass"] 开启液态玻璃；dark 不写属性
 * ============================================================ */
(function (global) {
    'use strict';

    var THEME_KEY = 'theme';

    // 读取当前主题（仅接受 dark / glass，其余回退 dark）
    function getTheme() {
        try {
            var t = Cookies.get(THEME_KEY);
            return t === 'glass' ? 'glass' : 'dark';
        } catch (e) {
            return 'dark';
        }
    }

    // 应用主题到页面 + 同步设置页卡片高亮
    function applyTheme(t) {
        t = t === 'glass' ? 'glass' : 'dark';
        if (t === 'glass') {
            document.body.setAttribute('data-theme', 'glass');
        } else {
            document.body.removeAttribute('data-theme');
        }
        // 设置页「外观」卡片选中态
        var cards = document.querySelectorAll('[data-theme-option]');
        for (var i = 0; i < cards.length; i++) {
            var on = cards[i].getAttribute('data-theme-option') === t;
            cards[i].classList.toggle('active', on);
        }
    }

    // 切换并持久化
    function setTheme(t) {
        t = t === 'glass' ? 'glass' : 'dark';
        try {
            Cookies.set(THEME_KEY, t, { expires: 36500 });
        } catch (e) {
            /* 存储失败不阻断切换 */
        }
        applyTheme(t);
    }

    // 初始化
    function init() {
        applyTheme(getTheme());
        // 外观卡片点击/键盘切换（事件委托，兼容动态内容）
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
        apply: applyTheme
    };
})(window);
