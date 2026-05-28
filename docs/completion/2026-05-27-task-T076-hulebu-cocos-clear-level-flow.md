# T076：胡了卜 Cocos 通关提示和下一关流转

- 任务编号：T076
- 负责人：Codex / 开发 B
- 完成日期：2026-05-27
- 状态：待验收

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/BoardLayerBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/ComboBarBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/tasks/items/T076-hulebu-cocos-clear-level-flow.md`
- `docs/tasks/claims/T076-codex.md`
- `docs/progress/2026-05-27.md`

## 实现内容

- 新增 20 关轻量流程配置和关卡索引读取方法，作为 Cocos runtime 的最小通关链路数据。
- `GameSceneController` 新增 `playing / cleared / reward` 状态、当前关卡索引、通关 overlay、奖励 overlay、下一关入口和本轮通关提示。
- 牌山清空后即进入通关状态，不要求卡槽清空。
- 第 3/6/9/13/16/19 关在点击继续后进入奖励三选一，选择奖励后进入下一关。
- 第 20 关后显示本轮通关，可从第 1 关再来。
- 顶部关卡牌匾会按关卡序号显示 `1-1` 到 `2-10`。
- 牌、组合按钮和 overlay 按钮均绑定 `TOUCH_END` 与 `Button.EventType.CLICK`，兼容浏览器鼠标点击和移动端触摸。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`
- Cocos Web Preview 手机视口手动检查

## 验证结果

- 已通过 `npm run test -w packages/shared -- mahjong-cocos-project`，1 个测试文件、9 个测试通过。
- 已通过 Cocos 工程 TypeScript 检查。
- 已通过 Cocos Web Preview 手机视口目检：真实第 1 关点击上层 `9筒` 三张并发动 `碰` 后，下层 `2万` 解锁；继续消除后出现“第 1 关通关”弹窗。

## 遗留问题

- 奖励选择当前只推进流程，尚未真正应用奖励效果。
- Boss 目标进度尚未接入 Cocos runtime。
- 20 关配置是轻量流程验证版，不是最终平衡。
- 通关和奖励 overlay 是程序化临时 UI，后续需要替换为最终美术和动画。
