# T263：胡了卜 Cocos 牌背点击穿透修复

- 优先级：P0
- 负责人：Lee
- 状态：进行中
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
