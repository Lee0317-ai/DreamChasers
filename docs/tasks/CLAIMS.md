# 任务领取与冲突登记

**最后更新**：2026-05-23
**用途**：记录谁正在做什么，锁定文件范围，避免两个人和各自 AI 冲突。

## 1. 领取规则

领取任务前必须：

1. 读取 `docs/tasks/TASK_BOARD.md`。
2. 读取 `docs/tasks/CHANGE_INTAKE.md`。
3. 确认任务状态是 `待领取` 或负责人同意接手。
4. 在 `docs/tasks/claims/` 新增领取分片。
5. 如涉及共享文件、冲突、交接、负责人变化或完整任务完成，再同步本文档和 `docs/status/CURRENT_STATUS.md`。
6. 只修改领取记录中的文件范围。

如果这是一个新想法或需求变更，必须先在 `docs/tasks/CHANGE_INTAKE.md` 登记并进入 `docs/tasks/TASK_BOARD.md`，不要直接领取临时口头任务。

后续分步操作不要反复修改本文档；完整任务完成后再把状态、备注和交接信息汇总回来。详细规则见 `docs/workflow/doc-sync-policy.md`。

## 2. 当前领取

### T044：麻将 Roguelike 最小可玩验证原型

- 领取人：Codex / 开发 B
- 领取时间：2026-05-23
- 状态：已完成
- 预计完成：2026-05-23
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/2026-05-23-task-44-mahjong-playable-validation-prototype.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `package.json`, `package-lock.json`, `deploy/**`
- 依赖任务：T043
- 验证命令：`npm run docs:sync`; 浏览器桌面端检查；浏览器移动端检查；UTF-8 无 BOM 检查；`git diff --check`
- 当前风险：HTML 原型只能验证交互和规则感觉，不能替代正式 Cocos 性能、发布链路和最终美术验证。
- 备注：已完成单文件 HTML 原型和桌面/移动端浏览器检查，避免提前进入正式工程范围。

### T043：麻将 Roguelike 最小可玩闭环和 MVP 开发拆分计划

- 领取人：Codex / 开发 B
- 领取时间：2026-05-23
- 状态：已完成
- 预计完成：2026-05-23
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/2026-05-23-task-43-mahjong-mvp-build-plan.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `package.json`, `package-lock.json`, `apps/web/**`, `deploy/**`
- 依赖任务：T042
- 验证命令：`npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查；`git diff --check`
- 当前风险：如果团队跳过验证闭环直接进入正式 MVP，容易把长期模式、完整数值和发布工程同时压到第一版，导致开发周期失控。
- 备注：已完成后续构建计划，明确先做最小可玩闭环，再按验证结果拆正式 MVP。

### T042：麻将 Roguelike MVP 玩法验证计划

- 领取人：Codex / 开发 B
- 领取时间：2026-05-23
- 状态：已完成
- 预计完成：2026-05-23
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/2026-05-23-task-42-mahjong-mvp-validation-plan.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：T041
- 验证命令：`npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查
- 当前风险：验证计划如果写得过于完整，会被误读为第一版全部实现范围，因此后续开发计划必须继续区分“验证闭环”“MVP 冻结内容”和“长期后置内容”。
- 备注：已完成玩法验证目标、最小闭环、观察指标和 MVP 冻结口径整理。

### T041：麻将 Roguelike 团队评审版玩法方案

- 领取人：Codex / 开发 B
- 领取时间：2026-05-22
- 状态：已完成
- 预计完成：2026-05-22
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-41-mahjong-gameplay-review-docs.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：T030, T031, T032, T033, T034, T035, T038, T040
- 验证命令：`npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查
- 当前风险：评审后需要继续收敛 MVP 范围，避免团队直接把完整长期规划当作第一版开发范围。
- 备注：已完成 Markdown 玩法方案和 HTML 可视化评审稿。

### T040：麻将 Roguelike 完整牌局规则、经济体力和失败救场规划

- 领取人：Codex / 开发 B
- 领取时间：2026-05-22
- 状态：已完成
- 预计完成：2026-05-22
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-40-mahjong-complete-round-rules.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：T030, T033, T034, T035, T038
- 验证命令：`npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查
- 当前风险：双层经济和失败前救场后续必须在同一个规则模型中实现，避免 UI、能力、道具各自判定导致状态冲突。
- 备注：已完成完整牌局状态机、局内积分/铜钱分层、体力、孤张内部判定和满槽救场顺序规划。

