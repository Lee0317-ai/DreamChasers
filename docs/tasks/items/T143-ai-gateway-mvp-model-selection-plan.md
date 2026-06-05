# T143：AI Gateway MVP、模型选择和用户自配模型规划

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T108, T122, T133, T142
- 创建日期：2026-06-05
- 来源：IDEA-20260605-02
- 涉及模块：AI Gateway / 模型目录 / 积分策略 / 用户模型配置 / TimePick 自动识别
- 主要文件范围：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T143-ai-gateway-mvp-model-selection-plan.md`, `docs/tasks/claims/T143-lee.md`, `docs/superpowers/plans/2026-06-05-ai-gateway-mvp-model-selection.md`, `docs/progress/2026-06-05-lee.md`, `docs/completion/2026-06-05-task-143-ai-gateway-mvp-model-selection-plan.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 禁止修改文件：`apps/**`, `packages/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `package.json`, `package-lock.json`, `/Users/lee/Desktop/Lee/TimePick/**`
- 验证方式：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T143-ai-gateway-mvp-model-selection-plan.md docs/tasks/claims/T143-lee.md docs/superpowers/plans/2026-06-05-ai-gateway-mvp-model-selection.md docs/progress/2026-06-05-lee.md docs/completion/2026-06-05-task-143-ai-gateway-mvp-model-selection-plan.md`; `git diff --check`

## 背景

Lee 确认平台 AI 能力第一阶段采用 AI Gateway MVP 路线，并补充两个关键产品要求：

- 前端应提前只展示当前能力可用的模型。
- 不同模型消耗积分不同。
- 用户后续可以使用自己配置的模型。

Lee 选择第一批 provider 方向为 `OpenAI-compatible 优先 + 等另一个已有配置项目上传后再评估复用方式`。

## 目标

- 产出 AI Gateway MVP 的实施计划。
- 明确 capability-specific model list API。
- 明确模型积分消耗策略。
- 明确 `platform_pool`, `user_ephemeral_key`, `user_configured_model` 的边界。
- 明确 OpenAI-compatible adapter 和 mock provider 的开发顺序。
- 明确 TimePick 自动识别作为第一试点的接入方式。

## 不做

- 不实现业务代码。
- 不接真实 provider。
- 不保存用户 provider key。
- 不做 Key Vault。
- 不做复杂 provider 自动路由。
- 不做真实充值扣费。
- 不改 TimePick 外部仓库。

## 交付内容

- 已完成实施计划：`docs/superpowers/plans/2026-06-05-ai-gateway-mvp-model-selection.md`。
- 已明确后续实现任务按 schema、模型目录 API、Gateway task API、provider adapter、TimePick 试点拆分。

## 验证结果

- `npm run docs:sync`：通过，已同步 118 个任务分片和 110 个领取分片。
- 占位符扫描：无命中。
- `git diff --check`：通过。
