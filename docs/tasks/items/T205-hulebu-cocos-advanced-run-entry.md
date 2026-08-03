# T205：胡了卜 Cocos 高阶周目入口基础

- 任务编号：T205
- 负责人：Lee
- 状态：已完成
- 创建日期：2026-06-29
- 模块：`docs/modules/mahjong-roguelike/`
- 对应变更：IDEA-20260629-01

## 背景

T203/T204 已让 Cocos 正式工程具备局外大厅、主线、无尽、每日和局外成长入口。Web 完整版已确认长期结构包含高阶周目，且高阶第一版按东风场、南风场、西风场、北风场四档展开。Cocos 迁移继续推进时，需要先把高阶入口和四档 run profile 接到 Cocos 大厅。

## 范围

允许修改：

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/modules/mahjong-roguelike/**`
- `docs/tasks/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-205-hulebu-cocos-advanced-run-entry.md`

禁止修改：

- Web 试玩页、站内静态 Demo、Prisma、账号进度相关文件。
- 非胡了卜 Cocos 模块。
- 既有未提交任务产生的无关文件。

## 实现内容

- Cocos 配置层新增四档高阶 run profile：东风场、南风场、西风场、北风场。
- Cocos 大厅新增 `高阶` 入口。
- 高阶入口打开四档选择面板。
- 选择任一高阶档后进入本局流派选择，再启动对应高阶 run。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 完成记录

- Cocos 配置层新增 `advanced` run mode、`HulebuAdvancedRunTier` 和四档高阶 profile。
- Cocos 大厅新增 `高阶` 入口。
- 高阶入口会打开东风场、南风场、西风场、北风场四档选择面板。
- 选择风场后复用现有本局流派选择流程，再进入对应高阶 run。
- 已补 `mahjong-cocos-project` 测试断言，锁定四档 profile、入口按钮和启动链路。

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
