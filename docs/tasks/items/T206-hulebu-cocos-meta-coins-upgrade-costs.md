# T206：胡了卜 Cocos 局外铜钱和升级成本闭环

- 任务编号：T206
- 负责人：Lee
- 状态：已完成
- 创建日期：2026-06-29
- 模块：`docs/modules/mahjong-roguelike/`
- 对应变更：IDEA-20260629-02

## 背景

T204 已让 Cocos 大厅可操作六轴局外成长，但升级仍是免费调试式加点。Web 完整版已经具备局外铜钱、升级成本和持久成长的产品口径。Cocos 迁移继续推进时，需要先补一个不依赖账号的本地钱包和升级成本闭环，让正式工程具备“通关获得铜钱 -> 回大厅升级 -> 下一局生效”的基础循环。

## 范围

允许修改：

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/modules/mahjong-roguelike/**`
- `docs/tasks/**`
- `docs/progress/2026-06-29-lee.md`
- `docs/completion/2026-06-29-task-206-hulebu-cocos-meta-coins-upgrade-costs.md`

禁止修改：

- Web 试玩页、站内静态 Demo、Prisma、账号进度相关文件。
- 非胡了卜 Cocos 模块。
- 既有未提交任务产生的无关文件。

## 实现内容

- Cocos Controller 持有本地局外铜钱。
- 通关后回大厅前发放局外铜钱。
- 升级面板展示当前铜钱、每项等级和下一档价格。
- 点击升级会校验价格并扣除铜钱。
- 六轴升级具备上限，满级后不可继续升级。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm run docs:sync`
- `git diff --check`

## 完成记录

- Cocos Controller 新增本地局外铜钱状态，默认提供预览用初始铜钱。
- 通关回大厅前会发放局外铜钱。
- 局外成长面板会显示当前铜钱、每项等级和下一档价格。
- 点击升级会校验价格、扣除铜钱并更新成长等级。
- 六轴成长具备价格表和上限，满级后显示满级并阻止继续扣费。
- 已补 `mahjong-cocos-project` 测试断言，锁定钱包、价格、扣费、满级和通关发铜钱关键代码。

## 验证结果

- 通过：`npm run test -w packages/shared -- mahjong-cocos-project`
- 通过：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
