# T150：账号中心 AI 治理面升级

- 优先级：P0
- 负责人：Lee
- 状态：已完成
- 依赖：T149, T146
- 创建日期：2026-06-09
- 来源：T149 平台级 AI 治理与产品接线路线规划
- 涉及模块：账号中心 / AI Gateway 控制面
- 主要文件范围：`apps/web/src/app/account/ai/**`, `apps/web/src/lib/account/**`, `apps/web/src/lib/ai/**`, `docs/tasks/**`, `docs/progress/2026-06-09-lee.md`, `docs/completion/**`
- 验证方式：`npm run test -w apps/web -- account-ai-overview model-catalog ai-gateway account-ai-config`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check`

## 目标

- 把 `/account/ai/credits` 从静态总览升级为第一阶段 AI 治理面。
- 增加 provider 运行时状态摘要。
- 增加最近请求记录最小筛选和失败原因可读化。
- 继续保持“观察台 + 解释台”定位，不扩成真正运维后台。

## 实现记录

- `apps/web/src/lib/ai/account-ai-overview.ts` 已补治理展示所需的辅助层：
  - provider 运行时状态摘要；
  - 请求筛选标签；
  - 常见失败错误码的人类可读原因。
- `apps/web/src/lib/ai/__tests__/account-ai-overview.test.ts` 已补覆盖：
  - runtime provider 卡片状态；
  - 治理摘要计数；
  - 失败原因翻译。
- `/account/ai/credits` 已从纯静态总览升级为第一阶段治理面：
  - 保留能力目录、凭据来源策略和积分账本；
  - 新增运行时状态区块；
  - 新增最近请求的 `全部 / 成功 / 失败` 轻量筛选；
  - 失败请求会展示可读的失败原因。
- 当前实现仍保持“观察台 + 解释台”边界，没有提前扩成可编辑 provider 配置台或复杂运维后台。

## 验证结果

- `npm run test -w apps/web -- account-ai-overview model-catalog ai-gateway account-ai-config`：通过，4 个测试文件 / 14 个测试。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- `npm run docs:sync`：待执行。
- `git diff --check`：待执行。
