# AI 修图交接说明

## 当前状态

- 任务：T155
- 状态：已完成
- 当前阶段：本地修图工作台稳定；`AI 美颜` 已迁到平台 AI Gateway；下一条图片 AI 能力尚未开始

## 下一位开发者需要先读

1. `docs/modules/photo-editor/README.md`
2. `docs/modules/photo-editor/IMPLEMENTATION_PLAN.md`
3. `docs/modules/photo-editor/PROGRESS.md`
4. `docs/modules/photo-editor/DECISIONS.md`
5. `docs/tasks/items/T154-ai-photo-editor-ai-gateway-integration-plan.md`
6. `docs/tasks/items/T155-ai-photo-beauty-ai-gateway-migration.md`
7. `docs/tasks/claims/T155-lee.md`

## 关键边界

- 不改本地免费修图能力范围。
- 不新增工具私有图片 provider 配置体系。
- 不把智能擦除、换背景、高清增强和批量处理一起塞进首条接线任务。
- 不提前引入长期云端资产保存、BYOK 或多步骤图片工作流。

## 推荐下一步

后续实现任务优先做：

1. 评估智能擦除或换背景的下一条任务边界。
2. 明确临时资产、结果回看和更长异步任务处理方案。
3. 保持现有前端“提交 -> 轮询 -> 替换图片”体验不被下一条能力破坏。

## 当前风险

- 图片 AI 比文本 AI 更依赖真实 provider，mock 只能覆盖治理面，无法长期替代真实出图。
- 智能擦除和换背景一旦进入，就会把任务推向更重的异步和临时资产处理。
