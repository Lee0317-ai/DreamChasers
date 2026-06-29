# AI 修图交接说明

## 当前状态

- 任务：T165
- 状态：已完成
- 当前阶段：本地修图工作台稳定；`AI 美颜` 已迁到平台 AI Gateway；批量品牌填充和 AI 溶图第一版已完成

## 下一位开发者需要先读

1. `docs/modules/photo-editor/README.md`
2. `docs/modules/photo-editor/IMPLEMENTATION_PLAN.md`
3. `docs/modules/photo-editor/PROGRESS.md`
4. `docs/modules/photo-editor/DECISIONS.md`
5. `docs/tasks/items/T154-ai-photo-editor-ai-gateway-integration-plan.md`
6. `docs/tasks/items/T155-ai-photo-beauty-ai-gateway-migration.md`
7. `docs/tasks/items/T165-ai-photo-batch-branding-and-scene-blend.md`
8. `docs/tasks/claims/T155-lee.md`
9. `docs/tasks/claims/T165-lee.md`

## 关键边界

- 不改本地免费修图能力范围。
- 不新增工具私有图片 provider 配置体系。
- 不把智能擦除、换背景、高清增强和批量处理一起塞进首条接线任务。
- 不提前引入长期云端资产保存、BYOK 或多步骤图片工作流。

## 推荐下一步

后续实现任务优先做：

1. 继续评估智能擦除、换背景或高清增强的下一条图片 AI 任务边界。
2. 明确临时资产、结果回看和更长异步任务处理方案。
3. 为批量品牌填充补更细的单张覆盖配置，例如单张位置、尺寸或开关。
4. 用真实多图图片 provider 验证 AI 溶图质量，确认产品主体保留、边缘、接触阴影和环境光是否达标。

## 当前风险

- 图片 AI 比文本 AI 更依赖真实 provider，mock 只能覆盖治理面，无法长期替代真实出图。
- 智能擦除和换背景一旦进入，就会把任务推向更重的异步和临时资产处理。
- 批量品牌填充要限制单次图片数量、尺寸和导出并发，避免浏览器内存过高。
- AI 溶图已按多图 image edit 请求实现，但真实自然度仍取决于 provider 对多图编辑/参考图的支持质量。
