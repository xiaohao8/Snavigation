/* OptionWheel 弧形滚轮（React Bits OptionWheel 原生 JS 复刻）
   功能：垂直弧形列表，滚轮/拖拽/键盘/点击选择，指数平滑动画
   用法：
     var wheel = initOptionWheel(el, {
       items: [{ label: '百度', value: '1' }, ...],
       defaultIndex: 0,
       onSelect: function (index, item) { ... }
     });
     wheel.open();   // 打开并定位到当前项
     wheel.close();  // 关闭
     wheel.destroy();// 销毁（可选）
 */
(function (global) {
    'use strict';

    function initOptionWheel(container, opts) {
        opts = opts || {};
        var items = opts.items || [];
        if (!container || items.length === 0) return null;

        var cfg = {
            textColor: opts.textColor || '#a6a6a6',
            activeColor: opts.activeColor || '#ffffff',
            side: opts.side || 'left',
            fontSize: opts.fontSize || 1.6,
            spacing: opts.spacing || 1.4,
            curve: opts.curve || 1,
            tilt: opts.tilt || 6,
            blur: opts.blur || 2,
            fade: opts.fade || 0.25,
            minOpacity: opts.minOpacity || 0.05,
            smoothing: opts.smoothing || 200,
            inset: opts.inset || 36,
            loop: !!opts.loop,
            draggable: opts.draggable !== false
        };

        var remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        cfg.rowH = Math.max(cfg.fontSize * cfg.spacing * remPx, 1);

        // 容器样式变量
        container.style.setProperty('--ow-text-color', cfg.textColor);
        container.style.setProperty('--ow-active-color', cfg.activeColor);
        container.style.setProperty('--ow-font-size', cfg.fontSize + 'rem');
        container.style.setProperty('--ow-inset', cfg.inset + 'px');
        if (cfg.side === 'right') container.classList.add('option-wheel--right');

        // 创建选项 DOM
        var itemEls = [];
        items.forEach(function (item, i) {
            var el = document.createElement('div');
            el.className = 'option-wheel__item';
            el.textContent = item.label;
            el.setAttribute('role', 'option');
            el.addEventListener('click', function () {
                handleItemClick(i);
            });
            container.appendChild(el);
            itemEls.push(el);
        });

        // 状态
        var posRef = Math.min(Math.max(opts.defaultIndex || 0, 0), Math.max(items.length - 1, 0));
        var targetRef = posRef;
        var selectedRef = posRef;
        var rafRef = null;
        var lastRef = 0;
        var wheelTimerRef = null;
        var dragRef = null;
        var dragMovedRef = false;
        var isDragging = false;
        var onChangeRef = opts.onSelect || null;

        // 单 rAF 循环：指数平滑 + 弧形布局
        function runFrame(now) {
            var dt = Math.min((now - lastRef) / 1000, 0.05);
            lastRef = now;
            var tau = Math.max(cfg.smoothing, 1) / 1000;
            var k = 1 - Math.exp(-dt / tau);

            var next = posRef + (targetRef - posRef) * k;
            var settled = Math.abs(targetRef - next) < 0.001;
            if (settled) next = targetRef;
            posRef = next;

            var n = items.length;
            var mirror = cfg.side === 'right' ? -1 : 1;
            var tiltRad = (cfg.tilt * Math.PI) / 180;
            var R = tiltRad > 0.0005 ? cfg.rowH / tiltRad : 0;

            for (var i = 0; i < n; i++) {
                var el = itemEls[i];
                if (!el) continue;
                var d = i - next;
                if (cfg.loop && n > 1) {
                    d = ((d % n) + n) % n;
                    if (d > n / 2) d -= n;
                }
                var dist = Math.abs(d);
                var x = 0;
                var y = d * cfg.rowH;
                var rot = 0;
                if (R > 0) {
                    var ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad));
                    y = R * Math.sin(ang);
                    x = -mirror * R * (1 - Math.cos(ang)) * cfg.curve;
                    rot = (mirror * ang * 180) / Math.PI;
                }
                el.style.transform = 'translate(' + x.toFixed(2) + 'px, calc(' + y.toFixed(2) + 'px - 50%)) rotate(' + rot.toFixed(3) + 'deg)';
                el.style.opacity = String(Math.max(cfg.minOpacity, 1 - dist * cfg.fade));
                var blurVal = dist * cfg.blur;
                el.style.filter = cfg.blur > 0 && blurVal > 0.01 ? 'blur(' + blurVal.toFixed(2) + 'px)' : 'none';
                el.style.setProperty('--ow-p', Math.max(0, 1 - Math.min(dist, 1)).toFixed(4));
                var isSel = Math.round(posRef) === i;
                if (isSel) el.classList.add('option-wheel__item--selected');
                else el.classList.remove('option-wheel__item--selected');
                if (el.getAttribute('aria-selected') !== String(isSel)) {
                    el.setAttribute('aria-selected', String(isSel));
                }
            }

            rafRef = settled ? null : requestAnimationFrame(runFrame);
        }

        function startLoop() {
            if (rafRef != null) cancelAnimationFrame(rafRef);
            lastRef = performance.now();
            rafRef = requestAnimationFrame(runFrame);
        }

        // 应用目标位置（可选吸附取整）
        function applyTarget(value, snap) {
            var v = value;
            if (!cfg.loop) v = Math.min(Math.max(v, 0), Math.max(items.length - 1, 0));
            if (snap) v = Math.round(v);
            targetRef = v;
            var idx = ((Math.round(v) % items.length) + items.length) % items.length;
            if (idx !== selectedRef) {
                selectedRef = idx;
                if (onChangeRef) onChangeRef(idx, items[idx]);
            }
            startLoop();
        }

        function handleItemClick(index) {
            if (dragMovedRef) return;
            var cur = targetRef;
            var d = index - (((cur % items.length) + items.length) % items.length);
            if (cfg.loop && items.length > 1) {
                if (d > items.length / 2) d -= items.length;
                else if (d < -items.length / 2) d += items.length;
            }
            applyTarget(cur + d, true);
        }

        // 滚轮事件（非 passive，可 preventDefault）
        var onWheel = function (e) {
            e.preventDefault();
            var delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY;
            var step = Math.max(-1, Math.min(1, delta / cfg.rowH));
            applyTarget(targetRef + step, false);
            if (wheelTimerRef) clearTimeout(wheelTimerRef);
            wheelTimerRef = setTimeout(function () {
                applyTarget(targetRef, true);
            }, 140);
        };
        container.addEventListener('wheel', onWheel, { passive: false });

        // 指针拖拽
        var onPointerDown = function (e) {
            if (!cfg.draggable) return;
            dragRef = { y: e.clientY, start: targetRef, id: e.pointerId };
            dragMovedRef = false;
            isDragging = true;
            container.classList.add('option-wheel--dragging');
        };
        var onPointerMove = function (e) {
            var drag = dragRef;
            if (!drag) return;
            var dy = e.clientY - drag.y;
            if (!dragMovedRef && Math.abs(dy) > 4) {
                dragMovedRef = true;
                try { container.setPointerCapture(drag.id); } catch (err) { /* ignore */ }
            }
            if (dragMovedRef) applyTarget(drag.start - dy / cfg.rowH, false);
        };
        var onPointerEnd = function () {
            if (!dragRef) return;
            dragRef = null;
            isDragging = false;
            container.classList.remove('option-wheel--dragging');
            if (dragMovedRef) applyTarget(targetRef, true);
        };
        container.addEventListener('pointerdown', onPointerDown);
        container.addEventListener('pointermove', onPointerMove);
        container.addEventListener('pointerup', onPointerEnd);
        container.addEventListener('pointercancel', onPointerEnd);

        // 键盘上下键
        var onKeyDown = function (e) {
            var delta = null;
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') delta = -1;
            else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') delta = 1;
            if (delta == null) return;
            e.preventDefault();
            applyTarget(Math.round(targetRef) + delta, true);
        };
        container.addEventListener('keydown', onKeyDown);

        // 公开 API
        return {
            open: function (index) {
                if (rafRef != null) cancelAnimationFrame(rafRef);
                container.classList.add('option-wheel');
                if (typeof index === 'number') {
                    posRef = index;
                    targetRef = index;
                    selectedRef = index;
                }
                // 立即同步渲染一帧，打开瞬间布局即正确（无需等待 rAF）
                lastRef = performance.now();
                runFrame(lastRef);
            },
            close: function () {
                if (rafRef != null) cancelAnimationFrame(rafRef);
                rafRef = null;
            },
            select: function (index) {
                applyTarget(index, true);
            },
            getSelected: function () {
                return selectedRef;
            },
            destroy: function () {
                if (rafRef != null) cancelAnimationFrame(rafRef);
                if (wheelTimerRef) clearTimeout(wheelTimerRef);
                container.removeEventListener('wheel', onWheel);
                container.removeEventListener('pointerdown', onPointerDown);
                container.removeEventListener('pointermove', onPointerMove);
                container.removeEventListener('pointerup', onPointerEnd);
                container.removeEventListener('pointercancel', onPointerEnd);
                container.removeEventListener('keydown', onKeyDown);
                container.innerHTML = '';
            }
        };
    }

    global.initOptionWheel = initOptionWheel;
})(window);
