# T136：账号注册登录数据库同步和真实链路联调

- 状态：已完成
- 负责人：Lee
- 创建日期：2026-06-04
- 优先级：P0
- 来源：T135 后续验证

## 背景

T135 已把账号中心认证方式修正为邮箱注册验证 + 邮箱密码登录，并为 `User` 增加 `passwordHash`。下一步需要把本地数据库 schema 同步到当前 Prisma schema，并用真实页面/接口验证注册、验证邮件和邮箱密码登录链路。

## 文件范围

允许修改：

- `apps/web/prisma/schema.prisma`
- `apps/web/src/lib/auth/**`
- `apps/web/src/app/login/**`
- `apps/web/src/app/register/**`
- T136 相关文档：`docs/tasks/**`, `docs/progress/**`, `docs/completion/**`

禁止修改：

- PDF 工具箱、AI 修图、游戏和 TimePick 业务代码
- 支付、部署、AI Gateway 运行时代码
- 与注册登录联调无关的账号中心页面

## 验证命令

- `set -a; source /Users/lee/Desktop/Lee/DreamChasers/.env; set +a; npx prisma db push --schema apps/web/prisma/schema.prisma`
- `set -a; source /Users/lee/Desktop/Lee/DreamChasers/.env; set +a; npm run dev`
- 真实浏览器检查：`/register`, `/login`, `/login/check-email`, `/account`
- 数据库验证：确认测试用户 `passwordHash` 存在且不是明文。
- `npm run test -w apps/web`
- `npm run typecheck`
- `npm run lint`
- `set -a; source /Users/lee/Desktop/Lee/DreamChasers/.env; set +a; npm run build`
- `npm run docs:sync`
- `git diff --check`

## 验收标准

- 本地数据库已同步 `User.passwordHash` 字段。
- 新邮箱注册会写入哈希密码并触发验证邮件流程。
- 未验证账号不能用密码登录。
- 完成邮箱验证后可用邮箱 + 密码登录并进入 `/account`。
- 旧 session/cookie 失效时页面能回到登录页，不阻塞新登录。
- 验证命令和文档同步通过。

## 验证结果

- `npx prisma db push` 已在 `apps/web` 目录下执行，`.env` 指向的 PostgreSQL schema 已同步。
- 只读查询确认 `public."User"."passwordHash"` 存在，类型为 nullable `text`。
- 使用测试邮箱 `lee+t136-20260604181929@example.com` 完成注册，开发终端打印注册验证链接。
- 数据库确认测试用户注册后 `emailVerified=false`，`passwordHash` 前缀为 `scrypt`，不包含明文密码。
- 未验证账号密码登录被重定向到 `/login/error?reason=email-not-verified`。
- 打开验证链接后进入 `/account`，页面显示邮箱已验证和密码登录已启用。
- 退出登录后使用邮箱 + 密码重新登录成功进入 `/account`。
- 测试用户已从数据库清理。
