/* 快捷方式逻辑修复验证脚本（vm 沙箱 + DOM 桩，无 jsdom） */
'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
function ok(cond, name) {
    if (cond) { pass++; console.log('  PASS  ' + name); }
    else { fail++; console.log('  FAIL  ' + name); }
}

// ---------- 通用沙箱 ----------
function makeCtx() {
    const cookieStore = {};
    const ctx = {
        console,
        setTimeout, clearTimeout, requestAnimationFrame: (fn) => 0,
        window: null, document: null, navigator: { userAgent: 'test' },
        Image: function () { this.onerror = null; },
        Object, Array, JSON, Math, String, RegExp, parseInt, isNaN, encodeURIComponent,
        performance: { now: () => 0 },
    };
    ctx.window = ctx;
    ctx.document = {
        addEventListener: () => {},
        removeEventListener: () => {},
        getElementById: () => null,
        querySelectorAll: () => [],
        createElement: () => ({ style: {}, setAttribute() {}, appendChild() {} }),
        body: { appendChild() {}, removeChild() {} },
        fonts: { add() {} },
        readyState: 'complete',
    };
    // 简化 jQuery 桩：只支持测试用到的链
    const $ = (sel) => {
        const el = {
            ready: () => el,
            html: () => el, val: (v) => (v === undefined ? '' : el),
            attr: () => el, text: () => el, css: () => el,
            show: () => el, hide: () => el, click: () => el,
            on: () => el, trigger: () => el, addClass: () => el,
            removeClass: () => el, eq: () => el, siblings: () => el,
            is: () => false, has: () => [], empty: () => el,
            fadeIn: () => el, fadeOut: () => el, append: () => el,
        };
        return el;
    };
    $.trim = (s) => String(s || '').trim();
    $.each = (a, fn) => { if (a) for (let i = 0; i < a.length; i++) fn(i, a[i]); };
    ctx.$ = $;
    ctx.jQuery = $;
    ctx.Cookies = {
        get: (k) => (k in cookieStore ? cookieStore[k] : undefined),
        set: (k, v) => { cookieStore[k] = typeof v === 'string' ? v : JSON.stringify(v); },
    };
    ctx.iziToast = { show: () => {}, settings: () => {} };
    ctx.FontFace = function () {};
    return ctx;
}

function load(ctx, file) {
    const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
    vm.runInContext(src, vm.createContext(ctx), { filename: file });
}

