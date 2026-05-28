# T077 胡了卜 Cocos 随机堆叠牌山恢复完成记录

- 任务编号：T077
- 负责人：Codex / 开发 B
- 完成日期：2026-05-27
- 状态：待验收

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/BoardLayerBinder.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T077-hulebu-cocos-random-stacked-mountain.md`
- `docs/tasks/claims/T077-codex.md`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-05-27.md`

## 实现内容

- 将 Cocos 默认 20 关从 T076 临时 6 张流程关恢复为确定性随机堆叠牌山。
- 首关从 42 张起步，后续递增到 60 张，支持 9-16 个随机列、4-6 层同列堆叠、字牌权重和重点牌包。
- 同列牌完全覆盖，下层牌通过顶部横条提示层数，不再错位露出整张牌。
- 遮挡阈值继续使用 5%，并保留通关提示、下一关、奖励节点三选一和 20 关通关流程。
- 新增回归测试，防止 Cocos 默认首关再次退化为 6 张流程关。

## 验证命令

```bash
npm run test -w packages/shared -- mahjong-cocos-project
npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json
npm run docs:sync
git diff --check
```

## 验证结果

- `npm run test -w packages/shared -- mahjong-cocos-project`：通过，1 个测试文件、10 个测试。
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`：通过。
- Cocos Web Preview 手机视口目检：通过，刷新预览后首屏显示多列随机堆叠牌山和顶部横条层数提示。

## 遗留问题

- 随机牌山当前只恢复密度、堆叠和基础难度，还没有完整可解路径搜索。
- 奖励效果、Boss 目标进度、关卡 HUD 动态进度、槽位同款图片、最终 Tile prefab、动画音效和发布包仍待后续任务。
