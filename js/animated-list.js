/* ============================================================
 * AnimatedList 滚动列表（React Bits AnimatedList 原生 JS 复刻）
 * ------------------------------------------------------------
 * 组件：initAnimatedList(container, options)
 *   options: {
 *     items: [{title, url, icon?}],
 *     onItemSelect(item, index),
 *     showGradients, enableArrowNavigation, displayScrollbar,
 *     initialSelectedIndex
 *   }
 *   返回 { setItems(items), getSelected(), destroy() }
 *
 * 书签面板：右上角设置按钮展开，显示常用网站书签（与快捷方式同源）
 * ============================================================ */
(function (global) {
    'use strict';

    // ---- 通用工具 ----
    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    // ---- AnimatedList 组件 ----
    function initAnimatedList(container, opts) {
        opts = opts || {};
        var showGradients = opts.showGradients !== false;
        var enableArrowNavigation = opts.enableArrowNavigation !== false;
        var displayScrollbar = opts.displayScrollbar !== false;
        var onItemSelect = opts.onItemSelect || null;
        var items = opts.items || [];
        var selectedIndex = typeof opts.initialSelectedIndex === 'number' ? opts.initialSelectedIndex : -1;
        var keyboardNav = false;

        // 容器结构
        var wrap = el('div', 'scroll-list-container ' + (opts.className || ''));
        var list = el('div', 'scroll-list' + (displayScrollbar ? '' : ' no-scrollbar'));
        var topGradient = el('div', 'top-gradient');
        var bottomGradient = el('div', 'bottom-gradient');
        list.style.height = opts.maxHeight || '46vh';
        wrap.appendChild(list);
        if (showGradients) {
            topGradient.style.opacity = '0';
            bottomGradient.style.opacity = items.length > 6 ? '1' : '0';
            wrap.appendChild(topGradient);
            wrap.appendChild(bottomGradient);
        }
        container.appendChild(wrap);

        // 滚动 → 渐变遮罩透明度
        function handleScroll() {
            var scrollTop = list.scrollTop;
            var scrollHeight = list.scrollHeight;
            var clientHeight = list.clientHeight;
            topGradient.style.opacity = String(Math.min(scrollTop / 50, 1));
            bottomGradient.style.opacity = scrollHeight <= clientHeight ? '0' : String(Math.min((scrollHeight - scrollTop - clientHeight) / 50, 1));
        }
        list.addEventListener('scroll', handleScroll);

        // 渲染条目
        var itemNodes = [];
        function render() {
            list.innerHTML = '';
            itemNodes = [];
            if (!items || items.length === 0) {
                var empty = el('div', 'bm-empty', '暂无书签，点击下方"管理书签"添加');
                list.appendChild(empty);
                return;
            }
            items.forEach(function (item, index) {
                var itemEl = el('div', 'bm-item ' + (opts.itemClassName || ''));
                itemEl.setAttribute('data-index', index);
                itemEl.style.transitionDelay = Math.min(index * 0.03, 0.3) + 's';
                itemEl.style.marginBottom = '1rem';
                if (item.icon) {
                    itemEl.appendChild(el('i', 'iconfont bm-item-icon ' + item.icon));
                } else {
                    itemEl.appendChild(el('span', 'bm-item-icon', item.title ? item.title.charAt(0) : '·'));
                }
                itemEl.appendChild(el('p', 'bm-item-text', item.title));
                itemEl.addEventListener('mouseenter', function () {
                    setSelected(index, true);
                });
                itemEl.addEventListener('click', function () {
                    setSelected(index, true);
                    if (onItemSelect) onItemSelect(item, index);
                });
                list.appendChild(itemEl);
                itemNodes.push(itemEl);
            });
            // 入场动画：下一帧加 .visible（scale 0.7→1 + opacity 0→1）
            requestAnimationFrame(function () {
                itemNodes.forEach(function (node) {
                    node.classList.add('visible');
                });
            });
            updateSelectedClass();
            handleScroll();
        }

        function updateSelectedClass() {
            itemNodes.forEach(function (node, i) {
                node.classList.toggle('selected', i === selectedIndex);
            });
        }

        function setSelected(index, fromMouse) {
            selectedIndex = index;
            if (!fromMouse) keyboardNav = true;
            updateSelectedClass();
            scrollSelectedIntoView();
            if (fromMouse) keyboardNav = false;
        }

        // 选中项滚动到可视区域（与原版 extraMargin=50 一致）
        function scrollSelectedIntoView() {
            if (selectedIndex < 0 || !itemNodes[selectedIndex]) return;
            var container = list;
            var selectedItem = itemNodes[selectedIndex];
            // 兼容不支持 scrollTo 的环境（如部分测试/旧浏览器）
            if (typeof container.scrollTo !== 'function') return;
            var extraMargin = 50;
            var containerScrollTop = container.scrollTop;
            var containerHeight = container.clientHeight;
            var itemTop = selectedItem.offsetTop;
            var itemBottom = itemTop + selectedItem.offsetHeight;
            if (itemTop < containerScrollTop + extraMargin) {
                container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
            } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
                container.scrollTo({ top: itemBottom - containerHeight + extraMargin, behavior: 'smooth' });
            }
            keyboardNav = false;
        }

        // 键盘导航（Arrow/Tab/Enter），与原版一致挂在 window
        function handleKeyDown(e) {
            if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
                e.preventDefault();
                keyboardNav = true;
                setSelected(Math.min(selectedIndex + 1, items.length - 1), false);
            } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
                e.preventDefault();
                keyboardNav = true;
                setSelected(Math.max(selectedIndex - 1, 0), false);
            } else if (e.key === 'Enter') {
                if (selectedIndex >= 0 && selectedIndex < items.length) {
                    e.preventDefault();
                    if (onItemSelect) onItemSelect(items[selectedIndex], selectedIndex);
                }
            }
        }
        if (enableArrowNavigation) {
            window.addEventListener('keydown', handleKeyDown);
        }

        render();

        return {
            setItems: function (newItems) {
                items = newItems || [];
                selectedIndex = -1;
                render();
            },
            getSelected: function () {
                return selectedIndex;
            },
            getItems: function () {
                return items;
            },
            destroy: function () {
                if (enableArrowNavigation) {
                    window.removeEventListener('keydown', handleKeyDown);
                }
                list.removeEventListener('scroll', handleScroll);
                wrap.parentNode && wrap.parentNode.removeChild(wrap);
            }
        };
    }

    // ---- 书签面板（右上角） ----
    var panel = null;
    var panelList = null;
    var listInstance = null;

    function buildPanel() {
        panel = el('div', 'bm-panel');
        panel.id = 'bookmark-panel';

        var header = el('div', 'bm-panel-header');
        header.appendChild(el('span', 'bm-panel-title', '书签'));
        var closeBtn = el('button', 'bm-panel-close', '×');
        closeBtn.setAttribute('aria-label', '关闭');
        closeBtn.addEventListener('click', function () {
            closePanel();
        });
        header.appendChild(closeBtn);
        panel.appendChild(header);

        var listWrap = el('div');
        listWrap.style.position = 'relative';
        panel.appendChild(listWrap);

        var footer = el('div', 'bm-panel-footer');
        var manageBtn = el('button', 'bm-manage-btn', '⚙ 管理书签');
        manageBtn.addEventListener('click', function () {
            closePanel();
            if (typeof openBookmarkManage === 'function') openBookmarkManage();
        });
        footer.appendChild(manageBtn);
        panel.appendChild(footer);

        document.body.appendChild(panel);
        listWrap.id = 'bookmark-list-wrap';

        listInstance = initAnimatedList(listWrap, {
            items: [],
            showGradients: true,
            enableArrowNavigation: true,
            displayScrollbar: true,
            onItemSelect: function (item) {
                if (item && item.url) {
                    try {
                        window.open(item.url, '_blank');
                    } catch (e) {
                        // 弹窗被拦截或环境不支持时忽略，仍正常关闭面板
                    }
                }
                closePanel();
            }
        });
    }

    // 读取书签数据（与快捷方式 quick_list 同源）
    function getBookmarkItems() {
        var quick = null;
        if (typeof getQuickList === 'function') {
            quick = getQuickList();
        }
        var list = [];
        if (quick) {
            Object.keys(quick).forEach(function (key) {
                var q = quick[key];
                if (q && q.title && q.url) {
                    list.push({ title: q.title, url: q.url, icon: q.icon || '' });
                }
            });
        }
        return list;
    }

    function openPanel() {
        if (!panel) buildPanel();
        if (listInstance) {
            listInstance.setItems(getBookmarkItems());
        }
        panel.classList.add('open');
    }

    function closePanel() {
        if (panel) panel.classList.remove('open');
    }

    function togglePanel() {
        if (panel && panel.classList.contains('open')) {
            closePanel();
        } else {
            openPanel();
        }
    }

    // ---- 暴露全局 ----
    global.AnimatedList = {
        init: initAnimatedList
    };
    global.BookmarkPanel = {
        open: openPanel,
        close: closePanel,
        toggle: togglePanel,
        refresh: function () {
            if (listInstance) listInstance.setItems(getBookmarkItems());
        }
    };
})(window);
