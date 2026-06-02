# T086：胡了卜数百张小牌密集牌山原型

- 领取人：Lee
- 领取时间：2026-05-30
- 状态：待验收
- 预计完成：2026-05-30
- 允许修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T086-hulebu-hundreds-tile-mountain.md`, `docs/tasks/claims/T086-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-30.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`, Cocos 美术资源目录。
- 依赖任务：T049, T050, T059, T085
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `node --check /private/tmp/hulebu-config-playable-script.js`; 通过本地浏览器打开 `http://127.0.0.1:3031/apps/game/mahjong-roguelike/prototypes/config-playable/index.html?view=tuner&mode=mountain&level=1` 检查调牌器；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T086-hulebu-hundreds-tile-mountain.md docs/tasks/claims/T086-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check`
- 当前阻塞：无。
- 下一步：等待 Lee 在右侧内置浏览器中刷新调牌器并试玩默认 240 张牌山；重点观察首轮约 10 张可点牌是否减少选择困难，以及 `万 / 条 / 筒 / 字` 占比是否需要继续调。
- 备注：已完成数百张小牌密集牌山原型；只参考高密度小牌堆叠体验，不复制外部游戏源码。默认生成已从宽铺网格改为 6 条压叠牌流加 4 个竖堆入口。
