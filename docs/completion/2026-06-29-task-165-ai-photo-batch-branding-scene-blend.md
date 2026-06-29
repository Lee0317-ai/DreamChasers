# T165：AI 修图批量品牌填充和 AI 溶图实现完成记录

- 任务编号：T165
- 负责人：Lee
- 完成日期：2026-06-29
- 状态：已完成

## 修改文件

- `apps/web/src/components/tools/photo/PhotoEditorWorkspace.tsx`
- `apps/web/src/components/tools/photo/PhotoEditorWorkspace.module.css`
- `apps/web/src/lib/tools/photo/photo-editor-data.ts`
- `apps/web/src/lib/tools/photo/ai-image-provider.ts`
- `apps/web/src/lib/tools/photo/scene-blend-task-store.ts`
- `apps/web/src/lib/tools/photo/__tests__/scene-blend-task-store.test.ts`
- `apps/web/src/lib/ai/providers/openai-compatible-provider.ts`
- `apps/web/src/lib/ai/__tests__/openai-compatible-provider.test.ts`
- `apps/web/src/app/api/tools/photo/scene-blend/**`
- `docs/modules/photo-editor/**`
- `docs/tasks/items/T165-ai-photo-batch-branding-and-scene-blend.md`
- `docs/tasks/claims/T165-lee.md`
- `docs/progress/2026-06-29-lee.md`

## 实现内容

- 新增 `批量品牌` 创意工具：
  - 支持最多 12 张图片批量上传。
  - 支持 10 字以内左上角短字。
  - 支持上传 Logo，并放在短字前。
  - 支持右下角 Logo 填充。
  - 支持批量预览，点击单张图片会先生成品牌填充结果，再载入主画布单独修改。
  - 支持 Canvas 按原图尺寸批量导出品牌图。
- 新增 `AI 溶图` 图片 AI 工具：
  - 支持产品图、背景图和场景描述。
  - 新增 `/api/tools/photo/scene-blend` 任务创建、轮询和结果接口。
  - 继续走平台 AI Gateway `image_edit` 能力。
  - 生成结果返回后替换当前画布。
- 扩展 OpenAI-compatible image edit provider：
  - 产品图和背景图都通过 FormData `image` 字段提交。
  - Prompt 明确要求自然融合边缘、接触阴影、环境光、反光、色温和透视。

## 验证命令

- `npm run test -w apps/web -- photo ai-gateway openai-compatible-provider`
- `npm run lint -w apps/web`
- `npm run typecheck -w apps/web`
- `npm run build -w apps/web`
- 浏览器桌面和移动端冒烟检查
- `git diff --check`

## 验证结果

- 测试通过：4 个测试文件、11 个用例通过。
- Lint 通过：存在 generated Prisma unused eslint-disable warning，非本任务新增错误。
- 浏览器冒烟通过：`http://127.0.0.1:3029/tools/ai-photo-editor` 在桌面 1280x720 下可见批量品牌与 AI 溶图参数面板；在移动 390x844 下可通过内联参数面板展开两项功能控件。
- `git diff --check` 通过。
- Typecheck 未完全通过：当前环境缺少 `lucide-react`、`next-auth`、`@auth/prisma-adapter`、`nodemailer` 类型/依赖并触发既有 auth 隐式 any 错误。
- Build 未完成：`prisma generate` 阶段失败于 `@prisma/dev` CommonJS require ESM `zeptomatch` 的既有 Node/Prisma 兼容问题。

## 遗留问题

- AI 溶图真实自然度依赖 provider 的多图 image edit 能力，mock provider 只能验证任务链路。
- 批量品牌填充第一版是统一配置，后续可补单张覆盖位置、尺寸和开关。
