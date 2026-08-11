# 胡了卜交接

## 当前状态

- T246 M2 三节点完整纵切设计已获 Lee 书面批准；T247 代码级实施计划已完成：采用 `Boot → Title → Game → Result` 四 Scene，三节点为碰教学、吃/多候选教学、奖励和 mini Boss。后续按 `docs/superpowers/plans/2026-07-30-hulebu-cocos-v1-m2-three-node-vertical-slice.md` 的五批边界实施，当前尚未开始 M2 代码。
- M2 只验证 `8–12` 分钟完整产品闭环、第一版正式 Prefab、存档检查点和临时真实音频链路；完整十节点、最终 UI/音频和微信小游戏发布分别留到 M3、M4、M5。
- T245 已完成：Cocos production source snapshot 的真实路径已统一，symlink worktree 路径回归覆盖通过，发布测试为 `189/189`。
- T244 M1 核心架构代码、精确恢复校验、两轮评审和正式构建已完成；聚焦测试为 `158/158`，精确源码提交为 `1bc4867cf56919b1230307297d9d4600b4f6bb4f`。
- 最新 production build id 为 `1bc4867cf569-20260729T150509Z`，Creator 3.8.8 build、verify-only、5 条 HTTP smoke、桌面/移动正式包加载、点击与刷新恢复均已验证。
- Lee 已确认正式发布方向按微信小程序常见竖屏体验验收，横屏不属于当前目标，不登记横屏适配任务，也不修改 Binder/UI/layout。T244 的 `390x844` 正式包已补齐点击入槽、组合、刷新恢复、多候选 exact choice 和一次清关 smoke；最终分支 HEAD exact-commit build 与 verify-only 均通过，build ID 以生成 manifest 为准。T244 已完成，可进入 T247 M2 实现。
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
- 已完成 T084：Cocos 默认 20 关已改为消费 Graph-based `generateHulebuMountain(...).levelTiles`，8 个核心模板按关卡轮换生成；现有渲染、点击、8 格槽、组合按钮、通关提示和奖励节点流转继续复用原 runtime。
- 已完成 T085：配置试玩原型默认入口已改为干净玩家试玩页，调牌/调参能力移到独立 `tuner.html` 入口；`view=tuner` 才显示顶部配置切换和密集牌山调参面板。
- 已完成 T086：配置试玩原型的密集牌山默认进入 240 张小牌压力版，调参范围支持 120-420 张；牌山坐标系扩大为 920x520，规则小牌尺寸缩到 38x52。默认生成使用 6 条压叠牌流加 4 个竖堆入口，首轮可点约 10 张，并强制覆盖 `万 / 条 / 筒 / 字` 四类牌，适合评估数百张牌的读牌压力和页面承载能力。
- 已完成 T087：配置试玩原型的密集牌山改为 640x860 竖屏基准，并新增 8 个本地模板、自动模板轮换和调牌器模板选择；默认 240 张牌保证 34 个具体牌面全覆盖，首轮仍约 10 张可点，栈顶显示隐藏深度角标。桌面 Kimi WebBridge 和 390px 移动端 headless Chrome 截图均已验证。
- T087 验收补丁：如果调牌器 URL 带 `template=ring`，当前关仍会显示环形；点击其他关卡、进入下一关或重开一轮会恢复 `auto` 模板，不会继续把所有关固定成环形。只有当前关重开会保留调参，便于单关调试。
- 已完成 T088：配置试玩原型的密集牌山现在显示顶牌加 4 张下层预览牌；下层预览牌显示真实牌面、错位露出，但保持 blocked/disabled，不扩大首轮约 10 张可点入口。默认玩家页把栈深数字降噪为小圆点，调牌器仍保留数字深度提示。Kimi WebBridge 桌面默认页/调牌器和 390px headless Chrome 移动端截图均已验证。
- 已完成 T089：配置试玩原型的密集牌山新增随机组合/桥接堆和 5%-100% 遮挡比例；同一局内混合完全覆盖、轻微遮挡和错位预览。桥接顶牌可压住多个下层堆顶入口，移走后会释放多个选择，首轮入口仍控制在 8-12 张。密度补丁后牌山坐标系为 `560x720`、规则牌尺寸为 `42x56`，桌面玩家页主栏收敛到 `500px`；运行态点击判定会按实际渲染后的视觉矩形过滤，避免视觉上已经露出的顶牌仍不可点击。
- 已完成 T090：配置试玩原型失败时会弹出“本关失败”提示，默认说明主槽已满且没有可发动组合或救场资源，并提供“重开本关”入口；Boss 目标未完成导致失败时复用同一失败弹层。失败后牌面、组合按钮和工具按钮保持禁用。
- 已完成 T091：默认玩家页按正式 HUD 空间重新压缩，密集牌山坐标系改为 `560x640`，玩家页牌桌限制为 `430px / 48vh`，桌面实测牌桌 `332x379` 且整页不滚动；390x844 移动检查牌桌 `344x393`、卡槽首屏可见、无横向溢出。右侧信息面板移动端仍在下方滚动，正式移动 HUD 重排应单独处理。
- 已完成 T092：默认玩家页切为正式一屏 HUD，顶部显示关卡、目标、余牌、积分和铜钱，右侧只保留 `洗山 / 回手 / 看山` 道具栏，调牌器继续保留完整信息侧栏。桌面 1512x682 实测牌桌 `307x351`、HUD `460x61`、卡槽 `460x114`、右侧道具栏 `76x204`；390x844 移动端牌桌和卡槽首屏可见且无横向溢出。T092 验收调参补丁后，密集牌山轻微遮挡阈值统一为 `8%`，低于 8% 可点击，达到 8% 才阻塞；规则牌尺寸为 `45x60`，第 1-8 关默认首轮可点稳定在 5-8 张，符合起手 3-8 张目标；前 4 个主堆加权并向中心收拢，让多数牌继续堆在主牌山里。
- 已完成 T093：默认玩家页成为 10 关朋友试玩 Demo。第 1-4 关分别教学 `碰 / 吃 / 杠 / 胡`，前 3 关使用 6 格主槽，第 3 关后固定奖励 `卡槽 +2`，第 4 关起使用 8 格主槽；第 5 关开始进入 240 张密集牌山高压模式。右侧道具改为 `洗牌 / 撤回 / 丢弃`，丢弃会移除主槽末尾牌并可作为满槽救场资源。移动端默认玩家页在 390 CSS 像素下采用底部横排三道具，卡槽和道具完整可见且无横向溢出。
- 已完成 T094 设计：普通关牌桌清空但槽内有残张时进入 `残局收官`，不再默认强制清槽。收官方向为 `弃牌通关 / 选作牌引 / 收入牌河`；Demo 第一阶段优先实现弃牌通关和牌引，牌河兑换后置。下一轮实现需同时修正 T093 试玩反馈：前 4 关必须发动教学组合，牌面和点击热区放大，`丢弃` 改为选择槽位任意一张，玩家页补可见记牌器。
- 已完成 T095：密集牌山从“顺序答案生成器”改为“混合窗口生成器”。答案组仍保留 `solutionGroup`，释放窗口改用 `solutionStep`，默认普通密集关首轮同一答案组最多露出 2 张。运行态抽样：第 1 关首轮 8 张可点、最大同组 2 张；朋友试玩第 5 关首轮 7 张可点、最大同组 2 张。
- 已完成 T096：默认玩家页进一步压缩为一屏试玩布局，主栏 `480px`、右侧道具栏 `72px`；密集牌山规则牌尺寸从 `45x60` 放大到 `52x70`，玩家页实测牌面约 `37x49`。普通密集关 `auto` 模板按 seed/重开随机，并在候选生成失败或首轮可点超过 8 时回退到下一个安全模板；调牌器仍保留完整 8 模板手动指定。Kimi WebBridge 第 5 关 `seed=epsilon` 验证 1512x682 视口无横向/纵向溢出，首轮可点 8 张。
- 已完成 T097：前 4 关教学关必须真实发动对应 `碰 / 吃 / 杠 / 胡` 动作才通关，单纯把牌放入卡槽只会提示教学目标。
- 已完成 T098：朋友 Demo 第 5-10 关采用渐进难度曲线，牌量为 `72 / 96 / 132 / 168 / 210 / 240`；第 5 关标题为“正式入门”，第 10 关在朋友 Demo 中是“综合高压”压力关，不叠正式 Boss 目标和胡包。调牌器和正式配置仍保留原 Boss 配置。
- 已完成 T099：朋友 Demo 不再把满槽牌静默移入隐藏备用槽，第 8 张保留在可见主槽；玩家页记牌器位于牌桌和卡槽之间，按 `万 / 条 / 筒 / 字` 展示剩余牌数量，随入槽、组合、丢弃和洗牌刷新。
- 已完成 T100 设计：核心玩法收束为 `有限牌河 + 明碰区 + 补杠孤张出口 + 明杠开山 + 胡牌强奖励 + 听牌提示 + 孤张预算生成器`。补杠只处理碰后的第 4 张，不给强奖励；明杠才震山开牌；胡牌作为最强局内奖励，清槽、强开山并处理牌河。下一轮不要继续只靠降牌型或加牌量调难度，应先验证有限牌河和补杠。
- 已完成 T101：默认玩家 Demo 已落地有限牌河、明牌区、任选槽位打牌、碰后补杠、直接明杠开山、胡后清河、简化 `听/差` 提示和孤张预算生成器检查。牌河容量当前为 `3`；槽满但牌河未满时提示打牌，牌河满且无组合/救场时才失败。根据 Lee 第 5 关试玩反馈，生成器已把第 5-10 关自然明杠包提高到每关 `2` 个，并将明杠目标牌面从普通 3 张填充组中保留出来。明杠开山现在震落 1 张压顶牌，胡牌震落 3 张压顶牌，震落牌保持为桌面可选牌。记牌器口径已改为只统计牌山 `board` 牌；卡槽、牌河、明牌区和移除区不计入。记牌器已改为每个牌面格上下两层显示，上方是牌面、下方是余牌数量。`吃 / 碰 / 杠 / 补杠 / 胡` 已拆到卡槽上方独立动作栏，卡槽行只保留 8 格槽。Kimi WebBridge 已验证第 5 关真实流程第 3 步出现 `杠` 候选，最新复测第 5 关孤张风险 `1/1`、`听/差` 提示可见，震落牌可点击入槽，记牌器入槽后扣数。下一步需要 Lee 实际试玩验收手感。
- 已完成 T102：`/games/hulebu` 站内网页试玩入口已接入，使用 iframe 加载 `/games/hulebu-demo/index.html` 静态副本；调牌器保留 `/games/hulebu-demo/tuner.html`；游戏站麻将卡片和搜索入口已指向该页面。390px Playwright 已验证牌面约 `40x54`、记牌器上下两层可读、动作栏/卡槽/底部道具不互相遮盖。
- 已完成 T103/T104：Lee 提供的高堆叠参考图已抽象为 `悬台窄腰 / suspended-waist` 模板，只借鉴“上层大平台、中段窄腰、底部支撑柱、侧向散牌”的结构，不复制美术、颜色、牌面、文案或具体布局。T104 已把该模板接入 HTML 原型和站内静态调牌器，URL 可用 `/games/hulebu-demo/tuner.html?template=suspended-waist&level=10&seed=waist-check` 验证；默认玩家页 auto 随机池暂不包含该模板。
- 已完成 T105：修复站内试玩版连续 `杠 / 胡` 后震落牌互相叠起的问题。震落牌现在用全局递增平铺序号落到桌面层，旧堆叠/桥接/blocker 元数据会清理；震落牌自身可点击，但它视觉盖住普通下层牌时，下层普通牌不可点击。站内静态副本已同步。
- 已完成 T162：默认玩家 Demo 第 8-10 关高压 auto 池已包含 `悬台窄腰`，第 5-7 关仍保持基础模板池；普通关牌桌清空但主槽有残张时进入 `残局收官`，可 `弃牌通关` 或选 1 张残张作为下一关 `牌引`。站内静态副本已同步，桌面端和 390px 移动端布局已验证。
- 已完成 T163：默认朋友试玩 Demo 第 6、8、10 关前会弹出一次特殊事件选择。事件池包含 `路遇老雀`、`旧牌匣`、`加注一局`、`暗灯牌局`，选项覆盖立即铜钱、道具补给和主动加压；词缀支持 `禁洗牌`、`禁透视`、`高压牌山`，且只作用当前事件关。
- 已完成 T164：默认朋友试玩 Demo 第 10 关启用 `终局试炼`，目标为 `杠 1 / 胡 1 / 积分 180`；HUD 显示 `试炼 x/3`，玩家页新增紧凑目标条。未达标清空牌山会失败并列缺口；击破试炼后一次性发放 `试炼奖励 +180 铜钱`。站内静态副本已同步，390px 移动端牌宽约 `37.5px`，卡槽与底部工具栏不重叠。
- 已完成 T165：对照完整设计方案补齐了 Demo 推进路线，确认后续先做 `20 关主线 + 第 20 关胡了卜王 Boss`，再做局外首页、局外升级和长期模式。
- 已完成 T166：默认玩家试玩页已开放 20 关；第 1-10 关保留当前朋友试玩节奏和第 10 关 `终局试炼`，第 11-19 关已补后半段渐进难度 profile，第 20 关启用 `胡了卜王` 终章 Boss。奖励节点扩展为第 `3 / 6 / 9 / 13 / 16 / 19` 关；站内静态 Demo 已同步。默认玩家页 `auto` 模板还增加了多次 seed 重试和“起手不能直接露出完整答案组”的兜底条件。390px 移动端底部固定道具栏遮挡已修复，卡槽最后一格不再被盖住。
- 已完成 T167：`/games/hulebu` 已从“直接打开 iframe”改为先进入局外首页。局外页现在展示 `开始挑战 / 继续本轮 / 升级 / 图鉴 / 无尽 / 每日` 壳层入口，并预留 `备用槽 / 满槽护符 / 初始道具` 三项外置升级说明。主线 run 仍复用现有 20 关 iframe Demo，但壳层已支持 `返回局外`、`继续本轮`、通关或失败后的站内结算面板，以及浏览器本地的局外铜钱累计预览。静态 Demo 和原型源文件已增加 `embed=shell` 模式与父页面消息桥接。
- 已完成 T168：`/games/hulebu` 的局外铜钱现已成为真实可消费资产，并开放 `备用槽 / 满槽护符 / 初始道具` 三项升级。升级和累计铜钱会持久化到浏览器本地存档；开始新一轮主线时，外层壳会通过 `reserveBonus / shieldBonus / toolBonus` 参数把成长传给 iframe Demo。当前价格为：备用槽 `80 / 240`、满槽护符 `160 / 480`、初始道具 `120 / 360`。桌面和 390px 移动端都已验证升级卡可见，且购买后 iframe URL 会带上正确 bonus 参数。
- 已完成 T169：奖励池已扩展到 16 个，并在默认 20 关主线奖励节点中覆盖 `吃流 / 碰流 / 杠流 / 胡流 / 道具流 / 信息流`。本轮只复用现有 effect 类型，不新增复杂被动状态机，也不修改 `levels.json`。奖励弹层会显示路线标签，已选奖励区会展示 `奖励名 · 路线`，让玩家能直接读出本轮 build 倾向。
- 已完成 T170：`/games/hulebu` 局外 `无尽` 面板已开放 `开始无尽`，iframe 使用 `mode=endless&startLayer=21` 从第 21 层起步。内层原型支持无尽层数循环、每 3 层奖励、每 5 层 Boss 压力和 shell 层数同步；外层本地存档新增 `bestEndlessLayer`，局外页、进行中摘要和结算面板都会显示无尽最高层。
- 已完成 T171：`/games/hulebu` 局外 `每日` 面板已开放 `开始每日`，iframe 使用 `mode=daily&dailySeed=YYYY-MM-DD`；外层本地存档新增 `dailyBestLevels`，会保存同一天的本地最好关数。
- 已完成 T172：`/games/hulebu` 局外 `图鉴` 面板已从占位改为成就图鉴第一版，本地存档新增 `achievements`，首批 8 项成就已承接主线、无尽、每日和局外升级进度。
- 已完成 T173：`/games/hulebu` 局外 `高阶` 面板已开放 `东风场 / 南风场` 两档周目入口，外层本地存档新增 `bestAscensionLevel`；内层原型与静态 Demo 支持 `ascensionLevel / ascensionName` 参数、周目 HUD、重开承接和结算摘要。`东风场` 会提高牌山压力并带周期性高压词缀，`南风场` 进一步减少起始工具并禁用洗牌。
- 已完成 T174：`/games/hulebu` 登录账号进度续层已接入账号侧长期进度，覆盖局外铜钱、无尽最高层、高阶解锁、每日最佳和成就，未登录用户继续保留本地存档。
- 已完成 T175：后续路线已从“下一步 Cocos 追平”调整为“先完成 Web 版完整内容，再补 Cocos 和音乐美术资源”。后续实现应优先继续 Web 完整版内容和数值冻结。
- 已创建 T184：把原先只写在路线图里的“路线奖励和局外能力深化”正式收口为任务。当前 `/games/hulebu` 的长期成长已明确扩成六轴，路线挂载会影响开局偏置、奖励池和事件池；升级页也已补上 `当前收益 / 下一步`。
- 已创建 T186：胡了卜主线结构后续不再按“跨多关慢慢 build 一条路线”继续收，而是改成 `长期成长在局外 + 每局开局前主动选流派`。这次只是规划任务，完整实现计划已写入 `docs/superpowers/plans/2026-06-23-hulebu-meta-progression-and-run-archetype-selection.md`。
- T184 还顺手收掉了失败时的外层壳结算页：旧存档里的失败结算会在 hydration 时被丢弃，站内壳层也不再渲染失败结算。现在失败只保留在 iframe 内的简短弹框，不再二次讲解。
- 外层 hydration 现在也补齐了这条兜底：如果浏览器本地还残留更早版本写下的 `failed` settlement，`normalizeCompletedSettlement()` 不会再把它误判成完成结算重新渲染出来。后续如果刷新后又看到失败解释页，先确认是不是跑着旧前端包，而不是继续往失败态里补文案。
- 最新补丁继续收紧失败反馈：原型和站内静态 Demo 的失败弹框只保留 `失败 / 重开`，而且外层壳不再把失败 run 维持成“继续本轮”的状态。
- 外层现在还会主动清掉历史 `?debugSettlement=...failure...` 调试参数；如果有人拿着旧失败样例链接刷新页面，也会直接回到正常局外态，而不是再次把失败解释样例页带出来。后续若再看到这类页面，优先判断是不是 dev server 还挂着旧包，而不是继续往失败链路里补分析文案。
- Boss 结算 payload 也继续缩过一轮：当前外层只依赖 `bossVariant` 做成就信号，原型和静态 Demo 已不再额外挂 `phaseTarget / keyGoal / keyMiss / nextAdvice / mismatch` 这类解释字段。后续如果要补 Boss 内容，优先补玩法和目标池，不要把说明文案重新塞回 payload。
- 当前实现里，`hulebu:run-failed` 到外层后会直接短路回牌桌页，不会落入 `SettlementState`，也不会留下失败态 `activeRun`。后续若继续调失败体验，不要再把复盘、说明或失败结算页重新挂回外层壳。
- 后续如果继续做主线内容，优先遵守 T186 的结构：`路线挂载` 只能保留为局外偏好和轻协同；真正的局内身份必须来自每次开局前选择的流派技能。20 关后以及无尽 / 每日 / 高阶开始前，都应复用这层开局流派选择，不要再回到“整局绑定职业”的旧读法。
- T186 壳层已补流派引导解锁口径：前 20 关先按教学节奏推荐并逐步开放 `吃 / 碰 / 杠 / 胡 / 道具 / 信息`，20 关后以及无尽 / 每日 / 高阶进入自由选择。后续若继续改 UI 或开局参数，保留这条分层，不要把所有流派在新手前段一次性铺满。
- T185 最新一刀继续收内容后半程：主线第 `17 / 18 / 19` 关现在是 `328 / 334 / 340` 张、字牌权重 `62 / 66 / 70`、孤张预算 `7 / 8 / 8`；主线终章 Boss 的 `杠` 目标也压回 `1`，得分线为 `166`。
- T185 这一轮还顺手把晚段奖励口味再往“落成”推了一格：主线 `18+` 新增 `胡分 / 杠分 / 工具包` 的收官偏置，高阶第 `16 / 18` 档也从 `看山` 收成 `工具包`。后续再验主线后段和高阶后段时，重点看它们是否更像整理手牌和封口，而不是继续补信息件。
- T185 现在把每日终章前一拍也一起收进来了：每日第 `18` 档已经从 `胡分 / 杠分 / 看山` 改成 `胡分 / 杠分 / 工具包`。后续再验每日终章时，重点看第 `18 / 20` 两档是否都像在整理手牌和封口，而不是在终章前突然回头补信息件。
- 每日和无尽后段也同步收口：每日第 20 关最终得分线现在卡到 `186` 以内，每日第 `16` 档奖励改成 `胡钱 / 整手 / 工具` 的过渡包；无尽高章节守层分数线改成 `164 + 章节 * 16`。后续若继续收 T185，优先看终章奖励拍点和后段 build 成型感，不要回头给失败态补分析文案。
- 这组冻结值现在已经重新写回 HTML 原型、站内静态 Demo 和共享原型回归，不再只是文档口径。后续如果继续收后半程，请以 `328 / 334 / 340` 与 `164 + 章节 * 16` 为当前起点，再往上或往下调时同步改测试。
- T185 这一轮又继续把后段奖励拍点拉向“兑现而不是续命”：无尽第 `7 / 8` 章节主题奖励现在分别偏 `胡钱 / 杠分 / 整手 / 丢弃` 和 `胡分 / 杠分 / 胡钱 / 看山`，主线第 `19` 关固定路线奖励也从 `杠分 / 碰分 / 看山` 收成 `杠分 / 胡钱 / 看山`。后续再看终章手感时，优先判断 build 是否真的在最后两拍落成，不要再按旧的续命包口径理解这些节点。
- T185 也顺手继续收了每日终局的词缀附加题：现在第 `20` 关只会优先把词缀里的 `胡 / 杠` 终局型组合带进 Boss；如果当天词缀只有 `碰 / 吃` 这类前中段组合，就不再额外挂最终题。后续再验每日终章时，重点看“今日主题有没有顺着终局落成”，不要再把 `碰 / 吃` 额外题当作固定终局负担。
- 已完成 T183：新增 `docs/modules/mahjong-roguelike/UI_ASSETS_COCOS_INTEGRATION.md`，记录 T181 v6 透明 UI / 牌面资源和 T182 v1 操作演出资源的 Cocos 接入路径、SpriteFrame key 建议、导入设置、接入顺序和风险清单。

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
44. `docs/modules/mahjong-roguelike/UI_ASSETS_COCOS_INTEGRATION.md`
45. `docs/tasks/items/T076-hulebu-cocos-clear-level-flow.md`
46. `docs/tasks/claims/T076-codex.md`
47. `docs/tasks/items/T077-hulebu-cocos-random-stacked-mountain.md`
48. `docs/tasks/claims/T077-codex.md`
49. `docs/tasks/items/T078-hulebu-cocos-spread-locking.md`
50. `docs/tasks/claims/T078-codex.md`
51. `docs/superpowers/specs/2026-05-28-hulebu-map-template-grammar-design.md`
52. `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`
53. `packages/shared/src/mahjong-mountain-generator.ts`
54. `packages/shared/src/mahjong-mountain-generator.test.ts`
55. `docs/superpowers/plans/2026-05-28-hulebu-template-registry-parameter-system.md`
56. `docs/tasks/items/T082-hulebu-template-registry-plan.md`
57. `docs/tasks/claims/T082-lee.md`
58. `docs/tasks/items/T083-hulebu-template-registry-core-templates.md`
59. `docs/tasks/claims/T083-lee.md`
60. `docs/tasks/items/T084-hulebu-cocos-graph-generator-integration.md`
61. `docs/tasks/claims/T084-lee.md`
62. `docs/tasks/items/T085-hulebu-play-page-tuner-split.md`
63. `docs/tasks/claims/T085-lee.md`
64. `packages/shared/src/mahjong-config-playable-prototype.test.ts`
65. `apps/game/mahjong-roguelike/prototypes/config-playable/tuner.html`
66. `docs/tasks/items/T086-hulebu-hundreds-tile-mountain.md`
67. `docs/tasks/claims/T086-lee.md`
68. `docs/tasks/items/T087-hulebu-varied-portrait-mountain.md`
69. `docs/tasks/claims/T087-lee.md`
70. `docs/tasks/items/T088-hulebu-visible-scattered-stack-preview.md`
71. `docs/tasks/claims/T088-lee.md`
72. `docs/tasks/items/T089-hulebu-random-merged-stack-overlap.md`
73. `docs/tasks/claims/T089-lee.md`
74. `docs/tasks/items/T090-hulebu-failure-feedback-overlay.md`
75. `docs/tasks/claims/T090-lee.md`
76. `docs/tasks/items/T091-hulebu-compact-board-hud-budget.md`
77. `docs/tasks/claims/T091-lee.md`
78. `docs/tasks/items/T092-hulebu-one-screen-play-hud.md`
79. `docs/tasks/claims/T092-lee.md`
80. `docs/tasks/items/T093-hulebu-friend-playtest-demo.md`
81. `docs/tasks/claims/T093-lee.md`
82. `docs/tasks/items/T094-hulebu-endgame-settlement-design.md`
83. `docs/tasks/claims/T094-lee.md`
84. `docs/superpowers/specs/2026-06-01-hulebu-endgame-settlement-design.md`
85. `docs/tasks/items/T095-hulebu-mixed-window-mountain-generator.md`
86. `docs/tasks/claims/T095-lee.md`
87. `docs/tasks/items/T165-hulebu-complete-experience-roadmap.md`
88. `docs/tasks/claims/T165-lee.md`
89. `docs/superpowers/specs/2026-06-13-hulebu-complete-experience-roadmap-design.md`
90. `docs/superpowers/plans/2026-06-13-hulebu-complete-experience-roadmap.md`
91. `docs/tasks/items/T175-hulebu-web-full-version-roadmap.md`
92. `docs/tasks/claims/T175-lee.md`
93. `docs/superpowers/specs/2026-06-16-hulebu-web-full-version-roadmap-design.md`
94. `docs/superpowers/plans/2026-06-16-hulebu-web-full-version-roadmap.md`

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
随机牌山调参面板已完成。试玩调参可直接使用 `?level=20&mode=mountain&seed=calibrate&tiles=360&stack=6&hu=2&honor=90`，也可以在密集牌山模式的侧栏修改参数后点 `重新生成牌山`。
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
Graph-based 生成器已接回 Cocos，默认 20 关开始使用 8 个核心模板轮换生成。下一步建议用 Cocos Web Preview 手机视口目检第 1/2/3/4 关，确认中心塔、双翼、十字和环形的读牌压力，再继续补奖励效果、Boss 目标进度和槽位同款图片。
配置试玩页已分成默认玩家页和独立调牌器。后续做朋友试玩时打开默认 `index.html`，它现在是 10 关小 run；需要调参数时打开 `tuner.html` 或 `index.html?view=tuner&mode=mountain`。默认 Demo 的第 1-4 关分别教学 `碰 / 吃 / 杠 / 胡`，且必须成功点击对应动作按钮才通关，单纯把牌全部放入卡槽不会跳关；第 5-10 关按 `72 / 96 / 132 / 168 / 210 / 240` 逐步提升牌量，第 8-10 关高压 auto 池包含 `suspended-waist / 悬台窄腰`。右侧道具为 `洗牌 / 撤回 / 丢弃`，移动端为底部横排。记牌器已放在牌桌和卡槽之间，只统计牌山 board 牌；满槽时第 8 张不会被隐藏备用槽吞掉。普通关清空牌桌但槽内有残张时会进入 `残局收官`，当前支持 `弃牌通关` 和 `选作牌引`。默认 Demo 第 6、8、10 关前已接入特殊事件第一版，事件池包含 `路遇老雀 / 旧牌匣 / 加注一局 / 暗灯牌局`，可获得铜钱、补道具或主动选择 `禁洗牌 / 禁透视 / 高压牌山` 词缀。调牌器当前默认生成 240 张小牌，首轮可点目标为 3-8 张，URL 可用 `tiles=120` 到 `tiles=420` 压测密度，也可用 `template=center-tower|two-wings|cross|ring|long-wall|islands|canyon|staircase|suspended-waist` 指定模板。
T101 已把 T100 的第一版核心规则落进默认玩家 Demo，T102 已把该 Demo 接到 `/games/hulebu`，T105 已修正震落牌平铺和遮挡点击，T162 已补上高压窄腰池和残局收官第一阶段，T163 已补上特殊事件第一版，T164 已补上第 10 关终局试炼第一版。T165 已对照完整设计方案完成推进路线：下一步不要继续只在第 5-10 关加局内补丁，应优先开 T166，把默认站内 Demo 推进到 `20 关主线 + 第 20 关终章 Boss`。

