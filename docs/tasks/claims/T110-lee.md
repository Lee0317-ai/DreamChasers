### 当前任务

- 任务编号：T110
- 任务名称：账号中心邮箱验证登录和账户基础能力
- 负责人：Lee
- 状态：待验收
- 开始时间：2026-06-03
- 允许修改文件：`apps/web/package.json`, `package-lock.json`, `apps/web/prisma/**`, `apps/web/src/lib/auth/**`, `apps/web/src/lib/account/**`, `apps/web/src/app/api/auth/**`, `apps/web/src/app/api/account/**`, `apps/web/src/app/login/**`, `apps/web/src/app/account/**`, `apps/web/src/components/account/**`, `apps/web/src/components/AppHeader.tsx`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**`
- 禁止修改文件：PDF 工具箱实现文件、胡了卜游戏实现文件、AI 修图实现文件、AI 搜索、埋点、部署文件、`.env`, `apps/web/.env`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm exec prisma validate -w apps/web`; `npm run test -w apps/web -- account`; `npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; 使用 Codex App 内置浏览器检查 `/login` 和 `/account` 桌面端/移动端；`npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：等待 Lee 验收账号中心登录、账号页和 API Key 管理；后续可拆真实 SMTP 配置、拾光接入和 AI Gateway MVP。
