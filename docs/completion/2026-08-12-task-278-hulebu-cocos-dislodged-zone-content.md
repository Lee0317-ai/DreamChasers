# T278：胡了卜 Cocos 震落牌区空内容修复完成记录

- 任务编号：T278
- 负责人：Lee
- 完成时间：2026-08-12
- 状态：已完成

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/BoardLayerBinder.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- `docs/tasks/items/T278-hulebu-cocos-dislodged-zone-content.md`
- `docs/tasks/claims/T278-lee.md`

## 实现内容

- 保留运行时震落牌的数量、坐标、组合规则和模型高优先级 `zIndex`。
- 将震落牌从原牌山复用池拆入独立 `LooseTilePool`，避免刷新时与原牌山节点索引混用。
- 将震落牌节点的本地渲染 Z 收束为 `1..N`，避免 `1000+` 深度被 2D 相机裁掉；点击排序仍使用原模型 `zIndex`。
- 明确把独立震落牌池绘制在半透明震落面板之上。

## 验证命令

- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`
- `npm exec -w packages/shared vitest -- run mahjong-cocos-project --reporter=json --outputFile=.codex-tmp/t278-vitest.json`
- `npm run game:hulebu:build`
- `npm run game:hulebu:verify-build`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- Cocos TypeScript 检查通过。
- `mahjong-cocos-project` 41 项测试全部通过。
- exact-commit production build 通过，构建 ID：`9409ee1cc5ff-20260811T204619Z`，资源 smoke check 全部返回 200。
- verify-only 通过。
- 在 `4173` 当前“四张与杠”教学局真实触发一次杠：面板显示“震落牌区 2”并出现两张真实牌；点击其中一张后面板变为 1、余牌减少 1、牌进入主槽。
- UTF-8 无 BOM 与 `git diff --check` 通过。

## 遗留问题

- 无。震落牌数量、组合规则、点击判定、关卡、计分和存档协议均未修改。
