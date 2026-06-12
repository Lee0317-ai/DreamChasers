# AI 修图模块实施计划

**日期**：2026-06-11  
**对应任务**：T154  
**负责人**：Lee  
**状态**：规划完成，等待后续实现任务领取

## 1. 目标

把 AI 修图后续接线收敛到平台 AI Gateway 体系中，并明确首条真实图片 AI 能力、provider 约束、异步要求和后置边界。

## 2. 当前前置状态

- `/tools/ai-photo-editor` 本地修图工作台已可用。
- `AI 美颜` 已能跑通工具内异步任务和结果替换。
- 平台已有 AI Gateway、provider readiness、统一错误码和请求日志。
- 平台尚未把图片 AI 纳入统一 capability 和统一产品接线。

## 3. 实施顺序

### 阶段 0：冻结边界

保持以下部分不动：

- 本地修图 UI 和免费编辑能力。
- 现有 AI 能力入口文案。
- 非 AI 的导出、撤销、裁剪和贴纸逻辑。

目标是先治理 AI 调用链，不把范围扩成一轮新的修图功能迭代。

### 阶段 1：AI 美颜 Gateway 化

后续实现任务优先做这一条：

- 把 `AI 美颜` 从 `apps/web/src/lib/tools/photo/ai-image-provider.ts` 的工具内直连，迁到平台 AI Gateway。
- 统一由 Gateway 负责：
  - 模型目录和 capability 校验。
  - provider readiness。
  - 平台积分扣减。
  - 请求日志和标准错误码。
- 前端继续复用现有“提交 -> 轮询 -> 替换当前图片”交互。

建议范围：

- `apps/web/src/lib/ai/**`
- `apps/web/src/app/api/ai/**`
- `apps/web/src/app/api/tools/photo/**`
- `apps/web/src/components/tools/photo/**`

### 阶段 2：图片异步能力基础设施

在进入智能擦除或换背景前，先补：

- 更清晰的图片任务状态机。
- 失败重试和用户可读失败原因。
- 临时结果文件生命周期策略。
- 大图上传和尺寸限制口径。

如果这些基础设施不先落地，第二条图片 AI 能力会显著放大运行时复杂度。

### 阶段 3：第二条图片 AI 能力

推荐顺序：

1. 智能擦除。
2. 换背景。
3. 高清增强。

原因：

- 智能擦除更接近“修图”主叙事。
- 换背景对蒙版、主体分离和结果预览要求更高。
- 高清增强更容易带来大图和成本压力。

### 阶段 4：辅助理解能力

后续再评估：

- 自动主体识别。
- 区域建议。
- prompt 辅助生成。

这一层依赖 `image_understanding`，但不建议抢在真实 `image_edit` 主链路之前。

## 4. 文件边界建议

后续首条实现任务优先允许修改：

- `apps/web/src/lib/ai/**`
- `apps/web/src/app/api/ai/**`
- `apps/web/src/app/api/tools/photo/**`
- `apps/web/src/components/tools/photo/**`
- `apps/web/src/lib/tools/photo/photo-editor-data.ts`
- `docs/modules/photo-editor/**`
- `docs/tasks/**`
- `docs/progress/**`
- `docs/completion/**`

后续首条实现任务建议暂时禁止修改：

- `apps/web/prisma/**`
- `/Users/lee/Desktop/Lee/TimePick/**`
- `apps/web/src/modules/tools/pdf-toolbox/**`
- `apps/game/**`
- 支付、订阅、BYOK 和长期云端资产存储相关文件

## 5. 验证建议

首条实现任务至少应覆盖：

```bash
npm run test -w apps/web -- ai-gateway photo
npm run typecheck -w apps/web
npm run build -w apps/web
npm run docs:sync
git diff --check
```

前端验收还应补：

- 桌面端真实检查。
- 移动端真实检查。
- AI 提交中覆盖层状态。
- 失败提示与重试路径。
- 账号中心请求日志是否出现对应图片任务。

## 6. 本次规划结论

- 不再新增工具私有图片 provider 栈。
- 第一条图片 AI Gateway 接线选 `AI 美颜`。
- 智能擦除、换背景、高清增强全部后置到真实图片 provider 和异步资产链路准备完成之后。
