# T092：胡了卜玩家页正式一屏 HUD 重排

- 优先级：P1
- 默认负责人：Lee
- 状态：待验收
- 背景：T091 已把默认玩家页牌桌压缩到正式 HUD 空间预算内，但当前玩家页仍保留完整右侧信息面板，移动端会把面板推到下方滚动。Lee 要继续推进正式局内结构：顶部展示关卡、目标和剩余统计，右侧展示道具按钮，下方展示卡槽，默认试玩页要更接近手机小游戏的一屏布局。
- 目标：将 `config-playable` 默认玩家页改为正式一屏 HUD：顶部 HUD 显示关卡/目标/余牌/积分/铜钱，右侧侧栏压缩为道具栏，底部 8 格卡槽保持首屏可见；调牌器视图继续保留完整调参、余牌、奖励和控制信息。
- 不做：不修改 Cocos 正式工程；不修改共享 Graph-based 生成器；不修改 Web 站入口；不改关卡/奖励 JSON；不做最终美术资源替换。`config-playable` HTML 原型内的玩家页 HUD 和密集牌山验收调参允许在本任务内处理。
- 依赖：T049, T050, T085, T086, T087, T088, T089, T090, T091
- 主要文件范围：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T092-hulebu-one-screen-play-hud.md`, `docs/tasks/claims/T092-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`, Cocos 美术资源目录。
- 验证方式：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查桌面和移动端一屏 HUD、右侧道具栏、卡槽首屏和无横向溢出；打开 `view=tuner&mode=mountain&level=1` 检查调牌器完整信息仍可用；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T092-hulebu-one-screen-play-hud.md docs/tasks/claims/T092-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check`
- 进展：
  - 2026-06-01：Lee 继续要求推进正式一屏 HUD。新增任务并领取，实施口径为只改默认玩家页信息架构和 CSS 布局，保留调牌器完整侧栏与现有牌山规则。
  - 2026-06-01：已完成默认玩家页一屏 HUD 重排。玩家页新增顶部 `play-hud`，显示关卡、目标、余牌、积分和铜钱；右侧完整信息侧栏在玩家页隐藏，只保留 `洗山 / 回手 / 看山` 道具栏；移动端保持主栏 + 64px 道具栏双列结构，不再把信息面板推到下方滚动。
  - 2026-06-01：桌面 Kimi WebBridge 实测 1512x682 视口无整页滚动，牌桌 `307x351`，HUD `460x61`，卡槽 `460x114`，右侧道具栏 `76x204`，第 1 关仍为 41 张可见、8 张可点；截图为 `/tmp/hulebu-t092-desktop.png`。390x844 移动受控检查页面无横向溢出且不滚动，牌桌 `276x315`，卡槽底部 `719px`，右侧道具栏 `64x204` 位于首屏；截图为 `/tmp/hulebu-t092-mobile.png`。调牌器视图仍显示调参面板、余牌、奖励和完整侧栏。
  - 2026-06-01：根据 Lee 继续验收反馈完成密集牌山调参补丁：轻微遮挡从 `5%` 改为 `8%` 阈值，低于 8% 可点击，达到 8% 才阻塞；规则牌尺寸调整为 `45x60`，CSS 宽度调整为 `8.0357142857%`；模板锚点向中心收拢并给前 4 个主堆加权，让大多数牌更集中在牌山堆里，同时保留 8 个模板轮换和局内随机变化。第 1-8 关默认首轮可点稳定在 5-8 张，符合 Lee 接受的 3-8 张范围。
