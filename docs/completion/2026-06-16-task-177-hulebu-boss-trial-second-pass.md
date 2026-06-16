# T177 胡了卜 Boss 试炼第二版完成记录

- 任务编号：T177
- 负责人：Lee
- 完成时间：2026-06-16
- 状态：待验收

## 修改文件

- `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`
- `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`
- `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- `apps/web/public/games/hulebu-demo/index.html`
- `packages/shared/src/mahjong-config-playable-prototype.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T177-hulebu-boss-trial-second-pass.md`
- `docs/tasks/claims/T177-lee.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`
- `docs/superpowers/specs/2026-06-16-hulebu-boss-trial-second-pass-design.md`
- `docs/superpowers/plans/2026-06-16-hulebu-boss-trial-second-pass.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/modules/mahjong-roguelike/DECISIONS.md`
- `docs/modules/mahjong-roguelike/IMPLEMENTATION_PLAN.md`
- `docs/progress/2026-06-16-lee.md`

## 实现内容

- 新增 `BOSS_TRIAL_PHASES`，为 Boss 显示 `起势 / 压桌 / 收官` 阶段目标。
- 新增 `BOSS_TRIAL_VARIANTS`，区分中段试炼、终局 Boss、高阶 Boss 变体和无尽 Boss 变体。
- Boss 面板新增 `阶段目标` 和 `Boss 奖励品质`。
- 通关和失败 shell message 新增 `bossReview` payload。
- `/games/hulebu` 外层结算页新增 `Boss 复盘` 卡片，并兼容旧本地存档。
- 站内静态 Demo 已同步。

## 验证命令

- `npm run test -w apps/web -- hulebu`
- `npm run test -w packages/shared -- mahjong-config-playable-prototype`
- `npm run typecheck -w apps/web`
- `npm run build -w apps/web`
- `perl -0ne 'print $1 if /<script>([\\s\\S]*?)<\\/script>/' apps/game/mahjong-roguelike/prototypes/config-playable/index.html > /tmp/hulebu-config-playable-inline.js && node --check /tmp/hulebu-config-playable-inline.js`
- `perl -0ne 'print $1 if /<script>([\\s\\S]*?)<\\/script>/' apps/web/public/games/hulebu-demo/index.html > /tmp/hulebu-static-inline.js && node --check /tmp/hulebu-static-inline.js`
- `npm run docs:sync`
- `git diff --check`
- 内置浏览器桌面端和 390px 移动端检查高阶 Boss。

## 验证结果

- Web 测试通过：1 个测试文件，3 个测试通过。
- Shared 测试通过：1 个测试文件，15 个测试通过。
- `apps/web` 类型检查通过。
- `apps/web` 生产构建通过。
- 源原型和站内静态副本内联脚本语法检查通过。
- 桌面端高阶 Boss 可见 `Boss 奖励品质 / 阶段目标 / 高阶 Boss 变体`，且不显示普通教程目标。
- 390px 移动端高阶 Boss 可见同样文案，页面级 `scrollWidth` 等于 390，无横向溢出。

## 遗留问题

- T177 不做特殊事件池第二版、成就图鉴扩容、无尽/每日深度化、路线奖励和局外能力深化或 Web 数值冻结。
- Cocos 正式表现层、音乐、美术、动效和发布资源仍按 T175 路线后置。
