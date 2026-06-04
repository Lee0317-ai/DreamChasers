# T116：TimePick 文件夹和资源列表 API 切换

- 领取人：Lee
- 领取时间：2026-06-03
- 状态：待验收
- 预计完成：2026-06-03
- 允许修改文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/**`, `/Users/lee/Desktop/Lee/TimePick/src/components/FolderTree.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceList.tsx`, `docs/tasks/**`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 依赖任务：T114, T115
- 验证命令：`npm run test -w apps/web -- timepick account`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/FolderTree.tsx src/components/ResourceList.tsx`（TimePick）；`npm run build`（TimePick）；`npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：验收 TimePick 首页文件夹树和资源列表 API 切换；后续另拆任务替换新增/编辑资源、上传、待办、灵感等支线。
