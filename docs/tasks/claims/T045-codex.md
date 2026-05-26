# T045：实现 AI 修图工具 MVP

- 领取人：Codex / 开发 B
- 领取时间：2026-05-26
- 状态：待验收
- 预计完成：2026-05-26
- 允许修改文件：`apps/web/src/app/tools/ai-photo-editor/**`, `apps/web/src/components/tools/photo/**`, `apps/web/src/lib/tools/photo/**`, `apps/web/public/stickers/**`, `apps/web/src/components/AppHeader.tsx`, `apps/web/src/components/PortalCard.tsx`, `apps/web/src/components/portal-data.ts`, `docs/tasks/**`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-22.md`, `docs/progress/2026-05-25.md`, `docs/progress/2026-05-26.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/prisma/**`, `packages/**`, `apps/game/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`
- 依赖任务：T016
- 验证命令：`npm run typecheck -w apps/web`; `npm run lint -w apps/web`; `npx next build`; 贴纸资源访问检查；桌面端和移动端检查
- 当前风险：Codex 内置浏览器访问本地地址曾被 `ERR_BLOCKED_BY_CLIENT` 拦截，部分视觉验收依赖人工检查；PNG 导出使用 Canvas 重绘，字体抗锯齿和 CSS 阴影与 DOM 预览可能存在轻微像素差异。
- 备注：已完成 AI 修图工具 MVP、导出一致性修复和装饰贴纸增强；不调用真实 AI 模型。

 领取人：Codex / Lee
- 领取时间：2026-05-23
- 状态：已完成
- 预计完成：2026-05-23
- 允许修改文件：`packages/shared/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T045-hulebu-rules-model.md`, `docs/tasks/claims/T045-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/src/components/portal-data.ts`, `apps/web/src/app/**`, `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/game/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`
- 依赖任务：T044
- 验证命令：`npm run test -w packages/shared -- mahjong`; `npm run typecheck -w packages/shared`; `npm run docs:sync`; `git diff --check`
- 当前风险：T017 和 T020 仍未正式领取，本任务只做引擎无关规则模型，不进入 Cocos/GDevelop 或站内路由实现。
- 备注：已完成 `胡了卜` 命名落档和纯 TypeScript 规则模型，下一步建议沉淀关卡/奖励配置。

