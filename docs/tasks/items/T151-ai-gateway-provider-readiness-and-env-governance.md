# T151：AI Gateway provider readiness 与环境变量治理

- 优先级：P0
- 负责人：Lee
- 状态：已完成
- 依赖：T149, T146
- 创建日期：2026-06-09
- 来源：T149 平台级 AI 治理与产品接线路线规划
- 涉及模块：AI Gateway / provider adapter / 环境变量治理
- 主要文件范围：`apps/web/src/lib/ai/**`, `apps/web/src/app/api/ai/**`, `docs/tasks/**`, `docs/progress/2026-06-09-lee.md`, `docs/completion/**`
- 验证方式：`npm run test -w apps/web -- ai-gateway model-catalog`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check`

## 目标

- 为 provider 增加统一 readiness 状态。
- 把环境变量读取提升为可判定的配置就绪检查。
- 统一 `enabled`、`misconfigured`、`disabled`、`dry_run_only` 等治理状态。
- 为账号中心治理面和后续产品接线提供统一运行时状态来源。

## 实现记录

- 新增 `apps/web/src/lib/ai/provider-readiness.ts`，统一返回 provider 的 readiness 状态和原因说明。
- 新增 `apps/web/src/lib/ai/__tests__/provider-readiness.test.ts`，覆盖：
  - `mock -> dry_run_only`
  - `openai_compatible -> disabled`
  - `openai_compatible -> misconfigured`
  - `openai_compatible -> enabled`
- `apps/web/src/lib/ai/account-ai-overview.ts` 已改为复用 `provider-readiness`，账号中心治理面不再维护独立的 provider 状态判断。
- `apps/web/src/lib/ai/ai-gateway.ts` 已在执行前接入 readiness 检查：
  - `disabled` -> `provider_unavailable`
  - `misconfigured` -> `provider_misconfigured`
- `apps/web/src/lib/ai/__tests__/ai-gateway.test.ts` 已补缺少 provider 配置时的结构化错误测试。

## 验证结果

- `npm run test -w apps/web -- provider-readiness account-ai-overview model-catalog ai-gateway`：通过，4 个测试文件 / 17 个测试。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- `npm run docs:sync`：待执行。
- `git diff --check`：待执行。
