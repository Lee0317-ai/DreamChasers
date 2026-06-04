# T117：TimePick 文件夹新增和重命名 API 切换完成记录

- 完成时间：2026-06-04
- 负责人：Lee
- 任务编号：T117

## 修改文件

- DreamChasers：`apps/web/src/lib/timepick/timepick-api-rules.ts`
- DreamChasers：`apps/web/src/lib/timepick/timepick-api.ts`
- DreamChasers：`apps/web/src/lib/timepick/timepick-cors.ts`
- DreamChasers：`apps/web/src/lib/timepick/__tests__/timepick-api.test.ts`
- DreamChasers：`apps/web/src/lib/timepick/__tests__/timepick-cors.test.ts`
- DreamChasers：`apps/web/src/app/api/timepick/folders/route.ts`
- DreamChasers：`apps/web/src/app/api/timepick/folders/[folderId]/route.ts`
- TimePick：`/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`
- TimePick：`/Users/lee/Desktop/Lee/TimePick/src/components/FolderDialog.tsx`
- 文档：`docs/tasks/items/T117-timepick-folder-mutation-api-cutover.md`
- 文档：`docs/tasks/claims/T117-lee.md`
- 文档：`docs/progress/2026-06-04-lee.md`

## 实现内容

- 新增 DreamChasers 文件夹创建 API：`POST /api/timepick/folders`。
- 新增 DreamChasers 文件夹更新 API：`PATCH /api/timepick/folders/[folderId]`。
- 服务端校验文件夹名称、同级重名、父级 owner、目标文件夹 owner 和循环父级。
- CORS allow methods 补充 `POST`。
- TimePick API client 新增 `createTimePickFolder` 和 `updateTimePickFolder`。
- TimePick `FolderDialog` 切到 DreamChasers API，不再直接用 Supabase 读取、查重、新建或编辑文件夹。

## 验证命令

- `npm run test -w apps/web -- timepick account`
- `npm run typecheck -w apps/web`
- `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/FolderTree.tsx src/components/ResourceList.tsx src/components/FolderDialog.tsx`
- Kimi WebBridge 真实浏览器联调

## 验证结果

- DreamChasers `timepick account` 测试通过：5 个测试文件，21 个测试通过。
- DreamChasers 类型检查通过。
- TimePick 定向 ESLint 通过。
- Kimi WebBridge 真实浏览器联调通过：新建文件夹返回 201 并显示；同级重名提示出现且未再次 POST；重命名返回 200 并刷新显示新名称；测试文件夹已删除清理。

## 遗留问题

- 资源新增/编辑/上传仍未迁移。
- `SubFolderCard` 的统计、删除和拖拽移动资源仍含 Supabase 调用，后续可单独切换。
