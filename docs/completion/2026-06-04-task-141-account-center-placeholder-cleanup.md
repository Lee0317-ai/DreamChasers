# T141 账号中心第一阶段占位清理完成记录

- 完成时间：2026-06-04
- 负责人：Lee
- 状态：已完成

## 修改文件

- `apps/web/src/lib/account/account-navigation.ts`
- `apps/web/src/lib/account/account-view-model.ts`
- `apps/web/src/lib/account/__tests__/account-navigation.test.ts`
- `apps/web/src/lib/account/__tests__/account-view-model.test.ts`
- `apps/web/src/components/account/AccountShell.tsx`
- `apps/web/src/app/account/page.tsx`
- `apps/web/src/app/account/profile/page.tsx`
- `apps/web/src/app/account/security/page.tsx`
- `apps/web/src/app/account/devices/page.tsx`
- `apps/web/src/app/account/ai/credits/page.tsx`
- `apps/web/src/app/account/ai/recharge/page.tsx`
- `apps/web/src/app/account/ai/subscription/page.tsx`
- `apps/web/src/app/account/ai/llm-config/page.tsx`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T141-account-center-placeholder-cleanup.md`
- `docs/tasks/claims/T141-lee.md`
- `docs/progress/2026-06-04-lee.md`

## 实现内容

- 账号中心主导航收敛为第一阶段可用入口。
- 账号概览移除邮箱验证等待状态，快捷操作只保留可用能力。
- 个人信息页移除手机号、实名和昵称编辑占位。
- 安全页移除手机号和二步验证占位。
- 积分页移除充值入口和支付占位文案。
- 旧占位深链重定向到可用页：设备到安全页，充值/订阅/LLM 配置到积分页。

## 验证命令

- `npm run test -w apps/web -- account`
- `npm run typecheck -w apps/web`
- 账号中心占位词扫描
- 旧占位深链 HTTP 检查

## 验证结果

- `npm run test -w apps/web -- account`：通过，5 files / 18 tests。
- `npm run typecheck -w apps/web`：通过。
- 账号中心可见代码扫描未命中 `等待邮箱验证`、`未开放`、`暂未开放`、`充值中心`、`订阅管理`、`LLM 配置`、`手机号`、`实名`、`二步验证` 等占位词。
- `/account/devices` 返回 307 到 `/account/security`。
- `/account/ai/recharge`、`/account/ai/subscription`、`/account/ai/llm-config` 返回 307 到 `/account/ai/credits`。
- Lee 已完成手动测试并确认验收通过。

## 遗留问题

- 本任务只清理第一阶段主体验占位，不实现真实支付、订阅、AI Gateway、BYOK、Key Vault、设备强制下线、手机号、实名、OAuth 或 MFA。
