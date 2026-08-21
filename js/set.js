/*
作者:D.Young
主页：https://yyv.me/
github：https://github.com/5iux/sou
日期：2019-07-26
版权所有，请勿删除
========================================
由 yeetime 修改
github：https://github.com/yeetime/sou2
日期：2019-12-13
========================================
由 imsyy 二次修改
github：https://github.com/imsyy/sou2
日期：2022-03-10
*/

// 默认搜索引擎列表
var se_list_preinstall = {
    '1': {
        id: 1,
        title: "百度",
        url: "https://www.baidu.com/s",
        name: "wd",
        icon: "iconfont icon-baidu",
    },
    '2': {
        id: 2,
        title: "必应",
        url: "https://cn.bing.com/search",
        name: "q",
        icon: "iconfont icon-bing",
    },
    '3': {
        id: 3,
        title: "谷歌",
        url: "https://www.google.com/search",
        name: "q",
        icon: "iconfont icon-google",
    },
    '4': {
        id: 4,
        title: "搜狗",
        url: "https://www.sogou.com/web",
        name: "query",
        icon: "iconfont icon-sougousousuo",
    },
    '5': {
        id: 5,
        title: "360",
        url: "https://www.so.com/s",
        name: "q",
        icon: "iconfont icon-360sousuo",
    },
    '6': {
        id: 6,
        title: "微博",
        url: "https://s.weibo.com/weibo",
        name: "q",
        icon: "iconfont icon-xinlangweibo",
    },
    '7': {
        id: 7,
        title: "知乎",
        url: "https://www.zhihu.com/search",
        name: "q",
        icon: "iconfont icon-zhihu",
    },
    '8': {
        id: 8,
        title: "Github",
        url: "https://github.com/search",
        name: "q",
        icon: "iconfont icon-github",
    },
    '9': {
        id: 9,
        title: "BiliBili",
        url: "https://search.bilibili.com/all",
        name: "keyword",
        icon: "iconfont icon-bilibilidonghua",
    },
    '10': {
        id: 10,
        title: "淘宝",
        url: "https://s.taobao.com/search",
        name: "q",
        icon: "iconfont icon-taobao",
    },
    '11': {
        id: 11,
        title: "京东",
        url: "https://search.jd.com/Search",
        name: "keyword",
        icon: "iconfont icon-jingdong",
    }
};

// 默认快捷方式
var quick_list_preinstall = {
    '1': {
        title: "醉里博客",
        url: "https://202271.xyz",
        cat: 0,
    },
    '2': {
        title: "GitHub",
        url: "https://github.com/",
        cat: 4,
    },
    '3': {
        title: "cloudflare",
        url: "https://dash.cloudflare.com/",
        cat: 2,
    },
    '4': {
        title: "W3school",
        url: "https://www.w3school.com.cn/",
        cat: 4,
    },
    '5': {
        title: "腾讯云",
        url: "https://console.cloud.tencent.com/",
        cat: 2,
    },
    '6': {
        title: "阿里云",
        url: "https://console.aliyun.com/",
        cat: 2,
    },
    '7': {
        title: "百度网盘",
        url: "https://pan.baidu.com/",
        cat: 0,
    },
    '8': {
        title: "阿里云盘",
        url: "https://www.aliyundrive.com/drive/",
        cat: 0,
    },
    '9': {
        title: "Office",
        url: "https://www.office.com/",
        cat: 3,
    },
    '10': {
        title: "又拍云",
        url: "https://console.upyun.com/",
        cat: 2,
    },
    '11': {
        title: "CSDN",
        url: "https://www.csdn.net/",
        cat: 4,
    },
    '12': {
        title: "哔哩哔哩",
        url: "https://www.bilibili.com/",
        cat: 5,
    },
    '13': {
        title: "掘金",
        url: "https://juejin.cn/",
        cat: 4,
    },
    '14': {
        title: "菜鸟教程",
        url: "https://www.runoob.com/",
        cat: 6,
    },
    '15': {
        title: "LeetCode",
        url: "https://leetcode.cn/",
        cat: 4,
    },
    '16': {
        title: "牛客网",
        url: "https://www.nowcoder.com/",
        cat: 4,
    },
    '17': {
        title: "Gitee",
        url: "https://gitee.com/",
        cat: 4,
    },
    '18': {
        title: "开源中国",
        url: "https://www.oschina.net/",
        cat: 4,
    },
    '19': {
        title: "Steam++",
        url: "https://steampp.net/",
        cat: 2,
    },
    '20': {
        title: "图吧工具箱",
        url: "https://www.tbtool.cn/",
        cat: 2,
    },
    '21': {
        title: "TinyWow",
        url: "https://tinywow.com/",
        cat: 2,
    },
    '22': {
        title: "草料二维码",
        url: "https://cli.im/",
        cat: 2,
    },
    '23': {
        title: "ProcessOn",
        url: "https://www.processon.com/",
        cat: 2,
    },
    '24': {
        title: "PDF24",
        url: "https://tools.pdf24.org/zh/",
        cat: 2,
    },
    '25': {
        title: "TinyPNG",
        url: "https://tinypng.com/",
        cat: 2,
    },
    '26': {
        title: "Remove.bg",
        url: "https://www.remove.bg/zh/",
        cat: 2,
    },
    '27': {
        title: "DeepL",
        url: "https://www.deepl.com/zh/translator",
        cat: 2,
    },
    '28': {
        title: "学习通",
        url: "https://www.chaoxing.com/",
        cat: 6,
    },
    '29': {
        title: "知到",
        url: "https://www.zhihuishu.com/",
        cat: 6,
    },
    '30': {
        title: "中国大学MOOC",
        url: "https://www.icourse163.org/",
        cat: 6,
    },
    '31': {
        title: "学堂在线",
        url: "https://www.xuetangx.com/",
        cat: 6,
    },
    '32': {
        title: "国家智慧教育",
        url: "https://www.smartedu.cn/",
        cat: 6,
    },
    '33': {
        title: "慕课网",
        url: "https://www.imooc.com/",
        cat: 6,
    }
};

// ===== 数据安全工具 =====

// 深拷贝预装数据：getXxxList 一律返回副本，
// 防止调用方就地增删改时污染内置默认列表（否则「重置」无法恢复真正的默认值）
function cloneDefaults(obj) {
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch (e) {
        return obj;
    }
}

