# T130：TimePick Profile 页面 API 切换

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T114, T115, T120, T129
- 提出来源：IDEA-20260604-14
- 背景：T115 已让 TimePick 使用 DreamChasers 登录态，T116-T129 已逐步迁移核心资源、学习重点和任务清单链路。`Profile` 页面仍直接读取 Supabase `profiles`、统计 Supabase `resources`，并使用 Supabase Auth 修改密码。
- 目标：让 TimePick Profile 页面的资料读取、资源统计和出生日期保存走 DreamChasers API，并复用 DreamChasers `TimePickProfile` 和 `TimePickResource` 模型；旧修改密码入口改为跳转 DreamChasers 账号安全页。
- 不做：不实现 DreamChasers 密码修改；不迁移抽签 Edge Function；不迁移模块树、上传/Storage、自动识别、批量导入或批量优先级；不修改 Prisma schema；不导入历史数据；不重做 Profile 页面视觉结构。
- 主要文件范围：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/profile/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Profile.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `/Users/lee/Desktop/Lee/TimePick/src/components/FortuneDrawDialog.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/pages/Fortune.tsx`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：静态红绿检查 `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/pages/Profile.tsx','utf8'); if (/integrations\\/supabase|supabase\\.|\\.from\\('profiles'\\)|\\.from\\('resources'\\)|auth\\.updateUser|auth\\.signInWithPassword/.test(s)) process.exit(1);"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/timepick-api.ts src/pages/Profile.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查 Profile 读取、生日更新和账号安全页跳转；`npm run docs:sync`; `git diff --check`

## 实施范围

- DreamChasers 增加 TimePick profile 规则、服务函数和 `GET/PATCH /api/timepick/profile`。
- TimePick API client 增加 profile 读取和出生日期更新方法。
- TimePick `Profile` 页面移除 Supabase 直连，改用 DreamChasers API；修改密码入口改为打开 DreamChasers `/account/security`。

## 当前记录

- 开始时间：2026-06-04
- 当前状态：待验收。
- 完成记录：
  - DreamChasers 已新增 `GET/PATCH /api/timepick/profile`，资料读取、资源统计和出生日期更新均使用当前 DreamChasers 登录用户。
  - TimePick `Profile` 页面已移除 Supabase profile/resources/Auth 直连，改用 DreamChasers API client；账号安全入口改为跳转 DreamChasers `/account/security`。
  - 浏览器联调确认 `/profile` 显示 `lee@example.com` profile、出生日期恢复为未设置，`GET /api/timepick/profile` 返回 200 且 `birth_date: null`，点击账号安全设置后 `location.href` 为 `http://localhost:3000/account/security`。
- 下一步：等待验收；后续如继续迁移 TimePick，优先选择抽签或其他已有 DreamChasers schema 且范围小的链路，继续避开模块树和上传/Storage。
