# DreamChasers 生产部署说明

本部署方案用于 Ubuntu 24.04 云服务器：

- 本地构建 Linux Docker 镜像。
- 上传镜像和 Compose 文件到服务器。
- 服务器使用 Docker Compose 运行 `web` 和 `postgres`。
- 宿主机 Nginx 反代 `127.0.0.1:3000`。

## 1. 本地构建镜像

在项目根目录执行：

```bash
docker build \
  --platform linux/amd64 \
  -f apps/web/Dockerfile \
  -t dreamchasers-web:latest .
```

导出并压缩镜像：

```bash
docker save dreamchasers-web:latest -o dreamchasers-web.tar
gzip -f dreamchasers-web.tar
```

## 2. 准备上传包

```bash
rm -rf release
mkdir -p release
cp dreamchasers-web.tar.gz release/
cp docker-compose.prod.yml release/docker-compose.yml
cp .env.production.example release/.env.production
cp deploy/nginx-host.conf release/nginx-host.conf
tar -czf dreamchasers-server-release.tar.gz -C release .
```

## 3. 上传服务器

```bash
scp dreamchasers-server-release.tar.gz root@47.90.180.92:/root/app/
```

## 4. 服务器解压

```bash
ssh root@47.90.180.92
cd /root/app
mkdir -p dreamchasers
tar -xzf dreamchasers-server-release.tar.gz -C dreamchasers
cd dreamchasers
```

## 5. 配置环境变量

编辑 `.env.production`：

```bash
nano .env.production
```

必须修改：

- `POSTGRES_PASSWORD`
- `DATABASE_URL` 中的密码
- `DIRECT_DATABASE_URL` 中的密码
- `NEXT_PUBLIC_APP_URL`，绑定域名后改成正式域名

`POSTGRES_PASSWORD`、`DATABASE_URL`、`DIRECT_DATABASE_URL` 里的密码必须一致。

## 6. 加载镜像并启动

```bash
docker load -i dreamchasers-web.tar.gz
docker compose --env-file .env.production up -d
docker compose ps
```

查看日志：

```bash
docker compose logs -f web
docker compose logs -f postgres
```

## 7. 初始化数据库

当前项目还没有正式 migration，首次部署可先执行：

```bash
docker compose exec web sh -lc "cd apps/web && npx prisma db push"
```

正式上线后应改为 Prisma migration：

```bash
docker compose exec web sh -lc "cd apps/web && npx prisma migrate deploy"
```

## 8. 配置宿主机 Nginx

```bash
cp nginx-host.conf /etc/nginx/conf.d/dreamchasers.conf
nginx -t
systemctl reload nginx
```

访问：

```text
http://47.90.180.92
```

## 9. 更新部署

本地重新构建和上传 `dreamchasers-web.tar.gz` 后，服务器执行：

```bash
cd /root/app/dreamchasers
docker compose down
docker load -i dreamchasers-web.tar.gz
docker compose --env-file .env.production up -d
docker compose ps
```

不要执行：

```bash
docker compose down -v
```

`-v` 会删除 PostgreSQL 数据卷。

## 10. 数据库备份

```bash
mkdir -p /root/backup/dreamchasers-postgres
docker compose exec postgres pg_dump -U dreamchasers dreamchasers > /root/backup/dreamchasers-postgres/backup-$(date +%F).sql
```

恢复：

```bash
cat /root/backup/dreamchasers-postgres/backup-2026-05-22.sql | docker compose exec -T postgres psql -U dreamchasers dreamchasers
```
