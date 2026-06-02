# T086：胡了卜数百张小牌密集牌山原型完成记录

- 完成时间：2026-05-30
- 负责人：Lee
- 任务编号：T086
- 修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T086-hulebu-hundreds-tile-mountain.md`, `docs/tasks/claims/T086-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-30.md`
- 实现内容：将配置试玩原型的密集牌山默认牌量提升到 240 张；调参范围改为 120-420 张；牌山坐标系扩大为 920x520；规则牌面尺寸缩小为 38x52；位置生成改为 6 条压叠牌流加 4 个竖堆入口；默认同列深度改为 6，首轮可点牌约 10 张；牌型分配加入 `万 / 条 / 筒 / 字` 四类保底覆盖；保留现有组合包、遮挡判定和手动消除规则。
- 测试覆盖：`mahjong-config-playable-prototype` 新增默认 240 张、小牌尺寸、调参范围、首轮入口常量和 CSS 小牌比例保护；`mahjong-config` 新增默认首轮可点 8-12 张与四类花色覆盖的 VM 回归测试，并把 URL 调参样例从旧 58 张更新到 360 张。
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `node --check /private/tmp/hulebu-config-playable-script.js`; `curl -I 'http://127.0.0.1:3031/apps/game/mahjong-roguelike/prototypes/config-playable/index.html?view=tuner&mode=mountain&level=1'`; Kimi WebBridge 浏览器运行态检查默认 240 张和 `tiles=420` 上限。
- 验证结果：全部通过。默认调牌器运行态为 240 张牌、首轮可点 10 张、调参范围 120-420、牌面约 44x60 CSS 像素；余牌统计为 `万 56 / 条 12 / 筒 38 / 字 134`；`tiles=420` VM 压测为 420 张牌、首轮入口 9、四类牌仍覆盖。
- 遗留问题：当前改动仅覆盖 HTML 调牌原型；Cocos 正式工程的牌量、模板和美术表现仍需后续独立任务承接。默认 10 张入口和字牌权重需要 Lee 人工试玩后再定。
