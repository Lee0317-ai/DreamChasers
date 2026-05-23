# T039 完成记录：条件启用 Next.js standalone 自托管构建

- 完成时间：2026-05-22
- 任务编号：T039
- 负责人：Codex / 开发 A

## 修改文件

- `apps/web/next.config.ts`
- `apps/web/package.json`
- `docs/tasks/items/T039-conditional-standalone-build.md`
- `docs/tasks/claims/T039-codex.md`
- `docs/progress/2026-05-22.md`
- `docs/completion/2026-05-22-task-39-conditional-standalone-build.md`

## 实现内容

- 通过环境变量 `STANDALONE_BUILD=1` 条件启用 Next.js `output: "standalone"`。
- 默认构建不启用 standalone，避免影响 Vercel 自动部署路径。
- 新增 Web 子应用脚本 `build:standalone`，用于本地构建 Alibaba Cloud Linux 自托管运行产物。

## 验证命令

- `npm run build -w apps/web`
- `npm run build:standalone -w apps/web`
- `find apps/web/.next -maxdepth 2 -type d -name standalone -print`

## 验证结果

- 默认构建通过。
- standalone 构建通过。
- 已生成 `apps/web/.next/standalone`。

## 遗留问题

- 本任务只做构建配置，不包含服务器部署、Nginx 配置、PM2 配置或 release 打包脚本。
