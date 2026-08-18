# T273：胡了卜标题与大厅透明组件资源包

- 任务编号：T273
- 负责人：Lee
- 状态：已完成
- 优先级：P0
- 依赖任务：T249、T250、T268、T271
- 来源：Lee 确认继续拆分 T271 已批准的第一批局外组件。
- 目标：交付一套可进入 Cocos 导入检查的 `common/title/lobby` 透明 PNG，并为每个组件提供逻辑 key、尺寸、锚点、九宫格和来源记录。
- 组件范围：标题牌匾、玉印、主按钮、次按钮、说明底板、头像框、资产牌匾、继续面板、进度轨、主线/模式/图鉴/成长四入口徽章、底部导航底板。
- 允许修改文件：`output/hulebu-ui-assets/hulebu-meta-flow-components-v1/**`、T273 任务/领取分片、`docs/tasks/CHANGE_INTAKE.md`、`docs/tasks/NEXT_ID.md`、`docs/progress/2026-08-11-lee.md`、`docs/modules/mahjong-roguelike/PROGRESS.md`、后续完成记录及 docs:sync 主文档。
- 禁止修改文件：`apps/**`、`packages/**`、T269-T272 文件、玩法规则、关卡配置、存档协议、`output/hulebu-ui-assets/hulebu-formal-ui-v1/**`、`output/hulebu-ui-assets/hulebu-lobby-flow-formal-v1/**` 既有文件、Web Demo、横屏、微信小游戏 SDK、其他模块。
- 验证命令：PNG RGBA/透明角检查；alpha bbox/主体覆盖检查；尺寸与命名检查；manifest JSON 解析；contact sheet 人工检查；API Key 扫描；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`。
- 验收标准：组件背景透明且无明显色键毛边；标题/按钮/长板能安全九宫格；徽章和头像框保持正方形；运行时文字区域为空；所有文件名、key、锚点和状态可直接进入后续 Cocos 导入任务。

## 进展

- 2026-08-11：任务登记并由 Lee 领取；API Key 只作为生成命令临时环境变量使用，不写入仓库。
- 2026-08-11：生成三张无文字品红键控源表，裁出 `common/title/lobby` 共 14 个透明 RGBA 组件。
- 2026-08-11：新增可重复构建脚本、Cocos 导入说明、manifest 和透明棋盘联系表；按钮状态与入口提醒态明确采用运行时派生层。
- 2026-08-11：14/14 组件通过透明角、alpha 安全边距、强品红残留、正方形画布、九宫格合法性和 key/路径唯一性检查，任务完成。
