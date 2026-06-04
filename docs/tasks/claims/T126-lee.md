# T126：TimePick 灵感抽屉 API 切换

- 领取人：Lee
- 领取时间：2026-06-04
- 状态：待验收
- 预计完成：2026-06-04
- 允许修改文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/inspirations/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/InspirationDrawer.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/RecentInspirations.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 依赖任务：T114, T115, T120, T125
- 验证命令：静态红绿检查 `node -e "const fs=require('fs'); for (const f of ['src/components/InspirationDrawer.tsx','src/components/RecentInspirations.tsx']) { const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/'+f,'utf8'); if (/integrations\\/supabase|supabase\\.|\\.from\\('inspirations'\\)/.test(s)) process.exit(1); }"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/InspirationDrawer.tsx src/components/RecentInspirations.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查灵感新增、编辑、删除和转资源状态标记；`npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：等待验收；后续继续按独立任务迁移待办、抽签、Profile、上传/Storage、自动识别、角色选择、模块树等剩余 Supabase 链路。
- 完成备注：灵感抽屉和最近灵感读取已切到 DreamChasers API；Kimi WebBridge 真实浏览器联调确认灵感读取、新增、编辑、标记 converted 和删除可用，临时灵感已删除清理。
