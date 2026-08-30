# Snavigation — 项目长期记忆

## 项目概览
- 多页面个人导航起始页（首页 / 快捷方式 / 设置），通过 Dock 切换，数据存 cookie。
- 单 HTML 入口（`index.html`）+ 静态资源（`js/` `css/` `font/` `img/`），Vercel 部署（`vercel.json` 已有）。
- 暗色 / 玻璃 双主题（`body[data-theme="glass"]`），主题变量集中在 `:root`，CSS 通过变量自动适配。
- 设置页左菜单 tabs 用 jQuery 索引式切换：`.set .tabs .tab-items` 点击 → `.productss .mainConts` 同索引显示。新增 tab 必须同时插入 `.tab-items` 与 `.mainConts` 并保持位置一致。

## 数据模型
- `quick_list` cookie：设置页「快捷方式」管理的核心模型（首页 `.quick-all` + 快捷方式页 `.mark` 共享同一数据源，按 `cat` 字段分 8 类：常用/AI/工具/办公/开发/娱乐/学习/设计）。
- 默认值合并策略：`mark_bookmarks`（原始 .mark 精选书签）优先决定分类，再按 URL 去重并入设置种子。旧 cookie 升级用 `mergeMarkDefaults` 一次性补回原始书签（`quick_migrated_v2` cookie 标记防重）。
- `bookmark_list` cookie：设置页「书签」管理，独立模型，UI 由 `BookmarkPanel` 维护，set.js 增改删后调用 `BookmarkPanel.refresh()`。

## 关键技术约束（沙箱/环境）
- `js/animated-list.js`、`js/dock.js` 使用第三方动画库；`js/icons.js` 提供 `Icons.site(url, title, size, favicon)` 用于快捷方式 favicon 渲染。
- `.favicon-row` / `.favicon-pick` 必须有 CSS 配套，否则表单布局被撑破。
- `<select>` 在暗色主题需 `appearance:none` + 自定义箭头 + 显式 `color`；`body[data-theme="glass"]` 下用深色。
- `node --check` 校验所有自写 JS 语法；`style.css` 大括号 179/179 是健康基线。

## PWA（2026-08-24 接入）
- `manifest.webmanifest` + `sw.js`（根目录，scope `/`）+ `js/pwa.js` + 5 个图标（`img/icon/pwa-*.png` + `apple-touch-icon.png`）。
- 主题色 `#404040`（与 favicon 深灰一致），display=standalone，start_url=`./?source=pwa`。
- 安装 UI：设置 App tab（主入口）+ 浮动 FAB（可关闭，`localStorage` 记忆）；iOS Safari 显示分享面板指南（无 beforeinstallprompt）。
- 离线：预缓存 app shell + 同源 cache-first 运行期缓存。
- 升级缓存：sw.js 顶部 `CACHE` 常量（`snavigation-v1`），bump 即清理旧缓存。
