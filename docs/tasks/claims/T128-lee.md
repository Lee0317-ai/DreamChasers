# T128：TimePick 学习重点 API 切换

- 领取人：Lee
- 领取时间：2026-06-04
- 状态：待验收
- 预计完成：2026-06-04
- 允许修改文件：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/learning-focus/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/LearningFocusDialog.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 依赖任务：T114, T115, T127
- 验证命令：静态红绿检查 `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/components/LearningFocusDialog.tsx','utf8'); if (/integrations\\/supabase|supabase\\.|\\.from\\('learning_focus'\\)/.test(s)) process.exit(1);"`；`npm run test -w apps/web -- timepick account`；`npm run typecheck -w apps/web`；`npm run build -w apps/web`；`npx eslint src/lib/timepick-api.ts src/components/LearningFocusDialog.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查学习重点新增、同义词更新和删除；`npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：等待验收；后续继续按独立任务迁移待办、抽签、Profile、上传/Storage、自动识别、模块树和批量优先级 Edge Function 等剩余 Supabase 链路。
- 完成备注：学习重点列表、新增、同义词更新和删除已切到 DreamChasers API；Kimi WebBridge 真实浏览器联调确认新增、规范化、非法空名称拒绝、更新和删除可用，临时学习重点已删除清理。
