# T117：TimePick 文件夹新增和重命名 API 切换

- 领取人：Lee
- 领取时间：2026-06-04
- 状态：待验收
- 预计完成：2026-06-04
- 允许修改文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/folders/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/FolderDialog.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 依赖任务：T116
- 验证命令：`npm run test -w apps/web -- timepick account`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/FolderTree.tsx src/components/ResourceList.tsx src/components/FolderDialog.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查新建文件夹、重命名文件夹和同级重名提示；`npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：验收 TimePick `FolderDialog` 的 DreamChasers API 切换；后续另拆任务替换资源新增/编辑/上传等支线。
