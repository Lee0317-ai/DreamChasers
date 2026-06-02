# T093：胡了卜 10 关朋友试玩 Demo

- 优先级：P1
- 默认负责人：Lee
- 状态：待验收
- 背景：Lee 决定先把 HTML 原型打磨成可以给朋友直接试玩的 10 关小 run，用真实反馈验证玩法，再进入 Cocos 做 UI、美术和发布工程。前 4 关作为教学关，第 5 关开始进入正式高压牌山。
- 目标：在 `config-playable` 默认玩家页中形成 10 关朋友试玩 Demo：第 1 关教学 `碰` 且 6 个卡槽；第 2 关教学 `吃` 且 6 个卡槽；第 3 关教学 `杠` 且 6 个卡槽，通关后第一次奖励固定为卡槽 +2 并达到 8 格上限；第 4 关教学 `胡` 并使用 8 个卡槽；第 5-10 关进入高压密集牌山小 run。右侧道具改为 `洗牌 / 撤回 / 丢弃`，其中丢弃可以移除卡槽中的一张牌作为救场。
- 不做：不修改 Cocos 正式工程；不修改 Web 站入口；不做最终美术、动画音效、排行榜、账号、支付或完整 20 关平衡；不扩大到 PDF 或 AI 修图模块。
- 依赖：T085, T086, T087, T088, T089, T090, T091, T092
- 主要文件范围：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T093-hulebu-friend-playtest-demo.md`, `docs/tasks/claims/T093-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-06-01-hulebu-friend-playtest-demo.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, Cocos 美术资源目录。
- 验证方式：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查第 1-4 关教学、右侧三道具、奖励默认卡槽 +2、桌面和移动端首屏；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T093-hulebu-friend-playtest-demo.md docs/tasks/claims/T093-lee.md docs/superpowers/plans/2026-06-01-hulebu-friend-playtest-demo.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check`
- 进展：
  - 2026-06-01：Lee 确认做 10 关小 run 朋友试玩 Demo；前 3 关教学碰/吃/杠且 6 个卡槽，第三关后默认奖励卡槽 +2 到 8；第 4 关教学胡；第 5 关开始地狱模式。已创建任务并领取。
  - 2026-06-01：已完成默认玩家页 10 关试玩 run 编排。默认页只展示 1-10 关；第 1-4 关分别为碰/吃/杠/胡教学牌山，第 1-3 关使用 6 格卡槽，第 4 关起使用 8 格卡槽；第 3 关后奖励固定为 `卡槽 +2`，第 5 关起恢复 240 张密集牌山。
  - 2026-06-01：右侧道具已调整为 `洗牌 / 撤回 / 丢弃`。丢弃会移除主槽末尾牌、消耗 1 次道具并清空撤回历史；主槽已满且无组合时，如果还有丢弃次数，会提示可用丢弃救场而不是立即失败。
  - 2026-06-01：移动端玩家页改为底部横排三道具，390 CSS 像素验证无横向溢出，8 格卡槽和道具都在可见区域内。
