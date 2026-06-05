# T142：平台能力、用户资产留存和工作流自动化第一阶段规划

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T108, T122, T133, T134, T140, T141
- 创建日期：2026-06-05
- 来源：IDEA-20260605-01
- 涉及模块：账号中心 / 工具历史 / 游戏存档 / AI Gateway / 工作流自动化
- 主要文件范围：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T142-platform-capability-retention-workflow-planning.md`, `docs/tasks/claims/T142-lee.md`, `docs/superpowers/specs/2026-06-05-platform-capability-retention-workflow-design.md`, `docs/progress/2026-06-05-lee.md`, `docs/completion/2026-06-05-task-142-platform-capability-retention-workflow-planning.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 禁止修改文件：`apps/**`, `packages/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `package.json`, `package-lock.json`, `/Users/lee/Desktop/Lee/TimePick/**`
- 验证方式：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T142-platform-capability-retention-workflow-planning.md docs/tasks/claims/T142-lee.md docs/superpowers/specs/2026-06-05-platform-capability-retention-workflow-design.md docs/progress/2026-06-05-lee.md docs/completion/2026-06-05-task-142-platform-capability-retention-workflow-planning.md`; `git diff --check`

## 背景

账号中心、产品型工具入口、TimePick 统一账号接入和账号中心第一阶段占位清理已经完成。下一步需要进入平台底座规划：AI 能力资源池、账号资产留存、小工具历史记录、游戏进度，以及用户可配置的工具工作流。

Lee 明确补充：工作流不一定是 AI。比如用户在 P 图工具里配置一个“加固定 logo”的流程，以后在工具中一键调用，避免每次重复操作。PDF、TimePick 和后续 AI 工具也有类似需求。

## 目标

- 产出第一阶段平台能力与用户资产留存规划设计稿。
- 明确五层架构：账号资产、工具历史、游戏进度、AI Gateway / 能力资源池、工作流自动化。
- 把工作流自动化写入后续平台扩展路线。
- 明确第一阶段只做什么、不做什么和后续任务拆分。

## 不做

- 不实现业务代码。
- 不接真实 AI 模型。
- 不做真实支付、订阅、充值。
- 不做复杂可视化工作流编辑器。
- 不做跨工具多步骤自动化。
- 不保存用户 provider key。
- 不改 TimePick、PDF、AI 修图或游戏代码。

## 主要文件范围

- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T142-platform-capability-retention-workflow-planning.md`
- `docs/tasks/claims/T142-lee.md`
- `docs/superpowers/specs/2026-06-05-platform-capability-retention-workflow-design.md`
- `docs/progress/2026-06-05-lee.md`
- `docs/completion/2026-06-05-task-142-platform-capability-retention-workflow-planning.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`

## 禁止修改文件

- `apps/**`
- `packages/**`
- `deploy/**`
- `docker-compose.yml`
- `docker-compose.prod.yml`
- `package.json`
- `package-lock.json`
- `/Users/lee/Desktop/Lee/TimePick/**`

## 验证方式

- `npm run docs:sync`
- 占位符扫描：`rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T142-platform-capability-retention-workflow-planning.md docs/tasks/claims/T142-lee.md docs/superpowers/specs/2026-06-05-platform-capability-retention-workflow-design.md docs/progress/2026-06-05-lee.md docs/completion/2026-06-05-task-142-platform-capability-retention-workflow-planning.md`
- `git diff --check`

## 交付内容

- 已完成规划设计稿：`docs/superpowers/specs/2026-06-05-platform-capability-retention-workflow-design.md`。
- 已把工作流自动化纳入平台第一阶段规划。
- 已明确后续建议拆分任务：平台资产 schema 设计、工具历史 MVP、游戏存档契约、AI Gateway MVP、单工具工作流模板 MVP。

## 验证结果

- `npm run docs:sync`：通过，已同步 117 个任务分片和 109 个领取分片。
- 占位符扫描：无命中。
- `git diff --check`：通过。
