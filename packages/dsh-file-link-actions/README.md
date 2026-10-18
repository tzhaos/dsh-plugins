# dsh-file-link-actions

简体中文 | [English](README.en.md)

一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 客户端插件：给对话里的
文件链接加上右键菜单，用默认应用打开、在文件管理器中定位，或复制文件路径。

![DeepSeek Harness](https://img.shields.io/badge/DeepSeek%20Harness-0.2.1--rc.2-4D6BFE)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License: MIT](https://img.shields.io/badge/license-MIT-green)
![Runtime dependencies](https://img.shields.io/badge/runtime%20dependencies-0-brightgreen)
![Checks](https://img.shields.io/badge/checks-20-brightgreen)

## 为什么

DSH 会把对话里的本地文件路径渲染成链接。左键点击会打开侧边栏文档预览，但想用系统默认应用
打开，或者直接跳到文件所在目录，就只能自己找路径。

这个插件只补一件事：**右键文件链接，拿到系统级的打开方式**。

## 功能

- **用默认应用打开**：交给操作系统关联程序处理
- **打开所在文件夹**：在系统文件管理器中定位该文件
- **复制文件路径**：复制解析后的绝对路径
- 支持对话里的文件引用，以及 markdown 文件链接
- 相对路径会按当前对话所属工作区解析，再交给 Host 打开
- 不改动 DSH 原有左键预览和宿主数据

## 安装

### Plugin Manager（推荐）

在启用 Creator 预设的会话中执行：

```text
plugin_manager(action="install_bundle", target="<本目录的绝对路径>")
```

`target` 必须是绝对路径；如果当前 profile 之前已经装过同名插件，会返回
`already-installed`，先 `remove_bundle` 再安装即可。

### 手工安装（开发用）

1. 让包能从 profile 目录解析到：

   ```powershell
   $profile = "$env:USERPROFILE\.dsh\profiles\desktop"
   New-Item -ItemType Directory -Force -Path "$profile\node_modules" | Out-Null
   New-Item -ItemType Junction -Path "$profile\node_modules\dsh-file-link-actions" `
            -Target "<本目录的绝对路径>"
   ```

2. 在 profile 的 `package.json` 中加入 `link:` 依赖，并把包名追加到
   `dsh.profile.bundles`。只改依赖不会触发重组，必须让有序 bundle 列表发生变化。

### 环境要求

- DeepSeek Harness `0.2.1-rc.2`（Web 或 Desktop Web 界面）
- 无需构建、零运行时依赖

## 使用

在对话里右键一个文件链接：

- **用默认应用打开**：调用系统默认程序打开文件
- **打开所在文件夹**：在文件管理器中显示该文件
- **复制文件路径**：复制解析后的绝对路径

左键点击仍然是 DSH 原来的文档预览行为，不会被这个插件改变。

## 实现

插件在 `shell.overlay` 注册一个全局 overlay，监听文档级的 `contextmenu` 事件：

1. 事件目标必须位于对话 markdown 内，并且是一个带 `fileLink` / `fileMention` class 的按钮；
2. 从按钮的 `title` 属性读取文件路径；
3. 从最近的 `[data-conversation-session]` 找到对话 id，再从 session 列表读取工作区 `cwd`，
   把相对路径解析成绝对路径；
4. 通过 Host 的 `remote.session.openWorkspacePath` 执行默认应用打开或 `action: 'reveal'`。

颜色全部来自 `--dsw-*` 主题 token；没有构建步骤，也不引入运行时依赖。

## 已知限制

- 只处理对话 markdown 中的本地文件链接；普通网页链接、图片预览按钮不处理
- 如果链接没有可用的绝对路径，且当前对话无法提供工作区路径，会提示无法定位
- DSH 客户端 API 仍是 pre-stable，DSH 升级后可能需要跟随适配

## 开发与测试

```sh
node scripts/check.mjs
```

零依赖测试覆盖清单、bundle patch、locale、样式 token、右键命中、相对路径解析、默认打开 /
文件夹定位 / 复制路径、宿主失败提示和事件清理等 20 项检查。

## 许可证

[MIT](LICENSE)
