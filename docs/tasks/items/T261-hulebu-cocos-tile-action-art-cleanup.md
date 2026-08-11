# T261：胡了卜 Cocos 八条、牌体底层与动作按钮底色修复

- 优先级：P0
- 负责人：Lee
- 状态：进行中
- 依赖：T260
- 阻塞：无
- 允许修改文件：formal v1 八条源/运行时资源及必要元数据、`HulebuTileSpriteCatalog`、`BoardLayerBinder.ts`、`ComboBarBinder.ts`、对应共享测试、T261 分片、麻将模块文档、当天进展/完成记录及 `npm run docs:sync` 自动生成主文档
- 禁止修改文件：玩法规则、关卡配置、存档协议、其他麻将牌资源、Web 试玩版、横屏、微信小游戏 SDK、其他模块

## 目标

- 八条显示为清楚的标准 `2×4` 八个竹节，不使用错误连笔或错误数量图。
- 正式整牌 PNG 显示时不再叠加程序化牌体，麻将底部只保留资源自身的一层绿色底座。
- 吃、碰、杠、补杠、胡按钮只显示正式状态图，不再透出额外程序化底色；不可用与可用状态仍清晰可辨。

## 验收

- Cocos `390×844` 预览中八条图案、麻将底部和动作按钮底色均正确。
- 正式资源加载失败时仍保留最小程序化 fallback，不影响可玩性。
- `npm run test -w packages/shared -- mahjong-cocos-project`、Cocos TypeScript、精确提交 production build 和 verify-only 通过。
- `npm run docs:sync`、UTF-8 无 BOM 与 `git diff --check` 通过。
