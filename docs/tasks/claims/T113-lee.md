# T113：产品型工具 token 消费接口

- 领取人：Lee
- 领取时间：2026-06-03
- 状态：待验收
- 预计完成：2026-06-03
- 允许修改文件：`apps/web/src/lib/account/**`, `apps/web/src/app/api/account/products/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**`
- 禁止修改文件：PDF 工具箱实现文件、胡了卜游戏实现文件、AI 修图实现文件、AI 搜索、埋点、部署脚本、`.env`, `apps/web/.env`, `docker-compose.yml`, `docker-compose.prod.yml`
- 依赖任务：T108, T110, T112
- 验证命令：`npm run test -w apps/web -- product-session account`; `npm run typecheck -w apps/web`; `npm run lint -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check`
- 当前阻塞：无
- 下一步：等待 Lee 验收；后续可在新任务中接入拾光 TimePick 外部产品侧消费流程。
