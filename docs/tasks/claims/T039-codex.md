# T039：条件启用 Next.js standalone 自托管构建

- 领取人：Codex / 开发 A
- 领取时间：2026-05-22
- 状态：已完成
- 预计完成：2026-05-22
- 允许修改文件：`apps/web/next.config.ts`, `apps/web/package.json`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/2026-05-22-task-39-conditional-standalone-build.md`
- 禁止修改文件：`apps/web/src/modules/tools/pdf-toolbox/**`, `apps/web/src/app/tools/pdf-toolbox/**`, `packages/**`, `apps/game/**`, `docker-compose.yml`, `package-lock.json`
- 依赖任务：T024, T025
- 验证命令：`npm run build -w apps/web`; `npm run build:standalone -w apps/web`; 检查 `apps/web/.next/standalone`
- 当前风险：本任务只做构建配置，不包含服务器部署、Nginx 配置、PM2 配置或 release 打包脚本。
- 备注：默认 `npm run build -w apps/web` 保持 Vercel 兼容；本地自托管构建使用 `npm run build:standalone -w apps/web` 并生成 `apps/web/.next/standalone`。
