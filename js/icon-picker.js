/* ============================================================
 * 图标库选择器（favicon 配置通用组件）
 * ------------------------------------------------------------
 * 用法：页面中任何 <input name="icon"> 旁的 [data-icon-pick] 按钮
 * 点击打开弹窗：可粘贴图标 URL，或从品牌库选择（写入 si:品牌）
 * ============================================================ */
(function (global) {
    'use strict';

    // 品牌库：有完整 SVG 的（BRAND_ICONS ）走品牌图标，其余走品牌色字母徽章
    var LIBRARY = [
        // 完整 SVG 图标（能显示品牌图标、徽章能表示品牌）
        { id: 'baidu', label: '百度', color: '#2932E1' },
        { id: 'google', label: '谷歌', color: '#4285F4' },
        { id: 'sogou', label: '搜狗', color: '#FB6022' },
        { id: 'zhihu', label: '知乎', color: '#0084FF' },
        { id: 'sinaweibo', label: '微博', color: '#E6162D' },
        { id: 'taobao', label: '淘宝', color: '#E94F20' },
        { id: 'github', label: 'GitHub', color: '#ffffff' },
        { id: 'bilibili', label: '哔哩哔哩', color: '#00A1D6' },
        // 品牌色字母徽章
        { id: 'bing', label: '必应', color: '#008373' },
        { id: 'jd', label: '京东', color: '#E1251B' },
        { id: '360', label: '360', color: '#E2001A' },
        // 其他常用品牌（品牌色字母徽章）
        { id: 'douyin', label: '抖音', color: '#000000' },
        { id: 'xiaohongshu', label: '小红书', color: '#FF2442' },
        { id: 'wechat', label: '微信', color: '#07C160' },
        { id: 'qq', label: 'QQ', color: '#12B7F5' },
        { id: 'dingtalk', label: '钉钉', color: '#1677FF' },
        { id: 'feishu', label: '飞书', color: '#3370FF' },
        { id: 'wework', label: '企业微信', color: '#0084FF' },
        { id: 'weibo', label: '微博', color: '#E6162D' },
        { id: 'baidu-pan', label: '百度网盘', color: '#06A0FF' },
        { id: 'aliyundrive', label: '阿里云盘', color: '#3370FF' },
        { id: 'quark', label: '夸克', color: '#2D6EF5' },
        { id: 'cainiao', label: '菜鸟', color: '#FF6E00' },
        { id: 'twitter', label: 'Twitter', color: '#1DA1F2' },
        { id: 'facebook', label: 'Facebook', color: '#1877F2' },
        { id: 'youtube', label: 'YouTube', color: '#FF0000' },
        { id: 'instagram', label: 'Instagram', color: '#E4405F' },
        { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2' },
        { id: 'pinterest', label: 'Pinterest', color: '#E60023' },
        { id: 'reddit', label: 'Reddit', color: '#FF4500' },
        { id: 'telegram', label: 'Telegram', color: '#0088CC' },
        { id: 'discord', label: 'Discord', color: '#5865F2' },
        { id: 'whatsapp', label: 'WhatsApp', color: '#25D366' },
        { id: 'messenger', label: 'Messenger', color: '#0084FF' },
        { id: 'slack', label: 'Slack', color: '#4A154B' },
        { id: 'microsoft', label: 'Microsoft', color: '#5E5E5E' },
        { id: 'apple', label: 'Apple', color: '#000000' },
        { id: 'amazon', label: 'Amazon', color: '#FF9900' },
        { id: 'spotify', label: 'Spotify', color: '#1DB954' },
        { id: 'netflix', label: 'Netflix', color: '#E50914' },
        { id: 'docker', label: 'Docker', color: '#2496ED' },
        { id: 'stackoverflow', label: 'Stack Overflow', color: '#F48024' },
        { id: 'gitlab', label: 'GitLab', color: '#FC6D26' },
        { id: 'notion', label: 'Notion', color: '#000000' },
        { id: 'figma', label: 'Figma', color: '#F24E1E' },
        { id: 'sketch', label: 'Sketch', color: '#F7B500' },
        { id: 'dribbble', label: 'Dribbble', color: '#EA4C89' },
        { id: 'behance', label: 'Behance', color: '#1769FF' },
        { id: 'medium', label: 'Medium', color: '#000000' },
        { id: 'wordpress', label: 'WordPress', color: '#21759B' },
        { id: 'stripe', label: 'Stripe', color: '#635BFF' },
        { id: 'paypal', label: 'PayPal', color: '#003087' },
        { id: 'cloudflare', label: 'Cloudflare', color: '#F38020' },
        { id: 'aws', label: 'AWS', color: '#FF9900' },
        { id: 'azure', label: 'Azure', color: '#0078D4' }
    ];

    var mask = null;
    var grid = null;
    var urlInput = null;
    var targetInput = null; // 当前正在配置的表单输入框
    var selected = ''; // 当前弹窗内选中值

    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text !== undefined) n.textContent = text;
        return n;
    }

    function renderGrid() {
        grid.innerHTML = '';
        var hasBrandSvg = (typeof Icons !== 'undefined' && Icons.hasBrandSvg) ? Icons.hasBrandSvg : null;
        LIBRARY.forEach(function (item) {
            var cell = el('div', 'icon-picker-cell');
            cell.setAttribute('data-id', item.id);
            cell.setAttribute('role', 'button');
            cell.setAttribute('tabindex', '0');
            // 预览：BRAND_ICONS 中有 SVG 的品牌渲染完整图标，其余用品牌色字母徽章
            var preview;
            if (hasBrandSvg && hasBrandSvg(item.id)) {
                preview = document.createElement('span');
                preview.className = 'icon-picker-preview';
                preview.innerHTML = Icons.svg(item.id, '1.2em', item.color);
            } else {
                preview = el('span', 'icon-picker-preview icon-picker-preview--badge', item.label.charAt(0));
                preview.style.setProperty('--badge-color', item.color);
            }
            cell.appendChild(preview);
            cell.appendChild(el('span', 'icon-picker-cell-name', item.label));
            cell.addEventListener('click', function () {
                select(item.id);
            });
            cell.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(item.id); }
            });
            grid.appendChild(cell);
        });
    }

    function select(id) {
        selected = 'si:' + id;
        var cells = grid.querySelectorAll('.icon-picker-cell');
        for (var i = 0; i < cells.length; i++) {
            cells[i].classList.toggle('active', cells[i].getAttribute('data-id') === id);
        }
    }

    function open(target) {
        targetInput = target;
        selected = '';
        if (urlInput) urlInput.value = '';
        var cur = target ? target.value : '';
        if (cur && cur.indexOf('si:') === 0) {
            var id = cur.slice(3);
            select(id);
        } else if (cur && cur.indexOf('http') === 0) {
            urlInput.value = cur;
        }
        renderGrid();
        mask.style.display = 'flex';
    }

    function close() {
        mask.style.display = 'none';
        targetInput = null;
    }

    function confirm() {
        if (!targetInput) return;
        var val = selected;
        if (!val && urlInput && urlInput.value.trim()) {
            val = urlInput.value.trim();
        }
        targetInput.value = val || '';
        close();
    }

    function init() {
        mask = document.getElementById('icon-picker-mask');
        if (!mask) return;
        grid = document.getElementById('icon-picker-grid');
        urlInput = document.getElementById('icon-picker-url');

        // 所有 [data-icon-pick] 按钮打开弹窗（事件委托）
        document.addEventListener('click', function (e) {
            var btn = e.target.closest ? e.target.closest('[data-icon-pick]') : null;
            if (btn) {
                e.preventDefault();
                // 找同表单内的 name=icon 输入框
                var form = btn.closest('.add_content, .froms');
                var input = form ? form.querySelector('input[name="icon"]') : null;
                open(input || btn.previousElementSibling);
            }
        });

        document.getElementById('icon-picker-close').addEventListener('click', close);
        document.getElementById('icon-picker-ok').addEventListener('click', confirm);
        document.getElementById('icon-picker-clear').addEventListener('click', function () {
            if (targetInput) targetInput.value = '';
            close();
        });
        mask.addEventListener('click', function (e) {
            if (e.target === mask) close();
        });
        // Esc 关闭
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mask.style.display !== 'none') close();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(window);
