# T165：胡了卜 Demo 完整体验版推进方案

- 完成时间：2026-06-13
- 负责人：Lee
- 任务编号：T165

## 修改文件

- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T165-hulebu-complete-experience-roadmap.md`
- `docs/tasks/claims/T165-lee.md`
- `docs/superpowers/specs/2026-06-13-hulebu-complete-experience-roadmap-design.md`
- `docs/superpowers/plans/2026-06-13-hulebu-complete-experience-roadmap.md`
- `docs/modules/mahjong-roguelike/README.md`
- `docs/modules/mahjong-roguelike/PROGRESS.md`
- `docs/modules/mahjong-roguelike/HANDOFF.md`
- `docs/progress/2026-06-13-lee.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`

## 实现内容

- 盘点当前 `/games/hulebu` Demo 已完成内容和完整游戏设计缺口。
- 明确完整体验版推进原则：先完整主线，再长期模式；HTML Demo 先验证，Cocos 正式版后续承接。
- 确认第一实现阶段聚焦 `20 关主线 + 局外升级壳 + 第 20 关 Boss`。
- 拆出后续路线：局外首页、铜钱资产、路线型奖励、无尽、每日、成就、高阶周目和 Cocos 追平。
- 新增 T165 任务分片、领取分片、设计规格和实施计划。

## 验证命令

- `npm run docs:sync`
- `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T165-hulebu-complete-experience-roadmap.md docs/tasks/claims/T165-lee.md docs/superpowers/specs/2026-06-13-hulebu-complete-experience-roadmap-design.md docs/superpowers/plans/2026-06-13-hulebu-complete-experience-roadmap.md docs/modules/mahjong-roguelike/README.md docs/modules/mahjong-roguelike/PROGRESS.md docs/modules/mahjong-roguelike/HANDOFF.md docs/progress/2026-06-13-lee.md docs/completion/2026-06-13-task-165-hulebu-complete-experience-roadmap.md`
- `git diff --check`

## 验证结果

- `npm run docs:sync` 通过。
- 占位符扫描无结果。
- `git diff --check` 通过。

## 遗留问题

- T165 只做路线规划，不改玩法代码。
- 下一步建议新增 T166：先把默认站内 Demo 扩到 20 关主线，并补第 20 关终章 Boss。

