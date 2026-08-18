# T271：胡了卜完整局外流程正式视觉母稿

- 任务编号：T271
- 负责人：Lee
- 状态：已完成
- 优先级：P0
- 依赖任务：T249、T250、T268
- 来源：Lee 确认继续推进完整局外 UI 的正式视觉资源。
- 目标：把 T268 的交互设计转换为四组可评审的正式竖屏视觉母稿，并形成后续透明组件切图与 Cocos 接入的唯一清单。
- 设计基准：`390×844` 竖屏；输出母稿按 `1024×1536` 生成；青玉、金红、深木、象牙纸、宋式花木与暖金材质；不得出现赌场、真钱、筹码或博彩表达。
- 页面范围：登录/标题、局外大厅、模式选择、主线关卡地图、胜利结算、失败结算。
- 允许修改文件：`output/hulebu-ui-assets/hulebu-lobby-flow-formal-v1/**`、T271 任务/领取分片、`docs/tasks/CHANGE_INTAKE.md`、`docs/tasks/NEXT_ID.md`、`docs/progress/2026-08-11-lee.md`、`docs/modules/mahjong-roguelike/PROGRESS.md`、后续完成记录及 docs:sync 主文档。
- 禁止修改文件：`apps/**`、`packages/**`、T269/T270 文件、玩法规则、关卡配置、存档协议、`output/hulebu-ui-assets/hulebu-formal-ui-v1/**` 既有文件、Web Demo、横屏、微信小游戏 SDK、其他模块。
- 验证命令：图片尺寸/格式检查；六张母稿视觉检查；敏感与乱码文本检查；资源清单校验；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`。
- 验收标准：四个页面家族可一眼辨识但属于同一视觉系统；主按钮和层级清楚；模式状态与关卡进度可扫描；结算有胜负两态；所有运行时文字保持独立文本层，不依赖生成图中文字；资源清单能直接拆出后续组件任务。

## 进展

- 2026-08-11：任务登记并由 Lee 领取；确认 PPTOKEN key 仅临时注入生成命令，不写入仓库。
- 2026-08-11：已生成六张竖屏正式视觉母稿和一张六宫格总览；登录、局外大厅、五模式、主线地图、胜利和失败采用同一材质与构图语言。
- 2026-08-11：已完成 `manifest.json`、生成说明和 Cocos SpriteFrame key 清单；母稿明确禁止整张直接作为运行时背景。
- 2026-08-11：六张母稿和总览均通过 PNG 格式、实测尺寸与文件完整性检查；清单解析通过，`git diff --check` 通过。

## 完成结论

- `masters/title-login-v1.png`：登录/标题品牌与登录按钮层级母稿。
- `masters/lobby-v1.png`：继续本轮、四入口和底部导航母稿。
- `masters/mode-select-v1.png`：五种模式及 active/normal/locked 状态母稿。
- `masters/level-map-v1.png`：章节、路径、节点与 Boss 门母稿；节点数量由运行时决定。
- `masters/result-victory-v1.png`：胜利印章、统计、解锁与双按钮母稿。
- `masters/result-failure-v1.png`：失败原因、建议、存档说明与双按钮母稿。
- `previews/contact-sheet-v1.png`：六张母稿总览。
- `manifest.json`、`GENERATION_SPEC.md`、`COCOS_HANDOFF.md`：资源边界、提示词摘要与 Cocos key 清单。
