# T147：TimePick 运势聊天接入 AI Gateway 首条真实产品链路

- 状态：已完成
- 负责人：Lee
- 创建日期：2026-06-08
- 优先级：P0
- 来源：IDEA-20260608-02

## 背景

T146 已把 AI Gateway MVP 运行时、模型目录 API、任务 API 和账号中心 AI 控制面落到仓库，但仍没有真实产品能力走 `/api/ai/tasks`。TimePick `/fortune` 运势聊天当前已经切到 DreamChasers API，只是返回无模型占位文本，适合作为第一条产品接线。

## 文件范围

允许修改：

- `apps/web/src/lib/ai/**`
- `apps/web/src/app/api/ai/**`
- `apps/web/src/lib/timepick/**`
- `apps/web/src/app/api/timepick/fortune/chat/route.ts`
- T147 相关文档

禁止修改：

- TimePick 外部仓库
- `apps/web/prisma/**`
- PDF 工具箱、AI 修图、游戏和部署脚本
- 真实 provider、支付、订阅、Key Vault、用户 provider key 持久化

## 验证方式

- `npm run test -w apps/web -- ai-gateway mock-provider timepick-fortune-chat`
- `npm run typecheck -w apps/web`
- `npm run build -w apps/web`
- `npm run docs:sync`
- `git diff --check`

## 目标

- 把 TimePick 运势聊天 route 接到 AI Gateway `text_generation`。
- 补齐 mock provider 的 `text_generation` 输出，至少能根据输入返回稳定文本。
- 为 TimePick fortune chat 增加 gateway 映射层，统一请求结构和输出结构。
- 对积分不足、未登录和 gateway 失败返回明确错误。
- 为账号中心 AI 请求记录提供第一条真实产品写入链路。

## 实现记录

- 新增 `apps/web/src/lib/timepick/timepick-fortune-chat.ts`：
  - `buildTimePickFortuneChatGatewayInput()` 统一构造 TimePick -> AI Gateway 的 `text_generation` 请求。
  - `buildTimePickFortuneChatOutput()` 把 Gateway 结果转回 TimePick 既有 `output.text` 响应结构。
- `apps/web/src/app/api/timepick/fortune/chat/route.ts` 已从本地占位拼文案切到 `runAiGatewayTask()`。
- `apps/web/src/lib/ai/providers/mock-provider.ts` 已补 `text_generation` mock 输出，能根据 `message` 返回稳定中文建议。
- `apps/web/src/lib/ai/ai-gateway.ts` 已把“平台积分不足”从裸 `Error` 收敛为 `AiGatewayError(code=insufficient_credits, status=402)`，便于产品链路统一处理。
- 登录事件已接入 `ensureStarterPlatformCreditsForUser()`：首次登录或首次注册会幂等补一笔 `starter_platform_credits`。
- `runAiGatewayTask()` 已补退款补偿：扣费后如果 provider 执行或内部后续链路失败，会写一笔 `refund` 账本回滚额度。
- 当前连接数据库已手工执行 `20260608221000_add_ai_gateway_request_log` 的 SQL，补齐 `AiGatewayRequestLog` 表，供本地真实链路验证使用。

## 当前验证结果

- `npm run test -w apps/web -- mock-provider ai-gateway timepick-fortune-chat`：通过，3 个测试文件 / 6 个测试。
- `npm run test -w apps/web -- account-security ai-gateway mock-provider timepick-fortune-chat`：通过，4 个测试文件 / 13 个测试。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- HTTP 烟测：
  - 未登录 `POST http://localhost:3100/api/timepick/fortune/chat` 返回 `401 {"error":"请先登录。"}`。
- 真实成功烟测：
  - 临时创建测试账号并真实走 `POST /api/auth/callback/credentials` 登录。
  - 带会话请求 `POST /api/timepick/fortune/chat` 返回成功文本。
  - 数据库验证结果：首次登录赠送 `20` 积分，成功调用一次后余额为 `19`；最新账本为 `grant 20 / usage -1`；`AiGatewayRequestLog` 写入 `text_generation / mock-structured-fast / timepick / timepick-fortune-chat / succeeded`。

## 后续可选扩展

- 当前仍使用 mock provider；真实 provider、额度策略和更细的 prompt/输出规范后续继续迭代。
- 还没有把同样的真实成功链路扩展到 TimePick 自动识别、PDF 工具箱或 AI 修图。
