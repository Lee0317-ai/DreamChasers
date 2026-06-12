# AI 修图过程记录

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
