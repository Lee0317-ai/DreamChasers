# 任务池

**最后更新**：2026-05-19  
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
| T001 | P0 | 创建 Monorepo 外壳 | 开发 A | 待领取 | 无 | `package.json`, `tsconfig.base.json`, `apps/**`, `packages/**` | `npm run test` |
| T002 | P0 | 搭建 Web 应用 | 开发 A | 待领取 | T001 | `apps/web/**` | `npm run lint -w apps/web`, `npm run build -w apps/web` |
| T003 | P0 | 添加共享领域类型 | 开发 B | 待领取 | T001 | `packages/shared/**` | `npm run test -w packages/shared` |
| T004 | P0 | 添加数据库和 Prisma 模型 | 开发 A | 待领取 | T002, T003 | `apps/web/prisma/**`, `apps/web/src/lib/db.ts`, `docker-compose.yml` | `npm exec prisma validate -w apps/web` |
| T005 | P1 | 添加第一批种子内容 | 开发 A | 待领取 | T004 | `apps/web/prisma/seed.ts`, `apps/web/src/lib/content/**` | `npm exec prisma db seed -w apps/web` |
| T006 | P1 | 实现内容查询层 | 开发 A | 待领取 | T004, T005 | `apps/web/src/lib/content/**` | `npm run test -w apps/web -- content` |
| T007 | P1 | 实现公开门户页面 | 开发 A | 待领取 | T006 | `apps/web/src/app/**`, `apps/web/src/components/content/**` | `npm run build -w apps/web` |
| T008 | P1 | 添加 AI 搜索 MVP | 开发 B | 待领取 | T003, T006 | `apps/web/src/lib/ai/**`, `apps/web/src/components/ai/**`, `apps/web/src/app/api/ai/**` | `npm run test -w apps/web -- ai` |
| T009 | P1 | 添加后台 MVP | 开发 A | 待领取 | T004, T006 | `apps/web/src/app/admin/**`, `apps/web/src/lib/admin/**` | `npm run build -w apps/web` |
| T010 | P1 | 添加使用模式和变现基础 | 开发 A | 待领取 | T003, T007 | `apps/web/src/lib/billing/**`, `apps/web/src/components/billing/**` | `npm run test -w apps/web -- billing` |
| T011 | P1 | 添加游戏发布基础 | 开发 B | 待领取 | T003 | `apps/game/**`, `apps/web/src/components/game/**` | `npm run build -w apps/web` |
| T012 | P2 | 添加埋点和热门排序 | 开发 B | 待领取 | T006, T007 | `apps/web/src/lib/analytics/**`, `apps/web/src/app/api/events/**` | `npm run test -w apps/web -- analytics` |
| T013 | P2 | 添加部署文件 | 开发 B | 待领取 | T002, T004 | `deploy/**`, `apps/web/Dockerfile`, `docker-compose.yml` | `docker compose config`, `npm run build -w apps/web` |
| T014 | P2 | 添加上线清单和运营手册 | 两人协作 | 待领取 | T001 | `docs/checklists/**`, `docs/operations/**` | 文档自审 |
| T015 | P1 | 实现 PDF 工具箱 MVP | 开发 A | 待领取 | T007, T010 | `apps/web/src/app/tools/pdf-toolbox/**`, `apps/web/src/components/tools/pdf/**`, `apps/web/src/lib/tools/pdf/**` | `npm run test -w apps/web -- pdf` |
| T016 | P1 | 实现 AI 修图工具 MVP | 开发 B | 待领取 | T007, T010 | `apps/web/src/app/tools/ai-photo-editor/**`, `apps/web/src/components/tools/photo/**`, `apps/web/src/lib/tools/photo/**` | `npm run test -w apps/web -- photo` |
| T017 | P1 | 实现麻将 Roguelike 消除 MVP | 开发 B | 待领取 | T003, T011 | `apps/game/mahjong-roguelike/**`, `packages/shared/src/mahjong-game.ts` | `npm run test -w packages/shared -- mahjong` |
| T018 | P0 | 建立 Git 忽略规则和协作入口 | 开发 A | 已完成 | 无 | `.gitignore`, `README.md`, `.claude/settings.local.json`, `.obsidian/workspace.json`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-19.md`, `docs/completion/**` | `git status --porcelain=v1 -uall`; `git check-ignore`; UTF-8 无 BOM 检查 |

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

## 6. 新想法入池规则

任何一方有新想法，或让 AI 帮忙规划新功能时，不能直接改代码。

必须先执行：

1. 在 `docs/tasks/CHANGE_INTAKE.md` 新增变更卡。
2. 判断是否影响现有任务和另一方文件范围。
3. 如果要做，把它写入本任务池，状态设为 `待拆分` 或 `待领取`。
4. 如果涉及文件冲突，在 `docs/tasks/CLAIMS.md` 登记冲突。
5. 只有任务进入 `待领取` 并被领取后，才能实施。

新增任务时必须填写：

- 任务编号。
- 优先级。
- 默认负责人。
- 状态。
- 依赖。
- 主要文件范围。
- 验证方式。
