# T039：条件启用 Next.js standalone 自托管构建

- 优先级：P1
- 负责人：Codex / 开发 A
- 状态：已完成
- 背景：项目既需要保留 Vercel 自动部署，又需要支持本地构建后上传 Alibaba Cloud Linux 自托管。直接写死 `output: "standalone"` 可能影响 Vercel 默认路径，因此需要条件启用。
- 目标：通过环境变量 `STANDALONE_BUILD=1` 启用 Next.js standalone 输出；默认构建保持 Vercel 兼容。
- 不做：不新增 Dockerfile，不修改 PDF 工具箱业务代码，不配置 Nginx，不执行远程服务器部署。
- 依赖：T024, T025
- 允许修改文件：`apps/web/next.config.ts`, `apps/web/package.json`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/src/modules/tools/pdf-toolbox/**`, `apps/web/src/app/tools/pdf-toolbox/**`, `packages/**`, `apps/game/**`, `docker-compose.yml`, `package-lock.json`
- 验证命令：`npm run build -w apps/web`; `npm run build:standalone -w apps/web`; 检查 `apps/web/.next/standalone`
- 执行记录：已在 `apps/web/next.config.ts` 中通过 `STANDALONE_BUILD=1` 条件启用 `output: "standalone"`；已在 `apps/web/package.json` 新增 `build:standalone` 脚本。
- 完成摘要：默认 `npm run build -w apps/web` 保持 Vercel 兼容；本地自托管构建使用 `npm run build:standalone -w apps/web` 并生成 `apps/web/.next/standalone`。
