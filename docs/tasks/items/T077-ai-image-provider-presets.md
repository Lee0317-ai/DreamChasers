# T077：AI 图片服务 provider 快速切换配置

- 优先级：P1
- 负责人：Codex / 开发 B
- 状态：待验收
- 依赖：T076
- 背景：当前 `AI_IMAGE_*` 是单组配置，切换上游时需要同时修改 base URL、key、model 和 provider，不方便快速试不同中转站。
- 目标：新增 provider preset 配置，使用 `AI_IMAGE_ACTIVE_PROVIDER` 选择当前上游，各 provider 的 URL、key、model 分开配置。
- 不做：不写真实 API key，不做 UI 配置面板，不做自动 fallback，不做数据库保存 provider。
- 主要文件范围：`apps/web/src/lib/tools/photo/ai-image-provider.ts`, `.env.example`, `docs/tasks/items/T077-ai-image-provider-presets.md`, `docs/tasks/claims/T077-codex.md`, `docs/progress/2026-05-27.md`
- 验证方式：`npm run typecheck -w apps/web`; `npm run lint -w apps/web`; `npx next build`; `git diff --check`
- 当前风险：环境变量较多，需要保持命名规则稳定；旧单组 `AI_IMAGE_*` 仍需兼容，避免已有部署失效。
- 执行记录：
  - 新增 `AI_IMAGE_ACTIVE_PROVIDER` 作为当前上游选择。
  - 新增 `AI_IMAGE_PROVIDER_<NAME>_BASE_URL/API_KEY/MODEL/PROTOCOL` 配置读取。
  - 保留旧单组 `AI_IMAGE_API_BASE_URL/API_KEY/MODEL/PROVIDER` 兼容路径。
  - `.env.example` 补充 `openai_compatible` 和 `right_code_draw` 两组 provider preset 示例。
- 验证结果：`npm run typecheck -w apps/web` 通过；`npm run lint -w apps/web` 通过但保留既有 Prisma generated 警告；`npx next build` 通过；`git diff --check` 通过。
- 下一步：等待验收；切换上游时只改 `AI_IMAGE_ACTIVE_PROVIDER`。
