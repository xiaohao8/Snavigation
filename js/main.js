//加载完成后执行
window.addEventListener('load', function () {
    //用户欢迎
    iziToast.settings({
        timeout: 3000,
        backgroundColor: '#ffffff40',
        titleColor: '#efefef',
        messageColor: '#efefef',
        progressBar: false,
        close: false,
        closeOnEscape: true,
        position: 'topCenter',
        transitionIn: 'bounceInDown',
        transitionOut: 'flipOutX',
        displayMode: 'replace',
        layout: '1'
    });
    setTimeout(function () {
        iziToast.show({
            title: hello,
            message: '欢迎来到 醉里起始页'
        });
    }, 800);

    //中文字体缓加载-此处写入字体源文件
    //先行加载简体中文子集，后续补全字集
    //由于压缩过后的中文字体仍旧过大，可转移至对象存储或 CDN 加载
    const font = new FontFace(
        "MiSans",
        "url(" + "./font/MiSans-Regular.woff2" + ")"
    );
    document.fonts.add(font);

}, false)

// 快捷方式面板：为每个站点注入 favicon 图标（与书签一致的 Icons.site 渲染）
// 在 load 后执行，确保 icons.js 已就绪；DOM 为静态 HTML，单次遍历即可。
// 注意：Icons.site 内部已不使用 loading="lazy"，避免隐藏面板导致图标“打开才加载”。
function renderShortcutIcons() {
    if (typeof Icons === 'undefined') return;
    var cards = document.querySelectorAll('.mark .quicks');
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        if (card.querySelector('.q-icon')) continue; // 已注入则跳过
        var a = card.querySelector('a');
        if (!a) continue;
        var url = a.getAttribute('href');
        var title = card.getAttribute('title') || (a.textContent || '').trim();
        // Icons.site(url, title, size) → favicon(本地→Gitee→favicon.im) + 彩色首字底，size=40 适配 96px 卡片
        a.insertAdjacentHTML('afterbegin', Icons.site(url, title, 40));
    }
}
window.addEventListener('load', renderShortcutIcons, false);

// 后台预加载快捷方式 favicon：首屏渲染完成后，利用空闲时间（requestIdleCallback）
// 静默拉取并缓存所有站点图标，不等用户打开面板。打开面板时图标已就绪，且不阻塞秒开。
function preloadShortcutIcons() {
    if (typeof Icons === 'undefined' || !Icons.faviconSources) return;
    var links = document.querySelectorAll('.mark .quicks a');
    var seen = {};
    for (var i = 0; i < links.length; i++) {
        var d = Icons.extractDomain(links[i].getAttribute('href'));
        if (!d || seen[d]) continue; // 去重：每个域名只预取一次
        seen[d] = true;
        var sources = Icons.faviconSources(d); // 本地 → Gitee → favicon.im
        var img = new Image();
        (function (srcs) {
            var idx = 0;
            img.onerror = function () {
                idx++;
                if (idx < srcs.length) img.src = srcs[idx];
            };
            img.src = srcs[0];
        })(sources);
    }
}

// 首屏空闲时后台预取（不阻塞加载）；不支持 requestIdleCallback 时退化为 load 后执行
if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(preloadShortcutIcons, { timeout: 2500 });
} else {
    window.addEventListener('load', preloadShortcutIcons, false);
}

//进入问候
now = new Date(), hour = now.getHours()
if (hour < 6) {
    var hello = "凌晨好";
} else if (hour < 9) {
    var hello = "早上好";
} else if (hour < 12) {
    var hello = "上午好";
} else if (hour < 14) {
    var hello = "中午好";
} else if (hour < 17) {
    var hello = "下午好";
} else if (hour < 19) {
    var hello = "傍晚好";
} else if (hour < 22) {
    var hello = "晚上好";
} else {
    var hello = "夜深了";
}

//获取时间
var t = null;
t = setTimeout(time, 1000);

function time() {
    clearTimeout(t);
    dt = new Date();
    var mm = dt.getMonth() + 1;
    var d = dt.getDate();
    var weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    var day = dt.getDay();
    var h = dt.getHours();
    var m = dt.getMinutes();
    if (h < 10) {
        h = "0" + h;
    }
    if (m < 10) {
        m = "0" + m;
    }
    $("#time_text").html(h + '<span id="point">:</span>' + m);
    $("#day").html(mm + "&nbsp;月&nbsp;" + d + "&nbsp;日&nbsp;" + weekday[day]);
    t = setTimeout(time, 1000);
}

// ===== 天气 =====
// 唯一接口：UAPI（https://uapis.cn/api/v1/misc/weather，鉴权见 js/config.js）