T175 已完成。当前网页 Demo 已具备主线 20 关、局外升级、路线型奖励池、无尽、每日、成就图鉴、高阶周目和登录账号长期进度续层，但相对完整版仍缺高阶周目完整版、Boss 试炼第二版、特殊事件池、成就图鉴扩容、无尽/每日深度、路线奖励与局外能力深化，以及统一数值平衡和内容冻结。

T176 高阶周目继续加深中。`东风探手·压口` 已从通用东风前段里单独拎出，补了事件身份 / 构筑手感 / 奖励链 / Boss 压力四条专属判定；高阶成功与失败复盘现在都能把前段压口和普通开线区分开来。

T176 后段专属化也继续往前推了一步。`西风收口·留门 / 北风锁火·终煤 / 北风封尾·闷锁` 又补了更偏终局的手感句和奖励骨，后段收口、闷燃封火和闷锁封尾开始更像不同构筑分支。

T176 失败反馈也继续加深。`北风锁火·终煤` 和 `北风封尾·闷锁` 现在分别有专属的构筑手感、Boss 压力和奖励链判定，终局失败不再只靠“终局封刀”一句话兜住。

T176 失败拆分又往前拱了一点。`北风锁火·终煤 / 北风封尾·闷锁` 现在还能继续细到目标完成度、节奏和容错卡点，终局失败已经能更清楚地区分火线没闷到最后一拍、尾门没焊死和 Boss 终局逼锁错位。

