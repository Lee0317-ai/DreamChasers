# T124：TimePick 标签读取和管理 API 切换

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T116, T120, T123
- 提出来源：IDEA-20260604-08
- 背景：T116-T123 已把 TimePick 首页资源主链路逐步切到 DreamChasers API。`TagCloud`、`TagTree` 和 `TagManageDialog` 仍直接读取 Supabase `resources.tags`，并通过 Supabase RPC 或资源 update 管理标签。
- 目标：让 TimePick 标签云、标签树和标签管理走 DreamChasers resources API。
- 不做：不迁移搜索页；不迁移灵感、待办、抽签、Profile、上传/Storage 或自动识别；不新增独立标签表；不导入历史数据；不修改 Prisma schema。
- 主要文件范围：`/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/TagCloud.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/TagTree.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/TagManageDialog.tsx`, `docs/tasks/**`, `docs/superpowers/plans/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：静态红绿检查 `node -e "const fs=require('fs'); for (const f of ['src/components/TagCloud.tsx','src/components/TagTree.tsx','src/components/TagManageDialog.tsx']) { const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/'+f,'utf8'); if (/integrations\\/supabase|supabase\\.|\\.from\\('resources'\\)|\\.rpc\\('(delete_tag|rename_tag)'\\)/.test(s)) process.exit(1); }"`；`npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/TagCloud.tsx src/components/TagTree.tsx src/components/TagManageDialog.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查标签读取、新增、重命名、删除；`npm run docs:sync`; `git diff --check`

## 实施范围

- TimePick API client 新增 `getTimePickTagStats`。
- `buildTimePickResourcePayload` 支持覆盖 `tags`。
- `TagCloud` 和 `TagTree` 的标签统计改从 DreamChasers resource view 计算。
- `TagManageDialog` 的标签新增、重命名和删除改为批量调用 DreamChasers resource update API。

## 完成记录

- 完成时间：2026-06-04
- 实现内容：`TagCloud`、`TagTree`、`TagManageDialog` 已移除 Supabase import 和 Supabase `resources` / RPC 调用；标签统计统一从 DreamChasers resources API 返回的 `Resource[]` 计算；标签新增、重命名和删除通过 `updateTimePickResource` 写回资源 `tags`。
- 浏览器联调：Kimi WebBridge 打开 `http://localhost:8080/home`，用 DreamChasers API 创建临时资源 `T124 标签临时资源`，初始标签 `t124-old`；标签树显示 `t124-old`；标签管理新增 `t124-new` 触发 `PATCH /api/timepick/resources/cmpyta6ic00046ai8cvj4oc8z` 200；重命名 `t124-old` 为 `t124-renamed` 触发 `PATCH` 200；删除 `t124-renamed` 触发 `PATCH` 200 且返回体 `tags: ["t124-new"]`；最终 `DELETE /api/timepick/resources/cmpyta6ic00046ai8cvj4oc8z` 200 清理临时资源，资源列表和标签页回到空状态。
- 验证结果：静态红绿检查、TimePick 定向 ESLint、TimePick build 和真实浏览器联调已通过；文档同步和 diff 检查收尾执行。
