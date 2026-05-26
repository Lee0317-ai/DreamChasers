# T069：胡了卜 Cocos 首条点击可玩链路完成记录

- 任务编号：T069
- 负责人：Codex / 开发 B
- 完成时间：2026-05-26
- 状态：待验收

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/BoardLayerBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/ComboBarBinder.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T069-hulebu-cocos-playable-click-chain.md`
- `docs/tasks/claims/T069-codex.md`
- `docs/progress/2026-05-26.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`

## 实现内容

- 为 `BoardLayerBinder` 增加测试牌触摸回调，可点击牌会回传 `tileId`。
- 为 `ComboBarBinder` 增加组合按钮触摸回调，候选满足时可执行对应组合。
- 在 `GameSceneController` 中加入测试用 8 格主槽状态，支持点击入槽、刷新 HUD、刷新组合按钮和基础消除。
- 支持测试首屏的 `胡 / 杠 / 碰 / 吃` 候选检测，其中 `胡` 使用 8 张 `3 + 3 + 2` 判定。

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
- `docs:sync` 通过，同步 35 个任务分片和 35 个领取分片。
- `git diff --check` 通过。
- 已在 Chrome 的 Cocos Web Preview 手机视口确认：点击 `1万` 后进入第 1 个卡槽；点击 `7条 / 8条 / 9条` 后 `吃 1` 亮起；点击 `吃` 后三张条子从卡槽消除。

## 遗留问题

- 当前仍是本地测试 scene model，不读取真实 20 关配置。
- 点击后尚未接共享规则模型的遮挡解锁重算、胜负流程、奖励三选一和 Boss 目标进度。
- 仍使用程序化绘制占位牌，没有绑定最终 Sprite prefab。
