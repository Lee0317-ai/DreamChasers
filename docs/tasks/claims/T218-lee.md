# T218 领取记录

- 任务编号：T218
- 任务名称：胡了卜 Cocos 局外生涯总览基础
- 负责人：Lee
- 领取时间：2026-06-29
- 状态：已完成

## 文件范围

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/**`
- `docs/modules/mahjong-roguelike/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-218-hulebu-cocos-career-overview-foundation.md`

## 禁止范围

- 不修改 Web `/games/hulebu` 试玩页或静态 Demo。
- 不接账号同步、完整成就系统或完整图鉴分类卡面。
- 不改变现有 run mode、奖励、事件和 Boss 规则口径。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 完成结果

- 已完成 Cocos 局外生涯总览基础：大厅新增 `生涯` 入口，总览弹层可集中查看本地铜钱、成长等级、最近一轮和长期进度。
- 共享静态测试与 Cocos TypeScript 编译已通过。
