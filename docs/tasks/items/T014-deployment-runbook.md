# T014：上线清单和运营手册

- 优先级：P2
- 负责人：Codex / 开发 A
- 状态：已完成
- 背景：项目已经完成服务器实际部署，需要把完整流程整理成可复用的运维手册，方便后续按相同方式再次上线。
- 目标：输出一份可直接照做的 Markdown 部署流程，覆盖拉取最新 `main`、打包源码、服务器准备、Docker 构建、Compose 启动、Nginx 反代、验证和常见问题。
- 不做：不新增业务功能，不改产品文案，不配置 HTTPS，不开放 PostgreSQL 公网端口。
- 依赖：T001
- 允许修改文件：`docs/operations/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-27.md`, `docs/completion/**`
- 禁止修改文件：`apps/**`, `packages/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `package.json`, `package-lock.json`, `deploy/**`
- 验证命令：文档自审；`git diff --check`; `npm run docs:sync`
- 执行记录：已完成一次真实部署，流程包含 `git fetch origin main`、源码最小化打包、服务器端 Docker 构建、`docker compose up -d`、Nginx 反代和 `curl` 验证。过程中修复了 `package-lock.json`、Dockerfile workspace 复制和 Prisma 构建阶段环境变量问题。
- 完成摘要：已输出完整部署手册，覆盖从拉取最新 `main` 到服务器上线的真实流程，并补充了本次部署的依赖锁、Dockerfile workspace、Prisma 构建变量和 Nginx 验证问题。
