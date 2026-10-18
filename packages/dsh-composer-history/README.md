# dsh-composer-history

简体中文 | [English](README.en.md)

一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 客户端插件：给对话输入框
加上可搜索的历史输入和快捷取回。

![DeepSeek Harness](https://img.shields.io/badge/DeepSeek%20Harness-0.2.1--rc.2-4D6BFE)
![Version](https://img.shields.io/badge/version-1.2.0-blue)
![License: MIT](https://img.shields.io/badge/license-MIT-green)
![Runtime dependencies](https://img.shields.io/badge/runtime%20dependencies-0-brightgreen)
![Checks](https://img.shields.io/badge/checks-29-brightgreen)

## 为什么

对话一长，想重新使用之前发过的提示词，只能往上翻聊天记录再复制。DSH 的输入框没有历史
记录，也没有“上一条输入”的快捷取回。

这个插件在输入框工具条加一个时钟按钮，点开就是当前会话的历史输入；更常用的方式是直接在
空输入框里按 `↑`，上一条提示词会立刻填进输入框。

## 功能

- **历史输入面板**：列出当前会话真实发送过的用户提示词，新的在前
- **搜索过滤**：按关键词过滤，适合找回很早之前的提示词
- **直接在输入框取回**：空输入框按 `↑` 直接填入上一条历史；继续按 `↑` 依次往前翻，`↓` 回到较新的提示词或恢复原草稿
- **完整历史面板**：点击输入框工具条的时钟按钮，或按 `Ctrl/Cmd + ↑` 打开可搜索面板
- **键盘操作**：`↑` / `↓` 选择，`Enter` 填入输入框，`Esc` 关闭
- **不改宿主数据**：只读取浏览器端已有的事件窗口，并把选中的文字写回输入框
- **清空与查看管理**：面板底部可清空当前会话的历史；设置里新增「输入历史」页，可查看、删除单条、清空全部插件记录
- 支持中文和英文界面

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
   New-Item -ItemType Junction -Path "$profile\node_modules\dsh-composer-history" `
            -Target "<本目录的绝对路径>"
   ```

2. 在 profile 的 `package.json` 中加入 `link:` 依赖，并把包名追加到
   `dsh.profile.bundles`。只改依赖不会触发重组，必须让有序 bundle 列表发生变化。

### 环境要求

- DeepSeek Harness `0.2.1-rc.2`（Web 或 Desktop Web 界面）
- 无需构建、零运行时依赖

## 使用

**直接取回**：让输入框为空，按 `↑` 填入上一条提示词；继续按 `↑` 往前翻，按 `↓` 回到较新的提示词；回到最新一条后再按 `↓` 会恢复原来的空草稿。

**打开面板**：点击输入框工具条里的时钟按钮，或按 `Ctrl/Cmd + ↑`。面板支持搜索，鼠标点击或 `↑` / `↓` 选中后按 `Enter` 写回输入框。

**清空历史**：面板底部点击「清空」，再次确认后隐藏当前会话的旧输入。这个动作只影响插件的本地记录，不会删除会话消息。

**管理历史**：设置 → 插件 → 输入历史。页面列出插件记录过的提示词，可展开查看全文、删除单条，或清空全部历史。

## 实现

插件注册在 `conversation.input.left` 槽位，通过会话作用域的 input shell 读取草稿、写入草稿：

1. 从 `sessions.binding(sessionId).eventSource` 的当前事件窗口中取出 `user/message`
   事件，只保留 `source.kind === 'user'` 的真实用户输入；
2. 把事件内容里的文本块拼成提示词，新的在前；
3. 在空草稿上按 `↑` 时直接从最新一条开始取回，继续按 `↑` 往前翻，`↓` 反向回退并最终恢复原草稿；面板选中后同样通过 `inputActions.setDraft` 写回输入框，不触发发送；
4. 面板由 portal 渲染，颜色全部使用 `--dsw-*` 主题 token；
5. 浏览历史时把可见提示词同步到插件在浏览器本地的记录缓存；设置页读取同一份缓存，删除、清空使用本地 tombstone 和会话时间截断，不会修改 Session 日志。

数据保存在 `localStorage` 的 `dsh.composerHistory.managedSettings`，记录上限 500 条、隐藏 key 上限 1000 条。清空全部历史会设置全局时间截断，只隐藏截断前的输入，新输入仍会正常记录。

## 已知限制

- 历史来自当前会话已加载的事件窗口；如果会话特别长，更早的事件可能不在窗口里
- 只记录文本，不包含附件、图片或文件引用
- 历史里可能出现重复的输入，这是用户实际发送过的内容
- 清空和删除只影响插件在浏览器本地的记录，不会删除 Session 消息；换设备或清理浏览器数据后状态不保留
- 设置页只能管理插件已经记录过的提示词；未在本浏览器打开过的历史需要先在对应会话打开面板才会进入管理列表
- DSH 客户端 API 仍是 pre-stable，DSH 升级后可能需要跟随适配

## 开发与测试

```sh
node scripts/check.mjs
```

零依赖测试覆盖清单、bundle patch、locale、样式 token、历史提取与过滤、按钮/面板交互、
直接取回与循环、面板交互、Esc/外部点击关闭和资源清理等 29 项检查。

## 许可证

[MIT](LICENSE)
