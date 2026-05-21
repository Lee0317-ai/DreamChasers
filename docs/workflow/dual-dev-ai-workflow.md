# 双人开发与 AI 同步规范

**最后更新**：2026-05-19  
**适用范围**：两名开发者、两位想法/验收成员，以及各自使用的 AI 助手。

## 1. 核心原则

- 先读文档，再写代码。
- 先领取任务，再改文件。
- 每次只做一个明确任务。
- 每个任务必须有负责人。
- 每个任务必须有验证方式。
- 完成后必须更新状态。
- 不要让两个 AI 同时改同一批文件。

## 2. 每次开工前流程

开发者或 AI 开始工作前，必须按顺序执行：

1. 读取 `docs/PROJECT_CONTEXT.md`。
2. 读取 `docs/status/CURRENT_STATUS.md`。
3. 读取 `docs/tasks/TASK_BOARD.md`。
4. 读取 `docs/tasks/CLAIMS.md`。
5. 读取 `docs/tasks/CHANGE_INTAKE.md`。
6. 读取当前任务对应的计划文档。
7. 在 `docs/tasks/CLAIMS.md` 中新增领取记录。
8. 在 `docs/status/CURRENT_STATUS.md` 中确认任务负责人和文件范围。
9. 如果文件范围不清楚，先补文档，不直接编码。

## 3. 任务领取格式

在 `docs/status/CURRENT_STATUS.md` 中用下面格式记录：

```md
### 当前任务

- 任务编号：
- 任务名称：
- 负责人：
- 状态：未开始 / 进行中 / 待验收 / 已完成 / 阻塞
- 开始时间：
- 允许修改文件：
- 禁止修改文件：
- 验证命令：
- 当前阻塞：
- 下一步：
```

## 4. 文件所有权建议

### 模块独立目录规则

每个小工具或游戏都必须有独立模块文档文件夹：

- `docs/modules/<module-slug>/README.md`
- `docs/modules/<module-slug>/IMPLEMENTATION_PLAN.md`
- `docs/modules/<module-slug>/PROGRESS.md`
- `docs/modules/<module-slug>/DECISIONS.md`
- `docs/modules/<module-slug>/HANDOFF.md`

每个小工具或游戏的代码也必须放在独立模块目录：

- Web 工具：`apps/web/src/modules/tools/<module-slug>/`
- Web 游戏接入：`apps/web/src/modules/games/<module-slug>/`
- 正式游戏工程：`apps/game/<module-slug>/`

`apps/web/src/app/**` 下的路由只做入口、元数据和模块挂载，不承载大量业务逻辑。

### 开发 A 默认负责

- `package.json`
- `tsconfig.base.json`
- `apps/web/**`
- `apps/web/prisma/**`
- `apps/web/src/lib/db.ts`
- `apps/web/src/lib/content/**`
- `apps/web/src/app/admin/**`
- `apps/web/src/app/tools/pdf-toolbox/**`
- `apps/web/src/modules/tools/pdf-toolbox/**`

### 开发 B 默认负责

- `packages/shared/**`
- `apps/web/src/lib/ai/**`
- `apps/web/src/components/ai/**`
- `apps/web/src/app/tools/ai-photo-editor/**`
- `apps/web/src/components/tools/photo/**`
- `apps/web/src/lib/tools/photo/**`
- `apps/game/**`
- `apps/web/src/components/game/**`
- `apps/web/src/lib/analytics/**`

### 共享但需要提前沟通的文件

- `apps/web/src/app/page.tsx`
- `apps/web/src/lib/content/seed-content.ts`
- `apps/web/src/components/content/**`
- `docker-compose.yml`
- `.env.example`
- `docs/status/CURRENT_STATUS.md`

修改共享文件前，先在状态文档写明原因和计划。

## 5. 分支和提交建议

如果使用 Git，建议：

- 开发 A 分支：`feature/platform-foundation`
- 开发 B 分支：`feature/ai-photo-game`
- 文档同步分支：`docs/planning-sync`

提交粒度：

- 一个任务一个提交。
- 不把无关改动放进同一个提交。
- 提交信息使用英文简短格式：
  - `chore: create monorepo shell`
  - `feat: add pdf toolbox mvp`
  - `feat: add photo editor mvp`
  - `feat: add mahjong roguelike rules`
  - `docs: update project status`

