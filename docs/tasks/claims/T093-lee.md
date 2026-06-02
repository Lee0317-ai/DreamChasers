# T093：胡了卜 10 关朋友试玩 Demo

- 领取人：Lee
- 领取时间：2026-06-01
- 状态：待验收
- 预计完成：2026-06-01
- 允许修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T093-hulebu-friend-playtest-demo.md`, `docs/tasks/claims/T093-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-06-01-hulebu-friend-playtest-demo.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-01.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, Cocos 美术资源目录。
- 依赖任务：T085, T086, T087, T088, T089, T090, T091, T092
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页检查第 1-4 关教学、右侧三道具、奖励默认卡槽 +2、桌面和移动端首屏；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T093-hulebu-friend-playtest-demo.md docs/tasks/claims/T093-lee.md docs/superpowers/plans/2026-06-01-hulebu-friend-playtest-demo.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check`
- 当前阻塞：无。
- 完成内容：已完成 10 关朋友试玩 Demo。默认玩家页只展示 1-10 关；第 1-4 关分别教学 `碰 / 吃 / 杠 / 胡`，前 3 关使用 6 格卡槽，第 4 关起使用 8 格卡槽；第 3 关后奖励固定为 `卡槽 +2`；第 5 关起进入 240 张密集牌山高压模式。右侧道具改为 `洗牌 / 撤回 / 丢弃`，丢弃可移除主槽末尾牌作为救场。移动端玩家页三道具改为底部横排，保证 390 CSS 像素下卡槽和道具完整可见。
- 验证结果：`npm run test -w packages/shared -- mahjong-config-playable-prototype mahjong-config` 通过，2 个测试文件 28 个测试通过；HTML 脚本 `node --check` 通过。Kimi WebBridge 桌面默认页验证：10 个关卡 tab、第一关 6 张教学牌/6 格卡槽、HUD `重点 碰`、右侧道具 `洗牌 / 撤回 / 丢弃`。运行态验证第三关奖励只显示 `卡槽 +2`，丢弃会从主槽移除牌并消耗次数。Chrome CDP 390x844 移动验证：`innerWidth=390`、`scrollWidth=390`，卡槽宽 `350`，底部工具栏宽 `370`，无横向溢出。
- 下一步：等待 Lee 用默认玩家页给朋友试玩，重点观察前 4 关教学是否足够顺、第五关地狱模式难度跨度是否过大，以及丢弃道具是否需要改成可选主槽内任意一张。
