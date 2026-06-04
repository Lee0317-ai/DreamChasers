# T138：账号找回密码、修改密码和重发验证邮件

- 状态：已完成
- 负责人：Lee
- 创建日期：2026-06-04
- 优先级：P0
- 来源：T135/T136 后续认证能力补全

## 背景

T135/T136 已完成邮箱注册验证 + 邮箱密码登录。当前缺少账号体系上线前常规能力：忘记密码后的邮件重置、已登录用户修改密码、未验证账号重发验证邮件。三者都依赖邮箱、token、密码哈希和安全页入口，适合合并成一个收敛任务。

## 文件范围

允许修改：

- `apps/web/src/lib/auth/**`
- `apps/web/src/app/login/**`
- `apps/web/src/app/register/**`
- `apps/web/src/app/forgot-password/**`
- `apps/web/src/app/reset-password/**`
- `apps/web/src/app/account/security/page.tsx`
- `apps/web/src/lib/account/**` 中与安全页展示相关的最小改动
- `apps/web/src/app/globals.css` 中账号表单样式的最小补充
- 当前任务相关文档：`docs/tasks/**`, `docs/progress/**`, `docs/completion/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`

禁止修改：

- PDF 工具箱、AI 修图、游戏和 TimePick 业务代码
- 支付、部署、AI Gateway 运行时代码
- Prisma schema，除非实现中证明 `VerificationToken` 无法满足需求
- LLM 配置策略，不允许改成保存原始 provider key

## 验证命令

- `npm run test -w apps/web -- auth account`
- `npm run typecheck`
- `npm run lint`
- `set -a; source /Users/lee/Desktop/Lee/DreamChasers/.env; set +a; npm run build`
- 浏览器检查：`/forgot-password`, `/reset-password`, `/login/error`, `/account/security`
- `npm run docs:sync`
- `git diff --check`

## 验收标准

- 忘记密码页可输入邮箱并发送重置密码邮件；无论邮箱是否存在，页面反馈不泄露账号枚举。
- 重置密码页可用有效 token 设置新密码，密码继续以 scrypt 哈希保存；无效或过期 token 不能改密码。
- 已登录用户可在账号安全页输入当前密码和新密码修改密码；当前密码错误、新密码过短、两次新密码不一致均有明确错误跳转。
- 未验证邮箱可从错误页或相关入口重新发送验证邮件；已验证邮箱不会重复发送验证邮件。
- 注册验证邮件、重置密码邮件在开发环境无 SMTP 时继续打印链接到服务端终端。
- 认证纯规则和 token/email helper 有测试覆盖，并通过项目验证命令。

## 实施设计

详见 `docs/superpowers/specs/2026-06-04-account-auth-recovery-design.md` 和 `docs/superpowers/plans/2026-06-04-account-auth-recovery.md`。

## 当前进度

- 已登记任务和领取范围。
- 已完成 recovery helper、重置密码邮件、server actions、找回密码页、重置密码页、登录错误页重发验证入口和安全页修改密码表单。
- 已通过定向测试、类型检查、lint、构建和页面 HTTP 烟测。

## 验证结果

- `npm run test -w apps/web -- recovery`：1 个测试文件、4 个测试通过。
- `npm run test -w apps/web -- email-login`：1 个测试文件、4 个测试通过。
- `npm run test -w apps/web -- auth`：4 个测试文件、14 个测试通过。
- `npm run test -w apps/web -- auth account`：9 个测试文件、32 个测试通过。
- `npm run typecheck`：通过。
- `npm run lint`：通过，保留 Prisma generated 既有 unused eslint-disable warning。
- `set -a; source /Users/lee/Desktop/Lee/DreamChasers/.env; set +a; npm run build`：通过，Next.js 构建新增 `/forgot-password` 和 `/reset-password` 路由。
- 页面 HTTP 烟测：`/forgot-password`、`/reset-password`、`/login/error?reason=email-not-verified`、`/login/check-email?mode=password-reset` 均返回 200 并包含预期文案。
