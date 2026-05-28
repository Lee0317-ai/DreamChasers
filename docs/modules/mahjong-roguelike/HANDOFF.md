# 胡了卜交接

## 当前状态

- 框架规划完成。
- 模块文档目录已建立。
- 游戏显示名已确定为 `胡了卜`，模块 slug 仍保持 `mahjong-roguelike`。
- 已实现第一版共享规则模型：`packages/shared/src/mahjong-game.ts`。
- 已新增第一版验证配置：`apps/game/mahjong-roguelike/config/`。
- 已扩展 MVP 内容草案：20 关骨架和 10 个局内奖励。
- 已创建 Cocos Creator 3.8.8 工程壳：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/`，可在 Cocos Dashboard 中添加/打开；尚未创建完整可玩 Cocos 场景或 GDevelop 工程。
- 已完成完整牌局规则、经济体力和失败救场口径：手动组合、组合候选、局内积分、铜钱、体力、满槽救场和孤张内部判定已写入 `GAMEPLAY_PLAN.md`。
- 已完成 MVP 玩法验证计划：下一步应先制作最小可玩闭环，验证核心体验，再冻结正式开发范围。
- 已完成最小可玩闭环和 MVP 开发拆分计划：下一步建议新增 T044 做 3-5 个验证场景，验证通过后再回到 T017 正式开发。
- 已完成最小可玩验证原型：`PLAYABLE_VALIDATION_PROTOTYPE.html` 可通过本地 HTTP 服务打开试玩，后续应先组织团队评审再决定是否进入 T017。
- 已完成 T045：命名落档和 `packages/shared` 规则模型第一版，测试覆盖吃、碰、杠、非法组合、满槽前组合检测、余牌、遮挡点击和基础奖励。
- 已完成 T046：把 5 个验证场景、基础牌定义和 8 个局内奖励沉淀为引擎无关 JSON 配置。
- 已完成 T047：把配置扩展为 10 关和 10 个局内奖励草案，并新增内容曲线说明。
- 已完成 T048：新增配置加载验证，确认真实关卡和奖励 JSON 能被共享规则模型读取、实例化和基础校验。
- 已完成 T049：新增配置驱动试玩原型，直接读取 10 关配置并跑通表现层基础操作。
- 已确认 T049 原型不是最终“羊了个羊”式牌山表现，后续需要单独做牌山生成器和更高牌量堆叠。
- 已完成 T050：在配置试玩页新增 `密集牌山` 模式，基于当前关卡组合素材生成 50 张左右的牌，自动计算多层遮挡和解锁关系。
- 已完成 T052：第 10 关 Boss 目标改为配置化多目标，试玩页支持 `bossGoals` 展示、过关校验和密集牌山目标包生成。
- 已完成 T053：新增 `suit_set` Boss 牌型目标，第 10 关现在要求 `万 / 筒 / 条` 都至少完成 1 次组合。
- 已完成 T054：Boss 目标栏支持完成态、推进高亮和清空但目标未完成提示。
- 已完成 T055：加入 `东 / 南 / 西 / 北 / 中 / 发 / 白` 字牌基础支持；字牌可碰可杠，不参与吃，配置试玩页和密集牌山生成器已能显示和统计字牌。
- 已完成 T056：主槽固定为 8 格，旧扩槽效果不会突破上限；新增 `胡` 牌型基础支持，主槽 8 张能拆成 `3 + 3 + 2` 时可一次消除，备用槽不参与判定。
- 已完成 T057：新增 `featuredCombos` 重点组合字段，第 6/10 关标记为 `胡`；配置试玩页展示本关重点，密集牌山模式会优先生成一个 8 张 `3 + 3 + 2` 胡牌包。
- 已完成 T058：新增 11-20 关主线骨架，固定第 3/6/9/13/16/19 关为奖励节点、第 10/20 关为 Boss 节点；第 20 关 Boss 目标包含 `胡`、字牌和积分复合压力。
- 已完成 T059：密集牌山模式新增开发用调参面板和 URL 参数，支持调整随机种子、牌量、同列堆叠深度、`胡` 包数量和字牌权重。
- 已完成 T060：新增共享表现层快照契约和 Cocos/GDevelop 承接文档，正式工程后续应消费 `createMahjongPresentationSnapshot`，不要复制 HTML 原型 DOM 状态。
- 已完成 T061：新增 Cocos 场景视图模型和 `apps/game/mahjong-roguelike/cocos/` 骨架说明，后续 Cocos Creator 实际场景应按绑定清单创建。
- 已完成 T062：新增 Cocos Creator 3.8.8 工程壳，包含 `empty-2d` 风格项目结构、首场景脚本边界、配置导入占位和工程结构测试。
- 已完成 T063：Cocos 工程可通过本地测试 scene model 自动渲染占位首屏，Board/Slot/Combo/HUD Binder 已具备最小自动建节点能力。
- 已完成 T065：Cocos 工程首屏占位 UI 已按 390x844 手机竖屏基准重排。
- 已完成 T066：Cocos 首屏占位 UI 已按运行时 canvas CSS 尺寸、Cocos 可见尺寸和 DPR 自适应，iPhone 预览中 HUD、牌山、组合按钮和 8 格主槽已回到可读位置。
- 已完成 T068：现有青瓷风麻将图片已整理进 Cocos UI 资源目录，包含 27 张数牌、7 张切分字牌、参考图和中间稿；后续接 prefab 时优先查看 `assets/resources/ui/mahjong-tiles/manifest.json`。
- 已完成 T069：Cocos 测试首屏已跑通首条点击可玩链路，可点击牌进入 8 格主槽，组合按钮按候选刷新，并可执行基础消除。
- 已完成 T070：Cocos 测试首屏点击后会按剩余牌重新计算 5% 遮挡解锁，入槽牌会在 8 格主槽显示牌名；Web Preview 的 `resources.meta` settings 查询错误已修正。
- 已完成 T072：Cocos Web Preview 默认加载真实第 1 关 `validation_intro_peng`，通过 Cocos 本地 runtime state 支持点击入槽、`胡 / 杠 / 碰 / 吃` 按钮刷新和基础组合消除；旧测试 scene model 作为 fallback 保留。
- 已完成 T073：Cocos 牌山节点已优先按 `prefabKey` 加载 `assets/resources/ui/mahjong-tiles/` 中的 SpriteFrame；真实首关的 `9筒 / 2万` 会显示青瓷麻将图片，缺图或加载失败时保留程序化占位牌 fallback。
- 已完成 T074：`assets/resources/ui/mahjong-tiles/tiles/borderless/` 已生成 27 张数牌和 7 张字牌透明无边框 PNG；`HulebuTileSpriteCatalog` 当前优先加载无边框 SpriteFrame，原带框资源保留为回退和美术复核。
- 已完成 T075：`assets/resources/ui/mahjong-tiles/tiles/refreshed/` 已生成 27 张数牌和 7 张字牌运行时留白版 PNG；`HulebuTileSpriteCatalog` 当前优先加载 `refreshed` SpriteFrame，`borderless` 保留为透明来源图。
- 已完成 T076：Cocos runtime 已补最小关卡流闭环；牌山清空后弹出通关提示，继续进入下一关，3/6/9/13/16/19 关在继续时进入奖励三选一，20 关后显示本轮通关。奖励效果和 Boss 目标进度尚未真正落地。
- 已完成 T077：Cocos 默认关卡已从 6 张流程关恢复为确定性随机堆叠牌山；首关 42 张起步，后续 42-60 张，支持同列完全覆盖、顶部横条层数提示、字牌权重和 5% 遮挡阈值，并保留 T076 的通关和奖励节点流转。
- 已完成 T078：Cocos 随机牌山已扩大铺开范围，首关配置跨度约 `300x186`；遮挡规则已修正为任意更高层牌超过 5% 覆盖即写入 `blockedBy`，runtime 测试验证被盖住牌不可入槽、移走 blocker 后恢复可选。
- 已完成 T079/T080：胡了卜底层牌山生成器从随机柱思路升级为 Graph-based 地基，并在 `packages/shared/src/mahjong-mountain-generator.ts` 落地第一版，包含中心塔/双翼模板、5% 遮挡图、理论解法、组合发牌、干扰节点和体验报告。
- 已完成 T081：胡了卜地图模板语法系统设计定稿。后续不应继续只加写死模板分支，而应先做模板注册表和参数系统；第一期实现 8 个核心模板：中心塔、双翼、十字、环形、长墙、岛屿、峡谷、阶梯；第二批 backlog：花瓣、堡垒、棋盘、迷雾外圈。
- 已完成 T082：胡了卜模板注册表和参数系统实施计划。计划要求后续先保留 `center-tower` / `two-wings` 现有行为，再落地模板 definition、参数归一化、参数边界、体验标签、通用校验器和 ExperienceReport 模板字段；8 个核心模板仍由 T083 实现。
- 已完成 T083：共享生成器已落地模板注册表、参数归一化、8 个核心模板、通用校验器和扩展后的 `ExperienceReport`。当前仍未接 Cocos，后续需要单独把 Graph-based `levelTiles` 转成 Cocos 关卡配置。

## 新负责人需要先读

1. `README.md`
2. `FRAMEWORK_PLAN.md`
3. `GAMEPLAY_PLAN.md`
4. `GAMEPLAY_REVIEW_PLAN.md`
5. `GAMEPLAY_REVIEW.html`
6. `MVP_VALIDATION_PLAN.md`
7. `MVP_VALIDATION_PLAN.html`
8. `MVP_BUILD_PLAN.md`
9. `MVP_BUILD_PLAN.html`
10. `PLAYABLE_VALIDATION_PROTOTYPE.html`
11. `IMPLEMENTATION_PLAN.md`
12. `DECISIONS.md`
13. `packages/shared/src/mahjong-game.ts`
14. `packages/shared/src/mahjong-game.test.ts`
15. `packages/shared/src/mahjong-config.test.ts`
16. `apps/game/mahjong-roguelike/README.md`
17. `apps/game/mahjong-roguelike/docs/rules.md`
18. `apps/game/mahjong-roguelike/docs/content-plan.md`
19. `apps/game/mahjong-roguelike/config/tiles.json`
20. `apps/game/mahjong-roguelike/config/levels.json`
21. `apps/game/mahjong-roguelike/config/rewards.json`
22. `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
23. `apps/game/mahjong-roguelike/docs/tile-mountain-generator.md`
24. `apps/game/mahjong-roguelike/docs/formal-presentation-bridge.md`
25. `packages/shared/src/mahjong-presentation.ts`
26. `packages/shared/src/mahjong-presentation.test.ts`
27. `packages/shared/src/mahjong-cocos-scene.ts`
28. `packages/shared/src/mahjong-cocos-scene.test.ts`
29. `apps/game/mahjong-roguelike/cocos/README.md`
30. `apps/game/mahjong-roguelike/cocos/scene-binding.md`
31. `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/README.md`
32. `packages/shared/src/mahjong-cocos-project.test.ts`
33. `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuSampleSceneModel.ts`
34. `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/mahjong-tiles/README.md`
35. `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/mahjong-tiles/manifest.json`
36. `docs/tasks/TASK_BOARD.md` 中 T017、T020、T029、T030、T038、T040、T041、T042、T043、T044、T045、T046、T047、T048、T049、T050、T052、T053、T054、T055、T056、T057、T058、T059、T060、T061、T062、T063、T065、T066、T068、T069、T070、T072
37. `docs/decisions/2026-05-20-gdevelop-game-engine-role.md`
38. `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`
39. `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`
40. `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts`
41. `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuTileSpriteCatalog.ts`
42. `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/mahjong-tiles/tiles/borderless/`
43. `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/mahjong-tiles/tiles/refreshed/`
44. `docs/tasks/items/T076-hulebu-cocos-clear-level-flow.md`
45. `docs/tasks/claims/T076-codex.md`
46. `docs/tasks/items/T077-hulebu-cocos-random-stacked-mountain.md`
47. `docs/tasks/claims/T077-codex.md`
48. `docs/tasks/items/T078-hulebu-cocos-spread-locking.md`
49. `docs/tasks/claims/T078-codex.md`
50. `docs/superpowers/specs/2026-05-28-hulebu-map-template-grammar-design.md`
51. `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`
52. `packages/shared/src/mahjong-mountain-generator.ts`
53. `packages/shared/src/mahjong-mountain-generator.test.ts`
54. `docs/superpowers/plans/2026-05-28-hulebu-template-registry-parameter-system.md`
55. `docs/tasks/items/T082-hulebu-template-registry-plan.md`
56. `docs/tasks/claims/T082-lee.md`
57. `docs/tasks/items/T083-hulebu-template-registry-core-templates.md`
58. `docs/tasks/claims/T083-lee.md`

