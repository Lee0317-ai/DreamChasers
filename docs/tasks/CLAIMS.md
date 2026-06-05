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
| T014 | 未命名任务 | Codex / 开发 A | 已完成 | 2026-05-27 | `docs/operations/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-27.md`, `docs/completion/**` | 文档自审；`git diff --check`; `npm run docs:sync` | 基于 2026-05-27 的真实部署过程整理部署流程文档，已完成状态和收尾同步。 |
| T015 | PDF 工具箱 PDF 转 Word Beta 导出格式修复 | Lee | 待验收 | 2026-06-03 | `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/web/src/app/tools/pdf-toolbox/**`, `apps/web/package.json`, `package-lock.json`, `docs/modules/pdf-toolbox/**`, `docs/tasks/claims/T015-lee-pdf-word-docx-fix.md`, `docs/progress/2026-06-03-lee.md` | `npm run test -w apps/web -- pdf`; `npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; 桌面端和移动端检查按本次代码修复风险择机执行 | 本次只修 PDF 转 Word Beta 的导出文件格式，不扩展 OCR、复杂版式还原或 PDF 转图片/压缩能力。 |
| T036 | 降低多人协作文档冲突的分片同步规范 | Codex / 两人协作 | 已完成 | 2026-05-22 | `AGENTS.md`, `CLAUDE.md`, `docs/PROJECT_CONTEXT.md`, `docs/workflow/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-36-doc-sync-policy.md` | 文档自审；UTF-8 无 BOM 检查 | 已建立分片同步规则，后续完整任务完成时再由 AI 汇总主文档。 |
| T037 | 新增 docs:sync 自动汇总脚本 | Codex / 两人协作 | 已完成 | 2026-05-22 | `package.json`, `scripts/docs-sync.mjs`, `docs/workflow/doc-sync-policy.md`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-37-docs-sync-script.md` | `npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查 | 已新增 `npm run docs:sync`，从任务分片和领取分片生成主文档摘要区。 |
| T038 | 麻将 Roguelike 永久固化能力和卡槽系统规划 | Codex / 开发 B | 已完成 | 2026-05-22 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-38-mahjong-permanent-abilities.md` | 文档自审；UTF-8 无 BOM 检查 | 已完成永久能力分层、基础成长、固化能力、起局能力和道具强化的最终结构。 |
| T039 | 条件启用 Next.js standalone 自托管构建 | Codex / 开发 A | 已完成 | 2026-05-22 | `apps/web/next.config.ts`, `apps/web/package.json`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-39-conditional-standalone-build.md` | `npm run build -w apps/web`; `npm run build:standalone -w apps/web`; 检查 `apps/web/.next/standalone` | 默认 `npm run build -w apps/web` 保持 Vercel 兼容；本地自托管构建使用 `npm run build:standalone -w apps/web` 并生成 `apps/web/.next/standalone`。 |
| T040 | 麻将 Roguelike 完整牌局规则、经济体力和失败救场规划 | Codex / 开发 B | 已完成 | 2026-05-22 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-40-mahjong-complete-round-rules.md` | `npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查 | 已完成完整牌局状态机、局内积分/铜钱分层、体力、孤张内部判定和满槽救场顺序规划。 |
| T041 | 麻将 Roguelike 团队评审版玩法方案 | Codex / 开发 B | 已完成 | 2026-05-22 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-41-mahjong-gameplay-review-docs.md` | `npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查 | 已完成 Markdown 玩法方案和 HTML 可视化评审稿。 |
| T042 | 麻将 Roguelike MVP 玩法验证计划 | Codex / 开发 B | 已完成 | 2026-05-23 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/2026-05-23-task-42-mahjong-mvp-validation-plan.md` | `npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查 | 已完成玩法验证目标、最小闭环、观察指标和 MVP 冻结口径整理。 |
| T043 | 麻将 Roguelike 最小可玩闭环和 MVP 开发拆分计划 | Codex / 开发 B | 已完成 | 2026-05-23 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/2026-05-23-task-43-mahjong-mvp-build-plan.md` | `npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查；`git diff --check` | 已完成后续构建计划，明确先做最小可玩闭环，再按验证结果拆正式 MVP。 |
| T044 | 麻将 Roguelike 最小可玩验证原型 | Codex / 开发 B | 已完成 | 2026-05-23 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/2026-05-23-task-44-mahjong-playable-validation-prototype.md` | `npm run docs:sync`; 浏览器桌面端检查；浏览器移动端检查；UTF-8 无 BOM 检查；`git diff --check` | 已完成单文件 HTML 原型和桌面/移动端浏览器检查，避免提前进入正式工程范围。 |
| T045 | 实现 AI 修图工具 MVP | Codex / 开发 B | 已完成 | 2026-05-23 | `packages/shared/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T045-hulebu-rules-model.md`, `docs/tasks/claims/T045-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check` | 已完成 `胡了卜` 命名落档和纯 TypeScript 规则模型，下一步建议沉淀关卡/奖励配置。 |
| T046 | 胡了卜验证场景配置草案 | Codex / 开发 B | 已完成 | 2026-05-23 | `apps/game/mahjong-roguelike/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T046-hulebu-validation-configs.md`, `docs/tasks/claims/T046-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**` | `node -e "for (const f of ['apps/game/mahjong-roguelike/config/tiles.json','apps/game/mahjong-roguelike/config/levels.json','apps/game/mahjong-roguelike/config/rewards.json']) JSON.parse(require('fs').readFileSync(f, 'utf8')); console.log('configs ok')"`; `npm run docs:sync`; `git diff --check` | 已把 T044 的 5 个 HTML 验证场景沉淀为引擎无关配置。 |
| T047 | 胡了卜 MVP 10 关和 10 奖励配置草案 | Codex / 开发 B | 已完成 | 2026-05-23 | `apps/game/mahjong-roguelike/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T047-hulebu-mvp-content-configs.md`, `docs/tasks/claims/T047-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**` | `node --input-type=module -e "import fs from 'node:fs'; const levels=JSON.parse(fs.readFileSync('apps/game/mahjong-roguelike/config/levels.json','utf8')); const rewards=JSON.parse(fs.readFileSync('apps/game/mahjong-roguelike/config/rewards.json','utf8')); if (levels.levels.length !== 10) throw new Error('expected 10 levels'); if (rewards.rewards.length !== 10) throw new Error('expected 10 rewards'); const rewardIds=new Set(rewards.rewards.map(r=>r.id)); for (const level of levels.levels) { const tileIds=new Set(level.tiles.map(t=>t.id)); for (const id of level.initialSlotOrder) if (!tileIds.has(id)) throw new Error(level.id+' missing initial slot tile '+id); for (const tile of level.tiles) for (const blocker of tile.blockedBy) if (!tileIds.has(blocker)) throw new Error(level.id+' missing blocker '+blocker); for (const id of level.rewardPool) if (!rewardIds.has(id)) throw new Error(level.id+' missing reward '+id); } console.log('mvp configs ok')"`; `npm run docs:sync`; `git diff --check` | 已扩展 T046 配置到 10 关和 10 个奖励，未进入表现层实现。 |
| T048 | 胡了卜配置加载验证 | Codex / 开发 B | 已完成 | 2026-05-23 | `packages/shared/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T048-hulebu-config-loader-validation.md`, `docs/tasks/claims/T048-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check` | 已新增共享规则包配置加载测试；未修改 10 关和 10 奖励配置内容。 |
| T049 | 胡了卜配置驱动试玩原型 | Codex / 开发 B | 已完成 | 2026-05-23 | `apps/game/mahjong-roguelike/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T049-hulebu-config-playable-prototype.md`, `docs/tasks/claims/T049-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong`; `npm run docs:sync`; 浏览器桌面端检查；浏览器移动端检查；`git diff --check` | 已完成配置驱动试玩页；本步未修改 `apps/web/**`，未接站内路由。当前原型用于配置和表现层联调，不代表最终密集牌山。 |
| T050 | 胡了卜牌山生成器和密集堆叠布局 | Codex / 开发 B | 已完成 | 2026-05-23 | `apps/game/mahjong-roguelike/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T050-hulebu-tile-mountain-generator.md`, `docs/tasks/claims/T050-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong`; `npm run docs:sync`; 浏览器桌面端检查；浏览器移动端检查；`git diff --check` | 已完成；本任务未修改 `apps/web/**`，避免与 T015 PDF 工具箱当前工作范围冲突。 |
| T051 | 胡了卜麻将牌面 UI 参考图 | Codex / 开发 B | 待验收 | 2026-05-23 | `output/imagegen/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T051-hulebu-tile-ui-references.md`, `docs/tasks/claims/T051-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md` | `npm run docs:sync`; `git diff --check`; 人工查看生成图片 | 已生成 3 张参考 sheet、准确版 v2-v8、完整青瓷风牌面总览图、条子 `1-9` 青瓷风校正版预览图，以及单张审核流的 `1条 / 2条 / 3条 / 4条 / 5条 / 6条 / 7条 / 9条` 单牌；`8条` 使用用户确认的 `hulebu-eight-bamboo-celadon-candidate-2.png` 基准稿；筒子已生成 `1筒 / 2筒 / 3筒 / 4筒 / 5筒 / 6筒 / 7筒 / 8筒 / 9筒`；万子已生成 `1万 / 7万 / 8万 / 9万`；字牌已生成完整预览图 `北 / 白板 / 南 / 中 / 發 / 東 / 西`：`output/imagegen/hulebu-honor-tiles-celadon-reference-v1.png`，先供风格和牌面确认，不接入工程。 |
| T052 | 胡了卜 Boss 目标配置化 | Codex / 开发 B | 待验收 | 2026-05-24 | `apps/game/mahjong-roguelike/config/levels.json`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T052-hulebu-boss-goal-config.md`, `docs/tasks/claims/T052-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md` | `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /tmp/hulebu-prototype-script.js`; 浏览器桌面端检查；`npm run docs:sync`; `git diff --check` | 已完成配置化多目标 Boss 第一版，第 10 关目标为 `吃 1 / 碰 1 / 杠 1 / 积分 80`；验证通过后可继续设计第 20 关 Boss 目标和词缀组合。 |
| T053 | 胡了卜 Boss 牌型目标第一版 | Codex / 开发 B | 待验收 | 2026-05-24 | `apps/game/mahjong-roguelike/config/levels.json`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T053-hulebu-boss-pattern-goals.md`, `docs/tasks/claims/T053-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md` | `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /tmp/hulebu-prototype-script.js`; 原型 VM 检查第 10 关 Boss 目标；`npm run docs:sync`; `git diff --check` | 已完成 `suit_set` 目标，第 10 关现在要求 `万 / 筒 / 条` 都至少完成 1 次组合。 |
| T054 | 胡了卜 Boss 目标反馈和通关提示优化 | Codex / 开发 B | 待验收 | 2026-05-24 | `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T054-hulebu-boss-goal-feedback.md`, `docs/tasks/claims/T054-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md` | `node --check /tmp/hulebu-prototype-script.js`; 原型 VM 检查第 10 关 Boss 目标 DOM 状态；`npm run docs:sync`; `git diff --check` | 已完成目标标签、完成态、推进高亮和清空但目标未完成提示；本任务未扩关卡内容量。 |
| T055 | 胡了卜加入字牌基础支持 | Codex / 开发 B | 待验收 | 2026-05-24 | `packages/shared/**`, `apps/game/mahjong-roguelike/config/**`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T055-hulebu-honor-tiles.md`, `docs/tasks/claims/T055-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md` | `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /tmp/hulebu-prototype-script.js`; 原型 VM 检查字牌渲染和候选；`npm run docs:sync`; `git diff --check` | 用户称为“花牌”，实现口径按麻将常用分类处理为字牌：风牌 `东南西北` 和箭牌 `中发白`。 |
| T056 | 胡了卜固定 8 格主槽和胡牌基础支持 | Codex / 开发 B | 待验收 | 2026-05-24 | `packages/shared/**`, `apps/game/mahjong-roguelike/config/**`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T056-hulebu-fixed-eight-slot-hu.md`, `docs/tasks/claims/T056-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md` | `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /private/tmp/hulebu-config-playable-script.js`; 浏览器桌面端和 390px 移动端检查；`npm run docs:sync`; `git diff --check` | 备用槽继续定位为救场，不参与 `胡` 的 `3 + 3 + 2` 判定；当前实现已进入待验收，后续需要人工试玩确认 8 格压力是否合适。 |
| T057 | 胡了卜胡牌节奏配置和密集牌山胡牌包 | Codex / 开发 B | 待验收 | 2026-05-25 | `packages/shared/**`, `apps/game/mahjong-roguelike/config/**`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/game/mahjong-roguelike/docs/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T057-hulebu-hu-rhythm-config.md`, `docs/tasks/claims/T057-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-25.md` | `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /private/tmp/hulebu-config-playable-script.js`; 浏览器桌面端检查第 6 关配置模式和密集牌山模式；浏览器 390px 移动端检查；`npm run docs:sync`; `git diff --check` | 本任务不改变 T056 的 `3 + 3 + 2` 轻量胡牌定义，也不把备用槽纳入胡牌判定。 |
| T058 | 胡了卜 20 关节奏骨架和第二 Boss | Codex / 开发 B | 待验收 | 2026-05-25 | `packages/shared/**`, `apps/game/mahjong-roguelike/config/**`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/game/mahjong-roguelike/docs/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T058-hulebu-20-level-skeleton.md`, `docs/tasks/claims/T058-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-25.md` | `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /private/tmp/hulebu-config-playable-script.js`; 浏览器桌面端检查第 20 关配置模式和密集牌山模式；浏览器 390px 移动端检查；`npm run docs:sync`; `git diff --check` | 本任务不新增正式引擎工程，也不把 20 关草案视为最终内容。 |
| T059 | 胡了卜随机牌山调参面板 | Codex / 开发 B | 待验收 | 2026-05-25 | `packages/shared/src/mahjong-config.test.ts`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/game/mahjong-roguelike/docs/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T059-hulebu-mountain-tuning-panel.md`, `docs/tasks/claims/T059-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-25.md` | `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `node --check /private/tmp/hulebu-config-playable-script.js`; 浏览器桌面端检查调参面板和第 20 关密集牌山；浏览器 390px 移动端检查；`npm run docs:sync`; `git diff --check` | 本任务不新增正式引擎工程，也不把当前默认参数视为最终平衡。 |
| T060 | 胡了卜 Cocos/GDevelop 正式表现层桥接 | Codex / 开发 B | 待验收 | 2026-05-25 | `packages/shared/src/**`, `apps/game/mahjong-roguelike/docs/**`, `apps/game/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T060-hulebu-formal-presentation-bridge.md`, `docs/tasks/claims/T060-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-25.md`, `docs/completion/2026-05-25-task-T060-hulebu-formal-presentation-bridge.md` | `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check` | 未填写 |
| T061 | 胡了卜 Cocos 场景骨架第一版 | Codex / 开发 B | 待验收 | 2026-05-25 | `packages/shared/src/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/docs/**`, `apps/game/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T061-hulebu-cocos-scene-skeleton.md`, `docs/tasks/claims/T061-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-25.md`, `docs/completion/2026-05-25-task-T061-hulebu-cocos-scene-skeleton.md` | `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check` | 未填写 |
| T062 | 胡了卜 Cocos Creator 3.8.8 工程接入 | Codex / 开发 B | 已完成 | 2026-05-25 | `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/docs/**`, `apps/game/mahjong-roguelike/README.md`, `packages/shared/src/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T062-hulebu-cocos-creator-project.md`, `docs/tasks/claims/T062-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-25.md`, `docs/completion/2026-05-25-task-T062-hulebu-cocos-creator-project.md` | `npm run test -w packages/shared -- mahjong-cocos-project`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check` | 未填写 |
| T063 | 胡了卜 Cocos 首屏自动渲染 | Codex / 开发 B | 已完成 | 2026-05-25 | `apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T063-hulebu-cocos-first-render.md`, `docs/tasks/claims/T063-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-26.md`, `docs/completion/2026-05-26-task-T063-hulebu-cocos-first-render.md` | `npm run test -w packages/shared -- mahjong-cocos-project`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check` | 未填写 |
| T064 | 打工人弹射解压模块文档落档 | Codex / 开发 B | 已完成 | 2026-05-25 | `docs/modules/angry-worker/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T064-angry-worker-integration.md`, `docs/tasks/claims/T064-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-25.md`, `docs/completion/**` | `npm run docs:sync`; 文档自审; UTF-8 无 BOM 检查; `git diff --check` | 已完成模块文档创建，等待 docs:sync 和主文档更新。 |
| T065 | 胡了卜 Cocos 手机竖屏首屏适配 | Codex / 开发 B | 已完成 | 2026-05-26 | `apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T065-hulebu-cocos-mobile-first-screen.md`, `docs/tasks/claims/T065-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-26.md`, `docs/completion/2026-05-26-task-T065-hulebu-cocos-mobile-first-screen.md` | `npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check` | 未填写 |
| T066 | 胡了卜 Cocos 真实可见尺寸自适应 | Codex / 开发 B | 已完成 | 2026-05-26 | `apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T066-hulebu-cocos-visible-size-layout.md`, `docs/tasks/claims/T066-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-26.md`, `docs/completion/2026-05-26-task-T066-hulebu-cocos-visible-size-layout.md` | `npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check` | 未填写 |
| T067 | 胡了卜 Cocos 首屏目标图视觉壳 | Codex / 开发 B | 待验收 | 2026-05-26 | `apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T067-hulebu-cocos-visual-shell.md`, `docs/tasks/claims/T067-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-26.md`, `docs/completion/2026-05-26-task-T067-hulebu-cocos-visual-shell.md` | `npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check` | 未填写 |
| T068 | 胡了卜麻将 UI 图片资源归档和切图 | Codex / 开发 B | 已完成 | 2026-05-26 | `output/imagegen/**`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/**`, `apps/game/mahjong-roguelike/cocos/scene-binding.md`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T068-hulebu-ui-image-assets.md`, `docs/tasks/claims/T068-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-26.md` | `npm run docs:sync`; 图片尺寸和清单检查；`git diff --check` | 未填写 |
| T069 | 胡了卜 Cocos 首条点击可玩链路 | Codex / 开发 B | 待验收 | 2026-05-26 | `apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T069-hulebu-cocos-playable-click-chain.md`, `docs/tasks/claims/T069-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-26.md` | `npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check` | 未填写 |
| T070 | 胡了卜 Cocos 点击后遮挡解锁和槽位牌名显示 | Codex / 开发 B | 待验收 | 2026-05-26 | `apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T070-hulebu-cocos-unlock-slot-labels.md`, `docs/tasks/claims/T070-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-26.md` | `npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check` | 未填写 |
| T071 | 未命名任务 | 未填写 | 进行中 | 未填写 | `docs/tasks/NEXT_ID.md`, `docs/workflow/dual-dev-ai-workflow.md`, `docs/workflow/doc-sync-policy.md`, `AGENTS.md`, `CLAUDE.md`, `docs/tasks/items/T071-avoid-id-progress-conflict.md`, `docs/tasks/claims/T071-lee.md` | 文档自审；UTF-8 无 BOM 检查；`git diff --check` | 规范写入完成后，需更新 `docs/tasks/CLAIMS.md` 和 `docs/tasks/TASK_BOARD.md` 的自动摘要区。 |
| T072 | 胡了卜 Cocos 真实配置首关接入 | Codex / 开发 B | 待验收 | 2026-05-27 | `apps/game/mahjong-roguelike/cocos/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T072-hulebu-cocos-real-config-level.md`, `docs/tasks/claims/T072-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`, `docs/superpowers/plans/2026-05-27-hulebu-cocos-real-config-level.md` | `npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check` | 未填写 |
| T073 | 胡了卜 Cocos 牌面 SpriteFrame 绑定第一版 | Codex / 开发 B | 待验收 | 2026-05-27 | `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/**`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/mahjong-tiles/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T073-hulebu-cocos-tile-sprite-binding.md`, `docs/tasks/claims/T073-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`, `docs/superpowers/plans/2026-05-27-hulebu-cocos-tile-sprite-binding.md` | `npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check` | 未填写 |
| T074 | 胡了卜无边框麻将牌面资源 | Codex / 开发 B | 待验收 | 2026-05-27 | `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/mahjong-tiles/**`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuTileSpriteCatalog.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `apps/game/mahjong-roguelike/cocos/scene-binding.md`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T074-hulebu-borderless-mahjong-assets.md`, `docs/tasks/claims/T074-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-05-27.md`, `docs/completion/**` | `node` + `sharp` 检查无边框 PNG 数量、尺寸、透明通道和边缘 alpha；`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check` | 未填写 |
| T075 | 胡了卜新牌面 UI 重新应用 | Codex / 开发 B | 待验收 | 2026-05-27 | `output/imagegen/**`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/resources/ui/mahjong-tiles/**`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/assets/HulebuTileSpriteCatalog.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `apps/game/mahjong-roguelike/cocos/scene-binding.md`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T075-hulebu-refresh-tile-ui-assets.md`, `docs/tasks/claims/T075-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-05-27.md`, `docs/completion/**` | 资源清单和图片尺寸检查；`npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`; Cocos Web Preview 手机视口目检 | 未填写 |
| T076 | 胡了卜 Cocos 通关提示和下一关流转 | Codex / 开发 B | 待验收 | 2026-05-27 | `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T076-hulebu-cocos-clear-level-flow.md`, `docs/tasks/claims/T076-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-05-27.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`; Cocos Web Preview 手机视口手动检查清空牌山、通关提示和下一关入口 | 未填写 |
| T077 | 胡了卜 Cocos 随机堆叠牌山恢复 | Codex / 开发 B | 待验收 | 2026-05-27 | `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/**`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T077-hulebu-cocos-random-stacked-mountain.md`, `docs/tasks/claims/T077-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-05-27.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`; Cocos Web Preview 手机视口目检随机牌山密度和堆叠提示 | 未填写 |
| T078 | 胡了卜 Cocos 牌山铺开和遮挡点击一致性 | Codex / 开发 B | 待验收 | 2026-05-27 | `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/items/T078-hulebu-cocos-spread-locking.md`, `docs/tasks/claims/T078-codex.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-05-27.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-cocos-project`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `git diff --check`; Cocos Web Preview 手机视口目检牌山铺开和遮挡不可点 | 未填写 |
| T079 | 胡了卜 Graph-based 牌山生成器地基设计 | Codex / 开发 B | 待验收 | 2026-05-28 | `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T079-hulebu-graph-generator-foundation.md`, `docs/tasks/claims/T079-codex.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-05-28-hulebu-mountain-generator-foundation-design.md`, `docs/superpowers/plans/2026-05-28-hulebu-mountain-generator-foundation.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md` | `npm run docs:sync`; 文档自审；`rg -n "TBD\|TODO\|待补" docs/superpowers/specs/2026-05-28-hulebu-mountain-generator-foundation-design.md docs/superpowers/plans/2026-05-28-hulebu-mountain-generator-foundation.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`; `git diff --check` | 未填写 |
| T080 | 胡了卜 Graph-based 牌山生成器共享实现 | Codex / 开发 B | 待验收 | 2026-05-28 | `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `packages/shared/src/index.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T080-hulebu-graph-generator-shared-implementation.md`, `docs/tasks/claims/T080-codex.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-mountain-generator`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T080-hulebu-graph-generator-shared-implementation.md docs/tasks/claims/T080-codex.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`; `git diff --check` | 未填写 |
| T081 | 胡了卜地图模板语法系统设计 | Codex / 开发 B | 待验收 | 2026-05-28 | `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T081-hulebu-map-template-grammar-design.md`, `docs/tasks/claims/T081-codex.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-05-28-hulebu-map-template-grammar-design.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/modules/mahjong-roguelike/DECISIONS.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T081-hulebu-map-template-grammar-design.md docs/tasks/claims/T081-codex.md docs/superpowers/specs/2026-05-28-hulebu-map-template-grammar-design.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`; `git diff --check` | 未填写 |
| T082 | 胡了卜模板注册表和参数系统实施计划 | Lee | 待验收 | 2026-05-28 | `AGENTS.md`, `docs/tasks/LOCAL_OWNER.md`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T082-hulebu-template-registry-plan.md`, `docs/tasks/claims/T082-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-05-28-hulebu-template-registry-parameter-system.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/modules/mahjong-roguelike/DECISIONS.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T082-hulebu-template-registry-plan.md docs/tasks/claims/T082-lee.md docs/superpowers/plans/2026-05-28-hulebu-template-registry-parameter-system.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`; `git diff --check` | 未填写 |
| T083 | 胡了卜模板注册表和 8 个核心模板共享实现 | Lee | 待验收 | 2026-05-28 | `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `packages/shared/src/index.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T083-hulebu-template-registry-core-templates.md`, `docs/tasks/claims/T083-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-28.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-mountain-generator`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T083-hulebu-template-registry-core-templates.md docs/tasks/claims/T083-lee.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`; `git diff --check` | 未填写 |
| T084 | 未命名任务 | 未填写 | 未填写 | 未填写 | 未填写 | 未填写 | 未填写 |
| T084 | 胡了卜 Graph-based 牌山生成器 Cocos 接入 | Lee | 待验收 | 2026-05-29 | `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/config/HulebuLevelConfig.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/runtime/HulebuRuntimeState.ts`, `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/scripts/bootstrap/HulebuConfiguredSceneModel.ts`, `packages/shared/src/mahjong-cocos-project.test.ts`, `docs/tasks/items/T084-hulebu-cocos-graph-generator-integration.md`, `docs/tasks/claims/T084-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`, `docs/progress/2026-05-29.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-mountain-generator`; `npm run test -w packages/shared -- mahjong-cocos-project`; `npm run typecheck -w packages/shared`; `npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json`; `npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T084-hulebu-cocos-graph-generator-integration.md docs/tasks/claims/T084-lee.md docs/modules/mahjong-roguelike/GENERATOR_FOUNDATION.md`; `git diff --check` | 未填写 |
| T085 | 胡了卜玩家试玩页和调牌器分离 | Lee | 待验收 | 2026-05-29 | `AGENTS.md`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/game/mahjong-roguelike/prototypes/config-playable/tuner.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T085-hulebu-play-page-tuner-split.md`, `docs/tasks/claims/T085-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-30.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-config-playable-prototype`; `node --check /private/tmp/hulebu-config-playable-script.js`; 浏览器桌面端检查默认玩家页和调牌器入口；浏览器移动端检查默认玩家页首屏；`npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T085-hulebu-play-page-tuner-split.md docs/tasks/claims/T085-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check` | 已完成默认玩家试玩页和调牌器视图分离；回归测试覆盖默认入口、新窗口调牌器入口和调参面板只在 `view=tuner` 显示。 |
| T086 | 胡了卜数百张小牌密集牌山原型 | Lee | 待验收 | 2026-05-30 | `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T086-hulebu-hundreds-tile-mountain.md`, `docs/tasks/claims/T086-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-30.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `node --check /private/tmp/hulebu-config-playable-script.js`; 通过本地浏览器打开 `http://127.0.0.1:3031/apps/game/mahjong-roguelike/prototypes/config-playable/index.html?view=tuner&mode=mountain&level=1` 检查调牌器；`npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T086-hulebu-hundreds-tile-mountain.md docs/tasks/claims/T086-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check` | 已完成数百张小牌密集牌山原型；只参考高密度小牌堆叠体验，不复制外部游戏源码。默认生成已从宽铺网格改为 6 条压叠牌流加 4 个竖堆入口。 |
| T087 | 胡了卜原型模板随机、全牌种覆盖和竖屏牌桌 | Lee | 待验收 | 2026-05-30 | `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T087-hulebu-varied-portrait-mountain.md`, `docs/tasks/claims/T087-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-05-30-hulebu-varied-portrait-mountain.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-30.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `node --check /private/tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页和调牌器页检查；`npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T087-hulebu-varied-portrait-mountain.md docs/tasks/claims/T087-lee.md docs/superpowers/plans/2026-05-30-hulebu-varied-portrait-mountain.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check` | 未填写 |
| T088 | 胡了卜原型散乱可见压叠层 | Lee | 待验收 | 2026-05-30 | `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T088-hulebu-visible-scattered-stack-preview.md`, `docs/tasks/claims/T088-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-30.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页和调牌器页检查；`npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T088-hulebu-visible-scattered-stack-preview.md docs/tasks/claims/T088-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check` | 未填写 |
| T089 | 胡了卜原型随机组合堆遮挡 | Lee | 待验收 | 2026-05-30 | `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T089-hulebu-random-merged-stack-overlap.md`, `docs/tasks/claims/T089-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-31.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页和调牌器页检查；点击一个组合堆顶牌后确认下方可选入口增加；`npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T089-hulebu-random-merged-stack-overlap.md docs/tasks/claims/T089-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check` | 未填写 |
| T090 | 胡了卜失败提示弹层 | Lee | 待验收 | 2026-05-31 | `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T090-hulebu-failure-feedback-overlay.md`, `docs/tasks/claims/T090-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-31.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页并触发/模拟失败提示；`npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T090-hulebu-failure-feedback-overlay.md docs/tasks/claims/T090-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check` | 未填写 |
| T091 | 胡了卜玩家页正式 HUD 空间压缩 | Lee | 待验收 | 2026-05-31 | `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T091-hulebu-compact-board-hud-budget.md`, `docs/tasks/claims/T091-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-31.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查桌面和移动端牌桌尺寸、可点数量与无横向溢出；`npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T091-hulebu-compact-board-hud-budget.md docs/tasks/claims/T091-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check` | 未填写 |
| T092 | 胡了卜玩家页正式一屏 HUD 重排 | Lee | 待验收 | 2026-06-01 | `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T092-hulebu-one-screen-play-hud.md`, `docs/tasks/claims/T092-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查桌面和移动端一屏 HUD、右侧道具栏、卡槽首屏和无横向溢出；打开 `view=tuner&mode=mountain&level=1` 检查调牌器完整信息仍可用；`npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T092-hulebu-one-screen-play-hud.md docs/tasks/claims/T092-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check` | 未填写 |
| T093 | 胡了卜 10 关朋友试玩 Demo | Lee | 待验收 | 2026-06-01 | `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T093-hulebu-friend-playtest-demo.md`, `docs/tasks/claims/T093-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-06-01-hulebu-friend-playtest-demo.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查第 1-4 关教学、右侧三道具、奖励默认卡槽 +2、桌面和移动端首屏；`npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T093-hulebu-friend-playtest-demo.md docs/tasks/claims/T093-lee.md docs/superpowers/plans/2026-06-01-hulebu-friend-playtest-demo.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check` | 未填写 |
| T094 | 胡了卜残局收官与试玩反馈设计 | Lee | 待验收 | 2026-06-01 | `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T094-hulebu-endgame-settlement-design.md`, `docs/tasks/claims/T094-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-06-01-hulebu-endgame-settlement-design.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/DECISIONS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md` | `npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T094-hulebu-endgame-settlement-design.md docs/tasks/claims/T094-lee.md docs/superpowers/specs/2026-06-01-hulebu-endgame-settlement-design.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/DECISIONS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-01-lee.md`; `git diff --check` | 未填写 |
| T095 | 胡了卜混合窗口牌山生成器 | Lee | 待验收 | 2026-06-01 | `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T095-hulebu-mixed-window-mountain-generator.md`, `docs/tasks/claims/T095-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页第 5 关后检查首轮窗口不是直接三张同组答案；`npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T095-hulebu-mixed-window-mountain-generator.md docs/tasks/claims/T095-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-01-lee.md`; `git diff --check` | 未填写 |
| T096 | 胡了卜玩家页布局、牌面放大和模板随机调参 | Lee | 待验收 | 2026-06-01 | `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T096-hulebu-play-layout-larger-random-template.md`, `docs/tasks/claims/T096-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查桌面布局、第 5 关牌面大小、首轮可点和模板随机；390px 移动视口检查无横向溢出；`npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T096-hulebu-play-layout-larger-random-template.md docs/tasks/claims/T096-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-01-lee.md`; `git diff --check` | 未填写 |
| T097 | 胡了卜教学关必须发动对应组合才通关 | Lee | 待验收 | 2026-06-01 | `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T097-hulebu-tutorial-action-clear.md`, `docs/tasks/claims/T097-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查第 1-4 关教学：全放入卡槽不通关，点击对应 `碰 / 吃 / 杠 / 胡` 后通关；`npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T097-hulebu-tutorial-action-clear.md docs/tasks/claims/T097-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-01-lee.md`; `git diff --check` | 未填写 |
| T098 | 胡了卜朋友 Demo 第 5-10 关渐进难度曲线 | Lee | 待验收 | 2026-06-01 | `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T098-hulebu-friend-demo-gradual-difficulty.md`, `docs/tasks/claims/T098-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查第 5 关牌量、标题提示、首轮可点和第 10 关高压恢复；`npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T098-hulebu-friend-demo-gradual-difficulty.md docs/tasks/claims/T098-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-01-lee.md`; `git diff --check` | 未填写 |
| T099 | 胡了卜试玩页卡槽满槽显示修复和记牌器 | Lee | 待验收 | 2026-06-02 | `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T099-hulebu-slot-visible-counter.md`, `docs/tasks/claims/T099-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查满 8 格卡槽和记牌器刷新；`npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T099-hulebu-slot-visible-counter.md docs/tasks/claims/T099-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-02-lee.md`; `git diff --check` | 未填写 |
| T100 | 胡了卜有限牌河、补杠和胡牌奖励核心玩法设计 | Lee | 待验收 | 2026-06-02 | `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T100-hulebu-river-kong-hu-core-design.md`, `docs/tasks/claims/T100-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-06-02-hulebu-river-kong-hu-core-design.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/DECISIONS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T100-hulebu-river-kong-hu-core-design.md docs/tasks/claims/T100-lee.md docs/superpowers/specs/2026-06-02-hulebu-river-kong-hu-core-design.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/DECISIONS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-02-lee.md`; `git diff --check` | 未填写 |
| T101 | 胡了卜有限牌河、补杠和胡牌奖励试玩 Demo | Lee | 待验收 | 2026-06-02 | `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T101-hulebu-river-kong-hu-demo.md`, `docs/tasks/claims/T101-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-06-02-hulebu-river-kong-hu-demo.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查牌河、任选打牌、明牌区、补杠、明杠开山和胡后清河；`npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T101-hulebu-river-kong-hu-demo.md docs/tasks/claims/T101-lee.md docs/superpowers/plans/2026-06-02-hulebu-river-kong-hu-demo.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-02-lee.md`; `git diff --check` | 未填写 |
| T102 | 胡了卜 Demo 站内网页小游戏发布接入 | Lee | 待验收 | 2026-06-02 | `apps/web/src/app/games/hulebu/page.tsx`, `apps/web/src/modules/games/hulebu/**`, `apps/web/public/games/hulebu-demo/**`, `apps/web/src/components/portal-data.ts`, `apps/web/src/components/AppHeader.tsx`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T102-hulebu-web-game-publish.md`, `docs/tasks/claims/T102-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**` | `npm run test -w apps/web -- hulebu`; `npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开 `/games/hulebu` 检查桌面和移动端 iframe 可玩、无横向溢出；`npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T102-hulebu-web-game-publish.md docs/tasks/claims/T102-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-02-lee.md`; `git diff --check` | 未填写 |
| T103 | 胡了卜立体窄腰牌山模板设计 | Lee | 已完成 | 2026-06-02 | `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T103-hulebu-stacked-waist-mountain-template-design.md`, `docs/tasks/claims/T103-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-06-02-hulebu-stacked-waist-mountain-template-design.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md` | `npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T103-hulebu-stacked-waist-mountain-template-design.md docs/tasks/claims/T103-lee.md docs/superpowers/specs/2026-06-02-hulebu-stacked-waist-mountain-template-design.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-02-lee.md`; `git diff --check` | 未填写 |
| T104 | 胡了卜悬台窄腰模板调牌器实现 | Lee | 待验收 | 2026-06-02 | `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `apps/web/public/games/hulebu-demo/tuner.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T104-hulebu-suspended-waist-template.md`, `docs/tasks/claims/T104-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-06-02-hulebu-suspended-waist-template.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; `npm run test -w apps/web -- hulebu`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开 `/games/hulebu-demo/tuner.html?template=suspended-waist` 检查调牌器可渲染；390px 移动端截图检查牌面、记牌器、动作栏、卡槽和底部道具不遮挡；`npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T104-hulebu-suspended-waist-template.md docs/tasks/claims/T104-lee.md docs/superpowers/plans/2026-06-02-hulebu-suspended-waist-template.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-02-lee.md`; `git diff --check` | 未填写 |
| T105 | 胡了卜震落牌平铺和遮挡点击修复 | Lee | 待验收 | 2026-06-03 | `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T105-hulebu-loose-tile-layer-blocking-fix.md`, `docs/tasks/claims/T105-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**` | `npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; `npm run test -w apps/web -- hulebu`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开 `/games/hulebu` 检查连续 `杠 / 胡` 后震落牌不互相叠起、被盖住的下层牌不可点；390px 移动端截图检查牌面、记牌器、动作栏、卡槽和底部道具不遮挡；`npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T105-hulebu-loose-tile-layer-blocking-fix.md docs/tasks/claims/T105-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-03-lee.md`; `git diff --check` | 未填写 |
| T106 | AI 面试助手规划 | Lee | 待验收 | 2026-06-03 | `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T106-ai-interview-coach-planning.md`, `docs/tasks/claims/T106-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-06-03-ai-interview-coach-design.md`, `docs/modules/ai-interview-coach/**`, `docs/progress/2026-06-03-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md` | `npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T106-ai-interview-coach-planning.md docs/tasks/claims/T106-lee.md docs/superpowers/specs/2026-06-03-ai-interview-coach-design.md docs/modules/ai-interview-coach/README.md docs/modules/ai-interview-coach/IMPLEMENTATION_PLAN.md docs/modules/ai-interview-coach/PROGRESS.md docs/modules/ai-interview-coach/DECISIONS.md docs/modules/ai-interview-coach/HANDOFF.md docs/progress/2026-06-03-lee.md`; `git diff --check` | 未填写 |
| T108 | 统一账号中心、产品型工具入口和 AI Gateway 规划 | Lee | 待验收 | 2026-06-03 | `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T108-platform-account-ai-gateway-planning.md`, `docs/tasks/claims/T108-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-06-03-platform-account-ai-gateway-design.md`, `docs/progress/2026-06-03-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md` | `npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T108-platform-account-ai-gateway-planning.md docs/tasks/claims/T108-lee.md docs/superpowers/specs/2026-06-03-platform-account-ai-gateway-design.md docs/progress/2026-06-03-lee.md`; `git diff --check` | 未填写 |
| T109 | 未命名任务 | 未填写 | 已完成 | 未填写 | `.env`, `apps/web/.env`, `docs/tasks/items/T109-supabase-to-self-hosted-postgres.md`, `docs/tasks/claims/T109-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/progress/2026-06-03-lee.md` | 源库和目标库连接检查；源库 `public` 表检查；目标库 `public` 表和行数检查；`npm exec prisma db push -w apps/web` | 未填写 |
| T110 | 未命名任务 | 未填写 | 待验收 | 未填写 | `apps/web/package.json`, `package-lock.json`, `apps/web/prisma/**`, `apps/web/src/lib/auth/**`, `apps/web/src/lib/account/**`, `apps/web/src/app/api/auth/**`, `apps/web/src/app/api/account/**`, `apps/web/src/app/login/**`, `apps/web/src/app/account/**`, `apps/web/src/components/account/**`, `apps/web/src/components/AppHeader.tsx`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**` | `npm exec prisma validate -w apps/web`; `npm run test -w apps/web -- account`; `npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; 使用 Codex App 内置浏览器检查 `/login` 和 `/account` 桌面端/移动端；`npm run docs:sync`; `git diff --check` | 未填写 |
| T111 | 未命名任务 | 未填写 | 待验收 | 未填写 | `.env.example`, `.env.production.example`, `apps/web/prisma/**`, `apps/web/src/lib/auth/**`, `apps/web/src/lib/account/**`, `apps/web/src/app/login/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**` | `npm exec prisma validate -w apps/web`; `npm exec prisma db push -w apps/web`; `npm run test -w apps/web -- email-login account`; `npm run typecheck -w apps/web`; `npm run lint -w apps/web`; `npm run build -w apps/web`; 使用 Kimi WebBridge 检查 `/login` 重复提交提示；`npm run docs:sync`; `git diff --check` | 未填写 |
| T112 | 未命名任务 | 未填写 | 待验收 | 未填写 | `apps/web/src/lib/account/**`, `apps/web/src/app/api/account/products/**`, `apps/web/src/components/account/**`, `apps/web/src/app/account/**`, `apps/web/prisma/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**` | `npm run test -w apps/web -- product-session account`; `npm run typecheck -w apps/web`; `npm run lint -w apps/web`; `npm run build -w apps/web`; 使用 Kimi WebBridge 检查 `/account` 产品 token 生成；`npm run docs:sync`; `git diff --check` | 未填写 |
| T113 | 产品型工具 token 消费接口 | Lee | 待验收 | 2026-06-03 | `apps/web/src/lib/account/**`, `apps/web/src/app/api/account/products/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**` | `npm run test -w apps/web -- product-session account`; `npm run typecheck -w apps/web`; `npm run lint -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check` | 未填写 |
| T114 | TimePick 同账号 PostgreSQL 迁移基座 | Lee | 待验收 | 2026-06-03 | `apps/web/prisma/**`, `apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/**`, `apps/web/src/generated/prisma/**`, `docs/tasks/**`, `docs/superpowers/plans/**`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**` | `npm exec prisma validate -w apps/web`; `npm run test -w apps/web -- timepick account`; `npm run typecheck -w apps/web`; `npm run lint -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check` | 未填写 |
| T115 | TimePick 前端同账号登录壳 | Lee | 待验收 | 2026-06-03 | `/Users/lee/Desktop/Lee/TimePick/package.json`, `/Users/lee/Desktop/Lee/TimePick/package-lock.json`, `/Users/lee/Desktop/Lee/TimePick/src/lib/**`, `/Users/lee/Desktop/Lee/TimePick/src/contexts/AuthContext.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/AuthGuard.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Login.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Register.tsx`, `docs/tasks/**`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**` | `npx eslint src/lib/dreamchasers-auth.ts src/contexts/AuthContext.tsx src/components/AuthGuard.tsx src/pages/Login.tsx src/pages/Register.tsx`（TimePick）；`npm run build`（TimePick）；`npm run docs:sync`；`git diff --check` | 未填写 |
| T116 | TimePick 文件夹和资源列表 API 切换 | Lee | 待验收 | 2026-06-03 | `apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/**`, `/Users/lee/Desktop/Lee/TimePick/src/components/FolderTree.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceList.tsx`, `docs/tasks/**`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**` | `npm run test -w apps/web -- timepick account`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/FolderTree.tsx src/components/ResourceList.tsx`（TimePick）；`npm run build`（TimePick）；`npm run docs:sync`; `git diff --check` | 未填写 |
| T117 | TimePick 文件夹新增和重命名 API 切换 | Lee | 待验收 | 2026-06-04 | `apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/folders/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/FolderDialog.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**` | `npm run test -w apps/web -- timepick account`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/FolderTree.tsx src/components/ResourceList.tsx src/components/FolderDialog.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查新建文件夹、重命名文件夹和同级重名提示；`npm run docs:sync`; `git diff --check` | 未填写 |
| T118 | TimePick 子文件夹卡片 API 切换 | Lee | 待验收 | 2026-06-04 | `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/SubFolderCard.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**` | `npm run test -w apps/web -- timepick account`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/FolderTree.tsx src/components/ResourceList.tsx src/components/FolderDialog.tsx src/components/SubFolderCard.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查子文件夹统计、删除子文件夹和拖拽资源到子文件夹；`npm run docs:sync`; `git diff --check` | 未填写 |
| T119 | TimePick 资源卡片删除 API 切换 | Lee | 待验收 | 2026-06-04 | `apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/resources/[resourceId]/route.ts`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**` | `npm run test -w apps/web -- timepick account`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/FolderTree.tsx src/components/ResourceList.tsx src/components/FolderDialog.tsx src/components/SubFolderCard.tsx src/components/ResourceCard.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查资源卡片删除；`npm run docs:sync`; `git diff --check` | 未填写 |
| T120 | TimePick 资源录入编辑 API 切换 | Lee | 待验收 | 2026-06-04 | `apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/resources/**`, `apps/web/src/app/api/timepick/sections/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceDialog.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**` | `npm run test -w apps/web -- timepick account`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/FolderTree.tsx src/components/ResourceList.tsx src/components/FolderDialog.tsx src/components/SubFolderCard.tsx src/components/ResourceCard.tsx src/components/ResourceDialog.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查新增资源和编辑资源；`npm run docs:sync`; `git diff --check` | 未填写 |
| T121 | TimePick 资源卡片自动识别更新 API 切换 | Lee | 待验收 | 2026-06-04 | `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**` | 静态红绿检查 `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx','utf8'); if (/\\.from\\('resources'\\)\\s*\\.update/.test(s)) process.exit(1)"`; `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/ResourceCard.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器只检查临时资源创建/清理，不要求旧 Coze 自动识别成功；`npm run docs:sync`; `git diff --check` | 未填写 |
| T123 | TimePick 资源预览心得保存 API 切换 | Lee | 待验收 | 2026-06-04 | `/Users/lee/Desktop/Lee/TimePick/src/components/ResourcePreview.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**` | 静态红绿检查 `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/components/ResourcePreview.tsx','utf8'); if (/from\\('resources'\\)\\s*\\.update/.test(s)) process.exit(1)"`; `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/ResourcePreview.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查资源预览保存心得；`npm run docs:sync`; `git diff --check` | 未填写 |
| T124 | TimePick 标签读取和管理 API 切换 | Lee | 待验收 | 2026-06-04 | `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/TagCloud.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/TagTree.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/TagManageDialog.tsx`, `docs/tasks/**`, `docs/superpowers/plans/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**` | 静态红绿检查 `node -e "const fs=require('fs'); for (const f of ['src/components/TagCloud.tsx','src/components/TagTree.tsx','src/components/TagManageDialog.tsx']) { const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/'+f,'utf8'); if (/integrations\\/supabase\|supabase\\.\|\\.from\\('resources'\\)\|\\.rpc\\('(delete_tag\|rename_tag)'\\)/.test(s)) process.exit(1); }"`；`npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/TagCloud.tsx src/components/TagTree.tsx src/components/TagManageDialog.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查标签读取、新增、重命名、删除；`npm run docs:sync`; `git diff --check` | 未填写 |
| T125 | TimePick 搜索页 API 切换 | Lee | 待验收 | 2026-06-04 | `apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/search/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/pages/SearchPage.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**` | 静态红绿检查 `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/pages/SearchPage.tsx','utf8'); if (/integrations\\/supabase\|supabase\\.\|\\.from\\('search_history'\\)\|\\.from\\('resources'\\)/.test(s)) process.exit(1)"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/pages/SearchPage.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查搜索资源、写入历史、读取历史、删除历史；`npm run docs:sync`; `git diff --check` | 未填写 |
| T126 | TimePick 灵感抽屉 API 切换 | Lee | 待验收 | 2026-06-04 | `apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/inspirations/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/InspirationDrawer.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/RecentInspirations.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**` | 静态红绿检查 `node -e "const fs=require('fs'); for (const f of ['src/components/InspirationDrawer.tsx','src/components/RecentInspirations.tsx']) { const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/'+f,'utf8'); if (/integrations\\/supabase\|supabase\\.\|\\.from\\('inspirations'\\)/.test(s)) process.exit(1); }"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/InspirationDrawer.tsx src/components/RecentInspirations.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查灵感新增、编辑、删除和转资源状态标记；`npm run docs:sync`; `git diff --check` | 未填写 |
| T127 | TimePick 角色选择 API 切换 | Lee | 待验收 | 2026-06-04 | `apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/role/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/lib/dreamchasers-auth.ts`, `/Users/lee/Desktop/Lee/TimePick/src/pages/RoleSelect.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Home.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**` | 静态红绿检查 `node -e "const fs=require('fs'); for (const f of ['src/pages/RoleSelect.tsx','src/pages/Home.tsx']) { const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/'+f,'utf8'); if (/integrations\\/supabase\|supabase\\.\|\\.from\\('user_roles'\\)/.test(s)) process.exit(1); }"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/pages/RoleSelect.tsx src/pages/Home.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查默认角色初始化和角色选择或切换；`npm run docs:sync`; `git diff --check` | 未填写 |
| T128 | TimePick 学习重点 API 切换 | Lee | 待验收 | 2026-06-04 | `apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/learning-focus/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/LearningFocusDialog.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**` | 静态红绿检查 `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/components/LearningFocusDialog.tsx','utf8'); if (/integrations\\/supabase\|supabase\\.\|\\.from\\('learning_focus'\\)/.test(s)) process.exit(1);"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/timepick-api.ts src/components/LearningFocusDialog.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查学习重点新增、同义词更新和删除；`npm run docs:sync`; `git diff --check` | 未填写 |
| T129 | TimePick 任务清单主链路 API 切换 | Lee | 待验收 | 2026-06-04 | `apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/todos/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/TodoPage.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/AddTodoDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/CompleteTodoDialog.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**` | 静态红绿检查 `node -e "const fs=require('fs'); for (const f of ['src/components/TodoPage.tsx','src/components/AddTodoDialog.tsx','src/components/CompleteTodoDialog.tsx']) { const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/'+f,'utf8'); if (/integrations\\/supabase\|supabase\\.\|\\.from\\('try_queue_links'\\)/.test(s)) process.exit(1); }"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/timepick-api.ts src/components/TodoPage.tsx src/components/AddTodoDialog.tsx src/components/CompleteTodoDialog.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查任务新增、开始、完成和删除；`npm run docs:sync`; `git diff --check` | 未填写 |
| T130 | TimePick Profile 页面 API 切换 | Lee | 待验收 | 2026-06-04 | `apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/profile/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Profile.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**` | 静态红绿检查 `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/pages/Profile.tsx','utf8'); if (/integrations\\/supabase\|supabase\\.\|\\.from\\('profiles'\\)\|\\.from\\('resources'\\)\|auth\\.updateUser\|auth\\.signInWithPassword/.test(s)) process.exit(1);"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/timepick-api.ts src/pages/Profile.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查 Profile 读取、生日更新和账号安全页跳转；`npm run docs:sync`; `git diff --check` | 已完成 DreamChasers profile API、TimePick Profile 页面切换和真实浏览器跳转检查；联调临时 session 已清理，`lee@example.com` 的 `TimePickProfile.birthDate` 保持 `NULL`。 |
| T131 | TimePick 首页每日抽签弹窗 API 切换 | Lee | 待验收 | 2026-06-04 | `apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/fortune/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/FortuneDrawDialog.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**` | 静态红绿检查 `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/components/FortuneDrawDialog.tsx','utf8'); if (/integrations\\/supabase\|supabase\\.\|\\.from\\('profiles'\\)\|functions\\.invoke\\('draw-fortune'\\)/.test(s)) process.exit(1);"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/timepick-api.ts src/components/FortuneDrawDialog.tsx`（TimePick）；`npm run build`（TimePick）；真实浏览器检查未设置生日提示、保存生日、抽签结果和同日缓存；`npm run docs:sync`; `git diff --check` | 已完成 DreamChasers fortune draw API、TimePick `FortuneDrawDialog` 切换和真实浏览器/API 联调；联调临时 session、今日抽签记录已清理，`lee@example.com` 的 `TimePickProfile.birthDate` 保持 `NULL`。 |
| T132 | TimePick 剩余 Supabase 直连清零 | Lee | 待验收 | 2026-06-04 | `apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Fortune.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/BatchImportDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/TodoSimple.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/TodoPageSimple.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ModuleDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceTree.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/integrations/supabase/**`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**` | 全局静态扫描 `rg -n "integrations/supabase\|supabase\\.\|\\.from\\('\|\\.rpc\\(\|functions\\.invoke\|storage\\." /Users/lee/Desktop/Lee/TimePick/src --glob '!**/node_modules/**'` 应无结果；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；TimePick 定向 ESLint；`npm run build`（TimePick）；`npm run docs:sync`; `git diff --check` | TimePick `src` 已无 Supabase import/调用；部分旧高成本能力按 T132 边界降级为 DreamChasers API 或本地占位。 |
| T133 | 未命名任务 | 未填写 | 待验收 | 未填写 | `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T133-account-center-redesign.md`, `docs/tasks/claims/T133-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-06-04-account-center-redesign-design.md`, `docs/progress/2026-06-04-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md` | `npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T133-account-center-redesign.md docs/tasks/claims/T133-lee.md docs/superpowers/specs/2026-06-04-account-center-redesign-design.md docs/progress/2026-06-04-lee.md`; `git diff --check` | 未填写 |
| T134 | 未命名任务 | 未填写 | 待验收 | 未填写 | `docs/tasks/items/T134-account-center-redesign-implementation-plan.md`, `docs/tasks/claims/T134-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-06-04-account-center-redesign.md`, `docs/progress/2026-06-04-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md` | `npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T134-account-center-redesign-implementation-plan.md docs/tasks/claims/T134-lee.md docs/superpowers/plans/2026-06-04-account-center-redesign.md docs/progress/2026-06-04-lee.md`; `git diff --check` | 未填写 |
| T135 | 未命名任务 | 未填写 | 未填写 | 2026-06-04 | 未填写 | 未填写 | 未填写 |
| T136 | 未命名任务 | 未填写 | 未填写 | 2026-06-04 | 未填写 | 未填写 | 未填写 |
| T137 | 未命名任务 | 未填写 | 未填写 | 2026-06-04 | 未填写 | 未填写 | 未填写 |
| T138 | 未命名任务 | 未填写 | 未填写 | 2026-06-04 | 未填写 | 未填写 | 未填写 |
| T139 | 未命名任务 | 未填写 | 未填写 | 2026-06-04 | 未填写 | 未填写 | 未填写 |
| T140 | 未命名任务 | 未填写 | 未填写 | 2026-06-04 | 未填写 | 未填写 | 未填写 |
| T141 | 未命名任务 | 未填写 | 未填写 | 2026-06-04 | 未填写 | 未填写 | 未填写 |
| T142 | 平台能力、用户资产留存和工作流自动化第一阶段规划 | Lee | 待验收 | 2026-06-05 | `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T142-platform-capability-retention-workflow-planning.md`, `docs/tasks/claims/T142-lee.md`, `docs/superpowers/specs/2026-06-05-platform-capability-retention-workflow-design.md`, `docs/progress/2026-06-05-lee.md`, `docs/completion/2026-06-05-task-142-platform-capability-retention-workflow-planning.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md` | `npm run docs:sync`; `rg -n "T[B]D\|T[O]DO\|待[补]" docs/tasks/items/T142-platform-capability-retention-workflow-planning.md docs/tasks/claims/T142-lee.md docs/superpowers/specs/2026-06-05-platform-capability-retention-workflow-design.md docs/progress/2026-06-05-lee.md docs/completion/2026-06-05-task-142-platform-capability-retention-workflow-planning.md`; `git diff --check` | 本任务只做规划，不进入应用代码实现；已按 Lee 选择的 `平台优先` 路线，把工作流自动化作为第五层纳入规划。 |
<!-- DOCS_SYNC_CLAIMS_END -->
