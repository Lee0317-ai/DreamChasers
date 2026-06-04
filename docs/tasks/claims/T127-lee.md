# T127：TimePick 角色选择 API 切换

- 领取人：Lee
- 领取时间：2026-06-04
- 状态：待验收
- 预计完成：2026-06-04
- 允许修改文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/role/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/lib/dreamchasers-auth.ts`, `/Users/lee/Desktop/Lee/TimePick/src/pages/RoleSelect.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Home.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 依赖任务：T114, T115
- 验证命令：静态红绿检查 `node -e "const fs=require('fs'); for (const f of ['src/pages/RoleSelect.tsx','src/pages/Home.tsx']) { const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/'+f,'utf8'); if (/integrations\\/supabase|supabase\\.|\\.from\\('user_roles'\\)/.test(s)) process.exit(1); }"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/pages/RoleSelect.tsx src/pages/Home.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查默认角色初始化和角色选择或切换；`npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：等待验收；后续继续按独立任务迁移模块树、待办、抽签、Profile、上传/Storage、自动识别、学习焦点等剩余 Supabase 链路。
- 完成备注：角色读取和写入已切到 DreamChasers API；Kimi WebBridge 真实浏览器联调确认角色读取、切换 searcher、非法角色拒绝、切回 collector 和首页缓存恢复可用。
