# T183：胡了卜 UI 资产 Cocos 接入说明文档

- 优先级：P2
- 负责人：Lee
- 状态：待验收
- 背景：T181 已产出 HUD、按钮、槽位、奖励卡、场景皮肤卡和透明麻将牌面资源；T182 已产出操作演出概念贴图和人物 cut-in 占位。后续 Cocos 接入需要统一说明可用资源、路径、命名和接入顺序。
- 目标：新增胡了卜 UI 资产 Cocos 接入文档，记录可使用的 UI 资源包、透明牌面、操作演出贴图、预览图、Cocos 导入目录建议、SpriteFrame key 建议、组件使用口径和风险清单。
- 不做：不接入 Cocos 工程，不复制 PNG 到 Cocos assets，不做图集打包，不改 Web Demo，不生成新美术资源，不修改玩法、关卡、账号、PDF、AI 修图、TimePick 或部署文件。
- 依赖：T181 v6 UI 透明资源包；T182 v1 操作演出概念包；T175 的“Web 完整版优先，Cocos 后置”路线。
- 允许修改文件：`docs/modules/mahjong-roguelike/UI_ASSETS_COCOS_INTEGRATION.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T183-hulebu-ui-assets-cocos-integration-doc.md`, `docs/tasks/claims/T183-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-06-22-lee.md`
- 禁止修改文件：`apps/web/**`, `apps/game/**`, `packages/shared/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`, `output/hulebu-ui-assets/**`
- 验证命令：`test -f docs/modules/mahjong-roguelike/UI_ASSETS_COCOS_INTEGRATION.md`; `rg -n "hulebu-ui-component-pack-v6|hulebu-action-fx-character-concept-v1|SpriteFrame|Cocos" docs/modules/mahjong-roguelike/UI_ASSETS_COCOS_INTEGRATION.md`; `npm run docs:sync`; `git diff --check -- docs/modules/mahjong-roguelike/UI_ASSETS_COCOS_INTEGRATION.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/tasks/CHANGE_INTAKE.md docs/tasks/NEXT_ID.md docs/tasks/items/T183-hulebu-ui-assets-cocos-integration-doc.md docs/tasks/claims/T183-lee.md docs/tasks/TASK_BOARD.md docs/tasks/CLAIMS.md docs/status/CURRENT_STATUS.md docs/progress/2026-06-22-lee.md`
- 执行记录：
  - 2026-06-22：新增任务，范围限定为文档记录和模块交接，不改 Cocos / Web / shared 代码。
  - 2026-06-22：已新增 `docs/modules/mahjong-roguelike/UI_ASSETS_COCOS_INTEGRATION.md`，记录 T181 v6 和 T182 v1 的资源入口、Cocos 目录建议、SpriteFrame key、透明牌面映射、导入设置、接入顺序和风险清单；README / PROGRESS / HANDOFF 已挂入口。
- 当前阻塞：无。
- 下一步：等待后续 Cocos 接入任务按文档复制资源并建立 runtime catalog。
