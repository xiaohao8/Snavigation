# 醉里起始页 Snavigation：纯前端导航页的二开改造与性能优化实践

> 一个纯前端、无后端的浏览器起始页项目，基于 imsyy 的开源项目 Snavigation fork 二改。这篇文章记录项目长什么样，以及暗色主题、移动端适配、图标本地化、秒开优化这几个值得分享的实现细节。

## 前言

每个前端开发者大概都想要一个"打开浏览器就是自己地盘"的起始页。前阵子我把自己一直用的起始页项目做了一次比较大的二开改造：**暗色主题、移动端性能优化、favicon 图标体系本地化、加载速度优化**……前前后后改了不少东西，把过程中的思路和踩过的坑整理成文，希望能给同样在折腾起始页/导航页的朋友一些参考。

## 一、项目简介

- **项目名**：醉里起始页（Snavigation）
- **Demo**：https://snavigation.vercel.app/
- **仓库**：https://github.com/xiaohao8/Snavigation
- **Gitee 镜像**：https://gitee.com/xiaohao3/Snavigation
- **原作者**：imsyy（本项目在其基础上二改，尊重开源）

整个项目**零后端、零数据库**，纯静态托管在 Vercel 上，随处可部署、刷新即用。

![主页效果图](https://s2.loli.net/2022/07/15/FE6U2BJCynHDep8.jpg)

## 二、功能一览

- 时间 / 日期 / 天气实时显示
- 多搜索引擎切换（百度 / 谷歌 / 搜狗等）
- Dock 三页导航：首页 · 快捷方式 · 设置
- 快捷方式面板：8 大分类、80+ 站点一键直达
- 书签管理：完全自定义收藏
- 主题系统：暗色（纯黑主页）/ 液态玻璃 + 按时间段自动切换
- 网站背景自定义
- 数据备份与恢复
- 移动端完整适配
- 控制台彩蛋（`F12` 有惊喜）

## 三、技术栈

| 类别 | 选型 |
| --- | --- |
| 语言 | HTML + CSS + 原生 JavaScript |
| 依赖 | jQuery、iziToast（均已本地化） |
| 图标 | Iconfont、Lucide、自建 favicon 体系 |
| 天气 | UAPI（uapis.cn） |
| 字体 | MiSans（本地 woff2，按需加载） |
| 统计 | 51.la |
| 部署 | Vercel |

## 四、目录结构

```
Snavigation/
├── index.html            # 单页应用
├── css/                  # 9 个样式文件（style/mobile/dock/theme…）
├── js/
│   ├── lib/              # 本地化的 jQuery / iziToast
│   ├── main.js           # 时间、天气、快捷方式图标注入
│   ├── icons.js          # favicon 多源回退体系
│   ├── dock.js           # Dock 磁性放大动画
│   ├── theme.js          # 主题 + 自动切换
│   └── …
├── img/favicons/         # 80+ 预下载的站点图标
├── font/                 # MiSans 本地字体
└── vercel.json           # Vercel 路由配置
```

## 五、几个值得展开的实现细节

### 5.1 主题系统：纯黑主页 + 按时段自动切换

起始页是高频页面，主题体验很重要。项目支持两套主题：

- **暗色（默认）**：主页纯黑（`#000000`），三页面板（首页搜索 / 快捷方式 / 设置）统一为 `#120F17`，视觉上非常干净；
- **液态玻璃**：保留壁纸 + 毛玻璃效果，适合白天使用。

另外做了一个**按时段自动切换**：在设置页打开"自动切换"后，18:30 自动进入暗色、07:00 回到玻璃主题，状态存在 cookie 里。跨午夜（`from > to`）的判断也处理了：

```js
// theme_auto_from=18:30, theme_auto_to=07:00
const inRange = (now, from, to) =>
  from === to ? true : from < to
    ? (now >= from && now < to)
    : (now >= from || now < to); // 跨午夜
```

### 5.2 移动端卡顿：三个根因逐一解决

手机端打开/关闭设置面板一度卡顿，排查出三个根因：

1. **Dock 的 `requestAnimationFrame` 永久循环**：每帧对 dock 每项 `getBoundingClientRect()` 强制同步重排 → 全页持续重排。改成弹簧静止即 `cancelAnimationFrame` 停循环，鼠标移入/移出再启动；
2. **`backdrop-filter: blur()` 开销极大**：移动端直接关闭毛玻璃，面板改纯色兜底；
3. **全局 `transition: 0.3s`**：移动端无 hover 时纯属浪费，`@media` 里关掉。

触屏还有一个坑：tap 会触发合成 `mousemove` 但没有 `mouseleave`，导致 dock 磁性放大到 256px 收不回来。修复是用 `matchMedia('(hover: hover) and (pointer: fine)')` 判断，**只有桌面鼠标才启用磁性放大**，移动端 dock 变成静态按钮栏：

```js
const hoverCapable = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
if (hoverCapable) { /* 绑定 mousemove/mouseleave，启动弹簧动画 */ }
```

### 5.3 favicon 体系：本地优先 + 多源回退 + 后台预加载

快捷方式/书签的图标加载曾是大问题。最初用的 dnspod `proxy_favicon` 接口实际返回的是 JSON 包装的错误页（不是图片），每个图标都要先失败再回退，又慢又不稳。

现在的方案分三层：

1. **预下载到本地**：把 80+ 个站点的 favicon 提前下载到 `img/favicons/`，同域加载瞬时完成 + 浏览器缓存；
2. **多源回退链**：`本地 → Gitee raw（raw.giteeusercontent.com 国内 CDN）→ favicon.im → 彩色首字徽章`，全失败也不难看；
3. **后台预加载**：页面首屏渲染后，用 `requestIdleCallback` 静默预取全部图标并缓存，**打开快捷方式面板时图标已经是缓存态**，秒显。

这里踩了一个很典型的坑：**`loading="lazy"` + 隐藏面板**。快捷方式面板默认 `display:none`，浏览器会把隐藏容器里的懒加载图片一直推迟到可见才加载——表现就是"打开面板才加载"。去掉懒加载 + 空闲预取就解决了。

还有个小坑：部分站点（如学习通）的官方 favicon 是**内嵌 BMP 的 ICO**，某些浏览器渲染不出来。我在 Node 里写了个 BMP→PNG 转换器（解析 DIB 像素 + zlib + 手写 CRC32 编码），统一转成标准 PNG 入库，一劳永逸。

```js
// favicon 有序回退源：本地 → Gitee → favicon.im
function faviconSources(domain) {
  const ext = FAV_MAP[domain] || 'png';
  const arr = ['img/favicons/' + domain + '.' + ext];
  if (FAV_MAP[domain]) arr.push(GITEE_RAW + domain + '.' + ext);
  arr.push('https://favicon.im/' + domain);
  return arr;
}
```

### 5.4 秒开优化：全站脚本 defer

起始页讲究"秒开"，重点优化了渲染关键路径：

- **jQuery / iziToast 从 `<head>` 移到 defer**：原本在 head 里阻塞 HTML 解析，全部外部脚本加 `defer` 后并行下载、解析完再按序执行，首屏不受 JS 阻塞；
- **依赖全部本地化**：jQuery、iziToast、MiSans 字体都不走公共 CDN，避免 CDN 失效/慢速；
- 图标同域本地加载 + 后台预取（见 5.3）。

效果：本地环境下秒开；线上 Vercel 走 HTTP/2 + gzip，首屏很快。

### 5.5 快捷方式：脚本批量导入 83 个链接

把桌面上一份 7 大类 80+ 站的清单导入了快捷方式面板：先按分类生成 8 个 tab 的 HTML（常用 / AI / 工具 / 办公 / 开发 / 娱乐 / 学习 / 设计），再在页面 `load` 后用 `Icons.site(url, title, 40)` 给每个卡片注入 40px favicon 图标，卡片就是"图标在上、文字在下"的效果。批量生成时用脚本校验了 div 开合配平，避免手改 160 行 HTML 出错。

## 六、部署到 Vercel

Vercel 上部署纯静态站几乎零成本，SPA 路由回退靠 `vercel.json`：

```json
{
  "version": 2,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "status": 404, "dest": "/" }
  ]
}
```

把仓库推到 GitHub 后，在 Vercel 导入即可；Gitee 同步一份作为国内镜像，favicon 回退链也顺便走了 Gitee 的国内 CDN，一举两得。

## 七、写在最后

起始页这种"小项目"，反而很适合打磨细节：主题、性能、图标、移动端，每一项都有不少讲究。这篇文章里提到的几个优化点：

- 隐藏容器 + `loading="lazy"` 会导致图片"要用时才加载"；
- ICO 内嵌 BMP 存在渲染兼容问题，关键图标建议转 PNG；
- 移动端优先关掉毛玻璃、停掉无效动画循环；
- 全站脚本 `defer` 是纯静态站最简单的秒开优化。

感谢原作者 imsyy 和参考项目（青柠起始页、sou2）。如果这篇文章对你有帮助，欢迎**点赞、收藏、关注**，评论区聊聊你的起始页是怎么折腾的～

---

*仓库：https://github.com/xiaohao8/Snavigation ｜ Demo：https://snavigation.vercel.app/*
