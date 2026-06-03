# T076：AI 图片服务新增 Right Code 上游

- 优先级：P1
- 负责人：Codex / 开发 B
- 状态：待验收
- 依赖：T075
- 背景：当前 AI 美颜通过通用 `AI_IMAGE_*` 环境变量接入图片模型，需要新增 Right Code Draw 作为可切换上游。
- 目标：新增 `AI_IMAGE_PROVIDER=right-code-draw` 支持，后端根据 provider 选择 Right Code `/v1/images/generations` 调用，并把返回 URL 下载成图片结果给现有任务化链路使用。
- 不做：不写入真实 API key，不做自动 fallback，不改变前端上传参数，不接额度扣减，不做 provider 管理后台。
- 主要文件范围：`apps/web/src/lib/tools/photo/ai-image-provider.ts`, `.env.example`, `docs/tasks/items/T076-ai-photo-right-code-provider.md`, `docs/tasks/claims/T076-codex.md`, `docs/progress/2026-05-27.md`
- 验证方式：`npm run typecheck -w apps/web`; `npm run lint -w apps/web`; `npx next build`; `git diff --check`
- 当前风险：Right Code 文档接口是 `images/generations`，不是标准图片编辑接口；参考图保身份效果需要真实样张验收。
- 执行记录：
  - 新增 `AI_IMAGE_PROVIDER=right-code-draw` 分支。
  - Right Code provider 调用 `${AI_IMAGE_API_BASE_URL}/v1/images/generations`，使用 JSON body 和参考图 data URL。
  - 后端读取 Right Code 返回的 `data[0].url`，再下载结果图并转换为统一 `ImageEditResult`。
  - `.env.example` 增加 Right Code provider 示例，不包含真实 API key。
- 验证结果：`npm run typecheck -w apps/web` 通过；`npm run lint -w apps/web` 通过但保留既有 Prisma generated 警告；`npx next build` 通过；`git diff --check` 通过。
- 下一步：等待验收；用 `AI_IMAGE_PROVIDER=right-code-draw` 和真实样张测试保身份效果。
