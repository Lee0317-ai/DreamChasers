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
59. `docs/tasks/items/T084-hulebu-cocos-graph-generator-integration.md`
60. `docs/tasks/claims/T084-lee.md`
61. `docs/tasks/items/T085-hulebu-play-page-tuner-split.md`
62. `docs/tasks/claims/T085-lee.md`
63. `packages/shared/src/mahjong-config-playable-prototype.test.ts`
64. `apps/game/mahjong-roguelike/prototypes/config-playable/tuner.html`
65. `docs/tasks/items/T086-hulebu-hundreds-tile-mountain.md`
66. `docs/tasks/claims/T086-lee.md`
67. `docs/tasks/items/T087-hulebu-varied-portrait-mountain.md`
68. `docs/tasks/claims/T087-lee.md`
69. `docs/tasks/items/T088-hulebu-visible-scattered-stack-preview.md`
70. `docs/tasks/claims/T088-lee.md`
71. `docs/tasks/items/T089-hulebu-random-merged-stack-overlap.md`
72. `docs/tasks/claims/T089-lee.md`
73. `docs/tasks/items/T090-hulebu-failure-feedback-overlay.md`
74. `docs/tasks/claims/T090-lee.md`
75. `docs/tasks/items/T091-hulebu-compact-board-hud-budget.md`
76. `docs/tasks/claims/T091-lee.md`
77. `docs/tasks/items/T092-hulebu-one-screen-play-hud.md`
78. `docs/tasks/claims/T092-lee.md`
79. `docs/tasks/items/T093-hulebu-friend-playtest-demo.md`
80. `docs/tasks/claims/T093-lee.md`
81. `docs/tasks/items/T094-hulebu-endgame-settlement-design.md`
82. `docs/tasks/claims/T094-lee.md`
83. `docs/superpowers/specs/2026-06-01-hulebu-endgame-settlement-design.md`
84. `docs/tasks/items/T095-hulebu-mixed-window-mountain-generator.md`
85. `docs/tasks/claims/T095-lee.md`
86. `docs/tasks/items/T165-hulebu-complete-experience-roadmap.md`
87. `docs/tasks/claims/T165-lee.md`
88. `docs/superpowers/specs/2026-06-13-hulebu-complete-experience-roadmap-design.md`
89. `docs/superpowers/plans/2026-06-13-hulebu-complete-experience-roadmap.md`
90. `docs/tasks/items/T175-hulebu-web-full-version-roadmap.md`
91. `docs/tasks/claims/T175-lee.md`
92. `docs/superpowers/specs/2026-06-16-hulebu-web-full-version-roadmap-design.md`
93. `docs/superpowers/plans/2026-06-16-hulebu-web-full-version-roadmap.md`

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

后续建议顺序改为：T176 高阶周目完整版；T177 Boss 试炼第二版；T178 特殊事件池扩容；T179 成就图鉴扩容；T180 无尽和每日深度化；T181 路线奖励和局外能力深化；T182 Web 数值平衡和内容冻结。Cocos 正式表现层、音乐、美术、动效和发布资源等 Web 内容冻结后再接，不要让 Cocos 追着仍在变化的 Demo 重复返工。

T176 已完成高阶周目完整版第一大块。当前 `/games/hulebu` 已具备四档高阶入口、局外高阶配置、高阶能力槽、高阶专属奖励、档位事件、构筑识别、失败复盘和结算复盘。北风场补充 `封盘 / 迟火` 能力与 `封终流` 构筑线；静态 Demo 已同步。普通前几关教程仍只作用普通模式，高阶前几关不再套教程。

后续建议顺序改为：T177 Boss 试炼第二版；T178 特殊事件池扩容；T179 成就图鉴扩容；T180 无尽和每日深度化；T181 路线奖励和局外能力深化；T182 Web 数值平衡和内容冻结。Cocos 正式表现层、音乐、美术、动效和发布资源等 Web 内容冻结后再接，不要让 Cocos 追着仍在变化的 Demo 重复返工。

T177 已完成 Boss 试炼第二版。当前 HTML 原型已具备 `BOSS_TRIAL_PHASES`、`BOSS_TRIAL_VARIANTS`、阶段目标、`Boss 奖励品质` 和 `bossReview` payload；第 10 关中段试炼、第 20 关胡了卜王、高阶 Boss 和无尽 Boss 有不同变体。`/games/hulebu` 外层结算页已接入 `Boss 复盘` 卡片。高阶 Boss 会显示 `高阶 Boss 变体`，且不套普通教程目标。

T178 已完成特殊事件池第二版第一轮扩容。当前 HTML 原型已具备 `SPECIAL_EVENT_RARITIES`、`SPECIAL_EVENT_TAGS`、`EVENT_BUILD_LINKS` 和更贴构筑线的事件选择逻辑；普通 run 新增 `河灯旧约 / 封盘押后 / 险招翻倍`，高阶 run 会优先出现更贴当前构筑的事件。`/games/hulebu` 外层结算页已接入 `最近事件` 卡片。

后续建议顺序改为：T179 成就图鉴扩容；T180 无尽和每日深度化；T181 路线奖励和局外能力深化；T182 Web 数值平衡和内容冻结。Cocos 正式表现层、音乐、美术、动效和发布资源等 Web 内容冻结后再接。
