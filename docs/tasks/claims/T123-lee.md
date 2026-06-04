# T123：TimePick 资源预览心得保存 API 切换

- 领取人：Lee
- 领取时间：2026-06-04
- 状态：待验收
- 预计完成：2026-06-04
- 允许修改文件：`/Users/lee/Desktop/Lee/TimePick/src/components/ResourcePreview.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 依赖任务：T120, T121
- 验证命令：静态红绿检查 `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/components/ResourcePreview.tsx','utf8'); if (/from\\('resources'\\)\\s*\\.update/.test(s)) process.exit(1)"`; `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/ResourcePreview.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查资源预览保存心得；`npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：等待验收；后续继续按独立任务迁移 TimePick 仍直连 Supabase 的上传、Storage、灵感、待办、抽签、标签管理、搜索等链路。
- 完成备注：`ResourcePreview` 保存心得已切到 DreamChasers `PATCH /api/timepick/resources/[resourceId]`；Kimi WebBridge 真实浏览器联调确认 `PATCH` 200 且返回体包含保存后的 `notes`，刷新后心得仍显示，临时测试资源已删除清理。
