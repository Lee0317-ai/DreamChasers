# T263：胡了卜 Cocos 牌背点击穿透修复

- 优先级：P0
- 负责人：Lee
- 状态：已完成
- 依赖：T262
- 阻塞：无
- 允许修改文件：`BoardLayerBinder.ts`、`packages/shared/src/mahjong-cocos-project.test.ts`、T263 分片、麻将模块文档、当天进展/完成记录及 `npm run docs:sync` 自动生成主文档
- 禁止修改文件：牌山生成、关卡配置、HUD、存档协议、Web Demo、横屏、微信小游戏 SDK、其他模块

## 目标

- 点击任何不可点击牌背都必须 no-op，不能穿透选择同一位置附近的可点击正面牌。
- 直接点击可点击正面牌仍按现有规则入槽。

## 验收

- 命中顺序先找光标下视觉层级最高的实际牌，再判断它是否可点；命中锁牌时消费点击但不触发 `tileClickHandler`。
- 共享测试、Cocos TypeScript、精确提交 production build、verify-only、Chrome `390×844` 点击验证、`docs:sync`、UTF-8 无 BOM 和 `git diff --check` 通过。

## 完成结果

- `selectTileAtUiPoint()` 先按实际 sibling 绘制顺序找到光标下最上层的真实牌，再判断该牌是否可点。
- 命中不可点击牌背时返回“已消费”但不调用 `tileClickHandler`，BoardRoot 与 canvas 输入不会继续穿透选择其他正面牌。
- 精确提交 `05237d301ceb7a0d6b27cd9d9021dacbf398f1dd` 构建成功，build ID 为 `05237d301ceb-20260811T044247Z`。
- Chrome `390×844` 实测：正面牌点击后余牌 `14 -> 13`；同坐标露出牌背后再次点击，余牌保持 `13`，其他正面牌不移动。
