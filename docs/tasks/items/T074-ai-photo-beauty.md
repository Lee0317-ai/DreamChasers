# T074：AI 修图工具 AI 美颜接入

- 优先级：P1
- 负责人：Codex / 开发 B
- 状态：待验收
- 依赖：T045
- 背景：AI 修图工具 MVP 已完成本地编辑和 AI 能力占位，下一步需要先开放 `AI 美颜` 的自然人像增强链路。
- 目标：前端只上传图片和美颜类型，后端通过通用 AI 图片服务配置调用 OpenAI-compatible 图片编辑接口，并把生成结果返回给前端替换当前图片。
- 不做：不做瘦脸、大眼、换妆、换发型、批量处理、用户体系、额度扣减、结果云端长期存储或非人像美颜分类。
- 主要文件范围：`apps/web/src/app/api/tools/photo/**`, `apps/web/src/components/tools/photo/**`, `apps/web/src/lib/tools/photo/**`, `.env.example`, `docs/tasks/items/T074-ai-photo-beauty.md`, `docs/tasks/claims/T074-codex.md`, `docs/progress/2026-05-27.md`
- 验证方式：`npm run typecheck -w apps/web`; `npm run lint -w apps/web`; `npx next build`; `git diff --check`
- 当前风险：真实效果依赖当前配置的 AI 图片服务和模型能力；第一版未做人脸检测和结果质量评分，主要通过保守 prompt 和前端撤销降低风险。
- 执行记录：
  - 新增通用 AI 图片服务环境变量：`AI_IMAGE_API_BASE_URL`, `AI_IMAGE_API_KEY`, `AI_IMAGE_MODEL`, `AI_IMAGE_PROVIDER`。
  - 新增 OpenAI-compatible 图片编辑 adapter，当前调用 `/images/edits`，后端固定自然人像增强 prompt。
  - 新增 `POST /api/tools/photo/beauty`，只接收图片和 `beautyType=natural_portrait`。
  - 前端 `AI 美颜` 从占位改为可调用，返回图片后替换当前画布，并纳入撤销历史。
  - 真实 API key 未写入代码、文档或环境变量示例。
- 验证结果：`npm run typecheck -w apps/web` 通过；`npm run lint -w apps/web` 通过但保留既有 Prisma generated 警告；`npx next build` 通过；`npm run docs:sync` 通过；`git diff --check` 通过。
- 下一步：等待验收；上线前需要在部署环境配置真实 `AI_IMAGE_*` 变量，并用真人像样张人工评估自然度和身份保留。
