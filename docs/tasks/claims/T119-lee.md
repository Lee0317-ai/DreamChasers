# T119：TimePick 资源卡片删除 API 切换

- 领取人：Lee
- 领取时间：2026-06-04
- 状态：待验收
- 预计完成：2026-06-04
- 允许修改文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/resources/[resourceId]/route.ts`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 依赖任务：T116, T118
- 验证命令：`npm run test -w apps/web -- timepick account`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/FolderTree.tsx src/components/ResourceList.tsx src/components/FolderDialog.tsx src/components/SubFolderCard.tsx src/components/ResourceCard.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查资源卡片删除；`npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：等待 Lee 验收资源卡片删除 API 切换；后续另拆任务替换 `ResourceDialog`、上传/Storage、自动识别、灵感、待办、标签等支线。
