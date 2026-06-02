# T087：胡了卜原型模板随机、全牌种覆盖和竖屏牌桌

- 领取人：Lee
- 领取时间：2026-05-30
- 状态：待验收
- 预计完成：2026-05-30
- 允许修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T087-hulebu-varied-portrait-mountain.md`, `docs/tasks/claims/T087-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-05-30-hulebu-varied-portrait-mountain.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-05-30.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/completion/**`
- 禁止修改文件：`apps/web/**`, `apps/web/prisma/**`, `apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `packages/shared/src/mahjong-mountain-generator.test.ts`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`, `package.json`, `package-lock.json`, Cocos 美术资源目录。
- 依赖任务：T049, T050, T059, T083, T085, T086
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `node --check /private/tmp/hulebu-config-playable-script.js`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开默认玩家页和调牌器页检查；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T087-hulebu-varied-portrait-mountain.md docs/tasks/claims/T087-lee.md docs/superpowers/plans/2026-05-30-hulebu-varied-portrait-mountain.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md`; `git diff --check`
- 当前阻塞：无。
- 完成内容：已在配置试玩原型中加入 8 个本地模板、自动模板轮换、调牌器模板选择、640x860 竖屏牌桌、34 个具体牌面保底覆盖和栈深角标；移动端 390px 视口已修正横向溢出。
- 验证结果：`npm run test -w packages/shared -- mahjong-config-playable-prototype` 通过；`npm run test -w packages/shared -- mahjong-config` 通过；`node --check /tmp/hulebu-config-playable-script.js` 通过；Kimi WebBridge 桌面检查通过；临时 headless Chrome 移动端截图通过。
- 下一步：等待 Lee 试玩验收，重点看 10 个首轮入口、栈深角标和 8 个模板的读牌压力是否需要继续微调。
