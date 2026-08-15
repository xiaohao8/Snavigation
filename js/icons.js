/* ============================================================
 * 图标系统 v2（适配网站导航场景）
 * ------------------------------------------------------------
 * · 搜索引擎图标：品牌 SVG + 官方品牌色（simple-icons 数据）
 * · 无品牌 SVG（必应/京东/360）与自定义引擎：品牌色首字徽章
 * · 网站快捷方式/书签：favicon（dnspod → favicon.im 多源回退）
 *   + 彩色首字底（favicon 加载失败时露出）
 * · 功能图标（设置/搜索/编辑/删除等）：Lucide 线条
 * ============================================================ */
(function (global) {
    'use strict';

    // 品牌映射：title → sprite symbol 名 + 品牌色
    // 颜色来源：simple-icons 官方 _data（hex）
    var BRAND_ICONS = {
        '百度': { id: 'baidu', color: '#2932E1' },
        '谷歌': { id: 'google', color: '#4285F4' },
        '搜狗': { id: 'sogou', color: '#FB6022' },
        '知乎': { id: 'zhihu', color: '#0084FF' },
        '微博': { id: 'sinaweibo', color: '#E6162D' },
        '淘宝': { id: 'taobao', color: '#E94F20' },
        'GitHub': { id: 'github', color: '#ffffff' }, // GitHub 官方黑在深色 UI 不可见，用白
        '哔哩哔哩': { id: 'bilibili', color: '#00A1D6' }
    };

    // 徽章品牌色（无 simple-icons 图标的品牌，含旧 class 兼容键）
    var BADGE_COLORS = {
        '必应': '#008373', 'bing': '#008373',
        '京东': '#E1251B', 'jd': '#E1251B',
        '360': '#E2001A'
    };

    // 兼容历史 cookie 中的旧 iconfont class
    var LEGACY_MAP = {
        'iconfont icon-baidu': 'baidu',
        'iconfont icon-bing': 'bing',
        'iconfont icon-google': 'google',
        'iconfont icon-sougousousuo': 'sogou',
        'iconfont icon-360sousuo': '360',
        'iconfont icon-xinlangweibo': 'sinaweibo',
        'iconfont icon-zhihu': 'zhihu',
        'iconfont icon-taobao': 'taobao',
        'iconfont icon-jingdong': 'jd',
        'iconfont icon-github': 'github',
        'iconfont icon-bilibilidonghua': 'bilibili'
    };

    // 功能图标快捷名（Lucide symbol）
    var UI_ICONS = {
        settings: 'ic-settings',
        search: 'ic-search',
        home: 'ic-house',
        pencil: 'ic-pencil',
        trash: 'ic-trash-2',
        plus: 'ic-plus',
        globe: 'ic-globe',
        bookmark: 'ic-bookmark',
        close: 'ic-x',
        grid: 'ic-layout-grid',
        layers: 'ic-layers'
    };

    // 网站快捷方式配色池（12 色，按名称 hash 稳定分配）
    var COLOR_POOL = [
        '#2932E1', '#4285F4', '#FB6022', '#0084FF', '#E6162D', '#E94F20',
        '#00A1D6', '#008373', '#E1251B', '#7C4DFF', '#00B96B', '#FF6F00'
    ];

    function hashStr(s) {
        var h = 0;
        if (!s) return 0;
        for (var i = 0; i < s.length; i++) {
            h = ((h << 5) - h + s.charCodeAt(i)) | 0;
        }
        return Math.abs(h);
    }

    // 名称 → 稳定配色（优先品牌/徽章色，否则配色池 hash）
    function colorOf(name) {
        if (BRAND_ICONS[name]) return BRAND_ICONS[name].color;
        if (BADGE_COLORS[name]) return BADGE_COLORS[name];
        return COLOR_POOL[hashStr(name) % COLOR_POOL.length];
    }

    // 渲染 SVG 图标字符串
    // name: 'baidu' | 'settings' | 'ic-xxx'；color: 品牌色（默认 currentColor）
    function svgIcon(name, size, color) {
        size = size || '1em';
        var id;
        if (UI_ICONS[name]) {
            id = UI_ICONS[name];
        } else if (name && name.indexOf('ic-') === 0) {
            id = name;
        } else {
            id = 'ic-' + (name || 'globe');
        }
        var style = 'width:' + size + ';height:' + size;
        if (color) style += ';color:' + color;
        return '<svg class="isvg" style="' + style + '" aria-hidden="true"><use href="#' + id + '"/></svg>';
    }

    // 首字徽章（品牌色底 或 深色玻璃）
    // mode: 'brand'(彩色底) | 'glass'(玻璃)
    function badgeHtml(ch, size, color) {
        size = size || '1em';
        var style = 'font-size:' + size + ';';
        if (color) style += '--badge-color:' + color + ';';
        return '<span class="ibadge ibadge--' + (color ? 'brand' : 'glass') + '" style="' + style + '">' + ch + '</span>';
    }

    // 引擎图标：si:品牌 / URL 配置优先，否则用原 iconfont class
    function engineIcon(iconClass, title) {
        // 1) 显式配置：si:品牌 → 品牌 SVG
        if (iconClass && iconClass.indexOf('si:') === 0) {
            var id = iconClass.slice(3);
            for (var t in BRAND_ICONS) {
                if (BRAND_ICONS[t].id === id) {
                    return svgIcon(id, '1em', BRAND_ICONS[t].color);
                }
            }
            return badgeHtml(id.charAt(0).toUpperCase(), '1em', BADGE_COLORS[id] || '#888888');
        }
        // 2) 显式配置：图标 URL → img
        if (iconClass && iconClass.indexOf('http') === 0) {
            return '<img class="engine-fav" src="' + iconClass + '" alt="" onerror="this.style.display=\'none\'">';
        }
        // 3) 默认：原 iconfont class（icon-baidu 等）
        return '<i class="' + (iconClass || 'iconfont icon-wangluo') + '"></i>';
    }

    // 提取域名（含二级域：github.com、www.baidu.com → baidu.com）
    function extractDomain(url) {
        if (!url) return '';
        var m = url.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?([^:\/\n?]+)/i);
        if (!m) return '';
        return m[1].toLowerCase();
    }

    // favicon URL（主 dnspod，回退 favicon.im）
    function faviconUrl(domain) {
        return 'https://statics.dnspod.cn/proxy_favicon/_/favicon?domain=' + domain;
    }

    // 网站图标：favicon 字段优先（si:品牌 / URL / 自动 dnspod）
    // 返回：<span class="q-icon" style="--qic:#色"><span class="q-icon-char">首字</span><img class="q-favicon" src="..." onerror="..."></span>
    function siteIcon(url, title, size, favicon) {
        size = size || 36;
        var w = size + 'px', h = size + 'px';

        // favicon = si:品牌 → 白底 + 品牌 SVG
        if (favicon && favicon.indexOf('si:') === 0) {
            var id = favicon.slice(3);
            var color = '#888888';
            for (var t in BRAND_ICONS) {
                if (BRAND_ICONS[t].id === id) { color = BRAND_ICONS[t].color; break; }
            }
            if (BADGE_COLORS[id]) color = BADGE_COLORS[id];
            var inner;
            if (BRAND_ICONS['必应'] && id === 'bing') {
                inner = '<span class="q-icon-char" style="font-size:0.5em">B</span>';
            } else {
                inner = '<svg class="isvg" style="width:60%;height:60%;color:' + color + '"><use href="#ic-' + id + '"/></svg>';
            }
            return '<span class="q-icon q-icon--plain" style="width:' + w + ';height:' + h + '">' + inner + '</span>';
        }

        // favicon = URL → 白底 + 自定义图
        if (favicon && favicon.indexOf('http') === 0) {
            return '<span class="q-icon q-icon--plain" style="width:' + w + ';height:' + h + '">'
                + '<img class="q-favicon" src="' + favicon + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">'
                + '</span>';
        }

        // 默认：品牌色渐变底 + favicon + 首字底
        var domain = extractDomain(url);
        var ch = title ? title.charAt(0) : '·';
        var color = colorOf(title);
        var img = '';
        if (domain) {
            var fb = faviconUrl(domain);
            img = '<img class="q-favicon" src="' + fb + '" alt="" loading="lazy" onerror="if(this.src.indexOf(&quot;dnspod&quot;)>=0){this.src=&quot;https://favicon.im/' + domain + '&quot;;}else{this.style.display=&quot;none&quot;;}">';
        }
        return '<span class="q-icon" style="--qic:' + color + ';width:' + w + ';height:' + h + '">'
            + '<span class="q-icon-char">' + ch + '</span>' + img + '</span>';
    }

    // 功能图标渲染进元素
    function renderInto(el, name, size) {
        if (!el) return;
        el.innerHTML = svgIcon(name, size);
    }

    global.Icons = {
        svg: svgIcon,
        engine: engineIcon,
        ui: svgIcon,
        site: siteIcon,
        badge: badgeHtml,
        colorOf: colorOf,
        extractDomain: extractDomain,
        renderInto: renderInto
    };
})(window);
