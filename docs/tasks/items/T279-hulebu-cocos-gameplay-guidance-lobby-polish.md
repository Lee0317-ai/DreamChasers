# T279 胡了卜 Cocos 局内引导与大厅视觉修正

- 负责人：Lee
- 状态：已完成
- 开始日期：2026-08-12
- 需求来源：用户反馈新手提示遮挡牌面、误入槽位的牌无法理解如何处理、牌河入口不清晰，以及大厅入口图被拉伸导致视觉质量差。
- 允许修改：
  - `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
  - `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/SlotLayerBinder.ts`
  - `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/MeldRiverLayerBinder.ts`
  - `packages/shared/src/mahjong-cocos-project.test.ts`
  - `docs/tasks/**`
  - `docs/modules/mahjong-roguelike/**`
  - `docs/progress/2026-08-12-lee.md`
  - `docs/completion/**`
- 禁止修改：关卡和奖励 JSON、Web 原型与站内静态 Demo、其他模块、已有未提交 UI 资产。
- 实现目标：
  1. 新手提示移出牌山交互区，避免遮挡牌面。
  2. 牌河空槽和容量始终可见，明确“打牌后选择槽内牌”的交互流程。
  3. 打牌选择态高亮可处理的槽位，让误入槽位的牌能够被明确移入牌河。
  4. 大厅入口按正方形资源比例展示，形成清晰的 2×2 功能布局。
- 验证命令：
  - `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
  - `npm exec -w packages/shared vitest -- run mahjong-cocos-project`
  - exact-commit Cocos production 构建与 `npm run game:hulebu:verify-build`
  - 浏览器桌面与竖屏操作检查
  - `git diff --check`
