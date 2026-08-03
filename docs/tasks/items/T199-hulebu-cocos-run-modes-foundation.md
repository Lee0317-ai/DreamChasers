# T199：胡了卜 Cocos 长期模式入口基础

- 任务编号：T199
- 负责人：Lee
- 状态：已完成
- 创建日期：2026-06-28
- 模块：`docs/modules/mahjong-roguelike/`

## 背景

胡了卜 Cocos 已接入主线 20 关、v6 视觉、牌河、补杠、震落、工具、Boss、奖励和关前事件。Web 版已经具备无尽、每日、高阶和局外成长。下一步需要先把 Cocos 从固定 20 关主线推进到可承接长期模式的运行入口基础。

## 范围

允许修改：

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/modules/mahjong-roguelike/**`
- `docs/tasks/**`
- `docs/progress/2026-06-28-lee.md`
- `docs/completion/2026-06-28-task-199-hulebu-cocos-run-modes-foundation.md`

禁止修改：

- Web 试玩页、站内静态 Demo、Prisma、账号进度相关文件。
- 非胡了卜 Cocos 模块。

## 实现内容

- 已新增 Cocos run mode 类型与关卡选择 helper。
- Controller 已新增主线、无尽、每日 run profile 方法。
- 主线仍按 20 关结束；无尽从第 21 层开始循环第 11-20 关配置；每日按 seed 稳定轮换配置。
- 通关/事件流程已区分展示层数和实际配置索引，为后续无尽/每日专属奖励、Boss 和局外入口铺路。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- 已通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 已通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- 已通过：`npm run docs:sync`
- 已通过：`git diff --check`