// HTML 转义：所有来自 cookie / 表单的用户数据拼入 HTML 前必须转义，防止存储型 XSS
function escapeHtml(str) {
    return String(str == null ? '' : str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// URL 规范化：仅允许 http/https 且非空，阻断 javascript: / data: 等危险协议
function safeUrl(url) {
    url = String(url == null ? '' : url).trim();
    return /^https?:\/\/\S+$/i.test(url) ? url : '';
}

// 解析 cookie 中的 JSON 对象；解析失败或形状不对（null/数组/标量）返回 null
function parseListObj(raw) {
    if (!raw) return null;
    try {
        var obj = JSON.parse(raw);
        if (obj && typeof obj === 'object' && !Array.isArray(obj)) return obj;
    } catch (e) {}
    return null;
}

// 获取搜索引擎列表
function getSeList() {
    var raw = Cookies.get('se_list');
    if (raw && raw !== "{}") {
        var parsed = parseListObj(raw);
        if (parsed) return parsed;
    }
    // cookie 缺失 / 损坏时重置为默认（返回副本）
    var defaults = cloneDefaults(se_list_preinstall);
    setSeList(defaults);
    return defaults;
}

// 设置搜索引擎列表
function setSeList(se_list) {
    if (se_list) {
        Cookies.set('se_list', se_list, {
            expires: 36500
        });
        return true;
    }
    return false;
}

// 获得默认搜索引擎
function getSeDefault() {
    var se_default = Cookies.get('se_default');
    return se_default ? se_default : "1";
}

//背景图片
var bg_img_preinstall = {
    "type": "1", // 1:默认壁纸(本地随机) 2:每日必应 3:随机风景 4:随机二次元 5:自定义壁纸
    "path": "", //自定义图片
};

// 本地壁纸列表
var bg_img_local_list = [
    'https://raw.giteeusercontent.com/xiaohao3/Snavigation/raw/master/img/background1.webp',
    'https://raw.giteeusercontent.com/xiaohao3/Snavigation/raw/master/img/background2.webp',
    'https://raw.giteeusercontent.com/xiaohao3/Snavigation/raw/master/img/background3.webp',
    'https://raw.giteeusercontent.com/xiaohao3/Snavigation/raw/master/img/background4.webp',
    'https://raw.giteeusercontent.com/xiaohao3/Snavigation/raw/master/img/background5.webp',
    'https://raw.giteeusercontent.com/xiaohao3/Snavigation/raw/master/img/background6.webp',
    'https://raw.giteeusercontent.com/xiaohao3/Snavigation/raw/master/img/background7.webp',
    'https://raw.giteeusercontent.com/xiaohao3/Snavigation/raw/master/img/background8.webp',
    'https://raw.giteeusercontent.com/xiaohao3/Snavigation/raw/master/img/background9.webp',
    'https://raw.giteeusercontent.com/xiaohao3/Snavigation/raw/master/img/background10.webp',
];

// 随机取一张本地壁纸
function bgRandomLocal() {
    return bg_img_local_list[Math.floor(Math.random() * bg_img_local_list.length)];
}

// 背景图片加载失败时降级为 Gitee 壁纸（避免背景消失）
function bgFallback() {
    var bg = document.getElementById('bg');
    if (bg && bg.src.indexOf('raw.giteeusercontent.com') === -1) {
        bg.onerror = null;
        bg.src = bgRandomLocal();
    }
}

// 必应官方接口获取壁纸（每日更新 / 历史图随机）
function bgSetBing(idx) {
    fetch('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=' + idx + '&n=1')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data && data.images && data.images[0]) {
                $('#bg').attr('src', 'https://cn.bing.com' + data.images[0].url);
            } else {
                bgFallback();
            }
        })
        .catch(bgFallback);
}

// 获取背景图片
function getBgImg() {
    var raw = Cookies.get('bg_img');
    if (raw && raw !== "{}") {
        var parsed = parseListObj(raw);
        if (parsed) return parsed;
    }
    // cookie 缺失 / 损坏时重置为默认（返回副本）
    var defaults = cloneDefaults(bg_img_preinstall);
    setBgImg(defaults);
    return defaults;
}

// 设置背景图片
function setBgImg(bg_img) {
    if (bg_img) {
        Cookies.set('bg_img', bg_img, {
            expires: 36500
        });
        return true;
    }
    return false;
}

// 设置-壁纸
function setBgImgInit() {
    var bg_img = getBgImg();
    $("input[name='wallpaper-type'][value=" + bg_img["type"] + "]").click();
    if (bg_img["type"] === "5") {
        $("#wallpaper-url").val(bg_img["path"]);
        $("#wallpaper-button").fadeIn(100);
        $("#wallpaper_url").fadeIn(100);
    } else {
        $("#wallpaper_url").fadeOut(300);
        $("#wallpaper-button").fadeOut(300);
    }

    switch (bg_img["type"]) {
        case "1":
            $('#bg').attr('src', bgRandomLocal()) //随机本地默认壁纸
            break;
        case "2":
            bgSetBing(0) //必应每日（官方接口）
            break;
        case "3":
            bgSetBing(Math.floor(Math.random() * 8)) //随机风景（必应历史图库，均为自然风光）
            break;
        case "4":
            $('#bg').attr('src', 'https://www.dmoe.cc/random.php') //随机二次元
            break;
        case "5":
            $('#bg').attr('src', bg_img["path"]) //自定义
            break;
        default:
            $('#bg').attr('src', bgRandomLocal())
            break;
    }
}

// 搜索框高亮
function focusWd() {
    $("body").addClass("onsearch");
}

// 搜索框取消高亮
function blurWd() {
    $("body").removeClass("onsearch");
    //隐藏输入
    $(".wd").val("");
    //隐藏搜索建议
    $("#keywords").hide();
}

// 搜索建议提示
function keywordReminder() {
    var keyword = $(".wd").val();
    if (keyword != "") {
        $.ajax({
            url: 'https://suggestion.baidu.com/su?wd=' + keyword,
            dataType: 'jsonp',
            jsonp: 'cb', //回调函数的参数名(键值)key
            success: function (data) {
                //获取宽度
                $("#keywords").css("width", $('.sou').width());
                $("#keywords").empty().show();
                $.each(data.s, function (i, val) {
                    // val 来自百度搜索建议接口（第三方数据），拼 HTML 前必须转义
                    $('#keywords').append('<div class="keyword" data-id="' + (i + 1) + '"><i class="iconfont icon-sousuo"></i>' + escapeHtml(val) + '</div>');
                });
                $("#keywords").attr("data-length", data.s["length"]);
                $(".keyword").click(function () {
                    $(".wd").val($(this).text());
                    $("#search-submit").click();
                });
            },
            error: function () {
                $("#keywords").empty().show();
                $("#keywords").hide();
            }
        })
    } else {
        $("#keywords").empty().show();
        $("#keywords").hide();
    }
}

