# T262：胡了卜 Cocos 分数、记牌器与锁牌牌背精修

- 优先级：P0
- 负责人：Lee
- 状态：已完成
- 依赖：T261
- 阻塞：无
- 允许修改文件：`GameSceneController.ts`、`BoardLayerBinder.ts`、必要的正式资源目录映射、`packages/shared/src/mahjong-cocos-project.test.ts`、T262 分片、麻将模块文档、当天进展/完成记录及 `npm run docs:sync` 自动生成主文档
- 禁止修改文件：玩法规则、关卡配置、点击判定、存档协议、Web 试玩版、横屏、微信小游戏 SDK、其他模块

## 目标

- 分数牌匾保留正式底图、标题和动态数字，移除数字后方额外浅色矩形底块。
- 记牌器紧凑态只显示“记牌器”并保持可点击；展开态按万、条、筒、字展示全部 34 种正式牌面和对应剩余数字。
- 牌山中不可点击的牌显示 formal v1 正式牌背；恢复可点击后重新显示真实牌面。

## 验收

- Cocos `390×844` 预览中三项视觉符合截图反馈，紧凑记牌器点击可展开和收起。
- 锁牌显示牌背且点击无效；顶层可点击牌显示真实牌面并可入槽。
- `npm run test -w packages/shared -- mahjong-cocos-project`、Cocos TypeScript、精确提交 production build 和 verify-only 通过。
- `npm run docs:sync`、UTF-8 无 BOM 与 `git diff --check` 通过。

## 完成结果

- 分数牌匾移除了动态数字后的浅色矩形，数字直接叠加在正式分数底图上。
- 记牌器紧凑态只显示“记牌器”；入口和展开面板统一位于 `ToolOverlayRoot` 顶层，并使用 Cocos 全局触摸/鼠标坐标兜底。展开面板按万、条、筒、字显示全部 34 种正式牌面及剩余数，可点击收起。
- 所有不可点击牌改用 formal v1 `back-default` 牌背；可点击牌继续显示真实牌面，点击规则未修改。
- 精确提交 `11b6581eb2e2baed13ea81182fc4b06077128843` 构建成功，build ID 为 `11b6581eb2e2-20260811T035723Z`；production 和 verify-only 的 5 个 smoke 路径均返回 `200`。
