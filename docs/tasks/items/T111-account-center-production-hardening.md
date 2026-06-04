# T111：账号中心生产化配置和登录安全补强

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T108, T109, T110
- 背景：T110 已完成账号中心邮箱验证登录和 API Key 管理第一版，但生产环境还需要明确 Auth/SMTP 环境变量、登录发送冷却和基础安全提示，避免直接进入产品接入时把本地兜底当成正式配置。
- 目标：补齐账号中心生产化配置文档、环境变量示例、邮箱登录发送冷却和审计完整性，确保 `/login` 在缺少真实 SMTP 时本地可调试、生产可配置、重复发送可控。
- 不做：不接真实支付；不接 OAuth、短信或 MFA；不迁移拾光/镜界；不实现 AI Gateway 真实调用；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 主要文件范围：`.env.example`, `.env.production.example`, `apps/web/prisma/**`, `apps/web/src/lib/auth/**`, `apps/web/src/lib/account/**`, `apps/web/src/app/login/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**`
- 验证方式：`npm exec prisma validate -w apps/web`; `npm exec prisma db push -w apps/web`; `npm run test -w apps/web -- email-login account`; `npm run typecheck -w apps/web`; `npm run lint -w apps/web`; `npm run build -w apps/web`; 使用 Kimi WebBridge 检查 `/login` 重复提交提示；`npm run docs:sync`; `git diff --check`

## 实施范围

- 在环境变量示例中补充 `AUTH_SECRET`, `NEXTAUTH_URL`, `AUTH_EMAIL_SERVER`, `SMTP_*`。
- 新增邮箱登录发送冷却表和服务，默认同一邮箱 60 秒内只能请求一次登录邮件。
- 登录页在发送过快时显示可理解错误，不泄露账号是否存在。
- 保留本地开发兜底：无 SMTP 时服务端打印登录链接。
- 补充完成记录和进展说明。

## 当前进展

- 2026-06-03：已补齐 Auth/SMTP 环境变量示例。
- 2026-06-03：已新增 `EmailLoginRequest` 登录邮件冷却表和服务，同一邮箱 60 秒内重复请求会进入可恢复错误页。
- 2026-06-03：已将冷却表同步到自托管 PostgreSQL，并通过 Kimi WebBridge 验证重复提交提示。
