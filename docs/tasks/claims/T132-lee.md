# T132：TimePick 剩余 Supabase 直连清零

- 领取人：Lee
- 领取时间：2026-06-04
- 状态：待验收
- 预计完成：2026-06-04
- 允许修改文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Fortune.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/BatchImportDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/TodoSimple.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/TodoPageSimple.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ModuleDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceTree.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/integrations/supabase/**`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 依赖任务：T115, T120, T129, T131
- 验证命令：全局静态扫描 `rg -n "integrations/supabase|supabase\\.|\\.from\\('|\\.rpc\\(|functions\\.invoke|storage\\." /Users/lee/Desktop/Lee/TimePick/src --glob '!**/node_modules/**'` 应无结果；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；TimePick 定向 ESLint；`npm run build`（TimePick）；`npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：等待验收；正式 AI、对象存储和模块树重建需后续单独任务。
- 备注：TimePick `src` 已无 Supabase import/调用；部分旧高成本能力按 T132 边界降级为 DreamChasers API 或本地占位。
