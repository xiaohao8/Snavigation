/* ============================================================
 * 图标库选择器（favicon 配置通用组件）
 * ------------------------------------------------------------
 * 用法：页面中任何 <input name="icon"> 旁的 [data-icon-pick] 按钮
 * 点击打开弹窗：可粘贴图标 URL，或从品牌库选择（写入 si:品牌）
 * ============================================================ */
(function (global) {
    'use strict';

    // 品牌库（sprite symbol 名 + 显示名 + 品牌色）
    var LIBRARY = [
        { id: 'baidu', label: '百度', color: '#2932E1' },
        { id: 'google', label: '谷歌', color: '#4285F4' },
        { id: 'sogou', label: '搜狗', color: '#FB6022' },
        { id: 'zhihu', label: '知乎', color: '#0084FF' },
        { id: 'sinaweibo', label: '微博', color: '#E6162D' },
        { id: 'taobao', label: '淘宝', color: '#E94F20' },
        { id: 'github', label: 'GitHub', color: '#ffffff' },
        { id: 'bilibili', label: '哔哩哔哩', color: '#00A1D6' },
        { id: 'bing', label: '必应', color: '#008373' },
        { id: 'jd', label: '京东', color: '#E1251B' },
        { id: '360', label: '360', color: '#E2001A' }
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
        LIBRARY.forEach(function (item) {
            var cell = el('div', 'icon-picker-cell');
            cell.setAttribute('data-id', item.id);
            cell.setAttribute('role', 'button');
            cell.setAttribute('tabindex', '0');
            // 预览：品牌 SVG 或字母徽章
            var preview;
            if (typeof Icons !== 'undefined' && LIBRARY.some(function (b) { return b.id === item.id && b.id !== 'bing' && b.id !== 'jd' && b.id !== '360'; })) {
                preview = document.createElement('span');
                preview.className = 'icon-picker-preview';
                preview.innerHTML = Icons.svg(item.id, '1.2em', item.color);
            } else {
                preview = el('span', 'icon-picker-preview icon-picker-preview--badge', item.id.charAt(0).toUpperCase());
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
