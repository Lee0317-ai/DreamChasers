# T092：胡了卜玩家页正式一屏 HUD 重排

- 领取人：Lee
- 领取时间：2026-06-01
- 状态：待验收
- 预计完成：2026-06-01
- 允许修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T092-hulebu-one-screen-play-hud.md`, `docs/tasks/claims/T092-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`, Cocos 美术资源目录。
- 依赖任务：T049, T050, T085, T086, T087, T088, T089, T090, T091
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查桌面和移动端一屏 HUD、右侧道具栏、卡槽首屏和无横向溢出；打开 `view=tuner&mode=mountain&level=1` 检查调牌器完整信息仍可用；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T092-hulebu-one-screen-play-hud.md docs/tasks/claims/T092-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check`
- 当前阻塞：无。
- 完成内容：已把默认玩家页从“牌桌 + 完整信息侧栏”重排为正式一屏 HUD。顶部新增 `play-hud`，显示关卡、目标、余牌、积分和铜钱；右侧在玩家页只保留 `洗山 / 回手 / 看山` 道具栏；移动端保持主栏 + 64px 道具栏双列结构；调牌器仍保留调参面板、余牌、奖励、控制按钮和完整侧栏。验收调参补丁已同步完成：密集牌山轻微遮挡低于 `8%` 可点击，达到 `8%` 才阻塞；规则牌尺寸调整为 `45x60`，CSS 宽度调整为 `8.0357142857%`；模板锚点向中心收拢，前 4 个主堆加权，让更多牌集中在主要牌山堆内，同时保持模板轮换和随机遮挡变化。
- 验证结果：`mahjong-config-playable-prototype`、`mahjong-config` 和 HTML 脚本语法检查通过。Kimi WebBridge 桌面实测 1512x682 视口无整页滚动，牌桌 `307x351`，HUD `460x61`，卡槽 `460x114`，右侧道具栏 `76x204`；验收补丁后第 1 关 41 张可见/8 张可点，牌面约 `24.5x32.7`，截图为 `/tmp/hulebu-t092-8pct-larger-tiles.png`。运行态遮挡探针验证 `0.9%` 视觉覆盖不阻塞、`11.1%` 视觉覆盖阻塞；第 1-8 关默认首轮可点为 5-8 张。390x844 受控移动检查页面无横向溢出，牌桌 `254x290`，卡槽首屏可见；调牌器 `view=tuner&mode=mountain&level=1` 保留完整信息面板。
- 下一步：等待 Lee 在右侧内置浏览器中试玩验收，重点确认当前 3-8 张起手范围、牌面大小、主堆集中度和顶部 HUD 文案密度是否继续微调。
