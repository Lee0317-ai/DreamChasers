# T219 完成记录

- 任务编号：T219
- 任务名称：胡了卜 Cocos 成就图鉴最小版基础
- 负责人：Lee
- 完成日期：2026-06-29

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T219-hulebu-cocos-achievement-codex-foundation.md`
- `docs/tasks/claims/T219-lee.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- 新增 `HULEBU_ACHIEVEMENTS_STORAGE_KEY`、首批 8 项成就配置和本地成就读写 helper。
- 主线通关、无尽推进、每日参与/完成、局外升级和高阶推进现在会解锁对应本地成就。
- `生涯` 面板新增图鉴总览、下一项目标和首批图鉴摘要，让 Cocos 局外层具备最小成就/图鉴阅读能力。
- 共享静态测试补充对成就快照、helper、生涯图鉴摘要和相关文案的回归断言。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 通过：`npm run docs:sync`
- 通过：`git diff --check`

## 遗留问题

- 当前只接首批 8 项成就，不含完整分类卡、隐藏目标第二版和账号同步。
- 图鉴仍挂在 `生涯` 面板内，尚未拆成独立完整图鉴页。
