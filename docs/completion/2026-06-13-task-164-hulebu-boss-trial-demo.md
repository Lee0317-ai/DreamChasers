# T164：胡了卜 Boss 试炼 Demo 第一版完成记录

- 任务编号：T164
- 负责人：Lee
- 完成日期：2026-06-13

## 修改文件

- `apps/game/mahjong-roguelike/prototypes/config-playable/index.html`
- `apps/web/public/games/hulebu-demo/index.html`
- `packages/shared/src/mahjong-config.test.ts`
- `packages/shared/src/mahjong-config-playable-prototype.test.ts`
- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T164-hulebu-boss-trial-demo.md`
- `docs/tasks/claims/T164-lee.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`
- `docs/superpowers/specs/2026-06-13-hulebu-boss-trial-demo-design.md`
- `docs/superpowers/plans/2026-06-13-hulebu-boss-trial-demo.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-13-lee.md`
- `docs/completion/2026-06-13-task-164-hulebu-boss-trial-demo.md`

## 实现内容

- 默认朋友试玩 Demo 第 10 关启用 `终局试炼`。
- 试炼目标为 `杠 1 / 胡 1 / 积分 180`，HUD 显示 `试炼 x/3`。
- 玩家页新增紧凑试炼目标条，避免目标详情藏在玩家页隐藏侧栏中。
- 清空牌山但试炼未达标时进入失败弹层，状态提示 `目标未完成`，详情列出缺口。
- 击破试炼后一次性发放 `试炼奖励 +180 铜钱`，重复结算不会重复发奖。
- 第 10 关密集牌山生成器承接试炼目标包，并启用起手窗口平衡，避免起手直接露出完整答案组。
- 同步站内静态 Demo `/games/hulebu-demo/index.html`。
- 移动端牌山宽度收敛到 `330px`，390px 视口下牌宽约 `37.5px`，卡槽与底部工具栏不重叠。

## 验证命令

- `npm run test -w packages/shared -- mahjong-config-playable-prototype`
- `npm run test -w packages/shared -- mahjong-config`
- `npm run test -w apps/web -- hulebu`
- HTML 内联脚本语法检查
- 右侧内置浏览器桌面端检查
- 右侧内置浏览器 390px 移动端检查
- `npm run docs:sync`
- `git diff --check`

## 验证结果

- `mahjong-config-playable-prototype`：通过。
- `mahjong-config`：通过。
- `apps/web hulebu`：通过。
- HTML 内联脚本语法检查：通过，源原型和站内静态副本均可解析。
- 桌面端浏览器检查：通过，第 10 关事件后进入 `终局试炼`，HUD 和目标条正常。
- 390px 移动端浏览器检查：通过，目标条可见，卡槽与底部工具栏间距约 `9.6px`，无重叠。

## 遗留问题

- 当前只做朋友 Demo 第 10 关 Boss 试炼第一版。
- 完整高阶周目、更多 Boss 主题、更多事件池和局外奖励需要后续另开任务。
