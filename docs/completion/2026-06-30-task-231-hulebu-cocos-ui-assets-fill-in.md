# 任务完成记录：T231 胡了卜 Cocos UI 素材补齐接入

- 任务编号：T231
- 负责人：Lee
- 完成日期：2026-06-30

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/v6/**`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T231-hulebu-cocos-ui-assets-fill-in.md`
- `docs/tasks/claims/T231-lee.md`
- `docs/tasks/NEXT_ID.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- 补齐 Cocos `ui/v6/cards`、`ui/v6/panels`、`ui/v6/combo-choice` 资源和对应 `.meta`。
- `GameSceneController` 新增顶部牌匾、奖励卡和弹层底板 Sprite 映射。
- 奖励选择卡、流程弹层和顶部牌匾优先使用真实 UI 图片，保留程序化 fallback。
- 顶部 HUD 收敛到视觉壳大牌匾，避免 `HudBinder` 小 badge 与视觉壳重复叠放。
- 共享测试覆盖新增资源尺寸和运行时接入路径。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `git diff --check -- apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts packages/shared/src/mahjong-cocos-project.test.ts apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/v6`

## 验证结果

- 全部通过。

## 遗留问题

- 目标概念图中的完整环境背景仍未接入，因为当前资源包尚缺可直接运行时使用的整屏独立背景切片。
