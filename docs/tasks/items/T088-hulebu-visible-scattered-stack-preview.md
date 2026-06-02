# T088：胡了卜原型散乱可见压叠层

- 优先级：P1
- 默认负责人：Lee
- 状态：待验收
- 背景：T087 已让密集牌山按模板随机、竖屏优先并覆盖 34 个牌面，但当前堆叠渲染只显示每个堆的顶牌和深度角标，视觉上偏“单独柱状堆”，缺少可观察下层牌但不能点击的压叠信息。
- 目标：让 `config-playable` 默认玩家页和调牌器的密集牌山在保持首轮约 8-12 张可点击顶牌的同时，每个堆叠露出若干张被压住的下层牌；下层牌显示真实牌面、轻微错位、保持 blocked/disabled，不可点击。
- 不做：不修改 Cocos 正式工程；不修改共享 Graph-based 生成器；不修改 Web 站入口；不改关卡/奖励 JSON；不做最终美术资源替换；不复制外部游戏源码；不放大首轮可点击数量。
- 依赖：T049, T050, T059, T083, T085, T086, T087
- 主要文件范围：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T088-hulebu-visible-scattered-stack-preview.md`, `docs/tasks/claims/T088-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-30.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`, Cocos 美术资源目录。
- 验证方式：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `node --check /tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开 `http://127.0.0.1:3031/apps/game/mahjong-roguelike/prototypes/config-playable/index.html` 检查默认玩家页；打开 `http://127.0.0.1:3031/apps/game/mahjong-roguelike/prototypes/config-playable/index.html?view=tuner&mode=mountain&level=1` 检查调牌器；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T088-hulebu-visible-scattered-stack-preview.md docs/tasks/claims/T088-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check`
- 进展：
  - 2026-05-30：Lee 确认需要在单独堆叠之外恢复散乱压叠可见效果，新增任务并领取。
  - 2026-05-30：已完成默认玩家页和调牌器的散乱可见压叠层：每个堆叠顶牌可点，向下露出 4 张预览牌，预览牌显示真实牌面但保持 blocked/disabled。
  - 2026-05-30：默认玩家页已把栈深数字降噪为小圆点，调牌器仍保留数字深度提示，兼顾玩家观感和调关可读性。
  - 2026-05-30：已通过共享包静态/VM 回归测试、JS 语法检查、Kimi WebBridge 桌面默认页/调牌器检查和 390px headless Chrome 移动端截图检查。
