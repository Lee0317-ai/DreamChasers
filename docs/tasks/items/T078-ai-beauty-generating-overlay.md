# T078：AI 美颜生成中画布锁定和进度动效

- 优先级：P1
- 负责人：Codex / 开发 B
- 状态：待验收
- 依赖：T075
- 背景：AI 美颜生成耗时较长，生成期间如果用户继续拖动、裁剪或编辑画布，容易误以为当前画布状态会参与生成，也会造成按钮和画布状态不一致。
- 目标：AI 美颜生成期间锁定画布编辑，在画布上显示小孩在画架画布上逐帧书写 `Dream Chasers` 的透明 WebP 动效和当前进度描述，让用户明确知道后端任务仍在处理中。
- 不做：不改 AI 生成接口协议，不做真实流式图片渲染，不引入新的前端动画库，不安装额外图片处理依赖。
- 主要文件范围：`apps/web/src/components/tools/photo/PhotoEditorWorkspace.tsx`, `apps/web/src/components/tools/photo/PhotoEditorWorkspace.module.css`, `apps/web/public/images/photo-editor/**`, `docs/tasks/items/T078-ai-beauty-generating-overlay.md`, `docs/tasks/claims/T078-codex.md`, `docs/progress/2026-05-27.md`
- 验证方式：`npm run typecheck -w apps/web`; `npm run lint -w apps/web`; `npx next build`; `npm run docs:sync`; `git diff --check`
- 当前风险：小人和画架动效改为本地分层 2D 帧动画，以保证手臂、画笔和笔尖绑定移动，并保证 `Dream Chasers` 不超出画布；画风比 imagegen 底图更简化。
- 执行记录：
  - 使用本地分层帧动画合成项目内透明 WebP：`apps/web/public/images/photo-editor/ai-drawing-loader.webp`。
  - WebP 内容为画布左上已有太阳，小孩手臂带着画笔逐帧书写草书斜体彩虹色 `Dream Chasers`，写字阶段不出现横线，写完后再在下方补一条彩虹色横线，文字严格限制在画布内部。
  - AI 美颜运行时在画布层展示覆盖态，显示透明 WebP 动效和轮询进度文案。
  - AI 美颜运行时移除画布 pan 事件并用覆盖层阻断裁剪、文字、贴纸等画布交互。
- 验证结果：`npm run typecheck -w apps/web` 通过；`npm run lint -w apps/web` 通过但保留既有 Prisma generated 警告；`npx next build` 通过；`npm run docs:sync` 通过；`git diff --check` 通过。WebP 已重新出帧，确认写字阶段不再出现横线，手臂和画笔绑定移动，文字未超出画布。
- 下一步：等待后续体验验收；如需更精细动画，再基于当前 WebP 帧继续调整角色画风和手臂轨迹。
