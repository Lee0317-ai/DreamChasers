# T155：AI 修图 AI 美颜迁移到平台 AI Gateway

- 优先级：P1
- 负责人：Lee
- 状态：已完成
- 依赖：T146, T150, T151, T152, T154, T074, T078
- 创建日期：2026-06-11
- 来源：T154 AI 修图工具 AI Gateway 接线规划
- 涉及模块：AI 修图 / AI Gateway / 图片 provider 治理 / 账号 AI 治理面
- 主要文件范围：`apps/web/src/app/api/tools/photo/**`, `apps/web/src/components/tools/photo/**`, `apps/web/src/lib/tools/photo/**`, `apps/web/src/lib/ai/**`, `apps/web/src/app/account/ai/**`, `docs/modules/photo-editor/**`, `docs/tasks/**`, `docs/progress/2026-06-11-lee.md`, `docs/completion/**`
- 验证方式：`npm run test -w apps/web -- ai-gateway photo account-ai-overview`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `git diff --check`

## 目标

- 把现有 `AI 美颜` 从工具内直连图片 provider 迁移到平台 AI Gateway。
- 复用平台模型目录、provider readiness、积分扣减、统一错误码和请求日志。
- 保持前端现有“提交 -> 轮询 -> 替换当前图片”的交互链路不大改。

## 不做

- 不新增第二条图片 AI 能力。
- 不实现批量修图、长期云端资产保存、BYOK 或多步骤图片工作流。
- 不重做修图工作台 UI。
- 不改 TimePick、PDF 工具箱、游戏或支付订阅相关代码。

## 实现记录

- `AI 美颜` 后端执行已从工具内直连 provider 迁移到平台 AI Gateway。
- `beauty-task-store` 现在通过 Gateway 发起 `image_edit` 任务，并把结果继续落回现有轮询和结果下载链路。
- `openai-compatible` provider 已新增 `image_edit` 分支，能调用 `/images/edits`。
- `mock` provider 已新增图片结果回传结构，便于 dry run 和稳定测试。
- provider readiness 已支持读取现有 `AI_IMAGE_ACTIVE_PROVIDER` + `AI_IMAGE_PROVIDER_*` 的 openai-compatible 配置，作为迁移期兼容入口。
- `AI 美颜` route 已要求登录态，后续统一走平台积分和请求日志。
- 新增测试覆盖：
  - `mock-provider` 的 `image_edit` 返回结构；
  - `openai-compatible-provider` 的图片编辑分支；
  - `provider-readiness` 的 legacy image config fallback；
  - `beauty-task-store` 的 Gateway 成功结果落盘。

## 完成摘要

- 第一条图片 AI 能力已经真正接到平台 AI Gateway。
- 前端交互仍保持“提交 -> 轮询 -> 替换图片”不变。
- 后续第二条图片 AI 能力应在 `T155` 之后单独拆任务推进。

## 验证结果

- `npm run test -w apps/web -- mock-provider provider-readiness beauty-task-store openai-compatible-provider`：通过，4 个测试文件 / 10 个测试。
- `npm run test -w apps/web -- ai-gateway photo account-ai-overview`：通过，3 个测试文件 / 10 个测试。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- `npm run docs:sync`：通过。
- `git diff --check`：未通过。阻塞来自仓库内既有 Prisma generated 文件尾随空格噪音，不是本次图片 Gateway 改动新增。
