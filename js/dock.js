/* Dock 快捷栏（React Bits Dock 原生 JS 复刻）
   功能：鼠标靠近磁性放大、弹簧动画、悬停标签提示、键盘可访问
   配置参数与 React Bits Dock 组件默认值保持一致 */
(function () {
    'use strict';

    var dockPanel = document.querySelector('.dock-panel');
    if (!dockPanel) return;

    var dockOuter = dockPanel.closest('.dock-outer');
    var items = Array.prototype.slice.call(dockPanel.querySelectorAll('.dock-item'));
    if (items.length === 0) return;

    // === 配置（对应 React Bits Dock 的 props 默认值） ===
    var CONFIG = {
        distance: 200,          // 放大影响距离(px)
        panelHeight: 68,        // 面板基础高度
        baseItemSize: 50,       // 图标基础尺寸
        dockHeight: 256,        // 容器最大高度
        magnification: 70,      // 悬停放大尺寸
        spring: { mass: 0.1, stiffness: 150, damping: 12 } // 弹簧参数
    };

    // 面板可展开的最大高度（与组件 useMemo 计算一致）
    var maxHeight = Math.max(CONFIG.dockHeight, CONFIG.magnification + CONFIG.magnification / 2 + 4);

    // === 状态 ===
    var mouseX = Infinity;       // 鼠标 X 坐标（pageX）
    var panelHovered = 0;        // 面板是否悬停
    var itemStates = items.map(function () {
        return { current: CONFIG.baseItemSize, velocity: 0 };
    });
    var panelState = { current: CONFIG.panelHeight, velocity: 0 };

    // === 弹簧步进（半隐式欧拉，等价 useSpring 物理模型） ===
    function springStep(state, target, cfg, dt) {
        var force = -cfg.stiffness * (state.current - target);
        var dampForce = -cfg.damping * state.velocity;
        var acc = (force + dampForce) / cfg.mass;
        state.velocity += acc * dt;
        state.current += state.velocity * dt;
    }

    // === 目标尺寸：距离 0 → magnification；距离 >= distance → baseItemSize（线性插值，对应 useTransform） ===
    function calcTarget(dist) {
        var d = Math.abs(dist);
        if (d >= CONFIG.distance) return CONFIG.baseItemSize;
        var t = 1 - d / CONFIG.distance;
        return CONFIG.baseItemSize + (CONFIG.magnification - CONFIG.baseItemSize) * t;
    }

    // === 动画循环 ===
    var rafId = null;
    var lastTime = 0;
    var running = false;

    function tick(now) {
        var dt = Math.min((now - lastTime) / 1000, 0.05); // 限制最大步长，避免卡顿时跳变
        lastTime = now;

        var settled = true;

        for (var i = 0; i < items.length; i++) {
            var rect = items[i].getBoundingClientRect();
            var centerX = rect.x + rect.width / 2;
            var target = calcTarget(mouseX - centerX);
            springStep(itemStates[i], target, CONFIG.spring, dt);
            var size = itemStates[i].current;
            items[i].style.width = size + 'px';
            items[i].style.height = size + 'px';
            // 任一项未到达目标或仍有速度 → 仍需继续动画
            if (Math.abs(size - target) > 0.05 || Math.abs(itemStates[i].velocity) > 0.05) {
                settled = false;
            }
        }

        var panelTarget = panelHovered === 1 ? maxHeight : CONFIG.panelHeight;
        springStep(panelState, panelTarget, CONFIG.spring, dt);
        if (dockOuter) {
            dockOuter.style.height = panelState.current + 'px';
        }
        if (Math.abs(panelState.current - panelTarget) > 0.05 || Math.abs(panelState.velocity) > 0.05) {
            settled = false;
        }

        // 全部静止后停止 rAF，避免每帧强制重排（移动端开合面板卡顿的主因）
        if (settled) {
            rafId = null;
            running = false;
            return;
        }

        rafId = requestAnimationFrame(tick);
    }

    function start() {
        if (running) return; // 已在运行则不再重复启动
        running = true;
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
    }

    // === 鼠标交互 ===
    // 仅在「可悬停 + 精确指针」设备（桌面鼠标）启用磁性放大/弹簧动画。
    // 触屏手机上 tap 会触发合成 mousemove 但没有 mouseleave，导致 dock 膨胀(256px)、
    // 布局错乱 + 持续重排卡顿——移动端改为纯静态按钮栏，点击仍可正常导航。
    var hoverCapable = false;
    try {
        hoverCapable = !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    } catch (e) {
        hoverCapable = false;
    }

    if (hoverCapable) {
        dockPanel.addEventListener('mousemove', function (e) {
            panelHovered = 1;
            mouseX = e.pageX;
            start();
        });

        dockPanel.addEventListener('mouseleave', function () {
            panelHovered = 0;
            mouseX = Infinity;
            start();
        });
    }

    // === 键盘可访问（Enter / Space 触发） ===
    items.forEach(function (item, i) {
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });

    // === 点击动作绑定（data-action）：三页导航 ===
    var ACTIONS = {
        // 首页：隐藏快捷方式与设置面板，回到纯搜索界面
        home: function () {
            if (typeof closeBox === 'function') closeBox();
            if (typeof closeSet === 'function') closeSet();
            if (typeof blurWd === 'function') blurWd();
        },
        // 快捷方式页：显示/隐藏快捷方式面板
        shortcuts: function () {
            var mark = document.querySelector('.mark');
            if (!mark) return;
            if (mark.style.display !== 'none') {
                // 当前显示 → 收起
                if (typeof closeBox === 'function') closeBox();
            } else {
                // 若设置面板打开则先关闭
                if (typeof closeSet === 'function') closeSet();
                if (typeof openBox === 'function') openBox();
            }
        },
        // 设置页：显示/隐藏设置面板（含内容加载）
        settings: function () {
            var setPanel = document.querySelector('.set');
            if (!setPanel) return;
            if (setPanel.style.display !== 'none') {
                if (typeof closeSet === 'function') closeSet();
            } else {
                if (typeof openSet === 'function') openSet();
                if (typeof setSeInit === 'function') setSeInit(); //搜索引擎设置
                if (typeof setQuickInit === 'function') setQuickInit(); //快捷方式设置
            }
        }
    };

    dockPanel.addEventListener('click', function (e) {
        var item = e.target.closest('.dock-item');
        if (!item) return;
        var action = item.getAttribute('data-action');
        var handler = ACTIONS[action];
        if (handler) {
            handler(item);
        }
    });

    // 初始渲染一次（确保尺寸正确）；移动端不启动弹簧循环，保持纯 CSS 静态尺寸
    if (hoverCapable) {
        start();
    }
})();
