# T125：TimePick 搜索页 API 切换

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T116, T120, T124
- 提出来源：IDEA-20260604-09
- 背景：T116-T124 已把 TimePick 首页资源主链路和标签管理逐步切到 DreamChasers API。`SearchPage` 仍直接读取 Supabase `search_history` 和 `resources`。
- 目标：让 TimePick 搜索页的资源搜索、搜索历史读取、搜索历史写入和搜索历史删除走 DreamChasers API。
- 不做：不迁移灵感、待办、抽签、Profile、上传/Storage、自动识别、角色选择或其他 Supabase 链路；不导入历史数据；不修改 Prisma schema；不新增全文检索索引；不接 AI 搜索或模型能力。
- 主要文件范围：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/search/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/pages/SearchPage.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：静态红绿检查 `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/pages/SearchPage.tsx','utf8'); if (/integrations\\/supabase|supabase\\.|\\.from\\('search_history'\\)|\\.from\\('resources'\\)/.test(s)) process.exit(1)"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/pages/SearchPage.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查搜索资源、写入历史、读取历史、删除历史；`npm run docs:sync`; `git diff --check`

## 实施范围

- DreamChasers 增加 TimePick 搜索规则和服务函数。
- DreamChasers 增加资源搜索 API、搜索历史列表/新增 API 和搜索历史删除 API。
- TimePick API client 增加资源搜索和搜索历史方法。
- TimePick `SearchPage` 移除 Supabase 直连，改用 DreamChasers API client。

## 当前记录

- 开始时间：2026-06-04
- 完成时间：2026-06-04
- 实现内容：DreamChasers 新增 TimePick 搜索规则、搜索服务和 API route；TimePick `SearchPage` 的资源搜索、搜索历史读取、写入和删除已改用 DreamChasers API client，不再直连 Supabase。
- 浏览器联调：Kimi WebBridge 打开 `http://localhost:8080/search`，确认 DreamChasers 登录态为 `lee+t120@example.com`；创建临时资源 `T125 搜索临时资源`，标签 `t125-search-tag`；搜索页输入 `t125-search-tag` 后显示 1 条结果；网络确认 `POST /api/timepick/search/history` 201、`GET /api/timepick/search/history` 200、`GET /api/timepick/search?keyword=t125-search-tag` 200；清空关键词后历史显示 `t125-search-tag`；点击删除后 `DELETE /api/timepick/search/history/cmpyu31sv00093si83x9pxfrj` 200，历史列表清空；临时资源 `cmpyu2pnb00083si8zsgiv7rg` 已通过 `DELETE /api/timepick/resources/cmpyu2pnb00083si8zsgiv7rg` 200 清理。
- 验证结果：TDD 红绿测试、静态红绿检查、DreamChasers 定向测试、DreamChasers typecheck/build、TimePick 定向 ESLint/build 和真实浏览器联调已通过；文档同步和 diff 检查收尾执行。
