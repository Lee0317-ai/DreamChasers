# T285：胡了卜弃牌交互 UI 设计资源

- 任务编号：T285
- 负责人：Lee
- 状态：已完成
- 优先级：P0
- 目标：交付一套 390×844 竖屏牌局弃牌交互视觉规范和透明组件，覆盖待机、选择、确认、成功反馈、不可弃牌五种状态。
- 允许修改文件：`output/hulebu-ui-assets/hulebu-discard-ui-v1/**`、本任务分片、领取分片、`docs/tasks/CHANGE_INTAKE.md`、`docs/tasks/NEXT_ID.md`、当天进展、模块进展、完成记录及 docs:sync 主文档。
- 禁止修改文件：`apps/**`、`packages/**`、玩法规则、关卡配置、存档协议、既有 `formal-ui-v1`、T273-T275 组件包、Web Demo、横屏、SDK。
- 设计口径：弃牌使用轻量选择模式，不开全屏确认弹窗；点击弃牌入口后，主槽牌进入朱砂描边选择态，选择一张后在槽位下方出现“弃入牌河 / 取消”确认条；成功后牌河只展示真实弃牌。
- 验证：透明角、alpha bbox、安全边距、PNG RGBA、manifest 唯一 key、contact sheet 人工检查、API Key 扫描、UTF-8 无 BOM、`npm run docs:sync`、`git diff --check`。

## 完成摘要

- 交付 390×844 双倍完整弃牌选择态效果图。
- 交付弃牌入口三态、选中描边、提示条、确认条、牌河面板和成功提示共 8 个透明 RGBA 组件。
- manifest 已记录唯一 key、锚点、Sprite 类型、九宫格边距、alpha bbox 和 SHA-256。
- 最终牌面复用 `formal-ui-v1` 正式麻将牌，AI 概念稿仅作为材质与构图参考。
- 根据 2026-08-13 用户实机截图追加 v2 参考稿：弃牌入口回到右侧工具栏，牌河置于动作栏上方，确认控件收窄并贴近弃牌入口，避免遮挡 `胡 / 杠 / 碰 / 吃 / 补杠`。
