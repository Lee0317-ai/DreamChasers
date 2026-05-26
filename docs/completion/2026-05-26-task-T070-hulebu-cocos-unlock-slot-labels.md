# T070：胡了卜 Cocos 点击后遮挡解锁和槽位牌名显示完成记录

- 任务编号：T070
- 负责人：Codex / 开发 B
- 完成时间：2026-05-26
- 状态：待验收

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/SlotLayerBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources.meta`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T070-hulebu-cocos-unlock-slot-labels.md`
- `docs/tasks/claims/T070-codex.md`
- `docs/progress/2026-05-26.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`

## 实现内容

- 在 `GameSceneController` 中新增点击后剩余牌遮挡重算，超过 5% 面积被更高层剩余牌遮挡时保持不可点。
- 点击移走上层牌后，下层牌会重新计算可点态，解除遮挡的牌会变亮并可点击。
- 在 `SlotLayerBinder` 中为槽位稳定创建直接子级 `Label`，入槽牌会显示当前牌名。
- 修正 Cocos `resources.meta` 的 Asset Bundle 配置，避免 Web Preview 查询 settings 数据时报错。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run test -w packages/shared -- mahjong`
- `npm run typecheck -w packages/shared`
- `npm run docs:sync`
- `git diff --check`
- Cocos Web Preview 手机视口手动点击检查

## 验证结果

- `mahjong-cocos-project` 测试通过。
- Cocos 工程脚本类型检查通过。
- `mahjong` 共享回归测试通过，5 个测试文件、36 个测试通过。
- `packages/shared` 类型检查通过。
- `docs:sync` 通过，同步 36 个任务分片和 36 个领取分片。
- `git diff --check` 通过。
- Cocos Web Preview 手机视口手动检查通过：`7条 / 8条 / 9条` 入槽显示牌名，执行 `吃` 后中层 `西` 重新解锁并可继续入槽。

## 遗留问题

- 当前仍是本地测试 scene model，不读取真实 20 关配置。
- 仍使用程序化绘制占位牌，尚未绑定最终 Sprite prefab。
- 后续需要继续接清空牌山通关、奖励三选一和 Boss 目标进度。
