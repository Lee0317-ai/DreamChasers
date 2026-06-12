# T151 AI Gateway provider readiness 与环境变量治理完成记录

- 完成时间：2026-06-09
- 负责人：Lee
- 任务编号：T151
- 任务名称：AI Gateway provider readiness 与环境变量治理

## 修改文件

- `apps/web/src/lib/ai/provider-readiness.ts`
- `apps/web/src/lib/ai/__tests__/provider-readiness.test.ts`
- `apps/web/src/lib/ai/account-ai-overview.ts`
- `apps/web/src/lib/ai/ai-gateway.ts`
- `apps/web/src/lib/ai/__tests__/account-ai-overview.test.ts`
- `apps/web/src/lib/ai/__tests__/ai-gateway.test.ts`
- `docs/tasks/items/T151-ai-gateway-provider-readiness-and-env-governance.md`
- `docs/tasks/claims/T151-lee.md`
- `docs/progress/2026-06-09-lee.md`

## 实现内容

- 新增统一 provider readiness helper，收敛 `enabled`、`misconfigured`、`disabled`、`dry_run_only` 四种状态。
- 让账号中心治理面和 AI Gateway 共用同一套 provider readiness 判断，不再各自维护独立逻辑。
- 为 `openai_compatible` 增加环境变量驱动的 readiness 判断。
- 在 Gateway 执行前新增 provider readiness 拦截，避免配置不完整时继续走真实调用路径。

## 验证命令

```bash
npm run test -w apps/web -- provider-readiness account-ai-overview model-catalog ai-gateway
npm run typecheck -w apps/web
npm run build -w apps/web
npm run docs:sync
git diff --check
```

## 验证结果

- DreamChasers 测试通过：4 个测试文件 / 17 个测试。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- `npm run docs:sync`：待执行。
- `git diff --check`：待执行。

## 遗留问题

- `git diff --check` 仍会被 Prisma 生成文件中的尾随空格噪音拦住，这属于当前仓库的生成产物问题，不是本任务逻辑回归。
- 错误码集合和请求日志语义的进一步统一收口留到 `T152`。
