# T112：产品型工具 token exchange 骨架

- 优先级：P0
- 负责人：Lee
- 状态：待验收
- 依赖：T108, T110, T111
- 背景：账号中心已完成邮箱验证登录和生产化登录冷却。拾光 TimePick 与镜界 Wonderland 后续需要作为独立产品型工具接入统一账号中心，先在主站实现产品注册表和短期产品会话 token exchange 骨架。
- 目标：新增默认产品注册、产品会话 token 生成 API 和账号中心产品接入 UI，支持已登录用户为 `timepick` / `wonderland` 生成短期一次性产品 token。
- 不做：不迁移拾光或镜界代码；不验证外部产品回调；不实现跨域 SSO cookie；不接 AI Gateway 真实调用；不修改 PDF 工具箱、胡了卜游戏、AI 修图或部署脚本。
- 主要文件范围：`apps/web/src/lib/account/**`, `apps/web/src/app/api/account/products/**`, `apps/web/src/components/account/**`, `apps/web/src/app/account/**`, `apps/web/prisma/**`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**`
- 验证方式：`npm run test -w apps/web -- product-session account`; `npm run typecheck -w apps/web`; `npm run lint -w apps/web`; `npm run build -w apps/web`; 使用 Kimi WebBridge 检查 `/account` 产品 token 生成；`npm run docs:sync`; `git diff --check`

## 实施范围

- 建立默认产品定义：`timepick` / `wonderland`。
- 产品 session token 使用一次性明文返回，数据库只保存 hash。
- token 默认 10 分钟过期，returnUrl 只允许站内路径。
- 账号中心产品区提供生成 token 的测试入口，用于后续拾光/镜界接入验证。

## 当前进展

- 2026-06-03：已实现默认产品定义、产品 session token 规则、受保护产品 session API 和账号中心产品 token UI。
- 2026-06-03：已通过 Kimi WebBridge 验证 `/account` 可为拾光 TimePick 生成 10 分钟有效 token，明文只展示一次。
