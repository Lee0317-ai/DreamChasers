# T155 AI 修图 AI 美颜迁移到平台 AI Gateway 完成记录

- 完成时间：2026-06-11
- 负责人：Lee
- 任务编号：T155
- 任务名称：AI 修图 AI 美颜迁移到平台 AI Gateway

## 修改文件

- `apps/web/src/lib/ai/openai-compatible-config.ts`
- `apps/web/src/lib/ai/provider-readiness.ts`
- `apps/web/src/lib/ai/ai-gateway.ts`
- `apps/web/src/lib/ai/model-catalog.ts`
- `apps/web/src/lib/ai/providers/mock-provider.ts`
- `apps/web/src/lib/ai/providers/openai-compatible-provider.ts`
- `apps/web/src/lib/ai/__tests__/mock-provider.test.ts`
- `apps/web/src/lib/ai/__tests__/provider-readiness.test.ts`
- `apps/web/src/lib/ai/__tests__/openai-compatible-provider.test.ts`
- `apps/web/src/lib/tools/photo/ai-image-provider.ts`
- `apps/web/src/lib/tools/photo/beauty-task-store.ts`
- `apps/web/src/lib/tools/photo/__tests__/beauty-task-store.test.ts`
- `apps/web/src/app/api/tools/photo/beauty/route.ts`
- `docs/modules/photo-editor/README.md`
- `docs/modules/photo-editor/PROGRESS.md`
- `docs/modules/photo-editor/HANDOFF.md`
- `docs/tasks/items/T155-ai-photo-beauty-ai-gateway-migration.md`
- `docs/tasks/claims/T155-lee.md`
- `docs/progress/2026-06-11-lee.md`

## 实现内容

- 把 `AI 美颜` 从工具内直连图片 provider 改为平台 AI Gateway `image_edit` 任务。
- 保持前端现有“提交 -> 轮询 -> 替换图片”的交互不变，只替换后端执行和结果落盘逻辑。
- 为 Gateway 增加图片编辑执行分支：
  - `mock-provider` 现在能返回图片结果结构；
  - `openai-compatible-provider` 现在能调用 `/images/edits`。
- 新增迁移期配置兼容：
  - 优先读取 `AI_GATEWAY_OPENAI_COMPATIBLE_*`；
  - 若未配置，则允许读取现有 `AI_IMAGE_ACTIVE_PROVIDER` + `AI_IMAGE_PROVIDER_*` 的 openai-compatible 配置。
- `AI 美颜` route 现在要求登录态，后续统一走平台积分、请求日志和错误码治理。

## 验证命令

```bash
npm run test -w apps/web -- mock-provider provider-readiness beauty-task-store openai-compatible-provider
npm run test -w apps/web -- ai-gateway photo account-ai-overview
npm run typecheck -w apps/web
npm run build -w apps/web
npm run docs:sync
git diff --check
```

## 验证结果

- `npm run test -w apps/web -- mock-provider provider-readiness beauty-task-store openai-compatible-provider`：通过，4 个测试文件 / 10 个测试。
- `npm run test -w apps/web -- ai-gateway photo account-ai-overview`：通过，3 个测试文件 / 10 个测试。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- `npm run docs:sync`：通过。
- `git diff --check`：未通过。阻塞来自仓库内既有 Prisma generated 文件尾随空格噪音，不是本次图片 Gateway 改动新增。

## 遗留问题

- 真实桌面端和移动端浏览器检查本轮未执行。
- 智能擦除、换背景、高清增强仍未进入实现范围。
- `git diff --check` 预计仍会被仓库内既有 Prisma generated 文件尾随空格问题阻塞，需要与仓库级历史噪音分开看。
