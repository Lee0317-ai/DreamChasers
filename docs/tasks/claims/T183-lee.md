# T183：胡了卜 UI 资产 Cocos 接入说明文档

- 领取人：Lee
- 领取时间：2026-06-22
- 状态：待验收
- 预计完成：2026-06-22
- 允许修改文件：`docs/modules/mahjong-roguelike/UI_ASSETS_COCOS_INTEGRATION.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T183-hulebu-ui-assets-cocos-integration-doc.md`, `docs/tasks/claims/T183-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-06-22-lee.md`
- 禁止修改文件：`apps/web/**`, `apps/game/**`, `packages/shared/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`, `output/hulebu-ui-assets/**`
- 依赖任务：T181, T182, T175
- 验证命令：`test -f docs/modules/mahjong-roguelike/UI_ASSETS_COCOS_INTEGRATION.md`; `rg -n "hulebu-ui-component-pack-v6|hulebu-action-fx-character-concept-v1|SpriteFrame|Cocos" docs/modules/mahjong-roguelike/UI_ASSETS_COCOS_INTEGRATION.md`; `npm run docs:sync`; `git diff --check -- docs/modules/mahjong-roguelike/UI_ASSETS_COCOS_INTEGRATION.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/tasks/CHANGE_INTAKE.md docs/tasks/NEXT_ID.md docs/tasks/items/T183-hulebu-ui-assets-cocos-integration-doc.md docs/tasks/claims/T183-lee.md docs/tasks/TASK_BOARD.md docs/tasks/CLAIMS.md docs/status/CURRENT_STATUS.md docs/progress/2026-06-22-lee.md`
- 当前风险：T182 人物 cut-in 仍是程序化占位，不应作为最终商用人物立绘直接接入；T181 v6 为松散 PNG 资源包，正式 Cocos 接入前还需要复制到 `assets/resources` 并由 Cocos 生成 `.meta`。
- 当前阻塞：无。
- 备注：已新增 `UI_ASSETS_COCOS_INTEGRATION.md` 并挂入模块 README / PROGRESS / HANDOFF；本任务只补 Cocos 接入说明，不接入运行时。