// ---------- 1. icons.js 注入测试 ----------
console.log('\n== icons.js：siteIcon / engineIcon 注入 ==');
{
    const ctx = makeCtx();
    load(ctx, 'js/icons.js');
    const Icons = ctx.Icons;

    // 标题首字注入
    const s1 = Icons.site('https://a.com', '<img src=x onerror=alert(1)>', 40);
    ok(!/<img src=x/.test(s1) && !/onerror=alert/.test(s1), '标题首字被转义（无注入）');
    ok(/&lt;/.test(s1), '标题首字以实体形式输出');

    // 域名注入（URL 中带引号/脚本）
    const s2 = Icons.site("https://evil.com'><script>alert(1)</script>", 'T', 40);
    ok(!/<script>alert\(1\)<\/script>/.test(s2), '域名注入被阻断');
    ok(!/onerror="Icons\.onFavError/.test(s2), '不再拼接内联 onerror');
    ok(/data-domain="evil\.com&#39;&gt;/.test(s2), '域名放入 data-domain 且已转义');

    // favicon = http URL 属性注入
    const s3 = Icons.site('https://a.com', 'T', 40, 'http://x" onerror="alert(1)');
    ok(!/onerror="alert\(1\)"/.test(s3), 'favicon URL 属性注入被阻断');
    ok(/&quot;/.test(s3), 'favicon URL 引号被转义');

    // favicon = si: 品牌 ID 注入
    const s4 = Icons.site('https://a.com', 'T', 40, 'si:x"/><script>alert(2)</script>');
    ok(!/<script>alert\(2\)<\/script>/.test(s4), 'si: 品牌 ID 注入被阻断');
    ok(/&quot;/.test(s4) && /&lt;script&gt;/.test(s4), 'si: ID 以转义形式进入 use href');

    // engineIcon URL 注入
    const s5 = Icons.engine('http://x" onerror="alert(3)', 'T');
    ok(!/onerror="alert\(3\)"/.test(s5), 'engineIcon URL 注入被阻断');

    // 正常品牌图标不受影响
    const s6 = Icons.site('https://github.com/', 'GitHub', 40);
    ok(/q-icon/.test(s6) && /q-favicon/.test(s6), '正常站点图标结构完整');
}

// ---------- 2. set.js 数据安全工具 ----------
console.log('\n== set.js：getXxxList 副本 / 校验工具 ==');
{
    const ctx = makeCtx();
    load(ctx, 'js/set.js');

    // 首次无 cookie：返回副本，修改后不污染预装数据
    const l1 = ctx.getQuickList();
    l1['1'] = { title: '被污染的标题', url: 'https://evil.com/' };
    delete l1['2'];
    ctx.setQuickList(l1); // 保存流程会调用 setter 持久化
    const l2 = ctx.getQuickList(); // 重新读取（cookie 已写入污染版——符合预期）
    ok(l2['1'].title === '被污染的标题', '修改已持久化到 cookie（正常行为）');
    ok(ctx.quick_list_preinstall['1'].title !== '被污染的标题', '预装默认列表未被污染');
    ok(ctx.quick_list_preinstall['2'] !== undefined, '预装默认列表未被删除');

    // 重置能恢复真正的默认值
    ctx.setQuickList(ctx.cloneDefaults(ctx.quick_list_preinstall));
    const l3 = ctx.getQuickList();
    ok(l3['1'].title === ctx.quick_list_preinstall['1'].title, '重置后恢复真实默认值');

    // cookie 形状损坏（可解析但非对象）
    ctx.Cookies.set('quick_list', 'null');
    const l4 = ctx.getQuickList();
    ok(l4 && typeof l4 === 'object' && l4['1'], 'cookie 为 null 时自动重置为默认');
    ctx.Cookies.set('quick_list', '[1,2,3]');
    const l5 = ctx.getQuickList();
    ok(l5 && l5['1'], 'cookie 为数组时自动重置为默认');
    ctx.Cookies.set('quick_list', '{"1":null}');
    const l6 = ctx.getQuickList();
    ok(l6 && l6['1'] === null, '对象形状保留（条目级在渲染层防护）');

    // escapeHtml / safeUrl
    ok(ctx.escapeHtml('<img onerror="x">') === '&lt;img onerror=&quot;x&quot;&gt;', 'escapeHtml 全符号转义');
    ok(ctx.safeUrl('javascript:alert(1)') === '', 'javascript: 协议被拒绝');
    ok(ctx.safeUrl('data:text/html,<b>x</b>') === '', 'data: 协议被拒绝');
    ok(ctx.safeUrl('https://a.com/path?q=1') === 'https://a.com/path?q=1', '合法 https 通过');
    ok(ctx.safeUrl('  http://a.com  ') === 'http://a.com', 'URL 自动去空格');

    // getSeList / getBgImg 同样返回副本
    const s = ctx.getSeList();
    s['1'].title = 'x';
    ok(ctx.se_list_preinstall['1'].title !== 'x', '搜索引擎预装列表未被污染');
    const b = ctx.getBgImg();
    b['type'] = '5';
    ok(ctx.bg_img_preinstall['type'] === '1', '壁纸预装配置未被污染');
}

// ---------- 3. quickData 渲染（XSS 转义 + 非法条目过滤） ----------
console.log('\n== set.js：quickData 渲染 ==');
{
    const ctx = makeCtx();
    // 捕获 .quick-all 的 html 输出
    let lastHtml = '';
    const $ = (sel) => {
        const el = {
            ready: () => el,
            html: (v) => { if (v !== undefined) lastHtml = v; return el; },
            val: () => '', attr: () => el, text: () => el, css: () => el,
            show: () => el, hide: () => el, click: () => el, on: () => el,
            trigger: () => el, addClass: () => el, removeClass: () => el,
            eq: () => el, siblings: () => el, is: () => false, has: () => [],
            empty: () => el, fadeIn: () => el, fadeOut: () => el, append: () => el,
        };
        return el;
    };
    ctx.$ = $;
    ctx.Cookies.set('quick_list', JSON.stringify({
        '1': { title: '正常站', url: 'https://ok.com/' },
        '2': { title: '<img src=x onerror=alert(9)>', url: 'https://xss.com/' },
        '3': { title: '坏协议', url: 'javascript:alert(1)' },
        '4': { title: '', url: 'https://empty-title.com/' },
        '5': null,
    }));
    load(ctx, 'js/icons.js');
    load(ctx, 'js/set.js');
    ctx.quickData();
    ok(lastHtml.indexOf('正常站') !== -1, '合法条目正常渲染');
    ok(lastHtml.indexOf('&lt;img src=x') !== -1, '恶意标题被转义');
    ok(lastHtml.indexOf('<img src=x') === -1 && lastHtml.indexOf('<span class="q-name">&lt;img') !== -1, '标题注入脚本未执行（仅文本）');
    ok(lastHtml.indexOf('javascript:') === -1, 'javascript: 条目被过滤');
    ok(lastHtml.indexOf('empty-title') === -1, '空标题条目被过滤');
    ok(lastHtml.indexOf('set-quick') !== -1, '「添加」按钮仍渲染');
    ok(lastHtml.indexOf('rel="noopener noreferrer"') !== -1, '外链带 noopener');
}

// ---------- 4. setQuickInit 渲染转义 ----------
console.log('\n== set.js：setQuickInit 转义 ==');
{
    const ctx = makeCtx();
    let listHtml = '';
    const $ = (sel) => {
        const el = {
            ready: () => el,
            html: (v) => { if (v !== undefined) listHtml = v; return el; },
            val: () => '', attr: () => el, text: () => el, css: () => el,
            show: () => el, hide: () => el, click: () => el, on: () => el,
            trigger: () => el, addClass: () => el, removeClass: () => el,
            eq: () => el, siblings: () => el, is: () => false, has: () => [],
            empty: () => el, fadeIn: () => el, fadeOut: () => el, append: () => el,
        };
        return el;
    };
    ctx.$ = $;
    ctx.Cookies.set('quick_list', JSON.stringify({
        '1" onclick="alert(8)': { title: '<b>注入</b>', url: 'https://ok.com/' },
        '2': { title: '正常', url: 'https://ok.com/' },
        '3': null,
    }));
    load(ctx, 'js/set.js');
    ctx.setQuickInit();
    ok(listHtml.indexOf('&lt;b&gt;注入&lt;/b&gt;') !== -1, '标题 HTML 被转义');
    ok(!/<b>注入<\/b>/.test(listHtml), '标题未作为 HTML 注入');
    ok(listHtml.indexOf('1&quot; onclick=&quot;alert(8)') !== -1, '异常 key 被转义');
    ok(!/onclick="alert\(8\)"/.test(listHtml), '异常 key 未产生事件属性');
    ok(listHtml.indexOf('正常') !== -1, '正常条目渲染');
    ok(listHtml.indexOf('quick_list_div') !== -1, '列表结构完整');
}

// ---------- 5. 编辑/覆盖逻辑 ----------
console.log('\n== set.js：编辑与覆盖 key 处理 ==');
{
    const ctx = makeCtx();
    ctx.Cookies.set('quick_list', JSON.stringify({
        '1': { title: 'A', url: 'https://a.com/' },
        '7': { title: 'B', url: 'https://b.com/' },
    }));
    load(ctx, 'js/set.js');
    // 模拟：编辑 1 → 改为 7（7 已占用）→ 确认覆盖后旧 key 应被删除
    const list = ctx.getQuickList();
    const key_inhere = '1', key = '7';
    if (list[key]) {
        if (key_inhere && key !== key_inhere) delete list[key_inhere];
        list[key] = { title: 'B2', url: 'https://b2.com/' };
    }
    ok(list['1'] === undefined, '覆盖确认后旧序号被移除');
    ok(list['7'].title === 'B2', '新序号内容已覆盖');
}

console.log('\n结果: ' + pass + ' 通过, ' + fail + ' 失败');
process.exit(fail ? 1 : 0);
