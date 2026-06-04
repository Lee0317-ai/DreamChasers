# T138 领取记录：账号找回密码、修改密码和重发验证邮件

- 任务编号：T138
- 负责人：Lee
- 领取时间：2026-06-04
- 当前状态：已完成

## 文件范围

允许修改：

- `apps/web/src/lib/auth/**`
- `apps/web/src/app/login/**`
- `apps/web/src/app/register/**`
- `apps/web/src/app/forgot-password/**`
- `apps/web/src/app/reset-password/**`
- `apps/web/src/app/account/security/page.tsx`
- `apps/web/src/lib/account/**` 中与安全页展示相关的最小改动
- `apps/web/src/app/globals.css` 中账号表单样式的最小补充
- 当前任务相关文档：`docs/tasks/**`, `docs/progress/**`, `docs/completion/**`, `docs/superpowers/specs/**`, `docs/superpowers/plans/**`

禁止修改：

- PDF 工具箱、AI 修图、游戏和 TimePick 业务代码
- 支付、部署、AI Gateway 运行时代码
- Prisma schema，除非实现中证明 `VerificationToken` 无法满足需求
- LLM 配置策略，不允许改成保存原始 provider key

## 验证命令

- `npm run test -w apps/web -- auth account`
- `npm run typecheck`
- `npm run lint`
- `set -a; source /Users/lee/Desktop/Lee/DreamChasers/.env; set +a; npm run build`
- 浏览器检查：`/forgot-password`, `/reset-password`, `/login/error`, `/account/security`
- `npm run docs:sync`
- `git diff --check`

## 当前说明

- 在 worktree `/Users/lee/Desktop/Lee/DreamChasers/.worktrees/account-center-redesign`、分支 `codex/account-center-redesign` 中执行。
- T137 迁移收尾改动保留，不回滚。
- 已完成找回密码、重置密码、修改当前密码和重发验证邮件入口，等待验收或 PR 评审。
