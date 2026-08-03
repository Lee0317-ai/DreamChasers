# T182：胡了卜国风人物操作演出概念稿

- 优先级：P2
- 负责人：Lee
- 状态：待验收
- 背景：用户希望在 `碰 / 杠 / 胡` 等大操作里加入动画和贴图增强爽感，并确认方向为“国风克制、像精致棋牌游戏”。参考其他麻将游戏后，人物图适合做成风场掌局人或侧边 cut-in，而不是满屏廉价大特写。
- 目标：输出一版不接入工程的国风人物操作演出概念稿，展示 `碰 / 杠 / 补杠 / 胡` 的演出层级、人物 cut-in 位置、字牌贴图和牌面合拢效果。
- 不做：不接入 Web 或 Cocos 工程，不做完整动画状态机，不生成最终商用人物立绘，不修改玩法、关卡、账号、PDF、AI 修图、TimePick 或部署文件。
- 依赖：T181 v6 透明 UI / 牌面资源；用户确认的“国风克制”方向。
- 允许修改文件：`output/hulebu-ui-assets/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T182-hulebu-action-fx-character-concept.md`, `docs/tasks/claims/T182-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-06-22-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/game/**`, `packages/shared/**`, `apps/web/prisma/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`
- 验证命令：`/Users/lee/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 -m py_compile output/hulebu-ui-assets/scripts/build_action_fx_character_concept_v1.py output/hulebu-ui-assets/scripts/generate_apimart_image.py`; `/Users/lee/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 output/hulebu-ui-assets/scripts/build_action_fx_character_concept_v1.py`; `test -f output/hulebu-ui-assets/hulebu-action-fx-character-concept-v1/preview/action-fx-character-concept-board.png`; `test -f output/hulebu-ui-assets/hulebu-action-fx-character-concept-v1/manifest.json`; `npm run docs:sync`; `git diff --check -- output/hulebu-ui-assets/scripts output/hulebu-ui-assets/hulebu-action-fx-character-concept-v1 docs/tasks/items/T182-hulebu-action-fx-character-concept.md docs/tasks/claims/T182-lee.md docs/tasks/TASK_BOARD.md docs/tasks/CLAIMS.md docs/status/CURRENT_STATUS.md docs/progress/2026-06-22-lee.md docs/tasks/CHANGE_INTAKE.md docs/tasks/NEXT_ID.md`
- 执行记录：
  - 2026-06-22：新增任务，确认先做概念稿，不接入工程。当前环境未设置 `PPTOKEN_API_KEY`，因此第一版先使用现有 T181 v6 透明牌面和程序化国风人物剪影输出概念板，后续再替换为真实人物立绘。
  - 2026-06-22：已生成 `output/hulebu-ui-assets/hulebu-action-fx-character-concept-v1/`，包含 `preview/action-fx-character-concept-board.png` 概念板、`preview/transparent-sticker-sheet.png` 透明贴图预览、`characters/` 四风场人物 cut-in 占位、`stickers/` 杠/补杠/胡了操作字牌和 `manifest.json`。
  - 2026-06-22：尝试使用用户提供的临时 `PPTOKEN_API_KEY` 生成真实 `东风场掌局人` 透明立绘；默认端点返回 `HTTP 401 INVALID_API_KEY`，切到用户补充的 `https://api.pptoken.cc/v1` 后，透明底参数返回“Transparent background is not supported for this model”，改用普通背景生成时请求超时断开；未生成真实人物图，未把 key 写入文件。
  - 2026-06-22：根据用户提供的 APIMART 示例新增 `output/hulebu-ui-assets/scripts/generate_apimart_image.py`，脚本从 `APIMART_API_KEY` 环境变量读取 token、走 curl 提交任务、轮询结果并下载 PNG；当前本机到 `api.apimart.ai:443` 连接超时，DNS 解析到 `111.243.214.169`，同机访问 PPTOKEN `.cc` 正常，判断为 APIMART 目标网络当前不可达。
  - 2026-06-22：按用户追问检查系统 `$imagegen` 技能；该技能默认需要内置 `image_gen` 工具，但当前 Codex 会话未暴露该工具，fallback CLI 又要求 `OPENAI_API_KEY`，当前环境未设置，因此无法用系统 `$imagegen` 在本轮直接生成图片。
- 当前阻塞：无。
- 下一步：等待用户判断人物 cut-in 是否适合胡了卜；如需真实人物图，可在 APIMART 网络恢复后运行 `generate_apimart_image.py`，或改用人工美术/其他可用生成路径替换程序化剪影。
