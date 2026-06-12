# T152 AI Gateway 标准错误码与请求日志收口完成记录

- 完成时间：2026-06-09
- 负责人：Lee
- 任务编号：T152
- 任务名称：AI Gateway 标准错误码与请求日志收口

## 修改文件

- `apps/web/src/lib/ai/error-display.ts`
- `apps/web/src/lib/ai/route-error.ts`
- `apps/web/src/lib/ai/__tests__/error-display.test.ts`
- `apps/web/src/lib/ai/account-ai-overview.ts`
- `apps/web/src/lib/ai/ai-gateway.ts`
- `apps/web/src/lib/ai/__tests__/account-ai-overview.test.ts`
- `apps/web/src/lib/ai/__tests__/ai-gateway.test.ts`
- `apps/web/src/app/api/ai/tasks/route.ts`
- `apps/web/src/app/api/timepick/fortune/chat/route.ts`
- `apps/web/src/app/api/timepick/recognition/url/route.ts`
- `docs/tasks/items/T152-ai-gateway-error-code-and-request-log-hardening.md`
- `docs/tasks/claims/T152-lee.md`
- `docs/progress/2026-06-09-lee.md`

## 实现内容

- 新增统一错误码展示层，避免账号中心和产品侧各自写失败原因文案。
- 新增统一错误响应 helper，让 AI 路由和 TimePick 路由返回一致的 `code + error` 结构。
- 把 Gateway 失败日志从原始异常名收口为平台标准错误码，提升后续审计和治理一致性。
- 保留成功链路和既有产品响应结构，不扩大到新的产品接线范围。

## 验证命令

```bash
npm run test -w apps/web -- error-display ai-gateway mock-provider timepick-fortune-chat timepick-recognition
npm run typecheck -w apps/web
npm run build -w apps/web
npm run docs:sync
git diff --check
```

## 验证结果

- DreamChasers 测试通过：5 个测试文件 / 14 个测试。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- `npm run docs:sync`：待执行。
- `git diff --check`：待执行。

## 遗留问题

- `git diff --check` 仍会被 Prisma 生成文件尾随空格噪音拦住，这属于当前仓库生成产物问题，不是本任务的逻辑回归。
- 后续首条站内产品接线继续按 `T153` 进入 PDF 工具箱。
