# T154：AI 修图工具 AI Gateway 接线规划

- 优先级：P1
- 负责人：Lee
- 状态：已完成
- 依赖：T149, T150, T151, T152, T045
- 创建日期：2026-06-09
- 来源：T149 平台级 AI 治理与产品接线路线规划
- 涉及模块：AI 修图 / AI Gateway / 图片模型治理
- 主要文件范围：`docs/tasks/**`, `docs/modules/photo-editor/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`, `docs/progress/2026-06-09-lee.md`, `docs/completion/**`
- 验证方式：`npm run docs:sync`; `rg -n "T\\[B\\]D|T\\[O\\]DO|待\\[补\\]" docs/tasks/items/T154-ai-photo-editor-ai-gateway-integration-plan.md docs/modules/photo-editor docs/superpowers/plans/2026-06-11-ai-photo-editor-ai-gateway-integration.md docs/progress/2026-06-11-lee.md docs/completion/2026-06-11-task-154-ai-photo-editor-ai-gateway-integration-plan.md`; `git diff --check`

## 目标

- 明确 AI 修图接 AI Gateway 的阶段顺序与 provider 约束。
- 明确哪些能力可先用 mock / dry run，哪些能力必须等真实图片 provider。
- 避免 AI 修图在治理底座没站稳前直接长出独立模型调用栈。

## 执行记录

- 已新增 `docs/tasks/claims/T154-lee.md`。
- 已补齐 `docs/modules/photo-editor/` 独立模块文档目录。
- 已新增聚焦实施计划：`docs/superpowers/plans/2026-06-11-ai-photo-editor-ai-gateway-integration.md`。
- 已确认首条图片 AI Gateway 接线选择现有 `AI 美颜`，不新开第二套图片模型治理口径。
- 已确认能力分层：
  - 可先做 mock / dry run：请求结构、模型展示、错误语义、治理面联动。
  - 必须依赖真实图片 provider：AI 美颜、智能擦除、换背景、高清增强。
  - 必须后置：批量任务、长期云端资产、BYOK、多步骤图片工作流。
- 已确认 provider 约束：
  - `image_edit` 是第一阶段主链路。
  - `image_generation` 暂不作为首条修图接线。
  - `image_understanding` 只作为后续辅助能力。

## 完成摘要

- AI 修图后续接线已收敛到平台 AI Gateway 路线。
- 现有本地工作台和免费编辑能力保持不动。
- 后续实现任务应优先把 `AI 美颜` 从工具内直连 provider 迁到平台治理链路，再决定智能擦除和换背景。
