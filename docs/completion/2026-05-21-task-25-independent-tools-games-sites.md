# T025 完成记录：拆分独立工具站和游戏站入口体验

- 完成时间：2026-05-21
- 任务编号：T025
- 负责人：Codex / 开发 A

## 修改文件

- `apps/web/src/app/games/page.tsx`
- `apps/web/src/app/globals.css`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/tools/page.tsx`
- `apps/web/src/components/AppFooter.tsx`
- `apps/web/src/components/AppHeader.tsx`
- `apps/web/src/components/ChannelPage.tsx`
- `apps/web/src/components/HomeExperience.tsx`
- `apps/web/src/components/portal-data.ts`
- `docs/status/CURRENT_STATUS.md`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/CLAIMS.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/progress/2026-05-21.md`
- `docs/completion/2026-05-21-task-25-independent-tools-games-sites.md`

## 实现内容

- 根据 `docs/网站UI/` 最新设计，把首页改成工具站和游戏站左右分流入口。
- 工具站 `/tools` 使用明亮效率工具视觉，页面文案、筛选、搜索和卡片结构贴近 `tools.html`。
- 游戏站 `/games` 使用深色游戏视觉，页面文案、筛选、搜索和卡片结构贴近 `games.html`。
- 工具站顶部仅保留一个跨站入口 `去游戏馆`；游戏站顶部仅保留一个跨站入口 `去工具箱`。
- 保留现有卡片详情弹窗，未实现具体 PDF、修图或游戏逻辑。

## 验证命令

- `npm run lint -w apps/web`
- `npm run typecheck -w apps/web`
- `npm run build -w apps/web`
- 浏览器检查：`http://localhost:3017/`, `/tools`, `/games`

## 验证结果

- `npm run lint -w apps/web`：通过；Prisma 生成文件存在既有 unused eslint-disable warning。
- `npm run typecheck -w apps/web`：通过。
- `npm run build -w apps/web`：通过。
- 浏览器检查：
  - `/`, `/tools`, `/games` 在 390x844 和 1440x900 下无横向溢出。
  - `/tools` 仅有顶部 `去游戏馆` 跨站入口。
  - `/games` 仅有顶部 `去工具箱` 跨站入口。
  - PDF 工具箱卡片弹窗可打开。
  - 麻将 Roguelike 消除卡片弹窗可打开。

## 遗留问题

- Prisma 生成文件仍有既有 eslint warning，本任务未修改生成文件规则。
- 移动端导航当前按设计隐藏链接，但未实现抽屉菜单；后续如需要移动端跨站入口更显眼，可单独拆任务。
