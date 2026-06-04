# T118：TimePick 子文件夹卡片 API 切换完成记录

- 完成时间：2026-06-04
- 负责人：Lee
- 任务编号：T118
- 任务名称：TimePick 子文件夹卡片 API 切换

## 修改文件

- TimePick：`/Users/lee/Desktop/Lee/TimePick/src/components/SubFolderCard.tsx`
- DreamChasers：`docs/tasks/CHANGE_INTAKE.md`
- DreamChasers：`docs/tasks/items/T118-timepick-subfolder-card-api-cutover.md`
- DreamChasers：`docs/tasks/claims/T118-lee.md`
- DreamChasers：`docs/tasks/NEXT_ID.md`
- DreamChasers：`docs/progress/2026-06-04-lee.md`
- DreamChasers：`docs/completion/2026-06-04-task-T118-timepick-subfolder-card-api-cutover.md`

## 实现内容

- TimePick `SubFolderCard` 移除直接 Supabase import 和 `from(...)` 调用。
- 子文件夹统计改为通过 DreamChasers `fetchTimePickResourceView` 获取当前文件夹的直接子文件夹和直接资源数量。
- 删除子文件夹改为调用 `deleteTimePickFolder`。
- 拖拽资源到子文件夹改为调用 `moveTimePickResource`。
- 保留原有卡片 UI、toast、埋点和父级刷新回调。

## 验证命令

- `if rg -n "supabase|from\\(" src/components/SubFolderCard.tsx; then exit 1; fi`（TimePick）
- `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/FolderTree.tsx src/components/ResourceList.tsx src/components/FolderDialog.tsx src/components/SubFolderCard.tsx`（TimePick）
- `npm run test -w apps/web -- timepick account`
- `npm run typecheck -w apps/web`
- `npm run build -w apps/web`
- `npm run build`（TimePick）
- Kimi WebBridge 真实浏览器检查子文件夹统计、拖拽移动资源和删除子文件夹。
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- 静态回归检查通过：`SubFolderCard.tsx` 不再包含 Supabase 调用。
- TimePick 定向 ESLint 通过。
- DreamChasers TimePick/account 测试通过：5 个测试文件，21 个测试用例。
- DreamChasers typecheck 通过。
- DreamChasers build 通过。
- TimePick build 通过；仅保留既有 large chunk warning。
- Kimi WebBridge 联调通过：`bootstrap/folders/resources` 均为 200；子文件夹卡片统计显示 `1 个文件夹`；拖拽临时资源触发 `PATCH /api/timepick/resources/t118-resource-move` 200 并更新统计为 `1 个文件夹 / 1 个资源`；删除临时文件夹触发 `DELETE /api/timepick/folders/...` 200 并回到空状态。
- `npm run docs:sync` 通过，同步 93 个任务分片和 86 个领取分片。
- DreamChasers `git diff --check` 通过。
- TimePick `git diff --check` 通过。
- 临时测试数据已清理。

## 遗留问题

- `ResourceCard`、`ResourceDialog`、上传/Storage、灵感、待办、抽签、标签管理和 AI 识别等链路仍含 Supabase 调用，需后续单独拆任务替换。
