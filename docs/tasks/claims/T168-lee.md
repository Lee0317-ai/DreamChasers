# T168：胡了卜铜钱资产和 3 项局外升级

- 任务编号：T168
- 领取人：Lee
- 领取时间：2026-06-14
- 状态：待验收
- 预计完成：2026-06-14
- 允许修改文件：`apps/web/src/app/games/hulebu/page.tsx`, `apps/web/src/modules/games/hulebu/**`, `apps/web/public/games/hulebu-demo/index.html`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T168-hulebu-meta-coins-upgrades.md`, `docs/tasks/claims/T168-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/superpowers/specs/2026-06-14-hulebu-meta-coins-upgrades-design.md`, `docs/superpowers/plans/2026-06-14-hulebu-meta-coins-upgrades.md`, `docs/modules/mahjong-roguelike/**`, `docs/progress/2026-06-14-lee.md`, `docs/completion/**`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `apps/web/src/app/account/**`, `apps/web/src/lib/ai/**`, `apps/web/src/modules/tools/**`, `apps/web/prisma/**`, `/Users/lee/Desktop/Lee/TimePick/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`
- 验证命令：`npm run test -w apps/web -- hulebu`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `perl -0ne 'print $1 if /<script>([\\s\\S]*?)<\\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-inline.js && node --check /tmp/hulebu-config-playable-inline.js`; `perl -0ne 'print $1 if /<script>([\\s\\S]*?)<\\/script>/' apps/web/public/games/hulebu-demo/index.html > /tmp/hulebu-static-inline.js && node --check /tmp/hulebu-static-inline.js`; `npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T168-hulebu-meta-coins-upgrades.md docs/tasks/claims/T168-lee.md docs/superpowers/specs/2026-06-14-hulebu-meta-coins-upgrades-design.md docs/superpowers/plans/2026-06-14-hulebu-meta-coins-upgrades.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-14-lee.md docs/completion/2026-06-14-task-168-hulebu-meta-coins-upgrades.md`; `git diff --check`; 浏览器桌面端和 390px 移动端检查 `/games/hulebu`
- 当前阻塞：无
- 完成备注：
  - 已落地局外铜钱真实消费与 3 项升级本地持久化。
  - 已完成 iframe bonus 桥接：`reserveBonus / shieldBonus / toolBonus`。
  - `apps/web` 测试、类型检查、构建、内联脚本语法检查和桌面/390 页面行为检查均已通过。