// 渲染搜索引擎切换按钮图标
// si:品牌 / URL 配置优先；否则用原 iconfont class（icon-baidu 等）
function renderEngineIcon(icon, title) {
    var iconSe = $("#icon-se");
    if (typeof Icons !== 'undefined' && icon && (icon.indexOf('si:') === 0 || icon.indexOf('http') === 0)) {
        // 用户配置的图标 → html 注入
        iconSe.attr('class', '');
        iconSe.html(Icons.engine(icon, title));
    } else {
        // 原 iconfont class
        iconSe.html('');
        iconSe.attr('class', icon || 'iconfont icon-wangluo');
    }
}

// 搜索框数据加载
function searchData() {
    var se_default = getSeDefault();
    var se_list = getSeList();
    var defaultSe = se_list[se_default];
    if (defaultSe) {
        // action 仅接受 http(s)，历史 cookie 中的危险协议（javascript: 等）回退百度
        $(".search").attr("action", safeUrl(defaultSe["url"]) || 'https://www.baidu.com/s');
        renderEngineIcon(defaultSe["icon"], defaultSe["title"]);
        $(".wd").attr("name", defaultSe["name"]);
    }

    // 判断窗口大小，添加输入框自动完成
    // var wid = $("body").width();
    // if (wid < 640) {
    //     $(".wd").attr('autocomplete', 'off');
    // } else {
    //     $(".wd").focus();
    //     focusWd();
    // }
}

// 搜索引擎列表加载
function seList() {
    var html = "";
    var se_list = getSeList();
    for (var i in se_list) {
        if (!Object.prototype.hasOwnProperty.call(se_list, i)) continue;
        var se = se_list[i];
        if (!se || typeof se !== 'object') continue;
        var keyEsc = escapeHtml(i);
        html += `<div class='se-li' data-url='${escapeHtml(se["url"])}' data-name='${escapeHtml(se["name"])}' data-icon='${escapeHtml(se["icon"])}'>
        <a class='se-li-text'><i id='icon-sou-list' class='${escapeHtml(se["icon"])}'></i><span>${escapeHtml(se["title"])}</span></a></div>`;
    }
    $(".search-engine-list").html(html);
}

// 设置-搜索引擎列表加载
function setSeInit() {
    var se_default = getSeDefault();
    var se_list = getSeList();
    var html = "";
    var icHome = '<i class="iconfont icon-home"></i>';
    var icPencil = '<i class="iconfont icon-xiugai"></i>';
    var icTrash = '<i class="iconfont icon-delete"></i>';
    for (var i in se_list) {
        if (!Object.prototype.hasOwnProperty.call(se_list, i)) continue;
        var se = se_list[i];
        if (!se || typeof se !== 'object') continue;
        var keyEsc = escapeHtml(i);
        var title = String(se["title"] || '');
        var listIcon = typeof Icons !== 'undefined' ? '<span class="set-list-icon">' + Icons.engine(se["icon"], title) + '</span>' : '';
        var tr = `<div class='se_list_div'><div class='se_list_num'>${keyEsc}</div>`;
        if (i === se_default) {
            tr = `<div class='se_list_div'><div class='se_list_num'>${icHome}</div>`;
        }
        tr += `<div class='se_list_name'>${listIcon}${escapeHtml(title)}</div>
        <div class='se_list_button'>
        <button class='set_se_default' value='${keyEsc}' style='border-radius: 8px 0px 0px 8px;'>
        ${icHome}</button>
        <button class='edit_se' value='${keyEsc}'>
        ${icPencil}</button>
        <button class='delete_se' value='${keyEsc}' style='border-radius: 0px 8px 8px 0px;'>
        ${icTrash}</button></div>
        </div>`;
        html += tr;
    }
    $(".se_list_table").html(html);
}

// 获取快捷方式列表
function getQuickList() {
    var raw = Cookies.get('quick_list');
    if (raw && raw !== "{}") {
        var parsed = parseListObj(raw);
        if (parsed) return parsed;
    }
    // cookie 缺失 / 损坏时重置为默认（返回副本）
    var defaults = cloneDefaults(quick_list_preinstall);
    setQuickList(defaults);
    return defaults;
}

// 设置快捷方式列表
function setQuickList(quick_list) {
    if (quick_list) {
        Cookies.set('quick_list', quick_list, {
            expires: 36500
        });
        return true;
    }
    return false;
}

// 获取书签列表（用户完全自建，与快捷方式分离）
function getBookmarkList() {
    return parseListObj(Cookies.get('bookmark_list')) || {};
}

// 设置书签列表
function setBookmarkList(list) {
    if (list) {
        Cookies.set('bookmark_list', list, {
            expires: 36500
        });
        return true;
    }
    return false;
}

// 快捷方式分类（与快捷方式页 tab 一一对应，索引即 tab 顺序）
var QUICK_CATS = ['常用', 'AI', '工具', '办公', '开发', '娱乐', '学习', '设计'];

// 规整分类索引：非法/缺失回退到「常用」(0)
function normalizeCat(cat) {
    cat = parseInt(cat, 10);
    if (isNaN(cat) || cat < 0 || cat >= QUICK_CATS.length) return 0;
    return cat;
}

// 快捷方式数据加载：按分类渲染到各 tab 顶部（同容器，不新增滚动盒），末尾附「添加」按钮
function quickData() {
    var quick_list = getQuickList();
    var icPlus = '<i class="iconfont icon-tianjia-"></i>';
    var conts = document.querySelectorAll('.mark .products .mainCont');

    // 分组：cat → 条目列表
    var groups = [];
    for (var c = 0; c < QUICK_CATS.length; c++) groups.push([]);
    for (var i in quick_list) {
        if (!Object.prototype.hasOwnProperty.call(quick_list, i)) continue;
        var q = quick_list[i];
        if (!q || typeof q !== 'object') continue;
        var href = safeUrl(q['url']);
        var title = String(q['title'] || '').trim();
        // 仅渲染合法条目：非 http(s) 地址或空名称不展示在首页（可在设置中编辑/删除）
        if (!href || !title) continue;
        groups[normalizeCat(q['cat'])].push({ href: href, title: title, icon: q['icon'] });
    }

    for (var c = 0; c < conts.length && c < QUICK_CATS.length; c++) {
        var box = conts[c].querySelector('.quick-alls');
        if (!box) continue;
        // 清除上一轮动态渲染的用户区（静态 .quicks 保留）
        var old = box.querySelector('.user-quicks');
        if (old) old.parentNode.removeChild(old);
        var items = groups[c];
        var html = '<div class="user-quicks">';
        for (var k = 0; k < items.length; k++) {
            var it = items[k];
            var iconHtml = typeof Icons !== 'undefined' ? Icons.site(it.href, it.title, 32, it.icon) : '';
            html += '<div class="quick">'
                + '<a href="' + escapeHtml(it.href) + '" target="_blank" rel="noopener noreferrer">'
                + iconHtml + '<span class="q-name">' + escapeHtml(it.title) + '</span></a></div>';
        }
        // 每个分类都保留「添加」入口（预选当前分类），无用户项时仅显示按钮
        html += '<div class="quick"><a class="set-quick-add" data-cat="' + c + '">' + icPlus + '<span class="q-name">添加</span></a></div>';
        html += '</div>';
        box.insertAdjacentHTML('afterbegin', html);
    }
}

