# T132 TimePick 剩余 Supabase 直连清零完成记录

- 完成时间：2026-06-04
- 负责人：Lee
- 任务编号：T132
- 任务名称：TimePick 剩余 Supabase 直连清零

## 修改文件

- `apps/web/src/app/api/timepick/fortune/chat/route.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/pages/Fortune.tsx`
- `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceDialog.tsx`
- `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx`
- `/Users/lee/Desktop/Lee/TimePick/src/components/BatchImportDialog.tsx`
- `/Users/lee/Desktop/Lee/TimePick/src/components/TodoSimple.tsx`
- `/Users/lee/Desktop/Lee/TimePick/src/components/TodoPageSimple.tsx`
- `/Users/lee/Desktop/Lee/TimePick/src/components/ModuleDialog.tsx`
- `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceTree.tsx`
- `/Users/lee/Desktop/Lee/TimePick/src/integrations/supabase/client.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/integrations/supabase/types.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T132-timepick-remove-remaining-supabase.md`
- `docs/tasks/claims/T132-lee.md`
- `docs/progress/2026-06-04-lee.md`

## 实现内容

- 新增 DreamChasers `/api/timepick/fortune/chat` 无模型占位接口，替换 `/fortune` 页面 Supabase Edge Function 调用。
- `ResourceDialog` / `ResourceCard` 移除 Supabase Storage 和 `auto-recognize` Edge Function；上传改为本地 data URL 降级，自动识别改为本地 metadata 占位。
- `BatchImportDialog` 改为逐条调用 DreamChasers todo API。
- 旧 `TodoSimple` / `TodoPageSimple` 改为复用主 `TodoPage`。
- `ModuleDialog` / `ResourceTree` 移除 Supabase 模块表直连，模块写入和拖拽降级为待 DreamChasers schema 重建。
- 删除 TimePick Supabase client/types 入口文件。

## 验证命令

- `rg -n "integrations/supabase|supabase\\.|\\.from\\('|\\.rpc\\(|functions\\.invoke|storage\\." /Users/lee/Desktop/Lee/TimePick/src --glob '!**/node_modules/**'`
- `npx eslint src/lib/timepick-api.ts src/pages/Fortune.tsx src/components/ResourceDialog.tsx src/components/ResourceCard.tsx src/components/BatchImportDialog.tsx src/components/TodoSimple.tsx src/components/TodoPageSimple.tsx src/components/ModuleDialog.tsx src/components/ResourceTree.tsx`（TimePick）
- `npm run build`（TimePick）
- `npm run test -w apps/web -- timepick account`
- `npm run typecheck -w apps/web`
- `npm run build -w apps/web`
- `npm run docs:sync`
- `git diff --check`（DreamChasers 和 TimePick）

## 验证结果

- TimePick `src` 全局 Supabase 静态扫描无结果。
- TimePick 定向 ESLint 通过。
- TimePick build 通过。
- DreamChasers 定向测试通过：5 个测试文件、46 个测试。
- DreamChasers typecheck 和 build 通过，build 输出包含 `/api/timepick/fortune/chat`。

## 遗留问题

- `/fortune` 当前是无模型占位回复；正式 AI 能力需后续接 DreamChasers AI Gateway。
- 上传当前是 data URL 降级；正式对象存储需后续设计 DreamChasers Storage/R2/S3 方案。
- 模块树当前只保留降级入口；正式模块树需后续补 DreamChasers schema、迁移 API 和历史数据策略。
