# T124：TimePick 标签读取和管理 API 切换

- 领取人：Lee
- 领取时间：2026-06-04
- 状态：待验收
- 预计完成：2026-06-04
- 允许修改文件：`/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/TagCloud.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/TagTree.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/TagManageDialog.tsx`, `docs/tasks/**`, `docs/superpowers/plans/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 依赖任务：T116, T120, T123
- 验证命令：静态红绿检查 `node -e "const fs=require('fs'); for (const f of ['src/components/TagCloud.tsx','src/components/TagTree.tsx','src/components/TagManageDialog.tsx']) { const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/'+f,'utf8'); if (/integrations\\/supabase|supabase\\.|\\.from\\('resources'\\)|\\.rpc\\('(delete_tag|rename_tag)'\\)/.test(s)) process.exit(1); }"`；`npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/TagCloud.tsx src/components/TagTree.tsx src/components/TagManageDialog.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查标签读取、新增、重命名、删除；`npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：等待验收；后续继续按独立任务迁移搜索、灵感、待办、抽签、Profile、上传/Storage 和自动识别等剩余 Supabase 链路。
- 完成备注：标签读取和标签管理已切到 DreamChasers resources API；Kimi WebBridge 真实浏览器联调确认标签读取、新增、重命名、删除均可用，临时资源已删除清理。
