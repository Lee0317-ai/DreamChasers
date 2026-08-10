# T260：胡了卜 Cocos 锁牌暗态与顶部 HUD 精修

- 优先级：P0
- 负责人：Lee
- 状态：已完成
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

## 完成结果

- `BoardLayerBinder` 改为先建立完整牌节点列表，再用与点击命中相同的高层覆盖判定计算 `selectable`；被遮挡牌的牌体、Sprite 色调和透明度统一进入锁定暗态。
- Sprite 异步加载请求键加入 `active / locked` 状态，旧回调不会再把已锁定牌恢复成亮色。
- 分数牌匾使用独立动态数值层遮盖贴图内旧数值，三位数 `106` 在 Cocos 竖屏预览中清楚可读。
- 紧凑记牌器移动到顶部 HUD 功能带，以动态余牌总数替换贴图内旧数值；原展开详情数据和面板逻辑保留。
- Cocos `390×844` 实测：点击暗色下层牌后槽位和余牌数不变；点击亮牌后牌进入手牌且余牌从 `23` 变为 `22`。
- 共享测试 `40/40`、Cocos TypeScript、精确提交 production build 和 verify-only 均通过；build ID 为 `9f423dd1fb0c-20260810T160923Z`，5 个 smoke 路径均为 `200`。
