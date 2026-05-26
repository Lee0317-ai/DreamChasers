# T061 完成记录：胡了卜 Cocos 场景骨架第一版

- 任务编号：T061
- 负责人：Codex / 开发 B
- 完成日期：2026-05-25

## 修改文件

- `packages/shared/src/mahjong-cocos-scene.ts`
- `packages/shared/src/mahjong-cocos-scene.test.ts`
- `packages/shared/src/index.ts`
- `apps/game/mahjong-roguelike/cocos/README.md`
- `apps/game/mahjong-roguelike/cocos/scene-binding.md`
- `apps/game/mahjong-roguelike/cocos/scripts/README.md`
- `apps/game/mahjong-roguelike/README.md`
- `apps/game/mahjong-roguelike/docs/formal-presentation-bridge.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/DECISIONS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T061-hulebu-cocos-scene-skeleton.md`
- `docs/tasks/claims/T061-codex.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`
- `docs/progress/2026-05-25.md`

## 实现内容

- 新增 `createMahjongCocosSceneModel`，把表现层快照转换为 Cocos 友好的场景模型。
- 场景模型覆盖 `boardNodes`、`slotNodes`、`reserveNodes`、`comboControls` 和 `hud`。
- `boardNodes` 包含 Cocos 坐标、zIndex、可点态、暗化态、prefab key、来源包和堆叠深度。
- 新增测试保护 Cocos 绑定数据契约。
- 新增 Cocos 场景骨架文档，说明推荐节点树、脚本边界、输入回传、prefab key 和 HUD 绑定。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-scene`
- `npm run test -w packages/shared -- mahjong`
- `npm run typecheck -w packages/shared`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- 红灯测试通过：缺少 `mahjong-cocos-scene` 时测试失败，确认测试能抓到缺失实现。
- 单项 Cocos 场景模型测试通过。
- 共享麻将测试通过：4 个测试文件、31 个测试通过。
- 类型检查通过。
- 文档同步通过。
- `git diff --check` 通过。

## 遗留问题

- 本任务不生成 Cocos Creator `.scene`、`.prefab`、`.meta` 或最终资源。
- 下一步需要在 Cocos Creator 中创建实际 `HulebuGameScene`，并把模型绑定到真实节点。
- 正式动画、音效、资源加载、点击入槽动画和奖励弹层仍需后续任务实现。
