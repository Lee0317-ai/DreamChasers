# T146 AI Gateway MVP 运行时与模型 API 完成记录

- 完成时间：2026-06-08
- 负责人：Lee
- 任务编号：T146
- 任务名称：AI Gateway MVP 运行时与模型 API

## 修改文件

- `apps/web/prisma/schema.prisma`
- `apps/web/prisma/migrations/20260608221000_add_ai_gateway_request_log/migration.sql`
- `apps/web/src/app/account/ai/credits/page.tsx`
- `apps/web/src/app/account/ai/page.tsx`
- `apps/web/src/app/account/page.tsx`
- `apps/web/src/app/api/ai/**`
- `apps/web/src/lib/account/account-data.ts`
- `apps/web/src/lib/ai/**`
- `apps/web/src/generated/prisma/**`
- `docs/tasks/items/T146-ai-gateway-mvp-runtime.md`
- `docs/tasks/claims/T146-lee.md`
- `docs/progress/2026-06-08-lee.md`
- `docs/status/CURRENT_STATUS.md`

## 实现内容

- 新增 AI Gateway capability、credential source、模型目录、task runtime、mock provider、OpenAI-compatible provider 壳与请求日志写入。
- 新增 `GET /api/ai/capabilities/[capability]/models` 与 `POST /api/ai/tasks`。
- 新增 `AiGatewayRequestLog` Prisma 模型和迁移。
- 复用平台积分钱包与账本，接入扣费、失败退款和账号中心 AI 控制面展示。
- 保持账号中心第一阶段收口，不恢复旧充值 / 订阅 / LLM 配置入口。

## 验证命令

```bash
npm run test -w apps/web -- account-ai-overview model-catalog ai-gateway account-ai-config mock-provider timepick-fortune-chat timepick-recognition
npm run typecheck -w apps/web
npm run build -w apps/web
npm run docs:sync
git diff --check
```

## 验证结果

- DreamChasers 测试通过：7 个测试文件 / 19 个测试。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- `npm run docs:sync`：通过。
- `git diff --check`：通过。
- HTTP 与产品链路验证：模型目录 API、未登录拦截、`/account/ai -> /account/ai/credits` 重定向正常；TimePick 运势聊天与 URL 自动识别均已真实写入请求日志和积分账本。

## 遗留问题

- 当前仍主要使用 mock provider。
- PDF 工具箱与 AI 修图尚未接入 AI Gateway。
