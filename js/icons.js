/* ============================================================
 * 图标系统 v2（适配网站导航场景）
 * ------------------------------------------------------------
 * · 搜索引擎图标：品牌 SVG + 官方品牌色（simple-icons 数据）
 * · 无品牌 SVG（必应/京东/360）与自定义引擎：品牌色首字徽章
 * · 网站快捷方式/书签：favicon（本地预下载优先 → Gitee 镜像 raw CDN 回退 → favicon.im → 彩色首字底；页面打开后后台预加载，不等面板打开）
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

    // HTML / 属性转义：siteIcon / engineIcon 的所有用户输入（title/url/favicon）必须先转义
    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
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
        return '<svg class="isvg" style="' + style + '" aria-hidden="true"><use href="#' + esc(id) + '"/></svg>';
    }

    // 首字徽章（品牌色底 或 深色玻璃）
    // mode: 'brand'(彩色底) | 'glass'(玻璃)
    function badgeHtml(ch, size, color) {
        size = size || '1em';
        var style = 'font-size:' + size + ';';
        if (color) style += '--badge-color:' + color + ';';
        return '<span class="ibadge ibadge--' + (color ? 'brand' : 'glass') + '" style="' + style + '">' + esc(ch) + '</span>';
    }

    // 引擎图标：si:品牌 / URL 配置优先，否则用原 iconfont class
    function engineIcon(iconClass, title) {
        iconClass = String(iconClass || '');
        // 1) 显式配置：si:品牌 → 品牌 SVG
        if (iconClass.indexOf('si:') === 0) {
            var id = iconClass.slice(3);
            for (var t in BRAND_ICONS) {
                if (BRAND_ICONS[t].id === id) {
                    return svgIcon(id, '1em', BRAND_ICONS[t].color);
                }
            }
            return badgeHtml(id.charAt(0).toUpperCase(), '1em', BADGE_COLORS[id] || '#888888');
        }
        // 2) 显式配置：图标 URL → img（转义防属性注入）
        if (iconClass.indexOf('http') === 0) {
            return '<img class="engine-fav" src="' + esc(iconClass) + '" alt="" onerror="this.style.display=\'none\'">';
        }
        // 3) 默认：原 iconfont class（icon-baidu 等）
        return '<i class="' + esc(iconClass || 'iconfont icon-wangluo') + '"></i>';
    }

    // 提取域名（含二级域：github.com、www.baidu.com → baidu.com）
    function extractDomain(url) {
        if (!url) return '';
        var m = url.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?([^:\/\n?]+)/i);
        if (!m) return '';
        return m[1].toLowerCase();
    }

    // 本地预下载 favicon 映射：domain -> 扩展名（png/svg/ico/webp）
    var FAV_MAP = {
        '10minutemail.net': 'png',
        'animate.style': 'png',
        'chat.deepseek.com': 'png',
        'chat.openai.com': 'webp',
        'chatglm.cn': 'ico',
        'cli.im': 'ico',
        'convertio.co': 'png',
        'cowtransfer.com': 'png',
        'dnschecker.org': 'png',
        'ebook.huzerui.com': 'svg',
        'github.com': 'svg',
        'hailuoai.video': 'png',
        'i.chaoxing.com': 'png',
        'ke.qq.com': 'svg',
        'kimi.moonshot.cn': 'ico',
        'mail.163.com': 'ico',
        'mail.aliyun.com': 'ico',
        'mail.qq.com': 'png',
        'metaso.cn': 'png',
        'music.163.com': 'ico',
        'next.itellyou.cn': 'ico',
        'open.163.com': 'png',
        's.threatbook.cn': 'ico',
        'spline.design': 'png',
        'stackoverflow.com': 'png',
        'test.ustc.edu.cn': 'ico',
        'tieba.baidu.com': 'ico',
        'tinypng.com': 'png',
        'tiomg.org': 'svg',
        'tongyi.aliyun.com': 'png',
        'tool.chinaz.com': 'ico',
        'tophub.today': 'png',
        'undraw.co': 'svg',
        'v.qq.com': 'png',
        'vercel.com': 'png',
        'vocalremover.org': 'ico',
        'wallhaven.cc': 'ico',
        'weibo.com': 'ico',
        'whois.chinaz.com': 'png',
        'write.imsyy.top': 'svg',
        'www.aconvert.com': 'ico',
        'www.bejson.com': 'ico',
        'www.bilibili.com': 'png',
        'www.chongbuluo.com': 'ico',
        'www.dnspod.cn': 'ico',
        'www.dooccn.com': 'svg',
        'www.douban.com': 'ico',
        'www.doubao.com': 'png',
        'www.douyin.com': 'ico',
        'www.figma.com': 'png',
        'www.huya.com': 'ico',
        'www.iconfont.cn': 'png',
        'www.icourse163.org': 'png',
        'www.ilovepdf.com': 'png',
        'www.iqiyi.com': 'ico',
        'www.itdog.cn': 'ico',
        'www.kuaishou.com': 'ico',
        'www.lanzou.com': 'png',
        'www.mgtv.com': 'png',
        'www.mianfeiduanju.com': 'svg',
        'www.netlify.com': 'png',
        'www.photopea.com': 'png',
        'www.processon.com': 'ico',
        'www.remove.bg': 'svg',
        'www.tablesgenerator.com': 'png',
        'www.toolnb.com': 'ico',
        'www.uooc.net.cn': 'png',
        'www.ximalaya.com': 'ico',
        'www.xuetangx.com': 'ico',
        'www.youku.com': 'png',
        'www.zhihu.com': 'png',
        'www.zhihuishu.com': 'ico',
        'xinghuo.xfyun.cn': 'ico',
        'y.qq.com': 'png',
        'yiyan.baidu.com': 'ico',
        'yuanbao.tencent.com': 'png',
        'zh.z-lib.org': 'svg',
        'boce.aliyun.com': 'ico',
        'jsrun.net': 'png',
        'tool.lu': 'png',
        'www.hongguoduanju.com': 'png',
        'weread.qq.com': 'png',
        'www.yuque.com': 'png',
        'www.wenshushu.cn': 'png',
    };

    // Gitee 镜像仓库的 raw 加速地址（国内 CDN：raw.giteeusercontent.com）
    // 仓库已同步至 https://gitee.com/xiaohao3/Snavigation （分支 master）
    var GITEE_RAW = 'https://gitee.com/xiaohao3/Snavigation/raw/master/img/favicons/';

    // favicon 主源：本地预下载文件（同域瞬时加载 + 浏览器缓存）
    function faviconUrl(domain) {
        var ext = FAV_MAP[domain] || 'png';
        return 'img/favicons/' + domain + '.' + ext;
    }

    // favicon 有序回退源：本地 → Gitee 镜像(raw CDN 加速) → favicon.im
    // 仅对预下载域名提供 Gitee 回退，避免未预下载域名无谓 404 跳转
    function faviconSources(domain) {
        var ext = FAV_MAP[domain] || 'png';
        var arr = ['img/favicons/' + domain + '.' + ext];
        if (FAV_MAP[domain]) {
            arr.push(GITEE_RAW + domain + '.' + ext);
        }
        arr.push('https://favicon.im/' + domain);
        return arr;
    }

    // 供 <img onerror> 调用：按 faviconSources 顺序尝试下一个源，全部失败则隐藏
    function onFavError(img, domain) {
        if (!img) return;
        var sources = faviconSources(domain);
        var tried = parseInt(img.getAttribute('data-tried') || '0', 10);
        if (tried < sources.length - 1) {
            img.setAttribute('data-tried', String(tried + 1));
            img.src = sources[tried + 1];
        } else {
            img.style.display = 'none';
        }
    }

    // 网站图标：favicon 字段优先（si:品牌 / URL / 自动 dnspod）
    // 返回：<span class="q-icon" style="--qic:#色"><span class="q-icon-char">首字</span><img class="q-favicon" src="..." data-domain="..."></span>
    function siteIcon(url, title, size, favicon) {
        size = size || 36;
        var w = size + 'px', h = size + 'px';
        favicon = String(favicon || '');
        title = String(title || '');
        url = String(url || '');

        // favicon = si:品牌 → 白底 + 品牌 SVG（id 转义防注入）
        if (favicon.indexOf('si:') === 0) {
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
                inner = '<svg class="isvg" style="width:60%;height:60%;color:' + color + '"><use href="#ic-' + esc(id) + '"/></svg>';
            }
            return '<span class="q-icon q-icon--plain" style="width:' + w + ';height:' + h + '">' + inner + '</span>';
        }

        // favicon = URL → 白底 + 自定义图（转义防属性注入）
        if (favicon.indexOf('http') === 0) {
            return '<span class="q-icon q-icon--plain" style="width:' + w + ';height:' + h + '">'
                + '<img class="q-favicon" src="' + esc(favicon) + '" alt="" onerror="this.style.display=\'none\'">'
                + '</span>';
        }

        // 默认：品牌色渐变底 + favicon + 首字底
        var domain = extractDomain(url);
        var ch = title ? title.charAt(0) : '·';
        var color = colorOf(title);
        var img = '';
        if (domain) {
            var sources = faviconSources(domain); // 本地 → Gitee → favicon.im
            // 不使用 loading="lazy"：快捷方式面板默认隐藏，懒加载会被浏览器一直推迟，
            // 导致“打开面板才加载”。改为页面打开后由 preloadShortcutIcons 后台预取（非阻塞）。
            // 域名通过 data-domain 传给全局错误委托处理，不再拼接内联 onerror，杜绝注入。
            img = '<img class="q-favicon" alt="" src="' + esc(sources[0]) + '" data-domain="' + esc(domain) + '">';
        }
        return '<span class="q-icon" style="--qic:' + color + ';width:' + w + ';height:' + h + '">'
            + '<span class="q-icon-char">' + esc(ch) + '</span>' + img + '</span>';
    }

    // favicon 加载失败委托（捕获阶段）：error 事件不冒泡，但会走捕获路径。
    // 用 data-domain 代替内联 onerror，彻底消除用户数据注入事件属性字符串的可能。
    document.addEventListener('error', function (e) {
        var t = e.target;
        if (t && t.tagName === 'IMG' && t.classList && t.classList.contains('q-favicon')) {
            Icons.onFavError(t, t.getAttribute('data-domain'));
        }
    }, true);

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
        faviconSources: faviconSources,
        onFavError: onFavError,
        renderInto: renderInto
    };
})(window);
