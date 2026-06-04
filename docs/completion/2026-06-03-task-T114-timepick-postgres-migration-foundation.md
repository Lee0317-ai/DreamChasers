# T114 TimePick 同账号 PostgreSQL 迁移基座完成记录

- 完成时间：2026-06-03
- 负责人：Lee
- 任务编号：T114
- 任务名称：TimePick 同账号 PostgreSQL 迁移基座

## 修改文件

- `apps/web/prisma/schema.prisma`
- `apps/web/src/generated/prisma/**`
- `apps/web/src/lib/timepick/**`
- `apps/web/src/app/api/timepick/bootstrap/route.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T114-timepick-postgres-migration-foundation.md`
- `docs/tasks/claims/T114-lee.md`
- `docs/tasks/NEXT_ID.md`
- `docs/superpowers/plans/2026-06-03-timepick-postgres-migration-foundation.md`
- `docs/progress/2026-06-03-lee.md`
- `docs/completion/2026-06-03-task-T114-timepick-postgres-migration-foundation.md`

## 实现内容

- 新增 TimePick 迁移基座模型，模型统一使用 `TimePick*` 前缀，避免和主站内容模型命名冲突。
- TimePick 私有数据统一通过 `userId` 关联 DreamChasers 平台 `User.id`，不再以 Supabase Auth 用户作为长期 owner 设计。
- 新增 TimePick 默认 section 规则，保留原 `网页 / 文档 / 图片 / 视频` 四类和稳定排序。
- 新增 `GET /api/timepick/bootstrap`，已登录平台用户可初始化 TimePick profile 并确保默认 section 存在。
- 已将新 schema 同步到目标 PostgreSQL。

## 验证命令

- `npm exec prisma validate -w apps/web`
- `npm exec prisma db push -w apps/web`
- `npm run test -w apps/web -- timepick account`
- `npm run typecheck -w apps/web`
- `npm run lint -w apps/web`
- `npm run build -w apps/web`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- Prisma schema 校验通过。
- 目标 PostgreSQL schema 已同步。
- TimePick / account 测试通过：3 个测试文件，12 个测试用例。
- TypeScript 类型检查通过。
- ESLint 通过；Prisma 生成文件仍有 unused eslint-disable 警告，退出码为 0。
- 生产构建通过，并包含 `/api/timepick/bootstrap` 动态路由。
- 文档同步和 `git diff --check` 通过。

## 遗留问题

- TimePick 前端仍未改造，当前 `/Users/lee/Desktop/Lee/TimePick/` 仍使用 Supabase client 查询和 Supabase Auth 页面。
- 线上 Supabase 历史数据尚未导入 DreamChasers PostgreSQL。
- Supabase Storage 文件、Edge Functions、AI 自动识别和抽签相关外部服务需要后续单独迁移或替换。