后续建议顺序改为：T176 高阶周目完整版；T177 Boss 试炼第二版；T178 特殊事件池扩容；T179 成就图鉴扩容；T180 无尽和每日深度化；T181 路线奖励和局外能力深化；T182 Web 数值平衡和内容冻结。Cocos 正式表现层、音乐、美术、动效和发布资源等 Web 内容冻结后再接，不要让 Cocos 追着仍在变化的 Demo 重复返工。

T176 已完成高阶周目完整版第一大块。当前 `/games/hulebu` 已具备四档高阶入口、局外高阶配置、高阶能力槽、高阶专属奖励、档位事件、构筑识别、失败复盘和结算复盘。北风场补充 `封盘 / 迟火` 能力与 `封终流` 构筑线；静态 Demo 已同步。普通前几关教程仍只作用普通模式，高阶前几关不再套教程。

T176 后续又补了一轮高阶 identity 加深。当前原型在原有 `封终流 / 封尾流 / 试火流 / 迟尾流` 之外，又补了 `河杠流 / 收官流 / 顺手胡流 / 救场流` 更明确的专属奖励链，并新增 `高阶构筑：河杠连锁 / 收官定局 / 顺手成胡 / 稳压续命` 与 `封盘护河 / 续战筹码 / 牌尾缓冲` 等更北风场化的高阶能力/奖励名。那一阶段还做过 `settlementHighlights` 和外层专属结算结构；当前口径已经回退，不再保留 `构筑回顾 / 关键收益 / 关键失误 / 下一轮建议` 这类失败分析页。

