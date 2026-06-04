# T135 完成记录：账号统一中心页面体系实现

- 任务编号：T135
- 负责人：Lee
- 完成日期：2026-06-04

## 修改文件

- `apps/web/prisma/schema.prisma`
- `apps/web/src/app/login/**`
- `apps/web/src/app/register/**`
- `apps/web/src/app/account/**`
- `apps/web/src/components/AppHeader.tsx`
- `apps/web/src/components/account/**`
- `apps/web/src/lib/account/**`
- `apps/web/src/lib/auth/**`
- `apps/web/src/generated/prisma/**`
- `apps/web/src/app/globals.css`
- `docs/tasks/**`
- `docs/progress/2026-06-04.md`
- `docs/superpowers/specs/2026-06-04-account-center-redesign-design.md`
- `docs/superpowers/plans/2026-06-04-account-center-redesign.md`

## 实现内容

- 完成账号中心统一 shell、侧栏/移动导航、账号概览、个人信息、安全、设备、AI 积分、充值、订阅、LLM 配置、API Key 和产品接入页面。
- 新增 `/register` 注册页，注册时设置密码并发送邮箱验证邮件。
- `/login` 改为邮箱 + 密码登录，不再发送登录邮件。
- `User` 增加 `passwordHash`；新增 scrypt 密码哈希和校验；Auth.js 增加 Credentials provider，保留 Nodemailer provider 作为注册邮箱验证通道。
- 修正 `/register` 顶部导航归属，确保注册页使用工具箱账号导航。
- LLM 配置页按 T108/T133 策略展示平台额度、临时 Key、外部 Gateway BYOK、后续加密 Vault 和本地连接器，不保存 provider 明文 key。

## 验证命令

- `npm run test -w apps/web`
- `npm run typecheck`
- `npm run lint`
- `set -a; source /Users/lee/Desktop/Lee/DreamChasers/.env; set +a; npm run build`
- Playwright 桌面/移动截图：`/login`, `/register`
- Kimi WebBridge 快照：`/account`, `/account/security`, `/account/ai/llm-config` 等账号路由

## 验证结果

- 测试通过：14 个测试文件、78 个测试。
- 类型检查通过。
- Lint 通过，存在 Prisma 生成文件既有 unused eslint-disable warnings。
- 生产构建通过，Next.js app route 包含 `/register`。
- 页面检查通过：登录和注册移动/桌面无裁切；已登录账号路由导航和页面内容正常。

## 遗留问题

- 还未实现找回密码、修改密码、手机号、OAuth、TOTP、支付订阅、真实 AI Gateway 调用。
- 生产部署前需要执行数据库迁移或等效 schema 同步，为 `User.passwordHash` 增加字段。
