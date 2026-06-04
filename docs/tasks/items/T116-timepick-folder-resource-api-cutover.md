# T116：TimePick 文件夹和资源列表 API 切换

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T114, T115
- 提出来源：IDEA-20260603-06
- 背景：TimePick 登录壳已经切到 DreamChasers 账号，下一步需要把首页核心数据读取从 Supabase 切到 DreamChasers API。
- 目标：新增 DreamChasers TimePick folders/resources API，并让 TimePick `FolderTree` 和 `ResourceList` 使用新 API 读取文件夹树、资源列表、子文件夹和面包屑。
- 不做：不替换新增/编辑资源表单；不替换文件上传、灵感、待办、抽签、标签管理、AI 识别；不导入历史数据；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 主要文件范围：`apps/web/src/lib/timepick/**`, `apps/web/src/app/api/timepick/**`, `/Users/lee/Desktop/Lee/TimePick/src/lib/**`, `/Users/lee/Desktop/Lee/TimePick/src/components/FolderTree.tsx`, `/Users/lee/Desktop/Lee/TimePick/src/components/ResourceList.tsx`, `docs/tasks/**`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/modules/tools/ai-photo-editor/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证方式：`npm run test -w apps/web -- timepick account`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/FolderTree.tsx src/components/ResourceList.tsx`（TimePick）；`npm run build`（TimePick）；`npm run docs:sync`; `git diff --check`

## 实施范围

- DreamChasers 新增用户隔离的 TimePick folders/resources 查询服务和 API。
- TimePick 新增 API client，返回字段保持 Supabase 兼容。
- `FolderTree` 文件夹读取、删除文件夹、拖拽移动资源切到 DreamChasers API。
- `ResourceList` 资源列表、子文件夹和面包屑读取切到 DreamChasers API。

## 完成记录

- 完成时间：2026-06-03
- DreamChasers 新增 `GET /api/timepick/folders`、`DELETE /api/timepick/folders/[folderId]`、`GET /api/timepick/resources`、`PATCH /api/timepick/resources/[resourceId]`。
- DreamChasers TimePick API 已补充允许凭据的 CORS 和 OPTIONS preflight，默认允许 TimePick 本地开发源 `http://localhost:8080` / `http://127.0.0.1:8080`，生产可通过 `TIMEPICK_ALLOWED_ORIGINS` 配置。
- 新增 TimePick API 纯规则测试，覆盖旧字段映射、资源查询范围和移动 owner 校验。
- TimePick 新增 `src/lib/timepick-api.ts`，`FolderTree` 和 `ResourceList` 的文件夹树、资源列表、子文件夹、面包屑、删除文件夹和移动资源已改用 DreamChasers API。
- 保持 T116 不做范围：新增/编辑资源、上传、灵感、待办、抽签、标签管理、AI 识别和历史数据导入未替换。
- 验证结果：`npm run test -w apps/web -- timepick account`、`npm run typecheck -w apps/web`、`npm run build -w apps/web`、TimePick 定向 ESLint、TimePick `npm run build` 已通过；Kimi WebBridge 真实浏览器联调确认 TimePick `/home` 可读取 DreamChasers `bootstrap`、`folders`、`resources` API。
