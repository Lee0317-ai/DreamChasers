# T279 胡了卜 Cocos 局内引导与大厅视觉修正

- 任务编号：T279
- 负责人：Lee
- 完成日期：2026-08-12

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/SlotLayerBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/MeldRiverLayerBinder.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- T279 任务分片与领取分片

## 实现内容

1. 新手提示改为左上窄条，并启用缩小与自动换行，不再遮挡中央牌山；进入打牌选择态时明确提示“点击槽内牌移入牌河”。
2. 槽位只有在 `playing.discardChoosing` 阶段可点击，目标牌使用金色描边和浅金底色，避免牌背或普通槽位误触。
3. 牌河始终显示固定空槽，并显示 `已用/容量` 和操作说明；打牌选择态下说明切换为“请选择槽内一张牌”。
4. 局外大厅继续使用正式场景背景，四个正方形入口按原比例以 2×2 排列，底部保留独立的新手重玩入口。

## 验证命令

- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm exec -w packages/shared vitest -- run mahjong-cocos-project`
- `npm run game:hulebu:build`
- `npm run game:hulebu:verify-build`
- `git diff --check`
- 浏览器竖屏实测：提示不覆盖牌山，牌河空槽和 `0/3` 说明可见。

## 验证结果

- TypeScript 通过。
- `mahjong-cocos-project`：42 项测试通过。
- exact-commit production 构建通过，构建 ID：`16e7d03c6bd0-20260812T004225Z`。
- Cocos Creator 3.8.8 typecheck 通过，构建 smoke endpoint 全部 HTTP 200。

## 遗留问题

- 当前浏览器已有本地存档，无法在同一页直接复现首次进入大厅的空存档状态；大厅布局由代码尺寸约束和静态回归测试锁定，下一轮可在清空本地存档后继续做视觉验收。
