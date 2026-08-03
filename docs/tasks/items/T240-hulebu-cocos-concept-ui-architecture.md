# T240：胡了卜 Cocos 概念图 UI 架构落地

- 优先级：P1
- 默认负责人：Lee
- 状态：进行中
- 依赖：T239（逐层收拢牌山结构修正）、T231（Cocos UI 资产补齐）
- 主要文件范围：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/GameSceneController.ts`, `BoardLayerBinder.ts`, `HudBinder.ts`, `SlotLayerBinder.ts`, `ComboBarBinder.ts`, `MeldRiverLayerBinder.ts`, `contracts/HulebuSceneModel.ts`, `bootstrap/HulebuSampleSceneModel.ts`, `runtime/HulebuRuntimeState.ts`, `config/HulebuLevelConfig.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/COCOS_UI_ARCHITECTURE.md`, `docs/tasks/items/T240-hulebu-cocos-concept-ui-architecture.md`, `docs/tasks/claims/T240-lee.md`, `docs/progress/2026-07-01-lee.md`, `docs/progress/2026-07-02-lee.md`, `docs/progress/2026-07-04-lee.md`
- 禁止修改范围：`apps/web/**`, Prisma/账号系统、PDF 工具箱、AI 修图工具、非胡了卜 Cocos 模块；除非另开任务，不修改玩法规则和经济数值。
- 验证方式：`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong-cocos-project`; Cocos Web Mobile 非 debug 构建截图检查；`git diff --check`。

## 背景

Lee 提供的参考图目标不是“再设计一套全新 UI”，而是把概念图里的空间秩序写进 Cocos：顶部负责名称、关卡和退出/重开/暂停；底部负责组合动作与手牌槽；中间牌桌占满剩余空间；记牌器悬浮在牌堆左上；洗牌/撤回/打牌悬浮在牌堆右侧居中；通关提示、三选一卡片和奖励提示在画面中心弹出。

当前 Cocos 功能链路已经基本完成，但表现层仍像工程态 HUD：信息和按钮是平铺到 Canvas 上的，缺少概念图里的牌桌透视、牌山层级、桌面挂件和中心弹层秩序。

## 目标

- 建立 Cocos 正式 UI 的五层结构：顶部秩序层、牌桌主体层、牌桌挂件层、底部操作层、中心弹层层。
- 让 `table-shell` 等价区域在 Cocos 中占满顶部与底部之间的剩余空间。
- 让记牌器成为牌桌挂件，锚定牌堆左上，而不是普通 HUD 文本。
- 让三个工具按钮成为牌桌挂件，锚定牌堆右侧中线。
- 让牌山表现支持底层/中层/顶层不同视觉权重：底层暗、中层正常、上层三张更大、更亮、更重阴影。
- 让通关、奖励三选一、事件提示等 overlay 统一走画面中心弹层。

## 不做

- 不生成最终商业级美术资源。
- 不新增玩法规则、奖励、经济或账号字段。
- 不改 Web 版试玩壳。
- 不把 T239 的牌山生成器结构修正混进本任务；T240 只消费它输出的层级语义。

## 验收标准

- Cocos 局内首屏能呈现：顶部名称/关卡/退出操作、中间牌桌占满剩余空间、左上记牌器、右侧工具按钮、底部组合栏与手牌槽。
- 牌山至少能区分低/中/顶层视觉权重，顶层三张明显压住下层牌。
- 中心弹层可复用到通关和奖励三选一，不挤占牌桌布局。
- 390x844 手机竖屏截图中元素不互相遮挡、不出界。
- `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json` 通过。
- `npm run test -w packages/shared -- mahjong-cocos-project` 通过；若失败在 T239 牌山初始可点数量，需先收口 T239 或在任务交接中明确 blocker。

## 参考草图

- `apps/game/mahjong-roguelike/sketches/004-concept-layered/index.html`
- `apps/game/mahjong-roguelike/sketches/004-concept-layered/README.md`

## 2026-07-02 遗留收口

- 修复被压牌仍可点击：`BoardLayerBinder` 对不可交互牌启用 `BlockInputEvents`，并在 `GameSceneController.handleTileClick()` 入口用最新 scene model 再次拒绝被锁牌。
- 收紧首关初始可点牌：Cocos 首关初始可点数锁定到 5-6 张；后续关卡保留原有逐步扩张口径。
- 修正 `enforceCocosInitialFreeMaximum()` 的边界方向：不再把目标牌自身抬层偏移，而是优先选择不承担压牌职责的自由牌，直接盖到目标牌同坐标上一层。
- 验证通过：`npm run test -w packages/shared -- mahjong-cocos-project`；`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`。

## 2026-07-04 接手补齐

- 记牌器从普通 HUD 文本升级为结构化 `tileCounter` 数据：runtime 输出四门总数和每张牌剩余数，Sample Scene 与备用刷新路径同步补齐。
- `GameSceneController` 已让 `CounterPlaque` 支持点击展开，展开态渲染 `CounterExpandedPanel` 浮层，面板内展示四门小牌面和计数，并加 `BlockInputEvents` 避免点击漏到底层牌堆；再次点击浮层会收起。
- 首关曾显式使用 `ring` graph 模板，保持 30 张牌和 5-6 张初始可点；该口径已在 2026-07-05 根据 demo 参考图改为 `long-wall` 横向压叠牌山。
- 验证通过：`npm run test -w packages/shared -- mahjong-cocos-project`；`npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`。

## 2026-07-04 运行时验收补充

- 被压牌点击防线最终改为 BoardRoot 统一手动 hit-test：BoardRoot 加全屏 `UITransform`，统一接 `TOUCH_END`，用当前 model 的屏幕矩形和更高层覆盖率判定命中，避免 Cocos 3.8.8 `Button.enabled` 或单牌触摸链路失效。
- Playwright 手机视口实测首关为 30 张牌、6 张可点、24 张灰化；点击一张可点牌后主槽从 0 变 1、余牌从 30 变 29；直接调用灰化被压牌 `handleTileClick()` 后主槽保持 1。
- 展开记牌器实测 `CounterExpandedPanel` 挂在 `ToolOverlayRoot`，`ToolOverlayRoot` siblingIndex 9、`BoardRoot` siblingIndex 2，面板浮在牌山上方且右侧工具按钮仍可见。
- Cocos Web Mobile 非 debug 构建通过，CLI 返回既有成功码 36，日志显示 `build Task (web-mobile) Finished`。

## 2026-07-05 点击命中口径修正

- 已修正运行时点击错位：`UITransform.getBoundingBoxToWorld()` 在当前 web-mobile 构建里不能代表 `EventTouch.getUILocation()` 的触摸坐标，使用它会让视觉牌和入槽牌错位。
- `BoardLayerBinder` 的命中矩形改为 `getTileEventRect()`，直接按 model position 和 runtime layout 换算事件坐标；这条口径与牌山统一触摸入口、顶层优先命中和最新 `0.001` 覆盖拒绝逻辑一起使用。
- Playwright 手机视口已复测 3 张可点牌，入槽 `tileId / prefabKey` 与点击目标一致；灰化被压牌入口保持不可入槽。

## 2026-07-05 demo 横向压叠观感修正

- 根据 Lee 的 demo 参考图，首关不再使用分散 `ring` 牌山，改为 `long-wall` 横向压叠牌山；画面从 6 个孤立塔收敛为一条横向牌山。
- 顶层牌保持亮色和可点击，下层露出的牌改为灰色 tint + 低透明度，只表达厚度和遮挡，不作为可选入口。
- 系统 Chrome 手机视口截图 `.codex-tmp/hulebu-long-wall-final.png` 已验证：横向牌山、顶层亮牌、下层灰牌、右侧工具和底部槽位不遮挡。
