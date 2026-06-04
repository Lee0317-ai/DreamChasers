# T125：TimePick 搜索页 API 切换

- 领取人：Lee
- 领取时间：2026-06-04
- 状态：待验收
- 预计完成：2026-06-04
- 允许修改文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/search/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/pages/SearchPage.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 依赖任务：T116, T120, T124
- 验证命令：静态红绿检查 `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/pages/SearchPage.tsx','utf8'); if (/integrations\\/supabase|supabase\\.|\\.from\\('search_history'\\)|\\.from\\('resources'\\)/.test(s)) process.exit(1)"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/pages/SearchPage.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查搜索资源、写入历史、读取历史、删除历史；`npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：等待验收；后续继续按独立任务迁移灵感、待办、抽签、Profile、上传/Storage、自动识别、角色选择等剩余 Supabase 链路。
- 完成备注：搜索页资源搜索和搜索历史读取/写入/删除已切到 DreamChasers API；Kimi WebBridge 真实浏览器联调确认搜索、历史展示、历史删除可用，临时资源已删除清理。
