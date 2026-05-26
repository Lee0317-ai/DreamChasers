# T051：胡了卜麻将牌面 UI 参考图

- 领取人：Codex / 开发 B
- 领取时间：2026-05-23
- 状态：待验收
- 预计完成：2026-05-24
- 允许修改文件：`output/imagegen/**`, `docs/modules/mahjong-roguelike/**`, `docs/tasks/CHANGE_INTAKE.md`, `docs/tasks/items/T051-hulebu-tile-ui-references.md`, `docs/tasks/claims/T051-codex.md`, `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-05-23.md`
- 禁止修改文件：`apps/web/**`, `packages/shared/**`, `apps/game/mahjong-roguelike/**`, `apps/web/src/components/portal-data.ts`, `package.json`, `package-lock.json`, `docker-compose.yml`, `docker-compose.prod.yml`, `deploy/**`
- 依赖任务：T050
- 验证命令：`npm run docs:sync`; `git diff --check`; 人工查看生成图片
- 当前风险：AI 生成图只作为风格参考；后续已改为单张审核流，需逐张确认后再继续生成下一张。
- 当前阻塞：无。
- 备注：已生成 3 张参考 sheet、准确版 v2-v8、完整青瓷风牌面总览图、条子 `1-9` 青瓷风校正版预览图，以及单张审核流的 `1条 / 2条 / 3条 / 4条 / 5条 / 6条 / 7条 / 9条` 单牌；`8条` 使用用户确认的 `hulebu-eight-bamboo-celadon-candidate-2.png` 基准稿；筒子已生成 `1筒 / 2筒 / 3筒 / 4筒 / 5筒 / 6筒 / 7筒 / 8筒 / 9筒`；万子已生成 `1万 / 7万 / 8万 / 9万`；字牌已生成完整预览图 `北 / 白板 / 南 / 中 / 發 / 東 / 西`：`output/imagegen/hulebu-honor-tiles-celadon-reference-v1.png`，先供风格和牌面确认，不接入工程。
