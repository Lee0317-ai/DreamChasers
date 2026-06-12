# T152：AI Gateway 标准错误码与请求日志收口

- 优先级：P0
- 负责人：Lee
- 状态：已完成
- 依赖：T149, T146, T151
- 创建日期：2026-06-09
- 来源：T149 平台级 AI 治理与产品接线路线规划
- 涉及模块：AI Gateway / 请求日志 / 额度治理
- 主要文件范围：`apps/web/src/lib/ai/**`, `apps/web/src/app/api/ai/**`, `apps/web/src/app/api/timepick/**`, `docs/tasks/**`, `docs/progress/2026-06-09-lee.md`, `docs/completion/**`
- 验证方式：`npm run test -w apps/web -- ai-gateway mock-provider timepick-fortune-chat timepick-recognition`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check`

## 目标

- 统一 Gateway 标准错误码集合。
- 统一产品侧错误翻译口径。
- 统一请求日志中的状态、错误码和摘要语义。
- 为后续 PDF 工具箱与 AI 修图接线提供统一审计和失败治理基础。

## 实现记录

- 新增 `apps/web/src/lib/ai/error-display.ts`，统一维护标准错误码到可读标签与说明的映射。
- 新增 `apps/web/src/lib/ai/route-error.ts`，统一 AI / TimePick 路由层的错误输出结构。
- 新增 `apps/web/src/lib/ai/__tests__/error-display.test.ts`，覆盖标准错误码和未知错误码的展示语义。
- `apps/web/src/lib/ai/account-ai-overview.ts` 已改为复用统一错误展示层，不再内嵌独立失败原因映射。
- `apps/web/src/lib/ai/ai-gateway.ts` 已把失败日志中的 `errorCode` 从原始 `Error.name` 收口为统一错误码：
  - `AiGatewayError` -> 保留结构化 `code`
  - 非结构化异常 -> `execution_failed`
- `apps/web/src/app/api/ai/tasks/route.ts`、`apps/web/src/app/api/timepick/fortune/chat/route.ts`、`apps/web/src/app/api/timepick/recognition/url/route.ts` 已统一复用错误响应 helper。
- `apps/web/src/lib/ai/__tests__/ai-gateway.test.ts` 已补 provider 执行失败时的失败日志断言，确保错误码与摘要语义一致。

## 验证结果

- `npm run test -w apps/web -- error-display ai-gateway mock-provider timepick-fortune-chat timepick-recognition`：通过，5 个测试文件 / 14 个测试。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- `npm run docs:sync`：待执行。
- `git diff --check`：待执行。
