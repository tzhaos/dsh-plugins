# dsh-hover-polish

简体中文 | [English](README.en.md)

一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 客户端插件：为界面里的
按钮补上统一、接近 Codex 的 hover 反馈与提示气泡。

![DeepSeek Harness](https://img.shields.io/badge/DeepSeek%20Harness-0.2.1--rc.2-4D6BFE)
![Version](https://img.shields.io/badge/version-1.0.11-blue)
![License: MIT](https://img.shields.io/badge/license-MIT-green)
![Runtime dependencies](https://img.shields.io/badge/runtime%20dependencies-0-brightgreen)
![Checks](https://img.shields.io/badge/checks-34-brightgreen)

## 为什么

DSH 的按钮 hover 覆盖不完整：有些控件只有浏览器原生 `title` 提示，有些图标按钮没有背景反馈，
有些只有很简单的变色。Codex 的界面里，hover 是有统一节奏的：延迟合理、气泡样式一致、快捷键
清楚、图标按钮都有可预期的反馈。

`dsh-hover-polish` 只补这一层交互，不替换任何宿主组件。

## 功能

- **原生 title 升级**：无文字/图标按钮的 `title` 在 hover 时不再弹浏览器原生气泡，改由插件渲染 Codex 风格提示
- **只给图标按钮或需要解释的控件加气泡**：已有可见文字且没有额外解释的按钮不再重复弹文案；发送按钮完全跳过
- **解释性气泡**：模型/推理强度、权限模式、添加入口等复杂控件显示动作说明，而不是重复按钮文字
- **快捷键去重**：宿主气泡里重复的相邻 keycap（例如 Esc Esc）只保留一个
- **优先在上方**：气泡默认位于控件上方，只有上方空间不足时才翻到下方
- **补齐图标按钮 hover**：resting 背景透明的图标按钮获得统一的 hover 背景和短过渡
- **统一提示气泡**：深色圆角、紧凑内边距、快捷键 keycap、主题 token、轻量进入动画
- **所有 Tooltip 水平居中**：宿主原有侧边/右对齐 Tooltip 也会被重新锚定到按钮水平中心；靠近视口边缘时自动夹紧
- **标签页 hover**：文件标签、对话标签和设置标签都获得明确的 hover 反馈（含当前选中的标签：使用描边而不是覆盖选中底色）
- **标签页完整标题气泡**：截断的文件标签显示完整标题/路径，不再依赖浏览器原生 hover
- **统一字体细节**：Tooltip 与标签使用 12/13px、500 字重、8px 圆角的 Codex 风格尺度
- **快捷键展示**：读取 `aria-keyshortcuts` / `data-shortcut`，如 `Ctrl+Shift+M`
- **不抢宿主提示**：检测到宿主 Tooltip 已经出现时自动让位，不显示重复气泡
- **键盘可达**：`focusin` 也会显示同样的提示；`Esc`、滚动、失焦都会收起
- 不修改宿主数据，不增加后端接口

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
   New-Item -ItemType Junction -Path "$profile\node_modules\dsh-hover-polish" `
            -Target "<本目录的绝对路径>"
   ```

2. 在 profile 的 `package.json` 中加入 `link:` 依赖，并把包名追加到
   `dsh.profile.bundles`。只改依赖不会触发重组，必须让有序 bundle 列表发生变化。

### 环境要求

- DeepSeek Harness `0.2.1-rc.2`（Web 或 Desktop Web 界面）
- 无需构建、零运行时依赖

## 实现

插件在 `shell.overlay` 注册一个全局 hover layer，监听文档级 `pointerover` / `pointerout` /
`focusin` / `focusout` / `scroll` / `keydown`：

1. 找到最近的可交互 `button`，跳过菜单、禁用按钮和带自定义 skip 标记的控件；
2. 从 `title`、`aria-label`、`aria-labelledby` 解析标签；`title` 来源的按钮会暂时移除
   `title`，由插件接管视觉提示，离开时恢复；
3. icon-only 且背景透明的按钮打上 `data-dshhp-hover="icon"`，由 CSS 统一补 hover 背景；
4. 650ms 后检查宿主是否已经显示 `[role="tooltip"]`，没有才渲染自己的气泡；
5. 气泡通过 portal 渲染，使用 `--dsw-*` 主题 token；`Esc` / 滚动 / 失焦立即收起。

宿主 Tooltip 的视觉也做了一点点统一：圆角和 elevation 与插件气泡对齐。

## 已知限制

- 只处理带 `title` / `aria-label` / `aria-labelledby` 的按钮；纯文本按钮不额外加提示
- 宿主已有的 Tooltip 内容、快捷键和交互仍由宿主决定，插件不重建它们
- 菜单项、下拉选项和带 `data-dshhp-skip` 的控件不处理
- 自定义气泡的延迟是 650ms，以便宿主 Tooltip 优先出现；如果觉得慢可以调常量
- DSH 客户端 API 仍是 pre-stable，升级后可能需要适配

## 开发与测试

```sh
node scripts/check.mjs
```

零依赖测试覆盖清单、bundle patch、locale、样式 token、原生 title 接管/恢复、宿主提示让位、
aria-label、快捷键、图标 hover 面、菜单/禁用跳过、focus、滚动/Esc 收起和监听注册等
34 项检查。

## 许可证

[MIT](LICENSE)
