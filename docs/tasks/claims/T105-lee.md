# T105：胡了卜震落牌平铺和遮挡点击修复

- 领取人：Lee
- 领取时间：2026-06-03
- 状态：待验收
- 预计完成：2026-06-03
- 允许修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T105-hulebu-loose-tile-layer-blocking-fix.md`, `docs/tasks/claims/T105-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-03-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `apps/web/src/app/tools/**`, `apps/web/src/modules/tools/**`, `apps/web/src/components/tools/**`, `apps/web/src/lib/ai/**`, `apps/web/src/lib/analytics/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 依赖任务：T101, T102, T104
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; `npm run test -w apps/web -- hulebu`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开 `/games/hulebu` 检查连续 `杠 / 胡` 后震落牌不互相叠起、被盖住的下层牌不可点；390px 移动端截图检查牌面、记牌器、动作栏、卡槽和底部道具不遮挡；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T105-hulebu-loose-tile-layer-blocking-fix.md docs/tasks/claims/T105-lee.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-03-lee.md`; `git diff --check`
- 当前阻塞：无。
- 下一步：Lee 继续试玩 `/games/hulebu`，重点确认连续 `杠 / 胡` 后震落牌不会互相叠起，且被盖住的下层普通牌不能点击。