### T038：麻将 Roguelike 永久固化能力和卡槽系统规划

- 领取人：Codex / 开发 B
- 领取时间：2026-05-22
- 状态：已完成
- 预计完成：2026-05-22
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-38-mahjong-permanent-abilities.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：T030, T032, T035
- 验证命令：文档自审；UTF-8 无 BOM 检查
- 当前风险：后续实现能力配置时，需要继续保持 `手牌槽位`、`能力卡槽`、`局内奖励` 和 `道具` 的字段边界。
- 备注：已完成永久能力分层、基础成长、固化能力、起局能力和道具强化的最终结构。

### T037：新增 docs:sync 自动汇总脚本

- 领取人：Codex / 两人协作
- 领取时间：2026-05-22
- 状态：已完成
- 预计完成：2026-05-22
- 允许修改文件：`package.json`, `scripts/docs-sync.mjs`, `docs/workflow/doc-sync-policy.md`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-37-docs-sync-script.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package-lock.json`
- 依赖任务：T036
- 验证命令：`npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查
- 当前风险：自动摘要区必须使用固定标记，避免脚本误改历史手写内容。
- 备注：已新增 `npm run docs:sync`，从任务分片和领取分片生成主文档摘要区。

### T036：降低多人协作文档冲突的分片同步规范

- 领取人：Codex / 两人协作
- 领取时间：2026-05-22
- 状态：已完成
- 预计完成：2026-05-22
- 允许修改文件：`AGENTS.md`, `CLAUDE.md`, `docs/PROJECT_CONTEXT.md`, `docs/workflow/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-36-doc-sync-policy.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：无
- 验证命令：文档自审；UTF-8 无 BOM 检查
- 当前风险：如果后续仍把主文档当作每一步的写入入口，冲突会继续出现；需要 AI 入口文件明确新规则。
- 备注：已建立分片同步规则，后续完整任务完成时再由 AI 汇总主文档。

### T035：麻将 Roguelike 局内能力池规划

- 领取人：Codex / 开发 B
- 领取时间：2026-05-22
- 状态：已完成
- 预计完成：2026-05-22
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-35-mahjong-run-abilities.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：T034
- 验证命令：文档自审；UTF-8 无 BOM 检查
- 当前风险：能力池如果过早允许大量生成牌和移除牌，会破坏关卡可解性和槽位压力，需要明确强度边界。
- 备注：已规划局内 Roguelike 能力池，重点覆盖孤张处理、补牌、换牌、杠流、吃碰花色、槽位、道具和信息流派。

### T034：麻将 Roguelike 牌谱记牌器规划

- 领取人：Codex / 开发 B
- 领取时间：2026-05-22
- 状态：已完成
- 预计完成：2026-05-22
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-34-mahjong-tile-counter.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：T033
- 验证命令：文档自审；UTF-8 无 BOM 检查
- 当前风险：记牌器信息过强可能降低透视价值，需要通过高阶词缀和 UI 层级控制信息密度。
- 备注：已确认顶部新增 `余牌/牌谱记牌器`，默认显示花色总数，展开显示点数数量，并随消除实时减少。

### T033：麻将 Roguelike 组合提示和牌堆生成规则

- 领取人：Codex / 开发 B
- 领取时间：2026-05-22
- 状态：已完成
- 预计完成：2026-05-22
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-33-mahjong-combo-generation-rules.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：T032
- 验证命令：文档自审；UTF-8 无 BOM 检查
- 当前风险：组合选择和手动选牌挑战会提高操作复杂度，需要后续 UI 清晰区分基础模式和挑战模式。
- 备注：已确认牌堆不要求完整麻将牌组，采用组合包受控随机生成；吃碰杠出现合法组合就提示，可选择组合，后续支持玩家手动选 3-4 张发动。

### T032：麻将 Roguelike 高阶挑战系统规划

- 领取人：Codex / 开发 B
- 领取时间：2026-05-22
- 状态：已完成
- 预计完成：2026-05-22
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-32-mahjong-advanced-challenges.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：T031
- 验证命令：文档自审；UTF-8 无 BOM 检查
- 当前风险：词缀、事件和卡槽限制过多会提高理解成本，后续实现需要分批解锁和清晰提示。
- 备注：已确认高阶挑战由牌山层数增长、词缀系统、随机事件、卡槽压缩和 Boss 试炼共同组成。

### T031：麻将 Roguelike 最终模式结构定稿

- 领取人：Codex / 开发 B
- 领取时间：2026-05-22
- 状态：已完成
- 预计完成：2026-05-22
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-31-mahjong-endgame-structure.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：T030
- 验证命令：文档自审；UTF-8 无 BOM 检查
- 当前风险：最终结构较完整，后续实现时仍需按优先级拆分，不要一次性进入所有模式开发。
- 备注：已确认最终结构采用 `闯关模式`、`无尽牌山`、`高阶周目`、`每日牌局`、`成就图鉴`。

### T030：麻将 Roguelike 手动组合和成长系统规划

- 领取人：Codex / 开发 B
- 领取时间：2026-05-22
- 状态：已完成
- 预计完成：2026-05-22
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-30-mahjong-gameplay-plan.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：T029
- 验证命令：文档自审；UTF-8 无 BOM 检查
- 当前风险：局外成长会降低难度，需要后续数值控制，避免早期升级后游戏过快失去挑战。
- 备注：已确认消除改为手动选择组合并点击 `吃 / 碰 / 杠` 按钮触发，按钮满足条件后从灰色切换到金红冒火状态。

### T029：麻将 Roguelike 消除框架调研和规划

- 领取人：Codex / 开发 B
- 领取时间：2026-05-21
- 状态：已完成
- 预计完成：2026-05-21
- 允许修改文件：`docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/2026-05-21-task-29-mahjong-framework-planning.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：T019, T026, T028
- 验证命令：文档自审；UTF-8 无 BOM 检查
- 当前风险：后续玩法细节尚未定稿，规划文档只作为讨论基线，不直接锁死数值和关卡节奏。
- 备注：已基于官方文档补齐麻将模块文档目录，并形成 Cocos 正式工程、GDevelop Web 原型、Next.js 站内嵌入和共享配置优先的框架方案。

