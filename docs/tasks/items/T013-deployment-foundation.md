# T013：添加部署文件

- 优先级：P2
- 负责人：Codex / 开发 B
- 状态：已完成
- 背景：用户已初始化 Ubuntu 24.04 云服务器，计划采用本地构建 Docker 镜像、上传服务器、Docker Compose 运行 Web 和 PostgreSQL、宿主机 Nginx 反代的部署方式。
- 目标：补齐生产部署所需 Dockerfile、Compose、环境变量模板、宿主机 Nginx 配置和部署说明。
- 不做：不执行远程服务器部署，不配置 HTTPS 证书，不开放 PostgreSQL 公网端口，不修改业务功能。
- 依赖：T002, T004, T039
- 允许修改文件：`apps/web/Dockerfile`, `docker-compose.prod.yml`, `.env.production.example`, `.dockerignore`, `deploy/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/src/**`, `packages/**`, `apps/game/**`, `package-lock.json`
- 验证命令：`docker compose -f docker-compose.prod.yml --env-file .env.production.example config`; `npm run build:standalone -w apps/web`; `docker build --platform linux/amd64 -f apps/web/Dockerfile -t dreamchasers-web:latest .`
- 执行记录：已新增生产 Dockerfile、生产 Compose、环境变量模板、宿主机 Nginx 配置和部署说明。Compose 使用宿主机 Nginx，不在容器里占用 80/443；PostgreSQL 只在 Docker 内网，Web 只绑定 `127.0.0.1:3000`。Dockerfile 已补充生产依赖层，保证容器内可执行 Prisma 初始化命令。
- 完成摘要：Compose 配置校验通过；standalone 构建通过；本地 Docker daemon 未运行，Docker 镜像构建需用户启动 Docker Desktop 后执行。
