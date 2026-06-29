# AI 修图过程记录

## 2026-06-29

- 开始 T165：AI 修图批量品牌填充和 AI 溶图实现。
- 需求 1 已归档为批量品牌填充：左上角 10 个以内短字、可选前置 logo、右下角 LOGO、批量上传、批量预览和单张微调。
- 需求 2 已归档为 AI 溶图/场景融合：产品图和背景图通过 AI 生图/编辑自然融合，重点改善边缘、接触阴影、环境光、反光、色温和透视一致性。
- 已将 T165 从规划升级为实现任务，并完成第一版功能代码。
- 批量品牌填充已支持最多 12 张图片批量上传、左上角 10 字以内短字、前置 Logo、右下角 Logo、批量预览、单张载入画布和 Canvas 批量导出。
- AI 溶图已支持产品图、背景图和场景描述，走 `/api/tools/photo/scene-blend` 创建 Gateway 图片任务，轮询后获取结果并替换当前画布。
- OpenAI-compatible provider 已支持把产品图和背景图都作为 image edit 表单图片提交。
- 验证：`npm run test -w apps/web -- photo ai-gateway openai-compatible-provider` 通过；`npm run lint -w apps/web` 通过但有 generated Prisma warning；`git diff --check` 通过。
- 阻塞：`npm run typecheck -w apps/web` 受既有依赖/类型问题阻塞；`npm run build -w apps/web` 受 Prisma/zeptomatch ESM 兼容问题阻塞。

## 2026-05-22 至 2026-05-27

- 已完成 AI 修图工具 MVP 工作台。
- 已完成本地编辑能力：
  - 图片上传、预览和导出。
  - 亮度、对比度、饱和度、色温、旋转、缩放。
  - 裁剪、滤镜、文字、贴纸、边框。
  - 撤销重做。
- 已补 AI 美颜首版：
  - 新增 `POST /api/tools/photo/beauty`。
  - 新增任务轮询与结果替换。
  - 新增生成中覆盖层与动效。

## 2026-06-11

- 新增 `T154`：AI 修图工具 AI Gateway 接线规划。
- 已创建 `docs/modules/photo-editor/` 独立模块文档目录。
- 已确认当前 `AI 美颜` 属于工具内直连 provider 的过渡态，不再继续扩写第二套治理栈。
- 已冻结接线顺序：
  1. 先迁 `AI 美颜` 到平台 AI Gateway。
  2. 再补智能擦除、换背景、高清增强。
  3. 最后再看 `image_understanding` 辅助能力。
- 已确认后续不在 `T154` 中直接修改修图运行时代码。
- 新增 `T155`：AI 修图 AI 美颜迁移到平台 AI Gateway。
- `AI 美颜` 已迁到平台 AI Gateway `image_edit` 链路。
- `mock-provider` 与 `openai-compatible-provider` 已支持图片编辑结果回传。
- `AI 美颜` route 已要求登录态，后续统一走平台积分与请求日志。
