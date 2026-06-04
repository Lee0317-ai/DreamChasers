# T120：TimePick 资源录入编辑 API 切换

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T116, T117, T119
- 提出来源：IDEA-20260604-04
- 背景：T116-T119 已完成 TimePick 首页核心读取、文件夹增删改、资源移动和资源删除的 DreamChasers API 切换。`ResourceDialog` 的 sections/folders 读取和资源新增/编辑保存仍直接调用 Supabase。
- 目标：让 TimePick `ResourceDialog` 的基础资源新增/编辑保存、folders 读取和 sections 读取切到 DreamChasers API。
- 不做：不替换上传文件到 Supabase Storage；不替换自动识别 Edge Function；不替换识别图片下载上传；不迁移灵感状态回写、待办、抽签、标签管理、搜索或 Profile 统计；不导入历史数据；不修改 Prisma schema；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 主要文件范围：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/resources/**`, `apps/web/src/app/api/timepick/sections/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceDialog.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：`npm run test -w apps/web -- timepick account`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/FolderTree.tsx src/components/ResourceList.tsx src/components/FolderDialog.tsx src/components/SubFolderCard.tsx src/components/ResourceCard.tsx src/components/ResourceDialog.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查新增资源和编辑资源；`npm run docs:sync`; `git diff --check`

## 实施范围

- DreamChasers 纯规则新增资源保存 payload 规范化和 owner/section/folder 校验。
- DreamChasers 新增 sections 读取 API。
- DreamChasers 资源集合 API 增加 `POST`，资源详情 API 的 `PATCH` 扩展为基础字段编辑。
- TimePick API client 增加 sections 读取、资源新增和资源更新方法。
- TimePick `ResourceDialog` 改用 DreamChasers API 读取 folders/sections 和保存基础资源 metadata。
- 保留上传、自动识别和识别图上传的 Supabase 调用，后续单独拆任务。

## 当前进展

- 2026-06-04：任务创建并领取；准备按 TDD 补 DreamChasers 规则测试。
- 2026-06-04：完成 DreamChasers sections API、资源新增 API、资源基础编辑 API 和 TimePick `ResourceDialog` 切换；上传、自动识别和识别图片上传仍保留 Supabase 链路。

## 完成记录

- 完成时间：2026-06-04
- DreamChasers 纯规则新增 `normalizeTimePickResourceInput`、`canWriteTimePickResource`、`canUseTimePickResourceReferences`，覆盖资源保存 payload 规范化、编辑 owner 校验和 section/folder 引用校验。
- DreamChasers 新增 `GET /api/timepick/sections`。
- DreamChasers `POST /api/timepick/resources` 支持当前用户新增基础资源 metadata。
- DreamChasers `PATCH /api/timepick/resources/[resourceId]` 保留资源移动旧用法，并支持带 `name/section_id` 的基础资源编辑。
- TimePick API client 新增 `fetchTimePickSections`、`createTimePickResource`、`updateTimePickResource`。
- TimePick `ResourceDialog` 的 folders/sections 读取和新增/编辑保存改用 DreamChasers API；普通 URL 自动推断为 `webpage` section，图片 URL 推断为 `image`，其余默认 `document`。
- Kimi WebBridge 真实浏览器联调确认：新增 `T120 临时资源` 触发 `POST /api/timepick/resources` 201 并显示为网页资源；编辑为 `T120 临时资源 已编辑` 触发 `PATCH /api/timepick/resources/cmpyqjcjk0009e6i8y9vmo264` 200；清理触发 `DELETE /api/timepick/resources/cmpyqjcjk0009e6i8y9vmo264` 200，最后资源列表响应 `resources: []`。
- 验证结果：TDD 红绿测试、`npm run test -w apps/web -- timepick account`、`npm run typecheck -w apps/web`、`npm run build -w apps/web`、TimePick 定向 ESLint、TimePick `npm run build`、Kimi WebBridge 真实浏览器联调已通过。
