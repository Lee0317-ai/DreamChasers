# T231 领取记录

- 任务编号：T231
- 任务名称：胡了卜 Cocos UI 素材补齐接入
- 负责人：Lee
- 领取时间：2026-06-30
- 状态：已完成
- 完成时间：2026-06-30
- 文件范围：
  - `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/v6/**`
  - `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
  - `packages/shared/src/mahjong-cocos-project.test.ts`
  - 本任务相关文档分片
- 验证命令：
  - `npm run test -w packages/shared -- mahjong-cocos-project`
  - `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
  - `git diff --check -- apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts packages/shared/src/mahjong-cocos-project.test.ts apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/v6`
