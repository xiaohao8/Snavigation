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

//获取天气
//使用 wttr.in（HTTPS + CORS 全支持、无需 API key、按 IP 自动定位）
//备用：yiketianqi 接口无 CORS 头且仅支持 http，浏览器中无法正常请求
var WEATHER_ZH = {
    'Sunny': '晴',
    'Clear': '晴',
    'Partly cloudy': '多云',
    'Cloudy': '阴',
    'Overcast': '阴',
    'Mist': '雾',
    'Fog': '雾',
    'Light drizzle': '毛毛雨',
    'Drizzle': '毛毛雨',
    'Patchy rain possible': '零星小雨',
    'Light rain': '小雨',
    'Light rain shower': '阵雨',
    'Moderate rain': '中雨',
    'Heavy rain': '大雨',
    'Rain': '雨',
    'Showers': '阵雨',
    'Thunderstorm': '雷雨',
    'Light snow': '小雪',
    'Snow': '雪',
    'Heavy snow': '大雪',
    'Sleet': '雨夹雪',
    'Hail': '冰雹',
    'Windy': '大风'
};

(function getWeather() {
    var controller = new AbortController();
    var timer = setTimeout(function () {
        controller.abort();
    }, 8000); // 8 秒超时，避免接口慢时一直等待
    fetch('https://wttr.in/?format=j1', { signal: controller.signal })
        .then(function (response) { return response.json(); })
        .then(function (data) {
            clearTimeout(timer);
            var cc = data && data.current_condition && data.current_condition[0];
            var today = data && data.weather && data.weather[0];
            if (cc && cc.weatherDesc && cc.weatherDesc[0]) {
                var desc = cc.weatherDesc[0].value;
                $('#wea_text').text(WEATHER_ZH[desc] || desc);
            }
            if (today) {
                $('#tem1').text(today.maxtempC);
                $('#tem2').text(today.mintempC);
            }
        })
        .catch(function (err) {
            clearTimeout(timer);
            console.error('天气获取失败:', err);
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
