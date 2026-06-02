# T087：胡了卜原型模板随机、全牌种覆盖和竖屏牌桌

- 优先级：P1
- 默认负责人：Lee
- 状态：待验收
- 背景：T086 已把配置试玩页密集牌山扩到默认 240 张小牌，但 HTML 玩家页仍使用固定横向布局和固定牌流，导致每关样式相近；发牌只保证 `万 / 条 / 筒 / 字` 四类覆盖，没有保证 34 个具体牌面都出现。
- 目标：让 `config-playable` 玩家页和调牌器的密集牌山按关卡/种子稳定随机切换多个模板；默认牌桌改为竖屏优先；默认 240 张牌必须覆盖 `万1-9 / 条1-9 / 筒1-9 / 东南西北中发白` 全部 34 个牌面，并保持首轮约 8-12 张可点击。
- 不做：不修改 Cocos 正式工程；不修改共享 Graph-based 生成器；不修改 Web 站入口；不改关卡/奖励 JSON；不做最终美术资源替换；不复制外部游戏源码。
- 依赖：T049, T050, T059, T083, T085, T086
- 主要文件范围：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T087-hulebu-varied-portrait-mountain.md`, `docs/tasks/claims/T087-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-05-30-hulebu-varied-portrait-mountain.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-30.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`, Cocos 美术资源目录。
- 验证方式：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `node --check /private/tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开 `http://127.0.0.1:3031/apps/game/mahjong-roguelike/prototypes/config-playable/index.html` 检查默认玩家页；打开 `http://127.0.0.1:3031/apps/game/mahjong-roguelike/prototypes/config-playable/index.html?view=tuner&mode=mountain&level=1` 检查调牌器；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T087-hulebu-varied-portrait-mountain.md docs/tasks/claims/T087-lee.md docs/superpowers/plans/2026-05-30-hulebu-varied-portrait-mountain.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check`
- 进展：
  - 2026-05-30：Lee 确认开始实现，新增任务并领取。
  - 2026-05-30：已完成配置试玩原型的 8 模板轮换、竖屏牌桌、模板调参、34 个具体牌面覆盖和移动端溢出修正。
  - 2026-05-30：已通过共享包静态/VM 回归测试、JS 语法检查、Kimi WebBridge 桌面浏览器验证和临时 headless Chrome 390px 移动端截图检查。
  - 2026-05-30：验收中发现调牌器 URL 带 `template=ring` 时切关会继续固定环形，已改为关卡 tab、下一关和重开一轮时恢复自动模板；重开本关仍保留当前调参。
