# T108：统一账号中心、产品型工具入口和 AI Gateway 规划

- 优先级：P0
- 负责人：Lee
- 默认负责人：Lee
- 状态：待验收
- 依赖：T004, T010, T025, T077
- 提出来源：IDEA-20260603-03
- 涉及模块：平台账号中心 / 工具站 / 独立产品型工具 / AI Gateway / BYOK / LLM provider
- 主要文件范围：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T108-platform-account-ai-gateway-planning.md`, `docs/tasks/claims/T108-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-06-03-platform-account-ai-gateway-design.md`, `docs/progress/2026-06-03-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 验证方式：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T108-platform-account-ai-gateway-planning.md docs/tasks/claims/T108-lee.md docs/superpowers/specs/2026-06-03-platform-account-ai-gateway-design.md docs/progress/2026-06-03-lee.md`; `git diff --check`

## 背景

Lee 希望把 `拾光 TimePick` 和 `镜界 Wonderland` 作为工具站下的独立产品型工具接入小工具站。两个产品可以各自有登录入口，也可以从产品进入主站；同时平台后续需要统一用户账号、积分、订阅、API Key、LLM 调用、provider 配置和模型账号池。

现有工程中，DreamChasers 已有 Prisma/Postgres 基础和 AI 图片 provider 雏形；拾光当前使用 Supabase Auth；镜界当前使用 FastAPI JWT 登录并已有 Kimi、GLM、Claude、OpenAI 等 provider 环境变量。需要先形成统一规划，再拆实现任务。

## 目标

- 明确工具站内部的 `站内网页小工具` 和 `独立产品型工具` 分类。
- 明确主站、拾光、镜界都可登录，但底层共享统一账号中心。
- 规划自建账号中心、产品 token exchange、用户权益和产品入口。
- 规划 AI Gateway，把平台模型额度、用户临时 Key、外部 Gateway BYOK、自建加密 Key Vault、本地连接器纳入同一模型来源体系。
- 为后续任务预留平台模型账号池、provider 协议适配、计费扣减、审计日志和隐私保护接口。

## 不做

- 不开发账号、登录、SSO 或产品接入代码。
- 不迁移拾光或镜界的现有账号。
- 不接入真实模型 API。
- 不实现支付、订阅、充值、模型账号池或 Key Vault。
- 不修改 `apps/**`, `packages/**`, `deploy/**` 或任何产品代码。

## 验收标准

- 新想法已登记到 `CHANGE_INTAKE.md`。
- T108 任务分片和领取分片已创建。
- 形成平台账号中心、产品型工具入口和 AI Gateway 设计规格。
- 设计覆盖账号来源、登录流程、产品 token exchange、模型来源、BYOK 隐私方案、provider 协议、阶段拆分和风险。
- 文档同步、占位符扫描和 diff 检查通过。

## 进展

- 2026-06-03：已完成需求讨论，确认拾光和镜界归属工具站下的独立产品型工具。
- 2026-06-03：已确认推荐路线为自建账号中心 + 多处登录入口 + 统一 AI Gateway。
- 2026-06-03：已确认用户自带模型能力不等同于平台保存用户 API Key，应支持平台额度、临时 Key、外部 Gateway BYOK、自建 Key Vault 和本地连接器五类来源。