// weather_icon（weather_code）代码 → 中文天气映射
// 依据：UAPI OpenAPI 规范中 weather_icon 的 enum（和风天气标准代码体系）
// 说明：仅映射已确认的经典代码段；未收录代码（如 1000+ 新代码）回退接口返回的 weather 文本
var WEATHER_CODE_ZH = {
    '100': '晴', '101': '多云', '102': '少云', '103': '晴间多云', '104': '阴',
    '150': '晴', '151': '多云', '152': '少云', '153': '晴间多云',
    '300': '阵雨', '301': '强阵雨', '302': '雷阵雨', '303': '强雷阵雨', '304': '雷阵雨伴有冰雹',
    '305': '小雨', '306': '中雨', '307': '大雨', '308': '极端降雨', '309': '毛毛雨',
    '310': '暴雨', '311': '大暴雨', '312': '特大暴雨', '313': '冻雨',
    '314': '小到中雨', '315': '中到大雨', '316': '大到暴雨',
    '317': '暴雨到大暴雨', '318': '大暴雨到特大暴雨',
    '350': '阵雨', '351': '强阵雨', '399': '雨',
    '400': '小雪', '401': '中雪', '402': '大雪', '403': '暴雪', '404': '雨夹雪',
    '405': '雨雪天气', '406': '阵雨夹雪', '407': '阵雪',
    '408': '小到中雪', '409': '中到大雪', '410': '大到暴雪',
    '456': '阵雨夹雪', '457': '阵雪', '499': '雪',
    '500': '薄雾', '501': '雾', '502': '霾', '503': '扬沙', '504': '浮尘',
    '507': '沙尘暴', '508': '强沙尘暴', '509': '浓雾', '510': '强浓雾',
    '511': '中度霾', '512': '重度霾', '513': '严重霾', '514': '大雾', '515': '特强浓雾',
    '900': '热', '901': '冷', '999': '未知'
};

// UAPI 数据渲染：返回 false 表示数据结构异常
function renderUapiWeather(data) {
    if (!data || typeof data.weather === 'undefined') return false;
    // 天气：优先用 weather_icon 代码映射（稳定分类），映射不到回退接口 weather 文本
    var weatherText = WEATHER_CODE_ZH[data.weather_icon] || data.weather;
    $('#wea_text').text(weatherText);
    // 当前温度
    if (typeof data.temperature !== 'undefined') {
        $('#tem1').text(Math.round(data.temperature * 10) / 10);
    }
    // 风力（含风向）
    var wind = [];
    if (data.wind_direction) wind.push(data.wind_direction);
    if (data.wind_power) wind.push(data.wind_power);
    $('#wind_text').text(wind.join(' ') || 'N/A');
    return true;
}

(function getWeather() {
    // UAPI：lang 默认 zh 按 IP 自动定位
    if (typeof UapiWeather === 'undefined') {
        console.error('UapiWeather 未加载，请确认已引入 js/uapi-weather.js');
        return;
    }
    UapiWeather.fetch({ lang: 'zh' })
        .then(function (data) {
            renderUapiWeather(data);
        })
        .catch(function (err) {
            console.error('UAPI 天气获取失败:', err && (err.code || err.status), err && err.message);
        });
})();
    
//Tab书签页
$(function () {
    $(".mark .tab .tab-item").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".products .mainCont").eq($(this).index()).css("display", "flex").siblings().css("display", "none");
    })
})

//设置
$(function () {
    $(".set .tabs .tab-items").click(function () {
        $(this).addClass("actives").siblings().removeClass("actives");
        $(".productss .mainConts").eq($(this).index()).css("display", "flex").siblings().css("display", "none");
    })
})

//输入框为空时阻止跳转
$(window).keydown(function (e) {
    var key = window.event ? e.keyCode : e.which;
    if (key.toString() == "13") {
        if ($(".wd").val() == "") {
            return false;
        }
    }
});

//点击搜索按钮
$(".sou-button").click(function () {
    if ($("body").attr("class") === "onsearch") {
        if ($(".wd").val() != "") {
            $("#search-submit").click();
        }
    }
});

//鼠标中键点击事件
$(window).mousedown(function (event) {
    if (event.button == 1) {
        $("#time_text").click();
    }
});

//控制台输出
var styleTitle1 = `
font-size: 20px;
font-weight: 600;
color: rgb(244,167,89);
`
var styleTitle2 = `
font-size:12px;
color: rgb(244,167,89);
`
var styleContent = `
color: rgb(30,152,255);
`
var title1 = 'Snavigation'
var title2 = `
 _____ __  __  _______     ____     __
|_   _|  \\/  |/ ____\\ \\   / /\\ \\   / /
  | | | \\  / | (___  \\ \\_/ /  \\ \\_/ / 
  | | | |\\/| |\\___ \\  \\   /    \\   /  
 _| |_| |  | |____) |  | |      | |   
|_____|_|  |_|_____/   |_|      |_|                                                     
`
var content = `
版 本 号：1.1
更新日期：2022-07-12

Github:  https://github.com/imsyy/Snavigation
`
console.log(`%c${title1} %c${title2}
%c${content}`, styleTitle1, styleTitle2, styleContent)
