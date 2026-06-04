# T121：TimePick 资源卡片自动识别更新 API 切换

- 领取人：Lee
- 领取时间：2026-06-04
- 状态：待验收
- 预计完成：2026-06-04
- 允许修改文件：`/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 依赖任务：T119, T120
- 验证命令：静态红绿检查 `node -e "const fs=require('fs'); const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx','utf8'); if (/\\.from\\('resources'\\)\\s*\\.update/.test(s)) process.exit(1)"`; `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/ResourceCard.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器只检查临时资源创建/清理，不要求旧 Coze 自动识别成功；`npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：等待 Lee 验收 `ResourceCard` 自动识别结果写回 API 切换；后续另拆任务迁移 Supabase Edge Function、Storage、上传、灵感、待办、抽签、标签和搜索等支线。
