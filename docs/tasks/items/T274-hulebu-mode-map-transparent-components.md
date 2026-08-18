# T274：胡了卜模式与主线地图透明组件资源包

- 任务编号：T274
- 负责人：Lee
- 状态：已完成
- 优先级：P0
- 依赖任务：T268、T271、T273
- 来源：Lee 要求继续完成胡了卜完整局外 UI 设计资源，T273 第一批标题/大厅组件已通过验收。
- 目标：交付一套可进入 Cocos 导入检查的 `modes/map` 透明 PNG，并为每个组件提供逻辑 key、尺寸、锚点、九宫格、状态和来源记录。
- 组件范围：模式入口长卡、模式状态牌、主线/无尽/每日/高阶/图鉴五枚模式徽章、章节牌匾、星级牌匾、路径段、普通/当前/锁定/Boss 关卡节点、空星/实星和章节切换底栏。
- 允许修改文件：`output/hulebu-ui-assets/hulebu-mode-map-components-v1/**`、T274 任务/领取分片、`docs/tasks/CHANGE_INTAKE.md`、`docs/tasks/NEXT_ID.md`、`docs/progress/2026-08-11-lee.md`、`docs/modules/mahjong-roguelike/PROGRESS.md`、后续完成记录及 docs:sync 主文档。
- 禁止修改文件：`apps/**`、`packages/**`、T269-T273 文件、玩法规则、关卡配置、存档协议、`output/hulebu-ui-assets/hulebu-formal-ui-v1/**`、`output/hulebu-ui-assets/hulebu-lobby-flow-formal-v1/**`、`output/hulebu-ui-assets/hulebu-meta-flow-components-v1/**`、Web Demo、横屏、微信小游戏 SDK、其他模块。
- 验证命令：PNG RGBA/透明角检查；alpha bbox/主体覆盖检查；尺寸与命名检查；manifest JSON 解析；contact sheet 人工检查；API Key 扫描；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`。
- 验收标准：组件背景透明且无明显色键毛边；长卡与长板能安全九宫格；所有徽章、节点和星形保持正方形画布；运行时文字区域为空；所有文件名、key、锚点和状态可直接进入后续 Cocos 导入任务。

## 进展

- 2026-08-11：任务登记并由 Lee 领取；API Key 只作为生成命令临时环境变量使用，不写入仓库。
- 2026-08-11：生成模式面板、模式徽章、地图长板/路径和地图节点/星级四张无文字源表，裁出 `modes/map` 共 17 个透明 RGBA 组件。
- 2026-08-11：新增可重复构建脚本、Cocos 导入说明、manifest 和透明棋盘联系表；完成态、锁定态、领取态和当前节点动效明确采用运行时叠加层。
- 2026-08-11：17/17 组件通过透明角、alpha 安全边距、强品红残留、正方形画布、九宫格合法性和 key/路径唯一性检查，任务完成。
