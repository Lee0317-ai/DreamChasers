# T146：AI Gateway MVP 运行时与模型 API

- 状态：已完成
- 负责人：Lee
- 创建日期：2026-06-08
- 优先级：P0
- 来源：T143 AI Gateway MVP 实施计划

## 背景

T143 只完成了 AI Gateway MVP 的实施计划，仓库里还没有真正可运行的 AI Gateway 后端。账号中心已经有平台积分、API Key 和模型来源蓝图，但还没有统一的模型目录、能力模型列表 API、任务执行 API、积分扣减和请求日志。

## 文件范围

允许修改：

- `apps/web/prisma/**`
- `apps/web/src/lib/ai/**`
- `apps/web/src/app/api/ai/**`
- `apps/web/src/lib/account/**`
- T146 相关文档

禁止修改：

- TimePick 外部仓库
- 账号中心 UI 主结构，除非为 AI Gateway 接口接线所需最小改动
- PDF 工具箱、游戏和部署脚本
- 真实支付、订阅、Key Vault、用户 provider key 持久化

## 验证方式

- `npm run test -w apps/web -- model-catalog ai-gateway`
- `npm run typecheck -w apps/web`
- `npm run build -w apps/web`
- `npm run docs:sync`
- `git diff --check`

## 目标

- 新增 AI capability 常量和模型目录。
- 新增 capability-specific model list API。
- 新增 AI task API。
- 新增 mock provider 和 OpenAI-compatible adapter 壳。
- 接入平台积分扣减与 AI Gateway 请求日志。
- 保持不保存用户 provider 原始 key。

## 实现记录

- Prisma schema 新增 `AiGatewayRequestLog` 模型，并补充迁移 `20260608221000_add_ai_gateway_request_log`。
- 新增 `apps/web/src/lib/ai/` 运行时骨架：
  - `capabilities.ts`：统一 AI capability 常量和类型守卫。
  - `credential-source.ts`：统一凭据来源常量和类型守卫。
  - `model-catalog.ts`：按 capability 返回模型目录，区分 mock 和 openai-compatible provider。
  - `ai-gateway.ts`：统一校验 capability / model / credential source，串联积分扣减、provider 执行和请求日志。
  - `provider-adapter.ts`、`providers/mock-provider.ts`、`providers/openai-compatible-provider.ts`：最小 provider 抽象、mock provider 和 OpenAI-compatible 壳。
  - `ai-request-log.ts`：把请求摘要、输出摘要和错误码写入 `AiGatewayRequestLog`。
- 新增账号积分扣减函数 `chargePlatformCreditsForUser()`，AI Gateway 使用现有 `CreditWallet` / `CreditLedger` 做平台积分消耗。
- 新增接口：
  - `GET /api/ai/capabilities/[capability]/models`
  - `POST /api/ai/tasks`
- 账号入口补最小收口：`/account/ai` 统一重定向到 `/account/ai/credits`。
- 账号中心 `积分管理` 页升级为 AI Gateway 控制面：
  - 展示平台积分余额、当前有模型可用的 capability 数。
  - 展示 capability -> model 目录、凭据来源策略、最近 AI Gateway 请求记录和最近平台积分账本。
  - 不恢复旧 `llm-config` 占位导航，继续维持第一阶段收敛后的单入口结构。
- Prisma 生成目录已同步包含 `AiGatewayRequestLog` 相关类型，并清理生成文件尾随空格，保证 `git diff --check` 可通过。

## 当前验证结果

- `npm run test -w apps/web -- model-catalog ai-gateway`：通过，2 个测试文件 / 6 个测试。
- `npm run test -w apps/web -- account-ai-overview model-catalog ai-gateway account-ai-config mock-provider timepick-fortune-chat timepick-recognition`：通过，7 个测试文件 / 19 个测试。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- `npm run docs:sync`：通过。
- `git diff --check`：通过。
- HTTP 烟测：
  - `GET http://localhost:3100/api/ai/capabilities/structured_extraction/models` 返回 `200`，可见 `mock-structured-fast` 和 `openai-compatible-general`。
  - 未登录 `POST http://localhost:3100/api/ai/tasks` 返回 `401 {"error":"请先登录。"}`。
  - `HEAD http://localhost:3100/account/ai` 返回 `307`，`location: /account/ai/credits`。
  - `GET http://localhost:3100/account` 页面快捷入口文案已对齐为“查看余额、模型目录、凭据模式和 AI 使用账本”。
  - TimePick 运势聊天与 URL 自动识别两条真实产品链路均已成功写入 `AiGatewayRequestLog` 与积分账本。

## 后续可选扩展

- TimePick 运势聊天的第一条真实产品接线已拆到 T147；后续还没有把 PDF 工具箱 / AI 修图的真实能力接到 AI Gateway。
- 后续可继续拆：
  - 真实 provider 环境变量与失败码映射；
  - 任务级审计列表 / 账号中心 AI 调用记录；
  - 更多产品侧 capability 接线与积分提示。
