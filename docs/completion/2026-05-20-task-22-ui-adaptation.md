# T022：按 `docs/网站UI.zip` 适配前端门户 UI 完成记录

- 任务编号：T022
- 负责人：Codex / 开发 A
- 完成时间：2026-05-20
- 修改文件：`apps/web/src/app/layout.tsx`, `apps/web/src/app/page.tsx`, `apps/web/src/app/tools/page.tsx`, `apps/web/src/app/games/page.tsx`, `apps/web/src/app/globals.css`, `apps/web/src/components/AppHeader.tsx`, `apps/web/src/components/AppFooter.tsx`, `apps/web/src/components/HomeExperience.tsx`, `apps/web/src/components/ChannelPage.tsx`, `apps/web/src/components/PortalCard.tsx`, `apps/web/src/components/PortalModal.tsx`, `apps/web/src/components/portal-data.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-20.md`
- 实现内容：把 `docs/网站UI.zip` 的静态设计导出迁到 Next.js 门户，补齐首页、工具页、游戏页、搜索下拉、分类筛选、卡片、弹窗和导航高亮，并修正此前被覆盖的任务状态。
- 验证命令：`npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`
- 验证结果：通过。桌面端和移动端截图对照后，整体视觉与导出稿一致。
- 遗留问题：本地开发端口被其他进程占用，未单独起新 dev 服务做浏览器回归，但构建和截图对照已确认主视觉正常。
