# DeepSeek Harness（dsh）保姆级使用教程：从一行命令到插件开发

> 核心一句话：**Agent = Model + Harness**。模型负责"想"，Harness 负责"做"——把模型的能力接进文件系统、终端、网页和工具链，让 AI 真正在本地替你干活。
>
> 本文基于 DeepSeek Harness 官方开源仓库（2026-08-13 发布，MIT 协议）整理，适合零基础到进阶的所有读者。

## 目录

1. [这是什么：DeepSeek Harness 能干什么](#一这是什么deepseek-harness-能干什么)
2. [核心概念：一切皆插件](#二核心概念一切皆插件)
3. [环境要求](#三环境要求)
4. [安装与启动（4 种方式）](#四安装与启动4-种方式)
5. [首次配置三步走](#五首次配置三步走)
6. [Web 界面速览](#六web-界面速览)
7. [权限与安全：Agent 能碰你多少文件](#七权限与安全agent-能碰你多少文件)
8. [四种预设模式怎么选](#八四种预设模式怎么选)
9. [模型接入：不止 DeepSeek](#九模型接入不止-deepseek)
10. [会话与上下文管理](#十会话与上下文管理)
11. [插件系统：自由扩展](#十一插件系统自由扩展)
12. [进阶玩法：CLI / TUI / 无头模式 / Python SDK](#十二进阶玩法cli--tui--无头模式--python-sdk)
13. [常见问题排查](#十三常见问题排查)
14. [安全与注意事项](#十四安全与注意事项)

---

## 一、这是什么：DeepSeek Harness 能干什么

**DeepSeek Harness**（命令行名 `dsh`）是 DeepSeek AI **官方出品**的开源 Agent 框架，MIT 协议。它和我们平时用的网页版对话 AI 最大的区别是：

> 网页对话 AI 交付的是一段话，**Harness 交付的是一件做完的事**。

它原生具备以下能力：

- **自主读写本地文件**（在划定的工作区内）
- **执行终端命令**（Shell / PowerShell）
- **多步骤自主任务规划**（不是一问一答，而是拆解任务逐步执行）
- **多模型兼容**（BYO Model，自带模型端点）
- **插件自由扩展**（换搜索引擎、接自家模型服务，改配置即可，不用改框架源码）
- 多端使用：Web UI / 桌面端 / 终端 TUI / 无头模式 / Python SDK

适用场景：办公整理、代码开发、项目巡检、服务器运维等需要在真实环境里动手的复杂任务。

**项目地址**

- 官方仓库：https://github.com/deepseek-ai/deepseek-harness
- 官方页面：https://www.deepseek.com/harness/
- 官方文档：https://deepseek-harness.github.io/deepseek-harness/en/guide/quickstart

> ⚠️ 当前为**开发者预览版**（Developer Preview），官方明示会快速迭代、可能出现破坏性变更，生产环境使用请留意版本更新。

## 二、核心概念：一切皆插件

Harness 的核心理念只有一句话：**"Everything is a Plugin"（一切皆插件）**。

模型接入、工具调用、会话存储、审批策略、UI 组件……整个系统的每一个环节都是**可替换、可组合的插件**。它的架构由 **Cordis** 微内核驱动（Koishi 生态的插件内核，设计思想来自论文 *A Programming Paradigm for Spatiotemporal Composability*）。

这意味着：

- 想换模型服务？改配置，不动源码；
- 想加个工具？装个插件；
- 想改审批策略？换个审批插件。

同类的工具（Claude Code、Codex 等）通常把核心逻辑写死，只能在预留接口上有限定制；DSH 反其道而行——**从模型到工具注册表，从会话日志到审批策略，全部插件化**。

## 三、环境要求

| 项目 | 要求 |
| --- | --- |
| 操作系统 | Windows / macOS / Linux 均可 |
| Node.js | **≥ 22.19**（LTS 即可，官方推荐 Node 24 LTS，兼容性最优） |
| 包管理器 | npm（Node 自带）；源码构建需要 pnpm ≥ 10 |
| 硬件 | 内存 ≥ 4G，本地磁盘预留 2G 以上 |
| 网络 | 可访问 npm 与 DeepSeek 开放平台 |
| 浏览器 | Chrome / Edge 最新版优先，不兼容老旧浏览器 |

**检查环境**：

```bash
node --version
npm -v
```

- 能打印 `v22.19` 及以上 → 继续；
- 提示 `command not found: node` → 到 https://nodejs.org 下载 LTS 版安装，**务必保留安装器默认勾选的"添加到 PATH"**，装完重启终端。

## 四、安装与启动（4 种方式）

### 方式 A：一行命令快速启动（推荐首次体验）

```bash
npx @deepseek-ai/dsh web
```

npx 会自动拉取并运行，不需要预先安装。首次启动会下载全部依赖，根据网速耗时 1~3 分钟属正常。启动成功后终端会打印：

```
dsh web: http://127.0.0.1:3080
```

浏览器打开 `http://127.0.0.1:3080` 即进入官方原生 Web 界面。

### 方式 B：全局安装（日常使用推荐）

```bash
npm install -g @deepseek-ai/dsh
dsh --version   # 验证安装，能打印版本号即成功
dsh web         # 启动
```

### 方式 C：源码构建（开发者 / 二次定制）

```bash
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
corepack enable        # 启用 pnpm
pnpm install
pnpm run build
pnpm dsh web
```

适合需要修改内核、自定义原生插件、跟进官方最新迭代、参与开源贡献的用户。

### 方式 D：Python SDK（程序化接入）

```bash
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
python -m venv .venv
# Windows 激活：.venv\Scripts\activate   |   macOS/Linux：source .venv/bin/activate
pip install deepseek-harness-sdk
export DEEPSEEK_API_KEY='你的密钥'
```

内置运行时，无需单独安装 Node.js。

**启动后的三个关键认知**

1. **终端窗口不能关**。`dsh web` 这个进程是真正干活的 Host，浏览器里的网页只是操作界面。终端一关，网页立刻失联——这不是故障，是设计。
2. **默认只监听本机**（`127.0.0.1`），局域网其他设备访问不到，这是安全设计。
3. **端口可以换**：3080 被占用时用 `dsh web --port 8080`。

## 五、首次配置三步走

### 第 1 步：申请 DeepSeek API Key

1. 打开 DeepSeek 开放平台：https://platform.deepseek.com/ ，注册登录并**充值少量余额**（如 10 元，日常试用消耗极低）；
2. 左侧进入 **API Keys**，点击**创建 API key**，输入名称；
3. **密钥只在创建那一刻显示一次**，立即复制保存，关掉页面就再也看不到了，丢失需重新创建。

> 🔒 安全规范：禁止截图泄露密钥、禁止明文写入代码文件、禁止上传到 Git 仓库，避免账号被盗用、恶意扣费。

### 第 2 步：配置 API Key

在 Web 界面弹窗/设置中粘贴密钥并保存，**无需重启服务即时生效**。

密钥字段是**只写**的——保存后页面只能看到脱敏描述符，永远不会回显明文。密钥存储在 `$DSH_HOME/.credentials.yaml`，settings 里只保留凭据引用。

### 第 3 步：选择工作区（解决输入框灰色无法使用）

官方自带严格安全隔离机制：**未选中工作区时，所有对话输入框是锁定禁用的**，这是新手最常见的卡点。

1. 界面左侧点击**选择工作区** → **+** 新增本地文件夹；
2. 安全禁忌：**禁止选择系统盘根目录、系统文件夹、桌面全目录、隐私文件目录**；
3. 推荐：新建一个空白专属文件夹，仅用于 Harness 任务处理；
4. 选中后输入框自动解锁，即可正常发送指令。

### 第 4 步：选择预设模式

官方内置 4 套预设模式，**新建会话时选择，运行后无法中途切换**（见第八节）。

配置完成后直接跑一个任务验证——能正常返回结果就说明一切就绪：

```
请读取当前工作区的全部文件与目录结构，仅做汇总展示，不修改、不新增、不删除任何文件，清晰列出文件夹内所有资源。
```

成功判定：AI 正常输出目录清单、无报错、无超时，即部署完成。

## 六、Web 界面速览

- **左侧**：工作区文件树、会话列表（自动永久保存，支持搜索/重命名/删除/回溯恢复）
- **中间**：对话区。输入框支持 `@` 引用本地文件、粘贴图片附件
- **右侧**：产物预览（HTML、文档、图表等）

核心特色：**轨迹面板（Trajectory）**——完整记录模型思考过程、工具调用记录、文件修改日志、终端命令执行详情，逐条可回溯、可排查报错。

底部状态栏实时展示：当前模型、上下文 Token 占用量、推理速度 TPS、缓存命中率、工作区权限等级。

## 七、权限与安全：Agent 能碰你多少文件

### 三档权限模型

| 权限档 | 内部名 | 允许做什么 | 典型场景 |
| --- | --- | --- | --- |
| 只读 | Read Only | 只读，不能修改任何文件 | 调查、总结、出方案 |
| 工作区写 | Workspace Write | 只能在工作区内写文件 | 日常默认 |
| 全访问 | danger-full-access | 全盘读写，无边界 | 高风险操作，**切换前会二次确认** |

> ⚠️ `danger-full-access` 的内部名已经说明了风险等级——它是"危险模式"，不是"高级模式"。

### 一个必须建立的认知

**权限限制的是"写"，不是"看"**。Workspace Write 只限制写入范围；读取文件、联网、查看系统进程不受同等限制。它的"手"被绑住了，但"眼睛"是自由的。涉及敏感的操作（联网上传、系统级改动）会触发**审批弹窗**，由你确认后才会执行，不会静默放行。

### 底层沙箱

三档权限有真实的**操作系统级沙箱**支撑：

| 平台 | 沙箱机制 |
| --- | --- |
| Linux | bwrap（bubblewrap）/ Landlock |
| macOS | Seatbelt |
| Windows | ACL 受限令牌 |

另外还有两个常驻纠偏插件：**重复无效动作检测**（防止 Agent 对着同一个失败方案反复重试）和**超时强制中断**（防止任务无限期运行）。

## 八、四种预设模式怎么选

Preset（预设）是能力组合包——同一种模型，挂上不同的工具集和规则，就能承担不同的"岗位"。

| 模式 | 工具集 | 适合场景 |
| --- | --- | --- |
| **标准模式（Standard）** | 全功能：文件编辑、Shell、检索、Skills、计划、子代理、工作流 | 功能最完整，拿不准就选它 |
| **PTC 模式（Code Mode）** | 模型编写 TypeScript，把多步工具操作组合成一段程序一次执行 | 批量任务，效率提升 3~8 倍 |
| **极简模式（Minimal）** | 仅保留核心文件编辑、Shell 工具，禁用冗余插件 | 性能评测、轻量化精准调试 |
| **创造模式（Creator）** | 插件热加载、自定义 Agent 模板、内核调试 | 插件开发、私有化工作流定制 |

**注意**：模式决定工具集，中途切换会破坏会话可复现性，所以**新建会话后无法切换模式**，需提前选择。

## 九、模型接入：不止 DeepSeek

DSH 是 **BYO Model** 模式——框架本身不带模型，需要自己配置一个可用的模型端点。

### 9.1 DeepSeek 官方 API

设置 → 模型 → 在 DeepSeek 卡片中粘贴 API Key → 保存。模型选择器中可选择 `DeepSeek V4 Pro`（Agent 能力增强版）或 `DeepSeek V4 Flash`（轻量快速），配置即时生效。

### 9.2 其他官方目录提供方

想接 Anthropic / OpenAI 等：设置 → 模型 → **添加提供方** → 选择提供方 → 输入 API 密钥 → 保存。

> NOTE：使用原生认证的提供方（Bedrock、Vertex、Azure、Codex）需要各自的专属凭据——AWS 凭据与区域、ADC 项目、api-version、OAuth 等，只填 API Key 字段是无法完成配置的。

### 9.3 自定义提供方（公司网关 / 自建服务器）

设置 → 模型 → **添加自定义提供方**，填写：

| 字段 | 说明 |
| --- | --- |
| Provider ID | 小写标识，**永久性**——请求、已保存会话、模型默认值和凭据引用都会用到它；重命名 = 新建一个再删旧的 |
| 显示名称 | 可随时修改 |
| 基础 URL | 你的 API 地址 |
| API 协议 | 如 `openai-completions` |
| 凭据 | API Key 或环境变量引用（如 `apiKeyEnv: GATEWAY_API_KEY`） |
| 模型 | 至少一个模型 ID；支持 OpenAI 兼容 `GET /models` 的端点可自动发现 |

### 9.4 视觉模型

自定义模型在声明能力之前一律按纯文本对待。要让它能接收图片，需在 `$DSH_HOME/settings.yaml` 中给该模型加 `input: [text, image]`：

```yaml
llm-pi-ai:
  providers:
    my-gateway:
      apiKeyEnv: GATEWAY_API_KEY
      api: openai-completions
      baseURL: https://gateway.example/v1
      models:
        - id: legacy-chat
        - id: vision-preview
          input: [text, image]
```

### 9.5 配置阶段常见报错

| 报错 | 含义与解决 |
| --- | --- |
| `MISSING_CREDENTIAL` | 密钥未配置：通过模型页存储密钥，或提供 settings 引用的环境变量 |
| `UNKNOWN_MODEL` | 模型未配置：选择已配置模型，或向自定义提供方添加缺失的模型 ID |
| 获取可用模型返回 401 | 密钥无效；该服务不支持 `GET /models` 时请手动输入模型 ID |
| 图片在发送前被拒 | 模型未声明图片能力：给自定义模型加 `input: [text, image]` |

## 十、会话与上下文管理

### 会话操作

- **新建**：点"新会话"，选择模式、权限、模型
- **重命名 / 搜索**：会话多了之后靠它们找历史
- **恢复历史会话**：随时接着聊
- **归档**：从列表隐藏，数据不删，可随时从"已归档"恢复
- **Fork**：从某一轮对话分出一条新会话，原会话不受影响——适合"同一个起点，试不同做法"

### 上下文管理

- DSH 通常会自动整理较早的对话（自动压缩）；
- 需要立即压缩时手动执行 `/compact`，把早期对话整理成摘要；
- 压缩不会删除原始历史——完整日志仍然保留（轨迹面板可回溯）。

### 快捷键

| 按键 | 作用 |
| --- | --- |
| `Shift + Enter` | 换行，不发送 |
| 终端 `Ctrl + C` | 停止整个 DSH Host |

## 十一、插件系统：自由扩展

官方原生支持 **NPM 包 / Git 地址 / 本地路径**三种插件安装方式：

```bash
# 官方 Web 全局插件安装命令
dsh plugin --profile web add 插件包名

# 示例：安装官方图像识别插件
dsh plugin --profile web add @liustack/modlens
```

安装完成后**刷新 Web 界面**即可自动加载，可在 设置 → 插件 面板统一管理启用/禁用。

社区插件生态发展迅速（发布一天即收录 300+ 插件），可到 GitHub Discussions / 官方企微群 / 微信公众号获取最新插件。

## 十二、进阶玩法：CLI / TUI / 无头模式 / Python SDK

### 12.1 终端 TUI（界面对标 Claude Code）

`dsh-tui` 是官方收录的优质社区终端插件，零核心源码修改、纯插件挂载，适配 VS Code 终端、Linux 远程 SSH 运维、全键盘操作：

```bash
npm install -g @deepseek-ai/dsh@0.1.0-rc.6 @deepseek-harness-tui/dsh-tui@0.7.3

# macOS/Linux 终端配置密钥并启动
export DEEPSEEK_API_KEY='你的完整API Key'
dsh-tui
```

> 环境变量修改后需完全退出程序重启方可生效；禁止将密钥写入 Shell 脚本、`.env` 等可托管文件。

启动后可输入 `/doctor` 自检：检测 Node 版本、系统架构、模型连接状态、密钥有效性、工作目录权限、插件加载状态等。

**常用斜杠命令**：

- 会话：`/new` 新建、`/resume` 恢复、`/rename` 重命名、`/compact` 压缩上下文、`/export` 导出
- 模型：`/model` 切换、`/cost` 查看 Token 计费、`/status` 查看状态
- 工具：`/permissions` 查看权限、`/mcp` 查看插件连接、`/provider` 添加自定义模型
- 开发运维：`/audit` 代码审计、`/review` 代码评审、`/update` 一键更新
- 个性化：`/theme` 切换主题、`/lang` 中英切换、`/help` 全部指令

### 12.2 无头（Headless）模式

无需交互、无需界面，后台静默执行任务，适配**脚本自动化、CI 流水线、定时任务、服务器批量运维**场景。详见官方文档命令用法。

### 12.3 Python SDK

```python
import deepseek_harness_sdk as dsh
# 以编程方式启动任务、接收结果
```

## 十三、常见问题排查

| 现象 | 原因 | 解决 |
| --- | --- | --- |
| `command not found: node` | Node 未安装或未加入 PATH | 重装 Node，保留"添加到 PATH"勾选；已安装则关掉终端重开 |
| `node -v` 低于 v22.19 | 版本过旧 | 官网下载最新 LTS 覆盖安装 |
| `command not found: dsh` | 全局安装未成功 | 重跑安装命令看报错；改用 `npx @deepseek-ai/dsh web` 兜底 |
| 端口被占用 | 3080 被其他程序占用 | `dsh web --port 8080` |
| 网页打不开 | 启动失败或端口冲突 | 看运行终端里的报错输出；`Ctrl + C` 停掉重启 |
| 模型调用 401 | API Key 含空格、过期、账号无余额 | 重新复制密钥并刷新配置 |
| 文件读写失败 | 工作区文件夹权限不足 | 更换新建空白文件夹作为工作区 |
| 页面空白加载失败 | 代理/VPN 干扰或缓存问题 | 关闭代理、清空浏览器缓存，更换 Chrome/Edge 重试 |

**排错第一原则**：先看跑 `dsh web` 的那个终端窗口——绝大多数问题的答案都在它的报错输出里。

## 十四、安全与注意事项

1. **API Key 即密码**：只在创建时可见一次，不截图、不发公开渠道、不写进代码/仓库；
2. **工作区即边界**：只给 Agent 授权它该碰的文件夹；敏感目录（桌面、文档、系统盘）不要设成工作区；
3. **danger-full-access 慎用**：切换前会二次确认，理解风险再开；
4. **开发者预览版**：可能快速迭代、出现破坏性变更，重要环境记得锁版本、看更新日志；
5. **写操作需审批**：Agent 执行删除、批量修改、高危 Shell 命令时会弹窗确认，留意弹窗内容，不盲目点允许。

## 结语

DeepSeek Harness 用"一切皆插件"的设计，把 Agent 的每个环节都开放给了开发者——这正是它上线即爆火的原因。本文从安装、配置到插件开发给出了一条完整路径，照着做就能跑起来，跑起来之后就能用出花。

**资源汇总**

- 官方仓库：https://github.com/deepseek-ai/deepseek-harness
- 官方文档：https://deepseek-harness.github.io/deepseek-harness/en/guide/quickstart
- DeepSeek 开放平台（API Key）：https://platform.deepseek.com/

如果本文对你有帮助，欢迎**点赞、收藏、关注**，评论区聊聊你用 Harness 干了哪些活～

---

*注：DeepSeek Harness 迭代极快，文中命令与配置如与官方最新版有出入，以官方仓库 README 与文档为准。*