## 6. AI 会话启动提示词

每个开发者可以把下面内容发给自己的 AI：

```md
请先读取并遵守以下文档：

1. docs/PROJECT_CONTEXT.md
2. docs/status/CURRENT_STATUS.md
3. docs/tasks/TASK_BOARD.md
4. docs/tasks/CLAIMS.md
5. docs/tasks/CHANGE_INTAKE.md
6. docs/plans/2026-05-19-tool-game-ai-platform-implementation.md
7. docs/workflow/dual-dev-ai-workflow.md

本次只执行我领取的任务，不要修改其他负责人范围内的文件。
开始前请先复述任务目标、允许修改文件、验证命令和完成后需要更新的文档。
```

## 7. 完成任务后的记录要求

每完成一个任务，必须更新：

1. `docs/status/CURRENT_STATUS.md`
2. `docs/tasks/TASK_BOARD.md`
3. `docs/tasks/CLAIMS.md`
4. 如有新想法或需求变更，更新 `docs/tasks/CHANGE_INTAKE.md`
5. 对应的进展文件：`docs/progress/YYYY-MM-DD.md`
6. 如果任务完整完成，再写完成记录：`docs/completion/<task-name>.md`

完成记录至少包含：

- 完成时间。
- 负责人。
- 修改文件。
- 实现内容。
- 验证命令。
- 验证结果。
- 遗留问题。

## 8. 冲突处理

如果两个人或两个 AI 都要改同一个文件：

1. 先暂停其中一方。
2. 在 `docs/status/CURRENT_STATUS.md` 标记冲突。
3. 明确谁先改、谁后改。
4. 后改的人必须先读前一个人的变更。
5. 不允许直接覆盖对方改动。

## 9. 阻塞处理

遇到阻塞时，不要继续扩大改动范围。

阻塞记录格式：

```md
### 阻塞记录

- 时间：
- 负责人：
- 任务：
- 阻塞点：
- 已尝试：
- 需要谁决策：
- 建议方案：
```

## 10. 验收规则

每个任务至少满足：

- 计划中列出的验证命令通过。
- 页面或功能能被实际访问。
- 状态文档已更新。
- 没有修改不属于自己范围的文件。
- 没有新增乱码或非 UTF-8 文件。

涉及前端页面的任务，还要做：

- 桌面端检查。
- 移动端检查。
- 文案不溢出。
- 主要按钮可点击。
- 空状态可理解。

## 11. AGENTS.md 和 CLAUDE.md 入口规则

项目根目录已经放置：

- `AGENTS.md`
- `CLAUDE.md`

这两个文件是 AI 启动时最容易被读取的入口文件，用来强制提示 AI 在任务前读取项目上下文。

使用要求：

- 开发者应尽量从 `D:\DreamChasers` 根目录启动 AI。
- Codex 类 AI 应优先遵守 `AGENTS.md`。
- Claude / Claude Code 类 AI 应优先遵守 `CLAUDE.md`。
- 如果从子目录启动，必须先回到根目录或手动要求 AI 读取根目录入口文件。
- 每次修改代码前，必须先在 `docs/tasks/CLAIMS.md` 领取任务。
- 每次出现新想法或需求变更时，必须先写入 `docs/tasks/CHANGE_INTAKE.md`，再进入任务池。

注意：普通 Markdown 文档不会被所有 AI 自动读取。要保证 AI 看到规则，必须让 AI 的工作目录包含 `AGENTS.md` 或 `CLAUDE.md`，并在每次新会话开始时要求它复述当前任务边界。

## 12. 新想法处理规则

当任意一方提出新想法，或让 AI 帮忙规划并实施一个新功能时：

1. 不允许直接编码。
2. 先在 `docs/tasks/CHANGE_INTAKE.md` 新增变更卡。
3. 评估是否影响现有任务、共享文件、另一方负责人范围。
4. 如果要做，写入 `docs/tasks/TASK_BOARD.md`。
5. 如果涉及文件冲突，写入 `docs/tasks/CLAIMS.md`。
6. 只有任务状态为 `待领取`，且有人在 `CLAIMS.md` 领取后，才能实施。

这样另一方在规划自己的任务时，可以通过任务池和领取记录看到新增工作，避免冲突。
