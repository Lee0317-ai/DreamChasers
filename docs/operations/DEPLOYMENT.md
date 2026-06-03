# DreamChasers 部署手册

本文记录的是项目当前已经跑通的一套生产部署流程，适用于 Ubuntu 24.04 云服务器。

## 1. 部署架构

- 本地先对齐最新 `main`。
- 本地只打最小部署包，不打整个仓库大包。
- 服务器端用 Docker 构建 `dreamchasers-web:latest`。
- `docker compose` 在服务器上启动 `web` 和 `postgres`。
- 宿主机 Nginx 反代 `127.0.0.1:3000`。

## 2. 服务器前提

- 系统：Ubuntu 24.04
- 账号：`root`
- 公网 IP：`47.90.180.92`
- 需要安装：Docker、Docker Compose、Nginx
- 需要放行：80 端口

## 3. 本地准备

先把仓库对齐到最新 `main`：

```bash
git fetch origin main
git reset --hard origin/main
git rev-parse --short HEAD
```

如果 `git fetch` 卡住，优先检查 GitHub SSH 认证是否正常。

## 4. 本地打包

只打部署需要的最小内容：

```bash
tmpdir=$(mktemp -d)
cat > "$tmpdir/files.txt" <<'EOF'
package.json
package-lock.json
tsconfig.base.json
apps/web
packages/shared
EOF
tar -czf "$tmpdir/dreamchasers-web-src.tar.gz" \
  --exclude='apps/web/.next' \
  --exclude='apps/web/node_modules' \
  --exclude='node_modules' \
  --files-from "$tmpdir/files.txt"
```

不要把 `node_modules`、`.next`、`output`、游戏大素材一起打进部署包。

## 5. 上传服务器

```bash
scp "$tmpdir/dreamchasers-web-src.tar.gz" root@47.90.180.92:/root/app/dreamchasers-web-src.tar.gz
scp docker-compose.prod.yml root@47.90.180.92:/root/app/dreamchasers/docker-compose.yml
scp deploy/nginx-host.conf root@47.90.180.92:/root/app/dreamchasers/nginx-host.conf
```

## 6. 服务器目录

```bash
ssh root@47.90.180.92
mkdir -p /root/app/dreamchasers
cd /root/app/dreamchasers
```

如果目录里已有旧文件，保留 `.env.production`、`docker-compose.yml` 和 `nginx-host.conf`，其余源码重新覆盖。

## 7. 环境变量

创建 `.env.production`：

```bash
cat > .env.production <<'ENV'
POSTGRES_DB=dreamchasers
POSTGRES_USER=dreamchasers
POSTGRES_PASSWORD=Dream@2026
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=http://47.90.180.92
DATABASE_URL=postgresql://dreamchasers:Dream%402026@postgres:5432/dreamchasers?schema=public
DIRECT_DATABASE_URL=postgresql://dreamchasers:Dream%402026@postgres:5432/dreamchasers?schema=public
NEXT_PUBLIC_SUPABASE_URL=https://tgrxbwyfwtlrmrjmvihf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=replace-me
REDIS_URL=redis://localhost:6379
ENV
```

注意：

- `@` 需要在 `DATABASE_URL` 和 `DIRECT_DATABASE_URL` 里写成 `%40`。
- `POSTGRES_PASSWORD` 要和数据库连接串里的密码一致。
- 当前第一版没有单独的 Redis 容器，`REDIS_URL` 只保留占位。

## 8. 服务器解包

```bash
tar -xzf /root/app/dreamchasers-web-src.tar.gz -C /root/app/dreamchasers
```

## 9. Dockerfile 注意点

`apps/web/Dockerfile` 里要满足这几个条件：

- `deps` 阶段复制 `package.json`、`package-lock.json`、`apps/web/package.json`、`packages/shared/package.json`
- `builder` 阶段给 Prisma 一个可解析的占位 `DATABASE_URL`
- 运行阶段保留 Next standalone 产物、`prisma` 目录和生成客户端

如果 `npm ci` 报 workspace 锁文件问题，先同步 `package-lock.json`。
如果 `prisma generate` 报 `DATABASE_URL` 缺失，给 build 阶段加占位连接串。

## 10. 构建镜像

```bash
docker build --platform linux/amd64 -f apps/web/Dockerfile -t dreamchasers-web:latest .
```

如果服务器上 `compose` 先去拉远程镜像，说明本地镜像还没构建好。

## 11. 启动服务

```bash
docker compose --env-file .env.production up -d
docker compose ps
docker compose logs -f web
docker compose logs -f postgres
```

第一版数据库用容器内 `postgres` 服务，不用公网数据库。

## 12. 初始化数据库

首次部署可先执行：

```bash
docker compose exec web sh -lc "cd apps/web && npx prisma db push"
```

如果后面已经切到正式 migration，再改成：

```bash
docker compose exec web sh -lc "cd apps/web && npx prisma migrate deploy"
```

## 13. Nginx 反代

在服务器写入：

```nginx
server {
    listen 80;
    server_name 47.90.180.92;

    client_max_body_size 100m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

然后执行：

```bash
nginx -t
systemctl reload nginx
```

## 14. 验证

本机验证：

```bash
curl -I http://127.0.0.1:3000
```

公网验证：

```bash
curl -I http://47.90.180.92
```

期望结果：

- 两个请求都返回 `200 OK`
- 响应头里能看到 `X-Powered-By: Next.js`

## 15. 本地一键更新部署

项目里已经提供更新部署脚本 `deploy/update-deploy.sh`。后续更新时，在本地项目根目录直接执行：

```bash
bash deploy/update-deploy.sh
```

脚本会自动完成：

- 本地打包最小源码包
- 上传源码包到服务器
- 上传 `docker-compose.prod.yml` 为服务器 `docker-compose.yml`
- 上传脚本自身到服务器
- 远程解包最新源码
- 远程重新构建 `dreamchasers-web:latest`
- 远程重启 `docker compose`
- 校验服务器本机 `127.0.0.1:3000`
- 校验公网 `http://47.90.180.92`

脚本默认使用：

```bash
REMOTE_HOST=47.90.180.92
REMOTE_USER=root
REMOTE_APP_DIR=/root/app/dreamchasers
REMOTE_TAR=/root/app/dreamchasers-web-src.tar.gz
IMAGE_NAME=dreamchasers-web:latest
```

如需覆盖，可以在命令前加环境变量：

```bash
REMOTE_HOST=your-server-ip bash deploy/update-deploy.sh
```

脚本不会保存服务器密码；如果本地没有 SSH key，按 `ssh/scp` 提示输入服务器密码即可。

如果只想在服务器内执行远程更新逻辑，可以执行：

```bash
scp deploy/update-deploy.sh root@47.90.180.92:/root/app/dreamchasers/update-deploy.sh
ssh root@47.90.180.92
chmod +x /root/app/dreamchasers/update-deploy.sh
SOURCE_TAR=/root/app/dreamchasers-web-src.tar.gz /root/app/dreamchasers/update-deploy.sh --remote
```

不要执行：

```bash
docker compose down -v
```

`-v` 会删除 PostgreSQL 数据卷。

## 16. 常见问题

### `npm ci` 失败

原因通常是 `package-lock.json` 没和 `package.json` 对齐。

### `prisma generate` 失败

原因通常是构建阶段没有 `DATABASE_URL`。

### `docker compose` 找不到镜像

原因通常是还没在服务器本地执行 `docker build`。

### 访问公网 IP 404 或空白

先检查：

1. `docker compose ps`
2. `docker compose logs -f web`
3. `nginx -t`
4. 80 端口是否放行
