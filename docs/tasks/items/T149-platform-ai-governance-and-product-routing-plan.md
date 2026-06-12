# T149：平台级 AI 治理与产品接线路线规划

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T142, T143, T146, T147, T148
- 创建日期：2026-06-09
- 来源：IDEA-20260609-01
- 涉及模块：账号中心 / AI Gateway / PDF 工具箱 / AI 修图 / TimePick / 平台治理
- 主要文件范围：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T149-platform-ai-governance-and-product-routing-plan.md`, `docs/tasks/claims/T149-lee.md`, `docs/superpowers/specs/2026-06-09-platform-ai-governance-and-product-routing-design.md`, `docs/superpowers/plans/2026-06-09-platform-ai-governance-and-product-routing.md`, `docs/progress/2026-06-09-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 禁止修改文件：`apps/**`, `packages/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `/Users/lee/Desktop/Lee/TimePick/**`
- 验证方式：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T149-platform-ai-governance-and-product-routing-plan.md docs/tasks/claims/T149-lee.md docs/superpowers/specs/2026-06-09-platform-ai-governance-and-product-routing-design.md docs/superpowers/plans/2026-06-09-platform-ai-governance-and-product-routing.md docs/progress/2026-06-09-lee.md`; `git diff --check`

## 背景

T146、T147、T148 已经把 AI Gateway MVP、TimePick 运势聊天和 URL 自动识别两条真实产品链路打通，但当前平台仍缺一份以治理优先为核心的统一方案。账号中心、AI Gateway、环境变量、请求日志、额度治理，以及 PDF 工具箱 / AI 修图 / TimePick 三条产品线的后续接线顺序，仍然散落在不同规划和实现任务里。

Lee 要求补一份完整方案，不只看账号中心单页，而是站在平台层定义统一治理口径，并把后续产品接线路线一起排清楚。

## 目标

- 产出平台级 AI 治理与产品接线路线设计稿。
- 明确账号中心与 AI Gateway 的职责边界。
- 明确 provider readiness、环境变量、标准错误码、请求日志和额度治理的最小闭环。
- 明确账号中心 AI 治理面第一阶段展示范围。
- 明确 PDF 工具箱、AI 修图、TimePick 三条产品线的接线顺序、依赖和冻结边界。
- 拆出后续可执行任务，避免平台治理和产品接线继续混在同一个大任务里。

## 不做

- 不实现应用代码。
- 不接真实多 provider 自动路由。
- 不保存用户 provider key。
- 不提前实现支付、订阅、Key Vault、KMS、队列或工作流编排。
- 不把 PDF、AI 修图、TimePick 各自扩成独立 AI 平台。

## 交付内容

- 设计稿：`docs/superpowers/specs/2026-06-09-platform-ai-governance-and-product-routing-design.md`
- 实施计划：`docs/superpowers/plans/2026-06-09-platform-ai-governance-and-product-routing.md`
- 后续任务拆分：
  - `T150` 账号中心 AI 治理面升级
  - `T151` AI Gateway provider readiness 与环境变量治理
  - `T152` AI Gateway 标准错误码与请求日志收口
  - `T153` PDF 工具箱首条 AI 能力接线
  - `T154` AI 修图工具 AI Gateway 接线规划

## 规划结论

- 平台路线采用“治理中台优先，产品接线附表补充”。
- 第一阶段优先补齐账号中心治理展示、AI Gateway 运行时状态、环境变量 readiness、错误码和请求日志语义。
- TimePick 保持为平级产品，不再继续占据平台节奏优先级。
- 站内产品接线顺序建议为：治理中台补齐 -> PDF 工具箱首条 AI 能力 -> AI 修图正式接线。

## 验证结果

- `npm run docs:sync`：通过，已同步 129 个任务分片和 116 个领取分片。
- 占位符扫描：通过。说明：验证命令中的正则字面量会命中自身文本，已按文档自检口径确认无实际占位符残留。
- `git diff --check`：通过。
