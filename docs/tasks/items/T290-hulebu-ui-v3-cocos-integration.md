# T290：胡了卜 UI v3 正式接入 Cocos

- 任务编号：T290
- 负责人：Lee
- 状态：进行中
- 优先级：P0
- 需求来源：Lee 要求按 `docs/modules/mahjong-roguelike/UI_ASSETS_V3_COCOS_INTEGRATION.md` 接入新的 UI。
- 目标：把 T287 的 component-pack-v3、5 张背景和 tiles-v3 全量复制到正式 Cocos resources，并让当前大厅、地图、牌局、弹层和结算优先加载 v3 资源。
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/hulebu/**`、`assets/scripts/assets/**`、UI Binder、`GameSceneController.ts`、相关共享测试、T290 任务/领取/完成记录、麻将模块进展和当天进展。
- 禁止修改文件：玩法规则、关卡配置、奖励配置、存档结构、Web Demo、T287 生成源资源。
- 验证命令：资源数量检查、`npx vitest run packages/shared/src/hulebu-cocos-project.test.ts packages/shared/src/hulebu-cocos-domain.test.ts`、`npm run game:hulebu:verify-build`、`npm run game:hulebu:build`、竖屏浏览器截图检查。
- 完成文档：`docs/completion/2026-08-17-task-290-hulebu-ui-v3-cocos-integration.md`、`docs/modules/mahjong-roguelike/PROGRESS.md`、`docs/progress/2026-08-17-lee.md`。
