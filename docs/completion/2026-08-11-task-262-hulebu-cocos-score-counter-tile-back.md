# T262：胡了卜 Cocos 分数、记牌器与锁牌牌背精修完成记录

- 任务编号：T262
- 负责人：Lee
- 完成日期：2026-08-11

## 修改文件

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/BoardLayerBinder.ts`
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuTileSpriteCatalog.ts`
- `packages/shared/src/mahjong-cocos-project.test.ts`
- T262 任务、领取、模块进展、交接和当天进展文档

## 实现内容

- 移除分数动态数字后的额外浅色矩形底块。
- 将紧凑记牌器收敛为纯“记牌器”入口，展开后显示全部 34 种牌面及对应剩余数，并支持收起。
- 将不可点击牌切换为正式绿色牌背，可点击牌保持真实牌面。
- 记牌器入口和浮层统一置于工具顶层，并补充 Cocos 全局触摸/鼠标坐标兜底。

## 验证命令

- `npm run test -w packages/shared -- mahjong-cocos-project`
- `npx tsc -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.domain.json`
- `npm run game:hulebu:build`
- `npm run game:hulebu:build -- --verify-only`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- 共享测试 `40/40` 通过，Cocos TypeScript 通过。
- 精确提交 `11b6581eb2e2baed13ea81182fc4b06077128843` production 构建成功，build ID 为 `11b6581eb2e2-20260811T035723Z`。
- build 与 verify-only 的 5 个 smoke 路径均返回 `200`。
- Chrome `390×844` production 实测分数区域、锁牌牌背、记牌器展开和收起均正确；展开面板完整显示 34 种牌面和剩余数。

## 遗留问题

- 无。本任务不包含横屏适配、玩法规则、点击判定、存档协议或微信小游戏 SDK。
