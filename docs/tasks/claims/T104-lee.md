# T104：胡了卜悬台窄腰模板调牌器实现

- 领取人：Lee
- 领取时间：2026-06-02
- 状态：待验收
- 预计完成：2026-06-02
- 允许修改文件：`apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `apps/web/public/games/hulebu-demo/tuner.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `packages/shared/src/mahjong-config.test.ts`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T104-hulebu-suspended-waist-template.md`, `docs/tasks/claims/T104-lee.md`, `docs/tasks/NEXT_ID.md`, `docs/superpowers/plans/2026-06-02-hulebu-suspended-waist-template.md`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-02-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `packages/shared/src/mahjong-mountain-generator.ts`, `apps/web/src/app/tools/**`, `apps/web/src/modules/tools/**`, `apps/web/src/components/tools/**`, `apps/web/src/lib/ai/**`, `apps/web/src/lib/analytics/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 依赖任务：T095, T096, T101, T102, T103
- 验证命令：`npm run test -w packages/shared -- mahjong-config-playable-prototype`; `npm run test -w packages/shared -- mahjong-config`; `perl -0ne 'print $1 if /<script>([\s\S]*?)<\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-script.js && node --check /tmp/hulebu-config-playable-script.js`; `npm run test -w apps/web -- hulebu`; 通过 Kimi WebBridge 或 Codex App 内置浏览器打开 `/games/hulebu-demo/tuner.html?template=suspended-waist` 检查调牌器可渲染；390px 移动端截图检查牌面、记牌器、动作栏、卡槽和底部道具不遮挡；`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T104-hulebu-suspended-waist-template.md docs/tasks/claims/T104-lee.md docs/superpowers/plans/2026-06-02-hulebu-suspended-waist-template.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-02-lee.md`; `git diff --check`
- 当前阻塞：无。
- 下一步：Lee 验收 `/games/hulebu-demo/tuner.html?template=suspended-waist&level=10&seed=waist-check`；如手感稳定，再另开任务决定是否加入默认高压关 auto 池。
