# T122：TimePick 自动识别平台 AI 重做规划

- 优先级：P1
- 负责人：待领取
- 状态：待领取
- 依赖：T108, T120, T121
- 提出来源：IDEA-20260604-06
- 背景：TimePick 旧自动识别能力此前依赖 Coze 工作流，现在该工作流已经关闭。后续需要重新优化自动识别，并嵌入 DreamChasers 平台系统 AI 能力；图片生成能力计划单独做 skill。
- 目标：规划并拆分新的平台 AI 自动识别能力，替换旧 Supabase Edge Function / Coze 工作流；明确图片生成 skill 的独立边界。
- 不做：本任务作为待办规划入口，未领取前不实现新 AI 能力；不接真实模型；不迁移 Storage；不修改现有资源 CRUD。
- 主要文件范围：`docs/tasks/**`, `docs/superpowers/specs/**`, 后续实现任务再单独确认 `apps/web/src/lib/ai/**`, `apps/web/src/app/api/timepick/**`, `/Users/lee/Desktop/Lee/TimePick/src/**` 和 skill 目录。
- 禁止修改文件：未领取前不修改代码。
- 验证方式：领取后补充；建议先产出规划文档、任务拆分、占位符扫描、`npm run docs:sync` 和 `git diff --check`。

## 预期拆分

- 自动识别输入/输出 JSON 设计。
- 平台 AI provider / AI Gateway 调用方案。
- 账号、额度、失败降级和日志策略。
- TimePick 前端调用点替换。
- 图片生成 skill 单独设计，不并入自动识别迁移任务。
