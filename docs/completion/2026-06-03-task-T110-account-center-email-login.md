# T110 账号中心邮箱验证登录和账户基础能力完成记录

- 完成时间：2026-06-03
- 负责人：Lee
- 任务编号：T110
- 任务名称：账号中心邮箱验证登录和账户基础能力

## 修改文件

- `apps/web/package.json`
- `package-lock.json`
- `apps/web/prisma/schema.prisma`
- `apps/web/src/generated/prisma/**`
- `apps/web/src/lib/auth/**`
- `apps/web/src/lib/account/**`
- `apps/web/src/app/api/auth/**`
- `apps/web/src/app/api/account/**`
- `apps/web/src/app/login/**`
- `apps/web/src/app/account/**`
- `apps/web/src/components/account/**`
- `apps/web/src/components/AppHeader.tsx`
- `apps/web/src/app/globals.css`
- `docs/tasks/**`
- `docs/progress/2026-06-03-lee.md`
- `docs/completion/2026-06-03-task-T110-account-center-email-login.md`

## 实现内容

- 接入 Auth.js、Prisma adapter 和 Nodemailer provider，完成邮箱验证登录。
- SMTP 通过环境变量配置；本地未配置 SMTP 时在服务端终端打印开发登录链接。
- 新邮箱验证成功后自动创建平台用户并进入 `/account`。
- 新增账号中心首页、登录页、检查邮箱页、登录错误页、安全页、权益页、AI 模型来源页和 API Key 管理页。
- 新增平台 API Key 创建/停用 API，明文只展示一次，数据库只保存 hash 和 hint。
- 新增账号中心 Prisma 模型：用户、会话、验证 token、资料、产品、权益账本、平台 API Key、产品 session、模型凭据引用和审计日志。
- 将账号中心 schema 同步到自托管 PostgreSQL。

## 验证命令

- `npm exec prisma validate -w apps/web`
- `npm exec prisma db push -w apps/web`
- `npm run test -w apps/web -- account email-login`
- `npm run typecheck -w apps/web`
- `npm run lint -w apps/web`
- `npm run build -w apps/web`
- Kimi WebBridge 打开 `http://localhost:3000/login`、提交邮箱、使用开发登录链接回调到 `/account`、打开 `/account/api-keys` 并创建 API Key

## 验证结果

- Prisma schema 校验通过。
- 数据库 schema 已同步到目标 PostgreSQL。
- 账号相关测试通过：2 个测试文件，8 个测试用例。
- TypeScript 类型检查通过。
- ESLint 通过；Prisma 生成文件仍有 unused eslint-disable 警告，退出码为 0。
- 生产构建通过。
- 浏览器检查通过：邮箱登录请求成功，开发登录链接可自动注册并进入账号中心，API Key 创建后明文只展示一次。

## 遗留问题

- 生产环境必须配置 `AUTH_SECRET` 和 SMTP 环境变量；当前代码仅提供本地开发兜底。
- 未接真实支付、订阅扣款、拾光/镜界迁移、AI Gateway 真实调用和用户模型 Key Vault。
- Kimi WebBridge 当前无法调整浏览器 viewport；移动端检查只做了响应式 CSS 约束和桌面浏览器无横向溢出确认，后续如需严格截图可单独接入 Playwright 或浏览器设备模拟工具。
