# T135：账号统一中心页面体系实现

- 状态：已完成
- 负责人：Lee
- 创建日期：2026-06-04
- 优先级：P0
- 来源：T133 账号统一中心页面体系重规划、T134 实施计划、Open Design 项目 `9bf531c6-e521-4b0c-b23e-430e44751483`

## 背景

T133/T134 已完成账号统一中心设计规格和实施计划。当前任务负责把账号中心页面体系落到 `apps/web`，覆盖登录/注册、账号概览、资料、安全、设备、AI 积分、充值、订阅、LLM 配置、API Key 和产品接入页面。

2026-06-04 需求修正：邮箱不是 magic-link 日常登录方式。邮箱用于注册账号和验证账号邮箱；完成验证后，用户通过账号邮箱和密码登录。

## 文件范围

允许修改：

- `apps/web/src/app/login/**`
- `apps/web/src/app/register/**`
- `apps/web/src/app/account/**`
- `apps/web/src/components/account/**`
- `apps/web/src/components/AppHeader.tsx`
- `apps/web/src/lib/account/**`
- `apps/web/src/lib/auth/**`
- `apps/web/src/app/globals.css`
- `apps/web/prisma/schema.prisma`
- `apps/web/src/generated/prisma/**`
- 当前任务相关文档：`docs/tasks/**`, `docs/progress/**`, `docs/completion/**`, `docs/superpowers/specs/2026-06-04-account-center-redesign-design.md`, `docs/superpowers/plans/2026-06-04-account-center-redesign.md`

禁止修改：

- PDF 工具箱、AI 修图、游戏业务代码
- TimePick 迁移代码
- 部署、支付、模型调用、AI Gateway 运行时
- 非账号中心共享架构，除非为路由/header 归属所需的最小改动

## 验证命令

- `npm run test -w apps/web`
- `npm run typecheck`
- `npm run lint`
- `set -a; source /Users/lee/Desktop/Lee/DreamChasers/.env; set +a; npm run build`
- Playwright/Kimi WebBridge 页面检查：`/login`, `/register`, `/account`, `/account/security`, `/account/ai/llm-config`
- `npm run docs:sync`
- `git diff --check`

## 验收标准

- 登录页为邮箱 + 密码登录，不再发送登录邮件。
- 注册页收集邮箱、密码和确认密码，并发送邮箱验证邮件。
- 未验证邮箱不能通过密码登录。
- 密码不以明文保存。
- 账号中心页面采用统一 shell 和 Open Design 信息架构。
- LLM 配置遵守 T108/T133 模型来源策略，不直接保存 provider 明文 key。
- 旧 `/account/ai` 和 `/account/billing` 入口正确重定向。
- 桌面和移动端关键页面无明显裁切、重叠或错误导航归属。

## 进度

- 已完成账号中心 shell、导航、概览、资料、安全、设备、AI 能力、开发者和产品接入页面。
- 已根据 2026-06-04 需求修正，把认证入口改为邮箱注册验证 + 邮箱密码登录。
- 已完成完整验证和页面视觉检查，等待提交。

## 验证结果

- `npm run test -w apps/web`：14 个测试文件、78 个测试通过。
- `npm run typecheck`：通过。
- `npm run lint`：通过，保留 Prisma 生成文件既有 unused eslint-disable warnings。
- `set -a; source /Users/lee/Desktop/Lee/DreamChasers/.env; set +a; npm run build`：通过，Next.js 生成 39 个 app route。
- Playwright 视觉检查：`/login`、`/register` 移动端和桌面端布局正常；Kimi WebBridge 快照检查已登录账号路由导航和内容正常。
