# AI 修图模块说明

**最后更新**：2026-06-29
**对应任务**：T045、T074、T078、T154、T155、T165、T166
**负责人**：Lee  
**状态**：本地修图工作台已完成；`AI 美颜`、`AI 溶图`、`AI 细节修复`、`高清增强` 和 `AI 对话修图` 已接入平台 AI Gateway 图片编辑链路；批量品牌填充第一版已完成

## 1. 模块目标

AI 修图模块负责提供两层能力：

1. 浏览器内即可完成的免费本地修图能力。
2. 通过平台 AI Gateway 调度的高价值图片 AI 能力。

第一阶段已经完成本地工作台，后续接线必须遵守平台治理口径，不能让 AI 修图继续长出独立的 provider、额度和日志体系。

## 2. 当前已落地能力

本地免费能力：

- 图片上传与预览。
- 亮度、对比度、饱和度、色温、缩放、旋转。
- 裁剪、滤镜、边框、文字、贴纸。
- 撤销重做。
- PNG 导出。

当前已治理收口的 AI 能力：

- `AI 美颜`：自然人像增强。
- 运行方式：`/api/tools/photo/beauty` + 进度轮询 + 结果替换当前画布。
- 当前口径：已统一走平台 AI Gateway、provider readiness、统一积分和统一请求日志；迁移期允许读取现有 openai-compatible 图片 provider 配置作为兼容入口。
- `AI 溶图`：产品图 + 背景图 + 场景描述，通过平台 AI Gateway `image_edit` 任务化生成并替换当前画布。
- `AI 细节修复`：当前画布图片 + 修复描述，通过平台 AI Gateway `image_edit` 任务化生成并替换当前画布。
- `高清增强`：当前画布图片通过平台 AI Gateway `image_edit` 任务化生成高清增强图并替换当前画布。
- `AI 对话修图`：右侧对话框支持一句话修图，按当前画布图片和用户指令生成结果图。

当前已完成的本地批量能力：

- `批量品牌`：最多 12 张图片批量上传，统一添加左上角短字、前置 Logo 和右下角 Logo，支持批量预览、单张载入画布和 Canvas 批量导出。

## 3. 免费和 AI 边界

保持免费本地处理：

- 裁剪、旋转、缩放。
- 亮度、对比度、饱和度、色温。
- 滤镜、文字、贴纸、边框。
- 手动遮盖、模糊或局部装饰类非模型处理。

后续进入 AI Gateway 的能力：

- AI 美颜。
- 智能擦除或智能去局部遮挡。
- 换背景。
- 高清增强。
- 其他需要图片模型返回新图的能力。

## 4. T154 能力分层结论

### 4.1 可以先做 mock 或 dry run 的部分

- AI 能力卡片的模型展示、错误语义和积分提示。
- AI 美颜的 Gateway 请求结构、能力映射和请求日志字段。
- provider readiness 在账号中心和后端错误里的统一表现。
- AI 美颜现有轮询 UI 与平台错误码的对接。

这些部分可以先接入统一治理面，即使暂时不返回真实生成图片，也能先把平台口径站稳。

### 4.2 必须依赖真实图片 provider 的部分

- AI 美颜真实出图。
- 智能擦除。
- 换背景。
- 高清增强。

原因是这些能力都需要真实图片输入输出，单靠文本 mock 无法完成产品闭环。

### 4.3 必须后置到更完整资产链路的部分

- 批量 AI 修图。
- 长时异步任务队列。
- 云端结果保存与版本对比。
- 用户自带图片 provider key。
- 多步骤图片工作流编排。

## 5. provider 能力约束

### 5.1 `image_edit`

适合：

- AI 美颜。
- 智能擦除。
- 局部重绘。
- 换背景。
- 高清增强。

这是 AI 修图第一阶段最核心的 Gateway 能力。首条接线建议继续沿用现有 `AI 美颜`，因为它已经有上传、轮询和结果替换 UI，只是后端治理还没收口。

### 5.2 `image_generation`

适合：

- 纯文字生成背景。
- 贴纸或素材生成。
- 扩图、补边等更偏生成的玩法。

这一类不建议作为第一条站内接线，因为它更像新内容生成，而不是当前工作台上的“修图增强”。

### 5.3 `image_understanding`

适合：

- 自动识别人像、主体和背景。
- 辅助生成编辑 prompt。
- 辅助生成擦除或替换区域建议。

它更适合作为后续辅助能力，不单独做第一条产品接线。

## 6. 推荐接线顺序

1. 保持本地工作台不动，冻结现有免费能力边界。
2. `AI 美颜` 已迁到平台 AI Gateway，成为第一条图片 AI 治理样板。
3. 下一条优先考虑智能擦除或换背景，但前提是先补资产临时存放、结果回看和更长异步任务处理。
4. `image_understanding` 仍放在更后面，只作为辅助能力。

## 6.1 T165 新增能力

批量品牌填充：

- 支持批量上传最多 12 张图片。
- 在左上角添加 10 个以内短字。
- 可把上传 logo 放在短字前，形成 `logo + 短字`。
- 在右下角添加 LOGO。
- 批量预览后可点击单张图片载入主画布单独调整。
- 使用浏览器 Canvas 按原图尺寸批量导出品牌图。

AI 溶图 / 场景融合：

- 支持产品图和背景图输入，例如产品图 + 雪山背景图。
- 通过 AI Gateway 图片编辑任务把产品自然融合到户外、雪山等场景。
- Prompt 明确要求改善边缘、接触阴影、环境光、反光、色温和透视一致性，避免简单抠图贴背景的假感。
- OpenAI-compatible provider 会把产品图和背景图都作为 image edit 表单图片提交；真实质量依赖 provider 的多图编辑能力。

## 7. 主要文件

当前已存在的核心实现：

- `apps/web/src/app/tools/ai-photo-editor/page.tsx`
- `apps/web/src/components/tools/photo/PhotoEditorWorkspace.tsx`
- `apps/web/src/lib/tools/photo/ai-image-provider.ts`
- `apps/web/src/lib/tools/photo/beauty-task-store.ts`
- `apps/web/src/lib/tools/photo/scene-blend-task-store.ts`
- `apps/web/src/app/api/tools/photo/beauty/**`
- `apps/web/src/app/api/tools/photo/scene-blend/**`

本次新增的模块文档：

- `docs/modules/photo-editor/README.md`
- `docs/modules/photo-editor/IMPLEMENTATION_PLAN.md`
- `docs/modules/photo-editor/PROGRESS.md`
- `docs/modules/photo-editor/DECISIONS.md`
- `docs/modules/photo-editor/HANDOFF.md`

## 8. 当前风险

- 图片 AI 更依赖真实 provider，无法像文本能力那样长期依赖 mock。
- 智能擦除、换背景、高清增强都更容易把任务推向异步和临时资产管理。
- 如果继续在工具目录下扩写新的图片 provider 私有配置，后续仍会和平台 provider readiness、积分和日志发生双轨冲突。
- 批量品牌填充会带来浏览器内存和批量导出压力，需要限制单次图片数量、尺寸和导出并发。
- AI 溶图依赖 provider 多图编辑或参考图能力，实施前需要先验证平台 AI Gateway 的图片能力契约是否支持。
