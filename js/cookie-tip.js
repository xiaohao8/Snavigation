/* ============================================================
 * Cookie 提示弹窗
 * ------------------------------------------------------------
 * 首次访问（无 cookie_ack 标记）时，右下角提示保留本站 Cookie。
 * 点击"知道了"后写入 cookie_ack（30 天），不再打扰。
 * ============================================================ */
(function (global) {
    'use strict';

    var ACK_KEY = 'cookie_ack';
    var SHOW_DELAY = 1200; // 页面加载后延迟出现，避免打断首屏

    function hasAck() {
        try {
            return !!Cookies.get(ACK_KEY);
        } catch (e) {
            return false;
        }
    }

    function markAck() {
        try {
            Cookies.set(ACK_KEY, '1', { expires: 30 });
        } catch (e) {
            /* 存储失败不阻断关闭 */
        }
    }

    function showTip() {
        var tip = document.getElementById('cookie-tip');
        if (!tip) return;
        // 重启动画
        tip.classList.remove('show');
        void tip.offsetWidth;
        tip.classList.add('show');
    }

    function hideTip() {
        var tip = document.getElementById('cookie-tip');
        if (tip) tip.classList.remove('show');
    }

    function init() {
        if (hasAck()) return; // 已确认过，不再显示
        setTimeout(showTip, SHOW_DELAY);

        // 确认按钮
        var okBtn = document.getElementById('cookie-tip-ok');
        if (okBtn) {
            okBtn.addEventListener('click', function () {
                markAck();
                hideTip();
            });
        }
        // 点击弹窗外部不关闭（保持提醒，直到用户确认）
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(window);
