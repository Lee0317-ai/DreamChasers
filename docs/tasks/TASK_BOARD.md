# 任务池

**最后更新**：2026-05-23
**用途**：统一记录所有待做、进行中、待验收、已完成的任务。  
**维护规则**：双方都可以新增和修改任务，但必须保留任务编号，不要删除历史任务。

## 1. 状态说明

- `待拆分`：想法已确定，但还没有拆成可执行任务。
- `待领取`：任务清楚，可以开始。
- `进行中`：已被某人领取。
- `待验收`：实现完成，等待另一人或验收成员确认。
- `已完成`：验证通过，完成记录已写。
- `阻塞`：暂时无法继续，需要决策。
- `暂停`：当前阶段不做。

## 2. 优先级说明

- `P0`：基础阻塞，必须优先。
- `P1`：第一阶段 MVP 必须完成。
- `P2`：上线前建议完成。
- `P3`：后续优化。

## 3. 任务列表

| 编号 | 优先级 | 任务 | 默认负责人 | 状态 | 依赖 | 主要文件范围 | 验证方式 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T001 | P0 | 创建 Monorepo 外壳 | 开发 A | 已完成 | 无 | `package.json`, `tsconfig.base.json`, `apps/**`, `packages/**` | `npm run test` |
| T002 | P0 | 搭建 Web 应用 | 开发 A | 已完成 | T001 | `apps/web/**` | `npm run lint -w apps/web`, `npm run build -w apps/web` |
| T003 | P0 | 添加共享领域类型 | 开发 B | 待领取 | T001 | `packages/shared/**` | `npm run test -w packages/shared` |
| T004 | P0 | 添加数据库和 Prisma 模型（Supabase PostgreSQL） | 开发 A | 已完成 | T002, T003 | `apps/web/prisma/**`, `apps/web/src/lib/db.ts`, `docker-compose.yml` | `npm exec prisma validate -w apps/web` |
| T005 | P1 | 添加第一批种子内容 | 开发 A | 待领取 | T004 | `apps/web/prisma/seed.ts`, `apps/web/src/lib/content/**` | `npm exec prisma db seed -w apps/web` |
| T006 | P1 | 实现内容查询层 | 开发 A | 待领取 | T004, T005 | `apps/web/src/lib/content/**` | `npm run test -w apps/web -- content` |
| T007 | P1 | 实现公开门户页面 | 开发 A | 待领取 | T006 | `apps/web/src/app/**`, `apps/web/src/components/content/**` | `npm run build -w apps/web` |
| T008 | P1 | 添加 AI 搜索 MVP | 开发 B | 待领取 | T003, T006 | `apps/web/src/lib/ai/**`, `apps/web/src/components/ai/**`, `apps/web/src/app/api/ai/**` | `npm run test -w apps/web -- ai` |
| T009 | P1 | 添加后台 MVP | 开发 A | 待领取 | T004, T006 | `apps/web/src/app/admin/**`, `apps/web/src/lib/admin/**` | `npm run build -w apps/web` |
| T010 | P1 | 添加使用模式和变现基础 | 开发 A | 待领取 | T003, T007 | `apps/web/src/lib/billing/**`, `apps/web/src/components/billing/**` | `npm run test -w apps/web -- billing` |
| T011 | P1 | 添加游戏发布基础 | 开发 B | 待领取 | T003, T019 | `apps/game/**`, `apps/web/src/components/game/**` | `npm run build -w apps/web` |
| T012 | P2 | 添加埋点和热门排序 | 开发 B | 待领取 | T006, T007 | `apps/web/src/lib/analytics/**`, `apps/web/src/app/api/events/**` | `npm run test -w apps/web -- analytics` |
| T013 | P2 | 添加部署文件 | 开发 B | 待领取 | T002, T004 | `deploy/**`, `apps/web/Dockerfile`, `docker-compose.yml` | `docker compose config`, `npm run build -w apps/web` |
| T014 | P2 | 添加上线清单和运营手册 | 两人协作 | 待领取 | T001 | `docs/checklists/**`, `docs/operations/**` | 文档自审 |
| T015 | P1 | 实现 PDF 工具箱 MVP | 开发 A | 进行中 | T025 | `apps/web/src/app/tools/pdf-toolbox/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/web/src/components/portal-data.ts`, `apps/web/package.json`, `package-lock.json`, `docs/modules/pdf-toolbox/**` | `npm run test -w apps/web -- pdf`; `npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; 桌面端和移动端检查 |
| T016 | P1 | 实现 AI 修图工具 MVP | 开发 B | 待领取 | T007, T010 | `apps/web/src/app/tools/ai-photo-editor/**`, `apps/web/src/components/tools/photo/**`, `apps/web/src/lib/tools/photo/**` | `npm run test -w apps/web -- photo` |
| T017 | P1 | 实现麻将 Roguelike 消除 MVP | 开发 B | 待领取 | T003, T011, T019 | `apps/game/mahjong-roguelike/**`, `packages/shared/src/mahjong-game.ts` | `npm run test -w packages/shared -- mahjong` |
| T018 | P0 | 建立 Git 忽略规则和协作入口 | 开发 A | 已完成 | 无 | `.gitignore`, `README.md`, `.claude/settings.local.json`, `.obsidian/workspace.json`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-19.md`, `docs/completion/**` | `git status --porcelain=v1 -uall`; `git check-ignore`; UTF-8 无 BOM 检查 |
| T019 | P1 | 确认 GDevelop 游戏模块定位 | 开发 B | 已完成 | 无 | `docs/PROJECT_CONTEXT.md`, `docs/plans/**`, `docs/superpowers/specs/**`, `docs/decisions/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**` | 文档自审；UTF-8 无 BOM 检查 |
| T020 | P1 | 添加 GDevelop Web 游戏原型通道 | 开发 B | 待领取 | T001, T003, T011, T019 | `apps/game/gdevelop/**`, `apps/game/publishing/gdevelop-web-export.md`, `apps/web/src/modules/games/**`, `apps/web/src/app/games/**`, `packages/shared/src/game-engine.ts`, `docs/modules/mahjong-roguelike/**` | `npm run build -w apps/web`; 文档自审 |
| T021 | P2 | AI 内容转换工具箱规划 | 两人协作 | 已完成 | 无 | `docs/PROJECT_CONTEXT.md`, `docs/plans/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**` | 文档自审；UTF-8 无 BOM 检查 |
| T022 | P1 | 按 `docs/网站UI.zip` 适配前端门户 UI | 开发 A | 已完成 | T002 | `apps/web/src/app/**`, `apps/web/src/components/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**` | `npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; 桌面端和移动端检查 |
| T023 | P1 | 补充 Supabase 数据库交接文档 | 开发 A | 已完成 | T004 | `docs/handoffs/**`, `docs/decisions/**`, `docs/status/CURRENT_STATUS.md`, `docs/tasks/**`, `docs/progress/2026-05-20.md`, `docs/completion/**` | 文档自审；连接参数说明完整 |
| T024 | P0 | 修复 Vercel 子目录 Next.js 识别失败 | 开发 A | 已完成 | T002 | `apps/web/package.json`, `package-lock.json`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`, `docs/completion/**` | `npm run build -w apps/web` |
| T025 | P1 | 拆分独立工具站和游戏站入口体验 | 开发 A | 已完成 | T022 | `apps/web/src/app/**`, `apps/web/src/components/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/**` | `npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; 桌面端和移动端检查 |
| T026 | P0 | 建立工具/游戏独立模块归档规范 | 两人协作 | 已完成 | 无 | `docs/modules/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/**` | 文档自审；UTF-8 无 BOM 检查 |
| T027 | P0 | 补充 AGENTS.md 文档输出格式规则 | Codex / 开发 A | 已完成 | 无 | `AGENTS.md`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/**` | 文档自审；UTF-8 无 BOM 检查 |
| T028 | P0 | 将独立模块归档规则写入整体架构 | 两人协作 | 已完成 | T026 | `AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/PROJECT_CONTEXT.md`, `docs/superpowers/specs/**`, `docs/plans/**`, `docs/workflow/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/**` | 文档自审；旧路径扫描；UTF-8 无 BOM 检查 |
| T029 | P1 | 麻将 Roguelike 消除框架调研和规划 | Codex / 开发 B | 已完成 | T019, T026, T028 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-21.md`, `docs/completion/**` | 文档自审；UTF-8 无 BOM 检查 |
| T030 | P1 | 麻将 Roguelike 手动组合和成长系统规划 | Codex / 开发 B | 已完成 | T029 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 文档自审；UTF-8 无 BOM 检查 |
| T031 | P1 | 麻将 Roguelike 最终模式结构定稿 | Codex / 开发 B | 已完成 | T030 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 文档自审；UTF-8 无 BOM 检查 |
| T032 | P1 | 麻将 Roguelike 高阶挑战系统规划 | Codex / 开发 B | 已完成 | T031 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 文档自审；UTF-8 无 BOM 检查 |
| T033 | P1 | 麻将 Roguelike 组合提示和牌堆生成规则 | Codex / 开发 B | 已完成 | T032 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 文档自审；UTF-8 无 BOM 检查 |
| T034 | P1 | 麻将 Roguelike 牌谱记牌器规划 | Codex / 开发 B | 已完成 | T033 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 文档自审；UTF-8 无 BOM 检查 |
| T035 | P1 | 麻将 Roguelike 局内能力池规划 | Codex / 开发 B | 已完成 | T034 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 文档自审；UTF-8 无 BOM 检查 |
| T036 | P0 | 降低多人协作文档冲突的分片同步规范 | Codex / 两人协作 | 已完成 | 无 | `AGENTS.md`, `CLAUDE.md`, `docs/PROJECT_CONTEXT.md`, `docs/workflow/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 文档自审；UTF-8 无 BOM 检查 |
| T037 | P0 | 新增 docs:sync 自动汇总脚本 | Codex / 两人协作 | 已完成 | T036 | `package.json`, `scripts/docs-sync.mjs`, `docs/workflow/doc-sync-policy.md`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | `npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查 |
| T038 | P1 | 麻将 Roguelike 永久固化能力和卡槽系统规划 | Codex / 开发 B | 已完成 | T030, T032, T035 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 文档自审；UTF-8 无 BOM 检查 |
| T039 | P1 | 条件启用 Next.js standalone 自托管构建 | Codex / 开发 A | 已完成 | T024, T025 | `apps/web/next.config.ts`, `apps/web/package.json`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | `npm run build -w apps/web`; `npm run build:standalone -w apps/web`; 检查 `apps/web/.next/standalone` |
| T040 | P1 | 麻将 Roguelike 完整牌局规则、经济体力和失败救场规划 | Codex / 开发 B | 已完成 | T030, T033, T034, T035, T038 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | `npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查 |
| T041 | P1 | 麻将 Roguelike 团队评审版玩法方案 | Codex / 开发 B | 已完成 | T030, T031, T032, T033, T034, T035, T038, T040 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | `npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查 |
| T042 | P1 | 麻将 Roguelike MVP 玩法验证计划 | Codex / 开发 B | 已完成 | T041 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**` | `npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查 |
| T043 | P1 | 麻将 Roguelike 最小可玩闭环和 MVP 开发拆分计划 | Codex / 开发 B | 已完成 | T042 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**` | `npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查；`git diff --check` |
| T044 | P1 | 麻将 Roguelike 最小可玩验证原型 | Codex / 开发 B | 已完成 | T043 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**` | `npm run docs:sync`; 浏览器桌面端检查；浏览器移动端检查；UTF-8 无 BOM 检查；`git diff --check` |

## 4. 新增任务模板

新增任务时复制这个模板，并放到任务列表下方或新表格中。

```md
### TXXX：任务名称

- 优先级：
- 默认负责人：
- 状态：待拆分
- 背景：
- 目标：
- 不做：
- 依赖：
- 主要文件范围：
- 验证方式：
- 拆分子任务：
```

## 5. 修改规则

- 可以新增任务。
- 可以调整优先级。
- 可以调整默认负责人。
- 可以补充依赖和验证方式。
- 不要删除任务。
- 已完成任务不要改状态回退，除非在 `docs/tasks/CLAIMS.md` 写明原因。
- 如果任务文件范围冲突，必须先登记领取和冲突。
- 后续任务过程细节优先写入 `docs/tasks/items/` 的任务分片；本文档只在新增任务、状态变化、阻塞、冲突、交接和完整任务完成时更新。

## 6. 新想法入池规则

任何一方有新想法，或让 AI 帮忙规划新功能时，不能直接改代码。

必须先执行：

1. 在 `docs/tasks/CHANGE_INTAKE.md` 新增变更卡。
2. 判断是否影响现有任务和另一方文件范围。
3. 如果要做，把它写入本任务池，状态设为 `待拆分` 或 `待领取`。
4. 如果涉及文件冲突，在 `docs/tasks/CLAIMS.md` 登记冲突。
5. 只有任务进入 `待领取` 并被领取后，才能实施。
6. 任务执行中的分步记录写入 `docs/tasks/items/`、`docs/tasks/claims/`、模块进展或当天进展；完整任务结束后再汇总回主文档。

新增任务时必须填写：

- 任务编号。
- 优先级。
- 默认负责人。
- 状态。
- 依赖。
- 主要文件范围。
- 验证方式。

<!-- DOCS_SYNC_TASKS_START -->
## 7. 自动生成任务分片摘要

> 本节由 `npm run docs:sync` 生成。请修改 `docs/tasks/items/` 中的任务分片，不要手工编辑本节。

| 编号 | 优先级 | 任务 | 负责人 | 状态 | 依赖 | 主要文件范围 | 验证方式 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T013 | P2 | 添加部署文件 | Codex / 开发 B | 已完成 | T002, T004, T039 | `apps/web/Dockerfile`, `docker-compose.prod.yml`, `.env.production.example`, `.dockerignore`, `deploy/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | `docker compose -f docker-compose.prod.yml --env-file .env.production.example config`; `npm run build:standalone -w apps/web`; `docker build --platform linux/amd64 -f apps/web/Dockerfile -t dreamchasers-web:latest .` |
| T036 | P0 | 降低多人协作文档冲突的分片同步规范 | Codex / 两人协作 | 已完成 | 无 | `AGENTS.md`, `CLAUDE.md`, `docs/PROJECT_CONTEXT.md`, `docs/workflow/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-36-doc-sync-policy.md` | 文档自审；UTF-8 无 BOM 检查 |
| T037 | P0 | 新增 docs:sync 自动汇总脚本 | Codex / 两人协作 | 已完成 | T036 | `package.json`, `scripts/docs-sync.mjs`, `docs/workflow/doc-sync-policy.md`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-37-docs-sync-script.md` | `npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查 |
| T038 | P1 | 麻将 Roguelike 永久固化能力和卡槽系统规划 | Codex / 开发 B | 已完成 | T030, T032, T035 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | 文档自审；UTF-8 无 BOM 检查 |
| T039 | P1 | 条件启用 Next.js standalone 自托管构建 | Codex / 开发 A | 已完成 | T024, T025 | `apps/web/next.config.ts`, `apps/web/package.json`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | `npm run build -w apps/web`; `npm run build:standalone -w apps/web`; 检查 `apps/web/.next/standalone` |
| T040 | P1 | 麻将 Roguelike 完整牌局规则、经济体力和失败救场规划 | Codex / 开发 B | 已完成 | T030, T033, T034, T035, T038 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | `npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查 |
| T041 | P1 | 麻将 Roguelike 团队评审版玩法方案 | Codex / 开发 B | 已完成 | T030, T031, T032, T033, T034, T035, T038, T040 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**` | `npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查 |
| T042 | P1 | 麻将 Roguelike MVP 玩法验证计划 | Codex / 开发 B | 已完成 | T041 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**` | `npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查 |
| T043 | P1 | 麻将 Roguelike 最小可玩闭环和 MVP 开发拆分计划 | Codex / 开发 B | 已完成 | T042 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**` | `npm run docs:sync`; 文档自审；UTF-8 无 BOM 检查；`git diff --check` |
| T044 | P1 | 麻将 Roguelike 最小可玩验证原型 | Codex / 开发 B | 已完成 | T043 | `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**` | `npm run docs:sync`; 浏览器桌面端检查；浏览器移动端检查；UTF-8 无 BOM 检查；`git diff --check` |
<!-- DOCS_SYNC_TASKS_END -->
