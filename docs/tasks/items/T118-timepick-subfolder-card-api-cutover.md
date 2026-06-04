# T118：TimePick 子文件夹卡片 API 切换

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T116, T117
- 提出来源：IDEA-20260604-02
- 背景：T116/T117 已完成 TimePick 文件夹树、资源列表、文件夹新增/重命名、文件夹删除和资源移动的 DreamChasers API 切换。`SubFolderCard` 仍然直接调用 Supabase 做子文件夹统计、删除和拖拽移动资源。
- 目标：让 TimePick `SubFolderCard` 复用 DreamChasers API client 获取子文件夹统计，并通过 DreamChasers API 删除文件夹、移动资源。
- 不做：不替换资源新增/编辑/上传；不替换 `ResourceCard`、`ResourceDialog`、灵感、待办、抽签、标签管理、AI 识别或 Storage；不导入历史数据；不修改 Prisma schema；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 主要文件范围：`/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/SubFolderCard.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：`npm run test -w apps/web -- timepick account`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/FolderTree.tsx src/components/ResourceList.tsx src/components/FolderDialog.tsx src/components/SubFolderCard.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查子文件夹统计、删除子文件夹和拖拽资源到子文件夹；`npm run docs:sync`; `git diff --check`

## 实施范围

- TimePick `SubFolderCard` 统计改为读取 DreamChasers folders/resources API。
- TimePick `SubFolderCard` 删除文件夹改为调用 DreamChasers folder delete API。
- TimePick `SubFolderCard` 拖拽资源移动改为调用 DreamChasers resource move API。
- 保持现有 UI 行为、toast 文案和父级刷新回调，不扩大到资源新增/编辑/上传链路。

## 完成记录

- 完成时间：2026-06-04
- TimePick `SubFolderCard` 已移除直接 Supabase import 和 `from(...)` 调用。
- 子文件夹卡片统计改为调用 DreamChasers `GET /api/timepick/resources?displayMode=folder-and-resource&selectedType=folder&folderId=...`，按返回的 `subFolders` 和 `resources` 计算数量。
- 删除子文件夹改为调用 DreamChasers `DELETE /api/timepick/folders/[folderId]`。
- 拖拽资源到子文件夹改为调用 DreamChasers `PATCH /api/timepick/resources/[resourceId]`。
- Kimi WebBridge 真实浏览器联调确认：子文件夹卡片统计显示 `1 个文件夹`；拖拽资源后 `PATCH /api/timepick/resources/t118-resource-move` 返回 200 且卡片统计更新为 `1 个文件夹 / 1 个资源`；删除测试文件夹时 `DELETE /api/timepick/folders/...` 返回 200，页面回到空状态。
- 临时测试数据已清理。
- 验证结果：`npm run test -w apps/web -- timepick account`、`npm run typecheck -w apps/web`、`npm run build -w apps/web`、TimePick 定向 ESLint、TimePick `npm run build`、Kimi WebBridge 真实浏览器联调、`npm run docs:sync`、DreamChasers `git diff --check`、TimePick `git diff --check` 已通过。
