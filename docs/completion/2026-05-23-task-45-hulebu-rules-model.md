# T045 完成记录：胡了卜命名落档和规则模型第一版

- 任务编号：T045
- 任务名称：胡了卜命名落档和规则模型第一版
- 负责人：Codex / 开发 B
- 完成时间：2026-05-23

## 修改文件

- `packages/shared/package.json`
- `packages/shared/tsconfig.json`
- `packages/shared/src/index.ts`
- `packages/shared/src/mahjong-game.ts`
- `packages/shared/src/mahjong-game.test.ts`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/DECISIONS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/modules/mahjong-roguelike/PLAYABLE_VALIDATION_PROTOTYPE.html`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T045-hulebu-rules-model.md`
- `docs/tasks/claims/T045-codex.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`
- `docs/progress/2026-05-23.md`

## 实现内容

- 将游戏显示名落档为 `胡了卜`，模块 slug 暂时保持 `mahjong-roguelike`。
- 建立 `packages/shared` 共享规则包。
- 新增引擎无关的 `mahjong-game` 规则模型，覆盖牌、花色、槽位、候选组合、余牌、遮挡点击、奖励效果等基础概念。
- 新增规则测试，覆盖吃、碰、杠、非法组合、满槽前组合检测、执行组合结算、余牌统计、遮挡可点击判断和基础 Roguelike 奖励。
- 更新模块交接说明，明确后续 Cocos/GDevelop/Web 接入应复用共享规则模型和配置概念。

## 验证命令

- `npm run test -w packages/shared -- mahjong`
- `npm run typecheck -w packages/shared`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- `npm run test -w packages/shared -- mahjong`：通过，1 个测试文件、9 个测试通过。
- `npm run typecheck -w packages/shared`：通过。
- `npm run docs:sync`：通过。
- `git diff --check`：通过。

## 遗留问题

- 尚未创建 Cocos/GDevelop 正式工程。
- 尚未把站内入口 `apps/web/src/components/portal-data.ts` 的展示名改为 `胡了卜`，因为该文件当前属于 T015 的活跃范围；建议后续 Web 接入任务统一处理。
- 下一步建议把 T044 的 5 个验证场景沉淀为 `apps/game/mahjong-roguelike/config` 下的牌、关卡和奖励配置草案。
