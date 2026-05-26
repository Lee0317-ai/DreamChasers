# 胡了卜

**模块 slug**：`mahjong-roguelike`  
**显示名称**：`胡了卜`
**当前状态**：框架规划、玩法评审稿、MVP 验证计划、后续构建拆分、最小可玩验证原型、规则模型、验证配置、20 关内容骨架、配置加载验证、配置驱动试玩原型、密集牌山生成器原型、Boss 目标配置化、Boss 牌型目标、Boss 目标反馈、字牌基础支持、固定 8 格主槽和 `胡` 牌型基础支持、胡牌节奏配置和密集牌山胡牌包、随机牌山调参面板第一版、Cocos/GDevelop 正式表现层桥接第一版、Cocos 场景骨架第一版、Cocos Creator 3.8.8 工程壳、Cocos 首屏自动渲染、Cocos 手机竖屏首屏适配、Cocos 真实可见尺寸自适应、Cocos 首条点击可玩链路已完成
**对应任务**：T017, T020, T029-T066

## 1. 模块定位

`胡了卜` 是游戏站第一阶段核心小游戏，用“羊了个羊”式堆叠消除作为基础交互，用麻将的 `碰 / 吃 / 杠 / 清一色 / 胡牌目标` 提供规则记忆点，再用 Roguelike 奖励提高复玩价值。

核心目标：

- 提升游戏站停留时长和回访。
- 做出比普通三消更有辨识度的麻将消除体验。
- 第一版验证玩法节奏、关卡难度和奖励构筑，不追求完整麻将规则。

## 2. 第一版范围

包含：

- `万 / 条 / 筒` 三类数牌，以及 `东 / 南 / 西 / 北 / 中 / 发 / 白` 字牌。
- 点击可选牌进入槽位。
- 主槽固定为 8 格，不再通过奖励扩到 9 格或更多。
- 系统检测 `碰 / 吃 / 杠 / 胡` 候选，玩家手动点击按钮后消除。
- `胡` 的第一版定义为主槽 8 张可拆成 `3 + 3 + 2`，即两个 3 张组合加一个对子；备用槽不参与判定。
- 槽位满失败，清空牌面过关；清空牌面后即使槽位仍有孤张也算过关。
- 每过一关从 3 个随机奖励里选择 1 个。
- 20 个关卡配置。
- 20 个 Roguelike 奖励配置。
- Web 站内试玩入口占位或原型嵌入。
- 正式小游戏工程规则文档。

不包含：

- 完整麻将听牌算法。
- 复杂番型结算。
- 多人游戏。
- 排行榜。
- 复杂养成。
- 真钱激励。

## 3. 技术路线

推荐路线：

1. 先把规则、关卡、奖励抽成共享配置和 TypeScript 规则模型。
2. 用 GDevelop 或轻量 Web 原型快速验证“堆叠点击 + 槽位消除 + 奖励选择”的手感。
3. 用 Cocos Creator 做正式小游戏工程主线，面向微信小游戏和抖音小游戏发布。
4. Next.js 游戏站只负责详情页、站内试玩 iframe、埋点和入口，不承载核心游戏逻辑。

当前已完成第一版共享规则模型：`packages/shared/src/mahjong-game.ts`，用于承接 HTML demo 的核心吃碰杠、槽位、余牌和奖励规则。

当前已完成 MVP 内容配置草案：`apps/game/mahjong-roguelike/config/`，用于承接 20 个关卡骨架、基础牌定义和 10 个局内奖励草案。

当前已完成配置加载验证：`packages/shared/src/mahjong-config.test.ts` 会读取真实 JSON 配置，校验关卡、奖励、初始状态、可点击牌、余牌统计和组合候选样本。

