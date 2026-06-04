# T115：TimePick 前端同账号登录壳

- 领取人：Lee
- 领取时间：2026-06-03
- 状态：待验收
- 预计完成：2026-06-03
- 允许修改文件：`/Users/lee/Desktop/Lee/TimePick/package.json`, `/Users/lee/Desktop/Lee/TimePick/package-lock.json`, `/Users/lee/Desktop/Lee/TimePick/src/lib/**`, `/Users/lee/Desktop/Lee/TimePick/src/contexts/AuthContext.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/AuthGuard.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Login.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Register.tsx`, `docs/tasks/**`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 依赖任务：T110, T114
- 验证命令：`npx eslint src/lib/dreamchasers-auth.ts src/contexts/AuthContext.tsx src/components/AuthGuard.tsx src/pages/Login.tsx src/pages/Register.tsx`（TimePick）；`npm run build`（TimePick）；`npm run docs:sync`；`git diff --check`
- 当前阻塞：无
- 下一步：等待 Lee 验收登录壳；后续 T116 开始替换 TimePick 资源/文件夹数据访问到 DreamChasers API。
