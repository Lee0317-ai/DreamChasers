# T180 完成记录 - 胡了卜无尽和每日深度化

- 任务编号：T180
- 负责人：Lee
- 完成日期：2026-06-16

## 修改文件

- `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- `apps/web/public/games/hulebu-demo/index.html`
- `apps/web/src/modules/games/hulebu/HulebuGamePage.tsx`
- `apps/web/src/modules/games/hulebu/__tests__/hulebu-publish.test.ts`
- `packages/shared/src/mahjong-config-playable-prototype.test.ts`
- `docs/tasks/items/T180-hulebu-endless-daily-depth.md`
- `docs/tasks/claims/T180-lee.md`
- `docs/superpowers/specs/2026-06-16-hulebu-endless-daily-depth-design.md`
- `docs/superpowers/plans/2026-06-16-hulebu-endless-daily-depth.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-16-lee.md`

## 实现内容

- 为 HTML 原型新增 `getEndlessChapterProfile()`，让无尽第 21 层后按每 5 层一个章节推进，并在章节尾部挂 `章节 Boss` 主题摘要。
- 为 HTML 原型新增 `getDailyMutatorProfile()`，让每日牌局补上 `今日词缀 / 今日奖励 / 连续参与` 三个深度化信号。
- 扩展 shell payload，把 `endlessChapterLabel / endlessChapterBoss / dailyMutatorLabel / dailyRewardLabel / dailyStreak` 同步给 `/games/hulebu` 外层壳层。
- 更新 `/games/hulebu` 局外页和结算页：无尽面板显示 `当前章节 / 章节 Boss / 无尽最高`，每日面板显示 `今日词缀 / 今日奖励 / 连续参与 / 今日最佳`。
- 同步站内静态 Demo，并保持 `/games/hulebu-demo/config/*.json` 的绝对资源路径。

## 验证命令

- `npm run test -w packages/shared -- mahjong-config-playable-prototype`
- `npm run test -w apps/web -- hulebu`
- `npm run typecheck -w apps/web`
- `npm run build -w apps/web`
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- 上述命令均已通过。

## 遗留问题

- 仍未进入 T181 路线奖励和局外能力深化。
- 内置浏览器这轮没有形成新的截图留档，但测试、构建和页面字符串检查已覆盖核心改动。