// 设置-快捷方式加载
function setQuickInit() {
    var quick_list = getQuickList();
    var html = "";
    var icPencil = typeof Icons !== 'undefined' ? Icons.ui('pencil') : '<i class="iconfont icon-xiugai"></i>';
    var icTrash = typeof Icons !== 'undefined' ? Icons.ui('trash') : '<i class="iconfont icon-delete"></i>';
    for (var i in quick_list) {
        if (!Object.prototype.hasOwnProperty.call(quick_list, i)) continue;
        var q = quick_list[i];
        if (!q || typeof q !== 'object') continue;
        var keyEsc = escapeHtml(i);
        var title = String(q['title'] || '');
        var catTag = '<span class="quick-cat-tag">' + escapeHtml(QUICK_CATS[normalizeCat(q['cat'])]) + '</span>';
        var listIcon = typeof Icons !== 'undefined' ? '<span class="set-list-icon">' + Icons.site(q['url'], title, 22, q['icon']) + '</span>' : '';
        tr = `
        <div class='quick_list_div'>
            <div class='quick_list_div_num'>${keyEsc}</div>
            <div class='quick_list_div_name'>${listIcon}${escapeHtml(title)}${catTag}</div>
            <div class='quick_list_div_button'>
                <button class='edit_quick' value='${keyEsc}' style='border-radius: 8px 0px 0px 8px;'>
                ${icPencil}</button>
                <button class='delete_quick' value='${keyEsc}' style='border-radius: 0px 8px 8px 0px;'>
                ${icTrash}</button>
            </div>
        </div>`;
        html += tr;
    }
    $(".quick_list_table").html(html);
}

// 设置-书签加载（用户完全自建）
function setBookmarkInit() {
    var list = getBookmarkList();
    var html = "";
    var icPencil = typeof Icons !== 'undefined' ? Icons.ui('pencil') : '<i class="iconfont icon-xiugai"></i>';
    var icTrash = typeof Icons !== 'undefined' ? Icons.ui('trash') : '<i class="iconfont icon-delete"></i>';
    if (!Object.keys(list).length) {
        html = '<div class="set-list-empty">暂无书签，点击上方「新增」添加你的收藏</div>';
    } else {
        for (var i in list) {
            if (!Object.prototype.hasOwnProperty.call(list, i)) continue;
            var bm = list[i];
            if (!bm || typeof bm !== 'object') continue;
            var keyEsc = escapeHtml(i);
            var title = String(bm['title'] || '');
            var listIcon = typeof Icons !== 'undefined' ? '<span class="set-list-icon">' + Icons.site(bm['url'], title, 22, bm['icon']) + '</span>' : '';
            tr = `
            <div class='quick_list_div'>
                <div class='quick_list_div_num'>${keyEsc}</div>
                <div class='quick_list_div_name'>${listIcon}${escapeHtml(title)}</div>
                <div class='quick_list_div_button'>
                    <button class='edit_bookmark' value='${keyEsc}' style='border-radius: 8px 0px 0px 8px;'>
                    ${icPencil}</button>
                    <button class='delete_bookmark' value='${keyEsc}' style='border-radius: 0px 8px 8px 0px;'>
                    ${icTrash}</button>
                </div>
            </div>`;
            html += tr;
        }
    }
    $(".bookmark_list_table").html(html);
}

/**
 * 下载文本为文件
 * @param filename 文件名
 * @param text     内容
 */
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// 打开设置
function openSet() {
    // 右上角按钮已改为书签面板开关，这里不再改动其 class/图标
    // 隐藏书签打开设置
    $(".mark").css({
        "display": "none",
    });
    $(".set").css({
        "display": "flex",
    });
}