## 推荐下一步

先组织团队试玩 `PLAYABLE_VALIDATION_PROTOTYPE.html`，重点确认：

- 组合候选区是贴近槽位上方，还是点击按钮后在按钮上方展开。
- 局内积分商店是关间购买，还是允许危局中购买救场资源。
- `余牌` 默认简版是否足够，还是验证版需要展开点数。
- 先做 5 个验证场景是否足够，还是先做 3 个场景加一个奖励选择闭环。
- 失败前救场是否完全展示给玩家。
- 验证版第一批 10 个局内奖励是否以路线型为主，避免纯数值堆叠。

团队确认玩法方向后，下一步建议做配置加载验证，或进入 Cocos/GDevelop 表现层原型和 Web 站内接入准备。
配置加载验证已完成，下一步更建议进入 Cocos/GDevelop 表现层原型，先把 10 关配置渲染出来并跑通点击、入槽、组合发动和奖励选择。
配置驱动试玩原型、密集牌山生成器和第 10 关 Boss 多目标已完成。若继续推进体验，建议组织试玩对比 `配置关卡` 与 `密集牌山` 两种模式，重点观察 `吃 / 碰 / 杠 / 三门齐 / 积分` 目标反馈是否清楚、目标压力是否不死板，再决定是调生成器参数、设计第 20 关 Boss，还是进入 Cocos/GDevelop 正式工程承接。
字牌基础支持已完成。下一轮内容设计时需要重新考虑字牌比例、字牌奖励流派和 Boss 目标，不要只按 `万 / 条 / 筒` 三门继续扩 20 关。
固定 8 格主槽和 `胡` 牌型基础支持已完成。下一轮试玩应重点确认 8 格是否刚好形成压力、`胡` 是否有爽点但不稀有、备用槽是否仍像救场而不是常规第 9 格；奖励池后续不要再加入提高主槽上限的能力。
胡牌节奏配置和密集牌山胡牌包已完成。下一轮建议先试玩第 6 关和第 10 关的 `密集牌山` 模式，观察首个胡牌包是否过于稳定、是否需要把 `featuredCombos` 从固定 1 包改成按关卡权重生成，再决定是否进入正式表现层。
20 关节奏骨架已完成。下一轮建议重点试玩第 13/16/19 奖励节点和第 20 关 Boss，判断奖励间隔是否舒服、终章 Boss 是否目标过多；这批关卡仍是骨架，不是最终数值。
第 20 关密集牌山已补回归测试，`featuredCombos: ["hu"]` 的胡牌包会复用为 Boss `胡 1` 目标。试玩时可直接打开 `prototypes/config-playable/index.html?level=20&mode=mountain`，不用先手动切关和切模式。
随机牌山调参面板已完成。试玩调参可直接使用 `?level=20&mode=mountain&seed=calibrate&tiles=58&stack=6&hu=2&honor=90`，也可以在密集牌山模式的侧栏修改参数后点 `重新生成牌山`。
Cocos/GDevelop 表现层桥接已完成。下一步正式工程建议先做 Cocos 场景骨架，让 `GameScene` 读取配置、持有规则状态，并通过 `createMahjongPresentationSnapshot` 驱动 `BoardLayer / SlotLayer / HudLayer / ComboBar`；GDevelop 侧只做对象变量映射和点击回传，不再重写规则判断。
Cocos 场景骨架第一版已完成。下一步建议在 Cocos Creator 中创建 `HulebuGameScene`、Tile prefab 和 HUD 节点，把 `createMahjongCocosSceneModel` 输出的数据绑定到真实节点上，再做点击入槽的第一条互动链路。
Cocos Creator 3.8.8 工程壳已完成。下一步建议在 Cocos Dashboard 中打开 `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/`，在编辑器内创建 `HulebuGameScene.scene`，绑定 `GameSceneController` 和四个 Binder，再做配置同步与首关渲染。
Cocos 首屏自动渲染、手机竖屏适配和真实可见尺寸自适应已完成。下一步建议先按目标概念图做 Cocos 首屏视觉壳，包含绿色牌桌、顶部牌匾、右侧道具、木质 8 格槽和背景层；视觉壳稳定后再接真实配置和共享规则状态，优先跑通“点击可用牌 -> 进入 8 格主槽 -> 刷新 HUD/按钮”的第一条链路。
麻将 UI 图片资源已整理完成。下一步接正式牌面时，先用 `manifest.json` 建立 `tileKey -> SpriteFrame` 映射；`drafts/` 不要直接接 prefab，除非人工确认替换。
Cocos 测试首屏点击链路已完成。下一步建议把 Cocos `GameSceneController` 从本地测试 scene model 切到真实配置和共享规则状态，重点补“点击后重新计算遮挡解锁、清空牌山通关、奖励三选一、Boss 目标进度”和最终牌面 prefab 绑定。
Cocos 点击后遮挡解锁和槽位牌名显示已补齐。下一步更建议先把 Cocos 运行时接到真实 20 关配置和共享规则状态，再接最终牌面 SpriteFrame；否则继续打磨测试 scene model 的收益会越来越小。
Cocos 真实第 1 关配置接入已完成。下一步建议优先二选一：要么接最终牌面 SpriteFrame prefab，把程序化占位牌替换为已归档青瓷麻将图；要么继续扩 Cocos runtime 的关卡流，支持从 1-20 关配置切换、通关提示、奖励节点和 Boss 目标进度。
Cocos 牌面 SpriteFrame 绑定第一版已完成。下一步如果继续美术表现，应先处理图片裁切和 Tile prefab，让牌面占满当前 52x70 牌体，并把 8 格槽位中的牌也替换为同一套图片；如果继续玩法流程，则应扩 Cocos runtime 的关卡流、奖励三选一和 Boss 目标进度。
无边框牌面资源已完成。下一步美术表现可以优先调整 Cocos 牌体底板、符号缩放比例和槽位里的同款 SpriteFrame；不要再把带框原图直接叠在自绘牌体上。
新牌面 UI 留白版、Cocos 最小通关闭环、随机堆叠牌山恢复、牌山铺开和遮挡点击一致性已完成。下一步建议继续补奖励效果真正落地、Boss 目标进度、关卡 HUD 动态进度和槽位同款图片；完整 20 关内容平衡、最终 Tile prefab、图集和动画可以在流程稳定后继续接。
地图模板语法系统已完成设计。若下一步继续牌山地基，应先开 T082 做模板注册表和参数系统，保留 T080 当前行为，再开 T083 实现 8 个核心模板和对应 ExperienceReport 校验；不要直接把十字、环形等写成更多临时 if 分支。
模板注册表和 8 个核心模板共享实现已完成。下一步如果继续牌山地基，建议另起 Cocos 接入任务，把 Graph-based `levelTiles` 转成现有 Cocos `HulebuLevelTileConfig`，先用于 1-2 个测试关卡目检读牌压力，再决定是否替换默认 20 关随机堆叠生成。
