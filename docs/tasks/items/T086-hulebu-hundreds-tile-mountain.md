# T086：胡了卜数百张小牌密集牌山原型

- 优先级：P1
- 默认负责人：Lee
- 状态：待验收
- 背景：当前 `config-playable` 密集牌山默认约 50 张，页面视觉压力和真实“多层小牌逐步解锁”的体验不足。Lee 反馈牌数应几百张打底，并且牌面要更小，页面才能放下更多牌。
- 目标：把 HTML 调牌原型的密集牌山改为默认约 240 张小牌，调参范围支持 120-420 张，并调整牌山坐标、牌面规则尺寸、CSS 视觉尺寸、首轮可点数量和牌池花色覆盖，便于在调牌器中评估高密度堆叠。
- 不做：不复制外部《羊了个羊》源码；不改 Cocos 正式工程；不改 Web 站入口；不改关卡/奖励 JSON；不实现新的 Graph-based 可解路径搜索；不做最终美术资源替换。
- 依赖：T049, T050, T059, T085
- 主要文件范围：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T086-hulebu-hundreds-tile-mountain.md`, `docs/tasks/claims/T086-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-30.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`, Cocos 美术资源目录。
- 验证方式：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `node --check /private/tmp/hulebu-config-playable-script.js`; 通过本地浏览器打开 `http://127.0.0.1:3031/apps/game/mahjong-roguelike/prototypes/config-playable/index.html?view=tuner&mode=mountain&level=1` 检查调牌器；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T086-hulebu-hundreds-tile-mountain.md docs/tasks/claims/T086-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check`
- 进展：
  - 2026-05-30：新增任务并领取；设计确认采用默认 240 张、调参范围 120-420 张、小牌规则尺寸约 38x52、宽屏坐标系约 920x520 的方案。
  - 2026-05-30：静态回归测试先失败，确认旧原型缺少默认 240 张、小牌尺寸和新调参范围；随后更新 HTML 原型让测试变绿。
  - 2026-05-30：同步更新旧 `tiles=58` URL 调参测试，改为新范围内的数百张牌量样例。
  - 2026-05-30：Kimi WebBridge 浏览器验证默认调牌器生成 240 张牌，URL 上限 `tiles=420` 也能生成并运行；截图保存到 `/private/tmp/hulebu-t086-tuner.png` 供本地复核。
  - 2026-05-30：根据 Lee 验收反馈，把默认首轮可点击牌从 58 张压到约 10 张；默认同列深度改为 6，位置生成改为 6 条压叠牌流加 4 个竖堆入口；牌型分配加入 `万 / 条 / 筒 / 字` 四类保底覆盖。

- 验证结果：`npm run test -w packages/shared -- mahjong-config-playable-prototype` 通过，1 个测试文件、4 个测试；`npm run test -w packages/shared -- mahjong-config` 通过，2 个测试文件、19 个测试；`node --check /private/tmp/hulebu-config-playable-script.js` 通过；本地 HTTP `curl -I` 返回 200；Kimi WebBridge 运行态确认默认调牌器生成 240 张牌、首轮可点 10 张、调参范围 120-420、牌面约 44x60 CSS 像素；余牌统计覆盖 `万 56 / 条 12 / 筒 38 / 字 134`；`tiles=420` VM 压测确认总牌数 420、首轮入口 9、四类牌仍覆盖；截图保存到 `/private/tmp/hulebu-t086-ten-open.png`。

- 遗留问题：当前仍是 HTML 调牌原型的高密度压力版，不替代 Cocos 正式工程；420 张上限适合压测，后续仍需要人工试玩确认 10 张入口是否刚好，以及字牌权重是否需要从 35 下调。
