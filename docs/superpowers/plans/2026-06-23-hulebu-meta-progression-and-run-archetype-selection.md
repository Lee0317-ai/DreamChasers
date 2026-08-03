# 胡了卜局外成长与局内流派开局改造实施计划

> **给执行型 agent 的要求：** 实施本计划时，必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans`，并按任务逐项推进。所有步骤都使用复选框 `- [ ]` 语法跟踪。

**目标：** 把 `/games/hulebu` 重构为“长期强度来自局外成长，而每一局的打法由开局前明确选择的流派决定”的结构。

**架构：** 保留当前 Web 壳层加可玩 HTML 原型的双层结构，但把原来跨多关持续生长的路线挂载降级成局外偏好与解锁系统。新增一层“开局流派选择”，把明确的开局修正传给内层原型，再把奖励、事件和 Boss 检查重心从“你这几关慢慢长成了什么”改成“你这局选了什么打法”。

**技术栈：** Next.js 壳层、客户端 React 状态、静态 HTML 原型、站内静态 Demo 镜像、`apps/web` 与 `packages/shared` 下的 Vitest 回归、`docs:sync` 文档同步流程。

---

## 文件地图

- 修改：`apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`
- 修改：`apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`
- 修改：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- 修改：`apps/web/public/games/hulebu-demo/index.html`
- 修改：`packages/shared/src/mahjong-config-playable-prototype.test.ts`
- 修改：`apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`
- 修改：`docs/modules/mahjong-roguelike/README.md`
- 修改：`docs/modules/mahjong-roguelike/PROGRESS.md`
- 修改：`docs/modules/mahjong-roguelike/HANDOFF.md`
- 修改：`docs/tasks/items/T186-hulebu-meta-progression-and-run-archetype-plan.md`
- 修改：`docs/tasks/claims/T186-lee.md`
- 修改：`docs/tasks/TASK_BOARD.md`
- 修改：`docs/tasks/CLAIMS.md`
- 修改：`docs/status/CURRENT_STATUS.md`
- 修改：`docs/tasks/CHANGE_INTAKE.md`

## 产品方向

- 长期成长来自局外资产、升级、解锁和携带能力。
- 每一局真正的打法来自开局前选择的 `局内流派`。
- 旧 `路线挂载` 只保留为局外偏好和轻协同，不再定义整局 build 身份。
- 前 20 关负责渐进解锁和引导；20 关后以及长期模式开始前开放自由流派开局。

## 实施任务

### 任务 1：先锁定产品模型与术语

**文件：**
- 修改：`docs/tasks/CHANGE_INTAKE.md`
- 修改：`docs/tasks/items/T186-hulebu-meta-progression-and-run-archetype-plan.md`
- 修改：`docs/modules/mahjong-roguelike/README.md`

- [ ] 为这次方向调整补一条变更卡。
- [ ] 补齐 T186 的任务元数据、作用范围和边界。
- [ ] 把模块 README 里“跨多关 build 一条路线”的表述，统一改成“局外成长 + 每局开局选流派”。
- [ ] 运行：`rg -n "局外|流派|开局" docs/tasks/CHANGE_INTAKE.md docs/tasks/items/T186-hulebu-meta-progression-and-run-archetype-plan.md docs/modules/mahjong-roguelike/README.md`
- [ ] 提交这一组纯文档的方向校正。

### 任务 2：把局外成长重心改成解锁与携带能力

**文件：**
- 修改：`apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`
- 修改：`apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`
- 测试：`apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`

- [ ] 先补失败测试，锁定 `RUN_ARCHETYPES`、`selectedRunArchetype` 和新的开局选择面板。
- [ ] 在壳层里新增 `chi / peng / gang / hu / tool / vision` 六个流派的状态与配置。
- [ ] 新增紧凑的开局流派卡片，解释 `本局收益`、`起手加成` 和 `奖励倾向`。
- [ ] 把所有开局入口收口到统一的 `startRunWithArchetype()` 帮助函数。
- [ ] 运行：`npm run test -w apps/web -- hulebu -- --runInBand`
- [ ] 提交壳层这一组改动。

### 任务 3：把内层原型改成“按开局流派驱动”

**文件：**
- 修改：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- 修改：`apps/web/public/games/hulebu-demo/index.html`
- 测试：`packages/shared/src/mahjong-config-playable-prototype.test.ts`

- [ ] 先补失败测试，锁定 `RUN_ARCHETYPE_CONFIGS`、`getRunArchetypeConfig()` 和流派 query 参数解析。
- [ ] 在两份原型文件里解析 `runArchetype` URL 参数。
- [ ] 为不同流派应用不同的开局加成、奖励加权和事件加权。
- [ ] 保持站内静态 Demo 与原型源头同步。
- [ ] 运行：
  - `npm run test -w packages/shared -- mahjong-config-playable-prototype`
  - `perl -0ne 'print $1 if /<script>([\\s\\S]*?)<\\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-inline.js && node --check /tmp/hulebu-config-playable-inline.js`
  - `perl -0ne 'print $1 if /<script>([\\s\\S]*?)<\\/script>/' apps/web/public/games/hulebu-demo/index.html > /tmp/hulebu-static-inline.js && node --check /tmp/hulebu-static-inline.js`