// 滚动设置面板到指定区块
function scrollToSetSection(id) {
    var sec = document.getElementById(id);
    if (sec && sec.scrollIntoView) {
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// 打开设置并定位到"快捷方式"tab（书签管理区）
function openBookmarkManage() {
    openSet();
    $("#set-quick-menu").trigger('click');
    setQuickInit();
    setBookmarkInit();
    scrollToSetSection('section-bookmark');
}

// 打开设置并直接进入"添加书签"（书签区表单）
function openBookmarkAdd() {
    openBookmarkManage();
    $(".set_bookmark_list_add").trigger('click');
}

// 打开设置并直接进入"添加快捷方式"（快捷方式区表单），可选预选分类
function openQuickAdd(cat) {
    openSet();
    $("#set-quick-menu").trigger('click');
    setQuickInit();
    setBookmarkInit();
    scrollToSetSection('section-quick');
    $(".set_quick_list_add").trigger('click');
    // 预选分类（快捷方式页分类内「添加」按钮传入）
    if (cat !== undefined && cat !== null && cat !== '') {
        var sel = $(".quick_add_content select[name='cat']");
        if (sel.length) sel.val(String(normalizeCat(cat)));
    }
}

// 关闭设置
function closeSet() {
    // 右上角按钮已改为书签面板开关，这里不再改动其 class/图标
    // 隐藏设置
    $(".set").css({
        "display": "none",
    });

    // 刷新主页数据
    seList();
    quickData();
}

// 快捷方式显示
function openBox() {
    $("#content").addClass('box');
    $(".mark").css({
        "display": "flex",
    });
}

// 快捷方式收起
function closeBox() {
    $("#content").removeClass('box');
    $(".mark").css({
        "display": "none",
    });
}

//显示设置搜索引擎列表
function showSe() {
    $(".se_list").show();
    $(".se_add_preinstall").show();
}

//隐藏设置搜索引擎列表
function hideSe() {
    $(".se_list").hide();
    $(".se_add_preinstall").hide();
}

//显示设置快捷方式列表
function showQuick() {
    $(".quick_list").show();
    $(".se_add_preinstalls").show();
}

//隐藏设置快捷方式列表
function hideQuick() {
    $(".quick_list").hide();
    $(".se_add_preinstalls").hide();
}


$(document).ready(function () {

    // 搜索框数据加载
    searchData();

    // 搜索引擎列表加载
    seList();

    // 引擎切换：图标区域直接交互（无浮层）
    // 列表动态读取（添加/删除引擎后立即生效，无需刷新页面）
    var engineCurrent = getSeDefault();
    var engineIndex = 0;
    var wheelAccum = 0;
    var wheelTimer = null;
    var engineNameTimer = null;
    var engineDragY = null;

    // 定位到当前引擎在列表中的下标
    function locateEngineIndex() {
        var keys = Object.keys(getSeList());
        engineIndex = Math.max(keys.indexOf(engineCurrent), 0);
    }

    // 应用指定引擎（循环切换，实时读取列表）
    function applyEngine(index) {
        var list = getSeList();
        var keys = Object.keys(list);
        var n = keys.length;
        if (n === 0) return;
        engineIndex = ((index % n) + n) % n;
        engineCurrent = keys[engineIndex];
        var se = list[engineCurrent];
        if (!se) return;
        // action 仅接受 http(s)，历史 cookie 中的危险协议回退百度
        $(".search").attr("action", safeUrl(se["url"]) || 'https://www.baidu.com/s');
        $(".wd").attr("name", se["name"]);
        var iconSe = $("#icon-se");
        renderEngineIcon(se["icon"], se["title"]);
        iconSe.attr("title", se["title"]);
        // 图标弹跳动画
        iconSe.css("transform", "scale(1.3)");
        setTimeout(function () {
            iconSe.css("transform", "");
        }, 160);
        // 引擎名提示（纯文字，自动淡出）
        showEngineName(se["title"]);
    }

    // 引擎名提示
    function showEngineName(name) {
        var el = document.getElementById('engine-name');
        if (!el) return;
        el.textContent = name;
        el.classList.remove('show');
        void el.offsetWidth; // 重启动画
        el.classList.add('show');
        if (engineNameTimer) clearTimeout(engineNameTimer);
        engineNameTimer = setTimeout(function () {
            el.classList.remove('show');
        }, 1200);
    }

    // 滚轮切换（只在引擎图标上滚动时生效）
    var engineWheelEl = null; // 当前绑定滚轮监听的图标元素
    function onEngineWheel(e) {
        e.preventDefault();
        var delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY;
        wheelAccum += delta / 15; // 提高灵敏度，平滑滚动也能逐级累积
        var steps = Math.trunc(wheelAccum);
        if (steps !== 0) {
            steps = Math.max(-1, Math.min(1, steps));
            applyEngine(engineIndex + steps);
            wheelAccum = 0;
        }
        if (wheelTimer) clearTimeout(wheelTimer);
        wheelTimer = setTimeout(function () {
            wheelAccum = 0;
        }, 140);
    }

    // hover 图标时在图标元素上监听滚轮；离开停用
    $(document).on('mouseenter', '.se', function () {
        locateEngineIndex(); // 定位到当前引擎
        engineWheelEl = this;
        this.addEventListener('wheel', onEngineWheel, { passive: false });
    });
    $(document).on('mouseleave', '.se', function () {
        if (engineWheelEl) {
            engineWheelEl.removeEventListener('wheel', onEngineWheel);
            engineWheelEl = null;
        }
        wheelAccum = 0;
    });

    // 图标上拖拽切换
    $(document).on('pointerdown', '.se', function (e) {
        engineDragY = e.clientY;
    });
    $(document).on('pointermove', '.se', function (e) {
        if (engineDragY == null) return;
        var dy = e.clientY - engineDragY;
        if (Math.abs(dy) > 10) {
            locateEngineIndex();
            applyEngine(engineIndex + (dy > 0 ? 1 : -1));
            engineDragY = e.clientY;
        }
    });
    $(document).on('pointerup pointercancel', '.se', function () {
        engineDragY = null;
    });

    // 键盘切换（图标 focus 后上下/左右键）
    $(document).on('keydown', '.se', function (e) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            applyEngine(engineIndex - 1);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            applyEngine(engineIndex + 1);
        }
    });

    // 快捷方式数据加载
    quickData();

    // 壁纸数据加载
    setBgImgInit();

    // 点击事件
    $(document).on('click', function (e) {
        // 自动提示隐藏
        if (!$(".sou").is(e.target) && $(".sou").has(e.target).length === 0) {
            $("#keywords").hide();
        }
    });

    // 搜索框点击事件
    $(document).on('click', '.sou', function () {
        focusWd();
    });

    $(document).on('click', '.wd', function () {
        focusWd();
        keywordReminder();
    });

    // 点击其他区域关闭事件
    $(document).on('click', '.close_sou', function () {
        blurWd();
        closeSet();
    });

    // 自动提示 (调用百度 api）
    $('.wd').keyup(function (event) {
        var key = event.keyCode;
        // 屏蔽上下键
        var shieldKey = [38, 40];
        if (shieldKey.includes(key)) return;
        keywordReminder();
    });

    // 点击自动提示的搜索建议
    $("#keywords").on("click", ".wd", function () {
        var wd = $(this).text();
        $(".wd").val(wd);
        $(".search").submit();
        //隐藏输入
        $(".wd").val("");
        $("#keywords").hide();
    });

    // 自动提示键盘方向键选择操作
    $(".wd").keydown(function (event) { //上下键获取焦点
        var key = event.keyCode;
        if ($.trim($(this).val()).length === 0) return;

        var id = $(".choose").attr("data-id");
        if (id === undefined) id = 0;

        if (key === 38) {
            /*向上按钮*/
            id--;
        } else if (key === 40) {
            /*向下按钮*/
            id++;
        } else {
            return;
        }
        var length = $("#keywords").attr("data-length");
        if (id > length) id = 1;
        if (id < 1) id = length;

        $(".keyword[data-id=" + id + "]").addClass("choose").siblings().removeClass("choose");
        $(".wd").val($(".keyword[data-id=" + id + "]").text());
    });

    // 右上角设置按钮：展开书签面板（AnimatedList）
    $("#menu").click(function () {
        if (typeof BookmarkPanel !== 'undefined') {
            BookmarkPanel.toggle();
        } else {
            // 组件未加载时回退到设置面板
            if ($(this).attr("class") === "on") {
                closeSet();
            } else {
                openSet();
                setSeInit();
                setQuickInit();
            }
        }
    });

    // 快捷方式添加按钮点击（快捷方式页分类内 → 定位到设置-快捷方式区，预选分类）
    // 用事件委托：quickData() 每次重渲染都会重建节点，直接绑定会丢失
    $(document).on('click', '.set-quick-add', function () {
        openQuickAdd($(this).attr('data-cat'));
    });

    // 修改默认搜索引擎
    $(".se_list_table").on("click", ".set_se_default", function () {
        var name = $(this).val();
        Cookies.set('se_default', name, {
            expires: 36500
        });
        iziToast.show({
            timeout: 8000,
            message: '是否设置为默认搜索引擎？',
            buttons: [
                ['<button>确认</button>', function (instance, toast) {
                    setSeInit();
                    instance.hide({
                        transitionOut: 'flipOutX',
                    }, toast, 'buttonName');
                    iziToast.show({
                        message: '设置成功'
                    });
                    setTimeout(function () {
                        window.location.reload()
                    }, 1000);
                }, true],
                ['<button>取消</button>', function (instance, toast) {
                    instance.hide({
                        transitionOut: 'flipOutX',
                    }, toast, 'buttonName');
                }]
            ]
        });
    });

    // 搜索引擎添加
    $(".set_se_list_add").click(function () {
        $(".se_add_content input").val("");

        hideSe();
        $(".se_add_content").show();
    });

    // 搜索引擎保存
    $(".se_add_save").click(function () {
        var key_inhere = $(".se_add_content input[name='key_inhere']").val();
        var key = $(".se_add_content input[name='key']").val();
        var title = $(".se_add_content input[name='title']").val().trim();
        var url = $(".se_add_content input[name='url']").val().trim();
        var name = $(".se_add_content input[name='name']").val().trim();
        // 图标：表单可配置（留空则自定义引擎默认走首字徽章，旧数据兼容 icon-wangluo）
        var icon = $(".se_add_content input[name='icon']").val() || '';

        var num = /^\+?[1-9][0-9]*$/;
        if (!num.test(key)) {
            iziToast.show({
                timeout: 2000,
                message: '序号 ' + key + ' 不是正整数'
            });
            return;
        }
        if (!title || !url || !name) {
            iziToast.show({ timeout: 2000, message: '请填写搜索引擎名称、网址与字段名' });
            return;
        }
        if (!safeUrl(url)) {
            iziToast.show({ timeout: 2000, message: '请输入以 http 或 https 开头的网址' });
            return;
        }

        var se_list = getSeList();

        if (se_list[key]) {
            iziToast.show({
                timeout: 8000,
                message: '搜索引擎 ' + key + ' 已有数据，是否覆盖？',
                buttons: [
                    ['<button>确认</button>', function (instance, toast) {
                        // 覆盖时若改了序号，旧序号条目一并移除，避免残留脏数据
                        if (key_inhere && key !== key_inhere) {
                            delete se_list[key_inhere];
                        }
                        se_list[key] = {
                            title: title,
                            url: url,
                            name: name,
                            icon: icon,
                        };
                        setSeList(se_list);
                        setSeInit();
                        $(".se_add_content").hide();
                        //显示列表
                        showSe();

                        instance.hide({
                            transitionOut: 'flipOutX',
                        }, toast, 'buttonName');
                        iziToast.show({
                            message: '覆盖成功'
                        });
                    }, true],
                    ['<button>取消</button>', function (instance, toast) {
                        instance.hide({
                            transitionOut: 'flipOutX',
                        }, toast, 'buttonName');
                    }]
                ]
            });
            return;
        }

        if (key_inhere && key !== key_inhere) {
            delete se_list[key_inhere];
        }

        se_list[key] = {
            title: title,
            url: url,
            name: name,
            icon: icon,
        };
        setSeList(se_list);
        setSeInit();
        iziToast.show({
            timeout: 2000,
            message: '添加成功'
        });
        $(".se_add_content").hide();
        showSe();
    });

    // 关闭表单
    $(".se_add_cancel").click(function () {
        $(".se_add_content").hide();

        //显示列表
        showSe();
    });

    // 搜索引擎修改
    $(".se_list").on("click", ".edit_se", function () {

        var se_list = getSeList();
        var key = $(this).val();
        var se = se_list[key];
        // cookie 数据损坏（条目非对象）时忽略，避免 TypeError 中断
        if (!se || typeof se !== 'object') return;
        $(".se_add_content input[name='key_inhere']").val(key);
        $(".se_add_content input[name='key']").val(key);
        $(".se_add_content input[name='title']").val(se["title"] || '');
        $(".se_add_content input[name='url']").val(se["url"] || '');
        $(".se_add_content input[name='name']").val(se["name"] || '');
        $(".se_add_content input[name='icon']").val(se["icon"] || '');

        //隐藏列表
        hideSe();

        $(".se_add_content").show();
    });

    // 搜索引擎删除
    $(".se_list").on("click", ".delete_se", function () {
        var se_default = getSeDefault();
        var key = $(this).val();
        if (key == se_default) {
            iziToast.show({
                message: '默认搜索引擎不可删除'
            });
        } else {
            iziToast.show({
                timeout: 8000,
                message: '搜索引擎 ' + key + ' 是否删除？',
                buttons: [
                    ['<button>确认</button>', function (instance, toast) {
                        var se_list = getSeList();
                        delete se_list[key];
                        setSeList(se_list);
                        setSeInit();
                        instance.hide({
                            transitionOut: 'flipOutX',
                        }, toast, 'buttonName');
                        iziToast.show({
                            message: '删除成功'
                        });
                    }, true],
                    ['<button>取消</button>', function (instance, toast) {
                        instance.hide({
                            transitionOut: 'flipOutX',
                        }, toast, 'buttonName');
                    }]
                ]
            });
        }
    });

    // 恢复预设搜索引擎
    $(".set_se_list_preinstall").click(function () {
        iziToast.show({
            timeout: 8000,
            message: '现有搜索引擎数据将被清空',
            buttons: [
                ['<button>确认</button>', function (instance, toast) {
                    setSeList(cloneDefaults(se_list_preinstall));
                    Cookies.set('se_default', 1, {
                        expires: 36500
                    });
                    setSeInit();
                    instance.hide({
                        transitionOut: 'flipOutX',
                    }, toast, 'buttonName');
                    iziToast.show({
                        message: '重置成功'
                    });
                    setTimeout(function () {
                        window.location.reload()
                    }, 1000);
                }, true],
                ['<button>取消</button>', function (instance, toast) {
                    instance.hide({
                        transitionOut: 'flipOutX',
                    }, toast, 'buttonName');
                }]
            ]
        });
    });

    // 设置-快捷方式添加
    $(".set_quick_list_add").click(function () {
        $(".quick_add_content input").val("");
        $(".quick_add_content").show();

        //隐藏列表
        hideQuick();
    });

    // 设置-快捷方式保存
    $(".quick_add_save").click(function () {
        var key_inhere = $(".quick_add_content input[name='key_inhere']").val();
        var key = $(".quick_add_content input[name='key']").val();
        var title = $(".quick_add_content input[name='title']").val().trim();
        var url = $(".quick_add_content input[name='url']").val().trim();
        var icon = $(".quick_add_content input[name='icon']").val();
        var cat = normalizeCat($(".quick_add_content select[name='cat']").val());

        var num = /^\+?[1-9][0-9]*$/;
        if (!num.test(key)) {
            iziToast.show({
                timeout: 2000,
                message: '快捷方式 ' + key + ' 不是正整数'
            });
            return;
        }
        if (!title) {
            iziToast.show({ timeout: 2000, message: '请填写快捷方式名称' });
            return;
        }
        if (!safeUrl(url)) {
            iziToast.show({ timeout: 2000, message: '请输入以 http 或 https 开头的网址' });
            return;
        }

        var quick_list = getQuickList();

        if (quick_list[key]) {
            iziToast.show({
                timeout: 8000,
                message: '快捷方式 ' + key + ' 已有数据，是否覆盖？',
                buttons: [
                    ['<button>确认</button>', function (instance, toast) {
                        // 覆盖时若改了序号，旧序号条目一并移除，避免残留脏数据
                        if (key_inhere && key !== key_inhere) {
                            delete quick_list[key_inhere];
                        }
                        quick_list[key] = {
                            title: title,
                            url: url,
                            icon: icon,
                            cat: cat,
                        };
                        setQuickList(quick_list);
                        setQuickInit();
                        quickData();
                        $(".quick_add_content").hide();
                        //显示列表
                        showQuick();

                        instance.hide({
                            transitionOut: 'flipOutX',
                        }, toast, 'buttonName');
                        iziToast.show({
                            message: '覆盖成功'
                        });
                    }, true],
                    ['<button>取消</button>', function (instance, toast) {
                        instance.hide({
                            transitionOut: 'flipOutX',
                        }, toast, 'buttonName');
                    }]
                ]
            });
            return;
        }

        if (key_inhere && key != key_inhere) {
            delete quick_list[key_inhere];
        }

        quick_list[key] = {
            title: title,
            url: url,
            icon: icon,
            cat: cat,
        };
        setQuickList(quick_list);
        setQuickInit();
        quickData();
        $(".quick_add_content").hide();
        iziToast.show({
            timeout: 2000,
            message: '添加成功'
        });

        //显示列表
        showQuick();
    });

    // 设置-快捷方式关闭添加表单
    $(".quick_add_cancel").click(function () {
        $(".quick_add_content").hide();

        //显示列表
        showQuick();
    });

    //恢复预设快捷方式
    $(".set_quick_list_preinstall").click(function () {
        iziToast.show({
            timeout: 8000,
            message: '快捷方式数据将被清空',
            buttons: [
                ['<button>确认</button>', function (instance, toast) {
                    setQuickList(cloneDefaults(quick_list_preinstall));
                    setQuickInit();
                    quickData(); // 首页同步刷新
                    instance.hide({
                        transitionOut: 'flipOutX',
                    }, toast, 'buttonName');
                    iziToast.show({
                        timeout: 2000,
                        message: '重置成功'
                    });
                }, true],
                ['<button>取消</button>', function (instance, toast) {
                    instance.hide({
                        transitionOut: 'flipOutX',
                    }, toast, 'buttonName');
                }]
            ]
        });
    });

    // 快捷方式修改
    $(".quick_list").on("click", ".edit_quick", function () {

        var quick_list = getQuickList();
        var key = $(this).val();
        var q = quick_list[key];
        // cookie 数据损坏（条目非对象）时忽略，避免 TypeError 中断
        if (!q || typeof q !== 'object') return;
        $(".quick_add_content input[name='key_inhere']").val(key);
        $(".quick_add_content input[name='key']").val(key);
        $(".quick_add_content input[name='title']").val(q["title"] || '');
        $(".quick_add_content input[name='url']").val(q["url"] || '');
        $(".quick_add_content input[name='icon']").val(q["icon"] || '');
        $(".quick_add_content select[name='cat']").val(String(normalizeCat(q["cat"])));

        //隐藏列表
        hideQuick();

        $(".quick_add_content").show();
    });

    // 快捷方式删除
    $(".quick_list").on("click", ".delete_quick", function () {

        var key = $(this).val();

        iziToast.show({
            timeout: 8000,
            message: '快捷方式 ' + key + ' 是否删除？',
            buttons: [
                ['<button>确认</button>', function (instance, toast) {
                    var quick_list = getQuickList();
                    delete quick_list[key];
                    setQuickList(quick_list);
                    setQuickInit();
                    quickData(); // 首页同步刷新
                    instance.hide({
                        transitionOut: 'flipOutX',
                    }, toast, 'buttonName');
                    iziToast.show({
                        timeout: 2000,
                        message: '删除成功'
                    });
                }, true],
                ['<button>取消</button>', function (instance, toast) {
                    instance.hide({
                        transitionOut: 'flipOutX',
                    }, toast, 'buttonName');
                }]
            ]
        });
    });

    // ===== 书签管理（用户完全自建，与快捷方式分离）=====

    // 书签添加
    $(".set_bookmark_list_add").click(function () {
        $(".bookmark_add_content input").val("");
        $(".bookmark_add_content").show();
        $(".bookmark_list_table").hide();
    });

    // 书签保存
    $(".bookmark_add_save").click(function () {
        var key_inhere = $(".bookmark_add_content input[name='key_inhere']").val();
        var key = $(".bookmark_add_content input[name='key']").val();
        var title = $(".bookmark_add_content input[name='title']").val().trim();
        var url = $(".bookmark_add_content input[name='url']").val().trim();
        var icon = $(".bookmark_add_content input[name='icon']").val();

        var num = /^\+?[1-9][0-9]*$/;
        if (!num.test(key)) {
            iziToast.show({ timeout: 2000, message: '书签 ' + key + ' 不是正整数' });
            return;
        }
        if (!title || !url) {
            iziToast.show({ timeout: 2000, message: '请填写书签名称与网址' });
            return;
        }
        if (!safeUrl(url)) {
            iziToast.show({ timeout: 2000, message: '请输入以 http 或 https 开头的网址' });
            return;
        }

        var list = getBookmarkList();

        if (list[key]) {
            iziToast.show({
                timeout: 8000,
                message: '书签 ' + key + ' 已有数据，是否覆盖？',
                buttons: [
                    ['<button>确认</button>', function (instance, toast) {
                        // 覆盖时若改了序号，旧序号条目一并移除，避免残留脏数据
                        if (key_inhere && key !== key_inhere) delete list[key_inhere];
                        list[key] = { title: title, url: url, icon: icon };
                        setBookmarkList(list);
                        setBookmarkInit();
                        $(".bookmark_add_content").hide();
                        $(".bookmark_list_table").show();
                        instance.hide({ transitionOut: 'flipOutX' }, toast, 'buttonName');
                        iziToast.show({ message: '覆盖成功' });
                    }, true],
                    ['<button>取消</button>', function (instance, toast) {
                        instance.hide({ transitionOut: 'flipOutX' }, toast, 'buttonName');
                    }]
                ]
            });
            return;
        }

        if (key_inhere && key != key_inhere) delete list[key_inhere];

        list[key] = { title: title, url: url, icon: icon };
        setBookmarkList(list);
        setBookmarkInit();
        $(".bookmark_add_content").hide();
        $(".bookmark_list_table").show();
        iziToast.show({ timeout: 2000, message: '添加成功' });
    });

    // 书签取消
    $(".bookmark_add_cancel").click(function () {
        $(".bookmark_add_content").hide();
        $(".bookmark_list_table").show();
    });

    // 书签修改
    $(".bookmark_list").on("click", ".edit_bookmark", function () {
        var list = getBookmarkList();
        var key = $(this).val();
        var bm = list[key];
        // cookie 数据损坏（条目非对象）时忽略，避免 TypeError 中断
        if (!bm || typeof bm !== 'object') return;
        $(".bookmark_add_content input[name='key_inhere']").val(key);
        $(".bookmark_add_content input[name='key']").val(key);
        $(".bookmark_add_content input[name='title']").val(bm["title"] || '');
        $(".bookmark_add_content input[name='url']").val(bm["url"] || '');
        $(".bookmark_add_content input[name='icon']").val(bm["icon"] || '');
        $(".bookmark_list_table").hide();
        $(".bookmark_add_content").show();
    });

    // 书签删除
    $(".bookmark_list").on("click", ".delete_bookmark", function () {
        var key = $(this).val();
        iziToast.show({
            timeout: 8000,
            message: '书签 ' + key + ' 是否删除？',
            buttons: [
                ['<button>确认</button>', function (instance, toast) {
                    var list = getBookmarkList();
                    delete list[key];
                    setBookmarkList(list);
                    setBookmarkInit();
                    instance.hide({ transitionOut: 'flipOutX' }, toast, 'buttonName');
                    iziToast.show({ timeout: 2000, message: '删除成功' });
                }, true],
                ['<button>取消</button>', function (instance, toast) {
                    instance.hide({ transitionOut: 'flipOutX' }, toast, 'buttonName');
                }]
            ]
        });
    });

    // 壁纸设置
    $("#wallpaper").on("click", ".set-wallpaper", function () {
        var type = $(this).val();
        var bg_img = getBgImg();
        bg_img["type"] = type;

        if (type === "1") {
            $('#wallpaper_text').html("显示默认壁纸，刷新页面以生效");
            setBgImg(bg_img);
            iziToast.show({
                message: '壁纸设置成功，刷新生效',
            });
        }

        if (type === "2") {
            $('#wallpaper_text').html("显示必应每日一图，每天更新，刷新页面以生效 | API @ Microsoft Bing");
            setBgImg(bg_img);
            iziToast.show({
                message: '壁纸设置成功，刷新生效',
            });
        }

        if (type === "3") {
            $('#wallpaper_text').html("显示随机风景图，每次刷新后更换，刷新页面以生效 | API @ Microsoft Bing");
            setBgImg(bg_img);
            iziToast.show({
                message: '壁纸设置成功，刷新生效',
            });
        }

        if (type === "4") {
            $('#wallpaper_text').html("显示随机二次元图，每次刷新后更换，刷新页面以生效 | API @ dmoe.cc");
            setBgImg(bg_img);
            iziToast.show({
                message: '壁纸设置成功，刷新生效',
            });
        }

        if (type === "5") {
            $('#wallpaper_text').html("自定义壁纸地址，请输入正确地址，点击保存且刷新页面以生效");
            $("#wallpaper_url").fadeIn(100);
            $("#wallpaper-button").fadeIn(100);
            $("#wallpaper-url").val(bg_img["path"]);
        } else {
            $("#wallpaper_url").fadeOut(300);
            $("#wallpaper-button").fadeOut(300);
        }
    });

    // 自定义壁纸设置保存
    $(".wallpaper_save").click(function () {
        var url = $("#wallpaper-url").val();
        var reg = /^http(s)?:\/\/(([\w-]+\.)+[\w-]|localhost)+(:[0-9]{1,5})?(\/[\w- ./?%&=]*)?$/g;
        if (!reg.test(url)) {
            iziToast.show({
                message: '请输入正确的链接',
            });
        } else {
            var bg_img = getBgImg();
            bg_img["type"] = "5";
            bg_img["path"] = url;
            setBgImg(bg_img);
            iziToast.show({
                message: '自定义壁纸设置成功，刷新生效',
            });
        }
    });

    // 我的数据导出
    $("#my_data_out").click(function () {
        var cookies = Cookies.get();
        var json = JSON.stringify(cookies);
        download("Snavigation-back-up-" + $.now() + ".json", json);
        iziToast.show({
            timeout: 2000,
            message: '已导出备份文件至下载目录'
        });
    });

    // 我的数据导入 点击触发文件选择
    $("#my_data_in").click(function () {
        $("#my_data_file").click();
    });

    // 选择文件后读取文件内容
    $("#my_data_file").change(function () {
        var selectedFile = document.getElementById('my_data_file').files[0];
        //var name = selectedFile.name;//读取选中文件的文件名
        //var size = selectedFile.size;//读取选中文件的大小
        //console.log("文件名:"+name+" 大小:"+size);

        var reader = new FileReader(); //这是核心,读取操作就是由它完成.
        reader.readAsText(selectedFile); //读取文件的内容,也可以读取文件的URL
        reader.onload = function () {
            //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
            //console.log(this.result);

            // json 格式校验
            var mydata;
            try {
                mydata = JSON.parse(this.result);
            } catch (e) {
                iziToast.show({
                    timeout: 2000,
                    message: '数据解析异常'
                });
                return;
            }
            if (typeof mydata != 'object') {
                iziToast.show({
                    timeout: 2000,
                    message: '数据格式错误'
                });
                return;
            }

            iziToast.show({
                timeout: 8000,
                message: '当前数据将会被覆盖！是否继续导入？',
                buttons: [
                    ['<button>确认</button>', function (instance, toast) {
                        for (var key in mydata) {
                            Cookies.set(key, mydata[key], {
                                expires: 36500
                            });
                        }
                        instance.hide({
                            transitionOut: 'flipOutX',
                        }, toast, 'buttonName');
                        iziToast.show({
                            timeout: 2000,
                            message: '导入成功'
                        });
                        setTimeout(function () {
                            window.location.reload()
                        }, 1000);
                    }, true],
                    ['<button>取消</button>', function (instance, toast) {
                        instance.hide({
                            transitionOut: 'flipOutX',
                        }, toast, 'buttonName');
                        setTimeout(function () {
                            window.location.reload()
                        }, 1000);
                    }]
                ]
            });
        }
    });
});
