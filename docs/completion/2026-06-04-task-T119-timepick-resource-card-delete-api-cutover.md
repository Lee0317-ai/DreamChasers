# T119：TimePick 资源卡片删除 API 切换完成记录

- 完成时间：2026-06-04
- 负责人：Lee
- 任务编号：T119
- 任务名称：TimePick 资源卡片删除 API 切换

## 修改文件

- DreamChasers：`apps/web/src/lib/timepick/timepick-api-rules.ts`
- DreamChasers：`apps/web/src/lib/timepick/timepick-api.ts`
- DreamChasers：`apps/web/src/lib/timepick/__tests__/timepick-api.test.ts`
- DreamChasers：`apps/web/src/app/api/timepick/resources/[resourceId]/route.ts`
- TimePick：`/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`
- TimePick：`/Users/lee/Desktop/Lee/TimePick/src/components/ResourceCard.tsx`
- DreamChasers：`docs/tasks/CHANGE_INTAKE.md`
- DreamChasers：`docs/tasks/items/T119-timepick-resource-card-delete-api-cutover.md`
- DreamChasers：`docs/tasks/claims/T119-lee.md`
- DreamChasers：`docs/tasks/NEXT_ID.md`
- DreamChasers：`docs/progress/2026-06-04-lee.md`
- DreamChasers：`docs/completion/2026-06-04-task-T119-timepick-resource-card-delete-api-cutover.md`

## 实现内容

- 新增 `canDeleteTimePickResource` 纯规则，确保 requester 与 resource owner 一致。
- 新增 DreamChasers `deleteTimePickResource` 服务方法。
- `DELETE /api/timepick/resources/[resourceId]` 支持当前用户删除自己的资源，并复用 TimePick CORS。
- TimePick API client 新增 `deleteTimePickResource`。
- TimePick `ResourceCard` 删除资源改用 DreamChasers API。
- 保留 `ResourceCard` 自动识别、缩略图上传和编辑中的 Supabase 调用，避免扩大任务范围。

## 验证命令

- `npm run test -w apps/web -- timepick-api`（先 RED 后 GREEN）
- `if rg -n "\\.from\\('resources'\\)[\\s\\S]{0,120}delete|delete\\(\\)[\\s\\S]{0,120}\\.eq\\('id', resource\\.id\\)" src/components/ResourceCard.tsx; then exit 1; fi`（TimePick）
- `npm run test -w apps/web -- timepick account`
- `npm run typecheck -w apps/web`
- `npm run build -w apps/web`
- `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/FolderTree.tsx src/components/ResourceList.tsx src/components/FolderDialog.tsx src/components/SubFolderCard.tsx src/components/ResourceCard.tsx`（TimePick）
- `npm run build`（TimePick）
- Kimi WebBridge 真实浏览器检查资源卡片删除。
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- RED：新增资源删除 owner 校验测试后，`canDeleteTimePickResource is not a function`，测试失败符合预期。
- GREEN：实现规则后 `npm run test -w apps/web -- timepick-api` 通过，8 个用例通过。
- DreamChasers TimePick/account 测试通过：5 个测试文件，22 个测试用例。
- DreamChasers typecheck 通过。
- DreamChasers build 通过。
- TimePick 定向 ESLint 通过。
- TimePick build 通过；仅保留既有 large chunk warning。
- Kimi WebBridge 联调通过：临时资源 `T119 待删除资源` 出现在列表中；点击删除确认后触发 `DELETE /api/timepick/resources/t119-resource-delete` 200；资源列表刷新后回到空状态。
- `npm run docs:sync` 通过，同步 94 个任务分片和 87 个领取分片。
- DreamChasers `git diff --check` 通过。
- TimePick `git diff --check` 通过。
- 临时测试数据已清理。

## 遗留问题

- `ResourceDialog` 新增/编辑、上传/Storage、自动识别、灵感、待办、抽签、标签管理等链路仍含 Supabase 调用，需后续单独拆任务替换。