T176 当前还继续补了一轮高阶事件 identity。原型新增 `顺手摸牌 / 稳压补墙 / 河杠涨潮 / 收官落灯` 四个更贴构筑线的事件，同时把 `东风试胆 / 南桌续押 / 西风照听 / 北风断尾` 接进更深层高阶关卡的档位事件轮换，让 A1-A4 在前中后段的事件味道更开。

T176 这一轮又把高阶奖励池继续加厚。`apps/web/src/modules/games/hulebu/HulebuGamePage.tsx` 的高阶配置、路线锚点和外层结算文案继续补进更多东/南/西/北分支；HTML 原型和站内静态 Demo 也同步扩了高阶奖励池、构筑加权池和事件锚点，让高阶 run 的抽奖和结算更像完整内容池，而不是只靠四张 A1-A4 兜底。

T176 继续往“每套构筑真的不一样”推进了一步。`河杠流 / 收官流 / 顺手胡流 / 救场流 / 护河续押 / 牌尾流 / 杠流 / 河控流 / 试炼流 / 稳压流` 现在有更专属的事件身份判定和装配回顾，成功或失败结算都能更明确读出这套 build 是在控河抬杠、终局收口、顺手吃分、救场补洞、护河续押还是稳压续命。

T176 又把这批新路线的 identity 同步回原型源头。`apps/game/mahjong-roguelike/prototypes/config-playable/index.html` 和站内静态 Demo 现在会在 iframe payload 里直接输出新路线的 `rewardChainVerdict / eventIdentityVerdict / buildIdentityVerdict / bossPressureVerdict / tempoRead`，外层结算页不再需要只靠 React 侧文案兜底。

T176 失败三轴也继续同步到原型源头。`河杠流 / 收官流 / 顺手胡流 / 救场流 / 护河续押 / 牌尾流 / 杠流 / 河控流 / 试炼流 / 稳压流` 现在在失败结算里各自有目标完成度、节奏断档、容错见底和构筑 / Boss 错位拆分，输了也能看出具体是控河抬杠没接上、护河续押先交空、还是稳压续命被 Boss 逼偏。

T176 成功结算也继续补了一层路线链路复盘。原型和站内静态 Demo 的高阶 payload 新增 `routeChainChecklist`，`/games/hulebu` 外层结算页会显示“路线链路复盘”卡，把 `河杠流 / 护河续押 / 稳压流` 等路线的事件差异、奖励链检查和下一手抓点拆开看，避免高阶成功只剩一句 identity 判定。

T176 高阶内容池继续补厚。原型和站内静态 Demo 新增 8 张路线补强奖励：`高阶构筑：顺手摸牌 / 临门补洞`、`南风构筑：护河留手 / 稳河控口`、`西风构筑：试炼审计 / 牌尾留门`、`北风构筑：杠潮压顶 / 稳压续命`，并接入 A1-A4 档位池和对应构筑加权池。现在这些路线不仅能在结算里被读出来，也能在局内奖励池里实际抽到承接点。

上面这批高阶结算加深描述属于历史阶段记录。当前口径已经收回：失败不再进入外层结算页，也不再展示路线断点、失败链路复盘或“下一把怎么补”这类说明；失败只保留在 iframe 内的简短弹框。

后续建议顺序改为：T177 Boss 试炼第二版；T178 特殊事件池扩容；T179 成就图鉴扩容；T180 无尽和每日深度化；T181 路线奖励和局外能力深化；T182 Web 数值平衡和内容冻结。Cocos 正式表现层、音乐、美术、动效和发布资源等 Web 内容冻结后再接，不要让 Cocos 追着仍在变化的 Demo 重复返工。

T177 已完成 Boss 试炼第二版。当前 HTML 原型已具备 `BOSS_TRIAL_PHASES`、`BOSS_TRIAL_VARIANTS`、阶段目标、`Boss 奖励品质` 和 `bossReview` payload；第 10 关中段试炼、第 20 关胡了卜王、高阶 Boss 和无尽 Boss 有不同变体。当前口径下这些信息不再扩成外层结算解释卡，高阶 Boss 仍会显示 `高阶 Boss 变体`，且不套普通教程目标。