### T028：将独立模块归档规则写入整体架构

- 领取人：Codex / 两人协作
- 领取时间：2026-05-21
- 状态：已完成
- 预计完成：2026-05-21
- 允许修改文件：`AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/PROJECT_CONTEXT.md`, `docs/superpowers/specs/**`, `docs/plans/**`, `docs/workflow/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/**`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：T026
- 验证命令：文档自审；旧路径扫描；UTF-8 无 BOM 检查
- 当前风险：如果入口文件不写清规则，其他开发者或 AI 可能绕过模块目录规范。
- 备注：已将每个工具/游戏独立文档文件夹和独立代码模块规则同步到项目入口和整体架构文档。

### T027：补充 AGENTS.md 文档输出格式规则

- 领取人：Codex / 开发 A
- 领取时间：2026-05-21
- 状态：已完成
- 预计完成：2026-05-21
- 允许修改文件：`AGENTS.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/2026-05-21-task-27-agents-doc-output-format.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：无
- 验证命令：文档自审；UTF-8 无 BOM 检查
- 当前风险：无。
- 备注：仅补充 AI 入口文档规范，不修改应用代码。

### T026：建立工具/游戏独立模块归档规范

- 领取人：Codex / 两人协作
- 领取时间：2026-05-21
- 状态：已完成
- 预计完成：2026-05-21
- 允许修改文件：`docs/modules/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/**`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：无
- 验证命令：文档自审；UTF-8 无 BOM 检查
- 当前风险：后续任务必须按模块目录创建文档和代码目录，否则工具/游戏数量变多后仍会失控。
- 备注：已建立 `docs/modules/<module-slug>/` 归档规则，并将 PDF 工具箱文档迁移到独立目录；代码规范改为路由层只做入口，模块实现放独立模块目录。

### T015：实现 PDF 工具箱 MVP

- 领取人：Codex / 开发 A
- 领取时间：2026-05-21
- 状态：进行中
- 预计完成：2026-05-21 起分阶段推进
- 允许修改文件：`apps/web/src/app/tools/pdf-toolbox/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/web/src/components/portal-data.ts`, `apps/web/package.json`, `package-lock.json`, `docs/modules/pdf-toolbox/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/**`
- 禁止修改文件：`packages/**`, `apps/game/**`, `apps/web/prisma/**`, `apps/web/src/components/tools/photo/**`, `apps/web/src/lib/tools/photo/**`, `docker-compose.yml`, `package.json`
- 依赖任务：T025
- 验证命令：`npm run test -w apps/web -- pdf`; `npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; 桌面端和移动端检查
- 当前风险：PDF.js worker 与 Next.js 构建可能需要单独配置；浏览器内处理大文件有内存限制；PDF 转 Word Beta 质量不可过度承诺。
- 备注：已完成核心页面级处理第一轮，包含上传、预览、选择、旋转、排序、删除、拆分和下载；已补充文字水印、签名图片、PDF 转 Word Beta、区域遮盖和图片扫描成 PDF；PDF 转图片和基础压缩仍待补齐。

### T025：拆分独立工具站和游戏站入口体验

- 领取人：Codex / 开发 A
- 领取时间：2026-05-21
- 状态：已完成
- 预计完成：2026-05-21
- 允许修改文件：`apps/web/src/app/**`, `apps/web/src/components/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/**`
- 禁止修改文件：`packages/**`, `apps/game/**`, `apps/web/prisma/**`, `docker-compose.yml`, `package.json`, `package-lock.json`
- 依赖任务：T022
- 验证命令：`npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; 桌面端和移动端检查
- 当前风险：无。
- 备注：已按 `docs/网站UI/` 的 `index.html`、`tools.html`、`games.html` 适配；只调整现有 Next.js 单应用内的体验和视觉区分，不拆部署、不实现具体工具或游戏逻辑。

### T024：修复 Vercel 子目录 Next.js 识别失败

- 领取人：Codex / 开发 A
- 领取时间：2026-05-20
- 状态：已完成
- 预计完成：2026-05-20
- 允许修改文件：`apps/web/package.json`, `package-lock.json`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/src/**`, `apps/web/prisma/**`, `packages/**`, `apps/game/**`, `docker-compose.yml`
- 依赖任务：T002
- 验证命令：`npm run build -w apps/web`
- 当前风险：Vercel Root Directory 设置为 `apps/web` 时，只读取子应用依赖声明，缺少 `next`、`react`、`react-dom` 会导致框架识别失败。
- 备注：只补 Web 子应用运行依赖和 lockfile，不调整业务代码。

### T023：补充 Supabase 数据库交接文档

- 领取人：Codex / 开发 A
- 领取时间：2026-05-20
- 状态：已完成
- 预计完成：2026-05-20
- 允许修改文件：`docs/handoffs/**`, `docs/decisions/**`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`
- 依赖任务：T004
- 验证命令：文档自审；连接参数说明完整
- 当前风险：文档只应保留交接所需内容，不应把数据库密码明文写入仓库。
- 备注：仅补数据库交接说明，不改业务代码。

### T004：添加数据库和 Prisma 模型（Supabase PostgreSQL）

- 领取人：Codex / 开发 A
- 领取时间：2026-05-20
- 状态：已完成
- 预计完成：2026-05-20
- 允许修改文件：`apps/web/prisma/**`, `apps/web/src/lib/db.ts`, `docker-compose.yml`, `.env.example`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/src/app/**`, `apps/web/src/components/**`, `packages/**`, `apps/game/**`
- 依赖任务：T002, T003
- 验证命令：`npm exec prisma validate -w apps/web`
- 当前风险：需要确认 Supabase 项目可用并获取连接串；后续还要保持 Prisma schema 与标准 PostgreSQL 兼容，避免绑定 Supabase 专有能力。
- 备注：数据库底座先使用 Supabase 托管 PostgreSQL，后续可迁移到自有 PostgreSQL。

### T022：按 `docs/网站UI.zip` 适配前端门户 UI

- 领取人：Codex / 开发 A
- 领取时间：2026-05-20
- 状态：已完成
- 预计完成：2026-05-20
- 允许修改文件：`apps/web/src/app/**`, `apps/web/src/components/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**`
- 禁止修改文件：`packages/**`, `apps/game/**`, `docker-compose.yml`, `apps/web/prisma/**`
- 依赖任务：T002
- 验证命令：`npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; 桌面端和移动端检查
- 当前风险：任务文档曾被覆盖，需按已有完成记录和仓库实际文件修正 T001/T002 状态；`T019` 编号存在历史复用记录，当前新增任务使用 T022 避免继续冲突。
- 备注：设计来源为 `docs/网站UI.zip`，重点迁移 `index.html`, `tools.html`, `games.html`, `styles.css` 的视觉和交互。

领取后按此格式添加：

```md
### TXXX：任务名称

- 领取人：
- 领取时间：
- 状态：进行中
- 预计完成：
- 允许修改文件：
- 禁止修改文件：
- 依赖任务：
- 验证命令：
- 当前风险：
- 备注：
```

## 3. 冲突登记

暂无。

发生冲突时按此格式添加：

```md
### 冲突：简短说明

- 时间：
- 涉及任务：
- 涉及人员：
- 冲突文件：
- 当前状态：
- 处理方案：
- 谁先改：
- 谁后改：
- 是否已解决：
```

## 4. 交接记录

暂无。

任务从一个人交给另一个人时按此格式添加：

```md
### TXXX 交接

- 原负责人：
- 新负责人：
- 交接时间：
- 已完成：
- 未完成：
- 风险：
- 新负责人需要先读：
```

## 5. 领取历史

### T021：AI 内容转换工具箱规划

- 领取人：Codex / 两人协作
- 领取时间：2026-05-20
- 状态：已完成
- 预计完成：2026-05-20
- 允许修改文件：`docs/PROJECT_CONTEXT.md`, `docs/plans/2026-05-19-tool-game-ai-platform-implementation.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/2026-05-20-task-21-ai-content-conversion-toolbox-planning.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `tsconfig.base.json`
- 依赖任务：无
- 验证命令：文档自审；UTF-8 无 BOM 检查
- 当前风险：无。
- 备注：来源参考 `qiaomu-anything-to-notebooklm` skill；当前只写规划，不进入实现。

### T019：确认 GDevelop 游戏模块定位

- 领取人：Codex / 开发 B
- 领取时间：2026-05-20
- 状态：已完成
- 预计完成：2026-05-20
- 允许修改文件：`docs/PROJECT_CONTEXT.md`, `docs/plans/2026-05-19-tool-game-ai-platform-implementation.md`, `docs/superpowers/specs/2026-05-19-tool-game-ai-platform-design.md`, `docs/decisions/2026-05-20-gdevelop-game-engine-role.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/2026-05-20-task-19-gdevelop-game-engine-role.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `tsconfig.base.json`
- 依赖任务：无
- 验证命令：文档自审；UTF-8 无 BOM 检查
- 当前风险：无。
- 备注：只确认 GDevelop 的定位，不实现游戏代码。Cocos Creator 仍是微信/抖音小游戏正式发布主线。

### T018：建立 Git 忽略规则和协作入口

- 领取人：Codex / 开发 A
- 领取时间：2026-05-19
- 状态：已完成
- 预计完成：2026-05-19
- 允许修改文件：`.gitignore`, `README.md`, `.claude/settings.local.json`, `.obsidian/workspace.json`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-19.md`, `docs/completion/2026-05-19-task-18-gitignore-collaboration.md`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `package.json`, `tsconfig.base.json`
- 依赖任务：无
- 验证命令：`git status --porcelain=v1 -uall`; `git check-ignore`; UTF-8 无 BOM 检查
- 当前风险：无。
- 备注：已执行 `git rm --cached .claude/settings.local.json .obsidian/workspace.json`，本地文件保留，仓库提交后将停止跟踪这两个本地状态文件。

<!-- DOCS_SYNC_CLAIMS_START -->
## 6. 自动生成领取分片摘要

> 本节由 `npm run docs:sync` 生成。请修改 `docs/tasks/claims/` 中的领取分片，不要手工编辑本节。

| 编号 | 任务 | 领取人 | 状态 | 领取时间 | 允许修改文件 | 验证命令 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T013 | 添加部署文件 | Codex / 开发 B | 已完成 | 2026-05-22 | `apps/web/Dockerfile`, `docker-compose.prod.yml`, `.env.production.example`, `.dockerignore`, `deploy/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | `docker compose -f docker-compose.prod.yml --env-file .env.production.example config`; `npm run build:standalone -w apps/web`; `docker build --platform linux/amd64 -f apps/web/Dockerfile -t dreamchasers-web:latest .` | 已补部署文件和说明，不执行远程部署。 |
| T036 | 降低多人协作文档冲突的分片同步规范 | Codex / 两人协作 | 已完成 | 2026-05-22 | `AGENTS.md`, `CLAUDE.md`, `docs/PROJECT_CONTEXT.md`, `docs/workflow/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-36-doc-sync-policy.md` | 文档自审；UTF-8 无 BOM 检查 | 已建立分片同步规则，后续完整任务完成时再由 AI 汇总主文档。 |
| T037 | 新增 docs:sync 自动汇总脚本 | Codex / 两人协作 | 已完成 | 2026-05-22 | `package.json`, `scripts/docs-sync.mjs`, `docs/workflow/doc-sync-policy.md`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-37-docs-sync-script.md` | `npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查 | 已新增 `npm run docs:sync`，从任务分片和领取分片生成主文档摘要区。 |
| T038 | 麻将 Roguelike 永久固化能力和卡槽系统规划 | Codex / 开发 B | 已完成 | 2026-05-22 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-38-mahjong-permanent-abilities.md` | 文档自审；UTF-8 无 BOM 检查 | 已完成永久能力分层、基础成长、固化能力、起局能力和道具强化的最终结构。 |
| T039 | 条件启用 Next.js standalone 自托管构建 | Codex / 开发 A | 已完成 | 2026-05-22 | `apps/web/next.config.ts`, `apps/web/package.json`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-39-conditional-standalone-build.md` | `npm run build -w apps/web`; `npm run build:standalone -w apps/web`; 检查 `apps/web/.next/standalone` | 默认 `npm run build -w apps/web` 保持 Vercel 兼容；本地自托管构建使用 `npm run build:standalone -w apps/web` 并生成 `apps/web/.next/standalone`。 |
| T040 | 麻将 Roguelike 完整牌局规则、经济体力和失败救场规划 | Codex / 开发 B | 已完成 | 2026-05-22 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-40-mahjong-complete-round-rules.md` | `npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查 | 已完成完整牌局状态机、局内积分/铜钱分层、体力、孤张内部判定和满槽救场顺序规划。 |
| T041 | 麻将 Roguelike 团队评审版玩法方案 | Codex / 开发 B | 已完成 | 2026-05-22 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-41-mahjong-gameplay-review-docs.md` | `npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查 | 已完成 Markdown 玩法方案和 HTML 可视化评审稿。 |
| T042 | 麻将 Roguelike MVP 玩法验证计划 | Codex / 开发 B | 已完成 | 2026-05-23 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/2026-05-23-task-42-mahjong-mvp-validation-plan.md` | `npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查 | 已完成玩法验证目标、最小闭环、观察指标和 MVP 冻结口径整理。 |
| T043 | 麻将 Roguelike 最小可玩闭环和 MVP 开发拆分计划 | Codex / 开发 B | 已完成 | 2026-05-23 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/2026-05-23-task-43-mahjong-mvp-build-plan.md` | `npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查；`git diff --check` | 已完成后续构建计划，明确先做最小可玩闭环，再按验证结果拆正式 MVP。 |
| T044 | 麻将 Roguelike 最小可玩验证原型 | Codex / 开发 B | 已完成 | 2026-05-23 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/2026-05-23-task-44-mahjong-playable-validation-prototype.md` | `npm run docs:sync`; 浏览器桌面端检查；浏览器移动端检查；UTF-8 无 BOM 检查；`git diff --check` | 已完成单文件 HTML 原型和桌面/移动端浏览器检查，避免提前进入正式工程范围。 |
| T045 | 实现 AI 修图工具 MVP | Codex / 开发 B | 待验收 | 2026-05-26 | `apps/web/src/app/tools/ai-photo-editor/**`, `apps/web/src/components/tools/photo/**`, `apps/web/src/lib/tools/photo/**`, `apps/web/public/stickers/**`, `apps/web/src/components/AppHeader.tsx`, `apps/web/src/components/PortalCard.tsx`, `apps/web/src/components/portal-data.ts`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/progress/2026-05-25.md`, `docs/progress/2026-05-26.md`, `docs/completion/**` | `npm run typecheck -w apps/web`; `npm run lint -w apps/web`; `npx next build`; 贴纸资源访问检查；桌面端和移动端检查 | 已完成 AI 修图工具 MVP、导出一致性修复和装饰贴纸增强；不调用真实 AI 模型。 |
<!-- DOCS_SYNC_CLAIMS_END -->
