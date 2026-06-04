# T133：账号统一中心页面体系重规划

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T108, T110, T111, T112, T113
- 提出来源：IDEA-20260604-17
- 涉及模块：账号中心 / AI Gateway / 产品型工具接入 / Open Design UI 映射
- 主要文件范围：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T133-account-center-redesign.md`, `docs/tasks/claims/T133-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/specs/2026-06-04-account-center-redesign-design.md`, `docs/progress/2026-06-04-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 禁止修改文件：`apps/**`, `packages/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `package.json`, `package-lock.json`
- 验证方式：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T133-account-center-redesign.md docs/tasks/claims/T133-lee.md docs/superpowers/specs/2026-06-04-account-center-redesign-design.md docs/progress/2026-06-04-lee.md`; `git diff --check`

## 背景

Lee 提供 Open Design 项目 `9bf531c6-e521-4b0c-b23e-430e44751483`，希望重新规划账号统一中心页面体系。设计稿覆盖桌面登录、注册、账号概览、个人信息、安全、设备、AI 积分、充值、订阅、LLM 配置，以及 iOS/Android 移动端形态。

当前代码已有 T110-T113 的账号中心 MVP：邮箱验证登录、账号首页、权益账本、平台 API Key、产品 token exchange 和审计日志。T108 已明确统一账号中心与 AI Gateway 总体方向，模型来源不能简化为平台直接保存用户模型 API Key。

## 目标

- 形成账号统一中心完整页面信息架构。
- 明确第一阶段先用邮箱验证登录，并复用现有账号 MVP 能力。
- 明确第二阶段模型配置承接 T108 的 AI Gateway 五类模型来源。
- 把 Open Design 页面映射为后续 Next.js 路由、组件和状态。
- 拆出后续实现任务边界和验证要求。

## 不做

- 不修改应用代码。
- 不接真实支付、订阅、充值或 AI Gateway 调用。
- 不实现密码登录、短信登录、OAuth、实名、MFA 或设备强制下线。
- 不保存用户 provider API Key 明文。
- 不迁移 TimePick 或镜界业务代码。

## 验收标准

- 规格文档覆盖 Open Design 页面映射、当前代码能力边界、路由结构、阶段拆分、模型配置策略、风险和验证要求。
- 第二阶段模型配置明确平台额度、临时 Key、外部 Gateway BYOK、加密 Key Vault、本地连接器的优先级和安全边界。
- 文档同步、占位符扫描和 diff 检查通过。

## 进展

- 2026-06-04：已通过 Open Design MCP 读取项目 `9bf531c6-e521-4b0c-b23e-430e44751483`，确认设计文件与 Lee 提供的 zip 内容一致。
- 2026-06-04：已确认采用“完整蓝图 + 第一阶段可落地”方案；第一阶段登录方式先用邮箱验证。
- 2026-06-04：已确认第二阶段模型配置需要承接 T108 AI Gateway 规划，不直接做平台保存用户模型 Key 的简单方案。
- 2026-06-04：已完成账号统一中心重规划规格稿，等待 Lee 复核后再拆实现任务。
