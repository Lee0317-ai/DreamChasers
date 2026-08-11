# T263：胡了卜 Cocos 牌背点击穿透修复完成记录

- 任务编号：T263
- 负责人：Lee
- 完成日期：2026-08-11

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/BoardLayerBinder.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- T263 任务、领取、模块进展、交接和当天进展文档

## 实现内容

- 牌山命中候选不再预先过滤锁牌。
- 先按 sibling 绘制顺序和 `zIndex` 兜底选出视觉最上层的实际牌，再判断是否可点。
- 命中牌背时消费输入但不触发选牌，阻断 BoardRoot 和 canvas 穿透。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.domain.json`
- `npm run game:hulebu:build`
- `npm run game:hulebu:build -- --verify-only`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- 共享测试 `40/40` 和 Cocos TypeScript 通过。
- 精确提交 `05237d301ceb7a0d6b27cd9d9021dacbf398f1dd` production 构建成功，build ID 为 `05237d301ceb-20260811T044247Z`。
- build 和 verify-only 的 5 个 smoke 路径均返回 `200`。
- Chrome `390×844` 实测正面牌点击后余牌 `14 -> 13`；同坐标牌背再次点击后余牌保持 `13`，其他正面牌不移动。

## 遗留问题

- 无。本任务不修改牌山生成、关卡、HUD、存档、横屏或微信小游戏 SDK。
