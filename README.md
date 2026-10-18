# DSH Plugins

简体中文 | [English](README.en.md)

一组面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 客户端的小型插件，
统一放在一个 monorepo 中维护。每个插件保持独立安装、独立测试、独立版本与 changelog；仓库层负责
统一 CI、开发安装和发布。

![DeepSeek Harness](https://img.shields.io/badge/DeepSeek%20Harness-0.2.1--rc.2-4D6BFE)
![Version](https://img.shields.io/badge/monorepo-1.0.0-blue)
![License: MIT](https://img.shields.io/badge/license-MIT-green)
![Runtime dependencies](https://img.shields.io/badge/runtime%20dependencies-0-brightgreen)

## 插件

| 插件 | 版本 | 检查 | 说明 |
|---|---|---|---|
| [`dsh-sidebar-sections`](packages/dsh-sidebar-sections) | 2.3.0 | 67 | 四分区侧边栏（置顶 / 项目 / 最近 / 归档），支持拖拽、右键菜单、安全删除、设置页和文件管理器入口。 |
| [`dsh-file-link-actions`](packages/dsh-file-link-actions) | 1.0.0 | 20 | 对话里的文件链接右键菜单：默认应用打开、显示所在文件夹、复制路径。 |
| [`dsh-composer-history`](packages/dsh-composer-history) | 1.2.0 | 29 | 输入框历史输入：搜索、直接按 `↑` 取回、面板清空，设置页可查看/删除/清空。 |
| [`dsh-hover-polish`](packages/dsh-hover-polish) | 1.0.11 | 34 | 统一按钮与标签页 hover、Codex 风格 Tooltip、解释性气泡、完整标签标题和快捷键去重。 |
| [`dsh-continue`](packages/dsh-continue) | 1.1.0 | 18 | 正常结束或中断的对话在输入框为空时把发送按钮变为播放键，一键继续。 |
| [`dsh-queue-withdraw`](packages/dsh-queue-withdraw) | 1.1.1 | 17 | 把排队消息撤回输入栏：文本和图片回填草稿并从队列移除；文件附件仍受 Host API 限制。 |

全部测试合计 **185 项**，零运行时依赖。

## 安装

### 一次安装全部插件（开发 / 本地）

```powershell
node scripts/install-all.mjs
```

脚本会：

1. 在 `~/.dsh/profiles/desktop/node_modules` 下为每个 package 建立 junction；
2. 写入 `package.json` 的 `link:` 依赖；
3. 按顺序把六个插件加入 `dsh.profile.bundles`。

也可以指定 profile：

```powershell
node scripts/install-all.mjs --profile "$env:USERPROFILE\.dsh\profiles\desktop"
```

### 单独安装某个插件

每个 package 仍是完整的 DSH bundle，可以单独安装：

```text
plugin_manager(action="install_bundle", target="<本仓库>/packages/<插件目录>")
```

## 开发

```sh
node scripts/check-all.mjs     # 依次运行全部插件的零依赖测试
```

也可以进入单个 package 运行：

```sh
cd packages/dsh-hover-polish
node scripts/check.mjs
```

仓库约束：

- 没有构建步骤，没有运行时依赖
- 每个 package 自己拥有 `package.json` / `cordis.patch.yml` / `client.js` / locale / 测试
- 根目录统一维护 `.github/workflows/check.yml`、编辑器配置和安装脚本
- 每个 package 的 `README.md` 是中文主文档，`README.en.md` 是对应英文版

## 目录

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

## 版本与发布

- monorepo 根版本单独递增，用于标记一次整体整理/新增插件
- 各插件继续维护自己的 `package.json` 版本、tag 和 `CHANGELOG.md`
- 根目录 `CHANGELOG.md` 只记录仓库级变化，插件变更仍看插件自己的 changelog

## 已知限制

- 插件仍使用 DSH pre-stable 客户端 API 和少量宿主 DOM 契约，DSH 升级后可能需要适配
- `install-all.mjs` 是开发用 path-link 安装；正式分发仍建议用 Plugin Manager
- 文件附件的队列撤回仍受 Host 附件读取能力限制，图片已支持

## 从独立仓库迁移

本仓库用 **新历史** 合并了原先各自独立的插件仓库，具体对应关系见 [MIGRATION.md](MIGRATION.md)。

## 许可证

[MIT](LICENSE)。每个 package 内也有自己的 LICENSE 副本。
