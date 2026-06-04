# T117：TimePick 文件夹新增和重命名 API 切换

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T116
- 提出来源：IDEA-20260604-01
- 背景：T116 已完成 TimePick 文件夹树读取、资源列表读取、删除文件夹、移动资源和 CORS/cookie 联调。`FolderDialog` 仍然直接调用 Supabase 做文件夹读取、查重、新建和编辑。
- 目标：DreamChasers 新增 TimePick 文件夹创建/更新 API，并让 TimePick `FolderDialog` 使用新 API 完成文件夹列表读取、同级重名检查、新建文件夹和重命名/移动父级。
- 不做：不替换资源新增/编辑/上传；不替换灵感、待办、抽签、标签管理、AI 识别；不导入历史数据；不修改 Prisma schema；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 主要文件范围：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/folders/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`, `/Users/lee/Desktop/Lee/TimePick/src/components/FolderDialog.tsx`, `docs/tasks/**`, `docs/progress/2026-06-04-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：`npm run test -w apps/web -- timepick account`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/FolderTree.tsx src/components/ResourceList.tsx src/components/FolderDialog.tsx`（TimePick）；`npm run build`（TimePick）；Kimi WebBridge 真实浏览器检查新建文件夹、重命名文件夹和同级重名提示；`npm run docs:sync`; `git diff --check`

## 实施范围

- DreamChasers folders API 增加创建和更新能力。
- DreamChasers 纯规则测试覆盖文件夹名称规范化、同级重名、父级 owner 和循环父级校验。
- TimePick `FolderDialog` 的文件夹列表读取、新建、编辑和查重改用 DreamChasers API。

## 完成记录

- 完成时间：2026-06-04
- DreamChasers `POST /api/timepick/folders` 支持当前用户创建文件夹。
- DreamChasers `PATCH /api/timepick/folders/[folderId]` 支持当前用户重命名文件夹和调整父级。
- 服务端校验文件夹名称不能为空、父级必须属于当前用户、同级不能重名、不能把文件夹移动到自己或子孙文件夹下。
- TimePick `FolderDialog` 已使用 DreamChasers API 读取文件夹、新建文件夹、编辑文件夹和做前端同级重名提示，不再直接调用 Supabase。
- Kimi WebBridge 真实浏览器联调确认新建文件夹、同级重名提示、重命名文件夹均可用；测试文件夹已清理。
- 验证结果：`npm run test -w apps/web -- timepick account`、`npm run typecheck -w apps/web`、TimePick 定向 ESLint 已通过；完整 build 和 diff check 在收尾验证中执行。
