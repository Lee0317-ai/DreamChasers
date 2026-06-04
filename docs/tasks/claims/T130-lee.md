# T130：TimePick Profile 页面 API 切换

- 领取人：Lee
- 领取时间：2026-06-04
- 状态：待验收
- 预计完成：2026-06-04
- 允许修改文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/profile/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Profile.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `/Users/lee/Desktop/Lee/TimePick/src/components/FortuneDrawDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Fortune.tsx`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 依赖任务：T114, T115, T120, T129
- 验证命令：静态红绿检查 `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/pages/Profile.tsx','utf8'); if (/integrations\\/supabase|supabase\\.|\\.from\\('profiles'\\)|\\.from\\('resources'\\)|auth\\.updateUser|auth\\.signInWithPassword/.test(s)) process.exit(1);"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/timepick-api.ts src/pages/Profile.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查 Profile 读取、生日更新和账号安全页跳转；`npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：等待验收；后续 TimePick 迁移继续避开模块树、上传/Storage 和旧 Supabase 修改密码体系。
- 备注：已完成 DreamChasers profile API、TimePick Profile 页面切换和真实浏览器跳转检查；联调临时 session 已清理，`lee@example.com` 的 `TimePickProfile.birthDate` 保持 `NULL`。
