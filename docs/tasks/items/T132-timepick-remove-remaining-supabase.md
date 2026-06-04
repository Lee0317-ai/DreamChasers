# T132：TimePick 剩余 Supabase 直连清零

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T115, T120, T129, T131
- 提出来源：IDEA-20260604-16
- 背景：T115-T131 已把 TimePick 主要账号、资源、文件夹、标签、搜索、灵感、角色、学习重点、待办、Profile 和首页每日抽签链路切到 DreamChasers API。静态扫描仍剩 `/fortune` 运势聊天、上传/Storage、自动识别、批量导入、模块树和旧 Simple todo 文件里的 Supabase 直连。
- 目标：在不新增 Prisma schema、不接真实 AI/Storage 的前提下清零 TimePick `src` 中 Supabase import 和调用点；必要功能改为 DreamChasers API、无模型本地占位或显式降级。
- 不做：不接真实 AI 模型；不实现正式文件对象存储；不重建完整模块树 schema；不导入 Supabase 历史模块/文件/批量数据；不修改 Prisma schema；不改 DreamChasers 非 TimePick 模块。
- 主要文件范围：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Fortune.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/BatchImportDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/TodoSimple.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/TodoPageSimple.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ModuleDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceTree.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/integrations/supabase/**`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：全局静态扫描 `rg -n "integrations/supabase|supabase\\.|\\.from\\('|\\.rpc\\(|functions\\.invoke|storage\\." /Users/lee/Desktop/Lee/TimePick/src --glob '!**/node_modules/**'` 应无结果；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；TimePick 定向 ESLint；`npm run build`（TimePick）；`npm run docs:sync`; `git diff --check`

## 实施范围

- DreamChasers 增加轻量 fortune chat 占位 API。
- TimePick `/fortune` 改走 DreamChasers API。
- TimePick `ResourceDialog` / `ResourceCard` 的上传、缩略图和自动识别改为无 Supabase 降级。
- `BatchImportDialog`、旧 Simple todo、`ModuleDialog`、`ResourceTree` 移除 Supabase 直连。
- 删除或清空 Supabase client 入口，确保 TimePick `src` 扫描无 Supabase 调用。

## 当前记录

- 开始时间：2026-06-04
- 当前状态：待验收。
- 完成记录：
  - DreamChasers 新增 `/api/timepick/fortune/chat` 无模型占位接口，`/fortune` 运势聊天页已改走 DreamChasers API。
  - `ResourceDialog` / `ResourceCard` 已移除 Supabase Storage 和 `auto-recognize` Edge Function；上传降级为本地 data URL，自动识别降级为本地 metadata 占位。
  - `BatchImportDialog` 已改为逐条调用 DreamChasers todo API；旧 `TodoSimple` / `TodoPageSimple` 复用主 `TodoPage`。
  - `ModuleDialog` 和 `ResourceTree` 已移除 Supabase modules/sections/resources 直连，模块写入和模块拖拽明确降级为待 DreamChasers schema 重建。
  - `/Users/lee/Desktop/Lee/TimePick/src/integrations/supabase/client.ts` 和 `types.ts` 已删除；TimePick `src` 全局 Supabase 静态扫描无结果。
- 下一步：等待验收；后续如要恢复正式 AI/Storage/模块树，需要单独建模和接平台能力。
