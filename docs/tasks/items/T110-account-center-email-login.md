# T110：账号中心邮箱验证登录和账户基础能力

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T004, T025, T108, T109
- 背景：T108 已确认平台需要统一账号中心、产品型工具入口和 AI Gateway 规划；Lee 已将数据库切换到自托管 PostgreSQL，账号中心可以开始进入实现。
- 目标：实现主站账号中心第一版，包含邮箱验证登录、自动注册、受保护账号首页、基础资料、安全审计、权益账本、平台 API Key 和产品 token exchange 骨架。
- 不做：不接真实支付；不迁移拾光或镜界账号；不实现 OAuth、密码登录、短信登录或 MFA；不接真实 AI Gateway 调用；不保存用户模型 API Key 明文；不修改 PDF 工具箱、胡了卜游戏或部署任务代码。
- 主要文件范围：`apps/web/package.json`, `package-lock.json`, `apps/web/prisma/**`, `apps/web/src/lib/auth/**`, `apps/web/src/lib/account/**`, `apps/web/src/app/api/auth/**`, `apps/web/src/app/api/account/**`, `apps/web/src/app/login/**`, `apps/web/src/app/account/**`, `apps/web/src/components/account/**`, `apps/web/src/components/AppHeader.tsx`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**`
- 验证方式：`npm exec prisma validate -w apps/web`; `npm run test -w apps/web -- account`; `npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; 使用 Codex App 内置浏览器检查 `/login` 和 `/account` 桌面端/移动端；`npm run docs:sync`; `git diff --check`

## 实施范围

- 使用 Auth.js、Prisma adapter 和 SMTP 邮件实现邮箱验证登录。
- 新邮箱首次通过邮件验证后自动创建平台用户。
- 登录回跳只允许站内路径；独立产品后续通过产品 token exchange 接入。
- 账号中心显示邮箱、昵称、权益余额、最近审计记录和平台 API Key 管理入口。
- API Key 只展示一次明文，数据库只保存 hash 和 hint。
- 权益第一版只做账本和状态，不接真实支付。

## 当前进展

- 2026-06-03：任务已创建并领取，准备按 TDD 实现账号中心核心服务、Prisma 模型、页面和 API。
- 2026-06-03：已完成邮箱验证登录、Auth.js 路由、账号中心页面、权益账本展示、AI Gateway 入口骨架、平台 API Key 创建/停用和 Prisma 账号模型。
- 2026-06-03：已将新账号中心 schema 同步到自托管 PostgreSQL，并通过内置浏览器完成邮箱登录、自动注册、账号中心和 API Key 创建检查。
