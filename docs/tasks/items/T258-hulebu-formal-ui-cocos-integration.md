# T258：胡了卜正式 UI Batch D Cocos 接入

- 优先级：P0
- 负责人：Lee
- 状态：已完成
- 依赖：T248、T251、T252、T257
- 阻塞：无
- 允许修改文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/formal-v1/**`、Cocos UI SpriteFrame 目录映射与 Binder、`packages/shared/src/mahjong-cocos-project.test.ts`、T248/T258 任务分片、麻将模块文档、当天进展/完成记录及 `npm run docs:sync` 自动生成主文档
- 禁止修改范围：玩法规则、M2 App Flow 与存档协议、Web 试玩版、横屏适配、微信小游戏 SDK、PDF 工具箱、AI 修图和其他游戏模块
- 验证方式：正式资源清单与 Cocos 文件/元数据逐项核对；`npm run test -w packages/shared -- mahjong-cocos-project`；`npx tsc -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.domain.json`；精确提交 `npm run game:hulebu:build`；`390×844` 浏览器视觉与控制台检查；`npm run docs:sync`；UTF-8 无 BOM；`git diff --check`

## 目标

把已通过审阅的 `hulebu-formal-ui-v1` 资源包完整接入 Cocos Creator 3.8.8 正式工程，使运行时背景、HUD、牌槽、动作按钮、工具按钮、卡片、弹层和麻将牌全部切换到正式视觉资源。

## 实现方式

- 在 Cocos `assets/resources/ui/formal-v1/` 建立与正式资源包一致的稳定目录和 SpriteFrame 路径。
- 为导入目录和图片生成可由 Cocos Creator 3.8.8 识别的 UTF-8 无 BOM `.meta` 文件。
- 将牌面 catalog、背景、HUD、槽位、动作按钮、工具按钮、奖励卡与通用弹层的运行时映射统一切换到 formal v1。
- 保留现有程序化 Label、点击区域和资源加载失败 fallback，不把整张预览图作为交互层。
- 增加静态测试，校验 80 个正式资源 key、35 张牌、SpriteFrame 路径和运行时不再引用旧 v6 正式表现资源。

## 不做

- 不改玩法、关卡、数值、存档或账号协议。
- 不做横屏或微信小游戏 SDK 接入。
- 不重做已通过审阅的图片资源。

## 完成结果

- Cocos `assets/resources/ui/formal-v1/` 已包含 manifest 对应的 80 项 PNG 和 Creator 3.8.8 自动生成的权威 `.meta`。
- `HulebuFormalUiCatalog` 集中维护正式背景、HUD、牌槽、动作/工具按钮、卡片、弹层和麻将牌 SpriteFrame 路径。
- 局内背景、顶部牌匾、工具列、动作栏、手槽、奖励卡、通用弹层和 34 张正面牌已切换到 formal v1；牌面只在正式资源加载失败时回退 v6。
- 共享 `mahjong-cocos-project` 40 项测试和 Cocos TypeScript 通过。
- 精确提交 `1eb7f00e2b2e0fa764096c73b38235c82113fbb1` production build 通过，build ID 为 `1eb7f00e2b2e-20260809T164755Z`，5 个 smoke 路径均为 200。
- `390×844` 内置浏览器实测画布为 `390×844` CSS / `780×1688` 像素，控制台无 warning/error；点击顶层牌后余牌从 24 减为 23，牌正常进入手槽。
