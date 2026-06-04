# T114：TimePick 同账号 PostgreSQL 迁移基座

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T108, T110, T112, T113
- 提出来源：IDEA-20260603-04
- 背景：Lee 已确认拾光 TimePick 不做 Supabase Auth 桥接，而是直接迁移到 DreamChasers PostgreSQL，并与主站共用同一套平台账号。
- 目标：新增 TimePick 在 DreamChasers 内的 Prisma 数据模型、同账号 owner 关系和首个受 Auth.js 保护的 bootstrap API，为后续 TimePick 前端逐步替换 Supabase 查询、迁移历史数据和产品入口上线打基础。
- 不做：不完成 TimePick 全前端改造；不迁移线上 Supabase 历史数据；不迁移 Supabase Storage 文件；不接 AI Gateway；不删除 TimePick 现有 Supabase Auth/Client；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 主要文件范围：`apps/web/prisma/**`, `apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/**`, `apps/web/src/generated/prisma/**`, `docs/tasks/**`, `docs/superpowers/plans/**`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `/Users/lee/Desktop/Lee/TimePick/**`（本任务不直接改 TimePick 前端）
- 验证方式：`npm exec prisma validate -w apps/web`; `npm run test -w apps/web -- timepick account`; `npm run typecheck -w apps/web`; `npm run lint -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check`

## 实施范围

- 盘点 TimePick Supabase schema，落到 DreamChasers Prisma，模型名统一使用 `TimePick*` 前缀。
- 所有用户私有数据通过 `userId` 关联 DreamChasers `User.id`。
- 新增 `GET /api/timepick/bootstrap`，已登录用户可初始化/读取 TimePick profile 和默认 section。
- 保留 TimePick 历史 Supabase 表语义，方便后续编写数据导入脚本和前端替换层。

## 当前进展

- 2026-06-03：已确认 TimePick 路径为 `/Users/lee/Desktop/Lee/TimePick/`，现有项目为 Vite React + Supabase Auth/RLS。
- 2026-06-03：已确认迁移方向为直接进入 DreamChasers PostgreSQL，TimePick 使用同一套 DreamChasers 账号。
- 2026-06-03：已新增 DreamChasers Prisma `TimePick*` 模型、同账号 owner 关系、默认 section 规则测试和 `GET /api/timepick/bootstrap`。
- 2026-06-03：已执行 `prisma db push` 将 TimePick 基座表同步到目标 PostgreSQL。
