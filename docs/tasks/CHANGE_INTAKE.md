# 新想法与需求变更入口

**最后更新**：2026-06-03
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
