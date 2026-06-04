# T127：TimePick 角色选择 API 切换

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T114, T115
- 提出来源：IDEA-20260604-11
- 背景：T115 已让 TimePick 使用 DreamChasers 登录态，T116-T126 已逐步迁移文件夹、资源、标签、搜索和灵感链路。`RoleSelect` 和 `Home` 仍直接写 Supabase `user_roles`。
- 目标：让 TimePick 角色读取、设置和切换走 DreamChasers API，并复用 DreamChasers `TimePickUserRole` 模型。
- 不做：不迁移模块树、待办、抽签、Profile、上传/Storage、自动识别、学习焦点或其他 Supabase 链路；不修改 Prisma schema；不导入历史角色数据；不改变首页默认 collector 行为和角色 UI。
- 主要文件范围：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/role/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/lib/dreamchasers-auth.ts`, `/Users/lee/Desktop/Lee/TimePick/src/pages/RoleSelect.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Home.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：静态红绿检查 `node -e "const fs=require('fs'); for (const f of ['src/pages/RoleSelect.tsx','src/pages/Home.tsx']) { const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/'+f,'utf8'); if (/integrations\\/supabase|supabase\\.|\\.from\\('user_roles'\\)/.test(s)) process.exit(1); }"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/pages/RoleSelect.tsx src/pages/Home.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查默认角色初始化和角色选择或切换；`npm run docs:sync`; `git diff --check`

## 实施范围

- DreamChasers 增加 TimePick 角色规则、服务函数和 `GET/PATCH /api/timepick/role`。
- TimePick API client 增加角色读取和设置方法。
- TimePick `RoleSelect` 和 `Home` 移除 `user_roles` 的 Supabase 直连，改用 DreamChasers API client。

## 当前记录

- 开始时间：2026-06-04
- 完成时间：2026-06-04
- 实现内容：DreamChasers 新增 TimePick 角色规则、服务函数和 `GET/PATCH /api/timepick/role`；TimePick `RoleSelect` 和 `Home` 已改用 DreamChasers API client，不再直连 Supabase `user_roles`。
- 浏览器联调：Kimi WebBridge 打开 `http://localhost:8080/home`，确认登录态可用；同页真实 fetch 首次 `GET /api/timepick/role` 返回 200 且 `role: null`；`PATCH role=searcher` 返回 200；再次 GET 返回 `searcher`；`PATCH role=invalid-role` 返回 400 `角色类型无效。`；`PATCH role=collector` 返回 200；再次 GET 返回 `collector`；刷新首页后 `localStorage.userRole` 恢复为 `collector`。
- 验证结果：TDD 红绿测试、静态红绿检查、DreamChasers 定向测试、DreamChasers typecheck/build、TimePick 定向 ESLint/build 和真实浏览器联调已通过；文档同步和 diff 检查收尾执行。
