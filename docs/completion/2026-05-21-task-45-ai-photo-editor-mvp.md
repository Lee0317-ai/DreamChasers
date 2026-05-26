# T045：实现 AI 修图工具 MVP

- 完成时间：2026-05-21
- 负责人：Codex / 开发 B
- 状态：待验收
- 参考设计：`/Users/jepson/Documents/dreamchasers-tool-panel-sync.html`

## 修改文件

- `apps/web/src/app/tools/ai-photo-editor/page.tsx`
- `apps/web/src/components/AppHeader.tsx`
- `apps/web/src/components/PortalCard.tsx`
- `apps/web/src/components/portal-data.ts`
- `apps/web/src/components/tools/photo/PhotoEditorWorkspace.tsx`
- `apps/web/src/components/tools/photo/PhotoEditorWorkspace.module.css`
- `apps/web/src/lib/tools/photo/photo-editor-data.ts`
- `docs/status/CURRENT_STATUS.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/progress/2026-05-21.md`
- `docs/completion/2026-05-21-task-45-ai-photo-editor-mvp.md`

## 实现内容

- 新增 `/tools/ai-photo-editor` 页面入口。
- 搭建 AI 修图工作台页面框架：顶部栏、左侧工具栏、参数栏、中央画布、历史操作条、右侧 AI 对话栏和额度升级提示。
- 支持基础前端交互：工具切换、参数面板切换、滑杆数值更新、选项选中、升级提示关闭、专注画布模式。
- 工具站 `AI 修图工具` 卡片点击后直接跳转到 `/tools/ai-photo-editor`。
- `/tools/ai-photo-editor` 隐藏公共工具站顶部导航，保留工作台自身顶部栏。
- 支持本地图片上传预览：上传、替换、重新上传按钮共用本地文件选择，顶部和左侧上传卡片同步显示真实文件名、尺寸和文件大小。
- 桌面端工作台收紧为 100vh 一屏布局，各面板内部滚动；移动端保留纵向滚动。
- 左侧工具再次点击当前项时收起参数栏，右侧 AI 对话栏收起后不再占用网格列，改为画布右侧悬浮 `AI` 按钮并带剩余次数角标，桌面画布区域随折叠状态自动扩展。
- AI 能力统一置为未开放：顶部额度显示 `0 / 0`，AI 工具置灰并标记 `未开放`，AI 悬浮入口默认收起且点击只提示 `AI 功能暂未开放，敬请期待！`。
- 移除画布中的 AI 修复区域标记；移除 AI 免费额度升级弹窗。
- 按第一阶段边界保留 AI 能力为前端占位，不接真实模型、图片处理、计费或后端接口。
- 去水印相关文案表达为处理自己图片中的遮挡、瑕疵、水印或不需要的局部元素，避免侵权导向。

## 验证命令

- `npm run lint -w apps/web`
- `npm run typecheck -w apps/web`
- `npx next build`（在 `apps/web` 目录执行）
- `curl -I http://127.0.0.1:3000/tools/ai-photo-editor`
- `curl -s http://127.0.0.1:3000/tools`
- `curl` 检查 `/tools/ai-photo-editor` 和 `/tools` 的公共导航数量
- `curl -s http://127.0.0.1:3000/tools/ai-photo-editor`

## 验证结果

- `npm run lint -w apps/web`：通过，存在 Prisma 生成文件既有 warning。
- `npm run typecheck -w apps/web`：通过。
- `npx next build`：通过，路由表包含 `/tools/ai-photo-editor`。
- `curl -I http://127.0.0.1:3000/tools/ai-photo-editor`：返回 200。
- `curl -s http://127.0.0.1:3000/tools`：确认 AI 修图卡片包含 `href="/tools/ai-photo-editor"`。
- 公共导航检查：`/tools/ai-photo-editor` 中 `class="nav tools-nav"` 数量为 0，`/tools` 中数量为 1。
- `curl -s http://127.0.0.1:3000/tools/ai-photo-editor`：确认页面包含 `type="file"` 本地图片选择入口。
- `npx next build`：通过，路由表包含 `/tools/ai-photo-editor`。
- `curl -s http://127.0.0.1:3000/tools/ai-photo-editor`：确认页面包含 AI 对话栏 `收起` 按钮。
- `curl -s http://127.0.0.1:3000/tools/ai-photo-editor`：确认页面显示 `AI 免费额度 0 / 0`、AI 工具 `未开放` 和不可用提示文案。
- 代码检查：确认画布 `retouchPin`、`修复区域` 文案和 AI 免费额度弹窗已移除，悬浮 AI 按钮保留。
- `npm run build -w apps/web`：失败于既有 `prisma generate` 步骤，错误为 `@prisma/dev` CommonJS require ESM `zeptomatch`。

## 遗留问题

- 真实 AI 模型调用、额度扣减和付费方案后续继续实现。
- 需要后续单独处理 Prisma generate 的依赖兼容问题，恢复完整 `npm run build -w apps/web`。
