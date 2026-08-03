# T051：胡了卜麻将牌面 UI 参考图

- 领取人：Codex / 开发 B
- 领取时间：2026-05-23
- 状态：已完成
- 预计完成：2026-05-24
- 允许修改文件：`output/imagegen/**`, `output/hulebu-ui-assets/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T051-hulebu-tile-ui-references.md`, `docs/tasks/claims/T051-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`, `docs/progress/2026-06-21-lee.md`, `docs/completion/2026-06-21-task-051-hulebu-tile-ui-references.md`
- 禁止修改文件：`apps/web/**`, `packages/shared/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/components/portal-data.ts`, `package.json`, `package-lock.json`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`
- 依赖任务：T050
- 验证命令：`npm run docs:sync`; `git diff --check`; 人工查看生成图片
- 当前风险：无；v5 / v6 为中间诊断输出，正式交付以已验收的 v7 清底融合版为准。
- 当前阻塞：无。
- 备注：已生成 3 张参考 sheet、准确版 v2-v8、完整青瓷风牌面总览图、单张审核流条子/筒子/万子/字牌参考，以及基于用户补入 master source sheet 的正式资源包。2026-06-21 用户确认 v7 清底融合版“可以”，当前交付目录为 `output/hulebu-ui-assets/hulebu-master-tile-pack-v7-clean-template-dots/`，包含 35 张基础牌、4 张状态覆盖层、manifest、crop-report、debug 源图和 contact sheet 预览；本任务不接入工程代码。
- 2026-06-21 用户反馈 `1-9筒 / 1-9条` 的绿底仍和其他牌不一致；已开始 v4 标准底板修正，目标是让筒/条共用同一底板并只转描符号，新的输出目录为 `output/hulebu-ui-assets/hulebu-master-tile-pack-v4-standard-body/`。
- 2026-06-21 v4 已完成生成和验证：`output/hulebu-ui-assets/hulebu-master-tile-pack-v4-standard-body/`；`1-9筒 / 1-9条` 已改为共用标准底板并通过 `--require-green-base --require-standard-body` 校验，当前推荐查看 `preview/contact-sheet.png` 和 `base/tile_dot_01.png`、`base/tile_bamboo_01.png`。
- 2026-06-21 用户反馈 `1-9筒` 仍有切上去的贴片感；已新增 v7 清底融合版 `output/hulebu-ui-assets/hulebu-master-tile-pack-v7-clean-template-dots/`，筒子使用严格颜色蒙版、羽化融合、底缘碎片清理和完整清洁标准底板，当前推荐查看 `preview/contact-sheet.png`、`base/tile_dot_01.png`、`base/tile_dot_09.png`。
- 2026-06-21 用户确认 v7 清底融合版“可以”，T051 按 `output/hulebu-ui-assets/hulebu-master-tile-pack-v7-clean-template-dots/` 验收完成；本任务未接入工程代码。
