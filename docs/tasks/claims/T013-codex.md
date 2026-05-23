# T013：添加部署文件

- 领取人：Codex / 开发 B
- 领取时间：2026-05-22
- 状态：已完成
- 预计完成：2026-05-22
- 允许修改文件：`apps/web/Dockerfile`, `docker-compose.prod.yml`, `.env.production.example`, `.dockerignore`, `deploy/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/src/**`, `packages/**`, `apps/game/**`, `package-lock.json`
- 依赖任务：T002, T004, T039
- 验证命令：`docker compose -f docker-compose.prod.yml --env-file .env.production.example config`; `npm run build:standalone -w apps/web`; `docker build --platform linux/amd64 -f apps/web/Dockerfile -t dreamchasers-web:latest .`
- 当前风险：本地 Docker daemon 未运行，镜像构建需用户启动 Docker Desktop 后执行。
- 备注：已补部署文件和说明，不执行远程部署。
