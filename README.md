<div align="center">

# DSH Plugins

**六个小型插件，把 DeepSeek Harness Web 界面里常用但缺失的交互补齐。**

侧边栏分区 · 文件链接右键 · 输入历史 · Hover 与 Tooltip · 一键继续 · 排队消息撤回

[![DSH](https://img.shields.io/badge/DeepSeek%20Harness-0.2.1--rc.2-4D6BFE)](https://github.com/deepseek-ai/deepseek-harness)
[![Version](https://img.shields.io/badge/monorepo-1.0.0-blue)](CHANGELOG.md)
[![Checks](https://img.shields.io/badge/checks-188-brightgreen)](scripts/check-all.mjs)
[![Runtime deps](https://img.shields.io/badge/runtime%20dependencies-0-brightgreen)](package.json)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

[简体中文](README.md) | [English](README.en.md)

[插件](#插件) · [快速开始](#快速开始) · [兼容性](#兼容性) · [原理与约定](#原理与约定) · [验证](#验证) · [隐私](#隐私与数据边界) · [开发](#开发) · [许可证](#许可证)

</div>

---

## 这是什么

这是 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）的 Web 客户端插件
monorepo。六个插件可以一起安装，也可以单独安装；每个 package 仍然是一个完整、可独立发布的
DSH bundle。

它们解决的都是同一种问题：**DSH 的核心交互已经很好，但日常使用时还缺一两个顺手的小动作。**
这些插件只补这些动作，不替换宿主组件，不接管会话，也不重新实现 Agent。

| 插件 | 解决的问题 | 版本 | 检查 |
|---|---|---|---|
| [`dsh-sidebar-sections`](packages/dsh-sidebar-sections) | 侧边栏只有 Workspace 分组，置顶/归档不是正式分区，项目排序和对话管理不够顺手 | 2.3.0 | 67 |
| [`dsh-file-link-actions`](packages/dsh-file-link-actions) | 对话里的文件链接只能左键预览，想用系统应用打开或定位文件夹没有入口 | 1.0.0 | 20 |
| [`dsh-composer-history`](packages/dsh-composer-history) | 输入框没有历史，重复使用旧提示词只能往上翻聊天记录 | 1.2.0 | 29 |
| [`dsh-hover-polish`](packages/dsh-hover-polish) | 按钮 hover 不统一，原生 title 提示粗糙，宿主 Tooltip 位置和样式不一致 | 1.0.11 | 34 |
| [`dsh-continue`](packages/dsh-continue) | 任务被停止、报错或截断后，想继续只能手动输入“继续” | 1.1.1 | 19 |
| [`dsh-queue-withdraw`](packages/dsh-queue-withdraw) | 排队消息只能编辑、删除或插话，想拿回输入框改一改没有入口 | 1.2.0 | 19 |

全部 package 合计 **188 项零依赖检查**，没有构建步骤，也没有运行时 npm 依赖。

## 设计原则

- **只补交互，不替换宿主。** 插件通过 DSH 的 slot、shell overlay、Session 公开动作和少量稳定
  DOM 契约工作。
- **宿主数据优先。** 置顶、归档、重命名、分叉等管理动作继续走宿主 API；浏览器本地只保存视图
  状态、排序覆盖、历史索引等“视图层”数据。
- **主题 token 优先。** 所有颜色来自 `--dsw-*` 变量，浅色/深色主题自动跟随。
- **零运行时依赖。** 浏览器半部是 classic script，通过 `window.__ModuleLoader__.load` 加载；
  Host 半部是空 `apply`，只用于 bundle 发现。
- **中英双语文档。** 每个 package 都有 `README.md`、`README.en.md` 和独立 changelog。

## 快速开始

### 一次安装全部插件

适合本地开发或已经 clone 本仓库的环境：

```powershell
cd D:\dsh-plugins\dsh-plugins

# 先看会改什么
node scripts/install-all.mjs --dry-run

# 建立 node_modules junction、写入 profile 依赖和 bundle 列表
node scripts/install-all.mjs
```

脚本会：

1. 在 `~/.dsh/profiles/desktop/node_modules` 下为六个 package 建立 junction；
2. 把依赖写成 `link:<monorepo>/packages/<name>`；
3. 把六个包名加入 `dsh.profile.bundles`。

安装完成后**完全退出 DSH 再启动**，让新 client bundle 在启动时加载。只有 Host 配置变化而没有
新增/替换浏览器 bundle 时，HMR 才可能直接生效。

### 只安装一个插件

在启用 Creator 预设的会话里执行：

```text
plugin_manager(action="install_bundle", target="<monorepo 绝对路径>/packages/dsh-sidebar-sections")
```

`target` 必须是绝对路径。把最后的目录换成任意 package 即可单独安装：

```text
<monorepo>/packages/dsh-sidebar-sections
<monorepo>/packages/dsh-file-link-actions
<monorepo>/packages/dsh-composer-history
<monorepo>/packages/dsh-hover-polish
<monorepo>/packages/dsh-continue
<monorepo>/packages/dsh-queue-withdraw
```

如果 profile 之前已经装过同名插件，会返回 `already-installed`；先 `remove_bundle`，或继续使用
`install-all.mjs` 的 path-link 安装。

### 常用命令

```sh
node scripts/check-all.mjs     # 运行全部 package 的零依赖检查
cd packages/dsh-hover-polish
node scripts/check.mjs         # 只跑一个 package
```

## 兼容性

| 项目 | 值 |
|---|---|
| DSH | `0.2.1-rc.2` |
| 界面 | Web GUI、Desktop Web GUI |
| Node | 22+（仅用于测试和安装脚本） |
| 构建 | 无 |
| 运行时依赖 | 无 |
| 数据位置 | 浏览器 localStorage / IndexedDB；DSH profile；宿主会话日志 |

DSH 仍处于 pre-stable 阶段。插件依赖少量客户端 API、slot 名称和 DOM 属性契约；DSH 升级后如果
相关契约变化，插件需要跟随适配。

---

## 插件

### 1. dsh-sidebar-sections

[![version](https://img.shields.io/badge/version-2.3.0-blue)](packages/dsh-sidebar-sections)
[![checks](https://img.shields.io/badge/checks-67-brightgreen)](packages/dsh-sidebar-sections/scripts/check.mjs)

**把侧边栏变成真正的对话浏览器。**

DSH 默认把对话嵌在 Workspace 分组里，归档则藏在一个可切换视图中。长期使用后，置顶、项目、
最近、归档是四种不同的浏览需求，但默认侧边栏只提供一种混合视图。

![侧边栏分区、分区菜单与项目菜单](packages/dsh-sidebar-sections/docs/screenshot.png)

**它做什么：**

- 四个正式分区：**置顶 / 项目 / 最近 / 归档**
- 项目区保留可折叠的 Workspace 分组，每个项目可独立排序
- 最近区默认显示 8 条，每次「显示更多」增加 20 条，不受历史长度硬限制
- 归档区独立显示，灰显、恢复前不可打开，可在设置里关闭
- 对话行 hover/聚焦出现归档、置顶和 `⋯` 菜单
- 右键、`Shift+F10`、Context Menu 键都能打开同一套菜单
- 约 400ms 后显示预览卡片：标题、项目、时间；鼠标可以移到卡片上
- 手动拖拽排序，支持插入线、靠近边缘自动滚动、跨项目限制
- 全宽搜索：按标题、项目名、目录名过滤，自动展开匹配分组
- 设置页：归档分区显隐、已移除会话恢复
- 安全删除：只移除侧边栏记录，不调用宿主删除 API，可在设置里恢复

**怎么用：**

1. 安装后侧边栏自动变为四个分区。
2. 悬停对话行，使用右侧按钮置顶/归档；点 `⋯` 或右键打开完整菜单。
3. 拖动行调整顺序；分区/项目菜单里可以切回「最近更新」。
4. 打开 **设置 → 插件（内置插件）→ 侧边栏分区** 管理归档和安全删除。

**数据与边界：**

- pin/归档集合、会话标题等宿主数据仍由宿主所有
- 排序、折叠、分组、安全删除 tombstone 存在 `localStorage` 的 `dsh.sidebarSections.*`
- 真实 Workspace 分组排序会通过 `workspaces.insertSessionBefore` 写回宿主
- 安全删除不删除磁盘会话，只隐藏侧边栏视图

**已知限制：**

- 只覆盖侧边栏视图，不改变对话内容区
- 筛选状态下不允许拖拽
- 极长会话的完整加载仍受宿主事件窗口影响
- DSH 升级可能改变 sidebar 槽位/菜单契约

**安装：**

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-sidebar-sections")
```

详细文档：[中文](packages/dsh-sidebar-sections/README.md) · [English](packages/dsh-sidebar-sections/README.en.md)

---

### 2. dsh-file-link-actions

[![version](https://img.shields.io/badge/version-1.0.0-blue)](packages/dsh-file-link-actions)
[![checks](https://img.shields.io/badge/checks-20-brightgreen)](packages/dsh-file-link-actions/scripts/check.mjs)

**给对话里的文件链接补一个系统级右键菜单。**

DSH 会把本地文件路径渲染成链接，左键打开文档预览。但想用系统默认程序打开，或者直接跳到文件
所在文件夹，默认没有入口。

**它做什么：**

- **用默认应用打开**：交给操作系统关联程序
- **打开所在文件夹**：在文件管理器中定位文件
- **复制文件路径**：复制解析后的绝对路径
- 支持对话里的文件引用和 markdown 文件链接
- 相对路径按当前对话所属工作区解析
- 不改变左键预览，不修改宿主数据

**怎么用：**

1. 在对话 markdown 中右键一个本地文件链接。
2. 选择「用默认应用打开」「打开所在文件夹」或「复制文件路径」。
3. 左键点击仍然是 DSH 原有文档预览。

**实现要点：**

- 在 `shell.overlay` 监听文档级 `contextmenu`
- 只命中对话 markdown 内带 `fileLink` / `fileMention` 的按钮
- 从链接 `title` 读取路径，用当前会话 `cwd` 解析相对路径
- 通过 `remote.session.openWorkspacePath` 执行默认打开或 `reveal`

**已知限制：**

- 只处理对话 markdown 里的本地文件链接；普通网页链接、图片预览不处理
- 没有绝对路径且当前对话没有工作区时，会提示无法定位
- 依赖 DSH 的 `openWorkspacePath` 契约

**安装：**

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-file-link-actions")
```

详细文档：[中文](packages/dsh-file-link-actions/README.md) · [English](packages/dsh-file-link-actions/README.en.md)

---

### 3. dsh-composer-history

[![version](https://img.shields.io/badge/version-1.2.0-blue)](packages/dsh-composer-history)
[![checks](https://img.shields.io/badge/checks-29-brightgreen)](packages/dsh-composer-history/scripts/check.mjs)

**给输入框补上可搜索、可快速取回的输入历史。**

对话一长，想重新使用之前发过的提示词，只能往上翻聊天记录再复制。DSH 输入框本身没有历史，
也没有“上一条输入”的快捷取回。

**它做什么：**

- **历史面板**：列出当前会话真实发送过的用户提示词，新的在前
- **搜索过滤**：按关键词找回较早的提示词
- **直接取回**：空输入框按 `↑` 填入上一条；继续按 `↑` 往前翻
- **反向恢复**：按 `↓` 回到较新的提示词，回到最新后恢复原草稿
- **面板快捷键**：输入框工具条时钟按钮，或 `Ctrl/Cmd + ↑`
- **键盘操作**：`↑`/`↓` 选择，`Enter` 填入，`Esc` 关闭
- **面板清空**：清空当前会话的插件历史
- **设置页管理**：查看记录、删除单条、清空全部
- 中英文界面

**怎么用：**

1. 让输入框为空，按 `↑` 取回上一条提示词。
2. 继续按 `↑` 往前翻；按 `↓` 回到较新记录，回到最新后恢复空草稿。
3. 点输入框工具条的时钟按钮，或按 `Ctrl/Cmd + ↑` 打开可搜索面板。
4. 打开 **设置 → 插件 → 输入历史** 管理本地记录。

**数据与边界：**

- 从当前会话已加载的 `user/message` 事件读取真实用户输入
- 只写回输入框，不自动发送
- 浏览历史时同步到浏览器本地记录缓存
- 管理数据在 `localStorage` 的 `dsh.composerHistory.managedSettings`
- 记录上限 500 条，隐藏 key 上限 1000 条
- 清空/删除只影响插件本地记录，不删除 Session 消息

**已知限制：**

- 只记录文本，不包含附件、图片或文件引用
- 当前会话事件窗口未加载的更早输入不会出现
- 设置页只能管理已经在本浏览器记录过的提示词
- 换设备或清理浏览器数据后状态不保留

**安装：**

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-composer-history")
```

详细文档：[中文](packages/dsh-composer-history/README.md) · [English](packages/dsh-composer-history/README.en.md)

---

### 4. dsh-hover-polish

[![version](https://img.shields.io/badge/version-1.0.11-blue)](packages/dsh-hover-polish)
[![checks](https://img.shields.io/badge/checks-34-brightgreen)](packages/dsh-hover-polish/scripts/check.mjs)

**统一整个界面的 hover、Tooltip 和标签页反馈。**

DSH 的按钮 hover 覆盖不完整：有些控件只有浏览器原生 `title` 提示，有些图标按钮没有背景反馈，
有些 Tooltip 出现在左下角再闪到目标位置。Codex 的界面里，hover 有统一节奏：延迟合理、气泡样式
一致、快捷键清楚、图标按钮都有可预期反馈。

**它做什么：**

- **原生 title 升级**：图标按钮的浏览器原生气泡替换为 Codex 风格 Tooltip
- **只在该出现时出现**：可见文字按钮不重复弹相同文案；发送按钮跳过
- **解释性气泡**：模型/推理强度、权限模式、添加入口等复杂控件说明动作
- **快捷键去重**：宿主 Tooltip 里重复的相邻 keycap（如 `Esc Esc`）只保留一个
- **标签页 hover**：文件/对话/设置标签统一反馈，选中标签使用描边
- **标签页完整标题**：截断的文件标签显示完整标题/路径
- **宿主 Tooltip 居中**：原本侧边/右对齐的宿主气泡重新锚定到控件水平中心
- **防闪跳**：插入窗口内先隐藏，位置计算完成后再显示；离开后有 200ms 宽限
- **补齐图标按钮 hover**：透明背景图标按钮获得统一背景和短过渡
- **点击即收起**：打开菜单或点击控件后不残留气泡
- **键盘可达**：focus 显示同样的提示，`Esc`/滚动/失焦收起
- 不修改宿主数据，不增加后端接口

**怎么用：**

1. 安装后把鼠标移到图标按钮、标签页、模型选择器上。
2. 标签页会显示完整标题或路径；复杂控件显示动作说明。
3. 点击任意控件会立即收起 hover 气泡。

**已知限制：**

- 只处理带 `title` / `aria-label` / `aria-labelledby` 的按钮；纯文本按钮不额外加提示
- 菜单项、下拉选项和 `data-dshhp-skip` 控件不处理
- 自定义气泡延迟 650ms，让宿主 Tooltip 优先出现
- 宿主 Tooltip 的内容和快捷键仍由宿主决定，插件只做位置/重复 keycap 修饰

**安装：**

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-hover-polish")
```

详细文档：[中文](packages/dsh-hover-polish/README.md) · [English](packages/dsh-hover-polish/README.en.md)

---

### 5. dsh-continue

[![version](https://img.shields.io/badge/version-1.1.1-blue)](packages/dsh-continue)
[![checks](https://img.shields.io/badge/checks-19-brightgreen)](packages/dsh-continue/scripts/check.mjs)

**把停止/报错/截断后的“继续”变成一个播放键。**

任务被停止、异常中断或输出被截断后想恢复，通常还要在输入框里打一句“继续”。这个动作没有
信息量，却打断了操作。但正常完成的轮次不应该出现 Continue，否则会滥用。

**它做什么：**

- 输入框为空、会话空闲、最后一轮是**非正常结束**时，发送按钮变成播放图标
- 点击后通过当前 Session 的 `prompt()` 提交普通提示词
- 不填草稿、不加附件、不绕过队列/生命周期
- 输入文字或添加附件后立即恢复普通发送按钮
- 失败时恢复播放键并显示错误 tooltip

**显示条件（reason）：**

| 情形 | Continue |
|---|---|
| `completed` 正常完成 | 不显示 |
| `forked` | 不显示 |
| `aborted` 用户停止 | 显示 |
| `blocked` / `error` | 显示 |
| `max-tokens` 输出截断 | 显示 |
| `interrupted` / 尾部只有 `turn/start` | 显示 |

**怎么用：**

1. 停止一次任务，或等待一次报错/截断。
2. 清空输入框，发送按钮位置出现播放图标。
3. 点击后提交「继续」/「Continue」，不需要手动输入。

**已知限制：**

- 只覆盖发送按钮和输入框状态，不自动处理队列/重试策略
- 依赖宿主 primary button 的 DOM 定位；DSH 大改布局后可能需要适配
- 正常完成和 forked 刻意不显示

**安装：**

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-continue")
```

详细文档：[中文](packages/dsh-continue/README.md) · [English](packages/dsh-continue/README.en.md)

---

### 6. dsh-queue-withdraw

[![version](https://img.shields.io/badge/version-1.2.0-blue)](packages/dsh-queue-withdraw)
[![checks](https://img.shields.io/badge/checks-19-brightgreen)](packages/dsh-queue-withdraw/scripts/check.mjs)

**把排队中的消息撤回输入框，而不是只能编辑、删除或插话。**

DSH 的排队消息行提供编辑、删除和插话。想先拿回来改一改时，删除会丢失内容，编辑不如直接放回
输入框自然。

**它做什么：**

- 每个 Host 排队消息行追加一个撤回按钮
- 文本追加到现有草稿末尾，而不是覆盖
- 图片附件可撤回：优先临时缓存，回退 `session.readAttachment()`
- **文件附件可撤回**：选择文件时把浏览器 `File` 缓存到 IndexedDB，撤回时重新注册为草稿附件，
  让 DSH 重新上传
- 通过公开的 `Session.updateQueue(itemId, { kind: 'remove' })` 移除队列项
- 移除失败恢复原草稿，消息仍在队列
- 成功不弹持久提示：队列行消失 + 草稿出现就是反馈

**文件缓存的生命周期：**

1. 用户选择文件，Host 调用 `conversation.createDrafts()`；
2. 插件在同一个调用里把 `File` 写入 IndexedDB（同时保留内存副本）；
3. 消息进入队列后缓存继续保留；
4. 撤回时按 `name + size` 找缓存，通过 `createDrafts` + `addAttachments` 放回输入框；
5. 撤回成功、队列项离开队列、或缓存超过 24 小时后清理。

**怎么用：**

1. 消息运行中继续发送，进入排队区。
2. 在排队行点击撤回按钮。
3. 文本/图片/文件回到输入框，队列项消失。

**已知限制：**

- 只覆盖本插件加载后选择的文件；安装前已存在的排队文件没有缓存
- 清空站点数据、隐私模式、IndexedDB 写入失败或缓存超过 24 小时时，文件可能无法恢复
- 缓存按 `name + size` 匹配，同名同大小多文件可能匹配最近一次缓存
- 图片/文件恢复依赖草稿附件注册表，DSH 升级后可能需要适配

**安装：**

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-queue-withdraw")
```

详细文档：[中文](packages/dsh-queue-withdraw/README.md) · [English](packages/dsh-queue-withdraw/README.en.md)

---

## 原理与约定

### 目录结构

```text
.
├── packages/
│   ├── dsh-sidebar-sections/
│   ├── dsh-file-link-actions/
│   ├── dsh-composer-history/
│   ├── dsh-hover-polish/
│   ├── dsh-continue/
│   └── dsh-queue-withdraw/
├── scripts/
│   ├── check-all.mjs
│   └── install-all.mjs
├── .github/workflows/check.yml
├── README.md / README.en.md
├── MIGRATION.md
└── CHANGELOG.md
```

### 每个 package 都包含

- `package.json`：`dsh.bundle.patch` + `dsh.client` 清单
- `cordis.patch.yml`：插入一条 Host Loader 行
- `index.js`：Host 半部（空 `apply`，用于 bundle 发现）
- `client.js`：浏览器半部，纯 JS classic script
- `locale/`：插件管理器标题/描述
- `scripts/check.mjs`：零依赖测试
- `README.md` / `README.en.md` / `CHANGELOG.md` / `LICENSE`

### 为什么不是一个大插件

这些功能在 DSH 里属于不同 slot、不同注入服务和不同失败面。拆成独立 package 可以：

- 单独安装、单独启用、单独回滚
- 单独测试和定位
- 一个插件出错时不影响其他插件
- 保留每个包自己的版本和 changelog

monorepo 只统一 Git、CI、安装脚本和仓库文档；每个 package 仍然是一个完整 bundle。

## 验证

```sh
node scripts/check-all.mjs
```

当前结果：

```text
all packages passed: 6 packages, 188 checks
```

| Package | Checks |
|---|---|
| `dsh-sidebar-sections` | 67 |
| `dsh-file-link-actions` | 20 |
| `dsh-composer-history` | 29 |
| `dsh-hover-polish` | 34 |
| `dsh-continue` | 19 |
| `dsh-queue-withdraw` | 19 |

CI 在每次 push / pull request 上运行同一个脚本。

## 隐私与数据边界

- 插件没有遥测、没有额外服务端、没有网络上报
- 侧边栏、输入历史等视图数据保存在浏览器 `localStorage`
- 文件撤回缓存保存在浏览器 `IndexedDB`，只在本地，用于临时恢复；撤回成功或队列项离开后清理
- 置顶、归档、重命名、分叉等宿主数据仍由宿主 API 管理
- 插件不读取凭据、不写会话日志、不修改 Agent 运行结果

## 开发

```sh
node scripts/check-all.mjs          # 全部测试
node scripts/install-all.mjs        # 安装全部插件到 profile
node scripts/install-all.mjs --dry-run
node scripts/install-all.mjs --profile "<profile 目录>"
```

每个 package 也可以单独运行：

```sh
cd packages/dsh-hover-polish
node scripts/check.mjs
```

发布新版本时：

1. 修改对应 package 的 `package.json` 版本和 `CHANGELOG.md`；
2. 运行 `node scripts/check-all.mjs`；
3. 提交并打 package 级 tag，例如 `dsh-hover-polish-v1.0.12`；
4. 仓库级 `CHANGELOG.md` 只记录 monorepo 结构性变化。

## 从独立仓库迁移

本仓库用新历史合并了原先各自独立的插件仓库，映射关系见
[MIGRATION.md](MIGRATION.md)。旧目录仍然保留作为归档，不再作为安装来源。

## 许可证

[MIT](LICENSE)。每个 package 内也有自己的 LICENSE 副本。