- [ ] 提交原型层这一组改动。

### 任务 4：把旧路线挂载降级成局外偏好与轻协同

**文件：**
- 修改：`apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`
- 修改：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- 修改：`apps/web/public/games/hulebu-demo/index.html`
- 测试：`apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`

- [ ] 先补失败测试，明确路线偏好不再是“本局身份”的主来源。
- [ ] 把路线挂载在 UI 上统一改写成 `局外偏好`。
- [ ] 把路线效果限制成小额折扣、解锁倾向或一步轻协同，不再绑定整局成长。
- [ ] 保持 `selectedRunArchetype` 才是这局真正的身份。
- [ ] 运行：
  - `npm run test -w apps/web -- hulebu -- --runInBand`
  - `npm run test -w packages/shared -- mahjong-config-playable-prototype`
- [ ] 提交这组“路线降级”改动。

### 任务 5：按“本局流派”重做奖励、事件与 Boss 压力

**文件：**
- 修改：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- 修改：`apps/web/public/games/hulebu-demo/index.html`
- 测试：`packages/shared/src/mahjong-config-playable-prototype.test.ts`
- 修改：`docs/modules/mahjong-roguelike/PROGRESS.md`

- [ ] 先补失败测试，锁定基于流派的奖励与事件加权帮助函数。
- [ ] 让奖励和事件更偏向这局选中的流派，但仍保留适度转线空间。
- [ ] 把 Boss 压力改成更像检查“这局打法有没有成立”，而不是默认叠无关副题。
- [ ] 更新 `PROGRESS.md`，记录这一轮逻辑迁移。
- [ ] 运行：`npm run test -w packages/shared -- mahjong-config-playable-prototype`
- [ ] 提交这一组节奏重构。

### 任务 6：补齐解锁顺序、携带成长和 20 关后的结构

**文件：**
- 修改：`apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`
- 修改：`apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`
- 修改：`apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`
- 修改：`docs/modules/mahjong-roguelike/HANDOFF.md`

- [ ] 先补失败测试，锁定主线前 20 关的引导式解锁，以及 20 关后自由流派开局。
- [ ] 在前 20 关里补“推荐流派”与解锁状态 UI。
- [ ] 对无尽、每日、高阶和 20 关后主线，开放自由流派选择。
- [ ] 更新 `HANDOFF.md`，明确后续实现不能再漂回“路线即职业”的旧读法。
- [ ] 运行：`npm run test -w apps/web -- hulebu -- --runInBand`
- [ ] 提交流程成长与解锁这一组改动。

### 任务 7：同步任务体系并做整体验证

**文件：**
- 修改：`docs/tasks/TASK_BOARD.md`
- 修改：`docs/tasks/CLAIMS.md`
- 修改：`docs/status/CURRENT_STATUS.md`
- 修改：`docs/tasks/claims/T186-lee.md`
- 修改：`docs/tasks/items/T186-hulebu-meta-progression-and-run-archetype-plan.md`

- [ ] 把任务行和领取摘要补进任务体系。
- [ ] 在当前状态文档里补上这次主线结构转向。
- [ ] 运行：
  - `npm run docs:sync`
  - `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T186-hulebu-meta-progression-and-run-archetype-plan.md docs/tasks/claims/T186-lee.md docs/superpowers/plans/2026-06-23-hulebu-meta-progression-and-run-archetype-selection.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`
  - `git diff --check`
- [ ] 提交这组任务与文档同步改动。

## 自检

- 这份计划覆盖了壳层入口、原型参数传递、路线降级、奖励/事件/Boss 迁移和 20 关后结构。
- 这份计划默认不切引擎，继续沿用当前 Web 壳层加 HTML 原型结构。
- 最大回归风险是语义偷偷漂回“路线即宿命”，所以测试和文档都要明确防住这件事。

## 执行交接

计划已保存到 `docs/superpowers/plans/2026-06-23-hulebu-meta-progression-and-run-archetype-selection.md`。接下来有两种执行方式：

**1. Subagent-Driven（推荐）** - 我按任务逐项派发新的子 agent，逐项 review，迭代更快

**2. Inline Execution** - 我在当前会话里按计划直接执行，用检查点分批推进

**你要我按哪种方式继续？**
