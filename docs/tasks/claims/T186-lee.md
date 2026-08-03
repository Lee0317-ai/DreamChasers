# T186：胡了卜局外成长与局内流派开局重构

- 任务编号：T186
- 领取人：Lee
- 领取时间：2026-06-23
- 状态：待验收
- 预计完成：2026-06-23
- 允许修改文件：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T186-hulebu-meta-progression-and-run-archetype-plan.md`, `docs/tasks/claims/T186-lee.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/superpowers/plans/2026-06-23-hulebu-meta-progression-and-run-archetype-selection.md`, `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`, `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`, `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`, `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`, `apps/web/public/games/hulebu-demo/index.html`, `packages/shared/src/mahjong-config-playable-prototype.test.ts`, `docs/modules/mahjong-roguelike/README.md`, `docs/modules/mahjong-roguelike/PROGRESS.md`, `docs/modules/mahjong-roguelike/HANDOFF.md`, `docs/progress/2026-06-23-lee.md`
- 禁止修改文件：`apps/game/mahjong-roguelike/cocos/**`, `apps/game/mahjong-roguelike/config/**`, `apps/web/prisma/**`, `apps/web/src/lib/ai/**`, `apps/web/src/modules/tools/**`, `deploy/**`
- 验证命令：`npm run test -w apps/web -- hulebu`; `npm run test -w packages/shared -- mahjong-config-playable-prototype`; 源原型与站内静态副本内联脚本 `node --check`; `npm run typecheck -w apps/web`; `npm run build -w apps/web`; `npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T186-hulebu-meta-progression-and-run-archetype-plan.md docs/tasks/claims/T186-lee.md docs/superpowers/plans/2026-06-23-hulebu-meta-progression-and-run-archetype-selection.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-23-lee.md`; `git diff --check`
- 当前阻塞：无
- 完成摘要：已完成方向重构规划，并已按计划落地局内流派主轴、局外偏好轻协同。当前已补前 20 关引导式流派解锁和 20 关后自由选择口径；内层奖励池已进一步收口为本局流派主导，局外基础偏好池不再拼入后段路线 bias；事件池也只保留一个局外偏好轻协同事件，终章 Boss 展示本局流派标签。最终术语扫尾已完成，外层候选改为 `自动偏好`，内层 Boss 阶段目标改为 `本局流派主骨`，当前进入待验收。