当前已完成配置驱动试玩原型：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`，用于本地 HTTP 服务下试玩 10 关配置。

当前已完成密集牌山生成器原型：同一试玩页可切换 `密集牌山` 模式，基于当前关卡组合素材生成更多牌、多层坐标和自动遮挡关系，用于验证接近“羊了个羊”式牌山的密度与解锁节奏。

当前已完成 Boss 目标配置化第一版：第 10 关通过 `bossGoals` 配置 `吃 1 / 碰 1 / 杠 1 / 三门齐 / 积分 80`，试玩页会展示多目标进度，并要求清空牌山时全部目标完成。

当前已完成 Boss 目标反馈第一版：目标栏会以标签展示完成态，组合推进后短暂高亮对应目标；清空牌山但目标未完成时，会明确提示缺哪些目标。

当前已完成字牌基础支持第一版：共享规则模型、配置牌库和配置试玩页都支持 `东 / 南 / 西 / 北 / 中 / 发 / 白`；字牌可参与 `碰 / 杠`，不会参与 `吃`。

当前已完成固定 8 格主槽和 `胡` 基础支持：共享规则模型、配置默认值和配置试玩页都使用 8 格主槽；旧扩槽效果会被限制在 8 格以内；`胡` 可一次消除符合 `3 + 3 + 2` 的 8 张主槽牌。

当前已完成胡牌节奏配置第一版：关卡可通过 `featuredCombos` 标记重点组合，第 6 关和第 10 关已标记 `胡`；配置试玩页会展示“本关重点”，密集牌山模式会优先生成一个可手动消除的 `3 + 3 + 2` 胡牌包。

当前已完成 20 关主线骨架第一版：第 3/6/9/13/16/19 关作为奖励节点，第 10/20 关作为 Boss 节点；第 20 关 Boss 已加入 `吃 / 碰 / 杠 / 胡 / 四类牌型 / 积分` 复合目标。

当前已完成随机牌山调参面板第一版：配置试玩页的密集牌山模式支持通过 URL 和侧栏面板调整随机种子、目标牌量、同列堆叠深度、`胡` 包数量和字牌权重，用于后续试玩调难度。

当前已完成 Cocos/GDevelop 正式表现层桥接第一版：`packages/shared/src/mahjong-presentation.ts` 会把共享规则状态转换为引擎无关快照，包含牌山可点/遮挡状态、8 格主槽、备用槽、`胡 / 杠 / 碰 / 吃` 按钮、余牌和 HUD；`apps/game/mahjong-roguelike/docs/formal-presentation-bridge.md` 说明 Cocos/GDevelop 如何消费这份快照。

当前已完成 Cocos 场景骨架第一版：`packages/shared/src/mahjong-cocos-scene.ts` 会把通用快照转换为 Cocos 友好的节点、控件和 HUD 模型；`apps/game/mahjong-roguelike/cocos/` 已补充场景节点结构、脚本边界和绑定清单。

当前已完成 Cocos Creator 3.8.8 工程壳：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/` 基于 Creator 自带 `empty-2d` 模板结构，包含可在 Cocos Dashboard 中添加/打开的项目壳、首场景脚本边界和配置导入占位。

当前已完成 Cocos 首屏自动渲染：`GameSceneController` 可默认加载本地测试 scene model，Board/Slot/Combo/HUD Binder 可自动创建占位牌、8 格槽、组合按钮和 HUD 文案，用于 Creator 播放验证。

当前已完成 Cocos 手机竖屏首屏适配：工程设计分辨率为 390x844，首屏占位牌山、8 格主槽、组合按钮和 HUD 已按手机竖屏基准重排。

当前已完成 Cocos 真实可见尺寸自适应：首屏布局会读取运行时 canvas CSS 尺寸、Cocos 可见尺寸和 DPR，统一缩放牌山、8 格主槽、组合按钮和 HUD；iPhone 预览中 HUD 位于顶部、牌山居中、底部槽位可读。

当前已完成 Cocos 首条点击可玩链路：测试首屏中可点击牌可以进入 8 格主槽，HUD 和组合按钮会刷新；满足 `胡 / 杠 / 碰 / 吃` 候选后可以点击按钮执行基础消除。

详细方案见 `FRAMEWORK_PLAN.md`。

## 4. 文档索引

- `FRAMEWORK_PLAN.md`：框架调研和技术规划。
- `GAMEPLAY_PLAN.md`：手动组合、槽位成长、货币、奖励和道具体系。
- `GAMEPLAY_REVIEW_PLAN.md`：团队评审用玩法方案 Markdown 版。
- `GAMEPLAY_REVIEW.html`：团队评审用可视化 HTML 版。
- `MVP_VALIDATION_PLAN.md`：MVP 玩法验证计划 Markdown 版。
- `MVP_VALIDATION_PLAN.html`：MVP 玩法验证计划可视化 HTML 版。
- `MVP_BUILD_PLAN.md`：最小可玩闭环和 MVP 开发拆分计划 Markdown 版。
- `MVP_BUILD_PLAN.html`：最小可玩闭环和 MVP 开发拆分计划可视化 HTML 版。
- `PLAYABLE_VALIDATION_PROTOTYPE.html`：最小可玩验证原型，可直接通过本地 HTTP 服务打开试玩。
- `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`：配置驱动试玩原型，直接读取 10 关配置和奖励配置。
- `apps/game/mahjong-roguelike/docs/tile-mountain-generator.md`：密集牌山生成器原型说明。
- `apps/game/mahjong-roguelike/docs/formal-presentation-bridge.md`：Cocos/GDevelop 正式表现层桥接说明。
- `apps/game/mahjong-roguelike/cocos/README.md`：Cocos 场景骨架说明。
- `apps/game/mahjong-roguelike/cocos/scene-binding.md`：Cocos 节点和资源 key 绑定清单。
- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/README.md`：Cocos Creator 3.8.8 工程壳打开说明。
- `IMPLEMENTATION_PLAN.md`：后续实现阶段计划。
- `PROGRESS.md`：模块进展。
- `DECISIONS.md`：模块决策。
- `HANDOFF.md`：交接说明。

## 5. 下一步重点

- 继续用调参面板试玩第 13/16/19 奖励节点和第 20 关 Boss，确认牌量、字牌权重、同列堆叠和 `胡` 包数量。
- 若继续正式工程，下一步应接真实配置和共享规则状态，让 Cocos 场景消费 `createMahjongPresentationSnapshot` / `createMahjongCocosSceneModel`，不再只依赖本地测试 scene model。
- 真实状态接入后再做遮挡解锁、胜负流程、奖励三选一和最终图片 prefab 替换。
- GDevelop 侧继续作为快速协作通道，只映射 snapshot 对象变量，不重新实现规则判定。
