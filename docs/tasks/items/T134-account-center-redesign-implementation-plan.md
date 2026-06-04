# T134：账号统一中心页面体系重规划实施计划

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T108, T110, T111, T112, T113, T133
- 提出来源：T133
- 涉及模块：账号中心 / AI Gateway UI 入口 / 产品型工具接入
- 主要文件范围：`docs/tasks/items/T134-account-center-redesign-implementation-plan.md`, `docs/tasks/claims/T134-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-06-04-account-center-redesign.md`, `docs/progress/2026-06-04-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 禁止修改文件：`apps/**`, `packages/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `package.json`, `package-lock.json`
- 验证方式：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T134-account-center-redesign-implementation-plan.md docs/tasks/claims/T134-lee.md docs/superpowers/plans/2026-06-04-account-center-redesign.md docs/progress/2026-06-04-lee.md`; `git diff --check`

## 背景

T133 已完成账号统一中心页面体系重规划规格稿。Lee 确认按完整体系规划，第一阶段登录方式先用邮箱验证，第二阶段模型配置要承接 T108 的 AI Gateway 规划。

## 目标

- 把 T133 规格拆成可执行实施计划。
- 明确第一阶段 UI 重构的文件边界、测试步骤和验收方式。
- 把第二阶段 LLM 配置和 BYOK 增强作为独立后续任务，不混入第一阶段 UI 重构。

## 不做

- 不修改应用代码。
- 不安装依赖。
- 不运行应用构建。
- 不实现账号中心 UI。

## 验收标准

- 实施计划保存在 `docs/superpowers/plans/2026-06-04-account-center-redesign.md`。
- 计划包含文件结构、任务拆分、TDD 步骤、验证命令和提交建议。
- 计划明确第一阶段和第二阶段边界。
- 文档同步、占位符扫描和 diff 检查通过。

## 进展

- 2026-06-04：已创建 T134，开始编写账号统一中心页面体系实施计划。
- 2026-06-04：已完成实施计划，第一阶段限定邮箱登录和现有账号能力重构；真实 AI Gateway、BYOK 持久化、支付订阅和密码/短信/MFA 等能力拆到后续任务。
