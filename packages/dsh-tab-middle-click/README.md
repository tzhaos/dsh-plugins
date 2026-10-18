# dsh-tab-middle-click

简体中文 | [English](README.en.md)

一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 客户端插件：在侧边栏/
停靠区的标签上按鼠标中键，直接关闭该标签。

## 为什么

DSH 的标签已经有右键/关闭按钮和键盘关闭方式，但鼠标中键没有绑定。习惯浏览器标签操作的人会
自然地中键关闭，因此在 DSH 里会失效。

这个插件只补这一件事：找到标签里已有的关闭控件，代替用户点击它。插件不删除标签、不改布局，
也不碰会话数据。

## 行为

- 只处理 `[data-dockkit-tab]` / `[data-sidebar-right-tab]` 标签
- 鼠标中键（`auxclick button === 1`）触发
- 通过标签内已有的关闭按钮执行关闭，保持 DSH 自己的关闭逻辑
- 在标签上按下中键时阻止浏览器自动滚动
- 找不到关闭控件的标签不做任何事
- 不处理左键、右键和普通点击

## 实现

插件在 `shell.overlay` 注册一个不渲染内容的全局层：

1. 监听文档级 `auxclick` 和 `mousedown`；
2. 从事件目标向上找最近的 dock tab；
3. 在 tab 内查找带 `data-dockkit-close`、`data-close`、关闭 aria-label/title 或 close class 的控件；
4. 调用该控件的 `click()`，让 DSH 自己的关闭流程执行。

## 安装

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-tab-middle-click")
```

或使用 monorepo 安装脚本：

```powershell
node scripts/install-all.mjs
```

安装后完全退出 DSH 再启动。

## 已知限制

- 依赖 DockKit 的 `data-dockkit-tab` 和标签内关闭控件的 DOM 契约
- 如果 DSH 以后把关闭按钮移出 tab 或改为纯快捷键，需要跟随适配
- 只处理鼠标中键，不新增键盘快捷键

## 开发与测试

```sh
node scripts/check.mjs
```

零依赖测试覆盖清单/patch/locale/icon、全局层注册、中键关闭、非中键忽略、无关闭控件保护、
中键自动滚动阻止和监听清理，共 13 项检查。

## 许可证

[MIT](LICENSE)
