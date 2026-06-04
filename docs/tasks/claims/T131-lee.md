# T131：TimePick 首页每日抽签弹窗 API 切换

- 领取人：Lee
- 领取时间：2026-06-04
- 状态：待验收
- 预计完成：2026-06-04
- 允许修改文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/fortune/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/FortuneDrawDialog.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Fortune.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ModuleDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceTree.tsx`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 依赖任务：T114, T115, T130
- 验证命令：静态红绿检查 `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/components/FortuneDrawDialog.tsx','utf8'); if (/integrations\\/supabase|supabase\\.|\\.from\\('profiles'\\)|functions\\.invoke\\('draw-fortune'\\)/.test(s)) process.exit(1);"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/timepick-api.ts src/components/FortuneDrawDialog.tsx`（TimePick）；`npm run build`（TimePick）；真实浏览器检查未设置生日提示、保存生日、抽签结果和同日缓存；`npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：等待验收；后续继续单独评估 `/fortune` 运势聊天页、上传/Storage、自动识别和模块树。
- 备注：已完成 DreamChasers fortune draw API、TimePick `FortuneDrawDialog` 切换和真实浏览器/API 联调；联调临时 session、今日抽签记录已清理，`lee@example.com` 的 `TimePickProfile.birthDate` 保持 `NULL`。
