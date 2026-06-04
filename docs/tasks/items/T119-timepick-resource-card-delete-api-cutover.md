# T119：TimePick 资源卡片删除 API 切换

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T116, T118
- 提出来源：IDEA-20260604-03
- 背景：T116-T118 已完成 TimePick 首页文件夹、资源列表、子文件夹卡片和资源移动的 DreamChasers API 切换。`ResourceCard` 删除资源仍直接调用 Supabase。
- 目标：DreamChasers 增加当前用户资源删除 API，并让 TimePick `ResourceCard` 删除资源走 DreamChasers API client。
- 不做：不替换 `ResourceDialog` 新增/编辑；不替换自动识别、缩略图下载上传、Supabase Storage、灵感、待办、抽签、标签管理；不导入历史数据；不修改 Prisma schema；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 主要文件范围：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/resources/[resourceId]/route.ts`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：`npm run test -w apps/web -- timepick account`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/FolderTree.tsx src/components/ResourceList.tsx src/components/FolderDialog.tsx src/components/SubFolderCard.tsx src/components/ResourceCard.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查资源卡片删除；`npm run docs:sync`; `git diff --check`

## 实施范围

- DreamChasers 纯规则新增资源删除 owner 校验。
- DreamChasers resource detail API 增加 `DELETE`。
- TimePick API client 增加删除资源方法。
- TimePick `ResourceCard` 删除资源改用 DreamChasers API。
- 保留 `ResourceCard` 自动识别、缩略图上传和编辑链路的 Supabase 调用，后续单独拆任务。

## 完成记录

- 完成时间：2026-06-04
- DreamChasers 纯规则新增 `canDeleteTimePickResource`，要求 requester 和 resource owner 一致。
- DreamChasers `DELETE /api/timepick/resources/[resourceId]` 支持当前用户删除自己的资源，未登录返回 401，资源不存在或无权删除返回 404。
- TimePick API client 新增 `deleteTimePickResource`。
- TimePick `ResourceCard` 的删除资源操作改为调用 DreamChasers API；自动识别、缩略图上传和编辑链路仍保留现有 Supabase 调用。
- Kimi WebBridge 真实浏览器联调确认：临时资源 `T119 待删除资源` 出现在列表中；点击卡片删除并确认后触发 `DELETE /api/timepick/resources/t119-resource-delete` 200；资源列表刷新后回到空状态。
- 临时测试数据已清理。
- 验证结果：TDD 红绿测试、`npm run test -w apps/web -- timepick account`、`npm run typecheck -w apps/web`、`npm run build -w apps/web`、TimePick 定向 ESLint、TimePick `npm run build`、Kimi WebBridge 真实浏览器联调、`npm run docs:sync`、DreamChasers `git diff --check`、TimePick `git diff --check` 已通过。
