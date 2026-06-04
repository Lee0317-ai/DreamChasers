# T120 TimePick 资源录入编辑 API 切换完成记录

- 完成时间：2026-06-04
- 负责人：Lee
- 任务编号：T120

## 修改文件

- `apps/web/src/lib/timepick/timepick-api-rules.ts`
- `apps/web/src/lib/timepick/timepick-api.ts`
- `apps/web/src/lib/timepick/__tests__/timepick-api.test.ts`
- `apps/web/src/app/api/timepick/resources/route.ts`
- `apps/web/src/app/api/timepick/resources/[resourceId]/route.ts`
- `apps/web/src/app/api/timepick/sections/route.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`
- `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceDialog.tsx`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/items/T120-timepick-resource-dialog-api-cutover.md`
- `docs/tasks/claims/T120-lee.md`
- `docs/tasks/NEXT_ID.md`
- `docs/progress/2026-06-04-lee.md`

## 实现内容

- 新增资源保存规则测试并按 TDD 实现资源 payload 规范化、资源编辑 owner 校验、section/folder 引用校验。
- 新增 DreamChasers `GET /api/timepick/sections`。
- 新增 DreamChasers `POST /api/timepick/resources`。
- 扩展 DreamChasers `PATCH /api/timepick/resources/[resourceId]`，保留资源移动旧用法，并支持基础资源编辑。
- TimePick API client 新增 sections 读取、资源新增、资源更新方法。
- TimePick `ResourceDialog` 改用 DreamChasers API 读取 folders/sections 和保存基础资源 metadata。
- 保留上传、自动识别 Edge Function、识别图片上传的 Supabase 调用，后续单独拆任务。

## 验证命令

- `npm run test -w apps/web -- timepick-api`
- `npm run test -w apps/web -- timepick account`
- `npm run typecheck -w apps/web`
- `npm run build -w apps/web`
- `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/FolderTree.tsx src/components/ResourceList.tsx src/components/FolderDialog.tsx src/components/SubFolderCard.tsx src/components/ResourceCard.tsx src/components/ResourceDialog.tsx`（TimePick）
- `npm run build`（TimePick）
- Kimi WebBridge 真实浏览器联调新增资源、编辑资源和清理临时资源。

## 验证结果

- TDD 红灯：新增 3 个规则测试后，因 `normalizeTimePickResourceInput`、`canWriteTimePickResource`、`canUseTimePickResourceReferences` 不存在失败。
- 绿灯：实现规则函数后，`timepick-api` 测试 11/11 通过。
- DreamChasers `timepick account` 测试 25/25 通过。
- DreamChasers typecheck 和 build 通过。
- TimePick 定向 ESLint 通过。
- TimePick build 通过，仅保留既有 large chunk warning。
- Kimi WebBridge 联调确认 `POST /api/timepick/resources` 201、`PATCH /api/timepick/resources/cmpyqjcjk0009e6i8y9vmo264` 200、`DELETE /api/timepick/resources/cmpyqjcjk0009e6i8y9vmo264` 200；最后资源列表响应 `resources: []`，临时数据已清理。

## 遗留问题

- `ResourceDialog` 上传文件、自动识别、识别图片上传仍使用 Supabase，后续需要单独拆任务迁移 Storage/AI 识别链路。
- 灵感转换后的状态回写不在本任务内迁移。