T185 继续推进中。除了把主线、每日和高阶的事件触发点往中后段补齐之外，当前还把每日第 `12 / 14 / 16 / 18 / 20` 关前、高阶第 `11 / 13 / 15 / 17 / 19 / 20` 关前的后段事件偏置补进去了。现在这两条线不只是“事件出现更多”，而是后半程会更明确地往信息、续压、挡墙、封口和终局封尾几类内容味道推进。

T185 当前也顺手收了终章前后的硬压：第 `17 / 18 / 19` 关牌量从 `336 / 348 / 360` 收到 `330 / 340 / 348`，字牌权重和孤张预算各回落一格；`胡了卜王` 终章目标则保留复合检查，但把 `碰 2` 收到 `碰 1`、积分目标从 `180` 收到 `170`。后续再看主线终章手感时，应以这组新口径为准，不要再把旧 360 牌 / 180 分 / 碰 2` 当默认终章基线。

T185 还继续把无尽 / 每日终局的后段叠压收了一格。无尽后段章节 Boss 记分线先从 `170 + 章节 * 20` 收到 `168 + 章节 * 18`，随后又继续收成 `166 + 章节 * 17`；第 `7 / 8` 相位在章节主题已经自带双组合目标时，也不再额外挂通用 `碰 1`。每日第 20 关终局 Boss 则保留词缀口味，但 `碰` 目标压回 `1`、分数线封顶 `190`，而且现在只再挂 `1` 个词缀重点组合，不再默认叠 `2` 个额外目标。后续如果再验无尽 56-60 层和每日终局，要以这组新口径为准，不要再按旧的 `340` 和 `206` 分去看。

T178 已完成特殊事件池第二版第一轮扩容。当前 HTML 原型已具备 `SPECIAL_EVENT_RARITIES`、`SPECIAL_EVENT_TAGS`、`EVENT_BUILD_LINKS` 和更贴构筑线的事件选择逻辑；普通 run 新增 `河灯旧约 / 封盘押后 / 险招翻倍`，高阶 run 会优先出现更贴当前构筑的事件。当前口径下不再把这些事件信息继续展开到外层结算页。

T179 已完成成就图鉴第二版第一轮扩容。当前 `/games/hulebu` 的图鉴面板已从第一版 8 张平铺卡扩成 `图鉴总览 / 分类进度 / 分组列表` 结构；新增 Boss、事件、高阶和路线目标，并为一部分高阶 / Boss / 事件目标增加了 `未揭示目标` 隐藏态。旧存档 hydration 会继续按 `bestEndlessLayer / dailyBestLevels / bestAscensionLevel / upgrades / lastSettlement / bossReview / specialEventReview` 自动补算新增成就，不需要新增后端字段。

T180 已完成无尽和每日深度化。当前 HTML 原型已新增 `getEndlessChapterProfile()` 和 `getDailyMutatorProfile()`：无尽第 21 层后按每 5 层一个章节推进，并在章节尾部挂 `章节 Boss` 压力；每日牌局第二版新增 `今日词缀 / 今日奖励 / 连续参与` 三个长期信号。`/games/hulebu` 外层局外页现在会显示 `当前章节 / 章节 Boss / 无尽最高` 与 `今日词缀 / 今日奖励 / 连续参与 / 今日最佳`，结算页也会显示对应摘要。站内静态 Demo 已同步保持 `/games/hulebu-demo/config/*.json` 绝对资源路径。

后续建议顺序改为：T181 路线奖励和局外能力深化；T182 Web 数值平衡和内容冻结。Cocos 正式表现层、音乐、美术、动效和发布资源等 Web 内容冻结后再接。

T186 目前已经不只停在规划文档里。`/games/hulebu` 外层首页已把 `路线挂载` 收口成 `局外偏好`，而 `runArchetype` 会实传到内层原型并主导开局加成、奖励/事件偏置和终章 Boss 的本局打法口径。后续继续补主线内容时，不要再把新的奖励、事件或 Boss 校验重新挂回 `preferredRoute` 当主轴。

T186 奖励池也已经收窄到同一口径：`preferredRoute` 的基础偏好池只轻补一张协同奖励，不再附带后段路线 bias；`runArchetype` 才是后半程奖励加权和本局 build 身份的主轴。

T186 事件池和终章 Boss 也已同步收口：`preferredRoute` 只轻补一个基础偏好事件，高阶事件不再额外挂旧局外偏好；终章 Boss 面板使用本局 `runArchetype` 标签做压力说明。后续扩事件、Boss 或主线验证时，优先挂本局流派、长期模式或高阶构筑，不要再把旧路线挂载当本局身份。

T186 最终术语扫尾也已完成。外层自动候选统一改为 `自动偏好`，内层 Boss 阶段目标统一改为 `本局流派主骨`；后续交接时不要再恢复 `自动挂载 / 当前路线主骨` 这类旧路线主轴文案。

T187 已补刷新后继续当前本轮。`/games/hulebu` 外层本地状态现在会保存未完成 `activeRun`，刷新后恢复到当前关或无尽当前层的开局；失败和通关会清除快照。注意这不是完整中局云存档，不恢复牌桌、卡槽、牌河和事件弹窗。

T188 已把 `activeRun` 恢复快照接进账号进度。`HulebuProgress.activeRun` 是 nullable JSON，GET/POST `/api/games/hulebu/progress` 会读写它；前端登录同步时在本地和账号快照之间按 `updatedAt` 选择更新的一份。后续若要恢复牌桌中局状态，需要另开任务设计完整状态序列化。

T189 已确认旧 Cocos 工程可以复用。后续不要推倒重建 `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/`，应先按 `docs/tasks/items/T189-hulebu-cocos-reuse-catchup-plan.md` 做追平：第一步同步 Web 当前 v6 视觉资源和牌面映射，第二步追平有限牌河、明牌组、补杠、震落、满槽救场和提示，第三步再接 Boss、事件、无尽、每日、高阶和局外成长。正式动 Cocos 代码前需要另开代码任务并解除当前 T189 的文档-only 范围。

T190 已把 Web 当前 v6 视觉资源接入 Cocos。后续打开 Cocos 工程时，牌山应通过 `HulebuTileSpriteCatalog` 加载 `assets/resources/ui/v6/tiles/mahjong/**`，组合按钮会通过 `ComboBarBinder` 优先加载 `assets/resources/ui/v6/buttons/combo/**`。本轮只接资源和按钮显示，不追 Boss、事件、无尽、每日、高阶；下一轮建议继续做槽位/工具按钮/HUD 的真实 Sprite 绑定，或者开始追平有限牌河和明牌组。

T191 已继续把 v6 槽位、HUD 和右侧工具按钮绑定到 Cocos 脚本。下一轮如果继续搬 Web 现有玩法，建议优先做有限牌河和明牌组的数据结构与显示：Cocos 当前仍主要是主槽 + 牌山 + 基础组合，尚未追平 Web 的牌河、明牌、补杠、震落和满槽救场。

T192 已补上 Cocos 的有限牌河、明牌组和补杠基础结构。后续继续搬 Web 玩法时，优先接工具按钮真实交互：右侧 `提示` 目前只是 v6 图片，Web 里对应的是丢弃/打牌到牌河能力；Cocos 已有 `discardSlotTile()` 可被按钮调用，但还没有按钮选择态。再下一步是补 `杠 / 胡` 震落牌和满槽救场。

T193 已把右侧工具按钮接到牌河交互：Cocos 右侧 `打牌` 会进入丢弃选择态，随后点击主槽牌会打入牌河。后续继续追 Web 玩法时，下一优先级是 `杠 / 胡` 震落牌、满槽救场和撤回历史栈。

T194 已补 Cocos 的基础震落与满槽救场。后续继续追 Web 玩法时，优先补撤回历史栈和洗牌真实逻辑；再往后接 Boss、事件、无尽、每日、高阶和局外成长。震落当前是 runtime 位置变化和可点状态变化，尚未做动画。

T195 已补 Cocos 洗牌和撤回真实交互。后续继续追 Web 玩法时，工具链基础已具备 `洗牌 / 撤回 / 打牌入河`，下一步建议进入 Boss 目标、特殊事件或无尽/每日模式接入。当前洗牌为确定性轮转重排，便于测试；后续如果要更接近 Web 随机洗牌，可在保留可测试 seed 的前提下替换。

T196 已补 Cocos Boss 目标基础接入。第 10/20 关已有 `bossGoals`，runtime 会记录组合次数、花色集合和积分目标进度，HUD 会显示 Boss 摘要；通关判断已从单纯清牌改为 `isLevelCleared()`。

T197 已补 Cocos 奖励效果基础接入。奖励节点不再只是推进流程，`reserve_plus_1 / shield_plus_1 / first_protect_shield / undo_plus_1 / vision_plus_1 / shuffle_plus_1 / coin_plus_20 / chi_score_plus_8 / peng_score_plus_10 / gang_score_plus_25` 已能累计到本轮状态并影响下一关 runtime。

T198 已补 Cocos 特殊事件基础接入。第 `6 / 8 / 10 / 14 / 18` 关前会弹出关前事件三选一，事件效果通过本关修饰器传入 runtime，支持本关铜钱、撤回补给、禁看山和禁洗牌，进入下一关会自动清空本关事件状态。后续可以继续补事件卡美术、事件稀有度、高压生成器词缀以及无尽/每日/高阶事件分支。

T199 已补 Cocos 长期模式入口基础。配置层有 `HulebuRunProfile`、`HULEBU_MAINLINE_RUN_PROFILE`、`HULEBU_ENDLESS_RUN_PROFILE`、`createHulebuDailyRunProfile()` 和 `getHulebuLevelIndexForRunOrder()`；Controller 有 `startMainlineRun()`、`startEndlessRun()` 和 `startDailyRun()`。当前只是入口和关卡映射基础，无尽/每日还没有专属奖励、Boss、结算或局外存档。

T200 已补 Cocos 局外成长基础接入。runtime 新增 `HulebuMetaUpgradeState` 和 `createHulebuMetaUpgradeState()`，六轴覆盖备用槽、护符、初始工具、河道扩容、开局铜钱和看山预置；Controller 通过 `applyMetaUpgrades()` 持有并在启动关卡时传入 runtime。当前还没有 Cocos 局外 UI、账号同步或存档序列化，只是让正式工程能先承接成长数值。

T201 已补 Cocos 本局流派基础接入。配置层新增 `HULEBU_RUN_ARCHETYPES`，第一版包含 `顺吃流 / 碰开流 / 开杠流 / 追胡流 / 道具流 / 信息流`；runtime 新增 `HulebuRunArchetypeState`，会把流派的工具、铜钱和组合得分加成合入本局；Controller 通过 `selectRunArchetype()` 在开局前切换流派并传入 runtime。当前还没有 Cocos 开局流派选择 UI、账号存档或局外入口传参。

T202 已补 Cocos 开局流派选择 UI。`GameSceneController` 现在有 `archetype` phase，新 run 启动会先显示“选择本局流派”弹层，六个选项来自 `HULEBU_RUN_ARCHETYPES`；点击选项后调用 `selectRunArchetype()` 并进入主线、无尽或每日的首关。当前仍是程序化按钮，尚未做最终卡面美术、动画、局外首页或账号传参。

T203 已补 Cocos 局外模式入口。`GameSceneController` 现在有 `lobby` phase，默认启动先显示“胡了卜”局外弹层，提供 `主线 / 无尽 / 每日` 三个模式按钮；点击后会进入 T202 的本局流派选择，再进入对应模式首关。通关后的按钮也改为回到局外入口。当前尚未接账号进度、成就图鉴、高阶周目或最终首页美术。

T204 已补 Cocos 局外成长 UI。`GameSceneController` 现在有 `meta` phase，大厅 `升级` 按钮会打开“局外成长”面板；备用槽、护符、工具、牌河、铜钱、看山六轴按钮会调用 `applyMetaUpgrades()` 更新等级并刷新面板，下一局启动时通过既有 runtime 参数链路生效。当前仍是程序化面板，尚未接账号同步、铜钱消耗、升级上限或最终美术。

T205 已补 Cocos 高阶周目入口基础。`HulebuLevelConfig` 现在有 `advanced` run mode、`HulebuAdvancedRunTier` 和东风场、南风场、西风场、北风场四档 profile；`GameSceneController` 现在有 `advanced` phase，大厅 `高阶` 按钮会打开四档风场选择，选择后复用本局流派选择并启动对应高阶 run。当前高阶先复用主线后半段关卡压力，尚未接高阶词缀、能力槽压缩、账号解锁或高阶专属奖励。

T206 已补 Cocos 局外铜钱和升级成本闭环。`GameSceneController` 现在持有本地 `metaCoins`，通关回大厅前会发放局外铜钱；局外成长面板显示当前铜钱、等级和下一档价格，升级会校验价格、扣除铜钱并受六轴上限约束。当前只是 Cocos 本地预览钱包，尚未接账号同步、真实持久化、正式经济曲线或最终成长面板美术。

T207 已补 Cocos 高阶风场压力基础。高阶四档现在每关都会生成本关修饰器并与特殊事件合并：东风看山 -1，南风禁洗牌，西风继续扣撤回/看山，北风禁洗牌和看山并扣撤回/打牌。后续继续做高阶时，可以在此基础上补高阶专属奖励、能力槽、账号解锁和专属结算。

T208 已补 Cocos 高阶专属奖励基础。高阶奖励节点现在会按东/南/西/北风场优先展示对应专属奖励，再用普通奖励补足 3 个选项；这些奖励已接入现有 runtime reward state，可影响工具、护符、备用槽、开局铜钱和组合分数。后续可继续扩高阶能力槽、专属事件权重、账号解锁与最终奖励卡美术。

T209 已补 Cocos 高阶能力槽基础。高阶 run 现在按 `风场选择 -> 高阶能力选择 -> 本局流派选择 -> 开局` 的顺序启动；能力配置第一版包含 `封盘护河 / 迟火 / 牌尾缓冲`，通过本轮奖励和每关修饰器影响后续 runtime。后续可继续接账号解锁、多槽装备、能力升级和最终卡面美术。

T210 已补 Cocos 高阶事件池基础。事件节点现在会按高阶风场优先展示 `东风试胆 / 南桌续押 / 西风照听 / 北风断尾`，并用普通事件补齐选择；事件效果沿用 `coin / tool / forbid_tool`，可直接进入本关 runtime modifier。后续可继续接事件稀有度、构筑权重、每日/无尽事件变体和最终事件卡美术。

T211 已补 Cocos 事件元信息基础。普通事件和高阶事件现在都有 `rarity / tags / dangerLevel`，事件弹层会展示稀有度、风险和标签；本轮不改事件抽取权重、不做构筑联动算法，也不替换最终事件卡美术。后续接事件卡或无尽/每日事件变体时，直接复用这些字段。

T212 已补 Cocos 无尽/每日事件变体。`getHulebuSpecialEventChoices()` 现在会根据 run profile 优先取高阶、无尽或每日专属事件池，再用普通事件补足；无尽第一版是 `长山补给 / 深山留尾`，每日第一版是 `今日手气 / 今日变招`。本轮不做真实每日日期权重、不做构筑联动算法，也不新增 runtime effect 类型。

T213 已补 Cocos 本局流派事件偏置。`getHulebuSpecialEventChoices(levelOrder, profile, archetypeId)` 现在支持第三个参数；Controller 会传当前本局流派。事件选择顺序是 `本局流派事件 -> 模式事件 -> 普通事件`，六个流派分别有一张第一版事件。本轮仍不做完整权重算法、真实构筑识别复盘或最终事件卡美术。

T214 已补 Cocos Boss 变体基础。后续继续做 Boss 时，不要再只读取裸 `bossGoals`；应通过 `createHulebuRuntimeLevelForRun(levelIndex, runProfile, displayOrder)` 创建 runtime level，让主线、高阶、无尽、每日 Boss 自动带上对应变体名称和目标补丁。当前仍未做 Boss 阶段动画、Boss 卡面美术或结算复盘。

T215/T222 已补 Cocos 当前本轮继续与当前关中局恢复基础。当前 `HulebuActiveRunSnapshot` 已可携带当前关 runtime 快照，继续本轮会优先恢复中局牌桌、卡槽、牌河、明牌区、震落牌、分数和工具次数；缺快照时才回退到当前关开局。后续如果要继续扩到账号同步或跨设备恢复，建议继续复用 `HulebuActiveRunSnapshot` 和 `HulebuRuntimeSnapshot`，不要另起一套 run 恢复字段。

T216 已补 Cocos 最近一轮结算摘要基础。当前 `lastSettlement` 只记录最小摘要，不含 Boss 复盘、事件复盘或完整结算页字段；后续如果要接本地结算面板或账号同步，可以在现有 `HulebuSettlementSnapshot` 上扩字段，不要和 `activeRun` 混成同一份快照。

T217 已补 Cocos 本地长期进度基础。当前 `metaProgress` 只覆盖无尽最高层、每日 seed 最佳关序和高阶最高风场，主线仍继续沿用最近一轮摘要口径；后续如果要补主线长期星级、账号同步或更完整局外生涯面板，建议继续在 `HulebuMetaProgressSnapshot` 上扩字段，不要把长期进度塞回 `lastSettlement`。

T218 已补 Cocos 局外生涯总览基础。当前 `生涯` 面板先走最小摘要口径，只集中展示本地铜钱、六轴成长等级、最近一轮和长期模式进度；后续如果要做完整图鉴、成就分类卡、账号同步或更丰富的局外生涯页，建议继续扩 `collection` phase 和 summary helper，不要把大块说明文案塞回大厅主入口。

T219 已补 Cocos 成就图鉴最小版基础。当前本地成就只接首批 8 项，并且直接挂在 `生涯` 面板里展示总数、下一项目标和首批图鉴摘要；后续如果要做完整分类卡、隐藏目标第二版、账号同步或更完整图鉴页，建议继续沿用 `HULEBU_ACHIEVEMENTS` 和 `HulebuAchievementSnapshot` 扩字段，不要重新起一套局外图鉴存储口径。

T220 已补 Cocos 主线独立长期进度基础。当前 `metaProgress` 现在除了无尽、每日和高阶外，也开始记录 `bestMainlineLevel`；大厅主线按钮和生涯面板会优先显示 `最高第 X 关`。后续如果要补主线星级、章节章印或账号同步，建议继续扩 `HulebuMetaProgressSnapshot`，不要再把主线长期状态塞回 `lastSettlement`。

T221 已补 Cocos 局外档案本地持久化基础。当前 `metaCoins` 和 `metaUpgrades` 已从单局 active run 快照中拆出独立 `meta profile` 本地快照，启动大厅、回大厅、局外升级和通关发钱都会稳定读写。后续若接账号同步，建议以这层 `meta profile` 为局外档案入口，不要再把局外成长反向塞回 active run 做主存档。

T222-T224 已把 active run 恢复从“当前关中局”继续推进到“关间 phase”和“开局前 flow”。当前 `HulebuActiveRunSnapshot` 除了 runtime 快照外，还会记录 `resumablePhase` 和 `pendingRunProfile`，因此 `cleared / reward / event / advancedAbility / archetype` 节点都可恢复。接下来如果要继续补账号同步或跨设备恢复，建议沿着 active run 的 phase 状态继续扩，不要把这些状态再混回 runtime 快照。

T225 已把每日牌局从“有 daily 入口”推进到“有 daily 长期信号”。当前 Cocos 配置层已有每日词缀 helper，`metaProgress` 已记录 `dailyStreak / lastDailySeed`，大厅每日按钮和生涯总览会展示今日词缀、今日奖励、今日最佳与连续参与。后续若接账号同步、每日领奖仓库或更完整每日面板，建议继续沿用 `daily mutator / daily streak` 这层口径，不要把每日状态混回 `lastSettlement` 或 `activeRun`。

T226 已把 Cocos 本地档往现有账号体系上接了一条第一版桥。当前 `GameSceneController` 在浏览器环境下会尝试 GET/POST `/api/games/hulebu/progress`，并把局外铜钱、六轴成长、无尽最高层、每日最佳/连续参与、成就和当前本轮快照映射进账号进度；未登录或接口不可用时会继续回退本地档。当前仍未把 `lastSettlement / bestMainlineLevel` 扩进服务端模型，也未做完整跨设备中局冲突解决；如果后续继续深化账号同步，建议沿现有桥接 helper 扩字段，不要另起第二套 Cocos 存档协议。

T227 已把 Cocos 明牌区、牌河、主槽和备用槽从“文字调试态”推进到“真实牌面优先”。当前 `MeldRiverLayerBinder` 会按 `碰 / 杠 / 补杠` 展示 3-4 张真实同牌，牌河展示单张弃牌；`SlotLayerBinder` 会在主槽和备用槽优先挂真实麻将牌面，并保留槽位背板和文字 fallback。后续如果继续追 HUD、生涯或结算层视觉，不要再回退到纯文字牌区口径。

T228 已把 Cocos 同类多候选组合从“默认第一组”推进到“玩家点选”。当前 `HulebuRuntimeState.getComboCandidateOptions()` 会返回指定组合类型的全部候选，`GameSceneController` 对多组 `吃 / 碰 / 杠 / 补杠 / 胡` 候选会弹出组合选择面板；候选项优先显示真实小牌面，选择后按对应 `candidate key` 执行。后续继续改组合按钮时，不要绕回 `comboControls[0].candidateKey` 直接代打多候选。

T229 已修复 Cocos Web Preview 因跨工作区 import 找不到 `packages/shared/src/mahjong-mountain-generator` 的启动报错。当前 Cocos 运行时脚本只能引用工程内模块，`HulebuLevelConfig.ts` 改为导入本地 `config/HulebuMountainGenerator.ts`。后续如果需要让 Cocos 复用 shared 算法，必须通过 Cocos 工程内镜像模块、构建产物或 Creator 可解析的包路径接入，不要直接用很长的 `../../packages/shared/src/*` 相对路径。

T239 被压牌点击防线已收成 BoardRoot 统一手动 hit-test。不要再回退到单牌 `Button.enabled` 或每张牌自己的点击事件：Cocos 3.8.8 发布包里这条链路不稳定。当前做法是在 BoardRoot 上加全屏 `UITransform`，统一监听 `TOUCH_END`，用 `EventTouch.getUILocation()` 加当前 model 的事件坐标矩形找最高层命中牌；覆盖阈值已从 5% 收紧到 `0.001`，只要有更高层实际覆盖就灰化并禁点。首轮可点上限修正仍采用“找一张 free blocker 盖住另一张 free target”的方式，但不会新增超出当前最大层的视觉层级。已通过共享测试、Cocos TypeScript、Cocos Web Mobile 非 debug 构建和系统 Chrome 点击验证。

T239 点击错位回归已修正。不要用 `UITransform.getBoundingBoxToWorld()` 做牌山点击命中：在当前 web-mobile 发布包里，它和 `EventTouch.getUILocation()` 不在同一坐标口径，会造成“点这张牌，入槽另一张牌”。`BoardLayerBinder` 现在用 `getTileEventRect()` 从 `HulebuBoardNodeModel.position` 直接换算到触摸事件 UI 坐标，先找最高层命中牌，再按 `0.001` 覆盖率拒绝被压牌。后续若继续调牌山视觉位置，必须同步验证 3 张以上代表性可点牌的 `tileId / prefabKey` 入槽一致性。

T240 记牌器挂件已从文本 HUD 改成结构化浮层。runtime 会在 `hud.tileCounter` 输出四门和逐牌剩余数，`CounterPlaque` 负责紧凑摘要，点击后展开 `CounterExpandedPanel`，面板里按万/条/筒/字展示小牌面和数量，再点面板收起；展开面板已加 `BlockInputEvents`，避免触摸穿透到牌堆。首关 `validation_intro_peng` 现在显式使用 `long-wall` graph 模板，实测 30 张、6 张初始可点、24 张灰化锁牌；`long-wall` 列距已二次调到横向连续压叠，最终手机视口截图为 `.codex-tmp/hulebu-final-wall-before-click.png`。后续真机/Creator 验收重点看：记牌器展开位置是否正好浮在牌堆上方、移动端是否遮挡右侧工具按钮、灰化被压牌是否仍会吞掉所有点击。

T240 记牌器和首关牌山已补截图验证。`CounterExpandedPanel` 挂在 `ToolOverlayRoot`，层级高于 BoardRoot；手机视口下展开后浮在牌山上方，并保留右侧工具按钮。若后续继续打磨，优先看紧凑态 `CounterPlaque` 文案是否还要进一步简化，以及展开面板在小屏是否需要降低高度；不要把展开态塞回普通 HUDRoot。

T239/T240 旧 active run 已加版本门禁。当前 Cocos active run 版本为 `top-only-long-wall-2026-07-05`，新快照会写入 `boardRevision`；本地 `hulebu-cocos-active-run` 或账号 `cocosSnapshot` 缺失/不匹配该版本时会自动作废并回到大厅。后续如果 Lee 再反馈“普通打开还是旧 cross/高塔牌山或 89 张牌”，优先检查浏览器 localStorage 和账号进度里的 active run 是否为旧版本，不要只看 `HulebuMountainGenerator`。

T239/T240 最新首关口径已改成 3 张顶层牌。当前 active run 版本为 `top-only-three-card-2026-07-05`；首关 `validation_intro_peng` 为 15 张总牌、3 张可点、12 张锁牌，后续关仍保持原本较高牌量。BoardLayer 牌面尺寸已收为 `32x43`、顶层缩放 `1.04`，锁层更暗。Kimi WebBridge 真实 Chrome 验证过：首关 `余牌 15`，底牌边缘点不会入槽，三张顶层牌点击后 slot0 的 tileId 均与被点牌一致。后续不要再把首关可点数改回 5-6。

T239/T240 入口和桌面点击链路已再次收口。当前 active run 版本为 `tutorial-pointer-2026-07-08`，旧 `top-only-three-card-2026-07-05` 快照会失效；普通打开不再先进 lobby，若没有有效 active run 会直接 `startLevel(1)` 到教程首关。BoardLayer 现在仍保留 Cocos `TOUCH_END / MOUSE_UP`，但发布包桌面点击主要依赖 canvas DOM `pointerup / mouseup / touchend` 兜底：用 `rect.width / layout.width` 和 y 轴同口径公式换算到 hit-test UI 坐标，再选最高层命中的牌。已验证 Kimi 真实 Chrome 启动为 `playing / 15 / 3 / 12`，Playwright 鼠标点击中间顶层牌后 slot0 写入 `graph_long-wall_node-010` 且总牌 15->14。后续若再改牌山坐标，必须同时验证 DOM pointer 坐标换算，不要只看 Cocos 节点事件。

T243 已完成正式 Cocos 源码 checkpoint 与 production 构建溯源门禁。后续不要从根脏工作区绕过包装器直接发布，也不要把 `profiles/**`、`temp/**`、`library/**`、`build/**` 或本机 `information.json` 当正式源码；使用 `npm run game:hulebu:build`，让包装器保护并复核精确提交快照，三次核对完整 `CocosCreator.app/Contents` 摘要，并生成 schema 6 manifest。普通目录 promotion 提供隔离 attempt、同步回滚、持久 journal、原子 Creator owner 状态和可重试 tombstone，但不承诺跨平台零间隙目录交换。T244 应恢复既定 M1 边界：拆出 `GameSession / RunStateMachine / ContentRepository / SaveService`，逐步削薄 `GameSceneController`；不要重新扩 Web Demo 或同时重写 UI、音效。

T249/T251 已建立正式 UI 视觉基线和 Batch A+B 分层资源。后续不要继续使用旧 v6 零散组件作为新视觉基准；以 `output/hulebu-ui-assets/hulebu-formal-ui-v1/manifest.json` 的 key、尺寸和状态为准。当前已有背景、HUD、牌槽、动作和工具三态，但尚未复制进 Cocos resources，也未建立 SpriteFrame 映射。下一步先完成 Batch C 的奖励卡、教学/多候选/暂停/设置/结算弹窗和麻将牌面，再统一进入 Cocos 接入；不要提前把整张预览图当运行时背景。

T252 已补齐 formal v1 内容层，正式包现在有 80 个 manifest 资源：Batch A+B 的背景/HUD/牌槽/控件三态，加上 4 张卡片、5 个弹窗和 35 张麻将牌。卡片与弹窗只提供无文字材质底板，后续 Cocos 必须用 Label/节点填标题、正文和按钮，不要把模型文字烘焙进 Sprite。八条已在 formal 包中修为 2×4 标准竹节；后续接入以 formal 包为准，不直接读取旧 v7 路径。下一步是 Batch D Cocos 接入和 production 验收，不再继续扩资源种类。

T253 已处理字牌/背面的 alpha 采样问题。东南西北、中发白和背面现在都共享标准牌体 alpha bbox，且完全透明像素不再保留白色 RGB。Batch D 导入 Cocos 时仍需检查 SpriteFrame trim、texture alpha 和深色背景下的双线性采样，不要改回旧 v7 原始字牌文件。

T254 已进一步清理同一批 8 张资源底座内部的不透明浅色侧壁。构建脚本会从 `y=312` 起只替换不符合绿色特征的白色、米色和棕色像素，并把最下方收成连续绿色；`honorBackGreenLowerLip` 校验已通过。Batch D 应直接使用当前 formal v1 输出，不要重新导回 T253 前的牌图。

T255 已取代 T254 的底唇渐变方案。T254 会形成双层绿色结构，当前构建脚本已删除该重绘，改为从 `y=288` 起复制标准空白牌体；8 张目标资源的下半部与 `wan-01` 逐像素一致。Batch D 必须使用 T255 后的 formal v1，并以 `honorBackStandardLowerBody` 门禁为准。

T256 已进一步取代“保留旧字牌整张牌体”的合成方式。7 张字牌现在都以 `standard-body-blank.png` 为完整底板，只叠加提取后的字形或白板边框；中、发、白使用更严格的内容 alpha 下限以清除旧米白背景。牌体内容区之外由 `honorStandardWhiteBody` 保证与标准牌体逐像素一致。Batch D 不应重新导入旧字牌整图，否则会恢复双层白色边框和贴图感。

T257 已在 T256 基础上为中发白增加连通域过滤，避免旧牌体边缘或纹理噪点重新进入内容层。旧牌背的裁切、拉伸和染色修补全部废弃，当前使用 PPTOKEN 纯文字生成的 `master-sources/back-default-v2.png`：连续青绿玉石面板直接连接一层深绿底座，无白色/米白侧壁或双层结构；构建时映射到标准 alpha bbox，并由 `backNoPaleLowerBody` 门禁检查底座。Batch D 应直接导入当前 formal v1 输出。

T258 已完成 Batch D。Cocos 正式资源入口统一为 `assets/resources/ui/formal-v1/` 和 `HulebuFormalUiCatalog`；不要把主背景、HUD、动作/工具按钮、槽位、卡片或弹层改回 v6。`HulebuTileSpriteCatalog` 的 v6 路径只作为 formal 牌面加载失败时的容错，不是新的视觉基线。精确提交 `1eb7f00e2b2e0fa764096c73b38235c82113fbb1` 已通过 production build，`390×844` 首关实测无控制台错误且选牌可正常入槽。

T259 已把 Cocos 正式局内页收敛到固定竖屏布局。后续不要重新共用动作栏、备用槽和手牌槽的纵向位置；牌山若继续改变 `visualScale`，必须同步维护 `BoardLayerBinder.getTileEventRect()`。八条不可回退到旧 v6 错误连笔图，formal v1 `bamboo-08` 是唯一正确来源。不可点击牌保持深暗态，动作按钮只在候选存在时使用 active 图。碰/杠/补杠副露由 `openMeldNodes` 驱动，补杠识别必须继续依赖已有碰牌区和手槽第四张同牌。

T260 已把被遮挡牌的显示态与点击态收敛为同一个 `selectable` 判定。后续不要只依据配置里的 `model.interactable` 点亮牌面，也不要移除 Sprite 请求键中的 `active / locked` 状态，否则异步加载可能再次把暗牌恢复为亮牌。分数和紧凑记牌器均通过贴图上方的动态值层显示，禁止重新叠加多行 `Label` 或四门长串；记牌器展开详情仍由既有 `CounterExpandedPanel` 承担。

T261 已锁定正式八条和 fallback 叠层口径。八条唯一正确来源是 v7 已确认的上下 `W/M` 形 `tile_bamboo_08.png`，不要再由 formal 构建脚本生成 `2×4` 版本。`BoardLayerBinder` 与 `ComboBarBinder` 的程序化 Graphics 只用于正式 Sprite 加载前或加载失败时的 fallback；加载成功后必须清空。动作按钮资源需要保留透明异形外轮廓，不要重新裁成整块深色矩形。

T262 已完成分数、记牌器和锁牌牌背收口。分数动态数字必须直接叠在正式分数底图上，不要恢复 `DynamicScoreMask`；紧凑记牌器只显示“记牌器”，34 牌详情继续放在 `ToolOverlayRoot/CounterExpandedPanel`，并保持万、条、筒、字四行完整。锁牌统一使用 formal v1 `tile.back -> back-default`，恢复可点后再显示真实牌面；不要用灰色真实牌面代替牌背。production build ID 为 `11b6581eb2e2-20260811T035723Z`。

T263 已修复牌背点击穿透。`selectTileAtUiPoint()` 必须先从所有命中牌中按 sibling 绘制顺序取视觉最上层，再调用 `isTileCurrentlySelectable()`；如果最上层是牌背，要返回已消费但不得调用 `tileClickHandler`。不要恢复“先过滤锁牌、再从可点牌中找命中”的旧顺序，否则点击牌背会再次带动其他正面牌。

T264 已把通关反馈从共用三选一底板改为独立 `settlement` 底板。`drawOverlayPanel()` 的 Sprite 路径参数需要保持显式 `string` 类型，正式 Sprite 加载成功后必须清空程序化 Graphics fallback。流程弹层打开后还会经历一次 HUD 刷新，因此必须在刷新后再次把 `RewardOverlay` 提到 Canvas 顶层，并保留 `OverlayBackdrop` 的 `BlockInputEvents`，否则右侧工具按钮会重新浮到遮罩上或收到穿透点击。

T265 已把顶部正式 HUD 改成“底图负责金边、动态内容面负责文字和数值”。formal v1 关卡、分数、记牌器图片都含烘焙示例值，后续禁止直接再叠 Label；必须保留 `DynamicLevelFace / DynamicScoreFace / DynamicProgressFace` 覆盖示例值，并在 `applyTopPlaqueSprite()` 成功后清空节点 Graphics fallback。记牌器展开位置不再读取牌山 bbox，而是固定在 `CounterPlaque` 下方。已碰牌池只消费 `openMeldNodes`，补杠仍由 runtime 副露状态识别，不要为 UI 另建第二份碰牌记录。

T266 已锁定 formal v1 `settlement` 底图的正文安全区。顶部莲花和流苏会占用面板中心上方区域，通关标题必须保持在 y=`0` 或更低，得分/说明/按钮继续使用 `-28 / -51 / -84`；不要再把标题恢复到旧 y=`46`。

T267 已确认正式场景没有预制 `MeldRiverRoot`，后续必须保留 `ensureMeldRiverLayer()` 的动态创建和 `BoardRoot + 1` sibling 层级，不能退回只查找组件。牌面锁定统一使用 8% 覆盖面积：配置层 `HULEBU_COCOS_STACK_OVERLAP_THRESHOLD` 和表现层 `TILE_LOCK_OVERLAP_THRESHOLD` 必须保持 `0.08` 且使用 `>=`；改动该口径时同步升级 `HULEBU_BOARD_REVISION`。
