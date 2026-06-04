### 当前任务

- 任务编号：T112
- 任务名称：产品型工具 token exchange 骨架
- 负责人：Lee
- 状态：待验收
- 开始时间：2026-06-03
- 允许修改文件：`apps/web/src/lib/account/**`, `apps/web/src/app/api/account/products/**`, `apps/web/src/components/account/**`, `apps/web/src/app/account/**`, `apps/web/prisma/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**`
- 禁止修改文件：PDF 工具箱实现文件、胡了卜游戏实现文件、AI 修图实现文件、AI 搜索、埋点、部署脚本、`.env`, `apps/web/.env`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm run test -w apps/web -- product-session account`; `npm run typecheck -w apps/web`; `npm run lint -w apps/web`; `npm run build -w apps/web`; 使用 Kimi WebBridge 检查 `/account` 产品 token 生成；`npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：等待 Lee 验收产品 token exchange 骨架；后续可拆拾光真实接入任务。
