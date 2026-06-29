# T165：AI 修图批量品牌填充和 AI 溶图实现

- 任务编号：T165
- 优先级：P1
- 任务名称：AI 修图批量品牌填充和 AI 溶图实现
- 默认负责人：Lee
- 负责人：Lee
- 状态：已完成
- 依赖：T154, T155, T156
- 背景：AI 修图已完成本地工作台，`AI 美颜` 已迁到平台 AI Gateway。Lee 新增两个更偏电商/内容生产的需求：一是给图片批量添加短字、前置 logo 和右下角 LOGO；二是把产品图自然融合到雪山等场景背景中，避免简单抠图贴背景的假感。
- 目标：实现 `批量品牌填充` 与 `AI 溶图/场景融合` 第一版：批量品牌填充走本地 Canvas 处理，AI 溶图走平台 AI Gateway 任务化流程。
- 不做：
  - 不接真实额度扣减。
  - 不新增真实 API key。
  - 不修改 PDF、游戏、TimePick、账号、Prisma、部署、package 或 env。
  - 不扩大到完整批量 AI 处理中心。
- 允许修改文件：
  - `apps/web/src/components/tools/photo/**`
  - `apps/web/src/lib/tools/photo/**`
  - `apps/web/src/app/api/tools/photo/**`
  - `docs/modules/photo-editor/**`
  - `docs/tasks/items/T165-ai-photo-batch-branding-and-scene-blend.md`
  - `docs/tasks/claims/T165-lee.md`
  - `docs/tasks/CHANGE_INTAKE.md`
  - `docs/tasks/NEXT_ID.md`
  - `docs/progress/2026-06-29-lee.md`
  - `docs/tasks/TASK_BOARD.md`
  - `docs/tasks/CLAIMS.md`
  - `docs/status/CURRENT_STATUS.md`
- 禁止修改文件：
  - `packages/**`
  - `.env`
  - `apps/web/.env`
  - `docker-compose.yml`
  - `docker-compose.prod.yml`
  - `deploy/**`
  - `package.json`
  - `package-lock.json`
- 验证方式：
  - `npm run test -w apps/web -- photo ai-gateway`
  - `npm run lint -w apps/web`
  - `npm run typecheck -w apps/web`
  - `npm run build -w apps/web`
  - `npm run docs:sync`
  - `git diff --check`

## 需求拆分

### 1. 批量品牌填充

- 单图上传后，可在图片左上角添加 10 个以内文字。
- 可上传一个 logo 图片，放在左上角文字最前面，形成 `logo + 短字` 的品牌标识。
- 可在图片右下角添加 LOGO。
- 支持批量上传多张图片，统一套用同一套品牌填充配置。
- 填充完成后在画布或预览区尽量批量预览。
- 若某张图片不满意，可单独进入编辑并微调文字、logo、位置、缩放或开关。

### 2. AI 溶图 / 场景融合

- 用户上传产品图和背景图，例如产品图 + 雪山背景图。
- 目标不是简单抠图叠放，而是通过 AI 生图/编辑让产品像真实处在背景环境中。
- 重点处理边缘柔化、接触阴影、环境光、反光、色温和透视一致性。
- 第一版可优先支持单个产品主体 + 单张背景图 + 一段场景意图提示，例如“户外感强、雪山场景、自然摆放”。
- 生成结果需要保留用户选择结果，并支持不满意时重新生成或回到局部编辑继续处理。

## 初步实施建议

1. 已实现 `批量品牌填充` 的非 AI 版本：复用浏览器 Canvas，支持批量图片列表、统一短字/logo 配置、批量预览、单张载入画布和批量导出。
2. 已实现 `AI 溶图/场景融合` 第一版：新增单独 AI 能力入口，继续走平台 AI Gateway 和任务化流程，输入包含产品图、背景图和场景提示。
3. 批量品牌填充保持免费本地处理；AI 溶图属于模型调用能力，仍按 Gateway 图片编辑能力消耗。
4. OpenAI-compatible provider 已支持把产品图和背景图作为多图 image edit 请求提交；mock provider 仍只覆盖治理链路和任务状态，不代表真实出图质量。

## 实现结果

- `批量品牌` 工具已出现在 AI 修图左侧创意工具区。
- 支持批量上传最多 12 张图片。
- 支持上传 Logo、填写 10 个以内左上角短字、控制文字大小和 Logo 大小。
- 支持左上角 `Logo + 短字` 和右下角 Logo 填充。
- 支持批量预览，点击单张预览会先生成品牌填充结果，再载入主画布继续单独修改。
- 支持通过 Canvas 按原图尺寸批量导出品牌图。
- `AI 溶图` 已替换原占位 `AI 换背景` 入口。
- 支持上传背景图、填写场景描述、提交 AI Gateway 任务、轮询进度、获取结果并替换当前画布。
- 新增 scene-blend API：`/api/tools/photo/scene-blend`、`/tasks/[taskId]`、`/result`。
- 新增测试覆盖 scene-blend task store 与 openai-compatible provider 双图 FormData。

## 验证结果

- `npm run test -w apps/web -- photo ai-gateway openai-compatible-provider`：通过，4 个测试文件、11 个用例通过。
- `npm run lint -w apps/web`：通过，有 44 个 generated Prisma unused eslint-disable warning，非本任务新增错误。
- `npm run typecheck -w apps/web`：未完全通过，当前环境缺少 `lucide-react`、`next-auth`、`@auth/prisma-adapter`、`nodemailer` 类型/依赖并触发既有 auth 隐式 any 错误；本任务新增 route 的 Buffer body 类型错误已修复。
- `npm run build -w apps/web`：未进入 Next build，`prisma generate` 失败于 `@prisma/dev` CommonJS require ESM `zeptomatch` 的既有 Node/Prisma 兼容问题。
- 浏览器冒烟：`http://127.0.0.1:3029/tools/ai-photo-editor` 桌面 1280x720 可见批量品牌与 AI 溶图参数面板；移动 390x844 可通过内联参数面板展开批量品牌与 AI 溶图控件。
- `git diff --check`：通过。

## 风险

- 批量预览会增加浏览器内存压力，需要限制单次图片数量、单图尺寸和导出并发。
- 用户上传 logo 和产品图涉及透明 PNG、白底图、不同长宽比，需要设计裁切和缩放规则。
- AI 溶图质量高度依赖 provider 的多图编辑能力；如果 provider 只支持单图编辑，可能无法稳定保留产品主体。
- 溶图功能应避免承诺“完全真实”，第一版验收应以自然度、边缘和光影明显改善为准。
