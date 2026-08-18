# T275：胡了卜胜负结算透明组件资源包

- 任务编号：T275
- 负责人：Lee
- 状态：已完成
- 优先级：P0
- 依赖任务：T268、T271、T273、T274
- 来源：Lee 要求继续完成胡了卜完整局外 UI 设计资源，标题/大厅与模式/地图两批组件已经通过验收。
- 目标：交付一套可进入 Cocos 导入检查的 `result` 透明 PNG，并为每个组件提供逻辑 key、尺寸、锚点、九宫格、状态和来源记录。
- 组件范围：胜利印章、失败印章、胜利标题牌、失败标题牌、统计牌匾、失败建议面板、解锁横幅、结算主按钮和结算次按钮。
- 允许修改文件：`output/hulebu-ui-assets/hulebu-result-components-v1/**`、T275 任务/领取分片、`docs/tasks/CHANGE_INTAKE.md`、`docs/tasks/NEXT_ID.md`、`docs/progress/2026-08-11-lee.md`、`docs/modules/mahjong-roguelike/PROGRESS.md`、后续完成记录及 docs:sync 主文档。
- 禁止修改文件：`apps/**`、`packages/**`、T269-T274 文件、玩法规则、关卡配置、存档协议、`output/hulebu-ui-assets/hulebu-formal-ui-v1/**`、`output/hulebu-ui-assets/hulebu-lobby-flow-formal-v1/**`、`output/hulebu-ui-assets/hulebu-meta-flow-components-v1/**`、`output/hulebu-ui-assets/hulebu-mode-map-components-v1/**`、Web Demo、横屏、微信小游戏 SDK、其他模块。
- 验证命令：PNG RGBA/透明角检查；alpha bbox/主体覆盖检查；尺寸与命名检查；manifest JSON 解析；contact sheet 人工检查；API Key 扫描；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`。
- 验收标准：组件背景透明且无明显色键毛边；长板和按钮能安全九宫格；胜败印章保持正方形画布且语义清楚；运行时文字区域为空；所有文件名、key、锚点和状态可直接进入后续 Cocos 导入任务。

## 进展

- 2026-08-11：任务登记并由 Lee 领取；API Key 只作为生成命令临时环境变量使用，不写入仓库。
- 2026-08-11：生成胜负印章、结算信息板和结算按钮三张无文字源表，裁出 `result` 共 9 个透明 RGBA 组件。
- 2026-08-11：新增可重复构建脚本、Cocos 导入说明、manifest 和透明棋盘联系表；按钮态和可领取态明确采用运行时派生层。
- 2026-08-11：9/9 组件通过透明角、alpha 安全边距、强品红残留、正方形画布、九宫格合法性和 key/路径唯一性检查，任务完成。
