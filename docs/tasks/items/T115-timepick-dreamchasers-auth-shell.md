# T115：TimePick 前端同账号登录壳

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T110, T114
- 提出来源：IDEA-20260603-05
- 背景：TimePick 已决定直接迁移到 DreamChasers PostgreSQL，并共用 DreamChasers 账号。T114 已提供 `GET /api/timepick/bootstrap`。
- 目标：让 TimePick 前端启动时通过 DreamChasers bootstrap 获取平台用户，未登录时引导到 DreamChasers 账号中心登录；保持 `user.id` 等现有调用形态，降低后续逐屏替换数据查询的冲击。
- 不做：不替换 TimePick 所有 Supabase 数据查询；不迁移历史数据；不删除 Supabase client；不修改 DreamChasers 数据库 schema；不接 AI Gateway；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 主要文件范围：`/Users/lee/Desktop/Lee/TimePick/package.json`, `/Users/lee/Desktop/Lee/TimePick/package-lock.json`, `/Users/lee/Desktop/Lee/TimePick/src/lib/**`, `/Users/lee/Desktop/Lee/TimePick/src/contexts/AuthContext.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/AuthGuard.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Login.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Register.tsx`, `docs/tasks/**`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：`npx eslint src/lib/dreamchasers-auth.ts src/contexts/AuthContext.tsx src/components/AuthGuard.tsx src/pages/Login.tsx src/pages/Register.tsx`（TimePick）；`npm run build`（TimePick）；`npm run docs:sync`；`git diff --check`

## 实施范围

- 新增 TimePick DreamChasers auth 工具函数。
- AuthContext 改为读取 DreamChasers bootstrap，而不是 Supabase Auth session。
- 登录弹窗、登录页、注册页改为引导到 DreamChasers 账号中心。
- 保留旧 Supabase client 和业务数据调用，后续 T116 逐屏替换。

## 当前进展

- 2026-06-03：已新增 `src/lib/dreamchasers-auth.ts`，封装 DreamChasers base URL、bootstrap fetch、登录跳转和平台用户转换。
- 2026-06-03：已将 TimePick `AuthContext` 改为通过 `/api/timepick/bootstrap` 获取 DreamChasers 平台用户，保持 `user.id` 兼容现有组件。
- 2026-06-03：已将登录弹窗、登录页和注册页改为 DreamChasers 统一账号入口。
- 2026-06-03：尝试安装 Vitest 用于新增测试但 npm 安装长时间卡住且已中止，未留下依赖文件改动；本任务改用触碰文件定向 ESLint 和 Vite build 验证。
