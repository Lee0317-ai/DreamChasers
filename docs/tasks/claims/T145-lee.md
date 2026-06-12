# T145：弹珠机福利玩法规划落档

- 任务编号：T145
- 领取人：Lee
- 领取时间：2026-06-08
- 状态：待验收
- 预计完成：2026-06-08
- 允许修改文件：`docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/NEXT_ID.md`, `docs/tasks/items/T145-marble-pachinko-reward-planning.md`, `docs/tasks/claims/T145-lee.md`, `docs/modules/marble-pachinko/**`, `docs/progress/2026-06-08-lee.md`, `docs/completion/2026-06-08-task-145-marble-pachinko-reward-planning.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`
- 禁止修改文件：`apps/**`, `packages/**`, `deploy/**`, `docker-compose.yml`, `docker-compose.prod.yml`, `package.json`, `package-lock.json`
- 验证命令：`npm run docs:sync`; `rg -n "T[B]D|T[O]DO|待[补]" docs/tasks/items/T145-marble-pachinko-reward-planning.md docs/tasks/claims/T145-lee.md docs/modules/marble-pachinko docs/progress/2026-06-08-lee.md docs/completion/2026-06-08-task-145-marble-pachinko-reward-planning.md`; `git diff --check`
- 当前阻塞：无
- 下一步：后续如要实现，先拆独立原型任务，并在实现前复核积分、概率奖励和活动规则合规边界。

## 文件范围

允许修改：

- `docs/tasks/CHANGE_INTAKE.md`
- `docs/tasks/NEXT_ID.md`
- `docs/tasks/items/T145-marble-pachinko-reward-planning.md`
- `docs/tasks/claims/T145-lee.md`
- `docs/modules/marble-pachinko/**`
- `docs/progress/2026-06-08-lee.md`
- `docs/completion/2026-06-08-task-145-marble-pachinko-reward-planning.md`
- `docs/tasks/TASK_BOARD.md`
- `docs/tasks/CLAIMS.md`
- `docs/status/CURRENT_STATUS.md`

禁止修改：

- `apps/**`
- `packages/**`
- `deploy/**`
- `docker-compose.yml`
- `docker-compose.prod.yml`
- `package.json`
- `package-lock.json`

## 备注

本任务只做玩法和商业边界记录，不进入应用代码实现。当前推荐方案是充值赠送或任务赠送 `playTickets`，奖励使用不可再次参与游戏的 `bonusCredits` 或纯游戏内奖励；不建议允许 `paidCredits` 随机倍率返还。
