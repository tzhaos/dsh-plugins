<div align="center">

# DSH Plugins

**六个独立的 DeepSeek Harness Web 客户端插件。**

侧边栏分区 · 文件链接右键 · 输入历史 · Hover · 一键继续 · 排队消息撤回

[![DSH](https://img.shields.io/badge/DeepSeek%20Harness-0.2.1--rc.2-4D6BFE)](https://github.com/deepseek-ai/deepseek-harness)
[![Checks](https://img.shields.io/badge/checks-188-brightgreen)](scripts/check-all.mjs)
[![Runtime deps](https://img.shields.io/badge/runtime%20dependencies-0-brightgreen)](package.json)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

[简体中文](README.md) | [English](README.en.md)

[插件](#插件) · [快速开始](#快速开始) · [兼容性](#兼容性) · [开发](#开发)

</div>

---

## 这是什么

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）Web 客户端插件
monorepo。六个 package 可以一起安装，也可以单独安装、单独启停；每个仍然是完整 DSH bundle。

它们只补日常交互中缺失的动作，不替换宿主组件，不接管会话，也不重新实现 Agent。

| 插件 | 一句话 | 版本 | 检查 |
|---|---|---|---|
| [`dsh-sidebar-sections`](packages/dsh-sidebar-sections) | 置顶 / 项目 / 最近 / 归档四分区侧边栏 | 2.3.0 | 67 |
| [`dsh-file-link-actions`](packages/dsh-file-link-actions) | 文件链接右键：默认应用打开、定位文件夹、复制路径 | 1.0.0 | 20 |
| [`dsh-composer-history`](packages/dsh-composer-history) | 可搜索、可用 `↑` 取回的输入历史 | 1.2.0 | 29 |
| [`dsh-hover-polish`](packages/dsh-hover-polish) | 统一按钮/标签 hover 与 Codex 风格 Tooltip | 1.0.11 | 34 |
| [`dsh-continue`](packages/dsh-continue) | 停止/报错/截断后把发送按钮变成播放键 | 1.1.1 | 19 |
| [`dsh-queue-withdraw`](packages/dsh-queue-withdraw) | 把排队消息撤回输入栏 | 1.2.0 | 19 |

全部 package 合计 **188 项零依赖检查**；无构建步骤、无运行时 npm 依赖。

## 快速开始

### 全部安装

```powershell
cd D:\dsh-plugins\dsh-plugins
node scripts/install-all.mjs --dry-run   # 先看会改什么
node scripts/install-all.mjs             # 写入 profile 并链接六个 package
```

安装后**完全退出 DSH 再启动**。

### 只安装一个

在 Creator 预设的会话里：

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-hover-polish")
```

`target` 必须是绝对路径。六个 target：

```text
<monorepo>/packages/dsh-sidebar-sections
<monorepo>/packages/dsh-file-link-actions
<monorepo>/packages/dsh-composer-history
<monorepo>/packages/dsh-hover-polish
<monorepo>/packages/dsh-continue
<monorepo>/packages/dsh-queue-withdraw
```

### 检查

```sh
node scripts/check-all.mjs
```

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

[![version](https://img.shields.io/badge/version-2.3.0-blue)](packages/dsh-sidebar-sections)
[![checks](https://img.shields.io/badge/checks-67-brightgreen)](packages/dsh-sidebar-sections/scripts/check.mjs)

把侧边栏变成 **置顶 / 项目 / 最近 / 归档** 四个正式分区。

![dsh-sidebar-sections 2.3.0：四分区侧边栏、分区菜单与项目菜单](packages/dsh-sidebar-sections/docs/screenshot.png)

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

[详细文档](packages/dsh-sidebar-sections/README.md) · [English](packages/dsh-sidebar-sections/README.en.md)

---

### dsh-file-link-actions

[![version](https://img.shields.io/badge/version-1.0.0-blue)](packages/dsh-file-link-actions)
[![checks](https://img.shields.io/badge/checks-20-brightgreen)](packages/dsh-file-link-actions/scripts/check.mjs)

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

[详细文档](packages/dsh-file-link-actions/README.md) · [English](packages/dsh-file-link-actions/README.en.md)

---

### dsh-composer-history

[![version](https://img.shields.io/badge/version-1.2.0-blue)](packages/dsh-composer-history)
[![checks](https://img.shields.io/badge/checks-29-brightgreen)](packages/dsh-composer-history/scripts/check.mjs)

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

[详细文档](packages/dsh-composer-history/README.md) · [English](packages/dsh-composer-history/README.en.md)

---

### dsh-hover-polish

[![version](https://img.shields.io/badge/version-1.0.11-blue)](packages/dsh-hover-polish)
[![checks](https://img.shields.io/badge/checks-34-brightgreen)](packages/dsh-hover-polish/scripts/check.mjs)

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

[详细文档](packages/dsh-hover-polish/README.md) · [English](packages/dsh-hover-polish/README.en.md)

---

### dsh-continue

[![version](https://img.shields.io/badge/version-1.1.1-blue)](packages/dsh-continue)
[![checks](https://img.shields.io/badge/checks-19-brightgreen)](packages/dsh-continue/scripts/check.mjs)

任务 **停止、报错或被截断** 后，输入框为空时把发送按钮变成播放键。

- 点击后通过当前 Session 的 `prompt()` 提交「继续」/「Continue」
- 不填草稿、不加附件、不绕过队列
- 输入文字或附件后立即恢复普通发送按钮

**显示状态：** 仅在 `aborted`、`blocked`、`error`、`max-tokens`、`interrupted`，或尾部只有 `turn/start` 的异常中断时出现；正常完成和 `forked` 不显示。

**限制：** 只覆盖发送按钮/输入框状态；依赖宿主 primary button 的 DOM 定位；大改布局后可能需要适配。

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-continue")
```

[详细文档](packages/dsh-continue/README.md) · [English](packages/dsh-continue/README.en.md)

---

### dsh-queue-withdraw

[![version](https://img.shields.io/badge/version-1.2.0-blue)](packages/dsh-queue-withdraw)
[![checks](https://img.shields.io/badge/checks-19-brightgreen)](packages/dsh-queue-withdraw/scripts/check.mjs)

把排队中的消息 **撤回输入栏**。

- 文本追加到现有草稿，而不是覆盖
- 图片附件可回填
- 文件附件在选择文件时缓存到浏览器 IndexedDB，撤回时重新注册为草稿附件
- 通过公开的 `Session.updateQueue(remove)` 移除队列项
- 移除失败恢复原草稿，消息仍在队列

**限制：** 只覆盖插件加载后选择的文件；安装前已存在的队列文件没有缓存。清空站点数据、隐私模式、IndexedDB 失败或缓存超过 24 小时时，文件可能无法恢复。缓存按 `name + size` 匹配。

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-queue-withdraw")
```

[详细文档](packages/dsh-queue-withdraw/README.md) · [English](packages/dsh-queue-withdraw/README.en.md)

---

## 仓库结构

```text
.
├── packages/          # 六个完整 DSH bundle
├── scripts/
│   ├── check-all.mjs
│   └── install-all.mjs
├── .github/workflows/check.yml
├── README.md / README.en.md
└── CHANGELOG.md
```

每个 package 都有 `package.json`、`cordis.patch.yml`、Host `index.js`、浏览器 `client.js`、
locale、README、CHANGELOG 和零依赖测试。

功能分开打包，是为了单独安装、单独回滚、单独定位问题；monorepo 只统一 Git、CI 和安装脚本。

## 验证

```sh
node scripts/check-all.mjs
```

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

本仓库以新历史合并了原独立插件仓库，映射见 [MIGRATION.md](MIGRATION.md)。旧目录保留作为归档。

[MIT](LICENSE)。每个 package 内也有 LICENSE 副本。
