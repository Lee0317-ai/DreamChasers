### 当前任务

- 任务编号：T111
- 任务名称：账号中心生产化配置和登录安全补强
- 负责人：Lee
- 状态：待验收
- 开始时间：2026-06-03
- 允许修改文件：`.env.example`, `.env.production.example`, `apps/web/prisma/**`, `apps/web/src/lib/auth/**`, `apps/web/src/lib/account/**`, `apps/web/src/app/login/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**`
- 禁止修改文件：PDF 工具箱实现文件、胡了卜游戏实现文件、AI 修图实现文件、AI 搜索、埋点、部署脚本、`.env`, `apps/web/.env`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm exec prisma validate -w apps/web`; `npm exec prisma db push -w apps/web`; `npm run test -w apps/web -- email-login account`; `npm run typecheck -w apps/web`; `npm run lint -w apps/web`; `npm run build -w apps/web`; 使用 Kimi WebBridge 检查 `/login` 重复提交提示；`npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：等待 Lee 验收邮箱登录生产配置和重复发送冷却；后续可拆真实 SMTP 配置上线任务或拾光接入试点。
