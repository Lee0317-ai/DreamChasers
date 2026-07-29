# 新想法与需求变更入口

**最后更新**：2026-07-29
**用途**：当任意一方有新想法，或让 AI 帮忙规划新功能时，必须先走本流程，再进入实施。

## 1. 核心规则

- 新想法不能直接进入开发。
- 新想法必须先记录到本文件。
- AI 可以帮助补全方案，但必须先把结果写入 `docs/tasks/TASK_BOARD.md`。
- 没有任务编号、负责人、文件范围和验证方式，不允许进入实施。
- 如果新想法会影响另一方文件范围，必须先在 `docs/tasks/CLAIMS.md` 登记冲突或交接。

## 2. 新想法处理流程

1. 记录想法到本文件的“待评估想法”区域。
2. AI 或负责人把想法整理成变更卡。
3. 判断影响范围：
   - 是否影响现有任务。
   - 是否影响另一方负责文件。
   - 是否需要新增模块文档。
   - 是否需要新增决策记录。
4. 如果值得做，写入 `docs/tasks/TASK_BOARD.md`，状态设为 `待拆分` 或 `待领取`。
5. 如果涉及文件冲突，写入 `docs/tasks/CLAIMS.md` 的冲突登记。
6. 只有当任务进入 `待领取`，并且有人在 `CLAIMS.md` 领取后，才能实施。

## 3. 变更卡模板

```md
### IDEA-YYYYMMDD-XX：想法标题

- 提出人：
- 提出时间：
- 背景：
- 目标：
- 不做：
- 用户价值：
- 涉及模块：
- 可能影响文件：
- 是否影响另一方任务：是 / 否
- 是否需要新增任务：是 / 否
- 建议优先级：P0 / P1 / P2 / P3
- 验收标准：
- AI 初步方案：
- 处理结论：待评估 / 已入任务池 / 暂不做 / 合并到已有任务
- 对应任务编号：
```

## 4. 待评估想法

### IDEA-20260729-01：胡了卜 Cocos 正式版改为竖屏优先验收

- 提出人：Lee
- 提出时间：2026-07-29
- 背景：T244 production 浏览器验收确认 `390×844` 竖屏可完整显示 HUD、牌山、组合栏、卡槽和工具栏，但 `1280×720` 横屏下部分操作区超出视口。Lee 明确后续较大概率发布为微信小程序，不需要为横屏发布场景做适配。
- 目标：把 T244 的正式包交互 smoke 收敛为微信小程序方向的竖屏视口验收；横屏布局不再阻塞 T244，也不登记此前拟议的 T246。
- 不做：不修改 Binder、UI、layout、场景、资源或玩法代码；不承诺横屏体验；本变更不等同于微信小游戏/小程序构建链路、登录、分享、广告、审核或发布接入已经完成。
- 用户价值：避免为非目标发布方向投入横屏适配成本，把当前里程碑集中在竖屏正式包核心玩法、存档恢复与稳定性。
- 涉及模块：胡了卜 Cocos v1 M1 验收、任务与模块交接文档。
- 可能影响文件：T244 任务/领取/计划/进展/完成文档、`docs/tasks/CHANGE_INTAKE.md`、麻将 Roguelike 模块文档及同步生成的任务摘要。
- 是否影响另一方任务：否
- 是否需要新增任务：否
- 建议优先级：P0
- 验收标准：在 production 包的竖屏移动视口完成首关真实点击入槽、组合、刷新恢复、多候选 exact choice 与一次清关；控制台无未处理异常；任务文档明确横屏不在当前发布目标范围。
- AI 初步方案：复用精确提交 production 包，只调整验收口径与文档，不改运行时代码；完成竖屏交互 smoke 后关闭 T244 阻塞。
- 处理结论：合并到已有任务
- 对应任务编号：T244

### IDEA-20260722-01：修复 Cocos 精确快照真实路径构建

- 提出人：Lee
- 提出时间：2026-07-22
- 背景：T244 最终 production 浏览器验收发现黑屏。构建日志和两个隔离实验确认：`os.tmpdir()` 在 macOS 返回 `/var/...`，而 Cocos 编译器会把脚本路径规范化为 `/private/var/...`；资产库仍按前者登记，导致用户脚本未注入 `_RF.push(script UUID)`，场景中的五个组件被判定为 missing class。同一提交直接从 `/private/tmp` 构建即可正常注册组件并渲染画面。
- 目标：新增 T245，让精确提交快照创建在 `temporaryRoot` 的真实路径下，消除 Cocos 资产库与脚本编译器的路径身份分裂，并用回归测试锁定该约束。
- 不做：不修改玩法、Controller、Binder、场景、资源、正式内容数值、release 配置、Cocos settings/profiles/temp/library/build 产物或其他模块。
- 用户价值：production 构建不再生成 HTTP 可访问但运行时黑屏的伪成功包，T244 可继续完成真实浏览器交互和存档恢复验收。
- 涉及模块：胡了卜 Cocos production release 构建链路。
- 可能影响文件：`apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs`、`packages/shared/src/hulebu-cocos-release.test.ts`、T245 任务/领取/进展/完成文档及麻将模块交接文档。
- 是否影响另一方任务：否；修复限定在 Lee 负责的胡了卜发布链路，并作为 T244 最终验收的阻塞依赖处理。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：单元测试证明符号链接临时根会被规范化为 realpath；发布测试通过；干净 worktree 的真实 Creator production build 不再出现 missing class；verify-only、浏览器画面和 `git diff --check` 通过。
- AI 初步方案：在创建精确提交快照前仅对 `temporaryRoot` 调用 `fs.realpathSync`，不改变 checkout 内容、提交绑定、清洁门禁或 promotion 语义；先写失败测试，再实现一行路径规范化。
- 处理结论：已入任务池
- 对应任务编号：T245

### IDEA-20260629-01：AI 修图批量品牌填充和 AI 溶图

- 提出人：Lee
- 提出时间：2026-06-29
- 背景：AI 修图已完成本地工作台，`AI 美颜` 已迁到平台 AI Gateway。Lee 新增电商/内容生产类需求：一是对单张或批量图片添加左上角短字、前置 logo 和右下角 LOGO；二是把产品图与雪山等背景图通过 AI 自然融合，解决简单抠图贴背景的假感。
- 目标：新增 T165，先完成需求归档和后续实现拆分，明确批量品牌填充与 AI 溶图/场景融合的产品边界、实现顺序和验证口径。
- 不做：本任务不直接实现代码；不接真实额度扣减；不新增真实 API key；不修改 PDF、游戏、TimePick、账号、Prisma、部署、package 或 env；不扩大到完整批量 AI 处理中心。
- 用户价值：让用户能快速给多张图片统一加品牌标识，并能把产品图自然放入户外、雪山等营销场景中，提升电商图和内容图的生产效率与真实感。
- 涉及模块：AI 修图工具。
- 可能影响文件：`docs/modules/photo-editor/**`, `docs/tasks/items/T165-ai-photo-batch-branding-and-scene-blend.md`, `docs/tasks/claims/T165-lee.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-06-29-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`。
- 是否影响另一方任务：否。本任务限定在 AI 修图模块文档和任务归档范围，不修改应用代码。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：T165 任务分片和领取分片存在；`NEXT_ID.md` 已递增；AI 修图模块文档记录两个新增需求及后续实现建议；`npm run docs:sync` 和 `git diff --check` 通过。
- AI 初步方案：先做非 AI 批量品牌填充，复用 Canvas、本地文字、贴纸和导出能力；再做 AI 溶图/场景融合，继续走平台 AI Gateway 和任务化流程，输入产品图、背景图、可选主体位置和场景提示，并验证 provider 多图编辑能力。
- 处理结论：已入任务池
- 对应任务编号：T165

### IDEA-20260616-04：胡了卜特殊事件池扩容

