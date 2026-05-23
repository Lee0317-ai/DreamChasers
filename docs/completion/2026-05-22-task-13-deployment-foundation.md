# T013 完成记录：添加部署文件

- 完成时间：2026-05-22
- 任务编号：T013
- 负责人：Codex / 开发 B

## 修改文件

- `apps/web/Dockerfile`
- `docker-compose.prod.yml`
- `.env.production.example`
- `.dockerignore`
- `deploy/nginx-host.conf`
- `deploy/README.md`
- `docs/tasks/items/T013-deployment-foundation.md`
- `docs/tasks/claims/T013-codex.md`
- `docs/progress/2026-05-22.md`
- `docs/completion/2026-05-22-task-13-deployment-foundation.md`

## 实现内容

- 新增 Web 生产 Dockerfile，Docker 构建阶段使用 `STANDALONE_BUILD=1` 和 `npm run build:standalone -w apps/web`，运行阶段包含 Next standalone 产物、Prisma schema、生成客户端和生产依赖。
- 新增生产 Compose 文件，包含 `postgres` 和 `web` 两个服务。
- PostgreSQL 使用 Docker volume 持久化，未对公网开放 5432。
- Web 服务只绑定宿主机 `127.0.0.1:3000`，供宿主机 Nginx 反代。
- 新增生产环境变量模板。
- 新增宿主机 Nginx 配置。
- 新增部署说明，覆盖本地构建镜像、上传、加载、启动、数据库初始化、Nginx 和备份。

## 验证命令

- `docker compose -f docker-compose.prod.yml --env-file .env.production.example config`
- `npm run build:standalone -w apps/web`
- `docker build --platform linux/amd64 -f apps/web/Dockerfile -t dreamchasers-web:latest .`

## 验证结果

- Compose 配置校验通过。
- standalone 构建通过。
- Docker 镜像构建未执行成功，原因是本地 Docker daemon 未运行；需要用户启动 Docker Desktop 后重新执行。

## 遗留问题

- 未执行远程服务器部署。
- 未配置 HTTPS。
- 当前项目还没有正式 Prisma migration，首次部署可先使用 `prisma db push`，正式上线前建议补 migration。
