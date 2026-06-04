# T128：TimePick 学习重点 API 切换

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T114, T115, T127
- 提出来源：IDEA-20260604-12
- 背景：T115 已让 TimePick 使用 DreamChasers 登录态，T116-T127 已逐步迁移文件夹、资源、标签、搜索、灵感和角色链路。`LearningFocusDialog` 仍直接读取和写入 Supabase `learning_focus`。
- 目标：让 TimePick 学习重点列表读取、新增、删除和同义词更新走 DreamChasers API，并复用 DreamChasers `TimePickLearningFocus` 模型。
- 不做：不迁移待办、抽签、Profile、上传/Storage、自动识别、模块树或批量优先级 Edge Function；不修改 Prisma schema；不导入历史数据；不改变学习重点弹窗 UI 和批量优先级按钮语义。
- 主要文件范围：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/learning-focus/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/LearningFocusDialog.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：静态红绿检查 `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/components/LearningFocusDialog.tsx','utf8'); if (/integrations\\/supabase|supabase\\.|\\.from\\('learning_focus'\\)/.test(s)) process.exit(1);"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/timepick-api.ts src/components/LearningFocusDialog.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查学习重点新增、同义词更新和删除；`npm run docs:sync`; `git diff --check`

## 实施范围

- DreamChasers 增加 TimePick 学习重点规则、服务函数和 API route。
- TimePick API client 增加学习重点读取、新增、更新同义词和删除方法。
- TimePick `LearningFocusDialog` 移除 Supabase `learning_focus` 直连，改用 DreamChasers API client。

## 当前记录

- 开始时间：2026-06-04
- 完成时间：2026-06-04
- 实现内容：DreamChasers 新增 TimePick 学习重点规则、服务函数和 `GET/POST /api/timepick/learning-focus`、`PATCH/DELETE /api/timepick/learning-focus/[focusId]`；TimePick `LearningFocusDialog` 已改用 DreamChasers API client，不再直连 Supabase `learning_focus`。
- 浏览器联调：Kimi WebBridge 打开 `http://localhost:8080/home`，确认登录态可用；同页真实 fetch 首次 `GET /api/timepick/learning-focus` 返回 200 且列表为空；`POST` 创建临时学习重点 `T128 学习重点临时` 返回 201，名称 trim，同义词去重为 `api, 迁移`；`PATCH` 同义词返回 200，同义词规范化为 `react, hooks`；空名称 `POST` 返回 400 `学习重点名称不能为空。`；`DELETE` 临时学习重点返回 200；最终列表不再包含临时记录。
- 验证结果：TDD 红绿测试、静态红绿检查、DreamChasers 定向测试、DreamChasers typecheck/build、TimePick 定向 ESLint/build 和真实浏览器联调已通过；文档同步和 diff 检查收尾执行。
