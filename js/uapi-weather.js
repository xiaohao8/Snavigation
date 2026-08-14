/* ============================================================
 * UAPI 天气接口封装（https://uapis.cn/api/v1/misc/weather）
 * ------------------------------------------------------------
 * 主接口：GET /misc/weather
 * 鉴权：Authorization: Bearer <KEY>（密钥在 js/config.js 的 window.UAPI_KEY，留空走访客额度）
 *
 * 用法：
 *   UapiWeather.fetch({ city: '北京', forecast: true, extended: true, lang: 'zh' })
 *     .then(function (data) { ... })
 *     .catch(function (err) { err.code / err.status / err.message });
 *
 * 参数：
 *   city     城市名称（中文/英文），可选，默认 IP 自动定位
 *   adcode   行政区划代码，优先于 city，可选
 *   extended 扩展气象字段（布尔）
 *   forecast 多天预报，最多 7 天（布尔）
 *   hourly   逐小时预报 24h（布尔）
 *   minutely 分钟级降水，仅国内（布尔）
 *   indices  18 项生活指数（布尔）
 *   lang     zh（默认）/ en
 *
 * 错误处理：超时、网络异常、非 2xx（400/401/404/429/500/503 等）统一转为 Error，
 *           附带 err.status（HTTP 状态码）与 err.code（业务错误码）。
 * ============================================================ */
(function (global) {
    'use strict';

    var UAPI_BASE = 'https://uapis.cn/api/v1';
    var DEFAULT_TIMEOUT = 10000; // 10 秒超时

    // 业务错误码说明（含文档未列但实测存在的 401）
    var ERROR_CODES = {
        INVALID_PARAMETER: '参数无效（400）',
        INVALID_API_KEY: 'API 密钥无效或已失效（401），请检查 js/config.js 中的 UAPI_KEY',
        NOT_FOUND: '未找到该城市的天气数据（404）',
        RATE_LIMITED: '请求频率超限（429）',
        INTERNAL_SERVER_ERROR: '服务器内部错误（500）',
        SERVICE_UNAVAILABLE: '天气服务暂时不可用（503）',
        TIMEOUT: '请求超时',
        NETWORK: '网络异常'
    };

    // ---- 参数校验与规整 ----

    // lang 仅支持 zh / en，其余回退 zh
    function normalizeLang(lang) {
        return lang === 'en' ? 'en' : 'zh';
    }

    // 布尔参数规整：true/'true'/1 → 'true'，其余 → 'false'（仅在需要时附加）
    function boolParam(value) {
        return value === true || value === 'true' || value === 1;
    }

    // 构建查询串（校验并过滤非法/空参数）
    function buildQuery(opts) {
        opts = opts || {};
        var parts = [];

        var city = opts.city;
        var adcode = opts.adcode;
        // adcode 格式：6 位数字（如 110000），非法时忽略并回退到 city
        if (typeof adcode === 'string' && /^\d{6}$/.test(adcode.trim())) {
            parts.push('adcode=' + encodeURIComponent(adcode.trim()));
        } else if (city && typeof city === 'string' && city.trim() !== '') {
            parts.push('city=' + encodeURIComponent(city.trim()));
        }
        // 两者都不传 → 走 IP 自动定位

        if (boolParam(opts.extended)) parts.push('extended=true');
        if (boolParam(opts.forecast)) parts.push('forecast=true');
        if (boolParam(opts.hourly)) parts.push('hourly=true');
        if (boolParam(opts.minutely)) parts.push('minutely=true');
        if (boolParam(opts.indices)) parts.push('indices=true');
        parts.push('lang=' + normalizeLang(opts.lang));

        return parts.join('&');
    }

    // ---- 主调用 ----

    /**
     * 查询天气
     * @param {Object} opts 查询参数（见文件头注释）
     * @returns {Promise<Object>} 天气数据对象
     */
    function fetchWeather(opts) {
        return new Promise(function (resolve, reject) {
            var query = buildQuery(opts);
            var url = UAPI_BASE + '/misc/weather' + (query ? '?' + query : '');

            var controller = new AbortController();
            var timer = setTimeout(function () {
                controller.abort();
            }, DEFAULT_TIMEOUT);

            var headers = { 'Accept': 'application/json' };
            // 密钥来自配置（js/config.js），留空则走访客额度；不拼接进 URL
            var key = (typeof global !== 'undefined' && global.UAPI_KEY) || '';
            if (key) {
                headers['Authorization'] = 'Bearer ' + key;
            }

            fetch(url, {
                method: 'GET',
                headers: headers,
                signal: controller.signal
            })
                .then(function (res) {
                    // 优先尝试解析错误响应体，失败则忽略
                    return res.json()
                        .catch(function () { return null; })
                        .then(function (body) {
                            if (!res.ok) {
                                var err = new Error((body && body.message) || 'UAPI 请求失败');
                                err.status = res.status;
                                err.code = (body && body.code) || ('HTTP_' + res.status);
                                throw err;
                            }
                            return body;
                        });
                })
                .then(function (data) {
                    clearTimeout(timer);
                    resolve(data);
                })
                .catch(function (err) {
                    clearTimeout(timer);
                    // 超时：AbortController 中止产生的 AbortError
                    if (err && err.name === 'AbortError') {
                        var timeoutErr = new Error('UAPI 天气请求超时');
                        timeoutErr.code = 'TIMEOUT';
                        timeoutErr.status = 0;
                        reject(timeoutErr);
                        return;
                    }
                    // 网络层错误（无 status/code 的 TypeError 等）
                    if (!(err instanceof Error) || (err.status === undefined && err.code === undefined)) {
                        var netErr = new Error('UAPI 天气请求网络异常');
                        netErr.code = 'NETWORK';
                        netErr.status = 0;
                        netErr.cause = err;
                        reject(netErr);
                        return;
                    }
                    reject(err);
                });
        });
    }

    // 错误码转可读描述（供界面提示）
    function describeError(err) {
        if (!err) return '未知错误';
        return ERROR_CODES[err.code] || (err.message || '未知错误');
    }

    // ---- 暴露全局 ----
    global.UapiWeather = {
        fetch: fetchWeather,
        describeError: describeError,
        BASE: UAPI_BASE
    };
})(window);
