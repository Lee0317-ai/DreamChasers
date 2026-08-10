# T260 胡了卜 Cocos 锁牌暗态与顶部 HUD 精修

- 优先级：P0
- 负责人：Lee
- 状态：进行中
- 依赖：T259
- 阻塞：无
- 允许修改文件：Cocos `BoardLayerBinder.ts`、顶部 HUD/记牌器相关 `GameSceneController.ts` 与必要布局 helper、对应共享回归测试、T260 分片、麻将模块文档、当天进展/完成记录及 `npm run docs:sync` 自动生成主文档
- 禁止修改文件：玩法规则、关卡配置、正式图片原文件、Web 试玩版、横屏、微信小游戏 SDK、其他工具与游戏模块

## 目标

- 被遮挡且不可点击的下层牌必须稳定显示为明显暗色，不因子节点 Sprite 或加载顺序恢复亮色。
- 分数牌匾使用独立标题和数值排版，三位数及更长数值保持清楚、不重叠。
- 紧凑记牌器只展示可读的总数入口，展开详情逻辑保持不变。

## 验收

- Cocos `390×844` 预览中，下层锁牌明显暗于可点击牌，点击锁牌不会进入槽位。
- 分数为三位数时标题和值不重叠；记牌器紧凑态不再显示挤压的四门长串。
- `npm run test -w packages/shared -- mahjong-cocos-project` 通过。
- Cocos TypeScript、精确提交 production build、浏览器截图与控制台检查通过。
- `npm run docs:sync`、UTF-8 无 BOM 和 `git diff --check` 通过。
