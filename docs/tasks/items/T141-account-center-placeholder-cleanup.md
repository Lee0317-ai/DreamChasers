# T141：账号中心第一阶段占位清理

- 状态：已完成
- 负责人：Lee
- 创建日期：2026-06-04
- 优先级：P0
- 来源：Lee 反馈账号管理里很多占位，要求继续清理

## 背景

T135 已完成账号中心页面体系，T140 已取消邮箱验证门槛。但账号中心仍把支付、订阅、LLM 配置、设备强制下线、手机号、实名、二步验证等后续能力放在主导航或主内容里，容易让用户误以为基座已经完整产品化。

## 文件范围

允许修改：

- `apps/web/src/app/account/**`
- `apps/web/src/components/account/**`
- `apps/web/src/lib/account/**`
- T141 相关文档

禁止修改：

- 认证 server action 和 Auth.js provider
- TimePick 外部仓库
- PDF 工具箱、AI 修图、游戏业务代码
- Prisma schema 和 migration
- 真实支付、订阅、AI Gateway、模型 Key 持久化实现

## 验证方式

- `npm run test -w apps/web -- account`
- `npm run typecheck -w apps/web`
- `npm run build -w apps/web`
- HTTP 检查账号中心关键页面不再展示明显占位入口
- `npm run docs:sync`
- `git diff --check`

## 实现计划

- 主导航只保留第一阶段可用入口：账号概览、个人信息、账号安全、积分管理、API Key、产品接入。
- 账号概览和安全摘要不再显示“等待邮箱验证”。
- 个人信息页只展示当前已可用资料，不展示手机号、实名等未开放能力。
- 安全页只展示邮箱密码、邮箱验证门槛关闭、修改密码和审计记录，不展示手机号/二步验证占位。
- 充值、订阅、LLM 配置、设备页深链重定向到相邻可用页。

## 实现内容

- 主导航收敛为：账号概览、个人信息、账号安全、积分管理、API Key、产品接入。
- 账号概览不再显示邮箱验证等待状态，快捷操作只指向可用能力。
- 个人信息页移除手机号、实名和昵称编辑占位，只展示当前账号资料。
- 安全页移除手机号和二步验证占位，只保留邮箱密码登录、邮箱验证门槛关闭、修改密码和审计记录。
- `/account/devices` 重定向 `/account/security`。
- `/account/ai/recharge`、`/account/ai/subscription`、`/account/ai/llm-config` 重定向 `/account/ai/credits`。
- 积分页移除充值入口和支付占位文案。

## 验证结果

- `npm run test -w apps/web -- account`：通过，5 files / 18 tests。
- `npm run typecheck -w apps/web`：通过。
- 账号中心可见代码扫描未命中 `等待邮箱验证`、`未开放`、`充值中心`、`订阅管理`、`LLM 配置` 等占位词。
- HTTP 检查旧占位深链均返回 307 到可用页。
- Lee 已完成手动测试并确认验收通过。
