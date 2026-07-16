# T166：AI 修图剩余 AI 功能补全

- 任务编号：T166
- 优先级：P1
- 任务名称：AI 修图剩余 AI 功能补全
- 默认负责人：Lee
- 负责人：Lee
- 状态：待验收
- 依赖：T155, T165
- 来源：Lee 反馈“把页面上剩余的 AI 功能都补全”
- 涉及模块：AI 修图工具
- 背景：T165 已完成批量品牌 Logo 水印和 AI 溶图，但页面上 `AI 细节修复`、`高清增强` 和右侧 `AI 对话修图` 仍存在未开放或占位状态，影响 AI 修图工具闭环。

## 目标

1. 开放 `AI 细节修复`，支持基于当前画布图片和用户描述生成修复图。
2. 开放 `高清增强`，支持基于当前画布图片生成高清增强图。
3. 开放右侧 `AI 对话修图`，支持一句话修图并将结果替换到当前画布。
4. 三类能力统一走平台 AI Gateway `image_edit`，沿用任务创建、轮询和结果读取链路。

## 文件范围

- 允许修改文件：`apps/web/src/components/tools/photo/**`, `apps/web/src/lib/tools/photo/**`, `apps/web/src/app/api/tools/photo/**`, `docs/modules/photo-editor/**`, `docs/tasks/items/T166-ai-photo-remaining-ai-tools.md`, `docs/tasks/claims/T166-lee.md`, `docs/progress/2026-06-29-lee.md`, `docs/completion/2026-06-29-task-T166-ai-photo-remaining-ai-tools.md`
- 禁止修改文件：`apps/web/prisma/**`, `apps/game/**`, `deploy/**`, PDF 工具箱、TimePick、账号中心和胡了卜业务代码

## 验证命令

- 验证方式：`npm run test -w apps/web -- photo-edit repair enhance prompt-edit openai-compatible`; `npm run lint -w apps/web`; `npm run typecheck -w apps/web`; `git diff --check`; 浏览器冒烟 `http://localhost:3029/tools/ai-photo-editor`

## 当前实现记录

- 新增通用单图 AI 编辑任务 store，用于 `repair`、`enhance`、`prompt-edit`。
- 新增 `/api/tools/photo/repair`、`/api/tools/photo/enhance`、`/api/tools/photo/prompt-edit` 及任务查询/结果读取路由。
- 页面去除剩余 AI 工具未开放限制，接入 `AI 细节修复`、`高清增强` 和 `AI 对话修图` 的创建任务、轮询、结果替换与状态提示。

## 验证结果

- `npm run test -w apps/web -- photo-edit repair enhance prompt-edit openai-compatible` 通过，2 个测试文件、8 个用例通过。
- `npm run lint -w apps/web` 通过，仍有既有 generated Prisma unused eslint-disable warning。
- `git diff --check` 通过。
- 浏览器冒烟：`http://localhost:3029/tools/ai-photo-editor` 页面可见 `AI 细节修复`、`高清增强`，AI 工具按钮不再 disabled，页面无 `未开放/暂未开放` 文案。
- `npm run typecheck -w apps/web` 仍受既有依赖缺失和认证类型问题阻塞：`lucide-react`、`next-auth`、`@auth/prisma-adapter`、`nodemailer` 等模块类型缺失。
