<div align="center">

# DSH Plugins

**七个独立的 DeepSeek Harness Web 客户端插件。**

侧边栏分区 · 文件链接右键 · 输入历史 · Hover · 一键继续 · 排队消息撤回 · 标签中键关闭

[![DSH](https://img.shields.io/badge/DeepSeek%20Harness-0.2.1--rc.2-4D6BFE)](https://github.com/deepseek-ai/deepseek-harness)
[![Checks](https://img.shields.io/badge/checks-201-brightgreen)](scripts/check-all.mjs)
[![Runtime deps](https://img.shields.io/badge/runtime%20dependencies-0-brightgreen)](package.json)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

[简体中文](README.md) | [English](README.en.md)

[插件](#插件) · [快速开始](#快速开始) · [兼容性](#兼容性) · [开发](#开发)

</div>

---

## 这是什么

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）Web 客户端插件
monorepo。七个 package 可以一起安装，也可以单独安装、单独启停；每个仍然是完整 DSH bundle。

它们只补日常交互中缺失的动作，不替换宿主组件，不接管会话，也不重新实现 Agent。

| 插件 | 一句话 | 版本 | 检查 |
|---|---|---|---|
| [`dsh-sidebar-sections`](https://github.com/tzhaos/dsh-sidebar-sections) | 置顶 / 项目 / 最近 / 归档四分区侧边栏，所有会话行可安全删除 | 2.4.0 | 68 |
| [`dsh-file-link-actions`](https://github.com/tzhaos/dsh-file-link-actions) | 文件链接右键：默认应用打开、定位文件夹、复制路径 | 1.0.0 | 20 |
| [`dsh-composer-history`](https://github.com/tzhaos/dsh-composer-history) | 可搜索、可用 `↑` 取回的输入历史 | 1.2.0 | 29 |
| [`dsh-hover-polish`](https://github.com/tzhaos/dsh-hover-polish) | 统一按钮/标签 hover 与 Codex 风格 Tooltip | 1.0.11 | 34 |
| [`dsh-continue`](https://github.com/tzhaos/dsh-continue) | 停止/报错/截断后把发送按钮变成播放键 | 1.1.1 | 19 |
| [`dsh-queue-withdraw`](https://github.com/tzhaos/dsh-queue-withdraw) | 把排队消息撤回输入栏，撤回按钮放在行首左侧 | 1.2.1 | 19 |
| [`dsh-tab-middle-click`](https://github.com/tzhaos/dsh-tab-middle-click) | 鼠标中键关闭侧边栏/停靠标签 | 1.0.0 | 13 |

全部 package 合计 **202 项零依赖检查**；无构建步骤、无运行时 npm 依赖。

## 给 Agent 的安装指令

把本仓库地址发给 Agent，并附上下面的任务即可一次拉取全部插件：

```text
请克隆 https://github.com/tzhaos/dsh-plugins 并递归初始化 submodules：

git clone --recurse-submodules https://github.com/tzhaos/dsh-plugins.git
cd dsh-plugins
node scripts/check-all.mjs
node scripts/install-all.mjs

完成后完全退出 DeepSeek Harness，再重新启动。
```

已经 clone 但 submodule 为空时：

```powershell
git submodule update --init --recursive
```

## 快速开始

### 全部安装

从 GitHub 克隆：

```powershell
git clone --recurse-submodules https://github.com/tzhaos/dsh-plugins.git
cd dsh-plugins
node scripts/install-all.mjs --dry-run   # 先看会改什么
node scripts/install-all.mjs             # 写入 profile 并链接七个 package
```

已经在本地 `D:\dsh-plugins\dsh-plugins` 的话，直接从 `node scripts/install-all.mjs` 开始。
安装后**完全退出 DSH 再启动**。

### 只安装一个

在 Creator 预设的会话里：

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-hover-polish")
```

`target` 必须是绝对路径。七个 target：

```text
<monorepo>/packages/dsh-sidebar-sections
<monorepo>/packages/dsh-file-link-actions
<monorepo>/packages/dsh-composer-history
<monorepo>/packages/dsh-hover-polish
<monorepo>/packages/dsh-continue
<monorepo>/packages/dsh-queue-withdraw
<monorepo>/packages/dsh-tab-middle-click
```

### 用 `dsh plugin` CLI 单独安装

`dsh plugin` 是 DSH 对 pnpm 的转发，所以它**可以**安装单个本地 package：

```powershell
git clone --recurse-submodules https://github.com/tzhaos/dsh-plugins.git
dsh plugin --profile desktop add "D:\dsh-plugins\dsh-plugins\packages\dsh-hover-polish"
```

但它只完成 pnpm 依赖安装，**不会把包加入 `dsh.profile.bundles`**。还需要在
`~/.dsh/profiles/desktop/package.json` 的 `dsh.profile.bundles` 里追加
`dsh-hover-polish`，然后完全重启 DSH。推荐直接用 `install-all.mjs`，它会同时处理依赖和
bundle 列表。

不能直接用 CLI 安装 GitHub 仓库根：根目录是 monorepo，不是单个 DSH bundle；把 `github:` URL
指向仓库根不会得到可加载的 Loader 行。

### 检查

```sh
node scripts/check-all.mjs
```

## 更新

仓库已经发布在 <https://github.com/tzhaos/dsh-plugins>；npm / 插件市场尚未发布。
更新按安装方式处理。

### 方式一：monorepo 的 path-link 安装

一条命令完成拉取和重新链接：

```powershell
cd D:\dsh-plugins\dsh-plugins
node scripts/update-all.mjs
# 完全退出 DSH，再重新启动
```

脚本会先检查工作区、执行 `git pull --ff-only`，同步并初始化 submodules，再运行 `install-all.mjs`。可选参数：

```powershell
node scripts/update-all.mjs --dry-run   # 只打印计划
node scripts/update-all.mjs --no-pull   # 已手动更新源码，只重新链接
```

手动等价步骤：

```powershell
git status --short          # 确认没有未提交改动
git pull --ff-only
git submodule update --init --recursive
node scripts/install-all.mjs
```

- package 是路径链接：`client.js` 等源码更新后，**必须完整重启 DSH**，不要只刷新页面
- 重新运行 `install-all.mjs` 会校正 junction、依赖和 `dsh.profile.bundles`
- 新增/删除插件包，或修改 bundle 列表后，必须重新运行安装脚本
- 只更新单个 package 的源码时，重启通常就够了；安装脚本是幂等的，可以随时重跑

### 方式二：Plugin Manager 安装

如果之前是通过 `plugin_manager install_bundle` 安装的，版本或目录发生变化时：

```text
plugin_manager(action="remove_bundle", target="dsh-hover-polish")
plugin_manager(action="install_bundle", target="<新版本目录的绝对路径>")
```

然后完全退出 DSH 再启动。`install_bundle` 对已存在的同名 bundle 会返回
`already-installed`，所以升级版本通常需要先移除。

如果只是同一个目录下的源码更新，DSH 重启后会读取新文件；只有路径、版本或
`cordis.patch.yml` 变化时才需要重新安装。

### 为什么 `dsh plugin add github:...` 不够

`dsh plugin` 只转发给 pnpm：它负责把依赖装进 profile，**不负责注册 bundle**。DSH 启动时只
加载 `dsh.profile.bundles` 中列出的包，所以单独用 CLI 安装后还要手动补 bundle 列表。

GitHub 仓库根目录是 monorepo，不是单个 DSH bundle，所以也不能把 `plugin_manager` 的 `target`
直接指向仓库根。需要单独安装某个插件时，先 clone，再把 target 指向绝对路径：

```text
plugin_manager(action="install_bundle", target="<clone 目录>/packages/dsh-hover-polish")
```

如果要全部安装，直接用 `node scripts/install-all.mjs`。以后如果发布 npm 包，再按对应 spec
重新安装；不要依赖页面热刷新来加载新的 client bundle，DSH 的浏览器半部只在启动时加载。

### 更新会保留什么

- 侧边栏排序/折叠、输入历史、安全删除记录：保留在浏览器 `localStorage`
- 排队撤回的文件缓存：保留在 `IndexedDB`，但只对仍在队列中的消息有效
- 会话、消息、Agent 结果：始终由 DSH 管理，不会被插件更新修改
- 清理浏览器站点数据或换设备会丢失本地视图状态

## 兼容性


| 项目 | 值 |
|---|---|
| DSH | `0.2.1-rc.2` |
| 界面 | Web GUI、Desktop Web GUI |
| Node | 22+（仅测试/安装脚本） |
| 构建 | 无 |
| 运行时依赖 | 无 |

DSH 仍是 pre-stable；客户端 API、slot 和 DOM 契约变化时，插件需要跟随适配。

---

## 插件

### dsh-sidebar-sections

[![version](https://img.shields.io/badge/version-2.4.0-blue)](https://github.com/tzhaos/dsh-sidebar-sections)
[![checks](https://img.shields.io/badge/checks-68-brightgreen)](https://github.com/tzhaos/dsh-sidebar-sections/blob/main/scripts/check.mjs)

把侧边栏变成 **置顶 / 项目 / 最近 / 归档** 四个正式分区。

![dsh-sidebar-sections 2.3.0：四分区侧边栏、分区菜单与项目菜单](https://raw.githubusercontent.com/tzhaos/dsh-sidebar-sections/main/docs/screenshot.png)

*图片说明：左侧是「置顶 / 项目 / 最近 / 归档」四分区侧边栏；中间是分区菜单，可选择按项目分组、单一列表、手动排序或最近更新；右侧是项目菜单，可打开文件管理器、重命名或删除工作区。截图对应当前 2.3.0 界面。*

- 四个分区独立显示，归档区可在设置里关闭
- 项目/最近支持按项目分组或单一列表，项目可独立排序
- 拖拽排序，带插入线和边缘自动滚动
- 行内 hover 与右键菜单：置顶、归档、重命名、分叉、复制 Session ID
- 悬停预览卡片：标题、项目、时间
- 全宽搜索；匹配分组自动展开
- 设置页可恢复安全删除的会话；安全删除不调用宿主删除 API

**使用：** 安装后直接使用侧边栏；悬停行、右键或 `Shift+F10` 打开菜单，拖动行调整顺序。

**数据：** 排序、折叠、分组、安全删除记录存 `localStorage`；pin/归档/标题仍由宿主管理。

**限制：** 只改侧边栏视图；筛选时不能拖拽；极长会话的完整加载仍受宿主事件窗口限制。

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-sidebar-sections")
```

[详细文档](https://github.com/tzhaos/dsh-sidebar-sections#readme) · [English](https://github.com/tzhaos/dsh-sidebar-sections/blob/main/README.en.md)

---

### dsh-file-link-actions

[![version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/tzhaos/dsh-file-link-actions)
[![checks](https://img.shields.io/badge/checks-20-brightgreen)](https://github.com/tzhaos/dsh-file-link-actions/blob/main/scripts/check.mjs)

给对话里的本地文件链接补一个 **右键菜单**。

- 用默认应用打开
- 在文件管理器中定位
- 复制解析后的绝对路径
- 支持文件引用和 markdown 文件链接；相对路径按当前工作区解析
- 左键预览和宿主数据不变

**使用：** 在对话 markdown 中右键文件链接，选择动作。

**限制：** 只处理本地文件链接；没有可用工作区路径时无法定位；依赖 `openWorkspacePath`。

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-file-link-actions")
```

[详细文档](https://github.com/tzhaos/dsh-file-link-actions#readme) · [English](https://github.com/tzhaos/dsh-file-link-actions/blob/main/README.en.md)

---

### dsh-composer-history

[![version](https://img.shields.io/badge/version-1.2.0-blue)](https://github.com/tzhaos/dsh-composer-history)
[![checks](https://img.shields.io/badge/checks-29-brightgreen)](https://github.com/tzhaos/dsh-composer-history/blob/main/scripts/check.mjs)

给输入框补上 **可搜索、可快速取回的输入历史**。

- 面板列出当前会话真实发送过的用户提示词
- 输入框为空时按 `↑` 取回上一条；继续 `↑` 往前翻，`↓` 反向回退并恢复草稿
- 时钟按钮或 `Ctrl/Cmd + ↑` 打开可搜索面板
- 面板与设置页都支持清空/删除本地记录
- 只记录文本；不包含附件和文件引用

**数据：** 本地记录在 `localStorage` 的 `dsh.composerHistory.managedSettings`；记录上限 500 条。

**限制：** 只读取当前事件窗口里已加载的 `user/message`；清空/删除不修改 Session 日志；换设备或清浏览器数据后丢失。

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-composer-history")
```

[详细文档](https://github.com/tzhaos/dsh-composer-history#readme) · [English](https://github.com/tzhaos/dsh-composer-history/blob/main/README.en.md)

---

### dsh-hover-polish

[![version](https://img.shields.io/badge/version-1.0.11-blue)](https://github.com/tzhaos/dsh-hover-polish)
[![checks](https://img.shields.io/badge/checks-34-brightgreen)](https://github.com/tzhaos/dsh-hover-polish/blob/main/scripts/check.mjs)

统一按钮和标签页的 hover 反馈，并给图标按钮提供 Codex 风格 Tooltip。

- 透明图标按钮获得统一的 hover 背景和过渡
- 图标按钮的浏览器原生 `title` 改由自定义 Tooltip 显示
- 模型/推理强度、权限模式、添加入口等控件显示动作说明，而不是重复按钮文字
- 标签页统一 hover 反馈；文件标签显示完整标题/路径
- 键盘 focus 同样显示提示，`Esc`/滚动/失焦收起

**限制：** 只处理带 `title`/`aria-label` 的按钮；菜单项、下拉选项和 `data-dshhp-skip` 控件跳过；自定义气泡延迟 650ms，让宿主 Tooltip 优先。

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-hover-polish")
```

[详细文档](https://github.com/tzhaos/dsh-hover-polish#readme) · [English](https://github.com/tzhaos/dsh-hover-polish/blob/main/README.en.md)

---

### dsh-continue

[![version](https://img.shields.io/badge/version-1.1.1-blue)](https://github.com/tzhaos/dsh-continue)
[![checks](https://img.shields.io/badge/checks-19-brightgreen)](https://github.com/tzhaos/dsh-continue/blob/main/scripts/check.mjs)

任务 **停止、报错或被截断** 后，输入框为空时把发送按钮变成播放键。

- 点击后通过当前 Session 的 `prompt()` 提交「继续」/「Continue」
- 不填草稿、不加附件、不绕过队列
- 输入文字或附件后立即恢复普通发送按钮

**显示状态：** 仅在 `aborted`、`blocked`、`error`、`max-tokens`、`interrupted`，或尾部只有 `turn/start` 的异常中断时出现；正常完成和 `forked` 不显示。

**限制：** 只覆盖发送按钮/输入框状态；依赖宿主 primary button 的 DOM 定位；大改布局后可能需要适配。

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-continue")
```

[详细文档](https://github.com/tzhaos/dsh-continue#readme) · [English](https://github.com/tzhaos/dsh-continue/blob/main/README.en.md)

---

### dsh-queue-withdraw

[![version](https://img.shields.io/badge/version-1.2.1-blue)](https://github.com/tzhaos/dsh-queue-withdraw)
[![checks](https://img.shields.io/badge/checks-19-brightgreen)](https://github.com/tzhaos/dsh-queue-withdraw/blob/main/scripts/check.mjs)

把排队中的消息 **撤回输入栏**。

- 撤回按钮放在排队行行首左侧，远离编辑/删除/插话按钮
- 文本追加到现有草稿，而不是覆盖
- 图片附件可回填
- 文件附件在选择文件时缓存到浏览器 IndexedDB，撤回时重新注册为草稿附件
- 通过公开的 `Session.updateQueue(remove)` 移除队列项
- 移除失败恢复原草稿，消息仍在队列

**限制：** 只覆盖插件加载后选择的文件；安装前已存在的队列文件没有缓存。清空站点数据、隐私模式、IndexedDB 失败或缓存超过 24 小时时，文件可能无法恢复。缓存按 `name + size` 匹配。

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-queue-withdraw")
```

[详细文档](https://github.com/tzhaos/dsh-queue-withdraw#readme) · [English](https://github.com/tzhaos/dsh-queue-withdraw/blob/main/README.en.md)

---

### dsh-tab-middle-click

把鼠标中键变成标签页的关闭手势。

- 在 `[data-dockkit-tab]` / `[data-sidebar-right-tab]` 上按鼠标中键
- 点击标签内已有的关闭控件，复用 DSH 自己的关闭流程
- 阻止中键在标签上触发浏览器自动滚动
- 没有关闭控件的标签不做任何事

**使用：** 在侧边栏或停靠区的标签上按鼠标中键。

**限制：** 依赖 DockKit 的 tab DOM 契约；只处理中键，不新增键盘快捷键。

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-tab-middle-click")
```

[详细文档](https://github.com/tzhaos/dsh-tab-middle-click#readme) · [English](https://github.com/tzhaos/dsh-tab-middle-click/blob/main/README.en.md)

---

## 仓库结构

```text
.
├── packages/          # 七个完整 DSH bundle
├── scripts/
│   ├── check-all.mjs
│   └── install-all.mjs
├── .github/workflows/check.yml
├── README.md / README.en.md
└── CHANGELOG.md
```

`packages/` 下的目录是 Git submodules，分别指向各自的独立仓库；主仓库只保存 submodule 指针、
安装脚本和总文档。每个 package 都有 `package.json`、`cordis.patch.yml`、Host `index.js`、
浏览器 `client.js`、locale、README、CHANGELOG 和零依赖测试。

功能分开打包，是为了单独安装、单独回滚、单独定位问题；monorepo 只统一 Git、CI 和安装脚本。

## 验证

```sh
node scripts/check-all.mjs
```

```text
all packages passed: 7 packages, 202 checks
```

| Package | Checks |
|---|---|
| `dsh-sidebar-sections` | 68 |
| `dsh-file-link-actions` | 20 |
| `dsh-composer-history` | 29 |
| `dsh-hover-polish` | 34 |
| `dsh-continue` | 19 |
| `dsh-queue-withdraw` | 19 |
| `dsh-tab-middle-click` | 13 |

## 隐私与数据

- 无遥测、无额外服务端、无网络上报
- 侧边栏/输入历史等视图数据在浏览器 `localStorage`
- 排队撤回文件缓存在 `IndexedDB`，撤回成功或队列项离开后清理
- 宿主数据仍由宿主 API 管理；插件不读取凭据、不写会话日志

## 开发

```sh
node scripts/check-all.mjs
node scripts/install-all.mjs
node scripts/install-all.mjs --dry-run
node scripts/install-all.mjs --profile "<profile 目录>"
```

发布时更新对应 package 的 `package.json` 版本和 `CHANGELOG.md`，跑全量检查后提交并打 package 级 tag。
根目录 `CHANGELOG.md` 只记录仓库级变化。

## 迁移与许可证

本仓库以新历史合并过独立插件仓库，现在又拆回各自的独立仓库，并通过 Git submodule 引用；映射与迁移过程见 [MIGRATION.md](MIGRATION.md)。

[MIT](LICENSE)。每个 package 内也有 LICENSE 副本。
