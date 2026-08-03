# T182：胡了卜国风人物操作演出概念稿

- 领取人：Lee
- 领取时间：2026-06-22
- 状态：待验收
- 预计完成：2026-06-22
- 允许修改文件：`output/hulebu-ui-assets/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T182-hulebu-action-fx-character-concept.md`, `docs/tasks/claims/T182-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-06-22-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/game/**`, `packages/shared/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 依赖任务：T181
- 验证命令：`/Users/lee/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -m py_compile output/hulebu-ui-assets/scripts/build_action_fx_character_concept_v1.py output/hulebu-ui-assets/scripts/generate_apimart_image.py`; `/Users/lee/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 output/hulebu-ui-assets/scripts/build_action_fx_character_concept_v1.py`; `test -f output/hulebu-ui-assets/hulebu-action-fx-character-concept-v1/preview/action-fx-character-concept-board.png`; `test -f output/hulebu-ui-assets/hulebu-action-fx-character-concept-v1/manifest.json`; `npm run docs:sync`; `git diff --check -- output/hulebu-ui-assets/scripts output/hulebu-ui-assets/hulebu-action-fx-character-concept-v1 docs/tasks/items/T182-hulebu-action-fx-character-concept.md docs/tasks/claims/T182-lee.md docs/tasks/TASK_BOARD.md docs/tasks/CLAIMS.md docs/status/CURRENT_STATUS.md docs/progress/2026-06-22-lee.md docs/tasks/CHANGE_INTAKE.md docs/tasks/NEXT_ID.md`
- 当前风险：第一版是概念板和程序化剪影，不是最终人物立绘；PPTOKEN `.cc` 端点不支持透明底且普通背景生成超时，APIMART 当前在本机连接 `api.apimart.ai:443` 超时，系统 `$imagegen` 的内置 `image_gen` 工具本轮未暴露且环境缺少 `OPENAI_API_KEY`，真实人物图需要后续在可用网络/可用图像生成服务下补充。
- 当前阻塞：无。
- 备注：已生成 `output/hulebu-ui-assets/hulebu-action-fx-character-concept-v1/`；第一版使用程序化国风人物剪影和现有透明牌面表达构图，不接入工程代码。