- 提出人：Lee
- 提出时间：2026-06-16
- 背景：T163 已完成特殊事件第一版，T176/T177 已分别补高阶周目和 Boss 第二版。当前事件仍停留在少量固定关前事件，缺事件稀有度、正负事件分层、构筑联动和高阶专属事件，支撑不起完整版的中后期变化。
- 目标：新增 T178，在 Web 版内完成特殊事件池第二版：补事件稀有度；新增低风险、风险换高奖和构筑联动三类事件；为高阶 run 加专属事件；把事件信息同步到 `/games/hulebu` 外层结算和静态 Demo 可见文案。
- 不做：不改 Cocos 工程；不做成就图鉴扩容、无尽/每日深度化、路线奖励和局外能力深化或 Web 数值冻结；不改 `levels.json`、`rewards.json`、PDF、AI 修图、TimePick、账号中心或 AI Gateway。
- 用户价值：事件不再只是早期三次固定弹窗，而会成为主线后半段、高阶和构筑路线的持续分叉点；玩家能感觉到这一局是“稳吃奖励”“冒险换稀有”“顺着 build 继续做深”。
- 涉及模块：胡了卜站内壳层 / HTML 试玩原型 / 站内静态 Demo / 共享测试 / 模块文档。
- 可能影响文件：`apps/web/src/modules/games/hulebu/**`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`, `docs/tasks/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/**`, `docs/completion/**`。
- 是否影响另一方任务：否。本次只改胡了卜 Web 侧和对应文档测试。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：主线和高阶事件池至少区分稀有度与类型；新增构筑联动和高阶专属事件；事件选择结果会反映在 HUD/结算信息里；测试、类型检查、构建、脚本检查、文档同步和桌面/移动端浏览器检查通过。
- AI 初步方案：先新增 T178 文档和规格；再用 TDD 锁定 `SPECIAL_EVENT_RARITIES`、`SPECIAL_EVENT_TAGS`、`EVENT_BUILD_LINKS`、`ASCENSION_SPECIAL_EVENT_RARITIES` 和事件复盘文案；随后扩展 HTML 原型事件池选择逻辑与事件说明，并在 React 壳层补充结算侧事件摘要；最后同步静态 Demo 和模块文档。
- 处理结论：已入任务池
- 对应任务编号：T178

### IDEA-20260616-03：胡了卜 Boss 试炼第二版

- 提出人：Lee
- 提出时间：2026-06-16
- 背景：T176 已把高阶周目补到四档和高阶能力配置，但 Boss 仍主要沿用 T164 第一版目标检查。当前 Boss 有第 10 / 20 关目标和基础奖励提示，却还缺阶段变化、目标池差异、奖励品质、复盘信息和高阶 Boss 变体，无法承接完整版后期挑战。
- 目标：新增 T177，在 Web 版内完成 Boss 试炼第二版：建立 Boss 阶段目标池；让普通第 10 关、第 20 关和高阶 Boss 使用不同变体；显示阶段目标、Boss 奖励品质和失败/通关复盘；把复盘信息同步给 `/games/hulebu` 外层结算面板。
- 不做：不改 Cocos 工程；不做特殊事件池第二版、成就图鉴扩容、无尽/每日深度化、路线奖励重构、排行榜、付费、广告或多端同步；不改 `levels.json`、`rewards.json`、PDF、AI 修图、TimePick、账号中心或 AI Gateway。
- 用户价值：Boss 不再只是普通关卡上的额外数字目标，而是成为中段和终局的明确试炼节点；玩家能在失败或通关后知道卡在哪个阶段、奖励品质是什么、下一局应调整什么构筑。
- 涉及模块：胡了卜站内壳层 / HTML 试玩原型 / 站内静态 Demo / 共享测试 / 模块文档。
- 可能影响文件：`apps/web/src/modules/games/hulebu/**`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`, `docs/tasks/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/**`, `docs/completion/**`。
- 是否影响另一方任务：否。本次只改胡了卜 Web 侧和对应文档测试。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：第 10 / 20 关和高阶 Boss 有可区分的 Boss 变体；Boss 局内可见阶段目标与奖励品质；失败和通关会生成 Boss 复盘；外层结算面板能展示 Boss 复盘；普通前几关教程不影响高阶 Boss；测试、类型检查、构建、脚本检查、文档同步和桌面/移动端浏览器检查通过。
- AI 初步方案：先新增 T177 文档和规格；再用 TDD 锁定 `BOSS_TRIAL_PHASES`、`BOSS_TRIAL_VARIANTS`、`bossReview`、`Boss 复盘` 等结构；随后扩展 HTML 原型的 Boss 阶段/变体/复盘 payload，并在 React 壳层结算页显示；最后同步静态 Demo 和模块文档。
- 处理结论：已入任务池
- 对应任务编号：T177

### IDEA-20260616-02：胡了卜高阶周目完整版

- 提出人：Lee
- 提出时间：2026-06-16
- 背景：T175 已确认后续优先补 Web 完整版内容。当前高阶周目仍停留在 T173 的第一版，只开放 `东风场 / 南风场` 两档，词缀和限制较轻，也没有把局外可装备能力和高阶专属奖励真正接进体系。
- 目标：新增 T176，把高阶周目补成完整版：扩展到 `东风场 / 南风场 / 西风场 / 北风场` 四档；新增局外可装备高阶能力；在高阶 run 中开放专属奖励和能力组合；把能力槽限制、起始工具限制、洗牌限制、奖励衰减和更高 Boss 压力真正接到 Web 壳层和试玩页逻辑。
- 不做：不改 Cocos 工程；不做 Boss 试炼第二版、特殊事件池第二版、排行榜、付费、广告、多端同步或普通局外升级重构；不改 PDF、AI 修图、TimePick、账号中心或 AI Gateway。
- 用户价值：主线通关后的高阶玩法不再只是两档轻度词缀，而是形成一个完整的长期挑战结构，既有更明确的限制，也有专属构筑空间。
- 涉及模块：胡了卜站内壳层 / HTML 试玩原型 / 站内静态 Demo / 共享测试 / 模块文档。
- 可能影响文件：`apps/web/src/modules/games/hulebu/**`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`, `docs/tasks/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/**`, `docs/completion/**`。
- 是否影响另一方任务：否。本次只改胡了卜 Web 侧和对应文档测试。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：局外页可见四档高阶与解锁链；高阶配置面板支持装备局外能力；高阶 run 中可见专属奖励和能力组合；内层 HUD 与结算能显示当前高阶档与限制；测试、类型检查、构建、脚本检查和文档同步通过。
- AI 初步方案：先新增 T176 文档和规格；再用 TDD 锁定四档高阶、局外能力存档、高阶奖励和限制文案；随后实现 Web 壳层配置面板、原型参数和高阶专属奖励；最后同步静态 Demo 和模块文档。
- 处理结论：已入任务池
- 对应任务编号：T176

### IDEA-20260616-01：胡了卜先完成网页版完整版再追平 Cocos

- 提出人：Lee
- 提出时间：2026-06-16
- 背景：T174 后 `/games/hulebu` 已具备 20 关主线、局外壳、铜钱升级、路线奖励、无尽、每日、成就、高阶周目和账号进度续层，但这些仍是 Web 完整体验的一轮骨架。原文档建议下一步让 Cocos 追平，但 Lee 明确希望先把网页版完整开发到内容和数值稳定，再补 Cocos、音乐和美术资源。
- 目标：新增 T175，正式调整路线为“网页版完整版优先，Cocos 和音画资源后置”；盘点完整版相对当前 Web Demo 的缺口；拆出后续 Web 内容、系统、平衡和冻结任务顺序。
- 不做：本任务不改玩法代码、不改站内 Demo、不改 Cocos 工程、不生成音乐或美术资源、不做排行榜、付费、广告、多人或完整发布包。
- 用户价值：先在 Web 中把玩法、内容、系统深度和数值跑顺，减少 Cocos 与美术音频反复追改的返工成本。
- 涉及模块：胡了卜任务体系 / 模块文档 / 完整版路线规格。
- 可能影响文件：`docs/tasks/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/2026-06-16-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本次只改胡了卜规划和文档，不占用 Cocos、Web 代码或其他模块文件。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：T175 任务分片、领取分片、路线规格、实施计划、模块 README/PROGRESS/HANDOFF/IMPLEMENTATION_PLAN/DECISIONS 已更新；NEXT_ID 推进到 176；主文档经 `npm run docs:sync` 同步；占位符扫描和 `git diff --check` 通过。
- AI 初步方案：把后续路线拆为四段：先补 Web 版内容深度（高阶周目完整版、Boss 试炼第二版、特殊事件池、成就图鉴、无尽/每日、路线奖励与局外能力），再做 Web 数值和内容冻结；之后 Cocos 按冻结规格追平；最后接音乐、美术、动效和发布资源。
- 处理结论：已入任务池
- 对应任务编号：T175

### IDEA-20260615-04：胡了卜账号进度续层

- 提出人：Lee
- 提出时间：2026-06-15
- 背景：当前 `/games/hulebu` 的无尽最高层、高阶解锁、每日最佳和成就都保存在浏览器本地。用户换设备、清缓存或重新登录后，页面会从 0 开始，看不到自己账号对应的长期进度。
- 目标：新增 T174，把胡了卜长期进度接到账号体系；登录用户打开页面时优先读取账号侧进度，不再总是从 0 开始；结算后能把新进度写回账号；未登录用户继续保留本地存档兜底。
- 不做：不做排行榜、多人同步、跨游戏成就中心、云存档冲突解决器、付费或广告；不改 Cocos 正式工程；不重做 20 关配置、无尽规则、每日规则或高阶规则。
- 用户价值：登录用户在不同浏览器和设备上能续上自己的无尽层数和长期进度，不会每次重新打开都像新号。
- 涉及模块：胡了卜站内壳层 / 账号 API / Prisma 持久化 / 模块文档。
- 可能影响文件：`apps/web/prisma/schema.prisma`, `apps/web/src/lib/account/**`, `apps/web/src/lib/auth/**`, `apps/web/src/app/api/games/hulebu/**`, `apps/web/src/modules/games/hulebu/**`, `apps/web/src/modules/games/hulebu/__tests__/**`, `docs/tasks/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/**`, `docs/completion/**`。
- 是否影响另一方任务：否。本次只改胡了卜网页壳层、账号 API 和对应文档测试。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：登录用户打开 `/games/hulebu` 时会读取账号侧长期进度；无尽最高层、高阶解锁、每日最佳和成就不会每次回到 0；结算后会回写账号进度；未登录用户仍能继续使用本地存档；测试、构建和浏览器检查通过。
- AI 初步方案：新增 T174；先补服务端进度存储模型和读写 API，再让 `HulebuGamePage` 在登录态拉取/合并账号进度并在结算后回写；保留本地存档作为未登录兜底和首次迁移来源。
- 处理结论：已入任务池
- 对应任务编号：T174

### IDEA-20260614-04：胡了卜无尽牌山第一版

- 提出人：Lee
- 提出时间：2026-06-14
- 背景：T169 已完成路线型奖励池，当前 `/games/hulebu` 已具备 20 关主线、局外首页、结算面板、铜钱资产、3 项局外升级和路线型奖励池。完整体验版下一步需要让主线之后有一个长期挑战承接入口。
- 目标：新增 T170，把局外 `无尽` 入口升级为可开始的无尽牌山第一版；无尽从第 21 层开始；iframe 支持 `mode=endless` 和 `startLayer=21`；外层本地记录最高无尽层，并在局外和结算可见。
- 不做：不做每日牌局、成就图鉴、高阶周目、云存档、排行榜、付费、广告或 Cocos 正式工程追平；不改 20 关主线配置、奖励配置或局外升级价格。
- 用户价值：玩家打通或熟悉 20 关主线后，有一个能继续冲层数的轻量长期目标，局外成长和路线型奖励开始有回访承接。
- 涉及模块：胡了卜站内壳层 / HTML 试玩原型 / 站内静态 Demo / 模块文档。
- 可能影响文件：`apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`, `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`, `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `docs/tasks/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/**`, `docs/completion/**`。
- 是否影响另一方任务：否。本次只改胡了卜网页 Demo 和对应文档测试。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：局外页可开始无尽；iframe URL 带 `mode=endless&startLayer=21`；无尽内层显示第 21 层起的层数并能进入下一层；失败或结算后本地最高无尽层可见且刷新保留；测试、构建、脚本语法、桌面端和 390px 移动端浏览器检查通过。
- AI 初步方案：新增 T170；先写失败测试锁定 web 壳层无尽入口和原型 `mode=endless` 参数；再给外层壳加 runMode、bestEndlessLayer 和 startEndlessRun；内层原型复用密集牌山生成器，用层数映射难度和 boss/reward 节奏；最后同步静态 Demo 并更新文档。
- 处理结论：已入任务池
- 对应任务编号：T170

### IDEA-20260615-01：胡了卜每日牌局第一版

- 提出人：Lee
- 提出时间：2026-06-15
- 背景：T170 已完成无尽牌山第一版，`/games/hulebu` 现在具备主线、局外首页、结算、铜钱、升级、路线型奖励和无尽入口，但每日牌局仍只是壳层占位。完整体验版下一步需要补一个每日回访入口。
- 目标：新增 T171，把局外 `每日` 面板升级为可开始的每日牌局第一版；支持固定日 seed 和本地当日最佳记录；每日入口和结算可见。
- 不做：不做成就图鉴、高阶周目、云存档、排行榜、付费、广告或 Cocos 正式工程追平；不改 20 关主线配置、无尽层数规则或局外升级价格。
- 用户价值：玩家除了 20 关主线和无尽外，还有一个每天会变化的轻量回访目标，便于形成固定打开习惯。
- 涉及模块：胡了卜站内壳层 / HTML 试玩原型 / 站内静态 Demo / 模块文档。
- 可能影响文件：`apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`, `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`, `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `docs/tasks/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/**`, `docs/completion/**`。
- 是否影响另一方任务：否。本次只改胡了卜网页 Demo 和对应文档测试。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：局外页可开始每日牌局；iframe URL 带固定日 seed；每日牌局内层有可见的日签或今日提示；本地可见当日最佳记录；测试、构建、脚本语法、桌面端和 390px 移动端浏览器检查通过。
- AI 初步方案：新增 T171；先写失败测试锁定 `每日` 入口和固定日 seed；再给外层壳加 daily run state 和 local best 记录；内层原型复用现有牌山和奖励结构，把 seed 固定到当天；最后同步静态 Demo 并更新文档。
- 处理结论：待入任务池
- 对应任务编号：T171

### IDEA-20260615-02：胡了卜成就图鉴第一版

- 提出人：Lee
- 提出时间：2026-06-15
- 背景：T171 已完成每日牌局第一版，`/games/hulebu` 现在已经具备主线、局外首页、结算、铜钱、升级、路线型奖励、无尽和每日入口，但 `图鉴` 面板仍是占位。完整体验版下一步需要给长期目标一个清晰承接点。
- 目标：新增 T172，把局外 `图鉴` 面板升级为可查看的成就图鉴第一版；基于本地存档展示已解锁/未解锁状态，并承接主线、无尽、每日和局外升级的长期进度。
- 不做：不做完整事件词条库、Boss 详情页、奖励路线收藏页、云同步、排行榜、付费、广告或 Cocos 正式工程追平；不改 20 关主线配置、无尽层数规则、每日 seed 规则或局外升级价格。
- 用户价值：玩家除了“打一轮”之外，有一个能回看长期进度的本地目标页；主线、无尽、每日和升级不再只是离散功能，而是会沉淀成可见成就。
- 涉及模块：胡了卜站内壳层 / 本地存档 / 站内静态测试 / 模块文档。
- 可能影响文件：`apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`, `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`, `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`, `docs/tasks/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/**`, `docs/completion/**`。
- 是否影响另一方任务：否。本次只改胡了卜网页壳层、本地存档和对应文档测试。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：`/games/hulebu` 的 `图鉴` 面板不再是占位；至少展示一组成就卡及其已解锁/未解锁状态；主线、无尽、每日和升级四类已有进度能映射到图鉴；测试、构建、桌面端和 390px 移动端浏览器检查通过。
- AI 初步方案：新增 T172；先用 web 测试锁定图鉴面板文案和成就字段；再给壳层本地存档加 achievements/解锁逻辑，把现有 run 结算和升级购买信号映射到成就；最后更新模块文档和当天进展。
- 处理结论：已入任务池
- 对应任务编号：T172

### IDEA-20260615-03：胡了卜高阶周目第一版

- 提出人：Lee
- 提出时间：2026-06-15
- 背景：T172 已完成成就图鉴第一版，`/games/hulebu` 现在已经具备主线、局外结算、铜钱、升级、路线型奖励、无尽、每日和图鉴入口，但高阶周目仍未接入局外壳层。完整体验版下一步需要把“通关后的更高难度轮回”先做成可进入、可理解的第一版。
- 目标：新增 T173，把局外高阶周目第一版接入 `/games/hulebu`；至少支持解锁提示、局外入口、1-2 档周目和少量稳定词缀/限制展示；进入后仍复用现有 20 关主线骨架。
- 不做：不做完整高阶事件扩容、完整 Boss 试炼第二版、云同步、排行榜、付费、广告或 Cocos 正式工程追平；不改 `levels.json`、`rewards.json`、无尽规则、每日规则和局外升级价格。
- 用户价值：玩家打穿主线后不只是继续打无尽，还能看到一个明确的“更高难度轮回”入口；长期挑战结构会更完整。
- 涉及模块：胡了卜站内壳层 / HTML 试玩原型 / 站内静态 Demo / 本地存档 / 模块文档。
- 可能影响文件：`apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`, `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`, `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `docs/tasks/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/**`, `docs/completion/**`。
- 是否影响另一方任务：否。本次只改胡了卜网页 Demo、对应静态副本和文档测试。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：局外页可看到高阶周目入口和解锁状态；至少可进入 1-2 档高阶周目；页面与 HUD 会显示当前周目和词缀/限制；测试、构建、脚本语法、桌面端和 390px 移动端浏览器检查通过。
- AI 初步方案：新增 T173；先写失败测试锁定周目入口、周目字段和词缀文案；再给外层壳和内层原型加 `ascension`/高阶周目模式、少量稳定词缀和本地解锁逻辑；最后同步静态 Demo、更新模块文档并做浏览器验收。
- 处理结论：已入任务池
- 对应任务编号：T173

### IDEA-20260614-03：胡了卜路线型奖励池扩展

- 提出人：Lee
- 提出时间：2026-06-14
- 背景：T168 已完成局外铜钱和 3 项外置升级，当前 `/games/hulebu` 已具备主线、局外页和升级消费闭环。但 run 内奖励池仍主要是单档分数、单次道具和基础救场，吃流、碰流、杠流、胡流、道具流和信息流的 build 分叉不够明显。
- 目标：新增 T169，把默认玩家 Demo 的奖励池扩成更明确的路线型奖励池；至少让玩家在 `吃 / 碰 / 杠 / 胡 / 道具 / 信息` 六类方向里感受到不同构筑倾向；奖励展示层需要体现奖励类别和路线感。
- 不做：不做无尽、每日、成就、高阶周目；不改局外升级系统；不接登录、云存档、多端同步；不改 Cocos 正式工程；不重做 20 关主线关卡结构；不改 PDF、AI 修图、账号中心、AI Gateway 或 TimePick。
- 用户价值：run 内构筑不再只是“拿点分数和工具次数”，而是开始出现更清晰的打法分叉，朋友试玩时能更明显感到 Roguelike 选择带来的差异。
- 涉及模块：胡了卜 HTML 试玩原型 / 站内静态 Demo / 共享奖励配置测试 / 模块文档。
- 可能影响文件：`apps/game/mahjong-roguelike/config/rewards.json`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config.test.ts`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`, `docs/tasks/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/**`, `docs/completion/**`。
- 是否影响另一方任务：否。本次只改胡了卜奖励池和对应文档测试。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：奖励配置不再只有 10 个基础奖励；默认主线奖励池能体现 `吃 / 碰 / 杠 / 胡 / 道具 / 信息` 路线；奖励弹层和已选奖励区能读出路线类别；测试、脚本语法、桌面端和 390px 移动端浏览器检查通过。
- AI 初步方案：新增 T169；先写失败测试锁定奖励数量、路线类别和奖励展示口径；再扩 `rewards.json`、朋友试玩奖励池映射和奖励卡展示；最后同步静态 Demo、更新文档并做浏览器验收。
- 处理结论：已入任务池
- 对应任务编号：T169

### IDEA-20260614-02：胡了卜铜钱资产和 3 项局外升级

- 提出人：Lee
- 提出时间：2026-06-14
- 背景：T167 已完成局外首页、主线开始壳和结算面板，但当前“局外铜钱”还只是浏览器本地预览数字，`备用槽 / 满槽护符 / 初始道具` 也只是说明文字，没有真实购买和生效逻辑。完整体验版下一步必须让铜钱有用途，否则局外页只是展示层。
- 目标：新增 T168，把局外铜钱升级为真实可消费资产；新增 3 项局外升级的购买和持久化；开始新 run 时把升级效果真实带入 iframe 主线。
- 不做：不接登录、云存档、多端同步；不做无尽、每日、图鉴真实内容；不扩路线型奖励池；不重做 20 关主线规则；不改 Cocos 正式工程；不改 PDF、AI 修图、账号中心、AI Gateway 或 TimePick。
- 用户价值：玩家通关后拿到的铜钱终于能花出去，局外页不再只是壳。升级买完后，下一轮主线能直接感受到更高容错和更强开局资源。
- 涉及模块：胡了卜站内入口页 / HTML 试玩原型参数桥接 / 模块文档。
- 可能影响文件：`apps/web/src/app/games/hulebu/page.tsx`, `apps/web/src/modules/games/hulebu/**`, `apps/web/public/games/hulebu-demo/index.html`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `docs/tasks/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/**`, `docs/completion/**`。
- 是否影响另一方任务：否。本次只改胡了卜站内入口、静态 Demo 参数桥接和对应文档。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：局外铜钱可累计、可消费；`备用槽 / 满槽护符 / 初始道具` 至少各有 2 档可购买升级；购买后刷新页面仍保留；开始主线 run 时升级效果真实带入并影响 reserve、shield、tools 初始状态；测试、构建、脚本语法、桌面和移动端浏览器检查通过。
- AI 初步方案：新增 T168；先用 web 测试锁定升级文案、购买入口和 iframe 参数；再给静态 Demo 增加 URL 参数桥接，把 reserve/shield/tool bonus 注入 run 初始状态；最后更新文档并做浏览器验收。
- 处理结论：已入任务池
- 对应任务编号：T168

### IDEA-20260614-01：胡了卜局外首页和结算面板

- 提出人：Lee
- 提出时间：2026-06-14
- 背景：T166 已完成 20 关完整主线 Demo，但 `/games/hulebu` 仍是直接打开 iframe 牌桌，朋友试玩会直接掉进局内过程。T165 路线图已明确下一步要先补局外首页、Run 开始页和结算面板，让 Demo 先拥有完整游戏壳层，再去做铜钱资产和 3 项局外升级。
- 目标：新增 T167，在站内 `/games/hulebu` 页面补局外首页、主线开始页和结算面板；保留当前 20 关主线 iframe 试玩；新增局外模式入口壳（升级 / 图鉴 / 无尽 / 每日）和锁定说明；本轮结算后回到局外页，并显示铜钱累计预览。
- 不做：不实现 3 项局外升级消费；不做无尽、每日、成就、图鉴真实内容；不接登录和云存档；不改 Cocos 正式工程；不重做 20 关局内规则、奖励池、AI、PDF 或账号中心。
- 用户价值：玩家进入 `/games/hulebu` 时会先看到这是一个完整游戏，而不是一个裸 iframe。通关或失败后也有明确结算和“再来一轮 / 返回局外”的闭环，为后续外置升级和长期模式留出自然入口。
- 涉及模块：胡了卜站内入口页 / HTML 试玩原型 iframe 通信 / 模块文档。
- 可能影响文件：`apps/web/src/app/games/hulebu/page.tsx`, `apps/web/src/modules/games/hulebu/**`, `apps/web/public/games/hulebu-demo/index.html`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/src/components/portal-data.ts`, `docs/tasks/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/**`, `docs/completion/**`。
- 是否影响另一方任务：否。本次只改胡了卜站内入口和对应 Demo 通信层。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：`/games/hulebu` 默认先显示局外首页；可开始主线并进入现有 20 关 iframe 试玩；支持离开当前 run 回局外并继续本轮；通关或失败后进入站内结算面板；局外页可显示升级 / 图鉴 / 无尽 / 每日壳层与锁定说明；测试、脚本语法、桌面和移动端浏览器检查通过。
- AI 初步方案：新增 T167；先补 web 侧测试锁定局外首页、结算面板和 `embed=shell` iframe 入口；再给静态 demo 增加最小 postMessage 桥接和 embed 模式，隐藏内层顶部条并向父页面同步进度/通关/失败事件；最后更新文档和浏览器验证。
- 处理结论：已入任务池
- 对应任务编号：T167

### IDEA-20260613-04：胡了卜 20 关完整主线 Demo

- 提出人：Lee
- 提出时间：2026-06-13
- 背景：T165 已确认完整体验版第一实现阶段应优先补齐 `20 关主线 + 局外升级壳 + 第 20 关 Boss`。为了避免一次性把局外升级、无尽、每日和成就都塞入当前 HTML Demo，本轮先把默认站内 Demo 从 10 关开放到 20 关，并让第 20 关成为明确终章。
- 目标：新增 T166，把 `/games/hulebu` 默认玩家 Demo 开放到 20 关；保留第 1-10 关当前试玩节奏；为第 11-19 关接入渐进难度 profile；第 20 关启用 `胡了卜王` 终章 Boss；奖励节点扩展为第 3、6、9、13、16、19 关；同步站内静态 HTML。
- 不做：不做局外首页、局外升级、铜钱持久资产、无尽、每日、成就、高阶周目、Cocos 正式工程、登录云存档、排行榜、付费或广告；不改 PDF、AI 修图、账号中心、AI Gateway 或 TimePick。
- 用户价值：朋友试玩版不再只停在 10 关小 run，而是能完整体验一条 20 关主线和终章 Boss，为后续局外升级和长期模式提供稳定基础。
- 涉及模块：胡了卜站内 Demo / HTML 试玩原型 / 共享测试 / 模块文档。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config.test.ts`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `docs/tasks/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/2026-06-13-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本次只改胡了卜试玩 Demo 和对应文档测试。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：默认玩家 Demo 显示并可推进到 20 关；第 11-19 关使用可试玩渐进难度；第 20 关显示 `胡了卜王` 终章 Boss 和 Boss 目标；奖励节点为第 3、6、9、13、16、19 关；静态站内 Demo 同步；测试、脚本语法、桌面和移动端浏览器检查通过。
- AI 初步方案：先用测试锁定 20 关开放、奖励节点和终章 Boss 行为；再把 HTML demo 的 playable count、难度 profile、奖励 checkpoint 和 Boss helper 扩到 20 关；最后同步 `apps/web/public/games/hulebu-demo/index.html`，跑共享测试、web 测试、脚本语法和浏览器检查。
- 处理结论：已入任务池
- 对应任务编号：T166

### IDEA-20260613-03：胡了卜 Demo 推进到完整体验版

- 提出人：Lee
- 提出时间：2026-06-13
- 背景：T102 已把胡了卜站内网页 Demo 接入 `/games/hulebu`，T162-T164 已补齐残局收官、高压窄腰池、特殊事件和第 10 关终局试炼。Lee 进一步希望对照完整游戏设计方案，把当前 Demo 推进到“所有内容”的方向。经盘点，当前 Demo 已覆盖核心局内玩法，但完整方案还包含 20 关主线、局外升级、长期模式、成就、每日、无尽、高阶周目和正式 Cocos 表现层。
- 目标：新增 T165，先产出“胡了卜完整体验版推进方案”和实施拆分：把当前 10 关朋友试玩 Demo 升级为可逐步落地的完整体验路线，明确第一阶段先做 `20 关主线 + 局外升级壳 + 第 20 关 Boss`，后续再接无尽、每日、成就和高阶周目。
- 不做：本任务不直接改玩法代码；不一次性实现无尽、每日、成就、完整高阶周目、完整 Cocos 正式版、付费、广告、排行榜或登录云存档；不改 PDF、AI 修图、账号中心、AI Gateway 或 TimePick。
- 用户价值：避免当前 Demo 继续靠零散补丁扩张，先把“完整游戏”拆成可试玩、可验证、可发布的阶段路线，让后续每一步都能看到朋友试玩体验变完整。
- 涉及模块：胡了卜站内 Demo / HTML 试玩原型 / 关卡配置 / 局外成长 / 长期模式规划 / 模块文档。
- 可能影响文件：`docs/tasks/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/2026-06-13-lee.md`, `docs/completion/**`；后续实现任务才可能影响 `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config*.test.ts`, `apps/web/src/modules/games/hulebu/**`。
- 是否影响另一方任务：否。本任务只做胡了卜路线规划和任务拆分，不改共享前端、AI、PDF 或外部项目。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：完成完整体验版设计规格、实施计划、任务分片和领取分片；明确当前 Demo 已有内容、完整方案缺口、阶段目标、第一实现任务边界、验证命令和后续任务建议；`npm run docs:sync`、占位符扫描和 `git diff --check` 通过。
- AI 初步方案：采用“先完整主线，再长期模式”的路线。第一阶段把默认 Demo 从 10 关扩展为 20 关体验版，做局外首页/升级壳、第 20 关 Boss、铜钱结算和 3 项基础升级；第二阶段扩奖励池和高阶事件；第三阶段再做无尽、每日、成就和高阶周目入口；Cocos 正式表现层作为单独路线并行承接，不阻塞 HTML 完整体验验证。
- 处理结论：已入任务池
- 对应任务编号：T165

### IDEA-20260613-02：胡了卜 Boss 试炼 Demo 第一版

- 提出人：Lee
- 提出时间：2026-06-13
- 背景：T163 已把特殊事件第一版接入朋友试玩 Demo。早期规划 D006 和 GAMEPLAY_PLAN 16.6 仍保留 Boss 试炼方向；当前朋友 Demo 第 10 关只是“综合高压”，没有阶段终点记忆点。
- 目标：新增 T164，把默认朋友试玩 Demo 第 10 关做成轻量 Boss 试炼第一版：进入关卡前/关卡 HUD 明确展示试炼主题；第 10 关启用少量 Boss 目标；完成后给一次可见试炼奖励。
- 不做：不实现完整高阶周目；不改 Cocos 正式工程；不改完整 20 关配置；不做永久成就、皮肤或局外解锁；不改 PDF、AI 修图、账号中心或站点视觉。
- 用户价值：朋友试玩 10 关小 run 有一个明确终点，玩家不只是觉得“第 10 关牌更多”，而是知道这是一次主题试炼。
- 涉及模块：胡了卜站内 Demo / HTML 试玩原型 / 共享测试 / 玩法文档。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config.test.ts`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `docs/tasks/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/2026-06-13-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本次只改胡了卜试玩 Demo 和对应文档测试。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：默认朋友 Demo 第 10 关启用 Boss 试炼；HUD/目标栏显示试炼主题；至少包含 `杠 1`、`胡 1`、`积分目标` 三类轻量目标；牌山生成能承接目标包；通关后显示 Boss 已击破/试炼奖励；测试、脚本语法、桌面和移动端浏览器检查通过。
- AI 初步方案：复用已有 `bossGoals`、Boss 目标栏和目标校验，不新增独立 Boss 状态机。新增 friend demo trial helper，让第 10 关在默认玩家页返回一组轻量 Boss 目标，并覆盖 HUD 标题/通关文案/奖励结算。静态 Demo 同步源 HTML，保留静态 fetch 路径。
- 处理结论：已入任务池
- 对应任务编号：T164

### IDEA-20260613-01：胡了卜特殊事件 Demo 第一版

- 提出人：Lee
- 提出时间：2026-06-13
- 背景：T162 已完成残局收官和高压窄腰池。Lee 提醒胡了卜早期规划里还有特殊事件；D006 和玩法规划已确认高阶挑战应由词缀系统、随机事件和 Boss 试炼等共同组成，不能只靠增加牌数或堆叠层数。
- 目标：新增 T163，在默认朋友试玩 Demo 中落地特殊事件第一版：第 6、8、10 关前出现一次关前事件选择；事件给出低风险资源、道具补给或下一关小词缀三类选择；玩家能在 HUD 中看到当前事件/词缀影响。
- 不做：不实现完整无尽高阶周目；不做完整 Boss 试炼系统；不改 Cocos 正式工程；不做永久能力卡槽压缩；不改 PDF、AI 修图、账号中心或站点视觉；不引入随机无预警惩罚。
- 用户价值：朋友试玩版开始出现 Roguelike 事件选择和“自愿加压换奖励”的感觉，让关卡变化不只来自牌量和模板。
- 涉及模块：胡了卜站内 Demo / HTML 试玩原型 / 共享测试 / 玩法文档。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config.test.ts`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `docs/tasks/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/2026-06-13-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本次只改胡了卜试玩 Demo 和对应文档测试。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：第 6、8、10 关前会弹出特殊事件选择；选项至少覆盖加铜钱、补道具、下一关禁洗牌/禁透视或高压牌山；事件选择会影响下一关状态并有可见提示；负面效果来自玩家主动选择；测试、脚本语法、桌面和移动端浏览器检查通过。
- AI 初步方案：新增轻量事件池和 run-level pending modifier，不引入正式高阶系统。关前 overlay 复用现有弹层；事件选择写入 `activeSpecialEvent` 或 `pendingLevelModifier`；下一关加载时应用到工具次数、铜钱、模板/牌量或工具禁用状态；HUD/状态栏展示事件短文案。
- 处理结论：已入任务池
- 对应任务编号：T163

### IDEA-20260612-04：胡了卜残局收官和悬台窄腰高压池

- 提出人：Lee
- 提出时间：2026-06-12
- 背景：Lee 试玩站内 Demo 后确认当前第 5 关整体可接受，并继续要求把已验证的 `悬台窄腰` 高堆叠结构纳入后期高压关；同时 T094 已设计但尚未实现的 `残局收官` 需要落到朋友试玩 Demo，避免牌桌清空后槽内残张被无成本跳过。
- 目标：新增 T162，在默认玩家 Demo 中让第 8-10 关 auto 随机池包含 `suspended-waist / 悬台窄腰`；普通关牌桌清空但主槽仍有残张时进入 `残局收官`，先实现 `弃牌通关` 和 `选作牌引` 两个出口。
- 不做：不实现 `收入牌河` 跨关兑换；不改 Cocos 正式工程；不改 AI、PDF、账号中心或站点视觉；不重做牌山生成器地基。
- 用户价值：后期关卡更接近 Lee 认可的高压立体堆叠；残局不再是无成本过关或生成器死局，而变成一个短决策。
- 涉及模块：胡了卜站内 Demo / HTML 试玩原型 / 共享测试。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config.test.ts`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/progress/2026-06-12-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本次只改胡了卜试玩 Demo 和对应文档测试。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：第 8-10 关 auto 模板候选包含 `悬台窄腰`；第 5-7 关仍保持较稳的基础高压池；普通关清空牌桌但槽内有残张时弹出 `残局收官`；`弃牌通关` 清槽并进入正常通关流程；`选作牌引` 可选一张槽牌并在下一关 HUD/状态中体现；测试、脚本语法、桌面和移动端浏览器检查通过。
- AI 初步方案：复用 T094 设计，不引入完整正式状态机。新增高压 auto 模板池 helper；把 `moveTileToSlot` 和 `finishComboAction` 的清场结算收口到统一函数；残局弹层复用现有 overlay；牌引只保存一张 tile identity，下一关轻量注入主槽并在 HUD/状态文案提示。
- 处理结论：已入任务池
- 对应任务编号：T162

### IDEA-20260612-03：首页 Naturecore 左右分区回调

- 提出人：Lee
- 提出时间：2026-06-12
- 背景：T158 已完成全站 Naturecore UI 统一。Lee 反馈内页效果可以，但首页作为主入口还是按左右来区分工具和游戏更直观。
- 目标：新增 T159，仅调整首页 `/`，把中央双入口卡片改回左右分区入口，同时保留 Naturecore 背景、玻璃质感和动态反馈。
- 不做：不修改 `/tools`、`/games`、账号中心、认证页、工具工作台、AI Gateway、Prisma 或 TimePick 外部仓库。
- 用户价值：首页重新强化“工具站 / 游戏馆”两个平级频道的直觉分流，同时不丢失 T158 形成的整体视觉质感。
- 涉及模块：首页 / 公开门户入口。
- 可能影响文件：`apps/web/src/components/HomeExperience.tsx`, `apps/web/src/app/globals.css`, `docs/tasks/**`, `docs/progress/2026-06-12-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本次只调首页入口展示层。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：首页桌面端明确左右分区；移动端合理纵向堆叠；左右入口均可点击；Naturecore 背景保留；类型检查、构建、文档同步和浏览器检查完成。
- AI 初步方案：保留 `portal-home` 背景层和账号入口，把 `portal-home-content` 改为左右两块 `portal-entry` 大分区；CSS 在桌面端使用两列满高布局，移动端改为单列卡片。
- 处理结论：已入任务池
- 对应任务编号：T159

### IDEA-20260612-02：全站 Naturecore 动态 UI 统一

- 提出人：Lee
- 提出时间：2026-06-12
- 背景：T157 已将 Open Design Naturecore 动态深色风格落到账号中心和 AI Gateway 页面。Lee 进一步要求整个网站都按这种风格优化，并明确首页可以加入背景。
- 目标：新增 T158，将 Naturecore 动态深色视觉扩展到首页、工具频道、游戏频道、认证页、账号中心和主要工具/游戏入口；首页使用更沉浸的背景，其他页面保持可读、克制、统一。
- 不做：不改 AI Gateway 运行时；不改 Prisma schema；不改 TimePick 外部仓库；不重做 PDF / AI 修图 / 游戏业务逻辑；不新增支付、订阅或后台能力。
- 用户价值：网站从分散页面变成一套完整、可记忆的品牌体验；首页更有第一眼吸引力，工具和游戏页面更统一，账号中心不再像独立风格孤岛。
- 涉及模块：公开门户 / 首页 / 工具频道 / 游戏频道 / 认证页 / 账号中心 / 全站视觉系统。
- 可能影响文件：`apps/web/src/app/**`, `apps/web/src/components/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/web/src/modules/games/hulebu/**`, `apps/web/src/app/globals.css`, `docs/tasks/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, `docs/progress/2026-06-12-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：可能影响共享前端页面和 AI 修图入口，但本轮不改 AI 修图业务逻辑；若进入深度工具工作台重做，需要再拆任务。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：通过浏览器确认全站视觉方向；首页可加入背景且首屏有品牌记忆点；工具/游戏/认证/账号页面风格统一；桌面和移动端检查通过；测试、类型检查、构建、文档同步完成。
- AI 初步方案：先用视觉伴随展示 `Portal Forest`、`Operator Console`、`Hybrid` 三种方向；确认后写设计稿和实施计划，再把真实代码分层改造为全站主题变量、公共导航/卡片/按钮、首页沉浸背景、频道页深色卡片和认证页统一皮肤。
- 处理结论：已入任务池
- 对应任务编号：T158

### IDEA-20260612-01：账号中心与 AI Gateway Naturecore 动态 UI 落地

- 提出人：Lee
- 提出时间：2026-06-12
- 背景：Lee 参考 Open Design 示例模板并确认 `DreamChasers 账号中心 AI Naturecore 重设计` 方向，喜欢深色、金色/青色点缀、鼠标 hover 动效和文字动态反馈；同时明确不需要森林背景图片，只保留干净动态增强版效果。
- 目标：新增 T157，把已确认的 Naturecore 动态深色风格落到真实账号中心和 AI Gateway 账号治理页面，优化账号概览、模型能力、运行时状态、请求日志和积分账本的视觉层次。
- 不做：不修改 AI Gateway 运行时；不改 provider、积分扣减、Prisma schema 或 TimePick 外部仓库；不扩到工具、游戏或支付订阅能力。
- 用户价值：账号中心和 AI 通用模块从“功能骨架”升级为更有平台感、可读性和反馈感的控制台界面，后续继续接工具和模型能力时更容易形成统一体验。
- 涉及模块：账号中心 / AI Gateway 账号治理页 / 平台展示层。
- 可能影响文件：`apps/web/src/app/account/**`, `apps/web/src/components/account/**`, `apps/web/src/app/globals.css`, `docs/tasks/**`, `docs/progress/2026-06-12-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本次只改账号中心展示层，不碰 AI 修图产品实现和 TimePick 外部仓库。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：账号概览和 AI Gateway 页采用已确认的深色动态 UI；无森林背景图片；桌面端和移动端布局可用；测试、类型检查、构建、文档同步和 diff 检查完成。
- AI 初步方案：以现有 `AccountShell`、`AccountSection` 和 `account-*` CSS 类为承载层，加入鼠标微光、卡片光扫、能力卡 hover、深色 oklch surface、金色/青色状态点缀；尽量不改业务数据结构。
- 处理结论：已入任务池
- 对应任务编号：T157

### IDEA-20260609-01：平台级 AI 治理与产品接线路线规划

- 提出人：Lee
- 提出时间：2026-06-09
- 背景：T146、T147、T148 已完成 AI Gateway MVP 运行时和 TimePick 两条真实产品链路，但当前平台仍缺统一治理方案。账号中心 AI 页面、provider 环境变量、运行时状态、请求日志、积分扣减和后续产品接线顺序，分别散落在实现任务、账号中心规划和产品模块待办中，缺一份以“治理优先”为核心的统一路线。
- 目标：新增 T149，产出平台级 AI 治理与产品接线路线方案；明确账号中心与 AI Gateway 的职责边界、provider readiness 与环境变量治理、标准错误码与请求日志语义、账号中心治理面展示范围，以及 PDF 工具箱 / AI 修图 / TimePick 三条产品线的后续接线顺序；继续拆分后续任务 T150-T154。
- 不做：不实现应用代码；不接真实多 provider 自动路由；不保存用户 provider key；不提前实现支付、订阅、Key Vault、KMS、告警中心、异步任务平台或工作流编排；不把三条产品线各自扩成独立 AI 平台。
- 用户价值：平台终于有一套统一、可解释、可治理的 AI 口径。用户能在账号中心看懂能力、状态、调用与积分；团队后续接 PDF 工具箱和 AI 修图时也不需要各写一套模型、扣费和错误处理逻辑。
- 涉及模块：账号中心 / AI Gateway / PDF 工具箱 / AI 修图 / TimePick / 平台治理。
- 可能影响文件：`docs/tasks/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, `docs/progress/2026-06-09-lee.md`, `docs/completion/**`；后续实现任务可能影响 `apps/web/src/app/account/ai/**`, `apps/web/src/lib/account/**`, `apps/web/src/lib/ai/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/web/src/app/tools/ai-photo-editor/**`。
- 是否影响另一方任务：否。本次只做平台规划与任务拆分；后续如果实现 AI 修图接线，需要再按任务确认文件边界。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：新增设计稿、实施计划、任务分片和领取分片；明确治理边界、账号中心展示范围、运行时治理最小闭环、产品接线准入标准和三条产品线接线顺序；`npm run docs:sync`、占位符扫描和 `git diff --check` 通过。
- AI 初步方案：采用“治理中台优先，产品接线附表补充”结构。先定义账号中心治理面、AI Gateway 运行时状态、环境变量 readiness、标准错误码和请求日志口径，再拆 T150-T154，把 PDF 工具箱排为第一条站内 AI 产品线，AI 修图排到后续，TimePick 保持平级样板角色。
- 处理结论：已入任务池
- 对应任务编号：T149, T150, T151, T152, T153, T154

### IDEA-20260608-02：TimePick 运势聊天接入 AI Gateway 首条真实产品链路

- 提出人：Lee
- 提出时间：2026-06-08
- 背景：T146 已完成 AI Gateway MVP 运行时和账号中心 AI 控制面，但还没有任何真实产品能力接到 `/api/ai/tasks`。TimePick `/fortune` 运势聊天当前已经走 DreamChasers API，只是返回无模型占位文本，适合作为第一条产品接线。
- 目标：新增 T147，在不修改 TimePick 外部仓库的前提下，把 `apps/web/src/app/api/timepick/fortune/chat/route.ts` 改为调用 AI Gateway；补齐 `text_generation` mock 行为、TimePick fortune chat 到 gateway 的映射层、错误码返回和验证。
- 不做：不修改 TimePick 外部仓库；不接真实 provider；不引入充值、订阅、Key Vault、用户 provider key 持久化；不扩展到 PDF 工具箱或 AI 修图；不重做 `/fortune` 页面 UI。
- 用户价值：平台第一次出现“产品真实走 AI Gateway”的闭环，账号中心里的模型目录、积分账本和请求日志能和产品调用串起来，而不再只是平台骨架。
- 涉及模块：AI Gateway / TimePick / 账号积分 / 请求日志。
- 可能影响文件：`apps/web/src/lib/ai/**`, `apps/web/src/app/api/ai/**`, `apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/fortune/chat/route.ts`, `docs/tasks/**`, `docs/progress/2026-06-08-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：TimePick 运势聊天 route 调用 AI Gateway `text_generation`；成功请求写入 `AiGatewayRequestLog` 并扣减积分；失败时返回明确错误；新增测试覆盖 mock provider 文本生成、gateway 错误映射和 TimePick gateway 映射；测试、类型检查、构建、文档同步和 diff 检查通过。
- AI 初步方案：先写测试锁定 `text_generation` mock 输出、积分不足错误码和 TimePick fortune chat gateway 请求结构；再把 route 改为 `runAiGatewayTask()`；最后做最小烟测，确认未登录仍 401，成功链路至少由测试或本地脚本验证。
- 处理结论：已入任务池
- 对应任务编号：T147

### IDEA-20260608-03：TimePick URL 自动识别接入平台 AI Gateway

- 提出人：Lee
- 提出时间：2026-06-08
- 背景：T122 已完成自动识别平台 AI 重做规划入口，但还没有实现代码。当前 TimePick `ResourceDialog` 和 `ResourceCard` 的“自动识别”仍走本地 `buildLocalRecognition()` 占位逻辑，没有账号、积分、日志和平台 AI 调用链。AI 美颜由于本地未配置图片模型，当前更适合先接 URL 自动识别这条 mock 可跑链路。
- 目标：新增 T148，把 TimePick 现有 URL 自动识别按钮先接到 DreamChasers `/api/timepick/recognize`，由后端走 AI Gateway `structured_extraction` mock；保留最小输入输出结构，串起账号、积分和请求日志。
- 不做：不接真实网页抓取或外网内容抽取；不做 OCR、截图下载、Storage；不做图片生成；不修改 Prisma schema；不把识别能力扩到 PDF 工具箱或 AI 修图；不重做 TimePick UI。
- 用户价值：TimePick 第二条真实 AI Gateway 产品链路上线，用户在资源录入/资源卡片里点击“自动识别”时，真正走平台 AI 能力、积分扣减和日志，而不再只是前端本地占位函数。
- 涉及模块：AI Gateway / TimePick / 账号积分 / 请求日志 / 外部 TimePick 仓库。
- 可能影响文件：`apps/web/src/lib/ai/**`, `apps/web/src/app/api/ai/**`, `apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx`, `docs/tasks/**`, `docs/progress/2026-06-08-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：DreamChasers 新增 URL 自动识别 API，内部走 AI Gateway `structured_extraction`；TimePick `ResourceDialog` / `ResourceCard` 自动识别调用 DreamChasers API；成功时更新 title/content/thumbnail，失败时返回明确错误；测试、类型检查、构建、TimePick build、文档同步和 diff 检查通过。
- AI 初步方案：先为识别输入输出和 gateway 映射写测试；DreamChasers 增加 `timepick-recognition` 服务层和 `/api/timepick/recognize` route；TimePick API client 新增 `recognizeTimePickResourceUrl()` 并替换两个按钮；成功链路至少做一次真实登录态烟测并核对积分与日志。
- 处理结论：已入任务池
- 对应任务编号：T148

### IDEA-20260608-01：AI Gateway MVP 运行时与模型 API

- 提出人：Lee
- 提出时间：2026-06-08
- 背景：T143 已完成 AI Gateway MVP 规划，但仓库里还没有运行时代码。账号中心已有平台积分、API Key 和模型来源蓝图，下一步需要真正落下统一的模型目录、能力模型列表 API、任务执行 API、积分扣减和请求日志。
- 目标：新增 T146，实现 AI Gateway MVP 后端最小闭环：capability 常量、模型目录、model list API、task API、mock provider、OpenAI-compatible adapter 壳、积分扣减、请求日志。
- 不做：不接 TimePick 外部仓库；不接真实支付、订阅、Key Vault、用户 provider key 持久化；不做复杂路由和自动 provider 切换。
- 用户价值：平台 AI 能力第一次拥有统一入口，后续 TimePick 自动识别、PDF 翻译、AI 修图和其他 AI 能力都能挂到同一条调用链。
- 涉及模块：AI Gateway / 模型目录 / 平台积分 / 请求日志。
- 可能影响文件：`apps/web/prisma/**`, `apps/web/src/lib/ai/**`, `apps/web/src/app/api/ai/**`, `apps/web/src/lib/account/**`, `docs/tasks/**`, `docs/progress/2026-06-08-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：存在 capability 常量和模型目录；`GET /api/ai/capabilities/[capability]/models` 返回能力可用模型；`POST /api/ai/tasks` 能走 mock provider 执行、校验积分并写请求日志；测试、类型检查、构建、文档同步和 diff 检查通过。
- AI 初步方案：先写 `model-catalog` 和 `ai-gateway` 测试，再实现能力校验、模型筛选、mock provider、平台积分扣减和请求日志；OpenAI-compatible adapter 先做壳，不默认接真实 provider；必要时新增 `AiGatewayRequestLog` Prisma model 和 migration。
- 处理结论：已入任务池
- 对应任务编号：T146

### IDEA-20260608-01：弹珠机福利玩法和 AI 积分奖励边界

- 提出人：Lee
- 提出时间：2026-06-08
- 背景：Lee 在线下商场看到弹珠机，提出希望把“购买弹珠、投入弹珠、随机倍率、命中返还、积分券奖励”的游艺体验迁移到网站，用作放松内容和平台福利。讨论后进一步明确：不做对话，不把它作为普通体力制，而是考虑充值赠送游戏次数、直接购买游戏次数、中奖奖励进入账户等商业方式。
- 目标：新增 T145，记录弹珠机福利玩法规划；建立独立模块文档 `docs/modules/marble-pachinko/`；明确 `paidCredits`、`bonusCredits`、`playTickets`、`gameCoins` 四类资产边界；记录优先可探索的“充值赠送游戏次数”和需要后置评估的“直接购买游戏次数”。
- 不做：不实现代码；不接真实概率返奖；不让用户使用可购买 AI 积分下注；不按随机倍率返还可再次参与游戏的同类积分；不做现金、提现、转售、回购、礼品卡或可变现奖品；不绕过平台账号和积分审计。
- 用户价值：保留弹珠机的短时放松、物理爽感、中奖惊喜和回访动力，同时避免把 AI 积分系统做成下注系统，后续可作为充值福利、签到任务和平台活动入口。
- 涉及模块：弹珠机福利玩法 / 平台积分 / AI 积分 / 游戏留存 / 福利活动规则。
- 可能影响文件：`docs/tasks/**`, `docs/modules/marble-pachinko/**`, `docs/progress/2026-06-08-lee.md`, `docs/completion/**`；后续实现任务可能影响 `apps/web/src/modules/games/marble-pachinko/**`, `apps/web/src/app/games/**`, `apps/web/src/lib/account/**`, `apps/web/prisma/**`。
- 是否影响另一方任务：否。本任务只做规划文档；后续如果接入账号资产、积分、游戏频道或 AI Gateway，需要单独确认文件范围和合规边界。
- 是否需要新增任务：是
- 建议优先级：P2
- 验收标准：模块文档覆盖玩法定位、资产分层、充值赠送次数、直接购买次数风险、奖励边界、后续实现阶段和交接风险；`npm run docs:sync`、占位符扫描和 `git diff --check` 通过。
- AI 初步方案：第一阶段只记录规划。推荐路线是充值 AI 积分或完成任务时赠送 `playTickets`，弹珠机命中奖励进入 `bonusCredits`、`gameCoins`、皮肤、徽章等；`bonusCredits` 只能用于 AI 能力，不能再次用于游戏。直接购买游戏次数后置到合规确认后评估，并要求固定保底权益、每日上限、概率公示和未成年人限制。
- 处理结论：已入任务池
- 对应任务编号：T145

### IDEA-20260606-01：PDF 工具箱升级为 Edge 类 PDF 阅读编辑器

- 提出人：Lee
- 提出时间：2026-06-06
- 背景：Lee 参考 Microsoft Edge 内置 PDF 阅读器和翻译能力，确认当前 PDF 工具箱还不能修改 PDF 内已有文字和图片；需要规划一条升级路线，先补 Edge 类免费标注编辑体验，再评估 AI/OCR 和商业 SDK 原文编辑。
- 目标：新增 T144，产出 PDF 工具箱升级规划和实施待办；明确免费 Edge-like 标注编辑、文本抽取与翻译、办公转换增强、真实原文编辑商业 SDK 评估四层路线；记录后续实现任务建议，供 Lee 后续领取开发。
- 不做：不修改应用代码；不接商业 PDF SDK；不接真实翻译或 OCR 模型；不实现原文编辑；不修改现有 PDF 工具行为。
- 用户价值：避免把 PDF 工具箱误扩成高成本 Acrobat 级编辑器，同时尽快补齐用户感知强、成本可控的“添加文本、高亮、画笔、签名、遮盖、翻译”能力。
- 涉及模块：PDF 工具箱 / PDF 阅读器 / PDF 标注编辑 / AI Gateway 翻译 / OCR 后续能力。
- 可能影响文件：`docs/tasks/**`, `docs/modules/pdf-toolbox/**`, `docs/superpowers/plans/**`, `docs/progress/2026-06-06-lee.md`, `docs/completion/**`；后续实现任务可能影响 `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/web/src/app/tools/pdf-toolbox/**`, `apps/web/package.json`, `package-lock.json`。
- 是否影响另一方任务：否。本任务只做规划文档；后续实现如果接 AI Gateway 或 OCR，需要单独确认文件范围。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：规划文档覆盖分阶段路线、免费/限次边界、技术方案、任务拆分、风险和验收标准；实施计划列出 Lee 可后续执行的待办；`npm run docs:sync`、占位符扫描和 `git diff --check` 通过。
- AI 初步方案：第一阶段先做 Edge 类免费阅读标注：文本框、拖拽签名、可调整遮盖、高亮、画笔和保存副本；第二阶段补文本搜索、抽取、选中文本翻译和整页翻译，翻译走 AI Gateway 限次；第三阶段补 PDF 转图片和基础压缩；第四阶段只做商业 SDK 原文编辑评估，不进入第一阶段实现。
- 处理结论：已入任务池
- 对应任务编号：T144

### IDEA-20260605-02：AI Gateway MVP、模型选择和用户自配模型规划

- 提出人：Lee
- 提出时间：2026-06-05
- 背景：T142 已确认平台能力和留存底座采用平台优先路线。Lee 进一步明确：使用 AI 能力时，前端应该只能选择当前能力可用的模型；不同模型消耗积分不同；用户也应能使用自己配置的模型。Lee 选择 `OpenAI-compatible 优先 + 等另一个已有配置项目上传后再看复用方式`，并接受第一阶段支持临时 Key、长期用户自配模型待项目上传后再评估。
- 目标：新增 T143，产出 AI Gateway MVP、模型选择、积分消耗和用户自配模型的实施计划；明确前端可用模型列表 API、Gateway 任务 API、模型成本策略、OpenAI-compatible adapter、mock provider、临时 Key 和后续用户模型配置适配层。
- 不做：不实现代码；不接真实 provider；不保存用户 provider key；不做 Key Vault；不做复杂 provider 自动路由；不做真实充值扣费；不改 TimePick 外部仓库。
- 用户价值：用户在每个 AI 能力页面只看到当前能力可用的模型，并能理解不同模型的积分消耗；平台后续可以统一支持平台模型、临时 Key 和用户自配模型，而不是每个工具各自接模型。
- 涉及模块：AI Gateway / 模型目录 / 积分策略 / 用户模型配置 / TimePick 自动识别 / AI 修图 / AI 面试助手。
- 可能影响文件：`docs/tasks/**`, `docs/superpowers/plans/**`, `docs/progress/2026-06-05-lee.md`, `docs/completion/**`；后续实现任务可能影响 `apps/web/prisma/**`, `apps/web/src/lib/ai/**`, `apps/web/src/app/api/ai/**`, `apps/web/src/lib/account/**`, `apps/web/src/generated/prisma/**`。
- 是否影响另一方任务：否。本任务只做规划文档；后续实现如果涉及 AI 修图或 TimePick，需要单独确认文件范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：实施计划覆盖 capability model list、前端模型选择、模型积分消耗、Gateway task API、OpenAI-compatible adapter、mock provider、临时 Key、用户配置模型后置适配、日志脱敏、验证命令和后续任务拆分；`npm run docs:sync`、占位符扫描和 `git diff --check` 通过。
- AI 初步方案：第一阶段采用 `mock provider + OpenAI-compatible adapter` 双轨。产品 UI 先通过 capability-specific model list 展示可用模型；Gateway 服务端仍做模型能力、权限、credential source 和积分兜底校验。模型成本先用静态 `ModelCostPolicy`，后续再按 token、图片尺寸和批量数量细化。用户自配模型先支持临时 Key，长期配置等 Lee 上传另一个项目后再评估复用或重构。
- 处理结论：已入任务池
- 对应任务编号：T143

### IDEA-20260605-01：平台能力、用户资产留存和工作流自动化第一阶段规划

- 提出人：Lee
- 提出时间：2026-06-05
- 背景：账号中心、TimePick 接入和账号占位清理已进入可验收状态。下一步需要思考平台级 AI 能力和资源池，但 Lee 进一步补充：这不应只覆盖 AI，还要覆盖账号资源留存、小工具历史记录、游戏进度，以及用户可配置的工具工作流。例如用户在 P 图工具里配置“给图片加固定 logo”的工作流，之后可在工具中一键调用，不必每次重复操作。
- 目标：新增 T142，产出第一阶段平台能力与用户资产留存规划，明确账号资产、工具历史、游戏存档、AI Gateway / 能力资源池和工作流自动化五层边界；把工作流作为平台扩展能力写入规划；为后续实现任务拆分出优先级和不做范围。
- 不做：不实现代码；不接真实 AI 模型；不做真实支付、订阅、充值；不做复杂可视化工作流编辑器；不做跨工具多步骤自动化；不保存用户 provider key；不改 TimePick、PDF、AI 修图或游戏代码。
- 用户价值：平台不再只是一组孤立工具，而能持续留存用户资产、历史、存档和常用操作模板；后续每个工具和游戏接入账号时有统一规则，AI 能力和非 AI 自动化都能进入同一套治理。
- 涉及模块：账号中心 / 工具历史 / 游戏存档 / AI Gateway / 能力资源池 / 工作流自动化 / TimePick / PDF 工具箱 / AI 修图 / 胡了卜。
- 可能影响文件：`docs/tasks/**`, `docs/superpowers/specs/**`, `docs/progress/2026-06-05-lee.md`, `docs/completion/**`；后续实现任务可能影响 `apps/web/prisma/**`, `apps/web/src/lib/account/**`, `apps/web/src/lib/ai/**`, `apps/web/src/lib/workflows/**`, `apps/web/src/app/api/**`, `packages/shared/**`, `apps/game/**`。
- 是否影响另一方任务：否。本任务只做规划文档；后续实现如果涉及 AI 修图、游戏或共享包，需要单独确认文件范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：规划文档覆盖五层架构、第一阶段 MVP 范围、工作流自动化边界、工具历史留存、游戏进度留存、AI Gateway 资源池、后续扩展路线、任务拆分和风险；`npm run docs:sync`、占位符扫描和 `git diff --check` 通过。
- AI 初步方案：采用 `平台优先` 路线，先定义统一用户资产和运行记录模型，再让工具、游戏和 AI 能力按适配器接入。第一阶段工作流只做单工具内的一键动作模板，例如图片加 logo、PDF 加水印、TimePick 自动打标签，不做复杂跨工具编排。AI Gateway 第一阶段只做能力注册、请求日志、额度检查和 provider 来源预留，优先服务 TimePick 自动识别和 AI 修图的后续接入。
- 处理结论：已入任务池
- 对应任务编号：T142

### IDEA-20260604-21：账号中心第一阶段占位清理

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：T135 已完成账号中心页面体系，T140 已取消邮箱验证门槛；但账号中心主导航和页面里仍展示充值、订阅、LLM 配置、设备强制管理、手机号、实名、二步验证等后续能力占位，用户会误以为账号管理基座完整可用。
- 目标：新增 T141，把账号中心可见主体验收敛到第一阶段已可用能力；隐藏或重定向未开放功能入口；清理“等待邮箱验证”等旧状态。
- 不做：不实现真实支付、订阅、AI Gateway、BYOK、Key Vault、设备强制下线、手机号、实名、OAuth、MFA；不修改认证 action、Prisma schema 或 TimePick 外部仓库。
- 用户价值：账号中心只展示当前能用的功能，避免用户点击到大量占位页面，降低误解和测试成本。
- 涉及模块：账号中心导航 / 账号概览 / 个人信息 / 安全页 / AI 积分 / 后续能力深链。
- 可能影响文件：`apps/web/src/app/account/**`, `apps/web/src/components/account/**`, `apps/web/src/lib/account/**`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：主导航不再出现充值、订阅、LLM 配置、登录设备等不可用入口；账号概览不再显示等待邮箱验证；个人信息和安全页不再显示手机号、实名、二步验证占位；旧占位深链重定向到可用页；账号测试、类型检查、构建、文档同步和 diff 检查通过。
- AI 初步方案：先更新 account navigation 和 security summary 测试；导航保留账号概览、个人信息、账号安全、积分管理、API Key、产品接入；`/account/devices` 重定向 `/account/security`，`/account/ai/recharge`、`/account/ai/subscription`、`/account/ai/llm-config` 重定向 `/account/ai/credits`；概览、资料、安全页文案只展示当前可用能力。
- 处理结论：已入任务池
- 对应任务编号：T141

### IDEA-20260604-20：取消邮箱验证门槛并修复 TimePick 登录跳转

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：账号注册登录当前仍要求发送并完成邮箱验证。Lee 要求先去掉该门槛，注册时直接填写邮箱和密码即可进入。另有 TimePick 点击登录后页面消失反馈，初步定位为 TimePick 统一账号跳转默认指向 `http://localhost:3000/login`，而本地 DreamChasers 服务常用 `3100`，端口不一致会导致跳转到错误页面。
- 目标：新增 T140，注册后直接邮箱密码登录；日常登录只校验邮箱密码；移除注册验证邮件主链路提示和重发验证入口；修复 TimePick 登录默认地址、returnUrl 和页面文案。
- 不做：不删除数据库 `emailVerified` 字段；不删除找回密码邮件；不接手机号、OAuth、TOTP、验证码、真实风控或支付；不扩大 TimePick 非登录链路迁移范围。
- 用户价值：用户可以按常规邮箱密码流程立即创建并进入账号；从 TimePick 触发登录时不会因跳到错误端口而看到空白或页面消失。
- 涉及模块：账号中心 / Auth.js Credentials / 注册登录页面 / TimePick 登录壳。
- 可能影响文件：`apps/web/src/lib/auth/**`, `apps/web/src/app/login/**`, `apps/web/src/app/register/**`, `apps/web/src/app/account/security/page.tsx`, `apps/web/src/app/tools/timepick/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/dreamchasers-auth.ts`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Login.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Register.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/AuthGuard.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：新注册账号不发送验证邮件且直接登录；未设置 `emailVerified` 的账号可凭正确邮箱密码登录；错误密码仍不能登录；页面不再提示注册验证邮件；TimePick 登录默认指向当前 DreamChasers 本地端口并携带回到 TimePick 的 returnUrl；测试、类型检查、lint、构建、文档同步和 diff 检查通过。
- AI 初步方案：先补认证规则和 TimePick 登录 URL 构造测试；提取/补充纯函数表示密码登录无需邮箱验证；注册 action upsert 后直接 credentials sign-in；Credentials authorize 删除 `emailVerified` 检查；登录错误页删除验证重发主入口；TimePick 默认 `VITE_DREAMCHASERS_BASE_URL` 改为 `http://localhost:3100`，登录 URL 附带当前页面作为 `returnUrl`。
- 处理结论：已入任务池
- 对应任务编号：T140

### IDEA-20260604-19：账号认证补全找回密码、修改密码和重发验证邮件

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：T135/T136 已把账号体系改成邮箱注册验证 + 邮箱密码登录，但还缺常规账号闭环：忘记密码后的邮件重置、已登录用户修改密码、未验证邮箱重发验证邮件。
- 目标：新增 T138，一起实现 `/forgot-password`、`/reset-password`、账号安全页修改密码和重发验证邮件能力。
- 不做：不做手机号、OAuth、TOTP、短信、设备强制下线、密码强度评分、历史密码复用检查、真实风控和验证码。
- 用户价值：用户可以自助恢复账号、维护密码，并在注册验证邮件过期时重新完成邮箱验证。
- 涉及模块：账号中心 / Auth.js / Prisma VerificationToken / 登录注册页面 / 安全页。
- 可能影响文件：`apps/web/src/lib/auth/**`, `apps/web/src/app/login/**`, `apps/web/src/app/register/**`, `apps/web/src/app/forgot-password/**`, `apps/web/src/app/reset-password/**`, `apps/web/src/app/account/security/page.tsx`, `apps/web/src/app/globals.css`, `docs/tasks/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`。
- 是否影响另一方任务：否。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：找回密码不泄露账号枚举；有效 token 可设置新密码；无效或过期 token 不能改密码；已登录用户可验证当前密码后修改密码；未验证邮箱可重发验证邮件；测试、类型检查、lint、构建、文档同步和 diff 检查通过。
- AI 初步方案：复用 Auth.js `VerificationToken` 表承载密码重置 token，使用 `password-reset:<email>` identifier 区分用途；重置邮件和注册验证邮件共用 SMTP 发送能力；server actions 统一校验密码长度、确认密码和当前密码；页面沿用现有账号 auth panel 和安全页样式。
- 处理结论：已入任务池
- 对应任务编号：T138

### IDEA-20260604-18：账号中心认证方式修正为邮箱注册验证和邮箱密码登录

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：T133/T134 初版按邮箱 magic-link 日常登录规划账号中心第一阶段。Lee 明确修正：邮箱登入的意思是邮箱注册账号，并通过发邮件做验证；之后通过账号邮箱和密码登录。
- 目标：合并到 T135 实现任务，把 `/login` 改为邮箱 + 密码登录，新增 `/register` 做邮箱注册、密码设置和验证邮件发送；邮件只承担注册邮箱验证，不作为日常登录方式。
- 不做：不实现手机号、OAuth、TOTP、找回密码、密码修改、支付订阅、真实模型调用或 provider key 保存。
- 用户价值：账号体系符合常规注册/登录认知，避免把邮箱验证误做成 magic-link 登录。
- 涉及模块：账号中心 / Auth.js / Prisma User / 登录注册页面。
- 可能影响文件：`apps/web/src/app/login/**`, `apps/web/src/app/register/**`, `apps/web/src/lib/auth/**`, `apps/web/prisma/schema.prisma`, `apps/web/src/generated/prisma/**`, `apps/web/src/app/account/security/page.tsx`, `apps/web/src/lib/account/**`, `docs/tasks/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`。
- 是否影响另一方任务：否。
- 是否需要新增任务：否，合并到 T135。
- 建议优先级：P0
- 验收标准：注册页可设置密码并发送邮箱验证邮件；登录页只使用邮箱和密码；未验证邮箱不能登录；密码哈希存储；登录/注册页面桌面和移动端布局正常；测试、类型检查、lint 和构建通过。
- AI 初步方案：为 `User` 增加 `passwordHash`，新增 scrypt 密码哈希工具；Auth.js 增加 Credentials provider 并切 JWT session；注册 action upsert 未验证用户密码哈希后调用 Nodemailer provider 发送验证邮件；登录 action 先校验密码和邮箱验证状态，再 credentials sign-in。
- 处理结论：合并到已有任务
- 对应任务编号：T135

### IDEA-20260604-17：账号统一中心页面体系重规划

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：Lee 提供 Open Design 项目 `9bf531c6-e521-4b0c-b23e-430e44751483`，希望在现有 DreamChasers 账号代码基础上，重新规划账号统一中心页面体系。当前 T110-T113 已完成邮箱验证登录、账号首页、平台 API Key 和产品 token 骨架；T108 已完成统一账号中心、产品型工具入口和 AI Gateway 总体规划。新设计稿覆盖桌面登录、注册、账号概览、个人信息、安全、设备、AI 积分、充值、订阅、LLM 配置，以及 iOS/Android 移动端形态。
- 目标：新增 T133，产出账号统一中心页面体系重规划规格，明确完整页面信息架构、第一阶段邮箱验证登录落地范围、第二阶段模型配置如何承接 T108 的 AI Gateway 五类模型来源，以及后续实现拆分。
- 不做：不改应用代码；不接真实支付；不实现密码、短信、OAuth、实名、MFA、设备强制下线、真实 AI Gateway 调用或模型 Key 保存；不迁移 TimePick 或镜界业务代码。
- 用户价值：在不推翻现有邮箱登录 MVP 的前提下，把账号中心、AI 能力、产品型工具接入和模型配置统一到可持续扩展的信息架构里，避免后续 UI、计费和 AI Gateway 各自生长。
- 涉及模块：账号中心 / AI Gateway / 产品型工具接入 / Open Design UI 映射。
- 可能影响文件：`docs/tasks/**`, `docs/superpowers/specs/**`, `docs/progress/2026-06-04-lee.md`；后续实现任务才可能影响 `apps/web/src/app/account/**`, `apps/web/src/components/account/**`, `apps/web/src/lib/account/**`, `apps/web/src/app/api/account/**`, `apps/web/src/app/login/**`, `apps/web/src/app/globals.css`。
- 是否影响另一方任务：否。本任务只做规划文档，不修改 Jaspon 负责的 AI 修图代码；后续若实现 AI Gateway 或模型配置，需要单独确认文件边界。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：规格文档覆盖 Open Design 页面映射、当前代码能力边界、完整路由结构、第一阶段可用范围、第二阶段 LLM 配置/模型来源策略、后续任务拆分、风险和验证要求；文档同步、占位符扫描和 diff 检查通过。
- AI 初步方案：基于 Open Design MCP 读取的账号中心设计稿，结合当前 `apps/web/src/app/account/**`、Prisma 账号模型、T108 AI Gateway 规划和 T122 TimePick 自动识别规划，形成 `docs/superpowers/specs/2026-06-04-account-center-redesign-design.md`。第一阶段坚持邮箱 magic link；第二阶段模型配置不直接保存用户 provider key，先支持平台额度、临时 Key、外部 Gateway BYOK，再后置加密 Key Vault 和本地连接器。
- 处理结论：已入任务池
- 对应任务编号：T133

### IDEA-20260604-16：TimePick 剩余 Supabase 直连清零

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：T115-T131 已把 TimePick 主要账号、资源、文件夹、标签、搜索、灵感、角色、学习重点、待办、Profile 和首页每日抽签链路切到 DreamChasers API。静态扫描仍剩 `/fortune` 运势聊天、上传/Storage、自动识别、批量导入、模块树和旧 Simple todo 文件里的 Supabase 直连。
- 目标：新增 T132，在不新增 Prisma schema、不接真实 AI/Storage 的前提下清零 TimePick `src` 中 Supabase import 和调用点；必要功能改为 DreamChasers API、无模型本地占位或显式降级。
- 不做：不接真实 AI 模型；不实现正式文件对象存储；不重建完整模块树 schema；不导入 Supabase 历史模块/文件/批量数据；不修改 Prisma schema；不改 DreamChasers 非 TimePick 模块。
- 用户价值：TimePick 前端不再依赖 Supabase client，统一账号壳下不会继续混用 Supabase Auth、DB、Storage 和 Edge Function。
- 涉及模块：TimePick / DreamChasers API / 上传降级 / 自动识别降级 / 模块树降级 / 运势聊天降级 / 批量导入 / 旧 Simple todo。
- 可能影响文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Fortune.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/BatchImportDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/TodoSimple.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/TodoPageSimple.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ModuleDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceTree.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/integrations/supabase/**`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本任务限定在 Lee 负责的 TimePick 迁移收尾范围；不修改 Jaspon 负责范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：`rg` 扫描 TimePick `src` 不再出现 Supabase import/调用；TimePick build 通过；DreamChasers 定向测试/typecheck/build 通过；旧高成本能力以明确降级或无模型占位替代，不误接 AI/Storage；文档同步和 diff 检查通过。
- AI 初步方案：先登记一个收尾任务。DreamChasers 增加轻量 `/api/timepick/fortune/chat` 文本占位接口；TimePick `/fortune` 改走该接口。`ResourceDialog` 和 `ResourceCard` 的自动识别改为客户端无模型 metadata 占位，文件/缩略图使用本地 data URL 降级，不再上传 Storage。批量导入改用 DreamChasers `createTimePickResource`。旧 Simple todo 改用现有 todo API 或降级为跳转主 todo。模块树因 schema 不完整，改为从现有 resources/folders/sections 读取并禁用旧模块写入弹窗。最后删除 Supabase client 目录。
- 处理结论：已入任务池
- 对应任务编号：T132

### IDEA-20260604-15：TimePick 首页每日抽签弹窗切到 DreamChasers API

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：T115 已让 TimePick 使用 DreamChasers 登录态，T130 已把 Profile 资料和出生日期保存切到 DreamChasers API。首页 `FortuneDrawDialog` 仍直接读取 Supabase `profiles`、更新 `profiles.birth_date`，并调用 Supabase Edge Function `draw-fortune`；在统一账号壳下会继续绕过 DreamChasers owner 权限和 PostgreSQL。
- 目标：新增 T131，让首页每日抽签弹窗的出生日期检查、出生日期保存、每日抽签读取/生成和缓存全部走 DreamChasers API，并复用 `TimePickProfile` 与 `TimePickFortuneDraw` 模型。
- 不做：不迁移 `/fortune` 运势聊天页；不接入 Supabase Edge Function `fortune-agent`；不接真实 AI 模型、图片生成、Storage 或上传；不修改 Prisma schema；不导入历史抽签数据；不重做抽签弹窗 UI。
- 用户价值：用户在统一账号登录后打开首页每日抽签时，出生日期和每日抽签结果进入 DreamChasers PostgreSQL 并受当前登录用户权限保护；旧 Supabase Edge Function 不再阻塞基础抽签弹窗。
- 涉及模块：TimePick / DreamChasers API / 首页每日抽签弹窗。
- 可能影响文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/fortune/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/FortuneDrawDialog.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本任务限定在 Lee 负责的 TimePick 迁移范围；不修改 Jaspon 负责范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：DreamChasers 提供当前用户每日抽签 API；未设置出生日期时返回需要设置生日的业务状态；已设置生日时同一天重复抽签返回缓存结果；新抽签写入 `TimePickFortuneDraw`，`draw_date` 按本地自然日归一；TimePick `FortuneDrawDialog` 不再导入或调用 Supabase；保存出生日期复用 DreamChasers profile API；`/fortune` 运势聊天页保持现状；DreamChasers 定向测试、TimePick 定向 ESLint/build、静态红绿检查、真实浏览器未设置生日提示/保存生日/抽签缓存联调、文档同步和 diff 检查通过。
- AI 初步方案：先补纯规则测试，覆盖抽签日期归一、每日缓存 key、返回字段映射和未设置生日状态。DreamChasers 新增 `POST /api/timepick/fortune/draw`，服务层读取当前用户 profile，缺生日返回 409；有生日则按当天查 `TimePickFortuneDraw`，命中返回 cached，未命中生成无模型的每日运势文本和内联图片 URL 后写库。TimePick API client 新增 `drawTimePickFortune`，`FortuneDrawDialog` 改用 `fetchTimePickProfile` / `updateTimePickProfileBirthDate` / `drawTimePickFortune` 替换 Supabase 直连。
- 处理结论：已入任务池
- 对应任务编号：T131

### IDEA-20260604-14：TimePick Profile 页面切到 DreamChasers API

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：T115 已让 TimePick 使用 DreamChasers 登录态，T116-T129 已逐步迁移核心资源、学习重点和任务清单链路。`Profile` 页面仍直接读取 Supabase `profiles`、统计 Supabase `resources`，并使用 Supabase Auth 修改密码，绕过 DreamChasers 同账号资料和安全页。
- 目标：新增 T130，让 TimePick Profile 页面的资料读取、资源统计和出生日期保存走 DreamChasers API，并复用 DreamChasers `TimePickProfile` 和 `TimePickResource` 模型；旧修改密码入口改为跳转 DreamChasers 账号安全页。
- 不做：不实现 DreamChasers 密码修改；不迁移抽签 Edge Function；不迁移模块树、上传/Storage、自动识别、批量导入或批量优先级；不修改 Prisma schema；不导入历史数据；不重做 Profile 页面视觉结构。
- 用户价值：用户在统一账号登录后查看/维护个人资料时，Profile 数据来自 DreamChasers PostgreSQL 并受当前登录用户权限保护；旧 Supabase 密码体系不再暴露在新账号壳里。
- 涉及模块：TimePick / DreamChasers API / Profile 页面。
- 可能影响文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/profile/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Profile.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本任务限定在 Lee 负责的 TimePick 迁移范围；不修改 Jaspon 负责范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：DreamChasers 提供当前用户 TimePick profile 读取和出生日期更新 API；Profile 返回 nickname、username、birth_date、created_at、storage_used、storage_limit 和当前用户资源数；出生日期拒绝空值、非法日期和未来日期；更新只允许当前登录用户自己的 profile；TimePick `Profile` 页面不再导入或调用 Supabase；修改密码按钮不再触发 Supabase Auth，改为打开 DreamChasers `/account/security`；DreamChasers 定向测试、TimePick 定向 ESLint/build、静态红绿检查、真实浏览器 Profile 读取/生日更新联调、文档同步和 diff 检查通过。
- AI 初步方案：先补纯规则测试，覆盖 profile 字段映射、出生日期规范化、未来日期拒绝和 owner 写权限。DreamChasers 新增 `GET/PATCH /api/timepick/profile`；服务层从 `TimePickProfile` 读取资料并用 `TimePickResource.count` 统计资源数。TimePick API client 新增 profile 读取/更新方法，`Profile.tsx` 用 API client 替换 Supabase 直连，密码弹窗替换为跳转 DreamChasers 账号安全页。
- 处理结论：已入任务池
- 对应任务编号：T130

### IDEA-20260604-13：TimePick 任务清单主链路切到 DreamChasers API

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：T115 已让 TimePick 使用 DreamChasers 登录态，T116-T128 已逐步迁移文件夹、资源、标签、搜索、灵感、角色和学习重点链路。`TodoPage`、`AddTodoDialog` 和 `CompleteTodoDialog` 仍直接读写 Supabase `try_queue_links`，任务清单列表、添加、开始、完成、暂缓、放弃和删除绕过 DreamChasers 同账号 owner 权限。
- 目标：新增 T129，让 TimePick `/todo` 主页面的任务清单主链路走 DreamChasers API，并复用 DreamChasers `TimePickTryQueueLink` 模型。
- 不做：不迁移未挂路由的 `TodoSimple` / `TodoPageSimple`；不迁移 `BatchImportDialog` 和批量优先级 Edge Function；不迁移模块树、抽签、Profile、上传/Storage、自动识别或批量学习重点优先级；不修改 Prisma schema；不导入历史数据；不重做任务清单 UI。
- 用户价值：用户在统一账号登录后维护待尝试链接时，任务清单数据进入 DreamChasers PostgreSQL 并受当前登录用户权限保护，TimePick 高频个人工作流继续脱离 Supabase。
- 涉及模块：TimePick / DreamChasers API / 任务清单。
- 可能影响文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/todos/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/TodoPage.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/AddTodoDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/CompleteTodoDialog.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本任务限定在 Lee 负责的 TimePick 迁移范围；不修改 Jaspon 负责范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：DreamChasers 提供当前用户任务清单列表、新增、状态更新和删除 API；URL 和标题会 trim 并拒绝空值；状态只允许 `unstarted`、`trying`、`completed`、`deferred`、`abandoned`；完成状态要求评分 1-5；更新和删除只允许当前用户自己的任务；转换为资源时复用现有资源/文件夹权限校验；TimePick `/todo` 主链路不再导入或调用 Supabase `try_queue_links`；批量导入和未挂路由的旧 Simple 文件保持现状；DreamChasers 定向测试、TimePick 定向 ESLint/build、静态红绿检查、真实浏览器任务新增/开始/完成/删除联调、文档同步和 diff 检查通过。
- AI 初步方案：先补纯规则测试，覆盖任务输入规范化、状态规范化、完成评分校验、owner 写权限和字段映射。DreamChasers 新增 `GET/POST /api/timepick/todos` 和 `PATCH/DELETE /api/timepick/todos/[todoId]`；服务层基于 `TimePickTryQueueLink` 实现列表、新增、状态更新和删除。TimePick API client 新增任务清单方法，`TodoPage`、`AddTodoDialog`、`CompleteTodoDialog` 用 API client 替换 Supabase 直连；转换资源用已有 `fetchTimePickFolders` 与 `createTimePickResource`。
- 处理结论：已入任务池
- 对应任务编号：T129

### IDEA-20260604-12：TimePick 学习重点切到 DreamChasers API

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：T115 已让 TimePick 使用 DreamChasers 登录态，T116-T127 已逐步迁移文件夹、资源、标签、搜索、灵感和角色链路。`LearningFocusDialog` 仍直接读取和写入 Supabase `learning_focus`，学习重点列表、新增、删除和同义词更新绕过 DreamChasers 同账号 owner 权限。
- 目标：新增 T128，让 TimePick 学习重点列表读取、新增、删除和同义词更新走 DreamChasers API，并复用 DreamChasers `TimePickLearningFocus` 模型。
- 不做：不迁移待办、抽签、Profile、上传/Storage、自动识别、模块树或批量优先级 Edge Function；不修改 Prisma schema；不导入历史数据；不改变学习重点弹窗 UI 和批量优先级按钮语义。
- 用户价值：用户在统一账号登录后维护学习重点时，学习重点数据进入 DreamChasers PostgreSQL 并受当前登录用户权限保护，后续待办优先级能力有统一数据来源。
- 涉及模块：TimePick / DreamChasers API / 学习重点。
- 可能影响文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/learning-focus/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/LearningFocusDialog.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本任务限定在 Lee 负责的 TimePick 迁移范围；不修改 Jaspon 负责范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：DreamChasers 提供当前用户学习重点列表、新增、同义词更新和删除 API；名称会 trim 并拒绝空名称；同义词会 trim、去空、去重；删除和更新只允许当前用户自己的学习重点；TimePick `LearningFocusDialog` 不再导入或调用 Supabase `learning_focus`；批量优先级 Edge Function 保持现状；DreamChasers 定向测试、TimePick 定向 ESLint/build、静态红绿检查、真实浏览器学习重点新增/更新同义词/删除联调、文档同步和 diff 检查通过。
- AI 初步方案：先补纯规则测试，覆盖学习重点字段映射、名称规范化、同义词规范化和 owner 写权限。DreamChasers 新增 `GET/POST /api/timepick/learning-focus` 和 `PATCH/DELETE /api/timepick/learning-focus/[focusId]`；TimePick API client 新增学习重点方法，`LearningFocusDialog` 用 API client 替换 Supabase 直连，保留现有 prompt 和批量优先级 fetch。
- 处理结论：已入任务池
- 对应任务编号：T128

### IDEA-20260604-11：TimePick 角色选择切到 DreamChasers API

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：T115 已让 TimePick 使用 DreamChasers 登录态，T116-T126 已逐步迁移文件夹、资源、标签、搜索和灵感链路。`RoleSelect` 和 `Home` 仍直接写 Supabase `user_roles`，角色选择、默认 collector 初始化和角色切换会绕过 DreamChasers 账号与 PostgreSQL。
- 目标：新增 T127，让 TimePick 角色读取、设置和切换走 DreamChasers API，并复用 DreamChasers `TimePickUserRole` 模型。
- 不做：不迁移模块树、待办、抽签、Profile、上传/Storage、自动识别、学习焦点或其他 Supabase 链路；不修改 Prisma schema；不导入历史角色数据；不改变首页默认 collector 行为和角色 UI。
- 用户价值：用户在统一账号登录后，角色偏好进入 DreamChasers PostgreSQL 并受当前登录用户权限保护，TimePick 启动入口进一步脱离 Supabase。
- 涉及模块：TimePick / DreamChasers API / 角色选择 / 首页角色切换。
- 可能影响文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/role/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/lib/dreamchasers-auth.ts`, `/Users/lee/Desktop/Lee/TimePick/src/pages/RoleSelect.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Home.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本任务限定在 Lee 负责的 TimePick 迁移范围；不修改 Jaspon 负责范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：DreamChasers 提供当前用户角色读取和写入 API；角色只允许 `collector` 或 `searcher`；空值和非法值被拒绝；读取无角色时返回 `null`；写入使用当前登录用户；TimePick `RoleSelect` 和 `Home` 不再导入或调用 Supabase `user_roles`；保留 `localStorage userRole` 缓存；DreamChasers 定向测试、TimePick 定向 ESLint/build、静态红绿检查、真实浏览器默认角色初始化/角色选择或切换联调、文档同步和 diff 检查通过。
- AI 初步方案：先补纯规则测试，覆盖角色规范化、非法值拒绝和角色映射。DreamChasers 新增 `GET/PATCH /api/timepick/role`，服务层复用 `TimePickUserRole` upsert；TimePick API client 新增 `fetchTimePickRole` 和 `setTimePickRole`，`RoleSelect` 与 `Home` 用 API client 替换 Supabase `user_roles` 写入，仍保留 `localStorage` 降低首页重复请求。
- 处理结论：已入任务池
- 对应任务编号：T127

### IDEA-20260604-10：TimePick 灵感抽屉切到 DreamChasers API

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：T116-T125 已把 TimePick 首页资源、文件夹、标签和搜索页逐步切到 DreamChasers API。`InspirationDrawer` 和 `RecentInspirations` 仍直接查询 Supabase `inspirations`，灵感新增、编辑、删除和转资源状态标记仍绕过 DreamChasers 同账号 owner 权限。
- 目标：新增 T126，让 TimePick 灵感抽屉和最近灵感模块的灵感读取、新增、编辑、删除和标记已转换走 DreamChasers API。
- 不做：不迁移待办、抽签、Profile、上传/Storage、自动识别、角色选择、模块树或其他 Supabase 链路；不导入历史数据；不修改 Prisma schema；不改变语音识别 UI；不改变资源弹窗上传和自动识别流程。
- 用户价值：用户在统一账号登录后记录、查看、编辑、删除灵感，以及把灵感转为资源时，灵感数据进入 DreamChasers PostgreSQL 并受当前登录用户权限校验保护。
- 涉及模块：TimePick / DreamChasers API / 灵感抽屉 / 最近灵感。
- 可能影响文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/inspirations/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/InspirationDrawer.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/RecentInspirations.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本任务限定在 Lee 负责的 TimePick 迁移范围；不修改 Jaspon 负责范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：DreamChasers 提供当前用户灵感列表、新增、编辑、删除和状态更新 API；灵感内容会 trim 并拒绝空内容；删除和更新只允许当前用户自己的灵感；最近灵感只读取 active 状态且限制 3 条；`InspirationDrawer` 和 `RecentInspirations` 不再导入或调用 Supabase；DreamChasers 定向测试、TimePick 定向 ESLint/build、静态红绿检查、真实浏览器新增/编辑/删除/转资源联调、文档同步和 diff 检查通过。
- AI 初步方案：先补纯规则测试，覆盖灵感字段映射、输入规范化和 owner 校验。DreamChasers 新增 `GET/POST /api/timepick/inspirations` 和 `PATCH/DELETE /api/timepick/inspirations/[inspirationId]`；列表支持 `status=active` 和 `limit=3`。TimePick API client 新增灵感方法，两个组件改用 API client 替换 Supabase 直连，保留语音识别和转资源 UI 逻辑。
- 处理结论：已入任务池
- 对应任务编号：T126

### IDEA-20260604-09：TimePick 搜索页切到 DreamChasers API

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：T116-T124 已把 TimePick 首页资源列表、文件夹、资源删除、资源保存、预览心得和标签管理逐步切到 DreamChasers API。`SearchPage` 仍直接查询 Supabase `search_history` 和 `resources`，会绕过 DreamChasers 同账号 owner 权限和 PostgreSQL 数据。
- 目标：新增 T125，让 TimePick 搜索页的搜索历史读取/写入/删除和资源搜索结果读取全部走 DreamChasers API。
- 不做：不迁移灵感、待办、抽签、Profile、上传/Storage、自动识别、角色选择或其他 Supabase 链路；不导入历史数据；不修改 Prisma schema；不新增全文检索索引；不接 AI 搜索或模型能力；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 用户价值：用户在统一账号登录后，搜索页看到的历史记录和资源结果来自 DreamChasers PostgreSQL，并受当前登录用户权限校验保护，继续收敛 TimePick 核心查询链路。
- 涉及模块：TimePick / DreamChasers API / 搜索页 / 搜索历史。
- 可能影响文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/search/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/pages/SearchPage.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本任务限定在 Lee 负责的 TimePick 迁移范围；不修改 Jaspon 负责范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：DreamChasers 提供当前用户资源搜索和搜索历史 API；搜索历史写入会规范化空白并拒绝空关键词；搜索历史读取按最新排序且限制数量；删除历史只允许删除当前用户记录；资源搜索只返回当前用户资源并匹配 name/content/tags/notes/url；TimePick `SearchPage` 不再导入或调用 Supabase；DreamChasers 定向测试、TimePick 定向 ESLint/build、静态红绿检查、真实浏览器搜索/历史联调、文档同步和 diff 检查通过。
- AI 初步方案：先补纯规则测试，覆盖关键词规范化、空关键词拒绝、搜索匹配字段和 history owner 校验。DreamChasers 新增 `GET /api/timepick/search?keyword=...` 返回资源结果，`GET/POST /api/timepick/search/history` 管理历史列表和新增记录，`DELETE /api/timepick/search/history/[historyId]` 删除单条历史。TimePick API client 新增搜索和历史方法，`SearchPage` 用这些方法替换 Supabase 直连，保留现有 UI 行为。
- 处理结论：已入任务池
- 对应任务编号：T125

### IDEA-20260604-08：TimePick 标签读取和管理切到 DreamChasers API

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：T116-T123 已把 TimePick 首页核心资源列表、文件夹、资源删除、资源基础保存、自动识别 metadata 写回和预览心得保存逐步切到 DreamChasers API。标签云、标签树和标签管理仍从 Supabase `resources.tags` 读取，并通过 Supabase RPC 或资源 update 做标签删除、重命名和新增。
- 目标：新增 T124，让 `TagCloud`、`TagTree`、`TagManageDialog` 的标签读取和标签管理操作复用 DreamChasers resources API，不再直接调用 Supabase。
- 不做：不迁移搜索页；不迁移灵感、待办、抽签、Profile、上传/Storage 或自动识别；不新增独立标签表；不导入历史数据；不修改 Prisma schema；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 用户价值：用户在统一账号登录后，标签筛选和标签管理基于 DreamChasers PostgreSQL 资源数据，资源主链路继续减少 Supabase 依赖面。
- 涉及模块：TimePick / DreamChasers API / 标签云 / 标签树 / 标签管理。
- 可能影响文件：`/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/TagCloud.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/TagTree.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/TagManageDialog.tsx`, `docs/tasks/**`, `docs/superpowers/plans/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本任务限定在 Lee 负责的 TimePick 迁移范围；不修改 Jaspon 负责范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：`TagCloud`、`TagTree`、`TagManageDialog` 不再导入 Supabase；标签统计来自 DreamChasers resources API；删除标签会从所有含该标签的资源中移除；重命名标签会替换所有含旧标签的资源并去重；新增标签沿用现有行为，把标签挂到第一个资源，若无资源则提示先创建资源；TimePick 定向 ESLint/build、静态红绿检查、真实浏览器标签读取/新增/重命名/删除联调、文档同步和 diff 检查通过。
- AI 初步方案：在 TimePick API client 中新增 `getTimePickTagStats`，从 `Resource[]` 统计标签；扩展 `TimePickResourcePayloadPatch` 支持 `tags`，让 `buildTimePickResourcePayload(resource, { tags })` 保留其他 metadata。三个标签组件使用 `fetchTimePickResourceView({ displayMode: "resource-only", selectedType: "all" })` 获取资源，标签管理批量调用 `updateTimePickResource` 更新资源 tags。先运行静态红灯检查确认 Supabase import/RPC 仍存在，再实现并确认转绿。
- 处理结论：已入任务池
- 对应任务编号：T124

### IDEA-20260604-05：TimePick 资源卡片自动识别更新切到 DreamChasers API

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：T119 已把 `ResourceCard` 删除资源切到 DreamChasers API，T120 已把 `ResourceDialog` 基础新增/编辑保存切到 DreamChasers API。`ResourceCard` 自动识别仍在识别成功后直接用 Supabase `.from('resources').update(...)` 写回资源标题、内容和缩略图。Lee 确认旧自动识别 AI 能力之前依赖 Coze 工作流，但该工作流已经关闭，后续会重新优化并嵌入平台系统 AI 能力。
- 目标：新增 T121，让 `ResourceCard` 自动识别后的资源 metadata 更新走 DreamChasers `updateTimePickResource` API client。
- 不做：不替换 Supabase Edge Function `auto-recognize`；不替换识别图片下载上传和 Supabase Storage；不迁移上传、灵感、待办、抽签、标签管理、搜索或 Profile 统计；不导入历史数据；不修改 Prisma schema；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 用户价值：用户从资源卡片点击自动识别后，识别结果写回当前资源时进入 DreamChasers PostgreSQL 和 owner 权限校验，资源卡片主操作进一步减少 Supabase 写库依赖。
- 涉及模块：TimePick / DreamChasers API / ResourceCard / 自动识别结果写回。
- 可能影响文件：`/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本任务限定在 Lee 负责的 TimePick 迁移范围；不修改 Jaspon 负责范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：`ResourceCard` 自动识别结果写回不再使用 Supabase `.from('resources').update`；写回时保留原资源 section、folder、url、notes、tags、source inspiration、file size 等字段，只覆盖识别返回的 name/content/thumbnail；Supabase Edge Function 和 Storage 上传仍保留原状；旧 Coze 自动识别工作流关闭导致真实识别不作为本任务验收前置；TimePick 定向 ESLint/build、静态回归检查、文档同步和 diff 检查通过。
- AI 初步方案：在 TimePick API client 中新增 `buildTimePickResourcePayload`，从现有 `Resource` 合成完整更新 payload，避免调用 DreamChasers `PATCH` 时丢失必填字段。`ResourceCard.handleAutoRecognize` 的最终更新改调用 `updateTimePickResource(resource.id, buildTimePickResourcePayload(resource, updateData))`。先用静态回归命令确认旧 Supabase update 存在，再实现并确认命令转绿。
- 处理结论：已入任务池
- 对应任务编号：T121

### IDEA-20260604-06：TimePick 自动识别重做为平台系统 AI 能力

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：TimePick 旧自动识别能力此前依赖 Coze 工作流，现在该工作流已经关闭。后续需要重新优化自动识别，并嵌入 DreamChasers 平台系统 AI 能力；图片生成/图片能力部分计划单独做一个 skill。
- 目标：后续单独拆任务，设计并实现新的平台 AI 自动识别能力，替换旧 Supabase Edge Function / Coze 工作流；图片生成能力另做独立 skill。
- 不做：本次不实现新 AI 能力；不接真实模型；不迁移 Storage；不修改现有 T121 代码范围。
- 用户价值：避免继续依赖已关闭的 Coze 工作流，让 TimePick 自动识别后续走平台统一 AI 能力，便于账号、额度、模型来源和后续图片生成能力统一治理。
- 涉及模块：TimePick / DreamChasers AI Gateway / 自动识别 / 图片生成 skill。
- 可能影响文件：后续待拆，可能涉及 `apps/web/src/lib/ai/**`, `apps/web/src/app/api/timepick/**`, `/Users/lee/Desktop/Lee/TimePick/src/**`, `docs/tasks/**`, `docs/superpowers/specs/**`, Codex skill 目录。
- 是否影响另一方任务：待评估。后续如果涉及平台 AI 或图片 skill，需要单独确认文件边界。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：待后续任务明确。
- AI 初步方案：先做规划任务，明确自动识别输入/输出 JSON、平台 AI provider 调用、账号额度、失败降级、图片生成 skill 边界，再拆实现任务。
- 处理结论：已入任务池
- 对应任务编号：T122

### IDEA-20260604-07：TimePick 资源预览心得保存切到 DreamChasers API

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：T120 已提供 DreamChasers 资源基础编辑 API，`ResourcePreview` 预览弹窗中的“保存心得”仍直接调用 Supabase `.from('resources').update({ notes })`。
- 目标：新增 T123，让 `ResourcePreview` 保存心得走 DreamChasers `updateTimePickResource` API client。
- 不做：不改预览渲染；不替换资源文件打开/图片/视频预览；不迁移上传、自动识别、Storage、灵感、待办、抽签、标签管理、搜索或 Profile 统计；不导入历史数据；不修改 Prisma schema。
- 用户价值：用户在资源预览弹窗保存心得时，写回进入 DreamChasers PostgreSQL 和 owner 权限校验，继续减少 Supabase 写库依赖。
- 涉及模块：TimePick / DreamChasers API / ResourcePreview / 资源心得。
- 可能影响文件：`/Users/lee/Desktop/Lee/TimePick/src/components/ResourcePreview.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本任务限定在 Lee 负责的 TimePick 迁移范围；不修改 Jaspon 负责范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：`ResourcePreview` 不再导入 Supabase；保存心得调用 DreamChasers API client；保存时保留原资源 section、folder、url、content、tags、thumbnail、source inspiration、file size 等字段，只覆盖 notes；TimePick 定向 ESLint/build、静态红绿检查、真实浏览器保存心得联调、文档同步和 diff 检查通过。
- AI 初步方案：复用 T121 新增的 `buildTimePickResourcePayload`，将 `handleSaveNotes` 改为 `updateTimePickResource(resource.id, buildTimePickResourcePayload(resource, { notes }))`。如果 helper 类型缺少 notes patch，先扩展 helper 类型并用静态红绿检查确认 `ResourcePreview` 的 Supabase update 被移除。
- 处理结论：已入任务池
- 对应任务编号：T123

### IDEA-20260604-04：TimePick 资源录入编辑基础保存切到 DreamChasers API

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：T116-T119 已把 TimePick 首页文件夹树、资源列表、文件夹增删改、资源移动、子文件夹卡片和资源删除切到 DreamChasers API。`ResourceDialog` 仍直接读取 Supabase sections/folders，并用 Supabase 保存新增/编辑资源，是资源主链路里下一块高频基础操作。
- 目标：新增 T120，让 `ResourceDialog` 的基础资源新增/编辑保存、folders 读取和 sections 读取切到 DreamChasers API。
- 不做：不替换上传文件到 Supabase Storage；不替换自动识别 Edge Function；不替换识别图片下载上传；不迁移灵感状态回写、待办、抽签、标签管理、搜索或 Profile 统计；不导入历史数据；不修改 Prisma schema；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 用户价值：用户在统一账号登录后可以从 TimePick 表单新增和编辑基础资源元数据，资源 CRUD 主链路进一步进入 DreamChasers PostgreSQL 和权限校验。
- 涉及模块：TimePick / DreamChasers API / ResourceDialog / 资源保存。
- 可能影响文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/resources/**`, `apps/web/src/app/api/timepick/sections/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceDialog.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本任务限定在 Lee 负责的 TimePick 迁移范围；不修改 Jaspon 负责范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：DreamChasers 提供 sections 读取、资源新增和资源基础编辑 API；所有资源保存校验当前用户 owner、section 存在、folder 属于当前用户；TimePick `ResourceDialog` 基础保存和 folders/sections 读取不再直连 Supabase；上传和自动识别仍保留原 Supabase 链路；DreamChasers 测试、类型检查、构建、TimePick 定向 ESLint/build、真实浏览器新增/编辑资源联调、文档同步和 diff 检查通过。
- AI 初步方案：先补纯规则测试，覆盖资源名称规范化、section/folder 权限校验、保存 payload 规范化和编辑 owner 校验。DreamChasers 新增 `GET /api/timepick/sections`、`POST /api/timepick/resources`，并扩展 `[resourceId]` 的 `PATCH` 支持基础字段更新；TimePick API client 新增 `fetchTimePickSections`、`createTimePickResource`、`updateTimePickResource`，`ResourceDialog` 复用已有上传和自动识别逻辑，只把最终 metadata 保存改走 DreamChasers API。
- 处理结论：已入任务池
- 对应任务编号：T120

### IDEA-20260604-03：TimePick 资源卡片删除切到 DreamChasers API

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：T116-T118 已把 TimePick 首页文件夹、资源列表、文件夹新增/编辑/删除、子文件夹卡片和资源移动主链路切到 DreamChasers API。`ResourceCard` 的删除资源仍直接调用 Supabase，是资源列表里剩余的高频基础操作。
- 目标：新增 T119，DreamChasers 提供当前用户资源删除 API，并让 TimePick `ResourceCard` 删除资源时调用 DreamChasers API client。
- 不做：不替换 `ResourceDialog` 新增/编辑；不替换自动识别、缩略图下载上传、Supabase Storage、灵感、待办、抽签、标签管理；不导入历史数据；不修改 Prisma schema；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 用户价值：用户在统一账号登录后可以从资源列表删除自己的资源，删除操作进入 DreamChasers PostgreSQL 权限校验，进一步收敛首页核心资源管理闭环。
- 涉及模块：TimePick / DreamChasers API / 资源卡片。
- 可能影响文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/resources/[resourceId]/route.ts`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本任务限定在 Lee 负责的 TimePick 迁移范围；不修改 Jaspon 负责范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：DreamChasers `DELETE /api/timepick/resources/[resourceId]` 只允许当前用户删除自己的资源；TimePick API client 新增删除资源方法；`ResourceCard` 删除资源不再使用 Supabase；自动识别、缩略图上传和编辑仍保持原状；DreamChasers 测试、类型检查、构建、TimePick 定向 ESLint/build、真实浏览器删除资源联调、文档同步和 diff 检查通过。
- AI 初步方案：先补纯规则测试，新增 `canDeleteTimePickResource` 校验 requester 与 resource owner 一致。DreamChasers 服务层新增 `deleteTimePickResource`，route 增加 `DELETE` 并复用 CORS。TimePick `timepick-api.ts` 新增 `deleteTimePickResource`，`ResourceCard.handleDelete` 改调用该方法；保留文件内 Supabase import，因为自动识别和上传仍使用 Supabase。
- 处理结论：已入任务池
- 对应任务编号：T119

### IDEA-20260604-02：TimePick 子文件夹卡片操作切到 DreamChasers API

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：T116/T117 已把 TimePick 首页的文件夹树、资源列表、文件夹删除、资源移动、文件夹新增和重命名切到 DreamChasers API。T117 收尾时确认 `SubFolderCard` 仍含 Supabase 调用，主要覆盖子文件夹统计、删除和拖拽移动资源。
- 目标：新增 T118，让 TimePick `SubFolderCard` 不再直接调用 Supabase，子文件夹统计、删除子文件夹和拖拽移动资源统一复用 DreamChasers API client。
- 不做：不替换资源新增/编辑/上传；不替换 `ResourceCard`、`ResourceDialog`、灵感、待办、抽签、标签管理、AI 识别或 Storage；不导入历史数据；不修改 Prisma schema；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 用户价值：用户在 TimePick 首页子文件夹卡片中看到的数量和执行的删除/移动操作都走统一账号和 PostgreSQL API，进一步减少 Supabase 依赖面。
- 涉及模块：TimePick / DreamChasers API / 子文件夹卡片。
- 可能影响文件：`/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/SubFolderCard.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本任务限定在 Lee 负责的 TimePick 迁移范围；不修改 Jaspon 负责范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：`SubFolderCard` 不再直接导入或调用 Supabase；子文件夹资源数/子文件夹数统计来自 DreamChasers API；删除子文件夹调用 DreamChasers 文件夹删除 API；拖拽资源到子文件夹调用 DreamChasers 资源移动 API；TimePick 定向 ESLint/build、真实浏览器子文件夹统计/删除/拖拽联调、文档同步和 diff 检查通过。
- AI 初步方案：优先复用 T116 已有 `fetchTimePickFolders`、`fetchTimePickResources`、`deleteTimePickFolder`、`moveTimePickResource`，在 `SubFolderCard` 中按父文件夹 ID 获取直接子文件夹和直接资源数量，删除和 drop handler 改走 API client。若现有资源查询接口已支持 `folderId`，不新增 DreamChasers API；只在发现字段缺口时补最小 client 类型。
- 处理结论：已入任务池
- 对应任务编号：T118

### IDEA-20260604-01：TimePick 文件夹新增和重命名切到 DreamChasers API

- 提出人：Lee
- 提出时间：2026-06-04
- 背景：T116 已把 TimePick 文件夹树读取、资源列表读取、删除文件夹和移动资源切到 DreamChasers API，并完成真实浏览器 CORS/cookie 联调。下一步需要让 `FolderDialog` 的新建文件夹和编辑文件夹也脱离 Supabase。
- 目标：新增 T117，DreamChasers 提供 TimePick 创建/更新文件夹 API，并让 TimePick `FolderDialog` 使用 DreamChasers API 完成文件夹列表读取、同级重名检查、新建和重命名/移动父级。
- 不做：不替换资源新增/编辑/上传；不替换灵感、待办、抽签、标签管理、AI 识别；不导入历史数据；不修改 Prisma schema；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 用户价值：用户在统一账号登录后的首页文件夹主链路可以完成“看、建、改、删、移动资源”的闭环，减少对 Supabase 的依赖面。
- 涉及模块：TimePick / DreamChasers API / 文件夹管理。
- 可能影响文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/folders/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/FolderDialog.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本任务限定在 Lee 负责的 TimePick 迁移范围；不修改 Jaspon 负责范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：DreamChasers API 支持当前用户创建文件夹、更新文件夹名称和父级，并校验 owner、同级重名和循环父级；TimePick `FolderDialog` 不再直接调用 Supabase；测试、类型检查、构建、TimePick 定向 ESLint/build、真实浏览器新建和重命名文件夹联调、文档同步和 diff 检查通过。
- AI 初步方案：复用 T116 的 folders API 和 CORS helper，在 `POST /api/timepick/folders` 创建文件夹，在 `PATCH /api/timepick/folders/[folderId]` 更新文件夹。纯规则层新增文件夹名称规范化、同级重名和循环父级判断测试；前端复用 `fetchTimePickFolders`，新增 `createTimePickFolder` / `updateTimePickFolder`。
- 处理结论：已入任务池
- 对应任务编号：T117

### IDEA-20260603-06：TimePick 文件夹和资源列表切到 DreamChasers API

- 提出人：Lee
- 提出时间：2026-06-03
- 背景：T114 已建立 TimePick PostgreSQL 迁移基座，T115 已把 TimePick 登录壳切到 DreamChasers 同账号 bootstrap。下一步需要开始替换 TimePick 业务数据访问，优先切用户进入首页最核心的文件夹树和资源列表。
- 目标：新增 T116，DreamChasers 提供 TimePick 文件夹/资源列表 API；TimePick `FolderTree` 和 `ResourceList` 改用 DreamChasers API 读取文件夹、资源、子文件夹和面包屑，并支持删除文件夹、拖拽移动资源的最小操作。
- 不做：不替换新增/编辑资源表单；不迁移文件上传和 Supabase Storage；不替换灵感、待办、抽签、标签管理、AI 识别；不导入历史数据；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 用户价值：登录壳切到统一账号后，TimePick 首页主数据读取也开始进入 DreamChasers PostgreSQL，为后续逐屏替换打通路径。
- 涉及模块：TimePick / DreamChasers API / PostgreSQL / Prisma。
- 可能影响文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/**`, `/Users/lee/Desktop/Lee/TimePick/src/components/FolderTree.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceList.tsx`, `docs/tasks/**`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本任务限定在 Lee 负责的 TimePick 迁移范围；不修改 Jaspon 负责范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：DreamChasers API 可返回当前用户文件夹、资源、子文件夹和面包屑；文件夹删除和资源移动校验 owner；TimePick 文件夹树和资源列表不再直接调用 Supabase 读取；DreamChasers 相关测试、TimePick build、文档同步和 diff 检查通过。
- AI 初步方案：API 返回 Supabase 兼容字段（`parent_id`, `folder_id`, `section_id`, `sections`），减少 TimePick 组件改动。权限统一使用 Auth.js 当前用户 email 回查平台 `User.id`，所有查询都带 `userId`。
- 处理结论：已入任务池
- 对应任务编号：T116

### IDEA-20260603-05：TimePick 前端登录壳切换到 DreamChasers 同账号

- 提出人：Lee
- 提出时间：2026-06-03
- 背景：T114 已在 DreamChasers PostgreSQL 中建立 TimePick 同账号迁移基座和 `GET /api/timepick/bootstrap`。下一步需要让 TimePick 前端不再优先使用自己的 Supabase 用户名/密码登录，而是通过 DreamChasers 账号中心进入，并读取 bootstrap 身份。
- 目标：新增 T115，在 `/Users/lee/Desktop/Lee/TimePick/` 中新增 DreamChasers API 客户端和登录壳：启动时调用 `/api/timepick/bootstrap` 获取同账号用户；未登录时跳转到 DreamChasers `/login?returnUrl=<TimePick当前地址>`；保留旧 Supabase 数据查询不在本任务替换。
- 不做：不迁移所有 TimePick 资源/文件夹/待办/抽签数据查询；不删除 Supabase client；不导入历史数据；不改 DreamChasers 数据库 schema；不接 AI Gateway；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 用户价值：TimePick 用户入口开始收敛到 DreamChasers 统一账号，为后续逐屏替换数据 API 和历史数据导入建立前端入口。
- 涉及模块：TimePick / DreamChasers 账号中心 / 产品型工具。
- 可能影响文件：`/Users/lee/Desktop/Lee/TimePick/package.json`, `/Users/lee/Desktop/Lee/TimePick/package-lock.json`, `/Users/lee/Desktop/Lee/TimePick/src/lib/**`, `/Users/lee/Desktop/Lee/TimePick/src/contexts/AuthContext.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/AuthGuard.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Login.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Register.tsx`, `docs/tasks/**`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本任务限定在 Lee 负责的 TimePick 登录壳和 DreamChasers 文档；不修改 Jaspon 负责范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：TimePick 新增最小测试脚本；DreamChasers 登录 URL 生成规则有测试；AuthContext 可通过 bootstrap 设置平台用户；登录/注册入口改为跳转 DreamChasers 账号中心；`npm run test`、`npm run lint`、`npm run build` 在 TimePick 通过；DreamChasers `npm run docs:sync` 和 `git diff --check` 通过。
- AI 初步方案：新增 `src/lib/dreamchasers-auth.ts`，封装 API base、登录 URL、bootstrap fetch 和平台用户转换；AuthContext 保持 `user.id` 等现有调用兼容，但后端来源改成 DreamChasers bootstrap。旧 Supabase signIn/signUp 入口改为跳转平台登录/注册说明，后续 T116 再替换资源数据 API。
- 处理结论：已入任务池
- 对应任务编号：T115

### IDEA-20260603-04：TimePick 直接迁移到 DreamChasers Postgres 并共用平台账号

- 提出人：Lee
- 提出时间：2026-06-03
- 背景：T110-T113 已完成 DreamChasers 邮箱登录、账号中心、产品 token 生成和消费 API。Lee 确认拾光 TimePick 不再做 Supabase Auth 到平台账号的桥接层，而是直接迁移到 DreamChasers PostgreSQL，并使用同一套 DreamChasers 账号作为 TimePick 数据 owner。
- 目标：新增 T114，先建立 TimePick 迁移基座：把 TimePick 核心业务表映射到 DreamChasers Prisma/Postgres，owner 字段引用平台 `User.id`，新增受 Auth.js 保护的 TimePick bootstrap API，作为后续替换 TimePick Supabase 查询和导入历史数据的基础。
- 不做：不在本任务内完成 TimePick 全前端改造；不迁移 Supabase Storage 文件；不迁移历史线上数据；不接 AI Gateway；不删除 TimePick 现有 Supabase 代码；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 用户价值：TimePick 与 DreamChasers 主站使用同一个账号，后续用户登录平台后即可进入拾光，拾光数据也进入平台统一 PostgreSQL，便于后续权益、AI 能力、备份和商业化统一治理。
- 涉及模块：平台账号中心 / TimePick / 产品型工具 / PostgreSQL / Prisma / Auth.js。
- 可能影响文件：`apps/web/prisma/**`, `apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/**`, `apps/web/src/generated/prisma/**`, `/Users/lee/Desktop/Lee/TimePick/src/**`（后续任务）, `docs/tasks/**`, `docs/superpowers/plans/**`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**`。
- 是否影响另一方任务：否。本任务限定在 Lee 负责的平台账号、数据库和 TimePick 接入范围；不修改 Jaspon 负责的 AI 修图、AI 搜索、埋点或部署范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：T114 任务和领取分片创建；TimePick 核心 schema 已落到 DreamChasers Prisma，owner 引用平台 `User.id`；新增 bootstrap API 能在已登录平台用户下返回/创建 TimePick profile 和默认 section；测试、Prisma 校验、类型检查、构建、文档同步和 diff 检查通过。
- AI 初步方案：先盘点 TimePick Supabase 表，保留原表语义但统一加 `timePick` 前缀，避免和主站 `ContentItem` 等模型混淆。第一批落表覆盖 profile、role、section、folder、resource、inspiration、search history、tag group、try queue、learning focus、fortune draw。API 层先做 bootstrap，后续任务逐屏替换 TimePick 前端的 Supabase client 查询。
- 处理结论：已入任务池
- 对应任务编号：T114

### IDEA-20260603-03：统一账号中心、产品型工具入口和 AI Gateway 规划

- 提出人：Lee
- 提出时间：2026-06-03
- 背景：Lee 希望把 `拾光 TimePick` 和 `镜界 Wonderland` 作为工具站下的独立产品型工具接入。两个产品可以各自有登录入口，也可以从产品进入主站；同时平台后续需要统一用户账号、积分、订阅、API Key、LLM 调用、provider 配置和模型账号池。现有工程里，AI 修图已有 provider adapter 雏形；拾光使用 Supabase Auth；镜界使用 FastAPI JWT 和多 provider 环境变量，需要先形成平台级规划。
- 目标：新增 T108，先完成平台账号中心、工具站产品分层、独立产品型工具接入、AI Gateway 和 BYOK 模型来源规划，不进入开发。规划需要明确平台额度、用户临时 Key、外部 Gateway BYOK、自建加密 Key Vault 和本地连接器五类模型来源，并为后续账号中心 MVP、产品 token exchange、LLM provider 协议和模型账号池预留扩展口。
- 不做：不开发账号、登录、SSO、产品接入或 AI Gateway 代码；不迁移拾光或镜界现有账号；不接入真实模型 API；不实现支付、订阅、充值、模型账号池或 Key Vault；不修改 `apps/**`, `packages/**`, `deploy/**` 或任何产品代码。
- 用户价值：用户可以免费使用网站，也可以选择订阅/充值使用平台 AI 能力，或自带模型能力；拾光、镜界作为工具站产品保持独立体验，同时共享平台账号、权益和 AI 能力。
- 涉及模块：平台账号中心 / 工具站 / 独立产品型工具 / AI Gateway / BYOK / LLM provider。
- 可能影响文件：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T108-platform-account-ai-gateway-planning.md`, `docs/tasks/claims/T108-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-06-03-platform-account-ai-gateway-design.md`, `docs/progress/2026-06-03-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`；后续实现可能影响 `apps/web/prisma/**`, `apps/web/src/lib/auth/**`, `apps/web/src/app/api/auth/**`, `apps/web/src/lib/ai/**`, `apps/web/src/app/api/ai/**`, `apps/web/src/components/portal-data.ts` 和拾光/镜界各自接入层。
- 是否影响另一方任务：本次只做规划文档，不修改 Jaspon 负责的 AI 修图、AI 搜索、埋点或部署范围；后续进入实现时会影响平台共享能力，需要单独拆分任务和确认文件边界。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：形成可评估规划设计稿，覆盖工具站产品分层、统一账号中心、多处登录入口、产品 token exchange、AI Gateway、模型来源、BYOK 隐私方案、provider 协议、阶段拆分和风险；`npm run docs:sync`、占位符扫描和 `git diff --check` 通过。
- AI 初步方案：推荐采用 `工具站统一归口 + 产品独立入口 + 自建账号中心 + 统一 AI Gateway`。账号中心使用 Next.js、Prisma/Postgres 和 Auth.js；模型能力支持 `platform_pool`, `user_ephemeral_key`, `external_gateway_byok`, `user_encrypted_vault`, `local_connector` 五类来源。第一版只做平台额度和用户临时 Key 预留，外部 Gateway BYOK 和本地连接器后置。
- 处理结论：已入任务池
- 对应任务编号：T108

### IDEA-20260603-02：AI 面试助手和虚拟面试规划

- 提出人：Lee
- 提出时间：2026-06-03
- 背景：Lee 希望新增一个网页 AI 工具，用户输入岗位 JD、求职者简历和补充信息，支持上传简历图片，系统自动生成面试题、参考答案和可下载 HTML 报告。后续讨论确认该工具需要同时服务面试官和面试者，并支持进入虚拟面试，由大模型根据用户回答动态追问和复盘。
- 目标：新增 T106，先完成具体规划文档和模块文档，不进入开发。规划需要评估该功能是否适合挂在网页小工具里，并明确双入口、参数配置、HTML 下载报告、文本虚拟面试、合规边界和后续拆分路线；后续可扩展简历优化建议，并在面试题纲中补充专业领域实战例子和行业用法说明。
- 不做：不开发业务代码；不接入真实大模型 API；不实现实时语音面试；不实现简历优化改写；不新增账号、历史记录、企业筛选或 ATS 接入；不修改 PDF 工具箱、AI 修图、胡了卜游戏、部署或数据库模型。
- 用户价值：面试者可以根据岗位和简历得到精准题目、回答框架、追问风险和虚拟面试复盘；面试官可以得到结构化问题、追问链、评分卡和不合规问题提醒。
- 涉及模块：AI 面试助手 / 网页工具频道 / AI 能力工具 / 虚拟面试 / HTML 下载报告。
- 可能影响文件：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T106-ai-interview-coach-planning.md`, `docs/tasks/claims/T106-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-06-03-ai-interview-coach-design.md`, `docs/modules/ai-interview-coach/**`, `docs/progress/2026-06-03-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`；后续如进入开发，可能影响 `apps/web/src/app/tools/ai-interview-coach/**`, `apps/web/src/modules/tools/ai-interview-coach/**`, `apps/web/src/app/api/tools/ai-interview-coach/**`, `apps/web/src/components/portal-data.ts`。
- 是否影响另一方任务：否。本次只做规划文档，不修改 Jaspon 负责的 AI 修图、AI 搜索、埋点或部署范围；后续如进入开发，需要单独领取并确认工具频道共享入口文件。
- 是否需要新增任务：是
- 建议优先级：P2
- 验收标准：形成可评估规划设计稿，覆盖产品定位、MVP 范围、用户流程、差异化、AI 能力拆分、技术可行性、合规边界、商业化和阶段拆分；建立 `docs/modules/ai-interview-coach/` 必备模块文档；`npm run docs:sync`、占位符扫描和 `git diff --check` 通过。
- AI 初步方案：推荐作为网页小工具候选方向入池，定位为 `AI 面试助手：生成面试作战包，进入虚拟面试，下载复盘报告`。第一版先做文本报告和文本虚拟面试，使用结构化 JSON 中间层和固定 HTML 模板，不直接让模型生成整页 HTML；实时语音、历史记录和企业筛选后置。后续增强可加入简历优化建议，并让面试提纲补充专业领域的简单实战例子、行业用法说明和可迁移回答素材。
- 处理结论：已入任务池
- 对应任务编号：T106, T107

### IDEA-20260603-01：胡了卜震落牌平铺和遮挡点击修复

- 提出人：Lee
- 提出时间：2026-06-03
- 背景：Lee 试玩站内发布版时发现，重复几次 `胡` 和 `杠` 后，震落到桌面的牌会重新叠在一起；同时视觉上被盖住的下层牌仍然可以点击，破坏“只有露出的牌可点”的核心规则。
- 目标：新增 T105，修复默认玩家 Demo 和站内静态副本中的震落牌落点与点击判定。震落牌应进入桌面平铺层，连续多次开山也不能互相堆叠；任何视觉上被更高层牌明显盖住的普通牌都不可点击，震落牌自身仍保持可点击入槽。
- 不做：不修改 Cocos 正式工程；不修改共享 Graph-based 生成器；不新增正式动画、音效或美术；不调整 `杠` 震落 1 张、`胡` 震落 3 张的数量；不改变牌河、补杠、胡牌或记牌器玩法口径。
- 用户价值：避免玩家看到“掉下来的牌又叠起来”的违和反馈，并恢复堆叠消除最基本的可点击可信度：被盖住就不能点，露出来才可以点。
- 涉及模块：胡了卜 / 默认玩家 Demo / 开山震落牌 / 遮挡点击判定 / Web 静态发布副本。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T105-hulebu-loose-tile-layer-blocking-fix.md`, `docs/tasks/claims/T105-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务限定在 Lee 负责的胡了卜 HTML 试玩原型、站内静态副本和共享测试，不碰 Jaspon 负责的 AI 修图、AI 搜索、埋点或部署范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：连续多次 `杠 / 胡` 触发的震落牌在桌面平铺层有稳定不重叠落点；震落牌不保留旧堆叠列、桥接或 blocker 元数据；震落牌自身可点击入槽；被普通牌或震落牌明显盖住的下层普通牌不可点击；默认原型和 `/games/hulebu-demo/index.html` 静态副本同步；共享测试、脚本语法、Web 接入测试、浏览器桌面/移动复测、文档同步和 diff 检查通过。
- AI 初步方案：按 TDD 先补 VM 回归测试，复现“多次震落牌重叠”和“被震落牌覆盖的下层牌仍可点”。根因方向为 `shakeLooseMountainTile` 复用局部偏移且清空了遮挡关系，同时运行态遮挡检测忽略了 `looseMountainTile`。实现时增加单调递增的震落牌平铺序号和桌面网格落点，清理旧堆叠元数据；运行态普通牌遮挡检测计入震落牌，震落牌自身仍直接可点。
- 处理结论：已入任务池
- 对应任务编号：T105

### IDEA-20260602-08：胡了卜悬台窄腰模板调牌器实现

- 提出人：Lee
- 提出时间：2026-06-02
- 背景：T103 已确认可以借鉴高堆叠参考图的结构方向，推荐先做 `悬台窄腰 / suspended-waist` 模板，并先接入调牌器验证，不直接替换默认朋友试玩关。
- 目标：新增 T104，在当前 HTML 试玩原型中新增 `suspended-waist` 牌山模板。该模板可在调牌器下拉和 URL 参数中选择，静态发布副本同步该模板供站内调牌器验证；默认玩家页 auto 随机池暂不加入该模板，避免影响 `/games/hulebu` 当前发布试玩体验。
- 不做：不复制参考图美术、颜色、牌面或文案；不把 `suspended-waist` 加入默认朋友试玩第 5-10 关 auto 池；不修改 Cocos 正式工程；不修改共享 Graph-based 生成器；不调整 T101 当前 `杠 / 胡 / 记牌器 / 动作栏` 玩法。
- 用户价值：让 Lee 可以在调牌器中实际查看和测试立体窄腰牌山的读牌压力，确认可读性、入口数量和视觉冲击后，再决定是否进入默认高压关。
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 调牌器 / Web 静态发布副本 / 密集牌山模板。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `apps/web/public/games/hulebu-demo/tuner.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T104-hulebu-suspended-waist-template.md`, `docs/tasks/claims/T104-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-06-02-hulebu-suspended-waist-template.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/completion/**`
- 是否影响另一方任务：否。T104 只改 Lee 负责的胡了卜 HTML 原型、静态游戏副本、共享测试和模块文档，不碰 AI 修图、AI 搜索、埋点或部署范围。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：`suspended-waist` 出现在调牌器模板列表和 URL 参数归一化中；模板中文名为 `悬台窄腰`；模板锚点包含顶部平台、窄腰、支撑柱和侧向散牌四类结构标记；指定 `template=suspended-waist` 可生成密集牌山，首轮可点保持 3-8 张且无完整答案组直接露出；默认玩家页 auto 模板池暂不包含该模板；静态发布副本同步且保留绝对配置路径；共享测试、脚本语法、Web 接入测试、浏览器桌面/移动检查、文档同步和 diff 检查通过。
- AI 初步方案：按 TDD 先补静态测试和 VM 测试，要求模板 ID、中文名、结构角色字段、调牌器 URL 指定模板和默认 auto 池排除。实现时扩展 `MOUNTAIN_TEMPLATE_IDS` 和 `MOUNTAIN_TEMPLATE_LABELS`，新增 `getMountainTemplateAnchors("suspended-waist")` 锚点，并为锚点加 `templateRegion` 数据用于验证结构；生成后同步 `apps/web/public/games/hulebu-demo/` 静态副本。
- 处理结论：已入任务池
- 对应任务编号：T104

### IDEA-20260602-07：胡了卜立体窄腰牌山模板参考

- 提出人：Lee
- 提出时间：2026-06-02
- 背景：Lee 看到一张“羊了个羊”式高堆叠截图，结构上有上层大平台、中段窄腰、底部支撑柱和侧向散牌，视觉上比当前普通平铺/环形/阶梯模板更有立体压迫感。该参考可以用于胡了卜牌山结构方向，但不能照搬原图美术、牌面符号、文案或具体布局。
- 目标：新增 T103，先做结构设计规格，抽象出适合胡了卜的“高层平台 + 中段窄腰 + 底部支撑柱 + 侧向散牌”牌山模板方向，并明确它在默认朋友 Demo、调牌器、后续 Cocos 共享生成器中的落地顺序。
- 不做：不直接复制参考图的美术、颜色、牌面、文案或关卡形状；不立即修改 `/games/hulebu` 当前发布试玩版；不修改 Cocos 正式工程；不扩大到 PDF、AI 修图、AI 搜索、埋点或部署。
- 用户价值：让牌山看起来更像“真实堆起来的难关”，提升视觉冲击、层级期待和记忆压力；同时通过窄腰和支撑柱控制可点击入口，让玩家不再感觉只是平面随机散牌。
- 涉及模块：胡了卜 / 密集牌山模板 / 默认玩家 Demo / 调牌器 / 后续 Cocos 牌山生成器。
- 可能影响文件：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T103-hulebu-stacked-waist-mountain-template-design.md`, `docs/tasks/claims/T103-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-06-02-hulebu-stacked-waist-mountain-template-design.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`
- 是否影响另一方任务：否。T103 先做胡了卜牌山模板设计，不修改 Jaspon 负责的 AI 修图、AI 搜索、埋点或部署范围。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：形成可执行设计规格，说明参考图可借鉴的结构点、必须规避的照搬点、推荐模板方案、参数范围、可读性约束、难度用途、默认 Demo 与调牌器落地顺序、后续实现任务边界；`npm run docs:sync`、占位符扫描和 `git diff --check` 通过。
- AI 初步方案：推荐先设计一个 `suspended-waist / 悬台窄腰` 模板：上层平台提供视觉压迫，中段 1-2 条窄腰形成释放瓶颈，底部 2-3 个支撑柱提供后期解锁目标，侧边少量散牌作为干扰和恢复入口。实现应先进入调牌器可选模板，确认读牌清楚后再加入第 8-10 关随机池；当前发布版不自动替换，避免影响已准备发给朋友的稳定试玩。
- 处理结论：已入任务池
- 对应任务编号：T103

### IDEA-20260602-06：胡了卜开山数量和一屏操作反馈

- 提出人：Lee
- 提出时间：2026-06-02
- 背景：Lee 试玩和准备发布前继续反馈，当前 `胡` 后震落牌过多会降低难度，玩家可以一直胡；同时默认玩家页上方展示占用过多空间，导致操作按钮、卡槽和道具不能稳定落在一屏内。
- 目标：合并到 T101/T102 验收补丁。默认玩家 Demo 中直接 `杠` 只震落 1 张压顶牌；`胡` 震落 3 张压顶牌；默认玩家页隐藏内部标题栏、压缩低频信息，保留可读牌面，并把记牌器改为每个牌面格上下两层：上方牌面、下方余牌数量。优先保证 `吃 / 碰 / 杠 / 补杠 / 胡`、卡槽和底部道具在桌面与 390px 移动视口首屏内可见。T102 静态发布副本同步最新 Demo。
- 不做：不修改 Cocos 正式工程；不重做最终美术；不接部署、排行榜、账号、广告或埋点；不改变牌河容量、补杠语义或完整胡牌算法。
- 用户价值：降低 `胡` 的连续滚雪球强度，保留 `杠` 的开山爽点但不让难度过低；把玩家高频操作集中在一屏内，减少滚动找按钮和卡槽的体验损耗。
- 涉及模块：胡了卜 / 默认玩家 Demo / Web 游戏静态发布副本 / 一屏局内布局。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `apps/web/public/games/hulebu-demo/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T101-hulebu-river-kong-hu-demo.md`, `docs/tasks/claims/T101-lee.md`, `docs/tasks/items/T102-hulebu-web-game-publish.md`, `docs/tasks/claims/T102-lee.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/completion/**`
- 是否影响另一方任务：否。本补丁仍限定在 Lee 负责的胡了卜试玩原型和 T102 Web 游戏接入范围，不碰 Jaspon 负责的 AI 修图、AI 搜索、埋点或部署范围。
- 是否需要新增任务：否
- 建议优先级：P1
- 验收标准：直接 `杠` 只震落 1 张可选牌；`胡` 震落 3 张可选牌；桌面 `/games/hulebu` iframe 中动作栏、卡槽、道具栏均在首屏内；390px 移动端无横向溢出，动作栏、卡槽和底部道具栏均可见且互不遮盖；牌面和记牌器余牌数量可读；共享测试、Web 测试、脚本语法检查、构建和浏览器复测通过。
- AI 初步方案：先用共享 VM 测试和静态测试锁定 `KONG_SHAKE_LOOSE_COUNT = 1`、`HU_SHAKE_LOOSE_COUNT = 3` 和压缩布局 CSS；实现后同步 `apps/web/public/games/hulebu-demo/` 静态副本，并通过 Kimi WebBridge 桌面和 Playwright 390px 截图复测。
- 处理结论：合并到已有任务
- 对应任务编号：T101 / T102

### IDEA-20260602-05：胡了卜 Demo 站内网页小游戏发布接入

- 提出人：Lee
- 提出时间：2026-06-02
- 背景：T101 默认玩家 Demo 已可发布和试玩。Lee 希望先把当前 HTML demo 作为网页小游戏放进游戏站，让朋友通过站内链接体验，而不是等 Cocos 正式工程或小游戏平台发布链路完成。
- 目标：新增 T102，将当前 `config-playable` HTML demo 以静态资源形式接入 Next.js 游戏站，在 `/games/hulebu` 提供可直接试玩的站内网页小游戏入口，并在 `/games` 卡片和搜索入口中指向该页面。
- 不做：不重写当前 HTML demo 为 React 组件；不修改 Cocos 正式工程；不接排行榜、账号、支付、广告、埋点或线上 Nginx 配置；不扩大到 PDF 工具箱、AI 修图或部署基础设施。
- 用户价值：可以快速生成一个稳定 URL 给朋友试玩，保留当前 demo 行为和移动端适配，同时通过游戏站承接入口和后续转化。
- 涉及模块：胡了卜 / Web 游戏接入 / Next.js 游戏站 / 静态试玩发布。
- 可能影响文件：`apps/web/src/app/games/hulebu/page.tsx`, `apps/web/src/modules/games/hulebu/**`, `apps/web/public/games/hulebu-demo/**`, `apps/web/src/components/portal-data.ts`, `apps/web/src/components/AppHeader.tsx`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T102-hulebu-web-game-publish.md`, `docs/tasks/claims/T102-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/completion/**`
- 是否影响另一方任务：可能影响游戏站共享入口文件 `apps/web/src/components/portal-data.ts` 和 `apps/web/src/components/AppHeader.tsx`；本次由 Lee 领取并限定只改胡了卜游戏入口，不碰 Jaspon 的 AI 修图/AI 搜索/埋点范围。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：`/games/hulebu` 可打开并优先展示可玩的胡了卜 iframe；静态 demo 文件可通过站内资源路径访问；`/games` 的麻将卡片和搜索入口指向 `/games/hulebu`；桌面和 390px 移动端无横向溢出，iframe 可见；`apps/web` 测试、lint、typecheck、build、docs sync 和 diff 检查通过。
- AI 初步方案：把当前 HTML demo 复制为 `apps/web/public/games/hulebu-demo/index.html`，同时复制调牌器 `tuner.html` 以保证 demo 内部链接可用；新增 `apps/web/src/app/games/hulebu/page.tsx` 作为路由入口，挂载 `apps/web/src/modules/games/hulebu/` 的游戏页组件，用 iframe 加载静态 demo；更新 `portal-data.ts` 的麻将卡片和搜索链接；必要时让 `AppHeader` 在 `/games/hulebu` 隐藏，避免压缩游戏视口。
- 处理结论：已入任务池
- 对应任务编号：T102

### IDEA-20260602-04：胡了卜记牌器口径和动作栏布局验收反馈

- 提出人：Lee
- 提出时间：2026-06-02
- 背景：Lee 试玩第 5 关后确认当前节奏基本可接受，但记牌器不应继续统计已经进入卡槽、牌河、明牌区或移除区的牌；同时 `吃 / 碰 / 杠 / 补杠 / 胡` 按钮和卡槽挤在一起，影响读槽。
- 目标：在 T101 内补丁修正默认玩家 Demo：记牌器只统计牌山中的 `board` 牌，震落到桌面的牌仍计入，点进卡槽后立刻扣除；组合按钮拆成独立动作栏，不再和 8 格卡槽共用一行，移动端避免底部道具栏盖住卡槽。
- 不做：不修改 Cocos 正式工程，不新增正式 UI 美术，不改变组合判定、牌河容量、补杠收益或第 5-10 关生成规则。
- 用户价值：记牌器表达“牌山里还能拿到什么”，避免玩家误判卡槽里的牌还算可取资源；动作按钮和卡槽分离后，玩家能更清楚地读 8 格槽位状态。
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 默认玩家 Demo / 记牌器 / 卡槽动作区。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T101-hulebu-river-kong-hu-demo.md`, `docs/tasks/claims/T101-lee.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/completion/2026-06-02-task-T101-hulebu-river-kong-hu-demo.md`
- 是否影响另一方任务：否。本补丁仍限定在 Lee 负责的胡了卜 HTML 原型、共享测试和模块文档。
- 是否需要新增任务：否
- 建议优先级：P1
- 验收标准：记牌器只按 `location === "board"` 计数；入槽后对应花色/点数立即扣除；听/差高亮只高亮牌山仍有的目标牌；组合按钮位于独立动作栏，卡槽行只保留卡槽网格；390px 移动端无横向溢出，按钮文字不挤出，固定底部道具栏不遮盖卡槽；相关测试和浏览器验证通过。
- AI 初步方案：合并到 T101 验收补丁处理。先改 VM 行为测试验证卡槽牌不计入记牌器，再修改 `getRemainingTileCounts()` 只统计 `board`；用静态测试锁定 `action-strip` 和移动端底部留白，再移动 DOM 和 CSS。
- 处理结论：合并到已有任务
- 对应任务编号：T101

### IDEA-20260602-03：胡了卜有限牌河、补杠和胡牌奖励试玩 Demo

- 提出人：Lee
- 提出时间：2026-06-02
- 背景：T100 已确认有限牌河、明碰区、补杠、明杠开山、胡牌奖励和孤张预算是当前更可行的核心规则。Lee 确认这套方向后，需要先在现有 HTML 试玩 Demo 中做出能让朋友体验的第一版，而不是直接进入 Cocos 或完整 UI 美术。
- 目标：新增 T101，在 `config-playable` 默认玩家 Demo 中实现有限牌河、任选卡槽打牌、明牌区、补杠、直接明杠开山、胡牌清河和满槽失败判定调整，让 demo 能验证新核心循环。
- 不做：不修改 Cocos 正式工程；不修改正式关卡 JSON 或共享 Graph-based 生成器；不实现完整麻将算法、番型结算、真实摸打流程、复杂 Roguelike 奖励池、最终 UI 美术、广告、账号、排行榜或部署；不扩大到 PDF 工具箱、AI 修图、AI 搜索、埋点或 Web 站点范围。
- 用户价值：让玩家不再因为一次吃碰决策就立刻进入无出口死局；通过牌河、补杠、明杠和胡牌奖励提供 2-3 条恢复路线，同时保留槽位压力和麻将组合判断。
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 有限牌河 / 补杠 / 胡牌奖励。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T101-hulebu-river-kong-hu-demo.md`, `docs/tasks/claims/T101-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-06-02-hulebu-river-kong-hu-demo.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改 Lee 负责的胡了卜 HTML 原型、共享测试和模块文档，不碰 Jaspon 负责的 AI 修图、AI 搜索、埋点或部署范围。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：默认玩家 Demo 可见牌河和明牌区；打牌/丢弃改为任选卡槽牌进入有限牌河；碰后进入明牌区并支持第 4 张补杠；直接明杠触发开山，补杠不触发强开山；胡牌清空手牌并清理牌河 1 张；槽满但牌河未满时提示可打牌，槽满、无组合、牌河满且无救场时失败；共享测试、HTML 脚本语法检查、浏览器验证、文档同步和 diff 检查通过。
- AI 初步方案：按 TDD 先补 VM 和静态测试，锁定 `river/openMelds/startDiscardSelection/discardSlotTile/bugang` 等行为。实现时只改当前单文件 HTML 原型，在现有 `model.state` 上增加牌河和明牌区状态，重用现有组合按钮渲染；`碰` 写入明牌区，`补杠` 升级明碰且低收益，直接 `杠` 和 `胡` 调用最小开山函数移除/解锁顶层遮挡牌，`胡` 额外清理牌河 1 张。
- 处理结论：已入任务池
- 对应任务编号：T101

### IDEA-20260602-02：胡了卜有限牌河、补杠和胡牌奖励核心玩法设计

- 提出人：Lee
- 提出时间：2026-06-02
- 背景：朋友试玩反馈第 5 关后仍偏难。后续讨论发现核心矛盾不是单纯牌量或牌型数量，而是麻将组合和消除目标之间存在结构冲突：`碰` 会留下第 4 张，`吃` 会把 3 张库存拆成多个对子，严格按几副麻将生成时容易出现大量孤张。如果通关要求所有牌都通过吃碰杠胡消除，玩家一次路线选择错误就会变成近似死局。
- 目标：新增 T100，整理一套新的核心玩法规格。方向为 `有限牌河 + 明碰区 + 补杠孤张出口 + 明杠开山 + 胡牌强奖励 + 听牌提示 + 孤张预算生成器`。目标不是保证每一步都能赢，而是保证玩家有 2-3 条可恢复路线，同时保留麻将组合判断和微信小游戏需要的即时爽点。
- 不做：不直接修改 HTML 试玩页、Cocos 工程、共享规则模型或关卡配置；不实现完整麻将算法、番型结算、真实摸打流程、最终 UI 美术、广告、账号或排行榜。
- 用户价值：让玩家觉得失败来自可理解的风险取舍，而不是生成器制造死局；让 `胡 / 杠 / 补杠 / 牌河` 都有明确用途，提升朋友试玩和后续微信小游戏版本的可玩性。
- 涉及模块：胡了卜 / 朋友试玩 Demo / 核心规则重整 / 微信小游戏方向。
- 可能影响文件：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T100-hulebu-river-kong-hu-core-design.md`, `docs/tasks/claims/T100-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-06-02-hulebu-river-kong-hu-core-design.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/DECISIONS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只做胡了卜模块玩法文档，不修改 Jaspon 负责的 AI 修图、AI 搜索、埋点或部署范围。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：形成正式玩法规格，覆盖单关胜负条件、有限牌河、明碰区、补杠、明杠开山、胡牌奖励、听牌提示、牌河回收、牌数规则、孤张预算和 10 关试玩验证路线；模块决策、进展和交接文档同步；`npm run docs:sync`、占位符扫描和 `git diff --check` 通过。
- AI 初步方案：把 `补杠` 定位为低收益孤张出口，不抢 `明杠` 爽点；`明杠` 才触发震山开牌；`胡` 是清槽、强开山和处理牌河的最大局内奖励；`牌河` 是有限容量容错，不是无限丢弃；生成器按副数上限和组合配方控制牌数，并增加孤张预算检查。
- 处理结论：已入任务池
- 对应任务编号：T100

### IDEA-20260602-01：胡了卜试玩页卡槽满槽显示修复和记牌器

- 提出人：Lee
- 提出时间：2026-06-02
- 背景：Lee 试玩默认玩家页时反馈，点击第 8 张牌时卡槽没有显示，点击第 9 张牌又出现刚刚点的第 8 张；同时玩家缺少记牌器，不知道剩余牌的花色和数量，无法做有效决策。初步排查显示，朋友 Demo 仍沿用旧的备用槽自动救场逻辑，但玩家页隐藏了备用槽区域，导致满槽时牌被静默挪入隐藏备用槽。
- 目标：新增 T099，修复默认朋友 Demo 中满槽牌被静默挪到隐藏备用槽的问题；玩家试玩页显示可见记牌器，按万、条、筒、字统计剩余未移除牌及各点数数量，并随入槽、组合、丢弃、洗牌等状态变化刷新。
- 不做：不修改 Cocos 正式工程；不修改正式关卡 JSON；不实现“丢弃时任选卡槽某张牌”；不重做完整 HUD；不扩大到 Web 站、PDF、AI 修图、AI 搜索或部署范围。
- 用户价值：避免试玩时出现“点了牌但卡槽没显示”的明显错觉；让玩家能根据剩余牌型做吃、碰、杠、胡的取舍，而不是盲点。
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 10 关朋友 Demo / 玩家页 HUD。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T099-hulebu-slot-visible-counter.md`, `docs/tasks/claims/T099-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改 Lee 负责的胡了卜 HTML 原型、共享测试和模块文档，不碰 Jaspon 负责的 AI 修图、AI 搜索、埋点或部署范围。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：默认玩家 Demo 满 8 格时不会把新点入的牌静默移入隐藏备用槽；卡槽满且无组合时保留可见 8 张并提示使用组合或丢弃；玩家页可见记牌器，显示四类牌总数和点数数量；记牌器在牌入槽、组合移除、丢弃移除后刷新；共享测试、HTML 脚本语法检查、浏览器验证、文档同步和 diff 检查通过。
- AI 初步方案：按 TDD 先补 VM 回归测试，构造朋友 Demo 7 张槽 + 第 8 张入槽场景，断言第 8 张留在可见主槽且备用槽为空；再补静态/UI 测试锁定玩家页记牌器区块和 `renderCounts()` 刷新。实现时让朋友 Demo 的 `reserveLimit` 为 0，并在 `checkDanger()` 中跳过隐藏备用槽自动转移；把余牌统计区移到玩家页可见区域并压缩样式。
- 处理结论：已入任务池
- 对应任务编号：T099

### IDEA-20260601-07：胡了卜朋友 Demo 第 5-10 关渐进难度曲线

- 提出人：Lee
- 提出时间：2026-06-01
- 背景：朋友试玩反馈第 5 关开始太难，有点玩不下去。当前默认 Demo 前 4 关是小牌量教学，第 5 关直接进入 240 张密集牌山高压模式，难度存在明显断崖。
- 目标：新增 T098，采用方案 B。默认玩家 Demo 保持前 4 关教学不变，第 5-10 关加入渐进难度 profile：第 5 关降为正式入门小牌山，第 6-8 关逐步增加牌量、堆叠和干扰，第 9-10 关再接近当前高压密集牌山。让朋友试玩能先理解正式模式，再逐步进入地狱模式。
- 不做：不修改 Cocos 正式工程；不修改正式关卡 JSON；不实现动态失败降难；不实现丢弃选牌、记牌器或残局收官；不扩大到 Web 站、PDF、AI 修图或部署范围。
- 用户价值：降低朋友试玩的第 5 关劝退率，让玩家在 10 关小 run 内感受到“学会规则 -> 进入正式牌山 -> 难度逐步爬升”的节奏。
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 10 关朋友 Demo / 难度曲线。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T098-hulebu-friend-demo-gradual-difficulty.md`, `docs/tasks/claims/T098-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改 Lee 负责的胡了卜 HTML 原型、共享测试和模块文档，不碰 Jaspon 负责的 AI 修图、AI 搜索、埋点或部署范围。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：默认玩家 Demo 第 5-10 关有明确渐进 profile；第 5 关牌量约 72 张，不再直接 240 张；第 6-10 关牌量逐步提高到 240 张；每关首轮可点保持 3-8 张，且同组首轮不直接露出 3 张完整答案；第 5 关标题或提示明确“正式入门”；共享测试、HTML 脚本语法检查、浏览器验证、文档同步和 diff 检查通过。
- AI 初步方案：按 TDD 先扩展 VM 测试，读取默认玩家 Demo 第 5-10 关生成摘要，断言 profile 牌量为 72/96/132/168/210/240、stackDepth 从 3 到 6、huPacks/honorWeight 逐步增加、首轮可点 3-8 且同组最多 2。实现时增加 `FRIEND_DEMO_DIFFICULTY_PROFILES` 和 `getEffectiveMountainTuningForLevel`，仅默认玩家页使用该 profile；调牌器仍按用户调参值生成。
- 处理结论：已入任务池
- 对应任务编号：T098

### IDEA-20260601-06：胡了卜教学关必须发动对应组合才通关

- 提出人：Lee
- 提出时间：2026-06-01
- 背景：Lee 试玩 10 关朋友 Demo 时发现，前 4 关教学关把牌全部点进卡槽后就会通关，玩家不需要点击 `碰 / 吃 / 杠 / 胡` 按钮，失去教学意义。
- 目标：新增 T097，修正配置驱动试玩原型的前 4 关教学胜利条件。第 1 关必须成功点击 `碰`，第 2 关必须成功点击 `吃`，第 3 关必须成功点击 `杠`，第 4 关必须成功点击 `胡` 才算过关；单纯把牌放进卡槽不能触发胜利。
- 不做：不修改 Cocos 正式工程；不修改正式关卡 JSON；不实现丢弃选牌、记牌器或残局收官；不修改第 5 关后的密集牌山生成规则；不扩大到 Web 站、PDF、AI 修图或部署范围。
- 用户价值：保证前 4 关真正教会玩家手动发动麻将组合，避免朋友试玩时误以为游戏只是点击入槽自动过关。
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 10 关朋友 Demo / 教学关胜利条件。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T097-hulebu-tutorial-action-clear.md`, `docs/tasks/claims/T097-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改 Lee 负责的胡了卜 HTML 原型、共享测试和模块文档，不碰 Jaspon 负责的 AI 修图、AI 搜索、埋点或部署范围。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：前 4 关教学关全部点入卡槽但未点击对应组合按钮时不会通关；点击本关对应 `碰 / 吃 / 杠 / 胡` 后立即通关；教学关候选按钮只暴露本关目标动作，避免第 4 关误点 `吃/碰` 破坏胡牌教学；共享测试、HTML 脚本语法检查、浏览器验证、文档同步和 diff 检查通过。
- AI 初步方案：按 TDD 先补 VM 回归测试，模拟第 1 关把所有教学牌点入卡槽后仍处于 playing，再点击 `碰` 后进入 won；同时锁定前 4 关候选类型分别只出现本关目标动作。实现时为朋友 Demo 教学关增加 `required tutorial combo` 判定，普通关仍沿用牌山清空通关。
- 处理结论：已入任务池
- 对应任务编号：T097

### IDEA-20260601-05：胡了卜玩家页布局、牌面放大和模板随机调参

- 提出人：Lee
- 提出时间：2026-06-01
- 背景：Lee 在 T095 混合窗口牌山后继续试玩默认玩家页，反馈当前页面整体布局仍有问题，牌面还需要更大一些，并且牌山模板需要随机，不能让玩家明显感觉每关模板固定。
- 目标：新增 T096，继续调 `config-playable` 默认玩家页。玩家页布局改为更明确的竖屏游戏面板，牌面规则尺寸放大一档，同时保持顶部 HUD、牌桌、底部卡槽/组合区和右侧/底部道具不互相挤压；默认玩家页普通密集关的 `auto` 模板改为按 seed/重开随机选择，调牌器仍允许指定模板。
- 不做：不修改 Cocos 正式工程；不修改共享 Graph-based 生成器；不修改正式关卡 JSON；不实现 T094 残局收官、记牌器或丢弃选择；不扩大到 Web 站、PDF、AI 修图或部署范围。
- 用户价值：让朋友试玩 Demo 更接近手机小游戏的一屏体验，减少布局杂乱和牌面看不清导致的误点；模板随机能提高每次重开和后续关卡的新鲜感，避免玩家记模板。
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 玩家页 HUD / 密集牌山模板。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T096-hulebu-play-layout-larger-random-template.md`, `docs/tasks/claims/T096-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改 Lee 负责的胡了卜 HTML 原型、共享测试和模块文档，不碰 Jaspon 负责的 AI 修图、AI 搜索、埋点或部署范围。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：默认玩家页布局在桌面和 390px 移动视口下不横向溢出，顶部 HUD、牌桌、卡槽/组合区和道具栏可见且不互相覆盖；密集牌山规则牌尺寸大于 T095 的 `45x60`；普通密集关默认 `auto` 模板在同一关不同 seed/重开下能出现不同模板，调牌器指定 `template=ring` 等仍生效；首轮可点仍保持 3-8 张目标；共享测试、HTML 脚本语法检查、浏览器验证、文档同步和 diff 检查通过。
- AI 初步方案：按 TDD 先补静态和 VM 回归测试，锁定更大的 `MOUNTAIN_RULE_TILE_SIZE`、更窄的玩家页 game shell、移动端无横向溢出预算、`resolveMountainTemplateId` 对玩家页 `auto` 使用 seed 随机而非固定轮换。实现时把默认玩家页收敛到手机比例容器，牌桌显示尺寸跟随新牌面放大但限制高度，调牌器继续保留模板手动指定。
- 处理结论：已入任务池
- 对应任务编号：T096

### IDEA-20260601-04：胡了卜混合窗口牌山生成器

- 提出人：Lee
- 提出时间：2026-06-01
- 背景：Lee 试玩默认 10 关 Demo 后反馈，当前密集牌山虽然有堆叠遮挡，但生成器把最上层可点击牌按 3 张一组直接分配成同一个 `碰 / 吃 / 杠` 答案。玩家只要顺序点击顶层三张再点击组合按钮，下一层又继续给出下一组答案，缺少记忆、等待和取舍，玩法变成执行题。
- 目标：新增 T095，把 `config-playable` 密集牌山从“顺序答案生成器”改为“混合窗口生成器”。可解路径仍存在，但每个组合包的成员要分散到不同堆、不同释放时机；首轮和后续可点击窗口要混入干扰牌、半成型牌、杠诱饵和吃碰冲突，避免顶层三张天然就是一组答案。
- 不做：不修改 Cocos 正式工程；不修改共享 Graph-based 生成器；不修改关卡 JSON；不实现 T094 残局收官、牌引或牌河；不改最终美术；不扩大到 Web 站、PDF 或 AI 修图模块。
- 用户价值：让玩家需要观察记牌器、记住下层信息、判断现在消除还是等待，而不是机械顺序点击；提升麻将味和 Roguelike 选择压力。
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 密集牌山生成器。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T095-hulebu-mixed-window-mountain-generator.md`, `docs/tasks/claims/T095-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改 Lee 负责的胡了卜 HTML 原型、共享测试和文档，不碰 Jaspon 负责的 AI 修图、AI 搜索、埋点或部署范围。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：默认玩家页第 5 关后的密集牌山不再让每个可点击窗口天然形成同一 `solutionGroup` 的 3 张答案；首轮可点击数量仍控制在 3-8 张；至少部分组合成员跨不同释放批次和堆分散；测试能证明首轮窗口没有直接三张同组答案，并存在吃碰/碰杠或半成型干扰；脚本语法检查、共享测试、浏览器验证、文档同步和 diff 检查通过。
- AI 初步方案：按 TDD 先补静态和 VM 回归测试，断言存在 `buildMixedWindowSolutionGroups` 之类的混合窗口逻辑，并在运行态检查第 5 关默认密集牌山首轮不会出现任一 `solutionGroup` 超过 2 张可点牌。实现上保留可解路径，但在分组后对组内成员做释放分散和窗口干扰；必要时给每个窗口加入显式 lure/interference 元数据，保证玩家需要做判断。
- 处理结论：已入任务池
- 对应任务编号：T095

### IDEA-20260601-03：胡了卜残局收官与试玩反馈设计

- 提出人：Lee
- 提出时间：2026-06-01
- 背景：T093 朋友试玩 Demo 暴露出四类核心体验问题：前几关只是把牌点进卡槽就结束，教学没有要求玩家真正发动 `碰 / 吃 / 杠 / 胡`；牌面偏小导致看不清和误点；`丢弃` 自动丢末尾牌，缺少玩家选择；玩家页缺少可见记牌器，玩家不知道剩余牌型，无法判断孤张和等待价值。随后 Lee 继续提出如果通关要求卡槽清空，孤张会变成设计难题；双方讨论后确认采用 `残局收官` 方向，把孤张从失败垃圾转成关末决策。
- 目标：新增 T094，完成胡了卜 `残局收官` 设计规格。正式方向采用 `牌桌清空但槽内有残张时进入残局收官`，提供 `弃牌通关 / 选作牌引 / 收入牌河` 三类收官方向；同时明确教学关必须发动对应组合才过关、正式关允许残张进入收官、丢弃改为选择任意槽位牌、玩家页补回可见记牌器、牌面可读性需要提升。
- 不做：T094 只做设计，不直接改 HTML 原型、Cocos 工程、共享规则代码、关卡 JSON 或正式 UI 美术；不实现牌河兑换系统、不做完整生成器可解性证明、不扩展完整麻将算法。
- 用户价值：让试玩 Demo 从“点完牌就过关”升级为“必须理解组合和残局选择”的体验；让孤张成为胡了卜的特色决策，而不是玩家觉得被生成器坑死的无解残牌。
- 涉及模块：胡了卜 / 朋友试玩 Demo / 残牌处理 / 记牌器 / 教学流程。
- 可能影响文件：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T094-hulebu-endgame-settlement-design.md`, `docs/tasks/claims/T094-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-06-01-hulebu-endgame-settlement-design.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/DECISIONS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 是否影响另一方任务：否。T094 只设计 Lee 负责的胡了卜模块，不修改 Jaspon 负责的 AI 修图、AI 搜索、埋点或部署范围。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：形成清晰的残局收官设计规格；规格明确触发条件、三种收官选择、Demo 第一阶段落地范围、长期扩展、教学关胜利条件、失败判定、丢弃选择、记牌器、牌面可读性、状态流、数据字段、测试策略和后续实现任务边界；任务分片、领取分片、模块文档和每日进展同步完成；`npm run docs:sync`、占位符扫描和 `git diff --check` 通过。
- AI 初步方案：把 T094 定位为设计任务，不动代码。规格中推荐 Demo 先实现 `弃牌通关` 与 `选作牌引`，`收入牌河` 先作为可见但后续开放的长期方向；正式工程后续再把牌河做成跨关资源和奖励兑换系统。
- 处理结论：已入任务池
- 对应任务编号：T094

### IDEA-20260601-02：胡了卜 10 关朋友试玩 Demo

- 提出人：Lee
- 提出时间：2026-06-01
- 背景：Lee 决定先做一个朋友可以直接试玩的可玩 Demo，验证玩法是否成立，再进入 Cocos 做 UI、美术、动画和正式发布工程。当前 HTML 原型已经具备密集牌山、8% 轻遮挡阈值、HUD、失败弹层和调牌器分离，适合先冻结成朋友试玩版。
- 目标：新增 T093，在 `config-playable` 默认玩家页中形成 10 关小 run。前 3 关分别教学 `碰 / 吃 / 杠`，每关 6 个卡槽；第三关通关后第一次奖励固定为卡槽 +2，达到 8 个卡槽上限；第 4 关教学 `胡`，需要 8 个卡槽；第 5 关开始进入高压密集牌山。右侧工具改为 `洗牌 / 撤回 / 丢弃`，其中丢弃用于移除卡槽中的一张牌救场。
- 不做：不修改 Cocos 正式工程；不做最终美术、动画音效、排行榜、账号、支付或完整 20 关平衡；不修改 PDF 或 AI 修图模块。
- 用户价值：用 5-10 分钟的真实小 run 让朋友体验核心玩法，尽早判断规则是否能懂、策略是否成立、失败是否服气、是否有继续玩的欲望。
- 涉及模块：胡了卜 / HTML 试玩原型 / 朋友试玩 Demo。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/**`, `docs/superpowers/plans/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/**`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改 Lee 负责的胡了卜 HTML 原型、共享测试和文档，不碰 Jaspon 负责的 AI 修图模块。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：默认玩家页可连续体验 10 关；第 1-3 关分别教学碰/吃/杠且 6 槽；第 3 关后固定奖励卡槽 +2 并让第 4 关达到 8 槽；第 4 关教学胡；第 5 关开始为高压密集牌山；右侧只显示洗牌、撤回、丢弃，丢弃能移除槽内一张牌；自动化测试、脚本语法检查、浏览器桌面/移动检查、文档同步和 diff 检查通过。
- AI 初步方案：新增 `T093`，先用静态测试和 VM 测试锁定 10 关 Demo 编排、教学卡槽、固定奖励和道具文案，再在 HTML 原型中加入朋友试玩 run 层，最后用 Kimi WebBridge 或 Codex App 内置浏览器做桌面/移动首屏和前 4 关流程检查。
- 处理结论：已入任务池
- 对应任务编号：T093

### IDEA-20260601-01：胡了卜玩家页正式一屏 HUD 重排

- 提出人：Lee
- 提出时间：2026-06-01
- 背景：T091 已压缩默认玩家页牌桌高度，但右侧信息面板在移动端仍位于下方滚动，且玩家页仍像“牌桌 + 信息侧栏”原型。Lee 继续要求推进正式游戏一屏结构：上方关卡、目标和剩余统计，右侧可用按钮或道具，下方卡槽，牌桌不能继续独占高度。
- 目标：新增 T092，将 `config-playable` 默认玩家页重排为更接近正式局内的一屏 HUD：顶部状态条承载关卡/目标/余牌/积分/铜钱，右侧改成紧凑道具栏，底部卡槽继续首屏可见；调牌器仍保留完整侧栏和调参信息。
- 不做：不修改 Cocos 正式工程；不修改共享 Graph-based 生成器；不修改 Web 站入口；不改关卡/奖励 JSON；不做最终美术资源替换。`config-playable` HTML 原型内的玩家页 HUD 和密集牌山验收调参允许在本任务内处理。
- 用户价值：让默认玩家页更接近正式手机小游戏的局内信息架构，提前验证顶部 HUD、右侧道具和底部卡槽同时存在时，密集牌山仍可读、可点、不卡空间。
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 玩家页正式 HUD。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T092-hulebu-one-screen-play-hud.md`, `docs/tasks/claims/T092-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改 Lee 负责的胡了卜 HTML 原型、共享测试和模块文档，不修改 `apps/web/**`、PDF 工具箱、AI 修图、部署文件、Cocos 工程或共享 Graph-based 生成器。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：默认玩家页出现正式局内顶部 HUD，显示关卡、目标、余牌、积分和铜钱；默认玩家页右侧为紧凑道具栏，不再展示完整信息侧栏；移动端保持左右一屏结构而不是把道具面板推到下方；牌桌和 8 格卡槽首屏可见，无横向溢出；调牌器视图继续保留调参、余牌、奖励和控制信息；自动化测试、脚本语法检查、浏览器桌面/移动检查、文档同步和 diff 检查通过。
- AI 初步方案：按 TDD 先补静态回归测试，锁定 `play-hud` 顶部状态条、`tools-section` 右侧道具栏、玩家页隐藏完整侧栏信息和移动端双列结构；再修改 HTML/CSS/渲染函数，新增 HUD 文案渲染并把玩家页侧栏压缩为 64-76px 道具栏；最后用 Kimi WebBridge 或内置浏览器检查桌面和移动首屏。
- 处理结论：已入任务池
- 对应任务编号：T092
- 验收补充：Lee 后续明确密集牌山起手 3-8 张即可，不要过多；低于 8% 的轻微遮挡仍应可点，达到 8% 才阻塞；牌可以稍大，且大多数牌应继续集中在主牌山堆里。该补充并入 T092 的 `config-playable` 原型验收调参，不新开任务。

### IDEA-20260531-02：胡了卜玩家页正式 HUD 空间压缩

- 提出人：Lee
- 提出时间：2026-05-31
- 背景：Lee 在默认玩家页继续评估密集牌山后反馈，整个牌桌高度仍然太高。正式游戏同一屏还需要展示顶部关卡和目标、顶部剩余卡牌统计、底部卡槽、右侧可用按钮或道具等 HUD 内容，当前牌桌高度会挤占正式界面空间。
- 目标：新增 T091，压缩 `config-playable` 玩家页牌桌高度和周边 UI 间距，建立正式 HUD 空间预算；保持牌面可读、数百张牌量、随机堆叠、桥接堆和首轮约 8-12 张可点规则不被破坏。
- 不做：不修改 Cocos 正式工程；不修改共享 Graph-based 生成器；不修改 Web 站入口；不改关卡/奖励 JSON；不新增正式 HUD 功能；不改失败提示逻辑；不扩大或缩小总牌数范围。
- 用户价值：让当前原型更接近正式竖屏小游戏一屏结构，提前验证牌山在顶部信息、右侧道具和底部卡槽同时存在时是否仍可读、可玩。
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 玩家页布局。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T091-hulebu-compact-board-hud-budget.md`, `docs/tasks/claims/T091-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-31.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改 Lee 负责的胡了卜 HTML 原型、共享测试和模块文档，不修改 `apps/web/**`、PDF 工具箱、AI 修图、部署文件、Cocos 工程或共享 Graph-based 生成器。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：默认玩家页密集牌山坐标高度和 CSS 显示高度明显低于 T089/T090；顶部信息、右侧面板和底部卡槽仍在同一屏结构中有空间；桌面端牌桌不再接近整屏高度，移动端不出现横向溢出；首轮可点仍保持约 8-12 张；自动化测试、脚本语法检查、浏览器桌面/移动检查、文档同步和 diff 检查通过。
- AI 初步方案：按 TDD 先补静态和 VM 回归测试，锁定 `560x640` 压缩坐标系、玩家页牌桌视口高度预算和更紧凑的主栏/侧栏/卡槽样式；再调整 HTML 原型 CSS 和坐标常量，压缩纵向空间但不改牌量、牌面覆盖、桥接堆和遮挡规则。
- 处理结论：已入任务池
- 对应任务编号：T091

### IDEA-20260531-01：胡了卜失败提示弹层

- 提出人：Lee
- 提出时间：2026-05-31
- 背景：Lee 在默认玩家页试玩时补充反馈，失败也需要提示。当前 `config-playable` 原型已有 `failed` 状态和底部状态文案，但满槽无组合后缺少足够显眼的失败弹层，玩家不一定能立刻知道本关已经结束。
- 目标：新增 T090，让 `config-playable` 玩家页和调牌器在本关失败时弹出明确提示，说明失败原因，并提供重开本关入口；失败后牌面和组合按钮保持禁用。
- 不做：不修改 Cocos 正式工程；不修改共享 Graph-based 生成器；不修改 Web 站入口；不改关卡/奖励 JSON；不做完整复活/救场系统；不改 T089 的牌山密度和遮挡生成规则。
- 用户价值：让满槽失败、Boss 目标失败等负反馈明确可见，避免玩家误以为页面卡住或点击无响应。
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 失败反馈。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T090-hulebu-failure-feedback-overlay.md`, `docs/tasks/claims/T090-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-31.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改 Lee 负责的胡了卜 HTML 原型、共享测试和模块文档，不修改 `apps/web/**`、PDF 工具箱、AI 修图、部署文件、Cocos 工程或共享 Graph-based 生成器。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：槽位满且没有可发动组合/救场资源时进入失败状态并显示“本关失败”弹层；弹层说明失败原因并提供“重开本关”按钮；Boss 目标未完成导致失败时也使用同一失败提示；失败后牌面、组合按钮和道具按钮不可继续操作；自动化测试、脚本语法检查、浏览器检查、文档同步和 diff 检查通过。
- AI 初步方案：按 TDD 先补 VM/静态测试，模拟主槽满且无组合时触发 `checkDanger`，断言 `phase=failed`、失败弹层展示和重开按钮存在；再把现有 `failed` 状态接入统一 `showLevelFailed(reason)` 弹层，复用当前 overlay 样式但使用失败标题、原因文本和重开本关按钮。
- 处理结论：已入任务池
- 对应任务编号：T090

### IDEA-20260530-03：胡了卜原型随机组合堆遮挡

- 提出人：Lee
- 提出时间：2026-05-30
- 背景：Lee 在试玩 T088 的散乱可见压叠层后继续反馈，当前已经有感觉，但堆叠不应固定为“顶牌加 4 张下层预览”的一种形态；实际牌山需要随机出现几个堆结合在一起的结构，可能顶上只看到一张，拿掉后下面出现一个或多个选择，也可能是当前错位露出，还可能是 5%-100% 的不同遮挡比例。
- 目标：新增 T089，让 `config-playable` 密集牌山支持随机组合堆/桥接堆和随机遮挡比例；同一关内混合出现完全覆盖、轻微遮挡、半遮挡和当前错位预览。移走部分顶层组合牌后，下方可能解锁 1 个或多个可点击入口。
- 不做：不修改 Cocos 正式工程；不修改共享 Graph-based 生成器；不修改 Web 站入口；不改关卡/奖励 JSON；不做最终美术资源替换；不复制外部游戏源码；不把首轮可点击数量重新放大。
- 用户价值：让牌山更接近真实“羊了个羊”式读图压力：玩家能看到不同程度的下层信息，但可点击入口仍受控；移走一张顶牌后有时会产生多个新选择，提升局面变化和决策感。
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 密集牌山调牌器。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T089-hulebu-random-merged-stack-overlap.md`, `docs/tasks/claims/T089-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-31.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改 Lee 负责的胡了卜 HTML 原型、共享测试和模块文档，不修改 `apps/web/**`、PDF 工具箱、AI 修图、部署文件、Cocos 工程或共享 Graph-based 生成器。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：默认玩家页和调牌器的密集牌山同一关内出现多种堆叠遮挡比例；至少存在组合堆/桥接堆，移走顶层后可解锁多个下层入口；仍保留下层牌可见但 blocked/disabled；首轮可点击数量保持约 8-12 张；自动化测试、脚本语法检查、浏览器检查、文档同步和 diff 检查通过。
- AI 初步方案：按 TDD 先补静态和 VM 回归测试；在 HTML 原型生成阶段为部分栈顶加入 `stackBridge` 顶牌和显式 bridge blocker；为 stack column 加入 `stackOverlapRatio` 与 `stackPreviewSpread`，让可见预览从 5%-100% 遮挡间随机分布；渲染层按遮挡参数决定预览偏移和提示文案，交互仍统一走 blocked/cover 判定。
- 处理结论：已入任务池
- 对应任务编号：T089

### IDEA-20260530-02：胡了卜原型散乱可见压叠层

- 提出人：Lee
- 提出时间：2026-05-30
- 背景：Lee 在试玩 T087 竖屏密集牌山时反馈，当前堆叠更像若干个单独柱状堆，只显示顶牌和深度角标；还需要恢复一部分“散乱堆叠在一起”的读牌效果，让玩家能看到下面被压住的牌面，但不能点击。
- 目标：新增 T088，让 `config-playable` 密集牌山在保留首轮约 8-12 张可点击顶牌的同时，每个堆叠露出若干张被压住的牌；这些露出的下层牌必须可见、被遮挡、不可点击，并带有轻微错位的散乱压叠视觉。
- 不做：不修改 Cocos 正式工程；不修改共享 Graph-based 生成器；不修改 Web 站入口；不改关卡/奖励 JSON；不做最终美术资源替换；不复制外部游戏源码；不把首轮可点击数量重新放大。
- 用户价值：让玩家能提前观察下层牌面，形成羊了个羊式“看得到但拿不到”的决策压力，同时避免首轮入口过多导致难度下降。
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 密集牌山调牌器。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T088-hulebu-visible-scattered-stack-preview.md`, `docs/tasks/claims/T088-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-30.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改 Lee 负责的胡了卜 HTML 原型、共享测试和模块文档，不修改 `apps/web/**`、PDF 工具箱、AI 修图、部署文件、Cocos 工程或共享 Graph-based 生成器。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：默认玩家页和调牌器的密集牌山不只显示单柱顶牌；每个堆叠至少露出若干张下层牌；露出的下层牌显示真实牌面但保持 blocked/disabled，不可点击；首轮可点击牌仍约 8-12 张；自动化测试、脚本语法检查、浏览器检查、文档同步和 diff 检查通过。
- AI 初步方案：按 TDD 先补 VM/静态测试；在 HTML 原型中新增栈预览深度常量、预览可见性函数和 `stack-preview` 样式；渲染时显示顶牌加上紧邻下方几张下层牌，并按深度加偏移和层级，交互仍沿用遮挡图判定。
- 处理结论：已入任务池
- 对应任务编号：T088

### IDEA-20260530-01：胡了卜原型模板随机、全牌种覆盖和竖屏牌桌

- 提出人：Lee
- 提出时间：2026-05-30
- 背景：Lee 在试玩 T086 默认 240 张小牌牌山时反馈，每一关看起来仍是同一种横向样式；此前已经有 8 个核心模板，但当前 HTML 玩家试玩页没有复用模板变化；默认牌面也只保证四类花色覆盖，没有保证所有具体牌面都出现。
- 目标：新增 T087，让 `config-playable` 玩家页和调牌器的密集牌山按关卡/种子稳定随机切换多个模板；默认牌桌改为竖屏优先；默认 240 张牌覆盖 `万1-9 / 条1-9 / 筒1-9 / 东南西北中发白` 全部 34 个牌面，同时保持首轮约 8-12 张可点击。
- 不做：不修改 Cocos 正式工程；不修改共享 Graph-based 生成器；不修改 Web 站入口；不改关卡/奖励 JSON；不做最终美术资源替换；不复制外部游戏源码。
- 用户价值：让当前右侧浏览器中的玩家试玩页更接近真实竖屏小游戏评估场景，并避免数百张牌仍只集中在少数牌面。
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 密集牌山调牌器。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T087-hulebu-varied-portrait-mountain.md`, `docs/tasks/claims/T087-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-05-30-hulebu-varied-portrait-mountain.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-30.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改 Lee 负责的胡了卜 HTML 原型、共享测试和模块文档，不修改 `apps/web/**`、PDF 工具箱、AI 修图、部署文件、Cocos 工程或共享 Graph-based 生成器。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：默认玩家页密集牌山为竖屏优先牌桌；至少 8 个模板可被自动轮换或在调牌器指定；默认 240 张牌包含 34 个完整牌面；首轮可点击牌保持约 8-12 张；调牌器可选择模板；自动化测试、脚本语法检查、浏览器检查、文档同步和 diff 检查通过。
- AI 初步方案：按 TDD 先补静态和 VM 回归测试；在 HTML 原型中加入轻量模板注册表和 `template=auto|...` 调参；把位置生成从固定牌流改为模板生成；把牌面保底从四类花色升级为 34 个具体牌面每张至少 3 次；CSS 改为纵向牌桌并为堆叠顶牌显示深度角标。
- 处理结论：已入任务池
- 对应任务编号：T087

### IDEA-20260529-01：胡了卜玩家试玩页和调牌器分离

- 提出人：Lee
- 提出时间：2026-05-29
- 背景：对胡了卜配置试玩原型进行体验评估时发现，默认游玩页面把调参/调牌控件和真实玩家牌桌放在同一窗口，移动端首屏优先看到配置面板而不是牌山，容易混淆“玩家体验”和“开发调关工具”。
- 目标：新增 T085，将默认玩家试玩页改为干净的游玩窗口；调牌器/调参面板通过独立入口打开，保留开发调关能力但不挤占玩家首屏。
- 不做：不修改 Cocos 正式工程、不重做奖励效果、不改 Boss 目标逻辑、不改共享牌山生成器、不接 Web 站内 iframe、不做最终 UI 美术。
- 用户价值：让试玩页更接近真实玩家视角，同时保留独立调牌器给后续调关和验证使用。
- 涉及模块：胡了卜 / 配置驱动试玩原型 / 调牌器。
- 可能影响文件：`AGENTS.md`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/game/mahjong-roguelike/prototypes/config-playable/tuner.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T085-hulebu-play-page-tuner-split.md`, `docs/tasks/claims/T085-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-30.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改 Lee 负责的胡了卜原型、共享测试和模块文档，不修改 `apps/web/**`、PDF 工具箱、AI 修图、部署文件或 T084 的 Cocos 接入文件。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：默认 `index.html` 首屏为玩家游玩页，不展示调牌/调参面板；调牌器通过独立入口新窗口打开，并可进入调参视图；移动端玩家页优先显示牌桌和主流程控件；回归测试、脚本语法检查、浏览器桌面/移动检查、文档同步和 diff 检查通过。
- AI 初步方案：先用测试锁定默认玩家视图和独立调牌器入口，再在 HTML 原型中加入 `view=play/tuner` 视图分支；默认隐藏调参面板，调牌器链接使用独立 `tuner.html` 入口并新窗口打开；最后用浏览器检查玩家页与调牌器页。
- 处理结论：已入任务池
- 对应任务编号：T085

### IDEA-20260528-05：胡了卜模板注册表和 8 个核心模板共享实现

- 提出人：Lee
- 提出时间：2026-05-28
- 背景：T080 已完成 Graph-based 牌山生成器第一版，T081 已确认地图模板语法系统，T082 已完成模板注册表和参数系统实施计划。当前共享生成器仍只支持 `center-tower` 和 `two-wings` 两个模板分支，继续扩模板前需要先把模板 definition、注册表和参数归一化落到代码。
- 目标：新增 T083，在 `packages/shared` 中实现模板注册表、参数默认值、参数边界、参数归一化、通用校验器、ExperienceReport 模板字段，并落地第一期 8 个核心模板：中心塔、双翼、十字、环形、长墙、岛屿、峡谷、阶梯。
- 不做：不修改 Cocos 工程、不替换当前 Cocos 默认关卡、不做 Web 接入、不做调参面板、不生成新美术、不做奖励效果、Boss 目标 UI、动画音效或发布包。
- 用户价值：让胡了卜的牌山生成器从“少量分支模板”升级为可长期扩展、可校验、可解释的地图模板系统，确保后续难度来自“该先拿哪张”的读图选择，而不是不可控随机或天然死局。
- 涉及模块：胡了卜 / 牌山生成器 / 地图模板 / 共享规则地基。
- 可能影响文件：`packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `packages/shared/src/index.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T083-hulebu-template-registry-core-templates.md`, `docs/tasks/claims/T083-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改 Lee 本地负责的胡了卜共享生成器和模块文档，不修改 `apps/web/**`、PDF 工具箱、平台部署、Cocos 表现层或资源文件。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：共享生成器提供模板注册表查询、参数归一化、边界裁剪和未知模板错误；8 个核心模板都能 seed 稳定生成、理论可解并输出 `levelTiles`；ExperienceReport 包含模板标签、参数快照、窗口曲线、释放事件和通用校验结果；共享测试、类型检查、文档同步、占位符扫描和 diff 检查通过。
- AI 初步方案：按 TDD 先补生成器测试；把模板定义为带参数、体验标签和坐标/权重/角色回调的 registered definition；把旧配置归一化为内部配置后进入原有 `SolutionTrace`、`FaceAssignment`、5% 遮挡图和 `levelTiles` 链路；现有两模板行为保留，新增六个模板只扩 shape callbacks，不动 Cocos。
- 处理结论：已入任务池
- 对应任务编号：T083

### IDEA-20260528-04：胡了卜模板注册表和参数系统实施计划

- 提出人：Lee
- 提出时间：2026-05-28
- 背景：T081 已完成地图模板语法系统设计，用户确认可以继续推进。T080 当前共享生成器已有 `center-tower` 和 `two-wings` 两个模板，但仍是分支式模板生成；如果直接开始写代码，容易把 T083 的 8 个核心模板和 T084 的 Cocos 接入混在一起。
- 目标：新增 T082，只写实施计划，不修改生成器代码。计划需明确如何把 T080 重构为模板注册表和参数系统，如何保留当前两模板行为，如何定义模板 schema、参数默认值、参数边界、体验标签、校验器和 ExperienceReport 扩展策略，并为 T083 8 个核心模板实现预留接口。
- 不做：不修改 `packages/shared/**`、不修改 Cocos 工程、不替换当前 Cocos 默认关卡、不做 Web 接入、不做调参面板、不生成新美术、不做奖励效果、Boss 目标 UI、动画音效或发布包。
- 用户价值：先把实现路径写清楚，确保后续共享生成器重构是可验证、可回退、可继续扩展的，而不是在当前生成器里继续堆临时模板分支。
- 涉及模块：胡了卜 / 牌山生成器 / 地图模板 / 共享规则地基。
- 可能影响文件：`AGENTS.md`, `docs/tasks/LOCAL_OWNER.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T082-hulebu-template-registry-plan.md`, `docs/tasks/claims/T082-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-05-28-hulebu-template-registry-parameter-system.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/modules/mahjong-roguelike/DECISIONS.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改 Lee 本地负责的胡了卜实施计划、任务分片和模块文档，不修改 `apps/web/**`、PDF 工具箱、平台部署、Cocos 表现层或共享代码。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：完成 T082 任务分片和领取分片；写出模板注册表和参数系统实施计划；计划覆盖注册表类型、参数归一化、现有两模板迁移、ExperienceReport 扩展、测试策略、文档更新和 T083 交接；文档同步、占位符扫描和 diff 检查通过。
- AI 初步方案：用 writing-plans 流程产出 `docs/superpowers/plans/2026-05-28-hulebu-template-registry-parameter-system.md`，把后续实现拆成注册表元数据、配置归一化、现有模板迁移、体验报告扩展、导出与文档、验证六段；明确 T082 不改代码，T083 再实现 8 个核心模板。
- 处理结论：已入任务池
- 对应任务编号：T082

### IDEA-20260528-03：胡了卜地图模板语法系统

- 提出人：Lee
- 提出时间：2026-05-28
- 背景：T080 已把 Graph-based 牌山生成器第一版落到共享层，但当前只实现 `center-tower` 和 `two-wings` 两个模板。用户明确表示胡了卜是朝完整游戏推进，地图模板地基不能只做 MVP，需要把中心塔、双翼、十字、环形、长墙、岛屿等模板扩展成可长期产关的模板语法系统。
- 目标：新增 T081，先不改代码，完成胡了卜地图模板语法系统设计稿。设计需明确第一期 8 个核心模板家族、第二批 backlog、模板参数层、体验标签、校验指标、与 T080 生成器的接口边界，以及后续 T082/T083/T084 的实施拆分。
- 不做：不修改 `packages/shared` 生成器代码、不修改 Cocos 工程、不接入关卡配置、不做调参面板、不生成新美术、不做动画音效或发布包。
- 用户价值：让胡了卜从“能生成一座牌山”升级为“能长期生产不同风格、不同节奏、可验证关卡”的完整游戏地基，避免后续模板散落成不可维护的 if 分支。
- 涉及模块：胡了卜 / 地图模板 / 牌山生成器 / 关卡生产系统。
- 可能影响文件：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T081-hulebu-map-template-grammar-design.md`, `docs/tasks/claims/T081-codex.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-05-28-hulebu-map-template-grammar-design.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/modules/mahjong-roguelike/DECISIONS.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改开发 B 范围内的胡了卜设计文档和任务分片，不修改 `apps/web/**`、PDF 工具箱、平台部署、Cocos 表现层或共享代码。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：完成地图模板语法系统设计稿；明确采用“8 个核心模板 + 第二批 backlog 预留”路线；定义模板家族、参数、体验标签、校验器和后续实施拆分；文档同步、占位符扫描和 diff 检查通过。
- AI 初步方案：把模板系统拆成 `Archetype`、`Footprint`、`LayerProfile`、`OcclusionGrammar`、`ExperienceTags` 和 `Validators`；第一期实现中心塔、双翼、十字、环形、长墙、岛屿、峡谷、阶梯 8 个核心模板，第二批 backlog 保留花瓣、堡垒、棋盘、迷雾外圈；后续另拆实现任务重构生成器模板注册表并补测试。
- 处理结论：已入任务池
- 对应任务编号：T081

### IDEA-20260528-02：胡了卜 Graph-based 牌山生成器共享实现

- 提出人：Lee
- 提出时间：2026-05-28
- 背景：T079 已完成底层方案评估，确认胡了卜不应继续把“纯随机堆叠柱”作为主生成器。用户进一步确认可以开始下一步，但要求先不改 Cocos，先把底层地基搭建好，并希望难度来自“我该先拿哪张”，同时保留 B 路线的随机堆叠压力。
- 目标：新增 T080，在 `packages/shared` 实现引擎无关的 Graph-based 牌山生成器第一版，输出牌山骨架、遮挡图、理论解法、牌面分配、难度评分和体验报告，并生成可被后续 Cocos 接入消费的 `levelTiles` 数据。
- 不做：不修改 Cocos 工程、不替换当前 Cocos 关卡、不做 Web 接入、不做调参面板、不生成新美术、不做奖励效果、Boss UI、动画音效或发布包。
- 用户价值：让胡了卜先拥有可测试、可解释、可迭代的生成地基；后续再接 Cocos 时，不再靠临场调随机数判断好不好玩。
- 涉及模块：胡了卜 / 牌山生成器 / 共享规则地基。
- 可能影响文件：`packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `packages/shared/src/index.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T080-hulebu-graph-generator-shared-implementation.md`, `docs/tasks/claims/T080-codex.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改开发 B 范围内的胡了卜共享逻辑和模块文档，不修改 `apps/web/**`、PDF 工具箱、平台部署或 Cocos 表现层。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：共享模块能生成确定性的多层牌山骨架和 5% 遮挡图；生成结果包含至少一条理论可解路径；牌面分配支持 `碰 / 吃 / 杠 / 胡` 组合包；体验报告包含节奏阶段、槽位压力、干扰牌和难度评分；测试、类型检查、文档同步和 diff 检查通过。
- AI 初步方案：按 TDD 先补 `mahjong-mountain-generator` 测试，再实现 `buildBlockerGraph`、模板骨架、解法 trace、face assignment 和 `ExperienceReport`；第一版先提供 `center-tower` 与 `two-wings` 两个模板，并让随机扰动受 seed 控制。
- 处理结论：已入任务池
- 对应任务编号：T080

### IDEA-20260528-01：胡了卜 Graph-based 牌山生成器地基

- 提出人：Lee
- 提出时间：2026-05-28
- 背景：用户在分析《羊了个羊》源码和胡了卜当前实现后指出，当前底层牌山生成方式不太行。T077-T078 虽然恢复了随机堆叠、铺开、跨列遮挡和 5% 遮挡不可点，但生成主脑仍是随机柱子和顶层顺序发牌，缺少解法路径和难度评估。
- 目标：新增 T079，先不改 Cocos 表现层，重新设计胡了卜底层牌山生成器地基，采用“牌山骨架图 + 理论解法路径 + 牌面发牌 + 难度评估器”的 Graph-based Generator，为后续共享逻辑实现做准备。
- 不做：不修改 Cocos 工程代码、不替换当前 Cocos 关卡配置、不生成新美术、不做奖励效果、Boss 目标 UI、动画音效、发布包、Web 站点接入或完整实现代码。
- 用户价值：让胡了卜的难度来自“我该先拿哪张”的设计取舍，而不是随机生成导致的太简单或纯死局；同时保留偏羊了个羊的牌山模板和 Roguelike 随机扰动。
- 涉及模块：胡了卜 / 牌山生成器 / 共享规则地基。
- 可能影响文件：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T079-hulebu-graph-generator-foundation.md`, `docs/tasks/claims/T079-codex.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-05-28-hulebu-mountain-generator-foundation-design.md`, `docs/superpowers/plans/2026-05-28-hulebu-mountain-generator-foundation.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 是否影响另一方任务：否。本任务只新增和同步文档，不修改 `apps/web/**`、PDF 工具箱、平台部署或 Cocos 表现层代码。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：完成生成器地基设计稿和实施计划；明确旧随机柱方案的问题、Graph-based Generator 的核心类型、与 Cocos 的边界、后续实现文件范围和验证命令；文档同步、占位符扫描和 diff 检查通过。
- AI 初步方案：先把生成器拆为 `MountainSkeleton`、`SolutionTrace`、`FaceAssignment`、`DifficultyReport` 和 `GeneratorConfig` 五个单元；实现层后续落到 `packages/shared`，由 Vitest 验证骨架、遮挡、理论路径、牌面发牌和难度评分；Cocos 后续只消费兼容 `HulebuLevelTileConfig` 的输出。
- 处理结论：已入任务池
- 对应任务编号：T079

### IDEA-20260527-07：胡了卜 Cocos 牌山铺开和遮挡点击一致性

- 提出人：Lee
- 提出时间：2026-05-27
- 背景：T077 已把 Cocos 默认关卡从 6 张流程关恢复为随机堆叠牌山，但用户继续反馈牌山整体仍挤在中间，未充分利用手机画面；同时测试发现部分被上层牌盖住的牌仍能点击，不符合“超过 5% 遮挡不可点击”的核心规则。
- 目标：新增 T078，扩大 Cocos 随机牌山生成范围，让牌山更铺开；修正遮挡生成规则，保证任意更高层牌只要覆盖低层牌面积超过 5%，低层牌就写入 `blockedBy` 并不可点击。
- 不做：不做完整可解路径搜索、不做最终关卡数值平衡、不做新的美术资源、不做 Boss 目标 UI、奖励效果、动画音效、发布包或 Web 站点接入。
- 用户价值：让 Cocos 首屏更接近“整张牌桌铺开”的目标图，同时恢复“被盖住的牌不能点”的核心操作直觉。
- 涉及模块：胡了卜 / Cocos Creator 正式工程 / 随机牌山布局与遮挡判定。
- 可能影响文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T078-hulebu-cocos-spread-locking.md`, `docs/tasks/claims/T078-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改开发 B 范围内的胡了卜 Cocos 工程、共享结构测试和模块文档，不修改 `apps/web/**`、PDF 工具箱或平台部署文件。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：首关随机牌山配置横向和纵向跨度明显扩大；测试校验任意高层牌覆盖低层牌超过 5% 时低层牌都包含该 blocker；Cocos runtime 的可点态与 `blockedBy` 一致；Cocos 工程测试、Cocos 类型检查、文档同步、diff 检查和 Cocos Web Preview 手机视口目检通过。
- AI 初步方案：在 `mahjong-cocos-project.test.ts` 新增失败断言，校验首关坐标跨度和 5% 遮挡 blocker 完整性；调整 `createStackColumns` 的网格间距、行列布局和 jitter，让 42-60 张牌覆盖更大的桌面区域；将 `applyStackBlockers` 改为所有更高层重叠超过阈值即阻挡，避免相邻高层盖住低层但仍可点；必要时在 runtime 中增加可点态防御检查。
- 处理结论：已入任务池
- 对应任务编号：T078

### IDEA-20260527-06：胡了卜 Cocos 随机堆叠牌山恢复

- 提出人：Lee
- 提出时间：2026-05-27
- 背景：T076 为了快速验证 Cocos 的“通关提示 -> 下一关 -> 奖励节点”流转，在 Cocos 关卡配置中临时使用了 6 张牌的轻量流程关。用户反馈当前 Cocos 预览只剩 6 张牌，缺少此前 HTML 原型中的随机轮廓、多列堆叠和难度压力。
- 目标：新增 T077，把 Cocos 默认关卡恢复为随机轮廓、多列堆叠、同列完全覆盖的牌山；首关和后续关卡不再使用 6 张轻量关卡作为默认内容，同时保留 T076 的通关提示、下一关和奖励节点流转。
- 不做：不做完整 20 关数值平衡、不做完整可解路径搜索、不做 Boss 目标 UI 完整落地、不做最终 Tile prefab、动画音效、发布包或 Web 站点接入。
- 用户价值：让 Cocos 正式工程重新拥有接近“羊了个羊”的牌山密度和遮挡压力，避免正式玩法因为流程验证脚手架变得过于简单。
- 涉及模块：胡了卜 / Cocos Creator 正式工程 / 随机牌山生成与遮挡。
- 可能影响文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T077-hulebu-cocos-random-stacked-mountain.md`, `docs/tasks/claims/T077-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改开发 B 范围内的胡了卜 Cocos 工程、共享结构测试和模块文档，不修改 `apps/web/**`、PDF 工具箱或平台部署文件。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：Cocos 默认首关不再是 6 张牌，而是 30 张以上随机堆叠牌山；生成器包含确定性随机种子、牌量、最大堆叠深度、字牌权重和 5% 遮挡规则；同列下层牌完全被上层牌遮挡并只通过顶层横条提示层数；通关提示、下一关和奖励节点流转仍可用；Cocos 工程测试、Cocos 类型检查、文档同步、diff 检查和 Cocos Web Preview 手机视口目检通过。
- AI 初步方案：在 `HulebuLevelConfig.ts` 中加入确定性随机密集牌山生成器，按关卡元数据生成 36-60 张左右的三张组合包，并把同列牌用 `blockedBy` 链式遮挡；在 `BoardLayerBinder` 中根据 `stackDepth` 绘制堆叠横条提示；用 `mahjong-cocos-project.test.ts` 保护随机牌山接入和非 6 张回归；最后用 Cocos Web Preview 检查手机视口首屏。
- 处理结论：已入任务池
- 对应任务编号：T077

### IDEA-20260527-05：胡了卜 Cocos 通关提示和下一关流转

- 提出人：Lee
- 提出时间：2026-05-27
- 背景：Cocos 真实首关已经能点击、入槽、组合消除和显示牌面，但清空牌山后只显示“牌山已清空”，没有明确弹出过关提示，也不能进入下一关。用户希望后续补齐“先提示通关，再进入下一关；奖励节点进入下一关时再 3 选 1 奖励”的流程。
- 目标：新增 T076，在 Cocos runtime 中加入清空牌山后的通关状态、通关提示 overlay、下一关按钮和最小关卡流转；奖励节点和 Boss 节点先按已定节奏预留状态，不在本任务做完整奖励池数值。
- 不做：不做完整 20 关内容平衡、不做最终奖励卡美术、不做 Boss 多目标 UI 完整版、不做动画音效、不做发布包和 Web 站点接入。
- 用户价值：让 Cocos 工程从“单关可点”推进到“有一关结束反馈和下一关节奏”，开始形成真正局内闭环。
- 涉及模块：胡了卜 / Cocos Creator 正式工程 / 通关与关卡流。
- 可能影响文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T076-hulebu-cocos-clear-level-flow.md`, `docs/tasks/claims/T076-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改开发 B 范围内的胡了卜 Cocos 工程、共享结构测试和模块文档，不修改 `apps/web/**`、PDF 工具箱或部署文件。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：清空牌山后出现明确通关提示；点击下一关后可进入下一关占位或配置关；奖励节点能先进入奖励选择状态再继续下一关；普通关、奖励关和 Boss 关的状态入口有测试保护；Cocos 工程测试、Cocos 类型检查、文档同步、diff 检查和 Cocos Web Preview 手机视口手动检查通过。
- AI 初步方案：先让 `HulebuRuntimeState` 输出 `isBoardCleared` / `levelComplete`；`GameSceneController` 在刷新时打开 `RewardOverlay` 或通关 overlay；新增 `goToNextLevel` 最小入口，优先嵌入前 2-3 个关卡配置做流转验证；奖励节点先显示 3 张占位奖励，后续再接正式奖励池。
- 处理结论：已入任务池
- 对应任务编号：T076

### IDEA-20260527-04：胡了卜新牌面 UI 重新应用

- 提出人：Lee
- 提出时间：2026-05-27
- 背景：用户重新生成了一批胡了卜麻将牌面 UI，希望替换当前 Cocos 牌山中显示的无边框派生牌面。当前 Cocos 已能加载真实第 1 关、点击入槽、遮挡解锁和基础组合消除，但美术仍需要继续按最新牌面资源迭代。
- 目标：新增 T075，定位最新生成的牌面 UI 资源，确认 `万 / 筒 / 条 / 东南西北中发白` 的牌键映射完整后，重新应用到 Cocos `mahjong-tiles` 资源清单和 `HulebuTileSpriteCatalog`；保留缺图 fallback 和现有点击链路。
- 不做：不改通关弹窗、下一关流转、奖励三选一、Boss 目标进度、槽位图片、动画、音效、图集打包、Web 站点接入或发布包。通关提示和下一关流转另拆后续任务。
- 用户价值：让正式 Cocos 工程尽快吃到用户新确认的牌面 UI，先把牌山视觉向最终目标图靠近，再进入胜负流程和关卡流细节。
- 涉及模块：胡了卜 / Cocos Creator 正式工程 / 牌面 UI 资源。
- 可能影响文件：`output/imagegen/**`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/mahjong-tiles/**`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuTileSpriteCatalog.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `apps/game/mahjong-roguelike/cocos/scene-binding.md`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T075-hulebu-refresh-tile-ui-assets.md`, `docs/tasks/claims/T075-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改开发 B 范围内的胡了卜 Cocos 资源、资源映射测试和模块文档，不修改 `apps/web/**`、PDF 工具箱或部署文件。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：能定位并记录最新牌面资源来源；Cocos 资源目录中 27 张数牌和 7 张字牌都使用最新牌面版本或明确 fallback；`manifest.json` 记录刷新版本和来源；`HulebuTileSpriteCatalog` 映射完整；牌面符号保留类似目标图的四周留白；资源检查、Cocos 工程测试、Cocos 类型检查、文档同步、diff 检查和 Cocos Web Preview 手机视口目检通过。
- AI 初步方案：先扫描 `output/imagegen/` 和 Cocos 资源库中的最新 PNG，优先使用完整单牌目录或清单；若资源完整，则复制/转换到 `tiles/refreshed/` 并更新 manifest/catalog；若只提供部分牌，则保留现有无边框图作为缺失牌 fallback，并在 manifest 中标注。根据用户反馈，运行时 `refreshed` 图不应把符号撑满牌体，而应从透明来源图按 alpha 边界归一到约 62% 画布高度，保留目标图式留白。
- 处理结论：已入任务池
- 对应任务编号：T075

### IDEA-20260527-03：胡了卜无边框麻将牌面资源

- 提出人：Lee
- 提出时间：2026-05-27
- 背景：T073 已把 T068 归档的青瓷麻将图片接入 Cocos 牌山，但现有图片带完整牌体、边框和留白；放进 Cocos 当前牌节点后会出现边框叠边、牌面偏小和观感粗糙的问题。用户明确要求“完全没有边框”的麻将图片。
- 目标：新增 T074，从现有 27 张数牌和 7 张字牌派生透明背景、只保留牌面符号的无边框 PNG，并让 Cocos 牌面 SpriteFrame 映射优先使用这套资源。
- 不做：不重新生成 AI 图片，不删除或覆盖原带框资源，不做最终图集打包，不替换槽位图片，不做动画、音效、奖励、Boss、关卡流、Web 站点接入或发布包。
- 用户价值：让牌面符号直接贴在 Cocos 自绘牌体上，避免双重边框和留白造成的廉价感，同时保留原图作为回退。
- 涉及模块：胡了卜 / Cocos Creator 正式工程 / 牌面 UI 资源。
- 可能影响文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/mahjong-tiles/**`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuTileSpriteCatalog.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `apps/game/mahjong-roguelike/cocos/scene-binding.md`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T074-hulebu-borderless-mahjong-assets.md`, `docs/tasks/claims/T074-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改开发 B 范围内的胡了卜 Cocos 资源和模块文档，不修改 `apps/web/**`、PDF 工具箱或部署文件。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：Cocos 资源目录中存在 27 张数牌和 7 张字牌的透明无边框 PNG；图片没有牌体边框、外缘 alpha 清空且内容非空；`manifest.json` 记录无边框资源来源；`HulebuTileSpriteCatalog` 优先映射到无边框 SpriteFrame；资源检查、Cocos 工程测试、Cocos 类型检查、文档同步和 diff 检查通过。
- AI 初步方案：用 `sharp` 从现有带框 PNG 中按中心区域和颜色阈值提取红/绿/蓝/黑牌面符号，输出同尺寸透明 PNG 到 `tiles/borderless/`；更新资源清单和 README；将 `tileKey -> SpriteFrame` 路径切到无边框目录，原带框目录保留给人工复核和 fallback。
- 处理结论：已入任务池
- 对应任务编号：T074

### IDEA-20260527-02：胡了卜 Cocos 牌面 SpriteFrame 绑定第一版

- 提出人：Lee
- 提出时间：2026-05-27
- 背景：Cocos Web Preview 已能默认加载真实第 1 关并完成点击入槽、遮挡解锁和 `碰` 消除链路，但牌山仍是程序化占位牌；用户已将麻将 UI 图片放入 Cocos 资源目录，T068 也生成了 `manifest.json`。
- 目标：新增 T073，让 `BoardLayerBinder` 优先按 `prefabKey` / `tileKey` 加载 `assets/resources/ui/mahjong-tiles/` 中的 SpriteFrame，首关可看到真实牌面图片；图片缺失或加载失败时继续显示当前文字占位牌。
- 不做：不做完整 Tile prefab 池，不做图集打包，不做槽位图片替换，不做动画、音效、奖励三选一、Boss 目标、关卡流、Web 站点接入或发布包。
- 用户价值：让正式 Cocos 工程的第一屏从“能玩但像调试 UI”推进到“开始接近最终美术”，同时不牺牲当前可点击验证链路。
- 涉及模块：胡了卜 / Cocos Creator 正式工程 / 牌面资源绑定。
- 可能影响文件：`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/**`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/mahjong-tiles/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T073-hulebu-cocos-tile-sprite-binding.md`, `docs/tasks/claims/T073-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`, `docs/superpowers/plans/2026-05-27-hulebu-cocos-tile-sprite-binding.md`
- 是否影响另一方任务：否。本任务只修改胡了卜 Cocos 工程、共享结构测试和模块文档，不修改 `apps/web/**`、PDF 工具箱或平台部署文件。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：Cocos `BoardLayerBinder` 能按 `prefabKey` 加载已归档麻将 SpriteFrame；首关的 `9筒` 和 `2万` 使用图片牌面或在加载失败时保留文字 fallback；点击、入槽、`碰` 消除和下层解锁链路不回退；共享结构测试、Cocos 类型检查、麻将回归、文档同步和 diff 检查通过。
- AI 初步方案：新增 Cocos `HulebuTileSpriteCatalog`，从 T068 资源清单固化 `tileKey -> resources.load SpriteFrame path`；`BoardLayerBinder` 增加 `TileArt` 子节点并异步加载图片，使用 WeakMap 避免旧异步结果覆盖复用节点；加载成功隐藏 label，失败保留当前程序化占位牌。
- 处理结论：已入任务池
- 对应任务编号：T073

### IDEA-20260527-01：胡了卜 Cocos 真实配置首关接入

- 提出人：Lee
- 提出时间：2026-05-27
- 背景：Cocos 测试首屏已经能点击、入槽、消除和重新解锁下层牌，但仍默认加载本地手写测试牌山，没有真正验证 `levels.json` 第 1 关配置到 Cocos 表现层的承接链路。
- 目标：新增 T072，让 Cocos Web Preview 默认从真实第 1 关配置创建首屏，并继续支持点击可用牌进入 8 格主槽、刷新 HUD/按钮和执行基础组合消除。
- 不做：不做 20 关选择器，不做奖励三选一，不做 Boss 目标进度，不接最终 SpriteFrame prefab，不做动画、音效、发布包、Web 站点接入或完整可解路径搜索。
- 用户价值：把 Cocos 正式工程从“测试牌山可点”推进到“真实关卡配置可跑”，后续才能继续接关卡流、奖励、Boss 和最终美术。
- 涉及模块：胡了卜 / Cocos Creator 正式工程 / 真实配置承接。
- 可能影响文件：`apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T072-hulebu-cocos-real-config-level.md`, `docs/tasks/claims/T072-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改开发 B 范围内的胡了卜 Cocos 工程、共享结构测试和模块文档，不修改 `apps/web/**`、PDF 工具箱或平台共享逻辑。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：Cocos Web Preview 手机视口默认显示真实第 1 关的 3 张上层 `9筒` 和 3 张下层 `2万`；下层 `2万` 初始不可点；点击三张 `9筒` 后下层 `2万` 恢复可点；`碰` 能消除三张 `9筒` 并刷新卡槽、HUD 和按钮；共享测试、Cocos 脚本检查、模块回归、文档同步和 diff 检查通过。
- AI 初步方案：新增 Cocos 本地 level config、runtime state 和 configured scene bootstrap；`GameSceneController` 默认加载真实首关，点击和组合通过 runtime state 重新生成 scene model；保留原 sample scene 作为 fallback。
- 处理结论：已入任务池
- 对应任务编号：T072

### IDEA-20260526-06：胡了卜 Cocos 点击后遮挡解锁和槽位牌名显示

- 提出人：Lee
- 提出时间：2026-05-26
- 背景：T069 已跑通首条点击链路，但用户继续发现两个体验问题：点击上层牌后，下层牌仍保持灰色不可点，没有恢复可点击；被点击进入下方槽位后，槽位只显示亮格子，不显示具体是什么牌。
- 目标：新增 T070，在 Cocos 测试首屏中补齐点击后的遮挡解锁重算和槽位牌名显示。上层牌移走后，应按剩余牌的几何遮挡关系重新计算 `interactable/dimmed`；入槽牌应在 8 格主槽里显示牌名。
- 不做：不接真实 20 关配置，不导入最终 Sprite prefab，不做完整可解路径搜索，不做动画、音效、奖励、Boss 目标或下一关流转。
- 用户价值：让测试首屏的牌山反馈符合“移开上层 -> 看到并可点击下层”的直觉，也让玩家知道自己已经选进槽位的具体牌。
- 涉及模块：胡了卜 / Cocos Creator 正式工程 / 测试首屏交互反馈。
- 可能影响文件：`apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T070-hulebu-cocos-unlock-slot-labels.md`, `docs/tasks/claims/T070-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-26.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改开发 B 范围内的 Cocos 工程、共享结构测试和模块文档，不修改 `apps/web/**`、PDF 工具箱或平台共享逻辑。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：点击可用上层牌后，原本被遮挡且遮挡已解除的下层牌变亮并可点击；点击牌进入主槽后，对应槽位显示牌名；共享测试、Cocos 脚本检查、模块回归、文档同步和 diff 检查通过；Cocos Web Preview 手机视口手动检查通过。
- AI 初步方案：先用 `mahjong-cocos-project.test.ts` 保护 `GameSceneController` 的遮挡重算 helper 和 `SlotLayerBinder` 的自动 Label 补齐能力；再实现几何重叠阈值 `5%` 的剩余牌重算；最后补手动预览验证。
- 处理结论：已入任务池
- 对应任务编号：T070

### IDEA-20260526-05：胡了卜 Cocos 首条点击可玩链路

- 提出人：Lee
- 提出时间：2026-05-26
- 背景：Cocos Web Preview 已能显示胡了卜首屏视觉壳，但用户发现当前预览中“点什么都没反应”。原因是牌面和组合按钮还只是可视占位，没有形成点击入槽、按钮刷新和组合消除的第一条互动链路。
- 目标：新增 T069，在 Cocos 测试首屏中跑通 `点击可用牌 -> 进入 8 格主槽 -> 刷新 HUD/组合按钮 -> 点击胡/杠/碰/吃执行基础消除` 的最小闭环。
- 不做：不接真实关卡配置，不导入最终 Sprite prefab，不做动画、音效、奖励三选一、Boss 目标、失败救场、下一关流转、Web 站点接入或发布包。
- 用户价值：让 Cocos 正式工程从“能看见”推进到“能点动”，方便后续接真实配置、遮挡解锁和完整关卡流程。
- 涉及模块：胡了卜 / Cocos Creator 正式工程 / 首屏可玩链路。
- 可能影响文件：`apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T069-hulebu-cocos-playable-click-chain.md`, `docs/tasks/claims/T069-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-26.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只修改开发 B 范围内的 Cocos 工程、共享结构测试和模块文档，不修改 `apps/web/**`、PDF 工具箱或平台共享逻辑。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：Cocos Web Preview 手机视口中，可点击测试牌进入 8 格主槽；HUD 和组合按钮会刷新；满足 `胡 / 杠 / 碰 / 吃` 候选时可点击按钮执行基础消除；共享测试、Cocos 脚本检查、模块回归、文档同步和 diff 检查通过。
- AI 初步方案：先用测试保护点击链路关键脚本契约；再给 BoardLayer 和 ComboBar 增加触摸回调；由 `GameSceneController` 持有测试用主槽状态并刷新 scene model；最后用 Cocos Web Preview 手动确认点击入槽和组合消除。
- 处理结论：已入任务池
- 对应任务编号：T069

### IDEA-20260526-04：胡了卜麻将 UI 图片资源归档和切图

- 提出人：Lee
- 提出时间：2026-05-26
- 背景：`output/imagegen/` 中已经生成多张胡了卜青瓷风麻将牌面、字牌参考图、概念图和中间稿。当前图片都堆在生成输出目录里，不方便后续 Cocos UI 导入和 prefab 绑定；其中字牌是横向总图，需要切成可单独导入的单张资源。
- 目标：新增 T068，将现有图片按 `牌面 / 字牌 / 参考图 / 中间稿` 分类复制到胡了卜 Cocos 工程的 UI 资源目录；对字牌横向参考图做单张切割；补充资源清单和模块进展说明。
- 不做：不生成新图片，不接入运行时代码，不替换现有占位牌节点，不做最终 sprite atlas，不改玩法、规则、关卡、奖励或 Web 站点。
- 用户价值：让已经确认大多可用的图片先进入胡了卜工程资源树，后续做 Cocos prefab、图集、节点绑定时可以直接从分类目录取图。
- 涉及模块：胡了卜 / Cocos Creator 正式工程 / UI 图片资源。
- 可能影响文件：`output/imagegen/**`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/**`, `apps/game/mahjong-roguelike/cocos/scene-binding.md`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T068-hulebu-ui-image-assets.md`, `docs/tasks/claims/T068-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-26.md`
- 是否影响另一方任务：否。本任务只整理开发 B 范围内的生成图片和胡了卜 Cocos 资源目录，不修改 `apps/web/**`、PDF 工具箱或平台共享逻辑。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：Cocos 工程下存在 `assets/resources/ui/mahjong-tiles/` 分类目录；数牌单张、字牌切片、参考图和中间稿已分类复制；字牌参考图已切出 7 张单图；资源清单记录文件来源、类别、tileKey 和是否需要复核；`npm run docs:sync`、图片尺寸检查和 `git diff --check` 通过。
- AI 初步方案：保留 `output/imagegen/` 原始生成结果不动；在 Cocos `resources/ui/mahjong-tiles/` 下建立 `tiles/numbered`、`tiles/honors`、`references`、`drafts` 四类目录；用现有 `sharp` 依赖切割字牌总图；生成 `manifest.json` 和 `README.md` 作为导入索引。
- 处理结论：已入任务池
- 对应任务编号：T068

### IDEA-20260526-03：胡了卜 Cocos 首屏目标图视觉壳

- 提出人：Lee
- 提出时间：2026-05-26
- 背景：用户给出 `mahjong-roguelike-ui-concept-v1.png` 作为最终目标图，当前 Cocos 预览仍是黑底占位和基础控件，视觉方向与目标图差距较大。
- 目标：在 Cocos 首屏中先建立目标图方向的视觉壳第一版，包含绿色牌桌背景、顶部信息牌、右侧工具位、底部木质 8 格槽和组合按钮位置优化，为后续真实牌面、配置和点击链路提供稳定视觉承接。
- 不做：不接最终 AI 生成图片资源，不做完整牌面 prefab，不实现点击入槽、真实关卡配置、奖励三选一交互、动画音效和发布包。
- 用户价值：让 Cocos 正式工程先从“占位可跑”进入“方向像最终游戏”的状态，便于继续对照目标图迭代表现层。
- 涉及模块：麻将 Roguelike 消除、Cocos 正式表现层。
- 可能影响文件：`apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/progress/2026-05-26.md`, `docs/completion/**`
- 是否影响另一方任务：否，属于开发 B 游戏模块范围。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：Cocos Web Preview iPhone 机型下首屏出现绿色桌面背景、顶部信息牌、右侧三枚工具按钮、底部木质 8 格槽和更接近目标图的组合按钮；共享测试、Cocos 类型检查、模块回归、文档同步和 diff 检查通过。
- AI 初步方案：新增 T067，优先在现有 Cocos 脚本中运行时绘制可替换的占位视觉壳，不引入外部贴图资源；保留后续替换为正式图片/prefab 的接口边界。
- 处理结论：已入任务池
- 对应任务编号：T067

### IDEA-20260526-01：胡了卜 Cocos 手机竖屏首屏适配

- 提出人：Lee
- 提出时间：2026-05-26
- 背景：用户使用 Cocos Creator 预览器切到 Apple iPhone 机型后，首屏占位 UI 虽然能显示，但牌山过小、整体靠下，明显仍是桌面横屏/大画布坐标逻辑，不适合后续手机游玩。
- 目标：新增 T065，将 Cocos 首屏占位布局改为手机竖屏优先：项目设计分辨率使用 390x844，测试牌山放中上且牌面可读，8 格主槽固定底部居中，`胡 / 杠 / 碰 / 吃` 按钮固定在槽下方安全区，HUD 压缩到顶部。
- 不做：不接最终青瓷牌面资源，不实现真实点击入槽/组合结算，不做完整响应式布局系统，不接微信/抖音发布，不修改 Web 原型。
- 用户价值：后续正式游戏主要在手机上玩，先把 Cocos 表现层基准切到移动竖屏，避免继续在桌面横屏坐标里调玩法。
- 涉及模块：胡了卜 / Cocos Creator 正式工程 / 手机竖屏 UI。
- 可能影响文件：`apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T065-hulebu-cocos-mobile-first-screen.md`, `docs/tasks/claims/T065-codex.md`, `docs/progress/2026-05-26.md`, `docs/completion/2026-05-26-task-T065-hulebu-cocos-mobile-first-screen.md`
- 是否影响另一方任务：否。本任务只修改开发 B 范围内的 Cocos 工程、共享结构测试和模块文档，不修改当前 T015 覆盖的 `apps/web/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：Cocos 项目设计分辨率记录为 390x844；首屏样本模型和各 Binder 使用移动竖屏布局常量；项目结构测试、Cocos 脚本检查、共享麻将测试、类型检查、文档同步和 diff 检查通过；用户在 Creator 预览器切 iPhone 机型后能看到牌山、槽位、按钮和 HUD 都在手机画面内。
- AI 初步方案：先补红灯测试，锁定 `settings/v2/packages/project.json` 的移动设计分辨率和脚本中的移动布局常量；再把测试 scene model、牌节点尺寸、槽位尺寸、按钮位置和 HUD 布局改为 390x844 竖屏基准。
- 处理结论：已入任务池
- 对应任务编号：T065

### IDEA-20260526-02：胡了卜 Cocos 真实可见尺寸自适应

- 提出人：Lee
- 提出时间：2026-05-26
- 背景：用户在 Cocos Creator 预览器里切到 iPhone 机型后，实际可见画布只有 `375 x 741` 左右，和项目写死的 `390 x 844` 仍不一致，导致首屏牌山、槽位和 HUD 继续偏小、偏下。
- 目标：新增 T066，把 Cocos 首屏布局改成按运行时可见尺寸自适应，不再依赖固定手机常量。让测试牌山、8 格主槽、组合按钮和 HUD 都按当前预览器或真机可见尺寸自动重排。
- 不做：不改真实关卡配置，不接最终美术，不实现完整点击入槽和组合结算，不做动画、音效、发布包，不修改 Web 原型或 Next.js 站点。
- 用户价值：解决“手机预览里还是不够贴边”的问题，避免把布局锁死在单一设计分辨率上，后续真机和不同预览尺寸也更稳。
- 涉及模块：胡了卜 / Cocos Creator 正式工程 / 真实可见尺寸布局。
- 可能影响文件：`apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T066-hulebu-cocos-visible-size-layout.md`, `docs/tasks/claims/T066-codex.md`, `docs/progress/2026-05-26.md`, `docs/completion/2026-05-26-task-T066-hulebu-cocos-visible-size-layout.md`
- 是否影响另一方任务：否。本任务只修改开发 B 范围内的 Cocos 工程、共享结构测试和模块文档，不修改当前 T015 覆盖的 `apps/web/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：Cocos 工程能读取运行时可见尺寸并生成自适应首屏；`GameSceneController` 和四个 Binder 不再只依赖固定竖屏常量；项目结构测试、Cocos 脚本检查、共享麻将测试、类型检查、文档同步和 diff 检查通过；预览器切 iPhone 机型后首屏内容能保持在手机画面内并更居中。
- AI 初步方案：先写红灯测试，要求脚本中出现 `view.getVisibleSize` / 运行时尺寸读取；再把样本场景和各 Binder 改成按视口尺寸算位置，保留 390x844 作为默认参考但不作为唯一输入。
- 处理结论：已入任务池
- 对应任务编号：T066

### IDEA-20260525-08：新增打工人弹射解压小游戏

- 提出人：Lee
- 提出时间：2026-05-25
- 背景：用户已完成一款面向打工人的Roguelike物理弹射解压游戏的完整方案设计，包含随机关卡生成、武器差异化、Buff系统、Boss战、吐槽系统、本地图片替换、排行榜和局外成长等完整功能。希望将其作为项目新增游戏模块纳入规划和需求。
- 目标：在项目中新增"打工人弹射解压"游戏模块，建立独立模块文档和代码目录，纳入第一阶段（或后续阶段）交付。
- 不做：本次不入池开发任务，先完成模块规划和文档落档；不修改现有麻将Roguelike、PDF工具箱、AI修图工具的任务和代码。
- 用户价值：丰富项目游戏矩阵，覆盖"解压+弹射+Roguelike"细分赛道，与麻将Roguelike消除形成差异化互补。
- 涉及模块：打工人弹射解压 / 新增游戏模块。
- 可能影响文件：`docs/modules/angry-worker/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-25.md`, `docs/completion/**`
- 是否影响另一方任务：否。本任务只做新增模块文档，不修改现有 `apps/web/**`、PDF工具箱、AI修图、麻将Roguelike代码。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：模块文档目录完整（README/IMPLEMENTATION_PLAN/PROGRESS/DECISIONS/HANDOFF）；核心玩法方案、关卡生成算法、Buff系统、Boss设计、留存策略、广告方案、迭代路线已落档；`npm run docs:sync` 和 `git diff --check` 通过。
- AI 初步方案：创建 `docs/modules/angry-worker/` 模块目录，写入完整方案文档；同步更新任务池和当前状态。
- 处理结论：已入任务池
- 对应任务编号：T064

### IDEA-20260525-07：胡了卜 Cocos 首屏自动渲染

- 提出人：Lee
- 提出时间：2026-05-25
- 背景：用户已在 Cocos Creator 3.8.8 中创建 `HulebuGameScene.scene`，并按清单搭好 `Canvas / BoardRoot / SlotRoot / ComboRoot / HudRoot / RewardOverlay` 等节点结构。当前节点仍是空骨架，运行后不会自动显示测试牌山、8 格主槽、HUD 或组合按钮。
- 目标：新增 T063，让 Cocos 工程在场景脚本已绑定后可以运行出一版测试首屏：`GameSceneController.start()` 自动加载本地测试 scene model，`BoardLayerBinder` 自动生成牌节点，`SlotLayerBinder` 自动生成/填充 8 个槽位，`ComboBarBinder` 和 `HudBinder` 自动补齐按钮/标签文案。
- 不做：不导入最终青瓷牌面，不写复杂 `.scene` 资源，不实现完整点击入槽和组合结算，不接微信/抖音发布，不修改 Web 原型或站点入口。
- 用户价值：减少用户在 Cocos 里手工摆牌和排 UI 的成本，让正式表现层先能“跑起来、看得见”，方便下一步接真实规则状态和资源。
- 涉及模块：胡了卜 / 麻将 Roguelike 消除 / Cocos Creator 正式工程。
- 可能影响文件：`apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T063-hulebu-cocos-first-render.md`, `docs/tasks/claims/T063-codex.md`, `docs/progress/2026-05-25.md`, `docs/completion/2026-05-25-task-T063-hulebu-cocos-first-render.md`
- 是否影响另一方任务：否。本任务只修改开发 B 范围内的 Cocos 工程、共享结构测试和模块文档，不修改当前 T015 覆盖的 `apps/web/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：测试保护 Cocos 首屏自动渲染脚本契约；Cocos 工程包含本地测试 scene model；`GameSceneController.start()` 可自动 apply；Board/Slot/Combo/HUD Binder 能在缺少子节点或组件时创建最小可视 UI；共享测试、类型检查、文档同步和 diff 检查通过。
- AI 初步方案：先用 `mahjong-cocos-project.test.ts` 写红灯测试，检查 `bootstrap/HulebuSampleSceneModel.ts`、`GameSceneController.start()` 和 Binder 的自动节点/组件生成能力；再实现最小 Cocos UI 节点工厂，保证用户只需保存场景并点击播放就能看到占位牌面、8 格槽、按钮和 HUD。
- 处理结论：已入任务池
- 对应任务编号：T063

### IDEA-20260525-06：胡了卜 Cocos Creator 3.8.8 工程接入

- 提出人：Lee
- 提出时间：2026-05-25
- 背景：用户已安装 Cocos Dashboard 和 Cocos Creator 3.8.8，T061 已完成 Cocos 场景视图模型和节点绑定清单。下一步可以从“文档骨架”进入“编辑器可打开的正式工程壳”。
- 目标：新增 T062，在 `apps/game/mahjong-roguelike/cocos/` 下创建一个基于 Cocos Creator 3.8.8 `empty-2d` 模板结构的胡了卜工程壳，补齐脚本目录、场景占位、配置导入说明和工程结构测试。
- 不做：不导入最终美术，不生成完整可玩场景，不做动画/音效/发布包，不接微信/抖音构建，不接 `apps/web/**`，不把 HTML 原型 DOM 状态复制进 Cocos。
- 用户价值：让用户在 Cocos Dashboard 中可以直接添加/打开胡了卜正式工程目录，后续在编辑器里创建 `HulebuGameScene`、绑定节点和 prefab。
- 涉及模块：胡了卜 / 麻将 Roguelike 消除 / Cocos Creator 正式工程。
- 可能影响文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/docs/**`, `apps/game/mahjong-roguelike/README.md`, `packages/shared/src/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T062-hulebu-cocos-creator-project.md`, `docs/tasks/claims/T062-codex.md`
- 是否影响另一方任务：否。本任务只修改开发 B 范围内的正式游戏工程、共享测试和模块文档，不修改当前 T015 覆盖的 `apps/web/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：本机确认 Cocos Creator 3.8.8 安装路径；`apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/` 具备 Creator `empty-2d` 风格工程结构；工程内有 `assets/scripts/` 的首场景脚本边界和配置导入说明；共享测试能校验工程壳关键文件；共享测试、类型检查、文档同步和 diff 检查通过。
- AI 初步方案：先探测 `/Applications/Cocos/Creator/3.8.8/CocosCreator.app` 和内置 `empty-2d` 模板；再用 TDD 新增 `mahjong-cocos-project.test.ts` 校验工程目录、`package.json`、`tsconfig.json`、`settings`、`profiles`、`assets/scripts` 和 `assets/scenes`；最后创建工程壳和文档，不手写复杂 `.scene` 资源格式。
- 处理结论：已入任务池
- 对应任务编号：T062

### IDEA-20260525-05：胡了卜 Cocos 场景骨架第一版

- 提出人：Lee
- 提出时间：2026-05-25
- 背景：T060 已完成 Cocos/GDevelop 正式表现层桥接，下一步需要进入 Cocos 正式工程承接。当前环境未确认安装 Cocos Creator，因此第一步应先建立可测试的 Cocos 场景骨架和视图模型，不直接依赖编辑器运行。
- 目标：新增 T061，在 `apps/game/mahjong-roguelike/cocos/` 下建立 Cocos 场景骨架说明和脚本结构，并在共享包中提供 Cocos 友好的视图模型适配器，让 `GameScene / BoardLayer / SlotLayer / HudLayer / ComboBar` 后续能直接消费同一份 snapshot。
- 不做：不安装 Cocos Creator，不生成完整 `.scene` 资源，不导入最终美术，不实现动画、音效、粒子、发布包、微信/抖音适配，不接 `apps/web/**`。
- 用户价值：让正式工程从“文档桥接”进入“场景结构可落地”，后续打开 Cocos 编辑器时可以按同一套脚本边界接节点、prefab 和资源。
- 涉及模块：胡了卜 / 麻将 Roguelike 消除 / Cocos 正式工程。
- 可能影响文件：`packages/shared/src/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/docs/**`, `apps/game/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T061-hulebu-cocos-scene-skeleton.md`, `docs/tasks/claims/T061-codex.md`
- 是否影响另一方任务：否。本任务只修改开发 B 范围内的共享包、游戏模块和模块文档，不修改当前 T015 覆盖的 `apps/web/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：共享包新增 Cocos 视图模型适配器并有测试覆盖；`apps/game/mahjong-roguelike/cocos/` 有场景骨架说明、脚本边界和节点绑定清单；文档明确下一步如何在 Cocos Creator 中接 `GameScene`；共享测试、类型检查、文档同步和 diff 检查通过。
- AI 初步方案：先用 TDD 定义 `createMahjongCocosSceneModel`，把 snapshot 转成 Cocos 更直接使用的 board nodes、slot nodes、reserve nodes、combo controls 和 HUD model；再创建 `cocos/README.md`、`cocos/scripts/` 脚本占位说明和场景节点清单，不引入 `cc` 运行时依赖。
- 处理结论：已入任务池
- 对应任务编号：T061

### IDEA-20260525-04：胡了卜 Cocos/GDevelop 正式表现层承接

- 提出人：Lee
- 提出时间：2026-05-25
- 背景：T059 已完成密集牌山调参原型，用户要求开始进入 Cocos/GDevelop 正式表现层承接。项目既有规划明确 Cocos Creator 是正式小游戏发布主线，GDevelop 是 Web H5 原型和轻量通道，因此需要先把当前 HTML 原型中的牌山、槽位、候选按钮和 HUD 状态整理成引擎无关的表现层契约。
- 目标：新增 T060，建立胡了卜正式表现层桥接第一版：在共享包中输出引擎无关的渲染快照和操作契约，并补充 Cocos/GDevelop 承接文档，说明正式场景、牌节点、卡槽、HUD、奖励弹层和输入流如何消费同一份规则状态。
- 不做：不安装或创建完整 Cocos Creator 工程，不导入最终美术资源，不做 GDevelop 事件表成品，不接 Web 站点路由，不做最终动画、音效、埋点、发布包、排行榜或付费能力。
- 用户价值：让胡了卜从 HTML 配置试玩页平滑过渡到正式引擎表现层，避免把规则、牌山生成和 UI 状态分别在 Cocos/GDevelop/网页中重写。
- 涉及模块：胡了卜 / 麻将 Roguelike 消除 / 正式游戏表现层。
- 可能影响文件：`packages/shared/src/**`, `apps/game/mahjong-roguelike/docs/**`, `apps/game/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T060-hulebu-formal-presentation-bridge.md`, `docs/tasks/claims/T060-codex.md`
- 是否影响另一方任务：否。本任务只修改开发 B 范围内的共享规则包、正式游戏模块文档和任务文档，不修改当前 T015 覆盖的 `apps/web/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：共享包新增表现层快照契约并有测试覆盖；快照包含牌山可点/遮挡状态、槽位/备用槽、组合按钮、余牌和工具状态；Cocos/GDevelop 承接文档说明场景结构、对象映射和输入回传；共享测试、类型检查、文档同步和 diff 检查通过。
- AI 初步方案：先用 TDD 在 `packages/shared` 中定义 `createMahjongPresentationSnapshot` 的行为，再实现纯 TypeScript 适配器；Cocos 侧按 `GameScene / BoardLayer / SlotLayer / HudLayer / RewardOverlay` 消费快照，GDevelop 侧用对象变量和事件表映射同一快照，不在本任务里引入具体编辑器工程。
- 处理结论：已入任务池
- 对应任务编号：T060

### IDEA-20260525-03：胡了卜随机牌山调参面板

- 提出人：Lee
- 提出时间：2026-05-25
- 背景：胡了卜当前密集牌山已经接近目标方向，但用户明确希望最终玩法保持随机轮廓，具体数值后续可以在正式构建游戏时继续调。为避免现在把牌量、层数、字牌比例和 `胡` 包数量写死，需要先给原型页一个开发用调参入口。
- 目标：新增 T059，在配置试玩页中加入仅用于开发验证的密集牌山调参面板，支持通过 URL 和表单调整随机种子、牌量、同列堆叠深度、`胡` 包数量和字牌权重，并可一键重新生成当前关卡牌山。
- 不做：不把调参面板作为正式玩家 UI，不做最终数值平衡，不新增完整关卡编辑器，不创建 Cocos/GDevelop 正式工程，不接 Web 站点路由。
- 用户价值：让玩法设计可以边试玩边调整随机生成参数，快速观察 8 格主槽、字牌比例、Boss 目标和 `胡` 包出现率是否过难或过稳。
- 涉及模块：胡了卜 / 麻将 Roguelike 消除。
- 可能影响文件：`packages/shared/src/mahjong-config.test.ts`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/game/mahjong-roguelike/docs/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T059-hulebu-mountain-tuning-panel.md`, `docs/tasks/claims/T059-codex.md`
- 是否影响另一方任务：否。本任务只修改开发 B 范围内的游戏原型、共享配置测试和模块文档，不修改当前 T015 覆盖的 `apps/web/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：配置试玩页有开发用调参面板；URL 参数可初始化随机种子、牌量、同列堆叠深度、`胡` 包数量和字牌权重；点击重新生成会用新参数刷新密集牌山；共享测试、类型检查、脚本语法检查、桌面和移动端浏览器检查通过。
- AI 初步方案：新增 `mountainTuning` 状态和参数解析函数；密集牌山生成器读取调参状态决定种子、目标牌量、同列堆叠数量、`胡` 重点包数量和随机字牌权重；侧栏新增折叠式开发调参面板，保持默认值与当前体验接近。
- 处理结论：已入任务池
- 对应任务编号：T059

### IDEA-20260525-02：胡了卜 20 关节奏骨架和第二 Boss

- 提出人：Lee / Codex
- 提出时间：2026-05-25
- 背景：胡了卜已完成 10 关原型、奖励节点、Boss 目标、字牌、固定 8 格主槽和 `胡` 牌型。用户已经确认奖励节奏为 `3 / 6 / 9 / 13 / 16 / 19`，Boss 关为 `10 / 20`，下一步需要把第一版 20 关主线骨架落到配置和试玩页里。
- 目标：新增 T058，将 `levels.json` 扩展到 20 关，并为第 13-20 关建立二阶段曲线；第 20 关加入第二 Boss 目标雏形；配置测试覆盖 20 关数量、奖励/Boss 节点和第二阶段重点。
- 不做：不做最终 20 关精调，不新增完整奖励池，不做完整听牌/番型，不创建 Cocos/GDevelop 正式工程，不接 Web 站点路由。
- 用户价值：让当前原型从“10 关验证”进入“20 关主线节奏可看”的状态，方便继续讨论后半程难度、奖励间隔和第 20 关 Boss 目标。
- 涉及模块：胡了卜 / 麻将 Roguelike 消除。
- 可能影响文件：`packages/shared/**`, `apps/game/mahjong-roguelike/config/**`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/game/mahjong-roguelike/docs/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T058-hulebu-20-level-skeleton.md`, `docs/tasks/claims/T058-codex.md`
- 是否影响另一方任务：否。本任务只修改开发 B 范围内的游戏模块、共享配置测试和文档，不修改当前 T015 覆盖的 `apps/web/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：`levels.json` 共 20 关；奖励节点为 3/6/9/13/16/19；Boss 关为 10/20 且都有 `bossGoals`；第 20 关含更复杂目标；配置试玩页能显示 20 个关卡标签；共享测试、类型检查、脚本语法检查、桌面和移动端浏览器检查通过。
- AI 初步方案：先用配置测试锁定 20 关契约，再复制并变体化 11-20 关草案；第 20 关使用 `吃 / 碰 / 杠 / 三门齐 / 字牌碰 / 胡 / 积分` 等复合目标作为 Boss 雏形；原型页保持现有结构，只让关卡标签支持 20 个。
- 处理结论：已入任务池
- 对应任务编号：T058

### IDEA-20260525-01：胡了卜胡牌节奏配置和密集牌山胡牌包

- 提出人：Lee / Codex
- 提出时间：2026-05-25
- 背景：T056 已确认主槽固定 8 格并加入 `胡`，下一步需要验证 `胡` 的出现频率和爽点，而不是只依赖自然随机凑出。
- 目标：新增 T057，在关卡配置中加入重点组合标记，并让配置试玩页和密集牌山生成器能按标记优先展示和生成 `胡` 牌型包。
- 不做：不做完整听牌算法，不做番型，不做全 20 关重平衡，不新增奖励系统。
- 用户价值：让试玩时能更直接判断 `胡` 是否好玩、出现是否过密或过稀，以及 8 格槽位压力是否合适。
- 涉及模块：胡了卜 / 麻将 Roguelike 消除。
- 可能影响文件：`packages/shared/**`, `apps/game/mahjong-roguelike/config/**`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/game/mahjong-roguelike/docs/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T057-hulebu-hu-rhythm-config.md`, `docs/tasks/claims/T057-codex.md`
- 是否影响另一方任务：否。本任务只修改开发 B 范围内的游戏模块、共享测试和文档，不修改当前 T015 覆盖的 `apps/web/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：至少 2 个关卡配置 `featuredCombos` 包含 `hu`；配置加载测试能校验重点组合合法；配置试玩页显示重点组合；密集牌山模式在对应关卡优先生成可胡包；共享测试、类型检查、脚本语法检查、桌面和移动端浏览器检查通过。
- AI 初步方案：给关卡增加 `featuredCombos` 字段，先标记第 6 关和第 10 关；配置试玩页在关卡信息栏展示 `重点：胡`；密集牌山生成器在发现 `hu` 标记时优先插入两个三张组合和一个对子，并保持现有吃碰杠/Boss 包逻辑。
- 处理结论：已入任务池
- 对应任务编号：T057

### IDEA-20260524-02：胡了卜固定 8 格主槽和胡牌 3+3+2

- 提出人：Lee
- 提出时间：2026-05-24
- 背景：用户确认主卡槽不应继续扩到 9 个或更多，否则难度下降太多；8 格刚好可以组成 `3 + 3 + 2` 的胡牌结构。备用卡槽仍可以作为救场，但不应成为常规第 9 格。
- 目标：新增 T056，将主槽固定为 8 格并加入 `胡` 牌型：槽内 8 张能拆为两个 3 张组合和一个对子时，可以一次消除 8 张。
- 不做：不实现完整麻将胡牌算法，不做 9 格主槽，不做完整番型结算，不扩完整 20 关。
- 用户价值：让胡了卜从吃碰杠消除进一步形成自己的核心记忆点，主槽压力也更稳定。
- 涉及模块：胡了卜 / 麻将 Roguelike 消除。
- 可能影响文件：`packages/shared/**`, `apps/game/mahjong-roguelike/config/**`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T056-hulebu-fixed-eight-slot-hu.md`, `docs/tasks/claims/T056-codex.md`
- 是否影响另一方任务：否。本任务只修改开发 B 范围内的游戏模块和共享规则测试，不修改当前 T015 覆盖的 `apps/web/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：主槽默认固定 8；扩槽奖励不再提高主槽上限；`胡` 候选能检测并消除 8 张 `3 + 3 + 2`；备用槽不参与胡；共享规则测试、类型检查、原型脚本检查、浏览器桌面和移动端检查通过。
- AI 初步方案：在共享规则模型中新增 `hu` 组合类型和候选检测，保持 `chi / peng / gang` 既有逻辑；在配置试玩页新增 `胡` 按钮和候选展示；将主槽上限锁定到 8，扩槽奖励改成备用槽或救场方向。
- 处理结论：已入任务池
- 对应任务编号：T056

### IDEA-20260523-10：胡了卜麻将牌面 UI 参考图

- 提出人：Lee
- 提出时间：2026-05-23
- 背景：胡了卜已经完成规则模型、配置驱动试玩原型和密集牌山生成器，下一步需要开始确定麻将牌面 UI 方向。用户希望先生成 `万 / 条 / 筒` 三种花色和 1-9 点数的参考图，用于选择美术风格。
- 目标：新增 T051，使用 `pptoken-imagegen` 生成若干张胡了卜麻将牌面 UI 参考 sheet，每张展示三种花色和 1-9 点数，重点比较风格方向、可读性、轮廓、色彩和移动端识别度。
- 不做：不切最终 sprite atlas，不写入 Cocos/GDevelop 工程，不替换现有 HTML 原型牌面，不修改玩法、配置、规则模型或 Web 站点入口。
- 用户价值：让团队在正式美术切图和工程接入前先快速比较牌面视觉方向，避免过早锁定不适合密集堆叠玩法的美术资源。
- 涉及模块：胡了卜 / 麻将 Roguelike 消除 / 美术资源探索。
- 可能影响文件：`output/imagegen/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T051-hulebu-tile-ui-references.md`, `docs/tasks/claims/T051-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`
- 是否影响另一方任务：低风险。本任务只生成外部参考图和文档记录，不修改 `apps/web/**`、`packages/shared/**`、`apps/game/mahjong-roguelike/**` 的逻辑或配置。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：生成至少 3 张风格参考图；每张能看出 `万 / 条 / 筒` 三类和 1-9 点数方向；输出路径记录清楚；`npm run docs:sync` 和 `git diff --check` 通过。若 `PPTOKEN_API_KEY` 未配置，则记录阻塞并等待用户提供。
- AI 初步方案：先生成三套参考方向：清爽高可读、温润玉牌、轻幻想 Roguelike。每套做成一张 3x9 牌面 sheet，避免真实赌博氛围和品牌元素，强调移动端密集堆叠下的识别度。
- 处理结论：已入任务池
- 对应任务编号：T051

### IDEA-20260523-09：胡了卜牌山生成器和密集堆叠布局

- 提出人：Lee
- 提出时间：2026-05-23
- 背景：T049 已完成配置驱动试玩页，但用户反馈当前堆叠方式和“羊了个羊”差异明显。现有原型主要用于配置联调，牌量少、坐标手写、遮挡关系显式，不足以验证真正牌山的空间压力。
- 目标：新增 T050，在现有配置试玩页中补充可切换的“密集牌山”生成模式，用受控组合包自动生成更多牌、更密集的层级坐标和 `blockedBy` 遮挡关系，让团队能对比“配置关卡”和“生成牌山”的手感。
- 不做：不创建 Cocos/GDevelop 正式工程，不接 Next.js 路由，不修改 `apps/web/**`，不做最终美术、音效、埋点、排行榜、付费或完整可解路径搜索。
- 用户价值：快速判断胡了卜是否能从规则联调页推进到接近目标玩法的牌山体验，提前暴露牌量、遮挡、解锁节奏和槽位压力问题。
- 涉及模块：胡了卜 / 麻将 Roguelike 消除。
- 可能影响文件：`apps/game/mahjong-roguelike/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**`
- 是否影响另一方任务：低风险。本任务只修改开发 B 范围内的游戏模块和文档，不修改当前 T015 覆盖的 `apps/web/**`、PDF 工具箱、门户数据或部署文件。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：配置试玩页可切换“配置关卡 / 密集牌山”；密集牌山模式每关生成更多牌和多层遮挡；点击上层牌后可解锁下层牌；桌面和移动端基础检查通过；`npm run test -w packages/shared -- mahjong`、`npm run docs:sync` 和 `git diff --check` 通过。
- AI 初步方案：在 `apps/game/mahjong-roguelike/prototypes/config-playable/index.html` 中新增牌山模式切换、确定性随机生成器、组合包铺牌、层级坐标模板和遮挡计算；保持原 10 关配置模式可用。
- 处理结论：已入任务池
- 对应任务编号：T050

### IDEA-20260523-08：胡了卜配置驱动试玩原型

- 提出人：Lee
- 提出时间：2026-05-23
- 背景：T048 已确认 10 关和 10 奖励配置能被共享规则模型承接，下一步需要把配置真的渲染成可操作界面，验证表现层是否能按同一批 JSON 跑通点击、入槽、手动组合和奖励选择。
- 目标：新增 T049，在 `apps/game/mahjong-roguelike/` 下做一个不接 Web 站点的静态试玩原型，直接加载 `config/levels.json` 与 `config/rewards.json`，支持切换 10 关、点击可用牌、槽位、候选组合、手动 `吃 / 碰 / 杠`、余牌和奖励选择。
- 不做：不创建 Cocos/GDevelop 正式工程，不接 Next.js 路由，不修改 `apps/web/**`，不做完整可解路径搜索，不做最终美术、音效、埋点、付费或排行榜。
- 用户价值：让团队可以直接看到 MVP 配置在表现层里的实际手感，提前发现坐标、层级、槽位压力、候选展示和奖励选择的问题。
- 涉及模块：胡了卜 / 麻将 Roguelike 消除。
- 可能影响文件：`apps/game/mahjong-roguelike/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**`
- 是否影响另一方任务：低风险。本任务只修改开发 B 范围内的游戏模块和文档，不修改当前 T015 覆盖的 `apps/web/**`、PDF 工具箱、门户数据或部署文件。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：静态原型可通过本地 HTTP 服务打开；原型能加载 10 关配置和奖励配置；支持桌面和移动端基础操作；`npm run test -w packages/shared -- mahjong`、`npm run docs:sync` 和 `git diff --check` 通过。
- AI 初步方案：新增 `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`，用原生 HTML/CSS/JS 读取 JSON 配置并内置轻量规则函数，保持与 `packages/shared` 规则模型一致；通过浏览器插件检查桌面和移动端。
- 处理结论：已入任务池
- 对应任务编号：T049

### IDEA-20260523-07：胡了卜配置加载验证

- 提出人：Lee
- 提出时间：2026-05-23
- 背景：T047 已完成胡了卜 10 关和 10 个局内奖励配置草案，进入表现层前需要自动化验证这些 JSON 能被共享规则模型读取、实例化和基础校验。
- 目标：新增 T048，在 `packages/shared` 中补充配置加载测试，校验关卡数量、奖励数量、ID 唯一性、引用完整性、初始状态可创建、奖励 effect 可应用，以及每关至少存在可检测组合样本。
- 不做：不修改关卡和奖励配置内容，不创建 Cocos/GDevelop 工程，不接 Web 站内路由，不做可解路径搜索、不做最终数值平衡。
- 用户价值：让胡了卜从“配置能解析”进入“配置能被规则模型承接”的状态，降低后续表现层接入时才发现字段或引用不匹配的风险。
- 涉及模块：胡了卜 / 麻将 Roguelike 消除。
- 可能影响文件：`packages/shared/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**`
- 是否影响另一方任务：低风险。本任务修改开发 B 范围内的共享规则测试和麻将模块文档，不修改当前 T015 覆盖的 `apps/web/**`、PDF 工具箱或门户数据文件。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：新增配置加载测试；`npm run test -w packages/shared -- mahjong` 通过；`npm run typecheck -w packages/shared` 通过；`npm run docs:sync` 通过；`git diff --check` 通过。
- AI 初步方案：新增 `packages/shared/src/mahjong-config.test.ts`，通过 Node fs 读取 `apps/game/mahjong-roguelike/config/levels.json` 与 `rewards.json`，并复用 `createMahjongState`、`getComboCandidates`、`getAvailableBoardTiles`、`applyReward` 等纯函数做结构和规则衔接验证。
- 处理结论：已入任务池
- 对应任务编号：T048

### IDEA-20260523-06：胡了卜 MVP 10 关和 10 奖励配置草案

- 提出人：Lee
- 提出时间：2026-05-23
- 背景：T046 已将 5 个验证场景和 8 个局内奖励沉淀为配置草案，下一步需要把配置扩展到 MVP 冻结线中的 10 关和 10 个奖励，为后续表现层接入提供更完整的内容样本。
- 目标：新增 T047，扩展 `apps/game/mahjong-roguelike/config/levels.json` 到 10 关，扩展 `rewards.json` 到 10 个奖励，并补充内容设计说明。
- 不做：不创建 Cocos/GDevelop 工程，不修改共享规则模型，不接站内路由，不做最终 20 关、无尽、每日、排行榜和完整数值平衡。
- 用户价值：让胡了卜进入可试玩 MVP 内容雏形，后续表现层接入时可以直接读取 10 关和 10 个奖励做第一轮调试。
- 涉及模块：胡了卜 / 麻将 Roguelike 消除。
- 可能影响文件：`apps/game/mahjong-roguelike/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**`
- 是否影响另一方任务：低风险。本任务只扩展开发 B 范围内的游戏配置和文档，不修改 `apps/web/**`、PDF 工具箱或部署文件。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：配置 JSON 可解析；共 10 关和 10 个奖励；所有奖励引用有效；所有 `blockedBy`、初始槽位引用有效；`npm run docs:sync` 和 `git diff --check` 通过。
- AI 初步方案：在 T046 的 5 个验证关后追加 5 个 MVP 主线关，增加 `peng_score_plus_10` 和 `shuffle_plus_1` 两个奖励，补充 `docs/content-plan.md` 说明关卡曲线。
- 处理结论：已入任务池
- 对应任务编号：T047

### IDEA-20260523-05：胡了卜验证场景配置草案

- 提出人：Lee
- 提出时间：2026-05-23
- 背景：T045 已完成 `胡了卜` 命名落档和共享规则模型第一版，下一步需要把 T044 HTML demo 中的 5 个验证场景沉淀为引擎无关配置，供后续 Cocos/GDevelop/Web 试玩复用。
- 目标：新增 T046，在 `apps/game/mahjong-roguelike/config/` 下建立牌定义、关卡和局内奖励配置草案，并补充模块交接和进展说明。
- 不做：不创建 Cocos/GDevelop 正式工程，不接站内路由，不修改 `apps/web/**`，不做最终 20 关和完整数值平衡。
- 用户价值：让 demo 里的关卡、牌山、奖励不再只存在于 HTML 临时代码中，后续表现层可以读取配置而不是重写规则。
- 涉及模块：胡了卜 / 麻将 Roguelike 消除。
- 可能影响文件：`apps/game/mahjong-roguelike/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**`
- 是否影响另一方任务：低风险。`apps/game/**` 属于开发 B 默认范围；本任务不修改当前 T015 覆盖的 `apps/web/**` 和 PDF 工具箱文件。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：配置 JSON 可解析；5 个验证场景与 T044 demo 对齐；奖励配置使用 T045 规则模型可表达的 effect 类型；`npm run docs:sync` 和 `git diff --check` 通过。
- AI 初步方案：新增 `tiles.json`、`levels.json`、`rewards.json` 和配置说明，把入门、顺子、杠冲突、多组合、危局 5 个场景配置化。
- 处理结论：已入任务池
- 对应任务编号：T046

### IDEA-20260523-04：胡了卜命名落档和规则模型第一版

- 提出人：Lee
- 提出时间：2026-05-23
- 背景：麻将小游戏已经命名为 `胡了卜`，且最小可玩 HTML demo 已完成；进入正式 MVP 前需要先把命名写入模块文档，并把 demo 中的核心规则抽成可测试的 TypeScript 规则模型。
- 目标：新增 T045，先完成 `胡了卜` 模块命名落档、`packages/shared` 包壳、`mahjong-game` 规则模型和测试，覆盖吃、碰、杠、非法组合、槽位满前组合检测、余牌计数和基础奖励效果。
- 不做：不创建正式 Cocos/GDevelop 工程，不接站内游戏路由，不修改当前 PDF 任务占用的 `apps/web/src/components/portal-data.ts`，不做完整 20 关和最终美术。
- 用户价值：让正式游戏开发从可测试规则开始，避免把 HTML demo 的临时逻辑直接复制进 Cocos 或 Web 入口。
- 涉及模块：胡了卜 / 麻将 Roguelike 消除。
- 可能影响文件：`packages/shared/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**`
- 是否影响另一方任务：低风险。`packages/shared/**` 当前无未完成领取；`apps/web/src/components/portal-data.ts` 正由 T015 覆盖，本任务暂不修改。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：`npm run test -w packages/shared -- mahjong` 通过；`npm run typecheck -w packages/shared` 通过；`npm run docs:sync` 通过；`git diff --check` 通过；模块文档说明显示名为 `胡了卜`。
- AI 初步方案：新增 `packages/shared/package.json`、`tsconfig.json`、`src/index.ts`、`src/mahjong-game.ts` 和测试；将吃碰杠检测、候选选择、槽位满前检测、余牌统计、奖励状态修改做成引擎无关纯函数。
- 处理结论：已入任务池
- 对应任务编号：T045

### IDEA-20260523-03：麻将 Roguelike 最小可玩验证原型

- 提出人：Lee
- 提出时间：2026-05-23
- 背景：T043 已明确后续不直接进入正式 T017，而是先做最小可玩验证原型，用 3-5 个场景验证手动 `吃 / 碰 / 杠`、槽位压力、余牌、奖励和失败救场。
- 目标：新增一个可直接打开试玩的轻量 HTML 原型，跑通点击可见牌、入槽锁定、手动组合发动、候选选择、余牌统计、局内积分、奖励选择、满槽救场和失败提示。
- 不做：不创建 Cocos/GDevelop 正式工程，不修改 `apps/**` 或 `packages/**`，不接站内路由，不做最终美术，不做完整 20 关、无尽、每日、高阶或排行榜。
- 用户价值：让团队不用等正式工程就能先试玩核心闭环，快速判断玩法是否好懂、有策略、有麻将感。
- 涉及模块：麻将 Roguelike 消除。
- 可能影响文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**`
- 是否影响另一方任务：否。本次只做文档目录内的轻量验证原型，不占用正式 `apps/**`、`packages/**` 或部署文件。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：原型 HTML 可本地打开；至少包含 5 个验证场景；支持手动 `吃 / 碰 / 杠`、候选展示、余牌、奖励选择和满槽失败前救场；通过浏览器桌面/移动端检查、UTF-8 无 BOM、`npm run docs:sync` 和 `git diff --check`。
- AI 初步方案：新增 T044；用单文件 HTML/CSS/JS 做玩法验证原型，优先验证规则和交互，不引入框架依赖。
- 处理结论：已入任务池
- 对应任务编号：T044

### IDEA-20260523-02：麻将 Roguelike 最小可玩闭环和 MVP 开发拆分计划

- 提出人：Lee
- 提出时间：2026-05-23
- 背景：T042 已完成 MVP 玩法验证计划，但还缺少验证计划之后的承接文档：最小可玩闭环具体做什么、验证过程观察什么、验证通过后正式 MVP 按什么顺序拆开发任务。
- 目标：新增一份构建计划，明确 `验证闭环` 和 `正式 MVP` 的区别，定义验证原型的功能边界、随机牌局生成口径、观察埋点、通过后的开发拆分、验收标准和后置内容。
- 不做：不实现代码，不创建 Cocos/GDevelop 工程，不改 Web 应用，不做最终 UI 视觉稿，不冻结长期模式数值。
- 用户价值：让团队知道上次规划后续没有丢，能够从“玩法认可”自然进入“先验证、再实现”的工程路径，避免直接把完整长期规划塞进第一版。
- 涉及模块：麻将 Roguelike 消除。
- 可能影响文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**`
- 是否影响另一方任务：否。本次只做文档规划，不占用 `apps/**`、`packages/**` 或部署文件。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：产出 Markdown 构建计划和 HTML 可视化稿；同步任务分片、领取分片、模块进展、交接和完成记录；通过 `npm run docs:sync`、文档自审、UTF-8 无 BOM 检查和 `git diff --check`。
- AI 初步方案：新增 T043；将后续工作拆成最小可玩闭环、验证观察、正式 MVP 开发拆分三段，并明确验证不过时的回退决策。
- 处理结论：已入任务池
- 对应任务编号：T043

### IDEA-20260523-01：麻将 Roguelike MVP 玩法验证计划

- 提出人：Lee
- 提出时间：2026-05-23
- 背景：麻将 Roguelike 的玩法评审稿已经完成，但在进入正式实现前，还需要一份更聚焦的验证计划，明确先验证哪些核心假设、用什么最小闭环观察体验是否成立，以及哪些内容必须冻结到 MVP。
- 目标：新增一份玩法验证计划，聚焦 `点击 - 入槽 - 手动吃碰杠 - 奖励 - 失败` 的最小闭环，定义验证样本、观察指标、通过/失败标准和 MVP 冻结口径。
- 不做：不实现代码，不做最终数值平衡，不扩展长线模式，不进入正式开发拆分。
- 用户价值：让团队先判断玩法本身是否成立，再决定具体开发顺序，避免过早把完整长期内容塞进第一版。
- 涉及模块：麻将 Roguelike 消除。
- 可能影响文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**`
- 是否影响另一方任务：否。本次只做玩法验证文档，不占用 `apps/**` 和 `packages/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：产出 Markdown 玩法验证计划，必要时附 HTML 可视化稿；同步任务分片、领取分片、状态、进展和完成记录；通过文档自审、`npm run docs:sync` 和 UTF-8 检查。
- AI 初步方案：新增 T042；先冻结验证目标，再用最小可玩闭环测试按钮理解度、槽位压力、余牌价值、局内奖励和失败救场是否成立。
- 处理结论：已入任务池
- 对应任务编号：T042

### IDEA-20260522-11：麻将 Roguelike 团队评审版玩法方案

- 提出人：Lee
- 提出时间：2026-05-22
- 背景：麻将 Roguelike 的核心玩法、规则、经济、体力、失败救场、长期模式和程序化随机生成方向已经多轮讨论，需要整理成一份团队可评审、可补充的完整玩法方案，并提供更易浏览的 HTML 可视化版本。
- 目标：新增 Markdown 玩法方案和 HTML 团队评审稿，归纳游戏定位、核心循环、吃碰杠规则、槽位与失败、经济体力、Roguelike、永久成长、模式结构、牌局生成和待评审问题。
- 不做：不实现游戏代码，不做最终 UI 视觉稿，不定最终数值，不进入开发计划。
- 用户价值：让团队可以集中评价玩法是否成立、哪里缺失、哪些内容进入 MVP，避免继续只在聊天记录里分散讨论。
- 涉及模块：麻将 Roguelike 消除。
- 可能影响文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**`
- 是否影响另一方任务：否。本次只做玩法文档，不占用 `apps/**` 和 `packages/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：产出 Markdown 玩法评审方案和 HTML 可视化评审稿；同步任务分片、领取分片、状态、进展和完成记录；通过文档自审、`npm run docs:sync` 和 UTF-8 检查。
- AI 初步方案：新增 T041；从 `GAMEPLAY_PLAN.md` 和 `DECISIONS.md` 提炼一份面向团队评审的方案，HTML 版做成信息卡片、流程、表格和评审问题看板。
- 处理结论：已入任务池
- 对应任务编号：T041

### IDEA-20260522-10：麻将 Roguelike 完整牌局规则、经济体力和失败救场规划

- 提出人：Lee
- 提出时间：2026-05-22
- 背景：当前已经确认手动 `吃 / 碰 / 杠`、牌谱记牌器、孤张处理、永久能力和卡槽系统，但完整牌局中的输入锁定、撤销、组合选择、满槽失败、双层收益、体力和救场顺序还需要统一成最终规则口径。
- 目标：在麻将 Roguelike 模块中补齐完整牌局规则，明确可点击牌、入槽动画锁定、撤回规则、多组合选择、孤张内部判定、局内积分与铜钱分层、体力系统、失败前救场顺序和新手引导口径。
- 不做：不实现代码，不做最终数值平衡，不生成 UI，不改应用页面。
- 用户价值：让核心牌局从“想法集合”变成可落地状态机，后续规则模型、UI 原型和数值配置可以按统一口径实现。
- 涉及模块：麻将 Roguelike 消除。
- 可能影响文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**`
- 是否影响另一方任务：否。本次只做玩法文档，不占用 `apps/**` 和 `packages/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：玩法文档明确完整牌局状态机、组合选择、双层经济、体力和失败前救场顺序；决策文档记录新规则；同步任务分片、领取分片、状态、进展和完成记录。
- AI 初步方案：新增 T040；将 `吃 / 碰 / 杠` 从按钮规则扩展为完整牌局流程，并把局内积分、铜钱、体力、满槽护符、备用槽和首败保护纳入同一套判定。
- 处理结论：已入任务池
- 对应任务编号：T040

### IDEA-20260522-09：麻将 Roguelike 永久固化能力和卡槽系统规划

- 提出人：Lee
- 提出时间：2026-05-22
- 背景：当前已经确认手动吃碰杠、牌谱记牌器、局内 Roguelike 能力池和高阶卡槽压缩，但玩家还需要明确永久成长、局内构筑、手牌槽位和能力卡槽的边界。
- 目标：在麻将 Roguelike 模块中新增永久能力与能力卡槽规划，明确 `基础成长`、`固化能力`、`起局能力`、`道具强化` 四层结构，以及手牌槽位和能力卡槽的区别、基础槽数、压缩规则和首批可做内容。
- 不做：不实现代码，不做最终数值平衡，不生成 UI，不改游戏逻辑。
- 用户价值：让玩家清楚哪些能力是永久成长、哪些是每局构筑、哪些只是工具强化，避免把“手牌槽位”和“能力卡槽”混为一谈。
- 涉及模块：麻将 Roguelike 消除。
- 可能影响文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**`
- 是否影响另一方任务：否。本次只做玩法文档，不占用 `apps/**` 和 `packages/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：玩法文档明确永久能力分层、能力卡槽数量、手牌槽位与能力卡槽的区别、基础成长与高阶压缩规则；同步任务池、领取记录、状态、进展和完成记录。
- AI 初步方案：新增 T038；将永久能力分为自动生效的基础成长、需要装备的固化能力、起局能力和道具强化四层；手牌槽位继续作为局外成长属性，能力卡槽则按周目压缩。
- 处理结论：已入任务池
- 对应任务编号：T038

### IDEA-20260522-08：新增 docs:sync 自动汇总脚本

- 提出人：Lee
- 提出时间：2026-05-22
- 背景：T036 已建立任务分片和领取分片，但主文档摘要仍需要人工汇总。
- 目标：新增 `npm run docs:sync`，从 `docs/tasks/items/` 和 `docs/tasks/claims/` 自动生成 `TASK_BOARD.md`、`CLAIMS.md` 和 `CURRENT_STATUS.md` 中的摘要区。
- 不做：不重写历史任务表，不删除已有手工记录，不修改业务代码，不实现复杂任务数据库。
- 用户价值：进一步减少人工汇总成本，降低主文档冲突概率。
- 涉及模块：协作文档、任务管理脚本。
- 可能影响文件：`package.json`, `scripts/docs-sync.mjs`, `docs/workflow/doc-sync-policy.md`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**`
- 是否影响另一方任务：是。该脚本会成为后续所有人同步主文档摘要的推荐方式。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：根目录存在 `npm run docs:sync`；脚本扫描任务分片和领取分片；主文档出现自动生成摘要区；脚本不覆盖历史手写内容；验证命令通过。
- AI 初步方案：新增 T037；用 Node.js 标准库读取 Markdown 分片，解析标题和 `- 字段：值`，只更新 `<!-- DOCS_SYNC_* -->` 标记区域。
- 处理结论：已入任务池
- 对应任务编号：T037

### IDEA-20260522-07：降低多人协作文档冲突的分片同步规范

- 提出人：Lee
- 提出时间：2026-05-22
- 背景：多人开发时，主开发和计划任务文档会被多人或多个 AI 同时修改，导致每次提交容易产生冲突。
- 目标：把 `TASK_BOARD.md`、`CLAIMS.md`、`CURRENT_STATUS.md` 从高频写入入口改成汇总视图；分步操作优先写任务分片、领取分片、模块进展或当天进展；完整任务完成后再由 AI 汇总主文档。
- 不做：不实现自动生成脚本，不重写历史任务，不修改业务代码。
- 用户价值：降低 Git 冲突频率，让多人可以并行推进任务，同时保留主文档的全局视图。
- 涉及模块：协作文档、AI 入口规则、任务管理流程。
- 可能影响文件：`AGENTS.md`, `CLAUDE.md`, `docs/PROJECT_CONTEXT.md`, `docs/workflow/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**`
- 是否影响另一方任务：是。该规则会影响所有后续开发 A/B 和 AI 的开工、过程记录和收尾方式。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：新增分片目录说明；新增文档同步规则；AI 入口和双人协作规范明确“分步写分片，完整任务完成后再汇总主文档”；任务池、领取记录、当前状态、进展和完成记录同步。
- AI 初步方案：新增 T036；建立 `docs/tasks/items/` 和 `docs/tasks/claims/`；新增 `docs/workflow/doc-sync-policy.md`；修改 AGENTS/CLAUDE/协作规范中的任务后更新规则。
- 处理结论：已入任务池
- 对应任务编号：T036

### IDEA-20260522-06：麻将 Roguelike 局内能力池规划

- 提出人：Lee
- 提出时间：2026-05-22
- 背景：已确认手动吃碰杠、孤张处理、牌谱记牌器、无尽和高阶挑战，需要规划每过一关 3 选 1 的局内 Roguelike 能力池，尤其是孤张、补牌、换牌和杠流方向。
- 目标：在玩法文档中新增局内能力池，按孤张/补牌/换牌、杠流、吃流、碰流、花色流、槽位流、道具流、信息流分类，明确哪些能力能移除牌、生成/补牌、换牌、提示或改变收益。
- 不做：不做最终数值平衡，不实现能力代码，不生成 UI。
- 用户价值：让每一轮牌局形成不同构筑，解决孤张消化和杠流风险，同时增加长期复玩深度。
- 涉及模块：麻将 Roguelike 消除。
- 可能影响文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**`
- 是否影响另一方任务：否。本次只做玩法文档，不占用 `apps/**` 和 `packages/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：玩法文档新增局内能力池；包含分类、能力清单、强度边界和生成/移除牌限制；同步任务池、领取记录、状态、进展和完成记录。
- AI 初步方案：新增 T035；先规划 40 个局内能力，每类 5 个，并明确“直接移除/生成牌”只允许出现在稀有能力或有代价能力里。
- 处理结论：已入任务池
- 对应任务编号：T035

### IDEA-20260522-05：麻将 Roguelike 牌谱记牌器

- 提出人：Lee
- 提出时间：2026-05-22
- 背景：玩法讨论中提出需要在页面上方显示本局牌具剩余的花色和数量，并随消除实时减少，让玩家更有策略地选择 `吃 / 碰 / 杠` 和判断孤张是否还能消化。
- 目标：在玩法文档中新增 `牌谱记牌器 / 余牌系统`，明确顶部简版显示、展开详细点数、统计范围、与透视的区别、对孤张和杠流决策的价值，以及高阶词缀如何限制该系统。
- 不做：不实现 UI，不做最终视觉稿，不写数据结构代码。
- 用户价值：让玩家能基于剩余牌信息做计划，减少盲猜，提高麻将策略感。
- 涉及模块：麻将 Roguelike 消除。
- 可能影响文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**`
- 是否影响另一方任务：否。本次只做玩法文档，不占用 `apps/**` 和 `packages/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：玩法文档和决策文档明确牌谱记牌器；同步任务池、领取记录、状态、进展和完成记录。
- AI 初步方案：新增 T034；默认顶部显示 `万/条/筒` 总数，点击展开 1-9 点数数量；记牌器显示数量不显示位置，透视显示位置不显示全局数量；高阶词缀可限制记牌器精度。
- 处理结论：已入任务池
- 对应任务编号：T034

### IDEA-20260522-04：麻将 Roguelike 组合提示和牌堆生成规则

- 提出人：Lee
- 提出时间：2026-05-22
- 背景：讨论 Roguelike 牌局随机和吃碰杠冲突后，确认需要明确组合提示、组合选择、手动选牌挑战、碰掉杠后的孤张处理，以及牌堆不按完整麻将 60 张生成的规则。
- 目标：在玩法文档中明确：吃碰杠只要出现组合就提示并展示对应消除内容；多种组合可选择；玩家后续可以手动选择 3-4 张再出牌；杠包被碰后产生的孤张需要通过道具、奖励或规则消化；初始牌局使用受控随机组合包，不要求完整麻将牌组，可以同花色重复、低关只用一种花色。
- 不做：不实现组合选择 UI，不写牌堆生成算法，不做最终数值。
- 用户价值：减少规则歧义，保证随机牌局既有解又有策略冲突，并为后续挑战模式保留更高手动的操作空间。
- 涉及模块：麻将 Roguelike 消除。
- 可能影响文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**`
- 是否影响另一方任务：否。本次只做玩法文档，不占用 `apps/**` 和 `packages/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：玩法文档和决策文档明确组合提示/选择、手动选牌挑战、孤张处理和受控随机牌堆生成规则；同步任务池、领取记录、状态、进展和完成记录。
- AI 初步方案：新增 T033；将 `吃 / 碰 / 杠` 按钮改为“合法动作提示 + 组合选择入口”，并补充孤张消化机制：备用槽、弃牌符、换牌、杠后补牌、孤张转化和关卡结算豁免。
- 处理结论：已入任务池
- 对应任务编号：T033

### IDEA-20260522-03：麻将 Roguelike 高阶挑战系统规划

- 提出人：Lee
- 提出时间：2026-05-22
- 背景：已确认最终结构包含无尽牌山和高阶周目，需要具体定义后期挑战来源。用户认可限制扩槽能力、随机内容、增加堆叠层数、缩减卡槽和随机事件这些方向。
- 目标：在玩法文档中新增高阶挑战系统，明确 `牌山层数增长 + 词缀系统 + 随机事件 + 卡槽压缩 + Boss 试炼` 的组合，并给出第一批高阶词缀、随机事件和 Boss 试炼清单。
- 不做：不实现游戏代码，不做最终数值平衡，不接排行榜。
- 用户价值：让后期挑战不只是牌变多，而是通过规则变化、局外能力限制和事件选择形成长期耐玩性。
- 涉及模块：麻将 Roguelike 消除。
- 可能影响文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**`
- 是否影响另一方任务：否。本次只做玩法文档，不占用 `apps/**` 和 `packages/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：玩法文档新增高阶挑战系统；包含至少 12 个词缀、12 个随机事件、5 个 Boss 试炼；同步任务池、领取记录、状态、进展和完成记录。
- AI 初步方案：新增 T032；将无尽层和高阶周目的难度增长拆成牌山压力、能力压力和事件压力，避免单纯堆牌导致疲劳。
- 处理结论：已入任务池
- 对应任务编号：T032

### IDEA-20260522-02：麻将 Roguelike 最终模式结构定稿

- 提出人：Lee
- 提出时间：2026-05-22
- 背景：已认可轻策略消除、手动吃碰杠、槽位成长和 Roguelike 构筑方向，需要明确玩家通关 20 关之后还能做什么，形成长期挑战和成就感。
- 目标：将最终游戏结构定为 `闯关模式`、`无尽牌山`、`高阶周目`、`每日牌局`、`成就图鉴`，并写入麻将模块玩法文档和决策文档，作为后续关卡、奖励、UI 和数据结构设计基线。
- 不做：不实现模式代码，不设计最终数值，不接排行榜，不做账号系统。
- 用户价值：让游戏拥有首通目标、长期挑战、重复游玩、每日回访和成就收集，不会在 20 关通关后失去目标。
- 涉及模块：麻将 Roguelike 消除。
- 可能影响文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**`
- 是否影响另一方任务：否。本次只做玩法文档，不占用 `apps/**` 和 `packages/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：玩法文档明确最终结构；决策文档记录模式结构；任务池、领取记录、状态、进展和完成记录同步。
- AI 初步方案：新增 T031；将 20 关定义为首次完整通关，把 21 层后定义为无尽牌山；每通一次 20 关解锁更高周目；每日牌局使用固定牌山种子；成就图鉴绑定特殊打法和最高层数。
- 处理结论：已入任务池
- 对应任务编号：T031

### IDEA-20260522-01：麻将 Roguelike 手动组合和成长系统规划

- 提出人：Lee
- 提出时间：2026-05-22
- 背景：初版玩法讨论中确认消除不应自动触发，而应由玩家手动选择组合并点击 `吃 / 碰 / 杠` 按钮发动；按钮默认灰色，满足条件后变成金红色冒火状态。同时希望槽位具备可成长属性，通过货币升级降低难度，并重新规划奖励和道具。
- 目标：在麻将 Roguelike 模块中新增具体玩法规划，明确手动组合交互、按钮状态、槽位成长属性、货币来源和消耗、局内奖励、局外升级、道具体系和 MVP 取舍。
- 不做：不实现游戏代码，不新增资产，不调整现有 UI 图片，不进入数值最终平衡。
- 用户价值：让游戏从“自动消除”变成更有麻将手感和策略选择的玩法，并引入轻养成留存目标。
- 涉及模块：麻将 Roguelike 消除。
- 可能影响文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**`
- 是否影响另一方任务：否。本次只做玩法文档，不占用 `apps/**` 和 `packages/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：新增玩法规划文档；明确手动组合流程和按钮状态；重构奖励和道具体系；说明槽位成长和货币系统；同步任务池、领取记录、状态和进展。
- AI 初步方案：新增 T030，产出 `GAMEPLAY_PLAN.md`；将游戏拆成“局内手动消除 + Roguelike 奖励 + 局外槽位成长”三层，MVP 先做手动按钮、3 个道具、10 个局内奖励、5 个槽位属性升级。
- 处理结论：已入任务池
- 对应任务编号：T030

### IDEA-20260521-07：麻将 Roguelike 消除框架调研和规划

- 提出人：Lee
- 提出时间：2026-05-21
- 背景：准备讨论“麻将小游戏（羊了个羊）”的游戏细节前，需要先确认整体框架做法，包含 Cocos 正式发布、GDevelop Web 原型、站内嵌入、配置化关卡和奖励、共享规则模型等边界。
- 目标：基于官方文档调研 Cocos Creator、GDevelop、Next.js 静态资源嵌入和 iframe 通信方式，并在 `docs/modules/mahjong-roguelike/` 下补齐模块文档和框架规划文档，作为后续讨论玩法细节的基线。
- 不做：不实现游戏代码，不创建 Cocos 或 GDevelop 工程，不修改 Web 页面，不改共享包代码，不新增依赖。
- 用户价值：在讨论玩法前先明确技术路线、目录边界、配置格式和阶段计划，避免后续原型和正式工程割裂。
- 涉及模块：麻将 Roguelike 消除、游戏发布基础、GDevelop Web 原型通道、游戏站嵌入。
- 可能影响文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/**`
- 是否影响另一方任务：否。本次只做文档规划，不占用 `apps/**` 和 `packages/**`。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：任务池新增规划任务；麻将模块文档目录补齐必备文件；框架规划文档说明 Cocos/GDevelop/站内嵌入/配置化/实施阶段/待讨论问题；文档自审通过；文件保持 UTF-8 无 BOM。
- AI 初步方案：新增 T029，限定为文档调研任务；推荐“共享规则与配置优先，GDevelop 做 Web 原型，Cocos 做正式小游戏工程，Next.js 只做 iframe 入口和消息接收”的路线。
- 处理结论：已入任务池
- 对应任务编号：T029

### IDEA-20260521-04：补充文档输出格式规则到 AGENTS.md

- 提出人：Lee
- 提出时间：2026-05-21
- 背景：需要把“不同文档类型选择 Markdown 或 HTML”的规则写入 AI 底层入口，避免后续 AI 默认把所有输出都做成 Markdown。
- 目标：在根目录 `AGENTS.md` 中新增文档输出格式规则，明确长期维护和人工编辑类文档使用 Markdown，AI 生成的方案、调研、汇报、交互或一次性阅读材料优先使用 HTML。
- 不做：不修改应用代码，不调整 `CLAUDE.md`，不改已有业务文档结构。
- 用户价值：让后续 AI 输出更符合使用场景，兼顾 Git diff、人工维护、信息密度和展示体验。
- 涉及模块：AI 协作入口、文档规范。
- 可能影响文件：`AGENTS.md`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/**`
- 是否影响另一方任务：否。仅补充协作规则，不占用应用代码范围。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：`AGENTS.md` 已新增文档输出格式规则；任务池和领取记录已同步；文档通过自审；文件保持 UTF-8 无 BOM。
- AI 初步方案：新增 T027，限定为文档任务；在 `AGENTS.md` 增加“文档输出格式”章节，用一句快速决策规则总结 Markdown 与 HTML 的边界。
- 处理结论：已入任务池
- 对应任务编号：T027

### IDEA-20260521-02：PDF 工具箱模块重新规划

- 提出人：Lee
- 提出时间：2026-05-21
- 背景：准备进入 PDF 小工具开发，现有 T015 只给出高层功能清单，缺少模块文档、分阶段实施顺序、浏览器内处理边界和可验收的子任务。
- 目标：领取 T015，并将 PDF 工具箱 MVP 重新拆成可执行模块计划；补充 `docs/modules/pdf-toolbox/` 独立模块文档，明确免费范围、暂不做事项、技术路线、文件范围、验证方式和阶段交付。
- 不做：本次不实现 PDF 业务代码，不新增依赖，不修改前端页面逻辑，不处理 AI/OCR 能力。
- 用户价值：让 PDF 工具箱后续开发可以按明确边界推进，避免一次性实现 12 项功能导致范围失控。
- 涉及模块：PDF 工具箱、工具站入口、协作文档。
- 可能影响文件：`docs/modules/pdf-toolbox/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`
- 是否影响另一方任务：否。PDF 工具箱属于开发 A 默认范围；仅在后续需要 AI/OCR 能力时再与开发 B 协调。
- 是否需要新增任务：否，合并到已有 T015。
- 建议优先级：P1
- 验收标准：T015 已领取；任务池依赖和验证方式与当前项目状态一致；PDF 模块文档完整；实施计划能指导后续编码；本次不产生业务代码改动。
- AI 初步方案：将 T015 分为规划、核心 PDF 处理、页面工具台、扩展转换、入口联动和验收收尾几个阶段；第一轮优先实现上传、预览、页面选择、排序、旋转、删除、拆分、合并和下载，水印、签名、图片互转、压缩、PDF 转 Word Beta 分阶段补齐。
- 处理结论：合并到已有任务
- 对应任务编号：T015

### IDEA-20260521-03：每个工具和游戏独立模块归档

- 提出人：Lee
- 提出时间：2026-05-21
- 背景：后续工具和游戏数量会变多，如果继续把需求、计划、过程、决策和代码分散记录，后续筛选、交接、复盘和扩展都会变困难。
- 目标：建立统一模块归档规则：每一个小工具或游戏都必须有独立文档文件夹记录全过程，并且代码实现也必须放在独立模块目录内，路由层只做入口。
- 不做：本次不实现具体 PDF 功能，不迁移已有业务代码，不改数据库和游戏工程。
- 用户价值：未来工具/游戏数量扩大后，可以按模块快速查看目标、需求、实施计划、进展、决策、验收和代码入口，便于管理和筛选。
- 涉及模块：协作文档、模块文档目录、PDF 工具箱规划。
- 可能影响文件：`docs/modules/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`
- 是否影响另一方任务：是。后续开发 A/B 的所有工具和游戏任务都需要按此结构创建文档和代码模块。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：任务池新增规范任务；`docs/modules/README.md` 明确独立文档文件夹规则和代码模块规则；PDF 工具箱文档迁移到 `docs/modules/pdf-toolbox/`；T015 文件范围改为新的模块文档和代码目录。
- AI 初步方案：新增 T026；建立文档目录规范 `docs/modules/<module-slug>/`，至少包含 `README.md`、`IMPLEMENTATION_PLAN.md`、`PROGRESS.md`、`DECISIONS.md`、`HANDOFF.md`；Web 工具代码统一放 `apps/web/src/modules/tools/<module-slug>/`，Web 游戏接入放 `apps/web/src/modules/games/<module-slug>/`，正式游戏工程放 `apps/game/<module-slug>/`。
- 处理结论：已入任务池
- 对应任务编号：T026

### IDEA-20260521-05：将独立模块归档规则上升到整体架构

- 提出人：Lee
- 提出时间：2026-05-21
- 背景：T026 已在模块目录中建立“每个工具/游戏独立文件夹和独立代码模块”的规则，但入口文件和整体架构文档还没有完整同步，其他开发者或 AI 可能仍按旧路径执行。
- 目标：将独立模块归档规则写入项目入口、整体架构、实施计划和协作规范，让所有后续参与者都必须遵循。
- 不做：不实现业务代码，不调整现有页面，不迁移非 PDF 模块代码。
- 用户价值：避免规则只存在局部文档里，确保新人、朋友和其他 AI 从入口文档开始就知道每个工具/游戏必须独立归档和独立编码。
- 涉及模块：整体架构、协作入口、模块规范。
- 可能影响文件：`AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/PROJECT_CONTEXT.md`, `docs/superpowers/specs/**`, `docs/plans/**`, `docs/workflow/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`
- 是否影响另一方任务：是。该规则约束所有后续开发 A/B 的工具、游戏和垂直模块实现。
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：入口文件、项目上下文、设计稿、实施计划、协作规范都明确模块文档目录和代码模块目录规则；旧 `docs/modules/*.md` 读法不再作为主路径；任务池有完成记录。
- AI 初步方案：新增 T028；把 T026 规则同步到 AGENTS/CLAUDE/README/PROJECT_CONTEXT/设计稿/实施计划/协作规范，并修正旧模块文档路径。
- 处理结论：已入任务池
- 对应任务编号：T028

### IDEA-20260521-06：PDF 区域遮盖和拍照图片扫描成 PDF

- 提出人：Lee
- 提出时间：2026-05-21
- 背景：PDF 工具箱继续补充用户高频能力：处理自己 PDF 中不需要的水印、遮挡或局部内容，以及把拍照/扫描图片合成为 PDF 输出。
- 目标：在 T015 中新增区域遮盖式 PDF 去水印/遮挡处理和图片扫描成 PDF 输出。去水印文案必须限定为处理自己文件中的遮挡、水印或不需要的局部元素。
- 不做：不破解 PDF 权限，不移除他人版权标识，不做 AI 智能去水印，不还原被覆盖内容，不做 OCR 识别文字。
- 用户价值：用户可以快速处理自有 PDF 的局部遮挡，并把手机拍照、扫描图片整理成一个 PDF。
- 涉及模块：PDF 工具箱。
- 可能影响文件：`apps/web/src/modules/tools/pdf-toolbox/**`, `apps/web/src/app/globals.css`, `docs/modules/pdf-toolbox/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`
- 是否影响另一方任务：否。AI 智能去水印和 OCR 后续如需模型能力再与开发 B 协调。
- 是否需要新增任务：否，合并到 T015。
- 建议优先级：P1
- 验收标准：上传 PDF 后可对当前页面统一添加白色遮盖区域并下载；上传图片后可按页面合成为 PDF；文案无侵权导向；测试、类型检查、构建通过；桌面和移动端无横向溢出。
- AI 初步方案：用 `pdf-lib` 在每页右上角或自定义区域绘制白色矩形覆盖层，作为免费手动遮盖；用 `pdf-lib` 嵌入 PNG/JPG 图片并按 A4 页面比例生成 PDF。
- 处理结论：合并到已有任务
- 对应任务编号：T015

### IDEA-20260521-01：工具站和游戏站改为相互独立

- 提出人：Lee
- 提出时间：2026-05-21
- 背景：2026-05-20 提出网站不应继续表现为单一“工具游戏门户”，而应该拆成独立工具站和独立游戏站；两边只保留一个可以互相跳转的路口，并且 UI 需要明显区分。
- 目标：首页改为两个独立站点入口；工具站专注效率、文档、图片和 AI 工具；游戏站专注轻量游戏、关卡、停留和回访；两边保留明确但克制的互跳入口。
- 不做：不实现具体 PDF 处理、AI 修图处理、真实游戏逻辑、后台、数据库查询或多应用部署拆分。
- 用户价值：让工具用户和游戏用户进入后获得更聚焦的体验，降低“工具”和“游戏”混在一起造成的定位模糊。
- 涉及模块：Web 首页、工具频道、游戏频道、全局导航、全局样式、协作文档。
- 可能影响文件：`apps/web/src/app/**`, `apps/web/src/components/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/**`
- 是否影响另一方任务：是，影响共享前端信息架构和后续开发 A/B 进入各自模块的页面基准。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：首页只作为工具站和游戏站的分流入口；`/tools` 和 `/games` 页面有独立叙事、导航和视觉气质；两边仅保留一个互跳路口；桌面端和移动端无明显溢出；lint/typecheck/build 通过。
- AI 初步方案：新增 T025；复用现有 Next.js 单应用和静态数据，调整首页、频道页参数和 CSS 主题，工具站使用更克制的效率型 UI，游戏站使用更有沉浸感和玩法感的 UI。
- 处理结论：已入任务池
- 对应任务编号：T025

### IDEA-20260520-03：按 `docs/网站UI.zip` 适配前端视觉

- 提出人：Lee
- 提出时间：2026-05-20
- 背景：用户提供 `docs/网站UI.zip`，要求当前前端 UI 做成该设计包的样式；同时发现最新文档曾被覆盖，任务状态与仓库实际文件不一致。
- 目标：识别 UI 包中的静态设计导出，将首页、工具频道、游戏频道迁移到导出稿的视觉系统和交互结构，并同步修正基础任务状态。
- 不做：不实现具体 PDF 处理、AI 修图处理、真实 AI 搜索、真实游戏运行和后台数据管理。
- 用户价值：让当前站点第一眼接近目标设计，后续模块开发有统一视觉基准。
- 涉及模块：Web 首页、工具频道、游戏频道、全局导航、全局样式、协作文档。
- 可能影响文件：`apps/web/src/app/**`, `apps/web/src/components/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**`
- 是否影响另一方任务：是，影响共享页面和后续开发 A/B 都会复用的门户视觉基准。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：首页、工具页、游戏页使用 `docs/网站UI.zip` 的视觉 token、导航、搜索、卡片、筛选和弹窗结构；桌面端和移动端无明显溢出；lint/typecheck/build 通过；文档状态修正。
- AI 初步方案：读取 `DESIGN-HANDOFF.md`、`DESIGN-MANIFEST.json`、`index.html`、`tools.html`、`games.html` 和 `styles.css`，提取 token 后迁入 Next.js；新增 `/tools` 和 `/games` 路由；用客户端组件承载搜索下拉、筛选、抽屉和弹窗。
- 处理结论：已入任务池
- 对应任务编号：T022

### IDEA-20260520-04：数据库先使用 Supabase 托管 PostgreSQL

- 提出人：Lee
- 提出时间：2026-05-20
- 背景：当前阶段需要尽快上线数据库层，但后期希望可以平迁到自有服务器，不想一开始深度绑定云厂商专有能力。
- 目标：第一阶段优先使用 Supabase 托管 PostgreSQL 作为数据库底座，业务代码保持 Prisma + 标准 PostgreSQL 兼容，后续可迁移到自有 PostgreSQL。
- 不做：不把 Supabase Auth、Storage、RLS、Edge Functions 作为第一阶段必选依赖。
- 用户价值：降低初期运维成本，同时保留后续自建迁移空间。
- 涉及模块：数据库、Prisma、环境变量、部署文档。
- 可能影响文件：`docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/decisions/**`, `docs/plans/**`, `apps/web/prisma/**`, `apps/web/src/lib/db.ts`, `.env.example`, `docker-compose.yml`
- 是否影响另一方任务：否
- 是否需要新增任务：否
- 建议优先级：P1
- 验收标准：T004 的数据库方案明确写为 Supabase PostgreSQL；Prisma schema 不依赖 Supabase 专有扩展；迁移到自有 PostgreSQL 时只需更换连接配置和执行迁移。
- AI 初步方案：把 Supabase 当托管 PostgreSQL 使用，业务层只接 Prisma 和标准 SQL；如需本地开发，继续保留可替换的本地数据库配置说明。
- 处理结论：已确认
- 对应任务编号：T004

### IDEA-20260520-05：补充 Supabase 数据库交接文档

- 提出人：Lee
- 提出时间：2026-05-20
- 背景：朋友需要接手并修改数据库内容，需要一份明确写出项目连接方式、环境变量和使用步骤的文档。
- 目标：新增数据库交接文档，说明 Supabase 项目、连接参数、Prisma 使用方式和本地修改流程，方便朋友直接接手。
- 不做：不修改业务逻辑，不新增数据库表，不调整前端页面。
- 用户价值：朋友可以按文档直接连接数据库并继续维护内容。
- 涉及模块：文档、数据库交接、团队协作。
- 可能影响文件：`docs/handoffs/**`, `docs/decisions/**`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/**`, `docs/progress/2026-05-20.md`, `docs/completion/**`
- 是否影响另一方任务：否
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：仓库内存在可交接的数据库说明文档，包含项目标识、连接串格式、环境变量名、Prisma 使用方式和注意事项；文档不泄露多余内容。
- AI 初步方案：新增一份 Supabase 数据库交接手册，补充 `DATABASE_URL`、`DIRECT_DATABASE_URL`、`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY` 的含义与来源，并说明朋友如何在自己的环境中修改内容。
- 处理结论：已入任务池
- 对应任务编号：T023

### IDEA-20260520-02：首页门户视觉与信息架构优化

- 提出人：Lee
- 提出时间：2026-05-20
- 背景：当前首页已可访问，但首屏和信息架构仍偏骨架，门户感不够强。
- 目标：优化首页首屏、频道入口和分类展示，让页面更像可直接使用的工具游戏门户。
- 不做：不扩展到后台、数据库或具体工具详情页。
- 用户价值：提升第一眼的产品感和可点击性，方便后续继续接入内容。
- 涉及模块：Web 首页、基础样式。
- 可能影响文件：`apps/web/src/app/page.tsx`, `apps/web/src/app/globals.css`, `apps/web/src/components/AppHeader.tsx`, `apps/web/src/components/AppFooter.tsx`
- 是否影响另一方任务：否
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：首页更完整，具备明确首屏、分类入口和内容卡片，不影响构建与类型检查。
- AI 初步方案：增加更有层次的首屏、搜索栏占位、频道卡片和分类区块，保留简洁风格。
- 处理结论：待评估
- 对应任务编号：T019

## 5. 已处理想法

### IDEA-20260526-01：AI 修图工具 MVP 和装饰贴纸增强

- 提出人：Lee
- 提出时间：2026-05-26
- 背景：第一阶段需要 AI 修图工具具备可用的本地基础编辑能力，并按用户反馈补齐贴纸选择、装饰贴纸集合、贴纸尺寸、白底气泡贴纸和批次分组体验。
- 目标：实现 `/tools/ai-photo-editor` 工作台，支持图片上传、基础调整、裁剪旋转、滤镜、文字、贴纸、边框、撤销重做、PNG 导出和装饰贴纸集合。
- 不做：不调用真实 AI 模型，不做用户体系、付费、后台素材管理、批处理或云端存储。
- 用户价值：用户可以在浏览器内完成常见图片装饰和导出，并获得更丰富、更易查找的贴纸素材。
- 涉及模块：AI 修图工具、门户入口、贴纸素材、导出合成链路。
- 可能影响文件：`apps/web/src/app/tools/ai-photo-editor/**`, `apps/web/src/components/tools/photo/**`, `apps/web/src/lib/tools/photo/**`, `apps/web/public/stickers/**`, `apps/web/src/components/AppHeader.tsx`, `apps/web/src/components/PortalCard.tsx`, `apps/web/src/components/portal-data.ts`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/**`, `docs/completion/**`
- 是否影响另一方任务：可能与工具入口和 PDF 工具箱入口同处门户卡片文件，合并时需保留双方入口。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：AI 修图工作台可访问；基础编辑、边框、文字、贴纸、撤销重做和导出可用；新增贴纸资源可访问；类型检查、lint 和 Next build 通过。
- AI 初步方案：将 AI 修图相关增量统一归档为 `T045`，避免与远端已占用的麻将任务编号冲突，并使用任务分片同步主文档。
- 处理结论：已入任务池
- 对应任务编号：T045

### IDEA-20260520-02：AI 内容转换工具箱

- 提出人：Lee
- 提出时间：2026-05-20
- 背景：调研 `qiaomu-anything-to-notebooklm` skill 后，发现“多源输入 -> 成品输出”的工具形态很适合工具站后续扩展。
- 目标：规划一个独立的 AI 内容转换工具箱，支持把文章、PDF、视频、音频、文档转换成 NotebookLM 知识包、播客脚本、PPT 大纲和思维导图等成品。
- 不做：不做付费墙穿透，不做侵权导向抓取，不把它塞进现有 PDF / 修图 / 游戏任务里。
- 用户价值：把零散资料直接变成可复用成品，适合学生、办公和内容创作者。
- 涉及模块：未来 AI 工具、内容整理、知识加工。
- 可能影响文件：`docs/PROJECT_CONTEXT.md`, `docs/plans/**`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/**`, `docs/decisions/**`, `docs/progress/2026-05-20.md`, 后续可能影响 `apps/web/**`
- 是否影响另一方任务：否
- 是否需要新增任务：是
- 建议优先级：P2
- 验收标准：规划中明确 skill 来源、输入输出边界、起步顺序和不做事项。
- AI 初步方案：先把它作为后续候选方向写入项目规划，再拆成独立任务池条目，第一版优先做 NotebookLM 知识包、播客脚本和 PPT 大纲三种输出。
- 处理结论：已入任务池
- 对应任务编号：T021

### IDEA-20260520-01：引入 GDevelop 优化 Web 小游戏原型通道

- 提出人：Lee
- 提出时间：2026-05-20
- 背景：用户关注开源项目 `4ian/GDevelop` 是否可以优化当前游戏模块。调研结论是：GDevelop 适合 Web H5 原型和轻量小游戏快速生产，但不应替代 Cocos Creator 的微信/抖音小游戏正式发布位置。
- 目标：把 GDevelop 定位写入项目规划，并新增后续可领取任务，用于接入 GDevelop Web 游戏原型通道。
- 不做：不替换 Cocos Creator，不直接导入 GDevelop 工程，不实现麻将游戏代码，不承诺 GDevelop 支持微信/抖音小游戏发布。
- 用户价值：降低 Web 小游戏试错成本，让非开发成员更容易参与玩法和关卡验证，同时保留 Cocos 的小程序发布能力。
- 涉及模块：游戏频道、游戏发布、麻将 Roguelike 消除、Web 游戏嵌入。
- 可能影响文件：`docs/PROJECT_CONTEXT.md`, `docs/plans/**`, `docs/superpowers/specs/**`, `docs/decisions/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**`, 后续可能影响 `apps/game/**`, `apps/web/src/components/game/**`, `packages/shared/**`
- 是否影响另一方任务：是，影响开发 B 的 `T011` 和 `T017` 游戏相关任务规划。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：当前规划明确“Cocos 正式小程序主线 + GDevelop Web H5 原型通道”；任务池新增后续接入任务；不产生游戏代码改动。
- AI 初步方案：先完成 `T019` 文档定位决策，再由开发 B 后续领取 `T020` 接入 GDevelop Web 原型通道。
- 处理结论：已入任务池
- 对应任务编号：T019, T020

### IDEA-20260519-01：建立 Git 忽略规则和协作入口

- 提出人：Lee
- 提出时间：2026-05-19
- 背景：GitHub 仓库已创建，需要避免上传依赖、构建产物、本地环境和编辑器状态文件，并方便朋友加入协作。
- 目标：新增 `.gitignore`，补充 README 协作入口，并在任务池记录本次仓库基础协作任务。
- 不做：不搭建 Monorepo，不安装依赖，不提交或推送远端。
- 用户价值：降低仓库污染和协作冲突，让另一位开发者 clone 后能快速找到任务池和领取规则。
- 涉及模块：仓库基础、双人协作。
- 可能影响文件：`.gitignore`, `README.md`, `.claude/settings.local.json`, `.obsidian/workspace.json`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-19.md`, `docs/completion/**`
- 是否影响另一方任务：否
- 是否需要新增任务：是
- 建议优先级：P0
- 验收标准：`.gitignore` 存在且覆盖 Node/Next/Cocos/环境变量/构建产物/本地编辑器状态；已跟踪的本地状态文件从 Git 索引移除；README 有协作入口；状态文档已同步。
- AI 初步方案：作为 `T018` 独立任务处理，文件范围限定在仓库忽略规则、本地状态文件取消跟踪和协作文档。
- 处理结论：已入任务池
- 对应任务编号：T018

### IDEA-20260530-01：胡了卜数百张小牌密集牌山原型

- 提出人：Lee
- 提出时间：2026-05-30
- 背景：当前配置试玩页的密集牌山牌量仍偏少，用户希望参考“羊了个羊”式高密度堆叠体验，让牌数达到几百张打底，并缩小牌面以便页面容纳更多牌。
- 目标：调整 `config-playable` HTML 原型的密集牌山默认牌量、调参范围、牌面尺寸和布局坐标，让默认调牌器进入约 240 张牌的小牌压力版，并保留 URL 参数继续压测。
- 不做：不复制外部游戏源码，不改 Cocos 正式工程，不改 Web 站内入口，不调整正式关卡 JSON，不新增完整可解路径搜索。
- 用户价值：调牌时可以直接评估接近数百张堆叠牌山的真实视觉压力、读牌难度和页面承载能力。
- 涉及模块：胡了卜、配置试玩原型、密集牌山调参。
- 可能影响文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `docs/tasks/**`, `docs/modules/mahjong-roguelike/**`, `docs/progress/**`, `docs/completion/**`
- 是否影响另一方任务：否；本次限定在 Lee 负责的胡了卜原型和文档范围，不碰 Jaspon 负责的 AI 修图模块。
- 是否需要新增任务：是
- 建议优先级：P1
- 验收标准：默认密集牌山目标牌量达到约 240 张；调参范围支持 120-420 张；牌面规则尺寸和 CSS 视觉尺寸变小；测试覆盖这些边界；静态脚本检查和 docs 同步通过。
- AI 初步方案：新增 `T086`，先用静态回归测试锁定默认牌量、调参上下限、牌面规则尺寸和 CSS 小牌比例，再修改 HTML 原型生成器常量和布局。
- 处理结论：已入任务池
- 对应任务编号：T086
- 验收补充：2026-06-01 Lee 在 T092 验收中继续明确密集牌山起手 3-8 张即可，不要过多；低于 8% 的轻微遮挡仍应可点，达到 8% 才阻塞；牌可以稍大，且大多数牌应继续集中在主牌山堆里。该补充已并入 T092 的 `config-playable` 原型验收调参，不新开任务。

## 6. AI 处理新想法时必须输出

当用户对 AI 说“我有个新想法”“帮我规划这个功能”“顺便实现一下”时，AI 必须先输出：

```md
我会先把这个想法登记为变更卡，评估是否影响现有任务和文件范围，再写入任务池。没有任务编号和领取记录前，不会开始实现。
```

然后更新：

1. `docs/tasks/CHANGE_INTAKE.md`
2. `docs/tasks/TASK_BOARD.md`
3. 必要时更新 `docs/tasks/CLAIMS.md`
4. 必要时更新 `docs/status/CURRENT_STATUS.md`
