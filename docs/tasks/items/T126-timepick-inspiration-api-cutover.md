# T126：TimePick 灵感抽屉 API 切换

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T114, T115, T120, T125
- 提出来源：IDEA-20260604-10
- 背景：T116-T125 已把 TimePick 首页资源、文件夹、标签和搜索页逐步切到 DreamChasers API。`InspirationDrawer` 和 `RecentInspirations` 仍直接读取和写入 Supabase `inspirations`。
- 目标：让 TimePick 灵感抽屉和最近灵感模块的灵感读取、新增、编辑、删除和标记已转换走 DreamChasers API。
- 不做：不迁移待办、抽签、Profile、上传/Storage、自动识别、角色选择、模块树或其他 Supabase 链路；不导入历史数据；不修改 Prisma schema；不改变语音识别 UI；不改变资源弹窗上传和自动识别流程。
- 主要文件范围：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/inspirations/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/InspirationDrawer.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/RecentInspirations.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：静态红绿检查 `node -e "const fs=require('fs'); for (const f of ['src/components/InspirationDrawer.tsx','src/components/RecentInspirations.tsx']) { const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/'+f,'utf8'); if (/integrations\\/supabase|supabase\\.|\\.from\\('inspirations'\\)/.test(s)) process.exit(1); }"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/InspirationDrawer.tsx src/components/RecentInspirations.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查灵感新增、编辑、删除和转资源状态标记；`npm run docs:sync`; `git diff --check`

## 实施范围

- DreamChasers 增加 TimePick 灵感规则和服务函数。
- DreamChasers 增加灵感列表/新增 API 和灵感编辑/删除 API。
- TimePick API client 增加灵感读取、创建、更新和删除方法。
- TimePick `InspirationDrawer` 和 `RecentInspirations` 移除 Supabase 直连，改用 DreamChasers API client。

## 当前记录

- 开始时间：2026-06-04
- 完成时间：2026-06-04
- 实现内容：DreamChasers 新增 TimePick 灵感规则、服务函数和 API route；TimePick `InspirationDrawer`、`RecentInspirations` 已改用 DreamChasers API client，不再直连 Supabase `inspirations`。
- 浏览器联调：Kimi WebBridge 打开 `http://localhost:8080/home`，确认登录态可用；灵感抽屉 GET `/api/timepick/inspirations` 返回 200；通过同一真实浏览器页面 fetch 创建临时灵感 `T126 灵感临时内容`，`POST /api/timepick/inspirations` 返回 201，ID `cmpyuw4cy000442i8hlez6oso`；DOM 文本确认 UI 渲染 `我的灵感 (1)` 和临时灵感；编辑内容和位置触发 `PATCH /api/timepick/inspirations/cmpyuw4cy000442i8hlez6oso` 200；标记 `converted` 再次 `PATCH` 200；删除触发 `DELETE` 200；最终列表 `GET` 返回 `inspirations: []`。
- 验证结果：TDD 红绿测试、静态红绿检查、DreamChasers 定向测试、DreamChasers typecheck/build、TimePick 定向 ESLint/build 和真实浏览器联调已通过；文档同步和 diff 检查收尾执行。
