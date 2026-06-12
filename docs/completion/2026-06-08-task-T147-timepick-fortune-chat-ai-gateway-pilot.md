# T147 TimePick 运势聊天接入 AI Gateway 首条真实产品链路完成记录

- 完成时间：2026-06-08
- 负责人：Lee
- 任务编号：T147
- 任务名称：TimePick 运势聊天接入 AI Gateway 首条真实产品链路

## 修改文件

- `apps/web/src/app/api/timepick/fortune/chat/route.ts`
- `apps/web/src/lib/account/account-data.ts`
- `apps/web/src/lib/auth/auth.ts`
- `apps/web/src/lib/ai/ai-gateway.ts`
- `apps/web/src/lib/ai/providers/mock-provider.ts`
- `apps/web/src/lib/timepick/timepick-fortune-chat.ts`
- `apps/web/src/lib/timepick/__tests__/timepick-fortune-chat.test.ts`
- `docs/tasks/items/T147-timepick-fortune-chat-ai-gateway-pilot.md`
- `docs/tasks/claims/T147-lee.md`
- `docs/progress/2026-06-08-lee.md`
- `docs/status/CURRENT_STATUS.md`

## 实现内容

- 把 TimePick 运势聊天从本地占位文案改为 AI Gateway `text_generation`。
- 新增 TimePick 运势聊天 gateway 输入输出映射层。
- 为 mock provider 补齐稳定中文输出。
- 接入首次登录赠送平台积分、积分不足错误码和失败退款补偿。

## 验证命令

```bash
npm run test -w apps/web -- account-security ai-gateway mock-provider timepick-fortune-chat
npm run typecheck -w apps/web
npm run build -w apps/web
npm run docs:sync
git diff --check
```

## 验证结果

- `npm run test -w apps/web -- account-security ai-gateway mock-provider timepick-fortune-chat`：通过。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- HTTP 烟测：未登录 `POST /api/timepick/fortune/chat` 返回 `401`。
- 真实成功烟测：登录用户调用后，数据库中可见 `AiGatewayRequestLog(text_generation, timepick-fortune-chat)` 和对应平台积分账本扣减。

## 遗留问题

- 当前仍使用 mock provider。
- prompt 细化、真实 provider 和成本策略后续继续迭代。
