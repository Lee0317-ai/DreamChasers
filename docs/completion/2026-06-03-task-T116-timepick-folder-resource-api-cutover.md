# T116：TimePick 文件夹和资源列表 API 切换完成记录

- 完成时间：2026-06-03
- 负责人：Lee
- 任务编号：T116

## 修改文件

- DreamChasers：`apps/web/src/lib/timepick/timepick-api-rules.ts`
- DreamChasers：`apps/web/src/lib/timepick/timepick-api.ts`
- DreamChasers：`apps/web/src/lib/timepick/__tests__/timepick-api.test.ts`
- DreamChasers：`apps/web/src/app/api/timepick/folders/**`
- DreamChasers：`apps/web/src/app/api/timepick/resources/**`
- TimePick：`/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`
- TimePick：`/Users/lee/Desktop/Lee/TimePick/src/components/FolderTree.tsx`
- TimePick：`/Users/lee/Desktop/Lee/TimePick/src/components/ResourceList.tsx`
- 文档：`docs/tasks/items/T116-timepick-folder-resource-api-cutover.md`
- 文档：`docs/tasks/claims/T116-lee.md`
- 文档：`docs/progress/2026-06-03-lee.md`

## 实现内容

- DreamChasers 新增 TimePick folders/resources API。
- DreamChasers TimePick API 新增允许凭据的 CORS/OPTIONS 支持，默认允许 TimePick 本地开发源，生产域名可通过 `TIMEPICK_ALLOWED_ORIGINS` 配置。
- folders API 支持当前用户文件夹列表读取和删除文件夹；删除时会删除该文件夹树下资源和文件夹。
- resources API 支持全部资源、当前文件夹资源、当前文件夹含子文件夹资源、子文件夹和面包屑读取。
- resources API 支持移动资源到目标文件夹或全部资源根层，并校验资源 owner 和目标文件夹 owner。
- TimePick 新增 DreamChasers API client，并将 `FolderTree` / `ResourceList` 的 T116 主链路从 Supabase 切到 DreamChasers API。

## 验证命令

- `npm run test -w apps/web -- timepick account`
- `npm run typecheck -w apps/web`
- `npm run build -w apps/web`
- `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/FolderTree.tsx src/components/ResourceList.tsx`
- `npm run build`
- Kimi WebBridge 真实浏览器联调

## 验证结果

- DreamChasers `timepick account` 测试通过：5 个测试文件，18 个测试通过。
- DreamChasers 类型检查通过。
- DreamChasers Next build 通过。
- TimePick 定向 ESLint 通过。
- TimePick Vite build 通过，保留既有大 chunk warning。
- Kimi WebBridge 真实浏览器联调通过：TimePick `http://localhost:8080` 登录 DreamChasers 测试账号后进入 `/home`，`bootstrap`、`folders`、`resources` API 均返回 200，相关 OPTIONS preflight 返回 204。

## 遗留问题

- 新增/编辑资源、上传、灵感、待办、抽签、标签管理、AI 识别和历史数据导入仍未迁移。
- 本次联调账号是 `lee+t116@example.com`，新库没有历史数据，因此页面显示空资源状态；后续需要历史数据导入或新增/编辑资源 API 才能验证有数据场景。
