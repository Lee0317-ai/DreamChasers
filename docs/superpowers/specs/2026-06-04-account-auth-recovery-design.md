# 账号认证补全设计

**任务编号**：T138  
**负责人**：Lee  
**日期**：2026-06-04

## 目标

补齐邮箱密码账号体系的三个基础能力：忘记密码邮件重置、已登录修改密码、未验证邮箱重发验证邮件。实现必须延续 T135 的邮箱注册验证 + 邮箱密码登录，不恢复 magic-link 日常登录。

## 范围

第一阶段只做最小安全闭环：

- `/forgot-password`：提交邮箱并发送重置密码邮件。
- `/reset-password?token=...&email=...`：校验 token 后设置新密码。
- `/account/security`：已登录用户修改密码，并提供重发验证邮件入口。
- `/login/error`：未验证邮箱错误页提供重发验证邮件入口。

不做手机号、OAuth、TOTP、短信、设备强制下线、密码强度评分、历史密码复用检查、真实风控和验证码。

## 数据和 token

复用 Auth.js 已有 `VerificationToken` 表，不新增 Prisma schema：

- 密码重置 token：`identifier = "password-reset:<email>"`。
- 邮箱验证重发：继续使用 Auth.js Nodemailer provider 的验证链路，保持 `VerificationToken` 的默认兼容语义。

密码仍使用现有 `hashPassword` / `verifyPassword`，存入 `User.passwordHash`，不保存明文。

## 邮件策略

`email-login.ts` 拆出通用 SMTP 发送能力，并保留开发环境无 SMTP 时打印链接到服务端终端。新增重置密码邮件文案，明确“如果不是你本人操作，可以忽略”。

找回密码提交不泄露邮箱是否存在：无论账号是否存在，页面都进入“检查邮箱”反馈。

## 页面和交互

- 登录页增加“忘记密码”链接。
- 注册页或登录错误页保留返回登录入口。
- 未验证错误页可输入邮箱重发验证邮件。
- 安全页新增两个表单：
  - 修改密码：当前密码、新密码、确认新密码。
  - 重发验证邮件：仅在当前账号未验证时展示。

错误使用现有 `/login/error?reason=...` 风格，新增必要 reason：`reset-token-invalid`、`password-updated`、`verification-sent`、`current-password-invalid`。

## 测试

先补纯函数和 token helper 的 Vitest：

- token identifier 生成和邮箱规范化。
- 重置 token 生成、过期时间和 digest 长度。
- 重置密码邮件文案。
- 密码重置输入规则。

页面 server action 涉及数据库和 Auth.js provider，优先通过集成测试和真实浏览器检查验证。
