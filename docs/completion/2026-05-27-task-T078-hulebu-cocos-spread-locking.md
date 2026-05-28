# T078 胡了卜 Cocos 牌山铺开和遮挡点击一致性完成记录

- 任务编号：T078
- 负责人：Codex / 开发 B
- 完成日期：2026-05-27
- 状态：待验收

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T078-hulebu-cocos-spread-locking.md`
- `docs/tasks/claims/T078-codex.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-05-27.md`

## 实现内容

- 将 Cocos 随机牌山列布局从紧凑网格改为横向 68、纵向 88 的铺开布局，首关配置跨度扩大到约 `300x186`。
- 修正 `applyStackBlockers`，任意更高层牌覆盖低层牌超过 5% 时都会写入 `blockedBy`。
- 同列所有上层牌都会阻挡同列下层牌，保证完全覆盖堆叠不会提前露出可点状态。
- `HulebuRuntimeState` 做测试环境可直接加载的轻量解耦，便于运行时状态回归测试。
- 新增回归测试，覆盖 20 关 blocker 完整性，以及被盖住牌不可入槽、移走 blocker 后恢复可选。

## 验证命令

```bash
npm run test -w packages/shared -- mahjong-cocos-project
npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json
npm run docs:sync
git diff --check
```

## 验证结果

- `npm run test -w packages/shared -- mahjong-cocos-project`：通过，1 个测试文件、11 个测试。
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`：通过。
- Cocos 配置抽样：20 关高层遮挡漏判数为 0，首关 42 张牌、横向跨度 300、纵向跨度 186。
- Cocos Web Preview 手机视口目检：通过，预览包已重新编译到新间距和新 blocker 规则，顶层牌可入槽，被同列覆盖的下层牌连点不入槽。

## 遗留问题

- 本任务只修正 Cocos 随机牌山布局和遮挡点击一致性。
- 奖励效果、Boss 目标进度、槽位同款图片、最终 Tile prefab、完整可解路径搜索、动画音效和发布包仍待后续任务。
