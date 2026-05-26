# 胡了卜实施计划

**状态**：规则模型、验证配置、20 关内容骨架、配置加载验证、配置驱动试玩原型、密集牌山生成器原型、Boss 目标配置化、Boss 牌型目标、Boss 目标反馈、字牌基础支持、固定 8 格主槽和 `胡` 牌型基础支持、胡牌节奏配置和密集牌山胡牌包、随机牌山调参面板第一版、Cocos/GDevelop 正式表现层桥接第一版、Cocos 场景骨架第一版、Cocos Creator 3.8.8 工程壳、Cocos 首屏自动渲染、Cocos 手机竖屏首屏适配、Cocos 真实可见尺寸自适应、Cocos 首条点击可玩链路已完成，待做真实配置状态接入、遮挡解锁、奖励和最终资源绑定
**关联任务**：T017, T020, T043, T045, T046, T047, T048, T049, T050, T052, T053, T054, T055, T056, T057, T058, T059, T060, T061, T062, T063, T065, T066

## 1. 前置条件

- 已完成 T029 框架规划。
- 已确认第一版玩法参数。
- 已完成 `MVP_VALIDATION_PLAN.md` 和 `MVP_BUILD_PLAN.md`。
- 已完成最小可玩验证原型。
- 已完成 `packages/shared/src/mahjong-game.ts` 第一版规则模型和测试。
- 已完成 `apps/game/mahjong-roguelike/config/` 第一版验证配置草案。
- 已完成 `apps/game/mahjong-roguelike/config/` MVP 20 关骨架和 10 奖励草案。
- 已完成 `packages/shared/src/mahjong-config.test.ts` 配置加载验证。
- 已完成 `apps/game/mahjong-roguelike/prototypes/config-playable/index.html` 配置驱动试玩原型。
- 已完成配置试玩页的 `密集牌山` 生成模式，用于验证更高牌量、多层遮挡和解锁节奏。
- 已完成第 10 关 Boss 目标配置化，试玩页支持组合次数、花色集合和积分目标。
- 已完成 Boss 目标反馈第一版，试玩页支持目标完成态、推进高亮和未完成目标提示。
- 已完成字牌基础支持第一版，`东 / 南 / 西 / 北 / 中 / 发 / 白` 已进入共享规则模型、配置牌库和密集牌山原型。
- 已完成固定 8 格主槽和 `胡` 基础支持第一版：主槽不再扩到 9 格或更多，`胡` 按 `3 + 3 + 2` 消除 8 张主槽牌，备用槽不参与判定。
- 已完成胡牌节奏配置第一版：关卡可通过 `featuredCombos` 标记重点组合，第 6/10 关会突出 `胡`，密集牌山模式会优先生成一个 8 张胡牌包。
- 已完成 20 关节奏骨架第一版：第 3/6/9/13/16/19 关为奖励节点，第 10/20 关为 Boss 节点，第 20 关包含 `胡` 复合目标。
- 已完成随机牌山调参面板第一版：密集牌山模式支持 URL 和侧栏面板调随机种子、牌量、同列堆叠深度、`胡` 包数量和字牌权重。
- 已完成 Cocos/GDevelop 正式表现层桥接第一版：共享包新增 `createMahjongPresentationSnapshot`，用于输出牌山、槽位、备用槽、组合按钮、余牌和 HUD 快照。
- 已完成 Cocos 场景骨架第一版：共享包新增 `createMahjongCocosSceneModel`，并补充 `apps/game/mahjong-roguelike/cocos/` 场景结构、脚本边界和绑定清单。
- 已完成 Cocos Creator 3.8.8 工程壳：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/` 可在 Cocos Dashboard 中添加/打开，并包含首场景脚本边界和配置导入占位。
- 已完成 Cocos 首屏自动渲染：工程可通过本地测试 scene model 自动绘制占位牌山、8 格主槽、组合按钮和 HUD，便于 Creator 播放验证。
- 已完成 Cocos 手机竖屏首屏适配：工程设计分辨率为 390x844，首屏占位 UI 改为移动优先布局。
- 已完成 Cocos 真实可见尺寸自适应：首屏占位 UI 不再依赖固定 390x844 常量，而是按运行时 canvas CSS 尺寸、Cocos 可见尺寸和 DPR 统一缩放。
- 已完成 Cocos 首条点击可玩链路：测试首屏可点击牌进入 8 格主槽，组合按钮按候选刷新，并可执行基础 `胡 / 杠 / 碰 / 吃` 消除。
- 已确认原型优先路线：GDevelop 原型或 Cocos 直做。
- 已确认 Cocos Creator 版本。

如果后续直接进入 Cocos/GDevelop，必须先复用共享规则模型、配置概念和表现层快照契约，不要把 HTML demo 的临时 DOM 状态逻辑直接复制进表现层。

## 2. 阶段 1：规则模型和测试

目标：

- 在 `packages/shared` 中建立引擎无关规则模型。

状态：

- 已由 T045 完成第一版。

范围：

- `mahjong-game.ts`
- `mahjong-game.test.ts`

至少覆盖：

- 三张相同牌可以 `碰`。
- 同花色连续三张可以 `吃`。
- 四张相同牌可以 `杠`。
- 非法组合不能消除。
- Roguelike 奖励能修改槽位或倍率。

验证：

```bash
npm run test -w packages/shared -- mahjong
```

## 3. 阶段 2：配置文件

目标：

- 建立关卡、奖励、牌定义 JSON。

状态：

- T046 已把 T044 的 5 个验证场景沉淀为配置草案。
- T047 已扩展到 10 关 MVP 内容，并补充路线型奖励。
- T048 已补充配置加载验证，真实读取 `levels.json` 和 `rewards.json`，确认配置能被共享规则模型承接。
- T049 已补充配置驱动试玩原型，验证 10 关配置可以渲染、点击、入槽、手动组合并触发奖励选择。
- T050 已补充密集牌山生成模式，验证受控组合包可以自动生成更多牌、多层坐标和遮挡解锁关系。
- T052 已补充 Boss 目标配置化，验证第 10 关可以使用多目标试炼并由密集牌山生成器保证目标包可完成。
- T053 已补充 `suit_set` 牌型目标，验证第 10 关可以要求 `万 / 筒 / 条` 三门各完成 1 次组合。
- T054 已补充 Boss 目标反馈，验证第 10 关目标栏能显示完成态、推进高亮和未完成原因。
- T055 已补充字牌基础支持，验证字牌可碰可杠、不参与吃，并进入配置牌库和密集牌山生成器。
- T056 已补充固定 8 格主槽和 `胡` 基础支持，验证主槽默认 8 格、旧扩槽奖励不超过 8 格、`3 + 3 + 2` 可胡、备用槽不参与胡牌。
- T057 已补充 `featuredCombos` 重点组合字段和密集牌山胡牌包，验证第 6/10 关能有意识地安排 `胡` 节奏。
- T058 已补充 20 关主线骨架和第二 Boss，验证奖励节点、Boss 节点和第 20 关复合目标能被配置测试保护。
- T059 已补充随机牌山调参面板，验证 URL 和面板参数可以驱动密集牌山生成器。
- T060 已补充正式表现层快照契约，验证 Cocos/GDevelop 可以从共享状态读取可渲染牌山、槽位、按钮和 HUD。
- T061 已补充 Cocos 友好的场景视图模型和场景骨架文档，验证正式 Cocos 层可以从 snapshot 获得节点、控件和 HUD 绑定数据。
- T062 已补充 Cocos Creator 3.8.8 工程壳，验证工程结构、脚本边界和打开说明。
- T063 已补充 Cocos 首屏自动渲染，验证测试 scene model 和 Binder 自动建节点能力。
- T065 已补充 Cocos 手机竖屏首屏适配，验证 iPhone 预览首屏可读。
- T066 已补充 Cocos 真实可见尺寸自适应，解决 Cocos Web Preview 中 CSS 尺寸和物理像素尺寸不一致导致的首屏偏小问题。
- 下一步应优先接真实配置和共享规则状态，再补遮挡解锁、奖励选择、胜负流程和最终图片 prefab 绑定。

范围：

- `apps/game/mahjong-roguelike/config/tiles.json`
- `apps/game/mahjong-roguelike/config/levels.json`
- `apps/game/mahjong-roguelike/config/rewards.json`

第一批：

- 已完成 5 个验证关卡。
- 已完成 15 个 MVP 主线关卡骨架，凑齐第一版 20 关。
- 已完成 10 个奖励草案。
- 已完成配置加载测试，覆盖数量、引用、初始状态、可点击牌、余牌统计、组合候选样本和奖励 effect 应用。
- 已完成静态试玩页，覆盖桌面和移动端基础检查。

## 3.1 阶段 2.5：配置驱动表现层原型

目标：

- 用真实配置渲染一个可操作页面，确认表现层接入方式。

状态：

- 已由 T049 完成第一版。

范围：

- `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`

已覆盖：

- 读取 `levels.json` 和 `rewards.json`。
- 20 关切换。
- 可点击牌、遮挡解锁、槽位、候选组合、手动 `吃 / 碰 / 杠`。
- 固定 8 格主槽和手动 `胡`，其中 `胡` 仅检查主槽 8 张 `3 + 3 + 2`，不把备用槽算作第 9 格。
- 余牌、分数、铜钱、工具和奖励选择。
- `配置关卡 / 密集牌山` 模式切换。
- 密集牌山模式自动生成 50 张左右的牌、多层坐标和 `blockedBy` 遮挡关系；带 `featuredCombos: ["hu"]` 的关卡会优先生成一个可胡的 8 张组合包。
- 支持 `?level=20&mode=mountain` 这类调试深链接，便于直接打开指定关卡和模式做验收。
- 密集牌山模式支持调参参数：`seed`、`tiles`、`stack`、`hu`、`honor`，并在侧栏提供开发用调参面板。
- Boss 关支持 `bossGoals` 多目标展示和过关校验，当前覆盖组合次数、花色集合和积分阈值，并有基础完成态反馈。
- 第 20 关 Boss 目标已支持 `胡` 次数、字牌参与和更高积分目标。
- 字牌支持 `东 / 南 / 西 / 北 / 中 / 发 / 白`，会显示在牌面和余牌统计中，可作为同张组合素材参与 `碰 / 杠`。
- 桌面端和 390px 移动端基础检查。

限制：

- 当前仍是 HTML 原型页，不是最终 Cocos/GDevelop 牌山工程。
- 密集牌山生成器只做受控组合包和几何遮挡，不做完整可解路径搜索。
- 要更接近最终体验，还需要正式动画、音效、手感、关卡编辑和美术资源。

## 4. 阶段 3：原型验证

二选一：

- GDevelop：快速做 HTML5 原型，用于手感和关卡节奏验证。
- Cocos：直接进入正式工程，但需要更多工程投入。

建议：

- 若重点是快速讨论玩法，先 GDevelop。
- 若玩法已经定得很清楚，直接 Cocos。

## 4.1 阶段 3.5：正式表现层桥接

目标：

- 在不创建完整编辑器工程的前提下，把共享规则状态转换为 Cocos/GDevelop 都能消费的表现层数据。

状态：

- 已由 T060 完成第一版。

范围：

- `packages/shared/src/mahjong-presentation.ts`
- `packages/shared/src/mahjong-presentation.test.ts`
- `apps/game/mahjong-roguelike/docs/formal-presentation-bridge.md`

已覆盖：

- 牌山渲染项：牌面、花色、点数、层级、坐标提示、遮挡状态、可点击状态和遮挡来源。
- 主槽：固定 8 格，空格也作为 cell 输出。
- 备用槽：按容量输出，明确不参与 `胡`。
- 组合按钮：固定顺序 `胡 / 杠 / 碰 / 吃`，输出可用态、候选数量和首个候选 key。
- HUD：牌山剩余、槽位状态、积分、铜钱、护符、首败保护和工具数量。
- Cocos 场景建议：`GameScene / BoardLayer / TileNode / SlotLayer / ReserveLayer / HudLayer / ComboBar / RewardOverlay`。
- GDevelop 映射建议：用对象变量承接 tile id、label、suit、rank、layer、available、blocked、sourcePackage 和 stackDepth。

## 5. 阶段 4：Cocos 正式工程

目标：

- 实现可发布的小游戏工程主线。

核心模块：

- 牌堆渲染。
- 可点击牌判断。
- 槽位系统。
- 组合消除。
- 奖励选择。
- run 状态。
- 关卡加载。
- Web 导出。

## 5.1 阶段 4.1：Cocos 场景骨架

目标：

- 在进入 Cocos Creator 编辑器前，先建立可测试的场景视图模型和节点绑定清单。

状态：

- 已由 T061 完成第一版。

范围：

- `packages/shared/src/mahjong-cocos-scene.ts`
- `packages/shared/src/mahjong-cocos-scene.test.ts`
- `apps/game/mahjong-roguelike/cocos/**`

已覆盖：

- `boardNodes`：牌节点名、tile id、牌面、坐标、zIndex、可点态、暗化态、prefab key、来源包和堆叠深度。
- `slotNodes`：8 个主槽节点，包含占用态和 prefab key。
- `reserveNodes`：备用槽节点，继续只作为救场展示。
- `comboControls`：`Combo_Hu / Combo_Gang / Combo_Peng / Combo_Chi` 的可点态、候选角标和候选 key。
- `hud`：余牌、槽位状态、分数、铜钱和工具文字。
- `cocos/README.md`：推荐节点树和脚本分工。
- `cocos/scene-binding.md`：prefab key 和节点绑定清单。

## 5.2 阶段 4.2：Cocos Creator 3.8.8 工程壳

目标：

- 在用户已安装 Cocos Creator 3.8.8 后，创建正式工程目录，让编辑器可以接手真实场景和资源。

状态：

- 已由 T062 完成第一版。

范围：

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/**`
- `packages/shared/src/mahjong-cocos-project.test.ts`

已覆盖：

- 确认本机编辑器路径：`/Applications/Cocos/Creator/3.8.8/CocosCreator.app`。
- 参考 Creator 3.8.8 自带 `empty-2d` 模板创建项目壳。
- 补充 `GameSceneController`、`BoardLayerBinder`、`SlotLayerBinder`、`ComboBarBinder`、`HudBinder` 和本地 scene model DTO。
- 补充 `assets/scenes/README.md` 和 `assets/resources/config/README.md`，说明真实场景创建和配置导入边界。
- 用 `mahjong-cocos-project.test.ts` 校验工程壳关键文件，避免误删。

限制：

- `.scene`、`.prefab`、`.meta` 等复杂资源仍建议由 Cocos Creator 编辑器生成和维护。
- 当前 Binder 只是首版脚本边界，不包含最终节点池、动画、音效、资源加载和点击入槽完整链路。

## 5.3 阶段 4.3：Cocos 首屏自动渲染

目标：

- 在用户已创建 `HulebuGameScene.scene` 和节点结构后，让场景点击播放即可看到一版占位首屏。

状态：

- 已由 T063 完成第一版。

范围：

- `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/**`
- `packages/shared/src/mahjong-cocos-project.test.ts`

已覆盖：

- 本地测试 scene model：`HulebuSampleSceneModel`。
- `GameSceneController.start()` 默认加载测试 scene model，并在需要时补 `Canvas` 和 `UITransform`。
- `BoardLayerBinder` 自动创建占位牌节点，绘制牌面和可点/暗化状态。
- `SlotLayerBinder` 自动绘制 8 格主槽。
- `ComboBarBinder` 自动绘制 `胡 / 杠 / 碰 / 吃` 按钮。
- `HudBinder` 按节点名自动查找或创建 Label。

限制：

- 仍是占位首屏，不接最终青瓷牌面资源。
- 还没有真实关卡状态、点击入槽、组合结算、奖励选择、动画或音效。

## 5.4 阶段 4.4：Cocos 手机竖屏首屏适配

目标：

- 把首屏占位 UI 从桌面横屏基准切到手机竖屏基准。

状态：

- 已由 T065 完成第一版。

范围：

- `settings/v2/packages/project.json`
- `assets/scripts/bootstrap/HulebuSampleSceneModel.ts`
- `assets/scripts/BoardLayerBinder.ts`
- `assets/scripts/SlotLayerBinder.ts`
- `assets/scripts/ComboBarBinder.ts`
- `assets/scripts/HudBinder.ts`

已覆盖：

- 项目设计分辨率：390x844。
- 测试牌山居中偏上，牌面尺寸缩到手机可读。
- 8 格主槽底部居中。
- `胡 / 杠 / 碰 / 吃` 按钮靠近底部安全区。
- HUD 压缩到顶部。

限制：

- 这只是首屏占位布局，不等于完整移动适配系统。
- 真正接入 50 张以上密集牌山时，需要继续做牌山缩放、相机/Canvas 适配和真机触控测试。

## 5.5 阶段 4.5：麻将 UI 图片资源归档

目标：

- 把已生成的胡了卜麻将图片整理到 Cocos 工程资源目录，方便后续 prefab 和图集接入。

状态：

- 已由 T068 完成第一版。

范围：

- `assets/resources/ui/mahjong-tiles/**`
- `apps/game/mahjong-roguelike/cocos/scene-binding.md`

已覆盖：

- 27 张数牌单图：万、条、筒各 1-9。
- 7 张字牌单图：东、南、西、北、中、发、白。
- 参考图和中间稿分类归档。
- `manifest.json` 记录来源、分类、尺寸和 `tileKey`。

限制：

- 当前只是资源归档，不接运行时代码。
- 暂不手写 PNG 的 Cocos texture meta；打开 Cocos Creator 后由编辑器生成权威 `.png.meta`。

## 6. 阶段 5：Web 游戏站接入

目标：

- 在游戏站可以访问、试玩、记录基础事件。

范围：

- `apps/web/src/modules/games/mahjong-roguelike/**`
- `apps/web/src/app/games/mahjong-roguelike/**`
- 内容索引或种子数据。

验证：

```bash
npm run build -w apps/web
```

还需要桌面端和移动端检查。

## 7. 暂不实施

- 多人。
- 排行榜。
- 账号成长。
- 支付系统。
- 复杂番型。
- 完整麻将算法。
